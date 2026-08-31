import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-sm font-bold', sub: 'text-[10px]' },
    md: { icon: 'w-9 h-9', text: 'text-base font-extrabold', sub: 'text-xs' },
    lg: { icon: 'w-12 h-12', text: 'text-xl font-black', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-2xl font-black', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`} id="app-logo">
      {/* Modern Tri-Concept Icon: Learning (Book) + AI (Neural Spark) + Growth (Ascending Sprout) */}
      <div
        className={`relative ${currentSize.icon} flex items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-coral-500 shadow-md shadow-sky-500/20 text-white overflow-hidden p-1.5`}
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 50%, #f97316 100%)',
        }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Open Book Wings (Learning) */}
          <path
            d="M8 36C12 33 18 33 24 35C30 33 36 33 40 36V14C36 11 30 11 24 13C18 11 12 11 8 14V36Z"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="white"
            fillOpacity="0.15"
          />
          {/* Central Spine */}
          <path
            d="M24 13V35"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Growth Sprout & Rising Arrow (Growth & Progress) */}
          <path
            d="M24 24C24 18 29 16 32 16C32 20 28 23 24 24Z"
            fill="#ffedd5"
            stroke="#ffedd5"
            strokeWidth="1.5"
          />
          {/* AI Neural Sparkle (AI Intelligence) */}
          <path
            d="M24 6L25.5 10L29.5 11.5L25.5 13L24 17L22.5 13L18.5 11.5L22.5 10L24 6Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-start">
          <span
            className={`${currentSize.text} tracking-tight font-en bg-gradient-to-r from-sky-700 via-sky-900 to-slate-900 dark:from-sky-300 dark:via-cyan-200 dark:to-white bg-clip-text text-transparent`}
          >
            Learn with Mohanna
          </span>
          <span className={`${currentSize.sub} font-fa font-medium text-slate-500 dark:text-slate-400 -mt-0.5`}>
            آموزش هوشمند زبان انگلیسی
          </span>
        </div>
      )}
    </div>
  );
};
