import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Heart,
  ShieldCheck,
  Send,
  Plus,
  AlertTriangle,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  Volume2,
  Lightbulb,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { CommunityPost, CommunityExpression, GrammarHelpTip } from '../../types/index.js';

type CommunityTab = 'discussions' | 'expressions' | 'grammar';

// Helper to format difficulty and user level badges cleanly for RTL & LTR
const getLevelBadgeText = (level?: string, lang: 'fa' | 'en' = 'fa') => {
  if (!level) return '';
  const norm = level.toLowerCase().trim();
  const map: Record<string, { fa: string; en: string }> = {
    beginner: { fa: 'مبتدی (A1)', en: 'Beginner (A1)' },
    elementary: { fa: 'مقدماتی (A2)', en: 'Elementary (A2)' },
    'pre-intermediate': { fa: 'پیش‌متوسط (B1)', en: 'Pre-Intermediate (B1)' },
    intermediate: { fa: 'متوسط (B2)', en: 'Intermediate (B2)' },
    advanced: { fa: 'پیشرفته (C1)', en: 'Advanced (C1)' },
  };
  const found = map[norm];
  if (found) {
    return lang === 'fa' ? `سطح ${found.fa}` : `Level: ${found.en}`;
  }
  return lang === 'fa' ? `سطح ${level}` : `Level: ${level}`;
};

// Clean format for hashtag labels ensuring English letters stay intact
const getCleanTag = (rawTag: string) => {
  return rawTag.replace(/^#+/, '').trim();
};

export const CommunityView: React.FC = () => {
  const { addXp } = useAuth();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<CommunityTab>('discussions');

  // Discussions state
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postTag, setPostTag] = useState('vocabulary');
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  // Expressions state
  const [expressions, setExpressions] = useState<CommunityExpression[]>([]);
  const [selectedExpCat, setSelectedExpCat] = useState<string>('all');
  const [isCreatingExp, setIsCreatingExp] = useState(false);
  const [expEnglish, setExpEnglish] = useState('');
  const [expPersian, setExpPersian] = useState('');
  const [expPronunciation, setExpPronunciation] = useState('');
  const [expExampleEn, setExpExampleEn] = useState('');
  const [expExampleFa, setExpExampleFa] = useState('');
  const [expUsageNoteFa, setExpUsageNoteFa] = useState('');
  const [expCategory, setExpCategory] = useState<'idiom' | 'slang' | 'phrasal_verb' | 'daily' | 'formal'>('idiom');
  const [expDifficulty, setExpDifficulty] = useState<'beginner' | 'intermediate'>('beginner');

  // Grammar tips state
  const [grammarTips, setGrammarTips] = useState<GrammarHelpTip[]>([]);
  const [selectedGrammarCat, setSelectedGrammarCat] = useState<string>('all');
  const [isCreatingTip, setIsCreatingTip] = useState(false);
  const [tipTitleFa, setTipTitleFa] = useState('');
  const [tipMistake, setTipMistake] = useState('');
  const [tipCorrect, setTipCorrect] = useState('');
  const [tipExplanationFa, setTipExplanationFa] = useState('');
  const [tipPersianContext, setTipPersianContext] = useState('');
  const [tipCategory, setTipCategory] = useState<'sentence_structure' | 'prepositions' | 'tenses' | 'common_mistakes'>('sentence_structure');

  // Feedback messages
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchExpressions();
    fetchGrammarTips();
  }, []);

  const fetchPosts = () => {
    fetch('/api/community/posts')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
      })
      .catch(() => {});
  };

  const fetchExpressions = () => {
    fetch('/api/community/expressions')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setExpressions(data);
      })
      .catch(() => {});
  };

  const fetchGrammarTips = () => {
    fetch('/api/community/grammar-tips')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setGrammarTips(data);
      })
      .catch(() => {});
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/community/posts/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likes: data.likes } : p))
        );
      }
    } catch (err) {}
  };

  const handleLikeExpression = async (id: string) => {
    try {
      const res = await fetch(`/api/community/expressions/${id}/like`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setExpressions((prev) =>
          prev.map((e) => (e.id === id ? { ...e, likes: data.likes } : e))
        );
      }
    } catch (err) {}
  };

  const handleLikeGrammarTip = async (id: string) => {
    try {
      const res = await fetch(`/api/community/grammar-tips/${id}/like`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setGrammarTips((prev) =>
          prev.map((g) => (g.id === id ? { ...g, likes: data.likes } : g))
        );
      }
    } catch (err) {}
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: [...(p.comments || []), data],
                  commentsCount: (p.commentsCount || 0) + 1,
                }
              : p
          )
        );
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
        addXp(5);
      }
    } catch (err) {}
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title.trim() || !content.trim()) {
      setErrorMsg('لطفاً عنوان و متن گفتگو را وارد کنید.');
      return;
    }

    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tags: [postTag] }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'خطا در ارسال پست');
      } else {
        setSuccessMsg('پست شما در انجمن منتشر شد! (+۱۵ XP)');
        setTitle('');
        setContent('');
        setIsCreatingPost(false);
        fetchPosts();
        addXp(15);
      }
    } catch (err: any) {
      setErrorMsg('خطا در ارسال پست');
    }
  };

  const handleCreateExpression = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!expEnglish.trim() || !expPersian.trim() || !expExampleEn.trim() || !expExampleFa.trim()) {
      setErrorMsg('لطفاً فیلدهای انگلیسی، معنی، و مثال را تکمیل فرمایید.');
      return;
    }

    try {
      const res = await fetch('/api/community/expressions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          english: expEnglish.trim(),
          persian: expPersian.trim(),
          pronunciation: expPronunciation.trim(),
          exampleEn: expExampleEn.trim(),
          exampleFa: expExampleFa.trim(),
          usageNoteFa: expUsageNoteFa.trim(),
          category: expCategory,
          difficulty: expDifficulty,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'خطا در ثبت اصطلاح');
      } else {
        setSuccessMsg('اصطلاح جدید با موفقیت ثبت شد! (+۲۰ XP)');
        setExpEnglish('');
        setExpPersian('');
        setExpPronunciation('');
        setExpExampleEn('');
        setExpExampleFa('');
        setExpUsageNoteFa('');
        setIsCreatingExp(false);
        fetchExpressions();
        addXp(20);
      }
    } catch (err) {
      setErrorMsg('خطا در ثبت اصطلاح');
    }
  };

  const handleCreateGrammarTip = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!tipTitleFa.trim() || !tipMistake.trim() || !tipCorrect.trim() || !tipExplanationFa.trim()) {
      setErrorMsg('لطفاً عنوان، فرم نادرست، فرم صحیح و توضیح را تکمیل فرمایید.');
      return;
    }

    try {
      const res = await fetch('/api/community/grammar-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleFa: tipTitleFa.trim(),
          incorrectExample: tipMistake.trim(),
          correctExample: tipCorrect.trim(),
          explanationFa: tipExplanationFa.trim(),
          persianContext: tipPersianContext.trim(),
          category: tipCategory,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'خطا در ثبت نکته گرامری');
      } else {
        setSuccessMsg('نکته گرامری با موفقیت ثبت شد! (+۲۰ XP)');
        setTipTitleFa('');
        setTipMistake('');
        setTipCorrect('');
        setTipExplanationFa('');
        setTipPersianContext('');
        setIsCreatingTip(false);
        fetchGrammarTips();
        addXp(20);
      }
    } catch (err) {
      setErrorMsg('خطا در ثبت نکته گرامری');
    }
  };

  const handleReport = async (postId: string) => {
    if (window.confirm('آیا از گزارش این محتوا به مدیر آموزشی اطمینان دارید؟')) {
      await fetch(`/api/community/posts/${postId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'نامناسب یا نیاز به بازبینی' }),
      });
      alert('گزارش شما ثبت شد و به زودی توسط ناظر آموزشی بررسی خواهد شد.');
    }
  };

  // Tag filter lists
  const postTags = [
    { id: 'all', labelFa: 'همه گفتگوها', labelEn: 'All Discussions' },
    { id: 'vocabulary', labelFa: 'لغات و اصطلاحات', labelEn: 'Vocabulary' },
    { id: 'grammar', labelFa: 'رفع اشکال گرامر', labelEn: 'Grammar' },
    { id: 'speaking', labelFa: 'مکالمه و تجربیات', labelEn: 'Speaking' },
    { id: 'movies', labelFa: 'فیلم و پادکست', labelEn: 'Movies & Media' },
  ];

  const expCategories = [
    { id: 'all', labelFa: 'همه اصطلاحات', labelEn: 'All Idioms' },
    { id: 'idiom', labelFa: 'ضرب‌المثل‌ها (Idioms)', labelEn: 'Idioms' },
    { id: 'phrasal_verb', labelFa: 'افعال عبارتی (Phrasal Verbs)', labelEn: 'Phrasal Verbs' },
    { id: 'slang', labelFa: 'اصطلاحات عامیانه (Slang)', labelEn: 'Slang' },
    { id: 'daily', labelFa: 'مکالمات روزمره (Daily)', labelEn: 'Daily English' },
  ];

  const grammarCategories = [
    { id: 'all', labelFa: 'همه دسته‌ها', labelEn: 'All Categories' },
    { id: 'sentence_structure', labelFa: 'ساختار جمله (Structure)', labelEn: 'Structure' },
    { id: 'prepositions', labelFa: 'حروف اضافه (Prepositions)', labelEn: 'Prepositions' },
    { id: 'tenses', labelFa: 'زمان‌ها (Tenses)', labelEn: 'Tenses' },
    { id: 'common_mistakes', labelFa: 'اشتباهات متداول (Mistakes)', labelEn: 'Mistakes' },
  ];

  // Filtering
  const filteredPosts = posts.filter((p) => {
    const matchTag =
      selectedTag === 'all' ||
      (p.tags &&
        p.tags.some(
          (t) =>
            t.toLowerCase() === selectedTag.toLowerCase() ||
            t.toLowerCase().includes(selectedTag.toLowerCase()) ||
            selectedTag.toLowerCase().includes(t.toLowerCase())
        ));
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTag && matchSearch;
  });

  const filteredExpressions = expressions.filter((e) => {
    const matchCat = selectedExpCat === 'all' || e.category === selectedExpCat;
    const matchSearch =
      !searchQuery ||
      e.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.persian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.exampleEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredGrammarTips = grammarTips.filter((g) => {
    const matchCat = selectedGrammarCat === 'all' || g.category === selectedGrammarCat;
    const matchSearch =
      !searchQuery ||
      g.titleFa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.incorrectExample.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.correctExample.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.explanationFa.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-5 sm:space-y-6 pb-12 w-full max-w-full overflow-x-hidden animate-fade-in" id="community-view">
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
        <div className="min-w-0 flex-1">
          <div className="flex items-center flex-wrap gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white break-words">
              {language === 'fa' ? 'انجمن و اتاق یادگیری مهنا 💬' : 'Mohanna Learning Community 💬'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1 flex-shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              {language === 'fa' ? 'محیط امن و آموزشی' : 'Safe Learning Space'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 break-words">
            {language === 'fa'
              ? 'جامعه زبان‌آموزان: پرسش و پاسخ، بانک اصطلاحات عامیانه و رفع اشتباهات رایج فارسی‌زبانان'
              : 'Interactive space for learner discussions, daily expressions, and Persian-English grammar mastery.'}
          </p>
        </div>

        {/* Action Button for Active Tab */}
        {activeTab === 'discussions' && (
          <button
            onClick={() => {
              setIsCreatingPost(!isCreatingPost);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="px-3.5 sm:px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 self-stretch sm:self-auto transition-transform active:scale-95 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreatingPost ? (language === 'fa' ? 'بستن فرم' : 'Close Form') : (language === 'fa' ? 'ایجاد گفتگوی جدید (+۱۵ XP)' : 'New Discussion (+15 XP)')}</span>
          </button>
        )}

        {activeTab === 'expressions' && (
          <button
            onClick={() => {
              setIsCreatingExp(!isCreatingExp);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="px-3.5 sm:px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 self-stretch sm:self-auto transition-transform active:scale-95 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreatingExp ? (language === 'fa' ? 'بستن فرم' : 'Close Form') : (language === 'fa' ? 'ثبت اصطلاح جدید (+۲۰ XP)' : 'New Expression (+20 XP)')}</span>
          </button>
        )}

        {activeTab === 'grammar' && (
          <button
            onClick={() => {
              setIsCreatingTip(!isCreatingTip);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="px-3.5 sm:px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 self-stretch sm:self-auto transition-transform active:scale-95 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreatingTip ? (language === 'fa' ? 'بستن فرم' : 'Close Form') : (language === 'fa' ? 'ثبت نکته / رفع اشکال (+۲۰ XP)' : 'New Grammar Tip (+20 XP)')}</span>
          </button>
        )}
      </div>

      {/* 2. Three Main Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2 p-1 sm:p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-full max-w-full">
        <button
          onClick={() => {
            setActiveTab('discussions');
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl text-[11px] sm:text-sm font-black transition-all flex items-center justify-center gap-1 sm:gap-2 min-w-0 ${
            activeTab === 'discussions'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="truncate">{language === 'fa' ? 'گفتگوها' : 'Discussions'}</span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 dark:bg-sky-950 text-sky-600">
            {posts.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('expressions');
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl text-[11px] sm:text-sm font-black transition-all flex items-center justify-center gap-1 sm:gap-2 min-w-0 ${
            activeTab === 'expressions'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="truncate">{language === 'fa' ? 'اصطلاحات' : 'Expressions'}</span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-600">
            {expressions.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('grammar');
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl text-[11px] sm:text-sm font-black transition-all flex items-center justify-center gap-1 sm:gap-2 min-w-0 ${
            activeTab === 'grammar'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="truncate">{language === 'fa' ? 'رفع اشکال' : 'Grammar Tips'}</span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
            {grammarTips.length}
          </span>
        </button>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-300 text-xs flex items-center gap-2 border border-rose-200 dark:border-rose-900 animate-fade-in break-words">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="break-words flex-1">{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs flex items-center gap-2 border border-emerald-200 dark:border-emerald-900 animate-fade-in break-words">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span className="break-words flex-1">{successMsg}</span>
        </div>
      )}

      {/* Search and Category Filter */}
      <div className="space-y-3 w-full max-w-full">
        <div className="relative w-full">
          <Search
            className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${
              language === 'fa' ? 'right-3.5' : 'left-3.5'
            }`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'discussions'
                ? (language === 'fa' ? 'جستجو در موضوعات و متن گفتگوها...' : 'Search discussions...')
                : activeTab === 'expressions'
                ? (language === 'fa' ? 'جستجوی اصطلاح انگلیسی یا معنی فارسی...' : 'Search idioms or meanings...')
                : (language === 'fa' ? 'جستجوی نکته گرامری یا ساختار اشتباه...' : 'Search grammar tips...')
            }
            className={`w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm ${
              language === 'fa' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
            }`}
          />
        </div>

        {/* Category Pills (2 columns, stacked vertically) */}
        <div className="grid grid-cols-2 gap-2 w-full">
          {activeTab === 'discussions' &&
            postTags.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setSelectedTag(t.id)}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                  idx === postTags.length - 1 && postTags.length % 2 !== 0 ? 'col-span-2' : 'col-span-1'
                } ${
                  selectedTag === t.id
                    ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{language === 'fa' ? t.labelFa : t.labelEn}</span>
              </button>
            ))}

          {activeTab === 'expressions' &&
            expCategories.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setSelectedExpCat(c.id)}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                  idx === expCategories.length - 1 && expCategories.length % 2 !== 0 ? 'col-span-2' : 'col-span-1'
                } ${
                  selectedExpCat === c.id
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{language === 'fa' ? c.labelFa : c.labelEn}</span>
              </button>
            ))}

          {activeTab === 'grammar' &&
            grammarCategories.map((g, idx) => (
              <button
                key={g.id}
                onClick={() => setSelectedGrammarCat(g.id)}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                  idx === grammarCategories.length - 1 && grammarCategories.length % 2 !== 0 ? 'col-span-2' : 'col-span-1'
                } ${
                  selectedGrammarCat === g.id
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{language === 'fa' ? g.labelFa : g.labelEn}</span>
              </button>
            ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DISCUSSIONS & FORUM                                                */}
      {/* ========================================================================= */}
      {activeTab === 'discussions' && (
        <div className="space-y-4 w-full max-w-full">
          {isCreatingPost && (
            <form
              onSubmit={handleCreatePost}
              className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-xl space-y-4 animate-fade-in w-full max-w-full overflow-hidden"
            >
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>{language === 'fa' ? 'ایجاد گفتگوی جدید در انجمن مهنا' : 'Start a New Discussion'}</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {language === 'fa' ? 'عنوان گفتگو:' : 'Discussion Title:'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={language === 'fa' ? 'مثال: روش شما برای یادگیری افعال نامنظم چیست؟' : 'e.g. Best technique to memorize irregular verbs?'}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  dir="auto"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {language === 'fa' ? 'دسته‌بندی:' : 'Category:'}
                </label>
                <select
                  value={postTag}
                  onChange={(e) => setPostTag(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
                >
                  <option value="vocabulary">{language === 'fa' ? 'لغات و اصطلاحات (Vocabulary)' : 'Vocabulary & Expressions'}</option>
                  <option value="grammar">{language === 'fa' ? 'قواعد و گرامر (Grammar)' : 'Grammar & Rules'}</option>
                  <option value="speaking">{language === 'fa' ? 'مکالمه و تلفظ (Speaking)' : 'Speaking & Pronunciation'}</option>
                  <option value="movies">{language === 'fa' ? 'فیلم و پادکست (Movies)' : 'Movies & Podcasts'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {language === 'fa' ? 'متن پیام یا سوال شما:' : 'Your Question or Thoughts:'}
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={language === 'fa' ? 'توضیحات خود را بنویسید...' : 'Type your detailed question or discussion topic...'}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  dir="auto"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingPost(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {language === 'fa' ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20"
                >
                  {language === 'fa' ? 'انتشار پست (+۱۵ XP)' : 'Publish (+15 XP)'}
                </button>
              </div>
            </form>
          )}

          {filteredPosts.length === 0 ? (
            <div className="p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-full space-y-3 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 mx-auto flex items-center justify-center">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {language === 'fa' ? 'هنوز گفتگویی ایجاد نشده است' : 'No discussions yet'}
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {language === 'fa'
                    ? 'اولین نفری باشید که یک گفتگوی جدید باز می‌کند یا سوال انگلیسی خود را مطرح می‌کند.'
                    : 'Be the first learner to open a new discussion topic or ask a question!'}
                </p>
              </div>
              {!isCreatingPost && (
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingPost(true);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all active:scale-95 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'fa' ? 'ایجاد گفتگوی جدید (+۱۵ XP)' : 'Start First Discussion (+15 XP)'}</span>
                </button>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isCommentsOpen = expandedComments[post.id];
              return (
                <div
                  key={post.id}
                  className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 sm:space-y-4 w-full max-w-full overflow-hidden break-words"
                >
                  {/* Author Header */}
                  <div className="flex items-center justify-between gap-2.5 min-w-0 w-full">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm flex-shrink-0">
                        {post.authorName ? post.authorName[0] : 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {post.authorName}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold font-mono">
                            {getLevelBadgeText(post.authorLevel, language)}
                          </span>
                          <span>•</span>
                          <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US') : ''}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleReport(post.id)}
                      className="p-1.5 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex-shrink-0"
                      title={language === 'fa' ? 'گزارش محتوا' : 'Report'}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {/* Dedicated Tags Row: Explicit LTR boxes with hashtag on the left */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5 w-full" dir="ltr">
                      {post.tags.map((t) => {
                        const clean = getCleanTag(t);
                        return (
                          <span
                            key={t}
                            dir="ltr"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-100/90 dark:border-sky-900/60 font-en tracking-tight whitespace-nowrap shadow-2xs transition-transform hover:scale-105"
                          >
                            <span className="text-sky-400 dark:text-sky-400 font-mono font-black select-none">#</span>
                            <span className="font-en">{clean}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Body */}
                  <div className="min-w-0 w-full" dir="auto">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5 break-words-safe leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words-safe">
                      {post.content}
                    </p>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:scale-105 transition-transform"
                    >
                      <Heart className="w-4 h-4 fill-rose-500/20" />
                      <span>{post.likes || 0}</span>
                    </button>

                    <button
                      onClick={() =>
                        setExpandedComments((prev) => ({
                          ...prev,
                          [post.id]: !prev[post.id],
                        }))
                      }
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments ? post.comments.length : 0} {language === 'fa' ? 'نظر' : 'comments'}</span>
                    </button>
                  </div>

                  {/* Comments Box */}
                  {isCommentsOpen && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fade-in w-full max-w-full overflow-hidden">
                      <div className="space-y-2 max-h-60 overflow-y-auto w-full">
                        {post.comments && post.comments.length > 0 ? (
                          post.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1 w-full max-w-full overflow-hidden break-words"
                            >
                              <div className="flex items-center justify-between font-bold text-[11px] text-slate-700 dark:text-slate-300 gap-2">
                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                  <span className="truncate">{comment.authorName}</span>
                                  {comment.authorLevel && (
                                    <span className="px-1.5 py-0.2 text-[9px] rounded bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono font-medium flex-shrink-0">
                                      {getLevelBadgeText(comment.authorLevel, language)}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono font-normal flex-shrink-0">
                                  {new Date(comment.createdAt).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}
                                </span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 break-words-safe leading-relaxed" dir="auto">
                                {comment.content}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 py-2 text-center">{language === 'fa' ? 'هنوز نظری ثبت نشده است.' : 'No comments yet. Be the first to answer!'}</p>
                        )}
                      </div>

                      {/* Comment Input */}
                      <div className="flex items-center gap-2 w-full min-w-0">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          placeholder={language === 'fa' ? 'پاسخ یا نظر خود را بنویسید...' : 'Write your reply or explanation...'}
                          className="flex-1 min-w-0 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                          dir="auto"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-3.5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-sm hover:bg-sky-700 flex-shrink-0"
                          title={language === 'fa' ? 'ارسال نظر' : 'Send Comment'}
                        >
                          <Send className={`w-3.5 h-3.5 ${language === 'fa' ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EXPRESSIONS & IDIOMS HUB                                           */}
      {/* ========================================================================= */}
      {activeTab === 'expressions' && (
        <div className="space-y-4 w-full max-w-full">
          {isCreatingExp && (
            <form
              onSubmit={handleCreateExpression}
              className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 shadow-xl space-y-4 animate-fade-in w-full max-w-full overflow-hidden"
            >
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{language === 'fa' ? 'ثبت اصطلاح جدید در بانک واژگان مهنا' : 'Add New Expression / Idiom'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {language === 'fa' ? 'عبارت یا اصطلاح انگلیسی:' : 'English Expression / Idiom:'}
                  </label>
                  <input
                    type="text"
                    value={expEnglish}
                    onChange={(e) => setExpEnglish(e.target.value)}
                    placeholder="e.g. Hit the nail on the head"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-en text-left"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {language === 'fa' ? 'ترجمه و معنی فارسی:' : 'Persian Translation / Meaning:'}
                  </label>
                  <input
                    type="text"
                    value={expPersian}
                    onChange={(e) => setExpPersian(e.target.value)}
                    placeholder={language === 'fa' ? 'مثال: درست به هدف زدن، دقیقاً حرف حساب رو زدن' : 'e.g. دقیقاً به هدف زدن'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-fa text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {language === 'fa' ? 'تلفظ فونتیک (اختیاری):' : 'Phonetic Pronunciation (Optional):'}
                  </label>
                  <input
                    type="text"
                    value={expPronunciation}
                    onChange={(e) => setExpPronunciation(e.target.value)}
                    placeholder="e.g. hɪt ðə neɪl..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 font-en text-left"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {language === 'fa' ? 'دسته‌بندی:' : 'Category:'}
                  </label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
                  >
                    <option value="idiom">{language === 'fa' ? 'ضرب‌المثل (Idiom)' : 'Idiom'}</option>
                    <option value="phrasal_verb">{language === 'fa' ? 'فعل عبارتی (Phrasal Verb)' : 'Phrasal Verb'}</option>
                    <option value="slang">{language === 'fa' ? 'عامیانه (Slang)' : 'Slang'}</option>
                    <option value="daily">{language === 'fa' ? 'روزمره (Daily)' : 'Daily English'}</option>
                    <option value="formal">{language === 'fa' ? 'رسمی (Formal)' : 'Formal English'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {language === 'fa' ? 'سطح دشواری:' : 'Difficulty:'}
                  </label>
                  <select
                    value={expDifficulty}
                    onChange={(e) => setExpDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
                  >
                    <option value="beginner">{language === 'fa' ? 'مبتدی (Beginner)' : 'Beginner'}</option>
                    <option value="intermediate">{language === 'fa' ? 'متوسط (Intermediate)' : 'Intermediate'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {language === 'fa' ? 'جمله مثال انگلیسی:' : 'English Example Sentence:'}
                </label>
                <input
                  type="text"
                  value={expExampleEn}
                  onChange={(e) => setExpExampleEn(e.target.value)}
                  placeholder="e.g. You hit the nail on the head with that explanation."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 font-en text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {language === 'fa' ? 'ترجمه مثال به فارسی:' : 'Persian Example Translation:'}
                </label>
                <input
                  type="text"
                  value={expExampleFa}
                  onChange={(e) => setExpExampleFa(e.target.value)}
                  placeholder={language === 'fa' ? 'مثال: با اون توضیحت دقیقاً به هدف زدی.' : 'e.g. با توضیحت دقیقاً حرف حساب رو زدی.'}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 font-fa text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {language === 'fa' ? 'نکته کاربردی یا ریشه‌شناسی (اختیاری):' : 'Usage Note (Optional):'}
                </label>
                <input
                  type="text"
                  value={expUsageNoteFa}
                  onChange={(e) => setExpUsageNoteFa(e.target.value)}
                  placeholder={language === 'fa' ? 'مثال: در مکالمات محاوره‌ای برای تایید نظر دیگران کاربرد زیادی دارد.' : 'e.g. Useful when agreeing with someone.'}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 font-fa text-right"
                  dir="rtl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingExp(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {language === 'fa' ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20"
                >
                  {language === 'fa' ? 'ثبت اصطلاح (+۲۰ XP)' : 'Save Expression (+20 XP)'}
                </button>
              </div>
            </form>
          )}

          {filteredExpressions.length === 0 ? (
            <div className="p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-full">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-amber-300 dark:text-amber-600 mb-3" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {language === 'fa' ? 'هیچ اصطلاحی یافت نشد' : 'No expressions found'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'fa' ? 'اولین نفری باشید که یک اصطلاح جالب اضافه می‌کند!' : 'Be the first to add a new idiom or phrase!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 w-full max-w-full">
              {filteredExpressions.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3.5 sm:space-y-4 w-full max-w-full overflow-hidden break-words min-w-0"
                >
                  <div className="min-w-0 w-full space-y-3">
                    {/* Header: English phrase & speaker on one side, category badge on the other */}
                    <div className="flex items-start justify-between gap-2.5 min-w-0 w-full">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap min-w-0" dir="ltr">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-en tracking-tight break-words-safe leading-snug text-left">
                            {exp.english}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleSpeak(exp.english)}
                            className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                            title={language === 'fa' ? 'پخش تلفظ صوتی' : 'Listen pronunciation'}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        {exp.pronunciation && (
                          <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 text-left" dir="ltr">
                            /{exp.pronunciation}/
                          </p>
                        )}
                      </div>

                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex-shrink-0 whitespace-nowrap">
                        {exp.category === 'idiom'
                          ? (language === 'fa' ? 'ضرب‌المثل' : 'Idiom')
                          : exp.category === 'phrasal_verb'
                          ? (language === 'fa' ? 'فعل عبارتی' : 'Phrasal Verb')
                          : exp.category === 'slang'
                          ? (language === 'fa' ? 'عامیانه' : 'Slang')
                          : (language === 'fa' ? 'روزمره' : 'Daily')}
                      </span>
                    </div>

                    {/* Persian Meaning Box */}
                    <div
                      className="p-2.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                      dir="rtl"
                    >
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 break-words-safe leading-relaxed text-right font-fa">
                        {exp.persian}
                      </p>
                    </div>

                    {/* Example Box: Crystal clear separation with EN & FA badges */}
                    <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-100/80 dark:border-slate-800 text-xs space-y-2 w-full max-w-full overflow-hidden min-w-0">
                      <div className="flex items-start gap-2 min-w-0 w-full" dir="ltr">
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-mono font-bold text-[10px] flex-shrink-0 mt-0.5">
                          EN
                        </span>
                        <p className="font-en text-slate-900 dark:text-slate-100 font-medium text-xs sm:text-sm break-words-safe text-left flex-1 leading-snug">
                          "{exp.exampleEn}"
                        </p>
                      </div>
                      <div className="flex items-start gap-2 min-w-0 w-full pt-2 border-t border-amber-100 dark:border-slate-700/60" dir="rtl">
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-fa font-bold text-[10px] flex-shrink-0 mt-0.5">
                          FA
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 text-xs break-words-safe leading-relaxed flex-1 text-right font-fa">
                          {exp.exampleFa}
                        </p>
                      </div>
                    </div>

                    {exp.usageNoteFa && (
                      <div
                        className="flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 min-w-0 w-full overflow-hidden"
                        dir="rtl"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="break-words-safe leading-relaxed flex-1 text-right font-fa">{exp.usageNoteFa}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 min-w-0 w-full">
                    <span className="truncate flex-1">
                      {language === 'fa' ? `ثبت شده توسط: ${exp.submittedBy || 'مهنا'}` : `Shared by: ${exp.submittedBy || 'Mohanna'}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleLikeExpression(exp.id)}
                      className="flex items-center gap-1.5 font-bold text-rose-500 hover:scale-105 transition-transform flex-shrink-0"
                    >
                      <Heart className="w-4 h-4 fill-rose-500/20" />
                      <span>{exp.likes || 0}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GRAMMAR HELP & COMMON PERSIAN MISTAKES                              */}
      {/* ========================================================================= */}
      {activeTab === 'grammar' && (
        <div className="space-y-4 w-full max-w-full">
          {isCreatingTip && (
            <form
              onSubmit={handleCreateGrammarTip}
              className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 shadow-xl space-y-4 animate-fade-in w-full max-w-full overflow-hidden"
            >
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{language === 'fa' ? 'ثبت نکته گرامری یا اشتباه رایج' : 'Submit Grammar Tip / Common Mistake'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {language === 'fa' ? 'عنوان مبحث گرامری:' : 'Grammar Topic / Title:'}
                  </label>
                  <input
                    type="text"
                    value={tipTitleFa}
                    onChange={(e) => setTipTitleFa(e.target.value)}
                    placeholder={language === 'fa' ? 'مثال: تفاوت Listen و Hear' : 'e.g. Difference between Listen and Hear'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-fa text-right"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {language === 'fa' ? 'دسته‌بندی مبحث:' : 'Category:'}
                  </label>
                  <select
                    value={tipCategory}
                    onChange={(e) => setTipCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
                  >
                    <option value="sentence_structure">{language === 'fa' ? 'ساختار جمله (Structure)' : 'Sentence Structure'}</option>
                    <option value="prepositions">{language === 'fa' ? 'حروف اضافه (Prepositions)' : 'Prepositions'}</option>
                    <option value="tenses">{language === 'fa' ? 'زمان‌ها (Tenses)' : 'Tenses'}</option>
                    <option value="common_mistakes">{language === 'fa' ? 'اشتباهات متداول (Mistakes)' : 'Common Mistakes'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 overflow-hidden">
                  <label className="block text-xs font-bold text-rose-700 dark:text-rose-300 mb-1 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{language === 'fa' ? 'فرم نادرست (اشتباه متداول):' : 'Incorrect Form (Common Error):'}</span>
                  </label>
                  <input
                    type="text"
                    value={tipMistake}
                    onChange={(e) => setTipMistake(e.target.value)}
                    placeholder="e.g. I am listening music."
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 font-en text-left"
                    dir="ltr"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 overflow-hidden">
                  <label className="block text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{language === 'fa' ? 'فرم صحیح و استاندارد:' : 'Correct & Standard Form:'}</span>
                  </label>
                  <input
                    type="text"
                    value={tipCorrect}
                    onChange={(e) => setTipCorrect(e.target.value)}
                    placeholder="e.g. I am listening to music."
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 font-en text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {language === 'fa' ? 'توضیح آموزشی قاعده و دلیل خطا:' : 'Explanation & Grammar Rule:'}
                </label>
                <textarea
                  rows={3}
                  value={tipExplanationFa}
                  onChange={(e) => setTipExplanationFa(e.target.value)}
                  placeholder={language === 'fa' ? 'توضیح دهید چرا این ساختار نادرست است و قاعده دقیق چیست...' : 'Explain the grammar rule clearly...'}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 leading-relaxed font-fa text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {language === 'fa' ? 'ریشه تداخل با زبان فارسی (اختیاری):' : 'Persian Language Context (Optional):'}
                </label>
                <input
                  type="text"
                  value={tipPersianContext}
                  onChange={(e) => setTipPersianContext(e.target.value)}
                  placeholder={language === 'fa' ? 'مثال: در فارسی بعد از گوش دادن حرف اضافه نمی‌آوریم...' : 'e.g. Persian speakers often omit the preposition...'}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 font-fa text-right"
                  dir="rtl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingTip(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {language === 'fa' ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                >
                  {language === 'fa' ? 'ثبت نکته آموزشی (+۲۰ XP)' : 'Save Grammar Tip (+20 XP)'}
                </button>
              </div>
            </form>
          )}

          {filteredGrammarTips.length === 0 ? (
            <div className="p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-full">
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-emerald-300 dark:text-emerald-600 mb-3" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {language === 'fa' ? 'نکته‌ای یافت نشد' : 'No grammar tips found'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'fa' ? 'اولین نفری باشید که یک نکته رفع اشکال اضافه می‌کند!' : 'Be the first to share a helpful grammar tip!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 w-full max-w-full">
              {filteredGrammarTips.map((tip) => (
                <div
                  key={tip.id}
                  className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3.5 sm:space-y-4 w-full max-w-full overflow-hidden break-words min-w-0"
                >
                  <div className="min-w-0 w-full space-y-3">
                    {/* Header: Title + Category */}
                    <div className="flex items-start justify-between gap-2.5 min-w-0 w-full">
                      <h3
                        className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white break-words-safe flex-1 leading-snug text-right font-fa"
                        dir="rtl"
                      >
                        {tip.titleFa}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex-shrink-0 whitespace-nowrap">
                        {tip.category === 'sentence_structure'
                          ? (language === 'fa' ? 'ساختار جمله' : 'Structure')
                          : tip.category === 'prepositions'
                          ? (language === 'fa' ? 'حروف اضافه' : 'Prepositions')
                          : tip.category === 'tenses'
                          ? (language === 'fa' ? 'زمان‌ها' : 'Tenses')
                          : (language === 'fa' ? 'اشتباهات' : 'Mistakes')}
                      </span>
                    </div>

                    {/* Side-by-Side Mistake vs Correct: Explicit LTR boxes with tight, aligned elements */}
                    <div className="space-y-2.5 w-full min-w-0">
                      {/* Mistake Box */}
                      <div
                        className="p-3 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-between gap-2.5 min-w-0 w-full"
                        dir="ltr"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="w-6 h-6 rounded-lg bg-rose-200/80 dark:bg-rose-900/80 text-rose-700 dark:text-rose-300 flex items-center justify-center flex-shrink-0 text-xs font-black">
                            ✕
                          </span>
                          <span className="font-en text-xs sm:text-sm font-semibold text-rose-800 dark:text-rose-200 line-through decoration-rose-500/70 break-words-safe min-w-0 text-left">
                            {tip.incorrectExample}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100/90 dark:bg-rose-950 px-2 py-0.5 rounded-md flex-shrink-0 whitespace-nowrap">
                          {language === 'fa' ? 'نادرست' : 'Incorrect'}
                        </span>
                      </div>

                      {/* Correct Box */}
                      <div
                        className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 flex items-center justify-between gap-2.5 min-w-0 w-full"
                        dir="ltr"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="w-6 h-6 rounded-lg bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 text-xs font-black">
                            ✓
                          </span>
                          <span className="font-en text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200 break-words-safe min-w-0 text-left">
                            {tip.correctExample}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/90 dark:bg-emerald-950 px-2 py-0.5 rounded-md whitespace-nowrap">
                            {language === 'fa' ? 'صحیح' : 'Correct'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSpeak(tip.correctExample)}
                            className="p-1 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/60 transition-colors"
                            title={language === 'fa' ? 'پخش تلفظ صوتی' : 'Play pronunciation'}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Explanation */}
                    <p
                      className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words-safe text-right font-fa"
                      dir="rtl"
                    >
                      {tip.explanationFa}
                    </p>

                    {tip.persianContext && (
                      <div
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5 min-w-0 w-full overflow-hidden"
                        dir="rtl"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="break-words-safe flex-1 leading-relaxed text-right font-fa">{tip.persianContext}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 min-w-0 w-full">
                    <span className="truncate flex-1">
                      {language === 'fa' ? `سطح پیشنهادی: ${getLevelBadgeText(tip.difficulty, 'fa')}` : `Recommended: ${getLevelBadgeText(tip.difficulty, 'en')}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleLikeGrammarTip(tip.id)}
                      className="flex items-center gap-1.5 font-bold text-rose-500 hover:scale-105 transition-transform flex-shrink-0"
                    >
                      <Heart className="w-4 h-4 fill-rose-500/20" />
                      <span>{tip.likes || 0}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
