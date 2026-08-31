import { Router } from 'express';
import { db } from '../db.js';
import { getAuthUser } from './auth.js';

export const vocabularyRouter = Router();

// Get all vocabulary words
vocabularyRouter.get('/list', (req, res) => {
  const words = db.getAllVocabulary();
  res.json(words);
});

// Get user's saved/bookmarked words
vocabularyRouter.get('/saved', (req, res) => {
  const user = getAuthUser(req) || db.getUserById('usr_demo_1');
  if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });
  const saved = db.getSavedWords(user.id);
  res.json(saved);
});

// Bookmark / Save word
vocabularyRouter.post('/save', (req, res) => {
  const user = getAuthUser(req) || db.getUserById('usr_demo_1');
  if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });
  const { wordId } = req.body;
  if (!wordId) return res.status(400).json({ error: 'شناسه لغت الزامی است' });

  const success = db.saveWord(user.id, wordId);
  res.json({ success, saved: true });
});

// Unsave word
vocabularyRouter.post('/unsave', (req, res) => {
  const user = getAuthUser(req) || db.getUserById('usr_demo_1');
  if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });
  const { wordId } = req.body;
  if (!wordId) return res.status(400).json({ error: 'شناسه لغت الزامی است' });

  db.unsaveWord(user.id, wordId);
  res.json({ success: true, saved: false });
});

// Mark word as learned
vocabularyRouter.post('/learned', (req, res) => {
  const user = getAuthUser(req) || db.getUserById('usr_demo_1');
  if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });
  const { wordId } = req.body;
  if (!wordId) return res.status(400).json({ error: 'شناسه لغت الزامی است' });

  db.markWordLearned(user.id, wordId);
  res.json({ success: true, xpGained: 10 });
});

// Get learned words
vocabularyRouter.get('/learned', (req, res) => {
  const user = getAuthUser(req) || db.getUserById('usr_demo_1');
  if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });
  const words = db.getLearnedWords(user.id);
  res.json(words);
});
