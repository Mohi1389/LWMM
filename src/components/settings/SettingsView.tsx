import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Sun,
  Moon,
  Monitor,
  User,
  Lock,
  Bell,
  Shield,
  LogOut,
  CheckCircle2,
  Save,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTheme } from '../../context/ThemeContext.js';

interface SettingsViewProps {
  onNavigate?: (tab: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate }) => {
  const { user, updateUserProfile, logout } = useAuth();
  const { language, setLanguage, t, dir } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();

  // Account Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [ageRange, setAgeRange] = useState(user?.ageRange || 'teen');
  const [englishLevel, setEnglishLevel] = useState(user?.englishLevel || 'beginner');
  const [learningGoal, setLearningGoal] = useState(user?.learningGoal || 'general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Notification Preferences
  const [notifDailyReminder, setNotifDailyReminder] = useState(true);
  const [notifStreakAlert, setNotifStreakAlert] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(false);
  const [notifQuizResult, setNotifQuizResult] = useState(true);

  // Privacy
  const [safeCommunityFilter, setSafeCommunityFilter] = useState(true);
  const [anonymousProfile, setAnonymousProfile] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName,
      ageRange,
      englishLevel,
      learningGoal,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordError(
        language === 'fa'
          ? 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد.'
          : 'New password must be at least 6 characters.'
      );
      return;
    }
    setPasswordError('');
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in" id="settings-view">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {language === 'fa' ? 'تنظیمات و سفارشی‌سازی' : 'Settings & Preferences'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'fa'
              ? 'مدیریت حساب کاربری، زبان برنامه، تم ظاهری، اعلان‌ها و حریم خصوصی'
              : 'Manage your account, language, theme, notification alerts and privacy'}
          </p>
        </div>
      </div>

      {/* 1. Language & Display */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Globe className="w-5 h-5 text-sky-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {language === 'fa' ? 'زبان برنامه (Language)' : 'App Language'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setLanguage('fa')}
            className={`p-4 rounded-2xl border text-start flex items-center justify-between transition-all ${
              language === 'fa'
                ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-200 shadow-sm ring-1 ring-sky-500'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            <div>
              <span className="text-sm font-bold block">فارسی (Persian)</span>
              <span className="text-xs text-slate-500">راست‌چین کامل و توضیحات روان فارسی</span>
            </div>
            {language === 'fa' && <CheckCircle2 className="w-5 h-5 text-sky-500" />}
          </button>

          <button
            onClick={() => setLanguage('en')}
            className={`p-4 rounded-2xl border text-start flex items-center justify-between transition-all ${
              language === 'en'
                ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-200 shadow-sm ring-1 ring-sky-500'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            <div>
              <span className="text-sm font-bold block font-en">English (انگلیسی)</span>
              <span className="text-xs text-slate-500">Full LTR layout with English UI</span>
            </div>
            {language === 'en' && <CheckCircle2 className="w-5 h-5 text-sky-500" />}
          </button>
        </div>
      </div>

      {/* 2. Theme Preferences */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Sun className="w-5 h-5 text-amber-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {language === 'fa' ? 'تم ظاهری (Theme)' : 'Color Theme'}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'light'
                ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold">{language === 'fa' ? 'روشن (Light)' : 'Light'}</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'dark'
                ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Moon className="w-5 h-5 text-sky-400" />
            <span className="text-xs font-bold">{language === 'fa' ? 'تاریک (Deep Ocean)' : 'Dark'}</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'system'
                ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Monitor className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-bold">{language === 'fa' ? 'سیستم (Auto)' : 'System'}</span>
          </button>
        </div>
      </div>

      {/* 3. Account Profile Information */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <User className="w-5 h-5 text-sky-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {language === 'fa' ? 'مشخصات حساب کاربری' : 'Account Details'}
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'fa' ? 'ایمیل (شناسه کاربری)' : 'Email'}
              </label>
              <input
                type="email"
                value={user?.email || 'learner@mohanna.edu'}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'fa' ? 'رده سنی' : 'Age Range'}
              </label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
              >
                <option value="teen">{language === 'fa' ? 'نوجوان (۱۳ تا ۱۷ سال)' : 'Teen (13-17)'}</option>
                <option value="young-adult">{language === 'fa' ? 'جوان (۱۸ تا ۲۵ سال)' : 'Young Adult (18-25)'}</option>
                <option value="adult">{language === 'fa' ? 'بزرگسال (۲۵+ سال)' : 'Adult (25+)'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'fa' ? 'سطح زبان انگلیسی' : 'English Level'}
              </label>
              <select
                value={englishLevel}
                onChange={(e) => setEnglishLevel(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 font-en capitalize"
              >
                <option value="beginner">Beginner (مبتدی A1)</option>
                <option value="elementary">Elementary (مقدماتی A2)</option>
                <option value="pre-intermediate">Pre-Intermediate (متوسط B1)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'fa' ? 'هدف اصلی یادگیری' : 'Learning Goal'}
              </label>
              <select
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
              >
                <option value="speaking">{language === 'fa' ? 'مکالمه و روانی کلام' : 'Speaking'}</option>
                <option value="vocabulary">{language === 'fa' ? 'تقویت دایره لغات' : 'Vocabulary'}</option>
                <option value="grammar">{language === 'fa' ? 'گرامر و جمله‌سازی' : 'Grammar'}</option>
                <option value="school">{language === 'fa' ? 'مدرسه و امتحانات' : 'School English'}</option>
                <option value="travel">{language === 'fa' ? 'سفر و مهاجرت' : 'Travel English'}</option>
                <option value="general">{language === 'fa' ? 'عمومی و جامع' : 'General English'}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'fa' ? 'ذخیره تغییرات مشخصات' : 'Save Profile'}</span>
            </button>

            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'fa' ? 'مشخصات با موفقیت به‌روزرسانی شد.' : 'Profile updated successfully.'}</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* 4. Security & Change Password */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Lock className="w-5 h-5 text-coral-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {language === 'fa' ? 'تغییر رمز عبور (Password)' : 'Change Password'}
          </h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'fa' ? 'رمز عبور فعلی' : 'Current Password'}
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-coral-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'fa' ? 'رمز عبور جدید' : 'New Password'}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="حداقل ۶ کاراکتر"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-coral-500"
              />
            </div>
          </div>

          {passwordError && (
            <p className="text-xs font-bold text-rose-500">{passwordError}</p>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold text-xs transition-all"
            >
              {language === 'fa' ? 'به‌روزرسانی رمز عبور' : 'Update Password'}
            </button>

            {passwordSuccess && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'fa' ? 'رمز عبور شما تغییر یافت.' : 'Password updated.'}</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* 5. Notifications Preferences */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Bell className="w-5 h-5 text-amber-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {language === 'fa' ? 'تنظیمات اعلان‌ها و یادآوری' : 'Notification Preferences'}
          </h2>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {language === 'fa' ? 'یادآور روزانه تمرین زبان' : 'Daily Learning Reminder'}
              </span>
              <span className="text-[11px] text-slate-500">
                {language === 'fa' ? 'دریافت یادآوری دوستانه برای حفظ زنجیره استمرار' : 'Get friendly reminder to keep your streak'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifDailyReminder}
              onChange={(e) => setNotifDailyReminder(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {language === 'fa' ? 'هشدار خطر از دست رفتن Streak' : 'Streak Loss Warning'}
              </span>
              <span className="text-[11px] text-slate-500">
                {language === 'fa' ? 'اطلاع‌رسانی قبل از پایان روز در صورت عدم تمرین' : 'Alert before end of day if no practice completed'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifStreakAlert}
              onChange={(e) => setNotifStreakAlert(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {language === 'fa' ? 'اعلان پاسخ‌های انجمن زبان‌آموزان' : 'Community Reply Alerts'}
              </span>
              <span className="text-[11px] text-slate-500">
                {language === 'fa' ? 'دریافت اعلان هنگام پاسخ همتایان به سؤالات شما' : 'Notify when peers answer your questions'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifCommunity}
              onChange={(e) => setNotifCommunity(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
            />
          </label>
        </div>
      </div>

      {/* 6. Privacy & Community Safety */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Shield className="w-5 h-5 text-emerald-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {language === 'fa' ? 'حریم خصوصی و ایمنی نوجوانان' : 'Privacy & Community Safety'}
          </h2>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {language === 'fa' ? 'فیلتر خودکار و ایمن انجمن (Safe Mode)' : 'Safe Community Filtering'}
              </span>
              <span className="text-[11px] text-slate-500">
                {language === 'fa'
                  ? 'جلوگیری خودکار از انتشار شماره تماس، لینک و محتوای نامناسب'
                  : 'Block phone numbers, external links and inappropriate words'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={safeCommunityFilter}
              onChange={(e) => setSafeCommunityFilter(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
          </label>
        </div>
      </div>

      {/* 7. App Info & Logout */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-start space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-black text-slate-900 dark:text-white text-sm font-en">
              Learn with Mohanna
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-600 font-mono">
              v1.2.0 Stable
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            طراحی‌شده اختصاصی برای یادگیری آسان زبان انگلیسی به همراه هوش مصنوعی مهنا
          </p>
        </div>

        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-2 hover:bg-rose-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{language === 'fa' ? 'خروج از حساب کاربری' : 'Sign Out'}</span>
        </button>
      </div>
    </div>
  );
};
