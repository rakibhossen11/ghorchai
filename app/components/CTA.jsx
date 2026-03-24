// components/CTA.jsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FaPlusCircle, 
  FaArrowRight, 
  FaHome, 
  FaUsers, 
  FaCity, 
  FaHeadset,
  FaRocket,
  FaShieldAlt,
  FaCheckCircle,
  FaStar
} from "react-icons/fa";
import { MdVerified, MdLocalOffer } from "react-icons/md";
import { useState, useEffect } from "react";

export default function CTA() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [counts, setCounts] = useState({
    properties: 0,
    sellers: 0,
    cities: 0,
    support: 24
  });

  // Animated counter
  useEffect(() => {
    const targetCounts = {
      properties: 15000,
      sellers: 8500,
      cities: 64,
      support: 24
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);

      setCounts({
        properties: Math.floor(progress * targetCounts.properties),
        sellers: Math.floor(progress * targetCounts.sellers),
        cities: Math.floor(progress * targetCounts.cities),
        support: 24
      });

      if (progress === 1) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Parallax effect on mouse move
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const statVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100
      }
    })
  };

  return (
    <section 
      className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 py-24"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs - Using orange/white mix */}
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 20,
            y: mousePosition.y * 20,
          }}
          transition={{ type: "spring", stiffness: 50 }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * -20,
            y: mousePosition.y * -20,
          }}
          transition={{ type: "spring", stiffness: 50 }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/40 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, -40, 40, -40],
              x: [null, 40, -40, 40],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative container-custom"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Top Badge - Using orange theme */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/30 shadow-lg">
              <FaRocket className="text-yellow-300" />
              <span className="text-sm font-medium">Join the fastest growing marketplace in Bangladesh</span>
              <MdVerified className="text-green-300" />
            </div>
          </motion.div>

          {/* Main Heading - Using orange gradient */}
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Post Your Property for{' '}
            <span className="relative">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Free
              </span>
              <motion.span 
                className="absolute -bottom-2 left-0 w-full h-3 bg-white/20 -rotate-1 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto"
          >
            Join <span className="font-bold text-yellow-300">{counts.sellers.toLocaleString()}+</span> happy property owners and find the perfect buyer or tenant today!
          </motion.p>

          {/* Features List - Orange theme */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {[
              { icon: FaCheckCircle, text: "No Hidden Fees", color: "text-green-300" },
              { icon: MdLocalOffer, text: "Best Deals", color: "text-yellow-300" },
              { icon: FaShieldAlt, text: "Secure Platform", color: "text-blue-300" },
              { icon: FaStar, text: "Premium Support", color: "text-purple-300" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <feature.icon className={feature.color} size={14} />
                <span className="text-white text-sm">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons - Orange theme */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-5 justify-center mb-20"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/post-ad"
                className="group relative bg-white text-orange-600 px-10 py-5 rounded-xl font-semibold hover:bg-orange-50 transition-all shadow-2xl flex items-center justify-center space-x-3 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center space-x-3">
                  <FaPlusCircle className="group-hover:rotate-90 transition-transform duration-500 group-hover:text-white" />
                  <span className="text-lg group-hover:text-white">Post Ad Now</span>
                </span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/how-it-works"
                className="group relative border-2 border-white text-white px-10 py-5 rounded-xl font-semibold hover:bg-orange-500 transition-all shadow-2xl flex items-center justify-center space-x-3 overflow-hidden"
              >
                <span className="absolute inset-0 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center space-x-3">
                  <span className="text-lg">How It Works</span>
                  <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Section - Orange theme */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { icon: FaHome, value: counts.properties, label: "Properties Listed", suffix: "+", color: "from-orange-300 to-yellow-300" },
              { icon: FaUsers, value: counts.sellers, label: "Happy Sellers", suffix: "+", color: "from-orange-300 to-yellow-300" },
              { icon: FaCity, value: counts.cities, label: "Cities Covered", suffix: "+", color: "from-orange-300 to-yellow-300" },
              { icon: FaHeadset, value: counts.support, label: "Support", suffix: "/7", color: "from-orange-300 to-yellow-300" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={statVariants}
                whileHover={{ y: -5 }}
                className="text-center group"
              >
                <motion.div 
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl mb-4 group-hover:shadow-xl transition-all border-2 border-white/20`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="text-2xl text-white" />
                </motion.div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-white/80 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Trust Badges - Orange theme */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 flex flex-wrap justify-center items-center gap-8"
          >
            <div className="flex items-center space-x-2 text-white/80 bg-white/10 px-4 py-2 rounded-full">
              <FaShieldAlt className="text-orange-300" />
              <span className="text-sm">256-bit SSL Secure</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80 bg-white/10 px-4 py-2 rounded-full">
              <MdVerified className="text-green-300" />
              <span className="text-sm">Verified Listings</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80 bg-white/10 px-4 py-2 rounded-full">
              <FaStar className="text-yellow-300" />
              <span className="text-sm">4.9 Rating</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Wave Effect - Orange gradient */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path 
            fill="url(#orangeGradient)" 
            fillOpacity="0.2" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <defs>
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}