import { Router } from 'express';
import { db } from '../db.js';
import { getAuthUser } from './auth.js';

export const adminRouter = Router();

// Middleware: ensure admin role or allow demo test mode
function checkAdmin(req: any, res: any, next: any) {
  const user = getAuthUser(req) || db.getUserById('usr_admin_1');
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'دسترسی فقط برای مدیران سیستم امکان‌پذیر است.' });
  }
  next();
}

// Stats overview
adminRouter.get('/stats', checkAdmin, (req, res) => {
  const usersCount = db.users.size;
  const vocabCount = db.vocabulary.size;
  const quizCount = db.quizzes.size;
  const reports = db.getModerationReports();
  const pendingReports = reports.filter((r) => r.status === 'pending').length;

  res.json({
    usersCount,
    vocabCount,
    quizCount,
    pendingReports,
    totalPosts: db.communityPosts.size,
  });
});

// Get reports
adminRouter.get('/reports', checkAdmin, (req, res) => {
  const reports = db.getModerationReports();
  res.json(reports);
});

// Resolve or dismiss report
adminRouter.post('/reports/:id/action', checkAdmin, (req, res) => {
  const { action, targetId, targetType } = req.body;
  const report = db.moderationReports.get(req.params.id);
  if (!report) return res.status(404).json({ error: 'گزارش یافت نشد' });

  if (action === 'delete_content') {
    if (targetType === 'post' && targetId) {
      db.deletePost(targetId);
    }
    report.status = 'resolved';
  } else if (action === 'dismiss') {
    report.status = 'dismissed';
  }

  db.moderationReports.set(report.id, report);
  res.json({ success: true, report });
});

// Publish AI generated content to live app
adminRouter.post('/publish-content', checkAdmin, (req, res) => {
  try {
    const { contentType, contentData } = req.body;

    if (!contentType || !contentData) {
      return res.status(400).json({ error: 'اطلاعات محتوا ناقص است.' });
    }

    if (contentType === 'vocabulary') {
      const words = Array.isArray(contentData) ? contentData : [contentData];
      const added = db.addVocabularyBatch(words);
      return res.json({ success: true, message: `${added.length} لغت جدید به پایگاه دانش افزوده شد.`, added });
    }

    if (contentType === 'quiz') {
      const added = db.addQuiz(contentData);
      return res.json({ success: true, message: 'آزمون جدید با موفقیت منتشر شد.', added });
    }

    if (contentType === 'scenario') {
      const added = db.addScenario(contentData);
      return res.json({ success: true, message: 'سناریوی مکالمه جدید به اپلیکیشن اضافه شد.', added });
    }

    res.status(400).json({ error: 'نوع محتوا نامعتبر است.' });
  } catch (error: any) {
    console.error('Publish content error:', error);
    res.status(500).json({ error: 'خطا در انتشار محتوا' });
  }
});
