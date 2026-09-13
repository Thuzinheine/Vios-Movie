'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { ProviderRow } from '@/components/ProviderRow';
import { MediaCarousel } from '@/components/MediaCarousel';
import { MediaDetailModal } from '@/components/MediaDetailModal';
import { SearchModal } from '@/components/SearchModal';
import { SettingsModal } from '@/components/SettingsModal';
import { FullScreenPosterViewer } from '@/components/FullScreenPosterViewer';
import { Footer } from '@/components/Footer';
import { MediaCard } from '@/components/MediaCard';
import {
  HERO_FEATURED_ITEMS,
  STREAMING_PROVIDERS,
  TRENDING_MOVIES,
  TRENDING_SERIES,
  BECAUSE_YOU_WATCHED_ODYSSEY,
  NETFLIX_MOVIES,
  NETFLIX_SERIES,
  BASED_ON_TRUE_STORY,
  ALL_MEDIA_CATALOG
} from '@/lib/tmdb-data';
import { MediaItem } from '@/types/tmdb';
import { Film, Tv, Bookmark, Filter, RefreshCcw, Maximize2 } from 'lucide-react';

export default function CineJoyHome() {
  const [activeTab, setActiveTab] = useState<'home' | 'movies' | 'shows' | 'mylist'>('home');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [activeDetailMedia, setActiveDetailMedia] = useState<MediaItem | null>(null);
  const [activePlayingMedia, setActivePlayingMedia] = useState<MediaItem | null>(null);
  const [activeFullscreenPoster, setActiveFullscreenPoster] = useState<MediaItem | null>(null);
  const [fullscreenItemsList, setFullscreenItemsList] = useState<MediaItem[]>(ALL_MEDIA_CATALOG);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'my'>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('cinejoy_lang') as 'en' | 'my';
      if (savedLang) return savedLang;
    }
    return 'en';
  });

  const [tmdbApiKey, setTmdbApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('cinejoy_tmdb_key');
      if (savedKey) return savedKey;
    }
    return '';
  });

  const [myList, setMyList] = useState<MediaItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedList = localStorage.getItem('cinejoy_mylist');
      if (savedList) {
        try {
          return JSON.parse(savedList);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Category filter state for Movies & Shows tabs
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'top_rated' | 'latest'>('popular');

  // Dynamic dropdown state for home rows
  const [recommendationSeed, setRecommendationSeed] = useState('The Odyssey');
  const [movieProviderFilter, setMovieProviderFilter] = useState('Netflix');
  const [tvProviderFilter, setTvProviderFilter] = useState('Netflix');

  // Open Full Screen Poster viewer
  const handleOpenPosterFullscreen = (item: MediaItem, list?: MediaItem[]) => {
    setActiveFullscreenPoster(item);
    if (list && list.length > 0) {
      setFullscreenItemsList(list);
    } else {
      setFullscreenItemsList(ALL_MEDIA_CATALOG);
    }
  };

  // Save My List changes to localStorage
  const handleToggleMyList = (item: MediaItem) => {
    setMyList((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      let updated: MediaItem[];
      if (exists) {
        updated = prev.filter((i) => i.id !== item.id);
      } else {
        updated = [item, ...prev];
      }
      try {
        localStorage.setItem('cinejoy_mylist', JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage error:', e);
      }
      return updated;
    });
  };

  const isInMyList = (id: number) => myList.some((i) => i.id === id);

  const handleSaveTmdbApiKey = (key: string) => {
    setTmdbApiKey(key);
    try {
      localStorage.setItem('cinejoy_tmdb_key', key);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  };

  const handleSelectLanguage = (lang: 'en' | 'my') => {
    setLanguage(lang);
    try {
      localStorage.setItem('cinejoy_lang', lang);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  };

  const handleClearWatchlist = () => {
    setMyList([]);
    try {
      localStorage.removeItem('cinejoy_mylist');
    } catch (e) {
      console.warn('Storage error:', e);
    }
  };

  // Filtered lists based on user selections
  const getProviderFilteredMovies = (providerName: string) => {
    return ALL_MEDIA_CATALOG.filter(
      (m) =>
        m.media_type === 'movie' &&
        m.providers?.some((p) => p.toLowerCase().includes(providerName.toLowerCase()))
    );
  };

  const getProviderFilteredTV = (providerName: string) => {
    return ALL_MEDIA_CATALOG.filter(
      (s) =>
        m_isTV(s) &&
        s.providers?.some((p) => p.toLowerCase().includes(providerName.toLowerCase()))
    );
  };

  function m_isTV(item: MediaItem) {
    return item.media_type === 'tv' || Boolean(item.first_air_date);
  }

  // Genre list for filters
  const GENRES = [
    'All',
    'Action',
    'Adventure',
    'Animation',
    'Comedy',
    'Crime',
    'Drama',
    'Fantasy',
    'History',
    'Horror',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Thriller',
    'War',
  ];

  const filteredMoviesTabList = ALL_MEDIA_CATALOG.filter((item) => item.media_type === 'movie')
    .filter((item) =>
      selectedGenre === 'All'
        ? true
        : item.genres?.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'top_rated') return (b.vote_average || 0) - (a.vote_average || 0);
      if (sortBy === 'latest') {
        const yearA = parseInt(a.release_date || '0', 10);
        const yearB = parseInt(b.release_date || '0', 10);
        return yearB - yearA;
      }
      return (b.vote_count || b.vote_average || 0) - (a.vote_count || a.vote_average || 0);
    });

  const filteredShowsTabList = ALL_MEDIA_CATALOG.filter((item) => item.media_type === 'tv')
    .filter((item) =>
      selectedGenre === 'All'
        ? true
        : item.genres?.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'top_rated') return (b.vote_average || 0) - (a.vote_average || 0);
      if (sortBy === 'latest') {
        const yearA = parseInt(a.first_air_date || '0', 10);
        const yearB = parseInt(b.first_air_date || '0', 10);
        return yearB - yearA;
      }
      return (b.vote_count || b.vote_average || 0) - (a.vote_count || a.vote_average || 0);
    });

  return (
    <div className="min-h-screen bg-[#111111] text-neutral-100 selection:bg-emerald-500 selection:text-black font-sans antialiased overflow-x-hidden">
      {/* Top Floating Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        myListCount={myList.length}
      />

      {/* Main Content Areas */}
      <main className="w-full">
        {/* ================= 1. HOME TAB ================= */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Cinematic Hero Section */}
            <HeroBanner
              items={HERO_FEATURED_ITEMS}
              onPlay={(item) => setActivePlayingMedia(item)}
              onOpenDetails={(item) => setActiveDetailMedia(item)}
              onToggleMyList={handleToggleMyList}
              isInMyList={isInMyList}
              onOpenPosterFullscreen={(item) => handleOpenPosterFullscreen(item, HERO_FEATURED_ITEMS)}
            />

            {/* Provider Ribbon */}
            <ProviderRow
              providers={STREAMING_PROVIDERS}
              selectedProvider={selectedProvider}
              onSelectProvider={(provId) => {
                setSelectedProvider(provId);
                if (provId) {
                  const prov = STREAMING_PROVIDERS.find((p) => p.id === provId);
                  if (prov) {
                    setMovieProviderFilter(prov.name);
                    setTvProviderFilter(prov.name);
                  }
                }
              }}
            />

            {/* Content Carousels matching screenshots */}
            <div className="space-y-4 pb-8">
              {/* Because you watched [Movie] */}
              <MediaCarousel
                id="row-recommendations"
                title="Because you watched "
                items={BECAUSE_YOU_WATCHED_ODYSSEY}
                dropdownOptions={['The Odyssey', 'Conan the Barbarian', 'Immortals', 'Spider-Man']}
                currentOption={recommendationSeed}
                onSelectOption={(opt) => setRecommendationSeed(opt)}
                onPlay={(item) => setActivePlayingMedia(item)}
                onOpenDetails={(item) => setActiveDetailMedia(item)}
                onToggleMyList={handleToggleMyList}
                isInMyList={isInMyList}
                onOpenPosterFullscreen={(item) => handleOpenPosterFullscreen(item, BECAUSE_YOU_WATCHED_ODYSSEY)}
              />

              {/* Trending Movies */}
              <MediaCarousel
                id="row-trending-movies"
                title="Trending Movies"
                items={TRENDING_MOVIES}
                viewAllLink="/movies"
                onViewAll={() => setActiveTab('movies')}
                onPlay={(item) => setActivePlayingMedia(item)}
                onOpenDetails={(item) => setActiveDetailMedia(item)}
                onToggleMyList={handleToggleMyList}
                isInMyList={isInMyList}
                onOpenPosterFullscreen={(item) => handleOpenPosterFullscreen(item, TRENDING_MOVIES)}
              />

              {/* Trending Series */}
              <MediaCarousel
                id="row-trending-series"
                title="Trending Series"
                items={TRENDING_SERIES}
                viewAllLink="/shows"
                onViewAll={() => setActiveTab('shows')}
                onPlay={(item) => setActivePlayingMedia(item)}
                onOpenDetails={(item) => setActiveDetailMedia(item)}
                onToggleMyList={handleToggleMyList}
                isInMyList={isInMyList}
                onOpenPosterFullscreen={(item) => handleOpenPosterFullscreen(item, TRENDING_SERIES)}
              />

              {/* Movies on [Provider] */}
              <MediaCarousel
                id="row-provider-movies"
                title="Movies on "
                items={getProviderFilteredMovies(movieProviderFilter).length > 0 ? getProviderFilteredMovies(movieProviderFilter) : NETFLIX_MOVIES}
                dropdownOptions={['Netflix', 'Amazon Prime Video', 'Disney Plus', 'Apple TV+', 'HBO Max', 'Hulu']}
                currentOption={movieProviderFilter}
                onSelectOption={(opt) => setMovieProviderFilter(opt)}
                onPlay={(item) => setActivePlayingMedia(item)}
                onOpenDetails={(item) => setActiveDetailMedia(item)}
                onToggleMyList={handleToggleMyList}
                isInMyList={isInMyList}
                onOpenPosterFullscreen={(item) => handleOpenPosterFullscreen(item, NETFLIX_MOVIES)}
              />

              {/* TV Series on [Provider] */}
              <MediaCarousel
                id="row-provider-series"
                title="TV Series on "
                items={getProviderFilteredTV(tvProviderFilter).length > 0 ? getProviderFilteredTV(tvProviderFilter) : NETFLIX_SERIES}
                dropdownOptions={['Netflix', 'Apple TV+', 'HBO Max', 'Amazon Prime Video', 'Hulu', 'Crunchyroll']}
                currentOption={tvProviderFilter}
                onSelectOption={(opt) => setTvProviderFilter(opt)}
                onPlay={(item) => setActivePlayingMedia(item)}
                onOpenDetails={(item) => setActiveDetailMedia(item)}
                onToggleMyList={handleToggleMyList}
                isInMyList={isInMyList}
                onOpenPosterFullscreen={(item) => handleOpenPosterFullscreen(item, NETFLIX_SERIES)}
              />

              {/* Based on a True Story */}
              <MediaCarousel
                id="row-true-story"
                title="Based on a True Story"
                items={BASED_ON_TRUE_STORY}
                onPlay={(item) => setActivePlayingMedia(item)}
                onOpenDetails={(item) => setActiveDetailMedia(item)}
                onToggleMyList={handleToggleMyList}
                isInMyList={isInMyList}
                onOpenPosterFullscreen={(item) => handleOpenPosterFullscreen(item, BASED_ON_TRUE_STORY)}
              />

              {/* Award Winning Movies */}
              <MediaCarousel
                id="row-award-winning"
                title="Award Winning Movies"
                items={[...BASED_ON_TRUE_STORY].reverse()}
                onPlay={(item) => setActivePlayingMedia(item)}
                onOpenDetails={(item) => setActiveDetailMedia(item)}
                onToggleMyList={handleToggleMyList}
                isInMyList={isInMyList}
                onOpenPosterFullscreen={(item) => handleOpenPosterFullscreen(item, BASED_ON_TRUE_STORY)}
              />
            </div>
          </div>
        )}

        {/* ================= 2. MOVIES TAB ================= */}
        {activeTab === 'movies' && (
          <div className="pt-28 pb-16 w-full px-4 sm:px-8 md:px-12 lg:px-16 2xl:px-20 space-y-8 animate-in fade-in duration-300">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
                  <Film className="w-8 h-8 text-emerald-400" />
                  <span>{language === 'my' ? 'ရုပ်ရှင်များ (Movies)' : 'Explore Movies'}</span>
                </h1>
                <p className="text-neutral-400 text-sm mt-1">
                  Discover top-rated cinematic masterpieces, blockbuster hits, and latest releases in full screen.
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Full Screen Poster Gallery Launcher */}
                <button
                  type="button"
                  onClick={() => handleOpenPosterFullscreen(filteredMoviesTabList[0] || ALL_MEDIA_CATALOG[0], filteredMoviesTabList)}
                  className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>{language === 'my' ? 'ပိုစတာများ Full Screen' : 'Full Screen Posters'}</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-neutral-200 outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="top_rated">Top Rated</option>
                    <option value="latest">Latest Releases</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Genre Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGenre(g)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedGenre === g
                      ? 'bg-[#307750] text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/40'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-white/5'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Movie Grid - Full Screen responsive columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
              {filteredMoviesTabList.map((movie) => (
                <div key={movie.id} className="flex justify-center">
                  <MediaCard
                    item={movie}
                    onPlay={(item) => setActivePlayingMedia(item)}
                    onOpenDetails={(item) => setActiveDetailMedia(item)}
                    onToggleMyList={handleToggleMyList}
                    isInMyList={isInMyList(movie.id)}
                    onOpenPosterFullscreen={(item) => handleOpenPosterFullscreen(item, filteredMoviesTabList)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 3. SHOWS TAB ================= */}
        {activeTab === 'shows' && (
          <div className="pt-28 pb-16 w-full px-4 sm:px-8 md:px-12 lg:px-16 2xl:px-20 space-y-8 animate-in fade-in duration-300">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
                  <Tv className="w-8 h-8 text-emerald-400" />
                  <span>{language === 'my' ? 'ဇာတ်လမ်းတွဲများ (TV Shows)' : 'Explore TV Series'}</span>
                </h1>
                <p className="text-neutral-400 text-sm mt-1">
                  Binge-worthy drama, action-packed anime, and critically acclaimed series in full screen.
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Full Screen Poster Gallery Launcher */}
                <button
                  type="button"
                  onClick={() => handleOpenPosterFullscreen(filteredShowsTabList[0] || ALL_MEDIA_CATALOG[0], filteredShowsTabList)}
                  className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>{language === 'my' ? 'ပိုစတာများ Full Screen' : 'Full Screen Posters'}</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-neutral-200 outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="top_rated">Top Rated</option>
                    <option value="latest">Latest Air Dates</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Genre Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGenre(g)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedGenre === g
                      ? 'bg-[#307750] text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/40'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-white/5'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* TV Series Grid - Full Screen responsive columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
              {filteredShowsTabList.map((show) => (
                <div key={show.id} className="flex justify-center">
                  <MediaCard
                    item={show}
                    onPlay={(item) => setActivePlayingMedia(item)}
                    onOpenDetails={(item) => setActiveDetailMedia(item)}
                    onToggleMyList={handleToggleMyList}
                    isInMyList={isInMyList(show.id)}
                    onOpenPosterFullscreen={(item) => handleOpenPosterFullscreen(item, filteredShowsTabList)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. MY LIST TAB ================= */}
        {activeTab === 'mylist' && (
          <div className="pt-28 pb-16 w-full px-4 sm:px-8 md:px-12 lg:px-16 2xl:px-20 space-y-8 animate-in fade-in duration-300 min-h-[70vh]">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
                  <Bookmark className="w-8 h-8 text-emerald-400" />
                  <span>{language === 'my' ? 'ကျွန်ုပ်၏ စာရင်း (My List)' : 'My Watchlist'}</span>
                </h1>
                <p className="text-neutral-400 text-sm mt-1">
                  {myList.length} {myList.length === 1 ? 'title' : 'titles'} saved for later viewing.
                </p>
              </div>

              {myList.length > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenPosterFullscreen(myList[0], myList)}
                    className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>{language === 'my' ? 'ပိုစတာများ Full Screen' : 'Full Screen Posters'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearWatchlist}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-rose-950/50 text-neutral-300 hover:text-rose-400 border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {myList.length === 0 ? (
              <div className="text-center py-20 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center mx-auto text-neutral-500">
                  <Bookmark className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-200">
                  {language === 'my' ? 'သင့်စာရင်းတွင် ဘာမှမရှိသေးပါ' : 'Your Watchlist is Empty'}
                </h3>
                <p className="text-sm text-neutral-400">
                  {language === 'my'
                    ? 'ရုပ်ရှင်များနှင့် ဇာတ်လမ်းတွဲများတွင် (+) ခလုတ်ကို နှိပ်၍ သင့်စိတ်ကြိုက် စာရင်းတွင် သိမ်းဆည်းနိုင်ပါသည်။'
                    : 'Explore trending movies and series, and click the (+) button to save them here for quick access anytime.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="px-6 py-2.5 rounded-full bg-[#307750] hover:bg-[#286443] text-white text-sm font-semibold transition-colors cursor-pointer border border-emerald-400/30"
                >
                  Browse Movies
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
                {myList.map((item) => (
                  <div key={item.id} className="flex justify-center">
                    <MediaCard
                      item={item}
                      onPlay={(m) => setActivePlayingMedia(m)}
                      onOpenDetails={(m) => setActiveDetailMedia(m)}
                      onToggleMyList={handleToggleMyList}
                      isInMyList={isInMyList(item.id)}
                      onOpenPosterFullscreen={(m) => handleOpenPosterFullscreen(m, myList)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Media Detail Modal */}
      <MediaDetailModal
        item={activeDetailMedia}
        onClose={() => setActiveDetailMedia(null)}
        onPlay={(item) => {
          setActiveDetailMedia(null);
          setActivePlayingMedia(item);
        }}
        onToggleMyList={handleToggleMyList}
        isInMyList={isInMyList}
        onSelectSimilar={(sim) => setActiveDetailMedia(sim)}
        onOpenPosterFullscreen={(item) => {
          setActiveDetailMedia(null);
          handleOpenPosterFullscreen(item);
        }}
        similarItems={
          activeDetailMedia
            ? ALL_MEDIA_CATALOG.filter(
                (i) => i.id !== activeDetailMedia.id && i.genres?.some((g) => activeDetailMedia.genres?.includes(g))
              ).slice(0, 4)
            : []
        }
      />

      {/* Interactive Full Screen Poster Viewer */}
      <FullScreenPosterViewer
        isOpen={Boolean(activeFullscreenPoster)}
        currentItem={activeFullscreenPoster}
        items={fullscreenItemsList}
        onClose={() => setActiveFullscreenPoster(null)}
        onSelectItem={(item) => setActiveFullscreenPoster(item)}
        onPlay={(item) => {
          setActiveFullscreenPoster(null);
          setActivePlayingMedia(item);
        }}
        onToggleMyList={handleToggleMyList}
        isInMyList={isInMyList}
        language={language}
      />

      {/* Video Player Trailer Modal */}
      {activePlayingMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-lg animate-in fade-in">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActivePlayingMedia(null)}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer border border-white/20 transition-colors"
            >
              ✕
            </button>

            {/* YouTube Trailer Player */}
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${activePlayingMedia.youtube_id || 'dQw4w9WgXcQ'}?autoplay=1&rel=0&modestbranding=1`}
              title={activePlayingMedia.title || activePlayingMedia.name || 'Trailer'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectMedia={(item) => setActiveDetailMedia(item)}
        allCatalog={ALL_MEDIA_CATALOG}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        tmdbApiKey={tmdbApiKey}
        onSaveTmdbApiKey={handleSaveTmdbApiKey}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        onClearWatchlist={handleClearWatchlist}
      />
    </div>
  );
}
