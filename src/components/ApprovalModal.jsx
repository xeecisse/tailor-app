import React from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

export default function ApprovalModal({ isOpen, onClose, approvalStatus }) {
  if (!isOpen) return null;

  const getContent = () => {
    switch (approvalStatus) {
      case 'pending':
        return {
          icon: Clock,
          title: 'Waiting for Approval',
          message: 'Your account is pending approval from our admin team.',
          description: 'We are reviewing your application. This usually takes 24-48 hours. You will receive an email notification once your account is approved.',
          color: 'amber',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-900',
          iconColor: 'text-amber-600',
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          title: 'Application Rejected',
          message: 'Your account application has been rejected.',
          description: 'Please contact our support team for more information about why your application was rejected.',
          color: 'red',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-900',
          iconColor: 'text-red-600',
        };
      case 'approved':
        return {
          icon: CheckCircle,
          title: 'Account Approved',
          message: 'Your account has been approved!',
          description: 'You now have full access to all features.',
          color: 'green',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-900',
          iconColor: 'text-green-600',
        };
      default:
        return {
          icon: AlertCircle,
          title: 'Account Status Unknown',
          message: 'Unable to determine your account status.',
          description: 'Please contact support for assistance.',
          color: 'gray',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-900',
          iconColor: 'text-gray-600',
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${content.bgColor} border-2 ${content.borderColor} rounded-2xl shadow-2xl max-w-md w-full p-8`}>
        <div className="text-center">
          <div className={`inline-block p-4 rounded-full mb-4 ${content.bgColor} border-2 ${content.borderColor}`}>
            <Icon size={48} className={content.iconColor} />
          </div>
          
          <h2 className={`text-2xl font-bold ${content.textColor} mb-2`}>
            {content.title}
          </h2>
          
          <p className={`${content.textColor} font-semibold mb-3`}>
            {content.message}
          </p>
          
          <p className={`text-sm ${content.textColor} opacity-80 mb-6`}>
            {content.description}
          </p>

          {approvalStatus === 'pending' && (
            <div className={`p-4 rounded-lg ${content.bgColor} border border-${content.color}-300 mb-6`}>
              <p className={`text-xs ${content.textColor} font-semibold`}>
                ⏱️ Typical approval time: 24-48 hours
              </p>
            </div>
          )}

          {approvalStatus === 'rejected' && (
            <div className={`p-4 rounded-lg ${content.bgColor} border border-${content.color}-300 mb-6`}>
              <p className={`text-xs ${content.textColor} font-semibold`}>
                📧 Check your email for rejection details
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className={`w-full bg-gradient-to-r from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white font-bold py-3 rounded-lg transition-all`}
          >
            {approvalStatus === 'approved' ? 'Get Started' : 'Go to Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
