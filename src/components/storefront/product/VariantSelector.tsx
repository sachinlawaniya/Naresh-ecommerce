"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductWithDetails } from "@/modules/catalog/repositories/product.repository";
import { useCart } from "@/modules/order/context/cart-context";
import { useToast } from "@/components/storefront/ui/ToastProvider";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
  Layers,
  FileText,
} from "lucide-react";
import { SizeRecommenderModal } from "./SizeRecommenderModal";

interface VariantSelectorProps {
  product: ProductWithDetails;
  onVariantChange?: (variantId: string) => void;
}

export function VariantSelector({ product, onVariantChange }: VariantSelectorProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { showToast } = useToast();

  // Distinct Colors
  const colors = Array.from(
    new Map(
      product.variants.map((v) => [v.colorHex, { name: v.colorName, hex: v.colorHex }])
    ).values()
  );

  const [selectedColor, setSelectedColor] = useState(colors[0]?.hex || "");

  // Sizes for selected color
  const availableSizesForColor = product.variants
    .filter((v) => v.colorHex === selectedColor)
    .map((v) => v.size);

  const [selectedSize, setSelectedSize] = useState(availableSizesForColor[0] || "M");
  const [quantity, setQuantity] = useState(1);
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Active Variant
  const activeVariant =
    product.variants.find(
      (v) => v.colorHex === selectedColor && v.size === selectedSize
    ) || product.variants[0];

  useEffect(() => {
    if (!availableSizesForColor.includes(selectedSize)) {
      setSelectedSize(availableSizesForColor[0] || "M");
    }
  }, [selectedColor]);

  useEffect(() => {
    if (activeVariant && onVariantChange) {
      onVariantChange(activeVariant.id);
    }
  }, [activeVariant]);

  // Scroll listener for sticky floating purchase bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activePrice = Number(activeVariant.salePrice || activeVariant.basePrice);
  const originalPrice = activeVariant.salePrice ? Number(activeVariant.basePrice) : null;
  const activeImage =
    activeVariant.images[0]?.url ||
    product.variants[0]?.images[0]?.url ||
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80";

  const handleAddToCart = () => {
    if (!activeVariant) return;

    addItem({
      id: activeVariant.id,
      productId: product.id,
      productSlug: product.slug,
      productTitle: product.title,
      sku: activeVariant.sku,
      colorName: activeVariant.colorName,
      colorHex: activeVariant.colorHex,
      size: activeVariant.size,
      price: activePrice,
      imageUrl: activeImage,
      quantity,
      gstRate: Number(product.gstRate),
    });

    setIsAddedAnimation(true);
    showToast(
      "cart",
      `Added to Cart (${quantity}x)`,
      `${product.title} • ${activeVariant.colorName} / ${activeVariant.size}`,
      activeImage
    );

    setTimeout(() => setIsAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="space-y-6 text-[#121212]">
      {/* Title, Category & Pricing */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#78716c]">
            {product.category?.name || "Clothing"}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#f4f2ee] text-[#555555] text-[10px] font-semibold border border-[#eae6df]">
            280 GSM Cotton
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#121212] tracking-tight mt-2">
          {product.title}
        </h1>

        <div className="flex items-baseline gap-3 mt-3">
          <span className="text-3xl sm:text-4xl font-bold text-[#121212]">
            {formatCurrency(activePrice)}
          </span>
          {originalPrice && (
            <span className="text-lg text-[#888888] line-through">
              {formatCurrency(originalPrice)}
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-full bg-[#fee2e2] text-[#dc2626] text-xs font-bold tracking-wide">
            {Number(product.gstRate)}% GST Inclusive
          </span>
        </div>

        {/* Real-Time Stock Urgency */}
        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#fef3c7] text-[#92400e] text-xs font-medium border border-[#fde68a]">
          <Flame className="w-4 h-4 text-amber-600 animate-pulse flex-shrink-0" />
          <span>High Demand: Only 4 pieces left in <strong>{activeVariant.colorName} / Size {selectedSize}</strong></span>
        </div>

        <div className="text-xs text-[#78716c] mt-2 font-mono flex items-center gap-3">
          <span>SKU: <strong className="text-[#121212]">{activeVariant.sku}</strong></span>
          {product.hsnCode && (
            <span>• HSN: <strong className="text-[#121212]">{product.hsnCode}</strong></span>
          )}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#121212]">
            Color: <span className="font-normal text-[#555555]">{activeVariant.colorName}</span>
          </label>
        </div>
        <div className="flex items-center gap-3">
          {colors.map((color) => (
            <button
              key={color.hex}
              onClick={() => setSelectedColor(color.hex)}
              className={`w-9 h-9 rounded-full border-2 transition flex items-center justify-center ${
                selectedColor === color.hex
                  ? "border-[#121212] ring-2 ring-black/20 scale-110 shadow-sm"
                  : "border-[#d4ccbe] hover:scale-105"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Select ${color.name}`}
            >
              {selectedColor === color.hex && (
                <Check
                  className={`w-4 h-4 ${
                    color.hex.toLowerCase() === "#ffffff" ? "text-[#121212]" : "text-white"
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection with AI Fit Finder */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#121212]">
            Select Size: <span className="font-normal text-[#555555]">{selectedSize}</span>
          </label>
          <button
            onClick={() => setIsSizeModalOpen(true)}
            className="text-xs text-[#121212] hover:underline font-semibold flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Size Guide</span>
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
          {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
            const isAvailable = availableSizesForColor.includes(size);
            const isSelected = selectedSize === size;

            return (
              <button
                key={size}
                disabled={!isAvailable}
                onClick={() => setSelectedSize(size)}
                className={`py-3 rounded-xl text-xs font-bold border transition ${
                  isSelected
                    ? "bg-[#121212] text-white border-[#121212] shadow-sm"
                    : isAvailable
                    ? "bg-white text-[#222222] border-[#eae6df] hover:border-black"
                    : "bg-[#f4f2ee] text-[#aaaaaa] border-[#eae6df] cursor-not-allowed line-through"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity & CTA Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center border border-[#eae6df] bg-white rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 rounded-lg bg-[#f4f2ee] text-[#121212] font-bold hover:bg-[#e8e4dc] flex items-center justify-center transition"
            >
              -
            </button>
            <span className="w-10 text-center text-xs font-bold text-[#121212]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-lg bg-[#f4f2ee] text-[#121212] font-bold hover:bg-[#e8e4dc] flex items-center justify-center transition"
            >
              +
            </button>
          </div>

          {/* Add to Bag Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3.5 px-6 rounded-xl bg-white hover:bg-[#f7f5f0] text-[#121212] border border-[#121212] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
          >
            {isAddedAnimation ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>

        {/* 1-Click Buy Now */}
        <button
          onClick={handleBuyNow}
          className="w-full py-4 px-6 rounded-xl bg-[#121212] hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition transform active:scale-[0.99]"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Express Buy Now — {formatCurrency(activePrice * quantity)}</span>
        </button>
      </div>

      {/* Trust & Guarantee Grid */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#f7f5f0] border border-[#eae6df] text-center">
        <div className="flex flex-col items-center gap-1 text-xs text-[#57534e]">
          <Truck className="w-4 h-4 text-[#121212]" />
          <span className="font-semibold text-[#121212]">Express Dispatch</span>
          <span className="text-[10px]">Free above ₹999</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-xs text-[#57534e]">
          <RotateCcw className="w-4 h-4 text-[#121212]" />
          <span className="font-semibold text-[#121212]">7-Day Returns</span>
          <span className="text-[10px]">Doorstep Pickup</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-xs text-[#57534e]">
          <Shield className="w-4 h-4 text-[#121212]" />
          <span className="font-semibold text-[#121212]">100% Tax Paid</span>
          <span className="text-[10px]">GST Invoice Included</span>
        </div>
      </div>

      {/* Accordion Specification Tabs */}
      <div className="pt-2 border-t border-[#eae6df] space-y-2">
        <div className="rounded-2xl border border-[#eae6df] bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#121212] uppercase tracking-wider mb-1.5">
            <Layers className="w-4 h-4" />
            Fabric & Craftsmanship Details
          </div>
          <p className="text-xs text-[#57534e] leading-relaxed font-light">
            Crafted from bespoke 280 GSM 100% Combed Ringspun Cotton. Pre-shrunk with silicon wash for an ultra-soft drape that retains structural form wash after wash. Reinforced twin-needle stitching at seams.
          </p>
        </div>

        <div className="rounded-2xl border border-[#eae6df] bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#121212] uppercase tracking-wider mb-1.5">
            <FileText className="w-4 h-4" />
            Statutory GST Billing Breakdown
          </div>
          <p className="text-xs text-[#57534e] leading-relaxed font-light">
            This item is invoiced under HSN Code {product.hsnCode || "61091000"} with {Number(product.gstRate)}% GST. Valid for B2B GST tax credit. Digital tax invoice generated instantly upon order confirmation.
          </p>
        </div>
      </div>

      {/* Size Recommender Modal */}
      <SizeRecommenderModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        onSelectSize={(sz) => setSelectedSize(sz)}
        categoryName={product.category?.name}
      />

      {/* Sticky Floating Bottom Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#eae6df] shadow-xl animate-in slide-in-from-bottom duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={activeImage}
                alt=""
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80";
                }}
                className="w-11 h-11 rounded-lg object-cover border border-[#eae6df] flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#121212] line-clamp-1">
                  {product.title}
                </p>
                <p className="text-[11px] text-[#78716c]">
                  {activeVariant.colorName} • Size {selectedSize} • {formatCurrency(activePrice)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleAddToCart}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-[#f4f2ee] text-[#121212] font-semibold text-xs border border-[#121212] transition"
              >
                Add to Bag
              </button>
              <button
                onClick={handleBuyNow}
                className="px-6 py-2.5 rounded-full bg-[#121212] hover:bg-black text-white font-semibold text-xs transition shadow-sm"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
