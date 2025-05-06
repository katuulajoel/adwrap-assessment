'use client';

import { useEffect, useState } from 'react';
import { MediaItemWithRelatedData, MediaType, Workspace } from '@/types';
import { mediaItemApi, workspaceApi } from '@/services/api';
import { MediaItemsTable } from '@/components/media-items/MediaItemsTable';
import { SearchBar } from '@/components/ui/SearchBar';
import Link from 'next/link';
import { Suspense } from 'react';

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

// Content component that uses useSearchParams
import { useSearchParams, usePathname } from 'next/navigation';

function MediaItemsContent() {
  const [filteredItems, setFilteredItems] = useState<MediaItemWithRelatedData[]>([]);
  const [allItems, setAllItems] = useState<MediaItemWithRelatedData[]>([]);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const searchParams = useSearchParams();
  const workspaceId = searchParams.get('workspace');
  const mediaType = searchParams.get('type') as MediaType | null;
  const pathname = usePathname();

  const itemToDelete = allItems.find(item => item.id === deleteItemId);

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

  // Handle delete click
  const handleDeleteClick = (id: number) => {
    setDeleteItemId(id);
    setShowDeleteDialog(true);
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteItemId(null);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      setIsDeleting(true);
      await mediaItemApi.delete(deleteItemId);

      // Remove the deleted item from both arrays
      setAllItems(allItems.filter(item => item.id !== deleteItemId));
      setFilteredItems(filteredItems.filter(item => item.id !== deleteItemId));

      setShowDeleteDialog(false);
      setDeleteItemId(null);
    } catch (err) {
      console.error('Error deleting media item:', err);
      setError('Failed to delete media item. Please try again later.');
    } finally {
      setIsDeleting(false);
    }
  };

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
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-['Inter'] text-[20px] font-bold leading-7">
            Media Items
            {filteredItems.length > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredItems.length} items)
              </span>
            )}
          </h1>

          <Link
            href={
              workspaceId ? `/create-media-item?workspace=${workspaceId}` : `/create-media-item`
            }
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm"
          >
            Add New Media Item
          </Link>
        </div>

        <div className="max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search media items..."
          />
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

        <MediaItemsTable
          items={filteredItems}
          isLoading={isLoading}
          onDeleteItem={handleDeleteClick}
          activeFilter={mediaType}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Delete Media Item</h3>
            <p className="mb-6">
              Are you sure you want to delete the media item &quot;{itemToDelete?.name}&quot;? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main page component wrapped in Suspense
export default function MediaItemsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2">Loading media items...</p>
        </div>
      }
    >
      <MediaItemsContent />
    </Suspense>
  );
}
