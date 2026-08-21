import axios from 'axios';
import type { Status, Journal, Dish, Order } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// ============ Status ============

export const statusApi = {
  getAll: () => api.get<Status[]>('/statuses').then((r) => r.data),
  getById: (id: number) => api.get<Status>(`/statuses/${id}`).then((r) => r.data),
  create: (data: { content: string; mood?: string }) =>
    api.post<Status>('/statuses', data).then((r) => r.data),
  update: (id: number, data: { content?: string; mood?: string }) =>
    api.put<Status>(`/statuses/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/statuses/${id}`),
};

// ============ Journal ============

export const journalApi = {
  getAll: () => api.get<Journal[]>('/journals').then((r) => r.data),
  getById: (id: number) => api.get<Journal>(`/journals/${id}`).then((r) => r.data),
  create: (data: { title: string; content: string; mood?: string }) =>
    api.post<Journal>('/journals', data).then((r) => r.data),
  update: (id: number, data: { title?: string; content?: string; mood?: string }) =>
    api.put<Journal>(`/journals/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/journals/${id}`),
};

// ============ Dish ============

export const dishApi = {
  getAll: (params?: { category?: string; available?: boolean }) =>
    api.get<Dish[]>('/dishes', { params }).then((r) => r.data),
  getById: (id: number) => api.get<Dish>(`/dishes/${id}`).then((r) => r.data),
  create: (data: Omit<Dish, 'id' | 'createdAt' | 'updatedAt' | 'orders'>) =>
    api.post<Dish>('/dishes', data).then((r) => r.data),
  update: (id: number, data: Partial<Dish>) =>
    api.put<Dish>(`/dishes/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/dishes/${id}`),
};

// ============ Order ============

export const orderApi = {
  getAll: () =>
    api.get<Order[]>('/orders').then((r) => r.data),
  getById: (id: number) => api.get<Order>(`/orders/${id}`).then((r) => r.data),
  create: (data: { dishId: number; note?: string }) =>
    api.post<Order>('/orders', data).then((r) => r.data),
  updateStatus: (id: number, status: Order['status']) =>
    api.patch<Order>(`/orders/${id}/status`, { status }).then((r) => r.data),
  delete: (id: number) => api.delete(`/orders/${id}`),
};

// ============ Categories ============

export const categoryApi = {
  getAll: () => api.get<string[]>('/categories').then((r) => r.data),
};
