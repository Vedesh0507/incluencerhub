"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Github } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const role = searchParams?.get("role") || "user";

  const getRoleDisplayName = () => {
    switch(role) {
      case "business": return "Business Owner";
      case "creator": return "Content Creator";
      case "freelancer": return "Freelancer";
      case "jobseeker": return "Job Seeker";
      default: return "Member";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-row-reverse">
      {/* Right side - Image/Branding */}
      <div className="hidden lg:flex w-1/2 bg-brand-secondary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80')] mix-blend-overlay opacity-20 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/90 to-brand-secondary/40" />
        
        <div className="relative z-10 p-12 text-white max-w-lg">
          <Link href="/" className="inline-block mb-12">
            <span className="font-bold text-3xl tracking-tight text-white">
              Influence<span className="text-brand-accent">Hub</span>
            </span>
          </Link>
          <h1 className="text-4xl font-bold mb-6 leading-tight">Join the fastest growing network in Vijayawada</h1>
          <p className="text-green-100 text-lg">
            Create your {getRoleDisplayName().toLowerCase()} account today and start connecting with local opportunities.
          </p>
          
          <div className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
            <p className="text-white font-medium italic mb-4">"Finding local creators for our restaurant launch was incredibly easy. Highly recommended platform!"</p>
            <p className="text-sm text-green-200">- Ramesh, Local Business Owner</p>
          </div>
        </div>
      </div>

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/">
            <span className="font-bold text-2xl tracking-tight text-gray-900">
              Influence<span className="text-brand-primary">Hub</span>
            </span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center lg:text-left mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-primary text-sm font-medium mb-4">
              Signing up as: {getRoleDisplayName()}
              <Link href="/auth/role" className="underline ml-1">Change</Link>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h2>
            <p className="text-gray-500">Enter your details to get started.</p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all bg-gray-50/50"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all bg-gray-50/50"
                  placeholder="hello@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all bg-gray-50/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 mt-4">
              <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/20" />
              <p className="text-sm text-gray-600">
                By creating an account, I agree to our{" "}
                <a href="#" className="font-medium text-brand-primary hover:underline">Terms of Service</a> and{" "}
                <a href="#" className="font-medium text-brand-primary hover:underline">Privacy Policy</a>.
              </p>
            </div>

            <button type="button" className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98] mt-2">
              Create Account <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-brand-primary hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
