import { Router } from 'express';
import { lookupDictionaryWord } from '../gemini.js';
import { db } from '../db.js';

export const dictionaryRouter = Router();

dictionaryRouter.get('/lookup', async (req, res) => {
  try {
    const wordQuery = (req.query.word as string)?.trim();
    if (!wordQuery) {
      return res.status(400).json({ error: 'لطفاً کلمه مورد نظر را وارد کنید.' });
    }

    // 1. Check if word exists in vocabulary database
    const localMatch = Array.from(db.vocabulary.values()).find(
      (v) => v.english.toLowerCase() === wordQuery.toLowerCase()
    );

    if (localMatch) {
      const entry = {
        word: localMatch.english,
        pronunciation: localMatch.pronunciation,
        partOfSpeech: localMatch.partOfSpeech,
        persianMeaning: localMatch.persianMeaning,
        englishDefinition: `Essential ${localMatch.difficulty} word: ${localMatch.english}`,
        difficulty: localMatch.difficulty.charAt(0).toUpperCase() + localMatch.difficulty.slice(1),
        examples: [
          {
            en: localMatch.exampleSentence,
            fa: localMatch.exampleTranslation,
          },
        ],
        synonyms: localMatch.relatedWords,
        antonyms: [],
        collocations: [`learn ${localMatch.english.toLowerCase()}`, `practice ${localMatch.english.toLowerCase()}`],
        tipsFa: localMatch.tipsFa || 'این لغت را در جملات روزمره به کار ببرید.',
      };
      return res.json({ source: 'database', entry });
    }

    // 2. Perform intelligent AI lookup with Gemini
    const aiEntry = await lookupDictionaryWord(wordQuery);
    if (aiEntry) {
      return res.json({ source: 'ai_enriched', entry: aiEntry });
    }

    res.status(404).json({ error: 'کلمه مورد نظر در دیکشنری یافت نشد.' });
  } catch (error: any) {
    console.error('Dictionary route error:', error);
    res.status(500).json({ error: 'خطا در جستجوی دیکشنری' });
  }
});
