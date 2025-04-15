import type { FormatType, SideRoute } from './types';

export type Route = {
  id: number;
  sideRoute: SideRoute;
  description: string;
  numberOfStreetPoles: number;
  pricePerStreetPole: number;
  images: string[];
  mediaItem: number; // refers to parent StreetPoleMedia ID
};

export type StreetPoleMedia = {
  id: number;
  type: 'streetpole';
  workspace: number;
  location: string;
  closestLandmark: string;
  numberOfStreetPoles: number;
  sideRoute: SideRoute[];
  availability: string;
  routes: Route[];
};