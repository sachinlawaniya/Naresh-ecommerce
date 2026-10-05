"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ShoppingBag, Check, ArrowRight, Shield, Truck, RotateCcw } from "lucide-react";
import { ProductWithDetails } from "@/modules/catalog/repositories/product.repository";
import { useCart } from "@/modules/order/context/cart-context";
import { useToast } from "@/components/storefront/ui/ToastProvider";
import { formatCurrency } from "@/lib/utils";

interface QuickViewModalProps {
  product: ProductWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  if (!isOpen || !product) return null;

  const colors = Array.from(
    new Map(
      product.variants.map((v) => [v.colorHex, { name: v.colorName, hex: v.colorHex }])
    ).values()
  );

  const [selectedColor, setSelectedColor] = useState(colors[0]?.hex || "");
  const availableSizes = product.variants
    .filter((v) => v.colorHex === selectedColor)
    .map((v) => v.size);

  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "");
  const [isAdded, setIsAdded] = useState(false);

  const activeVariant =
    product.variants.find((v) => v.colorHex === selectedColor && v.size === selectedSize) ||
    product.variants[0];

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
      imageUrl: activeVariant.images[0]?.url,
      quantity: 1,
      gstRate: Number(product.gstRate),
    });

    setIsAdded(true);
    showToast(
      "cart",
      "Added to Shopping Bag",
      `${product.title} (${activeVariant.colorName} / ${activeVariant.size})`,
      activeImage
    );

    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-[#eae6df] p-6 sm:p-8 text-[#121212] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#f5f2eb] text-[#57534e] hover:text-[#121212] hover:bg-[#eae6df] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Product Image */}
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#f0ebe1] border border-[#eae6df]">
            <img
              src={activeImage}
              alt={product.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80";
              }}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium text-[#121212] border border-[#eae6df] shadow-sm">
              SKU: {activeVariant.sku}
            </div>
          </div>

          {/* Product Details & Variant Controls */}
          <div className="space-y-5">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8c857b] font-semibold">
                {product.category?.name || "Collection"}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#121212] mt-1">
                {product.title}
              </h2>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-2xl font-bold text-[#121212]">
                  {formatCurrency(activePrice)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-[#8c857b] line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                )}
                {originalPrice && (
                  <span className="px-2 py-0.5 rounded-full bg-[#fce7e7] text-[#c92a2a] text-[11px] font-bold">
                    {Math.round(((originalPrice - activePrice) / originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#78716c] block mb-2">
                Color: <span className="text-[#121212] font-medium">{activeVariant.colorName}</span>
              </label>
              <div className="flex items-center gap-2.5">
                {colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => {
                      setSelectedColor(color.hex);
                      const newSizes = product.variants
                        .filter((v) => v.colorHex === color.hex)
                        .map((v) => v.size);
                      if (!newSizes.includes(selectedSize)) {
                        setSelectedSize(newSizes[0] || "");
                      }
                    }}
                    className={`w-7 h-7 rounded-full border transition flex items-center justify-center ${
                      selectedColor === color.hex
                        ? "border-[#121212] ring-2 ring-[#121212]/30 scale-110"
                        : "border-[#eae6df] hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.hex && (
                      <Check
                        className={`w-3.5 h-3.5 ${
                          color.hex.toLowerCase() === "#ffffff" ? "text-black" : "text-white"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#78716c] block mb-2">
                Size: <span className="text-[#121212] font-medium">{selectedSize}</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
                  const isAvailable = availableSizes.includes(size);
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 rounded-lg text-xs font-medium border transition ${
                        isSelected
                          ? "bg-[#121212] text-white border-[#121212]"
                          : isAvailable
                          ? "bg-white text-[#121212] border-[#eae6df] hover:border-[#121212]"
                          : "bg-[#f5f2eb] text-[#a8a29e] border-[#eae6df] cursor-not-allowed line-through"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Add CTA */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 px-6 rounded-full bg-[#121212] hover:bg-black text-white font-medium text-sm tracking-wider flex items-center justify-center gap-2 shadow-md transition transform active:scale-95"
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart — {formatCurrency(activePrice)}</span>
                  </>
                )}
              </button>

              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="w-full py-2.5 text-center text-xs text-[#78716c] hover:text-[#121212] font-medium flex items-center justify-center gap-1 group transition"
              >
                <span>View Full Details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </Link>
            </div>

            {/* Micro Trust Details */}
            <div className="pt-3 border-t border-[#eae6df] grid grid-cols-3 gap-2 text-center text-[10px] text-[#78716c]">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#121212]" />
                <span>Express Dispatch</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-[#121212]" />
                <span>7 Days Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#121212]" />
                <span>100% Authentic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
