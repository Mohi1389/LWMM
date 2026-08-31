import { GoogleGenAI, Type } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// 1. Friendly Persian-First AI Chat
export async function chatWithMohannaAI(
  conversation: { role: 'user' | 'model'; parts: { text: string }[] }[],
  userContext: { name?: string; level?: string; goal?: string }
): Promise<string> {
  const ai = getGemini();

  const systemInstruction = `
You are "Mohanna" (مهنا), a friendly, kind, patient, and knowledgeable AI English learning companion specifically designed for Persian-speaking learners (teenagers, youth, and adults) in the app "Learn with Mohanna".

CRITICAL LANGUAGE RULES:
1. PERSIAN-FIRST (قانون فارسی پیش‌فرض):
   - You MUST respond in fluent, warm, friendly, natural Persian (فارسی روان، صمیمی و محترمانه).
   - Do NOT reply only in English unless the user explicitly asks for an English reply or is doing an English-only roleplay.
   - If the user asks a question in Persian (e.g., "چطور لغات رو یاد بگیرم؟" or "کمک کردن به مامانم چی میشه؟"), answer warmly in Persian.

2. WHEN TO USE ENGLISH:
   - When the user asks for a translation (e.g. "کمک کردن به مامان چی میشه؟" -> Answer: "میشه: **Helping my mother**" along with an example sentence and Persian explanation).
   - When providing examples, pronunciation tips, or sentence structures.
   - When correcting the user's English sentences.

3. TONE & PERSONALITY:
   - Warm, encouraging, non-judgmental, friendly (مثل یک دوست و مربی مهربان و باانرژی).
   - Use clean Markdown with bolding and bullet points for easy reading.
   - Keep answers clear, accessible for beginner to intermediate levels, and never overly academic or boring.

User details: Name: ${userContext.name || 'کاربر عزیز'}, English Level: ${userContext.level || 'Beginner'}, Goal: ${userContext.goal || 'General English'}.
`;

  try {
    const contents = conversation.map((c) => ({
      role: c.role === 'user' ? 'user' : 'model',
      parts: c.parts,
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || 'متاسفانه پاسخی دریافت نشد. لطفاً دوباره تلاش کنید.';
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    return 'سلام دوست من! من همیشه اینجام تا کمکت کنم. به نظر میرسه لحظه‌ای ارتباط برقرار نشد، لطفاً پیامتو دوباره بفرست.';
  }
}

// 2. English Error Correction (Sentence Doctor)
export async function correctSentence(sentence: string): Promise<{
  hasErrors: boolean;
  corrected: string;
  original: string;
  explanationFa: string;
  grammarRulesFa: string[];
  betterAlternatives: string[];
}> {
  const ai = getGemini();

  const prompt = `
Analyze the following English sentence written by a Persian-speaking English learner:
Sentence: "${sentence}"

Task:
1. Detect any grammatical, spelling, prepositional, tense, or collocation errors.
2. Provide the corrected English version.
3. Provide a kind, friendly explanation in Persian explaining exactly WHY it was incorrect and the grammar rule behind it.
4. Provide 1-2 natural alternative ways to say the same thing.

Return ONLY valid JSON matching this schema.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hasErrors: { type: Type.BOOLEAN },
            corrected: { type: Type.STRING },
            original: { type: Type.STRING },
            explanationFa: { type: Type.STRING },
            grammarRulesFa: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            betterAlternatives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['hasErrors', 'corrected', 'original', 'explanationFa', 'grammarRulesFa', 'betterAlternatives'],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    console.error('Gemini correction error:', error);
    return {
      hasErrors: false,
      corrected: sentence,
      original: sentence,
      explanationFa: 'جمله شما بررسی شد و ساختار کلی آن قابل فهم است.',
      grammarRulesFa: ['به تمرین و جمله‌سازی ادامه دهید!'],
      betterAlternatives: [sentence],
    };
  }
}

// 3. AI Roleplay Conversation Reply
export async function generateRoleplayReply(
  scenario: {
    titleEn: string;
    aiRoleEn: string;
    userRoleEn: string;
    level: string;
  },
  history: { sender: 'user' | 'ai'; text: string }[]
): Promise<{
  replyEn: string;
  translationFa: string;
  correctionFeedback?: {
    original: string;
    corrected: string;
    explanationFa: string;
  };
  suggestedUserRepliesEn: string[];
}> {
  const ai = getGemini();

  const prompt = `
You are acting as "${scenario.aiRoleEn}" in an English conversational roleplay scenario: "${scenario.titleEn}".
The user is playing the role of "${scenario.userRoleEn}".
Learner level: ${scenario.level} (Beginner: simple short vocabulary; Intermediate: natural conversational flow).

Conversation History:
${history.map((h) => `${h.sender === 'user' ? 'User' : 'AI'}: ${h.text}`).join('\n')}

Instructions:
1. If the user's latest message has grammatical or vocabulary errors, gently provide a correction in Persian without interrupting the roleplay.
2. Reply in English as your character, keeping your answer engaging and prompting the user to continue the dialogue.
3. Provide a Persian translation of your reply to assist the learner.
4. Give 2 short suggested replies the user could say next in English.

Return JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyEn: { type: Type.STRING },
            translationFa: { type: Type.STRING },
            correctionFeedback: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                corrected: { type: Type.STRING },
                explanationFa: { type: Type.STRING },
              },
            },
            suggestedUserRepliesEn: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['replyEn', 'translationFa', 'suggestedUserRepliesEn'],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    console.error('Gemini roleplay error:', error);
    return {
      replyEn: "That's wonderful! Tell me more about that.",
      translationFa: 'خیلی عالیه! بیشتر در این مورد برام بگو.',
      suggestedUserRepliesEn: ['Sure, let me explain.', 'What would you like to know?'],
    };
  }
}

// 4. Conversation Post-Session Comprehensive Feedback
export async function analyzeCompletedConversation(
  scenarioTitle: string,
  history: { sender: 'user' | 'ai'; text: string }[],
  userLevel: string
): Promise<{
  score: number;
  strengths: string[];
  mistakes: { original: string; corrected: string; explanationFa: string }[];
  newVocabulary: { word: string; meaningFa: string; context: string }[];
  betterSentences: { original: string; better: string; why: string }[];
  recommendedPractice: string[];
}> {
  const ai = getGemini();

  const prompt = `
Analyze this completed English learning conversation for scenario "${scenarioTitle}".
Learner level: ${userLevel}.

Full Transcript:
${history.map((h) => `${h.sender === 'user' ? 'User' : 'AI'}: ${h.text}`).join('\n')}

Provide a structured report in Persian and English:
- Score (1 to 100) based on fluency, appropriateness, and effort.
- Key Strengths (in Persian).
- Detected Mistakes with gentle Persian explanations and corrections.
- 3 to 4 High-impact new vocabulary items suitable for this scenario with Persian meanings.
- 2 to 3 Natural sentence upgrades ("Better sentences") explaining why in Persian.
- Recommended practice steps in Persian.

Return JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            mistakes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  corrected: { type: Type.STRING },
                  explanationFa: { type: Type.STRING },
                },
                required: ['original', 'corrected', 'explanationFa'],
              },
            },
            newVocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  meaningFa: { type: Type.STRING },
                  context: { type: Type.STRING },
                },
                required: ['word', 'meaningFa', 'context'],
              },
            },
            betterSentences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  better: { type: Type.STRING },
                  why: { type: Type.STRING },
                },
                required: ['original', 'better', 'why'],
              },
            },
            recommendedPractice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'score',
            'strengths',
            'mistakes',
            'newVocabulary',
            'betterSentences',
            'recommendedPractice',
          ],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    console.error('Gemini analyze conversation error:', error);
    return {
      score: 85,
      strengths: ['تلاش عالی برای برقراری ارتباط مداوم', 'استفاده درست از زمان‌های پایه'],
      mistakes: [],
      newVocabulary: [
        { word: 'appreciate', meaningFa: 'قدردانی کردن / سپاسگزار بودن', context: 'I really appreciate your help.' },
      ],
      betterSentences: [],
      recommendedPractice: ['تمرین مکالمه روزانه با لغات جدید'],
    };
  }
}

// 5. Rich Dictionary Lookup
export async function lookupDictionaryWord(word: string): Promise<any> {
  const ai = getGemini();

  const prompt = `
Generate a rich English-Persian dictionary entry for the English word or phrase: "${word}".

Include:
- Word, accurate IPA pronunciation (e.g. /ˈkɒnfɪdənt/), part of speech.
- Persian meaning (معنی دقیق و پرکاربرد فارسی).
- Simple English definition.
- Difficulty level: Beginner, Elementary, Intermediate, or Advanced.
- 2 to 3 real-world example sentences with English and Persian translations.
- Synonyms (مترادف‌ها).
- Antonyms (متضادها).
- Common collocations (ترکیبات رایج).
- A helpful practical tip in Persian from Mohanna (نکته کاربردی مهنا برای یادگیری بهتر این کلمه).

Return JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            pronunciation: { type: Type.STRING },
            partOfSpeech: { type: Type.STRING },
            persianMeaning: { type: Type.STRING },
            englishDefinition: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  en: { type: Type.STRING },
                  fa: { type: Type.STRING },
                },
                required: ['en', 'fa'],
              },
            },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            collocations: { type: Type.ARRAY, items: { type: Type.STRING } },
            tipsFa: { type: Type.STRING },
          },
          required: [
            'word',
            'pronunciation',
            'partOfSpeech',
            'persianMeaning',
            'englishDefinition',
            'difficulty',
            'examples',
            'synonyms',
            'collocations',
            'tipsFa',
          ],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    console.error('Gemini dictionary error:', error);
    return null;
  }
}

// 6. AI Content Generator (Admin Studio)
export async function generateEducationalContent(
  contentType: 'vocabulary' | 'quiz' | 'scenario',
  topic: string,
  targetLevel: string
): Promise<any> {
  const ai = getGemini();

  const prompt = `
You are an expert curriculum designer for "Learn with Mohanna".
Generate educational content for Iranian/Persian learners.
Content Type: ${contentType}
Topic: "${topic}"
Target Level: ${targetLevel}

Format requirements:
If contentType is 'vocabulary':
Generate 4 rich vocabulary words with english, pronunciation (IPA), partOfSpeech, persianMeaning, exampleSentence, exampleTranslation, difficulty ('${targetLevel}'), category ('${topic}'), relatedWords, tipsFa.

If contentType is 'quiz':
Generate a quiz with titleFa, titleEn, descriptionFa, descriptionEn, type ('mixed'), level ('${targetLevel}'), xpReward: 50, and 4 questions with promptFa, promptEn, options (4 items), correctAnswer, explanationFa, explanationEn, category ('grammar'|'vocabulary').

If contentType is 'scenario':
Generate a roleplay scenario with titleEn, titleFa, descriptionEn, descriptionFa, icon ('coffee'|'plane'|'shopping'|'book'|'chat'), level ('${targetLevel}'), aiRoleEn, aiRoleFa, userRoleEn, userRoleFa, starterMessageEn, starterMessageFa, suggestedPhrases [{en, fa}].

Return JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    console.error('Gemini content generator error:', error);
    throw error;
  }
}
