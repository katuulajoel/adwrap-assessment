'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import WorkspaceForm from '@/components/workspaces/WorkspaceForm';
import { Workspace } from '@/types';
import { workspaceApi } from '@/services/api';

export default function EditWorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = parseInt(params.id as string, 10);

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const data = await workspaceApi.getById(workspaceId);
        setWorkspace(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load workspace');
        console.error('Error loading workspace:', err);
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) {
      fetchWorkspace();
    }
  }, [workspaceId]);

  const handleWorkspaceUpdated = (updatedWorkspace: Workspace) => {
    router.push(`/media-items?workspace=${updatedWorkspace.id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Loading workspace data...</p>
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
        <h1 className="text-3xl font-bold">Edit Workspace</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        {workspace && (
          <WorkspaceForm
            initialData={workspace}
            isEditing={true}
            onSuccess={handleWorkspaceUpdated}
          />
        )}
      </div>
    </div>
  );
}
