"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  Sparkles,
  Quote,
  ThumbsUp,
  Camera,
  ArrowRight,
  Plus,
  X,
  Check,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/components/storefront/ui/ToastProvider";

interface ReviewItem {
  id: string;
  author: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  productTitle: string;
  productCategory: string;
  productImage: string;
  fitFeedback: string;
  comment: string;
  helpfulCount: number;
  isCelebrity?: boolean;
  date: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-celeb-1",
    author: "Kabir Sen",
    role: "Celebrity Fashion Stylist (GQ India Contributor)",
    location: "Bandra West, Mumbai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    rating: 5,
    productTitle: "280 GSM Heavyweight Boxy T-Shirt",
    productCategory: "T-Shirts",
    productImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
    fitFeedback: "Haute Drop-Shoulder • Size L",
    comment:
      "I've styled Bollywood shoots with Balenciaga and Fear of God, but the collar density and structured 280 GSM fall of 's boxy tee matches luxury European fashion houses at a fraction of the cost. The ribbed neck doesn't stretch or wave.",
    helpfulCount: 84,
    isCelebrity: true,
    date: "2 days ago",
  },
  {
    id: "rev-2",
    author: "Aditya Nambiar",
    role: "Architect & Creative Director",
    location: "Indiranagar, Bengaluru",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    rating: 5,
    productTitle: "Tailored Pleated Relaxed Italian Trouser",
    productCategory: "Trousers",
    productImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
    fitFeedback: "Tailored Wide Drape • Size 32",
    comment:
      "The pleating architecture is pure art. It flows gracefully over boots and chunky sneakers. Clean statutory GST invoice arrived instantly via email for corporate expense claim. Ordered 3 more colorways immediately.",
    helpfulCount: 42,
    date: "4 days ago",
  },
  {
    id: "rev-3",
    author: "Devang Sharma",
    role: "Tech Founder & Streetwear Enthusiast",
    location: "Cyber City, Gurugram",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    rating: 5,
    productTitle: "Relaxed Heavy French Terry Cargo Lower",
    productCategory: "Lowers & Pants",
    productImage: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80",
    fitFeedback: "True to Size • Size M",
    comment:
      "The loopback French terry interior is softer than any sweatpants I own. 6 deep utility pockets that don't sag when carrying iPhone and heavy wallet. 48-hour delivery to Gurugram was lightning fast.",
    helpfulCount: 37,
    date: "1 week ago",
  },
  {
    id: "rev-celeb-2",
    author: "Zoya Merchant",
    role: "Haute Streetwear Curator",
    location: "Jubilee Hills, Hyderabad",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
    rating: 5,
    productTitle: "Architectural Oversized Mock-Neck Tee",
    productCategory: "T-Shirts",
    productImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    fitFeedback: "Slightly Roomy • Size S",
    comment:
      "The silhouette holds its boxy geometry throughout the whole day without creasing. The double-needle seams and silicon wash make it look like a high-end runway piece. Truly world-class quality.",
    helpfulCount: 56,
    isCelebrity: true,
    date: "1 week ago",
  },
  {
    id: "rev-5",
    author: "Varun Singhania",
    role: "Verified VIP Collector",
    location: "Alipore, Kolkata",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80",
    rating: 5,
    productTitle: "Heavyweight Relaxed French Terry Lower",
    productCategory: "Lowers & Pants",
    productImage: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80",
    fitFeedback: "Perfect Fit • Size L",
    comment:
      "Substantial 380 GSM weight without being stifling. Breathable high-grade cotton loops. You can immediately feel the craftsmanship difference compared to standard fast fashion.",
    helpfulCount: 29,
    date: "2 weeks ago",
  },
];

export function TestimonialShowcase() {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // Review Form State
  const [newName, setNewName] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCategory, setNewCategory] = useState("T-Shirts");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [newFit, setNewFit] = useState("Perfect Oversized Fit");

  const filteredReviews =
    selectedCategory === "all"
      ? reviews
      : selectedCategory === "celebrity"
        ? reviews.filter((r) => r.isCelebrity)
        : reviews.filter((r) => r.productCategory.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleLike = (id: string) => {
    if (likedReviews[id]) return;
    setLikedReviews((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    showToast("success", "Feedback Recorded", "Thank you for acknowledging verified client review.");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newComment) return;

    const newRev: ReviewItem = {
      id: `rev-user-${Date.now()}`,
      author: newName,
      role: "Verified  Client",
      location: newCity || "India",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
      rating: newRating,
      productTitle: `280 GSM Heavyweight ${newCategory}`,
      productCategory: newCategory,
      productImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
      fitFeedback: newFit,
      comment: newComment,
      helpfulCount: 1,
      date: "Just now",
    };

    setReviews([newRev, ...reviews]);
    setIsWriteModalOpen(false);
    setNewName("");
    setNewCity("");
    setNewComment("");
    showToast("success", "Review Submitted", "Your verified testimonial has been added to the hall of fame!");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* 1. SECTION HEADER WITH STATS */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-6 border-b border-slate-800">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VOICE OF HAUTE CLIENTELE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
            Client Impressions & Reviews
          </h2>
          <p className="text-slate-400 text-xs sm:text-base max-w-2xl font-light leading-relaxed">
            Rated <strong className="text-white font-mono">4.9 / 5.0</strong> across 18,400+ delivered luxury orders in India. Hear from celebrity stylists, architects, and discerning collectors.
          </p>
        </div>

        {/* Action Button & Overall Score Badge */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-5 py-3 rounded-2xl">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <div className="border-l border-slate-800 pl-3">
              <span className="text-sm font-black text-white font-mono">4.9 / 5.0</span>
              <p className="text-[10px] text-slate-400">98% Fit Accuracy</p>
            </div>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-500/20 transition transform active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Write A Review</span>
          </button>
        </div>
      </div>

      {/* 2. CATEGORY TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: "all", label: "All Reviews (148)" },
          { key: "celebrity", label: "Celebrity & Stylists" },
          { key: "t-shirts", label: "280 GSM T-Shirts" },
          { key: "trousers", label: "Italian Trousers" },
          { key: "lowers", label: "French Terry Lowers & Cargos" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedCategory(tab.key)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition flex-shrink-0 ${selectedCategory === tab.key
                ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. REVIEWS MASONRY / GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between border transition duration-300 ${rev.isCelebrity
                ? "bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 border-emerald-500/40 shadow-2xl relative"
                : "bg-slate-900/80 border-slate-800/90 hover:border-slate-700"
              }`}
          >
            {/* Top Row: Author & Rating */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/30 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-white">{rev.author}</h4>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{rev.role}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{rev.location}</p>
                  </div>
                </div>

                <div className="flex text-amber-400 flex-shrink-0">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              {/* Tagged Product Pill */}
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80">
                <img
                  src={rev.productImage}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white line-clamp-1">
                    {rev.productTitle}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-mono">
                    {rev.fitFeedback}
                  </p>
                </div>
              </div>

              {/* Comment */}
              <div className="relative pt-1">
                <Quote className="w-5 h-5 text-slate-700 absolute -top-1 -left-1 opacity-40" />
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed pl-4">
                  "{rev.comment}"
                </p>
              </div>
            </div>

            {/* Bottom Bar: Helpful Button & Date */}
            <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[10px] font-mono text-slate-500">{rev.date}</span>

              <button
                onClick={() => handleLike(rev.id)}
                className={`flex items-center gap-1.5 text-xs transition px-3 py-1 rounded-xl ${likedReviews[rev.id]
                    ? "bg-emerald-500/20 text-emerald-400 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({rev.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. HIGH-CONVERTING SOCIAL PROOF BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-8 sm:p-12 border border-emerald-500/30 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 text-center lg:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-1.5 justify-center lg:justify-start">
            <Sparkles className="w-3.5 h-3.5" />  Luxury Guarantee
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-white">
            Experience The 280 GSM Heavyweight Standard
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Join 18,400+ dressed in our architectural garments with 7-day doorstep size exchange and genuine GST tax credit invoices.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2 flex-shrink-0"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 5. INTERACTIVE WRITE A REVIEW MODAL */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-lg text-white">Share Your Client Experience</h3>
                <p className="text-xs text-slate-400">Help the community discover the perfect fit.</p>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun Kapoor"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    City / State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, MH"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Garment Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-400"
                  >
                    <option value="T-Shirts">280 GSM T-Shirts</option>
                    <option value="Trousers">Italian Pleated Trousers</option>
                    <option value="Lowers">French Terry Lowers & Cargos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Rating
                </label>
                <div className="flex gap-2 text-amber-400">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewRating(num)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${num <= newRating ? "fill-current text-amber-400" : "text-slate-700"
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Fit Feedback
                </label>
                <input
                  type="text"
                  placeholder="e.g. Perfect Boxy Oversized • Size L"
                  value={newFit}
                  onChange={(e) => setNewFit(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Your Detailed Review
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the fabric weight, collar feel, stitching, and drape..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
                >
                  Submit Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
