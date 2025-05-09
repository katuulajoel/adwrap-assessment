import React, { useState } from 'react';
import { StaticMediaFace } from '@/types';
import ImageModal from '../ui/ImageModal';
import Image from 'next/image';

interface FacesTableProps {
  faces: StaticMediaFace[];
}

export function FacesTable({ faces }: FacesTableProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (faces.length === 0) {
    return <p className="text-gray-500 text-sm italic">No faces available for this billboard</p>;
  }

  // Table header style class for nested tables
  const nestedTableHeaderStyle = 'px-4 py-2 text-left font-bold text-gray-500';

  return (
    <div className="pl-8 border-l-4 border-blue-500">
      <h4 className="font-medium text-blue-700 mb-3">Billboard Faces</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
          <thead className="bg-blue-50">
            <tr>
              <th scope="col" className={nestedTableHeaderStyle}>
                Description
              </th>
              <th scope="col" className={nestedTableHeaderStyle}>
                Availability
              </th>
              <th scope="col" className={nestedTableHeaderStyle}>
                Rent
              </th>
              <th scope="col" className={nestedTableHeaderStyle}>
                Image
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {faces.map(face => (
              <tr key={face.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {face.description}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${
                      face.availability === 'Available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {face.availability || 'Available'}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {face.rent ? `$${face.rent}` : '—'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {face.image ? (
                    <div
                      className="relative w-10 h-10 cursor-pointer"
                      onClick={() => setSelectedImage(face.image || null)}
                    >
                      <Image
                        src={face.image}
                        alt="Face Image"
                        fill
                        sizes="40px"
                        className="object-cover rounded"
                        unoptimized={face.image.startsWith('http')}
                      />
                    </div>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
