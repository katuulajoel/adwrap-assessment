'use client';

import { useState } from 'react';
import { MediaItem, MediaItemWithRelatedData, MediaType, StaticMediaFace, Route } from '@/types';
import { mediaItemApi } from '@/services/api';
import { X, Plus } from 'lucide-react';

interface MediaItemFormProps {
  workspaceId: number;
  onSuccess?: (mediaItem: MediaItem) => void;
  initialData?: Partial<MediaItemWithRelatedData>;
  isEditing?: boolean;
}

// Define the new type for form data to allow partial faces and routes
type MediaItemFormData = Omit<Partial<MediaItemWithRelatedData>, 'faces' | 'routes'> & {
  faces?: Partial<StaticMediaFace>[];
  routes?: Partial<Route>[];
};

export default function MediaItemForm({
  workspaceId,
  onSuccess,
  initialData,
  isEditing = false,
}: MediaItemFormProps) {
  const [mediaType, setMediaType] = useState<MediaType>(initialData?.type || 'billboard');
  const [formData, setFormData] = useState<MediaItemFormData>(
    initialData || {
      workspace_id: workspaceId,
      type: mediaType,
      name: '',
      format: '',
      location: '',
      closest_landmark: '',
      availability: 'Available',
      faces: [],
      routes: [],
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize faces and routes arrays if they don't exist
  if (!formData.faces) formData.faces = [];
  if (!formData.routes) formData.routes = [];

  // Calculate the number of faces dynamically
  const numberOfFaces = formData.faces?.length || 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as MediaType;
    setMediaType(newType);
    setFormData(prev => ({ ...prev, type: newType }));
  };

  // Add a new empty face to the billboard
  const addFace = () => {
    const newFace: Partial<StaticMediaFace> = {
      description: '',
      availability: 'Available',
      rent: 0,
      image: '',
    };

    setFormData(prev => ({
      ...prev,
      faces: [...(prev.faces || []), newFace],
    }));
  };

  // Remove a face from the billboard
  const removeFace = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faces: (prev.faces || []).filter((_, i) => i !== index),
    }));
  };

  // Update face data
  const updateFace = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedFaces = [...(prev.faces || [])];
      updatedFaces[index] = {
        ...updatedFaces[index],
        [field]: field === 'rent' ? (value === '' ? 0 : parseInt(String(value), 10)) : value,
      };
      return { ...prev, faces: updatedFaces };
    });
  };

  // Add a new empty route to the street pole
  const addRoute = () => {
    const newRoute: Partial<Route> = {
      route_name: '',
      side_route: '',
      description: '',
      price_per_street_pole: 0,
      image: '',
    };

    setFormData(prev => ({
      ...prev,
      routes: [...(prev.routes || []), newRoute],
    }));
  };

  // Remove a route from the street pole
  const removeRoute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      routes: (prev.routes || []).filter((_, i) => i !== index),
    }));
  };

  // Update route data
  const updateRoute = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedRoutes = [...(prev.routes || [])];
      const isNumberField = ['price_per_street_pole'].includes(field);
      updatedRoutes[index] = {
        ...updatedRoutes[index],
        [field]: isNumberField ? (value === '' ? 0 : parseInt(String(value), 10)) : value,
      };
      return { ...prev, routes: updatedRoutes };
    });
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
          format: '',
          location: '',
          closest_landmark: '',
          availability: 'Available',
          faces: [],
          routes: [],
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
          <select
            id="availability"
            name="availability"
            value={formData.availability || 'Available'}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
          </select>
        </div>

        {mediaType === 'billboard' && (
          <>
            <div>
              <label htmlFor="format" className="block text-gray-700 mb-2">
                Format
              </label>
              <select
                id="format"
                name="format"
                value={formData.format || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a format</option>
                <option value="standard">Standard</option>
                <option value="unipole">Unipole</option>
                <option value="rooftop">Rooftop</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Number of Faces: {numberOfFaces}</label>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Faces</label>
              {formData.faces.map((face, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Face {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeFace(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor={`description_${index}`} className="block text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        id={`description_${index}`}
                        name={`description_${index}`}
                        value={face.description || ''}
                        onChange={e => updateFace(index, 'description', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor={`availability_${index}`} className="block text-gray-700 mb-2">
                        Availability
                      </label>
                      <select
                        id={`availability_${index}`}
                        name={`availability_${index}`}
                        value={face.availability || 'Available'}
                        onChange={e => updateFace(index, 'availability', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`image_${index}`} className="block text-gray-700 mb-2">
                        Image URL
                      </label>
                      <input
                        type="text"
                        id={`image_${index}`}
                        name={`image_${index}`}
                        value={face.image || ''}
                        onChange={e => updateFace(index, 'image', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor={`rent_${index}`} className="block text-gray-700 mb-2">
                        Rent
                      </label>
                      <input
                        type="number"
                        id={`rent_${index}`}
                        name={`rent_${index}`}
                        value={face.rent || 0}
                        onChange={e => updateFace(index, 'rent', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addFace}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <Plus size={20} className="mr-2" />
                Add Face
              </button>
            </div>
          </>
        )}

        {mediaType === 'street_pole' && (
          <>
            <div>
              <label className="block text-gray-700 mb-2">Routes</label>
              {formData.routes.map((route, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Route {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeRoute(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor={`route_name_${index}`} className="block text-gray-700 mb-2">
                        Route Name
                      </label>
                      <input
                        type="text"
                        id={`route_name_${index}`}
                        name={`route_name_${index}`}
                        value={route.route_name || ''}
                        onChange={e => updateRoute(index, 'route_name', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor={`side_route_${index}`} className="block text-gray-700 mb-2">
                        Side Route
                      </label>
                      <select
                        id={`side_route_${index}`}
                        name={`side_route_${index}`}
                        value={route.side_route || ''}
                        onChange={e => updateRoute(index, 'side_route', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a side route</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`description_${index}`} className="block text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        id={`description_${index}`}
                        name={`description_${index}`}
                        value={route.description || ''}
                        onChange={e => updateRoute(index, 'description', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor={`image_${index}`} className="block text-gray-700 mb-2">
                        Image URL
                      </label>
                      <input
                        type="text"
                        id={`image_${index}`}
                        name={`image_${index}`}
                        value={route.image || ''}
                        onChange={e => updateRoute(index, 'image', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`price_per_street_pole_${index}`}
                        className="block text-gray-700 mb-2"
                      >
                        Price per Street Pole
                      </label>
                      <input
                        type="number"
                        id={`price_per_street_pole_${index}`}
                        name={`price_per_street_pole_${index}`}
                        value={route.price_per_street_pole || 0}
                        onChange={e => updateRoute(index, 'price_per_street_pole', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addRoute}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <Plus size={20} className="mr-2" />
                Add Route
              </button>
            </div>
          </>
        )}

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
