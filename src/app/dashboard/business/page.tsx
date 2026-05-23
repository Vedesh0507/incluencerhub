"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, TrendingUp, Calendar, Heart, MessageSquare, Briefcase, Plus, Bell, Search, Filter, MoreHorizontal } from "lucide-react";
import { mockCreators } from "@/data/mock";

export default function BusinessDashboardPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Top Nav / Dashboard Header */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30">
        <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
            </div>
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
              SB
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl text-gray-600">Welcome back, <span className="font-bold text-gray-900">Spice Route Restaurant</span></h2>
            <p className="text-sm text-gray-500 mt-1">Here's what's happening with your campaigns today.</p>
          </div>
          <button className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm">
            <Plus className="w-5 h-5" /> New Campaign
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Active Campaigns", value: "3", icon: <Briefcase className="w-6 h-6 text-blue-500" />, trend: "+1 this week", bg: "bg-blue-50" },
            { title: "Total Reach", value: "124K", icon: <Users className="w-6 h-6 text-green-500" />, trend: "+12% vs last month", bg: "bg-green-50" },
            { title: "Engagement Rate", value: "5.8%", icon: <TrendingUp className="w-6 h-6 text-purple-500" />, trend: "+0.4% vs last month", bg: "bg-purple-50" },
            { title: "Saved Creators", value: "12", icon: <Heart className="w-6 h-6 text-red-500" />, trend: "View list", bg: "bg-red-50" },
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
              <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <p className="text-xs text-gray-500 font-medium">{stat.trend}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Campaigns List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-lg">Active Campaigns</h3>
                <button className="text-sm font-medium text-brand-primary hover:underline">View All</button>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { name: "Weekend Brunch Promo", creator: "Foodie VJA", status: "In Progress", date: "Due in 2 days", progress: 65 },
                  { name: "New Menu Launch", creator: "Siri's Kitchen", status: "Review", date: "Pending approval", progress: 90 },
                  { name: "Store Walkthrough", creator: "VJA Explorer", status: "Planning", date: "Starts next week", progress: 20 }
                ].map((campaign, i) => (
                  <div key={i} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900">{campaign.name}</h4>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <UserAvatar name={campaign.creator} /> {campaign.creator}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          campaign.status === 'Review' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                          'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          {campaign.status}
                        </span>
                        <button className="text-gray-400 hover:text-gray-900"><MoreHorizontal className="w-5 h-5" /></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-primary rounded-full" style={{ width: `${campaign.progress}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-500 font-medium w-32 text-right">{campaign.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Saved Creators */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-lg">Saved Creators</h3>
                <Link href="/discover" className="text-sm font-medium text-brand-primary hover:underline">Find more</Link>
              </div>
              <div className="p-6 space-y-4">
                {mockCreators.slice(0, 4).map((creator, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <img src={creator.image} alt={creator.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 group-hover:text-brand-primary transition-colors">{creator.name}</h4>
                        <p className="text-xs text-gray-500">{creator.followers} followers</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-brand-primary"><MessageSquare className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Postings Widget */}
            <div className="bg-gradient-to-br from-brand-primary to-brand-primary/80 rounded-2xl border border-brand-primary/20 shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <h3 className="font-bold text-lg mb-2 relative z-10">Looking for Staff?</h3>
              <p className="text-sm text-blue-100 mb-6 relative z-10">Post local job openings and hire freelancers instantly.</p>
              <button className="w-full bg-white text-brand-primary py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-colors relative z-10">
                Post a Job
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper component
function UserAvatar({ name }: { name: string }) {
  return (
    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
      {name.charAt(0)}
    </div>
  );
}
