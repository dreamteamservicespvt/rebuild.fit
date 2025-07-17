import React from 'react';
import { Edit, Trash2, GripVertical, Clock, User, Target, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ResponsiveImage from '@/components/ResponsiveImage';
import { cn } from '@/lib/utils';
import type { Transformation } from '@/lib/firebaseServices';

interface AdminTransformationCardProps {
  transformation: Transformation;
  onEdit: (transformation: Transformation) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
  isDragging?: boolean;
}

const AdminTransformationCard: React.FC<AdminTransformationCardProps> = ({
  transformation,
  onEdit,
  onDelete,
  disabled = false,
  isDragging = false
}) => {
  return (
    <Card className={cn(
      "bg-rebuild-darkgray border-gray-700 transition-all duration-200 hover:border-rebuild-yellow/50",
      "transformation-card-mobile",
      isDragging && "opacity-50 transform rotate-1 scale-95"
    )}>
      <CardContent className="p-3 xs:p-6">
        {/* Header with drag handle */}
        <div className="flex items-start justify-between mb-3 xs:mb-4">
          <div className="flex items-center gap-2 xs:gap-3 flex-1 min-w-0">
            <GripVertical 
              size={16} 
              className="text-gray-500 hover:text-rebuild-yellow cursor-grab transformation-drag-handle flex-shrink-0" 
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm xs:text-base font-semibold text-white truncate flex items-center gap-2">
                <User size={14} className="text-rebuild-yellow flex-shrink-0" />
                {transformation.name}
              </h3>
              {transformation.duration && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <Clock size={12} className="flex-shrink-0" />
                  <span className="truncate">{transformation.duration}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-1 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(transformation)}
              disabled={disabled}
              className="h-7 xs:h-8 w-7 xs:w-8 p-0 border-gray-600 hover:border-rebuild-yellow transformation-action-button"
            >
              <Edit size={12} className="text-gray-400 hover:text-rebuild-yellow" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(transformation.id!)}
              disabled={disabled}
              className="h-7 xs:h-8 w-7 xs:w-8 p-0 border-gray-600 hover:border-red-500 transformation-action-button"
            >
              <Trash2 size={12} className="text-gray-400 hover:text-red-400" />
            </Button>
          </div>
        </div>

        {/* Images section */}
        {(transformation.beforeImage || transformation.afterImage) && (
          <div className="grid grid-cols-2 gap-2 xs:gap-3 mb-3 xs:mb-4">
            {transformation.beforeImage && (
              <div className="transformation-image-container">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-600">
                  <ResponsiveImage 
                    src={transformation.beforeImage} 
                    alt={`Before - ${transformation.name}`} 
                    className="w-full h-full object-contain"
                    preserveAspectRatio={true}
                  />
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                    BEFORE
                  </div>
                </div>
              </div>
            )}
            {transformation.afterImage && (
              <div className="transformation-image-container">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-600">
                  <ResponsiveImage 
                    src={transformation.afterImage} 
                    alt={`After - ${transformation.name}`} 
                    className="w-full h-full object-contain"
                    preserveAspectRatio={true}
                  />
                  <div className="absolute bottom-1 right-1 bg-rebuild-yellow text-black px-1.5 py-0.5 rounded text-xs font-bold">
                    AFTER
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Goal section */}
        {transformation.goal && (
          <div className="mb-3 xs:mb-4">
            <div className="flex items-start gap-2">
              <Target size={12} className="text-rebuild-yellow mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 mb-1">Goal/Achievement</p>
                <p className="text-xs xs:text-sm text-gray-300 line-clamp-2 transformation-goal-text">
                  {transformation.goal}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Testimonial section */}
        {transformation.testimonial && (
          <div className="mb-0">
            <div className="flex items-start gap-2">
              <Quote size={12} className="text-rebuild-yellow mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 mb-1">Testimonial</p>
                <blockquote className="text-xs xs:text-sm text-gray-300 italic line-clamp-3 transformation-testimonial-text">
                  "{transformation.testimonial}"
                </blockquote>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTransformationCard;
