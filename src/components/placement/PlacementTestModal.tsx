import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  Zap,
  Clock,
  Volume2,
  Languages,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { Quiz, QuizQuestion, QuizResult } from '../../types/index.js';

export const PlacementTestModal: React.FC = () => {
  const { isPlacementModalOpen, closePlacementModal, updateUserLevel, addXp } = useAuth();
  const { language } = useLanguage();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: string }>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTranslations, setShowTranslations] = useState(true);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (isPlacementModalOpen) {
      setLoading(true);
      setResult(null);
      setCurrentIndex(0);
      setUserAnswers({});
      setElapsedSeconds(0);

      fetch('/api/quiz/quiz_placement')
        .then((res) => res.json())
        .then((data) => {
          setQuiz(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isPlacementModalOpen]);

  useEffect(() => {
    let interval: any = null;
    if (isPlacementModalOpen && !result && !loading) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlacementModalOpen, result, loading]);

  if (!isPlacementModalOpen) return null;

  const handleSelectOption = (option: string) => {
    if (!quiz) return;
    const currentQ = quiz.questions[currentIndex];
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const handleNext = () => {
    if (!quiz) return;
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          answers: userAnswers,
          timeSpentSeconds: elapsedSeconds,
        }),
      });

      const data = await res.json();
      if (res.ok && data.result) {
        setResult(data.result);
        addXp(data.xpGained || 50);

        try {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {}

        if (data.updatedLevel) {
          updateUserLevel(data.updatedLevel);
        }
      }
    } catch (err) {
      console.error('Submit placement test error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const playTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQ: QuizQuestion | undefined = quiz?.questions[currentIndex];
  const progressPercent = quiz ? Math.round(((currentIndex + 1) / quiz.questions.length) * 100) : 0;
  const isCurrentAnswered = currentQ ? Boolean(userAnswers[currentQ.id]) : false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in"
      id="placement-modal"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-white">
                {language === 'fa' ? 'آزمون تعیین سطح هوشمند مهنا' : 'Mohanna Smart Placement Test'}
              </h2>
              <span className="text-xs text-slate-500">
                {language === 'fa'
                  ? 'سنجش دقیق گرامر و واژگان با زمان‌سنج و کارنامه تحلیلی'
                  : 'Grammar and vocabulary assessment with timer'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!result && !loading && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
                <span>{formatTime(elapsedSeconds)}</span>
              </div>
            )}
            <button
              onClick={closePlacementModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {!result && quiz && (
          <div className="px-6 pt-3 pb-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
              <span>
                {language === 'fa'
                  ? `سوال ${currentIndex + 1} از ${quiz.questions.length}`
                  : `Question ${currentIndex + 1} of ${quiz.questions.length}`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTranslations(!showTranslations)}
                  className="flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 hover:underline"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>{showTranslations ? 'مخفی ترجمه' : 'نمایش ترجمه'}</span>
                </button>
                <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{progressPercent}%</span>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-coral-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-500">در حال بارگذاری سوالات تعیین سطح...</span>
            </div>
          ) : result ? (
            /* Result Card */
            <div className="space-y-6 animate-fade-in" id="placement-results-view">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-sky-50 to-white dark:from-slate-800/60 dark:to-slate-900 border border-sky-100 dark:border-slate-700">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 to-amber-500 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-sky-500/20">
                  <Award className="w-8 h-8" />
                </div>

                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1">
                  {language === 'fa' ? 'نتیجه تعیین سطح شما مشخص شد!' : 'Your Placement Result is Ready!'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {language === 'fa'
                    ? `شما به ${result.score} سوال از ${result.totalQuestions} سوال (${result.percentage}%) پاسخ صحیح دادید.`
                    : `You answered ${result.score} out of ${result.totalQuestions} questions correctly.`}
                </p>

                {/* Level Badge + Speed */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 text-white shadow-md shadow-sky-600/20">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-bold font-en uppercase tracking-wide">
                      {result.estimatedLevel} LEVEL
                    </span>
                    <span className="text-xs font-medium font-fa">
                      {result.estimatedLevel === 'beginner'
                        ? '(سطح مبتدی)'
                        : result.estimatedLevel === 'elementary'
                        ? '(سطح مقدماتی)'
                        : '(سطح متوسط پایه)'}
                    </span>
                  </div>

                  <span className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold font-mono">
                    ⏱️ زمان: {formatTime(result.timeSpentSeconds || elapsedSeconds)}
                  </span>

                  <span className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold">
                    ⚡ {result.speedRating === 'fast' ? 'سرعت بالا' : result.speedRating === 'moderate' ? 'سرعت نرمال' : 'با دقت و تامل'}
                  </span>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'fa' ? 'نقاط قوت شما' : 'Your Strengths'}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-emerald-950 dark:text-emerald-200">
                    {result.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>{language === 'fa' ? 'موضوعات برای تمرین بیشتر' : 'Areas to Strengthen'}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200">
                    {result.weaknesses.map((weak, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Roadmap */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="block text-xs font-bold text-slate-800 dark:text-white mb-1">
                  {language === 'fa' ? 'مسیر یادگیری اختصاصی مهنا برای شما:' : 'Your Personalized Roadmap:'}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {result.recommendedPath}
                </p>
              </div>

              {/* Questions Review */}
              {quiz && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">
                    مرور پاسخ‌های سوالات تعیین سطح:
                  </span>
                  {quiz.questions.map((q, idx) => {
                    const userAns = userAnswers[q.id];
                    const isRight = userAns === q.correctAnswer;
                    return (
                      <div
                        key={q.id}
                        className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                          isRight
                            ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[11px] text-slate-500 font-fa">{q.promptFa}</p>
                            <span className="font-bold text-slate-900 dark:text-white font-en">
                              {idx + 1}. {q.promptEn}
                            </span>
                          </div>
                          {isRight ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 font-fa border-t border-slate-200/50 dark:border-slate-800 pt-1.5">
                          💡 <strong>پاسخ صحیح:</strong> <span className="font-en font-bold text-emerald-700 dark:text-emerald-300">{q.correctAnswer}</span> — {q.explanationFa}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : currentQ ? (
            /* Active Question */
            <div className="space-y-5" id="active-question-view">
              {/* Question Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 capitalize">
                    {currentQ.category}
                  </span>
                  <span className="text-xs text-slate-400 font-en capitalize">
                    {currentQ.difficulty}
                  </span>
                </div>
                <button
                  onClick={() => playTTS(currentQ.promptEn)}
                  className="p-1 text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Question Prompt */}
              <div>
                {showTranslations && (
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 font-fa">
                    {currentQ.promptFa}
                  </p>
                )}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-en leading-relaxed">
                  {currentQ.promptEn}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options?.map((option, idx) => {
                  const selected = userAnswers[currentQ.id] === option;
                  const optionFa = currentQ.optionsFa?.[idx];
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(option)}
                      id={`placement-option-${idx}`}
                      className={`w-full p-3.5 rounded-2xl border text-start text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between gap-3 ${
                        selected
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-sky-300 dark:hover:border-sky-700'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-en block">{option}</span>
                        {showTranslations && optionFa && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-fa font-normal block">
                            {optionFa}
                          </span>
                        )}
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          selected
                            ? 'border-sky-600 bg-sky-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          {result ? (
            <button
              onClick={closePlacementModal}
              className="w-full py-3 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'fa' ? 'ثبت سطح و شروع یادگیری' : 'Apply & Start Learning'}</span>
            </button>
          ) : (
            <>
              {currentIndex > 0 ? (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  <span>{language === 'fa' ? 'قبلی' : 'Back'}</span>
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={handleNext}
                disabled={!isCurrentAnswered || isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/25 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {currentIndex === (quiz?.questions.length || 0) - 1
                        ? language === 'fa'
                          ? 'پایان و مشاهده نتیجه'
                          : 'Finish Test'
                        : language === 'fa'
                        ? 'بعدی'
                        : 'Next'}
                    </span>
                    <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
