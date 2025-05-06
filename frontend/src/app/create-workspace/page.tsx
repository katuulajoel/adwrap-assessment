'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WorkspaceForm from '@/components/workspaces/WorkspaceForm';
import MediaItemForm from '@/components/media-items/MediaItemForm';
import { Workspace } from '@/types';

export default function CreateWorkspacePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  const handleWorkspaceCreated = (newWorkspace: Workspace) => {
    setWorkspace(newWorkspace);
    setCurrentStep(2);
  };

  const handleFinish = () => {
    // Navigate to the workspace details page
    if (workspace) {
      router.push(`/media-items?workspace=${workspace.id}`);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New Workspace</h1>

      <div className="max-w-3xl mx-auto space-y-6">
        {currentStep === 1 && <WorkspaceForm onSuccess={handleWorkspaceCreated} />}

        {currentStep === 2 && workspace && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Workspace: {workspace.name}</h2>
              <button
                onClick={handleFinish}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Finish & View Workspace
              </button>
            </div>

            <MediaItemForm workspaceId={workspace.id} onSuccess={() => {}} />
          </>
        )}
      </div>
    </div>
  );
}
