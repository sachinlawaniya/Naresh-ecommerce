import { prisma } from "@/lib/prisma";
import { OrderStatus, Prisma } from "@prisma/client";
import { NotFoundError, ValidationError } from "@/core/errors";
import { logAudit } from "@/core/logger";
import { stockReservationService } from "@/modules/inventory/services/stock-reservation.service";

export class AdminOrderService {
  /**
   * Fetches high-level executive analytics and KPI numbers.
   */
  async getDashboardAnalytics() {
    const [totalOrders, confirmedOrders, lowStockCount, totalCustomers] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        where: {
          status: {
            notIn: [OrderStatus.PENDING_PAYMENT, OrderStatus.PAYMENT_FAILED, OrderStatus.CANCELLED],
          },
        },
        select: {
          grandTotal: true,
          totalTax: true,
          createdAt: true,
        },
      }),
      prisma.inventoryItem.count({
        where: {
          quantityOnHand: { lte: 5 },
        },
      }),
      prisma.user.count({
        where: { role: "CUSTOMER" },
      }),
    ]);

    const totalRevenue = confirmedOrders.reduce((sum, o) => sum + Number(o.grandTotal), 0);
    const totalTaxCollected = confirmedOrders.reduce((sum, o) => sum + Number(o.totalTax), 0);
    const averageOrderValue = confirmedOrders.length > 0 ? totalRevenue / confirmedOrders.length : 0;

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalTaxCollected: Number(totalTaxCollected.toFixed(2)),
      totalOrders,
      confirmedOrdersCount: confirmedOrders.length,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      lowStockCount,
      totalCustomers,
    };
  }

  /**
   * List paginated orders for admin pipeline.
   */
  async listOrders(params: {
    page: number;
    limit: number;
    status?: OrderStatus;
    search?: string;
  }) {
    const { page, limit, status, search } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { orderNumber: { contains: search, mode: "insensitive" } },
              { user: { email: { contains: search, mode: "insensitive" } } },
              { user: { firstName: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          shippingAddress: true,
          items: true,
          invoice: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total };
  }

  /**
   * Transitions order state in fulfillment lifecycle.
   */
  async updateOrderStatus(orderId: string, nextStatus: OrderStatus, operatorId?: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    const previousStatus = order.status;

    // Handle cancellation: return inventory to available pool
    if (nextStatus === OrderStatus.CANCELLED && previousStatus !== OrderStatus.CANCELLED) {
      const releaseItems = order.items.map((i) => ({
        variantId: i.variantId,
        quantity: i.quantity,
      }));
      await stockReservationService.releaseCheckoutItems(releaseItems);
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: nextStatus },
      include: {
        user: true,
        items: true,
        shippingAddress: true,
      },
    });

    logAudit("ORDER_STATUS_UPDATED", {
      orderId,
      orderNumber: order.orderNumber,
      previousStatus,
      newStatus: nextStatus,
      operatorId,
    });

    return updated;
  }
}

export const adminOrderService = new AdminOrderService();
