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
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { CommunityPost } from '../../types/index.js';

export const CommunityView: React.FC = () => {
  const { user, addXp } = useAuth();
  const { language } = useLanguage();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // New post form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('vocabulary');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Comment state
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch('/api/community/posts')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
      })
      .catch(() => {});
  };

  const handleLike = async (postId: string) => {
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
      if (res.ok && data.comment) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, comments: [...p.comments, data.comment] } : p
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
      setErrorMsg('لطفاً عنوان و متن پست را وارد کنید.');
      return;
    }

    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tag }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'خطا در ارسال پست');
      } else {
        setSuccessMsg('پست شما با موفقیت در انجمن مهنا منتشر شد! (+۱۵ XP)');
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

  const handleReportPost = async (postId: string) => {
    if (window.confirm('آیا از گزارش این پیام به تیم نظارت محتوای مهنا اطمینان دارید؟')) {
      await fetch(`/api/community/posts/${postId}/report`, { method: 'POST' });
      alert('گزارش شما برای ادمین ارسال شد و در صف بررسی قرار گرفت.');
    }
  };

  const tags = [
    { id: 'all', labelFa: 'همه گفتگوها' },
    { id: 'vocabulary', labelFa: 'لغات و اصطلاحات' },
    { id: 'grammar', labelFa: 'رفع اشکال گرامر' },
    { id: 'speaking', labelFa: 'تجربیات مکالمه' },
    { id: 'movies', labelFa: 'فیلم و موسیقی' },
  ];

  const filteredPosts = posts.filter(
    (p) => selectedTag === 'all' || p.tag === selectedTag
  );

  return (
    <div className="space-y-6 pb-12 animate-fade-in" id="community-view">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {language === 'fa' ? 'انجمن زبان‌آموزان مهنا 💬' : 'Mohanna Learners Lounge'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              محیط امن نوجوانان
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'fa'
              ? 'محیطی امن و دوستانه برای پرسش و پاسخ، اشتراک نکات درسی و تمرین انگلیسی'
              : 'Safe and supportive peer discussion space for Persian learners.'}
          </p>
        </div>

        <button
          onClick={() => setIsCreatingPost(!isCreatingPost)}
          className="px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center gap-2 self-start sm:self-auto transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreatingPost ? 'بستن فرم' : 'ارسال پست جدید'}</span>
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-slate-900/80 border border-sky-100 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
        <ShieldCheck className="w-5 h-5 text-sky-600 flex-shrink-0" />
        <p className="leading-relaxed">
          {language === 'fa'
            ? 'فضای مهنا دارای فیلتر هوشمند ایمنی است. ارسال شماره تماس، اکانت شبکه‌های اجتماعی و محتوای نامناسب برای حفظ حریم خصوصی نوجوانان ممنوع است.'
            : 'For student safety, sharing private phone numbers or external social IDs is strictly filtered.'}
        </p>
      </div>

      {/* Create Post Card */}
      {isCreatingPost && (
        <form
          onSubmit={handleCreatePost}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 animate-fade-in"
        >
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            ایجاد گفتگوی جدید در انجمن
          </h3>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              عنوان گفتگو:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: سوال درباره تفاوت In و At در موقعیت‌های مکانی"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                دسته‌بندی موضوع:
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
              >
                <option value="vocabulary">لغات و اصطلاحات (Vocabulary)</option>
                <option value="grammar">قواعد و گرامر (Grammar)</option>
                <option value="speaking">مکالمه و تجربیات (Speaking)</option>
                <option value="movies">فیلم و موسیقی (Movies)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              متن کامل پیام یا سوال شما:
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="توضیحات و مثال‌های خود را اینجا بنویسید..."
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingPost(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20"
            >
              انتشار پست (+۱۵ XP)
            </button>
          </div>
        </form>
      )}

      {/* Tags Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tags.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTag(t.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedTag === t.id
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {t.labelFa}
          </button>
        ))}
      </div>

      {/* Posts Stream */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isCommentsOpen = expandedComments[post.id];
          return (
            <div
              key={post.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
            >
              {/* Post Author Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {post.authorName[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {post.authorName}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                      <span>سطح {post.authorLevel}</span>
                      <span>•</span>
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                    #{post.tag}
                  </span>
                  <button
                    onClick={() => handleReportPost(post.id)}
                    className="text-slate-300 hover:text-rose-500 p-1"
                    title="گزارش محتوا"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* Action Buttons: Like, Comment count */}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:scale-105 transition-transform"
                >
                  <Heart className="w-4 h-4 fill-rose-500/20" />
                  <span>{post.likes}</span>
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
                  <span>{post.comments.length} نظر</span>
                </button>
              </div>

              {/* Comments Section */}
              {isCommentsOpen && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fade-in">
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-[11px] text-slate-700 dark:text-slate-300">
                          <span>{comment.authorName}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-normal">
                            {comment.createdAt}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">{comment.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      placeholder="نظر یا پاسخ خود را بنویسید..."
                      className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-sm hover:bg-sky-700"
                    >
                      <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
