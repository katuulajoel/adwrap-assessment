'use client';

import { useEffect, useState } from 'react';
import { MediaItemWithRelatedData, Workspace } from '@/types';
import { mediaItemApi, workspaceApi } from '@/services/api';
import { MediaItemsTable } from '@/components/media-items/MediaItemsTable';
import { useSearchParams } from 'next/navigation';

export default function MediaItemsPage() {
  const [mediaItems, setMediaItems] = useState<MediaItemWithRelatedData[]>([]);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get('workspace');
  const mediaType = searchParams.get('type');

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
            // Continue even if workspace fetch fails
          }
        }
        
        // Fetch media items based on filters
        let items: MediaItemWithRelatedData[] = [];
        
        if (workspaceId) {
          // Get media items for specific workspace
          const workspaceItems = await mediaItemApi.getByWorkspaceId(Number(workspaceId));
          
          // For each item, fetch its detailed data with faces or routes
          items = await Promise.all(
            workspaceItems.map(item => mediaItemApi.getById(item.id))
          );
        } else {
          // Get all media items
          const allItems = await mediaItemApi.getAll();
          
          // For each item, fetch its detailed data with faces or routes
          items = await Promise.all(
            allItems.map(item => mediaItemApi.getById(item.id))
          );
        }
        
        // Apply media type filter if provided
        if (mediaType) {
          items = items.filter(item => item.type === mediaType);
        }
        
        setMediaItems(items);
      } catch (err) {
        console.error('Error fetching media items:', err);
        setError('Failed to load media items. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMediaItems();
  }, [workspaceId, mediaType]);

  // Generate page title based on filters
  const generateTitle = () => {
    let title = 'Media Items';
    
    if (workspace) {
      title = `${workspace.name} - Media Items`;
    }
    
    if (mediaType) {
      const type = mediaType === 'billboard' ? 'Billboards' : 'Street Poles';
      title = workspace ? `${workspace.name} - ${type}` : type;
    }
    
    return title;
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{generateTitle()}</h1>
        <p className="text-gray-600 mt-2">
          {workspace 
            ? `Viewing media items for ${workspace.name}`
            : 'View and manage your billboards and street poles advertising spaces'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <MediaItemsTable items={mediaItems} isLoading={isLoading} />
    </div>
  );
}