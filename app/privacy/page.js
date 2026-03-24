// app/privacy/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaShieldAlt, 
  FaCookieBite, 
  FaUserSecret, 
  FaLock, 
  FaEnvelope,
  FaMobile,
  FaFileContract,
  FaGavel,
  FaChild,
  FaGlobe,
  FaDatabase,
  FaBell,
  FaCheckCircle,
  FaDownload,
  FaPrint,
  FaShare,
  FaClock,
  FaHistory,
  FaUserCog,
  FaServer,
  FaCloud,
  FaChartLine,
  FaArrowUp,
  FaChevronRight,
  FaQuestionCircle,
  FaEye,
  FaTrash,
  FaEdit,
  FaBan,
  FaSync,
  FaFileAlt
} from "react-icons/fa";
import { 
  MdPrivacyTip, 
  MdSecurity, 
  MdDataUsage, 
  MdPolicy,
  MdVerifiedUser,
  MdOutlinePrivacyTip 
} from "react-icons/md";
import { HiDocumentText, HiShieldCheck } from "react-icons/hi";
// import { GiPoliceman, GiLawScale } from "react-icons/gi";

export default function PrivacyPolicyPage() {
  const [lastUpdated] = useState("March 15, 2024");
  const [activeSection, setActiveSection] = useState("introduction");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      
      // Update active section based on scroll position
      const scrollPosition = window.scrollY + 200;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Show cookie consent after 2 seconds
    const timer = setTimeout(() => {
      setShowCookieConsent(true);
    }, 2000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sections = [
    { id: "introduction", title: "Introduction", icon: MdPrivacyTip, color: "from-orange-500 to-orange-600" },
    { id: "information", title: "Information We Collect", icon: FaDatabase, color: "from-blue-500 to-blue-600" },
    { id: "usage", title: "How We Use Your Info", icon: MdDataUsage, color: "from-green-500 to-green-600" },
    { id: "sharing", title: "Information Sharing", icon: FaShare, color: "from-purple-500 to-purple-600" },
    { id: "cookies", title: "Cookies & Tracking", icon: FaCookieBite, color: "from-yellow-500 to-yellow-600" },
    { id: "security", title: "Data Security", icon: FaLock, color: "from-red-500 to-red-600" },
    { id: "rights", title: "Your Rights", icon: FaUserCog, color: "from-indigo-500 to-indigo-600" },
    { id: "children", title: "Children's Privacy", icon: FaChild, color: "from-pink-500 to-pink-600" },
    { id: "changes", title: "Policy Changes", icon: FaHistory, color: "from-teal-500 to-teal-600" },
    { id: "contact", title: "Contact Us", icon: FaEnvelope, color: "from-orange-500 to-orange-600" }
  ];

  const faqs = [
    {
      question: "How do you protect my personal information?",
      answer: "We use industry-standard encryption, secure servers, and regular security audits to protect your data. All sensitive information is encrypted using 256-bit SSL technology."
    },
    {
      question: "Can I delete my account and data?",
      answer: "Yes, you can request account deletion through your settings or by contacting our support team. We will delete your personal information within 30 days of request."
    },
    {
      question: "Do you share my data with third parties?",
      answer: "We only share necessary data with trusted service providers who help us operate our platform. We never sell your personal information to third parties."
    },
    {
      question: "How long do you keep my information?",
      answer: "We retain your information as long as your account is active. After account deletion, we may retain certain information for legal purposes or to prevent fraud."
    }
  ];

  const dataCategories = [
    {
      title: "Personal Information",
      icon: FaUserSecret,
      items: ["Full name", "Email address", "Phone number", "Profile photo", "Government ID (if verified)"],
      color: "orange"
    },
    {
      title: "Property Information",
      icon: FaDatabase,
      items: ["Property listings", "Photos and videos", "Location data", "Pricing information", "Property documents"],
      color: "blue"
    },
    {
      title: "Usage Data",
      icon: FaChartLine,
      items: ["IP address", "Browser type", "Pages visited", "Search history", "Time spent on site"],
      color: "green"
    },
    {
      title: "Payment Information",
      icon: FaLock,
      items: ["Payment method", "Transaction history", "Billing address", "Bank details (encrypted)"],
      color: "purple"
    }
  ];

  const securityMeasures = [
    { icon: FaLock, title: "256-bit SSL Encryption", description: "All data transmitted is encrypted" },
    { icon: FaServer, title: "Secure Data Centers", description: "ISO 27001 certified facilities" },
    { icon: FaCloud, title: "Regular Backups", description: "Daily encrypted backups" },
    { icon: FaShieldAlt, title: "Two-Factor Authentication", description: "Optional 2FA for accounts" },
    { icon: FaEye, title: "24/7 Monitoring", description: "Continuous security monitoring" },
    { icon: FaSync, title: "Regular Updates", description: "Frequent security patches" }
  ];

  const userRights = [
    { icon: FaEye, title: "Right to Access", description: "View all data we hold about you" },
    { icon: FaEdit, title: "Right to Rectify", description: "Correct inaccurate information" },
    { icon: FaTrash, title: "Right to Delete", description: "Request data deletion" },
    { icon: FaBan, title: "Right to Restrict", description: "Limit how we use your data" },
    { icon: FaDownload, title: "Right to Portability", description: "Receive your data in a portable format" },
    { icon: FaQuestionCircle, title: "Right to Object", description: "Object to certain data processing" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/30 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section with Orange Theme */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-2 mb-8 shadow-lg">
              <FaShieldAlt className="text-white mr-2" />
              <span className="text-white text-sm font-medium">Last Updated: {lastUpdated}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Privacy & Policy
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Your privacy is our priority. Learn how we collect, use, and protect your personal information with transparency and care.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-white text-orange-600 rounded-xl font-medium hover:shadow-xl transition-all"
              >
                <FaDownload />
                <span>Download PDF</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-xl hover:bg-white/20 transition-all"
              >
                <FaPrint />
                <span>Print Summary</span>
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-center space-x-6 mt-12">
              {[
                { icon: MdVerifiedUser, text: "GDPR Compliant" },
                { icon: HiShieldCheck, text: "ISO 27001 Certified" },
                // { icon: GiLawScale, text: "Legal Compliance" }
              ].map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div key={index} className="flex items-center space-x-2 text-white/80">
                    <Icon className="text-lg" />
                    <span className="text-sm">{badge.text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,64L48,74.7C96,85,192,107,288,106.7C384,107,480,85,576,74.7C672,64,768,64,864,74.7C960,85,1056,107,1152,112C1248,117,1344,107,1392,101.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents - Sticky Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-orange-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <HiDocumentText className="mr-2 text-orange-500" />
                Table of Contents
              </h2>
              
              <nav className="space-y-2 mb-6">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${section.color} text-white shadow-lg`
                          : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className={isActive ? 'text-white' : 'text-orange-500'} />
                      <span className="text-sm font-medium flex-1 text-left">{section.title}</span>
                      {isActive && <FaChevronRight className="text-white/70" size={12} />}
                    </button>
                  );
                })}
              </nav>

              {/* Summary Card */}
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Key Points
                </h3>
                <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>We collect only necessary information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Your data is encrypted and secure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>We never sell your personal data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>You have full control over your data</span>
                  </li>
                </ul>
              </div>

              {/* Progress Indicator */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Reading progress</span>
                  <span>{Math.round((sections.findIndex(s => s.id === activeSection) + 1) / sections.length * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(sections.findIndex(s => s.id === activeSection) + 1) / sections.length * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-12 space-y-12">
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
                      <MdPrivacyTip className="text-2xl text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Introduction</h2>
                      <p className="text-sm text-gray-500">Our commitment to your privacy</p>
                    </div>
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                      Welcome to <span className="font-semibold text-orange-500">GhorChai</span>. We are committed to protecting your personal information and your right to privacy. 
                      This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
                      our website or use our services.
                    </p>
                    
                    <div className="mt-6 p-6 bg-orange-50 dark:bg-gray-700 rounded-xl border-l-4 border-orange-500">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">🔒 Quick Note:</span> By using GhorChai, you consent to the data practices described in this policy. 
                        We've designed this document to be transparent and easy to understand.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Information We Collect */}
              <section id="information" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                      <FaDatabase className="text-2xl text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Information We Collect</h2>
                      <p className="text-sm text-gray-500">What data we gather and why</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dataCategories.map((category, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className={`bg-gradient-to-br from-${category.color}-50 to-${category.color}-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 shadow-lg`}
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`p-2 bg-${category.color}-500 rounded-lg`}>
                            <category.icon className="text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{category.title}</h3>
                        </div>
                        <ul className="space-y-2">
                          {category.items.map((item, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" size={12} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* How We Use Your Information */}
              <section id="usage" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
                      <MdDataUsage className="text-2xl text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How We Use Your Information</h2>
                      <p className="text-sm text-gray-500">Making your experience better</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { icon: FaBell, title: "Service Delivery", desc: "Provide and maintain our services" },
                      { icon: FaUserCog, title: "Personalization", desc: "Customize your experience" },
                      { icon: FaShieldAlt, title: "Security", desc: "Protect against fraud" },
                      { icon: FaEnvelope, title: "Communications", desc: "Send updates and respond to inquiries" },
                      { icon: FaChartLine, title: "Analytics", desc: "Improve platform performance" },
                      { icon: FaGavel, title: "Legal Compliance", desc: "Meet legal obligations" }
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 border border-gray-100 dark:border-gray-600"
                        >
                          <Icon className="text-orange-500 text-xl mb-3" />
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </section>

              {/* Information Sharing */}
              <section id="sharing" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                      <FaShare className="text-2xl text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Information Sharing</h2>
                      <p className="text-sm text-gray-500">When and with whom we share data</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { step: 1, title: "With Other Users", desc: "Property listings show basic contact info to facilitate communication" },
                      { step: 2, title: "Service Providers", desc: "Trusted partners who help us operate and improve our platform" },
                      { step: 3, title: "Legal Requirements", desc: "When required by law or to protect rights and safety" }
                    ].map((item) => (
                      <motion.div
                        key={item.step}
                        whileHover={{ x: 5 }}
                        className="flex items-start p-5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-white font-bold">{item.step}</span>
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      <span className="font-medium">We never sell your personal information to third parties.</span>
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* Cookies & Tracking */}
              <section id="cookies" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-lg">
                      <FaCookieBite className="text-2xl text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cookies & Tracking</h2>
                      <p className="text-sm text-gray-500">How we use cookies to improve your experience</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      We use cookies and similar tracking technologies to track activity on our platform and hold certain information. 
                      You can control cookies through your browser settings.
                    </p>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Cookie Categories:</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { type: "Essential", desc: "Required for basic functionality", always: true },
                        { type: "Preferences", desc: "Remember your settings and preferences", always: false },
                        { type: "Analytics", desc: "Help us understand how you use our site", always: false },
                        { type: "Marketing", desc: "Personalize advertisements", always: false }
                      ].map((cookie, index) => (
                        <div key={index} className="flex items-start p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 dark:text-white">{cookie.type}</span>
                              {cookie.always && (
                                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Always Active</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{cookie.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center space-x-4">
                      <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm">
                        Cookie Preferences
                      </button>
                      <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors text-sm">
                        Learn More
                      </button>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Data Security */}
              <section id="security" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg">
                      <FaLock className="text-2xl text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Security</h2>
                      <p className="text-sm text-gray-500">How we protect your information</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {securityMeasures.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-5 border border-gray-200 dark:border-gray-600"
                        >
                          <Icon className="text-orange-500 text-2xl mb-3" />
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                      <MdVerifiedUser className="text-blue-500 mr-2 text-xl" />
                      <span>We are committed to maintaining the highest security standards to protect your data.</span>
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* Your Rights */}
              <section id="rights" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg">
                      <FaUserCog className="text-2xl text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Rights</h2>
                      <p className="text-sm text-gray-500">Control over your personal data</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userRights.map((right, index) => {
                      const Icon = right.icon;
                      return (
                        <motion.div
                          key={index}
                          whileHover={{ x: 5 }}
                          className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                        >
                          <Icon className="text-orange-500 mr-3 mt-1" />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{right.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{right.description}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">To exercise any of these rights:</span> Visit your account settings or contact our privacy team at privacy@ghorchai.com
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* Children's Privacy */}
              <section id="children" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-lg">
                      <FaChild className="text-2xl text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Children's Privacy</h2>
                      <p className="text-sm text-gray-500">Protecting young users</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl p-6 border border-pink-200 dark:border-pink-800">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-pink-500 rounded-full">
                        <FaChild className="text-white text-xl" />
                      </div>
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          Our platform is not intended for individuals under the age of 18. We do not knowingly collect 
                          personal information from children. If you are a parent or guardian and you are aware that your 
                          child has provided us with personal information, please contact us immediately.
                        </p>
                        <button className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm">
                          Report Child Data
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Policy Changes */}
              <section id="changes" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-lg">
                      <FaHistory className="text-2xl text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Changes to This Policy</h2>
                      <p className="text-sm text-gray-500">How we notify you of updates</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                      the new Privacy Policy on this page and updating the "Last Updated" date.
                    </p>
                    
                    <div className="flex items-center space-x-4 p-5 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                        <FaClock className="text-orange-500 text-xl" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          We recommend reviewing this policy periodically for any changes. Significant updates will be notified via email.
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          <span className="font-medium">Last Updated:</span> {lastUpdated}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="w-4 h-4 text-orange-500" />
                      <label className="text-sm text-gray-600 dark:text-gray-400">
                        Notify me about future policy changes via email
                      </label>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Contact Us */}
              <section id="contact" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
                      <FaEnvelope className="text-2xl text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Us</h2>
                      <p className="text-sm text-gray-500">We're here to help</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
                    <p className="text-lg mb-8 opacity-90">
                      Have questions about our Privacy Policy? Reach out to our privacy team:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        href="mailto:privacy@ghorchai.com"
                        className="flex flex-col items-center p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all cursor-pointer"
                      >
                        <FaEnvelope className="text-3xl mb-3" />
                        <p className="text-sm opacity-90">Email</p>
                        <p className="font-semibold text-center">privacy@ghorchai.com</p>
                      </motion.a>
                      
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        href="tel:+8801234567890"
                        className="flex flex-col items-center p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all cursor-pointer"
                      >
                        <FaMobile className="text-3xl mb-3" />
                        <p className="text-sm opacity-90">Phone</p>
                        <p className="font-semibold">+880 1234 567890</p>
                      </motion.a>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center p-5 bg-white/10 backdrop-blur-sm rounded-xl"
                      >
                        <FaGlobe className="text-3xl mb-3" />
                        <p className="text-sm opacity-90">Address</p>
                        <p className="font-semibold text-center">Dhaka, Bangladesh</p>
                      </motion.div>
                    </div>

                    <div className="mt-8 text-center">
                      <p className="text-sm opacity-80">Response time: Within 24-48 hours</p>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* FAQ Section */}
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FaQuestionCircle className="text-orange-500 mr-2" />
                  Frequently Asked Questions
                </h2>
                
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                        <FaChevronRight className={`transform transition-transform ${expandedFaq === index ? 'rotate-90' : ''} text-orange-500`} />
                      </button>
                      
                      <AnimatePresence>
                        {expandedFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-5 bg-white dark:bg-gray-800">
                              <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showCookieConsent && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-2xl border-t border-orange-100 dark:border-gray-700 p-4 z-50"
          >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <FaCookieBite className="text-orange-500 text-2xl" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCookieConsent(false)}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                >
                  Accept
                </button>
                <button
                  onClick={() => setShowCookieConsent(false)}
                  className="px-6 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium"
                >
                  Decline
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 z-50"
            aria-label="Scroll to top"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer Links */}
      <div className="border-t border-orange-100 dark:border-gray-700 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              By using GhorChai, you agree to our Privacy Policy and Terms of Service.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/terms" className="text-sm text-orange-500 hover:text-orange-600 transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link href="/cookies" className="text-sm text-orange-500 hover:text-orange-600 transition-colors">
                Cookie Policy
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link href="/gdpr" className="text-sm text-orange-500 hover:text-orange-600 transition-colors">
                GDPR Compliance
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link href="/data-request" className="text-sm text-orange-500 hover:text-orange-600 transition-colors">
                Data Request
              </Link>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              © {new Date().getFullYear()} GhorChai. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}