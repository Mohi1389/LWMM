import React from 'react';
import { Home, BookOpen, Bot, Award, Users, User as UserIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';

interface BottomNavProps {
  activeTab?: string;
  currentTab?: string;
  onNavigate?: (tab: string) => void;
  onTabChange?: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  currentTab,
  onNavigate,
  onTabChange,
}) => {
  const selectedTab = activeTab || currentTab || 'dashboard';
  const handleTabSelect = (tab: string) => {
    if (onNavigate) onNavigate(tab);
    if (onTabChange) onTabChange(tab);
  };
  const { language } = useLanguage();

  const navButtons = [
    { id: 'dashboard', icon: Home, labelFa: 'خانه', labelEn: 'Home' },
    { id: 'learn', icon: BookOpen, labelFa: 'درس‌ها', labelEn: 'Learn' },
    { id: 'ai', icon: Bot, labelFa: 'مهنا AI', labelEn: 'AI Chat' },
    { id: 'quizzes', icon: Award, labelFa: 'آزمون‌ها', labelEn: 'Quizzes' },
    { id: 'community', icon: Users, labelFa: 'جامعه', labelEn: 'Community' },
    { id: 'profile', icon: UserIcon, labelFa: 'پروفایل', labelEn: 'Profile' },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-1 py-1.5 shadow-2xl shadow-slate-950/20 pb-safe"
      id="mobile-bottom-nav"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navButtons.map((btn) => {
          const Icon = btn.icon;
          const active = selectedTab === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => handleTabSelect(btn.id)}
              id={`bottom-nav-${btn.id}`}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-300 active:scale-90 select-none ${
                active
                  ? 'text-sky-600 dark:text-sky-400 font-bold bg-sky-50/80 dark:bg-sky-950/60'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] mt-1 whitespace-nowrap font-medium transition-all">
                {language === 'fa' ? btn.labelFa : btn.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
