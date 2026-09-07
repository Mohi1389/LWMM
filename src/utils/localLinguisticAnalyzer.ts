// Client-side instant grammar & linguistic diagnosis analyzer for Sentence Doctor
export interface DiagnosisResult {
  hasErrors: boolean;
  corrected: string;
  original: string;
  explanationFa: string;
  grammarRulesFa: string[];
  betterAlternatives: string[];
}

export function analyzeSentenceLocally(sentence: string): DiagnosisResult {
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
