"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { createCreatorProfile, updateCreatorProfile, getAllCreators } from "@/services/creatorService";
import { getMe } from "@/services/authService";

const CATEGORIES = [
  { value: "food", label: "Food" },
  { value: "fashion", label: "Fashion" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "tech", label: "Tech" },
  { value: "travel", label: "Travel" },
  { value: "fitness", label: "Fitness" },
  { value: "events", label: "Events" },
];

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter" },
];

interface FormData {
  username: string;
  category: string;
  bio: string;
  location: string;
  followers: number;
  engagementRate: number;
  pricing: { reel: number; story: number; post: number };
  platforms: string[];
  profileImage: string;
  socialLinks: { instagram: string; youtube: string; linkedin: string };
}

const initialFormData: FormData = {
  username: "",
  category: "",
  bio: "",
  location: "",
  followers: 0,
  engagementRate: 0,
  pricing: { reel: 0, story: 0, post: 0 },
  platforms: [],
  profileImage: "",
  socialLinks: { instagram: "", youtube: "", linkedin: "" },
};

export default function CreatorProfileFormPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [existingProfileId, setExistingProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify user is a creator
        const userData = await getMe(token);
        if (userData.user.role !== "creator") {
          setLoading(false);
          return;
        }
        setIsAuthorized(true);

        // Check for existing profile
        const creatorsData = await getAllCreators({});
        const myProfile = creatorsData.creators.find(
          (c: { user: { _id: string } | string }) => {
            const userId = typeof c.user === "object" ? c.user._id : c.user;
            return userId === userData.user.id;
          }
        );

        if (myProfile) {
          setExistingProfileId(myProfile._id);
          setFormData({
            username: myProfile.username || "",
            category: myProfile.category || "",
            bio: myProfile.bio || "",
            location: myProfile.location || "",
            followers: myProfile.followers || 0,
            engagementRate: myProfile.engagementRate || 0,
            pricing: myProfile.pricing || { reel: 0, story: 0, post: 0 },
            platforms: myProfile.platforms || [],
            profileImage: myProfile.profileImage || "",
            socialLinks: myProfile.socialLinks || { instagram: "", youtube: "", linkedin: "" },
          });
        }
      } catch {
        // User not logged in or API error
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, [name]: Number(value) || 0 },
    }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Please login first" });
      setSaving(false);
      return;
    }

    try {
      if (existingProfileId) {
        await updateCreatorProfile(existingProfileId, formData, token);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        const result = await createCreatorProfile(formData, token);
        setExistingProfileId(result.profile._id);
        setMessage({ type: "success", text: "Profile created successfully!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">Only authenticated users with the <strong>creator</strong> role can access this page. Please login with a creator account.</p>
          <Link href="/auth/login" className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors">
            Login as Creator
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-white border-b border-gray-200 pt-10 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/dashboard/creator" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {existingProfileId ? "Edit Your Profile" : "Create Your Profile"}
          </h1>
          <p className="text-gray-600 mt-2">
            {existingProfileId
              ? "Update your creator profile details to attract more collaborations."
              : "Set up your creator profile to start getting discovered by brands."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-8 max-w-3xl">
        {/* Status Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{message.text}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="e.g. vedesh_creates"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Vijayawada"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Profile Image URL</label>
                <input
                  type="text"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  placeholder="Tell brands about yourself, your content style, and what makes you unique..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{formData.bio.length}/500 characters</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Stats & Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Followers</label>
                <input
                  type="number"
                  name="followers"
                  value={formData.followers || ""}
                  onChange={handleNumberChange}
                  min={0}
                  placeholder="e.g. 12000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Engagement Rate (%)</label>
                <input
                  type="number"
                  name="engagementRate"
                  value={formData.engagementRate || ""}
                  onChange={handleNumberChange}
                  min={0}
                  max={100}
                  step={0.1}
                  placeholder="e.g. 6.2"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
          </motion.div>

          {/* Pricing */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Pricing (₹)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Reel</label>
                <input
                  type="number"
                  name="reel"
                  value={formData.pricing.reel || ""}
                  onChange={handlePricingChange}
                  min={0}
                  placeholder="e.g. 3000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Story</label>
                <input
                  type="number"
                  name="story"
                  value={formData.pricing.story || ""}
                  onChange={handlePricingChange}
                  min={0}
                  placeholder="e.g. 1000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Post</label>
                <input
                  type="number"
                  name="post"
                  value={formData.pricing.post || ""}
                  onChange={handlePricingChange}
                  min={0}
                  placeholder="e.g. 2000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
          </motion.div>

          {/* Platforms */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Platforms</h2>
            <div className="flex flex-wrap gap-3">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.value}
                  type="button"
                  onClick={() => handlePlatformToggle(platform.value)}
                  className={`px-5 py-2.5 rounded-xl font-medium text-sm border transition-all ${
                    formData.platforms.includes(platform.value)
                      ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20"
                      : "bg-white text-gray-700 border-gray-200 hover:border-brand-primary/50"
                  }`}
                >
                  {platform.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Social Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram</label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.socialLinks.instagram}
                  onChange={handleSocialChange}
                  placeholder="https://instagram.com/yourhandle"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">YouTube</label>
                <input
                  type="url"
                  name="youtube"
                  value={formData.socialLinks.youtube}
                  onChange={handleSocialChange}
                  placeholder="https://youtube.com/@yourchannel"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleSocialChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/dashboard/creator"
              className="px-6 py-3 rounded-xl font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-5 h-5" /> {existingProfileId ? "Update Profile" : "Create Profile"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
