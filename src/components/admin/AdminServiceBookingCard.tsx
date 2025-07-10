import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, XCircle, Clock, Phone, Mail, User, Calendar, CreditCard, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ServiceBooking } from '@/lib/firebaseServices';
import { format } from 'date-fns';

interface AdminServiceBookingCardProps {
  booking: ServiceBooking;
  onView: (booking: ServiceBooking) => void;
  onStatusUpdate: (bookingId: string, status: ServiceBooking['status']) => void;
  disabled?: boolean;
}

const AdminServiceBookingCard: React.FC<AdminServiceBookingCardProps> = ({
  booking,
  onView,
  onStatusUpdate,
  disabled = false
}) => {
  const getStatusColor = (status: ServiceBooking['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-400/30';
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-400 border-blue-400/30';
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-400/30';
      case 'completed':
        return 'bg-gray-500/10 text-gray-400 border-gray-400/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-400/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: ServiceBooking['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={14} />;
      case 'confirmed':
        return <CheckCircle size={14} />;
      case 'active':
        return <CheckCircle size={14} />;
      case 'completed':
        return <CheckCircle size={14} />;
      case 'cancelled':
        return <XCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'MMM dd, yyyy');
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
              {booking.customerName}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-xs booking-status-badge", getStatusColor(booking.status))}
            >
              <span className="mr-1 flex items-center">
                {getStatusIcon(booking.status)}
              </span>
              <span className="capitalize">{booking.status}</span>
            </Badge>
          </div>
        </div>

        {/* Action Button */}
        <div className="ml-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(booking)}
            disabled={disabled}
            className={cn(
              "h-7 xs:h-8 w-7 xs:w-8 p-0 border-gray-600 hover:border-rebuild-yellow hover:text-rebuild-yellow",
              "booking-action-button"
            )}
          >
            <Eye size={12} />
          </Button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mb-3 xs:mb-4 space-y-1">
        <div className="flex items-center gap-2 text-xs xs:text-sm">
          <Mail size={12} className="text-gray-400 shrink-0" />
          <span className="text-gray-300 truncate booking-email-text">
            {booking.customerEmail}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs xs:text-sm">
          <Phone size={12} className="text-gray-400 shrink-0" />
          <span className="text-gray-300 booking-phone-text">
            {booking.customerPhone}
          </span>
        </div>
      </div>

      {/* Services */}
      <div className="mb-3 xs:mb-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare size={14} className="text-gray-400 shrink-0" />
          <span className="text-xs xs:text-sm text-gray-300 font-medium">Services</span>
        </div>
        <div className="space-y-1">
          {booking.addOnServices.slice(0, 2).map((service, index) => (
            <div key={index} className="text-xs xs:text-sm text-rebuild-yellow">
              {service.serviceName} - ₹{service.price}
            </div>
          ))}
          {booking.addOnServices.length > 2 && (
            <div className="text-xs text-gray-400">
              +{booking.addOnServices.length - 2} more services
            </div>
          )}
        </div>
      </div>

      {/* Membership & Dates */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 text-xs xs:text-sm">
        {booking.membershipName && (
          <div>
            <div className="flex items-center gap-1 mb-1">
              <CreditCard size={12} className="text-gray-400 shrink-0" />
              <span className="text-gray-400">Membership</span>
            </div>
            <span className="text-rebuild-yellow text-xs booking-membership-text">
              {booking.membershipName}
            </span>
          </div>
        )}
        
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Calendar size={12} className="text-gray-400 shrink-0" />
            <span className="text-gray-400">Booking Date</span>
          </div>
          <span className="text-gray-300 text-xs booking-date-text">
            {formatDate(booking.createdAt)}
          </span>
        </div>
      </div>

      {/* Total Amount */}
      {booking.totalAmount && (
        <div className="mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-xs xs:text-sm text-gray-400">Total Amount</span>
            <span className="text-sm xs:text-base font-semibold text-rebuild-yellow">
              ₹{booking.totalAmount}
            </span>
          </div>
        </div>
      )}

      {/* Quick Actions for status updates */}
      {booking.status === 'pending' && (
        <div className="mt-3 xs:mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusUpdate(booking.id!, 'confirmed')}
            disabled={disabled}
            className="flex-1 h-7 xs:h-8 text-xs border-green-600 text-green-400 hover:bg-green-600/20"
          >
            Confirm
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusUpdate(booking.id!, 'cancelled')}
            disabled={disabled}
            className="flex-1 h-7 xs:h-8 text-xs border-red-600 text-red-400 hover:bg-red-600/20"
          >
            Cancel
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default AdminServiceBookingCard;
