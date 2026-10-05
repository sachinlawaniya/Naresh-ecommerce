"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/modules/order/context/cart-context";
import { useToast } from "@/components/storefront/ui/ToastProvider";
import { Sparkles, Plus, Check, ShoppingBag } from "lucide-react";

interface CuratedLookSectionProps {
  currentProductTitle: string;
}

export function CuratedLookSection({ currentProductTitle }: CuratedLookSectionProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [isAdded, setIsAdded] = useState(false);

  const bundleItems = [
    {
      id: "curated-top-1",
      productId: "prod-top-1",
      productSlug: "luxury-heavyweight-tshirt",
      productTitle: "280 GSM Heavyweight Boxy Tee",
      colorName: "Pitch Black",
      colorHex: "#000000",
      size: "L",
      price: 1499,
      sku: "TSH-BLK-L",
      gstRate: 5,
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
    },
    {
      id: "curated-bottom-1",
      productId: "prod-bot-1",
      productSlug: "tailored-pleated-trouser",
      productTitle: "Pleated Relaxed Italian Trouser",
      colorName: "Charcoal Slate",
      colorHex: "#334155",
      size: "32",
      price: 2499,
      sku: "TRS-CHR-32",
      gstRate: 12,
      imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
    },
  ];

  const subtotal = bundleItems.reduce((acc, item) => acc + item.price, 0);
  const bundleDiscount = 600;
  const bundlePrice = subtotal - bundleDiscount;

  const handleAddBundle = () => {
    bundleItems.forEach((item) => {
      addItem({
        id: item.id,
        productId: item.productId,
        productSlug: item.productSlug,
        productTitle: item.productTitle,
        sku: item.sku,
        colorName: item.colorName,
        colorHex: item.colorHex,
        size: item.size,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1,
        gstRate: item.gstRate,
      });
    });

    setIsAdded(true);
    showToast(
      "cart",
      "Complete Look Added to Bag",
      "Both curated pieces added with 15% VIP bundle discount.",
      bundleItems[0].imageUrl
    );

    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <section className="my-16 rounded-3xl bg-[#f5f2eb] border border-[#e5e0d8] p-6 sm:p-10 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="max-w-md">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#121212] text-xs font-semibold tracking-wider uppercase mb-3 border border-[#eae6df] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#8c857b]" /> Curated By Stylists
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#121212] tracking-tight">
            Complete The Look
          </h2>
          <p className="text-sm text-[#57534e] mt-2 leading-relaxed font-light">
            Styled specifically to complement the <strong>{currentProductTitle}</strong>. Pair the heavyweight drop-shoulder upper with structured pleated bottoms for the signature relaxed aesthetic.
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-serif font-bold text-[#121212]">
              {formatCurrency(bundlePrice)}
            </span>
            <span className="text-base text-[#8c857b] line-through font-light">
              {formatCurrency(subtotal)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#fce7e7] text-[#c92a2a] text-xs font-semibold uppercase tracking-wider">
              Save {formatCurrency(bundleDiscount)} (15% Bundle)
            </span>
          </div>

          <div className="mt-6">
            <button
              onClick={handleAddBundle}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#121212] hover:bg-black text-white font-medium text-sm tracking-wider flex items-center justify-center gap-2.5 shadow-md transition transform active:scale-95"
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Curated Look Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add Entire Set to Bag</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bundle Product Cards */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {bundleItems.map((item, idx) => (
            <React.Fragment key={item.id}>
              <div className="w-full sm:w-56 rounded-2xl bg-white border border-[#eae6df] p-3 overflow-hidden flex flex-col gap-2 shadow-sm">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#f0ebe1]">
                  <img
                    src={item.imageUrl}
                    alt={item.productTitle}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80";
                    }}
                    className="w-full h-full object-cover object-center"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-white/90 text-[#121212] text-[10px] font-medium shadow-sm">
                    Size {item.size}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-xs text-[#121212] line-clamp-1">
                    {item.productTitle}
                  </h4>
                  <p className="text-xs font-bold text-[#121212] mt-0.5">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
              {idx === 0 && (
                <div className="hidden sm:flex w-8 h-8 rounded-full bg-white text-[#57534e] items-center justify-center border border-[#eae6df] shadow-sm flex-shrink-0">
                  <Plus className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
