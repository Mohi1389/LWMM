import { Router } from 'express';
import {
  chatWithMohannaAI,
  correctSentence,
  generateRoleplayReply,
  analyzeCompletedConversation,
  generateEducationalContent,
} from '../gemini.js';
import { db } from '../db.js';
import { getAuthUser } from './auth.js';

export const aiRouter = Router();

// 1. Persian-First AI Companion Chat
aiRouter.post('/chat', async (req, res) => {
  try {
    const user = getAuthUser(req) || db.getUserById('usr_demo_1');
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'پیامی ارسال نشده است.' });
    }

    const reply = await chatWithMohannaAI(messages, {
      name: user?.fullName,
      level: user?.englishLevel,
      goal: user?.learningGoal,
    });

    // Reward XP for interacting with AI
    if (user) {
      db.addXpAndStreak(user.id, 5);
    }

    res.json({ reply });
  } catch (error: any) {
    console.error('AI chat endpoint error:', error);
    res.status(500).json({ error: 'خطا در ارتباط با هوش مصنوعی' });
  }
});

// 2. Sentence Doctor / English Error Correction
aiRouter.post('/correct-sentence', async (req, res) => {
  try {
    const { sentence } = req.body;
    if (!sentence || typeof sentence !== 'string' || sentence.trim().length === 0) {
      return res.status(400).json({ error: 'لطفاً جمله انگلیسی را وارد کنید.' });
    }

    const result = await correctSentence(sentence);

    const user = getAuthUser(req) || db.getUserById('usr_demo_1');
    if (user) {
      db.addXpAndStreak(user.id, 8);
    }

    res.json(result);
  } catch (error: any) {
    console.error('AI sentence correction error:', error);
    res.status(500).json({ error: 'خطا در تحلیل جمله' });
  }
});

// 3. Get all roleplay scenarios
aiRouter.get('/scenarios', (req, res) => {
  const scenarios = db.getScenarios();
  res.json(scenarios);
});

// 4. Roleplay Conversation Next Turn
aiRouter.post('/conversation/reply', async (req, res) => {
  try {
    const { scenarioId, history } = req.body;
    const scenario = db.scenarios.get(scenarioId);

    if (!scenario) {
      return res.status(404).json({ error: 'سناریوی مورد نظر یافت نشد.' });
    }

    const result = await generateRoleplayReply(
      {
        titleEn: scenario.titleEn,
        aiRoleEn: scenario.aiRoleEn,
        userRoleEn: scenario.userRoleEn,
        level: scenario.level,
      },
      history || []
    );

    res.json(result);
  } catch (error: any) {
    console.error('AI conversation turn error:', error);
    res.status(500).json({ error: 'خطا در مکالمه هوش مصنوعی' });
  }
});

// 5. Final Conversation Feedback & Report
aiRouter.post('/conversation/analyze', async (req, res) => {
  try {
    const user = getAuthUser(req) || db.getUserById('usr_demo_1');
    const { scenarioTitle, history } = req.body;

    const report = await analyzeCompletedConversation(
      scenarioTitle || 'Daily Practice',
      history || [],
      user?.englishLevel || 'beginner'
    );

    if (user) {
      db.addXpAndStreak(user.id, 30);
    }

    res.json(report);
  } catch (error: any) {
    console.error('AI analyze conversation error:', error);
    res.status(500).json({ error: 'خطا در صدور کارنامه مکالمه' });
  }
});

// 6. AI Content Generator Studio (for Admin / Future Content Expansion)
aiRouter.post('/generate-content', async (req, res) => {
  try {
    const { contentType, topic, targetLevel } = req.body;

    if (!contentType || !topic) {
      return res.status(400).json({ error: 'نوع محتوا و موضوع الزامی است.' });
    }

    const generated = await generateEducationalContent(
      contentType,
      topic,
      targetLevel || 'beginner'
    );

    res.json({ success: true, data: generated });
  } catch (error: any) {
    console.error('AI content generation error:', error);
    res.status(500).json({ error: 'خطا در تولید محتوای هوش مصنوعی' });
  }
});
