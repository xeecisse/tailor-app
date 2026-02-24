'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Trash2,
  X,
  ShoppingCart,
  Save,
  AlertCircle,
  CheckCircle,
  Package,
  Minus,
  Printer,
  TrendingUp,
  DollarSign,
  Receipt,
} from 'lucide-react';
import { inventoryAPI, clientAPI, purchaseOrderAPI } from '../lib/api';

export default function POSPage() {
  // State Management
  const [items, setItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // Cart State
  const [cartItems, setCartItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('walk-in');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sales History & Revenue
  const [completedSales, setCompletedSales] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      await Promise.all([fetchItems(), fetchClients()]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await inventoryAPI.getItems(undefined, 'active');
      setItems(response.data.items || []);
    } catch (err) {
      console.error('Error fetching items:', err);
      throw err;
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientAPI.getAll('active');
      setClients(response.data.clients || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
      throw err;
    }
  };

  // Cart Functions
  const addToCart = (item) => {
    const existingItem = cartItems.find(ci => ci._id === item._id);
    if (existingItem) {
      if (existingItem.quantity < item.quantity) {
        setCartItems(cartItems.map(ci =>
          ci._id === item._id ? { ...ci, quantity: ci.quantity + 1 } : ci
        ));
      }
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1, price: item.sellingPrice }]);
    }
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      const item = items.find(i => i._id === itemId);
      if (quantity <= item.quantity) {
        setCartItems(cartItems.map(ci =>
          ci._id === itemId ? { ...ci, quantity } : ci
        ));
      }
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(ci => ci._id !== itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - discount;
  };

  const handleCompleteSale = async () => {
    if (cartItems.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Prepare PO data
      const poData = {
        clientId: selectedCustomer === 'walk-in' ? 'walk-in' : selectedCustomer,
        items: cartItems.map(item => ({
          itemId: item._id,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        notes: `POS Sale - ${paymentMethod}`,
      };

      // Create purchase order
      const poResponse = await purchaseOrderAPI.create(poData);
      const poId = poResponse.data.po._id;
      console.log('Purchase order created:', poId);

      // Record payment immediately
      const paymentData = {
        amount: calculateTotal(),
        method: paymentMethod,
      };
      
      await purchaseOrderAPI.recordPayment(poId, paymentData);
      console.log('Payment recorded for PO:', poId);

      // Mark as delivered to deduct inventory
      await purchaseOrderAPI.updateDeliveryStatus(poId, 'delivered');
      console.log('PO marked as delivered, inventory deducted');

      // Create sale record for display
      const saleData = {
        poId,
        customerId: selectedCustomer === 'walk-in' ? null : selectedCustomer,
        customerName: selectedCustomer === 'walk-in' ? 'Walk-in Customer' : 
          clients.find(c => c._id === selectedCustomer)?.name || 'Unknown',
        items: cartItems.map(item => ({
          itemId: item._id,
          itemName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: item.price * item.quantity,
        })),
        subtotal: calculateSubtotal(),
        discount,
        total: calculateTotal(),
        paymentMethod,
        status: 'completed',
        timestamp: new Date().toISOString(),
      };

      // Add to completed sales
      setCompletedSales([...completedSales, saleData]);
      setLastSale(saleData);
      setShowReceipt(true);

      setMessage('✅ Sale completed successfully!');
      setCartItems([]);
      setDiscount(0);
      setSelectedCustomer('walk-in');
      setPaymentMethod('cash');
      setShowPaymentModal(false);
      
      // Refresh inventory
      fetchItems();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error completing sale:', err);
      setError(err.response?.data?.message || 'Failed to complete sale');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    if (!lastSale) return;
    
    const printWindow = window.open('', '', 'height=600,width=400');
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt</title>
        <style>
          body { font-family: monospace; margin: 0; padding: 20px; }
          .receipt { max-width: 300px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
          .header h2 { margin: 0; font-size: 18px; }
          .header p { margin: 5px 0; font-size: 12px; }
          .items { margin: 20px 0; }
          .item { display: flex; justify-content: space-between; margin: 8px 0; font-size: 12px; }
          .item-name { flex: 1; }
          .item-price { text-align: right; }
          .divider { border-top: 1px dashed #000; margin: 10px 0; }
          .totals { margin: 15px 0; }
          .total-row { display: flex; justify-content: space-between; margin: 5px 0; font-size: 12px; }
          .total-amount { display: flex; justify-content: space-between; margin: 10px 0; font-size: 14px; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; }
          .footer { text-align: center; margin-top: 20px; font-size: 11px; }
          .payment-method { text-align: center; margin: 10px 0; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h2>SewTrack Store</h2>
            <p>Receipt</p>
            <p>${new Date(lastSale.timestamp).toLocaleString()}</p>
          </div>
          
          <div class="items">
            <div style="font-weight: bold; font-size: 12px; margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <span>Item</span>
                <span>Qty</span>
                <span>Price</span>
              </div>
            </div>
            ${lastSale.items.map(item => `
              <div class="item">
                <div style="flex: 1;">
                  <div>${item.itemName}</div>
                  <div style="font-size: 10px; color: #666;">₦${item.unitPrice.toLocaleString()}</div>
                </div>
                <div style="width: 30px; text-align: center;">${item.quantity}</div>
                <div style="width: 60px; text-align: right;">₦${item.subtotal.toLocaleString()}</div>
              </div>
            `).join('')}
          </div>
          
          <div class="divider"></div>
          
          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₦${lastSale.subtotal.toLocaleString()}</span>
            </div>
            ${lastSale.discount > 0 ? `
              <div class="total-row">
                <span>Discount:</span>
                <span>-₦${lastSale.discount.toLocaleString()}</span>
              </div>
            ` : ''}
            <div class="total-amount">
              <span>Total:</span>
              <span>₦${lastSale.total.toLocaleString()}</span>
            </div>
          </div>
          
          <div class="payment-method">
            <strong>Payment: ${lastSale.paymentMethod.toUpperCase().replace('_', ' ')}</strong>
          </div>
          
          <div class="divider"></div>
          
          <div class="footer">
            <p>Customer: ${lastSale.customerName}</p>
            <p>Thank you for your purchase!</p>
            <p style="margin-top: 20px;">--- END OF RECEIPT ---</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Revenue calculations
  const totalRevenue = completedSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = completedSales.length;
  const totalDiscount = completedSales.reduce((sum, sale) => sum + sale.discount, 0);
  const averageTransaction = totalSales > 0 ? totalRevenue / totalSales : 0;

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-navy-50 via-brand-orange-50 to-brand-navy-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-navy-200 border-t-brand-navy mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading POS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy-50 via-brand-orange-50 to-brand-navy-50">
      {/* Decorative Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-brand-navy to-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-orange to-brand-navy rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-gradient-to-br from-brand-navy to-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-brand-navy via-brand-orange to-brand-orange-dark bg-clip-text text-transparent mb-2">
              Point of Sale
            </h1>
            <p className="text-gray-600 text-lg font-medium">
              Sell inventory items to customers and track revenue
            </p>
          </div>

          {/* Revenue Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl text-red-700 flex items-center gap-3 shadow-lg">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span className="text-sm flex-1">{error}</span>
            <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
              <X size={18} />
            </button>
          </div>
        )}

        {message && (
          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl text-green-700 flex items-center gap-3 shadow-lg">
            <CheckCircle size={18} className="flex-shrink-0" />
            <span className="text-sm flex-1">{message}</span>
            <button onClick={() => setMessage('')} className="text-green-700 hover:text-green-900">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT SECTION - Products Grid */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-white/50 rounded-xl md:rounded-2xl focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 outline-none transition-all bg-white/80 backdrop-blur-sm text-sm shadow-md"
              />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.length === 0 ? (
                <div className="col-span-full bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-12 text-center shadow-lg border-2 border-white/50">
                  <Package size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-sm">No products found</p>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const inCart = cartItems.find(ci => ci._id === item._id);
                  return (
                    <div
                      key={item._id}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 shadow-lg hover:shadow-2xl transition-all border-2 border-white/50 hover:scale-105 transform"
                    >
                      {/* Stock Badge */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold">SKU</p>
                          <p className="text-sm font-bold text-gray-900">{item.name}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          item.quantity > 10 ? 'bg-green-100 text-green-700' :
                          item.quantity > 0 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.quantity} in stock
                        </span>
                      </div>

                      {/* Category */}
                      <p className="text-xs text-gray-500 mb-3">{item.category || 'Uncategorized'}</p>

                      {/* Price */}
                      <div className="mb-4 pb-4 border-t-2 border-gray-200 pt-4">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Price</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-brand-navy to-brand-orange bg-clip-text text-transparent">₦{item.sellingPrice?.toLocaleString()}</p>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => addToCart(item)}
                        disabled={item.quantity === 0}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 ${
                          item.quantity === 0
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : inCart
                            ? 'bg-gradient-to-br from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white shadow-lg'
                            : 'bg-gradient-to-br from-brand-orange to-brand-navy hover:from-brand-orange-dark hover:to-brand-navy-dark text-white shadow-lg'
                        }`}
                      >
                        <ShoppingCart size={16} />
                        {inCart ? 'In Cart' : 'Add to Cart'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT SECTION - Shopping Cart */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-lg p-6 sticky top-6 max-h-[calc(100vh-100px)] overflow-y-auto border-2 border-white/50">
              <h3 className="text-lg font-bold bg-gradient-to-r from-brand-navy to-brand-orange bg-clip-text text-transparent mb-6">Current Sale</h3>

              {/* Customer Selection */}
              <div className="mb-6 pb-6 border-b-2 border-gray-200">
                <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Customer</label>
                <div className="relative">
                  <button
                    onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                    className="w-full px-3 py-2 border-2 border-white/50 rounded-xl text-left text-sm font-semibold text-gray-900 hover:border-brand-navy transition-all bg-white/50 backdrop-blur-sm"
                  >
                    {selectedCustomer === 'walk-in' ? 'Walk-in Customer' : 
                      clients.find(c => c._id === selectedCustomer)?.name || 'Select Customer'}
                  </button>
                  {showCustomerDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedCustomer('walk-in');
                          setShowCustomerDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-brand-navy/10 text-sm border-b border-gray-200 last:border-b-0 transition-all"
                      >
                        Walk-in Customer
                      </button>
                      {clients.map(client => (
                        <button
                          key={client._id}
                          onClick={() => {
                            setSelectedCustomer(client._id);
                            setShowCustomerDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-brand-navy/10 text-sm border-b border-gray-200 last:border-b-0 transition-all"
                        >
                          {client.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Items */}
              <div className="mb-6 pb-6 border-b-2 border-gray-200">
                <p className="text-xs font-bold text-gray-600 uppercase mb-3">Cart ({cartItems.length})</p>
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart size={40} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-gray-500 text-sm">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item._id} className="bg-gradient-to-br from-brand-navy-50 to-brand-orange-50 p-2 rounded-lg border-2 border-white/50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-xs font-bold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-600">₦{item.price?.toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-600 hover:text-red-700 transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-1 bg-white hover:bg-gray-100 rounded text-xs border border-gray-200"
                          >
                            <Minus size={12} />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                            className="w-12 px-2 py-1 border-2 border-white/50 rounded text-xs text-center bg-white/50"
                          />
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-1 bg-white hover:bg-gray-100 rounded text-xs border border-gray-200"
                          >
                            <Plus size={12} />
                          </button>
                          <span className="ml-auto text-xs font-bold text-gray-900">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Discount */}
              <div className="mb-6 pb-6 border-b-2 border-gray-200">
                <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Discount (₦)</label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 border-2 border-white/50 rounded-xl text-sm font-semibold text-gray-900 focus:border-brand-navy outline-none bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Totals */}
              <div className="mb-6 pb-6 border-b-2 border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">₦{calculateSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-semibold text-gray-900">-₦{discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="font-bold bg-gradient-to-r from-brand-navy to-brand-orange bg-clip-text text-transparent">₦{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6 pb-6 border-b-2 border-gray-200">
                <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-white/50 rounded-xl text-sm font-semibold text-gray-900 focus:border-brand-navy outline-none bg-white/50 backdrop-blur-sm"
                >
                  <option value="cash">Cash</option>
                  <option value="pos">POS</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              {/* Complete Sale Button */}
              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={cartItems.length === 0}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                  cartItems.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-br from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white shadow-lg hover:shadow-xl'
                }`}
              >
                <Save size={18} />
                Complete Sale
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>

        {/* Payment Confirmation Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl max-w-md w-full p-6 border-2 border-white/50">
              <h2 className="text-xl font-bold bg-gradient-to-r from-brand-navy to-brand-orange bg-clip-text text-transparent mb-4">Confirm Sale</h2>

              <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-semibold text-gray-900">{cartItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">₦{calculateSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-semibold text-gray-900">-₦{discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="font-bold bg-gradient-to-r from-brand-navy to-brand-orange bg-clip-text text-transparent">₦{calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment:</span>
                  <span className="font-semibold text-gray-900 capitalize">{paymentMethod.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-white/50 rounded-xl font-bold text-gray-900 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteSale}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-br from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold transition-all shadow-lg"
                >
                  {loading ? 'Processing...' : 'Complete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Modal */}
        {showReceipt && lastSale && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl max-w-md w-full p-6 border-2 border-white/50 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-brand-navy to-brand-orange bg-clip-text text-transparent">Receipt</h2>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Receipt Content */}
              <div className="bg-gradient-to-br from-brand-navy-50 to-brand-orange-50 p-4 rounded-xl mb-6 font-mono text-sm border-2 border-white/50">
                <div className="text-center mb-4 pb-4 border-b-2 border-gray-300">
                  <p className="font-bold text-lg text-gray-900">SewTrack Store</p>
                  <p className="text-xs text-gray-600">Receipt</p>
                  <p className="text-xs text-gray-600">{new Date(lastSale.timestamp).toLocaleString()}</p>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <div className="text-xs font-bold mb-2 flex justify-between text-gray-900">
                    <span>Item</span>
                    <span>Qty</span>
                    <span>Price</span>
                  </div>
                  {lastSale.items.map((item, idx) => (
                    <div key={idx} className="text-xs mb-2">
                      <div className="flex justify-between text-gray-900">
                        <span className="flex-1">{item.itemName}</span>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <span className="w-16 text-right">₦{item.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="text-gray-600 text-xs">₦{item.unitPrice.toLocaleString()} each</div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-gray-300 pt-3 mb-3">
                  <div className="flex justify-between text-xs mb-1 text-gray-900">
                    <span>Subtotal:</span>
                    <span>₦{lastSale.subtotal.toLocaleString()}</span>
                  </div>
                  {lastSale.discount > 0 && (
                    <div className="flex justify-between text-xs mb-1 text-gray-900">
                      <span>Discount:</span>
                      <span>-₦{lastSale.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm border-t-2 border-gray-300 pt-2 text-gray-900">
                    <span>Total:</span>
                    <span>₦{lastSale.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-center text-xs mb-3 pb-3 border-b-2 border-gray-300">
                  <p className="font-bold text-gray-900">Payment: {lastSale.paymentMethod.toUpperCase().replace('_', ' ')}</p>
                </div>

                <div className="text-center text-xs text-gray-600">
                  <p>Customer: {lastSale.customerName}</p>
                  <p className="mt-2">Thank you for your purchase!</p>
                  <p className="mt-3">--- END OF RECEIPT ---</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrintReceipt}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-br from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white rounded-xl font-bold transition-all shadow-lg"
                >
                  <Printer size={18} />
                  Print Receipt
                </button>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="flex-1 px-4 py-2 border-2 border-white/50 rounded-xl font-bold text-gray-900 hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
