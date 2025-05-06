'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mediaItemApi } from '@/services/api';
import MediaItemForm from '@/components/media-items/MediaItemForm';
import { MediaItem } from '@/types';

interface Params {
  id: string;
}

export default function EditMediaItemPage({ params }: { params: Promise<Params> }) {
  const router = useRouter();
  const { id } = use(params);
  const mediaItemId = parseInt(id, 10);

  const [mediaItem, setMediaItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaItem = async () => {
      if (isNaN(mediaItemId)) {
        setError('Invalid media item ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await mediaItemApi.getById(mediaItemId);
        setMediaItem(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load media item');
        console.error('Error loading media item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaItem();
  }, [mediaItemId]);

  const handleMediaItemUpdated = (updated: MediaItem) => {
    // Redirect to the media items page
    router.push(`/media-items?workspace=${updated.workspace_id}`);
  };

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

      {error && <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">{error}</div>}

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2">Loading media item...</p>
        </div>
      ) : mediaItem ? (
        <div className="max-w-3xl mx-auto">
          <MediaItemForm
            workspaceId={mediaItem.workspace_id}
            initialData={mediaItem}
            isEditing={true}
            onSuccess={handleMediaItemUpdated}
          />
        </div>
      ) : (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          Media item not found. It may have been deleted or you might not have permission to view
          it.
        </div>
      )}
    </div>
  );
}
