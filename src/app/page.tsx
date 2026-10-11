import React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/storefront/product/ProductCard";
import { ScrollAnimatedTee } from "@/components/storefront/home/ScrollAnimatedTee";
import { catalogService } from "@/modules/catalog/services/catalog.service";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Tag as TagIcon,
  Feather,
} from "lucide-react";

export default async function HomePage() {
  let products: any[] = [];
  try {
    const data = await catalogService.getProducts({
      page: 1,
      limit: 12,
      sort: "featured",
    });
    products = data.products;
  } catch (err) {
    console.error("Could not fetch products for homepage", err);
  }

  const categories = [
    {
      name: "Men",
      href: "/shop?categorySlug=men",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
    },
    {
      name: "Women",
      href: "/shop?categorySlug=women",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    },
    {
      name: "Oversized Tees",
      href: "/shop?categorySlug=t-shirts",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80",
    },
    {
      name: "Trousers & Joggers",
      href: "/shop?categorySlug=lowers",
      image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80",
    },
    {
      name: "Shirts",
      href: "/shop?categorySlug=trousers",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
    },
    {
      name: "Accessories",
      href: "/shop?categorySlug=pants",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
    },
  ];

  const freshDrops = [
    {
      id: "fd-1",
      title: "Graphic Print T-Shirt",
      price: 999,
      originalPrice: 1499,
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
      slug: "oversized-heavyweight-tee",
    },
    {
      id: "fd-2",
      title: "Waffle Knit Polo",
      price: 1499,
      originalPrice: 1999,
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80",
      slug: "oversized-heavyweight-tee",
    },
    {
      id: "fd-3",
      title: "Relaxed Fit Denim",
      price: 1999,
      originalPrice: 2499,
      image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=600&q=80",
      slug: "pleated-tailored-trouser",
    },
    {
      id: "fd-4",
      title: "Hoodie Sweatshirt",
      price: 1899,
      originalPrice: 2299,
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80",
      slug: "heavyweight-relaxed-lower",
    },
    {
      id: "fd-5",
      title: "Cargo Joggers",
      price: 1499,
      originalPrice: 1999,
      image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&q=80",
      slug: "tactical-cargo-pant",
    },
    {
      id: "fd-6",
      title: "Oversized Linen Shirt",
      price: 1499,
      originalPrice: 1899,
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
      slug: "pleated-tailored-trouser",
    },
  ];

  const customerReviews = [
    {
      id: 1,
      name: "Rahul Mehta",
      verified: true,
      rating: 5,
      comment:
        "Amazing quality and perfect fit. The oversized tee is super comfortable. Will definitely shop again!",
      productName: "Oversized T-Shirt",
      productImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&q=80",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
    },
    {
      id: 2,
      name: "Priya Sharma",
      verified: true,
      rating: 5,
      comment:
        "Loved the fabric and fit. Delivery was super fast and the packaging was premium.",
      productName: "Linen Shirt",
      productImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&q=80",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    },
    {
      id: 3,
      name: "Amit Verma",
      verified: true,
      rating: 5,
      comment:
        "Best clothing store I've shopped from. Great collection and excellent customer service.",
      productName: "Cargo Pants",
      productImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&q=80",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80",
    },
  ];

  const ugcPhotos = [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80",
  ];

  return (
    <div className="space-y-20 pb-20 bg-[#fafaf8] text-[#121212] relative">
      {/* Floating 3D White T-Shirt Scroll Experience */}
      <ScrollAnimatedTee />
      
      {/* 1. EDITORIAL STREETWEAR HERO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-3xl overflow-hidden bg-[#f5f5f1] border border-[#e8e8e0] min-h-[520px] sm:min-h-[640px] lg:min-h-[700px] flex flex-col justify-between p-5 sm:p-10 lg:p-12 shadow-sm select-none">
          
          {/* Subtle Ambient 3D Glow Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-[#ff5500]/10 to-amber-200/15 blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-stone-300/30 to-amber-100/20 blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: "2s" }} />

          {/* Subtle Vertical Architectural Dashed Guidelines */}
          <div className="absolute inset-0 pointer-events-none flex justify-between px-4 sm:px-12 lg:px-16">
            <div className="w-[1px] h-full border-r border-dashed border-[#dedecc]/60" />
            <div className="w-[1px] h-full border-r border-dashed border-[#dedecc]/60" />
          </div>

          {/* Top Bar Header inside Hero */}
          <div className="relative z-20 flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-[#57534e] uppercase">
                //FASHION
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-[#57534e] uppercase block leading-tight">
                //STYLED FOR
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-[#57534e] uppercase block leading-tight">
                LIFE.
              </span>
            </div>
          </div>

          {/* Center Stage: Big Split Typography & Central Model */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center my-auto w-full py-4 sm:py-6 gap-2 lg:gap-0">
            
            {/* Left Big Typography */}
            <div className="lg:col-span-4 flex flex-col justify-center text-left space-y-0 z-20">
              <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-extrabold tracking-[-0.06em] text-[#121212] leading-[0.92] sm:leading-[0.88] lowercase">
                where <br />
                <span className="inline-block transform -translate-x-1 sm:-translate-x-2">- style</span>
              </h1>
            </div>

            {/* Center High-Fashion Streetwear Model Portrait with 3D Float */}
            <div className="lg:col-span-4 flex justify-center items-center relative py-4 lg:py-0 z-10 perspective-1000">
              <div className="relative w-full max-w-[240px] sm:max-w-[320px] lg:max-w-[380px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/90 bg-[#ebebe7] group card-3d animate-float-3d">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=85"
                  alt="High fashion oversized jacket streetwear collection"
                  className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                
                {/* Visual Orange Tag hanging accent */}
                <div className="absolute top-1/3 right-5 sm:right-6 flex flex-col items-center">
                  <div className="w-[3px] h-8 sm:h-10 bg-[#ff5500] rounded-full shadow-sm" />
                  <div className="px-1.5 py-0.5 bg-[#ff5500] text-white text-[7px] sm:text-[8px] font-mono font-bold tracking-widest uppercase rounded shadow-md">
                    LUXE
                  </div>
                </div>

                {/* Floating Bottom Status Pill */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-white/90 backdrop-blur-md px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border border-white/60 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-ping" />
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#121212] tracking-wider uppercase">
                      COLLECTION '26
                    </span>
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-mono text-[#78716c] uppercase">SS/FW</span>
                </div>
              </div>
            </div>

            {/* Right Big Typography */}
            <div className="lg:col-span-4 flex flex-col justify-center text-left lg:text-left space-y-0 lg:pl-6 z-20">
              <h2 className="font-sans text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-extrabold tracking-[-0.06em] text-[#121212] leading-[0.92] sm:leading-[0.88] lowercase">
                lives <br />
                <span className="inline-block transform -translate-x-1 sm:-translate-x-2">- now</span>
              </h2>
            </div>

          </div>

          {/* Bottom Bar: Narrative Copy on Left, Floating Social & Stats on Right */}
          <div className="relative z-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-5 sm:gap-6 pt-5 sm:pt-6 border-t border-[#e2e2d8]/70">
            
            {/* Left Sub-Narrative & Collection Badge */}
            <div className="max-w-xs sm:max-w-sm space-y-2.5 sm:space-y-3">
              <p className="text-xs sm:text-[13px] text-[#57534e] font-normal leading-relaxed">
                Explore curated collections, exclusive drops and everyday essentials all thoughtfully designed in one stylish shopping destination.
              </p>
              
              <div className="flex items-center gap-3 sm:gap-4 pt-1">
                <Link
                  href="/shop"
                  className="px-5 py-2.5 rounded-full bg-[#121212] hover:bg-[#ff5500] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="text-[10px] sm:text-[11px] font-mono text-[#57534e] leading-tight border-l border-[#d6d6ca] pl-3">
                  <div>/ New</div>
                  <div className="font-bold text-[#121212]">Collection 2026</div>
                </div>
              </div>
            </div>

            {/* Right Side: Orange Clover Glyph, Avatar Cluster with + Button & 280K Stat */}
            <div className="flex items-center justify-between sm:justify-start w-full md:w-auto gap-4 sm:gap-7">
              
              {/* Orange 4-Petal Clover Icon */}
              <div className="hidden sm:flex text-[#ff5500]">
                <svg className="w-6 h-6 fill-current animate-spin" style={{ animationDuration: "16s" }} viewBox="0 0 24 24">
                  <path d="M12 2C13.6 5.5 15.5 7.4 19 9C15.5 10.6 13.6 12.5 12 16C10.4 12.5 8.5 10.6 5 9C8.5 7.4 10.4 5.5 12 2Z" />
                  <path d="M12 8C13.6 11.5 15.5 13.4 19 15C15.5 16.6 13.6 18.5 12 22C10.4 18.5 8.5 16.6 5 15C8.5 13.4 10.4 11.5 12 8Z" />
                </svg>
              </div>

              {/* Avatar Stack + Orange Plus Button */}
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                  alt="Luxe Member"
                  className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border-2 border-white object-cover shadow-sm -mr-2 relative z-10"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                  alt="Luxe Member"
                  className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border-2 border-white object-cover shadow-sm -mr-2 relative z-20"
                />
                <Link
                  href="/shop"
                  className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-[#ff5500] hover:bg-[#e04b00] text-white flex items-center justify-center text-sm font-bold shadow-md hover:scale-110 active:scale-95 transition-transform relative z-30"
                  aria-label="Join Community"
                >
                  +
                </Link>
              </div>

              {/* 280K Stat Counter */}
              <div className="text-left border-l border-[#d6d6ca] pl-3 sm:pl-4">
                <div className="text-xl sm:text-3xl font-extrabold text-[#121212] tracking-tight font-sans">
                  280K
                </div>
                <div className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-[#57534e] font-bold">
                  PEOPLE WE INSPIRE
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Value Props Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 text-xs text-[#57534e]">
          <div className="card-3d flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#eae6df] shadow-sm hover:border-[#121212]/20">
            <div className="w-10 h-10 rounded-xl bg-[#f4f2ee] flex items-center justify-center flex-shrink-0">
              <Feather className="w-4 h-4 text-[#121212]" />
            </div>
            <div>
              <span className="font-semibold text-[#121212] block">Premium Fabrics</span>
              <span className="text-[11px] text-[#78716c]">Bio-washed 280 GSM French Terry</span>
            </div>
          </div>
          <div className="card-3d flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#eae6df] shadow-sm hover:border-[#121212]/20">
            <div className="w-10 h-10 rounded-xl bg-[#f4f2ee] flex items-center justify-center flex-shrink-0">
              <Truck className="w-4 h-4 text-[#121212]" />
            </div>
            <div>
              <span className="font-semibold text-[#121212] block">Express Delivery</span>
              <span className="text-[11px] text-[#78716c]">Free shipping above ₹999 across India</span>
            </div>
          </div>
          <div className="card-3d flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#eae6df] shadow-sm hover:border-[#121212]/20">
            <div className="w-10 h-10 rounded-xl bg-[#f4f2ee] flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-4 h-4 text-[#121212]" />
            </div>
            <div>
              <span className="font-semibold text-[#121212] block">Complimentary Returns</span>
              <span className="text-[11px] text-[#78716c]">Hassle-free doorstep size exchanges</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY: "FIND YOUR STYLE" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#78716c]">
              SHOP BY CATEGORY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#121212] mt-1">
              Find Your Style
            </h2>
            <p className="text-xs sm:text-sm text-[#78716c] font-light mt-1">
              Explore our wide range of clothing for every mood, every moment.
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs font-semibold text-[#121212] hover:text-black flex items-center gap-1 uppercase tracking-wider group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="card-3d group flex flex-col space-y-2 p-1.5 rounded-2xl bg-white border border-[#eae6df] hover:border-[#121212]/20 shadow-sm"
            >
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#eae6df]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="px-1.5 pb-1">
                <h3 className="text-xs sm:text-sm font-bold text-[#121212] group-hover:text-black transition">
                  {cat.name}
                </h3>
                <span className="text-[10px] sm:text-[11px] text-[#78716c] flex items-center gap-1 mt-0.5">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BESTSELLERS: "MOST LOVED STYLES" (2 CARDS PER ROW ON MOBILE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#eae6df] pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#78716c]">
              BESTSELLERS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#121212] mt-1">
              Most Loved Styles
            </h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 text-xs no-scrollbar">
            {["All", "T-Shirts", "Shirts", "Trousers", "Hoodies", "Accessories"].map((tab, idx) => (
              <Link
                key={idx}
                href="/shop"
                className={`px-4 py-1.5 rounded-full font-medium transition-all duration-200 flex-shrink-0 ${
                  idx === 0
                    ? "bg-[#121212] text-white shadow-sm"
                    : "bg-[#f4f2ee] text-[#555555] hover:bg-[#eae6df] hover:text-black"
                }`}
              >
                {tab}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile: 2 Cards Per Row (grid-cols-2), Desktop: 4 Cards Per Row (lg:grid-cols-4) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. DUAL EDITORIAL PROMO BANNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Left Promo Banner */}
          <div className="card-3d relative rounded-3xl overflow-hidden bg-[#e8e2d7] border border-[#d8d0c2] p-6 sm:p-12 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] shadow-sm">
            <div className="relative z-10 max-w-[72%] sm:max-w-xs space-y-2 sm:space-y-3">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#78716c]">
                PREMIUM COTTON
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#121212] leading-tight">
                Crafted for Comfort.
              </h3>
              <p className="text-xs text-[#57534e] font-light">
                Soft fabrics. Modern fits. Everyday essentials.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop?categorySlug=t-shirts"
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#121212] text-white text-xs font-semibold hover:bg-black transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Shop T-Shirts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80"
              alt="Crafted for Comfort"
              className="absolute right-0 bottom-0 w-2/5 sm:w-1/2 h-full object-cover object-center opacity-70 sm:opacity-85 pointer-events-none group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Right Promo Banner */}
          <div className="card-3d relative rounded-3xl overflow-hidden bg-[#e2dad0] border border-[#d4cbbf] p-6 sm:p-12 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] shadow-sm">
            <div className="relative z-10 max-w-[72%] sm:max-w-xs space-y-2 sm:space-y-3">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#78716c]">
                THE OVERSIZED EDIT
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#121212] leading-tight">
                Bigger Looks Better.
              </h3>
              <p className="text-xs text-[#57534e] font-light">
                Relaxed fits for a bolder you.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop?collectionSlug=oversized-tees"
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#121212] text-white text-xs font-semibold hover:bg-black transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Shop Oversized</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80"
              alt="Bigger Looks Better"
              className="absolute right-0 bottom-0 w-2/5 sm:w-1/2 h-full object-cover object-center opacity-70 sm:opacity-85 pointer-events-none group-hover:scale-105 transition-transform duration-700"
            />
          </div>

        </div>
      </section>

      {/* 5. FRESH DROPS / NEW ARRIVALS (2 CARDS PER ROW ON MOBILE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#78716c]">
              NEW ARRIVALS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#121212] mt-1">
              Fresh Drops
            </h2>
          </div>

          <Link
            href="/shop?sort=newest"
            className="text-xs font-semibold text-[#121212] hover:text-black flex items-center gap-1 uppercase tracking-wider group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {freshDrops.map((item) => (
            <div
              key={item.id}
              className="card-3d group flex flex-col rounded-2xl bg-white border border-[#eae6df] overflow-hidden p-2 space-y-2 hover:border-[#121212]/20 transition shadow-sm"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-[#f4f2ee]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
              </div>
              <div className="px-1 pb-1">
                <h4 className="text-xs font-semibold text-[#121212] line-clamp-1 group-hover:text-black">
                  <Link href={`/product/${item.slug}`}>{item.title}</Link>
                </h4>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xs font-bold text-[#121212]">₹{item.price}</span>
                  <span className="text-[10px] text-[#888888] line-through">₹{item.originalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. "WHY CHOOSE LUXE / STYLE WITH CONFIDENCE" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-left">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#78716c]">
            WHY CHOOSE LUXE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#121212] mt-1">
            Style With Confidence
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="card-3d p-3.5 sm:p-6 rounded-2xl bg-white border border-[#eae6df] flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 shadow-sm hover:border-[#121212]/20">
            <div className="w-9 sm:w-12 h-9 sm:h-12 rounded-xl bg-[#f4f2ee] text-[#121212] flex items-center justify-center flex-shrink-0">
              <Feather className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#121212]">Premium Quality</h4>
              <p className="text-[10px] sm:text-xs text-[#78716c] font-light mt-0.5">Finest fabrics & lasting comfort</p>
            </div>
          </div>

          <div className="card-3d p-3.5 sm:p-6 rounded-2xl bg-white border border-[#eae6df] flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 shadow-sm hover:border-[#121212]/20">
            <div className="w-9 sm:w-12 h-9 sm:h-12 rounded-xl bg-[#f4f2ee] text-[#121212] flex items-center justify-center flex-shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#121212]">Free Shipping</h4>
              <p className="text-[10px] sm:text-xs text-[#78716c] font-light mt-0.5">On orders above ₹999</p>
            </div>
          </div>

          <div className="card-3d p-3.5 sm:p-6 rounded-2xl bg-white border border-[#eae6df] flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 shadow-sm hover:border-[#121212]/20">
            <div className="w-9 sm:w-12 h-9 sm:h-12 rounded-xl bg-[#f4f2ee] text-[#121212] flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#121212]">Easy Returns</h4>
              <p className="text-[10px] sm:text-xs text-[#78716c] font-light mt-0.5">Within 7 days doorstep</p>
            </div>
          </div>

          <div className="card-3d p-3.5 sm:p-6 rounded-2xl bg-white border border-[#eae6df] flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 shadow-sm hover:border-[#121212]/20">
            <div className="w-9 sm:w-12 h-9 sm:h-12 rounded-xl bg-[#f4f2ee] text-[#121212] flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#121212]">Secure Payments</h4>
              <p className="text-[10px] sm:text-xs text-[#78716c] font-light mt-0.5">100% safe & encrypted</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS / "WHAT OUR CUSTOMERS SAY" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#78716c]">
              CUSTOMER REVIEWS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#121212] mt-1">
              What Our Customers Say
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full border border-[#d8d0c2] hover:bg-[#f4f2ee] transition active:scale-95" aria-label="Previous Review">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full border border-[#d8d0c2] hover:bg-[#f4f2ee] transition active:scale-95" aria-label="Next Review">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {customerReviews.map((rev) => (
            <div
              key={rev.id}
              className="card-3d p-6 rounded-3xl bg-white border border-[#eae6df] space-y-4 shadow-sm hover:border-[#121212]/20 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#eae6df]"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#121212]">{rev.name}</h4>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Buyer</span>
                    </span>
                  </div>
                </div>

                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-[#57534e] leading-relaxed font-light">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#f0ece4]">
                <img
                  src={rev.productImage}
                  alt={rev.productName}
                  className="w-8 h-10 rounded object-cover bg-[#f4f2ee]"
                />
                <span className="text-xs font-semibold text-[#121212]">{rev.productName}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. INSTAGRAM COMMUNITY: "#LuxeStyle" (2 CARDS PER ROW ON MOBILE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#78716c]">
              FOLLOW US
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#121212] mt-1">
              #LuxeStyle
            </h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#121212] hover:text-black flex items-center gap-1 uppercase tracking-wider group"
          >
            <span>Tag us to get featured</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {ugcPhotos.map((img, idx) => (
            <div
              key={idx}
              className="card-3d relative aspect-square rounded-2xl overflow-hidden group bg-[#eae6df] shadow-sm hover:border-[#121212]/20"
            >
              <img
                src={img}
                alt={`Luxe Community ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                <span className="text-xs font-bold font-mono tracking-wider">@LUXE</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. VIP PRIVILEGE CLUB NEWSLETTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#121212] text-white p-8 sm:p-14 shadow-2xl border border-white/10 card-3d">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#ff5500]/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#ff5500] uppercase">
              //JOIN THE INNER CIRCLE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Unlock 10% Off Your First Order
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light max-w-md mx-auto">
              Be the first to hear about private drops, secret flash discounts, and seasonal lookbooks.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-stone-400 text-xs focus:outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500]"
              />
              <button
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#ff5500] hover:bg-[#e04b00] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-xl active:scale-95"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
