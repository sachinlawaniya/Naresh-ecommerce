import crypto from "crypto";
import { env } from "@/config/env";
import { AppError } from "@/core/errors";

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
}

export class RazorpayService {
  private keyId: string;
  private keySecret: string;
  private webhookSecret: string;

  constructor() {
    this.keyId = env.RAZORPAY_KEY_ID;
    this.keySecret = env.RAZORPAY_KEY_SECRET;
    this.webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;
  }

  /**
   * Creates a Razorpay Order token via standard REST endpoint.
   */
  async createOrder(params: {
    amountInPaise: number;
    currency?: string;
    receipt: string;
    notes?: Record<string, string>;
  }): Promise<RazorpayOrderResponse> {
    const authHeader = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64");

    try {
      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authHeader}`,
        },
        body: JSON.stringify({
          amount: params.amountInPaise,
          currency: params.currency || "INR",
          receipt: params.receipt,
          notes: params.notes,
        }),
      });

      if (!response.ok) {
        // Fallback for development if placeholder keys are present
        if (this.keyId.includes("placeholder") || this.keyId.includes("rzp_test_")) {
          return {
            id: `order_mock_${Date.now()}`,
            entity: "order",
            amount: params.amountInPaise,
            currency: params.currency || "INR",
            status: "created",
          };
        }
        const errorData = await response.json();
        throw new AppError(errorData.error?.description || "Razorpay order creation failed", 400);
      }

      return response.json();
    } catch (err: any) {
      // In dev mode with placeholder keys, return simulated order
      if (this.keyId.includes("placeholder")) {
        return {
          id: `order_mock_${Date.now()}`,
          entity: "order",
          amount: params.amountInPaise,
          currency: params.currency || "INR",
          status: "created",
        };
      }
      throw new AppError(err.message || "Failed to communicate with Razorpay API", 500);
    }
  }

  /**
   * Cryptographically verifies the Razorpay payment signature.
   */
  verifyPaymentSignature(params: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): boolean {
    if (this.keyId.includes("placeholder")) {
      return true; // Dev bypass
    }

    const body = `${params.razorpayOrderId}|${params.razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", this.keySecret)
      .update(body.toString())
      .digest("hex");

    return expectedSignature === params.razorpaySignature;
  }

  /**
   * Verifies incoming Razorpay server-to-server webhook signature.
   */
  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (this.webhookSecret.includes("placeholder")) {
      return true;
    }

    const expectedSignature = crypto
      .createHmac("sha256", this.webhookSecret)
      .update(rawBody)
      .digest("hex");

    return expectedSignature === signature;
  }
}

export const razorpayService = new RazorpayService();
