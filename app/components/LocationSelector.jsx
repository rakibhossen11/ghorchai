// app/components/LocationSelector.jsx
"use client";

import { useState, useEffect } from "react";
import { useLocationStore } from "../store/locationStore";
import { FaMapMarkerAlt, FaCity, FaLocationArrow, FaSpinner, FaCheckCircle } from "react-icons/fa";

export default function LocationSelector({ onLocationChange, initialValues = {}, showFullAddress = true }) {
    const {
        divisions,
        districts,
        upazilas,
        loading,
        getDivisions,
        getDistricts,
        getUpazilas,
        resetDistricts,
        resetUpazilas
    } = useLocationStore();

    const [selectedDivision, setSelectedDivision] = useState(initialValues.divisionId || '');
    const [selectedDistrict, setSelectedDistrict] = useState(initialValues.districtId || '');
    const [selectedUpazila, setSelectedUpazila] = useState(initialValues.upazilaId || '');
    const [fullAddress, setFullAddress] = useState(initialValues.fullAddress || '');
    const [isComplete, setIsComplete] = useState(false);

    // Load divisions on component mount
    useEffect(() => {
        loadDivisions();
    }, []);

    const loadDivisions = async () => {
        try {
            await getDivisions();
        } catch (error) {
            console.error('Error loading divisions:', error);
        }
    };

    // Handle division change
    const handleDivisionChange = async (divisionId) => {
        setSelectedDivision(divisionId);
        setSelectedDistrict('');
        setSelectedUpazila('');
        resetDistricts();
        resetUpazilas();
        
        if (divisionId) {
            try {
                await getDistricts(divisionId);
            } catch (error) {
                console.error('Error loading districts:', error);
            }
        }
    };

    // Handle district change
    const handleDistrictChange = async (districtId) => {
        setSelectedDistrict(districtId);
        setSelectedUpazila('');
        resetUpazilas();
        
        if (districtId) {
            try {
                await getUpazilas(districtId);
            } catch (error) {
                console.error('Error loading upazilas:', error);
            }
        }
    };

    // Handle upazila change
    const handleUpazilaChange = (upazilaId) => {
        setSelectedUpazila(upazilaId);
    };

    // Check if location selection is complete
    useEffect(() => {
        const hasLocation = selectedDivision && selectedDistrict && selectedUpazila;
        const hasAddress = !showFullAddress || (showFullAddress && fullAddress);
        
        if (hasLocation && hasAddress) {
            setIsComplete(true);
            // Notify parent with location data
            onLocationChange({
                division: divisions.find(d => d.id == selectedDivision),
                district: districts.find(d => d.id == selectedDistrict),
                upazila: upazilas.find(u => u.id == selectedUpazila),
                divisionId: parseInt(selectedDivision),
                districtId: parseInt(selectedDistrict),
                upazilaId: parseInt(selectedUpazila),
                fullAddress: showFullAddress ? fullAddress : `${selectedUpazila ? upazilas.find(u => u.id == selectedUpazila)?.name : ''}, ${selectedDistrict ? districts.find(d => d.id == selectedDistrict)?.name : ''}, ${selectedDivision ? divisions.find(d => d.id == selectedDivision)?.name : ''}`,
                locationName: `${selectedUpazila ? upazilas.find(u => u.id == selectedUpazila)?.name : ''}, ${selectedDistrict ? districts.find(d => d.id == selectedDistrict)?.name : ''}`
            });
        } else {
            setIsComplete(false);
        }
    }, [selectedDivision, selectedDistrict, selectedUpazila, fullAddress, divisions, districts, upazilas, showFullAddress]);

    // Get selected names
    const getSelectedDivisionName = () => {
        return divisions.find(d => d.id == selectedDivision)?.name || '';
    };

    const getSelectedDistrictName = () => {
        return districts.find(d => d.id == selectedDistrict)?.name || '';
    };

    const getSelectedUpazilaName = () => {
        return upazilas.find(u => u.id == selectedUpazila)?.name || '';
    };

    return (
        <div className="space-y-4">
            {/* Division Selector */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-orange-500" />
                    Division <span className="text-red-500">*</span>
                </label>
                <select
                    value={selectedDivision}
                    onChange={(e) => handleDivisionChange(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    disabled={loading.divisions}
                >
                    <option value="">Select Division</option>
                    {divisions.map(div => (
                        <option key={div.id} value={div.id}>
                            {div.name} {div.bn_name ? `(${div.bn_name})` : ''}
                        </option>
                    ))}
                </select>
                {loading.divisions && (
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <FaSpinner className="animate-spin" />
                        Loading divisions...
                    </div>
                )}
            </div>

            {/* District Selector */}
            {selectedDivision && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FaCity className="inline mr-2 text-orange-500" />
                        District <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={selectedDistrict}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        disabled={loading.districts}
                    >
                        <option value="">Select District</option>
                        {districts.map(dist => (
                            <option key={dist.id} value={dist.id}>
                                {dist.name} {dist.bn_name ? `(${dist.bn_name})` : ''}
                            </option>
                        ))}
                    </select>
                    {loading.districts && (
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <FaSpinner className="animate-spin" />
                            Loading districts...
                        </div>
                    )}
                </div>
            )}

            {/* Upazila Selector */}
            {selectedDistrict && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FaLocationArrow className="inline mr-2 text-orange-500" />
                        Upazila/Thana <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={selectedUpazila}
                        onChange={(e) => handleUpazilaChange(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        disabled={loading.upazilas}
                    >
                        <option value="">Select Upazila/Thana</option>
                        {upazilas.map(up => (
                            <option key={up.id} value={up.id}>
                                {up.name} {up.bn_name ? `(${up.bn_name})` : ''}
                            </option>
                        ))}
                    </select>
                    {loading.upazilas && (
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <FaSpinner className="animate-spin" />
                            Loading upazilas...
                        </div>
                    )}
                </div>
            )}

            {/* Full Address - Optional based on prop */}
            {showFullAddress && selectedDivision && selectedDistrict && selectedUpazila && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                        rows="3"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="House #, Road #, Area, Landmark..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Example: House #12, Road #5, Dhanmondi, Dhaka
                    </p>
                </div>
            )}

            {/* Selection Complete Indicator */}
            {selectedDivision && selectedDistrict && selectedUpazila && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <FaCheckCircle className="text-green-500" />
                        <span>Selected Location: {getSelectedUpazilaName()}, {getSelectedDistrictName()}, {getSelectedDivisionName()}</span>
                    </div>
                </div>
            )}
        </div>
    );
}