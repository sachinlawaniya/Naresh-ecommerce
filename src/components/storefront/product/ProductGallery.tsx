"use client";

import React, { useState } from "react";

interface ProductGalleryProps {
  images: Array<{ id?: string; url: string; altText?: string | null }>;
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const fallbackImages = [
    { url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85", altText: title },
    { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=85", altText: title },
  ];

  const galleryList = images.length > 0 ? images : fallbackImages;
  const [activeImage, setActiveImage] = useState(galleryList[0]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {galleryList.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[550px] pb-2 md:pb-0 scrollbar-none">
          {galleryList.map((img, idx) => (
            <button
              key={img.url + idx}
              onClick={() => setActiveImage(img)}
              className={`relative w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                activeImage.url === img.url
                  ? "border-[#121212] ring-2 ring-black/10"
                  : "border-transparent opacity-75 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt={img.altText || `${title} thumbnail ${idx + 1}`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85";
                }}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Feature Image */}
      <div className="flex-1 aspect-[3/4] rounded-3xl overflow-hidden bg-[#f4f2ee] border border-[#eae6df] relative group">
        <img
          src={activeImage.url}
          alt={activeImage.altText || title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85";
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>
    </div>
  );
}
