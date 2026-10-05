import { NextRequest, NextResponse } from "next/server";
import { razorpayService } from "@/modules/payment/services/razorpay.service";
import { orderService } from "@/modules/order/services/order.service";
import { prisma } from "@/lib/prisma";
import { logAudit, logger } from "@/core/logger";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    // 1. Verify Webhook Signature
    const isValid = razorpayService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      logger.warn({ type: "INVALID_WEBHOOK_SIGNATURE", signature });
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "payment.captured" || event.event === "order.paid") {
      const paymentEntity = event.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      // Find matching order in DB
      const order = await prisma.order.findFirst({
        where: {
          payments: {
            some: { razorpayOrderId },
          },
        },
      });

      if (order && order.status === "PENDING_PAYMENT") {
        await orderService.verifyAndConfirmOrder(order.userId, {
          orderId: order.id,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature: signature,
        });

        logAudit("WEBHOOK_ORDER_CAPTURED", {
          orderId: order.id,
          razorpayPaymentId,
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    logger.error({ type: "WEBHOOK_PROCESSING_ERROR", error: err.message });
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
