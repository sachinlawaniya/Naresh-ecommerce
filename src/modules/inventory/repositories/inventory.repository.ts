import { prisma } from "@/lib/prisma";
import { InventoryItem, Prisma } from "@prisma/client";
import { InventoryLockError, NotFoundError } from "@/core/errors";

export interface InventoryWithVariantDetails extends InventoryItem {
  variant: {
    sku: string;
    colorName: string;
    size: string;
    basePrice: Prisma.Decimal;
    product: {
      title: string;
      slug: string;
    };
  };
  warehouse: {
    name: string;
    code: string;
  };
}

export interface IInventoryRepository {
  findByVariantAndWarehouse(variantId: string, warehouseId: string): Promise<InventoryItem | null>;
  getTotalAvailableStock(variantId: string): Promise<number>;
  listInventory(params: {
    page: number;
    limit: number;
    warehouseId?: string;
    lowStockOnly?: boolean;
    search?: string;
  }): Promise<{ items: InventoryWithVariantDetails[]; total: number }>;
  adjustStock(
    variantId: string,
    warehouseId: string,
    adjustmentQty: number
  ): Promise<InventoryItem>;
  reserveStockBatch(items: Array<{ variantId: string; quantity: number }>): Promise<void>;
  releaseStockBatch(items: Array<{ variantId: string; quantity: number }>): Promise<void>;
  finalizeStockDeductionBatch(items: Array<{ variantId: string; quantity: number }>): Promise<void>;
}

export class InventoryRepository implements IInventoryRepository {
  async findByVariantAndWarehouse(variantId: string, warehouseId: string): Promise<InventoryItem | null> {
    return prisma.inventoryItem.findUnique({
      where: {
        variantId_warehouseId: {
          variantId,
          warehouseId,
        },
      },
    });
  }

  async getTotalAvailableStock(variantId: string): Promise<number> {
    const items = await prisma.inventoryItem.findMany({
      where: { variantId },
    });

    return items.reduce((acc, item) => acc + (item.quantityOnHand - item.quantityReserved), 0);
  }

  async listInventory(params: {
    page: number;
    limit: number;
    warehouseId?: string;
    lowStockOnly?: boolean;
    search?: string;
  }): Promise<{ items: InventoryWithVariantDetails[]; total: number }> {
    const { page, limit, warehouseId, lowStockOnly, search } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.InventoryItemWhereInput = {
      ...(warehouseId ? { warehouseId } : {}),
      ...(search
        ? {
            variant: {
              OR: [
                { sku: { contains: search, mode: "insensitive" } },
                { product: { title: { contains: search, mode: "insensitive" } } },
              ],
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.inventoryItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          variant: {
            select: {
              sku: true,
              colorName: true,
              size: true,
              basePrice: true,
              product: {
                select: {
                  title: true,
                  slug: true,
                },
              },
            },
          },
          warehouse: {
            select: {
              name: true,
              code: true,
            },
          },
        },
      }) as unknown as Promise<InventoryWithVariantDetails[]>,
      prisma.inventoryItem.count({ where }),
    ]);

    // Filter low stock if requested
    const filtered = lowStockOnly
      ? items.filter((item) => item.quantityOnHand - item.quantityReserved <= item.lowStockAlert)
      : items;

    return { items: filtered, total };
  }

  async adjustStock(
    variantId: string,
    warehouseId: string,
    adjustmentQty: number
  ): Promise<InventoryItem> {
    return prisma.inventoryItem.upsert({
      where: {
        variantId_warehouseId: {
          variantId,
          warehouseId,
        },
      },
      create: {
        variantId,
        warehouseId,
        quantityOnHand: Math.max(0, adjustmentQty),
        quantityReserved: 0,
      },
      update: {
        quantityOnHand: {
          increment: adjustmentQty,
        },
      },
    });
  }

  async reserveStockBatch(items: Array<{ variantId: string; quantity: number }>): Promise<void> {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        // Find default warehouse item or aggregate
        const invItem = await tx.inventoryItem.findFirst({
          where: { variantId: item.variantId },
        });

        if (!invItem) {
          throw new InventoryLockError(`No inventory record found for requested variant`);
        }

        const available = invItem.quantityOnHand - invItem.quantityReserved;
        if (available < item.quantity) {
          throw new InventoryLockError(
            `Insufficient stock available. Requested: ${item.quantity}, Available: ${available}`
          );
        }

        await tx.inventoryItem.update({
          where: { id: invItem.id },
          data: {
            quantityReserved: { increment: item.quantity },
          },
        });
      }
    });
  }

  async releaseStockBatch(items: Array<{ variantId: string; quantity: number }>): Promise<void> {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const invItem = await tx.inventoryItem.findFirst({
          where: { variantId: item.variantId },
        });

        if (invItem && invItem.quantityReserved >= item.quantity) {
          await tx.inventoryItem.update({
            where: { id: invItem.id },
            data: {
              quantityReserved: { decrement: item.quantity },
            },
          });
        }
      }
    });
  }

  async finalizeStockDeductionBatch(items: Array<{ variantId: string; quantity: number }>): Promise<void> {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const invItem = await tx.inventoryItem.findFirst({
          where: { variantId: item.variantId },
        });

        if (invItem) {
          await tx.inventoryItem.update({
            where: { id: invItem.id },
            data: {
              quantityOnHand: { decrement: item.quantity },
              quantityReserved: { decrement: Math.min(invItem.quantityReserved, item.quantity) },
            },
          });
        }
      }
    });
  }
}

export const inventoryRepository = new InventoryRepository();
