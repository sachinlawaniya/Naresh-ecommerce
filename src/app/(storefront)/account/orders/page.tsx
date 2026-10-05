"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  FileText,
  ChevronRight,
  Sparkles,
  MapPin,
} from "lucide-react";

export default function AccountOrdersPage() {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "delivered">("all");

  const orders = [
    {
      id: "ord-88392",
      orderNumber: "ORD-2026-88392",
      date: "Oct 04, 2026",
      status: "IN_TRANSIT",
      statusLabel: "In Transit — Out for Delivery",
      totalAmount: 3998,
      taxAmount: 312,
      invoiceNumber: "INV-2627-0042",
      deliveryAddress: "Indiranagar, 100ft Road, Bengaluru, Karnataka - 560038",
      items: [
        {
          title: "280 GSM Heavyweight Boxy T-Shirt",
          color: "Pitch Black",
          size: "L",
          quantity: 1,
          price: 1499,
          image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
        },
        {
          title: "Tailored Pleated Relaxed Trouser",
          color: "Charcoal Slate",
          size: "32",
          quantity: 1,
          price: 2499,
          image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
        },
      ],
      trackingSteps: [
        { label: "Order Confirmed", done: true, time: "Oct 04, 10:15 AM" },
        { label: "Quality Inspected & Packed", done: true, time: "Oct 04, 02:30 PM" },
        { label: "Dispatched via Bluedart Priority", done: true, time: "Oct 04, 06:45 PM" },
        { label: "Delivered", done: false, time: "Est. Tomorrow, Oct 05" },
      ],
    },
    {
      id: "ord-87120",
      orderNumber: "ORD-2026-87120",
      date: "Sep 28, 2026",
      status: "DELIVERED",
      statusLabel: "Delivered",
      totalAmount: 1899,
      taxAmount: 90,
      invoiceNumber: "INV-2627-0021",
      deliveryAddress: "Indiranagar, 100ft Road, Bengaluru, Karnataka - 560038",
      items: [
        {
          title: "Relaxed Heavy French Terry Cargo Lower",
          color: "Vintage Khaki",
          size: "M",
          quantity: 1,
          price: 1899,
          image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80",
        },
      ],
      trackingSteps: [
        { label: "Order Confirmed", done: true, time: "Sep 28, 11:00 AM" },
        { label: "Packed", done: true, time: "Sep 28, 03:20 PM" },
        { label: "Dispatched", done: true, time: "Sep 28, 08:00 PM" },
        { label: "Delivered to Doorstep", done: true, time: "Sep 30, 01:15 PM" },
      ],
    },
  ];

  const filteredOrders =
    activeTab === "all"
      ? orders
      : activeTab === "active"
        ? orders.filter((o) => o.status !== "DELIVERED")
        : orders.filter((o) => o.status === "DELIVERED");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#78716c] font-medium">
        <Link href="/" className="hover:text-[#121212] transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#121212] font-semibold">My Account & Orders</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eae6df]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8c857b] font-semibold">
            Client Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#121212] tracking-tight mt-1">
            Orders & Live Tracking
          </h1>
          <p className="text-xs sm:text-sm text-[#78716c] mt-1 font-light">
            Inspect real-time shipment milestones and download statutory GST tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#f5f2eb] p-1.5 rounded-full border border-[#eae6df]">
          {[
            { key: "all", label: "All Orders" },
            { key: "active", label: "In Transit" },
            { key: "delivered", label: "Delivered" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${activeTab === tab.key
                  ? "bg-[#121212] text-white shadow-sm"
                  : "text-[#57534e] hover:text-[#121212]"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-8">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="rounded-3xl bg-white border border-[#eae6df] p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition"
          >
            {/* Top Bar: Order ID, Date, Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eae6df]">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-[#121212] font-mono">
                    {order.orderNumber}
                  </span>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${order.status === "DELIVERED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                  >
                    {order.statusLabel}
                  </span>
                </div>
                <p className="text-xs text-[#78716c] font-light">
                  Placed on {order.date} • Total: <strong className="text-[#121212] font-medium">{formatCurrency(order.totalAmount)}</strong> (Incl. {formatCurrency(order.taxAmount)} GST)
                </p>
              </div>

              {/* GST Invoice Downloader Action */}
              <button
                onClick={() => alert(`Downloading Statutory GST Tax Invoice ${order.invoiceNumber}`)}
                className="px-4 py-2 rounded-full bg-[#f5f2eb] hover:bg-[#eae6df] text-[#121212] text-xs font-medium flex items-center gap-2 border border-[#eae6df] transition"
              >
                <FileText className="w-4 h-4 text-[#8c857b]" />
                <span>GST Tax Invoice ({order.invoiceNumber})</span>
              </button>
            </div>

            {/* Tracking Milestones Bar */}
            <div className="py-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#78716c] mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#121212]" /> Real-Time Delivery Milestones
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {order.trackingSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition ${step.done
                        ? "bg-[#f5f2eb] border-[#e5e0d8] text-[#121212]"
                        : "bg-[#fafaf8] border-[#eae6df] text-[#a8a29e]"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      {step.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#a8a29e] flex-shrink-0" />
                      )}
                      <p className="text-xs font-medium text-[#121212]">{step.label}</p>
                    </div>
                    <p className="text-[10px] text-[#78716c] mt-1">{step.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Items in Order */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#78716c]">
                Items in Shipment ({order.items.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#fafaf8] border border-[#eae6df]"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80";
                      }}
                      className="w-16 h-16 rounded-xl object-cover border border-[#eae6df] flex-shrink-0 bg-[#f0ebe1]"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="font-medium text-xs text-[#121212] line-clamp-1">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-[#78716c] mt-0.5 font-light">
                        {item.color} • Size {item.size} • Qty: {item.quantity}
                      </p>
                      <p className="text-xs font-bold text-[#121212] mt-1">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="pt-2 flex items-center gap-2 text-xs text-[#78716c]">
              <MapPin className="w-4 h-4 text-[#8c857b] flex-shrink-0" />
              <span>Shipped to: <strong className="text-[#121212] font-medium">{order.deliveryAddress}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Wardrobe CTA */}
      <section className="rounded-3xl bg-[#f5f2eb] p-8 sm:p-12 border border-[#e5e0d8] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c857b] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#121212]" /> LUXE Member Benefit
          </span>
          <h3 className="text-2xl font-serif font-bold text-[#121212] mt-1">
            Looking for New Arrivals & Fresh Drops?
          </h3>
          <p className="text-xs sm:text-sm text-[#57534e] mt-1 font-light">
            Use code <strong className="text-[#121212] font-semibold">REPEAT15</strong> at checkout for 15% instant loyalty savings.
          </p>
        </div>

        <Link
          href="/shop"
          className="px-8 py-3.5 bg-[#121212] hover:bg-black text-white font-medium text-xs uppercase tracking-wider rounded-full shadow-md transition transform active:scale-95 flex items-center gap-2 flex-shrink-0"
        >
          <span>Shop New Arrivals</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
