import React from "react";
import { notFound } from "next/navigation";
import { catalogService } from "@/modules/catalog/services/catalog.service";
import { ProductGallery } from "@/components/storefront/product/ProductGallery";
import { VariantSelector } from "@/components/storefront/product/VariantSelector";
import { ProductCard } from "@/components/storefront/product/ProductCard";
import { CuratedLookSection } from "@/components/storefront/product/CuratedLookSection";
import { ProductReviewsSection } from "@/components/storefront/product/ProductReviewsSection";
import Link from "next/link";
import { ChevronRight, Sparkles, ArrowRight } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product: any = null;
  let relatedProducts: any[] = [];
  try {
    product = await catalogService.getProductBySlug(slug);
    const relatedData = await catalogService.getProducts({
      page: 1,
      limit: 4,
      sort: "newest",
      categorySlug: product.category?.slug,
    });
    relatedProducts = relatedData.products.filter((p) => p.id !== product.id);
  } catch (err) {
    notFound();
  }

  // Flatten all images for gallery
  const allImages = product.variants ? product.variants.flatMap((v: any) => v.images) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 bg-[#fafaf8] text-[#121212]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#78716c] font-medium">
        <Link href="/" className="hover:text-black transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-black transition">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/shop?categorySlug=${product.category.slug}`}
              className="hover:text-black transition"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#121212] truncate max-w-xs font-semibold">{product.title}</span>
      </nav>

      {/* Main Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7">
          <ProductGallery images={allImages} title={product.title} />
        </div>

        {/* Right: Variant Matrix & Buy Box (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <VariantSelector product={product} />

          {/* Garment Story & Fit Specifications */}
          <div className="mt-8 space-y-4 pt-6 border-t border-[#eae6df]">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212]">
                Garment Story & Fit
              </h4>
              <p className="text-sm text-[#57534e] mt-2 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212]">
                Material & Statutory Compliance
              </h4>
              <ul className="text-xs text-[#57534e] space-y-2 list-disc pl-4 font-light">
                <li>Super Combed Compact 280 GSM French Terry Cotton</li>
                <li>Reactive Eco-Friendly Dyeing (Colorfast & Pre-shrunk)</li>
                <li>Statutory HSN: <span className="font-mono text-[#121212]">{product.hsnCode || "61091000"}</span> with {Number(product.gstRate)}% GST Inclusive</li>
                <li>Reinforced high-density twin-needle stitching at stress points</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Complete The Look Cross-Sell Bundle Section */}
      <CuratedLookSection currentProductTitle={product.title} />

      {/* Customer Reviews & UGC Feedback */}
      <ProductReviewsSection productTitle={product.title} />

      {/* Mid-Page Promotional CTA Banner */}
      <section className="rounded-3xl bg-[#ebe6dd] border border-[#dfd8cb] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[11px] font-bold text-[#78716c] uppercase tracking-widest flex items-center gap-1.5 justify-center md:justify-start">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LUXE VOGUE PRIVILEGE</span>
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#121212]">
            Upgrade Your Entire Rotation (Tees, Trousers & Lowers)
          </h3>
          <p className="text-xs text-[#57534e] max-w-xl font-light">
            Orders above ₹999 receive complimentary Express Priority Air Shipping, garment protection packaging, and instant B2B GST tax credit invoicing.
          </p>
        </div>
        <Link
          href="/shop"
          className="px-8 py-4 bg-[#121212] hover:bg-black text-white rounded-full font-semibold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2 flex-shrink-0"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex justify-between items-end border-b border-[#eae6df] pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#78716c]">
                You May Also Like
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#121212] mt-1">
                Complementary Styles
              </h3>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-[#121212] hover:text-black uppercase tracking-wider"
            >
              View Full Collection →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
