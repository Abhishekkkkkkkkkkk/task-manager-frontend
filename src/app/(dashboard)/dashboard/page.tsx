'use client';
import { useState } from 'react';
import { useTasks } from '@/lib/hooks/useTasks';
import { useAuth } from '@/lib/hooks/useAuth';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskModal } from '@/components/tasks/TaskModal';
import { TaskFiltersBar } from '@/components/tasks/TaskFilters';
import { Button } from '@/components/ui/Button';
import { Task } from '@/types';
import { Plus, LogOut, ListTodo, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const {
    tasks,
    meta,
    loading,
    filters,
    applyFilters,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  } = useTasks();

  const { logout } = useAuth();

  // Modal state — undefined task = create mode, defined task = edit mode
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const openCreateModal = () => {
    setEditingTask(undefined);  // clear any previous edit
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(undefined);
  };

  const handleSubmit = async (data: Partial<Task>) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Sticky header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ListTodo className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">TaskFlow</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        {/* Page title + New task button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              My tasks
            </h1>
            {meta && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {meta.total} task{meta.total !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4" />
            New task
          </Button>
        </div>

        {/* Search + filter bar */}
        <TaskFiltersBar filters={filters} onChange={applyFilters} />

        {/* Task list — handles loading, empty, and populated states */}
        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onToggle={toggleTask}
        />

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!meta.hasPrev}
              onClick={() =>
                applyFilters({ ...filters, page: (filters.page || 1) - 1 })
              }
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {meta.page} of {meta.totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={!meta.hasNext}
              onClick={() =>
                applyFilters({ ...filters, page: (filters.page || 1) + 1 })
              }
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>

      {/* Task create / edit modal */}
      <TaskModal
        open={modalOpen}
        onClose={closeModal}
        task={editingTask}
        onSubmit={handleSubmit}
      />
    </div>
  );
}