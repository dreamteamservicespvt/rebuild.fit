import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, FileText, Calendar, User, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type BlogPost } from '@/lib/firebaseServices';
import ResponsiveImage from '@/components/ResponsiveImage';
import { format } from 'date-fns';

interface AdminBlogCardProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
  disabled?: boolean;
  isDragging?: boolean;
}

const AdminBlogCard: React.FC<AdminBlogCardProps> = ({
  post,
  onEdit,
  onDelete,
  disabled = false,
  isDragging = false
}) => {
  const formatDate = (timestamp: any, fallbackDate?: string) => {
    if (timestamp?.toDate) {
      return format(timestamp.toDate(), 'MMM dd, yyyy');
    }
    if (fallbackDate) {
      return format(new Date(fallbackDate), 'MMM dd, yyyy');
    }
    return 'N/A';
  };

  return (
    <motion.div
      className={cn(
        "bg-rebuild-darkgray border border-gray-700 rounded-lg p-3 xs:p-6 relative group",
        "hover:border-rebuild-yellow/50 transition-all duration-300",
        disabled && "opacity-50",
        isDragging && "opacity-80 rotate-2 scale-105"
      )}
      whileHover={!disabled ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-rebuild-yellow">
          <GripVertical size={12} className="blog-drag-handle" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3 xs:mb-4 pl-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm xs:text-base font-semibold text-white mb-2 line-clamp-2 blog-title-text">
            {post.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="text-xs blog-category-badge"
            >
              {post.category || 'Uncategorized'}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 ml-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(post)}
            disabled={disabled}
            className={cn(
              "h-7 xs:h-8 w-7 xs:w-8 p-0 border-gray-600 hover:border-rebuild-yellow hover:text-rebuild-yellow",
              "blog-action-button"
            )}
          >
            <Edit2 size={12} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(post.id!)}
            disabled={disabled}
            className={cn(
              "h-7 xs:h-8 w-7 xs:w-8 p-0 border-gray-600 hover:border-red-500 hover:text-red-400",
              "blog-action-button"
            )}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      {/* Featured Image */}
      <div className="mb-3 xs:mb-4">
        {post.image ? (
          <div className="w-full h-32 xs:h-40 rounded-lg overflow-hidden blog-image-container">
            <ResponsiveImage 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        ) : (
          <div className="w-full h-32 xs:h-40 bg-gray-700 rounded-lg flex items-center justify-center blog-image-placeholder">
            <FileText size={24} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* Excerpt */}
      <div className="mb-3 xs:mb-4">
        <p className="text-xs xs:text-sm text-gray-300 line-clamp-3 blog-excerpt-text">
          {post.excerpt || 'No excerpt available...'}
        </p>
      </div>

      {/* Author & Date */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 text-xs xs:text-sm">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <User size={12} className="text-gray-400 shrink-0" />
            <span className="text-gray-400">Author</span>
          </div>
          <span className="text-white blog-author-text">
            {post.author || 'Unknown Author'}
          </span>
        </div>
        
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Calendar size={12} className="text-gray-400 shrink-0" />
            <span className="text-gray-400">Published</span>
          </div>
          <span className="text-gray-300 blog-date-text">
            {formatDate(post.createdAt, post.date)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminBlogCard;
