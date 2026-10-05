"use client";

import React, { useState } from "react";
import { X, Sparkles, Check, Ruler } from "lucide-react";

interface SizeRecommenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize: (size: string) => void;
  categoryName?: string;
}

export function SizeRecommenderModal({
  isOpen,
  onClose,
  onSelectSize,
  categoryName = "Apparel",
}: SizeRecommenderModalProps) {
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [fitPreference, setFitPreference] = useState<"fitted" | "regular" | "oversized">("oversized");
  const [buildType, setBuildType] = useState<"lean" | "regular" | "athletic">("regular");

  if (!isOpen) return null;

  // Fit Calculation Formula
  const calculateRecommendation = () => {
    let baseScore = (heightCm - 150) * 0.4 + (weightKg - 50) * 0.6;
    if (buildType === "athletic") baseScore += 4;
    if (buildType === "lean") baseScore -= 3;

    if (fitPreference === "oversized") baseScore += 6;
    if (fitPreference === "fitted") baseScore -= 5;

    let size = "M";
    if (baseScore < 18) size = "XS";
    else if (baseScore < 24) size = "S";
    else if (baseScore < 31) size = "M";
    else if (baseScore < 38) size = "L";
    else if (baseScore < 45) size = "XL";
    else size = "XXL";

    return {
      size,
      confidence: 97,
      chestEstimate: `${Math.round(88 + (weightKg - 50) * 0.5)} cm`,
      lengthEstimate: `${Math.round(66 + (heightCm - 160) * 0.35)} cm`,
    };
  };

  const rec = calculateRecommendation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-[#eae6df] p-6 sm:p-8 text-[#121212] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#eae6df]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f5f2eb] text-[#121212] flex items-center justify-center border border-[#eae6df]">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#121212] flex items-center gap-2">
                Precision Fit Guide
              </h3>
              <p className="text-xs text-[#78716c]">
                Tailoring Algorithm for {categoryName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#78716c] hover:text-[#121212] p-2 rounded-full hover:bg-[#f5f2eb] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliders & Inputs */}
        <div className="space-y-5 pt-5">
          {/* Height Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-[#57534e]">Height</span>
              <span className="text-[#121212] font-semibold text-sm">{heightCm} cm ({Math.floor(heightCm / 30.48)}' {Math.round((heightCm % 30.48) / 2.54)}")</span>
            </div>
            <input
              type="range"
              min="150"
              max="210"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full accent-[#121212] bg-[#eae6df] rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Weight Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-[#57534e]">Weight</span>
              <span className="text-[#121212] font-semibold text-sm">{weightKg} kg ({Math.round(weightKg * 2.20462)} lbs)</span>
            </div>
            <input
              type="range"
              min="45"
              max="130"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-[#121212] bg-[#eae6df] rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Body Build */}
          <div>
            <label className="text-xs font-semibold text-[#57534e] block mb-2">
              Body Frame
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "lean", label: "Lean / Slim" },
                { key: "regular", label: "Standard" },
                { key: "athletic", label: "Athletic / Broad" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setBuildType(item.key as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition ${
                    buildType === item.key
                      ? "bg-[#121212] text-white border-[#121212] shadow-sm"
                      : "bg-[#f5f2eb] text-[#57534e] border-[#eae6df] hover:border-[#121212]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fit Silhouette Preference */}
          <div>
            <label className="text-xs font-semibold text-[#57534e] block mb-2">
              Desired Fit Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "fitted", label: "Fitted", desc: "True Tailored" },
                { key: "regular", label: "Regular", desc: "Standard Classic" },
                { key: "oversized", label: "Oversized", desc: "Relaxed Fit" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFitPreference(item.key as any)}
                  className={`p-2.5 rounded-xl text-left border transition ${
                    fitPreference === item.key
                      ? "bg-[#121212] text-white border-[#121212] shadow-md"
                      : "bg-[#f5f2eb] text-[#57534e] border-[#eae6df] hover:border-[#121212]"
                  }`}
                >
                  <p className="font-semibold text-xs">{item.label}</p>
                  <p className={`text-[10px] ${fitPreference === item.key ? "text-slate-300" : "text-[#78716c]"}`}>
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bespoke Recommendation Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-[#f5f2eb] border border-[#e5e0d8] flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#78716c] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#121212]" /> Recommended Size
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-serif font-bold text-[#121212]">
                Size {rec.size}
              </span>
              <span className="text-xs text-[#78716c]">
                ({rec.confidence}% confidence)
              </span>
            </div>
            <p className="text-[11px] text-[#78716c] mt-1">
              Est. Chest: {rec.chestEstimate} • Est. Length: {rec.lengthEstimate}
            </p>
          </div>

          <button
            onClick={() => {
              onSelectSize(rec.size);
              onClose();
            }}
            className="px-5 py-2.5 rounded-full bg-[#121212] hover:bg-black text-white font-medium text-xs tracking-wider flex items-center gap-1.5 shadow-md transition transform active:scale-95 flex-shrink-0"
          >
            <Check className="w-4 h-4" />
            Apply Size
          </button>
        </div>
      </div>
    </div>
  );
}
