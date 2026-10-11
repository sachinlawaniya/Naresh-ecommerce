"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ScrollAnimatedTee() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [state, setState] = useState({
    x: 76, // vw
    y: 44, // vh
    rotate: -4,
    scale: 1,
    tagLabel: "280 GSM BIO-WASHED",
    tagNumber: "01",
  });

  const animFrameRef = useRef<number | null>(null);
  const scrollTargetRef = useRef(0);
  const scrollCurrentRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    setMounted(true);

    const updateScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      scrollTargetRef.current = progress;
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    const loop = () => {
      timeRef.current += 1;
      const t = timeRef.current;

      // Smooth buttery lerp
      scrollCurrentRef.current += (scrollTargetRef.current - scrollCurrentRef.current) * 0.07;
      const p = scrollCurrentRef.current;
      const isMobile = window.innerWidth < 768;

      let targetX = 76;
      let targetY = 44;
      let targetRot = -4;
      let targetScale = isMobile ? 0.65 : 1.0;
      let label = "280 GSM BIO-WASHED";
      let num = "01";

      if (p < 0.16) {
        // 1. Hero
        const sub = p / 0.16;
        targetX = isMobile ? 68 : 76 + sub * 2;
        targetY = 42 + sub * 6;
        targetRot = -4 + sub * 8;
        targetScale = isMobile ? 0.68 : 1.05;
        label = "280 GSM BIO-WASHED";
        num = "01";
      } else if (p < 0.35) {
        // 2. Categories (glides to left margin)
        const sub = (p - 0.16) / (0.35 - 0.16);
        targetX = isMobile ? 8 : 78 - sub * 66; // -> 12vw
        targetY = 48 - sub * 8;
        targetRot = 4 - sub * 14;
        targetScale = isMobile ? 0.62 : 0.95;
        label = "BOX-FIT SILHOUETTE";
        num = "02";
      } else if (p < 0.55) {
        // 3. Bestsellers (glides to right margin)
        const sub = (p - 0.35) / (0.55 - 0.35);
        targetX = isMobile ? 70 : 12 + sub * 66; // -> 78vw
        targetY = 40 + sub * 8;
        targetRot = -10 + sub * 20;
        targetScale = isMobile ? 0.65 : 1.02;
        label = "MOST-WANTED ESSENTIAL";
        num = "03";
      } else if (p < 0.72) {
        // 4. Cotton Promo (glides to left margin)
        const sub = (p - 0.55) / (0.72 - 0.55);
        targetX = isMobile ? 8 : 78 - sub * 64; // -> 14vw
        targetY = 48 - sub * 8;
        targetRot = 10 - sub * 18;
        targetScale = isMobile ? 0.62 : 0.98;
        label = "100% FRENCH TERRY";
        num = "04";
      } else if (p < 0.88) {
        // 5. Value Props (glides to right margin)
        const sub = (p - 0.72) / (0.88 - 0.72);
        targetX = isMobile ? 70 : 14 + sub * 64; // -> 78vw
        targetY = 40 + sub * 8;
        targetRot = -8 + sub * 16;
        targetScale = isMobile ? 0.65 : 1.0;
        label = "DOORSTEP TRIAL READY";
        num = "05";
      } else {
        // 6. VIP Club (docks at center-right)
        const sub = (p - 0.88) / 0.12;
        targetX = isMobile ? 62 : 78 - sub * 18; // -> 60vw
        targetY = 48 - sub * 8;
        targetRot = 8 - sub * 8;
        targetScale = isMobile ? 0.7 : 1.05;
        label = "CODE: WELCOME10";
        num = "06";
      }

      // Natural breathing oscillation
      const breathY = Math.sin(t * 0.035) * 5;
      const breathRot = Math.cos(t * 0.025) * 1.5;

      setState({
        x: targetX,
        y: targetY + breathY * 0.2,
        rotate: targetRot + breathRot,
        scale: targetScale,
        tagLabel: label,
        tagNumber: num,
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", updateScroll);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (!mounted) return null;

  return (
    <aside
      aria-label="Floating White T-Shirt"
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none"
    >
      <div
        className="absolute top-0 left-0 pointer-events-none transition-opacity duration-300"
        style={{
          transform: `translate3d(${state.x}vw, ${state.y}vh, 0px) rotate(${state.rotate}deg) scale(${
            isHovered ? state.scale * 1.08 : state.scale
          })`,
          transition: "transform 0.06s linear",
          willChange: "transform",
        }}
      >
        <div className="relative group pointer-events-auto flex flex-col items-center">
          
          {/* Subtle Ambient Radial Light behind Shirt */}
          <div className="absolute inset-0 w-48 sm:w-64 h-48 sm:h-64 -translate-x-4 -translate-y-4 rounded-full bg-radial from-amber-100/30 via-stone-200/20 to-transparent blur-2xl pointer-events-none -z-10" />

          {/* Interactive Floating T-Shirt Image */}
          <Link
            href="/shop?categorySlug=t-shirts"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="block relative cursor-pointer"
            title="View 280 GSM Heavyweight Tee"
          >
            <img
              src="/white-tee-floating.png"
              alt="Luxury Heavyweight White T-Shirt"
              className="w-32 sm:w-44 md:w-52 h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] drop-shadow-[0_6px_12px_rgba(0,0,0,0.08)] transition-transform duration-500 group-hover:scale-105"
            />

            {/* Micro Hover Button Tag */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="px-3 py-1 rounded-full bg-[#121212]/90 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase shadow-xl flex items-center gap-1 border border-white/20">
                <span>View Piece</span>
                <ArrowUpRight className="w-3 h-3 text-[#ff5500]" />
              </span>
            </div>
          </Link>

          {/* Minimal Designer Hangtag (Editorial Luxury Look) */}
          <div className="mt-1 flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#e8e4dc] shadow-sm transition-all duration-300 group-hover:border-[#121212]/30 group-hover:shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] animate-pulse" />
            <span className="text-[9px] font-mono font-bold tracking-wider text-[#121212] uppercase">
              {state.tagLabel}
            </span>
            <span className="text-[8px] font-mono text-[#888888] font-bold border-l border-[#e5e0d8] pl-1.5">
              {state.tagNumber}
            </span>
          </div>

        </div>
      </div>
    </aside>
  );
}
