"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Filter, SlidersHorizontal, CheckCircle, MapPin, MessageCircle, ChevronDown } from "lucide-react";
import { mockCreators, mockCategories } from "@/data/mock";

export default function DiscoverPage() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 pt-10 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Discover Creators</h1>
          <p className="text-gray-600 max-w-2xl text-lg">
            Find and connect with top content creators, influencers, and freelancers in Vijayawada.
          </p>
          
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                placeholder="Search by name, category, or keyword..."
              />
            </div>
            <button 
              className="md:hidden flex items-center justify-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              <Filter className="w-5 h-5" /> Filters
            </button>
            <div className="hidden md:flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium text-gray-700">
              <span className="text-gray-500">Sort by:</span>
              <select className="bg-transparent border-none focus:ring-0 cursor-pointer">
                <option>Most Popular</option>
                <option>Highest Rated</option>
                <option>Lowest Price</option>
                <option>Newest</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={`w-full md:w-64 lg:w-72 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" /> Filters
                </h3>
                <button className="text-sm text-brand-primary font-medium hover:underline">Clear all</button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm flex justify-between items-center">
                  Category <ChevronDown className="w-4 h-4 text-gray-400" />
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {mockCategories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/20 transition-all cursor-pointer" />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Platform Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm flex justify-between items-center">
                  Platform <ChevronDown className="w-4 h-4 text-gray-400" />
                </h4>
                <div className="space-y-2">
                  {['Instagram', 'YouTube', 'LinkedIn', 'Facebook'].map((platform) => (
                    <label key={platform} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/20 transition-all cursor-pointer" />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Followers Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm flex justify-between items-center">
                  Followers Range <ChevronDown className="w-4 h-4 text-gray-400" />
                </h4>
                <div className="space-y-2">
                  {['Under 10K', '10K - 50K', '50K - 100K', '100K - 500K', '500K+'].map((range) => (
                    <label key={range} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="followers" className="w-4 h-4 border-gray-300 text-brand-primary focus:ring-brand-primary/20 transition-all cursor-pointer" />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm flex justify-between items-center">
                  Location <ChevronDown className="w-4 h-4 text-gray-400" />
                </h4>
                <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent">
                  <option>Anywhere in Vijayawada</option>
                  <option>Benz Circle</option>
                  <option>Patamata</option>
                  <option>Bhavanipuram</option>
                  <option>Autonagar</option>
                </select>
              </div>

              <button className="w-full bg-brand-primary text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCreators.map((creator, index) => (
                <motion.div 
                  key={creator.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col h-full"
                >
                  <div className="relative h-48 overflow-hidden group">
                    <img src={creator.image} alt={creator.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-800 shadow-sm">
                      {creator.priceRange}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-1.5">
                          {creator.name}
                          {creator.verified && <CheckCircle className="w-4 h-4 text-blue-500" fill="currentColor" />}
                        </h3>
                        <p className="text-sm text-brand-primary font-medium">{creator.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 mb-4">
                      <MapPin className="w-4 h-4" />
                      {creator.location}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-5 border-y border-gray-100 py-4">
                      <div className="text-center">
                        <div className="font-bold text-gray-900">{creator.followers}</div>
                        <div className="text-xs text-gray-500">Followers</div>
                      </div>
                      <div className="text-center border-l border-gray-100">
                        <div className="font-bold text-gray-900">{creator.engagement}</div>
                        <div className="text-xs text-gray-500">Engagement</div>
                      </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-2">
                      <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-white bg-green-500 hover:bg-green-600 transition-colors">
                        <MessageCircle className="w-4 h-4" /> WhatsApp Connect
                      </button>
                      <Link href={`/creator/${creator.id}`} className="w-full text-center py-2.5 rounded-xl font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
                        View Profile
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Pagination Placeholder */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed">
                  &lt;
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-brand-primary text-white font-medium">
                  1
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium">
                  2
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium">
                  3
                </button>
                <span className="px-2 text-gray-400">...</span>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                  &gt;
                </button>
              </div>
            </div>
          </main>
          
        </div>
      </div>
    </div>
  );
}
