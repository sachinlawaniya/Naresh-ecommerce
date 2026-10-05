import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/ecommerce_db"),
  DIRECT_URL: z.string().optional(),
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().default("https://placeholder-project.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default("placeholder-anon-key"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default("placeholder-service-role-key"),
  
  // Upstash Redis
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // Razorpay
  RAZORPAY_KEY_ID: z.string().default("rzp_test_placeholder"),
  RAZORPAY_KEY_SECRET: z.string().default("placeholder_secret"),
  RAZORPAY_WEBHOOK_SECRET: z.string().default("placeholder_webhook_secret"),
  
  // Resend Email
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("noreply@store.com"),
  
  // Store Settings
  NEXT_PUBLIC_STORE_NAME: z.string().default("LUXE VOGUE"),
  NEXT_PUBLIC_STORE_CURRENCY: z.string().default("INR"),
  NEXT_PUBLIC_STORE_ORIGIN_STATE: z.string().default("Karnataka"),
  NEXT_PUBLIC_STORE_GSTIN: z.string().default("29AAAAA0000A1Z5"),
  STORE_ORIGIN_STATE: z.string().default("Karnataka"),
  STORE_GSTIN: z.string().default("29AAAAA0000A1Z5"),
});

// Pre-fill fallback for client if NEXT_PUBLIC is used
const rawEnv = {
  ...process.env,
  NEXT_PUBLIC_STORE_ORIGIN_STATE: process.env.NEXT_PUBLIC_STORE_ORIGIN_STATE || process.env.STORE_ORIGIN_STATE || "Karnataka",
  NEXT_PUBLIC_STORE_GSTIN: process.env.NEXT_PUBLIC_STORE_GSTIN || process.env.STORE_GSTIN || "29AAAAA0000A1Z5",
  STORE_ORIGIN_STATE: process.env.NEXT_PUBLIC_STORE_ORIGIN_STATE || process.env.STORE_ORIGIN_STATE || "Karnataka",
  STORE_GSTIN: process.env.NEXT_PUBLIC_STORE_GSTIN || process.env.STORE_GSTIN || "29AAAAA0000A1Z5",
};

const parsedEnv = envSchema.safeParse(rawEnv);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
}

export const env = parsedEnv.success ? parsedEnv.data : envSchema.parse({});
