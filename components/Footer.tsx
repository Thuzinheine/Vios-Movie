'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer id="cinejoy-footer" className="w-full border-t border-white/5 bg-[#121212] mt-16 py-12 px-6 sm:px-12 relative text-center">
      <div className="max-w-4xl mx-auto space-y-5 flex flex-col items-center">
        {/* Logo and Discord */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-md">
              <svg
                className="w-5 h-5 text-white"
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
            <span className="font-extrabold text-lg tracking-wider text-emerald-400">
              CINEJOY
            </span>
          </div>

          <div className="w-px h-5 bg-white/20" />

          {/* Discord Icon */}
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CineJoy Discord Community"
            className="text-neutral-400 hover:text-indigo-400 transition-colors"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>
        </div>

        {/* Disclaimer subtext */}
        <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
          Cinejoy does not host, store, or distribute any media files. All content is sourced from third-party providers.
        </p>

        {/* Contact Email Link */}
        <div>
          <a
            href="mailto:contact@cinejoy.to"
            className="text-xs text-neutral-400 hover:text-emerald-400 underline underline-offset-4 transition-colors"
          >
            contact@cinejoy.to
          </a>
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          id="scroll-to-top-btn"
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#307750]/90 hover:bg-[#307750] text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer border border-emerald-400/40 backdrop-blur-md animate-in fade-in"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
};
