"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterDto, RegisterDtoSchema } from "@/modules/auth/dtos/auth.dto";
import { Loader2, Mail, Lock, User, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>({
    resolver: zodResolver(RegisterDtoSchema),
  });

  const onSubmit = async (data: RegisterDto) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Call backend API route
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resJson = await response.json();

      if (!response.ok || !resJson.success) {
        setErrorMessage(resJson.error?.message || "Registration failed");
        return;
      }

      // Auto sign-in with Supabase on frontend
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1200);
    } catch (err) {
      setErrorMessage("Network error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-[#eae6df] text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4 animate-bounce" />
        <h3 className="text-xl font-serif font-bold text-[#121212]">
          Account Created!
        </h3>
        <p className="text-xs sm:text-sm text-[#78716c] mt-2 font-light">
          Your account has been registered successfully. Logging you in...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-[#eae6df]">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#121212]">
          Create Account
        </h2>
        <p className="text-xs sm:text-sm text-[#78716c] mt-1 font-light">
          Join LUXE to track orders and save your favorites.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534e] mb-1">
              First Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8c857b] absolute left-3 top-3" />
              <input
                {...register("firstName")}
                type="text"
                placeholder="Rahul"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#eae6df] bg-[#fafaf8] text-[#121212] text-sm focus:outline-none focus:ring-2 focus:ring-[#121212] transition"
              />
            </div>
            {errors.firstName && (
              <p className="text-[11px] text-red-500 mt-0.5">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534e] mb-1">
              Last Name
            </label>
            <input
              {...register("lastName")}
              type="text"
              placeholder="Sharma"
              className="w-full px-3 py-2 rounded-xl border border-[#eae6df] bg-[#fafaf8] text-[#121212] text-sm focus:outline-none focus:ring-2 focus:ring-[#121212] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534e] mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8c857b] absolute left-3 top-3" />
            <input
              {...register("email")}
              type="email"
              placeholder="rahul@example.com"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#eae6df] bg-[#fafaf8] text-[#121212] text-sm focus:outline-none focus:ring-2 focus:ring-[#121212] transition"
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-500 mt-0.5">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534e] mb-1">
            Mobile Number (Optional)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-[#8c857b] absolute left-3 top-3" />
            <input
              {...register("phone")}
              type="tel"
              placeholder="9876543210"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#eae6df] bg-[#fafaf8] text-[#121212] text-sm focus:outline-none focus:ring-2 focus:ring-[#121212] transition"
            />
          </div>
          {errors.phone && (
            <p className="text-[11px] text-red-500 mt-0.5">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534e] mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8c857b] absolute left-3 top-3" />
            <input
              {...register("password")}
              type="password"
              placeholder="Min. 8 characters"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#eae6df] bg-[#fafaf8] text-[#121212] text-sm focus:outline-none focus:ring-2 focus:ring-[#121212] transition"
            />
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-500 mt-0.5">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 bg-[#121212] hover:bg-black text-white rounded-full font-medium text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      {onSwitchToLogin && (
        <div className="mt-5 text-center text-xs sm:text-sm text-[#78716c]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-[#121212] font-semibold underline underline-offset-4 hover:opacity-80 transition"
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}
