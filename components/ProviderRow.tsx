'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StreamingProvider } from '@/types/tmdb';

interface ProviderRowProps {
  providers: StreamingProvider[];
  selectedProvider: string | null;
  onSelectProvider: (providerId: string | null) => void;
}

export const ProviderRow: React.FC<ProviderRowProps> = ({
  providers,
  selectedProvider,
  onSelectProvider,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="browse-by-provider-section" className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 flex items-center gap-2">
          Browse by Provider
          {selectedProvider && (
            <button
              onClick={() => onSelectProvider(null)}
              className="text-xs font-normal text-emerald-400 hover:text-emerald-300 ml-2 underline cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </h2>

        {/* Scroll Arrows */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left providers"
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right providers"
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3.5 overflow-x-auto no-scrollbar scroll-smooth py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {providers.map((prov) => {
          const isSelected = selectedProvider === prov.id;
          return (
            <button
              key={prov.id}
              id={`provider-btn-${prov.id}`}
              type="button"
              onClick={() => onSelectProvider(isSelected ? null : prov.id)}
              className={`flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer transition-all duration-200 transform ${
                isSelected ? 'scale-105' : 'hover:scale-102'
              }`}
            >
              {/* Provider Logo Box */}
              <div
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center p-2.5 transition-all shadow-md relative overflow-hidden border ${
                  isSelected
                    ? 'border-emerald-400 ring-2 ring-emerald-500/50 shadow-emerald-950/60'
                    : 'border-white/10 bg-neutral-900/90 group-hover:border-white/25 group-hover:bg-neutral-800'
                }`}
                style={{
                  backgroundColor: isSelected ? prov.accentBg || '#18181b' : undefined,
                }}
              >
                {/* Custom Brand Logo Representation */}
                <ProviderLogo provider={prov} />

                {isSelected && (
                  <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black" />
                )}
              </div>

              {/* Provider Name */}
              <span
                className={`text-xs font-medium text-center truncate max-w-[84px] transition-colors ${
                  isSelected
                    ? 'text-emerald-400 font-semibold'
                    : 'text-neutral-400 group-hover:text-neutral-200'
                }`}
              >
                {prov.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

function ProviderLogo({ provider }: { provider: StreamingProvider }) {
  const { id } = provider;

  if (id === 'netflix') {
    return (
      <span className="text-red-600 font-extrabold text-2xl tracking-tighter font-serif">
        N
      </span>
    );
  }

  if (id === 'prime') {
    return (
      <div className="flex flex-col items-center leading-none">
        <span className="text-sky-400 font-extrabold text-xs tracking-tight">prime</span>
        <span className="text-sky-300 text-[10px] font-bold">video</span>
        <div className="w-6 h-1 bg-amber-400 rounded-full mt-0.5" />
      </div>
    );
  }

  if (id === 'disney') {
    return (
      <div className="flex flex-col items-center leading-none">
        <span className="text-blue-400 font-bold text-xs tracking-wider font-serif">Disney</span>
        <span className="text-white text-xs font-black">+</span>
      </div>
    );
  }

  if (id === 'appletv_plus' || id === 'appletv') {
    return (
      <div className="flex items-center gap-0.5 text-white font-semibold text-xs">
        <span></span>
        <span>tv{id === 'appletv_plus' ? '+' : ''}</span>
      </div>
    );
  }

  if (id === 'hulu') {
    return (
      <span className="text-emerald-400 font-black text-sm tracking-wider lowercase">
        hulu
      </span>
    );
  }

  if (id === 'hbomax') {
    return (
      <div className="flex flex-col items-center">
        <span className="text-purple-400 font-black text-xs tracking-tight">HBO</span>
        <span className="text-white font-extrabold text-[10px]">max</span>
      </div>
    );
  }

  if (id === 'paramount') {
    return (
      <div className="flex flex-col items-center leading-none text-blue-500">
        <span className="text-[9px] font-bold tracking-tight">PARAMOUNT</span>
        <span className="text-white font-black text-sm">+</span>
      </div>
    );
  }

  if (id === 'peacock') {
    return (
      <div className="flex items-center gap-0.5 text-emerald-300 font-bold text-xs">
        <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-yellow-400 via-rose-500 to-indigo-500" />
        <span>peacock</span>
      </div>
    );
  }

  if (id === 'crunchyroll') {
    return (
      <span className="text-orange-500 font-bold text-lg">
        ◉
      </span>
    );
  }

  if (id === 'starz') {
    return (
      <span className="text-white font-extrabold text-xs tracking-widest uppercase">
        STARZ
      </span>
    );
  }

  if (id === 'amc') {
    return (
      <span className="text-teal-400 font-black text-xs tracking-wider">
        aMC+
      </span>
    );
  }

  if (id === 'mgm') {
    return (
      <span className="text-amber-400 font-black text-xs tracking-wider">
        MGM+
      </span>
    );
  }

  if (id === 'ytpremium' || id === 'youtube') {
    return (
      <div className="flex items-center gap-1 text-red-500">
        <div className="w-5 h-3.5 bg-red-600 rounded flex items-center justify-center">
          <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-white border-b-[3px] border-b-transparent ml-0.5" />
        </div>
      </div>
    );
  }

  if (id === 'tubi') {
    return (
      <span className="text-amber-500 font-black text-xs tracking-tight">
        tubi
      </span>
    );
  }

  return (
    <span className="text-neutral-300 font-bold text-xs truncate">
      {provider.name.slice(0, 4)}
    </span>
  );
}
