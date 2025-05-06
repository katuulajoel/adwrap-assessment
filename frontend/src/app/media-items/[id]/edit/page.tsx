'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import MediaItemForm from '@/components/media-items/MediaItemForm';
import { MediaItem } from '@/types';
import { mediaItemApi } from '@/services/api';

export default function EditMediaItemPage() {
  const router = useRouter();
  const params = useParams();
  const mediaItemId = parseInt(params.id as string, 10);

  const [mediaItem, setMediaItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaItem = async () => {
      try {
        const data = await mediaItemApi.getById(mediaItemId);
        setMediaItem(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load media item');
        console.error('Error loading media item:', err);
      } finally {
        setLoading(false);
      }
    };

    if (mediaItemId) {
      fetchMediaItem();
    }
  }, [mediaItemId]);

  const handleMediaItemUpdated = (updatedMediaItem: MediaItem) => {
    // Navigate back to media item details or workspace page
    router.push(`/media-items/${updatedMediaItem.id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Loading media item data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">Error: {error}</div>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Media Item</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        {mediaItem && (
          <MediaItemForm
            workspaceId={mediaItem.workspace_id}
            initialData={mediaItem}
            isEditing={true}
            onSuccess={handleMediaItemUpdated}
          />
        )}
      </div>
    </div>
  );
}
