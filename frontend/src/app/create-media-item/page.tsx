'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MediaItemForm from '@/components/media-items/MediaItemForm';
import { Workspace, MediaItem } from '@/types';
import { workspaceApi } from '@/services/api';

export default function CreateMediaItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceIdParam = searchParams.get('workspace');
  const workspaceId = workspaceIdParam ? parseInt(workspaceIdParam, 10) : undefined;

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<number | undefined>(workspaceId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        const data = await workspaceApi.getAll();
        setWorkspaces(data);

        // If no workspace was specified in the URL and we have workspaces, select the first one
        if (!workspaceId && data.length > 0) {
          setSelectedWorkspace(data[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load workspaces');
        console.error('Error loading workspaces:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [workspaceId]);

  const handleWorkspaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWorkspace(parseInt(e.target.value, 10));
  };

  const handleMediaItemCreated = (mediaItem: MediaItem) => {
    // Redirect to the workspace's media items page
    router.push(`/media-items?workspace=${mediaItem.workspace_id}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Add New Media Item</h1>
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
          <p className="mt-2">Loading workspaces...</p>
        </div>
      ) : workspaces.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded-md mb-6">
          <p className="text-yellow-700">
            You need to create a workspace before adding media items.
          </p>
          <button
            onClick={() => router.push('/create-workspace')}
            className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Create Workspace
          </button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <label className="block text-gray-700 mb-2">Select Workspace</label>
            <select
              value={selectedWorkspace}
              onChange={handleWorkspaceChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {workspaces.map(workspace => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          </div>

          {selectedWorkspace && (
            <MediaItemForm workspaceId={selectedWorkspace} onSuccess={handleMediaItemCreated} />
          )}
        </div>
      )}
    </div>
  );
}
