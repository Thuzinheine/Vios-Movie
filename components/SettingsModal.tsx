'use client';

import React, { useState } from 'react';
import { X, Key, Globe, Shield, Check, RefreshCw, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tmdbApiKey: string;
  onSaveTmdbApiKey: (key: string) => void;
  language: 'en' | 'my';
  onSelectLanguage: (lang: 'en' | 'my') => void;
  onClearWatchlist: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  tmdbApiKey,
  onSaveTmdbApiKey,
  language,
  onSelectLanguage,
  onClearWatchlist,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(tmdbApiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [clearedSuccess, setClearedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    onSaveTmdbApiKey(apiKeyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearList = () => {
    if (confirm(language === 'my' ? 'သိမ်းဆည်းထားသော စာရင်းကို အမှန်တကယ် ဖျက်လိုပါသလား?' : 'Are you sure you want to clear your watchlist?')) {
      onClearWatchlist();
      setClearedSuccess(true);
      setTimeout(() => setClearedSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        id="settings-backdrop"
        className="fixed inset-0 bg-black/85 backdrop-blur-md animate-in fade-in"
        onClick={onClose}
      />

      {/* Settings Card */}
      <div className="relative w-full max-w-xl bg-[#181818] border border-white/10 rounded-2xl shadow-2xl z-10 text-neutral-200 animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {language === 'my' ? 'ဆက်တင်များနှင့် TMDB စီစဉ်မှု' : 'Settings & TMDB Config'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-6">
          {/* Language Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{language === 'my' ? 'ဘာသာစကား (Language)' : 'Interface Language'}</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onSelectLanguage('en')}
                className={`p-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                  language === 'en'
                    ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400'
                    : 'border-white/10 bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <span>English (Default)</span>
                {language === 'en' && <Check className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={() => onSelectLanguage('my')}
                className={`p-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                  language === 'my'
                    ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400'
                    : 'border-white/10 bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <span>မြန်မာစာ (Myanmar)</span>
                {language === 'my' && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* TMDB API Key Config */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>{language === 'my' ? 'TMDB API Key (ရွေးချယ်ရန်)' : 'TMDB v3 API Key (Optional)'}</span>
            </label>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {language === 'my'
                ? 'TMDB API key မထည့်သွင်းပါက CineJoy ၏ built-in cache database မှ ပြီးပြည့်စုံသော data များကို အသုံးပြုပေးပါသည်။'
                : 'CineJoy works instantly with curated TMDB high-res assets. You can also provide your personal TMDB v3 API key for live real-time queries.'}
            </p>
            <div className="flex gap-2">
              <input
                id="tmdb-api-key-input"
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Enter TMDB v3 API Key or Read Access Token"
                className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-xl bg-[#307750] hover:bg-[#286443] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
            {savedSuccess && (
              <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'my' ? 'TMDB API Key သိမ်းဆည်းပြီးပါပြီ' : 'TMDB Key updated successfully!'}</span>
              </p>
            )}
          </div>

          {/* Manage Watchlist & Storage */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>{language === 'my' ? 'သိမ်းဆည်းမှု စီမံခန့်ခွဲရန်' : 'Storage & Watchlist'}</span>
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-white/5">
              <span className="text-sm text-neutral-300">
                {language === 'my' ? 'သိမ်းထားသော စာရင်းများ ဖျက်ရန်' : 'Clear saved Watchlist items'}
              </span>
              <button
                type="button"
                onClick={handleClearList}
                className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{clearedSuccess ? 'Cleared!' : 'Clear'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-900/60 border-t border-white/5 text-center text-xs text-neutral-500">
          CineJoy App • Version 2.4.0 • Powered by TMDB API
        </div>
      </div>
    </div>
  );
};
