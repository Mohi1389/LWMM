import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Search,
  Bot,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { VocabularyWord, EnglishLevel } from '../../types/index.js';

interface LearnViewProps {
  onNavigateToAI: (initialPrompt?: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ onNavigateToAI }) => {
  const { user, addXp } = useAuth();
  const { language, t } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState<'vocab' | 'dictionary' | 'grammar'>('vocab');
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [learnedIds, setLearnedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Flashcard mode states
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);

  // Dictionary state
  const [dictQuery, setDictQuery] = useState('');
  const [dictResult, setDictResult] = useState<any>(null);
  const [isDictSearching, setIsDictSearching] = useState(false);
  const [dictError, setDictError] = useState<string | null>(null);

  useEffect(() => {
    // Load vocabulary
    fetch('/api/vocabulary/list')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setVocabulary(data);
      })
      .catch(() => {});

    // Load saved words
    fetch('/api/vocabulary/saved')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSavedIds(new Set(data.map((w: any) => w.id)));
        }
      })
      .catch(() => {});

    // Load learned words
    fetch('/api/vocabulary/learned')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLearnedIds(new Set(data.map((w: any) => w.id)));
        }
      })
      .catch(() => {});
  }, []);

  const playPronunciation = (text: string, id?: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      if (id) setPlayingWordId(id);
      utterance.onend = () => setPlayingWordId(null);
      utterance.onerror = () => setPlayingWordId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSaveWord = async (wordId: string) => {
    const isSaved = savedIds.has(wordId);
    const endpoint = isSaved ? '/api/vocabulary/unsave' : '/api/vocabulary/save';
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wordId }),
    });

    const newSet = new Set(savedIds);
    if (isSaved) newSet.delete(wordId);
    else newSet.add(wordId);
    setSavedIds(newSet);
  };

  const markAsLearned = async (wordId: string) => {
    if (learnedIds.has(wordId)) return;
    await fetch('/api/vocabulary/learned', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wordId }),
    });
    const newSet = new Set(learnedIds);
    newSet.add(wordId);
    setLearnedIds(newSet);
    addXp(10);
  };

  const handleDictSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dictQuery.trim()) return;
    setIsDictSearching(true);
    setDictError(null);

    try {
      const res = await fetch(`/api/dictionary/lookup?word=${encodeURIComponent(dictQuery.trim())}`);
      const data = await res.json();
      if (res.ok && data.entry) {
        setDictResult(data.entry);
      } else {
        setDictError(data.error || 'کلمه مورد نظر یافت نشد.');
      }
    } catch (err: any) {
      setDictError('خطا در جستجو');
    } finally {
      setIsDictSearching(false);
    }
  };

  const filteredVocab = vocabulary.filter((w) => {
    const matchesSearch =
      w.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.persianMeaning.includes(searchQuery);
    const matchesLevel = selectedLevel === 'all' || w.difficulty === selectedLevel;
    const matchesCategory = selectedCategory === 'all' || w.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const categories = Array.from(new Set(vocabulary.map((w) => w.category)));

  // Grammar Lessons Data
  const grammarLessons = [
    {
      id: 'g_present_simple',
      titleFa: 'زمان حال ساده (Present Simple)',
      titleEn: 'Present Simple Tense',
      level: 'Beginner',
      summaryFa: 'بیان کارهای روزمره، عادات، حقایق علمی و برنامه‌های منظم.',
      formula: 'Subject + Verb(+s/es for He/She/It) + Object',
      examples: [
        { en: 'I study English every day.', fa: 'من هر روز انگلیسی مطالعه می‌کنم.' },
        { en: 'She works at a hospital.', fa: 'او در یک بیمارستان کار می‌کند.' },
      ],
      tipsFa: 'برای منفی کردن از do not (don’t) یا does not (doesn’t) استفاده می‌کنیم.',
    },
    {
      id: 'g_present_continuous',
      titleFa: 'زمان حال استمراری (Present Continuous)',
      titleEn: 'Present Continuous Tense',
      level: 'Beginner',
      summaryFa: 'کارهایی که دقیقاً همین الان در حال وقوع هستند یا برنامه‌های قطعی آینده.',
      formula: 'Subject + am/is/are + Verb-ing',
      examples: [
        { en: 'We are practicing English speaking right now.', fa: 'ما همین الان داریم مکالمه انگلیسی تمرین می‌کنیم.' },
        { en: 'Look! The bird is singing.', fa: 'نگاه کن! پرنده دارد آواز می‌خواند.' },
      ],
      tipsFa: 'افعال حسی مثل like, know, understand معمولاً استمراری نمی‌شوند.',
    },
    {
      id: 'g_prepositions',
      titleFa: 'حروف اضافه زمان و مکان (In, On, At)',
      titleEn: 'Prepositions: In, On, At',
      level: 'Elementary',
      summaryFa: 'قانون طلایی هرم حروف اضافه از عام‌ترین به خاص‌ترین.',
      formula: 'IN (بزرگ/فصل/سال) > ON (روزها/خیابان) > AT (ساعت/نقطه دقیق)',
      examples: [
        { en: 'in 2026 / in summer / in Tehran', fa: 'در سال ۲۰۲۶ / در تابستان / در تهران' },
        { en: 'on Monday / on the street', fa: 'در روز دوشنبه / در خیابان' },
        { en: 'at 5:00 PM / at the airport', fa: 'در ساعت ۵ عصر / در فرودگاه' },
      ],
      tipsFa: 'برای تعطیلات بدون کلمه Day از at استفاده می‌شود: at Christmas.',
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in" id="learn-view">
      {/* 1. Header & Segment Tabs */}
      <div className="flex flex-col items-center justify-center text-center gap-4 w-full" id="learn-header-container">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {language === 'fa' ? 'مرکز آموزش و یادگیری' : 'Learning Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
            {language === 'fa'
              ? 'بانک لغات، دیکشنری هوشمند و درسنامه‌های کاربردی گرامر'
              : 'Vocabulary decks, AI dictionary, and grammar guides'}
          </p>
        </div>

        {/* Segmented Switcher: Exactly centered */}
        <div className="flex items-center justify-center w-full pt-1" id="learn-subtabs-wrapper">
          <div className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs max-w-full overflow-x-auto">
            <button
              id="subtab-vocab-btn"
              onClick={() => {
                setActiveSubTab('vocab');
                setIsFlashcardMode(false);
              }}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeSubTab === 'vocab'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {language === 'fa' ? 'بانک لغات' : 'Vocabulary'}
            </button>
            <button
              id="subtab-dictionary-btn"
              onClick={() => setActiveSubTab('dictionary')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeSubTab === 'dictionary'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {language === 'fa' ? 'دیکشنری هوشمند' : 'AI Dictionary'}
            </button>
            <button
              id="subtab-grammar-btn"
              onClick={() => setActiveSubTab('grammar')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeSubTab === 'grammar'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {language === 'fa' ? 'درسنامه گرامر' : 'Grammar'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUB-TAB 1: VOCABULARY DECKS */}
      {activeSubTab === 'vocab' && (
        <div className="space-y-6">
          {/* Controls Bar: Search + Filters + Flashcard Mode Toggle */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute top-3 right-3 w-4 h-4 text-slate-400 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'fa' ? 'جستجو در لغات انگلیسی یا فارسی...' : 'Search words...'}
                className="w-full px-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                <option value="all">{language === 'fa' ? 'همه سطوح' : 'All Levels'}</option>
                <option value="beginner">Beginner (مبتدی)</option>
                <option value="elementary">Elementary (مقدماتی)</option>
                <option value="pre-intermediate">Pre-Intermediate (متوسط پایه)</option>
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                <option value="all">{language === 'fa' ? 'همه دسته‌بندی‌ها' : 'All Categories'}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Flashcard Toggle */}
              <button
                onClick={() => {
                  setIsFlashcardMode(!isFlashcardMode);
                  setFlashcardIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isFlashcardMode
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{language === 'fa' ? 'حالت فلش‌کارت' : 'Flashcard Mode'}</span>
              </button>
            </div>
          </div>

          {/* FLASHCARD MODE VIEW */}
          {isFlashcardMode ? (
            <div className="max-w-xl mx-auto py-4 space-y-4">
              {filteredVocab.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500">
                  {language === 'fa' ? 'هیچ لغتی با فیلتر انتخابی یافت نشد.' : 'No words found.'}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-2">
                    <span>
                      کارت {flashcardIndex + 1} از {filteredVocab.length}
                    </span>
                    <span className="text-sky-600 dark:text-sky-400 capitalize">
                      {filteredVocab[flashcardIndex].category}
                    </span>
                  </div>

                  {/* Interactive Card with 3D Flip */}
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="relative min-h-[300px] rounded-3xl bg-gradient-to-b from-white to-sky-50/50 dark:from-slate-800 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700 shadow-xl p-8 flex flex-col justify-between cursor-pointer select-none transition-transform active:scale-[0.99]"
                  >
                    {!isFlipped ? (
                      /* Front Side (English) */
                      <div className="flex flex-col items-center justify-center my-auto space-y-3 text-center">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-en capitalize">
                          {filteredVocab[flashcardIndex].partOfSpeech}
                        </span>

                        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-en tracking-tight">
                          {filteredVocab[flashcardIndex].english}
                        </h3>

                        <div className="flex items-center gap-2 text-slate-400 font-mono text-sm">
                          <span>{filteredVocab[flashcardIndex].pronunciation}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playPronunciation(filteredVocab[flashcardIndex].english);
                            }}
                            className="p-1 rounded-lg hover:bg-sky-100 dark:hover:bg-slate-700 text-sky-600"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <span className="text-xs text-slate-400 pt-4 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          {language === 'fa' ? 'برای مشاهده معنی ضربه بزنید' : 'Click to flip for meaning'}
                        </span>
                      </div>
                    ) : (
                      /* Back Side (Persian Meaning & Sentence) */
                      <div className="flex flex-col items-center justify-center my-auto space-y-4 text-center">
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white font-fa">
                          {filteredVocab[flashcardIndex].persianMeaning}
                        </h4>

                        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 text-start w-full">
                          <p className="text-xs text-slate-800 dark:text-slate-200 font-en italic mb-1">
                            "{filteredVocab[flashcardIndex].exampleSentence}"
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-fa">
                            {filteredVocab[flashcardIndex].exampleTranslation}
                          </p>
                        </div>

                        {filteredVocab[flashcardIndex].tipsFa && (
                          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-start w-full">
                            <span className="block text-[11px] font-bold text-amber-800 dark:text-amber-300">
                              نکته مهنا:
                            </span>
                            <p className="text-[11px] text-amber-900 dark:text-amber-200">
                              {filteredVocab[flashcardIndex].tipsFa}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveWord(filteredVocab[flashcardIndex].id);
                        }}
                        className="text-xs font-bold text-slate-500 hover:text-amber-500 flex items-center gap-1"
                      >
                        {savedIds.has(filteredVocab[flashcardIndex].id) ? (
                          <>
                            <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span>نشان شده</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-4 h-4" />
                            <span>نشان کردن</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsLearned(filteredVocab[flashcardIndex].id);
                        }}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                          learnedIds.has(filteredVocab[flashcardIndex].id)
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>
                          {learnedIds.has(filteredVocab[flashcardIndex].id) ? 'یاد گرفته شد (+10 XP)' : 'بلدم!'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        setIsFlipped(false);
                        setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : filteredVocab.length - 1));
                      }}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
                    >
                      <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                      <span>{language === 'fa' ? 'کارت قبلی' : 'Previous'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsFlipped(false);
                        setFlashcardIndex((prev) => (prev < filteredVocab.length - 1 ? prev + 1 : 0));
                      }}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <span>{language === 'fa' ? 'کارت بعدی' : 'Next'}</span>
                      <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* GRID VIEW OF VOCABULARY CARDS */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVocab.map((word) => {
                const isSaved = savedIds.has(word.id);
                const isLearned = learnedIds.has(word.id);
                const isPlaying = playingWordId === word.id;

                return (
                  <div
                    key={word.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-sky-300 dark:hover:border-sky-700 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-en uppercase">
                            {word.difficulty}
                          </span>
                          <span className="text-[11px] text-slate-400 font-en italic">
                            ({word.partOfSpeech})
                          </span>
                        </div>

                        <button
                          onClick={() => toggleSaveWord(word.id)}
                          className="text-slate-400 hover:text-amber-500 transition-colors p-1"
                          title="نشان کردن"
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl font-black text-slate-900 dark:text-white font-en tracking-tight">
                            {word.english}
                          </h4>
                          <button
                            onClick={() => playPronunciation(word.english, word.id)}
                            className={`p-1 rounded-lg text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 ${
                              isPlaying ? 'animate-pulse' : ''
                            }`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{word.pronunciation}</span>
                      </div>

                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 font-fa">
                        {word.persianMeaning}
                      </p>

                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-en italic">
                          "{word.exampleSentence}"
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-fa">
                          {word.exampleTranslation}
                        </p>
                      </div>

                      {word.tipsFa && (
                        <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-xl border border-amber-100 dark:border-amber-900/50">
                          💡 <strong>نکته مهنا:</strong> {word.tipsFa}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => onNavigateToAI(`می‌خواهم با کلمه "${word.english}" جمله بسازم.`)}
                        className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>تمرین با AI</span>
                      </button>

                      <button
                        onClick={() => markAsLearned(word.id)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                          isLearned
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{isLearned ? 'یاد گرفته شد' : 'علامت بلدم'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. SUB-TAB 2: AI SMART DICTIONARY */}
      {activeSubTab === 'dictionary' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Dictionary Search Box */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              {language === 'fa' ? 'جستجوی هوشمند دیکشنری انگلیسی-فارسی' : 'Smart AI Dictionary Lookup'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'fa'
                ? 'هر کلمه یا اصطلاح انگلیسی را وارد کنید تا ترجمه دقیق، تلفظ، مثال‌ها و نکات کاربردی را دریافت نمایید.'
                : 'Enter any word to see definitions, phonetics, examples, and collocations.'}
            </p>

            <form onSubmit={handleDictSearch} className="flex gap-2">
              <input
                type="text"
                value={dictQuery}
                onChange={(e) => setDictQuery(e.target.value)}
                placeholder="مثال: Confidence, Appreciate, Look forward to..."
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-en"
              />
              <button
                type="submit"
                disabled={isDictSearching || !dictQuery.trim()}
                className="px-6 py-3 rounded-2xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isDictSearching ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{language === 'fa' ? 'جستجو' : 'Search'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Dictionary Result Card */}
          {dictError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-300">
              {dictError}
            </div>
          )}

          {dictResult && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-5 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white font-en">
                      {dictResult.word}
                    </h2>
                    <button
                      onClick={() => playPronunciation(dictResult.word)}
                      className="p-1.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 hover:bg-sky-100 transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                    <span>{dictResult.pronunciation}</span>
                    <span>•</span>
                    <span className="italic capitalize">{dictResult.partOfSpeech}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                      {dictResult.difficulty}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToAI(`لطفاً با کلمه "${dictResult.word}" چند جمله روزمره با من تمرین کن.`)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 flex items-center gap-1.5 hover:bg-sky-100"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>تمرین با مهنا</span>
                </button>
              </div>

              {/* Persian Meaning */}
              <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60">
                <span className="block text-xs font-bold text-sky-800 dark:text-sky-300 mb-1">
                  معنی دقیق فارسی:
                </span>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {dictResult.persianMeaning}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-en mt-1">
                  {dictResult.englishDefinition}
                </p>
              </div>

              {/* Examples */}
              {dictResult.examples && dictResult.examples.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    مثال‌های کاربردی در جملات:
                  </span>
                  <div className="space-y-2">
                    {dictResult.examples.map((ex: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1"
                      >
                        <p className="text-xs text-slate-800 dark:text-slate-200 font-en font-medium italic">
                          "{ex.en}"
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-fa">
                          {ex.fa}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Collocations & Synonyms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {dictResult.collocations && dictResult.collocations.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      ترکیبات رایج (Collocations):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dictResult.collocations.map((col: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-700 text-xs text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-en"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {dictResult.synonyms && dictResult.synonyms.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      مترادف‌ها (Synonyms):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dictResult.synonyms.map((syn: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-700 text-xs text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-en"
                        >
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mohanna Tip */}
              {dictResult.tipsFa && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-amber-800 dark:text-amber-300">
                      نکته آموزشی مهنا:
                    </span>
                    <p className="text-xs text-amber-900 dark:text-amber-200 mt-0.5 leading-relaxed">
                      {dictResult.tipsFa}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. SUB-TAB 3: GRAMMAR ESSENTIALS */}
      {activeSubTab === 'grammar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {grammarLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                      {lesson.level}
                    </span>
                    <BookOpen className="w-4 h-4 text-slate-400" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {lesson.titleFa}
                    </h3>
                    <span className="text-xs text-slate-400 font-en font-medium">
                      {lesson.titleEn}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {lesson.summaryFa}
                  </p>

                  <div className="p-3 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900 font-mono text-xs text-sky-800 dark:text-sky-200">
                    <strong>فرمول:</strong> {lesson.formula}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      مثال‌ها:
                    </span>
                    {lesson.examples.map((ex, idx) => (
                      <div key={idx} className="text-xs">
                        <p className="font-en text-slate-800 dark:text-slate-200 italic">"{ex.en}"</p>
                        <p className="text-slate-500 text-[11px] font-fa">{ex.fa}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-900 dark:text-amber-200">
                    💡 {lesson.tipsFa}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToAI(`می‌خواهم گرامر "${lesson.titleEn}" را با تمرین و مثال یاد بگیرم.`)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                >
                  <Bot className="w-4 h-4" />
                  <span>تمرین تعاملی این گرامر با مهنا</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
