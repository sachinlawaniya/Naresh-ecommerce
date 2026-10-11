"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ProductWithDetails } from "@/modules/catalog/repositories/product.repository";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { QuickViewModal } from "./QuickViewModal";
import { useCart } from "@/modules/order/context/cart-context";
import { useToast } from "@/components/storefront/ui/ToastProvider";

interface ProductCardProps {
  product: ProductWithDetails;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  // Extract distinct colors from variants
  const distinctColors = Array.from(
    new Map(
      product.variants.map((v) => [
        v.colorHex,
        {
          name: v.colorName,
          hex: v.colorHex,
          primaryImage: v.images[0]?.url,
          secondaryImage: v.images[1]?.url || v.images[0]?.url,
        },
      ])
    ).values()
  );

  const [activeColor, setActiveColor] = useState(distinctColors[0]);
  const [activeSize, setActiveSize] = useState<string>("M");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Price calculations
  const basePrices = product.variants.map((v) => Number(v.basePrice));
  const minPrice = Math.min(...basePrices);
  const salePrices = product.variants
    .map((v) => (v.salePrice ? Number(v.salePrice) : null))
    .filter(Boolean) as number[];
  const minSalePrice = salePrices.length > 0 ? Math.min(...salePrices) : null;
  const discountPercent = minSalePrice
    ? Math.round(((minPrice - minSalePrice) / minPrice) * 100)
    : null;

  // Active Images
  const primaryImg =
    activeColor?.primaryImage ||
    product.variants[0]?.images[0]?.url ||
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80";

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    showToast(
      "info",
      !isWishlisted ? "Saved to Wishlist" : "Removed from Wishlist",
      `${product.title} has been updated in your wishlist.`
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const targetVariant =
      product.variants.find(
        (v) => (activeColor ? v.colorHex === activeColor.hex : true) && v.size === activeSize
      ) || product.variants[0];

    if (!targetVariant) return;

    addItem({
      id: targetVariant.id,
      productId: product.id,
      productSlug: product.slug,
      productTitle: product.title,
      sku: targetVariant.sku,
      colorName: targetVariant.colorName,
      colorHex: targetVariant.colorHex,
      size: targetVariant.size,
      price: Number(targetVariant.salePrice || targetVariant.basePrice),
      imageUrl: targetVariant.images[0]?.url || primaryImg,
      quantity: 1,
      gstRate: Number(product.gstRate),
    });

    showToast(
      "cart",
      `Added to Cart`,
      `${product.title} (${targetVariant.colorName} • Size ${targetVariant.size})`,
      targetVariant.images[0]?.url || primaryImg
    );
  };

  return (
    <>
      <div className="card-3d group relative flex flex-col h-full rounded-2xl bg-white border border-[#eae6df] hover:border-[#121212]/20 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl">
        
        {/* Media Container */}
        <div className="relative aspect-[3/4] w-full bg-[#f4f2ee] overflow-hidden">
          <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
            <img
              src={primaryImg}
              alt={product.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80";
              }}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </Link>

          {/* Top Wishlist Icon */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white/90 hover:bg-white text-[#444444] hover:text-black shadow-sm transition-transform active:scale-90 hover:scale-110 z-10"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                isWishlisted ? "fill-rose-500 text-rose-500" : "stroke-[1.75]"
              }`}
            />
          </button>

          {/* Discount badge if on sale */}
          {discountPercent && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 sm:px-2 py-0.5 rounded sm:rounded-md bg-[#fee2e2] text-[#dc2626] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm z-10">
              {discountPercent}% OFF
            </div>
          )}

          {/* Quick View Button on Desktop Hover */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#121212] text-[11px] font-bold shadow-lg border border-black/5 hover:bg-black hover:text-white z-10"
          >
            Quick View
          </button>
        </div>

        {/* Product Details */}
        <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3 bg-white">
          
          <div className="space-y-1">
            {/* Title */}
            <h3 className="font-semibold text-xs sm:text-sm text-[#121212] tracking-tight line-clamp-1 group-hover:text-[#555555] transition">
              <Link href={`/product/${product.slug}`}>{product.title}</Link>
            </h3>

            {/* Ratings */}
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#666666]">
              <div className="flex items-center text-amber-500">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              </div>
              <span className="font-bold text-[#121212] text-[10px] sm:text-[11px]">4.8</span>
              <span className="text-[10px] sm:text-[11px] text-[#888888]">(120)</span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline flex-wrap gap-1 sm:gap-2 pt-0.5">
              <span className="text-xs sm:text-base font-bold text-[#121212]">
                {formatCurrency(minSalePrice || minPrice)}
              </span>
              {minSalePrice && (
                <span className="text-[10px] sm:text-xs text-[#888888] line-through">
                  {formatCurrency(minPrice)}
                </span>
              )}
              {discountPercent && (
                <span className="text-[9px] sm:text-[11px] font-bold text-[#dc2626]">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Color Swatches */}
          {distinctColors.length > 0 && (
            <div className="flex items-center gap-1 sm:gap-1.5 pt-0.5">
              {distinctColors.slice(0, 4).map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setActiveColor(color)}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border transition ${
                    activeColor?.hex === color.hex
                      ? "ring-2 ring-black border-white scale-110"
                      : "border-[#d4ccbe] opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          )}

          {/* Size Pills (visible on tablet/desktop, clean on mobile) */}
          <div className="hidden sm:flex items-center gap-1 pt-0.5 overflow-x-auto no-scrollbar">
            {["S", "M", "L", "XL", "XXL"].map((sz) => (
              <button
                key={sz}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSize(sz);
                }}
                className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase transition flex-shrink-0 ${
                  activeSize === sz
                    ? "bg-[#121212] text-white"
                    : "bg-[#f4f2ee] text-[#555555] hover:bg-[#eae6df]"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Add to Cart Black Button */}
          <button
            onClick={handleAddToCart}
            className="w-full py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl bg-[#121212] hover:bg-black active:scale-[0.98] text-white text-[11px] sm:text-xs font-semibold tracking-wide transition shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 mt-auto"
          >
            <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
