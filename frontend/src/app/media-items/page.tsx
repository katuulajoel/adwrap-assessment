'use client';

import { useEffect, useState } from 'react';
import { MediaItemWithRelatedData, MediaType, Workspace } from '@/types';
import { mediaItemApi, workspaceApi } from '@/services/api';
import { MediaItemsTable } from '@/components/media-items/MediaItemsTable';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';

// Filter link component to reduce repetition
interface FilterLinkProps {
  href: string;
  label: string;
  count: number;
  isActive: boolean;
}

const FilterLink = ({ href, label, count, isActive }: FilterLinkProps) => (
  <Link
    href={href}
    className={`
      inline-flex items-center font-['Inter'] text-[12.6px] tracking-[2%] leading-[18px]
      ${
        isActive
          ? 'font-bold text-blue-600 border-b-2 border-blue-600 pb-1'
          : 'font-medium text-gray-700 hover:text-blue-600'
      }
    `}
  >
    {label}
    <span
      className={`
        ml-2 inline-flex justify-center items-center w-[16.8px] h-[15px] text-xs rounded-[11.7px] px-[5.4px]
        ${isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}
      `}
    >
      {count}
    </span>
  </Link>
);

export default function MediaItemsPage() {
  const [filteredItems, setFilteredItems] = useState<MediaItemWithRelatedData[]>([]);
  const [allItems, setAllItems] = useState<MediaItemWithRelatedData[]>([]);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const searchParams = useSearchParams();
  const workspaceId = searchParams.get('workspace');
  const mediaType = searchParams.get('type') as MediaType | null;
  const pathname = usePathname();

  // Calculate counts for filter badges - using all items to show consistent totals
  const counts = {
    all: allItems.length,
    billboard: allItems.filter(item => item.type === 'billboard').length,
    street_pole: allItems.filter(item => item.type === 'street_pole').length,
  };

  // Handle search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      // If no search query, just apply the media type filter
      if (mediaType) {
        setFilteredItems(allItems.filter(item => item.type === mediaType));
      } else {
        setFilteredItems(allItems);
      }
      return;
    }

    // Apply search filter to items
    const lowerCaseSearch = searchQuery.toLowerCase();
    let searchResults = allItems.filter(
      item =>
        item.name.toLowerCase().includes(lowerCaseSearch) ||
        item.tracking_id.toLowerCase().includes(lowerCaseSearch) ||
        (item.location && item.location.toLowerCase().includes(lowerCaseSearch))
    );

    // Also apply media type filter if active
    if (mediaType) {
      searchResults = searchResults.filter(item => item.type === mediaType);
    }

    setFilteredItems(searchResults);
  }, [searchQuery, allItems, mediaType]);

  useEffect(() => {
    async function fetchMediaItems() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch workspace details if workspaceId is provided
        if (workspaceId) {
          try {
            const workspaceData = await workspaceApi.getById(Number(workspaceId));
            setWorkspace(workspaceData);
          } catch (err) {
            console.error('Error fetching workspace:', err);
          }
        }

        // Fetch media items based on workspace filter
        let items: MediaItemWithRelatedData[] = [];

        if (workspaceId) {
          const workspaceItems = await mediaItemApi.getByWorkspaceId(Number(workspaceId));
          items = await Promise.all(workspaceItems.map(item => mediaItemApi.getById(item.id)));
        } else {
          const allMediaItems = await mediaItemApi.getAll();
          items = await Promise.all(allMediaItems.map(item => mediaItemApi.getById(item.id)));
        }

        // Store all fetched items
        setAllItems(items);

        // Apply media type filter if provided
        if (mediaType) {
          setFilteredItems(items.filter(item => item.type === mediaType));
        } else {
          setFilteredItems(items);
        }
      } catch (err) {
        console.error('Error fetching media items:', err);
        setError('Failed to load media items. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMediaItems();
  }, [workspaceId, mediaType]);

  // Create the query string for filter links
  const createFilterUrl = (type: string | null) => {
    const params = new URLSearchParams();
    if (workspaceId) params.set('workspace', workspaceId);
    if (type) params.set('type', type);
    return `${pathname}?${params.toString()}`;
  };

  // Filter options to display
  const filterOptions = [
    { type: null, label: 'All', count: counts.all },
    { type: 'billboard', label: 'Billboards', count: counts.billboard },
    { type: 'street_pole', label: 'Street Poles', count: counts.street_pole },
  ];

  return (
    <div className="container mx-auto">
      {workspace && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h1 className="font-['Inter'] text-[20px] font-bold leading-7 mb-2 align-middle">
            {workspace.name}
          </h1>
          <div className="font-['Inter'] text-[14px] font-normal leading-6 text-[#7B7B7B] mb-4">
            <p className="mb-1">{workspace.email || 'No email provided'}</p>
            <p className="mb-1">{workspace.location || 'No location provided'}</p>
            <p>{workspace.address || 'No address provided'}</p>
          </div>
        </div>
      )}

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">{error}</div>}

      <div className="bg-white shadow rounded-lg overflow-hidden p-6">
        <h1 className="font-['Inter'] text-[20px] font-bold leading-7 mb-4">
          Media Items
          {filteredItems.length > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredItems.length} items)
            </span>
          )}
        </h1>

        <div className="relative w-full sm:w-auto sm:min-w-[240px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search media items..."
            className="w-full pl-10 pr-8 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery('')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="p-4 border-b">
          <div className="flex gap-6">
            {filterOptions.map(option => (
              <FilterLink
                key={option.label}
                href={createFilterUrl(option.type)}
                label={option.label}
                count={option.count}
                isActive={option.type === mediaType || (option.type === null && mediaType === null)}
              />
            ))}
          </div>
        </div>

        <MediaItemsTable items={filteredItems} isLoading={isLoading} />
      </div>
    </div>
  );
}
