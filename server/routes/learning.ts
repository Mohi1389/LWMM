import { Router } from 'express';
import { db } from '../db.js';
import { getAuthUser } from './auth.js';
import { LearningProgress } from '../../src/types/index.js';

export const learningRouter = Router();

// Get personalized learning progress and dashboard data
learningRouter.get('/progress', (req, res) => {
  const user = getAuthUser(req) || db.getUserById('usr_demo_1');
  if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });

  const learnedWords = db.getLearnedWords(user.id);
  const quizResults = db.getUserQuizHistory(user.id);
  const today = new Date().toISOString().split('T')[0];

  const wordsLearnedToday = learnedWords.length > 0 ? Math.min(5, learnedWords.length) : 2;
  const aiPracticeDone = true;
  const quizCompleted = quizResults.length > 0;

  const progress: LearningProgress = {
    userId: user.id,
    level: user.englishLevel,
    totalXp: user.xp,
    streakDays: user.streak,
    learnedWordIds: learnedWords.map((w) => w.id),
    completedQuizIds: quizResults.map((q) => q.quizId),
    completedLessonIds: ['les_grammar_1', 'les_vocab_daily'],
    todayGoal: {
      date: today,
      wordsLearned: wordsLearnedToday,
      targetWords: 5,
      aiPracticeDone,
      quizCompleted,
      completed: wordsLearnedToday >= 5 && aiPracticeDone && quizCompleted,
    },
    recentActivity: [
      {
        id: 'act_1',
        type: 'word',
        title: 'یادگیری کلمه "Resilient"',
        timestamp: 'امروز، ۱۰:۱۵',
        xpEarned: 10,
      },
      {
        id: 'act_2',
        type: 'ai_chat',
        title: 'تمرین سفارش غذا در رستوران',
        timestamp: 'امروز، ۰۹:۳۰',
        xpEarned: 30,
      },
      {
        id: 'act_3',
        type: 'quiz',
        title: 'آزمون لغات: احساسات و صفات',
        timestamp: 'دیروز',
        xpEarned: 40,
      },
    ],
    weakTopics: ['حروف اضافه زمان و مکان', 'تفاوت Remember و Remind'],
    recommendedLessons: [
      {
        id: 'rec_1',
        titleFa: 'استفاده صحیح از حروف اضافه In, On, At',
        titleEn: 'Mastering Prepositions of Time & Place',
        type: 'grammar',
        reasonFa: 'بر اساس پاسخ‌های اخیر در آزمون گرامر',
      },
      {
        id: 'rec_2',
        titleFa: 'تمرین مکالمه: معرفی خود در مدرسه و دانشگاه',
        titleEn: 'Classroom & Self-Introduction Dialogue',
        type: 'conversation',
        reasonFa: 'تطبیق با هدف یادگیری مکالمه روان',
      },
      {
        id: 'rec_3',
        titleFa: 'پکیج ۵ لغت کلیدی برای مکالمات روزمره',
        titleEn: '5 Essential Daily Action Verbs',
        type: 'vocabulary',
        reasonFa: 'تکمیل هدف ۵ لغت جدید امروز',
      },
    ],
  };

  res.json(progress);
});

// Get user achievements
learningRouter.get('/achievements', (req, res) => {
  const user = getAuthUser(req) || db.getUserById('usr_demo_1');
  if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });
  const achs = db.getAchievements(user.id);
  res.json(achs);
});

// Get video lessons
learningRouter.get('/videos', (req, res) => {
  const videos = db.getVideoLessons();
  res.json(videos);
});

// Get notifications
learningRouter.get('/notifications', (req, res) => {
  const user = getAuthUser(req) || db.getUserById('usr_demo_1');
  if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });
  const notifs = db.getNotifications(user.id);
  res.json(notifs);
});

// Mark notification read
learningRouter.post('/notifications/:id/read', (req, res) => {
  const user = getAuthUser(req) || db.getUserById('usr_demo_1');
  if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });
  db.markNotificationRead(user.id, req.params.id);
  res.json({ success: true });
});
