import { NextRequest, NextResponse } from 'next/server';
import {
  ALL_MEDIA_CATALOG,
  HERO_FEATURED_ITEMS,
  TRENDING_MOVIES,
  TRENDING_SERIES,
  BECAUSE_YOU_WATCHED_ODYSSEY,
  NETFLIX_MOVIES,
  NETFLIX_SERIES,
  BASED_ON_TRUE_STORY,
  STREAMING_PROVIDERS
} from '@/lib/tmdb-data';
import { MediaItem } from '@/types/tmdb';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get('endpoint') || 'home';
  const query = searchParams.get('query') || '';
  const type = (searchParams.get('type') as 'movie' | 'tv') || 'movie';
  const id = searchParams.get('id');
  const provider = searchParams.get('provider')?.toLowerCase();
  const genre = searchParams.get('genre')?.toLowerCase();

  const apiKey = req.headers.get('x-tmdb-key') || process.env.TMDB_API_KEY || '';

  // If TMDB API key is provided and valid, try real TMDB API first with fallback
  if (apiKey && apiKey.trim() !== '') {
    try {
      let tmdbUrl = '';
      if (endpoint === 'trending_movies') {
        tmdbUrl = `${TMDB_BASE_URL}/trending/movie/week?api_key=${apiKey}`;
      } else if (endpoint === 'trending_tv') {
        tmdbUrl = `${TMDB_BASE_URL}/trending/tv/week?api_key=${apiKey}`;
      } else if (endpoint === 'search' && query) {
        tmdbUrl = `${TMDB_BASE_URL}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
      } else if (endpoint === 'details' && id) {
        tmdbUrl = `${TMDB_BASE_URL}/${type}/${id}?api_key=${apiKey}&append_to_response=videos,credits,similar,watch/providers`;
      } else if (endpoint === 'discover' && provider) {
        tmdbUrl = `${TMDB_BASE_URL}/discover/${type}?api_key=${apiKey}&sort_by=popularity.desc`;
      }

      if (tmdbUrl) {
        const response = await fetch(tmdbUrl, { next: { revalidate: 3600 } });
        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({ success: true, source: 'tmdb_live', data });
        }
      }
    } catch (err) {
      console.warn('TMDB API fetch fallback to local curated data:', err);
    }
  }

  // Curated fallback endpoints
  if (endpoint === 'home') {
    return NextResponse.json({
      success: true,
      source: 'local_tmdb_cache',
      hero: HERO_FEATURED_ITEMS,
      providers: STREAMING_PROVIDERS,
      trendingMovies: TRENDING_MOVIES,
      trendingSeries: TRENDING_SERIES,
      recommended: BECAUSE_YOU_WATCHED_ODYSSEY,
      netflixMovies: NETFLIX_MOVIES,
      netflixSeries: NETFLIX_SERIES,
      basedOnTrueStory: BASED_ON_TRUE_STORY
    });
  }

  if (endpoint === 'trending_movies') {
    return NextResponse.json({ success: true, results: TRENDING_MOVIES });
  }

  if (endpoint === 'trending_tv') {
    return NextResponse.json({ success: true, results: TRENDING_SERIES });
  }

  if (endpoint === 'search') {
    const q = query.toLowerCase().trim();
    const results = ALL_MEDIA_CATALOG.filter((item) => {
      const matchTitle = (item.title || item.name || '').toLowerCase().includes(q);
      const matchOverview = (item.overview || '').toLowerCase().includes(q);
      const matchGenre = (item.genres || []).some((g) => g.toLowerCase().includes(q));
      return matchTitle || matchOverview || matchGenre;
    });
    return NextResponse.json({ success: true, results, count: results.length });
  }

  if (endpoint === 'details' && id) {
    const found = ALL_MEDIA_CATALOG.find((item) => item.id === Number(id));
    if (found) {
      return NextResponse.json({ success: true, data: found });
    }
    return NextResponse.json({ success: false, message: 'Media not found' }, { status: 404 });
  }

  if (endpoint === 'by_provider' && provider) {
    const matched = ALL_MEDIA_CATALOG.filter((item) =>
      item.providers?.some((p) => p.toLowerCase().includes(provider))
    );
    return NextResponse.json({ success: true, results: matched });
  }

  if (endpoint === 'movies') {
    let movies = ALL_MEDIA_CATALOG.filter((item) => item.media_type === 'movie');
    if (genre && genre !== 'all') {
      movies = movies.filter((m) => m.genres?.some((g) => g.toLowerCase() === genre));
    }
    return NextResponse.json({ success: true, results: movies });
  }

  if (endpoint === 'shows') {
    let shows = ALL_MEDIA_CATALOG.filter((item) => item.media_type === 'tv');
    if (genre && genre !== 'all') {
      shows = shows.filter((s) => s.genres?.some((g) => g.toLowerCase() === genre));
    }
    return NextResponse.json({ success: true, results: shows });
  }

  return NextResponse.json({ success: true, results: ALL_MEDIA_CATALOG });
}
