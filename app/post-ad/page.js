// app/post-ad/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useAdStore } from "../store/adStore";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { 
  FaUpload, 
  FaTimes, 
  FaArrowLeft,
  FaHome,
  FaMapMarkerAlt,
  FaPhone,
  FaTag,
  FaImage,
  FaInfoCircle,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaParking,
  FaSwimmingPool,
  FaWifi,
  FaShieldAlt,
  FaSave,
  FaEye,
  FaTrash,
  FaCheckCircle
} from "react-icons/fa";
import { MdOutlineApartment, MdOutlineHouse, MdOutlineLandslide } from "react-icons/md";
import LocationSelector from "../components/LocationSelector";

// Amenities list
const amenitiesList = [
  { id: "parking", label: "Parking", icon: FaParking },
  { id: "elevator", label: "Elevator", icon: FaHome },
  { id: "ac", label: "Air Conditioning", icon: FaHome },
  { id: "gas", label: "Gas Connection", icon: FaHome },
  { id: "water", label: "Water Supply", icon: FaHome },
  { id: "electricity", label: "Electricity", icon: FaHome },
  { id: "wifi", label: "WiFi", icon: FaWifi },
  { id: "pool", label: "Swimming Pool", icon: FaSwimmingPool },
  { id: "security", label: "24/7 Security", icon: FaShieldAlt },
  { id: "parking2", label: "Covered Parking", icon: FaParking },
];

// Property types
const propertyTypes = [
  { id: "apartment", label: "Apartment", icon: MdOutlineApartment },
  { id: "house", label: "House", icon: MdOutlineHouse },
  { id: "land", label: "Land", icon: MdOutlineLandslide },
  { id: "commercial", label: "Commercial", icon: FaHome },
  { id: "villa", label: "Villa", icon: FaHome },
  { id: "studio", label: "Studio", icon: MdOutlineApartment },
];

export default function PostAdPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { createAd, loading } = useAdStore();
  const [images, setImages] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [locationData, setLocationData] = useState({
    divisionId: '',
    districtId: '',
    upazilaId: '',
    fullAddress: '',
    division: null,
    district: null,
    upazila: null,
    locationName: ''
  });
  const [locationSelected, setLocationSelected] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, setValue, getValues } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      price: '',
      propertyType: '',
      beds: '',
      baths: '',
      area: '',
      contactNumber: '',
      negotiable: false,
      featured: false,
    }
  });

  const formValues = watch();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error('Please login to post an ad', {
        icon: '🔒',
      });
      router.push('/login?redirect=post-ad');
    }
  }, [user, router]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 6) {
      toast.error('Maximum 6 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Each image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          file,
          preview: e.target.result,
          id: Math.random().toString(36).substr(2, 9)
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // Toggle amenity
  const toggleAmenity = (amenityId) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  // Handle location selection
  const handleLocationSelect = (data) => {
    setLocationData(data);
    setLocationSelected(true);
    console.log('Location selected:', data);
  };

  // Submit form
  const onSubmit = async (data) => {
    // Validate location
    if (!locationSelected || !locationData.divisionId || !locationData.districtId || !locationData.upazilaId) {
      toast.error('Please select complete location details (Division, District, Upazila)');
      return;
    }

    if (!locationData.fullAddress) {
      toast.error('Please enter full address');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      const adData = {
        ...data,
        divisionId: locationData.divisionId,
        districtId: locationData.districtId,
        upazilaId: locationData.upazilaId,
        fullAddress: locationData.fullAddress,
        location: locationData.locationName, // For backward compatibility
        amenities: selectedAmenities,
        images: images.map(img => img.file),
        price: parseFloat(data.price),
        beds: parseInt(data.beds) || 0,
        baths: parseInt(data.baths) || 0,
        area: data.area,
        negotiable: data.negotiable || false,
        featured: false, // Will be set by admin
      };
      
      console.log('Submitting ad data:', adData);
      await createAd(adData);
      
      toast.success('Ad posted successfully! Your property is now live.', {
        icon: '🎉',
        duration: 5000,
      });
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to post ad. Please try again.');
    }
  };

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/30 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 mb-6 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Post Your Property Ad
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Reach thousands of potential buyers and tenants. Fill in the details below to list your property.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-orange-100 dark:border-gray-700">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Basic Information Section */}
            <div className="space-y-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                Basic Information
              </h2>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {propertyTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setValue('propertyType', type.id)}
                        className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                          formValues.propertyType === type.id
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-orange-200'
                        }`}
                      >
                        <Icon className={`text-2xl mb-2 ${
                          formValues.propertyType === type.id
                            ? 'text-orange-500'
                            : 'text-gray-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          formValues.propertyType === type.id
                            ? 'text-orange-500'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <input type="hidden" {...register('propertyType', { required: 'Please select a property type' })} />
                {errors.propertyType && (
                  <p className="text-red-500 text-sm mt-2">{errors.propertyType.message}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ad Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('title', { 
                    required: 'Title is required',
                    minLength: { value: 10, message: 'Title must be at least 10 characters' },
                    maxLength: { value: 100, message: 'Title must be less than 100 characters' }
                  })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 3 Bedroom Luxury Apartment in Dhanmondi"
                />
                <div className="flex justify-between mt-1">
                  {errors.title ? (
                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                  ) : (
                    <p className="text-gray-400 text-sm">Minimum 10 characters</p>
                  )}
                  <p className="text-gray-400 text-sm">{formValues.title?.length || 0}/100</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('description', { 
                    required: 'Description is required',
                    minLength: { value: 50, message: 'Description must be at least 50 characters' },
                    maxLength: { value: 2000, message: 'Description must be less than 2000 characters' }
                  })}
                  rows="6"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Describe your property in detail... (size, condition, nearby amenities, etc.)"
                />
                <div className="flex justify-between mt-1">
                  {errors.description ? (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                  ) : (
                    <p className="text-gray-400 text-sm">Minimum 50 characters</p>
                  )}
                  <p className="text-gray-400 text-sm">{formValues.description?.length || 0}/2000</p>
                </div>
              </div>
            </div>

            {/* Location Section with LocationSelector */}
            <div className="space-y-6 mb-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                Property Location
              </h2>

              <LocationSelector 
                onLocationChange={handleLocationSelect}
                initialValues={locationData}
                showFullAddress={true}
              />

              {/* Location Status Indicator */}
              {locationSelected && locationData.division && locationData.district && locationData.upazila && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <FaCheckCircle className="text-green-500" />
                    <span className="font-medium">Location Selected:</span>
                    <span>{locationData.upazila?.name}, {locationData.district?.name}, {locationData.division?.name}</span>
                  </div>
                  {locationData.fullAddress && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Full Address:</span> {locationData.fullAddress}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Property Details Section */}
            <div className="space-y-6 mb-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                Property Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (৳) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      {...register('price', { 
                        required: 'Price is required',
                        min: { value: 1000, message: 'Price must be at least ৳1,000' }
                      })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="50000"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>

                {/* Beds */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bedrooms
                  </label>
                  <div className="relative">
                    <FaBed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      {...register('beds')}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="3"
                    />
                  </div>
                </div>

                {/* Baths */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bathrooms
                  </label>
                  <div className="relative">
                    <FaBath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      {...register('baths')}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="2"
                    />
                  </div>
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Area (sqft)
                  </label>
                  <div className="relative">
                    <FaRulerCombined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      {...register('area')}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="1500"
                    />
                  </div>
                </div>

                {/* Negotiable */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('negotiable')}
                    className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Price is negotiable
                  </label>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {amenitiesList.map((amenity) => {
                    const Icon = amenity.icon;
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`flex items-center space-x-2 p-3 rounded-xl border-2 transition-all ${
                          selectedAmenities.includes(amenity.id)
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-orange-200'
                        }`}
                      >
                        <Icon className={`${
                          selectedAmenities.includes(amenity.id)
                            ? 'text-orange-500'
                            : 'text-gray-400'
                        }`} />
                        <span className={`text-sm ${
                          selectedAmenities.includes(amenity.id)
                            ? 'text-orange-500 font-medium'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {amenity.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Images & Contact Section */}
            <div className="space-y-6 mb-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                Images & Contact
              </h2>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Property Images <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Upload Button */}
                  <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 cursor-pointer hover:border-orange-500 transition-colors text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Upload Image</p>
                    <p className="text-xs text-gray-400 mt-1">Max 5MB each</p>
                  </label>

                  {/* Image Previews */}
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="relative h-32 rounded-xl overflow-hidden">
                        <Image
                          src={image.preview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {images.length}/6 images uploaded
                </p>
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    {...register('contactNumber', { 
                      required: 'Contact number is required',
                      pattern: {
                        value: /^01[3-9]\d{8}$/,
                        message: 'Please enter a valid Bangladeshi number'
                      }
                    })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="01712345678"
                  />
                </div>
                {errors.contactNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</p>
                )}
              </div>

              {/* Featured Option */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('featured')}
                    className="mt-1 w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <div>
                    <label className="font-medium text-gray-900 dark:text-white">
                      Feature this property
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Get more visibility with featured placement (additional charges apply)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl mb-6">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    I confirm that all information provided is accurate and I agree to the{' '}
                    <Link href="/terms" className="text-orange-500 hover:text-orange-600 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-orange-500 hover:text-orange-600 font-medium">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Post Ad</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Card */}
        <div className="mt-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <FaInfoCircle className="text-orange-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Tips for a successful ad:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Use clear, high-quality images</li>
                <li>• Provide accurate and detailed information</li>
                <li>• Set a competitive price</li>
                <li>• Respond promptly to inquiries</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}