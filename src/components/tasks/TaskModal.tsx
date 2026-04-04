'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Task } from '@/types';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  task?: Task;                               // if provided → edit mode, else → create mode
  onSubmit: (data: Partial<Task>) => Promise<void>;
}

export const TaskModal = ({
  open,
  onClose,
  task,
  onSubmit,
}: TaskModalProps) => {
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(task);

  const handleSubmit = async (data: Partial<Task>) => {
    setLoading(true);
    try {
      await onSubmit(data);
      onClose(); // close modal on success
    } catch {
      // error is already shown via toast inside useTasks hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditMode ? 'Edit task' : 'New task'}
      description={
        isEditMode
          ? 'Update the details of your task'
          : 'Add a new task to your list'
      }
    >
      <TaskForm
        task={task}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
};