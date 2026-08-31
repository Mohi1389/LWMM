import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Bot,
  MessageSquare,
  Film,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { Logo } from '../common/Logo.js';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, completeOnboarding, openPlacementModal, openAuthModal } = useAuth();
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOnboardingOpen) return null;

  const steps = [
    {
      icon: Sparkles,
      color: 'from-sky-500 to-cyan-500',
      badgeFa: 'شروع مسیر موفقیت',
      badgeEn: 'Start Your Journey',
      titleFa: 'به Learn with Mohanna خوش آمدید!',
      titleEn: 'Welcome to Learn with Mohanna!',
      descFa:
        'پلتفرم مدرن و اختصاصی یادگیری زبان انگلیسی طراحی شده برای نوجوانان، جوانان و علاقه‌مندان فارسی‌زبان از سطح صفر تا متوسط.',
      descEn:
        'A modern, interactive English learning app specially crafted for Persian speakers to master English step-by-step.',
    },
    {
      icon: Bot,
      color: 'from-cyan-500 to-blue-600',
      badgeFa: 'هوش مصنوعی فارسی‌محور',
      badgeEn: 'Persian-First AI',
      titleFa: 'مهنا؛ مربی همیشه همراه و مهربان شما',
      titleEn: 'Mohanna: Your Patient AI Companion',
      descFa:
        'هر سوالی داری به فارسی بپرس، از ترجمه تا رفع اشکال گرامری. مهنا جملاتت رو اصلاح می‌کنه و نکات طلایی رو با زبان ساده برات توضیح میده.',
      descEn:
        'Ask questions in Persian, get gentle sentence corrections, and learn grammar rules with friendly explanations.',
    },
    {
      icon: MessageSquare,
      color: 'from-coral-500 to-amber-500',
      badgeFa: 'مکالمه شبیه‌سازی‌شده',
      badgeEn: 'Roleplay Dialogues',
      titleFa: 'مکالمه روان در موقعیت‌های واقعی',
      titleEn: 'Real-world Conversation Roleplays',
      descFa:
        'سفارش غذا در رستوران، تحویل بار در فرودگاه، معرفی خود در مدرسه و خرید لباس را با دستیار صوتی و متنی تمرین کنید.',
      descEn:
        'Practice ordering food, airport check-in, school introductions, and shopping with interactive roleplay dialogues.',
    },
    {
      icon: Film,
      color: 'from-purple-500 to-indigo-600',
      badgeFa: 'سینما و انیمیشن',
      badgeEn: 'Movies & Animation',
      titleFa: 'انگلیسی با انیمیشن‌ها و فیلم‌های جذاب',
      titleEn: 'Learn with Top Movies & Clips',
      descFa:
        'با تحلیل دیالوگ‌های شیر شاه، مرد عنکبوتی و انیمیشن‌های محبوب، اصطلاحات روزمره و تلفظ طبیعی را با زیرنویس هوشمند یاد بگیرید.',
      descEn:
        'Master natural slang and pronunciation through synchronized dual subtitles and vocabulary breakdowns.',
    },
    {
      icon: Award,
      color: 'from-emerald-500 to-teal-600',
      badgeFa: 'تعیین سطح و گیمیفیکیشن',
      badgeEn: 'Placement & Streaks',
      titleFa: 'تعیین سطح هوشمند و کسب مدال',
      titleEn: 'Accurate Placement & Daily Streaks',
      descFa:
        'سطح فعلی خود را بسنجید، امتیاز تجربه (XP) جمع کنید، زنجیره روزانه خود را حفظ کنید و با دوستانتان در جامعه یادگیری گفتگو کنید.',
      descEn:
        'Assess your level with our smart test, earn XP badges, build daily learning habits, and connect with peers.',
    },
  ];

  const current = steps[currentStep];
  const StepIcon = current.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      id="onboarding-modal"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Top Header with Skip Button */}
        <div className="flex items-center justify-between p-6 pb-2">
          <Logo size="sm" showText={true} />
          <button
            onClick={completeOnboarding}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded-lg transition-colors"
          >
            {language === 'fa' ? 'رد شدن' : 'Skip'}
          </button>
        </div>

        {/* Dynamic Step Content */}
        <div className="p-6 pt-4 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center"
            >
              {/* Illustration Icon */}
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${current.color} text-white flex items-center justify-center shadow-lg shadow-sky-500/20 mb-5`}
              >
                <StepIcon className="w-10 h-10 stroke-[2.2]" />
              </div>

              {/* Step Badge */}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 mb-3">
                {language === 'fa' ? current.badgeFa : current.badgeEn}
              </span>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mb-2 leading-tight">
                {language === 'fa' ? current.titleFa : current.titleEn}
              </h2>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
                {language === 'fa' ? current.descFa : current.descEn}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step Indicator Dots */}
        <div className="flex justify-center items-center gap-1.5 py-2">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-6 bg-sky-600 dark:bg-sky-400'
                  : 'w-2 bg-slate-200 dark:bg-slate-700'
              }`}
              aria-label={`گام ${idx + 1}`}
            />
          ))}
        </div>

        {/* Actions Footer */}
        <div className="p-6 pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
              <span>{language === 'fa' ? 'قبلی' : 'Back'}</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <span>{language === 'fa' ? 'بعدی' : 'Next'}</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
          ) : (
            <button
              onClick={() => {
                completeOnboarding();
                openPlacementModal();
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-600 to-coral-500 hover:opacity-95 text-white shadow-lg shadow-sky-600/20 flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'fa' ? 'شروع تعیین سطح هوشمند' : 'Take Placement Test'}</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
