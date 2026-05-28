"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Wallet, TrendingUp, Calendar, Briefcase, Plus, Bell,
  Search, Star, Edit, ChevronRight, Share2, Loader2,
  CheckCircle, XCircle, Clock, AlertCircle, RefreshCw,
  Building2, IndianRupee, CalendarDays, Tag,
} from "lucide-react";
import {
  getCreatorInbox,
  updateCollaborationStatus,
  type CollaborationRequest,
} from "@/services/collaborationService";

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: CollaborationRequest["status"] }) {
  const config = {
    pending: {
      label: "Pending",
      icon: <Clock className="w-3 h-3" />,
      className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    },
    accepted: {
      label: "Accepted",
      icon: <CheckCircle className="w-3 h-3" />,
      className: "bg-green-50 text-green-700 border border-green-200",
    },
    rejected: {
      label: "Rejected",
      icon: <XCircle className="w-3 h-3" />,
      className: "bg-red-50 text-red-700 border border-red-200",
    },
    completed: {
      label: "Completed",
      icon: <CheckCircle className="w-3 h-3" />,
      className: "bg-blue-50 text-blue-700 border border-blue-200",
    },
  };

  const s = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.className}`}>
      {s.icon} {s.label}
    </span>
  );
}

// ── Collaboration Card ─────────────────────────────────────────────────────────
function CollaborationCard({
  collab,
  onStatusUpdate,
}: {
  collab: CollaborationRequest;
  onStatusUpdate: (id: string, status: "accepted" | "rejected") => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);
  const [localStatus, setLocalStatus] = useState(collab.status);
  const [actionError, setActionError] = useState("");

  const deadline = new Date(collab.deadline);
  const isOverdue = deadline < new Date() && localStatus === "pending";
  const deadlineStr = deadline.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleAction = async (status: "accepted" | "rejected") => {
    setUpdating(true);
    setActionError("");
    await onStatusUpdate(collab._id, status);
    setLocalStatus(status);
    setUpdating(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-5 sm:p-6 hover:bg-gray-50/80 transition-colors border-b border-gray-100 last:border-0"
    >
      {/* Header row */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 flex items-center justify-center font-bold text-brand-primary text-sm flex-shrink-0 border border-brand-primary/10">
            {collab.businessUser?.name?.charAt(0)?.toUpperCase() || "B"}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">
              {collab.businessUser?.name || "Business"}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">{collab.campaignTitle}</p>
          </div>
        </div>
        <StatusBadge status={localStatus} />
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <IndianRupee className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
          <span className="font-semibold text-gray-900">
            {collab.barter ? `Barter + ₹${collab.budget.toLocaleString("en-IN")}` : `₹${collab.budget.toLocaleString("en-IN")}`}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? "text-red-600" : "text-gray-600"}`}>
          <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{isOverdue ? "Overdue · " : ""}{deadlineStr}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Tag className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <span className="capitalize">{collab.platform}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{collab.description}</p>

      {/* Deliverables */}
      {collab.deliverables && collab.deliverables.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {collab.deliverables.map((d, i) => (
            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100 font-medium">
              {d}
            </span>
          ))}
        </div>
      )}

      {/* Error */}
      {actionError && (
        <p className="text-xs text-red-600 mb-3 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {actionError}
        </p>
      )}

      {/* Action buttons — only for pending requests */}
      {localStatus === "pending" && (
        <div className="flex gap-3">
          <button
            onClick={() => handleAction("accepted")}
            disabled={updating}
            id={`accept-${collab._id}`}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-white py-2.5 rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-brand-primary/20"
          >
            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Accept
          </button>
          <button
            onClick={() => handleAction("rejected")}
            disabled={updating}
            id={`reject-${collab._id}`}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            Decline
          </button>
        </div>
      )}

      {/* For accepted/completed — show a subtle status note */}
      {(localStatus === "accepted" || localStatus === "completed") && (
        <div className="mt-2 flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
          <CheckCircle className="w-3.5 h-3.5" />
          {localStatus === "accepted" ? "You accepted this collaboration" : "Collaboration completed"}
        </div>
      )}

      {localStatus === "rejected" && (
        <div className="mt-2 flex items-center gap-2 text-xs text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
          <XCircle className="w-3.5 h-3.5" />
          You declined this collaboration
        </div>
      )}
    </motion.div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function CreatorDashboardPage() {
  const [collaborations, setCollaborations] = useState<CollaborationRequest[]>([]);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [inboxError, setInboxError] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");

  // Fetch creator inbox
  const fetchInbox = useCallback(async () => {
    setInboxLoading(true);
    setInboxError("");
    const result = await getCreatorInbox();
    if (result.success && Array.isArray(result.data)) {
      setCollaborations(result.data as CollaborationRequest[]);
    } else {
      setInboxError(result.error || "Failed to load collaboration requests");
    }
    setInboxLoading(false);
  }, []);

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  // Handle accept/reject — optimistically updates the UI
  const handleStatusUpdate = async (id: string, status: "accepted" | "rejected") => {
    const { updateCollaborationStatus } = await import("@/services/collaborationService");
    const result = await updateCollaborationStatus(id, status);
    if (!result.success) {
      console.error("[CreatorDashboard] status update failed:", result.error);
    }
    // The CollaborationCard manages its own local state for immediate UI feedback
  };

  // Filtered collabs
  const filteredCollabs = collaborations.filter((c) =>
    filter === "all" ? true : c.status === filter
  );

  const pendingCount = collaborations.filter((c) => c.status === "pending").length;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30">
        <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Creator Dashboard</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button className="flex items-center gap-2 bg-brand-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
              <Share2 className="w-4 h-4" /> Share Profile
            </button>
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-primary rounded-full border border-white" />
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center font-bold text-brand-primary text-xs">
              CR
            </div>
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
            {
              title: "Total Earnings",
              value: "₹45,000",
              subtitle: "This month",
              icon: <Wallet className="w-6 h-6 text-brand-secondary" />,
              bg: "bg-green-50",
            },
            {
              title: "Profile Views",
              value: "1,240",
              subtitle: "+15% from last week",
              icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
              bg: "bg-blue-50",
            },
            {
              title: "Average Rating",
              value: "4.9",
              subtitle: "Based on 12 reviews",
              icon: <Star className="w-6 h-6 text-brand-accent fill-brand-accent" />,
              bg: "bg-yellow-50",
            },
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
            {/* ── COLLABORATION INBOX ──────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-gray-900 text-lg">Collaboration Requests</h3>
                  {pendingCount > 0 && (
                    <span className="bg-brand-primary text-white text-xs px-2 py-0.5 rounded-full">
                      {pendingCount} New
                    </span>
                  )}
                </div>
                <button
                  onClick={fetchInbox}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-primary transition-colors"
                  title="Refresh inbox"
                >
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1 px-6 pt-4 border-b border-gray-100 overflow-x-auto">
                {(["all", "pending", "accepted", "rejected"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`pb-3 px-3 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${
                      filter === tab
                        ? "border-brand-primary text-brand-primary"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {tab === "all"
                      ? `All (${collaborations.length})`
                      : `${tab.charAt(0).toUpperCase() + tab.slice(1)} (${collaborations.filter((c) => c.status === tab).length})`}
                  </button>
                ))}
              </div>

              {/* Content */}
              {inboxLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500 font-medium">Loading collaboration requests…</p>
                  </div>
                </div>
              ) : inboxError ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                  <p className="text-sm text-red-600 font-medium text-center mb-4">{inboxError}</p>
                  <button
                    onClick={fetchInbox}
                    className="flex items-center gap-2 text-sm text-brand-primary font-medium hover:underline"
                  >
                    <RefreshCw className="w-4 h-4" /> Try again
                  </button>
                </div>
              ) : filteredCollabs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {filter === "all" ? "No collaboration requests yet" : `No ${filter} requests`}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {filter === "all"
                      ? "Businesses will reach out to collaborate with you here."
                      : "Nothing here — try switching filters above."}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="divide-y divide-gray-50">
                    {filteredCollabs.map((collab) => (
                      <CollaborationCard
                        key={collab._id}
                        collab={collab}
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>

            {/* Portfolio Management */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-lg">Portfolio Management</h3>
                <button className="text-sm font-medium text-brand-primary hover:underline flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 cursor-pointer border border-gray-200"
                    >
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
                <Link
                  href="/discover"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-primary/30 hover:bg-blue-50 transition-colors group"
                >
                  <div className="bg-white p-2 rounded-lg shadow-sm group-hover:text-brand-primary">
                    <Search className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-brand-primary">
                    Browse Creators
                  </span>
                </Link>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-primary/30 hover:bg-blue-50 transition-colors group">
                  <div className="bg-white p-2 rounded-lg shadow-sm group-hover:text-brand-primary">
                    <Edit className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-brand-primary text-left">
                    Update pricing
                  </span>
                </button>
              </div>
            </div>

            {/* Inbox Summary */}
            <div className="bg-gradient-to-br from-brand-primary to-brand-primary/80 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <h3 className="font-bold text-lg mb-1 relative z-10">Inbox Summary</h3>
              <p className="text-blue-100 text-sm mb-5 relative z-10">Your collaboration overview</p>
              <div className="grid grid-cols-2 gap-3 relative z-10">
                {[
                  { label: "Pending", count: collaborations.filter((c) => c.status === "pending").length, bg: "bg-yellow-400/20" },
                  { label: "Accepted", count: collaborations.filter((c) => c.status === "accepted").length, bg: "bg-green-400/20" },
                  { label: "Rejected", count: collaborations.filter((c) => c.status === "rejected").length, bg: "bg-red-400/20" },
                  { label: "Completed", count: collaborations.filter((c) => c.status === "completed").length, bg: "bg-blue-400/20" },
                ].map((item) => (
                  <div key={item.label} className={`${item.bg} rounded-xl p-3 text-center`}>
                    <div className="text-2xl font-bold">{item.count}</div>
                    <div className="text-xs text-white/80 mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Recent Reviews</h3>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { brand: "Style Boutique", review: "\"Amazing work! The reel got us 50+ new customers.\"" },
                  { brand: "Tech Gadgets Hub", review: "\"Very professional unboxing video. Delivered as promised.\"" },
                ].map((r, i) => (
                  <div key={i} className={`${i === 0 ? "pb-4 border-b border-gray-50" : ""}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm text-gray-900">{r.brand}</h4>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-3 h-3 text-brand-accent fill-brand-accent" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{r.review}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
