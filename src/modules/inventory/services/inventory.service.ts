import { inventoryRepository, IInventoryRepository } from "../repositories/inventory.repository";
import { warehouseRepository, IWarehouseRepository } from "../repositories/warehouse.repository";
import { InventoryAdjustDto, WarehouseCreateDto } from "../dtos/inventory.dto";
import { NotFoundError, ConflictError } from "@/core/errors";
import { logAudit } from "@/core/logger";

export class InventoryService {
  constructor(
    private inventoryRepo: IInventoryRepository = inventoryRepository,
    private warehouseRepo: IWarehouseRepository = warehouseRepository
  ) {}

  async listWarehouses() {
    return this.warehouseRepo.listAll();
  }

  async createWarehouse(dto: WarehouseCreateDto) {
    const existing = await this.warehouseRepo.findByCode(dto.code);
    if (existing) {
      throw new ConflictError(`Warehouse with code '${dto.code}' already exists`);
    }

    return this.warehouseRepo.create(dto);
  }

  async listInventory(params: {
    page: number;
    limit: number;
    warehouseId?: string;
    lowStockOnly?: boolean;
    search?: string;
  }) {
    return this.inventoryRepo.listInventory(params);
  }

  async adjustStock(dto: InventoryAdjustDto, operatorId?: string) {
    const warehouse = await this.warehouseRepo.findById(dto.warehouseId);
    if (!warehouse) {
      throw new NotFoundError("Warehouse not found");
    }

    const previousItem = await this.inventoryRepo.findByVariantAndWarehouse(
      dto.variantId,
      dto.warehouseId
    );

    const oldOnHand = previousItem?.quantityOnHand || 0;
    const updated = await this.inventoryRepo.adjustStock(
      dto.variantId,
      dto.warehouseId,
      dto.adjustmentQuantity
    );

    logAudit("INVENTORY_MANUALLY_ADJUSTED", {
      variantId: dto.variantId,
      warehouseId: dto.warehouseId,
      oldQuantityOnHand: oldOnHand,
      newQuantityOnHand: updated.quantityOnHand,
      adjustmentQuantity: dto.adjustmentQuantity,
      reason: dto.reason,
      notes: dto.notes,
      operatorId,
    });

    return updated;
  }
}

export const inventoryService = new InventoryService();
