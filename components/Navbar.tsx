'use client';

import React, { useState } from 'react';
import { Home, Film, Tv, Bookmark, Search, Settings, Maximize, Minimize } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'movies' | 'shows' | 'mylist';
  onSelectTab: (tab: 'home' | 'movies' | 'shows' | 'mylist') => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  myListCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
  onOpenSettings,
  myListCount,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.warn('Fullscreen toggle error:', e);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 flex items-center justify-between pointer-events-none">
      {/* Brand Logo - CineJoy */}
      <div
        id="cinejoy-logo-btn"
        onClick={() => onSelectTab('home')}
        className="pointer-events-auto flex items-center gap-2 cursor-pointer group select-none transition-transform active:scale-95"
      >
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-950/40 group-hover:shadow-emerald-500/30 transition-all border border-emerald-400/30">
          {/* Logo icon matching the cute CineJoy TV mascot */}
          <svg
            className="w-6 h-6 text-white drop-shadow-sm"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="14" x="3" y="7" rx="3" fill="currentColor" fillOpacity="0.2" />
            <path d="M7 3l4 4M17 3l-4 4" />
            <circle cx="8.5" cy="13" r="1" fill="white" />
            <circle cx="15.5" cy="13" r="1" fill="white" />
            <path d="M10 16.5c.8.6 2.2.6 3 0" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-lg sm:text-xl tracking-wider text-white flex items-center gap-0.5">
            CINE<span className="text-emerald-400">JOY</span>
          </span>
        </div>
      </div>

      {/* Floating Pill Navigation Bar */}
      <nav
        id="floating-navbar-capsule"
        aria-label="Main Navigation"
        className="pointer-events-auto backdrop-blur-xl bg-black/65 border border-white/10 shadow-2xl rounded-full p-1.5 flex items-center gap-1 text-sm font-medium transition-all"
      >
        <button
          id="nav-tab-home"
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
            activeTab === 'home'
              ? 'bg-[#307750] text-white shadow-md shadow-emerald-900/40 font-semibold'
              : 'text-neutral-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          id="nav-tab-movies"
          type="button"
          onClick={() => onSelectTab('movies')}
          className={`px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer ${
            activeTab === 'movies'
              ? 'bg-[#307750] text-white shadow-md shadow-emerald-900/40 font-semibold'
              : 'text-neutral-300 hover:text-white hover:bg-white/5'
          }`}
        >
          Movies
        </button>

        <button
          id="nav-tab-shows"
          type="button"
          onClick={() => onSelectTab('shows')}
          className={`px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer ${
            activeTab === 'shows'
              ? 'bg-[#307750] text-white shadow-md shadow-emerald-900/40 font-semibold'
              : 'text-neutral-300 hover:text-white hover:bg-white/5'
          }`}
        >
          Shows
        </button>

        <button
          id="nav-tab-mylist"
          type="button"
          onClick={() => onSelectTab('mylist')}
          className={`relative px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'mylist'
              ? 'bg-[#307750] text-white shadow-md shadow-emerald-900/40 font-semibold'
              : 'text-neutral-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>My List</span>
          {myListCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-black text-xs font-bold flex items-center justify-center">
              {myListCount}
            </span>
          )}
        </button>

        <div className="w-[1px] h-4 bg-white/15 mx-1 hidden sm:block" />

        <button
          id="nav-btn-search"
          type="button"
          onClick={onOpenSearch}
          aria-label="Search movies and shows"
          className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          id="nav-btn-fullscreen"
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Mode'}
          aria-label="Toggle Full Screen"
          className="p-2 rounded-full text-neutral-300 hover:text-emerald-400 hover:bg-white/10 transition-colors cursor-pointer"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        <button
          id="nav-btn-settings"
          type="button"
          onClick={onOpenSettings}
          aria-label="Settings and TMDB configuration"
          className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </nav>
    </header>
  );
};
