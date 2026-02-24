'use client';

import React, { useState, useEffect } from 'react';
import { inventoryAPI, uploadAPI, getImageUrl } from '../lib/api';
import {
  Package,
  Tag,
  DollarSign,
  AlertTriangle,
  Search,
  Save,
  X,
  FileText,
  Target,
  Ruler,
  Banknote,
  TrendingUp,
  Trash2,
  Shirt,
  Scissors,
  Gem,
  Box,
  CheckCircle,
  Plus,
  Image as ImageIcon,
  Upload
} from 'lucide-react';

const BASE_URL = 'https://tailor-app-backend-uh5b.onrender.com';

export default function InventoryPage() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('items');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);
  const [selectedItemImage, setSelectedItemImage] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    categoryType: 'other',
  });
  const [itemFormData, setItemFormData] = useState({
    categoryId: '',
    name: '',
    quantity: '',
    unit: 'piece',
    costPrice: '',
    sellingPrice: '',
    lowStockThreshold: '5',
    itemImage: null,
    itemImagePreview: null,
  });

  useEffect(() => {
    fetchData();
    // Show welcome guide if no categories exist
    const hasSeenGuide = localStorage.getItem('inventory_guide_seen');
    if (!hasSeenGuide) {
      setShowWelcomeGuide(true);
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [categoriesRes, itemsRes] = await Promise.all([
        inventoryAPI.getCategories(),
        inventoryAPI.getItems(),
      ]);

      setCategories(categoriesRes.data.categories);
      setItems(itemsRes.data.items);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError('');

    if (!categoryFormData.name) {
      setError('Please enter a category name');
      return;
    }

    try {
      await inventoryAPI.createCategory(categoryFormData);
      setMessage('✅ Category created successfully! You can now add items to this category.');
      setCategoryFormData({ name: '', categoryType: 'other' });
      setShowCategoryForm(false);
      fetchData();
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setError('');

    if (!itemFormData.categoryId) {
      setError('Please select a category first');
      return;
    }

    if (!itemFormData.name) {
      setError('Please enter the item name');
      return;
    }

    if (!itemFormData.costPrice || !itemFormData.sellingPrice) {
      setError('Please enter both cost price and selling price');
      return;
    }

    if (parseFloat(itemFormData.sellingPrice) < parseFloat(itemFormData.costPrice)) {
      if (!window.confirm('Warning: Your selling price is lower than cost price. You will make a loss. Continue anyway?')) {
        return;
      }
    }

    try {
      let imageUrl = null;
      
      // Upload image if selected
      if (itemFormData.itemImage) {
        try {
          const uploadRes = await uploadAPI.uploadSingle(itemFormData.itemImage);
          console.log('Upload response:', uploadRes.data);
          
          // Extract URL from response
          imageUrl = uploadRes.data.file?.url;
          
          if (!imageUrl) {
            console.error('No URL in upload response:', uploadRes.data);
            setError('Failed to get image URL from upload response');
          } else {
            console.log('Image uploaded successfully:', imageUrl);
          }
        } catch (uploadErr) {
          console.error('Image upload error:', uploadErr);
          setError('Failed to upload image. Item will be created without image.');
        }
      }

      const itemData = {
        categoryId: itemFormData.categoryId,
        name: itemFormData.name,
        quantity: itemFormData.quantity ? parseInt(itemFormData.quantity) : 0,
        unit: itemFormData.unit,
        costPrice: parseFloat(itemFormData.costPrice),
        sellingPrice: parseFloat(itemFormData.sellingPrice),
        lowStockThreshold: itemFormData.lowStockThreshold ? parseInt(itemFormData.lowStockThreshold) : 5,
      };
      
      // Add image URL to item data if uploaded
      if (imageUrl) {
        itemData.itemImage = imageUrl;
        console.log('Adding image to item:', imageUrl);
      }
      
      console.log('Creating item with data:', itemData);
      console.log('Data types:', {
        categoryId: typeof itemData.categoryId,
        name: typeof itemData.name,
        quantity: typeof itemData.quantity,
        unit: typeof itemData.unit,
        costPrice: typeof itemData.costPrice,
        sellingPrice: typeof itemData.sellingPrice,
        lowStockThreshold: typeof itemData.lowStockThreshold,
      });
      const response = await inventoryAPI.createItem(itemData);
      console.log('Item created:', response.data);

      const profit = parseFloat(itemFormData.sellingPrice) - parseFloat(itemFormData.costPrice);
      const profitPercent = ((profit / parseFloat(itemFormData.costPrice)) * 100).toFixed(1);
      
      setMessage(`✅ Item added successfully! Your profit per item: ₦${profit.toLocaleString()} (${profitPercent}% margin)`);
      setItemFormData({
        categoryId: '',
        name: '',
        quantity: '',
        unit: 'piece',
        costPrice: '',
        sellingPrice: '',
        lowStockThreshold: '5',
        itemImage: null,
        itemImagePreview: null,
      });
      setShowItemForm(false);
      fetchData();
      setTimeout(() => setMessage(''), 6000);
    } catch (err) {
      console.error('Error details:', err.response?.data);
      console.error('Full error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await inventoryAPI.deleteItem(itemId);
        setMessage('✅ Item deleted successfully');
        fetchData();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete item');
      }
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemFormData(prev => ({
          ...prev,
          itemImage: file,
          itemImagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const closeWelcomeGuide = () => {
    setShowWelcomeGuide(false);
    localStorage.setItem('inventory_guide_seen', 'true');
  };

  const calculateProfit = (costPrice, sellingPrice) => {
    if (!costPrice || !sellingPrice) return { amount: 0, percentage: 0 };
    const profit = parseFloat(sellingPrice) - parseFloat(costPrice);
    const percentage = ((profit / parseFloat(costPrice)) * 100).toFixed(1);
    return { amount: profit, percentage };
  };

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'ready_made': return Shirt;
      case 'fabric': return Scissors;
      case 'accessory': return Gem;
      default: return Package;
    }
  };

  const lowStockItems = items.filter((item) => item.isLowStock);
  const filteredItems = selectedCategory
    ? items.filter((item) => item.categoryId === selectedCategory)
    : items;

  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.costPrice || 0), 0);
  const totalProfit = items.reduce((sum, item) => sum + (item.quantity * (item.sellingPrice - item.costPrice) || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-3 border-slate-300 border-t-[#001f3f] mb-3"></div>
          <p className="text-gray-600 font-semibold text-sm">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      {/* Subtle Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#001f3f]/5 to-[#ff6b35]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#001f3f]/5 to-[#ff6b35]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome Guide Modal */}
        {showWelcomeGuide && categories.length === 0 && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full border border-slate-200">
              <div className="text-center mb-4">
                <div className="inline-block bg-gradient-to-br from-[#001f3f] to-[#ff6b35] p-3 rounded-full mb-3">
                  <Package size={32} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome to Inventory Management 👋</h2>
                <p className="text-gray-600 text-sm">Let's get you started in 2 simple steps</p>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#001f3f] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 mb-0.5">Create Categories First</h3>
                    <p className="text-gray-600 text-xs">
                      Think of categories as folders to organize your items. Examples: "Fabrics", "Buttons", "Threads"
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#ff6b35] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 mb-0.5">Add Items to Categories</h3>
                    <p className="text-gray-600 text-xs">
                      After creating categories, add your actual items. Example: "Ankara Fabric" goes in "Fabrics"
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-0.5">💡 Pro Tip</h3>
                      <p className="text-gray-700 text-xs">
                        Set your selling price higher than cost price to make profit. The app will calculate your margin automatically!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    closeWelcomeGuide();
                    setActiveTab('categories');
                    setShowCategoryForm(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-[#001f3f] to-[#ff6b35] hover:from-[#001a2e] hover:to-[#e55a24] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                >
                  Let's Start! Create First Category
                </button>
                <button
                  onClick={closeWelcomeGuide}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-gray-700 rounded-lg font-semibold transition-all text-sm"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#001f3f] mb-1">
                Inventory Management
              </h1>
              <p className="text-gray-600 text-sm font-medium">
                Track your materials and supplies
              </p>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (categories.length === 0) {
                    setActiveTab('categories');
                  }
                  setShowCategoryForm(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-[#001f3f] to-[#ff6b35] hover:from-[#001a2e] hover:to-[#e55a24] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                <Tag size={16} /> Category
              </button>
              <button
                onClick={() => {
                  if (categories.length === 0) {
                    setError('Please create a category first');
                    setTimeout(() => setError(''), 3000);
                    return;
                  }
                  setShowItemForm(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-[#001f3f] to-[#ff6b35] hover:from-[#001a2e] hover:to-[#e55a24] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { 
              label: 'Total Items', 
              value: items.length, 
              icon: Package,
              bgColor: 'bg-blue-50',
              textColor: 'text-[#001f3f]',
              borderColor: 'border-blue-200'
            },
            { 
              label: 'Categories', 
              value: categories.length, 
              icon: Tag,
              bgColor: 'bg-orange-50',
              textColor: 'text-[#ff6b35]',
              borderColor: 'border-orange-200'
            },
            { 
              label: 'Total Value', 
              value: `₦${totalValue.toLocaleString()}`, 
              icon: DollarSign,
              bgColor: 'bg-green-50',
              textColor: 'text-green-700',
              borderColor: 'border-green-200'
            },
            { 
              label: 'Low Stock', 
              value: lowStockItems.length, 
              icon: AlertTriangle,
              bgColor: 'bg-red-50',
              textColor: 'text-red-700',
              borderColor: 'border-red-200'
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
            <div 
              key={idx} 
              className={`${stat.bgColor} rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 border ${stat.borderColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon size={18} className={stat.textColor} />
              </div>
              <p className="text-gray-600 text-xs font-semibold mb-1">{stat.label}</p>
              <p className={`text-lg font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
          )})}
        </div>

        {/* Messages */}
        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 flex items-center gap-2 shadow-sm text-sm">
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        {message && (
          <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 flex items-center gap-2 shadow-sm text-sm">
            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
            <span className="font-medium">{message}</span>
          </div>
        )}

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-lg shadow-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 text-sm">
                  {lowStockItems.length} {lowStockItems.length === 1 ? 'item is' : 'items are'} running low
                </p>
                <p className="text-xs text-amber-700 mt-0.5">Consider restocking soon</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
          <button
            onClick={() => setActiveTab('items')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === 'items'
                ? 'bg-gradient-to-r from-[#001f3f] to-[#ff6b35] text-white shadow-md'
                : 'text-gray-600 hover:bg-slate-50'
            }`}
          >
            <Package size={14} /> Items ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === 'categories'
                ? 'bg-gradient-to-r from-[#001f3f] to-[#ff6b35] text-white shadow-md'
                : 'text-gray-600 hover:bg-slate-50'
            }`}
          >
            <Tag size={14} /> Categories ({categories.length})
          </button>
        </div>

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            {categories.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-3 border border-slate-200">
                <div className="flex items-center gap-2">
                  <Search size={14} className="text-gray-500" />
                  <span className="text-xs font-semibold text-gray-700">Filter:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:border-[#001f3f] focus:ring-2 focus:ring-[#001f3f]/10 outline-none transition-all bg-white text-xs"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Item Form Modal */}
            {showItemForm && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-gradient-to-r from-[#001f3f] to-[#ff6b35] p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package size={20} />
                        <div>
                          <h2 className="text-lg font-bold">Add New Item</h2>
                          <p className="text-xs opacity-90">Fill in the details below</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowItemForm(false)}
                        className="p-1 hover:bg-white/20 rounded-lg transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                {categories.length === 0 && (
                  <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 m-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-900 text-sm mb-1">No categories yet!</p>
                        <p className="text-xs text-amber-700">
                          You need to create at least one category first. 
                          <button 
                            onClick={() => {
                              setShowItemForm(false);
                              setActiveTab('categories');
                              setShowCategoryForm(true);
                            }}
                            className="underline font-semibold ml-1 hover:text-amber-900"
                          >
                            Click here to create a category
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleAddItem} className="space-y-4 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Tag size={20} /> Which category does this item belong to? *
                      </label>
                      <select
                        required
                        value={itemFormData.categoryId}
                        onChange={(e) => setItemFormData({ ...itemFormData, categoryId: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white text-lg"
                      >
                        <option value="">-- Select a category --</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name} ({c.totalItemsInCategory || 0} items)
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Example: If adding "Ankara Fabric", select "Fabrics" category</p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <FileText size={20} /> What is the name of this item? *
                      </label>
                      <input
                        type="text"
                        required
                        value={itemFormData.name}
                        onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white text-lg"
                        placeholder="e.g., Blue Ankara Fabric, Gold Button, etc."
                      />
                      <p className="text-xs text-gray-500 mt-1">Give it a clear name so you can find it easily later</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Box size={20} /> How many do you have in stock?
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={itemFormData.quantity}
                        onChange={(e) => setItemFormData({ ...itemFormData, quantity: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white text-lg"
                        placeholder="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave as 0 if you don't have any yet</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Ruler size={20} /> What unit do you measure this in?
                      </label>
                      <select
                        value={itemFormData.unit}
                        onChange={(e) => setItemFormData({ ...itemFormData, unit: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white text-lg"
                      >
                        <option value="piece">Piece (for individual items)</option>
                        <option value="yard">Yard (for fabrics)</option>
                        <option value="meter">Meter (for fabrics)</option>
                        <option value="kg">Kilogram (for heavy items)</option>
                        <option value="pack">Pack (for bundles)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Banknote size={20} /> How much did you buy it for? (Cost Price) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">₦</span>
                        <input
                          type="number"
                          step="100"
                          min="0"
                          required
                          value={itemFormData.costPrice}
                          onChange={(e) => setItemFormData({ ...itemFormData, costPrice: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white text-lg"
                          placeholder="0"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">This is what you paid to get this item</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <DollarSign size={20} /> How much will you sell it for? (Selling Price) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">₦</span>
                        <input
                          type="number"
                          step="100"
                          min="0"
                          required
                          value={itemFormData.sellingPrice}
                          onChange={(e) => setItemFormData({ ...itemFormData, sellingPrice: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white text-lg"
                          placeholder="0"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">This is what customers will pay you</p>
                    </div>

                    {itemFormData.costPrice && itemFormData.sellingPrice && (
                      <div className="md:col-span-2">
                        {(() => {
                          const profit = calculateProfit(itemFormData.costPrice, itemFormData.sellingPrice);
                          const isLoss = profit.amount < 0;
                          return (
                            <div className={`p-4 rounded-xl border-2 ${
                              isLoss 
                                ? 'bg-red-50 border-red-300' 
                                : 'bg-green-50 border-green-300'
                            }`}>
                              <div className="flex items-center gap-3">
                                {isLoss ? (
                                  <AlertTriangle size={24} className="text-red-700" />
                                ) : (
                                  <TrendingUp size={24} className="text-green-700" />
                                )}
                                <div>
                                  <p className={`font-bold text-lg ${isLoss ? 'text-red-900' : 'text-green-900'}`}>
                                    {isLoss ? '⚠️ Warning: You will make a LOSS!' : '✅ Great! You will make a profit'}
                                  </p>
                                  <p className={`text-sm ${isLoss ? 'text-red-700' : 'text-green-700'}`}>
                                    {isLoss ? 'Loss' : 'Profit'} per item: <span className="font-bold">₦{Math.abs(profit.amount).toLocaleString()}</span> ({Math.abs(profit.percentage)}% {isLoss ? 'loss' : 'margin'})
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <AlertTriangle size={20} /> Alert me when stock is low (Optional)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={itemFormData.lowStockThreshold}
                        onChange={(e) => setItemFormData({ ...itemFormData, lowStockThreshold: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white text-lg"
                        placeholder="5"
                      />
                      <p className="text-xs text-gray-500 mt-1">You'll get a warning when stock falls below this number (default: 5)</p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <ImageIcon size={20} /> Upload Item Image (Optional)
                      </label>
                      <div className="flex gap-4">
                        <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all">
                          <Upload size={20} className="text-gray-600" />
                          <span className="text-sm font-semibold text-gray-700">Choose Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                        </label>
                        {itemFormData.itemImagePreview && (
                          <button
                            type="button"
                            onClick={() => setItemFormData(prev => ({ ...prev, itemImage: null, itemImagePreview: null }))}
                            className="px-4 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-all"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      {itemFormData.itemImagePreview && (
                        <div className="mt-3 flex justify-center">
                          <img src={itemFormData.itemImagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg border-2 border-purple-300" />
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Max 5MB. Supported: JPG, PNG, GIF</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={categories.length === 0}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      <Save size={24} /> Save Item
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowItemForm(false)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                    >
                      <X size={24} /> Cancel
                    </button>
                  </div>
                </form>
              </div>
              </div>
            )}


            {/* Items Grid */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-brand-navy-300 shadow-xl">
                <Package size={80} className="mx-auto mb-6 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No items yet</h3>
                <p className="text-gray-600 text-base mb-4">
                  {categories.length === 0 
                    ? 'Create a category first, then add items to it'
                    : 'Start adding items to track your inventory'
                  }
                </p>
                {categories.length === 0 ? (
                  <button
                    onClick={() => {
                      setActiveTab('categories');
                      setShowCategoryForm(true);
                    }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 hover:from-brand-orange-600 hover:to-brand-orange-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform text-sm"
                  >
                    <Tag size={20} /> Create Your First Category
                  </button>
                ) : (
                  <button
                    onClick={() => setShowItemForm(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-navy-600 to-brand-orange-600 hover:from-brand-navy-700 hover:to-brand-orange-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform text-sm"
                  >
                    <Package size={20} /> Add Your First Item
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => {
                  const imageUrl = item.itemImage;
                  return (
                    <div
                      key={item._id}
                      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${
                        item.isLowStock ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      {/* Image Section */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden group">
                        {imageUrl ? (
                          <>
                            <img
                              src={getImageUrl(imageUrl)}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                console.error('Image failed to load:', imageUrl);
                                e.target.style.display = 'none';
                              }}
                            />
                            <button
                              onClick={() => setSelectedItemImage({ name: item.name, url: imageUrl })}
                              className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                            >
                              <div className="flex flex-col items-center gap-2">
                                <ImageIcon size={32} className="text-white" />
                                <span className="text-white font-bold text-sm">View Image</span>
                              </div>
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-gray-400">
                            <Package size={40} />
                            <span className="text-sm font-semibold">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-4 space-y-3">
                        {/* Item Name & Category */}
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-sm font-bold text-gray-900 flex-1 line-clamp-2">{item.name}</h3>
                            {item.isLowStock && (
                              <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{item.categoryName} • {item.unit}</p>
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-600">Stock:</span>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            item.isLowStock 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {item.quantity} {item.unit}
                          </span>
                        </div>

                        {/* Pricing Section */}
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Cost Price:</span>
                            <span className="text-sm font-semibold text-gray-900">₦{item.costPrice?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Selling Price:</span>
                            <span className="text-sm font-semibold text-gray-900">₦{item.sellingPrice?.toLocaleString()}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-600">Profit Margin:</span>
                            {item.profitMargin > 0 ? (
                              <span className="text-sm font-bold text-green-700">+{item.profitMargin?.toFixed(1)}%</span>
                            ) : (
                              <span className="text-sm font-bold text-red-700">{item.profitMargin?.toFixed(1)}%</span>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all font-semibold text-sm"
                        >
                          <Trash2 size={16} /> Delete Item
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Image Viewer Modal */}
        {selectedItemImage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
              <div className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] p-4 text-white flex items-center justify-between">
                <h2 className="text-lg font-bold">{selectedItemImage.name}</h2>
                <button
                  onClick={() => setSelectedItemImage(null)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 flex justify-center">
                <img 
                  src={getImageUrl(selectedItemImage.url)}
                  alt={selectedItemImage.name}
                  className="max-w-full max-h-96 object-contain rounded-lg"
                  onError={(e) => {
                    console.error('Image failed to load:', selectedItemImage.url);
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EImage not found%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <>
            {/* Category Form Modal */}
            {showCategoryForm && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-gradient-to-r from-brand-navy-600 to-brand-orange-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag size={24} />
                        <div>
                          <h2 className="text-xl font-bold">Create a Category</h2>
                          <p className="text-xs opacity-90">Categories help you organize your inventory items</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowCategoryForm(false)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-all"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                      <p className="text-sm text-blue-900 mb-2">
                        <span className="font-bold">💡 Examples of categories:</span>
                      </p>
                      <ul className="text-sm text-blue-800 space-y-1 ml-4">
                        <li>• Fabrics (for Ankara, Lace, etc.)</li>
                        <li>• Accessories (for Buttons, Zippers, etc.)</li>
                        <li>• Ready-made Clothes (for finished garments)</li>
                        <li>• Threads & Needles</li>
                      </ul>
                    </div>

                    <form onSubmit={handleAddCategory} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <FileText size={20} /> What do you want to call this category? *
                        </label>
                        <input
                          type="text"
                          required
                          value={categoryFormData.name}
                          onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white text-lg"
                          placeholder="e.g., Fabrics, Buttons, Threads, etc."
                        />
                        <p className="text-xs text-gray-500 mt-1">Choose a name that makes sense to you</p>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <Target size={20} /> What type of items will go in this category?
                        </label>
                        <select
                          value={categoryFormData.categoryType}
                          onChange={(e) => setCategoryFormData({ ...categoryFormData, categoryType: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white text-lg"
                        >
                          <option value="fabric">Fabrics (Ankara, Lace, etc.)</option>
                          <option value="accessory">Accessories (Buttons, Zippers, etc.)</option>
                          <option value="ready_made">Ready-made Clothes</option>
                          <option value="other">Other Items</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">This helps organize your inventory better</p>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
                        >
                          <Save size={24} /> Create Category
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCategoryForm(false)}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                        >
                          <X size={24} /> Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">

            {categories.length === 0 ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-brand-navy-300 shadow-xl">
                <Tag size={80} className="mx-auto mb-6 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No categories yet</h3>
                <p className="text-gray-600 text-base mb-4">Categories help you organize your inventory items</p>
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 hover:from-brand-orange-600 hover:to-brand-orange-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform text-sm"
                >
                  <Tag size={20} /> Create Your First Category
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const CategoryIcon = getCategoryIcon(cat.categoryType);
                  return (
                  <div
                    key={cat._id}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-brand-navy-200 hover:border-brand-orange-300 group transform hover:scale-105"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-gradient-to-br from-brand-navy-600 to-brand-orange-600 p-3 rounded-2xl shadow-md">
                        <CategoryIcon size={28} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{cat.name}</h3>
                        <p className="text-xs text-gray-600 capitalize">{cat.categoryType.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-brand-navy-50 to-brand-orange-50 rounded-2xl p-3 border-2 border-brand-navy-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-600">Total Items</span>
                        <span className="text-xl font-extrabold text-brand-navy-700">{cat.totalItemsInCategory || 0}</span>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            )}
            </div>
          </>
        )}
      </div>
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
    </>
  );
}
