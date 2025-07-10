import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, CheckCircle, XCircle, Clock, CreditCard, User, Phone, Mail, Calendar, DollarSign, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Payment } from '@/lib/firebaseServices';
import { formatCurrency, getDurationDisplayName } from '@/lib/upiPaymentUtils';

interface AdminPaymentCardProps {
  payment: Payment;
  onViewDetails: (payment: Payment) => void;
  onDownloadReceipt: (payment: Payment) => void;
  onSendMessage: (payment: Payment) => void;
  disabled?: boolean;
}

const AdminPaymentCard: React.FC<AdminPaymentCardProps> = ({
  payment,
  onViewDetails,
  onDownloadReceipt,
  onSendMessage,
  disabled = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-green-500/10 text-green-400 border-green-400/30';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-400/30';
      case 'failed':
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-400/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle size={14} />;
      case 'pending':
        return <Clock size={14} />;
      case 'failed':
      case 'error':
        return <XCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <motion.div
      className={cn(
        "bg-rebuild-darkgray border border-gray-700 rounded-lg p-3 xs:p-6 relative group",
        "hover:border-rebuild-yellow/50 transition-all duration-300",
        disabled && "opacity-50"
      )}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 xs:mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <User size={14} className="text-gray-400 shrink-0" />
            <h3 className="text-sm xs:text-base font-semibold text-white truncate">
              {payment.fullName || 'Unknown Customer'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-xs payment-status-badge", getStatusColor(payment.status))}
            >
              <span className="mr-1 flex items-center">
                {getStatusIcon(payment.status)}
              </span>
              <span className="capitalize">{payment.status}</span>
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 ml-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(payment)}
            disabled={disabled}
            className={cn(
              "h-7 xs:h-8 w-7 xs:w-8 p-0 border-gray-600 hover:border-rebuild-yellow hover:text-rebuild-yellow",
              "payment-action-button"
            )}
          >
            <Eye size={12} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownloadReceipt(payment)}
            disabled={disabled}
            className={cn(
              "h-7 xs:h-8 w-7 xs:w-8 p-0 border-gray-600 hover:border-blue-500 hover:text-blue-400",
              "payment-action-button"
            )}
          >
            <Download size={12} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSendMessage(payment)}
            disabled={disabled}
            className={cn(
              "h-7 xs:h-8 w-7 xs:w-8 p-0 border-gray-600 hover:border-green-500 hover:text-green-400",
              "payment-action-button"
            )}
          >
            <MessageSquare size={12} />
          </Button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mb-3 xs:mb-4 space-y-1">
        {payment.email && (
          <div className="flex items-center gap-2 text-xs xs:text-sm">
            <Mail size={12} className="text-gray-400 shrink-0" />
            <span className="text-gray-300 truncate payment-email-text">
              {payment.email}
            </span>
          </div>
        )}
        {payment.phone && (
          <div className="flex items-center gap-2 text-xs xs:text-sm">
            <Phone size={12} className="text-gray-400 shrink-0" />
            <span className="text-gray-300 payment-phone-text">
              {payment.phone}
            </span>
          </div>
        )}
      </div>

      {/* Plan & Amount */}
      <div className="mb-3 xs:mb-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard size={14} className="text-gray-400 shrink-0" />
          <span className="text-xs xs:text-sm text-gray-300 font-medium">Plan Details</span>
        </div>
        <div className="space-y-1">
          <div className="text-xs xs:text-sm text-white payment-plan-text">
            {payment.membershipName || 'Unknown Plan'}
            {payment.duration && (
              <span className="text-gray-400 ml-2">
                ({getDurationDisplayName(payment.duration)})
              </span>
            )}
          </div>
          <div className="text-lg xs:text-xl font-bold text-rebuild-yellow">
            {formatCurrency(payment.finalAmount)}
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 text-xs xs:text-sm">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Calendar size={12} className="text-gray-400 shrink-0" />
            <span className="text-gray-400">Payment Date</span>
          </div>
          <span className="text-gray-300 payment-date-text">
            {formatDate(payment.createdAt)}
          </span>
        </div>
        
        {payment.upiId && (
          <div>
            <div className="flex items-center gap-1 mb-1">
              <DollarSign size={12} className="text-gray-400 shrink-0" />
              <span className="text-gray-400">UPI ID</span>
            </div>
            <span className="text-gray-300 text-xs font-mono payment-transaction-text">
              {payment.upiId}
            </span>
          </div>
        )}
      </div>

      {/* Payment Method */}
      {payment.payeeName && (
        <div className="mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-xs xs:text-sm text-gray-400">Payee</span>
            <span className="text-xs xs:text-sm text-white">
              {payment.payeeName}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminPaymentCard;
