import { prisma } from "@/lib/prisma";
import { Order, OrderStatus, PaymentStatus, PaymentMethod, Prisma } from "@prisma/client";

export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: true;
    shippingAddress: true;
    billingAddress: true;
    invoice: true;
    payments: true;
  };
}>;

export interface IOrderRepository {
  findById(id: string): Promise<OrderWithRelations | null>;
  findByOrderNumber(orderNumber: string): Promise<OrderWithRelations | null>;
  findByUserId(userId: string): Promise<OrderWithRelations[]>;
  createOrderWithItems(data: {
    orderNumber: string;
    userId: string;
    shippingAddressId: string;
    billingAddressId: string;
    couponId?: string;
    subTotal: number;
    discountTotal: number;
    shippingTotal: number;
    taxableAmount: number;
    cgstTotal: number;
    sgstTotal: number;
    igstTotal: number;
    totalTax: number;
    grandTotal: number;
    notes?: string;
    items: Array<{
      variantId: string;
      sku: string;
      productTitle: string;
      colorName: string;
      size: string;
      quantity: number;
      unitPrice: number;
      hsnCode: string;
      gstRate: number;
      cgstAmount: number;
      sgstAmount: number;
      igstAmount: number;
      totalTax: number;
      totalAmount: number;
    }>;
  }): Promise<Order>;
  markPaidAndIssueInvoice(params: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    invoiceNumber: string;
    sellerGstin: string;
    placeOfSupply: string;
  }): Promise<Order>;
}

export class OrderRepository implements IOrderRepository {
  async findById(id: string): Promise<OrderWithRelations | null> {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
        invoice: true,
        payments: true,
      },
    });
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderWithRelations | null> {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
        invoice: true,
        payments: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<OrderWithRelations[]> {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
        invoice: true,
        payments: true,
      },
    });
  }

  async createOrderWithItems(data: any): Promise<Order> {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber: data.orderNumber,
          userId: data.userId,
          shippingAddressId: data.shippingAddressId,
          billingAddressId: data.billingAddressId,
          couponId: data.couponId,
          subTotal: data.subTotal,
          discountTotal: data.discountTotal,
          shippingTotal: data.shippingTotal,
          taxableAmount: data.taxableAmount,
          cgstTotal: data.cgstTotal,
          sgstTotal: data.sgstTotal,
          igstTotal: data.igstTotal,
          totalTax: data.totalTax,
          grandTotal: data.grandTotal,
          notes: data.notes,
          status: OrderStatus.PENDING_PAYMENT,
          items: {
            create: data.items.map((item: any) => ({
              variantId: item.variantId,
              sku: item.sku,
              productTitle: item.productTitle,
              colorName: item.colorName,
              size: item.size,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              hsnCode: item.hsnCode,
              gstRate: item.gstRate,
              cgstAmount: item.cgstAmount,
              sgstAmount: item.sgstAmount,
              igstAmount: item.igstAmount,
              totalTax: item.totalTax,
              totalAmount: item.totalAmount,
            })),
          },
        },
      });

      return order;
    });
  }

  async markPaidAndIssueInvoice(params: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    invoiceNumber: string;
    sellerGstin: string;
    placeOfSupply: string;
  }): Promise<Order> {
    return prisma.$transaction(async (tx) => {
      // 1. Update Order Status
      const order = await tx.order.update({
        where: { id: params.orderId },
        data: {
          status: OrderStatus.CONFIRMED,
        },
      });

      // 2. Insert Payment Record
      await tx.payment.create({
        data: {
          orderId: params.orderId,
          razorpayOrderId: params.razorpayOrderId,
          razorpayPaymentId: params.razorpayPaymentId,
          razorpaySignature: params.razorpaySignature,
          method: PaymentMethod.RAZORPAY_UPI,
          status: PaymentStatus.CAPTURED,
          amount: order.grandTotal,
          currency: "INR",
        },
      });

      // 3. Issue GST Tax Invoice
      await tx.invoice.create({
        data: {
          invoiceNumber: params.invoiceNumber,
          orderId: params.orderId,
          sellerGstin: params.sellerGstin,
          placeOfSupply: params.placeOfSupply,
        },
      });

      return order;
    });
  }
}

export const orderRepository = new OrderRepository();
