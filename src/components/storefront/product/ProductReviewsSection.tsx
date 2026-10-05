"use client";

import React, { useState } from "react";
import { Star, CheckCircle, ThumbsUp } from "lucide-react";

interface ProductReviewsSectionProps {
  productTitle: string;
}

export function ProductReviewsSection({ productTitle }: ProductReviewsSectionProps) {
  const reviews = [
    {
      id: "rev-1",
      author: "Aditya Verma",
      location: "Bengaluru, KA",
      rating: 5,
      date: "2 days ago",
      verified: true,
      fit: "Spot on Oversized",
      heightWeight: "182 cm • 76 kg • Size L",
      title: "Insane 280 GSM quality — matches $300 international brands",
      comment:
        "The fabric drape is heavy and structured. The ribbed collar doesn't sag after washing. Truly mindblowing quality for an Indian luxury brand.",
      images: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80",
      ],
      helpfulCount: 28,
    },
    {
      id: "rev-2",
      author: "Rohan Singhal",
      location: "Mumbai, MH",
      rating: 5,
      date: "1 week ago",
      verified: true,
      fit: "True to Size",
      heightWeight: "175 cm • 70 kg • Size M",
      title: "Flawless GST invoice & 48h doorstep delivery",
      comment:
        "Got my business GST invoice instantly with valid HSN code for tax input. The silhouette is immaculate. Already ordered two more colorways.",
      images: [],
      helpfulCount: 14,
    },
    {
      id: "rev-3",
      author: "Karan Malhotra",
      location: "Delhi, DL",
      rating: 5,
      date: "2 weeks ago",
      verified: true,
      fit: "Slightly Roomy",
      heightWeight: "188 cm • 85 kg • Size XL",
      title: "Best cargo/trousers finish I've worn this season",
      comment:
        "Stitching precision is 10/10. YKK zippers and deep utility pockets without looking bulky. The French terry interior feels comfortable.",
      images: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80",
      ],
      helpfulCount: 19,
    },
  ];

  return (
    <section className="my-16 border-t border-[#eae6df] pt-16">
      <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
        {/* Left Rating Overview */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-[#f5f2eb] border border-[#e5e0d8] p-6 sm:p-8 rounded-3xl">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-serif font-bold text-[#121212]">4.9</span>
            <div>
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#78716c] mt-0.5">Based on 148 verified orders</p>
            </div>
          </div>

          {/* Fit Stats Breakdown */}
          <div className="mt-6 space-y-3 pt-4 border-t border-[#eae6df]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#121212]">
              Silhouette & Fit Feedback
            </h4>

            <div>
              <div className="flex justify-between text-xs text-[#57534e] mb-1">
                <span>True to Luxe Fit</span>
                <span className="font-semibold text-[#121212]">97%</span>
              </div>
              <div className="w-full h-1.5 bg-[#e5e0d8] rounded-full overflow-hidden">
                <div className="h-full bg-[#121212] rounded-full" style={{ width: "97%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#57534e] mb-1">
                <span>280 GSM Premium Softness</span>
                <span className="font-semibold text-[#121212]">99%</span>
              </div>
              <div className="w-full h-1.5 bg-[#e5e0d8] rounded-full overflow-hidden">
                <div className="h-full bg-[#121212] rounded-full" style={{ width: "99%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#57534e] mb-1">
                <span>Wash Color Retention</span>
                <span className="font-semibold text-[#121212]">98%</span>
              </div>
              <div className="w-full h-1.5 bg-[#e5e0d8] rounded-full overflow-hidden">
                <div className="h-full bg-[#121212] rounded-full" style={{ width: "98%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Reviews List */}
        <div className="flex-1 w-full space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#eae6df]">
            <h3 className="text-xl font-serif font-bold text-[#121212] flex items-center gap-2">
              Verified Client Impressions
              <span className="px-2.5 py-0.5 rounded-full bg-[#f5f2eb] border border-[#e5e0d8] text-[#121212] text-[11px] font-semibold">
                100% AUTHENTIC
              </span>
            </h3>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-white border border-[#eae6df] hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#121212]">{rev.author}</span>
                      {rev.verified && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8c857b] mt-0.5">
                      {rev.location} • {rev.date} • {rev.heightWeight}
                    </p>
                  </div>

                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <h4 className="font-semibold text-sm text-[#121212] mt-3">{rev.title}</h4>
                <p className="text-xs sm:text-sm text-[#57534e] mt-1 leading-relaxed font-light">{rev.comment}</p>

                {rev.images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {rev.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Customer photo"
                        className="w-16 h-16 rounded-xl object-cover border border-[#eae6df]"
                      />
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-[#eae6df] flex items-center justify-between text-[11px] text-[#78716c]">
                  <span className="px-2 py-0.5 rounded-md bg-[#f5f2eb] border border-[#e5e0d8] text-[#121212]">
                    Fit: {rev.fit}
                  </span>
                  <button className="flex items-center gap-1.5 hover:text-[#121212] transition">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({rev.helpfulCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
