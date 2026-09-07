import { Router } from 'express';
import { db } from '../db.js';
import { getAuthUser } from './auth.js';
import { QuizResult, EnglishLevel } from '../../src/types/index.js';

export const quizRouter = Router();

// List quizzes
quizRouter.get('/list', (req, res) => {
  const quizzes = db.getAllQuizzes();
  res.json(quizzes);
});

// Get quiz details
quizRouter.get('/:id', (req, res) => {
  const quiz = db.getQuizById(req.params.id);
  if (!quiz) {
    return res.status(404).json({ error: 'آزمون یافت نشد' });
  }
  res.json(quiz);
});

// Submit Quiz Result
quizRouter.post('/submit', (req, res) => {
  try {
    const user = getAuthUser(req) || db.getUserById('usr_demo_1');
    if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });

    const { quizId, answers, timeSpentSeconds } = req.body; // answers: { [questionId]: string }
    const quiz = db.getQuizById(quizId);
    if (!quiz) return res.status(404).json({ error: 'آزمون یافت نشد' });

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

    // Calculate Speed Rating
    const timeSpent = typeof timeSpentSeconds === 'number' ? timeSpentSeconds : 60;
    const avgSecondsPerQ = totalQ > 0 ? timeSpent / totalQ : 15;
    let speedRating: 'lightning' | 'fast' | 'moderate' | 'careful' = 'moderate';
    let speedAssessmentFa = 'سرعت مناسب و طبیعی در پاسخ‌دهی';
    if (avgSecondsPerQ < 6) {
      speedRating = 'lightning';
      speedAssessmentFa = 'سرعت فوق‌العاده بالا و تسلط آنی';
    } else if (avgSecondsPerQ < 12) {
      speedRating = 'fast';
      speedAssessmentFa = 'سرعت بسیار خوب و با اعتمادبه‌نفس';
    } else if (avgSecondsPerQ > 25) {
      speedRating = 'careful';
      speedAssessmentFa = 'دقیق، متمرکز و با تامل کافی';
    }

    const strengths: string[] = Array.from(strongCategories).map((c) =>
      c === 'grammar'
        ? 'تسلط مناسب بر ساختارهای گرامری و زمان‌های فعل'
        : c === 'vocabulary'
        ? 'دایره واژگان پرکاربرد و معانی لغات'
        : 'درک مفهوم و کاربرد در مکالمه واقعی'
    );
    if (strengths.length === 0) strengths.push('انگیزه بالا برای شروع و تلاش مستمر');

    const weaknesses: string[] = Array.from(weakCategories).map((c) =>
      c === 'grammar'
        ? 'مرور افعال بی‌قاعده، حروف اضافه و ساختار جملات سوالی'
        : c === 'vocabulary'
        ? 'تمرین بیشتر روی تفاوت لغات مشابه و اصطلاحات روزمره'
        : 'توجه به جزئیات کاربردی در موقعیت‌های طبیعی'
    );
    if (weaknesses.length === 0) {
      weaknesses.push('عملکرد درخشان و بدون اشتباه! آماده ورود به سطح بالاتر هستید.');
    }

    let estimatedLevel: EnglishLevel | undefined = undefined;
    let recommendedPath = 'مرور روزانه ۱۰ لغت و انجام مکالمه تمرینی با دستیار مهنا.';

    // Smart Level Assessment based on percentage, difficulty, and speed
    if (quiz.type === 'placement' || quiz.level) {
      if (percentage >= 80) {
        estimatedLevel = 'pre-intermediate';
        recommendedPath = 'شروع دوره گرامر کاربردی B1، یادگیری اصطلاحات فیلم‌ها و مکالمات طبیعی با مهنا.';
      } else if (percentage >= 45) {
        estimatedLevel = 'elementary';
        recommendedPath = 'تقویت جمله‌سازی ساده A2، یادگیری لغات ضروری روزمره و تمرین سناریوهای رستوران و سفر.';
      } else {
        estimatedLevel = 'beginner';
        recommendedPath = 'شروع قدم‌به‌قدم از گرامر پایه A1، یادگیری واژگان اساسی و مکالمات ساده و شمرده با مهنا.';
      }

      // If this is a placement test, persist updated level
      if (quiz.type === 'placement') {
        db.updateUser(user.id, { englishLevel: estimatedLevel });
      }
    }

    const result: QuizResult = {
      id: `qres_${Date.now()}`,
      userId: user.id,
      quizId: quiz.id,
      quizTitle: quiz.titleFa,
      score,
      totalQuestions: totalQ,
      percentage,
      timeSpentSeconds: timeSpent,
      averageSecondsPerQuestion: Math.round(avgSecondsPerQ * 10) / 10,
      speedRating,
      speedAssessmentFa,
      answers: evaluatedAnswers,
      strengths,
      weaknesses,
      recommendedPath,
      estimatedLevel,
      completedAt: new Date().toISOString(),
    };

    db.saveQuizResult(result);

    res.json({
      result,
      xpGained: Math.round(score * 10 + (speedRating === 'fast' ? 15 : 5)),
      updatedLevel: estimatedLevel,
    });
  } catch (error: any) {
    console.error('Quiz submit error:', error);
    res.status(500).json({ error: 'خطا در ثبت نتیجه آزمون' });
  }
});

// Quiz history
quizRouter.get('/user/history', (req, res) => {
  const user = getAuthUser(req) || db.getUserById('usr_demo_1');
  if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });
  const history = db.getUserQuizHistory(user.id);
  res.json(history);
});
