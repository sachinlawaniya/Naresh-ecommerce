import { orderRepository, IOrderRepository } from "../repositories/order.repository";
import { addressRepository } from "@/modules/auth/repositories/address.repository";
import { productRepository } from "@/modules/catalog/repositories/product.repository";
import { stockReservationService } from "@/modules/inventory/services/stock-reservation.service";
import { gstEngineService } from "@/modules/gst/services/gst-engine.service";
import { razorpayService } from "@/modules/payment/services/razorpay.service";
import { CreateCheckoutOrderDto, VerifyPaymentDto } from "../dtos/order.dto";
import { NotFoundError, PaymentProcessingError } from "@/core/errors";
import { env } from "@/config/env";
import { logAudit } from "@/core/logger";

interface LineItemDetail {
  variantId: string;
  sku: string;
  productTitle: string;
  colorName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  hsnCode: string;
  gstRate: number;
}

export class OrderService {
  constructor(private orderRepo: IOrderRepository = orderRepository) {}

  private generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `ORD-${year}-${random}`;
  }

  async initiateCheckout(userId: string, dto: CreateCheckoutOrderDto) {
    const shippingAddress = await addressRepository.findById(dto.shippingAddressId);
    if (!shippingAddress || shippingAddress.userId !== userId) {
      throw new NotFoundError("Selected shipping address was not found");
    }

    const billingAddressId = dto.billingAddressId || dto.shippingAddressId;

    const lineItemDetails: LineItemDetail[] = [];
    const reservationItems: Array<{ variantId: string; quantity: number }> = [];

    for (const item of dto.items) {
      const product = await productRepository.findById(item.variantId);
      const variant = product?.variants.find((v) => v.id === item.variantId);

      if (!variant || !product) {
        throw new NotFoundError(`Variant with ID '${item.variantId}' is no longer available`);
      }

      const unitPrice = Number(variant.salePrice || variant.basePrice);
      lineItemDetails.push({
        variantId: variant.id,
        sku: variant.sku,
        productTitle: product.title,
        colorName: variant.colorName,
        size: variant.size,
        quantity: item.quantity,
        unitPrice,
        hsnCode: product.hsnCode || "61091000",
        gstRate: Number(product.gstRate || 5.0),
      });

      reservationItems.push({
        variantId: variant.id,
        quantity: item.quantity,
      });
    }

    // Atomically Lock Inventory
    await stockReservationService.reserveCheckoutItems(reservationItems);

    try {
      const taxResult = gstEngineService.calculateTaxes(
        lineItemDetails,
        shippingAddress.state
      );

      const orderNumber = this.generateOrderNumber();
      const grandTotalInPaise = Math.round(taxResult.grandTotal * 100);

      const rzOrder = await razorpayService.createOrder({
        amountInPaise: grandTotalInPaise,
        currency: "INR",
        receipt: orderNumber,
        notes: {
          orderNumber,
          userId,
          shippingState: shippingAddress.state,
        },
      });

      const order = await this.orderRepo.createOrderWithItems({
        orderNumber,
        userId,
        shippingAddressId: shippingAddress.id,
        billingAddressId,
        subTotal: taxResult.taxableAmount,
        discountTotal: 0,
        shippingTotal: 0,
        taxableAmount: taxResult.taxableAmount,
        cgstTotal: taxResult.cgstTotal,
        sgstTotal: taxResult.sgstTotal,
        igstTotal: taxResult.igstTotal,
        totalTax: taxResult.totalTax,
        grandTotal: taxResult.grandTotal,
        notes: dto.notes,
        items: taxResult.itemBreakdowns.map((b) => {
          const matched = lineItemDetails.find((l) => l.variantId === b.variantId)!;
          return {
            ...b,
            sku: matched.sku,
            productTitle: matched.productTitle,
            colorName: matched.colorName,
            size: matched.size,
          };
        }),
      });

      logAudit("CHECKOUT_INITIATED", {
        orderId: order.id,
        orderNumber,
        grandTotal: taxResult.grandTotal,
        userId,
      });

      return {
        orderId: order.id,
        orderNumber,
        razorpayOrderId: rzOrder.id,
        amount: taxResult.grandTotal,
        amountInPaise: grandTotalInPaise,
        currency: "INR",
        razorpayKeyId: env.RAZORPAY_KEY_ID,
      };
    } catch (err) {
      await stockReservationService.releaseCheckoutItems(reservationItems);
      throw err;
    }
  }

  async verifyAndConfirmOrder(userId: string, dto: VerifyPaymentDto) {
    const order = await this.orderRepo.findById(dto.orderId);
    if (!order || order.userId !== userId) {
      throw new NotFoundError("Order not found or unauthorized");
    }

    if (order.status === "CONFIRMED") {
      return order;
    }

    const isValid = razorpayService.verifyPaymentSignature({
      razorpayOrderId: dto.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId,
      razorpaySignature: dto.razorpaySignature,
    });

    if (!isValid) {
      throw new PaymentProcessingError("Cryptographic payment signature verification failed");
    }

    const items = order.items.map((i: any) => ({
      variantId: i.variantId,
      quantity: i.quantity,
    }));
    await stockReservationService.commitOrderFulfillment(items);

    const invoiceNumber = await gstEngineService.generateNextInvoiceNumber();

    const confirmedOrder = await this.orderRepo.markPaidAndIssueInvoice({
      orderId: order.id,
      razorpayOrderId: dto.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId,
      razorpaySignature: dto.razorpaySignature,
      invoiceNumber,
      sellerGstin: env.STORE_GSTIN,
      placeOfSupply: order.shippingAddress.state,
    });

    logAudit("ORDER_PAYMENT_CAPTURED_AND_CONFIRMED", {
      orderId: order.id,
      orderNumber: order.orderNumber,
      invoiceNumber,
      razorpayPaymentId: dto.razorpayPaymentId,
    });

    return confirmedOrder;
  }

  async getOrdersByUser(userId: string) {
    return this.orderRepo.findByUserId(userId);
  }

  async getOrderByNumber(orderNumber: string, userId: string) {
    const order = await this.orderRepo.findByOrderNumber(orderNumber);
    if (!order || order.userId !== userId) {
      throw new NotFoundError("Order not found");
    }
    return order;
  }
}

export const orderService = new OrderService();
