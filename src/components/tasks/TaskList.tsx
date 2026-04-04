'use client';
import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { ListTodo } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

// Skeleton loader for a single card
const TaskCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 animate-pulse">
    <div className="flex items-start gap-3">
      {/* Circle checkbox */}
      <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        {/* Title */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        {/* Description */}
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        {/* Badge */}
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
      </div>
      {/* Action buttons */}
      <div className="flex gap-1">
        <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  </div>
);

// Empty state
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
      <ListTodo className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-gray-600 dark:text-gray-400 font-medium">No tasks yet</p>
    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
      Create your first task using the button above
    </p>
  </div>
);

export const TaskList = ({
  tasks,
  loading,
  onEdit,
  onDelete,
  onToggle,
}: TaskListProps) => {
  // Show skeletons while loading
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Show empty state
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  // Group tasks: pending/in-progress first, completed at bottom
  const activeTasks = tasks.filter((t) => t.status !== 'COMPLETED');
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');

  return (
    <div className="space-y-4">
      {/* Active tasks */}
      {activeTasks.length > 0 && (
        <div className="space-y-2">
          {activeTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}

      {/* Completed tasks section */}
      {completedTasks.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">
            Completed ({completedTasks.length})
          </p>
          {completedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};