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
  FaLink
} from "react-icons/fa";
import { MdVerified, MdOutlineApartment, MdOutlineWaterDrop, MdOutlineLocalGasStation } from "react-icons/md";
// import { GiModernCity, GiParking, GiElevator, GiAirConditioner, GiWaterDrop, GiGasPump } from "react-icons/gi";
// import { BiWater, BiGas } from "react-icons/bi";
import { BsLightningCharge } from "react-icons/bs";

// Mock data (same as before)
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
    description: "Beautiful apartment with modern amenities in the heart of Dhanmondi. Features include gym, pool, and 24/7 security. This spacious apartment offers a perfect blend of comfort and luxury with high-end finishes throughout.",
    contactNumber: "01712345678",
    views: 234,
    postedDate: "2 days ago",
    seller: {
      name: "Rahman Properties",
      avatar: "",
      verified: true,
      rating: 4.8,
      memberSince: "2020",
      listings: 45
    },
    amenities: ["Parking", "Elevator", "AC", "Gas", "Water", "Electricity"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500"
    ]
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
      rating: 4.9,
      memberSince: "2019",
      listings: 32
    },
    amenities: ["Parking", "Garden", "Security", "AC", "Water", "Electricity"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500"
    ]
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
      rating: 4.5,
      memberSince: "2021",
      listings: 18
    },
    amenities: ["Parking", "Elevator", "Security", "AC", "Generator"],
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500"
    ]
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
      rating: 4.2,
      memberSince: "2022",
      listings: 12
    },
    amenities: ["Parking", "Water", "Electricity", "Gas"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500"
    ]
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
      rating: 5.0,
      memberSince: "2018",
      listings: 56
    },
    amenities: ["Parking", "Elevator", "AC", "Garden", "Security", "Pool", "Gym"],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=500"
    ]
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
      rating: 4.0,
      memberSince: "2023",
      listings: 8
    },
    amenities: ["AC", "Water", "Electricity", "Furnished"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500"
    ]
  }
];

// Amenity icons mapping
const amenityIcons = {
//   "Parking": <GiParking className="text-orange-500" />,
//   "Elevator": <GiElevator className="text-orange-500" />,
//   "AC": <GiAirConditioner className="text-orange-500" />,
//   "Gas": <BiGas className="text-orange-500" />,
//   "Water": <BiWater className="text-orange-500" />,
//   "Electricity": <BsLightningCharge className="text-orange-500" />,
//   "Gym": <GiModernCity className="text-orange-500" />,
//   "Pool": <GiWaterDrop className="text-orange-500" />,
//   "Garden": <GiModernCity className="text-orange-500" />,
//   "Security": <GiModernCity className="text-orange-500" />,
//   "Generator": <BsLightningCharge className="text-orange-500" />,
//   "Furnished": <MdOutlineApartment className="text-orange-500" />
};

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    // Fetch property data
    const fetchProperty = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const found = mockAds.find(ad => ad.id === parseInt(params.id));
        setProperty(found || mockAds[0]);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/30 py-24">
        <div className="container-custom">
          {/* Loading Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-orange-200 rounded w-1/4 mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-orange-100 h-96 rounded-2xl mb-4"></div>
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-orange-100 h-24 rounded-xl"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl space-y-4">
                  <div className="h-8 bg-orange-200 rounded w-3/4"></div>
                  <div className="h-6 bg-orange-200 rounded w-1/2"></div>
                  <div className="h-12 bg-orange-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/30 py-24">
        <div className="container-custom text-center">
          <div className="mb-6">
            <MdOutlineApartment className="text-6xl text-orange-300 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
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
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden group">
                <Image
                  src={property.images?.[selectedImage] || property.image}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                  <FaCamera size={14} />
                  <span>{selectedImage + 1} / {property.images?.length || 1}</span>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
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
              {property.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {property.images.map((img, index) => (
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
                        src={img}
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
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
                  <FaBed className="text-2xl text-orange-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{property.beds} Beds</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
                  <FaBath className="text-2xl text-orange-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{property.baths} Baths</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
                  <FaRulerCombined className="text-2xl text-orange-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{property.area}</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
                  <MdOutlineApartment className="text-2xl text-orange-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{property.type}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              {property.amenities && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                        {amenityIcons[amenity] || <FaCheckCircle className="text-orange-500" />}
                        <span className="text-sm text-gray-700">{amenity}</span>
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
                  {property.price}
                </span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>

              {/* Quick Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="text-orange-500 mr-3" />
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="text-orange-500 mr-3" />
                  <span>Posted {property.postedDate}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaEye className="text-orange-500 mr-3" />
                  <span>{property.views} views</span>
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
                      <span className="font-semibold text-gray-900">{property.contactNumber}</span>
                    </div>
                    <button className="text-orange-500 hover:text-orange-600">
                      <FaPrint size={18} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`https://wa.me/${property.contactNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <FaWhatsapp />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`mailto:?subject=Inquiry about ${property.title}`}
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
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
                Seller Information
              </h3>
              
              <div className="flex items-start space-x-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600">
                  {property.seller.avatar ? (
                    <Image
                      src={property.seller.avatar}
                      alt={property.seller.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                      {property.seller.name[0]}
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
                  
                  <div className="flex items-center gap-1 mb-2">
                    <FaStar className="text-yellow-400" />
                    <span className="text-sm font-medium">{property.seller.rating}</span>
                    <span className="text-sm text-gray-500">({property.seller.listings} listings)</span>
                  </div>
                  
                  <p className="text-xs text-gray-500">Member since {property.seller.memberSince}</p>
                </div>
              </div>

              <Link
                href={`/seller/${property.seller.name}`}
                className="block text-center py-3 border-2 border-orange-500 text-orange-500 rounded-xl hover:bg-orange-50 transition-colors font-medium"
              >
                View All Listings
              </Link>
            </div>

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

        {/* Similar Properties Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
            Similar Properties You Might Like
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockAds.slice(0, 4).map((ad, index) => (
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
                        src={ad.image}
                        alt={ad.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{ad.title}</h3>
                      <p className="text-orange-600 font-bold mb-1">{ad.price}</p>
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
        </section>
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
              <button className="flex flex-col items-center space-y-2 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                <FaFacebookF className="text-blue-600 text-xl" />
                <span className="text-xs">Facebook</span>
              </button>
              <button className="flex flex-col items-center space-y-2 p-3 bg-sky-50 rounded-xl hover:bg-sky-100 transition-colors">
                <FaTwitter className="text-sky-500 text-xl" />
                <span className="text-xs">Twitter</span>
              </button>
              <button className="flex flex-col items-center space-y-2 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                <FaWhatsapp className="text-green-500 text-xl" />
                <span className="text-xs">WhatsApp</span>
              </button>
              <button className="flex flex-col items-center space-y-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
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
              <button className="text-orange-500 hover:text-orange-600 font-medium text-sm">
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