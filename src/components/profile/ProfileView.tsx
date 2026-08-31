import React, { useState, useEffect } from 'react';
import {
  User,
  Flame,
  Sparkles,
  Award,
  Bookmark,
  BookOpen,
  Volume2,
  Trash2,
  Compass,
  CheckCircle2,
  Calendar,
  Layers,
  Bot,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { VocabularyWord } from '../../types/index.js';

interface ProfileViewProps {
  onNavigateToAI: (prompt?: string) => void;
  onNavigate?: (tab: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigateToAI, onNavigate }) => {
  const { user, openPlacementModal, logout } = useAuth();
  const { language } = useLanguage();

  const [savedWords, setSavedWords] = useState<VocabularyWord[]>([]);
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'achievements' | 'stats'>('bookmarks');

  useEffect(() => {
    fetch('/api/vocabulary/saved')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSavedWords(data);
      })
      .catch(() => {});
  }, []);

  const handleUnsave = async (wordId: string) => {
    await fetch('/api/vocabulary/unsave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wordId }),
    });
    setSavedWords((prev) => prev.filter((w) => w.id !== wordId));
  };

  const playTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Mock Achievements
  const achievements = [
    {
      id: 'first_step',
      titleFa: 'گام اول یادگیری',
      descriptionFa: 'تکمیل اولین درس واژگان در مهنا',
      icon: '🌱',
      unlocked: true,
      unlockedAt: '۱۴۰۳/۰۶/۱۰',
    },
    {
      id: 'streak_3',
      titleFa: 'استمرار ۳ روزه',
      descriptionFa: '۳ روز متوالی تمرین در اپلیکیشن',
      icon: '🔥',
      unlocked: true,
      unlockedAt: '۱۴۰۳/۰۶/۱۲',
    },
    {
      id: 'ai_explorer',
      titleFa: 'هم‌صحبت هوش مصنوعی',
      descriptionFa: 'انجام اولین مکالمه کامل سناریو با مهنا',
      icon: '🤖',
      unlocked: true,
      unlockedAt: '۱۴۰۳/۰۶/۱۳',
    },
    {
      id: 'vocab_master_50',
      titleFa: 'استاد ۵۰ لغت',
      descriptionFa: 'یادگیری و ثبت ۵۰ کلمه در جعبه لغات',
      icon: '📚',
      unlocked: false,
      progress: '12 / 50',
    },
    {
      id: 'quiz_champion',
      titleFa: 'قهرمان آزمون‌ها',
      descriptionFa: 'کسب نمره کامل ۱۰۰٪ در ۵ کوییز متوالی',
      icon: '👑',
      unlocked: false,
      progress: '2 / 5',
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in" id="profile-view">
      {/* 1. Profile Identity Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-start">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-500 via-sky-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-sky-500/20 flex-shrink-0">
            {user?.fullName ? user.fullName[0] : 'M'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {user?.fullName || 'کاربر مهنا'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-en uppercase">
                {user?.englishLevel || 'Beginner'}
              </span>
            </div>

            <p className="text-xs text-slate-500">{user?.email || 'learner@mohanna.edu'}</p>

            <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                عضویت از تابستان ۱۴۰۳
              </span>
            </div>
          </div>
        </div>

        {/* Level reassessment & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-center sm:justify-start">
          <button
            onClick={openPlacementModal}
            className="px-4 py-2.5 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-sky-100 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>{language === 'fa' ? 'تعیین سطح مجدد' : 'Placement Test'}</span>
          </button>

          {onNavigate && (
            <button
              onClick={() => onNavigate('settings')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>{language === 'fa' ? 'تنظیمات' : 'Settings'}</span>
            </button>
          )}

          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold transition-colors"
          >
            {language === 'fa' ? 'خروج از حساب' : 'Logout'}
          </button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
          <Flame className="w-5 h-5 text-amber-500 mx-auto fill-amber-500" />
          <span className="block text-2xl font-black text-slate-900 dark:text-white font-mono">
            {user?.streak || 4}
          </span>
          <span className="text-xs text-slate-500">روزهای استمرار</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
          <Sparkles className="w-5 h-5 text-sky-500 mx-auto" />
          <span className="block text-2xl font-black text-slate-900 dark:text-white font-mono">
            {user?.xp || 320}
          </span>
          <span className="text-xs text-slate-500">امتیاز تجربه (XP)</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
          <BookOpen className="w-5 h-5 text-emerald-500 mx-auto" />
          <span className="block text-2xl font-black text-slate-900 dark:text-white font-mono">
            {savedWords.length}
          </span>
          <span className="text-xs text-slate-500">لغات ذخیره‌شده</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
          <Award className="w-5 h-5 text-purple-500 mx-auto" />
          <span className="block text-2xl font-black text-slate-900 dark:text-white font-mono">
            ۳
          </span>
          <span className="text-xs text-slate-500">مدال‌های کسب‌شده</span>
        </div>
      </div>

      {/* 3. Sub-Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 self-start">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bookmarks'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          دفترچه لغات نشان‌شده ({savedWords.length})
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'achievements'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          دستاوردها و مدال‌ها
        </button>
      </div>

      {/* 4. TAB 1: SAVED VOCABULARY */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          {savedWords.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                هنوز کلمه‌ای را نشان نکرده‌اید!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                هنگام مطالعه لغات یا فیلم‌ها روی آیکون بوکمارک کلیک کنید تا در این دفترچه برای مرور
                سریع ذخیره شوند.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedWords.map((word) => (
                <div
                  key={word.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-black text-slate-900 dark:text-white font-en">
                        {word.english}
                      </h4>
                      <button
                        onClick={() => playTTS(word.english)}
                        className="text-sky-600 p-1 hover:bg-sky-50 rounded-lg"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-fa">
                      {word.persianMeaning}
                    </p>

                    <p className="text-[11px] text-slate-500 italic font-en">
                      "{word.exampleSentence}"
                    </p>

                    <button
                      onClick={() => onNavigateToAI(`می‌خواهم با کلمه "${word.english}" جمله بسازم.`)}
                      className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 pt-1"
                    >
                      <Bot className="w-3 h-3" />
                      <span>تمرین جمله‌سازی با AI</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleUnsave(word.id)}
                    className="text-slate-300 hover:text-rose-500 p-1.5 transition-colors"
                    title="حذف از نشان‌شده‌ها"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 2: ACHIEVEMENTS GALLERY */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                ach.unlocked
                  ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm'
                  : 'bg-slate-50/60 dark:bg-slate-900/40 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="text-3xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                {ach.icon}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {ach.titleFa}
                  </h4>
                  {ach.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {ach.descriptionFa}
                </p>

                {ach.unlocked ? (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium block pt-1">
                    کسب‌شده در {ach.unlockedAt}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono block pt-1">
                    پیشرفت: {ach.progress}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
