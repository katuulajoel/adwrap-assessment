'use client';

import { useState, useEffect } from 'react';
import { Workspace } from '@/types';
import { workspaceApi } from '@/services/api';
import Link from 'next/link';
import { EditButton } from '@/components/ui/EditButton';
import { DeleteButton } from '@/components/ui/DeleteButton';

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteWorkspaceId, setDeleteWorkspaceId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const workspaceToDelete = workspaces.find(w => w.id === deleteWorkspaceId);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  async function fetchWorkspaces() {
    try {
      setLoading(true);
      setError(null);
      const data = await workspaceApi.getAll();
      setWorkspaces(data);
    } catch (err) {
      console.error('Error fetching workspaces:', err);
      setError('Failed to load workspaces. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (id: number) => {
    setDeleteWorkspaceId(id);
    setShowDeleteDialog(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteWorkspaceId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteWorkspaceId) return;

    try {
      setIsDeleting(true);
      await workspaceApi.delete(deleteWorkspaceId);
      setWorkspaces(workspaces.filter(workspace => workspace.id !== deleteWorkspaceId));
      setShowDeleteDialog(false);
      setDeleteWorkspaceId(null);
    } catch (err) {
      console.error('Error deleting workspace:', err);
      setError('Failed to delete workspace. Please try again later.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Workspaces</h1>
          <p className="text-gray-600 mt-2">Manage your company workspaces</p>
        </div>
        <Link
          href="/create-workspace"
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Create Workspace
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map(workspace => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Delete Workspace</h3>
            <p className="mb-6">
              Are you sure you want to delete the workspace &quot;{workspaceToDelete?.name}&quot;?
              This action cannot be undone.
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

interface WorkspaceCardProps {
  workspace: Workspace;
  onDeleteClick: (id: number) => void;
}

function WorkspaceCard({ workspace, onDeleteClick }: WorkspaceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-2 bg-blue-500"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-['Inter'] text-[20px] font-bold leading-7 align-middle">
            {workspace.name}
          </h2>
          <EditButton href={`/workspaces/${workspace.id}/edit`} />
        </div>

        <div className="font-['Inter'] text-[14px] font-normal leading-6 text-[#7B7B7B] mb-4">
          <p className="mb-1">{workspace.email || 'No email provided'}</p>
          <p className="mb-1">{workspace.location || 'No location provided'}</p>
          <p>{workspace.address || 'No address provided'}</p>
        </div>

        <div className="flex justify-between items-center">
          <Link
            href={`/media-items?workspace=${workspace.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            View media items &rarr;
          </Link>

          <DeleteButton onClick={() => onDeleteClick(workspace.id)} className="text-sm" />
        </div>
      </div>
    </div>
  );
}
