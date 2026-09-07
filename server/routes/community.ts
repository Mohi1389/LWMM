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

// Like post
communityRouter.post('/posts/:id/like', (req, res) => {
  const likes = db.likePost(req.params.id);
  res.json({ success: true, likes });
});

// Report post
communityRouter.post('/posts/:id/report', (req, res) => {
  const user = getAuthUser(req) || db.getUserById('usr_demo_1');
  const report = db.reportContent({
    targetType: 'post',
    targetId: req.params.id,
    targetContent: req.body.reason || 'محتوای نامناسب',
    reporterId: user ? user.id : 'anonymous',
    reporterName: user ? user.fullName : 'کاربر مهنا',
    reason: req.body.reason || 'محتوای نامناسب',
  });
  res.json({ success: true, report });
});

// Get expressions
communityRouter.get('/expressions', (req, res) => {
  const category = req.query.category as string;
  const list = db.getCommunityExpressions(category);
  res.json(list);
});

// Create expression
communityRouter.post('/expressions', (req, res) => {
  try {
    const user = getAuthUser(req) || db.getUserById('usr_demo_1');
    if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });

    const { english, persian, pronunciation, exampleEn, exampleFa, usageNoteFa, category, difficulty } = req.body;
    if (!english || !persian || !exampleEn || !exampleFa) {
      return res.status(400).json({ error: 'اطلاعات اصطلاح یا واژه ناقص است.' });
    }

    const newExp = db.addCommunityExpression({
      english,
      persian,
      pronunciation,
      exampleEn,
      exampleFa,
      usageNoteFa,
      category: category || 'idiom',
      difficulty: difficulty || 'beginner',
      submittedBy: user.fullName,
    });

    db.addXpAndStreak(user.id, 20);
    res.status(201).json(newExp);
  } catch (error: any) {
    res.status(500).json({ error: 'خطا در ثبت اصطلاح' });
  }
});

// Like expression
communityRouter.post('/expressions/:id/like', (req, res) => {
  const likes = db.likeCommunityExpression(req.params.id);
  res.json({ success: true, likes });
});

// Get grammar tips
communityRouter.get('/grammar-tips', (req, res) => {
  const category = req.query.category as string;
  const list = db.getGrammarHelpTips(category);
  res.json(list);
});

// Create grammar tip
communityRouter.post('/grammar-tips', (req, res) => {
  try {
    const user = getAuthUser(req) || db.getUserById('usr_demo_1');
    if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });

    const { titleFa, titleEn, incorrectExample, correctExample, commonMistake, correctForm, explanationFa, goldenRuleFa, persianContext, difficulty, category } = req.body;
    const incorrect = incorrectExample || commonMistake;
    const correct = correctExample || correctForm;

    if (!titleFa || !incorrect || !correct || !explanationFa) {
      return res.status(400).json({ error: 'اطلاعات نکته گرامری ناقص است.' });
    }

    const newTip = db.addGrammarHelpTip({
      titleFa,
      titleEn: titleEn || '',
      incorrectExample: incorrect,
      correctExample: correct,
      explanationFa,
      goldenRuleFa: goldenRuleFa || '',
      persianContext: persianContext || '',
      difficulty: difficulty || 'beginner',
      category: category || 'sentence_structure',
    });

    db.addXpAndStreak(user.id, 20);
    res.status(201).json(newTip);
  } catch (error: any) {
    res.status(500).json({ error: 'خطا در ثبت نکته گرامری' });
  }
});

// Like grammar tip
communityRouter.post('/grammar-tips/:id/like', (req, res) => {
  const likes = db.likeGrammarHelpTip(req.params.id);
  res.json({ success: true, likes });
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
