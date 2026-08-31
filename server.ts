import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { authRouter } from './server/routes/auth.js';
import { aiRouter } from './server/routes/ai.js';
import { vocabularyRouter } from './server/routes/vocabulary.js';
import { dictionaryRouter } from './server/routes/dictionary.js';
import { quizRouter } from './server/routes/quiz.js';
import { communityRouter } from './server/routes/community.js';
import { learningRouter } from './server/routes/learning.js';
import { adminRouter } from './server/routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body parsing
  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', name: 'Learn with Mohanna API', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/vocabulary', vocabularyRouter);
  app.use('/api/dictionary', dictionaryRouter);
  app.use('/api/quiz', quizRouter);
  app.use('/api/community', communityRouter);
  app.use('/api/learning', learningRouter);
  app.use('/api/admin', adminRouter);

  // Vite Middleware for SPA development / production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Learn with Mohanna Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
