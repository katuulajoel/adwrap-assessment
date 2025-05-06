import React, { useState } from 'react';
import { MediaItemWithRelatedData, MediaType } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FacesTable } from './FacesTable';
import { RoutesTable } from './RoutesTable';
import { EditButton } from '@/components/ui/EditButton';
import { DeleteButton } from '@/components/ui/DeleteButton';

type ExpandedRowsState = {
  [key: number]: boolean;
};

interface MediaItemsTableProps {
  items: MediaItemWithRelatedData[];
  isLoading?: boolean;
  onDeleteItem?: (id: number) => void;
  activeFilter?: MediaType | null;
}

export function MediaItemsTable({
  items,
  isLoading = false,
  onDeleteItem,
  activeFilter = null,
}: MediaItemsTableProps) {
  const [expandedRows, setExpandedRows] = useState<ExpandedRowsState>({});

  const toggleRow = (itemId: number) => {
    setExpandedRows(prev => ({
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

  // Table header style class that matches the specifications
  const tableHeaderStyle =
    'px-6 py-3 text-left text-[12.6px] leading-[21.6px] font-bold text-gray-500';

  // Custom style for ID column values
  const idColumnStyle = 'font-medium text-[12.55px] text-[#0063F7]';

  // Determine which columns to show based on the active filter
  const showBillboardColumns = activeFilter !== 'street_pole';

  return (
    <div className="overflow-x-auto w-full">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className={`${tableHeaderStyle} w-8 sticky left-0 z-10 bg-gray-50`}
                ></th>
                <th scope="col" className={tableHeaderStyle}>
                  ID
                </th>
                <th scope="col" className={tableHeaderStyle}>
                  Name
                </th>
                <th scope="col" className={tableHeaderStyle}>
                  Type
                </th>
                <th scope="col" className={tableHeaderStyle}>
                  Location
                </th>
                <th scope="col" className={tableHeaderStyle}>
                  Closest Landmark
                </th>

                {showBillboardColumns && (
                  <th scope="col" className={tableHeaderStyle}>
                    Format
                  </th>
                )}

                <th scope="col" className={tableHeaderStyle}>
                  Availability
                </th>
                <th scope="col" className={`${tableHeaderStyle} text-right`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map(item => (
                <React.Fragment key={item.id}>
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 ${expandedRows[item.id] ? 'bg-gray-50' : ''}`}
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap text-gray-500 cursor-pointer sticky left-0 z-10 bg-white"
                      onClick={() => toggleRow(item.id)}
                    >
                      {expandedRows[item.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${idColumnStyle}`}>
                      {item.tracking_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {item.type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.location || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.closest_landmark || '—'}
                    </td>

                    {showBillboardColumns && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.format || '—'}
                      </td>
                    )}

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          item.availability === 'Available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.availability || 'Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <EditButton
                          href={`/media-items/${item.id}/edit`}
                          className="inline-block"
                        />
                        {onDeleteItem && (
                          <DeleteButton
                            onClick={() => onDeleteItem(item.id)}
                            iconOnly
                            className="inline-block"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedRows[item.id] && (
                    <tr>
                      <td colSpan={12} className="px-6 py-4 bg-gray-50">
                        {item.type === 'billboard' ? (
                          <FacesTable faces={item.faces || []} />
                        ) : (
                          <RoutesTable routes={item.routes || []} />
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
