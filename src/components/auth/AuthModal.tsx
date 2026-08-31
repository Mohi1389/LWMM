import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, Sparkles, Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { Logo } from '../common/Logo.js';
import { AgeRange, EnglishLevel, LearningGoal } from '../../types/index.js';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, signup } = useAuth();
  const { language, t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageRange, setAgeRange] = useState<AgeRange>('13-17');
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel>('unknown');
  const [learningGoal, setLearningGoal] = useState<LearningGoal>('speaking');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'ورود ناموفق بود.');
        }
      } else if (mode === 'signup') {
        const res = await signup({
          fullName,
          email,
          password,
          ageRange,
          englishLevel,
          learningGoal,
        });
        if (!res.success) {
          setError(res.error || 'ثبت‌نام ناموفق بود.');
        }
      } else if (mode === 'forgot') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setSuccessMsg(data.message || 'لینک بازیابی ارسال شد.');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: 'user' | 'admin') => {
    setLoading(true);
    setError(null);
    if (role === 'user') {
      await login('mohanna@example.com', 'pass123');
    } else {
      await login('admin@learnwithmohanna.com', 'admin123');
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      id="auth-modal"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <Logo size="sm" showText={true} />
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 p-2 bg-slate-50 dark:bg-slate-950/40">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            {t('auth.login')}
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            {t('auth.signup')}
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs leading-relaxed">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('auth.fullName')}
                </label>
                <div className="relative">
                  <UserIcon className="absolute top-3 right-3 w-4 h-4 text-slate-400 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'fa' ? 'مثال: مهنا کریمی' : 'e.g., Mohanna Karimi'}
                    className="w-full px-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute top-3 right-3 w-4 h-4 text-slate-400 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  className="w-full px-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-en"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('auth.password')}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      {t('auth.forgotPassword')}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute top-3 right-3 w-4 h-4 text-slate-400 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* Age Range */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    {t('auth.ageRange')}
                  </label>
                  <select
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value as AgeRange)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="13-17">۱۳ تا ۱۷ سال (نوجوان)</option>
                    <option value="18-24">۱۸ تا ۲۴ سال (جوان)</option>
                    <option value="25-34">۲۵ تا ۳۴ سال</option>
                    <option value="35+">۳۵ سال به بالا</option>
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    {t('auth.level')}
                  </label>
                  <select
                    value={englishLevel}
                    onChange={(e) => setEnglishLevel(e.target.value as EnglishLevel)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="unknown">نمی‌دانم (تعیین سطح)</option>
                    <option value="beginner">مبتدی (Beginner)</option>
                    <option value="elementary">مقدماتی (Elementary)</option>
                    <option value="pre-intermediate">متوسط پایه</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white shadow-md shadow-sky-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : mode === 'login' ? (
                <span>{t('auth.login')}</span>
              ) : mode === 'signup' ? (
                <span>{t('auth.signup')}</span>
              ) : (
                <span>ارسال لینک بازیابی</span>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for smooth evaluation */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <span className="block text-center text-[11px] text-slate-400 mb-2.5">
              {language === 'fa' ? 'ورود سریع تستی (بدون نیاز به ثبت‌نام):' : 'Quick Demo Access:'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('user')}
                className="p-2 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-sky-100 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>اکانت زبان‌آموز</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>اکانت مدیر (Admin)</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
