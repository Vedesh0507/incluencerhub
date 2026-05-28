"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getSocket, SOCKET_EVENTS } from "@/services/socketService";
import {
  Users, TrendingUp, Heart, Bell, Search, Loader2,
  AlertCircle, RefreshCw, CheckCircle, XCircle, Clock,
  IndianRupee, CalendarDays, Tag, Send, Plus, Ban,
  X, ChevronRight,
} from "lucide-react";
import { mockCreators } from "@/data/mock";
import {
  getBusinessRequests,
  getBusinessStats,
  getCollaborationById,
  updateCollaborationStatus,
  type CollaborationRequest,
  type CollaborationStatus,
  type BusinessStats,
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

function StatusBadge({ status }: { status: CollaborationStatus }) {
  const s = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.className}`}>
      {s.icon} {s.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// SKELETON
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

function RequestSkeleton() {
  return (
    <div className="p-5 sm:p-6 border-b border-gray-100 last:border-0 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-28 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-20" />
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-20" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-full mb-1" />
      <div className="h-3 bg-gray-100 rounded w-3/4" />
    </div>
  );
}

// ─────────────────────────────────────────────
// DETAIL MODAL (business view — can cancel)
// ─────────────────────────────────────────────
function CollabDetailModal({
  id,
  onClose,
  onCancelled,
}: {
  id: string;
  onClose: () => void;
  onCancelled: (id: string) => void;
}) {
  const [collab, setCollab] = useState<CollaborationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await getCollaborationById(id);
      if (res.success && res.data && !Array.isArray(res.data)) setCollab(res.data);
      else setError(res.error || "Failed to load details");
      setLoading(false);
    };
    load();
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    setActionError("");
    const res = await updateCollaborationStatus(id, "cancelled");
    if (res.success) {
      onCancelled(id);
      onClose();
    } else {
      setActionError(res.error || "Failed to cancel");
    }
    setCancelling(false);
  };

  const deadline = collab ? new Date(collab.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
            {/* Creator info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary">
                {collab.creatorProfile?.username?.charAt(0)?.toUpperCase() || "C"}
              </div>
              <div>
                <p className="font-bold text-gray-900">@{collab.creatorProfile?.username}</p>
                <p className="text-sm text-gray-500 capitalize">{collab.creatorProfile?.category}</p>
              </div>
              <div className="ml-auto"><StatusBadge status={collab.status} /></div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Campaign</p>
              <h3 className="font-bold text-gray-900 text-lg">{collab.campaignTitle}</h3>
            </div>

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
                <p className="text-xs text-gray-500 mb-1">Sent on</p>
                <p className="font-bold text-gray-900 text-sm">{new Date(collab.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{collab.description}</p>
            </div>

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

            {collab.notes && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">Notes</p>
                <p className="text-sm text-gray-700">{collab.notes}</p>
              </div>
            )}

            {actionError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {actionError}
              </div>
            )}

            {/* Business can only cancel pending requests */}
            {collab.status === "pending" && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-700 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors disabled:opacity-60"
              >
                {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                Cancel Request
              </button>
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
      initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }}
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
// MAIN DASHBOARD
// ─────────────────────────────────────────────
export default function BusinessDashboardPage() {
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState("");
  const [filter, setFilter] = useState<"all" | CollaborationStatus>("all");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
  }, []);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    const res = await getBusinessStats();
    if (res.success && res.data) setStats(res.data);
    setStatsLoading(false);
  }, []);

  const fetchRequests = useCallback(async () => {
    setRequestsLoading(true);
    setRequestsError("");
    const res = await getBusinessRequests();
    if (res.success && Array.isArray(res.data)) {
      setRequests(res.data as CollaborationRequest[]);
    } else {
      setRequestsError(res.error || "Failed to load sent requests");
    }
    setRequestsLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
    fetchRequests();
  }, [fetchStats, fetchRequests]);

  // ── Real-time socket updates ─────────────────────────
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNotification = () => {
      fetchStats();
      fetchRequests();
    };

    socket.on(SOCKET_EVENTS.NOTIFICATION, handleNotification);
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNotification);

    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION, handleNotification);
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNotification);
    };
  }, [fetchStats, fetchRequests]);

  const handleCancelled = useCallback((id: string) => {
    setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status: "cancelled" as CollaborationStatus } : r));
    fetchStats();
    showToast("Request cancelled", "success");
  }, [fetchStats, showToast]);

  const filteredRequests = requests.filter((r) =>
    filter === "all" ? true : r.status === filter
  );

  const pendingCount = stats?.pending ?? requests.filter((r) => r.status === "pending").length;

  const statCards = [
    {
      title: "Sent Requests",
      value: statsLoading ? "—" : String(stats?.sentRequests ?? 0),
      trend: statsLoading ? "" : `${pendingCount} awaiting response`,
      icon: <Send className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      title: "Active Campaigns",
      value: statsLoading ? "—" : String(stats?.activeCampaigns ?? 0),
      trend: "Accepted collaborations",
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      bg: "bg-green-50",
    },
    {
      title: "Total Reach",
      value: "124K",
      trend: "+12% vs last month",
      icon: <Users className="w-6 h-6 text-purple-500" />,
      bg: "bg-purple-50",
    },
    {
      title: "Budget Allocated",
      value: statsLoading ? "—" : `₹${(stats?.totalBudgetSpent ?? 0).toLocaleString("en-IN")}`,
      trend: "Accepted + completed",
      icon: <IndianRupee className="w-6 h-6 text-orange-500" />,
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
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
              {pendingCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />}
            </button>
            <div className="h-8 w-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">SB</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Welcome */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl text-gray-600">Welcome back, <span className="font-bold text-gray-900">Spice Route Restaurant</span></h2>
            <p className="text-sm text-gray-500 mt-1">Here&apos;s what&apos;s happening with your campaigns today.</p>
          </div>
          <Link href="/discover" className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm">
            <Plus className="w-5 h-5" /> Find Creators
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsLoading
            ? [1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)
            : statCards.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className={`${stat.bg} p-3 rounded-xl w-fit mb-4`}>{stat.icon}</div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <p className="text-xs text-gray-500 font-medium">{stat.trend}</p>
                </motion.div>
              ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sent Collaborations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-gray-900 text-lg">Sent Collaborations</h3>
                  {pendingCount > 0 && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full border border-yellow-200 font-semibold">
                      {pendingCount} Awaiting
                    </span>
                  )}
                </div>
                <button onClick={() => { fetchRequests(); fetchStats(); }}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-primary transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1 px-6 pt-4 border-b border-gray-100 overflow-x-auto">
                {(["all", "pending", "accepted", "rejected", "completed", "cancelled"] as const).map((tab) => {
                  const count = tab === "all" ? requests.length : requests.filter((r) => r.status === tab).length;
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
              {requestsLoading ? (
                <div className="divide-y divide-gray-100">
                  {[1, 2, 3].map((i) => <RequestSkeleton key={i} />)}
                </div>
              ) : requestsError ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                  <p className="text-sm text-red-600 font-medium text-center mb-4">{requestsError}</p>
                  <button onClick={fetchRequests} className="flex items-center gap-2 text-sm text-brand-primary font-medium hover:underline">
                    <RefreshCw className="w-4 h-4" /> Try again
                  </button>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <Send className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {filter === "all" ? "No collaborations sent yet" : `No ${filter} requests`}
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    {filter === "all" ? "Browse creators and send your first collaboration request." : "Try switching filters."}
                  </p>
                  {filter === "all" && (
                    <Link href="/discover" className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors">
                      <Search className="w-4 h-4" /> Browse Creators
                    </Link>
                  )}
                </div>
              ) : (
                <AnimatePresence>
                  <div className="divide-y divide-gray-50">
                    {filteredRequests.map((req, i) => {
                      const deadline = new Date(req.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                      return (
                        <motion.div key={req._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                          className="p-5 sm:p-6 hover:bg-gray-50/80 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/10 flex items-center justify-center font-bold text-brand-primary text-sm flex-shrink-0">
                                {req.creatorProfile?.username?.charAt(0)?.toUpperCase() || "C"}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-sm">@{req.creatorProfile?.username || "creator"}</h4>
                                <p className="text-xs text-gray-500 capitalize mt-0.5">{req.creatorProfile?.category}</p>
                              </div>
                            </div>
                            <StatusBadge status={req.status} />
                          </div>

                          <p className="text-sm font-semibold text-gray-900 mb-2">{req.campaignTitle}</p>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{req.description}</p>

                          <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <IndianRupee className="w-3.5 h-3.5 text-green-600" />
                              <span className="font-semibold text-gray-900">₹{req.budget.toLocaleString("en-IN")}</span>
                              {req.barter && " + Barter"}
                            </span>
                            <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{deadline}</span>
                            <span className="flex items-center gap-1 capitalize"><Tag className="w-3.5 h-3.5 text-blue-500" />{req.platform}</span>
                          </div>

                          <button onClick={() => setDetailId(req._id)}
                            className="flex items-center gap-1 text-xs text-brand-primary font-medium hover:underline"
                          >
                            View Details <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </AnimatePresence>
              )}
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
                    <Link href={`/creator/${creator.id}`} className="text-xs text-brand-primary font-medium hover:underline">View</Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Stats */}
            {!statsLoading && stats && (
              <div className="bg-gradient-to-br from-brand-primary to-brand-primary/80 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <h3 className="font-bold text-lg mb-1 relative z-10">Campaign Stats</h3>
                <p className="text-sm text-blue-100 mb-5 relative z-10">Your collaboration overview</p>
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  {[
                    { label: "Pending", count: stats.pending, bg: "bg-yellow-400/20" },
                    { label: "Accepted", count: stats.acceptedCreators, bg: "bg-green-400/20" },
                    { label: "Completed", count: stats.completed, bg: "bg-blue-400/20" },
                    { label: "Cancelled", count: stats.cancelled, bg: "bg-gray-400/20" },
                  ].map((item) => (
                    <div key={item.label} className={`${item.bg} rounded-xl p-3 text-center`}>
                      <div className="text-2xl font-bold">{item.count}</div>
                      <div className="text-xs text-white/80 mt-0.5">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Post a Job */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-2">Looking for Staff?</h3>
              <p className="text-sm text-gray-500 mb-4">Post local job openings and hire freelancers instantly.</p>
              <button className="w-full bg-brand-primary text-white py-2.5 rounded-xl font-bold text-sm hover:bg-primary-700 transition-colors">
                Post a Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailId && (
          <CollabDetailModal id={detailId} onClose={() => setDetailId(null)} onCancelled={handleCancelled} />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
