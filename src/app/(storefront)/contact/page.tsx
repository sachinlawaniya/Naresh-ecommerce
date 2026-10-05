"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  MapPin,
  ShieldCheck,
  Send,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { env } from "@/config/env";
import { useToast } from "@/components/storefront/ui/ToastProvider";

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "order_support",
    orderNumber: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast(
        "success",
        "Inquiry Received",
        "Our customer care team will respond within 4 business hours."
      );
    }, 800);
  };

  const faqs = [
    {
      q: "How long does delivery take to my PIN code?",
      a: "Orders placed before 2:00 PM IST undergo same-day dispatch. Metro deliveries arrive within 24-48 hours, while other regions take 3-4 business days across 19,000+ Indian PIN codes.",
    },
    {
      q: "How does the 7-day doorstep return & size exchange work?",
      a: "If your item does not fit as desired, initiate an exchange from your Order Portal or email us. We arrange doorstep pickup and dispatch the revised size at zero extra cost.",
    },
    {
      q: "Can I receive a B2B Statutory GST Tax Invoice for my business?",
      a: "Yes. During checkout, provide your company name and GSTIN. An itemized GST invoice with HSN classification (6109 / 6203) will be automatically generated upon order dispatch for claiming input tax credit (ITC).",
    },
    {
      q: "What are the wash care instructions for 280 GSM cotton?",
      a: "Machine wash cold inside out with like colors. Avoid bleach or heavy tumble dry. Low steam iron on reverse. Our reactive bio-washed cotton is pre-shrunk for shape retention.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 bg-[#fafaf8] text-[#121212]">
      
      {/* 1. HEADER */}
      <div className="relative rounded-3xl overflow-hidden bg-[#ebe6dd] border border-[#dfd8cb] p-8 sm:p-12 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#78716c] font-sans">
            CUSTOMER CARE & CONCIERGE —
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#121212]">
            How May We Help You?
          </h1>
          <p className="text-[#57534e] text-xs sm:text-sm font-light leading-relaxed max-w-2xl">
            Whether you need fit recommendations, order tracking assistance, statutory GST billing clarification, or wholesale inquiries, our team is at your service.
          </p>
        </div>
      </div>

      {/* 2. MAIN GRID: CONTACT FORM + INFO PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#eae6df] rounded-3xl p-8 sm:p-10 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-[#121212]">
            Send an Inquiry
          </h2>
          <p className="text-xs text-[#78716c] mb-6 font-light mt-0.5">
            Average response time: Under 4 business hours.
          </p>

          {isSubmitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#f4f2ee] flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#121212]">Inquiry Received</h3>
              <p className="text-xs text-[#57534e] max-w-sm mx-auto font-light">
                Thank you for reaching out. A customer support specialist will follow up via email shortly.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    inquiryType: "order_support",
                    orderNumber: "",
                    message: "",
                  });
                }}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#121212] text-xs font-semibold text-white hover:bg-black transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#121212]">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 bg-[#f9f8f6] border border-[#e5e0d8] rounded-xl text-xs text-[#121212] placeholder-[#8c857b] focus:outline-none focus:bg-white focus:border-black transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#121212]">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rahul@example.com"
                    className="w-full px-4 py-2.5 bg-[#f9f8f6] border border-[#e5e0d8] rounded-xl text-xs text-[#121212] placeholder-[#8c857b] focus:outline-none focus:bg-white focus:border-black transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#121212]">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 bg-[#f9f8f6] border border-[#e5e0d8] rounded-xl text-xs text-[#121212] placeholder-[#8c857b] focus:outline-none focus:bg-white focus:border-black transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#121212]">
                    Inquiry Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#f9f8f6] border border-[#e5e0d8] rounded-xl text-xs text-[#121212] focus:outline-none focus:bg-white focus:border-black transition"
                  >
                    <option value="order_support">Active Order & Tracking</option>
                    <option value="size_exchange">7-Day Size Exchange & Return</option>
                    <option value="gst_invoice">B2B GST Tax Invoice & ITC Query</option>
                    <option value="fit_advice">Fabric & Fit Consultation</option>
                    <option value="wholesale">Bulk & Wholesale Purchase</option>
                  </select>
                </div>
              </div>

              {formData.inquiryType === "order_support" && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#121212]">
                    Order Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="e.g. ORD-2026-84920"
                    className="w-full px-4 py-2.5 bg-[#f9f8f6] border border-[#e5e0d8] rounded-xl text-xs text-[#121212] placeholder-[#8c857b] focus:outline-none focus:bg-white focus:border-black transition font-mono"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#121212]">
                  Detailed Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you today?"
                  className="w-full px-4 py-2.5 bg-[#f9f8f6] border border-[#e5e0d8] rounded-xl text-xs text-[#121212] placeholder-[#8c857b] focus:outline-none focus:bg-white focus:border-black transition leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-full bg-[#121212] hover:bg-black text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right: Direct Channels & Hub Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#eae6df] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#121212] flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Direct Support Channels</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#f4f2ee] text-[#121212]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#121212]">Email Inquiries</div>
                  <a
                    href="mailto:concierge@luxevogue.com"
                    className="text-[#57534e] hover:text-black transition mt-0.5 block"
                  >
                    concierge@luxevogue.com
                  </a>
                  <div className="text-[10px] text-[#888888] mt-0.5">Mon–Sat, 10:00 AM – 7:00 PM IST</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#f4f2ee] text-[#121212]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#121212]">Central Logistics Centre</div>
                  <div className="text-[#57534e] mt-0.5 font-light">
                    Luxe Vogue Logistics Hub, {env.NEXT_PUBLIC_STORE_ORIGIN_STATE || env.STORE_ORIGIN_STATE}, India
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#f4f2ee] text-[#121212]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#121212]">Statutory Tax Registration</div>
                  <div className="text-[#57534e] font-mono mt-0.5">
                    GSTIN: {env.NEXT_PUBLIC_STORE_GSTIN || env.STORE_GSTIN}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f7f5f0] border border-[#eae6df] rounded-3xl p-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212]">Self-Service Portals</h4>
            <div className="space-y-2">
              <Link
                href="/account/orders"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#eae6df] text-xs text-[#57534e] hover:text-black transition"
              >
                <span>Track Active Order</span>
                <span className="font-bold">→</span>
              </Link>
              <Link
                href="/account/orders"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#eae6df] text-xs text-[#57534e] hover:text-black transition"
              >
                <span>Download GST Tax Invoices</span>
                <span className="font-bold">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto space-y-6 pt-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#78716c]">
            INSTANT ANSWERS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#121212]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-[#eae6df] overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-[#121212] hover:text-black transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#78716c] flex-shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-[#57534e] leading-relaxed font-light border-t border-[#f0ece4] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
