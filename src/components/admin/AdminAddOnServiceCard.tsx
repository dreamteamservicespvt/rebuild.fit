import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Star, Tag, DollarSign, Users, Heart, Settings, GripVertical, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type AddOnService } from '@/lib/firebaseServices';

interface AdminAddOnServiceCardProps {
  service: AddOnService;
  onEdit: (service: AddOnService) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
  isDragging?: boolean;
}

const AdminAddOnServiceCard: React.FC<AdminAddOnServiceCardProps> = ({
  service,
  onEdit,
  onDelete,
  disabled = false,
  isDragging = false
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'training':
        return <Users size={14} className="text-blue-400 shrink-0" />;
      case 'nutrition':
        return <Heart size={14} className="text-green-400 shrink-0" />;
      case 'wellness':
        return <Star size={14} className="text-purple-400 shrink-0" />;
      default:
        return <Settings size={14} className="text-gray-400 shrink-0" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'training':
        return 'bg-blue-500/10 text-blue-400 border-blue-400/30';
      case 'nutrition':
        return 'bg-green-500/10 text-green-400 border-green-400/30';
      case 'wellness':
        return 'bg-purple-500/10 text-purple-400 border-purple-400/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-400/30';
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        "bg-rebuild-darkgray border border-gray-700 rounded-lg p-3 xs:p-6 relative group",
        "hover:border-rebuild-yellow/50 transition-all duration-300",
        isDragging && "shadow-lg shadow-rebuild-yellow/20 border-rebuild-yellow/30 scale-105",
        disabled && "opacity-50",
        !service.isActive && "opacity-60"
      )}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Drag Handle */}
      <div className="absolute left-2 top-2 text-gray-500 group-hover:text-gray-400 transition-colors">
        <GripVertical size={12} className="addon-drag-handle" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3 xs:mb-4 pl-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {getCategoryIcon(service.category)}
            <h3 className="text-sm xs:text-base font-semibold text-white truncate">
              {service.name}
            </h3>
            {service.isPopular && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
              >
                <Star size={14} className="text-yellow-400 fill-yellow-400 shrink-0" />
              </motion.div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-xs capitalize addon-category-badge", getCategoryColor(service.category))}
            >
              {service.category}
            </Badge>
            {!service.isActive && (
              <Badge variant="outline" className="text-xs bg-red-500/10 text-red-400 border-red-400/30">
                Inactive
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 xs:gap-2 ml-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(service)}
            disabled={disabled}
            className={cn(
              "h-7 xs:h-8 w-7 xs:w-8 p-0 border-gray-600 hover:border-rebuild-yellow hover:text-rebuild-yellow",
              "addon-action-button"
            )}
          >
            <Edit2 size={12} />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(service.id!)}
            disabled={disabled}
            className={cn(
              "h-7 xs:h-8 w-7 xs:w-8 p-0 hover:bg-red-500/90",
              "addon-action-button"
            )}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      {/* Description */}
      <div className="mb-3 xs:mb-4">
        <p className="text-xs xs:text-sm text-gray-300 line-clamp-2 addon-description-text">
          {service.description}
        </p>
      </div>

      {/* Pricing */}
      <div className="mb-3 xs:mb-4 space-y-1 xs:space-y-2">
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-rebuild-yellow shrink-0" />
          <span className="text-xs xs:text-sm text-gray-300 font-medium">Pricing</span>
        </div>
        <div className="grid grid-cols-1 gap-1 text-xs xs:text-sm">
          {service.price.perSession && (
            <div className="flex justify-between">
              <span className="text-gray-400">Per Session:</span>
              <span className="text-rebuild-yellow font-medium">{service.price.perSession}</span>
            </div>
          )}
          {service.price.monthly && (
            <div className="flex justify-between">
              <span className="text-gray-400">Monthly:</span>
              <span className="text-rebuild-yellow font-medium">{service.price.monthly}</span>
            </div>
          )}
          {service.price.oneTime && (
            <div className="flex justify-between">
              <span className="text-gray-400">One Time:</span>
              <span className="text-rebuild-yellow font-medium">{service.price.oneTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Tag size={14} className="text-gray-400 shrink-0" />
          <span className="text-xs xs:text-sm text-gray-300 font-medium">Features</span>
        </div>
        <div className="flex flex-wrap gap-1 xs:gap-2">
          {service.features.length > 0 ? (
            <>
              {service.features.slice(0, 3).map((feature, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs addon-feature-badge"
                >
                  {feature}
                </Badge>
              ))}
              {service.features.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-gray-700/50 addon-feature-badge"
                >
                  +{service.features.length - 3} more
                </Badge>
              )}
            </>
          ) : (
            <span className="text-xs text-gray-500 italic">No features added</span>
          )}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="absolute top-2 right-2">
        <div className="flex items-center gap-1">
          {service.isPopular && (
            <Badge className="bg-rebuild-yellow text-rebuild-black text-xs font-bold">
              POPULAR
            </Badge>
          )}
          {!service.isActive && (
            <EyeOff size={14} className="text-red-400" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminAddOnServiceCard;
