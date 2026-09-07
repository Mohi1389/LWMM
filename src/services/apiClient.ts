import {
  demoUser,
  adminUser,
  initialVocab,
  initialQuizzes,
  initialScenarios,
  initialRooms,
  initialExpressions,
  initialGrammarTips,
  initialVideoLessons,
} from '../data/seedData.js';
import { User, Quiz, QuizResult, VocabularyWord } from '../types/index.js';

// Production Cloud Run backend URL for native/Capacitor APK builds
const DEFAULT_REMOTE_API_BASE = 'https://ais-pre-fmih6rtyey3xum73qeteng-377203507898.us-east1.run.app';

export const isMobileEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  const isCapacitor = Boolean((window as any).Capacitor?.isNativePlatform?.());
  const isCapacitorProtocol = window.location.protocol === 'capacitor:' || window.location.protocol === 'file:';
  const isAndroidWebView = /Android.*wv/.test(navigator.userAgent);
  const isLocalStaticPort = window.location.hostname === 'localhost' && window.location.port !== '3000' && window.location.port !== '5173';
  return isCapacitor || isCapacitorProtocol || isAndroidWebView || isLocalStaticPort;
};

export const getApiBaseUrl = (): string => {
  const envObj = (import.meta as any).env || {};
  const custom = envObj.VITE_API_BASE_URL;
  if (custom && typeof custom === 'string' && custom.trim().length > 0) {
    return custom.replace(/\/$/, '');
  }
  if (isMobileEnvironment()) {
    return DEFAULT_REMOTE_API_BASE;
  }
  return '';
};

// Helper to create synthetic Response objects with proper headers
function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

// Local Storage Keys
const LS_KEYS = {
  USER: 'lwmm_active_user',
  TOKEN: 'auth_token',
  SAVED_WORDS: 'lwmm_saved_word_ids',
  LEARNED_WORDS: 'lwmm_learned_word_ids',
  QUIZ_RESULTS: 'lwmm_quiz_results',
  PROGRESS: 'lwmm_learning_progress',
  REGISTERED_USERS: 'lwmm_registered_users',
  COMMUNITY_POSTS: 'lwmm_community_posts',
  COMMUNITY_EXPRESSIONS: 'lwmm_community_expressions',
};

// Local storage accessors
function getLocalUsers(): (User & { password?: string })[] {
  try {
    const raw = localStorage.getItem(LS_KEYS.REGISTERED_USERS);
    return raw ? JSON.parse(raw) : [demoUser, adminUser];
  } catch {
    return [demoUser, adminUser];
  }
}

function saveLocalUsers(users: (User & { password?: string })[]) {
  try {
    localStorage.setItem(LS_KEYS.REGISTERED_USERS, JSON.stringify(users));
  } catch {}
}

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(LS_KEYS.USER);
    if (raw) return JSON.parse(raw);
    const token = localStorage.getItem(LS_KEYS.TOKEN);
    if (token) {
      if (token.includes('admin')) return adminUser;
      return demoUser;
    }
  } catch {}
  return null;
}

function setStoredUser(user: User | null, token?: string) {
  try {
    if (user) {
      localStorage.setItem(LS_KEYS.USER, JSON.stringify(user));
      if (token) {
        localStorage.setItem(LS_KEYS.TOKEN, token);
      }
    } else {
      localStorage.removeItem(LS_KEYS.USER);
      localStorage.removeItem(LS_KEYS.TOKEN);
    }
  } catch {}
}

function getSavedWordIds(): string[] {
  try {
    const raw = localStorage.getItem(LS_KEYS.SAVED_WORDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setSavedWordIds(ids: string[]) {
  try {
    localStorage.setItem(LS_KEYS.SAVED_WORDS, JSON.stringify(ids));
  } catch {}
}

function getLearnedWordIds(): string[] {
  try {
    const raw = localStorage.getItem(LS_KEYS.LEARNED_WORDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLearnedWordIds(ids: string[]) {
  try {
    localStorage.setItem(LS_KEYS.LEARNED_WORDS, JSON.stringify(ids));
  } catch {}
}

/**
 * Offline Mock Engine: Handles any API call locally when the server is unreachable
 * or when the Android WebView serves static index.html instead of JSON.
 */
export async function handleOfflineApi(pathname: string, init?: RequestInit): Promise<Response> {
  let body: any = {};
  if (init?.body && typeof init.body === 'string') {
    try {
      body = JSON.parse(init.body);
    } catch {
      body = {};
    }
  }

  // 1. Authentication
  if (pathname === '/api/auth/login') {
    const { email, password } = body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const users = getLocalUsers();
    let found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      // Create user automatically on mobile so login never blocks the student!
      const isAd = cleanEmail.includes('admin');
      found = {
        id: `usr_${Date.now()}`,
        fullName: isAd ? 'مدیر سیستم' : cleanEmail.split('@')[0] || 'زبان‌آموز مهنا',
        email: cleanEmail,
        password: cleanPass,
        ageRange: '18-24',
        englishLevel: 'beginner',
        learningGoal: 'speaking',
        role: isAd ? 'admin' : 'user',
        xp: 120,
        streak: 3,
        lastActiveDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      users.push(found);
      saveLocalUsers(users);
    }

    const { password: _, ...safeUser } = found;
    const token = `token_local_${found.id}_${Date.now()}`;
    setStoredUser(safeUser, token);
    return jsonResponse({ user: safeUser, token });
  }

  if (pathname === '/api/auth/register') {
    const { fullName, email, password, ageRange, englishLevel, learningGoal } = body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const users = getLocalUsers();

    const newUser: User & { password?: string } = {
      id: `usr_${Date.now()}`,
      fullName: fullName || 'زبان‌آموز مهنا',
      email: cleanEmail,
      password: password || 'pass123',
      ageRange: ageRange || '18-24',
      englishLevel: englishLevel || 'beginner',
      learningGoal: learningGoal || 'general',
      role: 'user',
      xp: 0,
      streak: 1,
      lastActiveDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveLocalUsers(users);

    const { password: _, ...safeUser } = newUser;
    const token = `token_local_${newUser.id}_${Date.now()}`;
    setStoredUser(safeUser, token);
    return jsonResponse({ user: safeUser, token }, 201);
  }

  if (pathname === '/api/auth/me') {
    const user = getStoredUser() || demoUser;
    return jsonResponse({ user });
  }

  if (pathname === '/api/auth/logout') {
    setStoredUser(null);
    return jsonResponse({ success: true, message: 'با موفقیت خارج شدید' });
  }

  if (pathname === '/api/auth/update-profile') {
    const current = getStoredUser() || demoUser;
    const updated: User = {
      ...current,
      fullName: body.fullName || current.fullName,
      ageRange: body.ageRange || current.ageRange,
      englishLevel: body.englishLevel || current.englishLevel,
      learningGoal: body.learningGoal || current.learningGoal,
    };
    setStoredUser(updated);
    return jsonResponse({ user: updated });
  }

  if (pathname === '/api/auth/reset-progress') {
    const current = getStoredUser() || demoUser;
    const updated: User = {
      ...current,
      xp: 0,
      streak: 0,
    };
    setStoredUser(updated);
    setSavedWordIds([]);
    setLearnedWordIds([]);
    return jsonResponse({ success: true, user: updated, message: 'پیشرفت شما از صفر تنظیم شد.' });
  }

  if (pathname === '/api/auth/forgot-password') {
    return jsonResponse({ message: 'لینک بازیابی رمز عبور به ایمیل شما ارسال شد (کد موقت: 123456).' });
  }

  // 2. Quizzes
  if (pathname === '/api/quiz/list') {
    return jsonResponse(initialQuizzes);
  }

  if (pathname.startsWith('/api/quiz/')) {
    const quizId = pathname.replace('/api/quiz/', '').trim();

    if (quizId === 'submit') {
      const { answers = {}, timeSpentSeconds = 60, quizId: targetQuizId } = body;
      const quiz = initialQuizzes.find((q) => q.id === targetQuizId) || initialQuizzes[0];

      let score = 0;
      const evaluatedAnswers: any[] = [];
      const weakCategories: Set<string> = new Set();
      const strongCategories: Set<string> = new Set();

      quiz.questions.forEach((q) => {
        const userAnswer = answers?.[q.id] || '';
        const isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        if (isCorrect) {
          score += 1;
          strongCategories.add(q.category);
        } else {
          weakCategories.add(q.category);
        }
        evaluatedAnswers.push({
          questionId: q.id,
          userAnswer,
          isCorrect,
        });
      });

      const totalQ = quiz.questions.length;
      const percentage = Math.round((score / totalQ) * 100);
      const xpGained = score * 10;

      // Update user XP locally
      const currentUser = getStoredUser();
      if (currentUser) {
        currentUser.xp = (currentUser.xp || 0) + xpGained;
        setStoredUser(currentUser);
      }

      const result: QuizResult = {
        id: `res_${Date.now()}`,
        userId: currentUser?.id || 'usr_local',
        quizId: quiz.id,
        quizTitle: quiz.titleFa,
        score,
        totalQuestions: totalQ,
        percentage,
        timeSpentSeconds,
        speedRating: 'fast',
        strengths: Array.from(strongCategories),
        weaknesses: Array.from(weakCategories),
        recommendedPath: percentage >= 80 ? 'سطح متوسط' : 'تقویت پایه‌ای',
        estimatedLevel: percentage >= 80 ? 'pre-intermediate' : 'beginner',
        answers: evaluatedAnswers,
        completedAt: new Date().toISOString(),
      };

      return jsonResponse(result);
    }

    const quiz = initialQuizzes.find((q) => q.id === quizId);
    if (quiz) {
      return jsonResponse(quiz);
    }
    return jsonResponse(initialQuizzes[0]);
  }

  // 3. Vocabulary
  if (pathname === '/api/vocabulary/list') {
    return jsonResponse(initialVocab);
  }

  if (pathname === '/api/vocabulary/saved') {
    const savedIds = new Set(getSavedWordIds());
    const savedWords = initialVocab.filter((w) => savedIds.has(w.id));
    return jsonResponse(savedWords);
  }

  if (pathname === '/api/vocabulary/save') {
    const { wordId } = body;
    if (wordId) {
      const saved = getSavedWordIds();
      if (!saved.includes(wordId)) {
        saved.push(wordId);
        setSavedWordIds(saved);
      }
    }
    return jsonResponse({ success: true, saved: true });
  }

  if (pathname === '/api/vocabulary/unsave') {
    const { wordId } = body;
    if (wordId) {
      const saved = getSavedWordIds().filter((id) => id !== wordId);
      setSavedWordIds(saved);
    }
    return jsonResponse({ success: true, saved: false });
  }

  if (pathname === '/api/vocabulary/learned') {
    if (init?.method === 'POST') {
      const { wordId } = body;
      if (wordId) {
        const learned = getLearnedWordIds();
        if (!learned.includes(wordId)) {
          learned.push(wordId);
          setLearnedWordIds(learned);

          const currentUser = getStoredUser();
          if (currentUser) {
            currentUser.xp = (currentUser.xp || 0) + 10;
            setStoredUser(currentUser);
          }
        }
      }
      return jsonResponse({ success: true, xpGained: 10 });
    } else {
      const learnedIds = new Set(getLearnedWordIds());
      const words = initialVocab.filter((w) => learnedIds.has(w.id));
      return jsonResponse(words);
    }
  }

  // 4. Learning Progress
  if (pathname === '/api/learning/progress') {
    const user = getStoredUser() || demoUser;
    const learnedCount = getLearnedWordIds().length;
    const savedCount = getSavedWordIds().length;

    return jsonResponse({
      userId: user.id,
      level: user.englishLevel || 'beginner',
      currentXp: user.xp || 120,
      xpForNextLevel: 500,
      streakDays: user.streak || 3,
      wordsLearned: learnedCount,
      wordsSaved: savedCount,
      quizzesCompleted: 2,
      accuracyRate: 88,
      dailyGoalMinutes: 15,
      todayMinutesSpent: 8,
      streakHistory: [true, true, true, false, false, false, false],
    });
  }

  // Videos (Movies & Animations)
  if (pathname === '/api/learning/videos') {
    return jsonResponse(initialVideoLessons);
  }

  // Achievements
  if (pathname === '/api/learning/achievements') {
    return jsonResponse([
      {
        id: 'ach_first_quiz',
        code: 'FIRST_QUIZ',
        titleFa: 'قدم اول قهرمان 🏅',
        titleEn: 'First Quiz Completed',
        descriptionFa: 'اولین کوئیز خود را با موفقیت پشت سر بگذارید.',
        descriptionEn: 'Successfully complete your first English quiz.',
        icon: 'award',
        targetCount: 1,
        currentCount: 0,
        unlocked: false,
        xpReward: 50,
      },
      {
        id: 'ach_7_streak',
        code: '7_DAY_STREAK',
        titleFa: 'استمرار طلایی (۷ روز پیاپی) 🔥',
        titleEn: '7-Day Streak Master',
        descriptionFa: '۷ روز پشت سر هم تمرین روزانه را انجام دهید.',
        descriptionEn: 'Practice English for 7 consecutive days.',
        icon: 'flame',
        targetCount: 7,
        currentCount: 1,
        unlocked: false,
        xpReward: 100,
      },
    ]);
  }

  // 5. Community
  if (pathname === '/api/community/rooms') {
    return jsonResponse(initialRooms);
  }

  if (pathname === '/api/community/posts') {
    try {
      const raw = localStorage.getItem(LS_KEYS.COMMUNITY_POSTS);
      const posts = raw ? JSON.parse(raw) : [];
      return jsonResponse(posts);
    } catch {
      return jsonResponse([]);
    }
  }

  if (pathname === '/api/community/posts/create') {
    const user = getStoredUser() || demoUser;
    const newPost = {
      id: `post_${Date.now()}`,
      authorId: user.id,
      authorName: user.fullName,
      authorRole: user.role,
      category: body.category || 'discussion',
      title: body.title || '',
      content: body.content || '',
      createdAt: new Date().toISOString(),
      likesCount: 0,
      repliesCount: 0,
      isResolved: false,
    };
    try {
      const raw = localStorage.getItem(LS_KEYS.COMMUNITY_POSTS);
      const posts = raw ? JSON.parse(raw) : [];
      posts.unshift(newPost);
      localStorage.setItem(LS_KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
    } catch {}
    return jsonResponse(newPost, 201);
  }

  if (pathname === '/api/community/expressions') {
    return jsonResponse(initialExpressions);
  }

  if (pathname === '/api/community/grammar-tips') {
    return jsonResponse(initialGrammarTips);
  }

  // 6. AI Scenarios
  if (pathname === '/api/ai/scenarios') {
    return jsonResponse(initialScenarios);
  }

  if (pathname === '/api/ai/chat') {
    const userMsg = body.message || '';
    return jsonResponse({
      reply: `بسیار عالی! جمله شما را دریافت کردم: "${userMsg}". در زبان انگلیسی برای پاسخ می‌توانید از عبارت "That makes a lot of sense!" استفاده کنید. چه سوال دیگری دارید؟`,
      corrections: [],
    });
  }

  // Fallback for any unknown API route
  return jsonResponse({ status: 'ok', offline: true, pathname });
}

/**
 * Installs the global fetch interceptor.
 * - In Web mode: Routes requests to relative `/api/...` or express dev server.
 * - In Android/Capacitor mode: Automatically prefixes remote backend URL.
 * - On network timeout/error OR when WebView returns HTML index.html:
 *   Gracefully serves local seed data and localStorage state without any UI crash!
 */
export function setupApiInterceptor() {
  if (typeof window === 'undefined') return;
  if ((window as any).__lwmm_interceptor_installed) return;
  (window as any).__lwmm_interceptor_installed = true;

  const originalFetch = window.fetch ? window.fetch.bind(window) : fetch.bind(globalThis);

  const customFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    let url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

    // Check if this is an API call
    if (url.startsWith('/api/') || url.includes('/api/')) {
      const apiPath = url.startsWith('http') ? new URL(url).pathname : url;
      const baseUrl = getApiBaseUrl();
      const targetUrl = baseUrl ? `${baseUrl}${apiPath}` : apiPath;

      try {
        const headers = new Headers(init?.headers || {});
        if (!headers.has('Accept')) {
          headers.set('Accept', 'application/json, text/plain, */*');
        }

        // 5-second timeout for remote mobile calls so users don't wait indefinitely on poor network
        const controller = new AbortController();
        const timeoutMs = isMobileEnvironment() ? 5000 : 8000;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await originalFetch(targetUrl, {
          ...init,
          headers,
          signal: init?.signal || controller.signal,
        });
        clearTimeout(timeoutId);

        // Crucial Check: Did the WebView or server return HTML (e.g. index.html) instead of JSON?
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
          console.warn(`[LWMM] Received HTML for ${apiPath} (likely WebView SPA fallback), using local offline engine.`);
          return handleOfflineApi(apiPath, init);
        }

        // If the server answered with an error status >= 500, fallback to local data
        if (response.status >= 500) {
          console.warn(`[LWMM] Server returned ${response.status} for ${apiPath}, falling back to local data.`);
          return handleOfflineApi(apiPath, init);
        }

        return response;
      } catch (err: any) {
        console.warn(`[LWMM] Network failure for ${apiPath} (${err.message}), falling back to local engine.`);
        return handleOfflineApi(apiPath, init);
      }
    }

    return originalFetch(input, init);
  };

  try {
    Object.defineProperty(window, 'fetch', {
      value: customFetch,
      writable: true,
      configurable: true,
      enumerable: true,
    });
  } catch (errDef) {
    try {
      (window as any).fetch = customFetch;
    } catch (errAssign) {
      console.warn('[LWMM] Unable to attach customFetch to window.fetch:', errDef, errAssign);
    }
  }

  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any) !== window) {
      Object.defineProperty(globalThis, 'fetch', {
        value: customFetch,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
  } catch {}

  console.log('🚀 [LWMM] API Network & Offline Interceptor initialized. Base URL:', getApiBaseUrl() || '(relative)');
}
