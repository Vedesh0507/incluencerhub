"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Store, Camera, Briefcase, UserSearch, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();

  const roles = [
    {
      id: "business",
      title: "Business Owner",
      description: "I want to find local creators and promote my business.",
      icon: <Store className="w-8 h-8" />,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      activeColor: "ring-2 ring-blue-500 border-blue-500 bg-blue-50/50"
    },
    {
      id: "creator",
      title: "Content Creator",
      description: "I want to collaborate with local brands and monetize my audience.",
      icon: <Camera className="w-8 h-8" />,
      color: "bg-green-50 text-green-600 border-green-200",
      activeColor: "ring-2 ring-green-500 border-green-500 bg-green-50/50"
    },
    {
      id: "freelancer",
      title: "Creative Freelancer",
      description: "I offer services like photography, editing, or design.",
      icon: <Briefcase className="w-8 h-8" />,
      color: "bg-purple-50 text-purple-600 border-purple-200",
      activeColor: "ring-2 ring-purple-500 border-purple-500 bg-purple-50/50"
    },
    {
      id: "jobseeker",
      title: "Local Job Seeker",
      description: "I'm looking for full-time or part-time jobs in local businesses.",
      icon: <UserSearch className="w-8 h-8" />,
      color: "bg-orange-50 text-orange-600 border-orange-200",
      activeColor: "ring-2 ring-orange-500 border-orange-500 bg-orange-50/50"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto w-full"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <span className="font-bold text-2xl tracking-tight text-gray-900">
              Influence<span className="text-brand-primary">Hub</span>
            </span>
          </Link>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            How do you want to use InfluenceHub?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your role to personalize your experience. You can always explore other features later.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedRole(role.id)}
              className={`relative bg-white/80 backdrop-blur-sm border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedRole === role.id ? role.activeColor : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {selectedRole === role.id && (
                <div className="absolute top-4 right-4 text-brand-primary">
                  <CheckCircle2 className="w-6 h-6 fill-brand-primary text-white" />
                </div>
              )}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${role.color}`}>
                {role.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
              <p className="text-gray-600">{role.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <p className="text-gray-600">Already have an account?</p>
            <Link href="/auth/login" className="text-brand-primary font-semibold hover:underline">
              Log in instead
            </Link>
          </div>
          <button
            onClick={() => selectedRole && router.push(`/auth/signup?role=${selectedRole}`)}
            disabled={!selectedRole}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all ${
              selectedRole 
                ? 'bg-brand-primary text-white hover:bg-primary-700 shadow-md hover:shadow-lg' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
