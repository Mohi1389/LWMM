import React, { useState, useEffect } from 'react';
import {
  Flame,
  Sparkles,
  BookOpen,
  Bot,
  Film,
  Award,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Volume2,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Compass,
  Zap,
  Play,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { LearningProgress, VocabularyWord, VideoContent } from '../../types/index.js';
import { initialVocab, initialVideoLessons } from '../../data/seedData.js';

interface DashboardViewProps {
  onNavigate: (tab: string, subTab?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user, openPlacementModal, openAuthModal } = useAuth();
  const { language, t } = useLanguage();

  const [progress, setProgress] = useState<LearningProgress | null>(null);
  const [wordOfTheDay, setWordOfTheDay] = useState<VocabularyWord | null>(initialVocab[0] || null);
  const [movieLessons, setMovieLessons] = useState<VideoContent[]>(initialVideoLessons);
  const [isWordSaved, setIsWordSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    // Fetch personalized progress
    fetch('/api/learning/progress')
      .then((res) => res.json())
      .then((data) => setProgress(data))
      .catch(() => {});

    // Fetch vocabulary to select featured word of the day
    fetch('/api/vocabulary/list')
      .then((res) => res.json())
      .then((data: VocabularyWord[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const word = data.find((w) => w.english === 'Resilient') || data[0];
          setWordOfTheDay(word);
        }
      })
      .catch(() => {});

    // Fetch video lessons for dashboard showcase
    fetch('/api/learning/videos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMovieLessons(data);
        }
      })
      .catch(() => {
        setMovieLessons(initialVideoLessons);
      });
  }, []);

  const playPronunciation = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSaveWord = async () => {
    if (!wordOfTheDay) return;
    const endpoint = isWordSaved ? '/api/vocabulary/unsave' : '/api/vocabulary/save';
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wordId: wordOfTheDay.id }),
    });
    setIsWordSaved(!isWordSaved);
  };

  const dailyGoal = progress?.todayGoal || {
    wordsLearned: 0,
    targetWords: 5,
    aiPracticeDone: false,
    quizCompleted: false,
  };

  const goalPercentage = dailyGoal.targetWords > 0 ? Math.round(
    ((dailyGoal.wordsLearned / dailyGoal.targetWords) * 0.4 +
      (dailyGoal.aiPracticeDone ? 0.3 : 0) +
      (dailyGoal.quizCompleted ? 0.3 : 0)) *
      100
  ) : 0;

  return (
    <div className="space-y-5 sm:space-y-6 pb-12 animate-fade-in" id="dashboard-view">
      {/* 1. Welcome & Stats Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 text-white p-5 sm:p-8 shadow-xl shadow-sky-600/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] sm:text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
              <span>
                {language === 'fa' ? 'سطح آموزشی شما:' : 'Your Level:'}{' '}
                <strong className="capitalize font-en">{user?.englishLevel || 'Beginner'}</strong>
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-snug break-words">
              {user
                ? language === 'fa'
                  ? `خوش برگشتی، ${user.fullName || 'زبان‌آموز عزیز'} 👋`
                  : `Welcome back, ${user.fullName || 'Learner'} 👋`
                : language === 'fa'
                ? 'به پلتفرم هوشمند آموزش زبان مهنا خوش آمدید 👋'
                : 'Welcome to Learn with Mohanna 👋'}
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl leading-relaxed">
              {user
                ? language === 'fa'
                  ? 'امروز زمان فوق‌العاده‌ای برای یادگیری لغات جدید و مکالمه با مهنا است. بیایید شروع کنیم!'
                  : 'Ready for today’s micro-lesson and AI dialogue practice?'
                : language === 'fa'
                ? 'برای ذخیره لغات، محاسبه امتیاز XP، شرکت در آزمون‌ها و مکالمه با هوش مصنوعی وارد حساب خود شوید.'
                : 'Log in to track your personalized streaks, save words, and chat with AI.'}
            </p>
            {!user && (
              <div className="pt-2">
                <button
                  onClick={openAuthModal}
                  className="px-4 py-2 rounded-xl bg-white text-sky-700 hover:bg-sky-50 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>{language === 'fa' ? 'ورود / ایجاد حساب کاربری رایگان' : 'Login / Create Free Account'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Streak & XP Cards */}
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[80px] sm:min-w-[110px]">
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-amber-300 mb-0.5 sm:mb-1">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                <span className="text-lg sm:text-xl font-black font-mono">{user?.streak ?? 0}</span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-sky-100 font-medium whitespace-nowrap">
                {language === 'fa' ? 'روز استمرار' : 'Day Streak'}
              </span>
            </div>

            <div className="flex-1 sm:flex-none p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[80px] sm:min-w-[110px]">
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-cyan-200 mb-0.5 sm:mb-1">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
                <span className="text-lg sm:text-xl font-black font-mono">{user?.xp ?? 0}</span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-sky-100 font-medium whitespace-nowrap">
                {language === 'fa' ? 'مجموع XP' : 'Total XP'}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Background Glow */}
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-coral-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Main 2-Column Grid: Daily Goal Tracker & Word of the Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Goal Card (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  {t('dashboard.dailyGoal')}
                </h3>
                <span className="text-xs text-slate-500">
                  {language === 'fa' ? 'تکمیل فعالیت‌های روزانه برای کسب مدال استمرار' : 'Complete daily milestones'}
                </span>
              </div>
            </div>

            <span className="text-xs font-black font-mono text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2.5 py-1 rounded-lg">
              {goalPercentage}%
            </span>
          </div>

          {/* Goal Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-coral-500 rounded-full transition-all duration-500"
              style={{ width: `${goalPercentage}%` }}
            />
          </div>

          {/* 3 Checklist Items */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Goal 1: Words */}
            <div
              onClick={() => onNavigate('learn')}
              className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-3"
            >
              {dailyGoal.wordsLearned >= dailyGoal.targetWords ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400 flex-shrink-0" />
              )}
              <div className="text-start">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {language === 'fa' ? 'یادگیری ۵ لغت جدید' : 'Learn 5 Words'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {dailyGoal.wordsLearned} / {dailyGoal.targetWords}
                </span>
              </div>
            </div>

            {/* Goal 2: AI Practice */}
            <div
              onClick={() => onNavigate('ai')}
              className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-3"
            >
              {dailyGoal.aiPracticeDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400 flex-shrink-0" />
              )}
              <div className="text-start">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {language === 'fa' ? 'مکالمه با هوش مصنوعی' : 'AI Conversation'}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {dailyGoal.aiPracticeDone ? (language === 'fa' ? 'انجام شد' : 'Done') : (language === 'fa' ? 'شروع تمرین' : 'Pending')}
                </span>
              </div>
            </div>

            {/* Goal 3: Daily Quiz */}
            <div
              onClick={() => onNavigate('quizzes')}
              className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-3"
            >
              {dailyGoal.quizCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400 flex-shrink-0" />
              )}
              <div className="text-start">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {language === 'fa' ? 'آزمون کوتاه روزانه' : 'Daily Quick Quiz'}
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  {dailyGoal.quizCompleted ? (language === 'fa' ? 'تکمیل شد' : 'Done') : '+۴۰ XP پاداش'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Word of the Day Card (1 col) */}
        {wordOfTheDay && (
          <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-50/70 to-orange-50/30 dark:from-slate-900 dark:to-slate-800/60 border border-amber-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-200/60 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  {language === 'fa' ? 'لغت برگزیده امروز 🌟' : 'Word of the Day'}
                </span>
                <button
                  onClick={toggleSaveWord}
                  className="text-amber-600 dark:text-amber-400 hover:scale-110 transition-transform"
                  title="نشان کردن لغت"
                >
                  {isWordSaved ? <BookmarkCheck className="w-5 h-5 fill-amber-500" /> : <Bookmark className="w-5 h-5" />}
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white font-en tracking-tight">
                    {wordOfTheDay.english}
                  </h4>
                  <button
                    onClick={() => playPronunciation(wordOfTheDay.english)}
                    className={`p-1.5 rounded-lg bg-amber-200/50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 hover:bg-amber-300 transition-colors ${
                      isPlayingAudio ? 'animate-pulse' : ''
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-slate-500 font-mono">{wordOfTheDay.pronunciation}</span>
              </div>

              <div className="pt-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {wordOfTheDay.persianMeaning}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 italic font-en">
                  "{wordOfTheDay.exampleSentence}"
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('ai', 'chat')}
              className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Bot className="w-4 h-4" />
              <span>{language === 'fa' ? 'جمله‌سازی با این لغت در AI' : 'Practice with AI'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Core Feature Navigation Hub */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-slate-800 dark:text-white">
            {language === 'fa' ? 'بخش‌های اصلی یادگیری' : 'Learning Channels'}
          </h3>
          <span className="text-xs text-slate-500">
            {language === 'fa' ? 'مسیر خودت رو انتخاب کن' : 'Choose your focus'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: AI Chat & Roleplay */}
          <div
            onClick={() => onNavigate('ai')}
            className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {language === 'fa' ? 'دستیار و مکالمه مهنا' : 'Mohanna AI Companion'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'fa'
                  ? 'چت فارسی، رفع اشکال گرامر و سناریوهای رستوران، فرودگاه و خرید.'
                  : 'Persian-first AI chat, grammar doctor, and roleplays.'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400">
              <span>{language === 'fa' ? 'شروع گفتگو' : 'Start Practicing'}</span>
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Vocabulary & Dictionary */}
          <div
            onClick={() => onNavigate('learn')}
            className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {language === 'fa' ? 'بانک لغات و دیکشنری' : 'Vocabulary & Dictionary'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'fa'
                  ? 'فلش‌کارت‌های لغات ضروری، تلفظ صوتی IPA و جستجوی معانی با هوش مصنوعی.'
                  : 'Essential vocabulary decks, audio IPA, and smart dictionary lookup.'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>{language === 'fa' ? 'مشاهده لغات' : 'Explore Words'}</span>
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Movies & Animations */}
          <div
            onClick={() => onNavigate('movies')}
            className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <Film className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {language === 'fa' ? 'فیلم و انیمیشن' : 'Movies & Animation'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'fa'
                  ? 'آموزش زبان با دیالوگ‌های شیر شاه و مرد عنکبوتی همراه با زیرنویس دو زبانه.'
                  : 'Learn through famous movies clips with dual synchronized subtitles.'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>{language === 'fa' ? 'تماشا و یادگیری' : 'Watch Clips'}</span>
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Quizzes & Assessment */}
          <div
            onClick={() => onNavigate('quizzes')}
            className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {language === 'fa' ? 'آزمون‌ها و تعیین سطح' : 'Quizzes & Assessment'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'fa'
                  ? 'آزمون‌های زمان‌دار گرامر و لغت با کارنامه تحلیلی نقاط ضعف و قوت.'
                  : 'Grammar and vocabulary test hub with deep performance analytics.'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>{language === 'fa' ? 'شرکت در آزمون' : 'Take Quizzes'}</span>
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Movies & Animations Showcase (همه فیلم‌ها و انیمیشن‌ها) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{language === 'fa' ? 'یادگیری با انیمیشن و فیلم‌های برگزیده' : 'Featured Movies & Animations'}</span>
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full">
                  {movieLessons.length} {language === 'fa' ? 'ویدیو' : 'videos'}
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                {language === 'fa'
                  ? 'دیالوگ‌های واقعی با زیرنویس همگام انگلیسی و ترجمه روان فارسی'
                  : 'Real dialogues with synchronized bilingual interactive subtitles.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('movies')}
            className="flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl transition-all"
          >
            <span>{language === 'fa' ? 'مشاهده همه' : 'View All'}</span>
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
          </button>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {movieLessons.map((vid) => (
            <div
              key={vid.id}
              onClick={() => {
                try {
                  localStorage.setItem('lwmm_active_video_id', vid.id);
                } catch {}
                onNavigate('movies');
              }}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              {/* Thumbnail Container with Play Overlay */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={vid.thumbnail}
                  alt={vid.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600 transition-all shadow-lg">
                    <Play className="w-5 h-5 ml-0.5 rtl:mr-0.5 fill-white" />
                  </div>
                </div>
                <div className="absolute top-2.5 right-2.5 flex gap-1.5">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-white border border-white/10">
                    {vid.duration}
                  </span>
                </div>
                <div className="absolute bottom-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-600/90 backdrop-blur-md text-white">
                    {vid.category === 'animation' ? 'انیمیشن' : 'سینمایی'}
                  </span>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white font-en line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {vid.titleEn}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-fa line-clamp-1 mt-0.5">
                    {vid.titleFa}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-en capitalize">{vid.level}</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                    <span>{language === 'fa' ? 'پخش و تمرین' : 'Watch & Learn'}</span>
                    <ArrowLeft className="w-3 h-3 rtl:rotate-0 ltr:rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Personalized Weak Areas to Review */}
      {progress && progress.weakTopics && progress.weakTopics.length > 0 && (
        <div className="p-6 rounded-3xl bg-sky-50/50 dark:bg-slate-900/60 border border-sky-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                {language === 'fa' ? 'پیشنهاد مرور هوشمند مهنا' : 'Smart Review Recommendation'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {language === 'fa'
                  ? `موضوعات نیازمند تمرین: ${progress.weakTopics.join('، ')}`
                  : `Focus areas: ${progress.weakTopics.join(', ')}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('learn')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sky-600 dark:text-sky-400 hover:bg-sky-50 transition-colors self-start sm:self-auto"
          >
            {language === 'fa' ? 'تمرین این مباحث' : 'Practice Now'}
          </button>
        </div>
      )}
    </div>
  );
};
