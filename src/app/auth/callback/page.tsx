"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        
        // Save user info and token to local storage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect to dashboard based on role
        const role = user.role;
        if (role === "creator") {
          router.push("/dashboard/creator");
        } else if (role === "business") {
          router.push("/dashboard/business");
        } else {
          router.push("/discover");
        }
      } catch (err) {
        console.error("Error parsing Google OAuth user data", err);
        router.push("/auth/login?error=OAuthFailed");
      }
    } else {
      router.push("/auth/login?error=OAuthFailed");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl border border-gray-100 p-8 shadow-2xl text-center flex flex-col items-center justify-center relative overflow-hidden"
      >
        {/* Subtle decorative background gradients */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mb-6">
          <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-gradient-to-tr from-brand-primary to-blue-600 p-4 rounded-full text-white shadow-lg">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authenticating</h2>
        <p className="text-gray-500 max-w-sm">
          Completing secure sign-in via Google. Please wait a moment while we redirect you.
        </p>

        {/* Micro animation to show progress activity */}
        <div className="mt-8 w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-brand-primary to-blue-600 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    }>
      <AuthCallbackHandler />
    </Suspense>
  );
}
