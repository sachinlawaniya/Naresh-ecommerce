"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  CheckCircle2,
} from "lucide-react";
import { env } from "@/config/env";
import { useToast } from "@/components/storefront/ui/ToastProvider";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      showToast("success", "VIP Code Unlocked: WELCOME10", "10% Privilege code sent to your inbox!");
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#ffffff] text-[#121212] border-t border-[#eae6df] mt-24">
      {/* 1. NEWSLETTER BANNER STRIP */}
      <div className="bg-[#f5f2eb] border-b border-[#e6e1d7] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#121212]">
              Join The Luxe Community
            </h3>
            <p className="text-xs sm:text-sm text-[#666666] font-light">
              Get exclusive offers, new arrivals and style tips.
            </p>
          </div>

          {isSubscribed ? (
            <div className="px-5 py-3 bg-white border border-[#d8d0c2] rounded-full text-xs font-semibold text-[#121212] flex items-center gap-2 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>You're in! Use code <strong>WELCOME10</strong> on your order.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center w-full max-w-md gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 rounded-full bg-white border border-[#d8d0c2] text-xs text-[#121212] placeholder-[#8c857b] focus:outline-none focus:border-black transition"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#121212] hover:bg-black text-white text-xs font-semibold transition"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 2. MAIN FOOTER NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex flex-col">
              <span className="font-serif text-2xl font-black tracking-tight text-[#121212] uppercase leading-none">
                LUXE
              </span>
              <span className="text-[8px] font-sans tracking-[0.2em] text-[#888888] font-bold uppercase mt-0.5">
                CLOTHING STORE
              </span>
            </Link>
            <p className="text-xs text-[#666666] leading-relaxed max-w-xs font-light">
              Premium clothing for modern lifestyles. Quality, comfort and style — all in one place.
            </p>
            <div className="flex items-center space-x-3 pt-2 text-[#444444]">
              <a href="#" className="p-2 rounded-full bg-[#f4f2ee] hover:bg-[#e8e4dc] hover:text-black transition" aria-label="Instagram">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-[#f4f2ee] hover:bg-[#e8e4dc] hover:text-black transition" aria-label="Facebook">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z"/></svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-[#f4f2ee] hover:bg-[#e8e4dc] hover:text-black transition" aria-label="YouTube">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-[#f4f2ee] hover:bg-[#e8e4dc] hover:text-black transition" aria-label="X">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212]">Shop</h4>
            <ul className="space-y-2 text-xs text-[#666666]">
              <li><Link href="/shop?categorySlug=men" className="hover:text-black transition">Men</Link></li>
              <li><Link href="/shop?categorySlug=women" className="hover:text-black transition">Women</Link></li>
              <li><Link href="/shop?sort=newest" className="hover:text-black transition">New Arrivals</Link></li>
              <li><Link href="/shop?sort=featured" className="hover:text-black transition">Best Sellers</Link></li>
              <li><Link href="/shop?collectionSlug=sale" className="hover:text-black transition">Sale</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212]">Customer Care</h4>
            <ul className="space-y-2 text-xs text-[#666666]">
              <li><Link href="/account/orders" className="hover:text-black transition">Track Order</Link></li>
              <li><Link href="/about" className="hover:text-black transition">Shipping Policy</Link></li>
              <li><Link href="/contact" className="hover:text-black transition">Returns & Refunds</Link></li>
              <li><Link href="/shop" className="hover:text-black transition">Size Guide</Link></li>
              <li><Link href="/contact" className="hover:text-black transition">FAQs</Link></li>
            </ul>
          </div>

          {/* Col 4: About */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212]">About</h4>
            <ul className="space-y-2 text-xs text-[#666666]">
              <li><Link href="/about" className="hover:text-black transition">Our Story</Link></li>
              <li><Link href="/about" className="hover:text-black transition">Sustainability</Link></li>
              <li><Link href="/about" className="hover:text-black transition">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-black transition">Contact Us</Link></li>
              <li><Link href="/about" className="hover:text-black transition">Blog</Link></li>
            </ul>
          </div>

          {/* Col 5: Download App & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212]">Download Our App</h4>
            <p className="text-xs text-[#666666] font-light">
              Shop on the go with our mobile app.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#121212] text-white rounded-lg cursor-pointer hover:bg-black transition w-fit">
                <div className="text-[9px] leading-tight">
                  <div>Download on the</div>
                  <div className="text-xs font-bold">App Store</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#121212] text-white rounded-lg cursor-pointer hover:bg-black transition w-fit">
                <div className="text-[9px] leading-tight">
                  <div>GET IT ON</div>
                  <div className="text-xs font-bold">Google Play</div>
                </div>
              </div>
            </div>
            <div className="pt-2 text-[10px] text-[#888888] font-mono">
              GSTIN: {env.NEXT_PUBLIC_STORE_GSTIN || env.STORE_GSTIN}
            </div>
          </div>

        </div>

        {/* Bottom Sub-Bar */}
        <div className="pt-12 mt-12 border-t border-[#eae6df] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777777]">
          <div>© {new Date().getFullYear()} LUXE. All rights reserved.</div>
          
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-black transition">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-black transition">
              Terms & Conditions
            </Link>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-full bg-[#f4f2ee] hover:bg-[#e8e4dc] text-[#121212] transition"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
