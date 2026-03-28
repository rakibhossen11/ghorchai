// app/ads/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaRulerCombined,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaFlag,
  FaCheckCircle,
  FaStar,
  FaArrowLeft,
  FaCamera,
  FaCalendarAlt,
  FaEye,
  FaPrint,
  FaFacebookF,
  FaTwitter,
  FaLink,
  FaSpinner,
  FaExclamationTriangle
} from "react-icons/fa";
import { MdVerified, MdOutlineApartment, MdOutlineWaterDrop, MdOutlineLocalGasStation } from "react-icons/md";
import { BsLightningCharge } from "react-icons/bs";
import { useAdStore } from "../../store/adStore";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

// Amenity icons mapping
const amenityIcons = {
  "parking": <FaCheckCircle className="text-orange-500" />,
  "elevator": <FaCheckCircle className="text-orange-500" />,
  "ac": <BsLightningCharge className="text-orange-500" />,
  "gas": <MdOutlineLocalGasStation className="text-orange-500" />,
  "water": <MdOutlineWaterDrop className="text-orange-500" />,
  "electricity": <BsLightningCharge className="text-orange-500" />,
  "wifi": <FaCheckCircle className="text-orange-500" />,
  "pool": <FaCheckCircle className="text-orange-500" />,
  "security": <FaCheckCircle className="text-orange-500" />,
  "parking2": <FaCheckCircle className="text-orange-500" />
};

// Format amenity name
const formatAmenityName = (amenityId) => {
  const amenities = {
    'parking': 'Parking',
    'elevator': 'Elevator',
    'ac': 'Air Conditioning',
    'gas': 'Gas Connection',
    'water': 'Water Supply',
    'electricity': 'Electricity',
    'wifi': 'WiFi',
    'pool': 'Swimming Pool',
    'security': '24/7 Security',
    'parking2': 'Covered Parking'
  };
  return amenities[amenityId] || amenityId;
};

// Format property type
const formatPropertyType = (type) => {
  const types = {
    'apartment': 'Apartment',
    'house': 'House',
    'land': 'Land',
    'commercial': 'Commercial',
    'villa': 'Villa',
    'studio': 'Studio'
  };
  return types[type] || type;
};

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const { getPropertyById, saveProperty } = useAdStore();
  const { user } = useAuthStore();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching property with ID: ${params.id}`);
      
      const response = await getPropertyById(params.id);
      console.log("Property data:", response);
      
      if (response.success && response.data.property) {
        setProperty(response.data.property);
        setIsLiked(response.data.property.isSaved || false);
      } else {
        throw new Error(response.message || "Property not found");
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      setError(error.message || "Failed to load property details");
      toast.error("Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProperty = async () => {
    if (!user) {
      toast.error("Please login to save properties");
      router.push(`/login?redirect=/ads/${params.id}`);
      return;
    }
    
    try {
      setSaving(true);
      const result = await saveProperty(params.id);
      setIsLiked(result.data.saved);
      toast.success(result.data.saved ? "Property saved to favorites!" : "Property removed from favorites");
    } catch (error) {
      toast.error("Failed to save property");
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
    setShowShareModal(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
    setShowShareModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const formatPrice = (price) => {
    return `৳${price?.toLocaleString() || 0}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/30 py-24">
        <div className="container-custom">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <FaSpinner className="text-5xl text-orange-500 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/30 py-24">
        <div className="container-custom text-center">
          <div className="mb-6">
            <FaExclamationTriangle className="text-6xl text-red-500 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">{error || "The property you're looking for doesn't exist or has been removed."}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = property.images || [];
  const primaryImage = images[0]?.image_url || property.image || "/images/placeholder.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/30 py-24">
      <div className="container-custom">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 mb-6 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to listings</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden group bg-gray-100">
                <Image
                  src={images[selectedImage]?.image_url || primaryImage}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Image Counter */}
                {images.length > 0 && (
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                    <FaCamera size={14} />
                    <span>{selectedImage + 1} / {images.length}</span>
                  </div>
                )}

                {/* Like Button */}
                <button
                  onClick={handleSaveProperty}
                  disabled={saving}
                  className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
                >
                  {isLiked ? (
                    <FaHeart className="text-red-500 text-xl" />
                  ) : (
                    <FaRegHeart className="text-gray-600 text-xl" />
                  )}
                </button>

                {/* Share Button */}
                <button
                  onClick={() => setShowShareModal(true)}
                  className="absolute top-4 right-20 bg-white/90 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <FaShare className="text-gray-600" />
                </button>
              </div>

              {/* Thumbnail Grid */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-24 rounded-xl overflow-hidden transition-all ${
                        selectedImage === index 
                          ? 'ring-4 ring-orange-500 scale-105' 
                          : 'hover:scale-105'
                      }`}
                    >
                      <Image
                        src={img.image_url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                Property Details
              </h2>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.beds > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
                    <FaBed className="text-2xl text-orange-500 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{property.beds} Beds</div>
                  </div>
                )}
                {property.baths > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
                    <FaBath className="text-2xl text-orange-500 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{property.baths} Baths</div>
                  </div>
                )}
                {property.area && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
                    <FaRulerCombined className="text-2xl text-orange-500 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{property.area} sqft</div>
                  </div>
                )}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
                  <MdOutlineApartment className="text-2xl text-orange-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{formatPropertyType(property.property_type)}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                        {amenityIcons[amenity.amenity_id] || <FaCheckCircle className="text-orange-500" />}
                        <span className="text-sm text-gray-700">{formatAmenityName(amenity.amenity_id)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact & Info */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 sticky top-24">
              <div className="mb-6">
                <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  {formatPrice(property.price)}
                </span>
                {property.negotiable && (
                  <span className="text-sm text-green-500 ml-2">(Negotiable)</span>
                )}
              </div>

              {/* Quick Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="text-orange-500 mr-3" />
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="text-orange-500 mr-3" />
                  <span>Posted {formatDate(property.created_at)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaEye className="text-orange-500 mr-3" />
                  <span>{property.views || 0} views</span>
                </div>
              </div>

              {/* Contact Section */}
              {!showContact ? (
                <button
                  onClick={() => setShowContact(true)}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg mb-3"
                >
                  Show Contact Number
                </button>
              ) : (
                <div className="space-y-3 mb-3">
                  <div className="flex items-center justify-between bg-orange-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <FaPhone className="text-orange-500" />
                      <span className="font-semibold text-gray-900">{property.contact_number}</span>
                    </div>
                    <button className="text-orange-500 hover:text-orange-600">
                      <FaPrint size={18} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`https://wa.me/${property.contact_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <FaWhatsapp />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`mailto:?subject=Inquiry about ${property.title}&body=I'm interested in your property: ${window.location.href}`}
                      className="flex items-center justify-center space-x-2 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      <FaEnvelope />
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Report Ad */}
              <button className="w-full flex items-center justify-center space-x-2 py-3 text-gray-500 hover:text-orange-500 transition-colors">
                <FaFlag size={16} />
                <span>Report this ad</span>
              </button>
            </div>

            {/* Seller Info Card */}
            {property.seller && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
                  Seller Information
                </h3>
                
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600">
                    {property.seller.avatar_url ? (
                      <Image
                        src={property.seller.avatar_url}
                        alt={property.seller.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                        {property.seller.name?.[0] || 'U'}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{property.seller.name}</h4>
                      {property.seller.verified && (
                        <MdVerified className="text-blue-500" title="Verified Seller" />
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500">Member since {new Date(property.created_at).getFullYear()}</p>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/seller/${property.user_id}`)}
                  className="block w-full text-center py-3 border-2 border-orange-500 text-orange-500 rounded-xl hover:bg-orange-50 transition-colors font-medium"
                >
                  View All Listings
                </button>
              </div>
            )}

            {/* Safety Tips */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Safety Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Meet in a safe, public place</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Don't pay before seeing the property</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Verify documents before signing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Take someone with you when visiting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Properties Section - You can implement this with another API call */}
        {/* <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
            Similar Properties You Might Like
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProperties.map((ad, index) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/ads/${ad.id}`}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-orange-100">
                    <div className="relative h-40">
                      <Image
                        src={ad.images?.[0]?.image_url || "/images/placeholder.jpg"}
                        alt={ad.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{ad.title}</h3>
                      <p className="text-orange-600 font-bold mb-1">{formatPrice(ad.price)}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-orange-400" size={12} />
                        {ad.location}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section> */}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Share this property</h3>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <button onClick={handleShare} className="flex flex-col items-center space-y-2 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                <FaFacebookF className="text-blue-600 text-xl" />
                <span className="text-xs">Facebook</span>
              </button>
              <button onClick={handleShare} className="flex flex-col items-center space-y-2 p-3 bg-sky-50 rounded-xl hover:bg-sky-100 transition-colors">
                <FaTwitter className="text-sky-500 text-xl" />
                <span className="text-xs">Twitter</span>
              </button>
              <button onClick={handleShare} className="flex flex-col items-center space-y-2 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                <FaWhatsapp className="text-green-500 text-xl" />
                <span className="text-xs">WhatsApp</span>
              </button>
              <button onClick={copyToClipboard} className="flex flex-col items-center space-y-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <FaLink className="text-gray-600 text-xl" />
                <span className="text-xs">Copy Link</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl mb-4">
              <input
                type="text"
                value={typeof window !== 'undefined' ? window.location.href : ''}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-600 focus:outline-none"
              />
              <button onClick={copyToClipboard} className="text-orange-500 hover:text-orange-600 font-medium text-sm">
                Copy
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}