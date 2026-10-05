import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Scale,
  UserCheck,
  FileText,
} from "lucide-react";
import { env } from "@/config/env";

export const metadata = {
  title: "Privacy & Data Protection Policy | LUXE",
  description:
    "Statutory Privacy Policy and data protection standards governing customer information, payment encryption, and GST tax invoice generation at LUXE.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 2026";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* 1. HEADER */}
      <div className="relative rounded-3xl overflow-hidden bg-[#f5f2eb] border border-[#e5e0d8] p-8 sm:p-14 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#eae6df] text-[#121212] text-xs font-semibold uppercase tracking-wider shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#8c857b]" />
          <span>Statutory Privacy & Trust Framework</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#121212] tracking-tight">
          Privacy & Data Governance Policy
        </h1>
        <p className="text-[#57534e] text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
          This document outlines how LUXE collects, protects, tokenizes, and processes client information in accordance with the Information Technology Act, 2000 (India) and statutory GST compliance regulations.
        </p>
        <div className="text-xs text-[#8c857b] pt-2">
          Last Updated & Verified: {lastUpdated} • Origin Hub: {env.NEXT_PUBLIC_STORE_ORIGIN_STATE || env.STORE_ORIGIN_STATE || "Karnataka"}, India
        </div>
      </div>

      {/* 2. SUMMARY HIGHLIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#eae6df] space-y-3 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-xl bg-[#f5f2eb] text-[#121212] border border-[#eae6df] flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-[#121212] text-base">256-Bit SSL & Tokenized Pay</h3>
          <p className="text-xs sm:text-sm text-[#57534e] font-light leading-relaxed">
            Zero raw card or CVV details are stored on our servers. All transactions are securely routed through PCI-DSS certified gateways.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#eae6df] space-y-3 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-xl bg-[#f5f2eb] text-[#121212] border border-[#eae6df] flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-[#121212] text-base">Statutory GST Record Keeping</h3>
          <p className="text-xs sm:text-sm text-[#57534e] font-light leading-relaxed">
            Customer billing details and GSTINs are processed strictly to fulfill statutory tax invoicing under Central and State GST Acts.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#eae6df] space-y-3 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-xl bg-[#f5f2eb] text-[#121212] border border-[#eae6df] flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-[#121212] text-base">Zero Data Brokering</h3>
          <p className="text-xs sm:text-sm text-[#57534e] font-light leading-relaxed">
            We never rent, monetize, or sell client information to third-party advertising brokers or unsolicited telemarketers.
          </p>
        </div>
      </div>

      {/* 3. POLICY CLAUSES */}
      <div className="bg-white border border-[#eae6df] rounded-3xl p-8 sm:p-12 space-y-10 text-[#57534e] text-xs sm:text-sm leading-relaxed font-light shadow-sm">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#121212] flex items-center gap-2">
            <span className="text-[#8c857b]">01.</span> Information We Collect
          </h2>
          <p>
            When you interact with LUXE, browse our curated apparel catalog, or execute an acquisition, we collect the following classes of data:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[#78716c]">
            <li><strong className="text-[#121212]">Identity & Contact Data:</strong> Name, shipping address, billing address, phone/WhatsApp number, and email address.</li>
            <li><strong className="text-[#121212]">Commercial & Statutory Tax Data:</strong> Company name, Place of Supply, and Goods & Services Tax Identification Number (GSTIN) when requested for business input tax credit invoices.</li>
            <li><strong className="text-[#121212]">Transaction Logs:</strong> Order numbers, itemized variant SKUs (size, color, GSM specifications), transaction totals, and payment authorization reference tokens.</li>
            <li><strong className="text-[#121212]">Technical Device Telemetry:</strong> IP address, browser type, operating system, and approximate geographic zone for fraudulent transaction mitigation and cache performance.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 border-t border-[#eae6df] pt-8">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#121212] flex items-center gap-2">
            <span className="text-[#8c857b]">02.</span> Lawful Purpose & Processing
          </h2>
          <p>We process personal and transactional data solely for the following legitimate business operations:</p>
          <ul className="list-disc pl-5 space-y-2 text-[#78716c]">
            <li>Processing apparel acquisitions and maintaining stock reservation integrity across our central logistics hubs.</li>
            <li>Generating statutory GST-compliant B2B/B2C tax invoices under HSN chapters 6109 and 6203.</li>
            <li>Dispatching real-time SMS/Email order status milestones and airway bill (AWB) tracking links.</li>
            <li>Administering our 7-Day Doorstep Size Exchange and customer support requests.</li>
            <li>Preventing fraudulent card transactions through automated signature verification.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 border-t border-[#eae6df] pt-8">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#121212] flex items-center gap-2">
            <span className="text-[#8c857b]">03.</span> Payment Processing & Financial Security
          </h2>
          <p>
            Payment transactions on LUXE are tokenized using bank-grade 256-bit encryption. We partner with Tier-1 RBI-authorized payment aggregators (including Razorpay, UPI, Net Banking, and Visa/Mastercard/RuPay networks).
          </p>
          <p className="text-[#78716c]">
            LUXE does not view, record, or retain payment card numbers, UPI PINs, CVV codes, or net banking credentials on our infrastructure.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-t border-[#eae6df] pt-8">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#121212] flex items-center gap-2">
            <span className="text-[#8c857b]">04.</span> Sharing with Trusted Service Partners
          </h2>
          <p>We disclose relevant shipping and delivery coordinates only to vetted third-party service providers required for fulfillment:</p>
          <ul className="list-disc pl-5 space-y-2 text-[#78716c]">
            <li><strong className="text-[#121212]">Express Air Courier Partners:</strong> Name, contact phone, and delivery PIN code for courier routing and doorstep delivery verification.</li>
            <li><strong className="text-[#121212]">Government & Statutory Tax Portals:</strong> B2B GSTIN and invoice tax amounts as mandated by GST e-invoicing and statutory audit protocols.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 border-t border-[#eae6df] pt-8">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#121212] flex items-center gap-2">
            <span className="text-[#8c857b]">05.</span> Client Rights & Data Portability
          </h2>
          <p>
            Under prevailing Indian data protection regulations, you are entitled to inspect, rectify, or request deletion of your client profile and saved addresses. You may also opt out of promotional communications at any time via the unsubscribe mechanism or by contacting our concierge.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 border-t border-[#eae6df] pt-8">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#121212] flex items-center gap-2">
            <span className="text-[#8c857b]">06.</span> Statutory Grievance Redressal & Contact
          </h2>
          <p>
            In accordance with the Information Technology Act 2000 and rules made thereunder, the contact details of the Grievance Officer are provided below:
          </p>
          <div className="p-6 rounded-2xl bg-[#f5f2eb] border border-[#e5e0d8] text-xs sm:text-sm text-[#121212] space-y-1.5">
            <div><strong className="font-semibold">Designation:</strong> Data Protection & Grievance Officer</div>
            <div><strong className="font-semibold">Entity:</strong> LUXE PVT. LTD.</div>
            <div><strong className="font-semibold">Email:</strong> privacy@luxeclothing.com</div>
            <div><strong className="font-semibold">GSTIN:</strong> {env.NEXT_PUBLIC_STORE_GSTIN || env.STORE_GSTIN || "29AABCL1234F1Z5"}</div>
            <div><strong className="font-semibold">Origin State:</strong> {env.NEXT_PUBLIC_STORE_ORIGIN_STATE || env.STORE_ORIGIN_STATE || "Karnataka"}, India</div>
          </div>
        </section>

      </div>

      {/* 4. FOOTER CALLOUT */}
      <div className="text-center pt-4">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#121212] hover:text-[#57534e] transition underline underline-offset-4"
        >
          <span>Have Questions Regarding Your Data? Contact Our Concierge →</span>
        </Link>
      </div>

    </div>
  );
}
