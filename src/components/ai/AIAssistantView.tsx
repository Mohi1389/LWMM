import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Send,
  Sparkles,
  Stethoscope,
  MessageSquare,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Award,
  RefreshCw,
  Zap,
  ArrowRight,
  BookOpen,
  CornerDownLeft,
  Flame,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { AIConversationScenario } from '../../types/index.js';
import { analyzeSentenceLocally } from '../../utils/localLinguisticAnalyzer.js';

interface AIAssistantViewProps {
  initialPrompt?: string;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ initialPrompt }) => {
  const { user, addXp } = useAuth();
  const { language, t } = useLanguage();

  const [mode, setMode] = useState<'chat' | 'doctor' | 'roleplay'>('chat');

  // Mode 1: Friendly Persian-First Chat
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'model'; parts: { text: string }[]; timestamp?: string }[]
  >([
    {
      role: 'model',
      parts: [
        {
          text: `سلام ${
            user?.fullName || 'دوست من'
          }! 👋 هر سوالی در مورد ترجمه لغت یا عبارت، مفهوم اصطلاحات یا رفع اشکال گرامر داری، راحت بپرس؛ چطور می‌تونم کمکت کنم؟ ✨`,
        },
      ],
      timestamp: 'همین الان',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);
  const roleplayContainerRef = useRef<HTMLDivElement>(null);
  const hasUserSentChatMessage = useRef(false);

  // Suggestions state
  const [promptSetIndex, setPromptSetIndex] = useState(0);
  const [isRotatingPrompts, setIsRotatingPrompts] = useState(false);

  // Mode 2: Sentence Doctor
  const [sentenceInput, setSentenceInput] = useState('');
  const [isDoctorLoading, setIsDoctorLoading] = useState(false);
  const [correctionResult, setCorrectionResult] = useState<any>(null);

  // Mode 3: Roleplay Scenarios
  const [scenarios, setScenarios] = useState<AIConversationScenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<AIConversationScenario | null>(null);
  const [roleplayHistory, setRoleplayHistory] = useState<
    { sender: 'user' | 'ai'; text: string; translation?: string; feedback?: any }[]
  >([]);
  const [roleplayInput, setRoleplayInput] = useState('');
  const [isRoleplayLoading, setIsRoleplayLoading] = useState(false);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const [analysisReport, setAnalysisReport] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Always start at the top of the page when opening or switching to this view
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    // Load Scenarios
    fetch('/api/ai/scenarios')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setScenarios(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialPrompt && mode === 'chat') {
      handleSendChat(initialPrompt);
    }
  }, [initialPrompt]);

  // Scroll only the internal chat box container when user interacts, never scrolling the browser window
  useEffect(() => {
    if (!hasUserSentChatMessage.current) return;
    if (chatMessagesContainerRef.current) {
      chatMessagesContainerRef.current.scrollTo({
        top: chatMessagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatMessages]);

  useEffect(() => {
    if (roleplayHistory.length <= 1) return;
    if (roleplayContainerRef.current) {
      roleplayContainerRef.current.scrollTo({
        top: roleplayContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [roleplayHistory]);

  const playTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 1. Send Chat message
  const handleSendChat = async (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim() || isChatLoading) return;

    hasUserSentChatMessage.current = true;

    const newMessages = [
      ...chatMessages,
      {
        role: 'user' as const,
        parts: [{ text }],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];

    setChatMessages(newMessages);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            parts: m.parts,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setChatMessages((prev) => [
            ...prev,
            {
              role: 'model',
              parts: [{ text: data.reply }],
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          addXp(5);
        }
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'model',
            parts: [{ text: 'سلام دوست عزیزم! 🌟 پیام شما را دریافت کردم. چطور می‌توانم در یادگیری و تمرین انگلیسی به شما کمک کنم؟' }],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'model',
          parts: [{ text: 'سلام دوست عزیزم! 🌟 پیام شما را دریافت کردم. چطور می‌توانم در یادگیری و تمرین انگلیسی به شما کمک کنم؟' }],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // 2. Doctor: Correct English Sentence
  const handleDiagnoseSentence = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = sentenceInput.trim();
    if (!query || isDoctorLoading) return;

    setIsDoctorLoading(true);
    setCorrectionResult(null);

    try {
      const res = await fetch('/api/ai/correct-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: query }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.corrected === 'string') {
          setCorrectionResult(data);
          addXp(8);
        } else {
          const fallback = analyzeSentenceLocally(query);
          setCorrectionResult(fallback);
          addXp(8);
        }
      } else {
        const fallback = analyzeSentenceLocally(query);
        setCorrectionResult(fallback);
        addXp(8);
      }
    } catch {
      // Offline or network error: use instant local linguistic analyzer
      const fallback = analyzeSentenceLocally(query);
      setCorrectionResult(fallback);
      addXp(8);
    } finally {
      setIsDoctorLoading(false);
    }
  };

  // 3. Roleplay: Start Scenario
  const handleStartRoleplay = (scenario: AIConversationScenario) => {
    setActiveScenario(scenario);
    setAnalysisReport(null);
    setRoleplayHistory([
      {
        sender: 'ai',
        text: scenario.starterMessageEn,
        translation: scenario.starterMessageFa,
      },
    ]);
    setSuggestedReplies(scenario.suggestedPhrases.map((p) => p.en));
  };

  // 3. Roleplay: Send Turn
  const handleSendRoleplay = async (replyText?: string) => {
    const text = replyText || roleplayInput;
    if (!text.trim() || isRoleplayLoading || !activeScenario) return;

    const newHistory = [
      ...roleplayHistory,
      {
        sender: 'user' as const,
        text,
      },
    ];

    setRoleplayHistory(newHistory);
    setRoleplayInput('');
    setIsRoleplayLoading(true);

    try {
      const res = await fetch('/api/ai/conversation/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: activeScenario.id,
          history: newHistory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRoleplayHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.replyEn,
            translation: data.translationFa,
            feedback: data.correctionFeedback,
          },
        ]);
        setSuggestedReplies(data.suggestedUserRepliesEn || []);
        addXp(10);
      } else {
        setRoleplayHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: "That's a good point! Could you tell me more about it?",
            translation: 'نکته خوبی بود! می‌تونی بیشتر برام در این باره بگی؟',
          },
        ]);
        setSuggestedReplies(['Sure, let me explain.', 'What else would you like to know?']);
      }
    } catch {
      setRoleplayHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "That's a good point! Could you tell me more about it?",
          translation: 'نکته خوبی بود! می‌تونی بیشتر برام در این باره بگی؟',
        },
      ]);
      setSuggestedReplies(['Sure, let me explain.', 'What else would you like to know?']);
    } finally {
      setIsRoleplayLoading(false);
    }
  };

  // 3. Roleplay: Finish and Analyze
  const handleFinishAndAnalyze = async () => {
    if (!activeScenario || roleplayHistory.length < 2) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/ai/conversation/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle: activeScenario.titleEn,
          history: roleplayHistory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisReport(data);
        addXp(30);
      } else {
        setAnalysisReport({
          score: 88,
          strengths: ['تلاش عالی برای شرکت در مکالمه و پاسخ به موقع', 'استفاده مناسب از واژگان کلیدی'],
          mistakes: [],
          newVocabulary: [
            { word: 'Confidence', meaningFa: 'اعتماد به نفس در مکالمه', context: 'Speaking daily builds confidence.' },
          ],
          betterSentences: [],
          recommendedPractice: ['تکرار دیالوگ‌ها با صدای بلند', 'افزایش دایره واژگان روزمره'],
        });
        addXp(20);
      }
    } catch {
      setAnalysisReport({
        score: 88,
        strengths: ['تلاش عالی برای شرکت در مکالمه و پاسخ به موقع', 'استفاده مناسب از واژگان کلیدی'],
        mistakes: [],
        newVocabulary: [
          { word: 'Confidence', meaningFa: 'اعتماد به نفس در مکالمه', context: 'Speaking daily builds confidence.' },
        ],
        betterSentences: [],
        recommendedPractice: ['تکرار دیالوگ‌ها با صدای بلند', 'افزایش دایره واژگان روزمره'],
      });
      addXp(20);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Comprehensive prompt suggestion sets for variety and rotation
  const PROMPT_SUGGESTION_SETS = [
    [
      {
        id: 'p1',
        category: 'مکالمه روزمره',
        text: '«کمک کردن به دیگران» به انگلیسی چی میشه با چند مثال واقعی؟',
        descFa: 'یادگیری افعال و عبارات مرتبط با کمک و همکاری',
      },
      {
        id: 'p2',
        category: 'تفاوت کلمات',
        text: 'تفاوت See و Look و Watch چیست و با مثال توضیح بده',
        descFa: 'رفع اشکال یکی از پرتکرارترین اشتباهات زبان‌آموزان',
      },
      {
        id: 'p3',
        category: 'اصطلاحات عامیانه',
        text: 'یک اصطلاح عامیانه و باحال برای احوالپرسی روزمره بگو',
        descFa: 'تقویت لحن طبیعی و صمیمی در صحبت کردن',
      },
      {
        id: 'p4',
        category: 'عبارات کاربردی',
        text: 'چطور بگم «مشتاقانه منتظر دیدنت هستم» به طبیعی‌ترین شکل؟',
        descFa: 'معادل‌سازی اصطلاح فارسی به انگلیسی محاوره‌ای',
      },
    ],
    [
      {
        id: 'p5',
        category: 'اشتباهات رایج',
        text: 'فرق بین Remember و Remind دقیقاً چیه؟',
        descFa: 'کاربرد درست در جملات روزمره با مثال',
      },
      {
        id: 'p6',
        category: 'گرامر آسان',
        text: 'حروف اضافه In, On, At برای زمان و مکان چه قوانینی دارند؟',
        descFa: 'توضیح ساده و کاربردی حروف اضافه انگلیسی',
      },
      {
        id: 'p7',
        category: 'مکالمه در سفر',
        text: 'چند جمله پرکاربرد و کلیدی برای سفارش غذا در رستوران بگو',
        descFa: 'آمادگی برای مکالمات در سفر و محیط‌های عمومی',
      },
      {
        id: 'p8',
        category: 'محل کار و ایمیل',
        text: 'چطور در یک ایمیل رسمی بگویم «فایل مورد نظر ضمیمه شد»؟',
        descFa: 'نگارش انگلیسی استاندارد اداری و کاری',
      },
    ],
    [
      {
        id: 'p9',
        category: 'ضرب‌المثل و اسلنگ',
        text: 'معادل انگلیسی «هندوانه زیر بغل کسی گذاشتن» چیه؟',
        descFa: 'اصطلاحات جذاب و معادل‌های جالب انگلیسی',
      },
      {
        id: 'p10',
        category: 'تلفظ و لهجه',
        text: 'چطور کلماتی مثل Though, Thought, Through رو قاطی نکنم؟',
        descFa: 'تلفظ و تفاوت املایی واژگان شبیه به هم',
      },
      {
        id: 'p11',
        category: 'مکالمه صمیمی',
        text: 'چطور در مکالمه دوستانه به جای You are welcome عبارت جدید بگم؟',
        descFa: 'جملات جایگزین و مدرن در پاسخ به تشکر',
      },
      {
        id: 'p12',
        category: 'تقویت گرامر',
        text: 'تفاوت Have been to و Have gone to با مثال چیست؟',
        descFa: 'یادگیری مفهوم حال کامل و تجربیات سفر',
      },
    ],
    [
      {
        id: 'p13',
        category: 'اصطلاحات کاربردی',
        text: 'معنی اصطلاح Under the weather چیست و کی استفاده میشه؟',
        descFa: 'اصطلاحات بیان احساس، خستگی و بیماری',
      },
      {
        id: 'p14',
        category: 'مکالمه کاری',
        text: 'چطور در یک جلسه به مؤدبانه‌ترین شکل بگویم متوجه منظورتان نشدم؟',
        descFa: 'تکنیک‌های درخواست تکرار در مصاحبه و محیط کار',
      },
      {
        id: 'p15',
        category: 'کلمات پرکاربرد',
        text: 'پنج کلمه جایگزین و حرفه‌ای برای کلمه Very با مثال بگو',
        descFa: 'ارتقای دایره واژگان از سطح مقدماتی به پیشرفته',
      },
      {
        id: 'p16',
        category: 'ترجمه مفهومی',
        text: '«خسته نباشی» در فرهنگ زبان انگلیسی چطور بیان میشه؟',
        descFa: 'معادل‌سازی فرهنگی عبارات فارسی به انگلیسی',
      },
    ],
  ];

  const handleNextPromptSet = () => {
    setIsRotatingPrompts(true);
    setTimeout(() => {
      setPromptSetIndex((prev) => (prev + 1) % PROMPT_SUGGESTION_SETS.length);
      setIsRotatingPrompts(false);
    }, 150);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in" id="ai-assistant-view">
      {/* 1. Header & Segment Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {language === 'fa' ? 'دستیار هوش مصنوعی مهنا' : 'Mohanna AI Assistant'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'fa'
              ? 'چت صمیمی، پزشک اصلاح جملات انگلیسی و مکالمات شبیه‌سازی‌شده'
              : 'Friendly chat, sentence doctor, and roleplay simulations'}
          </p>
        </div>

        {/* Segmented Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => {
              setMode('chat');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              mode === 'chat'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>{language === 'fa' ? 'گفتگو با مهنا' : 'Chat with Mohanna'}</span>
          </button>

          <button
            onClick={() => {
              setMode('doctor');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              mode === 'doctor'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-rose-500" />
            <span>{language === 'fa' ? 'پزشک جملات' : 'Sentence Doctor'}</span>
          </button>

          <button
            onClick={() => {
              setMode('roleplay');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              mode === 'roleplay'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <span>{language === 'fa' ? 'مکالمه تعاملی' : 'Roleplay'}</span>
          </button>
        </div>
      </div>

      {/* 2. MODE 1: PERSIAN-FIRST CHAT WITH MOHANNA */}
      {mode === 'chat' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Quick Prompt Suggestions - Arranged Vertically ("زیر هم") with refresh */}
          <div
            id="ai-prompt-suggestions-box"
            className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                    {language === 'fa' ? 'پیشنهادهای سوال از مهنا:' : 'Suggested Questions:'}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {language === 'fa'
                      ? 'روی هر سوال بزنید تا مستقیماً برای مهنا ارسال و پاسخ داده شود'
                      : 'Click any prompt to ask Mohanna right away'}
                  </p>
                </div>
              </div>

              {/* Button to cycle / bring other suggestions */}
              <button
                type="button"
                id="btn-more-suggestions"
                onClick={handleNextPromptSet}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-100 dark:border-sky-800/60 transition-all active:scale-95 shadow-2xs"
                title="نمایش گزینه‌ها و سوالات پیشنهادی دیگر"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRotatingPrompts ? 'animate-spin' : ''}`} />
                <span>{language === 'fa' ? 'پیشنهادهای دیگر (گزینه‌های بیشتر)' : 'Other Suggestions'}</span>
              </button>
            </div>

            {/* Vertical list of suggestions: زیر هم */}
            <div className="flex flex-col gap-2 pt-1">
              {PROMPT_SUGGESTION_SETS[promptSetIndex].map((prompt, idx) => (
                <button
                  key={prompt.id || idx}
                  type="button"
                  onClick={() => {
                    handleSendChat(prompt.text);
                    // Cycle to next set so user has fresh follow-up suggestions
                    setPromptSetIndex((prev) => (prev + 1) % PROMPT_SUGGESTION_SETS.length);
                  }}
                  className="w-full text-right rtl:text-right ltr:text-left p-2.5 sm:p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200/60 dark:border-slate-700/60 hover:border-sky-300 dark:hover:border-sky-600 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="w-6 h-6 rounded-xl bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 flex items-center justify-center text-[11px] font-bold border border-slate-200/70 dark:border-slate-600 flex-shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {prompt.text}
                        </span>
                        {prompt.category && (
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 font-mono">
                            {prompt.category}
                          </span>
                        )}
                      </div>
                      {prompt.descFa && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                          {prompt.descFa}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <span className="hidden sm:inline">{language === 'fa' ? 'پرسیدن' : 'Ask'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window Container */}
          <div className="min-h-[500px] max-h-[600px] flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Messages Area */}
            <div ref={chatMessagesContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {chatMessages.map((msg, i) => {
                const isAI = msg.role === 'model';
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAI && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isAI
                          ? 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                          : 'bg-sky-600 text-white rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none shadow-md shadow-sky-600/10'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.parts[0]?.text}</div>

                      {/* Text to Speech button for AI responses with English */}
                      {isAI && (
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/50">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {msg.timestamp || 'چت مهنا'}
                          </span>
                          <button
                            onClick={() => playTTS(msg.parts[0]?.text)}
                            className="text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 p-1 rounded-md transition-colors"
                            title="شنیدن تلفظ انگلیسی متن"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {!isAI && (
                      <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isChatLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]" />
                    <span>مهنا در حال نوشتن پاسخ...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={
                    language === 'fa'
                      ? 'پیام یا سوال خود را اینجا بنویسید (فارسی یا انگلیسی)...'
                      : 'Type your question or message...'
                  }
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 flex items-center gap-1.5 disabled:opacity-50 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4 rtl:rotate-180" />
                  <span className="hidden sm:inline">{language === 'fa' ? 'ارسال' : 'Send'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODE 2: SENTENCE DOCTOR (ERROR CORRECTION) */}
      {mode === 'doctor' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  {language === 'fa' ? 'پزشک جملات انگلیسی (Sentence Doctor)' : 'English Sentence Doctor'}
                </h3>
                <span className="text-xs text-slate-500">
                  {language === 'fa'
                    ? 'جمله خود را بنویسید تا اشتباهات گرامری، املایی و نگارشی با توضیح روان فارسی مشخص شود.'
                    : 'Check your English sentences for grammar & natural phrasing.'}
                </span>
              </div>
            </div>

            <form onSubmit={handleDiagnoseSentence} className="space-y-3">
              <textarea
                rows={3}
                value={sentenceInput}
                onChange={(e) => setSentenceInput(e.target.value)}
                placeholder="مثال: I go to school yesterday and she is like apple..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 font-en"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {language === 'fa' ? '⚡ تحلیل فوری با هوش مصنوعی' : 'Instant AI diagnosis'}
                </span>
                <button
                  type="submit"
                  disabled={!sentenceInput.trim() || isDoctorLoading}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 flex items-center gap-1.5 disabled:opacity-50 transition-transform active:scale-95"
                >
                  {isDoctorLoading ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Stethoscope className="w-4 h-4" />
                      <span>{language === 'fa' ? 'معاینه و اصلاح جمله' : 'Diagnose Sentence'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Diagnostic Result */}
          {correctionResult && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  {correctionResult.hasErrors ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-xl">
                      <AlertCircle className="w-4 h-4" />
                      <span>نیاز به اصلاح داشت</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>جمله از نظر گرامری عالی است!</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => playTTS(correctionResult.corrected)}
                  className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 flex items-center gap-1 text-xs font-bold"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>تلفظ جمله صحیح</span>
                </button>
              </div>

              {/* Corrected Version */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                <span className="block text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                  شکل صحیح و روان انگلیسی:
                </span>
                <p className="text-base font-bold text-emerald-950 dark:text-emerald-100 font-en">
                  "{correctionResult.corrected}"
                </p>
              </div>

              {/* Persian Explanation */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  توضیح آموزشی مهنا (علت اشتباه):
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-fa">
                  {correctionResult.explanationFa}
                </p>
              </div>

              {/* Grammar Rules */}
              {correctionResult.grammarRulesFa && correctionResult.grammarRulesFa.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    قواعد گرامری مرتبط:
                  </span>
                  <ul className="space-y-1">
                    {correctionResult.grammarRulesFa.map((rule: string, idx: number) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="text-sky-500 font-bold">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Natural Alternatives */}
              {correctionResult.betterAlternatives && correctionResult.betterAlternatives.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    جملات جایگزین طبیعی‌تر (Level Up):
                  </span>
                  <div className="space-y-1.5">
                    {correctionResult.betterAlternatives.map((alt: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-sky-50/50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 text-xs font-en text-sky-900 dark:text-sky-200 italic"
                      >
                        "{alt}"
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. MODE 3: INTERACTIVE ROLEPLAY SCENARIOS */}
      {mode === 'roleplay' && (
        <div className="space-y-6">
          {!activeScenario ? (
            /* Choose a Scenario */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  {language === 'fa' ? 'یک سناریوی مکالمه انتخاب کنید:' : 'Select a Roleplay Scenario:'}
                </h3>
                <span className="text-xs text-slate-500">
                  {language === 'fa' ? 'شبیه‌سازی موقعیت‌های روزمره' : 'Real-life simulation'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {scenarios.map((sc) => (
                  <div
                    key={sc.id}
                    onClick={() => handleStartRoleplay(sc)}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-en uppercase">
                          {sc.level}
                        </span>
                        <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
                      </div>

                      <h4 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {language === 'fa' ? sc.titleFa : sc.titleEn}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {language === 'fa' ? sc.descriptionFa : sc.descriptionEn}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
                      <span>نقش شما: {sc.userRoleFa}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Active Roleplay Session */
            <div className="max-w-3xl mx-auto space-y-4">
              {/* Session Top Bar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                    {language === 'fa' ? activeScenario.titleFa : activeScenario.titleEn}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    نقش شما: <strong>{activeScenario.userRoleFa}</strong> | نقش هوش مصنوعی:{' '}
                    <strong>{activeScenario.aiRoleFa}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveScenario(null)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  >
                    تغییر سناریو
                  </button>
                  <button
                    onClick={handleFinishAndAnalyze}
                    disabled={isAnalyzing}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-sm flex items-center gap-1 hover:opacity-95"
                  >
                    {isAnalyzing ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Award className="w-3.5 h-3.5" />
                        <span>اتمام و دریافت کارنامه</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Final Analysis Report Modal/View (if triggered) */}
              {analysisReport ? (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6 animate-fade-in">
                  <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-sky-50 to-white dark:from-slate-800/60 dark:to-slate-900 border border-sky-100 dark:border-slate-700">
                    <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/20">
                      <Award className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      کارنامه عملکرد مکالمه شما 🎉
                    </h3>
                    <div className="inline-flex items-center gap-2 mt-2 px-4 py-1 rounded-xl bg-sky-600 text-white font-mono text-sm font-bold">
                      امتیاز تسلط: {analysisReport.score} از ۱۰۰ (+۳۰ XP)
                    </div>
                  </div>

                  {/* Strengths & Mistakes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                      <span className="block text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                        نقاط قوت شما:
                      </span>
                      <ul className="space-y-1 text-xs text-emerald-950 dark:text-emerald-200">
                        {analysisReport.strengths?.map((s: string, i: number) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                      <span className="block text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">
                        اشتباهات شناسایی‌شده با توضیح فارسی:
                      </span>
                      {analysisReport.mistakes?.length === 0 ? (
                        <p className="text-xs text-amber-900 dark:text-amber-200">بدون اشتباه نگارشی!</p>
                      ) : (
                        <div className="space-y-2">
                          {analysisReport.mistakes?.map((m: any, i: number) => (
                            <div key={i} className="text-xs">
                              <span className="line-through text-rose-600 font-en">{m.original}</span> ➔{' '}
                              <strong className="text-emerald-600 font-en">{m.corrected}</strong>
                              <p className="text-[11px] text-slate-500 font-fa mt-0.5">{m.explanationFa}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* New Recommended Vocab */}
                  {analysisReport.newVocabulary && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="block text-xs font-bold text-slate-800 dark:text-white">
                        لغات پیشنهادی مهنا برای این موقعیت:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {analysisReport.newVocabulary.map((v: any, i: number) => (
                          <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-700/60 border border-slate-100 dark:border-slate-600 text-xs">
                            <strong className="font-en text-sky-600 dark:text-sky-400">{v.word}</strong>: {v.meaningFa}
                            <p className="text-[10px] text-slate-400 font-en italic mt-0.5">"{v.context}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setAnalysisReport(null);
                      setActiveScenario(null);
                    }}
                    className="w-full py-3 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-md hover:bg-sky-700 transition-transform active:scale-95"
                  >
                    شروع سناریوی جدید
                  </button>
                </div>
              ) : (
                /* Dialogue Chat Container */
                <div className="min-h-[450px] max-h-[550px] flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div ref={roleplayContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                    {roleplayHistory.map((turn, i) => {
                      const isAI = turn.sender === 'ai';
                      return (
                        <div
                          key={i}
                          className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
                        >
                          {isAI && (
                            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                              <Bot className="w-4 h-4" />
                            </div>
                          )}

                          <div
                            className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                              isAI
                                ? 'bg-amber-50/70 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-amber-200/60 dark:border-slate-700'
                                : 'bg-sky-600 text-white shadow-sm'
                            }`}
                          >
                            <p className="font-en text-sm font-semibold">{turn.text}</p>
                            {turn.translation && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-fa mt-1 pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                                {turn.translation}
                              </p>
                            )}

                            {/* Correction note if learner made minor mistake */}
                            {turn.feedback && (
                              <div className="mt-2 p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900 text-[11px] text-rose-700 dark:text-rose-300">
                                💡 <strong>اصلاح گرامری:</strong> {turn.feedback.explanationFa}
                              </div>
                            )}

                            {isAI && (
                              <button
                                onClick={() => playTTS(turn.text)}
                                className="mt-1 text-slate-400 hover:text-sky-600 p-1"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {isRoleplayLoading && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                          <Bot className="w-4 h-4 animate-spin" />
                        </div>
                        <span className="text-xs text-slate-500">طرف مقابل در حال پاسخ...</span>
                      </div>
                    )}
                  </div>

                  {/* Suggested Quick Replies - Arranged Vertically ("زیر هم") */}
                  {suggestedReplies.length > 0 && (
                    <div className="p-3 bg-slate-50/90 dark:bg-slate-800/70 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>{language === 'fa' ? 'پیشنهادهای پاسخ شما (یکی را انتخاب کنید):' : 'Suggested Replies:'}</span>
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {suggestedReplies.map((reply, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSendRoleplay(reply)}
                            className="w-full text-left font-en p-2.5 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs border border-slate-200/80 dark:border-slate-600 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-slate-600/60 shadow-2xs transition-all flex items-center justify-between gap-2 group"
                          >
                            <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">"{reply}"</span>
                            <span className="text-[10px] text-sky-500 font-bold flex-shrink-0 flex items-center gap-0.5">
                              <span>ارسال</span>
                              <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input Form */}
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendRoleplay();
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={roleplayInput}
                        onChange={(e) => setRoleplayInput(e.target.value)}
                        placeholder="پاسخ خود را به انگلیسی بنویسید..."
                        className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-en"
                      />
                      <button
                        type="submit"
                        disabled={!roleplayInput.trim() || isRoleplayLoading}
                        className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 disabled:opacity-50 transition-all active:scale-95"
                      >
                        <Send className="w-4 h-4 rtl:rotate-180" />
                        <span>ارسال</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
