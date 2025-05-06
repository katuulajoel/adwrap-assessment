'use client';

import { useState, useEffect } from 'react';
import { Workspace } from '@/types';
import { workspaceApi } from '@/services/api';
import Link from 'next/link';

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchWorkspaces();
  }, []);

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
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}
    </div>
  );
}

interface WorkspaceCardProps {
  workspace: Workspace;
}

function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-2 bg-blue-500"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-['Inter'] text-[20px] font-bold leading-7 align-middle">
            {workspace.name}
          </h2>
          <Link
            href={`/workspaces/${workspace.id}/edit`}
            className="text-gray-600 hover:text-gray-900"
          >
            <span className="sr-only">Edit</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </Link>
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
          <Link
            href={`/workspaces/${workspace.id}/delete`}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </Link>
        </div>
      </div>
    </div>
  );
}
