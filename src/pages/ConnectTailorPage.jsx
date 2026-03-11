import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, CheckCircle } from 'lucide-react';
import { customerAPI } from '../lib/api';

export default function ConnectTailorPage() {
  const navigate = useNavigate();
  const [businessCode, setBusinessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [connectedTailor, setConnectedTailor] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!businessCode.trim()) {
      setError('Please enter a business code');
      return;
    }

    setLoading(true);

    try {
      const response = await customerAPI.connectToTailor(businessCode.trim());

      setSuccess(true);
      setConnectedTailor(response.data.tailor);
      setBusinessCode('');

      setTimeout(() => {
        navigate('/my-tailors');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to tailor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Connect to Tailor</h1>
        <p className="text-gray-600 mt-2">Enter the business code provided by your tailor</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto text-green-600 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Successfully Connected!</h2>
            <p className="text-gray-600 mb-4">
              You are now connected to <span className="font-semibold">{connectedTailor?.businessName}</span>
            </p>
            <p className="text-sm text-gray-500">Redirecting to My Tailors...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Code
              </label>
              <input
                type="text"
                value={businessCode}
                onChange={(e) => setBusinessCode(e.target.value.toUpperCase())}
                placeholder="e.g., SWTR96892"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white uppercase"
              />
              <p className="text-xs text-gray-500 mt-2">
                Ask your tailor for their unique business code
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Link2 size={20} />
              {loading ? 'Connecting...' : 'Connect to Tailor'}
            </button>
          </form>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">How to get a business code?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Ask your tailor for their unique business code</li>
          <li>• The code is usually 6-8 characters (e.g., STABC123)</li>
          <li>• You can connect to multiple tailors using different codes</li>
        </ul>
      </div>
    </div>
  );
}
