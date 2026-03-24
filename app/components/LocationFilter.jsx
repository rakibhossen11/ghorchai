'use client'

import { useRef } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const locations = [
  'All',
  'Dhaka',
  'Gazipur',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh'
]

export default function LocationFilter({ selectedLocation, onLocationChange }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef
      const scrollAmount = 200
      if (direction === 'left') {
        current.scrollLeft -= scrollAmount
      } else {
        current.scrollLeft += scrollAmount
      }
    }
  }

  return (
    <div className="mb-8 relative group">
      <div className="flex items-center">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1/2 hover:scale-110"
        >
          <FaChevronLeft className="text-gray-600 dark:text-gray-300" />
        </button>

        {/* Scrollable Buttons */}
        <div
          ref={scrollRef}
          className="flex space-x-3 overflow-x-auto scrollbar-hide py-4 px-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => onLocationChange(location)}
              className={`px-6 py-3 rounded-full whitespace-nowrap transition-all transform hover:scale-105 ${
                selectedLocation === location
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md hover:shadow-lg'
              }`}
            >
              {location}
            </button>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1/2 hover:scale-110"
        >
          <FaChevronRight className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}