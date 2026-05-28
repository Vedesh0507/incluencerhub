"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Wallet, TrendingUp, Star, Plus, Bell, Search, Edit,
  Share2, Loader2, CheckCircle, XCircle, Clock, AlertCircle,
  RefreshCw, IndianRupee, CalendarDays, Tag, Briefcase,
  X, Ban, ChevronRight,
} from "lucide-react";
import {
  getCreatorInbox,
  getCreatorStats,
  updateCollaborationStatus,
  getCollaborationById,
  type CollaborationRequest,
  type CollaborationStatus,
  type CreatorStats,
} from "@/services/collaborationService";

// ─────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────
const STATUS_CONFIG: Record<CollaborationStatus, { label: string; icon: React.ReactNode; className: string }> = {
  pending: { label: "Pending", icon: <Clock className="w-3 h-3" />, className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  accepted: { label: "Accepted", icon: <CheckCircle className="w-3 h-3" />, className: "bg-green-50 text-green-700 border-green-200" },
  rejected: { label: "Rejected", icon: <XCircle className="w-3 h-3" />, className: "bg-red-50 text-red-700 border-red-200" },
  completed: { label: "Completed", icon: <CheckCircle className="w-3 h-3" />, className: "bg-blue-50 text-blue-700 border-blue-200" },
  cancelled: { label: "Cancelled", icon: <Ban className="w-3 h-3" />, className: "bg-gray-100 text-gray-600 border-gray-200" },
};

// ─────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────
function StatusBadge({ status }: { status: CollaborationStatus }) {
  const s = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.className}`}>
      {s.icon} {s.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// SKELETON LOADER
// ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="p-5 sm:p-6 border-b border-gray-100 last:border-0 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-gray-200 flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-48" />
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-20" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-4 bg-gray-100 rounded" />)}
      </div>
      <div className="h-3 bg-gray-100 rounded w-full mb-1" />
      <div className="h-3 bg-gray-100 rounded w-3/4" />
    </div>
  );
}

// ─────────────────────────────────────────────
// STAT CARD SKELETON
// ─────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4" />
      <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
      <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-32" />
    </div>
  );
}

// ─────────────────────────────────────────────
// COLLABORATION DETAIL MODAL
// ─────────────────────────────────────────────
function CollabDetailModal({
  id,
  onClose,
  onStatusUpdate,
}: {
  id: string;
  onClose: () => void;
  onStatusUpdate: (id: string, status: "accepted" | "rejected") => void;
}) {
  const [collab, setCollab] = useState<CollaborationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await getCollaborationById(id);
      if (res.success && res.data && !Array.isArray(res.data)) {
        setCollab(res.data);
      } else {
        setError(res.error || "Failed to load details");
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleAction = async (status: "accepted" | "rejected") => {
    setUpdating(true);
    setActionError("");
    const res = await updateCollaborationStatus(id, status);
    if (res.success) {
      onStatusUpdate(id, status);
      onClose();
    } else {
      setActionError(res.error || "Failed to update");
    }
    setUpdating(false);
  };

  const deadline = collab ? new Date(collab.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Collaboration Details</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : collab ? (
          <div className="p-6 space-y-5">
            {/* Business info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary">
                {collab.businessUser?.name?.charAt(0)?.toUpperCase() || "B"}
              </div>
              <div>
                <p className="font-bold text-gray-900">{collab.businessUser?.name}</p>
                <p className="text-sm text-gray-500">{collab.businessUser?.email}</p>
              </div>
              <div className="ml-auto"><StatusBadge status={collab.status} /></div>
            </div>

            {/* Campaign title */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Campaign</p>
              <h3 className="font-bold text-gray-900 text-lg">{collab.campaignTitle}</h3>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                <p className="text-xs text-gray-500 mb-1">Budget</p>
                <p className="font-bold text-gray-900 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-green-600" />
                  {collab.budget.toLocaleString("en-IN")}
                  {collab.barter && <span className="text-xs text-green-700 ml-1">+ Barter</span>}
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                <p className="text-xs text-gray-500 mb-1">Deadline</p>
                <p className="font-bold text-gray-900 text-sm">{deadline}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                <p className="text-xs text-gray-500 mb-1">Platform</p>
                <p className="font-bold text-gray-900 capitalize">{collab.platform}</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                <p className="text-xs text-gray-500 mb-1">Received</p>
                <p className="font-bold text-gray-900 text-sm">{new Date(collab.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{collab.description}</p>
            </div>

            {/* Deliverables */}
            {collab.deliverables?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Deliverables</p>
                <div className="flex flex-wrap gap-2">
                  {collab.deliverables.map((d, i) => (
                    <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-medium">{d}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {collab.notes && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">Notes</p>
                <p className="text-sm text-gray-700">{collab.notes}</p>
              </div>
            )}

            {/* Action error */}
            {actionError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {actionError}
              </div>
            )}

            {/* Actions */}
            {collab.status === "pending" && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleAction("accepted")}
                  disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors disabled:opacity-60"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Accept
                </button>
                <button
                  onClick={() => handleAction("rejected")}
                  disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors disabled:opacity-60"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Decline
                </button>
              </div>
            )}
          </div>
        ) : null}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-medium ${
        type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      {type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// COLLABORATION CARD
// ─────────────────────────────────────────────
function CollaborationCard({
  collab,
  onOpenDetail,
  onStatusUpdate,
}: {
  collab: CollaborationRequest;
  onOpenDetail: (id: string) => void;
  onStatusUpdate: (id: string, status: "accepted" | "rejected") => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);
  const [localStatus, setLocalStatus] = useState<CollaborationStatus>(collab.status);

  const deadline = new Date(collab.deadline);
  const isOverdue = deadline < new Date() && localStatus === "pending";
  const deadlineStr = deadline.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const handleAction = async (status: "accepted" | "rejected") => {
    setUpdating(true);
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
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 flex items-center justify-center font-bold text-brand-primary text-sm flex-shrink-0 border border-brand-primary/10">
            {collab.businessUser?.name?.charAt(0)?.toUpperCase() || "B"}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">{collab.businessUser?.name || "Business"}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{collab.campaignTitle}</p>
          </div>
        </div>
        <StatusBadge status={localStatus} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <IndianRupee className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
          <span className="font-semibold text-gray-900">
            {collab.barter ? `Barter + ₹${collab.budget.toLocaleString("en-IN")}` : `₹${collab.budget.toLocaleString("en-IN")}`}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? "text-red-600" : "text-gray-600"}`}>
          <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
          {isOverdue ? "Overdue · " : ""}{deadlineStr}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600 capitalize">
          <Tag className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          {collab.platform}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{collab.description}</p>

      {collab.deliverables?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {collab.deliverables.map((d, i) => (
            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100 font-medium">{d}</span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        {localStatus === "pending" && (
          <>
            <button
              onClick={() => handleAction("accepted")}
              disabled={updating}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-white py-2.5 rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors disabled:opacity-60 shadow-sm shadow-brand-primary/20"
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Accept
            </button>
            <button
              onClick={() => handleAction("rejected")}
              disabled={updating}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors disabled:opacity-60"
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Decline
            </button>
          </>
        )}
        <button
          onClick={() => onOpenDetail(collab._id)}
          className={`flex items-center gap-1 text-xs text-brand-primary font-medium hover:underline ${localStatus === "pending" ? "ml-auto" : ""}`}
        >
          Details <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {localStatus !== "pending" && (
        <div className={`mt-3 flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${
          localStatus === "accepted" ? "bg-green-50 text-green-700 border-green-100" :
          localStatus === "completed" ? "bg-blue-50 text-blue-700 border-blue-100" :
          localStatus === "cancelled" ? "bg-gray-100 text-gray-600 border-gray-200" :
          "bg-red-50 text-red-700 border-red-100"
        }`}>
          {STATUS_CONFIG[localStatus].icon}
          {localStatus === "accepted" ? "You accepted this collaboration" :
           localStatus === "completed" ? "Collaboration completed" :
           localStatus === "cancelled" ? "Cancelled by business" :
           "You declined this collaboration"}
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
export default function CreatorDashboardPage() {
  const [collaborations, setCollaborations] = useState<CollaborationRequest[]>([]);
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [inboxError, setInboxError] = useState("");
  const [filter, setFilter] = useState<"all" | CollaborationStatus>("all");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
  }, []);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    const res = await getCreatorStats();
    if (res.success && res.data) setStats(res.data);
    setStatsLoading(false);
  }, []);

  const fetchInbox = useCallback(async () => {
    setInboxLoading(true);
    setInboxError("");
    const res = await getCreatorInbox();
    if (res.success && Array.isArray(res.data)) {
      setCollaborations(res.data as CollaborationRequest[]);
    } else {
      setInboxError(res.error || "Failed to load collaboration requests");
    }
    setInboxLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
    fetchInbox();
  }, [fetchStats, fetchInbox]);

  const handleStatusUpdate = useCallback(async (id: string, status: "accepted" | "rejected") => {
    const res = await updateCollaborationStatus(id, status);
    if (res.success) {
      showToast(`Collaboration ${status} successfully`, "success");
      fetchStats(); // refresh stats counts
    } else {
      showToast(res.error || "Failed to update status", "error");
    }
  }, [fetchStats, showToast]);

  const filteredCollabs = collaborations.filter((c) =>
    filter === "all" ? true : c.status === filter
  );

  const pendingCount = stats?.pending ?? collaborations.filter((c) => c.status === "pending").length;

  const statCards = [
    {
      title: "Total Earnings",
      value: statsLoading ? "—" : `₹${(stats?.totalEarnings ?? 0).toLocaleString("en-IN")}`,
      subtitle: "From accepted & completed",
      icon: <Wallet className="w-6 h-6 text-brand-secondary" />,
      bg: "bg-green-50",
    },
    {
      title: "Active Collaborations",
      value: statsLoading ? "—" : String(stats?.activeCollaborations ?? 0),
      subtitle: "Currently accepted",
      icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      title: "Pending Requests",
      value: statsLoading ? "—" : String(stats?.pending ?? 0),
      subtitle: "Awaiting your response",
      icon: <Clock className="w-6 h-6 text-yellow-500" />,
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30">
        <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Creator Dashboard</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button className="flex items-center gap-2 bg-brand-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
              <Share2 className="w-4 h-4" /> Share Profile
            </button>
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-brand-primary rounded-full border border-white" />}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Profile Completion */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsLoading
            ? [1, 2, 3].map((i) => <StatSkeleton key={i} />)
            : statCards.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className={`${stat.bg} p-3 rounded-xl w-fit mb-4`}>{stat.icon}</div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <p className="text-xs text-gray-500 font-medium">{stat.subtitle}</p>
                </motion.div>
              ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Collaboration Inbox */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-gray-900 text-lg">Collaboration Requests</h3>
                  {pendingCount > 0 && (
                    <span className="bg-brand-primary text-white text-xs px-2 py-0.5 rounded-full">{pendingCount} New</span>
                  )}
                </div>
                <button onClick={() => { fetchInbox(); fetchStats(); }}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-primary transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-1 px-6 pt-4 border-b border-gray-100 overflow-x-auto">
                {(["all", "pending", "accepted", "rejected", "completed", "cancelled"] as const).map((tab) => {
                  const count = tab === "all" ? collaborations.length : collaborations.filter((c) => c.status === tab).length;
                  return (
                    <button key={tab} onClick={() => setFilter(tab)}
                      className={`pb-3 px-3 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${
                        filter === tab ? "border-brand-primary text-brand-primary" : "border-transparent text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {tab === "all" ? `All (${count})` : `${STATUS_CONFIG[tab].label} (${count})`}
                    </button>
                  );
                })}
              </div>

              {/* List */}
              {inboxLoading ? (
                <div className="divide-y divide-gray-100">
                  {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
                </div>
              ) : inboxError ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                  <p className="text-sm text-red-600 font-medium text-center mb-4">{inboxError}</p>
                  <button onClick={fetchInbox} className="flex items-center gap-2 text-sm text-brand-primary font-medium hover:underline">
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
                    {filter === "all" ? "Businesses will reach out to collaborate with you here." : "Try switching filters above."}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="divide-y divide-gray-50">
                    {filteredCollabs.map((collab) => (
                      <CollaborationCard key={collab._id} collab={collab}
                        onOpenDetail={setDetailId}
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
                    <div key={item} className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 cursor-pointer border border-gray-200">
                      <img src={`https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80&random=${item}`} alt="Portfolio item" className="w-full h-full object-cover" />
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
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/discover" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-primary/30 hover:bg-blue-50 transition-colors group">
                  <div className="bg-white p-2 rounded-lg shadow-sm group-hover:text-brand-primary"><Search className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-brand-primary">Browse Creators</span>
                </Link>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-primary/30 hover:bg-blue-50 transition-colors group">
                  <div className="bg-white p-2 rounded-lg shadow-sm group-hover:text-brand-primary"><Edit className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-brand-primary text-left">Update pricing</span>
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            {!statsLoading && stats && (
              <div className="bg-gradient-to-br from-brand-primary to-brand-primary/80 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <h3 className="font-bold text-lg mb-1 relative z-10">Inbox Summary</h3>
                <p className="text-blue-100 text-sm mb-5 relative z-10">Your collaboration overview</p>
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  {[
                    { label: "Pending", count: stats.pending, bg: "bg-yellow-400/20" },
                    { label: "Accepted", count: stats.accepted, bg: "bg-green-400/20" },
                    { label: "Completed", count: stats.completed, bg: "bg-blue-400/20" },
                    { label: "Rejected", count: stats.rejected, bg: "bg-red-400/20" },
                  ].map((item) => (
                    <div key={item.label} className={`${item.bg} rounded-xl p-3 text-center`}>
                      <div className="text-2xl font-bold">{item.count}</div>
                      <div className="text-xs text-white/80 mt-0.5">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Recent Reviews</h3>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { brand: "Style Boutique", review: "\"Amazing work! The reel got us 50+ new customers.\"" },
                  { brand: "Tech Gadgets Hub", review: "\"Very professional unboxing video. Delivered as promised.\"" },
                ].map((r, i) => (
                  <div key={i} className={i === 0 ? "pb-4 border-b border-gray-50" : ""}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm text-gray-900">{r.brand}</h4>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 text-brand-accent fill-brand-accent" />)}
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

      {/* Detail Modal */}
      <AnimatePresence>
        {detailId && (
          <CollabDetailModal
            id={detailId}
            onClose={() => setDetailId(null)}
            onStatusUpdate={(id, status) => {
              setCollaborations((prev) => prev.map((c) => c._id === id ? { ...c, status } : c));
              fetchStats();
            }}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
