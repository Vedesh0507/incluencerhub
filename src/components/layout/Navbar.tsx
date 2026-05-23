"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Hexagon } from "lucide-react";
import clsx from "clsx";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Discover", path: "/discover" },
    { name: "Events", path: "/events" },
    { name: "Jobs", path: "/jobs" },
    { name: "About", path: "/about" },
  ];

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
          <div className="hidden md:flex items-center gap-4">
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
        </motion.div>
      )}
    </header>
  );
}
