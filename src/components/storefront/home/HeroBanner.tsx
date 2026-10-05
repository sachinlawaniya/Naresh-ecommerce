"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Flame, Compass } from "lucide-react";

export function HeroBanner() {
  const [activeColor, setActiveColor] = useState({
    name: "Obsidian Black",
    hex: "#111827",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85",
  });

  const heroColors = [
    { name: "Obsidian Black", hex: "#111827", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85" },
    { name: "Chalk Off-White", hex: "#f3f4f6", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=85" },
    { name: "Sage Olive", hex: "#4b5563", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&q=85" },
  ];

  return (
    <div className="relative overflow-hidden bg-[#06090e] text-white mx-4 sm:mx-8 my-6 rounded-[2.5rem] border border-white/[0.08] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
      
      {/* Background Ambience Atmospheric Gradients */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-blue-500/[0.05] rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle Studio Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-28 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left Editorial Narrative */}
        <div className="max-w-2xl space-y-8 text-center lg:text-left">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.12] text-xs font-mono tracking-widest uppercase backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-bold">AUTUMN / WINTER '26 ARCHIVE</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">BATCH NO. 01/500</span>
          </div>

          {/* Main Hero Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.05em] leading-[0.95] uppercase font-sans">
              ARCHITECTURAL <br />
              <span className="shimmer-text">STREETWEAR</span> <br />
              PROPORTIONS.
            </h1>
            <p className="text-slate-400 text-sm sm:text-base font-light max-w-xl leading-relaxed pt-2 mx-auto lg:mx-0">
              Engineered 280 GSM long-staple French Terry cotton, drop-shoulder tailoring, and certified non-fade reactive bio-dyeing. Designed for timeless form and perpetual durability.
            </p>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-y border-white/[0.08] py-4 max-w-lg mx-auto lg:mx-0 text-left font-mono">
            <div>
              <div className="text-xl font-bold text-white">280 GSM</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Heavy French Terry</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">100%</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Combed Cotton</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400">GST INVOICE</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Instant B2B/B2C</div>
            </div>
          </div>

          {/* Dual Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-9 py-4.5 bg-white text-slate-950 font-extrabold rounded-2xl hover:bg-slate-100 transition shadow-[0_0_30px_rgba(255,255,255,0.25)] flex items-center justify-center gap-3 group text-xs uppercase tracking-widest"
            >
              <span>Explore The Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <Link
              href="/shop?categorySlug=t-shirts"
              className="w-full sm:w-auto px-8 py-4.5 bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold rounded-2xl border border-white/[0.12] transition backdrop-blur-xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
            >
              <Compass className="w-4 h-4" />
              <span>Heavyweight Tees</span>
            </Link>
          </div>
        </div>

        {/* Right Feature Interactive Spotlight Showcase Card */}
        <div className="relative w-full max-w-sm lg:max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-white/[0.1] group">
          <img
            src={activeColor.image}
            alt="Hero Spotlight Garment"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Top Pill */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 border border-white/[0.1]">
              Live Spotlight • 280 GSM
            </span>
          </div>

          {/* Bottom Card Glass Overlay */}
          <div className="absolute inset-x-4 bottom-4 p-5 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/[0.1] space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Drop Item No. 01
                </span>
                <h3 className="text-base font-bold text-white">
                  Heavyweight 280 GSM Boxy Tee
                </h3>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-white">₹999</span>
                <div className="text-[10px] text-emerald-400">Incl. 5% GST</div>
              </div>
            </div>

            {/* Interactive Color Switcher */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
              <div className="flex items-center gap-2">
                {heroColors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setActiveColor(c)}
                    className={`w-5 h-5 rounded-full border transition ${
                      activeColor.hex === c.hex
                        ? "ring-2 ring-white scale-125 border-transparent"
                        : "border-slate-600 opacity-60 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>

              <Link
                href="/product/oversized-heavyweight-tee"
                className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1 hover:underline"
              >
                <span>View Piece</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
