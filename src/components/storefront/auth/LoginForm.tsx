"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginDto, LoginDtoSchema } from "@/modules/auth/dtos/auth.dto";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(LoginDtoSchema),
  });

  const onSubmit = async (data: LoginDto) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setErrorMessage(error.message || "Invalid email or password");
        return;
      }

      router.refresh();
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMessage("An unexpected authentication error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-[#eae6df]">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#121212]">
          Welcome Back
        </h2>
        <p className="text-xs sm:text-sm text-[#78716c] mt-1 font-light">
          Sign in to access your orders, wishlist and saved addresses.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534e] mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8c857b] absolute left-3.5 top-3.5" />
            <input
              {...register("email")}
              type="email"
              placeholder="you@domain.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#eae6df] bg-[#fafaf8] text-[#121212] text-sm focus:outline-none focus:ring-2 focus:ring-[#121212] transition"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534e] mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8c857b] absolute left-3.5 top-3.5" />
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#eae6df] bg-[#fafaf8] text-[#121212] text-sm focus:outline-none focus:ring-2 focus:ring-[#121212] transition"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-[#121212] hover:bg-black text-white rounded-full font-medium text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      {onSwitchToRegister && (
        <div className="mt-6 text-center text-xs sm:text-sm text-[#78716c]">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-[#121212] font-semibold underline underline-offset-4 hover:opacity-80 transition"
          >
            Create an account
          </button>
        </div>
      )}
    </div>
  );
}
