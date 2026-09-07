import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Flame,
  Sparkles,
  Award,
  BookOpen,
  Compass,
  CheckCircle2,
  Calendar,
  Layers,
  Bot,
  RotateCcw,
  Settings as SettingsIcon,
  LogOut,
  Target,
  Zap,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { Achievement, QuizResult } from '../../types/index.js';

interface ProfileViewProps {
  onNavigateToAI: (prompt?: string) => void;
  onNavigate?: (tab: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigateToAI, onNavigate }) => {
  const { user, openPlacementModal, openAuthModal, logout, resetProgress } = useAuth();
  const { language } = useLanguage();

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [activeTab, setActiveTab] = useState<'achievements' | 'quiz_history' | 'roadmap'>('achievements');
  const [isResetting, setIsResetting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (user) {
      fetch('/api/learning/achievements')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setAchievements(data);
        })
        .catch(() => {});

      fetch('/api/quiz/user/history')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setQuizHistory(data);
        })
        .catch(() => {});
    }
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      if (onNavigate) {
        onNavigate('dashboard');
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleResetProgress = async () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید تمام پیشرفت، امتیازات و سوابق آزمون‌ها را از صفر شروع کنید؟')) {
      setIsResetting(true);
      await resetProgress();
      setQuizHistory([]);
      const achRes = await fetch('/api/learning/achievements');
      const achData = await achRes.json();
      if (Array.isArray(achData)) setAchievements(achData);
      setIsResetting(false);
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6 animate-fade-in" id="profile-unauth-view">
        <div className="w-20 h-20 rounded-3xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto shadow-inner">
          <UserIcon className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {language === 'fa' ? 'حساب کاربری یافت نشد' : 'No Account Logged In'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {language === 'fa'
              ? 'برای مشاهده پیشرفت، دستاوردها، کارنامه آزمون‌ها و شخصی‌سازی مسیر یادگیری، لطفاً وارد حساب خود شوید.'
              : 'Please log in or create an account to view your progress, achievements, and test history.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={openAuthModal}
            className="px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all"
          >
            {language === 'fa' ? 'ورود / ثبت‌نام در مهنا' : 'Sign In / Register'}
          </button>
          {onNavigate && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              {language === 'fa' ? 'بازگشت به داشبورد' : 'Back to Dashboard'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in" id="profile-view">
      {/* 1. Profile Identity Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-start">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-500 via-sky-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-sky-500/20 flex-shrink-0">
            {user.fullName ? user.fullName[0] : 'U'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {user.fullName || 'کاربر مهنا'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-en uppercase">
                {user.englishLevel || 'Beginner'}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-en">{user.email || 'learner@mohanna.edu'}</p>

            <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {language === 'fa' ? 'حساب فعال یادگیرنده' : 'Active Learner'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-center sm:justify-start">
          <button
            onClick={openPlacementModal}
            className="px-3.5 py-2 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-sky-500" />
            <span>{language === 'fa' ? 'تعیین سطح مجدد' : 'Placement Test'}</span>
          </button>

          {onNavigate && (
            <button
              onClick={() => onNavigate('settings')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'fa' ? 'تنظیمات' : 'Settings'}</span>
            </button>
          )}

          <button
            onClick={handleResetProgress}
            disabled={isResetting}
            title="شروع مجدد تمام داده‌ها از صفر"
            className="px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{language === 'fa' ? 'شروع از صفر' : 'Reset to 0'}</span>
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <LogOut className={`w-3.5 h-3.5 ${isLoggingOut ? 'animate-spin' : ''}`} />
            <span>{language === 'fa' ? 'خروج از حساب' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
          <Flame className="w-5 h-5 text-amber-500 mx-auto fill-amber-500" />
          <span className="block text-2xl font-black text-slate-900 dark:text-white font-mono">
            {user.streak ?? 0}
          </span>
          <span className="text-xs text-slate-500">
            {language === 'fa' ? 'روزهای استمرار' : 'Streak Days'}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
          <Sparkles className="w-5 h-5 text-sky-500 mx-auto" />
          <span className="block text-2xl font-black text-slate-900 dark:text-white font-mono">
            {user.xp ?? 0}
          </span>
          <span className="text-xs text-slate-500">
            {language === 'fa' ? 'امتیاز تجربه (XP)' : 'Total XP'}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
          <BookOpen className="w-5 h-5 text-indigo-500 mx-auto" />
          <span className="block text-2xl font-black text-slate-900 dark:text-white font-mono">
            {quizHistory.length}
          </span>
          <span className="text-xs text-slate-500">
            {language === 'fa' ? 'آزمون‌های انجام‌شده' : 'Quizzes Done'}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
          <Award className="w-5 h-5 text-purple-500 mx-auto" />
          <span className="block text-2xl font-black text-slate-900 dark:text-white font-mono">
            {unlockedCount} / {achievements.length || 4}
          </span>
          <span className="text-xs text-slate-500">
            {language === 'fa' ? 'مدال‌های کسب‌شده' : 'Badges Earned'}
          </span>
        </div>
      </div>

      {/* 3. Navigation Sub-Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 self-start">
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'achievements'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {language === 'fa' ? 'دستاوردها و نشان‌ها' : 'Achievements & Badges'}
        </button>

        <button
          onClick={() => setActiveTab('quiz_history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'quiz_history'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {language === 'fa'
            ? `سوابق آزمون‌ها (${quizHistory.length})`
            : `Quiz History (${quizHistory.length})`}
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'roadmap'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {language === 'fa' ? 'نقشه راه یادگیری' : 'Learning Roadmap'}
        </button>
      </div>

      {/* 4. TAB 1: ACHIEVEMENTS */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all flex items-start gap-3.5 ${
                ach.unlocked
                  ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm'
                  : 'bg-slate-50/60 dark:bg-slate-900/40 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="text-2xl p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                {ach.icon === 'award'
                  ? '🏅'
                  : ach.icon === 'flame'
                  ? '🔥'
                  : ach.icon === 'book-open'
                  ? '📚'
                  : ach.icon === 'bot'
                  ? '🤖'
                  : '⭐'}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {language === 'fa' ? ach.titleFa : ach.titleEn}
                  </h4>
                  {ach.unlocked && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {language === 'fa' ? ach.descriptionFa : ach.descriptionEn}
                </p>

                {ach.unlocked ? (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium block pt-1">
                    {language === 'fa' ? 'کسب‌شده' : 'Unlocked'} (+{ach.xpReward} XP)
                  </span>
                ) : (
                  <div className="pt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>
                        {ach.currentCount ?? 0} / {ach.targetCount}
                      </span>
                      <span>+{ach.xpReward} XP</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(((ach.currentCount ?? 0) / (ach.targetCount || 1)) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. TAB 2: QUIZ HISTORY & CARDS */}
      {activeTab === 'quiz_history' && (
        <div className="space-y-4">
          {quizHistory.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <Award className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {language === 'fa'
                  ? 'هنوز آزمونی ثبت نشده است'
                  : 'No Quizzes Completed Yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'fa'
                  ? 'با شرکت در آزمون‌های موضوعی یا آزمون تعیین سطح، نتایج و کارنامه‌های شما در این قسمت ثبت می‌شود.'
                  : 'Take quizzes to track your accuracy, speed metrics, and level progression here.'}
              </p>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('quizzes')}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  {language === 'fa' ? 'مشاهده آزمون‌ها' : 'Explore Quizzes'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizHistory.map((q) => (
                <div
                  key={q.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {q.quizTitle}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(q.completedAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono ${
                        q.percentage >= 70
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {q.percentage}% ({q.score}/{q.totalQuestions})
                    </span>
                  </div>

                  {/* Timing & Speed Metrics */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                    {q.timeSpentSeconds !== undefined && (
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-sky-500" />
                        {Math.floor(q.timeSpentSeconds / 60)}:
                        {String(q.timeSpentSeconds % 60).padStart(2, '0')} دقیقه
                      </span>
                    )}

                    {q.speedRating && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                        {q.speedRating === 'fast'
                          ? '⚡ سرعت بالا و مسلط'
                          : q.speedRating === 'moderate'
                          ? '⏱️ سرعت متعادل و خوب'
                          : '🎯 با دقت و تفکر'}
                      </span>
                    )}

                    {q.estimatedLevel && (
                      <span className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold text-[10px] font-en uppercase">
                        سطح: {q.estimatedLevel}
                      </span>
                    )}
                  </div>

                  {/* Recommendations preview */}
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl leading-relaxed">
                    💡 <strong>توصیه مهنا:</strong> {q.recommendedPath}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. TAB 3: LEARNING ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'fa' ? 'نقشه راه یادگیری هوشمند شما' : 'Personalized Learning Roadmap'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'fa'
                  ? 'برنامه تمرینی گام‌به‌گام تنظیم‌شده بر اساس سطح و سرعت یادگیری شما'
                  : 'Tailored steps based on your current proficiency and test history'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">۱. تمرین گرامر پایه</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-700">قدم اول</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                مرور زمان‌های ساده (حال و گذشته)، افعال to be و حروف اضافه متداول در مکالمات روزمره.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">۲. مکالمه تعاملی با AI</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">قدم دوم</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                انجام روزانه ۵ دقیقه چت صوتی و متنی با هوش مصنوعی مهنا در سناریوهای سفارش رستوران و سفر.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">۳. تحلیل دیالوگ فیلم‌ها</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">قدم سوم</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                مشاهده کلیپ‌های کوتاه همراه با زیرنویس هوشمند دو زبانه و تقویت درک شنیداری.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigateToAI('لطفاً برنامه یادگیری امروز من را بررسی کن و یک تمرین کوتاه بده.')}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>مشورت با هوش مصنوعی مهنا درباره برنامه هفتگی</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
