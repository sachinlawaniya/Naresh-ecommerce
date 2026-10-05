"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/modules/order/context/cart-context";
import { formatCurrency } from "@/lib/utils";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useToast } from "@/components/storefront/ui/ToastProvider";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subTotal,
    taxTotal,
    grandTotal,
    totalItemsCount,
  } = useCart();

  const { showToast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - grandTotal);
  const freeShippingProgress = Math.min(100, (grandTotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "WELCOME10") {
      setAppliedCoupon("WELCOME10");
      showToast("success", "VIP Code Applied", "10% Discount will be calculated at checkout!");
    } else {
      showToast("error", "Invalid Code", "Please check the voucher code and try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#eae6df] text-[#121212] animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-[#eae6df] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#121212]" />
              <h2 className="text-base font-bold text-[#121212] tracking-tight">
                Shopping Bag ({totalItemsCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full text-[#666666] hover:text-black hover:bg-[#f4f2ee] transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {items.length > 0 && (
            <div className="px-6 py-3 bg-[#f7f5f0] border-b border-[#eae6df]">
              <div className="flex items-center justify-between text-xs font-medium mb-1.5 text-[#57534e]">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#121212]" />
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-bold">Free Shipping Unlocked!</span>
                  ) : (
                    <span>Add {formatCurrency(remainingForFreeShipping)} for <strong>Free Delivery</strong></span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-[#121212]">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#e5e0d8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#121212] rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#f4f2ee] flex items-center justify-center text-[#888888]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#121212]">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[#78716c] mt-1 max-w-xs font-light">
                    Explore our curated collection of t-shirts, lowers, and tailored trousers.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="px-6 py-3 bg-[#121212] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-black transition"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 rounded-2xl border border-[#eae6df] bg-white"
                >
                  {/* Thumbnail */}
                  <div className="w-18 h-22 rounded-xl bg-[#f4f2ee] flex-shrink-0 overflow-hidden border border-[#eae6df]">
                    <img
                      src={item.imageUrl}
                      alt={item.productTitle}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-[#121212] line-clamp-1">
                          {item.productTitle}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#888888] hover:text-rose-600 transition ml-2 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#78716c]">
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full inline-block border border-[#d4ccbe]"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          {item.colorName}
                        </span>
                        <span>•</span>
                        <span className="text-[#121212] font-semibold">Size {item.size}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#eae6df] rounded-lg bg-[#f9f8f6]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#ede8e0] text-[#555555]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#121212]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#ede8e0] text-[#555555]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-bold text-[#121212]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Coupon Box & GST Breakdown */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#eae6df] bg-[#fafaf8] space-y-4">
              {/* Coupon Box */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (WELCOME10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-white border border-[#d8d0c2] rounded-full px-4 py-2.5 text-xs text-[#121212] uppercase placeholder:normal-case placeholder:text-[#888888] focus:outline-none focus:border-black font-mono"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-5 py-2.5 bg-[#121212] hover:bg-black text-white rounded-full text-xs font-semibold uppercase transition"
                >
                  Apply
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#57534e]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#121212]">{formatCurrency(subTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Statutory GST (Included)</span>
                  <span className="font-semibold text-[#121212]">{formatCurrency(taxTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-emerald-700 uppercase text-[11px]">
                    {remainingForFreeShipping === 0 ? "Free" : "₹99"}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#eae6df] flex justify-between text-base font-bold text-[#121212]">
                  <span>Total</span>
                  <span className="text-base font-black">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3.5 px-4 bg-[#121212] hover:bg-black text-white rounded-full font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
