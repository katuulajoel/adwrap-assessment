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
          <p className="text-gray-600 mt-2">
            Manage your company workspaces
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

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
        <h2 className="text-xl font-semibold mb-2">{workspace.name}</h2>
        
        <div className="space-y-2 mb-4">
          {workspace.email && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Email:</span> {workspace.email}
            </p>
          )}
          {workspace.location && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Location:</span> {workspace.location}
            </p>
          )}
          {workspace.address && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Address:</span> {workspace.address}
            </p>
          )}
        </div>
        
        <Link 
          href={`/media-items?workspace=${workspace.id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          View media items &rarr;
        </Link>
      </div>
    </div>
  );
}