import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  hideTextOnMobile?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '', hideTextOnMobile = false }) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7 min-w-[28px]', text: 'text-xs sm:text-sm font-bold', sub: 'text-[9px] sm:text-[10px]' },
    md: { icon: 'w-8 h-8 sm:w-9 sm:h-9 min-w-[32px] sm:min-w-[36px]', text: 'text-sm sm:text-base font-extrabold', sub: 'text-[10px] sm:text-xs' },
    lg: { icon: 'w-10 h-10 sm:w-12 sm:h-12 min-w-[40px] sm:min-w-[48px]', text: 'text-lg sm:text-xl font-black', sub: 'text-xs' },
    xl: { icon: 'w-14 h-14 sm:w-16 sm:h-16 min-w-[56px] sm:min-w-[64px]', text: 'text-xl sm:text-2xl font-black', sub: 'text-xs sm:text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 select-none ${className}`} id="app-logo">
      {/* Modern Tri-Concept Icon: Learning (Book) + AI (Neural Spark) + Growth (Ascending Sprout) */}
      <div
        className={`relative ${currentSize.icon} flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-coral-500 shadow-md shadow-sky-500/20 text-white overflow-hidden p-1.5`}
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
        <div className={`flex flex-col text-start truncate ${hideTextOnMobile ? 'hidden sm:flex' : 'flex'}`}>
          <span
            className={`${currentSize.text} tracking-tight font-en bg-gradient-to-r from-sky-700 via-sky-900 to-slate-900 dark:from-sky-300 dark:via-cyan-200 dark:to-white bg-clip-text text-transparent truncate leading-tight`}
          >
            Learn with Mohanna
          </span>
          <span className={`${currentSize.sub} font-fa font-medium text-slate-500 dark:text-slate-400 -mt-0.5 truncate hidden xs:inline`}>
            آموزش هوشمند زبان انگلیسی
          </span>
        </div>
      )}
    </div>
  );
};
