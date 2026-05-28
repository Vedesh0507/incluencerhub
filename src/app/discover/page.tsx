"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Filter, SlidersHorizontal, CheckCircle, MapPin, MessageCircle, ChevronDown, Loader2 } from "lucide-react";
import { getAllCreators } from "@/services/creatorService";
import { mockCreators, mockCategories } from "@/data/mock";

interface Creator {
  _id: string;
  username: string;
  category: string;
  bio: string;
  location: string;
  followers: number;
  engagementRate: number;
  pricing: { reel: number; story: number; post: number };
  platforms: string[];
  profileImage: string;
  isVerified: boolean;
  rating: number;
  user?: { name: string; email: string };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const CATEGORIES = [
  { id: "food", name: "Food" },
  { id: "fashion", name: "Fashion" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "tech", name: "Tech" },
  { id: "travel", name: "Travel" },
  { id: "fitness", name: "Fitness" },
  { id: "events", name: "Events" },
];

const PLATFORMS = ["Instagram", "YouTube", "LinkedIn", "Twitter"];

function formatFollowers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return String(count);
}

function formatPrice(pricing: { reel: number; story: number; post: number }): string {
  const min = Math.min(pricing.reel, pricing.story, pricing.post);
  const max = Math.max(pricing.reel, pricing.story, pricing.post);
  if (min === 0 && max === 0) return "Contact";
  return `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
}

export default function DiscoverPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingMock, setUsingMock] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedFollowers, setSelectedFollowers] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const fetchCreators = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filters: Record<string, string | number> = {
        page: currentPage,
        limit: 12,
        sort: sortBy,
      };
      if (searchQuery) filters.search = searchQuery;
      if (selectedCategory) filters.category = selectedCategory;
      if (selectedPlatform) filters.platform = selectedPlatform.toLowerCase();
      if (selectedLocation) filters.location = selectedLocation;

      // Map follower ranges to minFollowers
      if (selectedFollowers === "10k") filters.minFollowers = 10000;
      else if (selectedFollowers === "50k") filters.minFollowers = 50000;
      else if (selectedFollowers === "100k") filters.minFollowers = 100000;
      else if (selectedFollowers === "500k") filters.minFollowers = 500000;

      const data = await getAllCreators(filters);
      setCreators(data.creators);
      setPagination(data.pagination);
      setUsingMock(false);
    } catch {
      // Fallback to mock data
      setUsingMock(true);
      setCreators([]);
      setError("");
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, searchQuery, selectedCategory, selectedPlatform, selectedLocation, selectedFollowers]);

  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      setCurrentPage(1);
    }, 400);
    setSearchTimeout(timeout);
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedPlatform("");
    setSelectedFollowers("");
    setSelectedLocation("");
    setSearchQuery("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setIsMobileFiltersOpen(false);
  };

  // Render creator cards — either from API or mock fallback
  const renderCards = () => {
    if (usingMock) {
      return mockCreators.map((creator, index) => (
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
      ));
    }

    if (creators.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No creators found</h3>
          <p className="text-gray-500 max-w-md">Try adjusting your filters or search query to find more creators.</p>
          <button onClick={handleClearFilters} className="mt-4 text-brand-primary font-medium hover:underline">Clear all filters</button>
        </div>
      );
    }

    return creators.map((creator, index) => (
      <motion.div
        key={creator._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col h-full"
      >
        <div className="relative h-48 overflow-hidden group">
          <img
            src={creator.profileImage || `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80`}
            alt={creator.user?.name || creator.username}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-800 shadow-sm">
            {formatPrice(creator.pricing)}
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-1.5">
                {creator.user?.name || creator.username}
                {creator.isVerified && <CheckCircle className="w-4 h-4 text-blue-500" fill="currentColor" />}
              </h3>
              <p className="text-sm text-brand-primary font-medium capitalize">{creator.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 mb-4">
            <MapPin className="w-4 h-4" />
            {creator.location || "Not specified"}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5 border-y border-gray-100 py-4">
            <div className="text-center">
              <div className="font-bold text-gray-900">{formatFollowers(creator.followers)}</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            <div className="text-center border-l border-gray-100">
              <div className="font-bold text-gray-900">{creator.engagementRate}%</div>
              <div className="text-xs text-gray-500">Engagement</div>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-2">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-white bg-green-500 hover:bg-green-600 transition-colors">
              <MessageCircle className="w-4 h-4" /> WhatsApp Connect
            </button>
            <Link href={`/creator/${creator._id}`} className="w-full text-center py-2.5 rounded-xl font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
              View Profile
            </Link>
          </div>
        </div>
      </motion.div>
    ));
  };

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
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
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
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="bg-transparent border-none focus:ring-0 cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="followers">Most Followers</option>
                <option value="rating">Highest Rated</option>
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
                <button onClick={handleClearFilters} className="text-sm text-brand-primary font-medium hover:underline">Clear all</button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm flex justify-between items-center">
                  Category <ChevronDown className="w-4 h-4 text-gray-400" />
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {CATEGORIES.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(selectedCategory === cat.id ? "" : cat.id)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/20 transition-all cursor-pointer"
                      />
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
                  {PLATFORMS.map((platform) => (
                    <label key={platform} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="platform"
                        checked={selectedPlatform === platform}
                        onChange={() => setSelectedPlatform(selectedPlatform === platform ? "" : platform)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/20 transition-all cursor-pointer"
                      />
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
                  {[
                    { label: "Under 10K", value: "" },
                    { label: "10K+", value: "10k" },
                    { label: "50K+", value: "50k" },
                    { label: "100K+", value: "100k" },
                    { label: "500K+", value: "500k" },
                  ].map((range) => (
                    <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="followers"
                        checked={selectedFollowers === range.value}
                        onChange={() => setSelectedFollowers(selectedFollowers === range.value ? "" : range.value)}
                        className="w-4 h-4 border-gray-300 text-brand-primary focus:ring-brand-primary/20 transition-all cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm flex justify-between items-center">
                  Location <ChevronDown className="w-4 h-4 text-gray-400" />
                </h4>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="">Anywhere</option>
                  <option value="Vijayawada">Vijayawada</option>
                  <option value="Benz Circle">Benz Circle</option>
                  <option value="Patamata">Patamata</option>
                  <option value="Bhavanipuram">Bhavanipuram</option>
                  <option value="Autonagar">Autonagar</option>
                </select>
              </div>

              <button onClick={handleApplyFilters} className="w-full bg-brand-primary text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading creators...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renderCards()}
                </div>

                {/* Pagination */}
                {!usingMock && pagination.totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 font-medium ${currentPage <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        &lt;
                      </button>
                      {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${currentPage === page ? 'bg-brand-primary text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                        >
                          {page}
                        </button>
                      ))}
                      {pagination.totalPages > 5 && <span className="px-2 text-gray-400">...</span>}
                      <button
                        disabled={currentPage >= pagination.totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 font-medium ${currentPage >= pagination.totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        &gt;
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
