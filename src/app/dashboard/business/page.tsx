"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Users, TrendingUp, Heart, Briefcase, Plus, Bell,
  Search, Filter, MoreHorizontal, Loader2, AlertCircle,
  RefreshCw, CheckCircle, XCircle, Clock, IndianRupee,
  CalendarDays, Tag, Building2, Send,
} from "lucide-react";
import { mockCreators } from "@/data/mock";
import {
  getBusinessRequests,
  type CollaborationRequest,
} from "@/services/collaborationService";

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: CollaborationRequest["status"] }) {
  const config = {
    pending: { label: "Pending", icon: <Clock className="w-3 h-3" />, className: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
    accepted: { label: "Accepted", icon: <CheckCircle className="w-3 h-3" />, className: "bg-green-50 text-green-700 border border-green-200" },
    rejected: { label: "Rejected", icon: <XCircle className="w-3 h-3" />, className: "bg-red-50 text-red-700 border border-red-200" },
    completed: { label: "Completed", icon: <CheckCircle className="w-3 h-3" />, className: "bg-blue-50 text-blue-700 border border-blue-200" },
  };
  const s = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.className}`}>
      {s.icon} {s.label}
    </span>
  );
}

// ── Helper: avatar initials ───────────────────────────────────────────────────
function UserAvatar({ name }: { name: string }) {
  return (
    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
      {name.charAt(0)}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function BusinessDashboardPage() {
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState("");

  const fetchRequests = useCallback(async () => {
    setRequestsLoading(true);
    setRequestsError("");
    const result = await getBusinessRequests();
    if (result.success && Array.isArray(result.data)) {
      setRequests(result.data as CollaborationRequest[]);
    } else {
      setRequestsError(result.error || "Failed to load sent requests");
    }
    setRequestsLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const acceptedCount = requests.filter((r) => r.status === "accepted").length;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30">
        <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
              )}
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
            <h2 className="text-xl text-gray-600">
              Welcome back, <span className="font-bold text-gray-900">Spice Route Restaurant</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Here&apos;s what&apos;s happening with your campaigns today.
            </p>
          </div>
          <Link
            href="/discover"
            className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" /> Find Creators
          </Link>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Sent Requests",
              value: String(requests.length),
              icon: <Send className="w-6 h-6 text-blue-500" />,
              trend: `${pendingCount} pending`,
              bg: "bg-blue-50",
            },
            {
              title: "Accepted",
              value: String(acceptedCount),
              icon: <CheckCircle className="w-6 h-6 text-green-500" />,
              trend: "Active collaborations",
              bg: "bg-green-50",
            },
            {
              title: "Total Reach",
              value: "124K",
              icon: <Users className="w-6 h-6 text-purple-500" />,
              trend: "+12% vs last month",
              bg: "bg-purple-50",
            },
            {
              title: "Saved Creators",
              value: "12",
              icon: <Heart className="w-6 h-6 text-red-500" />,
              trend: "View list",
              bg: "bg-red-50",
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
              <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <p className="text-xs text-gray-500 font-medium">{stat.trend}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── SENT COLLABORATION REQUESTS ──────────────────── */}
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
                <button
                  onClick={fetchRequests}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-primary transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>

              {requestsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500 font-medium">Loading sent requests…</p>
                  </div>
                </div>
              ) : requestsError ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                  <p className="text-sm text-red-600 font-medium text-center mb-4">{requestsError}</p>
                  <button
                    onClick={fetchRequests}
                    className="flex items-center gap-2 text-sm text-brand-primary font-medium hover:underline"
                  >
                    <RefreshCw className="w-4 h-4" /> Try again
                  </button>
                </div>
              ) : requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <Send className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">No collaborations sent yet</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Browse creators and send your first collaboration request.
                  </p>
                  <Link
                    href="/discover"
                    className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors"
                  >
                    <Search className="w-4 h-4" /> Browse Creators
                  </Link>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="divide-y divide-gray-50">
                    {requests.map((req, i) => {
                      const deadline = new Date(req.deadline);
                      const deadlineStr = deadline.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      });
                      return (
                        <motion.div
                          key={req._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-5 sm:p-6 hover:bg-gray-50/80 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/10 flex items-center justify-center font-bold text-brand-primary text-sm flex-shrink-0">
                                {req.creatorProfile?.username?.charAt(0)?.toUpperCase() || "C"}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-sm">
                                  @{req.creatorProfile?.username || "creator"}
                                </h4>
                                <p className="text-xs text-gray-500 capitalize mt-0.5">
                                  {req.creatorProfile?.category}
                                </p>
                              </div>
                            </div>
                            <StatusBadge status={req.status} />
                          </div>

                          <p className="text-sm font-semibold text-gray-900 mb-2">{req.campaignTitle}</p>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{req.description}</p>

                          <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <IndianRupee className="w-3.5 h-3.5 text-green-600" />
                              <span className="font-semibold text-gray-900">₹{req.budget.toLocaleString("en-IN")}</span>
                              {req.barter && " + Barter"}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3.5 h-3.5" />
                              {deadlineStr}
                            </span>
                            <span className="flex items-center gap-1 capitalize">
                              <Tag className="w-3.5 h-3.5 text-blue-500" />
                              {req.platform}
                            </span>
                          </div>
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
                <Link href="/discover" className="text-sm font-medium text-brand-primary hover:underline">
                  Find more
                </Link>
              </div>
              <div className="p-6 space-y-4">
                {mockCreators.slice(0, 4).map((creator, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <img
                        src={creator.image}
                        alt={creator.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 group-hover:text-brand-primary transition-colors">
                          {creator.name}
                        </h4>
                        <p className="text-xs text-gray-500">{creator.followers} followers</p>
                      </div>
                    </div>
                    <Link
                      href={`/creator/${creator.id}`}
                      className="text-xs text-brand-primary font-medium hover:underline"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Quick Stats */}
            <div className="bg-gradient-to-br from-brand-primary to-brand-primary/80 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <h3 className="font-bold text-lg mb-1 relative z-10">Campaign Stats</h3>
              <p className="text-sm text-blue-100 mb-5 relative z-10">Your collaboration overview</p>
              <div className="grid grid-cols-2 gap-3 relative z-10">
                {[
                  { label: "Pending", count: requests.filter((r) => r.status === "pending").length, bg: "bg-yellow-400/20" },
                  { label: "Accepted", count: requests.filter((r) => r.status === "accepted").length, bg: "bg-green-400/20" },
                  { label: "Rejected", count: requests.filter((r) => r.status === "rejected").length, bg: "bg-red-400/20" },
                  { label: "Completed", count: requests.filter((r) => r.status === "completed").length, bg: "bg-blue-400/20" },
                ].map((item) => (
                  <div key={item.label} className={`${item.bg} rounded-xl p-3 text-center`}>
                    <div className="text-2xl font-bold">{item.count}</div>
                    <div className="text-xs text-white/80 mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

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
    </div>
  );
}
