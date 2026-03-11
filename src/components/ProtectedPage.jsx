import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import ApprovalModal from './ApprovalModal';

export default function ProtectedPage({ children, pageName = 'This page' }) {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for user data to load from localStorage/auth
    // If there's a token but no user yet, wait a bit for auth to initialize
    if (token && !user) {
      // User data is still loading, don't redirect yet
      setIsLoading(true);
    } else {
      setIsLoading(false);
      
      // Check if user is a tailor and not approved
      if (user && user.role === 'tailor' && user.approvalStatus !== 'approved') {
        setShowModal(true);
      }
    }
  }, [user, token]);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/dashboard');
  };

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-navy-200 border-t-brand-navy mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not approved, show modal and disable page
  if (user && user.role === 'tailor' && user.approvalStatus !== 'approved') {
    return (
      <>
        <ApprovalModal 
          isOpen={showModal} 
          onClose={handleCloseModal}
          approvalStatus={user.approvalStatus}
        />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center opacity-50">
          <div className="text-center">
            <p className="text-gray-600 font-semibold">{pageName} is disabled until approval</p>
          </div>
        </div>
      </>
    );
  }

  // If approved or not a tailor, show the page
  return children;
}
