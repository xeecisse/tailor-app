'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { measurementAPI, clientAPI, attireAPI } from '../lib/api';

export default function ClientMeasurementsPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [attires, setAttires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filteredAttires, setFilteredAttires] = useState([]);
  const [formData, setFormData] = useState({
    clientId: clientId,
    attireTypeId: '',
    measurements: {},
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch client and measurements first
      const [clientRes, measurementsRes] = await Promise.all([
        clientAPI.getById(clientId),
        measurementAPI.getByClient(clientId),
      ]);

      setClient(clientRes.data.client);
      setMeasurements(measurementsRes.data.measurements);

      // Try to fetch attires, but don't fail if it doesn't work
      try {
        const attiresRes = await attireAPI.getAll();
        const allAttires = attiresRes.data.attires || [];
        setAttires(allAttires);

        // Filter attires based on client gender
        let filtered = [];
        const clientGender = clientRes.data.client.gender;
        
        if (allAttires.length > 0) {
          if (clientGender === 'female') {
            filtered = allAttires.filter(
              (a) => a.genders?.includes('female') || a.genders?.includes('unisex')
            );
            
            // If no female-specific attires found, show all attires
            if (filtered.length === 0) {
              filtered = allAttires;
            }
          } else if (clientGender === 'male') {
            filtered = allAttires.filter(
              (a) => a.genders?.includes('male') || a.genders?.includes('unisex')
            );
            
            // If no male-specific attires found, show all attires
            if (filtered.length === 0) {
              filtered = allAttires;
            }
          } else {
            // For 'other' gender, show all attires
            filtered = allAttires;
          }
        } else {
          // If no attires in database, create default ones based on gender
          const defaultAttires = clientGender === 'female' ? [
            { _id: 'default-1', name: 'Iro & Buba', category: 'Traditional', genders: ['female'] },
            { _id: 'default-2', name: 'Boubou', category: 'Traditional', genders: ['female'] },
            { _id: 'default-3', name: 'Ankara Gown', category: 'Casual', genders: ['female'] },
            { _id: 'default-4', name: 'Wrapper & Blouse', category: 'Traditional', genders: ['female'] },
            { _id: 'default-5', name: 'Lace Skirt & Blouse', category: 'Formal', genders: ['female'] },
            { _id: 'default-6', name: 'Female Kaftan', category: 'Traditional', genders: ['female'] },
            { _id: 'default-7', name: 'Abaya', category: 'Traditional', genders: ['female'] },
            { _id: 'default-8', name: 'Jumpsuit', category: 'Casual', genders: ['female'] },
            { _id: 'default-9', name: 'Skirt', category: 'Casual', genders: ['female'] },
            { _id: 'default-10', name: 'Female Senator', category: 'Formal', genders: ['female'] },
          ] : clientGender === 'male' ? [
            { _id: 'default-1', name: 'Kaftan', category: 'Traditional', genders: ['male'] },
            { _id: 'default-2', name: 'Babban Riga', category: 'Traditional', genders: ['male'] },
            { _id: 'default-3', name: 'Jalabiya', category: 'Traditional', genders: ['male'] },
            { _id: 'default-4', name: 'Agbada', category: 'Traditional', genders: ['male'] },
            { _id: 'default-5', name: 'Senator', category: 'Formal', genders: ['male'] },
            { _id: 'default-6', name: 'Trouser (Wando)', category: 'Casual', genders: ['male'] },
            { _id: 'default-7', name: 'Suit', category: 'Formal', genders: ['male'] },
            { _id: 'default-8', name: 'Shirt', category: 'Casual', genders: ['male'] },
            { _id: 'default-9', name: 'Cap (Hula)', category: 'Accessory', genders: ['male'] },
          ] : [];
          
          filtered = defaultAttires;
        }

        setFilteredAttires(filtered);
      } catch (attireErr) {
        console.error('Failed to fetch attires:', attireErr);
        // Set default attires if API fails
        const clientGender = clientRes.data.client.gender;
        const defaultAttires = clientGender === 'female' ? [
          { _id: 'default-1', name: 'Iro & Buba', category: 'Traditional', genders: ['female'] },
          { _id: 'default-2', name: 'Boubou', category: 'Traditional', genders: ['female'] },
          { _id: 'default-3', name: 'Ankara Gown', category: 'Casual', genders: ['female'] },
          { _id: 'default-4', name: 'Wrapper & Blouse', category: 'Traditional', genders: ['female'] },
          { _id: 'default-5', name: 'Lace Skirt & Blouse', category: 'Formal', genders: ['female'] },
          { _id: 'default-6', name: 'Female Kaftan', category: 'Traditional', genders: ['female'] },
          { _id: 'default-7', name: 'Abaya', category: 'Traditional', genders: ['female'] },
          { _id: 'default-8', name: 'Jumpsuit', category: 'Casual', genders: ['female'] },
          { _id: 'default-9', name: 'Skirt', category: 'Casual', genders: ['female'] },
          { _id: 'default-10', name: 'Female Senator', category: 'Formal', genders: ['female'] },
        ] : clientGender === 'male' ? [
          { _id: 'default-1', name: 'Kaftan', category: 'Traditional', genders: ['male'] },
          { _id: 'default-2', name: 'Babban Riga', category: 'Traditional', genders: ['male'] },
          { _id: 'default-3', name: 'Jalabiya', category: 'Traditional', genders: ['male'] },
          { _id: 'default-4', name: 'Agbada', category: 'Traditional', genders: ['male'] },
          { _id: 'default-5', name: 'Senator', category: 'Formal', genders: ['male'] },
          { _id: 'default-6', name: 'Trouser (Wando)', category: 'Casual', genders: ['male'] },
          { _id: 'default-7', name: 'Suit', category: 'Formal', genders: ['male'] },
          { _id: 'default-8', name: 'Shirt', category: 'Casual', genders: ['male'] },
          { _id: 'default-9', name: 'Cap (Hula)', category: 'Accessory', genders: ['male'] },
        ] : [];
        
        setFilteredAttires(defaultAttires);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAttireSelect = (attireId) => {
    const attire = filteredAttires.find((a) => a._id === attireId);
    if (attire) {
      // If it's a default attire (no measurementFields), create basic measurement fields
      let measurementsObj = {};
      
      if (attire.measurementFields && attire.measurementFields.length > 0) {
        // Use existing measurement fields from database
        attire.measurementFields.forEach((field) => {
          measurementsObj[field.fieldName] = { value: 0, unit: field.unit, note: '' };
        });
      } else {
        // Create default measurement fields based on attire type
        const defaultFields = [
          { fieldName: 'length', unit: 'inch' },
          { fieldName: 'chest', unit: 'inch' },
          { fieldName: 'waist', unit: 'inch' },
          { fieldName: 'shoulder', unit: 'inch' },
          { fieldName: 'sleeve', unit: 'inch' },
          { fieldName: 'neck', unit: 'inch' },
        ];
        
        defaultFields.forEach((field) => {
          measurementsObj[field.fieldName] = { value: 0, unit: field.unit, note: '' };
        });
      }

      setFormData({
        ...formData,
        attireTypeId: attireId,
        measurements: measurementsObj,
      });
    }
  };

  const handleMeasurementChange = (fieldName, value) => {
    setFormData({
      ...formData,
      measurements: {
        ...formData.measurements,
        [fieldName]: {
          ...formData.measurements[fieldName],
          value: parseFloat(value) || 0,
        },
      },
    });
  };

  const handleSaveMeasurement = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.attireTypeId) {
      setError('Please select attire type');
      return;
    }

    try {
      // Check if using a default attire (not in database)
      if (formData.attireTypeId.startsWith('default-')) {
        // Find the default attire
        const defaultAttire = filteredAttires.find(a => a._id === formData.attireTypeId);
        
        if (defaultAttire) {
          // Create the attire type in the database first
          try {
            const attireData = {
              name: defaultAttire.name,
              category: defaultAttire.category.toLowerCase(), // Ensure lowercase
              genders: Array.isArray(defaultAttire.genders) ? defaultAttire.genders : [defaultAttire.genders], // Ensure it's an array
              measurementFields: Object.keys(formData.measurements).map((fieldName, index) => ({
                fieldName: fieldName,
                unit: formData.measurements[fieldName].unit === 'inches' ? 'inch' : 
                      (formData.measurements[fieldName].unit === 'cm' || formData.measurements[fieldName].unit === 'inch' ? formData.measurements[fieldName].unit : 'inch'),
                required: true,
                position: index
              })),
              estimatedProductionDays: 7,
              description: `${defaultAttire.name} - ${defaultAttire.category}`
            };
            
            console.log('Creating attire with data:', attireData); // Debug log
            
            const createdAttire = await attireAPI.create(attireData);
            
            // Update formData with the real attire ID
            const updatedFormData = {
              ...formData,
              attireTypeId: createdAttire.data.attire._id
            };
            
            // Now save the measurement with the real attire ID
            await measurementAPI.create(updatedFormData);
            setMessage('Attire type created and measurement saved successfully');
          } catch (attireError) {
            console.error('Failed to create attire:', attireError);
            console.error('Error response:', attireError.response?.data); // Debug log
            const errorMsg = attireError.response?.data?.message || 'Failed to create attire type. Please try again or contact administrator.';
            setError(errorMsg);
            return;
          }
        }
      } else {
        // Normal flow - attire already exists in database
        await measurementAPI.create(formData);
        setMessage('Measurement saved successfully');
      }
      
      setShowForm(false);
      setFormData({
        clientId: clientId,
        attireTypeId: '',
        measurements: {},
        notes: '',
      });
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save measurement');
    }
  };

  const handleToggleFavorite = async (measurementId) => {
    try {
      await measurementAPI.toggleFavorite(measurementId);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update favorite');
    }
  };

  const handleDeleteMeasurement = async (measurementId) => {
    if (window.confirm('Delete this measurement?')) {
      try {
        await measurementAPI.delete(measurementId);
        setMessage('Measurement deleted successfully');
        fetchData();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete measurement');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading measurements...</p>
        </div>
      </div>
    );
  }

  if (error && !client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={() => navigate('/measurements')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-all hover:gap-3"
          >
            <ArrowLeft size={20} /> Back to Measurements
          </button>
          <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl text-red-700 shadow-lg">
            <div className="flex items-center gap-4">
              <span className="text-4xl">⚠️</span>
              <span className="font-semibold text-lg">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const genderConfig = {
    male: {
      gradient: 'from-blue-500 via-cyan-500 to-sky-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      icon: '👨',
      borderColor: 'border-blue-200'
    },
    female: {
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      bgGradient: 'from-pink-50 to-rose-50',
      icon: '👩',
      borderColor: 'border-pink-200'
    },
    other: {
      gradient: 'from-purple-500 via-violet-500 to-indigo-500',
      bgGradient: 'from-purple-50 to-violet-50',
      icon: '👤',
      borderColor: 'border-purple-200'
    }
  };

  const config = genderConfig[client?.gender] || genderConfig.other;
  const totalMeasurements = measurements.length;
  const favoriteMeasurements = measurements.filter(m => m.isFavorite).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Enhanced Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/measurements')}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4 transition-all hover:gap-3"
          >
            <ArrowLeft size={20} /> Back to Measurements
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`bg-gradient-to-br ${config.gradient} p-4 rounded-2xl shadow-lg`}>
                <span className="text-5xl">{config.icon}</span>
              </div>
              <div>
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  {client?.name}'s Measurements
                </h1>
                <p className="text-gray-600 mt-1 text-lg font-medium capitalize">
                  {client?.gender} • {client?.phone}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform"
            >
              <span className="text-2xl">➕</span> Add Measurement
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { 
              label: 'Total Measurements', 
              value: totalMeasurements, 
              emoji: '📏',
              gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
              bgGradient: 'from-violet-50 to-purple-50',
              iconBg: 'bg-violet-100',
              textColor: 'text-violet-700',
            },
            { 
              label: 'Favorite Measurements', 
              value: favoriteMeasurements, 
              emoji: '⭐',
              gradient: 'from-yellow-500 via-amber-500 to-orange-500',
              bgGradient: 'from-yellow-50 to-amber-50',
              iconBg: 'bg-yellow-100',
              textColor: 'text-yellow-700',
            },
            { 
              label: 'Unique Attires', 
              value: [...new Set(measurements.map(m => m.attireName))].length, 
              emoji: '👔',
              gradient: 'from-blue-500 via-cyan-500 to-sky-500',
              bgGradient: 'from-blue-50 to-cyan-50',
              iconBg: 'bg-blue-100',
              textColor: 'text-blue-700',
            },
          ].map((stat, idx) => {
            return (
              <div 
                key={idx} 
                className={`bg-gradient-to-br ${stat.bgGradient} rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transform border border-white/50 backdrop-blur-sm`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.iconBg} p-3 rounded-2xl shadow-md`}>
                    <span className="text-3xl">{stat.emoji}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
                  <p className={`text-4xl font-extrabold ${stat.textColor} mb-1`}>{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl text-red-700 flex items-center gap-4 shadow-lg">
            <div className="bg-red-100 p-3 rounded-xl">
              <span className="text-2xl">⚠️</span>
            </div>
            <span className="font-semibold text-lg">{error}</span>
          </div>
        )}
        {message && (
          <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl text-green-700 flex items-center gap-4 shadow-lg">
            <div className="bg-green-100 p-3 rounded-xl">
              <span className="text-2xl">✅</span>
            </div>
            <span className="font-semibold text-lg">{message}</span>
          </div>
        )}

        {/* Add Measurement Form */}
        {showForm && (
          <div className="mb-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                <span className="text-3xl">✨</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create New Measurement
              </h2>
            </div>

            {/* Gender-specific attire info */}
            {filteredAttires.length > 0 && (
              <div className={`mb-6 p-5 rounded-2xl border-2 ${
                client?.gender === 'female' 
                  ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-300' 
                  : client?.gender === 'male'
                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300'
                    : 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-300'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{client?.gender === 'female' ? '👗' : client?.gender === 'male' ? '🤵' : '👔'}</span>
                  <div>
                    <p className="font-bold text-gray-800 mb-2">
                      Available Attire Types for {client?.name}
                    </p>
                    {filteredAttires[0]?._id?.startsWith('default-') && (
                      <div className="mb-3 p-3 bg-blue-100 border border-blue-300 rounded-lg">
                        <p className="text-sm text-blue-800 font-semibold flex items-center gap-2">
                          <span>ℹ️</span> These attire types will be automatically added to the system when you save your first measurement.
                        </p>
                      </div>
                    )}
                    <p className="text-sm text-gray-600 mb-3">
                      {filteredAttires.length} attire type{filteredAttires.length !== 1 ? 's' : ''} available
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {filteredAttires.slice(0, 10).map((attire) => (
                        <span key={attire._id} className={`${
                          client?.gender === 'female' 
                            ? 'bg-pink-100 text-pink-700' 
                            : client?.gender === 'male'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                        } px-3 py-1 rounded-full text-xs font-semibold`}>
                          {attire.name}
                        </span>
                      ))}
                      {filteredAttires.length > 10 && (
                        <span className="text-xs text-gray-500 px-3 py-1">
                          +{filteredAttires.length - 10} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveMeasurement} className="space-y-6">
              {/* Attire Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-xl">👔</span> Select Attire Type *
                </label>
                <select
                  required
                  value={formData.attireTypeId}
                  onChange={(e) => handleAttireSelect(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                >
                  <option value="">Choose attire type...</option>
                  {filteredAttires.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name} {a.category ? `- ${a.category}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Measurement Fields */}
              {formData.attireTypeId && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl space-y-4 border-2 border-purple-200">
                  <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">📐</span> Enter Measurements
                  </p>
                  {Object.entries(formData.measurements).map(([fieldName, fieldData]) => (
                    <div key={fieldName} className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={fieldData.value}
                          onChange={(e) => handleMeasurementChange(fieldName, e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                        />
                      </div>
                      <span className="text-sm font-bold text-purple-600 pb-3 bg-white px-4 py-3 rounded-xl border-2 border-purple-200">{fieldData.unit}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-xl">💭</span> Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any special notes..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none bg-white"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="text-xl">💾</span> Save Measurement
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="text-xl">✕</span> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Measurements Grid */}
        {measurements.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-purple-300 shadow-xl">
            <div className="text-8xl mb-6">📏</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No measurements yet</h3>
            <p className="text-gray-600 text-lg">Start by adding your first measurement for {client?.name}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {measurements.map((m) => (
              <div
                key={m._id}
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-purple-200 hover:border-purple-300 group transform hover:scale-105"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                  
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl">👔</span>
                        <h3 className="text-xl font-bold">{m.attireName}</h3>
                      </div>
                      <p className="text-sm opacity-90 flex items-center gap-2">
                        <span>📅</span> {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleFavorite(m._id)}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl transition-all"
                      title={m.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <span className="text-3xl">
                        {m.isFavorite ? '⭐' : '☆'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Measurements */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 space-y-3">
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                    <span className="text-xl">📐</span> Measurements
                  </p>
                  <div className="space-y-2">
                    {Object.entries(m.measurements || {}).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-purple-200">
                        <span className="text-sm font-semibold text-gray-700 capitalize">{key}</span>
                        <span className="text-sm font-bold text-purple-600 bg-purple-100 px-4 py-1 rounded-lg">
                          {val.value} {val.unit}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  {m.notes && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 p-3 rounded-xl mt-3">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">💭</span>
                        <p className="text-xs text-gray-700 font-medium">{m.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="bg-white p-4 border-t-2 border-gray-100 flex gap-2">
                  <button
                    onClick={() => handleToggleFavorite(m._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-3 py-2.5 rounded-xl transition-all text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <span className="text-lg">{m.isFavorite ? '⭐' : '☆'}</span> Favorite
                  </button>
                  <button
                    onClick={() => handleDeleteMeasurement(m._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2.5 rounded-xl transition-all text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <span className="text-lg">🗑️</span> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
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
    </div>
  );
}
