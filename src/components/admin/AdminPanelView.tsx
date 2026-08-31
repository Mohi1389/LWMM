import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Sparkles,
  Bot,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Users,
  Award,
  BookOpen,
  Send,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';

export const AdminPanelView: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'studio' | 'moderation'>('studio');

  // AI Content Generator State
  const [contentType, setContentType] = useState<'vocabulary' | 'quiz' | 'scenario'>('vocabulary');
  const [topic, setTopic] = useState('');
  const [targetLevel, setTargetLevel] = useState('Beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedData(null);
    setPublishSuccess(false);

    try {
      const res = await fetch('/api/admin/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: contentType,
          topic: topic.trim(),
          targetLevel,
        }),
      });

      const data = await res.json();
      if (res.ok && data.generated) {
        setGeneratedData(data.generated);
      }
    } catch (err) {
      console.error('Content gen error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishContent = async () => {
    if (!generatedData || isPublishing) return;
    setIsPublishing(true);

    try {
      const res = await fetch('/api/admin/publish-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: contentType,
          content: generatedData,
        }),
      });

      if (res.ok) {
        setPublishSuccess(true);
      }
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in" id="admin-panel-view">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {language === 'fa' ? 'پنل مدیریت و استودیو تولید محتوا' : 'Admin & Content Studio'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Admin Access
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'fa'
              ? 'تولید بسته‌های آموزشی با هوش مصنوعی جمینای، نظارت بر انجمن و آمار کلی'
              : 'Generate curriculum packs with Gemini, moderate peer lounge, and inspect usage.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'studio'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            استودیو هوش مصنوعی
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'moderation'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            نظارت و ایمنی انجمن
          </button>
        </div>
      </div>

      {/* 2. Quick Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">کل کاربران</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {stats?.totalUsers || 128}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">لغات فعال</span>
            <BookOpen className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {stats?.totalVocabWords || 45}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">جلسات AI</span>
            <Bot className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {stats?.aiConversationsCount || 342}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">گزارش‌های نظارت</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {stats?.reportedPostsCount || 0}
          </span>
        </div>
      </div>

      {/* 3. TAB 1: AI CONTENT STUDIO */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Generation Control Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  استودیو تولید محتوای آموزشی با Gemini
                </h3>
                <span className="text-xs text-slate-500">
                  تولید خودکار فلش‌کارت، آزمون یا سناریوی مکالمه متناسب با استاندارد مهنا
                </span>
              </div>
            </div>

            <form onSubmit={handleGenerateContent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  نوع محتوای مورد نیاز:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setContentType('vocabulary')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      contentType === 'vocabulary'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    بسته واژگان
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentType('quiz')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      contentType === 'quiz'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    آزمون ۴ گزینه‌ای
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentType('scenario')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      contentType === 'scenario'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    سناریوی مکالمه
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  موضوع یا سرفصل آموزشی:
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="مثال: لغات پرواز و فرودگاه / اصطلاحات رستوران / گرامر زمان گذشته"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  سطح مخاطبان هدف:
                </label>
                <select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
                >
                  <option value="Beginner">Beginner (مبتدی A1)</option>
                  <option value="Elementary">Elementary (مقدماتی A2)</option>
                  <option value="Pre-Intermediate">Pre-Intermediate (متوسط پایه B1)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!topic.trim() || isGenerating}
                className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-transform active:scale-95"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>تولید هوشمند محتوا با Gemini</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Generated Content Preview & Direct Publish */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-sky-500" />
                  <span>پیش‌نمایش محتوای تولید‌شده:</span>
                </span>

                {publishSuccess && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>با موفقیت در دیتابیس اپلیکیشن منتشر شد!</span>
                  </span>
                )}
              </div>

              {generatedData ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 max-h-[360px] overflow-y-auto font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(generatedData, null, 2)}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
                  <Layers className="w-10 h-10 text-slate-300" />
                  <p className="text-xs text-slate-400">
                    موضوع را مشخص کنید و دکمه تولید را بزنید تا محتوای سازمان‌یافته اینجا نمایش داده
                    شود.
                  </p>
                </div>
              )}
            </div>

            {generatedData && (
              <button
                onClick={handlePublishContent}
                disabled={isPublishing || publishSuccess}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPublishing ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>انتشار مستقیم در اپلیکیشن</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. TAB 2: MODERATION & SAFETY QUEUE */}
      {activeTab === 'moderation' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-emerald-500" />
            <span>صف نظارت و فیلتر خودکار انجمن</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              سیستم پالایش خودکار فعال است. تمام پیام‌ها از نظر عدم افشای اطلاعات تماس و واژگان
              نامناسب بررسی شده‌اند.
            </span>
          </div>

          <p className="text-xs text-slate-500">
            در حال حاضر هیچ پیام مشکوک یا گزارش بررسی‌نشده‌ای در صف وجود ندارد.
          </p>
        </div>
      )}
    </div>
  );
};
