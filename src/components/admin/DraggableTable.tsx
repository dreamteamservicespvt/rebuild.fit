import React, { ReactNode } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AdminTable,
  TableHeader,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from './AdminTable';

interface DraggableItem {
  id?: string;
  order?: number;
  [key: string]: any;
}

interface DraggableTableProps<T extends DraggableItem> {
  items: T[];
  onReorder: (reorderedItems: T[]) => void;
  headers: string[];
  renderRow: (item: T, isDragging?: boolean) => ReactNode[];
  className?: string;
  disabled?: boolean;
}

interface SortableRowProps {
  id: string;
  children: ReactNode;
  isDragging?: boolean;
}

const SortableRow = ({ id, children, isDragging }: SortableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isCurrentlyDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        'border-b border-gray-700 hover:bg-rebuild-darkgray/50 transition-colors relative group',
        (isDragging || isCurrentlyDragging) && 'opacity-50 shadow-lg z-10',
        isCurrentlyDragging && 'bg-rebuild-yellow/10 border-rebuild-yellow/30'
      )}
    >
      {/* Drag Handle */}
      <td className="w-4 p-2 cursor-grab active:cursor-grabbing">
        <div
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-gray-700/50"
        >
          <GripVertical size={16} className="text-gray-400 hover:text-rebuild-yellow" />
        </div>
      </td>
      {children}
    </tr>
  );
};

export function DraggableTable<T extends DraggableItem>({
  items,
  onReorder,
  headers,
  renderRow,
  className,
  disabled = false,
}: DraggableTableProps<T>) {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  const [draggedItem, setDraggedItem] = React.useState<T | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sort items by order field, fallback to creation date or index
  const sortedItems = React.useMemo(() => {
    return [...items].filter(item => item.id).sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      
      // Fallback to createdAt if available
      if (a.createdAt && b.createdAt) {
        return a.createdAt.toMillis() - b.createdAt.toMillis();
      }
      
      return 0;
    });
  }, [items]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
    
    const item = sortedItems.find(item => item.id === active.id);
    setDraggedItem(item || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sortedItems.findIndex(item => item.id === active.id);
      const newIndex = sortedItems.findIndex(item => item.id === over?.id);
      
      const reorderedItems = arrayMove(sortedItems, oldIndex, newIndex);
      
      // Update order values
      const itemsWithNewOrder = reorderedItems.map((item, index) => ({
        ...item,
        order: index,
      }));
      
      onReorder(itemsWithNewOrder);
    }

    setActiveId(null);
    setDraggedItem(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDraggedItem(null);
  };

  if (disabled) {
    // Render regular table without drag functionality
    return (
      <AdminTable className={className}>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map(item => (
            <TableRow key={item.id}>
              {renderRow(item)}
            </TableRow>
          ))}
        </TableBody>
      </AdminTable>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <AdminTable className={className}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-4"> </TableHead>
            {headers.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext
            items={sortedItems.map(item => item.id!).filter(Boolean)}
            strategy={verticalListSortingStrategy}
          >
            {sortedItems.map(item => (
              <SortableRow
                key={item.id}
                id={item.id!}
                isDragging={activeId === item.id}
              >
                {renderRow(item, activeId === item.id)}
              </SortableRow>
            ))}
          </SortableContext>
        </TableBody>
      </AdminTable>
      
      <DragOverlay>
        {activeId && draggedItem ? (
          <div className="bg-rebuild-darkgray border border-rebuild-yellow/30 rounded-lg p-4 shadow-2xl">
            <div className="flex items-center space-x-4">
              <GripVertical size={16} className="text-rebuild-yellow" />
              <div className="text-white font-medium">
                Dragging: {draggedItem.name || draggedItem.title || 'Item'}
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
