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

  useEffect(() => {
    fetch('/api/quiz/list')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setQuizzes(data);
      })
      .catch(() => {});
  }, []);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setQuizResult(null);
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

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: activeQuiz.id,
          answers: selectedAnswers,
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

  const currentQ: QuizQuestion | undefined = activeQuiz?.questions[currentIndex];
  const progressPercent = activeQuiz
    ? Math.round(((currentIndex + 1) / activeQuiz.questions.length) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-12 animate-fade-in" id="quiz-hub-view">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          {language === 'fa' ? 'آزمون‌ها و خودسنجی 🎯' : 'Quizzes & Assessment'}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {language === 'fa'
            ? 'آزمون‌های زمان‌دار، کوییزهای روزانه و تعیین سطح هوشمند همراه با کارنامه تحلیلی'
            : 'Test your knowledge with thematic quizzes, immediate feedback, and XP rewards.'}
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
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  {language === 'fa' ? activeQuiz.titleFa : activeQuiz.titleEn}
                </h3>
                <span className="text-xs text-slate-500 capitalize">
                  {activeQuiz.category} • {activeQuiz.level}
                </span>
              </div>

              <button
                onClick={() => setActiveQuiz(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                خروج از آزمون
              </button>
            </div>

            {/* Progress Bar */}
            {!isSubmitted && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>
                    سوال {currentIndex + 1} از {activeQuiz.questions.length}
                  </span>
                  <span className="font-mono text-sky-600">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-coral-500 transition-all rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Result View */}
            {isSubmitted && quizResult ? (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-sky-50 to-white dark:from-slate-800 dark:to-slate-900 border border-sky-100 dark:border-slate-700">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/20">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    نتیجه آزمون ثبت شد! 🎉
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    شما موفق شدید نمره <strong>{quizResult.score}</strong> از{' '}
                    <strong>{quizResult.totalQuestions}</strong> را کسب کنید (+{activeQuiz.xpReward} XP).
                  </p>
                </div>

                {/* Question by Question Review */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    مرور سوالات و پاسخ‌های صحیح:
                  </span>
                  {activeQuiz.questions.map((q, idx) => {
                    const userAns = selectedAnswers[q.id];
                    const isCorrect = userAns === q.correctAnswer;

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-2xl border text-xs space-y-2 ${
                          isCorrect
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                            : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-slate-900 dark:text-white font-en">
                            {idx + 1}. {q.promptEn}
                          </p>
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          )}
                        </div>

                        <div className="space-y-0.5 text-[11px]">
                          <p>
                            پاسخ شما: <strong className="font-en">{userAns || 'بی‌پاسخ'}</strong>
                          </p>
                          {!isCorrect && (
                            <p className="text-emerald-700 dark:text-emerald-400">
                              پاسخ صحیح: <strong className="font-en">{q.correctAnswer}</strong>
                            </p>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-300 font-fa pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                          💡 <strong>توضیح:</strong> {q.explanationFa}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setActiveQuiz(null)}
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
                >
                  بازگشت به لیست آزمون‌ها
                </button>
              </div>
            ) : currentQ ? (
              /* Active Question */
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{currentQ.promptFa}</p>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-en">
                    {currentQ.promptEn}
                  </h4>
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQ.options?.map((option, idx) => {
                    const selected = selectedAnswers[currentQ.id] === option;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(option)}
                        className={`w-full p-3.5 rounded-2xl border text-start text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                          selected
                            ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 font-bold shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-sky-300'
                        }`}
                      >
                        <span className="font-en">{option}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
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

                {/* Question Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  {currentIndex > 0 ? (
                    <button
                      onClick={() => setCurrentIndex((prev) => prev - 1)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1"
                    >
                      <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                      <span>قبلی</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentIndex < activeQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((prev) => prev + 1)}
                      disabled={!selectedAnswers[currentQ.id]}
                      className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md flex items-center gap-1 disabled:opacity-50"
                    >
                      <span>بعدی</span>
                      <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={!selectedAnswers[currentQ.id]}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1 disabled:opacity-50"
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
            {language === 'fa' ? 'آزمون‌های موضوعی و دوره‌ای' : 'Available Thematic Quizzes'}
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
                      {quiz.level}
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
                    <span>{quiz.questions.length} سوال</span>
                    <span>•</span>
                    <span>{quiz.timeLimitMinutes} دقیقه</span>
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
