"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle, MapPin, Instagram, Youtube, Share2, MessageCircle, Star, Calendar, ShieldCheck, Mail, Loader2, Linkedin, X, Plus, Trash2, AlertCircle } from "lucide-react";
import { getCreatorById } from "@/services/creatorService";
import { sendCollaborationRequest, type SendCollaborationData } from "@/services/collaborationService";
import { use } from "react";

interface CreatorProfile {
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
  portfolioImages: string[];
  socialLinks: { instagram?: string; youtube?: string; linkedin?: string };
  isVerified: boolean;
  rating: number;
  createdAt: string;
  user?: { name: string; email: string };
}

function formatFollowers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return String(count);
}

export default function CreatorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Collaboration modal state
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [collabForm, setCollabForm] = useState<SendCollaborationData>({
    creatorProfile: "",
    campaignTitle: "",
    description: "",
    budget: 0,
    barter: false,
    deliverables: [],
    deadline: "",
    platform: "instagram",
  });
  const [newDeliverable, setNewDeliverable] = useState("");
  const [collabLoading, setCollabLoading] = useState(false);
  const [collabSuccess, setCollabSuccess] = useState(false);
  const [collabError, setCollabError] = useState("");

  useEffect(() => {
    const fetchCreator = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getCreatorById(resolvedParams.id);
        setCreator(data.profile);
        // Pre-fill creatorProfile ID once we have the real creator
        setCollabForm((prev) => ({ ...prev, creatorProfile: data.profile._id }));
      } catch (err: any) {
        setError(err?.message || "Failed to load creator profile");
      } finally {
        setLoading(false);
      }
    };
    fetchCreator();
  }, [resolvedParams.id]);

  // ── Collaboration form helpers ────────────────────────────────────────────
  const addDeliverable = () => {
    const trimmed = newDeliverable.trim();
    if (trimmed) {
      setCollabForm((prev) => ({ ...prev, deliverables: [...(prev.deliverables || []), trimmed] }));
      setNewDeliverable("");
    }
  };

  const removeDeliverable = (index: number) => {
    setCollabForm((prev) => ({
      ...prev,
      deliverables: (prev.deliverables || []).filter((_, i) => i !== index),
    }));
  };

  const handleCollabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCollabLoading(true);
    setCollabError("");
    const result = await sendCollaborationRequest(collabForm);
    setCollabLoading(false);
    if (result.success) {
      setCollabSuccess(true);
    } else {
      setCollabError(result.error || "Failed to send request");
    }
  };

  const closeModal = () => {
    setShowCollabModal(false);
    setCollabSuccess(false);
    setCollabError("");
    setCollabLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-brand-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Creator not found</h2>
          <p className="text-gray-500 mb-4">This profile doesn&apos;t exist or has been removed.</p>
          <Link href="/discover" className="text-brand-primary font-medium hover:underline">← Back to Discover</Link>
        </div>
      </div>
    );
  }

  const createdYear = new Date(creator.createdAt).getFullYear();

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
                  src={creator.profileImage || `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80`}
                  alt={creator.user?.name || creator.username}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                />
                <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                      {creator.user?.name || creator.username}
                      {creator.isVerified && <CheckCircle className="w-6 h-6 text-blue-500" fill="currentColor" />}
                    </h1>
                    <p className="text-brand-primary font-medium text-lg mt-1 capitalize">{creator.category}</p>
                    <div className="flex items-center gap-4 text-gray-500 mt-2 text-sm">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {creator.location || "Not specified"}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {createdYear}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    {creator.socialLinks?.instagram && (
                      <a href={creator.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {creator.socialLinks?.youtube && (
                      <a href={creator.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                        <Youtube className="w-5 h-5" />
                      </a>
                    )}
                    {creator.socialLinks?.linkedin && (
                      <a href={creator.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{formatFollowers(creator.followers)}</div>
                  <div className="text-sm text-gray-500 mt-1">Total Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{creator.engagementRate}%</div>
                  <div className="text-sm text-gray-500 mt-1">Engagement Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{creator.platforms.length}</div>
                  <div className="text-sm text-gray-500 mt-1">Platforms</div>
                </div>
                <div className="text-center flex flex-col items-center justify-center">
                  <div className="flex gap-1 text-brand-accent">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.round(creator.rating) ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{creator.rating}/5</div>
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
                {creator.bio || `Hi, I'm ${creator.user?.name || creator.username}! I create content in the ${creator.category} space.`}
              </p>

              {/* Platforms */}
              {creator.platforms.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Active Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {creator.platforms.map((platform) => (
                      <span key={platform} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 capitalize">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Portfolio Section */}
            {creator.portfolioImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Portfolio</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {creator.portfolioImages.map((img, index) => (
                    <div key={index} className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-gray-100 cursor-pointer">
                      <img src={img} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews Section (placeholder) */}
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
                      &quot;Absolutely fantastic experience working with {creator.user?.name || creator.username}. The content was highly professional,
                      delivered on time, and brought a noticeable increase in engagement. Will definitely hire again!&quot;
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

              <button
                  onClick={() => setShowCollabModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-colors mb-3 shadow-lg shadow-brand-primary/20"
                >
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
                      <span className="font-bold text-gray-900">₹{creator.pricing.reel.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-xs text-gray-500">Up to 60 seconds, dedicated brand integration</p>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 hover:border-brand-primary/50 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">Story with Link</h4>
                      <span className="font-bold text-gray-900">₹{creator.pricing.story.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-xs text-gray-500">2 frames, swipe up link, 24h duration</p>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 hover:border-brand-primary/50 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">Feed Post</h4>
                      <span className="font-bold text-gray-900">₹{creator.pricing.post.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-xs text-gray-500">Dedicated brand post with caption & tags</p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>

      {/* ── COLLABORATION REQUEST MODAL ────────────────────────────────── */}
      <AnimatePresence>
        {showCollabModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Send Collaboration Request</h2>
                  <p className="text-sm text-gray-500 mt-0.5">To: {creator?.user?.name || creator?.username}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Success State */}
              {collabSuccess ? (
                <div className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Request Sent!</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Your collaboration request has been sent to {creator?.user?.name || creator?.username}.
                    You&apos;ll be notified when they respond.
                  </p>
                  <button
                    onClick={closeModal}
                    className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleCollabSubmit} className="p-6 space-y-5">
                  {/* Campaign Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Campaign Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="collab-campaign-title"
                      type="text"
                      required
                      value={collabForm.campaignTitle}
                      onChange={(e) => setCollabForm((p) => ({ ...p, campaignTitle: e.target.value }))}
                      placeholder="e.g. Restaurant Launch Campaign"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="collab-description"
                      required
                      rows={3}
                      value={collabForm.description}
                      onChange={(e) => setCollabForm((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Describe what you need..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition resize-none"
                    />
                  </div>

                  {/* Budget + Barter */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Budget (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="collab-budget"
                        type="number"
                        required
                        min={0}
                        value={collabForm.budget || ""}
                        onChange={(e) => setCollabForm((p) => ({ ...p, budget: Number(e.target.value) }))}
                        placeholder="5000"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Platform <span className="text-red-500">*</span></label>
                      <select
                        id="collab-platform"
                        required
                        value={collabForm.platform}
                        onChange={(e) => setCollabForm((p) => ({ ...p, platform: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition bg-white"
                      >
                        <option value="instagram">Instagram</option>
                        <option value="youtube">YouTube</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">Twitter</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deadline <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="collab-deadline"
                      type="date"
                      required
                      value={collabForm.deadline}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setCollabForm((p) => ({ ...p, deadline: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                    />
                  </div>

                  {/* Barter toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Barter / Exchange</p>
                      <p className="text-xs text-gray-500 mt-0.5">Offer products/services in exchange</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCollabForm((p) => ({ ...p, barter: !p.barter }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        collabForm.barter ? "bg-brand-primary" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          collabForm.barter ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deliverables</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        id="collab-deliverable-input"
                        type="text"
                        value={newDeliverable}
                        onChange={(e) => setNewDeliverable(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addDeliverable(); } }}
                        placeholder="e.g. 1 Instagram Reel"
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={addDeliverable}
                        className="flex items-center gap-1 px-3 py-2.5 bg-brand-primary/10 text-brand-primary rounded-xl text-sm font-medium hover:bg-brand-primary/20 transition"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                    {collabForm.deliverables && collabForm.deliverables.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {collabForm.deliverables.map((d, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-medium"
                          >
                            {d}
                            <button type="button" onClick={() => removeDeliverable(i)} className="hover:text-red-600">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Error */}
                  {collabError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {collabError}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    id="collab-submit"
                    disabled={collabLoading}
                    className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/20"
                  >
                    {collabLoading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                    ) : (
                      <><Mail className="w-5 h-5" /> Send Collaboration Request</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
