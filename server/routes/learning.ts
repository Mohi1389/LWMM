import { Router } from 'express';
import { db } from '../db.js';
import { getAuthUser } from './auth.js';
import { LearningProgress } from '../../src/types/index.js';

export const learningRouter = Router();

// Get personalized learning progress and dashboard data
learningRouter.get('/progress', (req, res) => {
  const user = getAuthUser(req);
  const today = new Date().toISOString().split('T')[0];

  if (!user) {
    const guestProgress: LearningProgress = {
      userId: 'guest',
      level: 'beginner',
      totalXp: 0,
      streakDays: 0,
      learnedWordIds: [],
      completedQuizIds: [],
      completedLessonIds: [],
      todayGoal: {
        date: today,
        wordsLearned: 0,
        targetWords: 5,
        aiPracticeDone: false,
        quizCompleted: false,
        completed: false,
      },
      recentActivity: [],
      weakTopics: [],
      recommendedLessons: [
        {
          id: 'rec_1',
          titleFa: 'یادگیری حروف اضافه زمان و مکان',
          titleEn: 'Mastering Prepositions of Time & Place',
          type: 'grammar',
          reasonFa: 'شروع یادگیری با اصول اولیه گرامر',
        },
        {
          id: 'rec_2',
          titleFa: 'مکالمه کلاسی و معرفی خود',
          titleEn: 'Classroom & Self-Introduction Dialogue',
          type: 'conversation',
          reasonFa: 'تطبیق با هدف تقویت مهارت مکالمه',
        },
      ],
    };
    return res.json(guestProgress);
  }

  const learnedWords = db.getLearnedWords(user.id);
  const quizResults = db.getUserQuizHistory(user.id);

  const wordsLearnedToday = Math.min(5, learnedWords.length);
  const aiPracticeDone = false;
  const quizCompleted = quizResults.length > 0;

  const recentActivity: any[] = [];
  if (learnedWords.length > 0) {
    const lastWord = learnedWords[learnedWords.length - 1];
    recentActivity.push({
      id: `act_w_${lastWord.id}`,
      type: 'word',
      title: `یادگیری کلمه "${lastWord.english}"`,
      timestamp: 'امروز',
      xpEarned: 10,
    });
  }

  if (quizResults.length > 0) {
    const lastQuiz = quizResults[0];
    recentActivity.push({
      id: `act_q_${lastQuiz.id}`,
      type: 'quiz',
      title: `آزمون تعیین سطح / تست زبان`,
      timestamp: 'اخیراً',
      xpEarned: Math.round(lastQuiz.score * 10),
    });
  }

  const progress: LearningProgress = {
    userId: user.id,
    level: user.englishLevel,
    totalXp: user.xp,
    streakDays: user.streak,
    learnedWordIds: learnedWords.map((w) => w.id),
    completedQuizIds: quizResults.map((q) => q.quizId),
    completedLessonIds: [],
    todayGoal: {
      date: today,
      wordsLearned: wordsLearnedToday,
      targetWords: 5,
      aiPracticeDone,
      quizCompleted,
      completed: wordsLearnedToday >= 5 && aiPracticeDone && quizCompleted,
    },
    recentActivity,
    weakTopics: [],
    recommendedLessons: [
      {
        id: 'rec_1',
        titleFa: 'استفاده صحیح از حروف اضافه In, On, At',
        titleEn: 'Mastering Prepositions of Time & Place',
        type: 'grammar',
        reasonFa: 'شروع یادگیری با اصول اولیه گرامر',
      },
      {
        id: 'rec_2',
        titleFa: 'تمرین مکالمه: معرفی خود در مدرسه و دانشگاه',
        titleEn: 'Classroom & Self-Introduction Dialogue',
        type: 'conversation',
        reasonFa: 'تطبیق با هدف تقویت مهارت مکالمه',
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
