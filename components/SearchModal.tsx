'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Film, Tv, Star } from 'lucide-react';
import Image from 'next/image';
import { MediaItem } from '@/types/tmdb';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (item: MediaItem) => void;
  allCatalog: MediaItem[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectMedia,
  allCatalog,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'tv'>('all');

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return allCatalog.filter((item) => {
      const matchesType = filterType === 'all' || item.media_type === filterType;
      const matchesQuery =
        (item.title || item.name || '').toLowerCase().includes(q) ||
        (item.overview || '').toLowerCase().includes(q) ||
        (item.genres || []).some((g) => g.toLowerCase().includes(q)) ||
        (item.providers || []).some((p) => p.toLowerCase().includes(q));
      return matchesType && matchesQuery;
    });
  }, [query, filterType, allCatalog]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        id="search-backdrop"
        className="fixed inset-0 bg-black/85 backdrop-blur-md animate-in fade-in"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="relative w-full max-w-3xl bg-[#181818] border border-white/10 rounded-2xl shadow-2xl z-10 overflow-hidden text-neutral-200 animate-in zoom-in-95 duration-200">
        {/* Search Input Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <input
            id="main-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, TV shows, actors, genres, providers..."
            autoFocus
            className="w-full bg-transparent text-white placeholder-neutral-500 text-base sm:text-lg outline-none font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 font-semibold cursor-pointer border border-white/5"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-3 bg-neutral-900/60 border-b border-white/5 flex items-center gap-2 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            All Results
          </button>
          <button
            type="button"
            onClick={() => setFilterType('movie')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterType === 'movie'
                ? 'bg-emerald-600 text-white'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Movies</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('tv')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterType === 'tv'
                ? 'bg-emerald-600 text-white'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>TV Shows</span>
          </button>
        </div>

        {/* Search Content / Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 no-scrollbar">
          {query && results.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-neutral-300 font-bold text-base">No titles found matching &quot;{query}&quot;</p>
              <p className="text-neutral-500 text-xs">
                Try searching for titles like Moana, Spider-Man, Reacher, Silo, Breaking Bad, or genres.
              </p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectMedia(item);
                    onClose();
                  }}
                  className="group rounded-xl overflow-hidden bg-neutral-900 border border-white/5 hover:border-emerald-500/50 cursor-pointer transition-all hover:scale-[1.03]"
                >
                  <div className="relative aspect-[2/3] w-full bg-neutral-800">
                    {item.poster_path ? (
                      <Image
                        src={item.poster_path}
                        alt={item.title || item.name || ''}
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                    ) : null}
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{item.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-bold text-white truncate">{item.title || item.name}</p>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1">
                      <span className="capitalize">{item.media_type}</span>
                      <span>
                        {item.release_date
                          ? new Date(item.release_date).getFullYear()
                          : item.first_air_date
                          ? new Date(item.first_air_date).getFullYear()
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Quick Suggestions / Popular Tags */
            <div className="py-4 space-y-4">
              <div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2.5">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Spider-Man', 'Moana 2', 'Reacher', 'Silo', 'Breaking Bad', 'The Odyssey', 'Anime', 'Netflix', 'Romance'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 font-medium transition-colors cursor-pointer border border-white/5"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
