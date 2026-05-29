"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Star, TrendingUp, Users, CheckCircle, Loader2, MapPin } from "lucide-react";
import { getAllCreators } from "@/services/creatorService";

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

const CATEGORIES = [
  { id: "food", name: "Food & Dining", icon: "Utensils" },
  { id: "fashion", name: "Fashion & Beauty", icon: "Shirt" },
  { id: "lifestyle", name: "Lifestyle & Vlog", icon: "Activity" },
  { id: "tech", name: "Tech & Gadgets", icon: "Smartphone" },
  { id: "travel", name: "Travel & Local", icon: "MapPin" },
  { id: "fitness", name: "Fitness & Health", icon: "Dumbbell" }
];

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

export default function Home() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getAllCreators({ limit: 4 });
        if (data && Array.isArray(data.creators)) {
          setCreators(data.creators);
        }
      } catch (err) {
        console.error("Failed to load featured creators:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const firstCreator = creators[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-brand-primary text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                </span>
                #1 Platform in Vijayawada
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                Find the Right <span className="text-brand-primary relative">
                  Influencer
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-accent/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                  </svg>
                </span> <br className="hidden md:block"/> for Your Business
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Connect with local creators, freelancers, and talent to grow your business smarter in Vijayawada.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/discover" className="inline-flex justify-center items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-all hover:shadow-lg hover:-translate-y-1">
                  Find Creators <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/auth/role" className="inline-flex justify-center items-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all">
                  Join as Creator
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-gray-200 pt-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900">Real-time</div>
                  <div className="text-sm text-gray-500 mt-1">Local Creators</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">Direct</div>
                  <div className="text-sm text-gray-500 mt-1">WhatsApp Connect</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">Verified</div>
                  <div className="text-sm text-gray-500 mt-1">Creator Earnings</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block h-[600px]"
            >
              {/* Floating Cards Demo */}
              <div className="absolute top-10 right-10 w-64 bg-white p-4 rounded-2xl shadow-xl z-20 animate-[bounce_8s_ease-in-out_infinite]">
                <div className="flex items-center gap-4 mb-3">
                  <img 
                    src={firstCreator?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"} 
                    alt={firstCreator?.user?.name || "Featured Creator"} 
                    className="w-12 h-12 rounded-full object-cover" 
                  />
                  <div>
                    <h4 className="font-bold text-sm">{firstCreator?.user?.name || "Join Us Today"}</h4>
                    <p className="text-xs text-gray-500 capitalize">{firstCreator?.category || "Content Creator"}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg text-sm">
                  <span className="font-semibold">{firstCreator ? formatFollowers(firstCreator.followers) : "10K+"}</span>
                  <span className="text-brand-secondary font-medium">Active Now</span>
                </div>
              </div>

              <div className="absolute bottom-20 left-10 w-72 bg-white p-4 rounded-2xl shadow-xl z-30 animate-[bounce_10s_ease-in-out_infinite_reverse]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <TrendingUp className="w-5 h-5 text-brand-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Campaign Success</h4>
                    <p className="text-xs text-gray-500">Real Engagement</p>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-brand-primary/5 rounded-[3rem] transform rotate-3"></div>
              <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80" alt="Local business collaboration" className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Find the perfect creator for your specific niche.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((category, index) => (
              <motion.div 
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gray-50 border border-gray-100 p-6 rounded-2xl text-center cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:bg-brand-primary transition-colors">
                  <Star className="w-6 h-6 text-brand-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CREATORS SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Creators</h2>
              <p className="text-gray-600 max-w-2xl text-lg">Top talent in Vijayawada ready for collaboration.</p>
            </div>
            <Link href="/discover" className="hidden md:flex items-center gap-2 text-brand-primary font-semibold hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-2" />
              <p className="text-gray-500 text-sm">Loading featured creators...</p>
            </div>
          ) : creators.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md mx-auto">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No creators registered yet</h3>
              <p className="text-gray-500 text-sm mb-6">Be the first to create your profile and showcase your portfolio to local brands!</p>
              <Link href="/auth/role" className="bg-brand-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition">
                Register as Creator
              </Link>
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-6 snap-x hide-scrollbar">
              {creators.map((creator, index) => (
                <motion.div 
                  key={creator._id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="min-w-[280px] sm:min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all snap-start flex-shrink-0"
                >
                  <div className="relative h-48 overflow-hidden group">
                    <img 
                      src={creator.profileImage || `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80`} 
                      alt={creator.user?.name || creator.username} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-800">
                      {formatPrice(creator.pricing)}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-1">
                          {creator.user?.name || creator.username}
                          {creator.isVerified && <CheckCircle className="w-4 h-4 text-blue-500" fill="currentColor" />}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">{creator.category}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 my-4">
                      <div className="bg-gray-50 p-2 rounded-lg text-center">
                        <div className="font-bold text-gray-900">{formatFollowers(creator.followers)}</div>
                        <div className="text-xs text-gray-500">Followers</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg text-center">
                        <div className="font-bold text-gray-900">{creator.engagementRate}%</div>
                        <div className="text-xs text-gray-500">Engagement</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {creator.location || "Not specified"}
                    </div>

                    <Link href={`/creator/${creator._id}`} className="block w-full text-center py-2.5 rounded-xl font-medium text-brand-primary bg-blue-50 hover:bg-blue-100 transition-colors">
                      View Profile
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-4 text-center md:hidden">
            <Link href="/discover" className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:underline">
              View All Creators <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How InfluenceHub Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Your journey to successful collaborations in three simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gray-100 -z-10">
              <div className="absolute top-0 left-0 h-full bg-brand-primary/20 w-full"></div>
            </div>

            {[
              { title: "Search & Discover", desc: "Filter through verified local creators based on your niche, budget, and location requirements.", icon: <Users className="w-8 h-8 text-white" /> },
              { title: "Connect & Negotiate", desc: "Reach out directly, discuss project details, and finalize deliverables on our secure platform.", icon: <Star className="w-8 h-8 text-white" /> },
              { title: "Grow Together", desc: "Launch your campaign, track engagement, and watch your local business thrive.", icon: <TrendingUp className="w-8 h-8 text-white" /> },
            ].map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/30 mb-6 rotate-3 hover:rotate-6 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-gray-50 border border-gray-100 rounded-[3rem] p-12 shadow-xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Start Growing with Vijayawada's Creator Community</h2>
            <p className="text-xl text-gray-600 mb-10">Join thousands of local businesses and creators already collaborating on InfluenceHub.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/discover" className="inline-flex justify-center items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-all hover:shadow-lg hover:-translate-y-1">
                Discover Creators
              </Link>
              <Link href="/auth/role" className="inline-flex justify-center items-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all">
                Register Now
              </Link>
            </div>
            <div className="mt-8 flex justify-center gap-6 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-brand-secondary" /> Free to join</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-brand-secondary" /> No hidden fees</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
