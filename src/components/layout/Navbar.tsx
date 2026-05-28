"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Hexagon, MessageCircle, LogOut, LayoutDashboard, User } from "lucide-react";
import clsx from "clsx";
import { NotificationBell } from "./NotificationBell";
import { connectSocket, disconnectSocket } from "@/services/socketService";

export function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check auth state
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
        // Connect socket when authenticated
        connectSocket(token);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    // Listen for storage changes (login/logout in other tabs)
    const handleStorage = () => {
      const t = localStorage.getItem("token");
      const u = localStorage.getItem("user");
      if (t && u) {
        try {
          setUser(JSON.parse(u));
          connectSocket(t);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
        disconnectSocket();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    disconnectSocket();
    setMobileMenuOpen(false);
    router.push("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Discover", path: "/discover" },
    ...(user ? [{ name: "Messages", path: "/messages" }] : []),
    { name: "Events", path: "/events" },
    { name: "About", path: "/about" },
  ];

  const getDashboardPath = () => {
    if (!user) return "/";
    return user.role === "business"
      ? "/dashboard/business"
      : "/dashboard/creator";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      className={clsx(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Hexagon className="w-8 h-8 text-brand-primary fill-brand-primary/20 group-hover:fill-brand-primary/40 transition-all" />
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Influence<span className="text-brand-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Messages shortcut */}
                <Link
                  href="/messages"
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all"
                  aria-label="Messages"
                >
                  <MessageCircle className="w-5 h-5" />
                </Link>

                {/* Notification Bell */}
                <NotificationBell />

                {/* Dashboard */}
                <Link
                  href={getDashboardPath()}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all"
                  aria-label="Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Link>

                {/* User avatar / name */}
                <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user.name}
                  </span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  aria-label="Logout"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors px-4 py-2"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/role"
                  className="text-sm font-medium bg-brand-primary text-white px-5 py-2.5 rounded-full hover:bg-primary-700 transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-600 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 py-4 px-4 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="text-base font-medium text-gray-700 p-2 hover:bg-primary-50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
              {/* User info */}
              <div className="flex items-center gap-3 px-2 py-2">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                    {getInitials(user.name)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>

              <Link
                href={getDashboardPath()}
                className="flex items-center gap-2 text-base font-medium text-gray-700 p-2 hover:bg-primary-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>

              <Link
                href="/messages"
                className="flex items-center gap-2 text-base font-medium text-gray-700 p-2 hover:bg-primary-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageCircle className="w-5 h-5" />
                Messages
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-base font-medium text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors text-left"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
              <Link
                href="/auth/login"
                className="text-center text-base font-medium text-gray-700 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/auth/role"
                className="text-center text-base font-medium bg-brand-primary text-white py-3 rounded-lg hover:bg-primary-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </header>
  );
}
