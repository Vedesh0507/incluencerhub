"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Wallet, TrendingUp, Calendar, MessageSquare, Briefcase, Plus, Bell, Search, Star, Edit, ChevronRight, Share2 } from "lucide-react";

export default function CreatorDashboardPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Top Nav / Dashboard Header */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30">
        <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Creator Dashboard</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button className="flex items-center gap-2 bg-brand-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
              <Share2 className="w-4 h-4" /> Share Profile
            </button>
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-primary rounded-full border border-white"></span>
            </button>
            <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&q=80" alt="Profile" className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        
        {/* Profile Completion Alert */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-primary/10 border border-brand-primary/20 rounded-2xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-brand-primary/20" />
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="175" strokeDashoffset="44" className="text-brand-primary" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-brand-primary">75%</div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Complete your profile</h3>
              <p className="text-sm text-gray-600">Creators with complete profiles get 3x more collaboration requests.</p>
            </div>
          </div>
          <button className="whitespace-nowrap bg-white border border-gray-200 text-gray-800 px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm">
            Add Portfolio Items
          </button>
        </motion.div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: "Total Earnings", value: "₹45,000", subtitle: "This month", icon: <Wallet className="w-6 h-6 text-brand-secondary" />, bg: "bg-green-50" },
            { title: "Profile Views", value: "1,240", subtitle: "+15% from last week", icon: <TrendingUp className="w-6 h-6 text-blue-500" />, bg: "bg-blue-50" },
            { title: "Average Rating", value: "4.9", subtitle: "Based on 12 reviews", icon: <Star className="w-6 h-6 text-brand-accent fill-brand-accent" />, bg: "bg-yellow-50" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.bg} p-3 rounded-xl`}>{stat.icon}</div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <p className="text-xs text-gray-500 font-medium">{stat.subtitle}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Collaboration Requests */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-lg">Collaboration Requests <span className="bg-brand-primary text-white text-xs px-2 py-0.5 rounded-full ml-2">2 New</span></h3>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { brand: "Spice Route VJA", project: "Weekend Brunch Promotion", budget: "₹10,000", date: "Required by 25th May", status: "new" },
                  { brand: "FitZone Gym", project: "1 Month Membership Review", budget: "Exchange + ₹2,000", date: "Required by 30th May", status: "new" },
                  { brand: "Local Tech Store", project: "Gadget Unboxing Reel", budget: "₹8,000", date: "In Discussion", status: "pending" },
                ].map((req, i) => (
                  <div key={i} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">
                          {req.brand.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{req.brand}</h4>
                          <p className="text-sm text-gray-500">{req.project}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="font-bold text-gray-900">{req.budget}</div>
                        <div className="text-xs text-gray-500">{req.date}</div>
                      </div>
                    </div>
                    {req.status === 'new' ? (
                      <div className="flex gap-3 mt-4">
                        <button className="flex-1 bg-brand-primary text-white py-2 rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors">Accept & Chat</button>
                        <button className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">Decline</button>
                      </div>
                    ) : (
                      <div className="mt-4 flex justify-end">
                        <button className="text-sm font-medium text-brand-primary hover:underline flex items-center gap-1">Open Chat <ChevronRight className="w-4 h-4" /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Management */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-lg">Portfolio Management</h3>
                <button className="text-sm font-medium text-brand-primary hover:underline flex items-center gap-1"><Plus className="w-4 h-4" /> Add New</button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2].map((item) => (
                    <div key={item} className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 cursor-pointer border border-gray-200">
                      <img 
                        src={`https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80&random=${item}`} 
                        alt="Portfolio item" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white p-1.5 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  ))}
                  <div className="rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-brand-primary hover:border-brand-primary/50 transition-colors cursor-pointer aspect-square">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Upload Media</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href={`/creator/1`} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-primary/30 hover:bg-blue-50 transition-colors group">
                  <div className="bg-white p-2 rounded-lg shadow-sm group-hover:text-brand-primary"><Search className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-brand-primary">View public profile</span>
                </Link>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-primary/30 hover:bg-blue-50 transition-colors group">
                  <div className="bg-white p-2 rounded-lg shadow-sm group-hover:text-brand-primary"><Edit className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-brand-primary text-left">Update pricing</span>
                </button>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Recent Reviews</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="pb-4 border-b border-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm text-gray-900">Style Boutique</h4>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-brand-accent fill-brand-accent" />)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">"Amazing work! The reel got us 50+ new customers over the weekend."</p>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm text-gray-900">Tech Gadgets Hub</h4>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-brand-accent fill-brand-accent" />)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">"Very professional unboxing video. Delivered exactly as promised."</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
