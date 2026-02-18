'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, Edit2, Ruler, User, Calendar } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CustomerMeasurementsPage() {
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      const response = await axios.get(`${API_URL}/measurements/customer/my-measurements`);
      setMeasurements(response.data.measurements || []);
    } catch (error) {
      console.error('Error fetching measurements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading measurements...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">My Measurements</h1>
          <p className="text-gray-600 mt-2">Your saved body measurements</p>
        </div>
      </div>

      {measurements.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ruler size={40} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No measurements yet</h3>
          <p className="text-gray-600">Your tailor will add your measurements when you place an order.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {measurements.map((measurement) => {
            const measurementData = measurement.measurements || {};
            const entries = Object.entries(measurementData).slice(0, 4);
            
            return (
              <div key={measurement._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-brand-navy to-brand-orange p-4">
                  <div className="flex items-center gap-2 text-white">
                    <Ruler size={20} />
                    <h3 className="font-bold text-lg">
                      {measurement.attireName || measurement.attireTypeId?.name || 'Measurement'}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Tailor Info */}
                  {measurement.tailorId && (
                    <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                      <div className="w-8 h-8 bg-brand-orange bg-opacity-10 rounded-full flex items-center justify-center">
                        <User size={16} className="text-brand-orange" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600">Tailor</p>
                        <p className="text-sm font-semibold text-gray-900">{measurement.tailorId.businessName}</p>
                      </div>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Calendar size={16} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Created</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(measurement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Measurements Preview */}
                  <div>
                    <p className="text-xs text-gray-600 mb-2 font-semibold">Measurements</p>
                    <div className="grid grid-cols-2 gap-3">
                      {entries.length > 0 ? (
                        entries.map(([key, val]) => (
                          <div key={key} className="bg-gray-50 p-2 rounded-lg">
                            <p className="text-xs text-gray-600 capitalize">{key.replace(/_/g, ' ')}</p>
                            <p className="text-sm font-bold text-brand-navy">
                              {val?.value || val} {val?.unit || 'inch'}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 col-span-2 text-sm">No measurements recorded</p>
                      )}
                    </div>
                    {entries.length > 0 && Object.keys(measurementData).length > 4 && (
                      <p className="text-xs text-gray-500 mt-2">+{Object.keys(measurementData).length - 4} more</p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedMeasurement(measurement);
                      setShowModal(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-dark transition-colors font-semibold"
                  >
                    <Eye size={16} /> View All Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Measurement Modal */}
      {showModal && selectedMeasurement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedMeasurement.attireName || selectedMeasurement.attireTypeId?.name || 'Measurement Details'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              {selectedMeasurement.tailorId && (
                <p className="text-sm text-gray-600 mt-2">
                  By: <span className="font-semibold">{selectedMeasurement.tailorId.businessName}</span>
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Created: {new Date(selectedMeasurement.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Measurements */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Measurements</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedMeasurement.measurements || {}).map(([key, val]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 capitalize">{key.replace(/_/g, ' ')}</p>
                      <p className="text-lg font-bold text-gray-900">
                        {val?.value || val} {val?.unit || 'inch'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedMeasurement.notes && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedMeasurement.notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
