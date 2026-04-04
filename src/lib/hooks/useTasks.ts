'use client';
import { useState, useCallback, useEffect } from 'react';
import { api } from '../api';
import { Task, TaskFilters, TaskMeta } from '@/types';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meta, setMeta] = useState<TaskMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({ page: 1 });

  const fetchTasks = useCallback(async (f?: TaskFilters) => {
    setLoading(true);
    try {
      const params = { ...filters, ...f };
      const res = await api.get('/tasks', { params });
      setTasks(res.data.data);
      setMeta(res.data.meta);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = useCallback(async (data: Partial<Task>) => {
    const res = await api.post('/tasks', data);
    toast.success('Task created!');
    setTasks((prev) => [res.data.data, ...prev]);
    return res.data.data as Task;
  }, []);

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    const res = await api.patch(`/tasks/${id}`, data);
    toast.success('Task updated!');
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data.data : t)));
    return res.data.data as Task;
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await api.delete(`/tasks/${id}`);
    toast.success('Task deleted');
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    const res = await api.patch(`/tasks/${id}/toggle`);
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data.data : t)));
  }, []);

  const applyFilters = useCallback((f: TaskFilters) => {
    setFilters({ ...f, page: 1 });
  }, []);

  return { tasks, meta, loading, filters, applyFilters, createTask, updateTask, deleteTask, toggleTask, refetch: fetchTasks };
};