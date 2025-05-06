'use client';

import { useState } from 'react';
import { Workspace } from '@/types';
import { workspaceApi } from '@/services/api';

interface WorkspaceFormProps {
  onSuccess?: (workspace: Workspace) => void;
  initialData?: Partial<Workspace>;
  isEditing?: boolean;
}

export default function WorkspaceForm({
  onSuccess,
  initialData,
  isEditing = false,
}: WorkspaceFormProps) {
  const [formData, setFormData] = useState<Partial<Workspace>>(
    initialData || {
      name: '',
      email: '',
      location: '',
      address: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let result;

      if (isEditing && formData.id) {
        result = await workspaceApi.update(formData.id, formData);
      } else {
        result = await workspaceApi.create(formData);
      }

      if (onSuccess) onSuccess(result);

      if (!isEditing) {
        // Reset form if not editing
        setFormData({
          name: '',
          email: '',
          location: '',
          address: '',
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save workspace');
      console.error('Error saving workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <div className="bg-gray-900 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
          1
        </div>
        <h2 className="text-2xl font-bold">Workspace Details</h2>
      </div>

      <p className="text-gray-500 mb-6">Provide details for your workspace in the fields below</p>

      {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Business name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : isEditing ? 'Update Workspace' : 'Save and Proceed'}
          </button>
        </div>
      </form>
    </div>
  );
}
