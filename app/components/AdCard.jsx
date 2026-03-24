// components/AdCard.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Heart, 
  Maximize2,
  Calendar,
  Tag,
  Star,
  Eye,
  Share2
} from "lucide-react";

export default function AdCard({ ad, featured = false, priority = false }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Default image if ad image fails to load
  const defaultImage = "/images/placeholder-property.jpg";

  // Format price with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get badge color based on ad type - Using orange theme
  const getBadgeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'urgent':
        return 'bg-gradient-to-r from-red-500 to-orange-500';
      case 'new':
        return 'bg-gradient-to-r from-green-500 to-orange-400';
      case 'featured':
        return 'bg-gradient-to-r from-orange-500 to-orange-600';
      default:
        return 'bg-gradient-to-r from-orange-400 to-orange-500';
    }
  };

  return (
    <div 
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 dark:from-gray-700 dark:to-gray-800">
        {/* Loading Spinner */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-orange-50 dark:bg-gray-800 z-10">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Main Image */}
        <Image
          src={imageError ? defaultImage : (ad?.image || defaultImage)}
          alt={ad?.title || "Property image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          priority={priority}
          onLoadingComplete={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges Container */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {/* Featured Badge */}
          {(featured || ad?.featured) && (
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
              <Star size={12} className="text-yellow-300" />
              Featured
            </span>
          )}

          {/* Ad Type Badge */}
          {ad?.type && (
            <span className={`${getBadgeColor(ad.type)} text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1`}>
              <Tag size={12} />
              {ad.type}
            </span>
          )}

          {/* New Badge */}
          {ad?.isNew && (
            <span className="bg-gradient-to-r from-green-500 to-orange-400 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
              <Star size={12} className="text-yellow-300" />
              Just Added
            </span>
          )}
        </div>

        {/* Top Right Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          {/* Like Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 group/btn hover:shadow-orange-500/25"
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          >
            {isLiked ? (
              <Heart className="text-red-500 fill-red-500" size={18} />
            ) : (
              <Heart className="text-gray-600 dark:text-gray-300 group-hover/btn:text-orange-500" size={18} />
            )}
          </button>

          {/* Share Button - Shows on Hover */}
          <button
            className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:scale-110 transition-all duration-200 hover:shadow-orange-500/25 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
            aria-label="Share ad"
          >
            <Share2 size={18} className="text-gray-600 dark:text-gray-300 hover:text-orange-500" />
          </button>
        </div>

        {/* View Count - Bottom Left */}
        {ad?.views > 0 && (
          <div className="absolute bottom-4 left-4 bg-gradient-to-r from-orange-600/90 to-orange-700/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 z-10 shadow-lg">
            <Eye size={12} />
            {ad.views} views
          </div>
        )}

        {/* Posted Date - Bottom Right */}
        {ad?.postedDate && (
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-orange-600/90 to-orange-700/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 z-10 shadow-lg">
            <Calendar size={12} />
            {ad.postedDate}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Price and Title */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              {formatPrice(ad?.price || 0)}
            </span>
            {ad?.negotiable && (
              <span className="text-xs bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full border border-orange-200 dark:border-orange-800">
                Negotiable
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {ad?.title || "Property Title"}
          </h3>
        </div>

        {/* Location */}
        <div className="flex items-start space-x-2 mb-4">
          <MapPin className="text-orange-500 flex-shrink-0 mt-1" size={16} />
          <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {ad?.location || "Location not specified"}
          </span>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-3 mb-5 py-3 border-t border-b border-orange-100 dark:border-gray-700">
          {/* Beds */}
          {ad?.beds > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Bed size={16} className="text-orange-500" />
              <span className="font-medium">{ad.beds}</span>
              <span className="text-xs">Beds</span>
            </div>
          )}

          {/* Baths */}
          {ad?.baths > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Bath size={16} className="text-orange-500" />
              <span className="font-medium">{ad.baths}</span>
              <span className="text-xs">Baths</span>
            </div>
          )}

          {/* Area */}
          {ad?.area > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Maximize2 size={16} className="text-orange-500" />
              <span className="font-medium">{ad.area}</span>
              <span className="text-xs">sqft</span>
            </div>
          )}
        </div>

        {/* Seller Info and Action */}
        <div className="flex items-center justify-between">
          {/* Seller Info */}
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600">
              {ad?.seller?.avatar ? (
                <Image
                  src={ad.seller.avatar}
                  alt={ad.seller.name || "Seller"}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-sm font-semibold">
                  {(ad?.seller?.name?.[0] || "U").toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {ad?.seller?.name || "Unknown Seller"}
              </p>
              {ad?.seller?.verified && (
                <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  <span className="w-1 h-1 bg-orange-600 rounded-full animate-pulse"></span>
                  Verified Seller
                </p>
              )}
            </div>
          </div>

          {/* View Details Button */}
          <Link
            href={`/ads/${ad?.id || '#'}`}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 flex items-center gap-2 group/btn"
          >
            <span>Details</span>
            <Eye size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Hover Overlay with Quick Actions */}
      {isHovered && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-gradient-x" />
      )}
    </div>
  );
}