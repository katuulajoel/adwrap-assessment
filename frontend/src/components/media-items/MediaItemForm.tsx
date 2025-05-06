'use client';

import { useState } from 'react';
import { MediaItem, MediaType } from '@/types';
import { mediaItemApi } from '@/services/api';

interface MediaItemFormProps {
  workspaceId: number;
  onSuccess?: (mediaItem: MediaItem) => void;
  initialData?: Partial<MediaItem>;
  isEditing?: boolean;
}

export default function MediaItemForm({
  workspaceId,
  onSuccess,
  initialData,
  isEditing = false,
}: MediaItemFormProps) {
  const [mediaType, setMediaType] = useState<MediaType>(initialData?.type || 'billboard');
  const [formData, setFormData] = useState<Partial<MediaItem>>(
    initialData || {
      workspace_id: workspaceId,
      type: 'billboard',
      name: '',
      tracking_id: '',
      format: '',
      location: '',
      closest_landmark: '',
      availability: '',
      number_of_faces: 0,
      number_of_street_poles: 0,
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? '' : parseInt(value, 10) }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as MediaType;
    setMediaType(newType);
    setFormData(prev => ({ ...prev, type: newType }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let result;

      if (isEditing && formData.id) {
        result = await mediaItemApi.update(formData.id, formData);
      } else {
        // Create new media item based on type
        if (mediaType === 'billboard') {
          result = await mediaItemApi.createBillboard(workspaceId, formData);
        } else {
          result = await mediaItemApi.createStreetPole(workspaceId, formData);
        }
      }

      if (onSuccess) onSuccess(result);

      if (!isEditing) {
        // Reset form if not editing
        setFormData({
          workspace_id: workspaceId,
          type: mediaType,
          name: '',
          tracking_id: '',
          format: '',
          location: '',
          closest_landmark: '',
          availability: '',
          number_of_faces: 0,
          number_of_street_poles: 0,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save media item');
      console.error('Error saving media item:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <div className="bg-gray-900 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
          2
        </div>
        <h2 className="text-2xl font-bold">Add Media Item</h2>
      </div>

      <p className="text-gray-500 mb-6">Specify details for your advertising media item</p>

      {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="type" className="block text-gray-700 mb-2">
            Media Type
          </label>
          <select
            id="type"
            name="type"
            value={mediaType}
            onChange={handleTypeChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="billboard">Billboard</option>
            <option value="street_pole">Street Pole</option>
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Media Name
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
          <label htmlFor="tracking_id" className="block text-gray-700 mb-2">
            Tracking ID
          </label>
          <input
            type="text"
            id="tracking_id"
            name="tracking_id"
            value={formData.tracking_id || ''}
            onChange={handleChange}
            required
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
          <label htmlFor="closest_landmark" className="block text-gray-700 mb-2">
            Closest Landmark
          </label>
          <input
            type="text"
            id="closest_landmark"
            name="closest_landmark"
            value={formData.closest_landmark || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="availability" className="block text-gray-700 mb-2">
            Availability
          </label>
          <input
            type="text"
            id="availability"
            name="availability"
            value={formData.availability || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {mediaType === 'billboard' && (
          <div>
            <label htmlFor="number_of_faces" className="block text-gray-700 mb-2">
              Number of Faces
            </label>
            <input
              type="number"
              id="number_of_faces"
              name="number_of_faces"
              value={formData.number_of_faces || ''}
              onChange={handleNumberChange}
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {mediaType === 'street_pole' && (
          <div>
            <label htmlFor="number_of_street_poles" className="block text-gray-700 mb-2">
              Number of Street Poles
            </label>
            <input
              type="number"
              id="number_of_street_poles"
              name="number_of_street_poles"
              value={formData.number_of_street_poles || ''}
              onChange={handleNumberChange}
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label htmlFor="format" className="block text-gray-700 mb-2">
            Format
          </label>
          <input
            type="text"
            id="format"
            name="format"
            value={formData.format || ''}
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
            {loading ? 'Processing...' : isEditing ? 'Update Media Item' : 'Save Media Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
