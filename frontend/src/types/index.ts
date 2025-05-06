// Workspace types
export interface Workspace {
  id: number;
  name: string;
  email?: string;
  address?: string;
  location?: string;
}

// Media item types
export type MediaType = 'billboard' | 'street_pole';

export interface MediaItem {
  id: number;
  workspace_id: number;
  type: MediaType;
  name: string;
  tracking_id: string;
  format?: string;
  location?: string;
  closest_landmark?: string;
  availability?: string;
  created_at?: string;
  updated_at?: string;
}

// Static Media Face type
export interface StaticMediaFace {
  id: number;
  media_item_id: number;
  face_name: string;
  description?: string;
  availability?: string;
  rent?: number;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

// Route type for street poles
export interface Route {
  id: number;
  media_item_id: number;
  route_name: string;
  side_route?: string;
  description?: string;
  price_per_street_pole?: number;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

// Media item with related data
export interface MediaItemWithRelatedData extends MediaItem {
  faces?: StaticMediaFace[];
  routes?: Route[];
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
