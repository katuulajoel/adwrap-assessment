import { useState } from 'react';
import { MediaItem, MediaItemWithRelatedData, StaticMediaFace, Route } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

type ExpandedRowsState = {
  [key: number]: boolean;
};

interface MediaItemsTableProps {
  items: MediaItemWithRelatedData[];
  isLoading?: boolean;
}

export function MediaItemsTable({ items, isLoading = false }: MediaItemsTableProps) {
  const [expandedRows, setExpandedRows] = useState<ExpandedRowsState>({});

  const toggleRow = (itemId: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading media items...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No media items found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <>
              <tr 
                key={item.id} 
                className={`hover:bg-gray-50 ${expandedRows[item.id] ? 'bg-gray-50' : ''} cursor-pointer`}
                onClick={() => toggleRow(item.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {expandedRows[item.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.tracking_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.type.replace('_', ' ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location || '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${item.availability === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {item.availability || 'Available'}
                  </span>
                </td>
              </tr>
              {expandedRows[item.id] && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 bg-gray-50">
                    {item.type === 'billboard' ? (
                      <FacesTable faces={item.faces || []} />
                    ) : (
                      <RoutesTable routes={item.routes || []} />
                    )}
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface FacesTableProps {
  faces: StaticMediaFace[];
}

function FacesTable({ faces }: FacesTableProps) {
  if (faces.length === 0) {
    return <p className="text-gray-500 text-sm italic">No faces available for this billboard</p>;
  }
  
  return (
    <div className="pl-8 border-l-4 border-blue-500">
      <h4 className="font-medium text-blue-700 mb-3">Billboard Faces</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
          <thead className="bg-blue-50">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Face Name</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {faces.map((face) => (
              <tr key={face.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{face.face_name}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{face.dimensions || '—'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${face.availability === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {face.availability || 'Available'}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{face.rent ? `$${face.rent}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface RoutesTableProps {
  routes: Route[];
}

function RoutesTable({ routes }: RoutesTableProps) {
  if (routes.length === 0) {
    return <p className="text-gray-500 text-sm italic">No routes available for this street pole</p>;
  }
  
  return (
    <div className="pl-8 border-l-4 border-green-500">
      <h4 className="font-medium text-green-700 mb-3">Street Pole Routes</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
          <thead className="bg-green-50">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route Name</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Side</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Poles</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Pole</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {routes.map((route) => (
              <tr key={route.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{route.route_name}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{route.side_route || '—'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{route.distance ? `${route.distance}km` : '—'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{route.number_of_street_poles || '—'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {route.price_per_street_pole ? `$${route.price_per_street_pole}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}