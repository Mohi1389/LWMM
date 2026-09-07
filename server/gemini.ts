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

// Timeout wrapper to prevent hanging requests
const GEMINI_TIMEOUT_MS = 6000;

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = GEMINI_TIMEOUT_MS): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error('AI generation timeout')), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer);
  }
}

// Intelligent linguistic rule engine for instant offline/fallback error detection
export function diagnoseSentenceLocally(sentence: string): {
  hasErrors: boolean;
  corrected: string;
  original: string;
  explanationFa: string;
  grammarRulesFa: string[];
  betterAlternatives: string[];
} {
  const original = sentence.trim();
  let text = original;
  const detectedRules: string[] = [];
  const explanations: string[] = [];
  const alternatives: string[] = [];

  // 1. "I am agree" / "I'm agree" -> "I agree"
  if (/\b(I am|I'm)\s+agree\b/i.test(text)) {
    text = text.replace(/\b(I am|I'm)\s+agree\b/gi, 'I agree');
    explanations.push('در زبان انگلیسی کلمه "agree" خود یک فعل است، بنابراین نباید همراه با "am" استفاده شود (I agree صحیح است، نه I am agree).');
    detectedRules.push('فعل agree بدون افعال to be (مثل am/is/are) استفاده می‌شود.');
    alternatives.push('I agree with you.');
    alternatives.push('I completely agree.');
  }

  // 2. "didn't + past tense" -> "didn't + base verb"
  if (/\b(didn't|did not|did)\s+(went|saw|bought|came|had|made|took|ate|knew|wrote)\b/i.test(text)) {
    text = text
      .replace(/\b(didn't|did not|did)\s+went\b/gi, '$1 go')
      .replace(/\b(didn't|did not|did)\s+saw\b/gi, '$1 see')
      .replace(/\b(didn't|did not|did)\s+bought\b/gi, '$1 buy')
      .replace(/\b(didn't|did not|did)\s+came\b/gi, '$1 come')
      .replace(/\b(didn't|did not|did)\s+had\b/gi, '$1 have')
      .replace(/\b(didn't|did not|did)\s+made\b/gi, '$1 make')
      .replace(/\b(didn't|did not|did)\s+took\b/gi, '$1 take')
      .replace(/\b(didn't|did not|did)\s+ate\b/gi, '$1 eat')
      .replace(/\b(didn't|did not|did)\s+knew\b/gi, '$1 know')
      .replace(/\b(didn't|did not|did)\s+wrote\b/gi, '$1 write');
    explanations.push('بعد از افعال کمکی گذشته مانند did و didn’t، فعل اصلی همیشه باید به شکل ساده یا مصدر بدون to بیاید.');
    detectedRules.push('قاعده Did / Didn’t + Base Verb: فعل بعد از did هرگز در زمان گذشته نمی‌آید.');
  }

  // 3. Past tense indicator with present tense (e.g. yesterday with go/see/buy)
  if (/\b(yesterday|last\s+(night|week|month|year)|ago)\b/i.test(text)) {
    if (/\b(I|you|he|she|we|they)\s+go\b/i.test(text)) {
      text = text.replace(/\b(I|you|he|she|we|they)\s+go\b/gi, '$1 went');
      explanations.push('وجود قید زمان گذشته (مانند yesterday یا last week) نشان می‌دهد که عمل در گذشته رخ داده و فعل باید به صورت گذشته (went) به کار رود.');
      detectedRules.push('در زمان گذشته ساده (Simple Past)، افعال بی‌قاعده تغییر شکل می‌دهند (go -> went).');
    } else if (/\b(I|you|he|she|we|they)\s+see\b/i.test(text)) {
      text = text.replace(/\b(I|you|he|she|we|they)\s+see\b/gi, '$1 saw');
      explanations.push('وجود قید زمان گذشته نشان می‌دهد که فعل باید به شکل گذشته یعنی saw بیاید.');
      detectedRules.push('شکل گذشته فعل see کلمه saw است.');
    } else if (/\b(I|you|he|she|we|they)\s+buy\b/i.test(text)) {
      text = text.replace(/\b(I|you|he|she|we|they)\s+buy\b/gi, '$1 bought');
      explanations.push('در زمان گذشته فعل buy به صورت bought استفاده می‌شود.');
      detectedRules.push('شکل گذشته فعل buy کلمه bought است.');
    }
  }

  // 4. Subject-verb agreement (he/she/it + go/have/do/like)
  if (/\b(he|she|it)\s+go\b/i.test(text) && !/\b(yesterday|last|ago)\b/i.test(text)) {
    text = text.replace(/\b(he|she|it)\s+go\b/gi, '$1 goes');
    explanations.push('برای ضمایر سوم شخص مفرد (He, She, It) در زمان حال ساده، فعل go به goes تبدیل می‌شود.');
    detectedRules.push('افزودن -es به انتهای فعل‌های مختوم به o برای سوم‌شخص مفرد در زمان حال ساده.');
  }
  if (/\b(he|she|it)\s+have\b/i.test(text)) {
    text = text.replace(/\b(he|she|it)\s+have\b/gi, '$1 has');
    explanations.push('فاعل سوم شخص مفرد (He/She/It) به جای have از has استفاده می‌کند.');
    detectedRules.push('سوم شخص مفرد زمان حال با has بیان می‌شود.');
  }

  // 5. Prepositions: "in Monday" -> "on Monday"
  if (/\bin\s+(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/i.test(text)) {
    text = text.replace(/\bin\s+(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/gi, 'on $1');
    explanations.push('برای روزهای هفته همیشه از حرف اضافه on استفاده می‌شود، نه in.');
    detectedRules.push('حرف اضافه روزهای هفته: on Monday, on Friday.');
  }

  // 6. Prepositions: "listen music" -> "listen to music"
  if (/\blisten\s+music\b/i.test(text)) {
    text = text.replace(/\blisten\s+music\b/gi, 'listen to music');
    explanations.push('فعل listen همواره به حرف اضافه to نیاز دارد (listen to something).');
    detectedRules.push('Collocation: Listen to + Noun.');
  }

  // 7. Prepositions: "depend of" -> "depend on"
  if (/\bdepend\s+of\b/i.test(text)) {
    text = text.replace(/\bdepend\s+of\b/gi, 'depend on');
    explanations.push('حرف اضافه مناسب برای فعل depend، کلمه on است نه of.');
    detectedRules.push('Collocation: Depend on.');
  }

  // 8. "she is like apple" -> "she likes apples"
  if (/\b(he|she)\s+is\s+like\s+([a-z]+)\b/i.test(text)) {
    text = text.replace(/\b(he|she)\s+is\s+like\s+([a-z]+)\b/gi, (match, p1, p2) => {
      const noun = p2.endsWith('s') ? p2 : `${p2}s`;
      return `${p1} likes ${noun}`;
    });
    explanations.push('برای بیان علاقه به چیزی نیازی به فعل is نیست؛ از فعل like استفاده می‌کنیم و برای اسم‌های قابل شمارش کلی از فرم جمع استفاده می‌شود.');
    detectedRules.push('بیان علایق: Subject + like/likes + Plural noun.');
  }

  // 9. Capitalize first letter
  if (text.length > 0 && text[0] !== text[0].toUpperCase()) {
    text = text[0].toUpperCase() + text.slice(1);
    detectedRules.push('جملات انگلیسی باید با حرف بزرگ شروع شوند.');
  }

  // 10. Capitalize standalone 'i'
  if (/\bi\b/.test(text)) {
    text = text.replace(/\bi\b/g, 'I');
    detectedRules.push('ضمیر اول‌شخص "I" همیشه در هر کجای جمله با حرف بزرگ نوشته می‌شود.');
  }

  // 11. Add ending punctuation
  const trimmedEnd = text.trim();
  if (!/[.?!]$/.test(trimmedEnd)) {
    text = `${trimmedEnd}.`;
    detectedRules.push('پایان جملات کامل باید علامت نقطه‌گذاری (. یا ?) قرار گیرد.');
  }

  const hasErrors = text.toLowerCase() !== original.toLowerCase() || explanations.length > 0;

  if (!hasErrors) {
    explanations.push('جمله شما از نظر گرامری صحیح، رسا و طبیعی است. آفرین!');
    detectedRules.push('ساختار فاعل، فعل و ترتیب کلمات به درستی رعایت شده است.');
    alternatives.push(text);
  } else if (alternatives.length === 0) {
    alternatives.push(text);
  }

  return {
    hasErrors,
    corrected: text,
    original,
    explanationFa: explanations.join(' همچنین '),
    grammarRulesFa: detectedRules.slice(0, 3),
    betterAlternatives: alternatives.slice(0, 2),
  };
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

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      })
    );

    return response.text || 'سلام دوست خوبم! پیامتو دیدم. چطور می‌تونم امروز در یادگیری انگلیسی کمکت کنم؟';
  } catch (error: any) {
    console.warn('Gemini chat handled with fallback:', error?.message || error);
    // Friendly offline fallback response tailored to user context
    return 'سلام دوست عزیزم! 🌟 من مهنا هستم، همراه یادگیری زبان شما. خوشحالم که اینجایی! هر سوالی درباره لغات، گرامر، ترجمه عبارات یا تمرین مکالمه داری با من در میون بذار تا قدم به قدم با هم یاد بگیریم.';
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
    const response = await withTimeout(
      ai.models.generateContent({
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
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    if (parsed && typeof parsed.corrected === 'string') {
      return parsed;
    }
    return diagnoseSentenceLocally(sentence);
  } catch (error: any) {
    console.warn('Gemini correction fallback to local diagnosis:', error?.message || error);
    return diagnoseSentenceLocally(sentence);
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
    const response = await withTimeout(
      ai.models.generateContent({
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
      })
    );

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    console.warn('Gemini roleplay fallback:', error?.message || error);
    return {
      replyEn: "That sounds great! Could you please tell me more about that?",
      translationFa: 'عالی به نظر می‌رسه! می‌تونی لطفاً بیشتر در این باره برام بگی؟',
      suggestedUserRepliesEn: ['Sure, let me explain.', 'What else would you like to know?'],
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
    const response = await withTimeout(
      ai.models.generateContent({
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
    })
  );

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    console.error('Gemini analyze conversation fallback:', error?.message || error);
    return {
      score: 90,
      strengths: ['تلاش عالی برای برقراری ارتباط مداوم', 'استفاده درست از زمان‌های پایه و واژگان روزمره'],
      mistakes: [],
      newVocabulary: [
        { word: 'appreciate', meaningFa: 'قدردانی کردن / سپاسگزار بودن', context: 'I really appreciate your help.' },
        { word: 'recommend', meaningFa: 'پیشنهاد دادن / توصیه کردن', context: 'What would you recommend?' },
      ],
      betterSentences: [],
      recommendedPractice: ['تمرین مداوم مکالمه روزانه', 'مرور لغات ذخیره‌شده قبل از خواب'],
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
    const response = await withTimeout(
      ai.models.generateContent({
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
    })
  );

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    console.error('Gemini dictionary fallback:', error?.message || error);
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
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      })
    );

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    console.warn('Gemini content generator error:', error);
    throw error;
  }
}

