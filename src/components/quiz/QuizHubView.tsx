import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Award,
  Compass,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Zap,
  HelpCircle,
  Flame,
  Check,
  Clock,
  Volume2,
  BookOpen,
  Languages,
  Bot,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { Quiz, QuizQuestion, QuizResult } from '../../types/index.js';

export const QuizHubView: React.FC = () => {
  const { openPlacementModal, addXp } = useAuth();
  const { language } = useLanguage();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showTranslations, setShowTranslations] = useState<boolean>(true);

  // Timer State
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/quiz/list')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setQuizzes(data);
      })
      .catch(() => {});
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !isSubmitted) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isSubmitted]);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setQuizResult(null);
    setElapsedSeconds(0);
    setIsTimerRunning(true);
  };

  const handleSelectOption = (option: string) => {
    if (!activeQuiz || isSubmitted) return;
    const q = activeQuiz.questions[currentIndex];
    setSelectedAnswers((prev) => ({
      ...prev,
      [q.id]: option,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setIsTimerRunning(false);

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: activeQuiz.id,
          answers: selectedAnswers,
          timeSpentSeconds: elapsedSeconds,
        }),
      });

      const data = await res.json();
      if (res.ok && data.result) {
        setQuizResult(data.result);
        setIsSubmitted(true);
        addXp(data.xpGained || 40);

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
      }
    } catch (err) {
      console.error('Quiz submit error:', err);
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

  const currentQ: QuizQuestion | undefined = activeQuiz?.questions[currentIndex];
  const progressPercent = activeQuiz
    ? Math.round(((currentIndex + 1) / activeQuiz.questions.length) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-12 animate-fade-in" id="quiz-hub-view">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          {language === 'fa' ? 'آزمون‌ها و سنجش مهارت 🎯' : 'Quizzes & Skill Assessment'}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {language === 'fa'
            ? 'آزمون‌های استاندارد ۸ تا ۱۰ سوالی همراه با ترجمه فارسی، زمان‌سنج هوشمند و کارنامه تحلیلی'
            : 'Test your knowledge with thematic quizzes, smart timing metrics, and immediate Persian explanations.'}
        </p>
      </div>

      {/* 2. Featured Placement Test Hero Banner */}
      {!activeQuiz && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-coral-500 text-white shadow-xl shadow-amber-500/15 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>{language === 'fa' ? 'تعیین سطح هوشمند مهنا' : 'Smart Placement'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              {language === 'fa'
                ? 'سطح دقیق انگلیسی‌تان را در ۳ دقیقه بسنجید!'
                : 'Find your exact English level in 3 minutes!'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 max-w-lg leading-relaxed">
              {language === 'fa'
                ? 'سنجش گرامر، درک مطلب و لغات با ارائه کارنامه نقاط قوت، ضعف و نقشه راه اختصاصی.'
                : 'Instant analysis of your grammar, vocabulary, and strengths with personalized roadmap recommendations.'}
            </p>
          </div>

          <button
            onClick={openPlacementModal}
            className="px-6 py-3 rounded-2xl bg-white text-amber-700 font-bold text-xs shadow-lg hover:bg-amber-50 transition-transform active:scale-95 flex items-center gap-2 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{language === 'fa' ? 'شروع آزمون تعیین سطح (+۵۰ XP)' : 'Start Placement Test'}</span>
          </button>
        </div>
      )}

      {/* 3. ACTIVE QUIZ RUNNER */}
      {activeQuiz ? (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            {/* Top Bar: Title, Category & Timer */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  {language === 'fa' ? activeQuiz.titleFa : activeQuiz.titleEn}
                </h3>
                <span className="text-xs text-slate-500 capitalize">
                  {activeQuiz.category} • سطح {activeQuiz.level} • {activeQuiz.questions.length} سوال
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!isSubmitted && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
                    <span>{formatTime(elapsedSeconds)}</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (window.confirm('آیا می‌خواهید از آزمون خارج شوید؟')) {
                      setActiveQuiz(null);
                      setIsTimerRunning(false);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  انصراف
                </button>
              </div>
            </div>

            {/* Progress Bar & Sub Controls */}
            {!isSubmitted && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>
                    سوال {currentIndex + 1} از {activeQuiz.questions.length}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowTranslations(!showTranslations)}
                      className="flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 font-normal hover:underline"
                    >
                      <Languages className="w-3.5 h-3.5" />
                      <span>{showTranslations ? 'مخفی‌کردن ترجمه فارسی' : 'نمایش ترجمه فارسی'}</span>
                    </button>
                    <span className="font-mono text-sky-600 dark:text-sky-400">{progressPercent}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-coral-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Result View */}
            {isSubmitted && quizResult ? (
              <div className="space-y-6 animate-fade-in" id="quiz-result-view">
                <div className="text-center p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-sky-50 to-white dark:from-slate-800/80 dark:to-slate-900 border border-sky-100 dark:border-slate-700 space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">
                    کارنامه تحلیلی آزمون 🎯
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    شما موفق شدید نمره <strong>{quizResult.score}</strong> از{' '}
                    <strong>{quizResult.totalQuestions}</strong> ({quizResult.percentage}%) را کسب کنید.
                  </p>

                  {/* Badges: Time, Speed & Estimated Level */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1 font-mono">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      +{activeQuiz.xpReward || 50} XP کسب شد
                    </span>

                    <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-sky-500" />
                      زمان: {formatTime(quizResult.timeSpentSeconds || elapsedSeconds)}
                    </span>

                    <span className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-sky-500" />
                      {quizResult.speedRating === 'fast'
                        ? 'سرعت بالا و مسلط'
                        : quizResult.speedRating === 'moderate'
                        ? 'سرعت متعادل و خوب'
                        : 'با دقت و حوصله'}
                    </span>

                    {quizResult.estimatedLevel && (
                      <span className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold font-en uppercase">
                        سطح: {quizResult.estimatedLevel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Strengths & Weaknesses Analysis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>نقاط قوت شما در این آزمون:</span>
                    </div>
                    <ul className="text-xs text-emerald-900 dark:text-emerald-200 space-y-1 pr-2">
                      {quizResult.strengths?.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>موضوعات نیازمند تمرین بیشتر:</span>
                    </div>
                    <ul className="text-xs text-amber-900 dark:text-amber-200 space-y-1 pr-2">
                      {quizResult.weaknesses?.map((w, i) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Educational Roadmap advice */}
                {quizResult.recommendedPath && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed space-y-1">
                    <span className="font-bold text-slate-800 dark:text-white block">
                      💡 توصیه آموزشی مهنا برای پیشرفت شما:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300">{quizResult.recommendedPath}</p>
                  </div>
                )}

                {/* Detailed Question by Question Review */}
                <div className="space-y-3 pt-2">
                  <span className="text-sm font-bold text-slate-800 dark:text-white block">
                    مرور جزء به جزء سوالات و توضیحات فارسی:
                  </span>
                  {activeQuiz.questions.map((q, idx) => {
                    const userAns = selectedAnswers[q.id];
                    const isCorrect = userAns === q.correctAnswer;

                    return (
                      <div
                        key={q.id}
                        className={`p-4 sm:p-5 rounded-2xl border text-xs space-y-3 ${
                          isCorrect
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/70'
                            : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className="text-xs text-slate-500 font-fa">{q.promptFa}</p>
                            <h5 className="font-bold text-slate-900 dark:text-white font-en text-sm">
                              {idx + 1}. {q.promptEn}
                            </h5>
                          </div>
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                          )}
                        </div>

                        {/* Options Comparison with translations */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                          {q.options?.map((opt, oIdx) => {
                            const isUserPick = userAns === opt;
                            const isRight = opt === q.correctAnswer;
                            const optFa = q.optionsFa?.[oIdx];

                            return (
                              <div
                                key={oIdx}
                                className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                                  isRight
                                    ? 'border-emerald-500 bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 font-bold'
                                    : isUserPick
                                    ? 'border-rose-400 bg-rose-100/50 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200'
                                    : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                <div className="flex items-center justify-between font-en">
                                  <span>{opt}</span>
                                  {isRight && <span className="text-[10px] text-emerald-600 font-fa">✓ صحیح</span>}
                                  {isUserPick && !isRight && <span className="text-[10px] text-rose-600 font-fa">انتخاب شما</span>}
                                </div>
                                {optFa && <span className="text-[10px] text-slate-500 font-fa pt-1">{optFa}</span>}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-700 dark:text-slate-300 font-fa leading-relaxed">
                          💡 <strong>نکته آموزشی:</strong> {q.explanationFa}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => handleStartQuiz(activeQuiz)}
                    className="flex-1 py-3 rounded-xl border border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-sky-100 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>تکرار مجدد این آزمون</span>
                  </button>

                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95 text-center"
                  >
                    بازگشت به لیست آزمون‌ها
                  </button>
                </div>
              </div>
            ) : currentQ ? (
              /* Active Question */
              <div className="space-y-6">
                {/* Question Prompt */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 capitalize">
                      {currentQ.category}
                    </span>
                    <button
                      onClick={() => playTTS(currentQ.promptEn)}
                      className="p-1 text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="پخش صوتی تلفظ"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {showTranslations && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-fa">
                      {currentQ.promptFa}
                    </p>
                  )}
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-en leading-relaxed">
                    {currentQ.promptEn}
                  </h4>
                </div>

                {/* Options with Persian Translations */}
                <div className="space-y-3">
                  {currentQ.options?.map((option, idx) => {
                    const selected = selectedAnswers[currentQ.id] === option;
                    const optionFa = currentQ.optionsFa?.[idx];

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(option)}
                        className={`w-full p-4 rounded-2xl border text-start transition-all duration-150 flex items-center justify-between gap-3 ${
                          selected
                            ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/70 text-sky-900 dark:text-sky-100 font-bold shadow-sm ring-1 ring-sky-500'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-sky-300 dark:hover:border-sky-700'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="font-en text-xs sm:text-sm block">{option}</span>
                          {showTranslations && optionFa && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-fa block font-normal">
                              {optionFa}
                            </span>
                          )}
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            selected
                              ? 'border-sky-600 bg-sky-600 text-white'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Question Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  {currentIndex > 0 ? (
                    <button
                      onClick={() => setCurrentIndex((prev) => prev - 1)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                      <span>سوال قبلی</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentIndex < activeQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((prev) => prev + 1)}
                      disabled={!selectedAnswers[currentQ.id]}
                      className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      <span>سوال بعدی</span>
                      <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={!selectedAnswers[currentQ.id]}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>ثبت و مشاهده کارنامه</span>
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* 4. THEMATIC QUIZ CARDS GRID */
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {language === 'fa' ? 'آزمون‌های استاندارد و تخصصی' : 'Available Standard Quizzes'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-en uppercase">
                      سطح {quiz.level}
                    </span>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 font-mono">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      +{quiz.xpReward} XP
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {language === 'fa' ? quiz.titleFa : quiz.titleEn}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {language === 'fa' ? quiz.descriptionFa : quiz.descriptionEn}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono pt-1">
                    <span>{quiz.questions.length} سوال دو زبانه</span>
                    <span>•</span>
                    <span>زمان پیشنهادی: {Math.round((quiz.timeLimitSeconds || 300) / 60)} دقیقه</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/15 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                >
                  <Award className="w-4 h-4" />
                  <span>{language === 'fa' ? 'شروع آزمون' : 'Start Quiz'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
