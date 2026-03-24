// app/profile/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useAdStore } from "../store/adStore";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaHeart,
  FaEye,
  FaStar,
  FaCheckCircle,
  FaRegHeart,
  FaTrash,
  FaSignOutAlt,
  FaShieldAlt,
  FaChartLine,
  FaHome,
  FaClock,
  FaBell,
  FaLock,
  FaGlobe,
  FaLanguage,
  FaCog,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLink
} from "react-icons/fa";
import { MdVerified, MdOutlineEmail, MdLocationOn, MdPhone } from "react-icons/md";

// Mock user data (would come from API)
const mockUser = {
  id: 1,
  name: "Rahman Ahmed",
  email: "rahman@example.com",
  phone: "+880 1712 345678",
  location: "Dhanmondi, Dhaka",
  joinDate: "January 15, 2024",
  avatar: null,
  coverPhoto: null,
  bio: "Real estate enthusiast and property investor. Helping people find their dream homes since 2020. Passionate about architecture and interior design.",
  verified: true,
  rating: 4.8,
  totalListings: 12,
  activeListings: 8,
  soldListings: 4,
  totalViews: 3456,
  totalFavorites: 89,
  responseRate: 98,
  responseTime: "2 hours",
  memberSince: "2024",
  languages: ["English", "Bengali"],
  savedListings: [],
  socialLinks: {
    facebook: "https://facebook.com/rahman",
    twitter: "https://twitter.com/rahman",
    instagram: "https://instagram.com/rahman",
    whatsapp: "https://wa.me/8801712345678"
  },
  badges: ["Top Seller", "Verified", "Fast Responder", "Trusted"],
  stats: {
    monthly: {
      views: 1234,
      inquiries: 56,
      favorites: 34
    },
    yearly: {
      views: 12345,
      inquiries: 678,
      favorites: 456
    }
  }
};

// Mock user listings
const mockListings = [
  {
    id: 1,
    title: "Luxury 3BR Apartment in Dhanmondi",
    price: "৳85,000",
    location: "Dhanmondi, Dhaka",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
    status: "active",
    views: 234,
    favorites: 45,
    postedDate: "2 days ago"
  },
  {
    id: 2,
    title: "Modern Duplex House in Gulshan",
    price: "৳1,50,000",
    location: "Gulshan, Dhaka",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500",
    status: "active",
    views: 567,
    favorites: 89,
    postedDate: "5 days ago"
  },
  {
    id: 3,
    title: "Commercial Space in Banani",
    price: "৳2,00,000",
    location: "Banani, Dhaka",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500",
    status: "pending",
    views: 123,
    favorites: 23,
    postedDate: "1 week ago"
  },
  {
    id: 4,
    title: "Affordable 2BR Flat in Uttara",
    price: "৳35,000",
    location: "Uttara, Dhaka",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
    status: "sold",
    views: 89,
    favorites: 12,
    postedDate: "2 weeks ago"
  }
];

// Mock saved listings
const mockSavedListings = [
  {
    id: 5,
    title: "Penthouse with Rooftop Garden",
    price: "৳2,50,000",
    location: "Baridhara, Dhaka",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500",
    savedDate: "1 day ago"
  },
  {
    id: 6,
    title: "Studio Apartment in Chittagong",
    price: "৳25,000",
    location: "Agrabad, Chittagong",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
    savedDate: "3 days ago"
  }
];

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, logout } = useAuthStore();
  const { ads } = useAdStore();
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("listings");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Redirect if not logged in
//   useEffect(() => {
//     if (!authUser) {
//       router.push("/login");
//     }
//   }, [authUser, router]);

  // Form state
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: user.location,
    bio: user.bio
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  const handleImageUpload = async (type, file) => {
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === "avatar") {
          setUser(prev => ({ ...prev, avatar: e.target.result }));
        } else {
          setUser(prev => ({ ...prev, coverPhoto: e.target.result }));
        }
      };
      reader.readAsDataURL(file);
      toast.success(`${type === "avatar" ? "Profile picture" : "Cover photo"} updated!`);
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Listing deleted successfully");
      setShowDeleteConfirm(false);
      setSelectedListing(null);
    } catch (error) {
      toast.error("Failed to delete listing");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    toast.success("Logged out successfully");
  };

  const copyProfileLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Profile link copied!");
  };

//   if (!authUser) {
//     return null;
//   }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/30 dark:from-gray-900 dark:to-gray-800">
      {/* Cover Photo Section */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-orange-500 to-orange-600 overflow-hidden">
        {/* Cover Image */}
        {user.coverPhoto ? (
          <Image
            src={user.coverPhoto}
            alt="Cover"
            fill
            className="object-cover"
            unoptimized={user.coverPhoto?.startsWith('data:')}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}></div>
          </div>
        )}
        
        {/* Edit Cover Button */}
        <button
          onClick={() => coverInputRef.current?.click()}
          className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-all flex items-center gap-2"
        >
          <FaCamera />
          <span className="text-sm">Edit Cover</span>
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload("cover", e.target.files[0])}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Profile Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-orange-100 dark:border-gray-700">
                {/* Avatar */}
                <div className="relative -mt-20 mb-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full p-1">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            fill
                            className="object-cover"
                            unoptimized={user.avatar?.startsWith('data:')}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600">
                            <FaUser className="text-white text-4xl" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Edit Avatar Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-orange-600 transition-all"
                      disabled={uploadingImage}
                    >
                      <FaCamera size={12} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload("avatar", e.target.files[0])}
                    />
                  </div>
                  
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.name}
                    </h2>
                    {user.verified && (
                      <MdVerified className="text-blue-500 text-xl" title="Verified Seller" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <FaStar className="text-yellow-400" />
                    <span className="font-medium text-gray-900 dark:text-white">{user.rating}</span>
                    <span className="text-gray-500">({user.totalFavorites} reviews)</span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {user.bio}
                  </p>
                  
                  {/* Contact Info */}
                  <div className="space-y-2 text-left bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3 text-sm">
                      <MdOutlineEmail className="text-orange-500" />
                      <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MdPhone className="text-orange-500" />
                      <span className="text-gray-600 dark:text-gray-400">{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MdLocationOn className="text-orange-500" />
                      <span className="text-gray-600 dark:text-gray-400">{user.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <FaCalendarAlt className="text-orange-500" />
                      <span className="text-gray-600 dark:text-gray-400">Joined {user.joinDate}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all"
                    >
                      <FaEdit />
                      <span>Edit Profile</span>
                    </button>
                    
                    <button
                      onClick={copyProfileLink}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-orange-500 text-orange-500 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-700 transition-all"
                    >
                      <FaLink />
                      <span>{copied ? "Copied!" : "Share Profile"}</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-orange-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaChartLine className="text-orange-500" />
                  Performance Stats
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Response Rate</span>
                    <span className="font-semibold text-green-600">{user.responseRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all" 
                      style={{ width: `${user.responseRate}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Avg Response Time</span>
                    <span className="font-semibold text-orange-600">{user.responseTime}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.totalListings}</div>
                      <div className="text-xs text-gray-500">Listings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.totalViews}</div>
                      <div className="text-xs text-gray-500">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.totalFavorites}</div>
                      <div className="text-xs text-gray-500">Favorites</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-orange-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  Badges
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((badge, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-gray-700 dark:to-gray-600 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-orange-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FaGlobe className="text-orange-500" />
                  Connect
                </h3>
                <div className="flex gap-3">
                  {user.socialLinks.facebook && (
                    <a href={user.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-50 transition-colors">
                      <FaFacebook className="text-blue-600" />
                    </a>
                  )}
                  {user.socialLinks.twitter && (
                    <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-sky-50 transition-colors">
                      <FaTwitter className="text-sky-500" />
                    </a>
                  )}
                  {user.socialLinks.instagram && (
                    <a href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-pink-50 transition-colors">
                      <FaInstagram className="text-pink-500" />
                    </a>
                  )}
                  {user.socialLinks.whatsapp && (
                    <a href={user.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-green-50 transition-colors">
                      <FaWhatsapp className="text-green-500" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-orange-100 dark:border-gray-700">
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex overflow-x-auto">
                  {[
                    { id: "listings", label: "My Listings", icon: FaHome, count: user.totalListings },
                    { id: "saved", label: "Saved", icon: FaHeart, count: mockSavedListings.length },
                    { id: "stats", label: "Analytics", icon: FaChartLine },
                    { id: "settings", label: "Settings", icon: FaCog }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${
                          activeTab === tab.id
                            ? "text-orange-500"
                            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                      >
                        <Icon size={16} />
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                          <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                            activeTab === tab.id
                              ? "bg-orange-100 text-orange-600"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {tab.count}
                          </span>
                        )}
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* My Listings Tab */}
                {activeTab === "listings" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Your Property Listings
                      </h3>
                      <Link
                        href="/post-ad"
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm hover:from-orange-600 hover:to-orange-700 transition-all"
                      >
                        + New Listing
                      </Link>
                    </div>
                    
                    {mockListings.length === 0 ? (
                      <div className="text-center py-12">
                        <FaHome className="text-6xl text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No listings yet</p>
                        <Link
                          href="/post-ad"
                          className="inline-block mt-4 text-orange-500 hover:text-orange-600"
                        >
                          Create your first listing →
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {mockListings.map((listing) => (
                          <div
                            key={listing.id}
                            className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-all"
                          >
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={listing.image}
                                alt={listing.title}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {listing.title}
                                  </h4>
                                  <p className="text-orange-600 font-semibold">{listing.price}</p>
                                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <FaMapMarkerAlt size={12} />
                                    {listing.location}
                                  </p>
                                </div>
                                
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setSelectedListing(listing)}
                                    className="p-2 text-gray-500 hover:text-orange-500 transition-colors"
                                    title="Edit"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedListing(listing);
                                      setShowDeleteConfirm(true);
                                    }}
                                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                    title="Delete"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4 mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  listing.status === "active"
                                    ? "bg-green-100 text-green-600"
                                    : listing.status === "pending"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}>
                                  {listing.status === "active" ? "Active" : listing.status === "pending" ? "Pending" : "Sold"}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <FaEye size={12} />
                                  {listing.views} views
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <FaHeart size={12} />
                                  {listing.favorites} saves
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <FaClock size={12} />
                                  {listing.postedDate}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Saved Listings Tab */}
                {activeTab === "saved" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Saved Properties
                    </h3>
                    
                    {mockSavedListings.length === 0 ? (
                      <div className="text-center py-12">
                        <FaRegHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No saved listings yet</p>
                        <Link
                          href="/"
                          className="inline-block mt-4 text-orange-500 hover:text-orange-600"
                        >
                          Browse properties →
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockSavedListings.map((listing) => (
                          <div
                            key={listing.id}
                            className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-all"
                          >
                            <div className="relative h-40">
                              <Image
                                src={listing.image}
                                alt={listing.title}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                              <button className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-red-50 transition-colors">
                                <FaHeart className="text-red-500" />
                              </button>
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {listing.title}
                              </h4>
                              <p className="text-orange-600 font-semibold">{listing.price}</p>
                              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <FaMapMarkerAlt size={12} />
                                {listing.location}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                Saved {listing.savedDate}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Analytics Tab */}
                {activeTab === "stats" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: "Total Views", value: user.totalViews, icon: FaEye, color: "blue" },
                        { label: "Total Favorites", value: user.totalFavorites, icon: FaHeart, color: "red" },
                        { label: "Response Rate", value: `${user.responseRate}%`, icon: FaCheckCircle, color: "green" }
                      ].map((stat) => {
                        const Icon = stat.icon;
                        return (
                          <div key={stat.label} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Icon className={`text-${stat.color}-500 text-2xl`} />
                              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Monthly Performance</h4>
                      <div className="space-y-3">
                        {[
                          { label: "Profile Views", value: user.stats.monthly.views, max: 2000 },
                          { label: "Inquiries", value: user.stats.monthly.inquiries, max: 100 },
                          { label: "Favorites", value: user.stats.monthly.favorites, max: 100 }
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                              <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                                style={{ width: `${(item.value / item.max) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaStar className="text-yellow-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">Insights</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your listings are performing well! Consider adding more photos to increase engagement by up to 40%.
                      </p>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === "settings" && (
                  <div className="space-y-6">
                    {/* Edit Profile Form */}
                    {isEditing ? (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Profile</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Phone
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Bio
                            </label>
                            <textarea
                              name="bio"
                              rows="4"
                              value={formData.bio}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={handleSaveProfile}
                            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
                          >
                            <FaSave />
                            Save Changes
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
                          >
                            <FaTimes />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Change Password */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <FaLock className="text-orange-500" />
                              <h4 className="font-semibold text-gray-900 dark:text-white">Change Password</h4>
                            </div>
                            <button
                              onClick={() => setShowPasswordModal(true)}
                              className="text-sm text-orange-500 hover:text-orange-600"
                            >
                              Update
                            </button>
                          </div>
                          <p className="text-sm text-gray-500">Last changed: 2 months ago</p>
                        </div>
                        
                        {/* Notification Preferences */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <FaBell className="text-orange-500" />
                            <h4 className="font-semibold text-gray-900 dark:text-white">Notification Preferences</h4>
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Email notifications</span>
                              <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500" />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Push notifications</span>
                              <input type="checkbox" className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500" />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-sm text-gray-600 dark:text-gray-400">SMS alerts</span>
                              <input type="checkbox" className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500" />
                            </label>
                          </div>
                        </div>
                        
                        {/* Language Preferences */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <FaLanguage className="text-orange-500" />
                            <h4 className="font-semibold text-gray-900 dark:text-white">Language</h4>
                          </div>
                          <select className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <option>English</option>
                            <option>Bengali</option>
                          </select>
                        </div>
                        
                        {/* Privacy Settings */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <FaShieldAlt className="text-orange-500" />
                            <h4 className="font-semibold text-gray-900 dark:text-white">Privacy Settings</h4>
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Show email on profile</span>
                              <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500" />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Show phone number</span>
                              <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500" />
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrash className="text-red-500 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Listing</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete "{selectedListing?.title}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteListing(selectedListing?.id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordUpdate}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}