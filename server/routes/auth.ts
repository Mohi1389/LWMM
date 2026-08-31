import { Router } from 'express';
import { db } from '../db.js';

export const authRouter = Router();

// Helper to extract session user
export function getAuthUser(req: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  const userId = db.sessions.get(token);
  if (!userId) return null;
  return db.getUserById(userId);
}

// Register
authRouter.post('/register', (req, res) => {
  try {
    const { fullName, email, password, ageRange, englishLevel, learningGoal } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'لطفاً نام، ایمیل و رمز عبور را وارد کنید.' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'حسابی با این آدرس ایمیل قبلاً ثبت شده است.' });
    }

    const user = db.createUser({
      fullName,
      email,
      password,
      ageRange: ageRange || '18-24',
      englishLevel: englishLevel || 'beginner',
      learningGoal: learningGoal || 'general',
      role: 'user',
    });

    const token = `token_${user.id}_${Date.now()}`;
    db.sessions.set(token, user.id);

    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطا در ثبت نام' });
  }
});

// Login
authRouter.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'ایمیل و رمز عبور الزامی است.' });
    }

    const userWithPass = db.getUserByEmail(email);
    if (!userWithPass || userWithPass.passwordHash !== password) {
      return res.status(401).json({ error: 'ایمیل یا رمز عبور اشتباه است.' });
    }

    const { passwordHash, ...safeUser } = userWithPass;
    const token = `token_${safeUser.id}_${Date.now()}`;
    db.sessions.set(token, safeUser.id);

    res.json({ user: safeUser, token });
  } catch (err: any) {
    res.status(500).json({ error: 'خطا در ورود به حساب' });
  }
});

// Current user
authRouter.get('/me', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    // Return demo user if token is missing/guest
    const demo = db.getUserById('usr_demo_1');
    return res.json({ user: demo, token: 'token_demo_user' });
  }
  res.json({ user });
});

// Update Profile
authRouter.post('/update-profile', (req, res) => {
  const user = getAuthUser(req) || db.getUserById('usr_demo_1');
  if (!user) return res.status(401).json({ error: 'کاربر یافت نشد' });

  const { fullName, ageRange, englishLevel, learningGoal } = req.body;
  const updated = db.updateUser(user.id, {
    fullName: fullName || user.fullName,
    ageRange: ageRange || user.ageRange,
    englishLevel: englishLevel || user.englishLevel,
    learningGoal: learningGoal || user.learningGoal,
  });

  res.json({ user: updated });
});

// Forgot Password
authRouter.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'لطفاً ایمیل خود را وارد کنید.' });

  const user = db.getUserByEmail(email);
  if (!user) {
    // For privacy, still return success message
    return res.json({ message: 'اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی ارسال شد.' });
  }

  res.json({ message: 'لینک بازیابی رمز عبور به ایمیل شما ارسال شد (کد موقت: 123456).' });
});
