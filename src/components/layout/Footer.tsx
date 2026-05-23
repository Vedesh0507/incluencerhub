import Link from "next/link";
import { Hexagon, Instagram, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Hexagon className="w-8 h-8 text-brand-primary fill-brand-primary" />
              <span className="font-bold text-xl tracking-tight text-white">
                Influence<span className="text-brand-primary">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">
              Connecting local businesses with the best content creators, influencers, and freelancers in Vijayawada.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/discover" className="hover:text-brand-primary transition-colors">Discover Creators</Link></li>
              <li><Link href="/jobs" className="hover:text-brand-primary transition-colors">Local Jobs</Link></li>
              <li><Link href="/events" className="hover:text-brand-primary transition-colors">Upcoming Events</Link></li>
              <li><Link href="/pricing" className="hover:text-brand-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/blog" className="hover:text-brand-primary transition-colors">Creator Blog</Link></li>
              <li><Link href="/success-stories" className="hover:text-brand-primary transition-colors">Success Stories</Link></li>
              <li><Link href="/guidelines" className="hover:text-brand-primary transition-colors">Community Guidelines</Link></li>
              <li><Link href="/help" className="hover:text-brand-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li>Benz Circle, Vijayawada</li>
              <li>Andhra Pradesh, 520010</li>
              <li className="pt-2">
                <a href="mailto:hello@influencehub.in" className="hover:text-white transition-colors">hello@influencehub.in</a>
              </li>
              <li>+91 98765 43210</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© {new Date().getFullYear()} InfluenceHub Vijayawada. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
