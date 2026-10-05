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
      <div className="group relative flex flex-col rounded-2xl bg-white border border-[#eae6df] hover:border-[#d4ccbe] transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md">
        
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
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Top Wishlist Icon */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#444444] hover:text-black shadow-sm transition"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? "fill-rose-500 text-rose-500" : "stroke-[1.75]"
              }`}
            />
          </button>

          {/* Discount badge if on sale */}
          {discountPercent && (
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#fee2e2] text-[#dc2626] text-[10px] font-bold uppercase tracking-wider">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
          
          <div>
            {/* Title */}
            <h3 className="font-semibold text-sm text-[#121212] tracking-tight line-clamp-1 group-hover:text-[#444444] transition">
              <Link href={`/product/${product.slug}`}>{product.title}</Link>
            </h3>

            {/* Ratings */}
            <div className="flex items-center gap-1 mt-1 text-xs text-[#666666]">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-bold text-[#121212] text-[11px]">4.8</span>
              <span className="text-[11px] text-[#888888]">(120)</span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-base font-bold text-[#121212]">
                {formatCurrency(minSalePrice || minPrice)}
              </span>
              {minSalePrice && (
                <span className="text-xs text-[#888888] line-through">
                  {formatCurrency(minPrice)}
                </span>
              )}
              {discountPercent && (
                <span className="text-[11px] font-bold text-[#dc2626]">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Color Swatches */}
          {distinctColors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              {distinctColors.slice(0, 4).map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setActiveColor(color)}
                  className={`w-3.5 h-3.5 rounded-full border transition ${
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

          {/* Size Pills */}
          <div className="flex items-center gap-1 pt-1">
            {["S", "M", "L", "XL", "XXL"].map((sz) => (
              <button
                key={sz}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSize(sz);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
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
            className="w-full py-2.5 px-4 rounded-xl bg-[#121212] hover:bg-black text-white text-xs font-semibold tracking-wide transition shadow-sm"
          >
            Add to Cart
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
