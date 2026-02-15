import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

export default function FilterPanel({ onFilter, onClear, filters = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFilter(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClear();
    setIsOpen(false);
  };

  const hasActiveFilters = Object.values(localFilters).some((v) => v);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded border ${
          hasActiveFilters
            ? 'bg-blue-50 border-blue-300 text-blue-700'
            : 'bg-white border-gray-300 text-gray-700'
        } hover:bg-gray-50`}
      >
        <Filter className="w-4 h-4" />
        Filters {hasActiveFilters && `(${Object.keys(localFilters).length})`}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 z-50">
          <div className="space-y-4">
            {/* Status Filter */}
            {filters.hasOwnProperty('status') && (
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={localFilters.status || ''}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            )}

            {/* Payment Status Filter */}
            {filters.hasOwnProperty('paymentStatus') && (
              <div>
                <label className="block text-sm font-medium mb-1">Payment Status</label>
                <select
                  value={localFilters.paymentStatus || ''}
                  onChange={(e) => handleChange('paymentStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            )}

            {/* Gender Filter */}
            {filters.hasOwnProperty('gender') && (
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  value={localFilters.gender || ''}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            {/* Date Range */}
            {filters.hasOwnProperty('dateFrom') && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    value={localFilters.dateFrom || ''}
                    onChange={(e) => handleChange('dateFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    value={localFilters.dateTo || ''}
                    onChange={(e) => handleChange('dateTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </>
            )}

            {/* Price Range */}
            {filters.hasOwnProperty('minPrice') && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Min Price</label>
                  <input
                    type="number"
                    value={localFilters.minPrice || ''}
                    onChange={(e) => handleChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Price</label>
                  <input
                    type="number"
                    value={localFilters.maxPrice || ''}
                    onChange={(e) => handleChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="999999"
                  />
                </div>
              </>
            )}

            {/* Low Stock Only */}
            {filters.hasOwnProperty('lowStockOnly') && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lowStock"
                  checked={localFilters.lowStockOnly || false}
                  onChange={(e) => handleChange('lowStockOnly', e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="lowStock" className="ml-2 text-sm">
                  Low Stock Only
                </label>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={handleApply}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Apply
              </button>
              <button
                onClick={handleClear}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
