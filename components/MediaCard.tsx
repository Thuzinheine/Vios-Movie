'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Star } from 'lucide-react';
import { MediaItem } from '@/types/tmdb';

interface MediaCardProps {
  item: MediaItem;
  onPlay: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onToggleMyList: (item: MediaItem) => void;
  isInMyList: boolean;
  onOpenPosterFullscreen?: (item: MediaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  onPlay,
  onOpenDetails,
}) => {
  const [imgError, setImgError] = useState(false);
  const title = item.title || item.name || 'Untitled';
  
  // Extract clean release/air year
  const releaseYear = item.release_date
    ? new Date(item.release_date).getFullYear() || item.release_date.slice(0, 4)
    : item.first_air_date
    ? new Date(item.first_air_date).getFullYear() || item.first_air_date.slice(0, 4)
    : '';

  // Get formatted rating (e.g., "7.8")
  const rating = item.vote_average ? item.vote_average.toFixed(1) : '7.5';

  // Optimize TMDB poster URL if present to ensure rapid load times (w342/w500)
  const posterUrl = item.poster_path
    ? item.poster_path.replace(/\/t\/p\/(original|w780|w1280)\//, '/t/p/w342/')
    : null;

  return (
    <div
      id={`media-card-${item.id}`}
      className="group/mediacard relative flex-shrink-0 w-[150px] sm:w-[175px] md:w-[200px] lg:w-[220px] aspect-[2/3] rounded-2xl overflow-hidden bg-neutral-900 shadow-md cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-black/90 hover:z-30 border border-white/5 select-none will-change-transform"
      onClick={() => onOpenDetails(item)}
    >
      {/* Poster Image - Clean & Edge-to-Edge */}
      {posterUrl && !imgError ? (
        <Image
          src={posterUrl}
          alt={title}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 150px, (max-width: 768px) 175px, (max-width: 1024px) 200px, 220px"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="object-cover object-center"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-neutral-800 to-neutral-950">
          <span className="text-emerald-400 font-extrabold text-xs mb-1 uppercase tracking-wider">
            {item.media_type === 'tv' ? 'Series' : 'Movie'}
          </span>
          <p className="text-white font-bold text-sm line-clamp-3">{title}</p>
          {releaseYear && <span className="text-neutral-400 text-xs mt-2">{releaseYear}</span>}
        </div>
      )}

      {/* Hover Overlay: Center Play Icon, Movie Name, Year & Rating ONLY on this hovered card */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] opacity-0 group-hover/mediacard:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-4 text-center pointer-events-none group-hover/mediacard:pointer-events-auto">
        {/* Play Icon - White Circle with Black Triangle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPlay(item);
          }}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white hover:bg-neutral-100 hover:scale-110 active:scale-95 flex items-center justify-center shadow-2xl transition-all duration-200 mb-2 sm:mb-2.5 cursor-pointer"
          aria-label={`Play ${title}`}
        >
          <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-black text-black ml-0.5" />
        </button>

        {/* Movie / Show Title */}
        <h3 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-2 px-2 mb-1 drop-shadow-md">
          {title}
        </h3>

        {/* Year and Rating */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-200 font-semibold drop-shadow">
          {releaseYear && <span>{releaseYear}</span>}
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
            <span>{rating}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
