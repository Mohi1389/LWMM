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

    const { quizId, answers } = req.body; // answers: { [questionId]: string }
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

    const percentage = Math.round((score / quiz.questions.length) * 100);

    const strengths: string[] = Array.from(strongCategories).map((c) =>
      c === 'grammar' ? 'تسلط مناسب بر ساختارهای گرامری پایه' : 'دایره واژگان و درک معانی'
    );
    if (strengths.length === 0) strengths.push('انگیزه بالا برای شروع و یادگیری');

    const weaknesses: string[] = Array.from(weakCategories).map((c) =>
      c === 'grammar' ? 'مرور افعال بی‌قاعده و حروف اضافه' : 'تمرین بیشتر لغات متضاد و مترادف'
    );
    if (weaknesses.length === 0) weaknesses.push('عملکرد بدون نقص! می‌توانید به سطح بعدی بروید.');

    let estimatedLevel: EnglishLevel | undefined = undefined;
    let recommendedPath = 'مرور لغات روزمره و انجام تمرین مکالمه با هوش مصنوعی';

    if (quiz.type === 'placement') {
      if (percentage >= 80) {
        estimatedLevel = 'pre-intermediate';
        recommendedPath = 'شروع دوره گرامر کاربردی، اصطلاحات فیلم‌ها و مکالمات طبیعی‌تر.';
      } else if (percentage >= 45) {
        estimatedLevel = 'elementary';
        recommendedPath = 'تقویت جمله‌سازی ساده، یادگیری ۲۰۰ لغت ضروری و تمرین روزانه مکالمه.';
      } else {
        estimatedLevel = 'beginner';
        recommendedPath = 'شروع قدم‌به‌قدم از الفبای گرامر، لغات پایه و مکالمات ساده با مهنا.';
      }

      // Update user level automatically
      db.updateUser(user.id, { englishLevel: estimatedLevel });
    }

    const result: QuizResult = {
      id: `qres_${Date.now()}`,
      userId: user.id,
      quizId: quiz.id,
      quizTitle: quiz.titleFa,
      score,
      totalQuestions: quiz.questions.length,
      percentage,
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
      xpGained: Math.round(score * 10),
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
