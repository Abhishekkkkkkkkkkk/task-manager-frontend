import { Task } from '@/types';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Circle, Clock, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
  IN_PROGRESS: { label: 'In progress', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export const TaskCard = ({ task, onEdit, onDelete, onToggle }: TaskCardProps) => {
  const status = statusConfig[task.status];
  const isCompleted = task.status === 'COMPLETED';

  return (
    <div className={cn(
      'bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 transition-opacity',
      isCompleted && 'opacity-70'
    )}>
      <div className="flex items-start gap-3">
        <button onClick={() => onToggle(task.id)} className="mt-0.5 text-gray-400 hover:text-indigo-600 transition-colors shrink-0">
          {isCompleted ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={cn('font-medium text-gray-900 dark:text-white text-sm', isCompleted && 'line-through text-gray-400')}>
            {task.title}
          </p>
          {task.description && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{task.description}</p>
          )}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', status.color)}>
              {status.label}
            </span>
            {task.dueDate && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isCompleted && (
            <Button size="sm" variant="ghost" onClick={() => onToggle(task.id)}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => onEdit(task)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(task.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};