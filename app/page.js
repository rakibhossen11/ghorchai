// app/page.jsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Hero from "./components/Hero";
import AdCard from "./components/AdCard";
import CTA from "./components/CTA";
import { useAuthStore } from "./store/authStore";
import { useAdStore } from "./store/adStore";
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
  FaFire,
  FaSpinner
} from "react-icons/fa";
import { MdApartment, MdHouse } from "react-icons/md";
import { GiVillage, GiModernCity } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// Category icons mapping for property types
const categoryIcons = {
  'apartment': <MdApartment className="text-orange-500" />,
  'house': <MdHouse className="text-orange-500" />,
  'commercial': <FaStore className="text-orange-500" />,
  'studio': <FaBuilding className="text-orange-500" />,
  'penthouse': <GiModernCity className="text-orange-500" />,
  'villa': <GiVillage className="text-orange-500" />,
  'land': <FaTree className="text-orange-500" />,
};

// Format category name for display
const formatCategoryName = (type) => {
  if (!type) return '';
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export default function Home() {
  const { user } = useAuthStore();
  const { 
    properties, 
    getProperties, 
    loading: adLoading, 
    pagination 
  } = useAdStore();
  
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [filteredAds, setFilteredAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [propertyType, setPropertyType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState('All');
  const itemsPerPage = 8;

  // Load properties from backend on mount
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      console.log('📥 Loading properties from API...');
      await getProperties({ limit: 100 }); // Load up to 100 properties
      console.log('✅ Properties loaded:', properties?.length || 0);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  // Get unique cities from real data
  const cities = useMemo(() => {
    if (!properties || properties.length === 0) return ['All'];
    const allCities = properties.map(ad => {
      const parts = ad.location?.split(',') || [];
      return parts[parts.length - 1]?.trim() || 'Unknown';
    });
    return ['All', ...new Set(allCities)];
  }, [properties]);

  // Get unique property types from real data
  const propertyTypes = useMemo(() => {
    if (!properties || properties.length === 0) return ['All'];
    return ['All', ...new Set(properties.map(ad => ad.property_type))];
  }, [properties]);

  // Filter and sort ads
  useEffect(() => {
    if (!properties || properties.length === 0) {
      setFilteredAds([]);
      return;
    }

    let filtered = [...properties];

    // Filter by city
    if (selectedCity !== 'All') {
      filtered = filtered.filter(ad =>
        ad.location?.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    // Filter by location (backward compatibility)
    if (selectedLocation !== 'All') {
      filtered = filtered.filter(ad =>
        ad.location?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Filter by property type
    if (propertyType !== 'All') {
      filtered = filtered.filter(ad => ad.property_type === propertyType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(ad =>
        ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange.min) {
      const minPrice = parseFloat(priceRange.min);
      filtered = filtered.filter(ad => ad.price >= minPrice);
    }
    if (priceRange.max) {
      const maxPrice = parseFloat(priceRange.max);
      filtered = filtered.filter(ad => ad.price <= maxPrice);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredAds(filtered);
    setCurrentPage(1);
  }, [selectedLocation, selectedCity, propertyType, priceRange, sortBy, searchTerm, properties]);

  // Get current page items
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredAds.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredAds, currentPage]);

  // Total pages
  const totalPages = Math.ceil(filteredAds.length / itemsPerPage);

  // Featured ads (top 4 by views or featured flag)
  const featuredAds = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    return properties
      .filter(ad => ad.featured === true || (ad.views && ad.views > 50))
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 4);
  }, [properties]);

  // Quick stats
  const stats = useMemo(() => {
    if (!properties || properties.length === 0) {
      return { total: 0, cities: 0, types: 0, avgPrice: '৳0' };
    }
    const avgPrice = properties.reduce((sum, ad) => sum + (ad.price || 0), 0) / properties.length;
    return {
      total: properties.length,
      cities: cities.length - 1,
      types: propertyTypes.length - 1,
      avgPrice: `৳${Math.round(avgPrice).toLocaleString()}`
    };
  }, [properties, cities, propertyTypes]);

  // Handle page change
  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedLocation('All');
    setSelectedCity('All');
    setPropertyType('All');
    setPriceRange({ min: '', max: '' });
    setSortBy('latest');
    setSearchTerm('');
  };

  // Loading state
  if (loading && properties.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/30 dark:from-gray-900 dark:to-gray-800">
        <Hero />
        <div className="container-custom py-20">
          <div className="flex flex-col items-center justify-center">
            <FaSpinner className="text-5xl text-orange-500 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading properties...</p>
          </div>
        </div>
      </div>
    );
  }

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
                  <span className="font-bold text-orange-600 dark:text-orange-400">{stats.total}</span> Properties
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
                  <span className="font-bold text-orange-600 dark:text-orange-400">{stats.avgPrice}</span> Avg Price
                </span>
              </div>
            </div>

            {/* Quick City Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {cities.slice(0, 5).map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all transform hover:scale-105 ${
                    selectedCity === city
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
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all transform hover:scale-105 ${
                  propertyType === type
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-orange-200 dark:border-gray-700'
                }`}
              >
                {type !== 'All' && (
                  <span className="text-lg">
                    {categoryIcons[type] || <FaBuilding className="text-orange-500" />}
                  </span>
                )}
                <span>{type === 'All' ? type : formatCategoryName(type)}</span>
                {type !== 'All' && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    propertyType === type
                      ? 'bg-white/20 text-white'
                      : 'bg-orange-100 text-orange-600 dark:bg-gray-700 dark:text-orange-400'
                  }`}>
                    {properties.filter(ad => ad.property_type === type).length}
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
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-2 border-orange-100 dark:border-gray-700">
                  <div className="mb-6">
                    {/* Header */}
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
                        onClick={clearAllFilters}
                        className="group relative px-4 py-2 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-md transition-all duration-300 overflow-hidden"
                      >
                        <div className="relative flex items-center gap-2">
                          <span className="text-sm font-medium text-orange-600 dark:text-orange-400 group-hover:text-white transition-colors duration-300">
                            Clear all filters
                          </span>
                          <FaTimes
                            size={12}
                            className="text-orange-500 dark:text-orange-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300"
                          />
                        </div>
                      </motion.button>
                    </div>

                    {/* Active Filters Counter */}
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
                        </div>
                      );
                    })()}

                    {/* Active Filters Tags */}
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
                            <span className="text-gray-700 dark:text-gray-300">{formatCategoryName(propertyType)}</span>
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
                          <option key={type} value={type}>
                            {type === 'All' ? type : formatCategoryName(type)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Min Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Min Price (BDT)
                      </label>
                      <input
                        type="number"
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
                        type="number"
                        placeholder="e.g., 200000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-2 border-orange-100 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Featured Properties Section */}
        {selectedLocation === 'All' && propertyType === 'All' && !priceRange.min && !priceRange.max && !searchTerm && featuredAds.length > 0 && (
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
                href="/properties"
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
          {adLoading && properties.length === 0 ? (
            // Loading Skeletons
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

                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }
                          
                          const isActive = currentPage === pageNumber;

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`w-10 h-10 rounded-lg font-medium transition-all transform hover:scale-110 ${
                                isActive
                                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                                  : 'bg-white dark:bg-gray-800 border-2 border-orange-100 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
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
                    onClick={clearAllFilters}
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