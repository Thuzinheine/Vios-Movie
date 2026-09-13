'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Minimize,
  Play,
  Plus,
  Check,
  Star,
  Film,
  Tv,
  Eye,
  Sparkles
} from 'lucide-react';
import { MediaItem } from '@/types/tmdb';

interface FullScreenPosterViewerProps {
  isOpen: boolean;
  onClose: () => void;
  currentItem: MediaItem | null;
  items: MediaItem[];
  onSelectItem: (item: MediaItem) => void;
  onPlay: (item: MediaItem) => void;
  onToggleMyList: (item: MediaItem) => void;
  isInMyList: (id: number) => boolean;
  language: 'en' | 'my';
}

export const FullScreenPosterViewer: React.FC<FullScreenPosterViewerProps> = ({
  isOpen,
  onClose,
  currentItem,
  items,
  onSelectItem,
  onPlay,
  onToggleMyList,
  isInMyList,
  language,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'poster' | 'backdrop'>('poster');
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const currentIndex = items.findIndex((i) => i.id === currentItem?.id);

  const handlePrev = useCallback(() => {
    if (items.length === 0) return;
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    setZoomLevel(1);
    onSelectItem(items[prevIndex]);
  }, [currentIndex, items, onSelectItem]);

  const handleNext = useCallback(() => {
    if (items.length === 0) return;
    const nextIndex = (currentIndex + 1) % items.length;
    setZoomLevel(1);
    onSelectItem(items[nextIndex]);
  }, [currentIndex, items, onSelectItem]);

  const handleSwitchViewMode = (mode: 'poster' | 'backdrop') => {
    setViewMode(mode);
    setZoomLevel(1);
  };

  const toggleBrowserFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreenMode(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreenMode(false);
      }
    } catch (e) {
      console.warn('Fullscreen request failed:', e);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleBrowserFullscreen();
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel((z) => Math.min(z + 0.25, 2.5));
      } else if (e.key === '-') {
        setZoomLevel((z) => Math.max(z - 0.25, 0.75));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!isOpen || !currentItem) return null;

  const title = currentItem.title || currentItem.name || 'Poster';
  const releaseYear = currentItem.release_date
    ? new Date(currentItem.release_date).getFullYear()
    : currentItem.first_air_date
    ? new Date(currentItem.first_air_date).getFullYear()
    : '2026';
  const inList = isInMyList(currentItem.id);
  const activeImageSrc =
    viewMode === 'backdrop'
      ? currentItem.backdrop_path || currentItem.poster_path
      : currentItem.poster_path || currentItem.backdrop_path;

  return (
    <div
      id="fullscreen-poster-viewer"
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300"
    >
      {/* Top Floating Control Bar */}
      <div
        className={`absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Title & Index Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            {currentItem.media_type === 'tv' ? <Tv className="w-5 h-5" /> : <Film className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-bold text-white tracking-wide truncate max-w-xs sm:max-w-md">
              {title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>{releaseYear}</span>
              <span>•</span>
              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                <Star className="w-3 h-3 fill-amber-400" />
                {currentItem.vote_average.toFixed(1)}
              </span>
              <span>•</span>
              <span>
                {currentIndex + 1} / {items.length}
              </span>
            </div>
          </div>
        </div>

        {/* Action Toolbars */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Switch Poster / Backdrop Mode */}
          <div className="bg-neutral-900/80 border border-white/10 rounded-full p-1 flex items-center text-xs font-semibold backdrop-blur-md">
            <button
              type="button"
              onClick={() => handleSwitchViewMode('poster')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === 'poster'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {language === 'my' ? 'ပိုစတာ (Poster)' : 'Poster'}
            </button>
            <button
              type="button"
              onClick={() => handleSwitchViewMode('backdrop')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === 'backdrop'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {language === 'my' ? 'နောက်ခံပုံ (Backdrop)' : 'Backdrop'}
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-neutral-900/80 border border-white/10 rounded-full p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
              aria-label="Zoom Out"
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-neutral-300 min-w-[40px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
              aria-label="Zoom In"
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {zoomLevel !== 1 && (
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                aria-label="Reset Zoom"
                className="p-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Browser Fullscreen Button */}
          <button
            type="button"
            onClick={toggleBrowserFullscreen}
            aria-label="Toggle Fullscreen"
            className="p-2 sm:p-2.5 rounded-full bg-neutral-900/80 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
          >
            {isFullscreenMode ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Fullscreen Viewer"
            className="p-2 sm:p-2.5 rounded-full bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-800/40 backdrop-blur-md transition-colors cursor-pointer ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Full-Screen Visual Stage */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-zoom-in"
        onClick={() => setShowControls((prev) => !prev)}
      >
        {activeImageSrc ? (
          <div
            className="relative transition-transform duration-200 ease-out flex items-center justify-center max-w-full max-h-full"
            style={{
              transform: `scale(${zoomLevel})`,
            }}
          >
            {viewMode === 'poster' ? (
              <div className="relative w-[85vw] max-w-[550px] aspect-[2/3] max-h-[85vh] rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.25)] border border-white/15">
                <Image
                  src={activeImageSrc}
                  alt={title}
                  fill
                  priority
                  referrerPolicy="no-referrer"
                  className="object-cover object-center"
                />
              </div>
            ) : (
              <div className="relative w-[95vw] max-w-[1300px] aspect-video max-h-[85vh] rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.25)] border border-white/15">
                <Image
                  src={activeImageSrc}
                  alt={title}
                  fill
                  priority
                  referrerPolicy="no-referrer"
                  className="object-cover object-center"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-neutral-500 text-sm">No HD Image available</div>
        )}

        {/* Ambient Glow in the background */}
        <div className="absolute inset-0 pointer-events-none -z-10 bg-radial from-emerald-950/20 via-black to-black opacity-60" />
      </div>

      {/* Left/Right Navigation Floating Chevrons */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        aria-label="Previous Poster"
        className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#307750] text-white border border-white/20 backdrop-blur-md transition-all transform hover:scale-110 active:scale-95 cursor-pointer ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        aria-label="Next Poster"
        className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#307750] text-white border border-white/20 backdrop-blur-md transition-all transform hover:scale-110 active:scale-95 cursor-pointer ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Floating Info & Action Dock */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col sm:flex-row items-center justify-between gap-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Overview & Genres */}
        <div className="max-w-2xl text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
            {currentItem.genres?.map((g) => (
              <span
                key={g}
                className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-neutral-300 border border-white/10"
              >
                {g}
              </span>
            ))}
            {currentItem.quality && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {currentItem.quality}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 leading-relaxed">
            {currentItem.overview}
          </p>
        </div>

        {/* Quick Actions (Play Trailer, Watchlist) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onPlay(currentItem);
            }}
            className="px-6 py-2.5 rounded-full bg-[#307750] hover:bg-[#286443] text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-all transform active:scale-95 cursor-pointer border border-emerald-400/40"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{language === 'my' ? 'ကြည့်ရှုရန် (Play)' : 'Play Trailer'}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleMyList(currentItem)}
            className={`p-2.5 rounded-full transition-all cursor-pointer border ${
              inList
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-neutral-900 hover:bg-white/20 text-neutral-200 border-white/20'
            }`}
          >
            {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
