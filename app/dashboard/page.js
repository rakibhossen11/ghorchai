'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { useAdStore } from '@/store/adStore';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { deleteAd } = useAdStore();
  const [userAds, setUserAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const fetchUserAds = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/ads`, {
          withCredentials: true
        });
        setUserAds(response.data);
      } catch (error) {
        console.error('Error fetching user ads:', error);
        toast.error('Failed to load your ads');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAds();
  }, [user, router]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        await deleteAd(id);
        setUserAds(userAds.filter(ad => ad._id !== id));
        toast.success('Ad deleted successfully');
      } catch (error) {
        toast.error('Failed to delete ad');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your property listings
          </p>
        </div>

        {/* My Ads */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Property Listings</h2>
            <Link
              href="/post-ad"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Post New Ad
            </Link>
          </div>

          {userAds.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't posted any ads yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Posted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {userAds.map((ad) => (
                    <tr key={ad._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded object-cover"
                              src={ad.images?.[0] || 'https://via.placeholder.com/40'}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {ad.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {ad.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        ৳ {ad.price?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {ad.views || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(ad.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            href={`/ad/${ad._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            href={`/edit-ad/${ad._id}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(ad._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}