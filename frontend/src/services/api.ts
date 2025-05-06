import { MediaItem, MediaItemWithRelatedData, Workspace } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Generic fetch function with error handling
async function fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Workspace related API calls
export const workspaceApi = {
  getAll: () => fetchData<Workspace[]>('/workspaces'),
  getById: (id: number) => fetchData<Workspace>(`/workspaces/${id}`),
  create: (data: Partial<Workspace>) =>
    fetchData<Workspace>('/workspaces', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<Workspace>) =>
    fetchData<Workspace>(`/workspaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchData<{ message: string }>(`/workspaces/${id}`, {
      method: 'DELETE',
    }),
};

// Media Items related API calls
export const mediaItemApi = {
  getAll: () => fetchData<MediaItem[]>('/media-items'),
  getById: (id: number) => fetchData<MediaItemWithRelatedData>(`/media-items/${id}`),
  getByWorkspaceId: (workspaceId: number) =>
    fetchData<MediaItem[]>(`/media-items/workspace/${workspaceId}`),

  createBillboard: (workspaceId: number, data: Partial<MediaItem>) =>
    fetchData<MediaItem>(`/media-items/workspace/${workspaceId}/billboard`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createStreetPole: (workspaceId: number, data: Partial<MediaItem>) =>
    fetchData<MediaItem>(`/media-items/workspace/${workspaceId}/streetpole`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<MediaItem>) =>
    fetchData<MediaItem>(`/media-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    fetchData<{ message: string }>(`/media-items/${id}`, {
      method: 'DELETE',
    }),
};
