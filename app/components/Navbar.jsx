// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search, Bell, User, PlusCircle, LogIn } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from your auth system

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md py-2"
          : "bg-gradient-to-r from-orange-500 to-orange-600 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-white rounded-lg transform rotate-3 transition-transform group-hover:rotate-6"></div>
                <div className="absolute inset-0 bg-orange-400 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  G
                </div>
              </div>
              <span
                className={`text-2xl font-bold ${
                  isScrolled ? "text-gray-800" : "text-white"
                }`}
              >
                Ghorchai
              </span>
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden lg:flex items-center bg-white rounded-full shadow-md w-96">
              <input
                type="text"
                placeholder="Search in Ghorchai..."
                className="w-full px-4 py-2 rounded-l-full focus:outline-none text-gray-700"
              />
              <button className="bg-orange-500 text-white p-2 rounded-r-full hover:bg-orange-600 transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Free Ads Button */}
            <Link
              href="/post-ad"
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                isScrolled
                  ? "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg"
                  : "bg-white text-orange-600 hover:bg-orange-50 hover:shadow-lg"
              }`}
            >
              <PlusCircle size={20} />
              <span className="font-medium">Free Ad</span>
            </Link>

            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Bell size={22} className={isScrolled ? "text-gray-600" : "text-white"} />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                      U
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 hidden group-hover:block">
                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-orange-50">
                      My Profile
                    </Link>
                    <Link href="/my-ads" className="block px-4 py-2 text-gray-700 hover:bg-orange-50">
                      My Ads
                    </Link>
                    <Link href="/messages" className="block px-4 py-2 text-gray-700 hover:bg-orange-50">
                      Messages
                    </Link>
                    <hr className="my-2" />
                    <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link
                  href="/login"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                    isScrolled
                      ? "text-gray-600 hover:text-orange-600"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <LogIn size={20} />
                  <span className="font-medium">Login</span>
                </Link>

                {/* Sign Up Button */}
                <Link
                  href="/signup"
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    isScrolled
                      ? "bg-gray-800 text-white hover:bg-gray-900"
                      : "bg-white text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Search */}
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Search size={22} className={isScrolled ? "text-gray-600" : "text-white"} />
            </button>

            {/* Mobile Free Ad */}
            <Link
              href="/post-ad"
              className={`p-2 rounded-full ${
                isScrolled ? "bg-orange-500 text-white" : "bg-white text-orange-600"
              }`}
            >
              <PlusCircle size={22} />
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isOpen ? (
                <X size={24} className={isScrolled ? "text-gray-600" : "text-white"} />
              ) : (
                <Menu size={24} className={isScrolled ? "text-gray-600" : "text-white"} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-xl py-4 animate-slideDown">
            <div className="px-4 space-y-3">
              {/* Mobile Search Bar */}
              <div className="flex items-center bg-gray-100 rounded-full">
                <input
                  type="text"
                  placeholder="Search in Ghorchai..."
                  className="w-full px-4 py-2 bg-transparent rounded-l-full focus:outline-none"
                />
                <button className="bg-orange-500 text-white p-2 rounded-r-full">
                  <Search size={20} />
                </button>
              </div>

              {isLoggedIn ? (
                <>
                  <Link href="/profile" className="block py-2 text-gray-700 hover:text-orange-600">
                    My Profile
                  </Link>
                  <Link href="/my-ads" className="block py-2 text-gray-700 hover:text-orange-600">
                    My Ads
                  </Link>
                  <Link href="/messages" className="block py-2 text-gray-700 hover:text-orange-600">
                    Messages
                  </Link>
                  <hr />
                  <button className="block w-full text-left py-2 text-red-600">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block py-2 text-gray-700 hover:text-orange-600">
                    Login
                  </Link>
                  <Link href="/signup" className="block py-2 text-gray-700 hover:text-orange-600">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;