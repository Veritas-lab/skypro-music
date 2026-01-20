export interface TrackTypes {
  _id: number;
  name: string;
  author: string;
  release_date: string;
  genre: string[];
  duration_in_seconds: number;
  album: string;
  logo: string | null;
  track_file: string;
  starred_user: string[];
}

export interface SelectionTypes {
  _id: string;
  name: string;
  items: TrackTypes[];
  owner: string;
  cover?: string;
  description?: string;
}

export interface UserTypes {
  _id: string;
  email: string;
  username: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
  result?: T;
  detail?: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: UserTypes;
  tokens: TokenResponse;
}

export interface FavoriteOperationResponse {
  message?: string;
  success?: boolean;
  trackId?: string;
  userId?: string;
}

export interface SelectionTypes {
  _id: string;
  name: string;
  items: TrackTypes[];
  tracks?: TrackTypes[];
  owner: string;
}
