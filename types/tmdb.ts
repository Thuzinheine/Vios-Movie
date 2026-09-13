export interface MediaItem {
  id: number;
  title: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  media_type: 'movie' | 'tv';
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count?: number;
  genres?: string[];
  genre_ids?: number[];
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
  trailer_url?: string;
  youtube_id?: string;
  providers?: string[];
  cast?: CastMember[];
  director?: string;
  certification?: string;
  quality?: '4K HDR' | 'HD' | '1080p';
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
}

export interface StreamingProvider {
  id: string;
  name: string;
  logo: string;
  color: string;
  textColor?: string;
  accentBg?: string;
}

export interface MediaSection {
  id: string;
  title: string;
  dropdownOptions?: string[];
  currentOption?: string;
  viewAllLink?: string;
  items: MediaItem[];
}
