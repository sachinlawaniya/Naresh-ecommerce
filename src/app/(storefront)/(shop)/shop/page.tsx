import React from "react";
import { catalogService } from "@/modules/catalog/services/catalog.service";
import { ProductCard } from "@/components/storefront/product/ProductCard";
import Link from "next/link";
import { SlidersHorizontal, ArrowRight, Sparkles, Tag as TagIcon } from "lucide-react";

interface ShopPageProps {
  searchParams: Promise<{
    categorySlug?: string;
    collectionSlug?: string;
    minPrice?: string;
    maxPrice?: string;
    size?: string;
    color?: string;
    sort?: "newest" | "price_asc" | "price_desc" | "featured";
    search?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = Number(params.page || 1);

  let products: any[] = [];
  let total = 0;
  let categories: any[] = [];

  try {
    const [prodData, catData] = await Promise.all([
      catalogService.getProducts({
        page,
        limit: 24,
        categorySlug: params.categorySlug,
        collectionSlug: params.collectionSlug,
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        size: params.size,
        color: params.color,
        sort: params.sort || "newest",
        search: params.search,
      }),
      catalogService.getCategories(),
    ]);

    products = prodData.products;
    total = prodData.total;
    categories = catData;
  } catch (err) {
    console.error("Error loading shop catalog", err);
  }

  const activeCatTitle = params.categorySlug
    ? categories.find((c) => c.slug === params.categorySlug)?.name || params.categorySlug.replace("-", " ")
    : params.collectionSlug
      ? params.collectionSlug.replace("-", " ")
      : "All Clothing Collections";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 bg-[#fafaf8] text-[#121212]">
      
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#ebe6dd] border border-[#dfd8cb] p-8 sm:p-12 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#78716c] font-sans">
            COLLECTIONS '26 —
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#121212] capitalize">
            {activeCatTitle}
          </h1>
          <p className="text-[#57534e] text-xs sm:text-sm max-w-2xl leading-relaxed font-light">
            Curated selection of 280 GSM heavyweight oversized t-shirts, relaxed lowers, tailored trousers, and utility cargo pants with statutory GST compliance.
          </p>
        </div>
      </div>

      {/* 2. Category & Sort Filter Pills Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eae6df] pb-5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <Link
            href="/shop"
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition flex-shrink-0 ${
              !params.categorySlug && !params.collectionSlug
                ? "bg-[#121212] text-white shadow-sm"
                : "bg-[#f4f2ee] text-[#444444] hover:bg-[#eae6df] border border-[#e5e0d8]"
            }`}
          >
            All Pieces ({total})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?categorySlug=${cat.slug}`}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition flex-shrink-0 ${
                params.categorySlug === cat.slug
                  ? "bg-[#121212] text-white shadow-sm"
                  : "bg-[#f4f2ee] text-[#444444] hover:bg-[#eae6df] border border-[#e5e0d8]"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Sort Links */}
        <div className="flex items-center gap-2 text-xs text-[#666666] self-end sm:self-auto flex-shrink-0">
          <span className="text-[11px] uppercase tracking-wider font-semibold">Sort:</span>
          <Link
            href={`/shop?${new URLSearchParams({ ...params, sort: "newest" }).toString()}`}
            className={`px-3 py-1.5 rounded-full font-medium transition ${
              !params.sort || params.sort === "newest" ? "bg-[#121212] text-white" : "hover:text-black"
            }`}
          >
            Latest
          </Link>
          <Link
            href={`/shop?${new URLSearchParams({ ...params, sort: "price_asc" }).toString()}`}
            className={`px-3 py-1.5 rounded-full font-medium transition ${
              params.sort === "price_asc" ? "bg-[#121212] text-white" : "hover:text-black"
            }`}
          >
            Price: Low
          </Link>
          <Link
            href={`/shop?${new URLSearchParams({ ...params, sort: "price_desc" }).toString()}`}
            className={`px-3 py-1.5 rounded-full font-medium transition ${
              params.sort === "price_desc" ? "bg-[#121212] text-white" : "hover:text-black"
            }`}
          >
            Price: High
          </Link>
        </div>
      </div>

      {/* 3. Main Product Grid */}
      {products.length > 0 ? (
        <div className="space-y-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* 4. MID-CATALOG PROMO CTA */}
          <div className="rounded-3xl bg-[#ebe6dd] border border-[#dfd8cb] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#78716c] uppercase tracking-wider">
                <TagIcon className="w-3.5 h-3.5" />
                <span>FIRST PURCHASE PRIVILEGE</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#121212]">
                Apply Code WELCOME10 for 10% Instant Privilege
              </h3>
              <p className="text-xs text-[#57534e] max-w-lg font-light">
                Includes complimentary express air shipping across India on orders above ₹999 with genuine HSN statutory tax invoices.
              </p>
            </div>
            <Link
              href="/shop"
              className="px-8 py-4 bg-[#121212] hover:bg-black text-white rounded-full font-semibold text-xs uppercase tracking-wider transition shadow-sm flex-shrink-0"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="py-24 text-center space-y-4 rounded-3xl bg-white border border-[#eae6df]">
          <h3 className="text-xl font-bold text-[#121212]">
            No pieces match your selected filter
          </h3>
          <p className="text-xs text-[#78716c]">
            Explore our complete collection of T-Shirts, Lowers, Trousers, and Cargo Pants.
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-[#121212] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-black transition"
          >
            Clear Filters & View All
          </Link>
        </div>
      )}
    </div>
  );
}
