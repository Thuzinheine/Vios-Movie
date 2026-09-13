'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Plus, Check, Info, Star, Calendar, Heart, Maximize2 } from 'lucide-react';
import { MediaItem } from '@/types/tmdb';

interface HeroBannerProps {
  items: MediaItem[];
  onPlay: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onToggleMyList: (item: MediaItem) => void;
  isInMyList: (id: number) => boolean;
  onOpenPosterFullscreen?: (item: MediaItem) => void;
}

const getMovieTitleStyle = (item: MediaItem) => {
  const titleLower = (item.title || item.name || '').toLowerCase();

  if (titleLower.includes('spider-man') || titleLower.includes('spiderman')) {
    return {
      gradient: 'from-red-500 via-rose-300 to-sky-400',
      glow: 'drop-shadow-[0_4px_24px_rgba(239,68,68,0.75)]',
      font: 'font-sans font-black tracking-tight italic',
      accentColor: '#EF4444',
    };
  }
  if (titleLower.includes('moana')) {
    return {
      gradient: 'from-cyan-300 via-teal-200 to-amber-300',
      glow: 'drop-shadow-[0_4px_24px_rgba(45,212,191,0.65)]',
      font: 'font-serif font-extrabold tracking-widest',
      accentColor: '#2DD4BF',
    };
  }
  if (titleLower.includes('dune')) {
    return {
      gradient: 'from-amber-200 via-orange-300 to-amber-500',
      glow: 'drop-shadow-[0_4px_28px_rgba(245,158,11,0.65)]',
      font: 'font-serif font-black tracking-[0.2em]',
      accentColor: '#F59E0B',
    };
  }
  if (titleLower.includes('reacher')) {
    return {
      gradient: 'from-slate-100 via-neutral-200 to-zinc-400',
      glow: 'drop-shadow-[0_4px_24px_rgba(226,232,240,0.5)]',
      font: 'font-mono font-black tracking-tighter',
      accentColor: '#94A3B8',
    };
  }
  if (titleLower.includes('oppenheimer')) {
    return {
      gradient: 'from-orange-400 via-amber-200 to-red-600',
      glow: 'drop-shadow-[0_4px_28px_rgba(234,88,12,0.75)]',
      font: 'font-serif font-black tracking-wide',
      accentColor: '#EA580C',
    };
  }
  if (titleLower.includes('deadpool') || titleLower.includes('wolverine')) {
    return {
      gradient: 'from-red-600 via-rose-400 to-amber-400',
      glow: 'drop-shadow-[0_4px_24px_rgba(225,29,72,0.7)]',
      font: 'font-sans font-black tracking-tight italic',
      accentColor: '#E11D48',
    };
  }
  if (titleLower.includes('arcane') || titleLower.includes('bleach')) {
    return {
      gradient: 'from-fuchsia-400 via-violet-300 to-cyan-400',
      glow: 'drop-shadow-[0_4px_24px_rgba(192,132,252,0.7)]',
      font: 'font-sans font-extrabold tracking-wide',
      accentColor: '#C084FC',
    };
  }

  // Genre based styling
  const genre = (item.genres?.[0] || '').toLowerCase();
  if (genre.includes('sci-fi') || genre.includes('fantasy')) {
    return {
      gradient: 'from-cyan-400 via-sky-200 to-indigo-400',
      glow: 'drop-shadow-[0_4px_20px_rgba(56,189,248,0.5)]',
      font: 'font-sans font-black tracking-wider',
      accentColor: '#38BDF8',
    };
  }
  if (genre.includes('action') || genre.includes('adventure')) {
    return {
      gradient: 'from-amber-400 via-orange-300 to-red-500',
      glow: 'drop-shadow-[0_4px_20px_rgba(249,115,22,0.5)]',
      font: 'font-sans font-black tracking-tight',
      accentColor: '#F97316',
    };
  }
  if (genre.includes('animation') || genre.includes('family')) {
    return {
      gradient: 'from-pink-400 via-rose-300 to-amber-300',
      glow: 'drop-shadow-[0_4px_20px_rgba(244,114,182,0.5)]',
      font: 'font-sans font-extrabold tracking-wide',
      accentColor: '#F472B6',
    };
  }

  return {
    gradient: 'from-white via-neutral-100 to-neutral-400',
    glow: 'drop-shadow-[0_4px_20px_rgba(255,255,255,0.35)]',
    font: 'font-serif font-black tracking-tight',
    accentColor: '#FFFFFF',
  };
};

export const HeroBanner: React.FC<HeroBannerProps> = ({
  items,
  onPlay,
  onOpenDetails,
  onToggleMyList,
  isInMyList,
  onOpenPosterFullscreen,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const current = items[currentIndex] || items[0];

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [items.length, isPaused]);

  if (!current) return null;

  const inWatchlist = isInMyList(current.id);
  const releaseYear = current.release_date
    ? new Date(current.release_date).getFullYear()
    : current.first_air_date
    ? new Date(current.first_air_date).getFullYear()
    : '2026';

  const primaryGenre = current.genres?.[0] || 'Action';
  const titleStyle = getMovieTitleStyle(current);

  return (
    <div
      id="hero-banner-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[92vh] min-h-[640px] max-h-[950px] overflow-hidden select-none bg-[#0d0d0d]"
    >
      {/* Hidden preloaded images for instantaneous carousel switches */}
      <div className="hidden" aria-hidden="true">
        {items.map((it) =>
          it.backdrop_path ? (
            <Image
              key={`preload-${it.id}`}
              src={it.backdrop_path}
              alt=""
              width={1280}
              height={720}
              priority
              referrerPolicy="no-referrer"
            />
          ) : null
        )}
      </div>

      {/* Background Backdrop Image */}
      <div className="absolute inset-0 transition-opacity duration-700 ease-out">
        {current.backdrop_path ? (
          <Image
            key={`hero-bg-${current.id}`}
            src={current.backdrop_path}
            alt={current.title || current.name || 'Hero'}
            fill
            priority
            loading="eager"
            sizes="100vw"
            referrerPolicy="no-referrer"
            className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}

        {/* Cinematic Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d]/95 via-[#0d0d0d]/60 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/30 to-[#0d0d0d]/40" />
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full h-full px-6 sm:px-12 md:px-16 lg:px-20 flex flex-col justify-end pb-24 md:pb-28">
        <div className="max-w-3xl space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Main Stylized Title with Distinct Typography & Color Gradient per Movie */}
          <h1
            id="hero-movie-title"
            key={`hero-title-${current.id}`}
            className={`text-4xl sm:text-6xl md:text-7xl uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r ${titleStyle.gradient} ${titleStyle.font} ${titleStyle.glow}`}
          >
            {current.title || current.name}
          </h1>

          {/* Metadata Row (Rating, Year, Genre, Quality) */}
          <div className="flex items-center gap-3 text-sm sm:text-base text-neutral-200 font-medium">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 shadow">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{current.vote_average.toFixed(1)}/10</span>
            </div>
            <span className="text-neutral-400">•</span>
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span>{releaseYear}</span>
            </div>
            <span className="text-neutral-400">•</span>
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>{primaryGenre}</span>
            </div>
            {current.quality && (
              <span className="ml-1 px-2.5 py-0.5 text-xs font-bold bg-white/15 text-white rounded-md border border-white/20">
                {current.quality}
              </span>
            )}
            {current.certification && (
              <span className="px-2 py-0.5 text-xs font-bold bg-black/40 text-neutral-300 rounded border border-white/10">
                {current.certification}
              </span>
            )}
          </div>

          {/* Overview Narrative */}
          <p className="text-neutral-300 text-sm sm:text-base line-clamp-3 leading-relaxed drop-shadow max-w-2xl">
            {current.overview}
          </p>

          {/* Call to Actions (Play, Watchlist +, Info ⓘ, Full Screen Poster) */}
          <div className="flex items-center gap-3 pt-2">
            {/* Play Button */}
            <button
              id="hero-play-button"
              type="button"
              onClick={() => onPlay(current)}
              className="flex items-center justify-center gap-2.5 px-7 py-3 rounded-full bg-[#307750] hover:bg-[#286443] text-white font-semibold text-base transition-all transform active:scale-95 shadow-lg shadow-emerald-950/60 cursor-pointer border border-emerald-400/30"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Play</span>
            </button>

            {/* My List Toggle (+) Button */}
            <button
              id="hero-watchlist-button"
              type="button"
              onClick={() => onToggleMyList(current)}
              aria-label={inWatchlist ? 'Remove from My List' : 'Add to My List'}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all transform active:scale-90 cursor-pointer border ${
                inWatchlist
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-black/50 hover:bg-white/20 text-neutral-200 border-white/20 backdrop-blur-md'
              }`}
            >
              {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>

            {/* Info (ⓘ) Button */}
            <button
              id="hero-info-button"
              type="button"
              onClick={() => onOpenDetails(current)}
              aria-label="More information"
              className="w-11 h-11 rounded-full bg-black/50 hover:bg-white/20 text-neutral-200 border border-white/20 backdrop-blur-md flex items-center justify-center transition-all transform active:scale-90 cursor-pointer"
            >
              <Info className="w-5 h-5" />
            </button>

            {/* Full Screen Poster Button */}
            {onOpenPosterFullscreen && (
              <button
                id="hero-fullscreen-poster-btn"
                type="button"
                onClick={() => onOpenPosterFullscreen(current)}
                aria-label="View Full Screen Poster"
                title="Full Screen Poster"
                className="w-11 h-11 rounded-full bg-black/50 hover:bg-white/20 text-neutral-200 border border-white/20 backdrop-blur-md flex items-center justify-center transition-all transform active:scale-90 cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Carousel Dots & Quick Movie Switchers in Bottom Right */}
      <div
        id="hero-carousel-dots"
        className="absolute bottom-10 right-6 sm:right-12 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 shadow-lg"
      >
        {items.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Slide ${idx + 1}: ${item.title || item.name}`}
            title={item.title || item.name}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentIndex
                ? 'w-7 h-2.5 bg-emerald-400 shadow-md shadow-emerald-400/50'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

