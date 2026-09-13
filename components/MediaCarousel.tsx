'use client';

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { MediaItem } from '@/types/tmdb';
import { MediaCard } from './MediaCard';

interface MediaCarouselProps {
  id: string;
  title: string;
  items: MediaItem[];
  dropdownOptions?: string[];
  currentOption?: string;
  onSelectOption?: (option: string) => void;
  viewAllLink?: string;
  onViewAll?: () => void;
  onPlay: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onToggleMyList: (item: MediaItem) => void;
  isInMyList: (id: number) => boolean;
  onOpenPosterFullscreen?: (item: MediaItem) => void;
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({
  id,
  title,
  items,
  dropdownOptions,
  currentOption,
  onSelectOption,
  onViewAll,
  onPlay,
  onOpenDetails,
  onToggleMyList,
  isInMyList,
  onOpenPosterFullscreen,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <section id={id} className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-5 relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        {/* Title with optional Dropdown */}
        <div className="relative flex items-center gap-2">
          {dropdownOptions && dropdownOptions.length > 0 ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-neutral-100 hover:text-white transition-colors cursor-pointer group/title"
              >
                <span>{title}</span>
                <span className="text-emerald-400 underline decoration-emerald-500/50 underline-offset-4">
                  {currentOption || dropdownOptions[0]}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 group-hover/title:text-white transition-transform ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-56 rounded-xl bg-neutral-900 border border-white/10 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                    {dropdownOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          onSelectOption?.(opt);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-between ${
                          currentOption === opt
                            ? 'bg-emerald-600/20 text-emerald-400 font-semibold'
                            : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span>{opt}</span>
                        {currentOption === opt && (
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-100">{title}</h2>
          )}
        </div>

        {/* View All & Controls */}
        <div className="flex items-center gap-3">
          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs sm:text-sm font-semibold text-neutral-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <span>→</span>
            </button>
          )}

          {/* Nav chevrons */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Previous"
              className="p-1.5 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer border border-white/5"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Next"
              className="p-1.5 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer border border-white/5"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Cards Slider */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onPlay={onPlay}
              onOpenDetails={onOpenDetails}
              onToggleMyList={onToggleMyList}
              isInMyList={isInMyList(item.id)}
              onOpenPosterFullscreen={onOpenPosterFullscreen}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
