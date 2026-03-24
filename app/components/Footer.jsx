// components/Footer.jsx
"use client";

import Link from "next/link";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Heart,
  Globe,
  Smartphone,
  Shield,
  Award
} from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Company Info - Ghorchai */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-orange-500 rounded-lg transform rotate-3"></div>
                <div className="absolute inset-0 bg-orange-400 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  G
                </div>
              </div>
              <span className="text-2xl font-bold text-white">Ghorchai</span>
            </Link>
            
            <p className="text-sm text-gray-400 leading-relaxed">
              Bangladesh's fastest growing marketplace. Buy and sell everything from electronics to real estate, all in one place.
            </p>

            {/* Trust Badges */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-gray-800/50 px-3 py-1.5 rounded-full">
                <Shield size={14} className="text-green-400" />
                <span className="text-xs text-gray-300">SSL Secure</span>
              </div>
              <div className="flex items-center space-x-1 bg-gray-800/50 px-3 py-1.5 rounded-full">
                <Award size={14} className="text-orange-400" />
                <span className="text-xs text-gray-300">Trusted Since 2024</span>
              </div>
            </div>

            {/* App Download Buttons */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-200">Download App</p>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center space-x-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-all hover:scale-105">
                  <Smartphone size={18} />
                  <div className="text-left">
                    <div className="text-xs">Download on</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </button>
                <button className="flex items-center space-x-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-all hover:scale-105">
                  <Smartphone size={18} />
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "/about" },
                { name: "How It Works", href: "/how-it-works" },
                { name: "Popular Items", href: "/popular" },
                { name: "Blog", href: "/blog" },
                { name: "Careers", href: "/careers" },
                { name: "Press", href: "/press" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 transition-colors flex items-center group"
                  >
                    <ChevronRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Top Categories</h3>
            <ul className="space-y-3">
              {[
                { name: "Electronics", href: "/category/electronics", count: "12.5k" },
                { name: "Vehicles", href: "/category/vehicles", count: "8.2k" },
                { name: "Properties", href: "/category/properties", count: "5.1k" },
                { name: "Furniture", href: "/category/furniture", count: "4.3k" },
                { name: "Fashion", href: "/category/fashion", count: "3.8k" },
                { name: "Pets", href: "/category/pets", count: "2.1k" },
              ].map((category) => (
                <li key={category.name}>
                  <Link 
                    href={category.href}
                    className="text-gray-400 hover:text-orange-400 transition-colors flex items-center justify-between group"
                  >
                    <span className="flex items-center">
                      <ChevronRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                      {category.name}
                    </span>
                    <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full text-gray-400">
                      {category.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Help */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              {[
                { name: "Help Center", href: "/help" },
                { name: "Safety Tips", href: "/safety" },
                { name: "Contact Us", href: "/contact" },
                { name: "FAQs", href: "/faqs" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Privacy Policy", href: "/privacy" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 transition-colors flex items-center group"
                  >
                    <ChevronRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone size={14} className="text-orange-400" />
                <span className="text-sm">+880 1234-567890</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail size={14} className="text-orange-400" />
                <span className="text-sm">support@ghorchai.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin size={14} className="text-orange-400" />
                <span className="text-sm">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get the latest deals and updates
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all hover:shadow-lg hover:shadow-orange-500/25"
              >
                Subscribe
              </button>
            </form>

            {subscribed && (
              <div className="mt-3 p-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-xs text-green-400 text-center">
                  ✓ Successfully subscribed!
                </p>
              </div>
            )}

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-200 mb-3">Follow Us</h4>
              <div className="flex items-center space-x-3">
                {[
                  { icon: Facebook, href: "https://facebook.com", color: "hover:bg-blue-600" },
                  { icon: Twitter, href: "https://twitter.com", color: "hover:bg-blue-400" },
                  { icon: Instagram, href: "https://instagram.com", color: "hover:bg-pink-600" },
                  { icon: Youtube, href: "https://youtube.com", color: "hover:bg-red-600" },
                  { icon: Linkedin, href: "https://linkedin.com", color: "hover:bg-blue-700" },
                ].map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`bg-gray-800 p-2 rounded-lg hover:scale-110 transition-all ${social.color}`}
                    >
                      <Icon size={18} className="text-gray-300 hover:text-white" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "500K+", label: "Active Users", icon: "👥" },
              { value: "1.2M+", label: "Listings", icon: "📦" },
              { value: "64", label: "Cities", icon: "🏙️" },
              { value: "24/7", label: "Support", icon: "🛎️" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">We Accept:</span>
              <div className="flex items-center space-x-2">
                {["Visa", "Mastercard", "bKash", "Nagad", "Rocket"].map((method) => (
                  <span
                    key={method}
                    className="px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-full"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-4">
              <Globe size={16} className="text-gray-500" />
              <select className="bg-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-orange-500">
                <option value="en">English</option>
                <option value="bn">বাংলা</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © {currentYear} Ghorchai. All rights reserved. Made with{" "}
              <Heart size={12} className="inline text-red-500 mx-0.5" /> in Bangladesh
            </p>
            
            <div className="flex items-center space-x-6">
              <Link href="/sitemap" className="text-xs text-gray-500 hover:text-orange-400">
                Sitemap
              </Link>
              <Link href="/privacy" className="text-xs text-gray-500 hover:text-orange-400">
                Privacy
              </Link>
              <Link href="/terms" className="text-xs text-gray-500 hover:text-orange-400">
                Terms
              </Link>
              <Link href="/cookies" className="text-xs text-gray-500 hover:text-orange-400">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;