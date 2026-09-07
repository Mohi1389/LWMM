import React, { useState } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { VideoContent } from '../../types/index.js';

interface MovieCardCoverProps {
  video: VideoContent;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showPlayBtn?: boolean;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

// Visual themes for animations and movies to ensure 0% black screen even if offline or blocked
const THEMES: Record<
  string,
  {
    gradient: string;
    emoji: string;
    tagFa: string;
    tagEn: string;
    badgeColor: string;
    quoteEn: string;
    accentGlow: string;
  }
> = {
  vid_lion_king: {
    gradient: 'from-amber-600 via-orange-600 to-amber-950',
    emoji: '🦁',
    tagFa: 'انیمیشن دیزنی',
    tagEn: 'Disney Animation',
    badgeColor: 'bg-amber-500/80 text-white',
    quoteEn: 'Hakuna Matata!',
    accentGlow: 'rgba(245, 158, 11, 0.4)',
  },
  vid_inside_out: {
    gradient: 'from-blue-600 via-violet-600 to-fuchsia-900',
    emoji: '🧠',
    tagFa: 'انیمیشن پیکسار',
    tagEn: 'Pixar Animation',
    badgeColor: 'bg-purple-500/80 text-white',
    quoteEn: 'Inside your head...',
    accentGlow: 'rgba(168, 85, 247, 0.4)',
  },
  vid_kungfu_panda: {
    gradient: 'from-emerald-600 via-teal-700 to-emerald-950',
    emoji: '🐼',
    tagFa: 'دریم‌ورکس',
    tagEn: 'DreamWorks',
    badgeColor: 'bg-emerald-500/80 text-white',
    quoteEn: 'Today is a gift',
    accentGlow: 'rgba(16, 185, 129, 0.4)',
  },
  vid_spiderman: {
    gradient: 'from-red-600 via-rose-700 to-blue-950',
    emoji: '🕷️',
    tagFa: 'مارول سینمایی',
    tagEn: 'Marvel Studios',
    badgeColor: 'bg-red-500/80 text-white',
    quoteEn: 'Great responsibility',
    accentGlow: 'rgba(239, 68, 68, 0.4)',
  },
  vid_harry_potter: {
    gradient: 'from-indigo-800 via-purple-900 to-slate-950',
    emoji: '🧙‍♂️',
    tagFa: 'دنیای هاگوارتز',
    tagEn: 'Wizarding World',
    badgeColor: 'bg-indigo-500/80 text-white',
    quoteEn: 'Our choices matter',
    accentGlow: 'rgba(99, 102, 241, 0.4)',
  },
  vid_interstellar: {
    gradient: 'from-slate-900 via-blue-950 to-indigo-950',
    emoji: '🚀',
    tagFa: 'علمی‌تخیلی نولان',
    tagEn: 'Sci-Fi Classic',
    badgeColor: 'bg-cyan-500/80 text-white',
    quoteEn: 'Love transcends time',
    accentGlow: 'rgba(6, 182, 212, 0.4)',
  },
};

const DEFAULT_THEME = {
  gradient: 'from-purple-700 via-indigo-800 to-slate-950',
  emoji: '🎬',
  tagFa: 'فیلم و انیمیشن',
  tagEn: 'Movie & Animation',
  badgeColor: 'bg-purple-500/80 text-white',
  quoteEn: 'Learn English',
  accentGlow: 'rgba(147, 51, 234, 0.4)',
};

export const MovieCardCover: React.FC<MovieCardCoverProps> = ({
  video,
  size = 'md',
  showPlayBtn = true,
  active = false,
  className = '',
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);
  const theme = THEMES[video.id] || DEFAULT_THEME;

  // Render hero size (used over player when paused/idle)
  if (size === 'hero') {
    return (
      <div
        onClick={onClick}
        className={`relative w-full h-full cursor-pointer select-none overflow-hidden bg-gradient-to-br ${theme.gradient} flex flex-col justify-between p-4 sm:p-8 ${className}`}
      >
        {/* Subtle Decorative Pattern Background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Ambient Big Emoji Background Watermark */}
        <div className="absolute -right-8 -bottom-8 text-[120px] sm:text-[180px] opacity-25 select-none pointer-events-none filter blur-[1px]">
          {theme.emoji}
        </div>

        {/* Background Image if available and loaded without error */}
        {!imgError && video.thumbnail && (
          <img
            src={video.thumbnail}
            alt={video.titleEn}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${theme.badgeColor} shadow-sm`}>
              {theme.emoji} {theme.tagFa}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/40 text-white/90 backdrop-blur-md border border-white/10">
              {video.duration}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/20">
            {video.level}
          </span>
        </div>

        {/* Center Giant Animated Play Button */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto py-4">
          <div className="group/play w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 text-purple-900 shadow-2xl flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all duration-300">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 rtl:mr-1 fill-purple-900 text-purple-900" />
          </div>
          <p className="mt-3 text-xs sm:text-sm font-bold text-white bg-black/50 backdrop-blur-md px-4 py-1 rounded-full border border-white/10">
            برای تماشا و یادگیری کلیک کنید
          </p>
        </div>

        {/* Bottom Title & Dialog Preview */}
        <div className="relative z-10 space-y-1 bg-gradient-to-t from-black/80 via-black/40 to-transparent -mx-4 -mb-4 sm:-mx-8 sm:-mb-8 p-4 sm:p-6 pt-8">
          <h2 className="text-lg sm:text-2xl font-black text-white font-en tracking-wide drop-shadow-md">
            {video.titleEn}
          </h2>
          <p className="text-xs sm:text-sm font-medium text-white/80 font-fa">
            {video.titleFa}
          </p>
        </div>
      </div>
    );
  }

  // Small size for playlist thumbnails (w-16 h-12)
  if (size === 'sm') {
    return (
      <div
        onClick={onClick}
        className={`relative w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white shadow-xs ${className}`}
      >
        {!imgError && video.thumbnail && (
          <img
            src={video.thumbnail}
            alt={video.titleEn}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="relative z-10 text-xl select-none">
          {theme.emoji}
        </div>
        {showPlayBtn && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Play className="w-3.5 h-3.5 fill-white text-white opacity-90" />
          </div>
        )}
      </div>
    );
  }

  // Medium / Grid card size (Aspect 16:9)
  return (
    <div
      onClick={onClick}
      className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br ${theme.gradient} p-3 flex flex-col justify-between text-white select-none transition-all duration-300 ${
        active ? 'ring-2 ring-purple-500 shadow-md' : ''
      } ${className}`}
    >
      {/* Background image fallback */}
      {!imgError && video.thumbnail && (
        <img
          src={video.thumbnail}
          alt={video.titleEn}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      )}

      {/* Decorative emoji watermark */}
      <div className="absolute -right-4 -bottom-4 text-7xl opacity-20 select-none pointer-events-none">
        {theme.emoji}
      </div>

      {/* Top badges */}
      <div className="relative z-10 flex items-center justify-between">
        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold backdrop-blur-md ${theme.badgeColor}`}>
          {theme.emoji} {theme.tagFa}
        </span>
        <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-black/40 text-white/90 backdrop-blur-md">
          {video.duration}
        </span>
      </div>

      {/* Center Play Icon */}
      {showPlayBtn && (
        <div className="relative z-10 flex items-center justify-center my-auto">
          <div className="w-10 h-10 rounded-full bg-white/90 text-purple-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 ml-0.5 rtl:mr-0.5 fill-purple-900 text-purple-900" />
          </div>
        </div>
      )}

      {/* Bottom Quote & Level */}
      <div className="relative z-10 flex items-center justify-between text-[11px] pt-1 border-t border-white/10">
        <span className="font-en italic truncate opacity-90 text-[10px]">
          "{theme.quoteEn}"
        </span>
        <span className="px-1.5 py-0.2 rounded font-bold text-[9px] uppercase bg-white/20 text-white">
          {video.level}
        </span>
      </div>
    </div>
  );
};
