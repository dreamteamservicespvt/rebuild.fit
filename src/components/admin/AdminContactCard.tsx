import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Mail, Phone, User, Calendar, Trash2, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ContactRequest } from '@/lib/firebaseServices';
import { format } from 'date-fns';

interface AdminContactCardProps {
  contact: ContactRequest;
  onViewDetails: (contact: ContactRequest) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAsResponded: (id: string) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

const AdminContactCard: React.FC<AdminContactCardProps> = ({
  contact,
  onViewDetails,
  onMarkAsRead,
  onMarkAsResponded,
  onDelete,
  disabled = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-rebuild-yellow/10 text-rebuild-yellow border-rebuild-yellow/30';
      case 'read':
        return 'bg-blue-500/10 text-blue-400 border-blue-400/30';
      case 'responded':
        return 'bg-green-500/10 text-green-400 border-green-400/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle size={14} />;
      case 'read':
        return <Clock size={14} />;
      case 'responded':
        return <CheckCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <motion.div
      className={cn(
        "bg-rebuild-darkgray border border-gray-700 rounded-lg p-3 xs:p-6 relative group",
        "hover:border-rebuild-yellow/50 transition-all duration-300",
        contact.status === 'new' && "border-rebuild-yellow/30 bg-rebuild-yellow/5",
        contact.status === 'responded' && "border-green-400/30 bg-green-900/5",
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
              {contact.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-xs contact-status-badge", getStatusColor(contact.status))}
            >
              <span className="mr-1 flex items-center">
                {getStatusIcon(contact.status)}
              </span>
              <span className="capitalize">{contact.status}</span>
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 ml-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(contact)}
            disabled={disabled}
            className={cn(
              "h-7 xs:h-8 w-7 xs:w-8 p-0 border-gray-600 hover:border-rebuild-yellow hover:text-rebuild-yellow",
              "contact-action-button"
            )}
          >
            <Eye size={12} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(contact.id!)}
            disabled={disabled}
            className={cn(
              "h-7 xs:h-8 w-7 xs:w-8 p-0 border-gray-600 hover:border-red-500 hover:text-red-400",
              "contact-action-button"
            )}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mb-3 xs:mb-4 space-y-2">
        <div className="flex items-center gap-2 text-xs xs:text-sm">
          <Mail size={12} className="text-gray-400 shrink-0" />
          <a 
            href={`mailto:${contact.email}`}
            className="text-rebuild-yellow hover:underline transition-all truncate contact-email-text"
          >
            {contact.email}
          </a>
        </div>
        {contact.phone && (
          <div className="flex items-center gap-2 text-xs xs:text-sm">
            <Phone size={12} className="text-gray-400 shrink-0" />
            <a 
              href={`tel:${contact.phone}`}
              className="text-gray-300 hover:text-white transition-all contact-phone-text"
            >
              {contact.phone}
            </a>
          </div>
        )}
      </div>

      {/* Message Preview */}
      <div className="mb-3 xs:mb-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare size={14} className="text-gray-400 shrink-0" />
          <span className="text-xs xs:text-sm text-gray-300 font-medium">Message</span>
        </div>
        <p className="text-xs xs:text-sm text-gray-300 line-clamp-3 contact-message-text">
          {contact.message || 'No message provided...'}
        </p>
      </div>

      {/* Date & Quick Actions */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Calendar size={12} className="text-gray-400 shrink-0" />
            <span className="text-gray-400 text-xs">Received</span>
          </div>
          <span className="text-gray-300 text-xs contact-date-text">
            {formatDate(contact.createdAt)}
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex gap-1">
          {contact.status === 'new' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMarkAsRead(contact.id!)}
              disabled={disabled}
              className="flex-1 h-7 xs:h-8 text-xs border-blue-600 text-blue-400 hover:bg-blue-600/20"
            >
              Mark Read
            </Button>
          )}
          {contact.status !== 'responded' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMarkAsResponded(contact.id!)}
              disabled={disabled}
              className="flex-1 h-7 xs:h-8 text-xs border-green-600 text-green-400 hover:bg-green-600/20"
            >
              Mark Responded
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminContactCard;
