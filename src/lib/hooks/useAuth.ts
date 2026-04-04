'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../api';
import { setTokens, clearTokens } from '../auth';
import { User } from '@/types';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const register = useCallback(async (data: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      const { user, accessToken, refreshToken } = res.data.data;
      setTokens(accessToken, refreshToken);
      toast.success(`Welcome, ${user.name}!`);
      router.push('/dashboard');
      return user as User;
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const login = useCallback(async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      const { user, accessToken, refreshToken } = res.data.data;
      setTokens(accessToken, refreshToken);
      toast.success(`Welcome back, ${user.name}!`);
      router.push('/dashboard');
      return user as User;
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || 'Login failed';
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) await api.post('/auth/logout', { refreshToken });
    } finally {
      clearTokens();
      router.push('/login');
    }
  }, [router]);

  return { register, login, logout, loading };
};