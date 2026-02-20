'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { API_URL } from '../lib/api';

export default function CustomerTailorsPage() {
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTailors();
  }, []);

  const fetchTailors = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers/my-tailors`);
      setTailors(response.data.tailors || []);
    } catch (error) {
      console.error('Error fetching tailors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading tailors...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Tailors</h1>
        <p className="text-gray-600 mt-2">Tailors assigned to your orders</p>
      </div>

      {tailors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-600">No tailors assigned yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tailors.map((tailor) => (
            <div key={tailor._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">{tailor.businessName}</h3>
                <p className="text-sm text-gray-600">{tailor.ownerName}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={16} className="text-gray-400" />
                  <span>{tailor.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  <span>{tailor.email}</span>
                </div>
                {tailor.address?.city && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{tailor.address.city}</span>
                  </div>
                )}
              </div>

              <a
                href={`/messages?tailor=${tailor._id}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <MessageSquare size={16} /> Message
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
