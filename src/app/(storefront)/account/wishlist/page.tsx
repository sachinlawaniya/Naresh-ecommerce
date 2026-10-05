"use client";

import React from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/modules/order/context/cart-context";
import { useToast } from "@/components/storefront/ui/ToastProvider";
import { Heart, ShoppingBag, Trash2, ArrowRight, ChevronRight } from "lucide-react";

export default function WishlistPage() {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [wishlistItems, setWishlistItems] = React.useState([
    {
      id: "w-1",
      productId: "prod-1",
      slug: "luxury-heavyweight-tshirt",
      title: "280 GSM Heavyweight Oversized Boxy T-Shirt",
      category: "T-Shirts",
      colorName: "Pitch Black",
      colorHex: "#000000",
      size: "L",
      price: 1499,
      originalPrice: 1999,
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
      sku: "TSH-BLK-L",
      gstRate: 5,
    },
    {
      id: "w-2",
      productId: "prod-2",
      slug: "tailored-pleated-trouser",
      title: "Tailored Pleated Relaxed Italian Trouser",
      category: "Trousers",
      colorName: "Charcoal Slate",
      colorHex: "#334155",
      size: "32",
      price: 2499,
      originalPrice: 2999,
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
      sku: "TRS-CHR-32",
      gstRate: 12,
    },
    {
      id: "w-3",
      productId: "prod-3",
      slug: "french-terry-cargo-lower",
      title: "Relaxed Heavy French Terry Cargo Lower",
      category: "Lowers & Pants",
      colorName: "Vintage Khaki",
      colorHex: "#c2b280",
      size: "M",
      price: 1899,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80",
      sku: "LOW-KHK-M",
      gstRate: 5,
    },
  ]);

  const handleMoveToCart = (item: (typeof wishlistItems)[0]) => {
    addItem({
      id: item.id,
      productId: item.productId,
      productSlug: item.slug,
      productTitle: item.title,
      sku: item.sku,
      colorName: item.colorName,
      colorHex: item.colorHex,
      size: item.size,
      price: item.price,
      imageUrl: item.image,
      quantity: 1,
      gstRate: item.gstRate,
    });

    setWishlistItems((prev) => prev.filter((i) => i.id !== item.id));
    showToast(
      "cart",
      "Moved to Bag",
      `${item.title} (${item.colorName} / ${item.size})`,
      item.image
    );
  };

  const handleRemove = (id: string) => {
    setWishlistItems((prev) => prev.filter((i) => i.id !== id));
    showToast("info", "Removed from Wishlist", "Item removed from your wishlist.");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#fafaf8] text-[#121212]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#78716c] font-medium">
        <Link href="/" className="hover:text-black transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#121212] font-semibold">My Saved Wishlist</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eae6df]">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#78716c] font-bold">
            Personal Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#121212] tracking-tight mt-1">
            Saved Wishlist ({wishlistItems.length})
          </h1>
          <p className="text-xs text-[#57534e] mt-1 font-light">
            Items saved for future shopping. Stock reservations apply upon bag addition.
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <button
            onClick={() => {
              wishlistItems.forEach((item) => handleMoveToCart(item));
            }}
            className="px-6 py-3 rounded-full bg-[#121212] hover:bg-black text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Move All to Bag</span>
          </button>
        )}
      </div>

      {/* Wishlist Grid */}
      {wishlistItems.length === 0 ? (
        <div className="py-20 text-center space-y-4 rounded-3xl bg-white border border-[#eae6df]">
          <div className="w-16 h-16 rounded-full bg-[#f4f2ee] flex items-center justify-center mx-auto text-[#78716c]">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#121212]">Your Wishlist is Empty</h3>
          <p className="text-xs text-[#57534e] max-w-sm mx-auto font-light">
            Explore our curated oversized tees, trousers, and lowers to save your favorite styles.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#121212] text-white rounded-full font-semibold text-xs uppercase tracking-wider hover:bg-black transition"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-[#eae6df] overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] bg-[#f4f2ee]">
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80";
                  }}
                  className="w-full h-full object-cover object-center"
                />
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#444444] hover:text-rose-600 shadow-sm transition"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-[#121212] text-[10px] font-semibold border border-[#eae6df]">
                  {item.category}
                </span>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <h3 className="font-semibold text-sm text-[#121212] tracking-tight line-clamp-1">
                    <Link href={`/product/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p className="text-xs text-[#78716c] mt-1">
                    {item.colorName} • Size {item.size} • SKU: {item.sku}
                  </p>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-[#f0ece4]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-[#121212]">
                      {formatCurrency(item.price)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-[#888888] line-through">
                        {formatCurrency(item.originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600">
                    Incl. GST
                  </span>
                </div>

                <button
                  onClick={() => handleMoveToCart(item)}
                  className="w-full py-3 px-4 rounded-xl bg-[#121212] hover:bg-black text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Move to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
