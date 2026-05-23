"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle, MapPin, Instagram, Youtube, Share2, MessageCircle, Star, Calendar, ShieldCheck, Mail } from "lucide-react";
import { mockCreators } from "@/data/mock";
import { use } from "react";

export default function CreatorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  // Find creator or default to first one for demo purposes
  const creator = mockCreators.find(c => c.id === resolvedParams.id) || mockCreators[0];

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Cover Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1542482315-9c98bc325992?w=1600&q=80" 
          alt="Cover Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-24 left-4 md:left-8 z-20">
          <Link href="/discover" className="inline-flex items-center gap-2 text-white/90 hover:text-white bg-black/20 hover:bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-20 -mt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Header Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8"
            >
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20 mb-6">
                <img 
                  src={creator.image} 
                  alt={creator.name} 
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                />
                <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                      {creator.name}
                      {creator.verified && <CheckCircle className="w-6 h-6 text-blue-500" fill="currentColor" />}
                    </h1>
                    <p className="text-brand-primary font-medium text-lg mt-1">{creator.category}</p>
                    <div className="flex items-center gap-4 text-gray-500 mt-2 text-sm">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {creator.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined 2024</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                      <Instagram className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                      <Youtube className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{creator.followers}</div>
                  <div className="text-sm text-gray-500 mt-1">Total Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{creator.engagement}</div>
                  <div className="text-sm text-gray-500 mt-1">Engagement Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">120+</div>
                  <div className="text-sm text-gray-500 mt-1">Collaborations</div>
                </div>
                <div className="text-center flex flex-col items-center justify-center">
                  <div className="flex gap-1 text-brand-accent">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-sm text-gray-500 mt-1">4.9/5 (48 Reviews)</div>
                </div>
              </div>
            </motion.div>

            {/* About Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Hi, I'm {creator.name}! I create high-quality content focusing on {creator.category.toLowerCase()}. 
                With over {creator.followers} followers primarily based in and around Vijayawada, I help local brands reach their target audience authentically. 
                My audience is highly engaged and trusts my recommendations for local businesses, services, and products.
              </p>

              <h3 className="font-semibold text-gray-900 mb-3">Audience Demographics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Vijayawada</span> <span className="font-semibold">65%</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4"><div className="bg-brand-primary h-2 rounded-full w-[65%]"></div></div>
                  
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Guntur</span> <span className="font-semibold">20%</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-brand-primary h-2 rounded-full w-[20%]"></div></div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Age 18-24</span> <span className="font-semibold">45%</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4"><div className="bg-brand-secondary h-2 rounded-full w-[45%]"></div></div>
                  
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Age 25-34</span> <span className="font-semibold">35%</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-brand-secondary h-2 rounded-full w-[35%]"></div></div>
                </div>
              </div>
            </motion.div>

            {/* Portfolio Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Brand Collaborations</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-gray-100 cursor-pointer">
                    <img 
                      src={`https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80&random=${item}`} 
                      alt="Portfolio item" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <p className="text-white font-semibold text-sm">Local Cafe Launch</p>
                      <p className="text-white/80 text-xs mt-1">12K Likes • 450 Comments</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Client Reviews</h2>
              <div className="space-y-6">
                {[1, 2].map((review) => (
                  <div key={review} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-bold">
                          B{review}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Local Business {review}</h4>
                          <p className="text-xs text-gray-500">2 weeks ago</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-brand-accent fill-brand-accent" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      "Absolutely fantastic experience working with {creator.name}. The content was highly professional, 
                      delivered on time, and brought a noticeable increase in footfall to our store. Will definitely hire again!"
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sticky Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              
              {/* Action Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-6 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium border border-green-100">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  Accepting new collaborations
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-colors mb-3 shadow-lg shadow-brand-primary/20">
                  <Mail className="w-5 h-5" /> Request Collaboration
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors mb-4 shadow-lg shadow-green-500/20">
                  <MessageCircle className="w-5 h-5" /> WhatsApp Connect
                </button>
                
                <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Secure payments via InfluenceHub
                </p>
              </motion.div>

              {/* Pricing Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Services & Pricing</h3>
                <div className="space-y-4">
                  <div className="border border-gray-100 rounded-xl p-4 hover:border-brand-primary/50 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">Instagram Reel</h4>
                      <span className="font-bold text-gray-900">₹8,000</span>
                    </div>
                    <p className="text-xs text-gray-500">Up to 60 seconds, dedicated brand integration</p>
                  </div>
                  
                  <div className="border border-gray-100 rounded-xl p-4 hover:border-brand-primary/50 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">Story with Link</h4>
                      <span className="font-bold text-gray-900">₹3,000</span>
                    </div>
                    <p className="text-xs text-gray-500">2 frames, swipe up link, 24h duration</p>
                  </div>

                  <div className="border border-gray-100 rounded-xl p-4 hover:border-brand-primary/50 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">Store Visit + Video</h4>
                      <span className="font-bold text-gray-900">₹15,000</span>
                    </div>
                    <p className="text-xs text-gray-500">2 hour visit, 1 Reel + 3 Stories + 1 Post</p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
