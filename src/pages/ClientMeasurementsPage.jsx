'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Ruler, 
  Plus, 
  Star, 
  Package, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Trash2,
  Save,
  X,
  MessageSquare
} from 'lucide-react';
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [measurementToDelete, setMeasurementToDelete] = useState(null);
  const [formData, setFormData] = useState({
    clientId: clientId,
    attireTypeId: '',
    measurements: {},
  });

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [clientRes, measurementsRes] = await Promise.all([
        clientAPI.getById(clientId),
        measurementAPI.getByClient(clientId),
      ]);

      setClient(clientRes.data.client);
      setMeasurements(measurementsRes.data.measurements);

      try {
        const attiresRes = await attireAPI.getAll();
        const allAttires = attiresRes.data.attires || [];
        setAttires(allAttires);

        let filtered = [];
        const clientGender = clientRes.data.client.gender;
        
        if (clientGender === 'female') {
          // Always use the fixed female attire list
          const defaultAttires = [
            { _id: 'default-1', name: 'Bubu (Boubou)', category: 'Traditional', genders: ['female'] },
            { _id: 'default-2', name: 'T-Bubu', category: 'Traditional', genders: ['female'] },
            { _id: 'default-3', name: 'Female Kaftan', category: 'Traditional', genders: ['female'] },
            { _id: 'default-4', name: 'Ankara Gown', category: 'Casual', genders: ['female'] },
            { _id: 'default-5', name: 'Lace Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-6', name: 'Wrapper & Blouse', category: 'Traditional', genders: ['female'] },
            { _id: 'default-7', name: 'Skirt & Blouse', category: 'Casual', genders: ['female'] },
            { _id: 'default-8', name: 'Skirt & Tri-Cutter Blouse', category: 'Casual', genders: ['female'] },
            { _id: 'default-9', name: 'Iro & Buba', category: 'Traditional', genders: ['female'] },
            { _id: 'default-10', name: 'Aso-Ebi Style', category: 'Formal', genders: ['female'] },
            { _id: 'default-11', name: 'Straight Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-12', name: 'A-Shape Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-13', name: 'Fitted Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-14', name: 'Flare Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-15', name: 'Umbrella Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-16', name: 'Princess Cut Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-17', name: 'Maxi Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-18', name: 'Short Gown', category: 'Casual', genders: ['female'] },
            { _id: 'default-19', name: 'Dinner / Evening Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-20', name: 'Reception Dress', category: 'Formal', genders: ['female'] },
            { _id: 'default-21', name: 'Wedding Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-22', name: 'Blouse Only', category: 'Casual', genders: ['female'] },
            { _id: 'default-23', name: 'Peplum Top', category: 'Casual', genders: ['female'] },
            { _id: 'default-24', name: 'Corset Top', category: 'Casual', genders: ['female'] },
            { _id: 'default-25', name: 'Crop Top', category: 'Casual', genders: ['female'] },
            { _id: 'default-26', name: 'Jacket Top', category: 'Casual', genders: ['female'] },
            { _id: 'default-27', name: 'Pencil Skirt', category: 'Casual', genders: ['female'] },
            { _id: 'default-28', name: 'Straight Skirt', category: 'Casual', genders: ['female'] },
            { _id: 'default-29', name: 'Flare Skirt', category: 'Casual', genders: ['female'] },
            { _id: 'default-30', name: 'Mermaid Skirt', category: 'Casual', genders: ['female'] },
            { _id: 'default-31', name: 'Long Skirt', category: 'Casual', genders: ['female'] },
            { _id: 'default-32', name: 'Short Skirt', category: 'Casual', genders: ['female'] },
            { _id: 'default-33', name: 'Female Trouser', category: 'Casual', genders: ['female'] },
          ];
          filtered = defaultAttires;
        } else if (clientGender === 'male') {
          // Always use the fixed male attire list
          const defaultAttires = [
            { _id: 'male-1', name: 'Short Kaftan', category: 'Traditional', genders: ['male'] },
            { _id: 'male-2', name: 'Long Kaftan', category: 'Traditional', genders: ['male'] },
            { _id: 'male-3', name: 'Babban Riga', category: 'Traditional', genders: ['male'] },
            { _id: 'male-4', name: 'Agbada', category: 'Traditional', genders: ['male'] },
            { _id: 'male-5', name: 'Senator Wear (2-Piece)', category: 'Traditional', genders: ['male'] },
            { _id: 'male-6', name: 'Complete Senator (3-Piece)', category: 'Traditional', genders: ['male'] },
            { _id: 'male-7', name: 'Jalabiya / Jallabiya', category: 'Traditional', genders: ['male'] },
            { _id: 'male-8', name: 'Boubou (Male)', category: 'Traditional', genders: ['male'] },
            { _id: 'male-9', name: 'Traditional Inner Top', category: 'Traditional', genders: ['male'] },
            { _id: 'male-10', name: 'Corporate Shirt', category: 'Formal', genders: ['male'] },
            { _id: 'male-11', name: 'Casual Shirt', category: 'Casual', genders: ['male'] },
            { _id: 'male-12', name: 'Native Shirt', category: 'Traditional', genders: ['male'] },
            { _id: 'male-13', name: 'Short Sleeve Shirt', category: 'Casual', genders: ['male'] },
            { _id: 'male-14', name: 'Long Sleeve Shirt', category: 'Formal', genders: ['male'] },
            { _id: 'male-15', name: 'Inner Top Only', category: 'Casual', genders: ['male'] },
            { _id: 'male-16', name: 'Polo Style Top', category: 'Casual', genders: ['male'] },
            { _id: 'male-17', name: 'Suit (2-Piece)', category: 'Formal', genders: ['male'] },
            { _id: 'male-18', name: 'Suit (3-Piece)', category: 'Formal', genders: ['male'] },
            { _id: 'male-19', name: 'Blazer', category: 'Formal', genders: ['male'] },
            { _id: 'male-20', name: 'Waistcoat (Vest)', category: 'Formal', genders: ['male'] },
            { _id: 'male-21', name: 'Trouser (Wando)', category: 'Casual', genders: ['male'] },
            { _id: 'male-22', name: 'Fitted Trouser', category: 'Formal', genders: ['male'] },
            { _id: 'male-23', name: 'Native Trouser', category: 'Traditional', genders: ['male'] },
            { _id: 'male-24', name: 'Chinos', category: 'Casual', genders: ['male'] },
            { _id: 'male-25', name: 'Shorts', category: 'Casual', genders: ['male'] },
            { _id: 'male-26', name: 'Hula (Cap)', category: 'Accessories', genders: ['male'] },
            { _id: 'male-27', name: 'Embroidery Only', category: 'Service', genders: ['male'] },
            { _id: 'male-28', name: 'Trouser Only', category: 'Service', genders: ['male'] },
            { _id: 'male-29', name: 'Top Only', category: 'Service', genders: ['male'] },
            { _id: 'male-30', name: 'Repair / Adjustment', category: 'Service', genders: ['male'] },
            { _id: 'male-31', name: 'Tightening / Resizing', category: 'Service', genders: ['male'] },
            { _id: 'male-32', name: 'Patch Work', category: 'Service', genders: ['male'] },
          ];
          filtered = defaultAttires;
        } else {
          filtered = allAttires;
        }

        setFilteredAttires(filtered);
      } catch (attireErr) {
        console.error('Failed to fetch attires:', attireErr);
        const clientGender = clientRes.data.client.gender;
        let filtered = [];
        
        if (clientGender === 'female') {
          // Always use the fixed female attire list
          filtered = [
            { _id: 'default-1', name: 'Bubu (Boubou)', category: 'Traditional', genders: ['female'] },
            { _id: 'default-2', name: 'T-Bubu', category: 'Traditional', genders: ['female'] },
            { _id: 'default-3', name: 'Female Kaftan', category: 'Traditional', genders: ['female'] },
            { _id: 'default-4', name: 'Ankara Gown', category: 'Casual', genders: ['female'] },
            { _id: 'default-5', name: 'Lace Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-6', name: 'Wrapper & Blouse', category: 'Traditional', genders: ['female'] },
            { _id: 'default-7', name: 'Skirt & Blouse', category: 'Casual', genders: ['female'] },
            { _id: 'default-8', name: 'Skirt & Tri-Cutter Blouse', category: 'Casual', genders: ['female'] },
            { _id: 'default-9', name: 'Iro & Buba', category: 'Traditional', genders: ['female'] },
            { _id: 'default-10', name: 'Aso-Ebi Style', category: 'Formal', genders: ['female'] },
            { _id: 'default-11', name: 'Straight Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-12', name: 'A-Shape Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-13', name: 'Fitted Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-14', name: 'Flare Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-15', name: 'Umbrella Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-16', name: 'Princess Cut Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-17', name: 'Maxi Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-18', name: 'Short Gown', category: 'Casual', genders: ['female'] },
            { _id: 'default-19', name: 'Dinner / Evening Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-20', name: 'Reception Dress', category: 'Formal', genders: ['female'] },
            { _id: 'default-21', name: 'Wedding Gown', category: 'Formal', genders: ['female'] },
            { _id: 'default-22', name: 'Blouse Only', category: 'Casual', genders: ['female'] },
            { _id: 'default-23', name: 'Peplum Top', category: 'Casual', genders: ['female'] },
            { _id: 'default-24', name: 'Corset Top', category: 'Casual', genders: ['female'] },
            { _id: 'default-25', name: 'Crop Top', category: 'Casual', genders: ['female'] },
            { _id: 'default-26', name: 'Jacket Top', category: 'Casual', genders: ['female'] },
            { _id: 'default-27', name: 'Pencil Skirt', category: 'Casual', genders: ['female'] },
            { _id: 'default-28', name: 'Straight Skirt', category: 'Casual', genders: ['female'] },
            { _id: 'default-29', name: 'Flare Skirt', category: 'Casual', genders: ['female'] },
            { _id: 'default-30', name: 'Mermaid Skirt', category: 'Casual', genders: ['female'] },
            { _id: 'default-31', name: 'Long Skirt', category: 'Casual', genders: ['female'] },
            { _id: 'default-32', name: 'Short Skirt', category: 'Casual', genders: ['female'] },
            { _id: 'default-33', name: 'Female Trouser', category: 'Casual', genders: ['female'] },
          ];
        } else if (clientGender === 'male') {
          filtered = [
            { _id: 'male-1', name: 'Short Kaftan', category: 'Traditional', genders: ['male'] },
            { _id: 'male-2', name: 'Long Kaftan', category: 'Traditional', genders: ['male'] },
            { _id: 'male-3', name: 'Babban Riga', category: 'Traditional', genders: ['male'] },
            { _id: 'male-4', name: 'Agbada', category: 'Traditional', genders: ['male'] },
            { _id: 'male-5', name: 'Senator Wear (2-Piece)', category: 'Traditional', genders: ['male'] },
            { _id: 'male-6', name: 'Complete Senator (3-Piece)', category: 'Traditional', genders: ['male'] },
            { _id: 'male-7', name: 'Jalabiya / Jallabiya', category: 'Traditional', genders: ['male'] },
            { _id: 'male-8', name: 'Boubou (Male)', category: 'Traditional', genders: ['male'] },
            { _id: 'male-9', name: 'Traditional Inner Top', category: 'Traditional', genders: ['male'] },
            { _id: 'male-10', name: 'Corporate Shirt', category: 'Formal', genders: ['male'] },
            { _id: 'male-11', name: 'Casual Shirt', category: 'Casual', genders: ['male'] },
            { _id: 'male-12', name: 'Native Shirt', category: 'Traditional', genders: ['male'] },
            { _id: 'male-13', name: 'Short Sleeve Shirt', category: 'Casual', genders: ['male'] },
            { _id: 'male-14', name: 'Long Sleeve Shirt', category: 'Formal', genders: ['male'] },
            { _id: 'male-15', name: 'Inner Top Only', category: 'Casual', genders: ['male'] },
            { _id: 'male-16', name: 'Polo Style Top', category: 'Casual', genders: ['male'] },
            { _id: 'male-17', name: 'Suit (2-Piece)', category: 'Formal', genders: ['male'] },
            { _id: 'male-18', name: 'Suit (3-Piece)', category: 'Formal', genders: ['male'] },
            { _id: 'male-19', name: 'Blazer', category: 'Formal', genders: ['male'] },
            { _id: 'male-20', name: 'Waistcoat (Vest)', category: 'Formal', genders: ['male'] },
            { _id: 'male-21', name: 'Trouser (Wando)', category: 'Casual', genders: ['male'] },
            { _id: 'male-22', name: 'Fitted Trouser', category: 'Formal', genders: ['male'] },
            { _id: 'male-23', name: 'Native Trouser', category: 'Traditional', genders: ['male'] },
            { _id: 'male-24', name: 'Chinos', category: 'Casual', genders: ['male'] },
            { _id: 'male-25', name: 'Shorts', category: 'Casual', genders: ['male'] },
            { _id: 'male-26', name: 'Hula (Cap)', category: 'Accessories', genders: ['male'] },
            { _id: 'male-27', name: 'Embroidery Only', category: 'Service', genders: ['male'] },
            { _id: 'male-28', name: 'Trouser Only', category: 'Service', genders: ['male'] },
            { _id: 'male-29', name: 'Top Only', category: 'Service', genders: ['male'] },
            { _id: 'male-30', name: 'Repair / Adjustment', category: 'Service', genders: ['male'] },
            { _id: 'male-31', name: 'Tightening / Resizing', category: 'Service', genders: ['male'] },
            { _id: 'male-32', name: 'Patch Work', category: 'Service', genders: ['male'] },
          ];
        }
        
        setFilteredAttires(filtered);
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
      let measurementsObj = {};
      
      if (attire.measurementFields && attire.measurementFields.length > 0) {
        attire.measurementFields.forEach((field) => {
          measurementsObj[field.fieldName] = { value: 0, unit: field.unit, note: '' };
        });
      } else {
        let defaultFields = [];
        
        if (client.gender === 'female') {
          defaultFields = [
            { fieldName: 'shoulder_width', unit: 'inch', label: 'Shoulder Width' },
            { fieldName: 'bust', unit: 'inch', label: 'Bust (Chest)' },
            { fieldName: 'upper_waist', unit: 'inch', label: 'Waist (Upper Waist)' },
            { fieldName: 'sleeve_length', unit: 'inch', label: 'Sleeve Length' },
            { fieldName: 'arm_width', unit: 'inch', label: 'Arm Width (Bicep)' },
            { fieldName: 'wrist', unit: 'inch', label: 'Wrist' },
            { fieldName: 'top_length', unit: 'inch', label: 'Blouse Length / Top Length' },
            { fieldName: 'back_width', unit: 'inch', label: 'Back Width' },
            { fieldName: 'waist', unit: 'inch', label: 'Waist' },
            { fieldName: 'hip', unit: 'inch', label: 'Hip' },
            { fieldName: 'thigh', unit: 'inch', label: 'Thigh' },
            { fieldName: 'knee', unit: 'inch', label: 'Knee' },
            { fieldName: 'skirt_length', unit: 'inch', label: 'Skirt Length / Gown Length' },
            { fieldName: 'bottom_width', unit: 'inch', label: 'Bottom Width / Flare Width' },
          ];
        } else {
          defaultFields = [
            { fieldName: 'neck', unit: 'inch', label: 'Neck' },
            { fieldName: 'shoulder_width', unit: 'inch', label: 'Shoulder Width' },
            { fieldName: 'chest', unit: 'inch', label: 'Chest' },
            { fieldName: 'sleeve_length', unit: 'inch', label: 'Sleeve Length' },
            { fieldName: 'arm_width', unit: 'inch', label: 'Arm Width (Bicep)' },
            { fieldName: 'wrist', unit: 'inch', label: 'Wrist' },
            { fieldName: 'top_length', unit: 'inch', label: 'Full Length (Top Length)' },
            { fieldName: 'girth', unit: 'inch', label: 'Girth (Loose Body Round)' },
            { fieldName: 'waist', unit: 'inch', label: 'Waist' },
            { fieldName: 'hip', unit: 'inch', label: 'Hip' },
            { fieldName: 'thigh', unit: 'inch', label: 'Thigh' },
            { fieldName: 'trouser_length', unit: 'inch', label: 'Trouser Length' },
            { fieldName: 'bottom_width', unit: 'inch', label: 'Bottom Width (Leg Opening)' },
          ];
        }
        
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
          value: value,
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
      if (formData.attireTypeId.startsWith('default-')) {
        const defaultAttire = filteredAttires.find(a => a._id === formData.attireTypeId);
        
        if (defaultAttire) {
          try {
            const attireData = {
              name: defaultAttire.name,
              category: defaultAttire.category.toLowerCase(),
              genders: Array.isArray(defaultAttire.genders) ? defaultAttire.genders : [defaultAttire.genders],
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
            
            const createdAttire = await attireAPI.create(attireData);
            
            const updatedFormData = {
              ...formData,
              attireTypeId: createdAttire.data.attire._id
            };
            
            await measurementAPI.create(updatedFormData);
            setMessage('Attire type created and measurement saved successfully');
          } catch (attireError) {
            console.error('Failed to create attire:', attireError);
            const errorMsg = attireError.response?.data?.message || 'Failed to create attire type. Please try again or contact administrator.';
            setError(errorMsg);
            return;
          }
        }
      } else {
        await measurementAPI.create(formData);
        setMessage('Measurement saved successfully');
      }
      
      setShowForm(false);
      setFormData({
        clientId: clientId,
        attireTypeId: '',
        measurements: {},
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
      // Update local state instead of refetching entire page
      setMeasurements(measurements.map(m => 
        m._id === measurementId ? { ...m, isFavorite: !m.isFavorite } : m
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update favorite');
    }
  };

  const handleDeleteMeasurement = (measurementId) => {
    setMeasurementToDelete(measurementId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteMeasurement = async () => {
    if (!measurementToDelete) return;
    
    try {
      await measurementAPI.delete(measurementToDelete);
      setMessage('Measurement deleted successfully');
      setDeleteModalOpen(false);
      setMeasurementToDelete(null);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete measurement');
      setDeleteModalOpen(false);
      setMeasurementToDelete(null);
    }
  };

  const cancelDeleteMeasurement = () => {
    setDeleteModalOpen(false);
    setMeasurementToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-navy-200 border-t-brand-navy-600 mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading measurements...</p>
        </div>
      </div>
    );
  }

  if (error && !client) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={() => navigate('/measurements')}
            className="flex items-center gap-2 text-brand-navy hover:text-brand-navy-dark font-semibold transition-all hover:gap-3"
          >
            <ArrowLeft size={20} /> Back to Measurements
          </button>
          <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 shadow-sm">
            <div className="flex items-center gap-4">
              <AlertTriangle size={24} className="flex-shrink-0" />
              <span className="font-semibold text-lg">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const genderConfig = {
    male: {
      bgColor: 'bg-brand-navy',
      textColor: 'text-brand-navy',
      borderColor: 'border-brand-navy',
      icon: User,
    },
    female: {
      bgColor: 'bg-brand-orange',
      textColor: 'text-brand-orange',
      borderColor: 'border-brand-orange',
      icon: User,
    },
    other: {
      bgColor: 'bg-brand-navy',
      textColor: 'text-brand-navy',
      borderColor: 'border-brand-navy',
      icon: User,
    }
  };

  const config = genderConfig[client?.gender] || genderConfig.other;
  const totalMeasurements = measurements.length;
  const favoriteMeasurements = measurements.filter(m => m.isFavorite).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/measurements')}
            className="inline-flex items-center gap-2 text-brand-navy hover:text-brand-navy-dark font-semibold mb-4 transition-all hover:gap-3"
          >
            <ArrowLeft size={20} /> Back to Measurements
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`${config.bgColor} p-3 rounded-lg shadow-sm`}>
                <config.icon size={28} className="text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${config.textColor}`}>
                  {client?.name}'s Measurements
                </h1>
                <p className="text-gray-600 mt-1 text-sm font-medium capitalize">
                  {client?.gender} • {client?.phone}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`inline-flex items-center gap-2 ${config.bgColor} hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md`}
            >
              <Plus size={20} /> Add Measurement
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { 
              label: 'Total Measurements', 
              value: totalMeasurements, 
              icon: Ruler,
              color: 'brand-navy',
            },
            { 
              label: 'Favorite Measurements', 
              value: favoriteMeasurements, 
              icon: Star,
              color: 'brand-orange',
            },
            { 
              label: 'Unique Attires', 
              value: [...new Set(measurements.map(m => m.attireName))].length, 
              icon: Package,
              color: 'brand-navy',
            },
          ].map((stat, idx) => {
            const borderColor = stat.color === 'brand-navy' ? '#1e3a5f' : '#ff8c42';
            const bgColor = stat.color === 'brand-navy' ? 'bg-brand-navy' : 'bg-brand-orange';
            const textColor = stat.color === 'brand-navy' ? 'text-brand-navy' : 'text-brand-orange';
            return (
              <div 
                key={idx} 
                className="bg-white rounded-lg p-6 shadow-sm border-l-4 hover:shadow-md transition-all"
                style={{ borderLeftColor: borderColor }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${bgColor} bg-opacity-10 p-3 rounded-lg`}>
                    <stat.icon size={24} className={textColor} />
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 flex items-center gap-4 shadow-sm">
            <AlertTriangle size={20} className="flex-shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 flex items-center gap-4 shadow-sm">
            <CheckCircle size={20} className="flex-shrink-0" />
            <span className="font-semibold">{message}</span>
          </div>
        )}

        {/* Add Measurement Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className={`${config.bgColor} p-3 rounded-lg`}>
                <Sparkles size={24} className="text-white" />
              </div>
              <h2 className={`text-2xl font-bold ${config.textColor}`}>
                Create New Measurement
              </h2>
            </div>

            <form onSubmit={handleSaveMeasurement} className="space-y-6">
              {/* Attire Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Package size={18} /> Select Attire Type *
                </label>
                <select
                  required
                  value={formData.attireTypeId}
                  onChange={(e) => handleAttireSelect(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-brand-navy focus:ring-2 focus:ring-brand-navy focus:ring-opacity-20 outline-none transition-all bg-white"
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
                <div className="bg-gray-50 p-6 rounded-lg space-y-6 border border-gray-200">
                  <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Ruler size={20} /> Enter Measurements
                  </p>
                  
                  {client.gender === 'female' ? (
                    <>
                      {/* Female Top Measurements */}
                      <div className="space-y-4">
                        <h3 className={`font-bold ${config.textColor} text-sm uppercase tracking-wide`}>Top Measurements</h3>
                        {['shoulder_width', 'bust', 'upper_waist', 'sleeve_length', 'arm_width', 'wrist', 'top_length', 'back_width'].map((fieldName) => {
                          const fieldData = formData.measurements[fieldName];
                          if (!fieldData) return null;
                          const labels = {
                            shoulder_width: 'Shoulder Width',
                            bust: 'Bust (Chest)',
                            upper_waist: 'Waist (Upper Waist)',
                            sleeve_length: 'Sleeve Length',
                            arm_width: 'Arm Width (Bicep)',
                            wrist: 'Wrist',
                            top_length: 'Blouse Length / Top Length',
                            back_width: 'Back Width'
                          };
                          return (
                            <div key={fieldName} className="flex gap-3 items-end">
                              <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  {labels[fieldName]}
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={fieldData.value}
                                  onChange={(e) => handleMeasurementChange(fieldName, e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-brand-navy focus:ring-2 focus:ring-brand-navy focus:ring-opacity-20 outline-none transition-all bg-white"
                                />
                              </div>
                              <span className="text-sm font-bold text-gray-600 pb-3 bg-white px-4 py-3 rounded-lg border border-gray-300">{fieldData.unit}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Female Bottom Measurements */}
                      <div className="space-y-4">
                        <h3 className={`font-bold ${config.textColor} text-sm uppercase tracking-wide`}>Bottom Measurements</h3>
                        {['waist', 'hip', 'thigh', 'knee', 'skirt_length', 'bottom_width'].map((fieldName) => {
                          const fieldData = formData.measurements[fieldName];
                          if (!fieldData) return null;
                          const labels = {
                            waist: 'Waist',
                            hip: 'Hip',
                            thigh: 'Thigh',
                            knee: 'Knee',
                            skirt_length: 'Skirt Length / Gown Length',
                            bottom_width: 'Bottom Width / Flare Width'
                          };
                          return (
                            <div key={fieldName} className="flex gap-3 items-end">
                              <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  {labels[fieldName]}
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={fieldData.value}
                                  onChange={(e) => handleMeasurementChange(fieldName, e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-brand-navy focus:ring-2 focus:ring-brand-navy focus:ring-opacity-20 outline-none transition-all bg-white"
                                />
                              </div>
                              <span className="text-sm font-bold text-gray-600 pb-3 bg-white px-4 py-3 rounded-lg border border-gray-300">{fieldData.unit}</span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Male Top Measurements */}
                      <div className="space-y-4">
                        <h3 className={`font-bold ${config.textColor} text-sm uppercase tracking-wide`}>Top Measurements</h3>
                        {['neck', 'shoulder_width', 'chest', 'sleeve_length', 'arm_width', 'wrist', 'top_length'].map((fieldName) => {
                          if (!formData.measurements[fieldName]) return null;
                          const fieldData = formData.measurements[fieldName];
                          const labels = {
                            neck: 'Neck',
                            shoulder_width: 'Shoulder Width',
                            chest: 'Chest',
                            sleeve_length: 'Sleeve Length',
                            arm_width: 'Arm Width (Bicep)',
                            wrist: 'Wrist',
                            top_length: 'Full Length (Top Length)'
                          };
                          return (
                            <div key={fieldName} className="flex gap-3 items-end">
                              <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  {labels[fieldName]}
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={fieldData.value}
                                  onChange={(e) => handleMeasurementChange(fieldName, e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-brand-navy focus:ring-2 focus:ring-brand-navy focus:ring-opacity-20 outline-none transition-all bg-white"
                                />
                              </div>
                              <span className="text-sm font-bold text-gray-600 pb-3 bg-white px-4 py-3 rounded-lg border border-gray-300">{fieldData.unit}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Additional (Babban Riga) */}
                      {formData.measurements['girth'] && (
                        <div className="space-y-4">
                          <h3 className={`font-bold ${config.textColor} text-sm uppercase tracking-wide`}>Additional (Only for Babban Riga)</h3>
                          <div className="flex gap-3 items-end">
                            <div className="flex-1">
                              <label className="block text-sm font-bold text-gray-700 mb-2">
                                Girth (Loose Body Round)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={formData.measurements['girth'].value}
                                onChange={(e) => handleMeasurementChange('girth', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-brand-navy focus:ring-2 focus:ring-brand-navy focus:ring-opacity-20 outline-none transition-all bg-white"
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-600 pb-3 bg-white px-4 py-3 rounded-lg border border-gray-300">{formData.measurements['girth'].unit}</span>
                          </div>
                        </div>
                      )}

                      {/* Male Bottom Measurements */}
                      <div className="space-y-4">
                        <h3 className={`font-bold ${config.textColor} text-sm uppercase tracking-wide`}>Bottom Measurements (Trouser/Wando)</h3>
                        {['waist', 'hip', 'thigh', 'trouser_length', 'bottom_width'].map((fieldName) => {
                          if (!formData.measurements[fieldName]) return null;
                          const fieldData = formData.measurements[fieldName];
                          const labels = {
                            waist: 'Waist',
                            hip: 'Hip',
                            thigh: 'Thigh',
                            trouser_length: 'Trouser Length',
                            bottom_width: 'Bottom Width (Leg Opening)'
                          };
                          return (
                            <div key={fieldName} className="flex gap-3 items-end">
                              <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  {labels[fieldName]}
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={fieldData.value}
                                  onChange={(e) => handleMeasurementChange(fieldName, e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-brand-navy focus:ring-2 focus:ring-brand-navy focus:ring-opacity-20 outline-none transition-all bg-white"
                                />
                              </div>
                              <span className="text-sm font-bold text-gray-600 pb-3 bg-white px-4 py-3 rounded-lg border border-gray-300">{fieldData.unit}</span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className={`flex-1 flex items-center justify-center gap-2 ${config.bgColor} hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md`}
                >
                  <Save size={20} /> Save Measurement
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                >
                  <X size={20} /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Measurements Grid */}
        {measurements.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="mb-6">
              <Ruler size={64} className="mx-auto text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No measurements yet</h3>
            <p className="text-gray-600 text-lg">Start by adding your first measurement for {client?.name}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {measurements.map((m) => (
              <div
                key={m._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
              >
                {/* Card Header */}
                <div className={`${config.bgColor} p-6 text-white`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Package size={20} />
                        <h3 className="text-lg font-bold">{m.attireName}</h3>
                      </div>
                      <p className="text-sm opacity-90 flex items-center gap-2">
                        <Info size={16} /> {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleFavorite(m._id)}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
                      title={m.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star size={20} fill={m.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>

                {/* Measurements */}
                <div className="p-6 space-y-3">
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                    <Ruler size={16} /> Measurements
                  </p>
                  <div className="space-y-2">
                    {Object.entries(m.measurements || {}).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span className="text-sm font-semibold text-gray-700 capitalize">{key}</span>
                        <span className={`text-sm font-bold ${config.textColor} bg-opacity-10 ${config.bgColor} px-3 py-1 rounded-lg`}>
                          {val.value} {val.unit}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  {m.notes && (
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mt-3">
                      <div className="flex items-start gap-2">
                        <MessageSquare size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-700 font-medium">{m.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="bg-gray-50 p-4 border-t border-gray-200 flex gap-2">
                  <button
                    onClick={() => handleToggleFavorite(m._id)}
                    className={`flex-1 flex items-center justify-center gap-2 ${config.bgColor} hover:opacity-90 text-white px-3 py-2 rounded-lg transition-all text-sm font-semibold shadow-sm hover:shadow-md`}
                  >
                    <Star size={16} fill={m.isFavorite ? 'currentColor' : 'none'} /> Favorite
                  </button>
                  <button
                    onClick={() => handleDeleteMeasurement(m._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-all text-sm font-semibold shadow-sm hover:shadow-md"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 border-2 border-red-200">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Delete Measurement?
            </h2>
            
            <p className="text-gray-600 text-center mb-8">
              Are you sure you want to delete this measurement? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={cancelDeleteMeasurement}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteMeasurement}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
