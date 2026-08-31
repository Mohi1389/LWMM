import { Router } from 'express';
import { db } from '../db.js';
import { getAuthUser } from './auth.js';

export const communityRouter = Router();

// Get rooms
communityRouter.get('/rooms', (req, res) => {
  const rooms = db.getCommunityRooms();
  res.json(rooms);
});

// Get posts in a room or all
communityRouter.get('/posts', (req, res) => {
  const roomId = req.query.roomId as string;
  const posts = db.getPosts(roomId);
  res.json(posts);
});

// Create Post (with student safety filtering)
communityRouter.post('/posts', (req, res) => {
  try {
    const user = getAuthUser(req) || db.getUserById('usr_demo_1');
    if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });

    const { roomId, title, content, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'عنوان و متن پست الزامی است.' });
    }

    // Safety checks: ban phone numbers or inappropriate words
    const phoneRegex = /(0|\+98)?9\d{9}/g;
    if (phoneRegex.test(content) || phoneRegex.test(title)) {
      return res.status(400).json({
        error: 'برای حفظ امنیت زبان‌آموزان و نوجوانان، ارسال شماره تماس و اطلاعات هویتی مجاز نیست.',
      });
    }

    const newPost = db.createPost({
      roomId: roomId || 'room_lounge',
      authorId: user.id,
      authorName: user.fullName,
      authorLevel: user.englishLevel,
      title,
      content,
      tags: tags || ['EnglishPractice'],
    });

    res.status(201).json(newPost);
  } catch (error: any) {
    console.error('Community post error:', error);
    res.status(500).json({ error: 'خطا در انتشار پست' });
  }
});

// Add comment
communityRouter.post('/posts/:id/comments', (req, res) => {
  try {
    const user = getAuthUser(req) || db.getUserById('usr_demo_1');
    if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });

    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'متن نظر نمی‌تواند خالی باشد.' });
    }

    const comment = db.addComment(req.params.id, {
      authorId: user.id,
      authorName: user.fullName,
      authorLevel: user.englishLevel,
      content,
    });

    if (!comment) {
      return res.status(404).json({ error: 'پست یافت نشد' });
    }

    res.status(201).json(comment);
  } catch (error: any) {
    console.error('Community comment error:', error);
    res.status(500).json({ error: 'خطا در ثبت دیدگاه' });
  }
});

// Report inappropriate content
communityRouter.post('/report', (req, res) => {
  try {
    const user = getAuthUser(req) || db.getUserById('usr_demo_1');
    if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });

    const { targetType, targetId, targetContent, reason } = req.body;
    if (!targetId || !reason) {
      return res.status(400).json({ error: 'اطلاعات گزارش ناقص است.' });
    }

    const report = db.reportContent({
      targetType: targetType || 'post',
      targetId,
      targetContent: targetContent || 'محتوای گزارش‌شده',
      reporterId: user.id,
      reporterName: user.fullName,
      reason,
    });

    res.json({ success: true, message: 'گزارش شما ثبت شد و توسط تیم نظارت بررسی خواهد شد.', report });
  } catch (error: any) {
    console.error('Report error:', error);
    res.status(500).json({ error: 'خطا در ثبت گزارش' });
  }
});
