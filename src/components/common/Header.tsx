import React, { useState, useEffect } from 'react';
import {
  Flame,
  Sparkles,
  Globe,
  Sun,
  Moon,
  Monitor,
  Bell,
  User as UserIcon,
  Shield,
  BookOpen,
  LogOut,
  ChevronDown,
  Check,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { Logo } from './Logo.js';
import { AppNotification } from '../../types/index.js';

interface HeaderProps {
  activeTab?: string;
  currentTab?: string;
  onNavigate?: (tab: string, subTab?: string) => void;
  onTabChange?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
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

  const { user, logout, openAuthModal, openPlacementModal } = useAuth();
  const { language, setLanguage, t, dir } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetch('/api/learning/notifications')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setNotifications(data);
        })
        .catch(() => {});
    }
  }, [user]);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const markNotifRead = async (id: string) => {
    await fetch(`/api/learning/notifications/${id}/read`, { method: 'POST' });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const navItems = [
    { id: 'dashboard', labelFa: 'داشبورد', labelEn: 'Dashboard' },
    { id: 'learn', labelFa: 'درس‌ها و لغات', labelEn: 'Learn' },
    { id: 'ai', labelFa: 'دستیار مهنا', labelEn: 'Mohanna AI' },
    { id: 'movies', labelFa: 'فیلم و انیمیشن', labelEn: 'Movies' },
    { id: 'quizzes', labelFa: 'آزمون‌ها', labelEn: 'Quizzes' },
    { id: 'community', labelFa: 'جامعه و چت', labelEn: 'Community' },
  ];

  return (
    <header
      className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors"
      id="main-header"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Logo & Desktop Navigation */}
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 min-w-0 flex-1 sm:flex-initial">
          <button
            onClick={() => handleTabSelect('dashboard')}
            className="flex items-center focus:outline-none transition-transform hover:scale-[1.02] min-w-0"
            id="header-logo-btn"
          >
            <Logo size="md" hideTextOnMobile={true} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" id="desktop-nav">
            {navItems.map((item) => {
              const active = selectedTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  id={`nav-link-${item.id}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {language === 'fa' ? item.labelFa : item.labelEn}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Gamification Badges, Tools & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* User Gamification Stats (Streak & XP) */}
          {user && (
            <div className="flex items-center gap-1 sm:gap-2 bg-slate-100/90 dark:bg-slate-800/90 rounded-xl p-1 px-2 sm:px-2.5">
              {/* Streak */}
              <div
                className="flex items-center gap-0.5 sm:gap-1 text-[11px] sm:text-xs font-bold text-amber-600 dark:text-amber-400"
                title={`${user.streak ?? 0} روز تمرین پیاپی`}
                id="streak-badge"
              >
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500 text-amber-500 animate-pulse" />
                <span className="font-mono">{user.streak ?? 0}</span>
              </div>

              <div className="w-[1px] h-3 sm:h-3.5 bg-slate-300 dark:bg-slate-700" />

              {/* XP */}
              <div
                className="flex items-center gap-0.5 sm:gap-1 text-[11px] sm:text-xs font-bold text-sky-600 dark:text-sky-400"
                title={`${user.xp ?? 0} امتیاز تجربه (XP)`}
                id="xp-badge"
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-500" />
                <span className="font-mono">{user.xp ?? 0}</span>
                <span className="hidden xs:inline text-[10px] font-normal text-slate-400">XP</span>
              </div>
            </div>
          )}

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              id="lang-toggle-btn"
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1 transition-colors"
              aria-label="تغییر زبان"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="uppercase text-[11px] sm:text-xs">{language}</span>
            </button>

            {isLangMenuOpen && (
              <div
                className={`absolute ${
                  dir === 'rtl' ? 'left-0' : 'right-0'
                } mt-2 w-32 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50`}
              >
                <button
                  onClick={() => {
                    setLanguage('fa');
                    setIsLangMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 ${
                    language === 'fa' ? 'font-bold text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>فارسی (FA)</span>
                  {language === 'fa' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setLanguage('en');
                    setIsLangMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 ${
                    language === 'en' ? 'font-bold text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>English (EN)</span>
                  {language === 'en' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            id="theme-toggle-btn"
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="تغییر تم"
            title={isDark ? 'تم روشن' : 'تم تیره'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                id="notification-bell-btn"
                className="relative p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="اعلان‌ها"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-coral-500 animate-ping" />
                )}
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-coral-500" />
                )}
              </button>

              {isNotifOpen && (
                <div
                  className={`absolute ${
                    dir === 'rtl' ? 'left-0 sm:left-auto sm:right-0' : 'right-0 sm:right-auto sm:left-0'
                  } mt-2 w-72 sm:w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-3 z-50`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {language === 'fa' ? 'اعلان‌ها و یادآوری‌ها' : 'Notifications'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {unreadNotifs} {language === 'fa' ? 'خوانده نشده' : 'unread'}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-slate-500 py-6">
                        {language === 'fa' ? 'اعلانی وجود ندارد.' : 'No notifications.'}
                      </p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotifRead(notif.id)}
                          className={`p-2.5 rounded-lg my-1 cursor-pointer transition-colors ${
                            notif.read
                              ? 'opacity-70 bg-transparent'
                              : 'bg-sky-50/70 dark:bg-sky-950/40'
                          }`}
                        >
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {language === 'fa' ? notif.titleFa : notif.titleEn}
                          </p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {language === 'fa' ? notif.messageFa : notif.messageEn}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile / Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                id="user-menu-btn"
                className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-coral-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {user.fullName?.charAt(0) || 'U'}
                </div>
                <div className="hidden md:flex flex-col text-start text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {user.fullName}
                  </span>
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 capitalize">
                    {user.englishLevel}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xs:block" />
              </button>

              {isUserMenuOpen && (
                <div
                  className={`absolute ${
                    dir === 'rtl' ? 'left-0' : 'right-0'
                  } mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1.5 z-50`}
                >
                  <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-700 md:hidden">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.fullName}</p>
                    <p className="text-[10px] text-sky-600 dark:text-sky-400 capitalize font-mono">{user.englishLevel}</p>
                  </div>

                  <button
                    onClick={() => {
                      handleTabSelect('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <UserIcon className="w-4 h-4 text-sky-500" />
                    <span>{language === 'fa' ? 'پروفایل و دستاوردها' : 'Profile & Stats'}</span>
                  </button>

                  <button
                    onClick={() => {
                      handleTabSelect('settings');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <SettingsIcon className="w-4 h-4 text-slate-500" />
                    <span>{language === 'fa' ? 'تنظیمات و سفارشی‌سازی' : 'Settings'}</span>
                  </button>

                  <button
                    onClick={() => {
                      openPlacementModal();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span>{t('placement.title')}</span>
                  </button>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        handleTabSelect('admin');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-xs flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Shield className="w-4 h-4" />
                      <span>{language === 'fa' ? 'پنل مدیریت و تولید محتوا' : 'Admin Studio'}</span>
                    </button>
                  )}

                  <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('auth.logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              id="header-login-btn"
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-sm shadow-sky-600/20 transition-all hover:shadow active:scale-95 whitespace-nowrap"
            >
              {t('auth.login')} / {t('auth.signup')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
