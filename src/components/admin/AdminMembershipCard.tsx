import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Star, Tag, DollarSign, Award, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Membership } from '@/lib/firebaseServices';

interface AdminMembershipCardProps {
  plan: Membership;
  activeDuration: 'monthly' | 'quarterly' | 'halfyearly' | 'annual';
  onEdit: (plan: Membership) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
  isDragging?: boolean;
}

const AdminMembershipCard: React.FC<AdminMembershipCardProps> = ({
  plan,
  activeDuration,
  onEdit,
  onDelete,
  disabled = false,
  isDragging = false
}) => {
  return (
    <motion.div
      layout
      className={cn(
        "bg-rebuild-darkgray border border-gray-700 rounded-lg p-3 xs:p-6 relative group",
        "hover:border-rebuild-yellow/50 transition-all duration-300",
        isDragging && "shadow-lg shadow-rebuild-yellow/20 border-rebuild-yellow/30 scale-105",
        disabled && "opacity-50"
      )}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Drag Handle */}
      <div className="absolute left-2 top-2 text-gray-500 group-hover:text-gray-400 transition-colors">
        <GripVertical size={12} className="membership-drag-handle" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3 xs:mb-4 pl-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Tag size={14} className="text-gray-400 shrink-0" />
            <h3 className="text-sm xs:text-base font-semibold text-white truncate">
              {plan.name}
            </h3>
            {plan.isPopular && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
              >
                <Star size={14} className="text-yellow-400 fill-yellow-400 shrink-0" />
              </motion.div>
            )}
          </div>
          <Badge
            variant={
              plan.type === 'premium' ? 'default' :
              plan.type === 'student' ? 'outline' : 'secondary'
            }
            className="text-xs capitalize membership-type-badge"
          >
            {plan.type}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 xs:gap-2 ml-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(plan)}
            disabled={disabled}
            className={cn(
              "h-7 xs:h-8 w-7 xs:w-8 p-0 border-gray-600 hover:border-rebuild-yellow hover:text-rebuild-yellow",
              "membership-action-button"
            )}
          >
            <Edit2 size={12} />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(plan.id!)}
            disabled={disabled}
            className={cn(
              "h-7 xs:h-8 w-7 xs:w-8 p-0 hover:bg-red-500/90",
              "membership-action-button"
            )}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      {/* Price */}
      <div className="mb-3 xs:mb-4">
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-rebuild-yellow shrink-0" />
          <span className="text-lg xs:text-xl font-bold text-rebuild-yellow">
            {plan.price[activeDuration] || 'N/A'}
          </span>
          <span className="text-xs xs:text-sm text-gray-400 capitalize">
            /{activeDuration}
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Award size={14} className="text-gray-400 shrink-0" />
          <span className="text-xs xs:text-sm text-gray-300 font-medium">Features</span>
        </div>
        <div className="flex flex-wrap gap-1 xs:gap-2">
          {plan.features.length > 0 ? (
            <>
              {plan.features.slice(0, 3).map((feature, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs membership-feature-badge"
                >
                  {feature}
                </Badge>
              ))}
              {plan.features.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-gray-700/50 membership-feature-badge"
                >
                  +{plan.features.length - 3} more
                </Badge>
              )}
            </>
          ) : (
            <span className="text-xs text-gray-500 italic">No features added</span>
          )}
        </div>
      </div>

      {/* Popular Indicator */}
      {plan.isPopular && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-rebuild-yellow text-rebuild-black text-xs font-bold">
            POPULAR
          </Badge>
        </div>
      )}
    </motion.div>
  );
};

export default AdminMembershipCard;
