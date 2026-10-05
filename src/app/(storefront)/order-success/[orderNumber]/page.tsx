import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, ShoppingBag, Truck } from "lucide-react";
import { notFound } from "next/navigation";

interface OrderSuccessProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessProps) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      shippingAddress: true,
      invoice: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#eae6df] shadow-lg text-center space-y-8">
        
        {/* Success Icon & Header */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#121212] tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-sm text-[#78716c] max-w-md mx-auto font-light">
            Thank you for your order. We've received your payment and our logistics team is preparing your package.
          </p>
        </div>

        {/* Order & Tax Invoice Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#f5f2eb] border border-[#e5e0d8] text-left text-xs">
          <div>
            <span className="text-[#78716c] font-medium">Order Reference</span>
            <p className="font-mono font-bold text-[#121212] mt-0.5">{order.orderNumber}</p>
          </div>
          <div>
            <span className="text-[#78716c] font-medium">Tax Invoice No.</span>
            <p className="font-mono font-bold text-emerald-700 mt-0.5">
              {order.invoice?.invoiceNumber || "Generated"}
            </p>
          </div>
          <div>
            <span className="text-[#78716c] font-medium">Total Paid (INR)</span>
            <p className="font-bold text-[#121212] mt-0.5">
              {formatCurrency(Number(order.grandTotal))}
            </p>
          </div>
          <div>
            <span className="text-[#78716c] font-medium">Payment Status</span>
            <p className="font-bold text-emerald-700 mt-0.5 uppercase">Captured</p>
          </div>
        </div>

        {/* Itemized Breakdown Table */}
        <div className="text-left space-y-3">
          <h3 className="font-serif font-bold text-base text-[#121212]">
            Purchased Items
          </h3>
          <div className="border border-[#eae6df] rounded-2xl overflow-hidden divide-y divide-[#eae6df]">
            {order.items.map((item) => (
              <div key={item.id} className="p-4 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-medium text-[#121212] text-sm">{item.productTitle}</h4>
                  <span className="text-[#8c857b] font-light">
                    SKU: {item.sku} • {item.colorName} / {item.size} • Qty: {item.quantity} • HSN: {item.hsnCode}
                  </span>
                </div>
                <span className="font-bold text-[#121212] text-sm">
                  {formatCurrency(Number(item.totalAmount))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* GST & Financial Summary */}
        <div className="p-5 rounded-2xl bg-[#f5f2eb] border border-[#e5e0d8] text-left text-xs space-y-2">
          <div className="flex justify-between text-[#57534e]">
            <span>Taxable Amount (Base)</span>
            <span>{formatCurrency(Number(order.taxableAmount))}</span>
          </div>
          {Number(order.cgstTotal) > 0 && (
            <div className="flex justify-between text-[#57534e]">
              <span>CGST (Intrastate)</span>
              <span>{formatCurrency(Number(order.cgstTotal))}</span>
            </div>
          )}
          {Number(order.sgstTotal) > 0 && (
            <div className="flex justify-between text-[#57534e]">
              <span>SGST (Intrastate)</span>
              <span>{formatCurrency(Number(order.sgstTotal))}</span>
            </div>
          )}
          {Number(order.igstTotal) > 0 && (
            <div className="flex justify-between text-[#57534e]">
              <span>IGST (Interstate Supply)</span>
              <span>{formatCurrency(Number(order.igstTotal))}</span>
            </div>
          )}
          <div className="pt-2 border-t border-[#eae6df] flex justify-between font-serif font-bold text-base text-[#121212]">
            <span>Grand Total</span>
            <span>{formatCurrency(Number(order.grandTotal))}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#121212] text-white hover:bg-black rounded-full font-medium text-sm transition flex items-center justify-center gap-2 shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>

          <Link
            href="/account/orders"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#f5f2eb] text-[#121212] hover:bg-[#eae6df] border border-[#e5e0d8] rounded-full font-medium text-sm transition flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
