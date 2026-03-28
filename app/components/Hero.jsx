// components/Hero.jsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  Home, 
  Car, 
  Smartphone, 
  Sofa,
  Dog,
  Shirt,
  Bike,
  Watch,
  BookOpen,
  Wrench,
  ArrowRight,
  X,
  Loader2,
  CheckCircle
} from "lucide-react";
import { useLocationStore } from "../store/locationStore";
import LocationSelector from "./LocationSelector";

const Hero = () => {
  const router = useRouter();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedUpazila, setSelectedUpazila] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);

  const locationRef = useRef(null);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Popular categories
  const categories = [
    { name: "Properties", icon: Home, color: "bg-blue-500", count: "2.5k", slug: "properties" },
    { name: "Cars", icon: Car, color: "bg-green-500", count: "1.8k", slug: "cars" },
    { name: "Phones", icon: Smartphone, color: "bg-purple-500", count: "3.2k", slug: "phones" },
    { name: "Furniture", icon: Sofa, color: "bg-orange-500", count: "1.2k", slug: "furniture" },
    { name: "Pets", icon: Dog, color: "bg-yellow-500", count: "856", slug: "pets" },
    { name: "Fashion", icon: Shirt, color: "bg-pink-500", count: "2.1k", slug: "fashion" },
    { name: "Bikes", icon: Bike, color: "bg-indigo-500", count: "967", slug: "bikes" },
    { name: "Watches", icon: Watch, color: "bg-amber-500", count: "543", slug: "watches" },
    { name: "Books", icon: BookOpen, color: "bg-red-500", count: "1.5k", slug: "books" },
    { name: "Services", icon: Wrench, color: "bg-teal-500", count: "789", slug: "services" },
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = () => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  };

  const saveRecentSearch = (search) => {
    const updated = [search, ...recentSearches.filter(s => s.text !== search.text)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search suggestions
  const fetchSuggestions = async (query) => {
    setIsSearching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const locationText = selectedUpazila?.name || selectedDistrict?.name || selectedDivision?.name || "Bangladesh";
      const mockSuggestions = [
        { id: "s1", text: `${query} in ${locationText}`, category: "Popular" },
        { id: "s2", text: `${query} under ৳10,000`, category: "Budget" },
        { id: "s3", text: `${query} premium`, category: "Premium" },
        { id: "s4", text: `${query} used`, category: "Used" },
        { id: "s5", text: `${query} new`, category: "New" },
      ];
      
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search submit
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const searchData = {
      id: Date.now().toString(),
      text: searchQuery,
      timestamp: new Date().toISOString()
    };
    saveRecentSearch(searchData);
    
    const params = new URLSearchParams({
      q: searchQuery,
      division: selectedDivision?.id || "",
      district: selectedDistrict?.id || "",
      upazila: selectedUpazila?.id || "",
      location: selectedLocation?.name || "",
    });
    
    router.push(`/search?${params.toString()}`);
    setShowSuggestions(false);
  }, [searchQuery, selectedDivision, selectedDistrict, selectedUpazila, selectedLocation, router]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    
    const searchData = {
      id: Date.now().toString(),
      text: suggestion.text,
      category: suggestion.category,
      timestamp: new Date().toISOString()
    };
    saveRecentSearch(searchData);
    
    handleSearch(new Event('submit'));
  };

  // Handle category click
  const handleCategoryClick = (slug) => {
    const params = new URLSearchParams({
      category: slug,
      division: selectedDivision?.id || "",
      district: selectedDistrict?.id || "",
      upazila: selectedUpazila?.id || "",
    });
    router.push(`/search?${params.toString()}`);
  };

  // Handle location selection from LocationSelector
  const handleLocationSelect = (locationData) => {
    setSelectedDivision(locationData.division);
    setSelectedDistrict(locationData.district);
    setSelectedUpazila(locationData.upazila);
    setSelectedLocation({
      id: locationData.upazila?.id,
      name: locationData.locationName,
      divisionId: locationData.division?.id,
      districtId: locationData.district?.id,
      upazilaId: locationData.upazila?.id
    });
    setLocationSelected(true);
    setShowLocationSelector(false);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  // Format location display text
  const getLocationDisplayText = () => {
    if (selectedUpazila && selectedDistrict && selectedDivision) {
      return `${selectedUpazila.name}, ${selectedDistrict.name}`;
    }
    return "Select Location";
  };

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slideInLeft">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm text-orange-600 px-4 py-2 rounded-full shadow-lg border border-orange-100">
              <span className="text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                🇧🇩 Bangladesh's #1 Marketplace
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Rent
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                Everything Nearby
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              Join <span className="font-semibold text-orange-500">2.5 million+</span> buyers and sellers in Bangladesh. 
              Post ads for free and find great deals in your neighborhood.
            </p>

            {/* Search and Location Section */}
            <div className="space-y-4">
              {/* Location Selector Button */}
              <div className="relative" ref={locationRef}>
                <button
                  onClick={() => setShowLocationSelector(true)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-orange-500 transition-all group"
                  aria-label="Select location"
                >
                  <MapPin size={20} className="text-orange-500" />
                  <span className="font-medium">Search in:</span>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-md transition-all flex items-center gap-2 ${
                    locationSelected 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                  }`}>
                    {locationSelected && <CheckCircle size={14} />}
                    <span>{getLocationDisplayText()}</span>
                    <ChevronDown size={14} />
                  </span>
                </button>
              </div>

              {/* Location Selector Modal */}
              {showLocationSelector && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-4 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Select Your Location</h3>
                      <button
                        onClick={() => setShowLocationSelector(false)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="p-4">
                      <LocationSelector 
                        onLocationChange={handleLocationSelect}
                        initialValues={{
                          divisionId: selectedDivision?.id,
                          districtId: selectedDistrict?.id,
                          upazilaId: selectedUpazila?.id,
                          fullAddress: ""
                        }}
                        showFullAddress={false}
                      />
                    </div>
                    <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-4">
                      <button
                        onClick={() => setShowLocationSelector(false)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition"
                      >
                        Confirm Location
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Bar with Suggestions */}
              <div className="relative" ref={searchRef}>
                <form onSubmit={handleSearch}>
                  <div className="flex items-center bg-white rounded-2xl shadow-2xl border-2 border-transparent focus-within:border-orange-500 transition-all">
                    <div className="flex-1 flex items-center px-4">
                      <Search size={20} className="text-gray-400" />
                      <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder={`What are you looking for in ${getLocationDisplayText()}?`}
                        className="w-full px-3 py-4 focus:outline-none text-gray-700 placeholder-gray-400"
                        aria-label="Search"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={!searchQuery.trim()}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Search</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </form>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && (searchQuery.length > 0 || recentSearches.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-40 animate-fadeIn">
                    {isSearching ? (
                      <div className="p-8 text-center">
                        <Loader2 size={30} className="animate-spin text-orange-500 mx-auto" />
                        <p className="text-sm text-gray-500 mt-2">Searching...</p>
                      </div>
                    ) : (
                      <>
                        {/* Recent Searches */}
                        {searchQuery.length === 0 && recentSearches.length > 0 && (
                          <div className="p-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-3">Recent Searches</h4>
                            <div className="space-y-2">
                              {recentSearches.map((search) => (
                                <button
                                  key={search.id}
                                  onClick={() => handleSuggestionClick(search)}
                                  className="w-full flex items-center justify-between p-2 hover:bg-orange-50 rounded-lg transition-colors group"
                                >
                                  <div className="flex items-center space-x-3">
                                    <Search size={16} className="text-gray-400" />
                                    <span className="text-gray-700 group-hover:text-orange-500">
                                      {search.text}
                                    </span>
                                  </div>
                                  {search.category && (
                                    <span className="text-xs text-gray-400">{search.category}</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Search Suggestions */}
                        {searchQuery.length > 0 && suggestions.length > 0 && (
                          <div className="p-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-3">Suggestions</h4>
                            <div className="space-y-2">
                              {suggestions.map((suggestion) => (
                                <button
                                  key={suggestion.id}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="w-full flex items-center justify-between p-2 hover:bg-orange-50 rounded-lg transition-colors group"
                                >
                                  <div className="flex items-center space-x-3">
                                    <Search size={16} className="text-gray-400" />
                                    <span className="text-gray-700 group-hover:text-orange-500">
                                      {suggestion.text}
                                    </span>
                                  </div>
                                  {suggestion.category && (
                                    <span className="text-xs text-gray-400">{suggestion.category}</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchQuery.length > 0 && suggestions.length === 0 && (
                          <div className="p-8 text-center">
                            <p className="text-gray-500">No suggestions found for "{searchQuery}"</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 border-2 border-white shadow-lg"
                    ></div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-bold text-gray-900 text-lg">50k+</span>
                  <span className="text-gray-600 ml-1">active buyers today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Categories Grid */}
          <div className="relative animate-slideInRight">
            {/* Floating Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                <span>Browse Categories</span>
                <span className="text-sm font-normal text-gray-500">
                  Popular in {selectedUpazila?.name || selectedDistrict?.name || selectedDivision?.name || "Bangladesh"}
                </span>
              </h3>
              
              {/* Categories Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.slug}
                      onClick={() => handleCategoryClick(category.slug)}
                      className="group focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-xl"
                    >
                      <div className="flex flex-col items-center p-4 rounded-xl hover:bg-white transition-all transform hover:scale-105 hover:shadow-xl">
                        <div className={`${category.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-2 group-hover:shadow-lg transition-all group-hover:rotate-3`}>
                          <Icon size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-orange-500">
                          {category.name}
                        </span>
                        <span className="text-xs text-gray-400">{category.count} ads</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* View All Link */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link 
                  href="/categories" 
                  className="flex items-center justify-center space-x-2 text-orange-500 hover:text-orange-600 font-medium group"
                >
                  <span>View All Categories</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeInUp">
          {[
            { icon: "🛡️", title: "Safe Deals", desc: "100% secure payments", color: "bg-green-100", textColor: "text-green-600" },
            { icon: "🤝", title: "Trusted Sellers", desc: "Verified profiles", color: "bg-blue-100", textColor: "text-blue-600" },
            { icon: "⚡", title: "Fast Delivery", desc: "Nationwide shipping", color: "bg-purple-100", textColor: "text-purple-600" },
            { icon: "💰", title: "Best Prices", desc: "Compare & save", color: "bg-orange-100", textColor: "text-orange-600" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm rounded-xl p-4 hover:shadow-lg transition-all hover:scale-105"
            >
              <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-2xl`}>
                <span>{item.icon}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default Hero;

// // components/Hero.jsx
// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { 
//   Search, 
//   MapPin, 
//   ChevronDown, 
//   Home, 
//   Car, 
//   Smartphone, 
//   Sofa,
//   Dog,
//   Shirt,
//   Bike,
//   Watch,
//   BookOpen,
//   Wrench,
//   ArrowRight,
//   X,
//   Loader2
// } from "lucide-react";
// import LocationSelector from "./LocationSelector";

// const Hero = () => {
//   const router = useRouter();
//   const [isLocationOpen, setIsLocationOpen] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearching, setIsSearching] = useState(false);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [suggestions, setSuggestions] = useState([]);
//   const [recentSearches, setRecentSearches] = useState([
//     { id: "1", text: "iPhone 13", category: "Electronics" },
//     { id: "2", text: "Sofa set", category: "Furniture" },
//     { id: "3", text: "Honda Civic", category: "Cars" },
//     { id: "4", text: "Apartment rent", category: "Properties" },
//   ]);

//   const locationRef = useRef(null);
//   const searchRef = useRef(null);
//   const inputRef = useRef(null);

//   // Popular locations in Bangladesh
//   const locations = [
//     // { name: "Dhaka", count: "12,450 ads", icon: "🏙️", id: "dhaka" },
//     // { name: "Chattogram", count: "8,320 ads", icon: "🏖️", id: "chattogram" },
//     // { name: "Sylhet", count: "5,678 ads", icon: "⛰️", id: "sylhet" },
//     // { name: "Khulna", count: "4,567 ads", icon: "🌳", id: "khulna" },
//     // { name: "Rajshahi", count: "3,890 ads", icon: "🥭", id: "rajshahi" },
//     // { name: "Barisal", count: "2,345 ads", icon: "🌾", id: "barisal" },
//     // { name: "Rangpur", count: "2,123 ads", icon: "🌽", id: "rangpur" },
//     // { name: "Mymensingh", count: "1,987 ads", icon: "🏛️", id: "mymensingh" },
//     { name: "Bhaluka", count: "1,987 ads", icon: "🏛️", id: "bhaluka" },
//   ];

//   // Popular categories
//   const categories = [
//     { name: "Properties", icon: Home, color: "bg-blue-500", count: "2.5k", slug: "properties" },
//     { name: "Cars", icon: Car, color: "bg-green-500", count: "1.8k", slug: "cars" },
//     { name: "Phones", icon: Smartphone, color: "bg-purple-500", count: "3.2k", slug: "phones" },
//     { name: "Furniture", icon: Sofa, color: "bg-orange-500", count: "1.2k", slug: "furniture" },
//     { name: "Pets", icon: Dog, color: "bg-yellow-500", count: "856", slug: "pets" },
//     { name: "Fashion", icon: Shirt, color: "bg-pink-500", count: "2.1k", slug: "fashion" },
//     { name: "Bikes", icon: Bike, color: "bg-indigo-500", count: "967", slug: "bikes" },
//     { name: "Watches", icon: Watch, color: "bg-amber-500", count: "543", slug: "watches" },
//     { name: "Books", icon: BookOpen, color: "bg-red-500", count: "1.5k", slug: "books" },
//     { name: "Services", icon: Wrench, color: "bg-teal-500", count: "789", slug: "services" },
//   ];

//   // Set default location on mount
//   useEffect(() => {
//     setSelectedLocation(locations[0]);
//   }, []);

//   // Handle click outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (locationRef.current && !locationRef.current.contains(event.target)) {
//         setIsLocationOpen(false);
//       }
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowSuggestions(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Handle search with debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchQuery.length > 2) {
//         fetchSuggestions(searchQuery);
//       } else {
//         setSuggestions([]);
//       }
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   // Fetch search suggestions
//   const fetchSuggestions = async (query) => {
//     setIsSearching(true);
//     try {
//       // Simulate API call - replace with actual API
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       // Mock suggestions
//       const mockSuggestions = [
//         { id: "s1", text: `${query} in Dhaka`, category: "Popular" },
//         { id: "s2", text: `${query} premium`, category: "Premium" },
//         { id: "s3", text: `${query} used`, category: "Used" },
//         { id: "s4", text: `${query} new`, category: "New" },
//       ];
      
//       setSuggestions(mockSuggestions);
//     } catch (error) {
//       console.error("Error fetching suggestions:", error);
//       setSuggestions([]);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   // Handle search submit
//   const handleSearch = useCallback((e) => {
//     e.preventDefault();
//     if (!searchQuery.trim()) return;
    
//     const params = new URLSearchParams({
//       q: searchQuery,
//       location: selectedLocation?.id || "bhaluka",
//     });
    
//     router.push(`/search?${params.toString()}`);
//     setShowSuggestions(false);
//   }, [searchQuery, selectedLocation, router]);

//   // Handle suggestion click
//   const handleSuggestionClick = (suggestion) => {
//     setSearchQuery(suggestion.text);
//     setShowSuggestions(false);
    
//     // Add to recent searches
//     const newRecent = {
//       id: Date.now().toString(),
//       text: suggestion.text,
//       category: suggestion.category,
//     };
//     setRecentSearches(prev => [newRecent, ...prev.slice(0, 3)]);
    
//     // Trigger search
//     handleSearch(new Event('submit'));
//   };

//   // Handle category click
//   const handleCategoryClick = (slug) => {
//     router.push(`/category/${slug}?location=${selectedLocation?.id || "dhaka"}`);
//   };

//   // Clear search
//   const clearSearch = () => {
//     setSearchQuery("");
//     inputRef.current?.focus();
//   };

//   return (
//     <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-30">
//         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
//         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
//         <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
//       </div>
//       <LocationSelector />

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           {/* Left Content */}
//           <div className="space-y-8 animate-slideInLeft">
//             {/* Badge */}
//             <div className="inline-flex items-center bg-white/80 backdrop-blur-sm text-orange-600 px-4 py-2 rounded-full shadow-lg border border-orange-100">
//               <span className="text-sm font-medium flex items-center gap-2">
//                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                 🇧🇩 Bangladesh's #1 Marketplace
//               </span>
//             </div>

//             {/* Main Heading */}
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
//               {/* Buy & Sell Or Rent */}
//               Rent
//               <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
//                 Everything Nearby
//               </span>
//             </h1>
            
//             <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
//               Join <span className="font-semibold text-orange-500">2.5 million+</span> buyers and sellers in Bangladesh. 
//               Post ads for free and find great deals in your neighborhood.
//             </p>

//             {/* Search and Location Section */}
//             <div className="space-y-4">
//               {/* Location Selector */}
//               <div className="relative" ref={locationRef}>
//                 <button
//                   onClick={() => setIsLocationOpen(!isLocationOpen)}
//                   className="flex items-center space-x-3 text-gray-700 hover:text-orange-500 transition-all group"
//                   aria-label="Select location"
//                   aria-expanded={isLocationOpen}
//                 >
//                   <MapPin size={20} className="text-orange-500" />
//                   <span className="font-medium">Search in:</span>
//                   <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md group-hover:shadow-lg transition-shadow">
//                     {selectedLocation?.name || "Select location"}
//                   </span>
//                   <ChevronDown 
//                     size={18} 
//                     className={`text-gray-500 transition-transform duration-300 ${
//                       isLocationOpen ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>

//                 {/* Location Dropdown */}
//                 {isLocationOpen && (
//                   <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-fadeIn">
//                     <div className="px-4 py-3 border-b border-gray-100">
//                       <h3 className="font-semibold text-gray-800">Popular Locations</h3>
//                       <p className="text-xs text-gray-500 mt-1">Select your city to find items near you</p>
//                     </div>
//                     <div className="max-h-80 overflow-y-auto">
//                       {locations.map((location) => (
//                         <button
//                           key={location.id}
//                           onClick={() => {
//                             setSelectedLocation(location);
//                             setIsLocationOpen(false);
//                           }}
//                           className="w-full flex items-center justify-between px-4 py-3 hover:bg-orange-50 transition-colors group"
//                         >
//                           <div className="flex items-center space-x-3">
//                             <span className="text-xl">{location.icon}</span>
//                             <div className="text-left">
//                               <span className="text-gray-700 group-hover:text-orange-500 font-medium">
//                                 {location.name}
//                               </span>
//                               <p className="text-xs text-gray-400">{location.count}</p>
//                             </div>
//                           </div>
//                           {selectedLocation?.id === location.id && (
//                             <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
//                           )}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Search Bar with Suggestions */}
//               <div className="relative" ref={searchRef}>
//                 <form onSubmit={handleSearch}>
//                   <div className="flex items-center bg-white rounded-2xl shadow-2xl border-2 border-transparent focus-within:border-orange-500 transition-all">
//                     <div className="flex-1 flex items-center px-4">
//                       <Search size={20} className="text-gray-400" />
//                       <input
//                         ref={inputRef}
//                         type="text"
//                         value={searchQuery}
//                         onChange={(e) => {
//                           setSearchQuery(e.target.value);
//                           setShowSuggestions(true);
//                         }}
//                         onFocus={() => setShowSuggestions(true)}
//                         placeholder={`What are you looking for in ${selectedLocation?.name || "Dhaka"}?`}
//                         className="w-full px-3 py-4 focus:outline-none text-gray-700 placeholder-gray-400"
//                         aria-label="Search"
//                       />
//                       {searchQuery && (
//                         <button
//                           type="button"
//                           onClick={clearSearch}
//                           className="text-gray-400 hover:text-gray-600"
//                         >
//                           <X size={18} />
//                         </button>
//                       )}
//                     </div>
//                     <button
//                       type="submit"
//                       disabled={!searchQuery.trim()}
//                       className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <span>Search</span>
//                       <ArrowRight size={18} />
//                     </button>
//                   </div>
//                 </form>

//                 {/* Search Suggestions Dropdown */}
//                 {showSuggestions && (searchQuery.length > 0 || recentSearches.length > 0) && (
//                   <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-40 animate-fadeIn">
//                     {isSearching ? (
//                       <div className="p-8 text-center">
//                         <Loader2 size={30} className="animate-spin text-orange-500 mx-auto" />
//                         <p className="text-sm text-gray-500 mt-2">Searching...</p>
//                       </div>
//                     ) : (
//                       <>
//                         {/* Recent Searches */}
//                         {searchQuery.length === 0 && recentSearches.length > 0 && (
//                           <div className="p-4">
//                             <h4 className="text-sm font-medium text-gray-500 mb-3">Recent Searches</h4>
//                             <div className="space-y-2">
//                               {recentSearches.map((search) => (
//                                 <button
//                                   key={search.id}
//                                   onClick={() => handleSuggestionClick(search)}
//                                   className="w-full flex items-center justify-between p-2 hover:bg-orange-50 rounded-lg transition-colors group"
//                                 >
//                                   <div className="flex items-center space-x-3">
//                                     <Search size={16} className="text-gray-400" />
//                                     <span className="text-gray-700 group-hover:text-orange-500">
//                                       {search.text}
//                                     </span>
//                                   </div>
//                                   {search.category && (
//                                     <span className="text-xs text-gray-400">{search.category}</span>
//                                   )}
//                                 </button>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                         {/* Search Suggestions */}
//                         {searchQuery.length > 0 && suggestions.length > 0 && (
//                           <div className="p-4">
//                             <h4 className="text-sm font-medium text-gray-500 mb-3">Suggestions</h4>
//                             <div className="space-y-2">
//                               {suggestions.map((suggestion) => (
//                                 <button
//                                   key={suggestion.id}
//                                   onClick={() => handleSuggestionClick(suggestion)}
//                                   className="w-full flex items-center justify-between p-2 hover:bg-orange-50 rounded-lg transition-colors group"
//                                 >
//                                   <div className="flex items-center space-x-3">
//                                     <Search size={16} className="text-gray-400" />
//                                     <span className="text-gray-700 group-hover:text-orange-500">
//                                       {suggestion.text}
//                                     </span>
//                                   </div>
//                                   {suggestion.category && (
//                                     <span className="text-xs text-gray-400">{suggestion.category}</span>
//                                   )}
//                                 </button>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                         {searchQuery.length > 0 && suggestions.length === 0 && (
//                           <div className="p-8 text-center">
//                             <p className="text-gray-500">No suggestions found</p>
//                           </div>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Quick Stats */}
//               <div className="flex items-center space-x-6 pt-4">
//                 <div className="flex -space-x-3">
//                   {[1, 2, 3, 4].map((i) => (
//                     <div
//                       key={i}
//                       className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 border-2 border-white shadow-lg"
//                     ></div>
//                   ))}
//                 </div>
//                 <div className="text-sm">
//                   <span className="font-bold text-gray-900 text-lg">50k+</span>
//                   <span className="text-gray-600 ml-1">active buyers today</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Content - Categories Grid */}
//           <div className="relative animate-slideInRight">
//             {/* Floating Card */}
//             <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gray-100">
//               <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
//                 <span>Browse Categories</span>
//                 <span className="text-sm font-normal text-gray-500">Popular in {selectedLocation?.name || "Dhaka"}</span>
//               </h3>
              
//               {/* Categories Grid */}
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                 {categories.map((category) => {
//                   const Icon = category.icon;
//                   return (
//                     <button
//                       key={category.slug}
//                       onClick={() => handleCategoryClick(category.slug)}
//                       className="group focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-xl"
//                     >
//                       <div className="flex flex-col items-center p-4 rounded-xl hover:bg-white transition-all transform hover:scale-105 hover:shadow-xl">
//                         <div className={`${category.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-2 group-hover:shadow-lg transition-all group-hover:rotate-3`}>
//                           <Icon size={24} />
//                         </div>
//                         <span className="text-sm font-medium text-gray-700 group-hover:text-orange-500">
//                           {category.name}
//                         </span>
//                         <span className="text-xs text-gray-400">{category.count} ads</span>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>

//               {/* View All Link */}
//               <div className="mt-6 pt-4 border-t border-gray-100">
//                 <Link 
//                   href="/categories" 
//                   className="flex items-center justify-center space-x-2 text-orange-500 hover:text-orange-600 font-medium group"
//                 >
//                   <span>View All Categories</span>
//                   <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Trust Indicators */}
//         <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeInUp">
//           {[
//             { icon: "🛡️", title: "Safe Deals", desc: "100% secure payments", color: "bg-green-100", textColor: "text-green-600" },
//             { icon: "🤝", title: "Trusted Sellers", desc: "Verified profiles", color: "bg-blue-100", textColor: "text-blue-600" },
//             { icon: "⚡", title: "Fast Delivery", desc: "Nationwide shipping", color: "bg-purple-100", textColor: "text-purple-600" },
//             { icon: "💰", title: "Best Prices", desc: "Compare & save", color: "bg-orange-100", textColor: "text-orange-600" },
//           ].map((item, index) => (
//             <div
//               key={index}
//               className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm rounded-xl p-4 hover:shadow-lg transition-all hover:scale-105"
//             >
//               <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-2xl`}>
//                 <span>{item.icon}</span>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-gray-800">{item.title}</h4>
//                 <p className="text-xs text-gray-500">{item.desc}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;