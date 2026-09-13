'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Play, Plus, Check, Star, Calendar, Clock, Film, Tv, Share2, Maximize2 } from 'lucide-react';
import { MediaItem } from '@/types/tmdb';

interface MediaDetailModalProps {
  item: MediaItem | null;
  onClose: () => void;
  onPlay: (item: MediaItem) => void;
  onToggleMyList: (item: MediaItem) => void;
  isInMyList: (id: number) => boolean;
  onSelectSimilar?: (item: MediaItem) => void;
  similarItems?: MediaItem[];
  onOpenPosterFullscreen?: (item: MediaItem) => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  item,
  onClose,
  onPlay,
  onToggleMyList,
  isInMyList,
  onSelectSimilar,
  similarItems = [],
  onOpenPosterFullscreen,
}) => {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const inWatchlist = isInMyList(item.id);
  const title = item.title || item.name || 'Untitled';
  const releaseYear = item.release_date
    ? new Date(item.release_date).getFullYear()
    : item.first_air_date
    ? new Date(item.first_air_date).getFullYear()
    : '2025';

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark Backdrop */}
      <div
        id="modal-backdrop"
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        id="media-detail-modal-card"
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#161616] border border-white/10 rounded-2xl shadow-2xl z-10 text-neutral-200 animate-in zoom-in-95 duration-200 no-scrollbar"
      >
        {/* Close Button */}
        <button
          id="close-modal-btn"
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors border border-white/20 cursor-pointer backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player or Backdrop Header */}
        <div className="relative w-full aspect-video sm:h-[380px] bg-black overflow-hidden">
          {isPlayingTrailer && item.youtube_id ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${item.youtube_id}?autoplay=1&rel=0&modestbranding=1`}
              title={`${title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              {item.backdrop_path ? (
                <Image
                  src={item.backdrop_path}
                  alt={title}
                  fill
                  priority
                  referrerPolicy="no-referrer"
                  className="object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-neutral-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-black/40 to-transparent" />

              {/* Central Play Overlay Button */}
              <button
                type="button"
                onClick={() => setIsPlayingTrailer(true)}
                className="absolute inset-0 flex items-center justify-center group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-[#307750]/90 group-hover:bg-[#307750] group-hover:scale-110 flex items-center justify-center text-white shadow-2xl transition-all border border-emerald-400/40">
                  <Play className="w-7 h-7 fill-white ml-1" />
                </div>
              </button>

              {/* Title Header overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {item.media_type === 'tv' ? 'TV Series' : 'Feature Film'}
                  </span>
                  {item.quality && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-white/20 text-white">
                      {item.quality}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-lg font-serif">
                  {title}
                </h2>
              </div>
            </>
          )}
        </div>

        {/* Modal Body Info */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata & Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-300">
              {/* Rating */}
              <div className="flex items-center gap-1.5 text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{item.vote_average ? item.vote_average.toFixed(1) : '7.5'}/10</span>
              </div>

              {/* Year */}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span>{releaseYear}</span>
              </div>

              {/* Runtime / Seasons */}
              {item.runtime ? (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <span>{item.runtime} mins</span>
                </div>
              ) : item.number_of_seasons ? (
                <div className="flex items-center gap-1">
                  <Tv className="w-4 h-4 text-neutral-400" />
                  <span>{item.number_of_seasons} {item.number_of_seasons === 1 ? 'Season' : 'Seasons'}</span>
                </div>
              ) : null}

              {/* Certification */}
              {item.certification && (
                <span className="px-2 py-0.5 text-xs font-bold text-neutral-300 border border-neutral-600 rounded">
                  {item.certification}
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onPlay(item)}
                className="px-5 py-2 rounded-full bg-[#307750] hover:bg-[#286443] text-white text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-emerald-400/30"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch Trailer</span>
              </button>

              {onOpenPosterFullscreen && (
                <button
                  type="button"
                  onClick={() => onOpenPosterFullscreen(item)}
                  className="px-4 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-emerald-400 text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-500/30"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Full Screen Poster</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onToggleMyList(item)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  inWatchlist
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-white/10 hover:bg-white/20 text-neutral-200 border-white/20'
                }`}
              >
                {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{inWatchlist ? 'In My List' : 'Add to List'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                aria-label="Share"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {copied && <span className="text-xs text-emerald-400">Link Copied!</span>}
            </div>
          </div>

          {/* Genres Chips */}
          {item.genres && item.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 border border-white/5"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Storyline Overview */}
          <div>
            <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Storyline
            </h4>
            <p className="text-neutral-200 leading-relaxed text-sm sm:text-base">
              {item.overview || 'No detailed overview available for this title.'}
            </p>
          </div>

          {/* Cast & Crew Section */}
          {item.cast && item.cast.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">
                Top Cast
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {item.cast.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl bg-neutral-900/80 border border-white/5 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-emerald-400 text-sm">
                      {c.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">{c.name}</p>
                      <p className="text-xs text-neutral-400 truncate">{c.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Providers */}
          {item.providers && item.providers.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Available On
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.providers.map((p) => (
                  <span
                    key={p}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-700/40"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Similar Recommendations */}
          {similarItems.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-base font-bold text-white mb-3">You May Also Like</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {similarItems.slice(0, 4).map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectSimilar?.(sim)}
                    className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-neutral-900 cursor-pointer border border-white/5 hover:border-emerald-500/50 transition-all"
                  >
                    {sim.poster_path ? (
                      <Image
                        src={sim.poster_path}
                        alt={sim.title || sim.name || ''}
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-xs font-bold text-white truncate">
                        {sim.title || sim.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
