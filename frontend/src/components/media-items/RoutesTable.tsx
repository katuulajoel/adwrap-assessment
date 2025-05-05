import React from 'react';
import { Route } from '@/types';

interface RoutesTableProps {
  routes: Route[];
}

export function RoutesTable({ routes }: RoutesTableProps) {
  if (routes.length === 0) {
    return <p className="text-gray-500 text-sm italic">No routes available for this street pole</p>;
  }

  // Table header style class for nested tables
  const nestedTableHeaderStyle =
    'px-4 py-2 text-left text-[12.6px] leading-[21.6px] font-bold text-gray-500';

  return (
    <div className="pl-8 border-l-4 border-green-500">
      <h4 className="font-medium text-green-700 mb-3">Street Pole Routes</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
          <thead className="bg-green-50">
            <tr>
              <th scope="col" className={nestedTableHeaderStyle}>
                Route Name
              </th>
              <th scope="col" className={nestedTableHeaderStyle}>
                Side
              </th>
              <th scope="col" className={nestedTableHeaderStyle}>
                Distance
              </th>
              <th scope="col" className={nestedTableHeaderStyle}>
                Number of Poles
              </th>
              <th scope="col" className={nestedTableHeaderStyle}>
                Price/Pole
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {routes.map(route => (
              <tr key={route.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {route.route_name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {route.side_route || '—'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {route.distance ? `${route.distance}km` : '—'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {route.number_of_street_poles || '—'}
                </td>
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
