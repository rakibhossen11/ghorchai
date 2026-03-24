// app/page.jsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Hero from "./components/Hero";
import AdCard from "./components/AdCard";
import CTA from "./components/CTA";
import { useAuthStore } from "./store/authStore";
import {
  FaFilter,
  FaSortAmountDown,
  FaTimes,
  FaChevronDown,
  FaHome,
  FaBuilding,
  FaStore,
  FaTree,
  FaStar,
  FaArrowRight,
  FaMapMarkerAlt,
  FaSearch,
  FaFire
} from "react-icons/fa";
import { MdApartment, MdHouse } from "react-icons/md";
import { GiVillage, GiModernCity } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

// Mock data with more variety
const mockAds = [
  {
    id: 1,
    title: "Luxury 3BR Apartment in Dhanmondi",
    price: "৳85,000",
    location: "Dhanmondi, Dhaka",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
    featured: true,
    type: "Apartment",
    beds: 3,
    baths: 3,
    area: "1800 sqft",
    description: "Beautiful apartment with modern amenities in the heart of Dhanmondi. Features include gym, pool, and 24/7 security.",
    contactNumber: "01712345678",
    views: 234,
    postedDate: "2 days ago",
    seller: {
      name: "Rahman Properties",
      avatar: "",
      verified: true,
      rating: 4.8
    }
  },
  {
    id: 2,
    title: "Modern Duplex House in Gulshan",
    price: "৳1,50,000",
    location: "Gulshan, Dhaka",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500",
    featured: true,
    type: "House",
    beds: 4,
    baths: 4,
    area: "3200 sqft",
    description: "Spacious duplex house with garden and parking in Gulshan. Perfect for large families.",
    contactNumber: "01712345679",
    views: 567,
    postedDate: "5 days ago",
    seller: {
      name: "Luxury Living BD",
      avatar: "",
      verified: true,
      rating: 4.9
    }
  },
  {
    id: 3,
    title: "Commercial Space in Banani",
    price: "৳2,00,000",
    location: "Banani, Dhaka",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500",
    featured: false,
    type: "Commercial",
    beds: 0,
    baths: 2,
    area: "2500 sqft",
    description: "Prime commercial space perfect for office or showroom. High foot traffic area.",
    contactNumber: "01712345680",
    views: 123,
    postedDate: "1 week ago",
    seller: {
      name: "Business Spaces Ltd",
      avatar: "",
      verified: true,
      rating: 4.5
    }
  },
  {
    id: 4,
    title: "Affordable 2BR Flat in Uttara",
    price: "৳35,000",
    location: "Uttara, Dhaka",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
    featured: false,
    type: "Apartment",
    beds: 2,
    baths: 2,
    area: "1200 sqft",
    description: "Cozy apartment in a peaceful neighborhood of Uttara. Close to schools and markets.",
    contactNumber: "01712345681",
    views: 89,
    postedDate: "1 day ago",
    seller: {
      name: "City Rentals",
      avatar: "",
      verified: false,
      rating: 4.2
    }
  },
  {
    id: 5,
    title: "Penthouse with Rooftop Garden",
    price: "৳2,50,000",
    location: "Baridhara, Dhaka",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500",
    featured: true,
    type: "Penthouse",
    beds: 5,
    baths: 5,
    area: "4000 sqft",
    description: "Luxurious penthouse with panoramic city views and rooftop garden. Private elevator access.",
    contactNumber: "01712345682",
    views: 892,
    postedDate: "3 days ago",
    seller: {
      name: "Premium Properties",
      avatar: "",
      verified: true,
      rating: 5.0
    }
  },
  {
    id: 6,
    title: "Studio Apartment in Chittagong",
    price: "৳25,000",
    location: "Agrabad, Chittagong",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
    featured: false,
    type: "Studio",
    beds: 1,
    baths: 1,
    area: "550 sqft",
    description: "Modern studio apartment perfect for singles or couples. Fully furnished available.",
    contactNumber: "01712345683",
    views: 145,
    postedDate: "4 days ago",
    seller: {
      name: "Cozy Living",
      avatar: "",
      verified: false,
      rating: 4.0
    }
  },
  {
    id: 7,
    title: "Independent House in Sylhet",
    price: "৳45,000",
    location: "Zindabazar, Sylhet",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500",
    featured: false,
    type: "House",
    beds: 3,
    baths: 2,
    area: "2000 sqft",
    description: "Beautiful house with traditional architecture in Sylhet. Large courtyard and garden.",
    contactNumber: "01712345684",
    views: 234,
    postedDate: "6 days ago",
    seller: {
      name: "Sylhet Properties",
      avatar: "",
      verified: true,
      rating: 4.6
    }
  },
  {
    id: 8,
    title: "Luxury Villa in Gazipur",
    price: "৳95,000",
    location: "Gazipur",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500",
    featured: true,
    type: "Villa",
    beds: 4,
    baths: 3,
    area: "3500 sqft",
    description: "Exclusive villa with swimming pool and large garden. Perfect for weekend getaways.",
    contactNumber: "01712345685",
    views: 456,
    postedDate: "1 week ago",
    seller: {
      name: "Villa Specialists",
      avatar: "",
      verified: true,
      rating: 4.7
    }
  },
  {
    id: 9,
    title: "Flat in Bashundhara",
    price: "৳65,000",
    location: "Bashundhara, Dhaka",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500",
    featured: false,
    type: "Apartment",
    beds: 3,
    baths: 2,
    area: "1500 sqft",
    description: "Modern flat in Bashundhara residential area. Close to international schools.",
    contactNumber: "01712345686",
    views: 167,
    postedDate: "2 days ago",
    seller: {
      name: "Dhaka Realty",
      avatar: "",
      verified: false,
      rating: 4.1
    }
  },
  {
    id: 10,
    title: "Land in Savar",
    price: "৳1,20,000",
    location: "Savar, Dhaka",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500",
    featured: false,
    type: "Land",
    beds: 0,
    baths: 0,
    area: "5 katha",
    description: "Prime land for development in growing area. Good investment opportunity.",
    contactNumber: "01712345687",
    views: 78,
    postedDate: "3 days ago",
    seller: {
      name: "Land Developers",
      avatar: "",
      verified: true,
      rating: 4.3
    }
  },
  {
    id: 11,
    title: "Duplex in Chittagong",
    price: "৳80,000",
    location: "Chittagong",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=500",
    featured: false,
    type: "House",
    beds: 4,
    baths: 3,
    area: "2800 sqft",
    description: "Spacious duplex with modern amenities in Chittagong. Sea view available.",
    contactNumber: "01712345688",
    views: 345,
    postedDate: "5 days ago",
    seller: {
      name: "Chittagong Realty",
      avatar: "",
      verified: true,
      rating: 4.4
    }
  },
  {
    id: 12,
    title: "Flat in Sylhet",
    price: "৳40,000",
    location: "Sylhet",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500",
    featured: false,
    type: "Apartment",
    beds: 3,
    baths: 2,
    area: "1400 sqft",
    description: "Comfortable flat in a quiet area of Sylhet. Tea garden views.",
    contactNumber: "01712345689",
    views: 98,
    postedDate: "2 days ago",
    seller: {
      name: "Sylhet Homes",
      avatar: "",
      verified: false,
      rating: 4.0
    }
  }
];

// Category icons mapping
const categoryIcons = {
  'Apartment': <MdApartment className="text-orange-500" />,
  'House': <MdHouse className="text-orange-500" />,
  'Commercial': <FaStore className="text-orange-500" />,
  'Studio': <FaBuilding className="text-orange-500" />,
  'Penthouse': <GiModernCity className="text-orange-500" />,
  'Villa': <GiVillage className="text-orange-500" />,
  'Land': <FaTree className="text-orange-500" />,
};

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [filteredAds, setFilteredAds] = useState(mockAds);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [propertyType, setPropertyType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState('All');
  const itemsPerPage = 8;

  const { user } = useAuthStore();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Get unique cities
  const cities = useMemo(() => {
    const allCities = mockAds.map(ad => {
      const parts = ad.location.split(',');
      return parts[parts.length - 1].trim();
    });
    return ['All', ...new Set(allCities)];
  }, []);

  // Get unique property types
  const propertyTypes = useMemo(() => {
    return ['All', ...new Set(mockAds.map(ad => ad.type))];
  }, []);

  // Filter and sort ads
  useEffect(() => {
    let filtered = [...mockAds];

    // Filter by city
    if (selectedCity !== 'All') {
      filtered = filtered.filter(ad =>
        ad.location.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    // Filter by location (backward compatibility)
    if (selectedLocation !== 'All') {
      filtered = filtered.filter(ad =>
        ad.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Filter by property type
    if (propertyType !== 'All') {
      filtered = filtered.filter(ad => ad.type === propertyType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(ad =>
        ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange.min) {
      const minPrice = parseInt(priceRange.min.replace(/[^0-9]/g, ''));
      filtered = filtered.filter(ad => {
        const adPrice = parseInt(ad.price.replace(/[^0-9]/g, ''));
        return adPrice >= minPrice;
      });
    }
    if (priceRange.max) {
      const maxPrice = parseInt(priceRange.max.replace(/[^0-9]/g, ''));
      filtered = filtered.filter(ad => {
        const adPrice = parseInt(ad.price.replace(/[^0-9]/g, ''));
        return adPrice <= maxPrice;
      });
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceB - priceA;
        });
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      default:
        filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredAds(filtered);
    setCurrentPage(1);
  }, [selectedLocation, selectedCity, propertyType, priceRange, sortBy, searchTerm]);

  // Get current page items
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredAds.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredAds, currentPage]);

  // Total pages
  const totalPages = Math.ceil(filteredAds.length / itemsPerPage);

  // Featured ads
  const featuredAds = useMemo(() => {
    return mockAds.filter(ad => ad.featured).slice(0, 4);
  }, []);

  // Quick stats
  const stats = useMemo(() => {
    return {
      total: mockAds.length,
      cities: cities.length - 1,
      types: propertyTypes.length - 1,
      avgPrice: '৳85,000'
    };
  }, [cities, propertyTypes]);

  // Handle page change
  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/30 dark:from-gray-900 dark:to-gray-800">
      <Hero />

      {/* Quick Stats Banner */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg sticky top-20 z-40 border-b border-orange-100 dark:border-gray-700">
        <div className="container-custom py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 px-3 py-1.5 rounded-full">
                <FaHome className="text-orange-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-orange-600 dark:text-orange-400">{stats.total}+</span> Properties
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 px-3 py-1.5 rounded-full">
                <FaMapMarkerAlt className="text-orange-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-orange-600 dark:text-orange-400">{stats.cities}</span> Cities
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 px-3 py-1.5 rounded-full">
                <FaFire className="text-orange-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-orange-600 dark:text-orange-400">Avg {stats.avgPrice}</span>
                </span>
              </div>
            </div>

            {/* Quick City Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {cities.slice(0, 5).map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all transform hover:scale-105 ${selectedCity === city
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-600 border border-orange-200 dark:border-gray-600'
                    }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" />
            <input
              type="text"
              placeholder="Search by property name, location, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-orange-100 dark:border-gray-700 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
            Browse by Category
          </h3>
          <div className="flex flex-wrap gap-3">
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => setPropertyType(type)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all transform hover:scale-105 ${propertyType === type
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-orange-200 dark:border-gray-700'
                  }`}
              >
                {type !== 'All' && (
                  <span className="text-lg">
                    {categoryIcons[type] || <FaBuilding className="text-orange-500" />}
                  </span>
                )}
                <span>{type}</span>
                {type !== 'All' && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${propertyType === type
                      ? 'bg-white/20 text-white'
                      : 'bg-orange-100 text-orange-600 dark:bg-gray-700 dark:text-orange-400'
                    }`}>
                    {mockAds.filter(ad => ad.type === type).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Sort Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Results Count */}
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedLocation === 'All' ? 'All Properties' : `Properties in ${selectedLocation}`}
              </h2>
              <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium border border-orange-200 dark:border-orange-800">
                {filteredAds.length} results
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all border border-orange-100 dark:border-gray-700"
              >
                <FaFilter className={showFilters ? 'text-orange-500' : 'text-gray-500'} />
                <span className="text-gray-700 dark:text-gray-300">Filters</span>
                <FaChevronDown className={`transition-transform text-orange-500 ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Sort Dropdown */}
              <div className="relative group">
                <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-orange-100 dark:border-gray-700">
                  <FaSortAmountDown className="text-orange-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent focus:outline-none cursor-pointer text-gray-700 dark:text-gray-300"
                  >
                    <option value="latest">Latest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {(showFilters || true) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-2 border-orange-100 dark:border-gray-700">
                  <div className="mb-6">
                    {/* Header with Gradient */}
                    <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-orange-100 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-orange-500/20 rounded-lg blur-md"></div>
                          <div className="relative w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                            <FaFilter className="text-white text-sm" />
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          Filter Properties
                          <span className="text-xs font-normal bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
                            Advanced
                          </span>
                        </h3>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedLocation('All');
                          setSelectedCity('All');
                          setPropertyType('All');
                          setPriceRange({ min: '', max: '' });
                          setSortBy('latest');
                          setSearchTerm('');
                        }}
                        className="group relative px-4 py-2 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-md transition-all duration-300 overflow-hidden"
                      >
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative flex items-center gap-2">
                          <span className="text-sm font-medium text-orange-600 dark:text-orange-400 group-hover:text-white transition-colors duration-300">
                            Clear all filters
                          </span>
                          <FaTimes
                            size={12}
                            className="text-orange-500 dark:text-orange-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300"
                          />
                        </div>

                        {/* Ripple Effect */}
                        <span className="absolute inset-0 rounded-xl bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      </motion.button>
                    </div>

                    {/* Optional: Active Filters Counter Badge */}
                    {(() => {
                      const activeFilters = [
                        selectedCity !== 'All',
                        propertyType !== 'All',
                        !!priceRange.min,
                        !!priceRange.max,
                        searchTerm !== '',
                        selectedLocation !== 'All'
                      ].filter(Boolean).length;

                      return activeFilters > 0 && (
                        <div className="mb-4 flex items-center gap-2">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 dark:bg-orange-500/20 rounded-full border border-orange-200 dark:border-orange-800">
                            <FaFilter className="text-orange-500 text-xs" />
                            <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                              {activeFilters} active filter{activeFilters !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Refine your search for better results
                          </span>
                        </div>
                      );
                    })()}

                    {/* Optional: Quick Clear Individual Filters */}
                    {(selectedCity !== 'All' || propertyType !== 'All' || priceRange.min || priceRange.max || searchTerm) && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {selectedCity !== 'All' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-gray-700 rounded-full border border-orange-200 dark:border-gray-600 text-sm">
                            <FaMapMarkerAlt className="text-orange-500 text-xs" />
                            <span className="text-gray-700 dark:text-gray-300">{selectedCity}</span>
                            <button
                              onClick={() => setSelectedCity('All')}
                              className="ml-1 hover:bg-orange-200 dark:hover:bg-gray-600 rounded-full p-0.5 transition-colors"
                            >
                              <FaTimes size={10} className="text-gray-500 hover:text-orange-500" />
                            </button>
                          </span>
                        )}
                        {propertyType !== 'All' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-gray-700 rounded-full border border-orange-200 dark:border-gray-600 text-sm">
                            <FaHome className="text-orange-500 text-xs" />
                            <span className="text-gray-700 dark:text-gray-300">{propertyType}</span>
                            <button
                              onClick={() => setPropertyType('All')}
                              className="ml-1 hover:bg-orange-200 dark:hover:bg-gray-600 rounded-full p-0.5 transition-colors"
                            >
                              <FaTimes size={10} className="text-gray-500 hover:text-orange-500" />
                            </button>
                          </span>
                        )}
                        {priceRange.min && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-gray-700 rounded-full border border-orange-200 dark:border-gray-600 text-sm">
                            <FaTag className="text-orange-500 text-xs" />
                            <span className="text-gray-700 dark:text-gray-300">Min: ৳{priceRange.min}</span>
                            <button
                              onClick={() => setPriceRange({ ...priceRange, min: '' })}
                              className="ml-1 hover:bg-orange-200 dark:hover:bg-gray-600 rounded-full p-0.5 transition-colors"
                            >
                              <FaTimes size={10} className="text-gray-500 hover:text-orange-500" />
                            </button>
                          </span>
                        )}
                        {priceRange.max && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-gray-700 rounded-full border border-orange-200 dark:border-gray-600 text-sm">
                            <FaTag className="text-orange-500 text-xs" />
                            <span className="text-gray-700 dark:text-gray-300">Max: ৳{priceRange.max}</span>
                            <button
                              onClick={() => setPriceRange({ ...priceRange, max: '' })}
                              className="ml-1 hover:bg-orange-200 dark:hover:bg-gray-600 rounded-full p-0.5 transition-colors"
                            >
                              <FaTimes size={10} className="text-gray-500 hover:text-orange-500" />
                            </button>
                          </span>
                        )}
                        {searchTerm && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-gray-700 rounded-full border border-orange-200 dark:border-gray-600 text-sm">
                            <FaSearch className="text-orange-500 text-xs" />
                            <span className="text-gray-700 dark:text-gray-300 max-w-[150px] truncate">{searchTerm}</span>
                            <button
                              onClick={() => setSearchTerm('')}
                              className="ml-1 hover:bg-orange-200 dark:hover:bg-gray-600 rounded-full p-0.5 transition-colors"
                            >
                              <FaTimes size={10} className="text-gray-500 hover:text-orange-500" />
                            </button>
                          </span>
                        )}
                        {selectedLocation !== 'All' && selectedLocation !== 'All' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-gray-700 rounded-full border border-orange-200 dark:border-gray-600 text-sm">
                            <FaMapMarkerAlt className="text-orange-500 text-xs" />
                            <span className="text-gray-700 dark:text-gray-300">{selectedLocation}</span>
                            <button
                              onClick={() => setSelectedLocation('All')}
                              className="ml-1 hover:bg-orange-200 dark:hover:bg-gray-600 rounded-full p-0.5 transition-colors"
                            >
                              <FaTimes size={10} className="text-gray-500 hover:text-orange-500" />
                            </button>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* City Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-2 border-orange-100 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    {/* Property Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Property Type
                      </label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-2 border-orange-100 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {propertyTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Min Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Min Price (BDT)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 30000"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-2 border-orange-100 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    {/* Max Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Price (BDT)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 200000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-2 border-orange-100 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Active Filters */}
                  {(selectedCity !== 'All' || propertyType !== 'All' || priceRange.min || priceRange.max || searchTerm) && (
                    <div className="mt-4 pt-4 border-t border-orange-100 dark:border-gray-700">
                      <div className="flex flex-wrap gap-2">
                        {selectedCity !== 'All' && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-600 dark:text-orange-400 rounded-full text-sm border border-orange-200 dark:border-orange-800">
                            <span>City: {selectedCity}</span>
                            <button onClick={() => setSelectedCity('All')} className="hover:text-orange-800">
                              <FaTimes size={12} />
                            </button>
                          </span>
                        )}
                        {propertyType !== 'All' && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-600 dark:text-orange-400 rounded-full text-sm border border-orange-200 dark:border-orange-800">
                            <span>Type: {propertyType}</span>
                            <button onClick={() => setPropertyType('All')} className="hover:text-orange-800">
                              <FaTimes size={12} />
                            </button>
                          </span>
                        )}
                        {priceRange.min && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-600 dark:text-orange-400 rounded-full text-sm border border-orange-200 dark:border-orange-800">
                            <span>Min: ৳{priceRange.min}</span>
                            <button onClick={() => setPriceRange({ ...priceRange, min: '' })} className="hover:text-orange-800">
                              <FaTimes size={12} />
                            </button>
                          </span>
                        )}
                        {priceRange.max && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-600 dark:text-orange-400 rounded-full text-sm border border-orange-200 dark:border-orange-800">
                            <span>Max: ৳{priceRange.max}</span>
                            <button onClick={() => setPriceRange({ ...priceRange, max: '' })} className="hover:text-orange-800">
                              <FaTimes size={12} />
                            </button>
                          </span>
                        )}
                        {searchTerm && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-600 dark:text-orange-400 rounded-full text-sm border border-orange-200 dark:border-orange-800">
                            <span>Search: {searchTerm}</span>
                            <button onClick={() => setSearchTerm('')} className="hover:text-orange-800">
                              <FaTimes size={12} />
                            </button>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Featured Properties Section */}
        {selectedLocation === 'All' && propertyType === 'All' && !priceRange.min && !priceRange.max && !searchTerm && (
          <section className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  Featured Properties
                  <span className="text-sm font-normal px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full ml-2">
                    Top Picks
                  </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
                  <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                  Hand-picked properties with exclusive deals
                </p>
              </div>
              <Link
                href="/featured"
                className="group flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium"
              >
                <span>View All</span>
                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredAds.map((ad, index) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AdCard ad={ad} featured />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* All Ads Grid */}
        <section>
          {loading ? (
            // Loading Skeletons with animation
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="animate-pulse"
                >
                  <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-gray-700 dark:to-gray-800 h-48 rounded-t-2xl"></div>
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-b-2xl space-y-3 border-2 border-orange-100 dark:border-gray-700">
                    <div className="h-4 bg-orange-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-orange-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-orange-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <>
              {filteredAds.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentItems.map((ad, index) => (
                      <motion.div
                        key={ad.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <AdCard ad={ad} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <nav className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-orange-100 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                        >
                          Previous
                        </button>

                        {[...Array(totalPages)].map((_, i) => {
                          const pageNumber = i + 1;
                          const isActive = currentPage === pageNumber;

                          // Show first page, last page, and pages around current
                          if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`w-10 h-10 rounded-lg font-medium transition-all transform hover:scale-110 ${isActive
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-800 border-2 border-orange-100 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                  }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          }

                          // Show ellipsis
                          if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                            return (
                              <span key={pageNumber} className="text-orange-300">
                                ...
                              </span>
                            );
                          }

                          return null;
                        })}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-orange-100 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="mb-6">
                    <FaHome className="text-6xl text-orange-300 dark:text-orange-600 mx-auto" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                    No properties found matching your criteria
                  </p>
                  <button
                    onClick={() => {
                      setSelectedLocation('All');
                      setSelectedCity('All');
                      setPropertyType('All');
                      setPriceRange({ min: '', max: '' });
                      setSearchTerm('');
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </>
          )}
        </section>
      </div>

      <CTA />
    </div>
  );
}