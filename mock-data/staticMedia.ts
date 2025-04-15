import type { FormatType } from './types';

export type Face = {
  id: number;
  mediaItem: number; // refers to parent StaticMedia ID
  description: string;
  availability: string;
  images: string[];
  rent: number;
};

export type StaticMedia = {
  id: number;
  type: 'static';
  workspace: number; // Workspace ID
  format: FormatType;
  location: string;
  numberOfFaces: number;
  closestLandmark: string;
  availability: string;
  staticMediaFaces: Face[];
};