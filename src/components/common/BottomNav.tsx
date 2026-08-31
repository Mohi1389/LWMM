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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg shadow-slate-900/10"
      id="mobile-bottom-nav"
    >
      <div className="flex items-center justify-around">
        {navButtons.map((btn) => {
          const Icon = btn.icon;
          const active = selectedTab === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => handleTabSelect(btn.id)}
              id={`bottom-nav-${btn.id}`}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-sky-600 dark:text-sky-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {btn.id === 'ai' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-coral-500 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 whitespace-nowrap">
                {language === 'fa' ? btn.labelFa : btn.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
