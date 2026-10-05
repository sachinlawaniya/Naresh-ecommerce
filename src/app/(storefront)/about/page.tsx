import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  CheckCircle2,
  ArrowRight,
  Truck,
  Building2,
  Scissors,
  RotateCcw,
  Feather,
} from "lucide-react";
import { env } from "@/config/env";

export const metadata = {
  title: "About Us | LUXE - Everyday Looks Better On You",
  description:
    "Discover the story and craft behind LUXE. Heavyweight 280 GSM cotton, Italian pleated drapes, and effortless modern streetwear.",
};

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16 bg-[#fafaf8] text-[#121212]">
      {/* 1. HERO BANNER */}
      <section className="relative pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-[#ebe6dd] border border-[#dfd8cb] p-8 sm:p-14 lg:p-16 shadow-sm">
          <div className="relative z-10 max-w-3xl space-y-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#78716c] font-sans">
              ABOUT LUXE — EST. 2026
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#121212] leading-[1.1]">
              Everyday Looks Better On You.
            </h1>

            <p className="text-sm sm:text-base text-[#57534e] font-light leading-relaxed max-w-2xl">
              LUXE was founded on a singular conviction: premium modern clothing should blend exceptional fabric weight, effortless comfort, and architectural proportions at fair transparency.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/shop"
                className="px-7 py-3.5 bg-[#121212] hover:bg-black text-white rounded-full font-semibold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2"
              >
                <span>Shop The Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3.5 bg-white hover:bg-[#f4f2ee] text-[#121212] border border-[#121212] rounded-full font-semibold text-xs uppercase tracking-wider transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & KEY METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#eae6df] shadow-sm">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#121212]">280+</span>
            <div className="mt-2">
              <h4 className="text-xs font-bold text-[#121212] uppercase">GSM Fabric Standard</h4>
              <p className="text-xs text-[#78716c] font-light mt-0.5">Super combed French Terry & knit.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#eae6df] shadow-sm">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#121212]">19,000+</span>
            <div className="mt-2">
              <h4 className="text-xs font-bold text-[#121212] uppercase">PIN Codes Covered</h4>
              <p className="text-xs text-[#78716c] font-light mt-0.5">Express priority delivery across India.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#eae6df] shadow-sm">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#121212]">100%</span>
            <div className="mt-2">
              <h4 className="text-xs font-bold text-[#121212] uppercase">GST Compliance</h4>
              <p className="text-xs text-[#78716c] font-light mt-0.5">Instant B2B/B2C HSN tax invoicing.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#eae6df] shadow-sm">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#121212]">7 Days</span>
            <div className="mt-2">
              <h4 className="text-xs font-bold text-[#121212] uppercase">Easy Returns & Exchanges</h4>
              <p className="text-xs text-[#78716c] font-light mt-0.5">Hassle-free doorstep size swap.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE PILLARS OF CRAFTSMANSHIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-left space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#78716c]">
            OUR CRAFT STANDARDS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#121212]">
            Built Different From Fast Fashion
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-[#eae6df] space-y-3 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-[#f4f2ee] text-[#121212] flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#121212]">Dense 1.25" Lycra Rib Collar</h3>
            <p className="text-xs text-[#57534e] leading-relaxed font-light">
              T-shirt necklines engineered to maintain crisp shape throughout hundreds of wears. Reinforced with twin-needle chain stitching.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#eae6df] space-y-3 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-[#f4f2ee] text-[#121212] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#121212]">Tailored Pleats & Drapes</h3>
            <p className="text-xs text-[#57534e] leading-relaxed font-light">
              Our trousers feature deep double pleats engineered from high-drape twill that flows gracefully over sneakers and luxury loafers.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#eae6df] space-y-3 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-[#f4f2ee] text-[#121212] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#121212]">100% Tax & HSN Transparency</h3>
            <p className="text-xs text-[#57534e] leading-relaxed font-light">
              Full transparency on every dispatch. Correct statutory HSN classification with verifiable GSTIN {env.NEXT_PUBLIC_STORE_GSTIN || env.STORE_GSTIN}.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-[#ebe6dd] border border-[#dfd8cb] space-y-4">
          <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#121212]">
            Ready to Experience True Heavyweight Quality?
          </h3>
          <p className="text-[#57534e] text-xs sm:text-sm max-w-md mx-auto font-light">
            Enjoy free shipping across India on orders above ₹999 and 10% off your first order with code <strong>WELCOME10</strong>.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-[#121212] hover:bg-black text-white font-semibold text-xs uppercase tracking-wider rounded-full transition shadow-sm"
            >
              Shop The Collection
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-white hover:bg-[#f4f2ee] text-[#121212] border border-[#121212] font-semibold text-xs uppercase tracking-wider rounded-full transition"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
