"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/storefront/auth/LoginForm";
import { RegisterForm } from "@/components/storefront/auth/RegisterForm";
import { Sparkles, Shield, ArrowLeft, Loader2 } from "lucide-react";

function LoginContent() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";

  const handleSuccess = () => {
    router.push(returnTo);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Store</span>
      </Link>

      {/* Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-1.5 mb-6">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-400">
            LUXURY PORTAL
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">
            {activeTab === "login" ? "Client Authentication" : "Create Bespoke Account"}
          </h1>
          <p className="text-xs text-slate-400">
            Access your order timeline, statutory GST tax invoices, and saved vault.
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === "login"
                ? "bg-emerald-400 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === "register"
                ? "bg-emerald-400 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Register
          </button>
        </div>

        {/* Auth Form */}
        {activeTab === "login" ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} />
        )}

        {/* Security Guarantee */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[10px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit Encrypted Statutory Authentication</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="flex items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            <span className="text-xs">Loading secure portal...</span>
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}
