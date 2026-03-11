import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '../stores/authStore';

export const useApprovalCheck = () => {
  const navigate = useNavigate();
  const user = authStore((state) => state.user);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  useEffect(() => {
    // Check if user is a tailor and not approved
    if (user && user.role === 'tailor' && user.approvalStatus !== 'approved') {
      setShowApprovalModal(true);
    }
  }, [user]);

  const handleCloseModal = () => {
    setShowApprovalModal(false);
    navigate('/dashboard');
  };

  return { showApprovalModal, handleCloseModal, isApproved: user?.approvalStatus === 'approved' };
};
