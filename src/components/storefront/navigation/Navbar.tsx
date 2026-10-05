"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Heart,
  Truck,
  RotateCcw,
  Banknote,
  Package,
} from "lucide-react";
import { useCart } from "@/modules/order/context/cart-context";
import { AuthModal } from "../auth/AuthModal";

export function Navbar() {
  const { totalItemsCount, openCart } = useCart();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR (DARK SLEEK) */}
      <div className="bg-[#121212] text-[#e0dfdc] text-[11px] font-medium py-2 px-4 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
            <Truck className="w-3.5 h-3.5 text-slate-400" />
            <span>Free shipping on orders above ₹999</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Easy Returns within 7 days</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <Banknote className="w-3.5 h-3.5 text-slate-400" />
            <span>Cash on Delivery Available</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (CLEAN EDITORIAL WHITE) */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#eae6df] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 sm:gap-8">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#121212] hover:text-black transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left: Brand Identity */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#121212] uppercase leading-none">
                LUXE
              </span>
              <span className="text-[8px] font-sans tracking-[0.2em] text-[#888888] font-bold uppercase mt-0.5">
                CLOTHING STORE
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-[13px] font-medium text-[#222222]">
            <Link href="/shop?categorySlug=men" className="hover:text-black transition">
              Men
            </Link>
            <Link href="/shop?categorySlug=women" className="hover:text-black transition">
              Women
            </Link>
            <Link href="/shop?sort=newest" className="hover:text-black transition">
              New Arrivals
            </Link>
            <Link href="/shop?sort=featured" className="hover:text-black transition">
              Best Sellers
            </Link>
            <Link href="/shop" className="hover:text-black transition">
              Collections
            </Link>
            <Link href="/shop?collectionSlug=sale" className="text-rose-600 hover:text-rose-700 font-semibold transition">
              Sale
            </Link>
          </nav>

          {/* Search Bar Pill */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs relative items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for t-shirts, trousers..."
              className="w-full pl-9 pr-4 py-2 bg-[#f4f2ee] border border-transparent rounded-full text-xs text-[#121212] placeholder-[#8c857b] focus:outline-none focus:bg-white focus:border-[#d4ccbe] transition"
            />
            <Search className="w-3.5 h-3.5 text-[#8c857b] absolute left-3 pointer-events-none" />
          </form>

          {/* Right: User Icons & Cart */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Wishlist Link */}
            <Link
              href="/account/wishlist"
              className="p-2 text-[#222222] hover:text-black transition relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
            </Link>

            {/* Account dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 text-[#222222] hover:text-black transition"
                aria-label="Account"
              >
                <User className="w-5 h-5 stroke-[1.75]" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#e8e4dc] shadow-xl p-2 z-50 text-xs text-[#222222]">
                  <div className="px-3 py-2 border-b border-[#f0ece4] text-[10px] font-bold tracking-wider text-[#888888] uppercase">
                    Customer Account
                  </div>
                  <Link
                    href="/account/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-[#f7f5f0] transition text-[#222222]"
                  >
                    <Package className="w-4 h-4 text-emerald-600" />
                    <span>My Orders & Invoices</span>
                  </Link>
                  <Link
                    href="/account/wishlist"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-[#f7f5f0] transition text-[#222222]"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Saved Wishlist</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsAuthOpen(true);
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-[#f7f5f0] transition border-t border-[#f0ece4] mt-1 text-[#222222]"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Sign In / Register</span>
                  </button>
                </div>
              )}
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={openCart}
              className="p-2 text-[#222222] hover:text-black transition relative"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {totalItemsCount > 0 && (
                <span className="absolute 1 top-1 -right-0.5 bg-[#f97316] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#eae6df] bg-white px-6 py-6 space-y-4">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#f4f2ee] rounded-full text-xs text-[#121212] focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#8c857b] absolute left-3 top-2.5 pointer-events-none" />
            </form>

            <Link
              href="/shop?categorySlug=men"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#121212] uppercase tracking-wider"
            >
              Men
            </Link>
            <Link
              href="/shop?categorySlug=women"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#121212] uppercase tracking-wider"
            >
              Women
            </Link>
            <Link
              href="/shop?sort=newest"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#121212] uppercase tracking-wider"
            >
              New Arrivals
            </Link>
            <Link
              href="/shop?sort=featured"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#121212] uppercase tracking-wider"
            >
              Best Sellers
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#121212] uppercase tracking-wider"
            >
              Collections
            </Link>
            <Link
              href="/shop?collectionSlug=sale"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-rose-600 uppercase tracking-wider"
            >
              Sale
            </Link>

            <div className="pt-4 border-t border-[#eae6df] space-y-3 text-xs text-[#444444]">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-black transition"
              >
                About Luxe
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-black transition"
              >
                Contact Us
              </Link>
              <Link
                href="/account/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-emerald-600" />
                <span>My Orders & Invoices</span>
              </Link>
              <Link
                href="/account/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Saved Wishlist</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
