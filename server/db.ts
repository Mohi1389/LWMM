import {
  User,
  VocabularyWord,
  Quiz,
  QuizResult,
  LearningProgress,
  CommunityRoom,
  CommunityPost,
  CommunityComment,
  ModerationReport,
  VideoContent,
  Achievement,
  AppNotification,
  AIConversationScenario,
  DictionaryEntry,
  EnglishLevel,
} from '../src/types/index.js';

// In-Memory persistent store for the running server instance
class Database {
  users: Map<string, User & { passwordHash: string }> = new Map();
  sessions: Map<string, string> = new Map(); // token -> userId
  vocabulary: Map<string, VocabularyWord> = new Map();
  savedWords: Map<string, { id: string; userId: string; wordId: string; savedAt: string; masteryLevel: number }[]> = new Map();
  learnedWords: Map<string, Set<string>> = new Map(); // userId -> Set<wordId>
  quizzes: Map<string, Quiz> = new Map();
  quizResults: Map<string, QuizResult[]> = new Map(); // userId -> QuizResult[]
  communityRooms: Map<string, CommunityRoom> = new Map();
  communityPosts: Map<string, CommunityPost> = new Map();
  moderationReports: Map<string, ModerationReport> = new Map();
  videoLessons: Map<string, VideoContent> = new Map();
  achievements: Map<string, Achievement[]> = new Map(); // userId -> Achievement[]
  notifications: Map<string, AppNotification[]> = new Map(); // userId -> AppNotification[]
  scenarios: Map<string, AIConversationScenario> = new Map();
  dictionaryLocal: Map<string, DictionaryEntry> = new Map();

  constructor() {
    this.seedInitialData();
  }

  seedInitialData() {
    // 1. Default Users (Demo Learner + Admin)
    const demoUser: User & { passwordHash: string } = {
      id: 'usr_demo_1',
      fullName: 'مهنا کریمی',
      email: 'mohanna@example.com',
      passwordHash: 'pass123',
      ageRange: '13-17',
      englishLevel: 'beginner',
      learningGoal: 'speaking',
      role: 'user',
      xp: 320,
      streak: 4,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    };

    const adminUser: User & { passwordHash: string } = {
      id: 'usr_admin_1',
      fullName: 'مدیر آموزشی مهنا',
      email: 'admin@learnwithmohanna.com',
      passwordHash: 'admin123',
      ageRange: '25-34',
      englishLevel: 'pre-intermediate',
      learningGoal: 'general',
      role: 'admin',
      xp: 1500,
      streak: 14,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    };

    this.users.set(demoUser.id, demoUser);
    this.users.set(adminUser.id, adminUser);
    this.sessions.set('token_demo_user', demoUser.id);
    this.sessions.set('token_admin_user', adminUser.id);

    // 2. Rich Pre-seeded Vocabulary (Persian-First educational focus)
    const initialVocab: VocabularyWord[] = [
      {
        id: 'voc_1',
        english: 'Encourage',
        pronunciation: '/ɪnˈkʌr.ɪdʒ/',
        partOfSpeech: 'verb',
        persianMeaning: 'تشویق کردن، دلگرم کردن',
        exampleSentence: 'My teacher always encourages me to speak English in class.',
        exampleTranslation: 'معلمم همیشه من را تشویق می‌کند که در کلاس انگلیسی صحبت کنم.',
        difficulty: 'beginner',
        category: 'Education & Feelings',
        relatedWords: ['Support', 'Inspire', 'Motivation'],
        tipsFa: 'بعد از encourage معمولاً از ساختار encourage someone to do something استفاده می‌کنیم.',
      },
      {
        id: 'voc_2',
        english: 'Confident',
        pronunciation: '/ˈkɒn.fɪ.dənt/',
        partOfSpeech: 'adjective',
        persianMeaning: 'با اعتمادبه‌نفس، مطمئن',
        exampleSentence: 'She feels confident when talking to native speakers.',
        exampleTranslation: 'او هنگام صحبت با افراد بومی احساس اعتمادبه‌نفس می‌کند.',
        difficulty: 'elementary',
        category: 'Personality & Feelings',
        relatedWords: ['Self-esteem', 'Sure', 'Bold'],
        tipsFa: 'حرف اضافه رایج برای این صفت in یا about است: confident in your abilities.',
      },
      {
        id: 'voc_3',
        english: 'Improve',
        pronunciation: '/ɪmˈpruːv/',
        partOfSpeech: 'verb',
        persianMeaning: 'بهبود یافتن، پیشرفت کردن',
        exampleSentence: 'Daily practice will help you improve your speaking skills.',
        exampleTranslation: 'تمرین روزانه به شما کمک می‌کند مهارت‌های مکالمه‌تان را بهبود دهید.',
        difficulty: 'beginner',
        category: 'Learning & Growth',
        relatedWords: ['Progress', 'Enhance', 'Develop'],
        tipsFa: 'اسم این کلمه Improvement به معنی بهبود و پیشرفت است.',
      },
      {
        id: 'voc_4',
        english: 'Opportunity',
        pronunciation: '/ˌɒp.əˈtjuː.nə.ti/',
        partOfSpeech: 'noun',
        persianMeaning: 'فرصت، موقعیت مناسب',
        exampleSentence: 'Learning English gives you the opportunity to make friends worldwide.',
        exampleTranslation: 'یادگیری انگلیسی این فرصت را به شما می‌دهد که در سراسر جهان دوست پیدا کنید.',
        difficulty: 'elementary',
        category: 'Life & Opportunities',
        relatedWords: ['Chance', 'Possibility', 'Opening'],
        tipsFa: 'می‌گوییم: take an opportunity (فرصت را غنیمت شمردن) یا miss an opportunity (فرصت را از دست دادن).',
      },
      {
        id: 'voc_5',
        english: 'Resilient',
        pronunciation: '/rɪˈzɪl.jənt/',
        partOfSpeech: 'adjective',
        persianMeaning: 'تاب‌آور، سرسخت و منعطف در برابر سختی‌ها',
        exampleSentence: 'Language learners need to be resilient and not give up after making mistakes.',
        exampleTranslation: 'زبان‌آموزان باید تاب‌آور باشند و بعد از اشتباه کردن تسلیم نشوند.',
        difficulty: 'pre-intermediate',
        category: 'Mindset & Success',
        relatedWords: ['Tough', 'Adaptable', 'Persistent'],
        tipsFa: 'اشتباه کردن بخش طبیعی یادگیری است، تاب‌آور باشید!',
      },
      {
        id: 'voc_6',
        english: 'Curious',
        pronunciation: '/ˈkjʊə.ri.əs/',
        partOfSpeech: 'adjective',
        persianMeaning: 'کنجکاو، مشتاق دانستن',
        exampleSentence: 'Children are naturally curious about the world around them.',
        exampleTranslation: 'کودکان به طور طبیعی در مورد دنیای اطراف خود کنجکاو هستند.',
        difficulty: 'beginner',
        category: 'Personality & Feelings',
        relatedWords: ['Inquisitive', 'Interested', 'Eager'],
        tipsFa: 'حرف اضافه آن معمولاً about است: curious about something.',
      },
      {
        id: 'voc_7',
        english: 'Fluently',
        pronunciation: '/ˈfluː.ənt.li/',
        partOfSpeech: 'adverb',
        persianMeaning: 'روان و بدون لکنت',
        exampleSentence: 'He wants to speak English fluently within one year.',
        exampleTranslation: 'او می‌خواهد ظرف یک سال انگلیسی را روان صحبت کند.',
        difficulty: 'elementary',
        category: 'Learning & Growth',
        relatedWords: ['Smoothly', 'Effortlessly', 'Articulately'],
        tipsFa: 'صفت آن Fluent (روان) است: I am a fluent speaker.',
      },
      {
        id: 'voc_8',
        english: 'Accomplish',
        pronunciation: '/əˈkʌm.plɪʃ/',
        partOfSpeech: 'verb',
        persianMeaning: 'به انجام رساندن، دستیابی به هدف',
        exampleSentence: 'You can accomplish your goals if you study consistently.',
        exampleTranslation: 'اگر پیوسته مطالعه کنید، می‌توانید به اهدافتان دست یابید.',
        difficulty: 'pre-intermediate',
        category: 'Success & Goals',
        relatedWords: ['Achieve', 'Complete', 'Fulfill'],
        tipsFa: 'هم‌معنی achieve است اما روی تکمیل موفقیت‌آمیز یک کار تمرکز دارد.',
      },
      {
        id: 'voc_9',
        english: 'Pronunciation',
        pronunciation: '/prəˌnʌn.siˈeɪ.ʃən/',
        partOfSpeech: 'noun',
        persianMeaning: 'تلفظ، طرز تلفظ کلمات',
        exampleSentence: 'Listening to native speakers improves your English pronunciation.',
        exampleTranslation: 'گوش دادن به افراد بومی تلفظ انگلیسی شما را تقویت می‌کند.',
        difficulty: 'elementary',
        category: 'Learning & Growth',
        relatedWords: ['Accent', 'Intonation', 'Enunciation'],
        tipsFa: 'دقت کنید که فعل آن pronounce است اما اسم آن با nun نوشته و تلفظ می‌شود.',
      },
      {
        id: 'voc_10',
        english: 'Habit',
        pronunciation: '/ˈhæb.ɪt/',
        partOfSpeech: 'noun',
        persianMeaning: 'عادت، رفتار تکرارشونده',
        exampleSentence: 'Reading ten minutes of English every morning is a wonderful habit.',
        exampleTranslation: 'خواندن ۱۰ دقیقه انگلیسی هر روز صبح، یک عادت فوق‌العاده است.',
        difficulty: 'beginner',
        category: 'Daily Life',
        relatedWords: ['Routine', 'Practice', 'Custom'],
        tipsFa: 'اصطلاح build a habit به معنی عادت‌سازی است.',
      },
      {
        id: 'voc_11',
        english: 'Delicious',
        pronunciation: '/dɪˈlɪʃ.əs/',
        partOfSpeech: 'adjective',
        persianMeaning: 'خوشمزه، لذیذ',
        exampleSentence: 'This traditional Persian kebab is absolutely delicious!',
        exampleTranslation: 'این کباب سنتی ایرانی واقعاً لذیذ است!',
        difficulty: 'beginner',
        category: 'Food & Dining',
        relatedWords: ['Tasty', 'Yummy', 'Flavorful'],
        tipsFa: 'برای تأکید می‌توانید از absolutely delicious استفاده کنید نه very delicious.',
      },
      {
        id: 'voc_12',
        english: 'Destination',
        pronunciation: '/ˌdes.tɪˈneɪ.ʃən/',
        partOfSpeech: 'noun',
        persianMeaning: 'مقصد، هدف سفر',
        exampleSentence: 'Our final destination on this trip is the beautiful city of Isfahan.',
        exampleTranslation: 'مقصد نهایی ما در این سفر، شهر زیبای اصفهان است.',
        difficulty: 'elementary',
        category: 'Travel & Exploration',
        relatedWords: ['Target', 'Arrival point', 'Journey end'],
        tipsFa: 'در فرودگاه‌ها عبارت Final Destination به معنی مقصد نهایی پرواز است.',
      },
    ];

    initialVocab.forEach((v) => this.vocabulary.set(v.id, v));

    // Seed Saved Words for demo user
    this.savedWords.set(demoUser.id, [
      { id: 'sw_1', userId: demoUser.id, wordId: 'voc_1', savedAt: new Date().toISOString(), masteryLevel: 3 },
      { id: 'sw_2', userId: demoUser.id, wordId: 'voc_2', savedAt: new Date().toISOString(), masteryLevel: 4 },
      { id: 'sw_3', userId: demoUser.id, wordId: 'voc_5', savedAt: new Date().toISOString(), masteryLevel: 2 },
    ]);

    this.learnedWords.set(demoUser.id, new Set(['voc_1', 'voc_3', 'voc_10', 'voc_11']));

    // 3. Quizzes (Placement Test + Thematic Quizzes)
    const placementQuiz: Quiz = {
      id: 'quiz_placement',
      titleFa: 'آزمون تعیین سطح هوشمند',
      titleEn: 'Smart English Placement Test',
      descriptionFa: 'سنجش جامع مهارت‌های گرامر، واژگان و درک مطلب جهت تعیین دقیق سطح شما',
      descriptionEn: 'Comprehensive evaluation to accurately calibrate your English starting point.',
      type: 'placement',
      level: 'unknown',
      xpReward: 100,
      timeLimitSeconds: 600,
      questions: [
        {
          id: 'pq_1',
          type: 'multiple-choice',
          promptFa: 'کدام گزینه جمله را به درستی کامل می‌کند؟',
          promptEn: 'She _______ to school every morning by bus.',
          options: ['go', 'goes', 'going', 'is go'],
          correctAnswer: 'goes',
          explanationFa: 'برای فاعل سوم‌شخص مفرد (She) در زمان حال ساده، به فعل پسوند -s یا -es اضافه می‌شود.',
          explanationEn: 'Third-person singular in present simple takes -s or -es.',
          category: 'grammar',
          difficulty: 'beginner',
        },
        {
          id: 'pq_2',
          type: 'multiple-choice',
          promptFa: 'معنی دقیق کلمه "Encourage" چیست؟',
          promptEn: 'What does "Encourage" mean?',
          options: ['تشویق کردن', 'تنبیه کردن', 'ترک کردن', 'شکست خوردن'],
          correctAnswer: 'تشویق کردن',
          explanationFa: 'واژه Encourage به معنی دلگرم کردن و تشویق کردن دیگران است.',
          explanationEn: 'Encourage means giving someone support, confidence or hope.',
          category: 'vocabulary',
          difficulty: 'beginner',
        },
        {
          id: 'pq_3',
          type: 'multiple-choice',
          promptFa: 'شکل گذشته فعل "buy" چیست؟',
          promptEn: 'What is the past tense form of "buy"?',
          options: ['buyed', 'bought', 'buying', 'boight'],
          correctAnswer: 'bought',
          explanationFa: 'فعل buy بی‌قاعده است و گذشته آن bought می‌شود.',
          explanationEn: 'Buy is an irregular verb. Its simple past form is bought.',
          category: 'grammar',
          difficulty: 'elementary',
        },
        {
          id: 'pq_4',
          type: 'multiple-choice',
          promptFa: 'کدام کلمه متضاد (Antonym) واژه "Confident" است؟',
          promptEn: 'Which word is the antonym of "Confident"?',
          options: ['Proud', 'Shy / Insecure', 'Brave', 'Strong'],
          correctAnswer: 'Shy / Insecure',
          explanationFa: 'کلمه Insecure به معنی بی‌اعتمادبه‌نفس و Shy به معنی خجالتی است که متضاد Confident هستند.',
          explanationEn: 'Insecure or shy is opposite of confident.',
          category: 'vocabulary',
          difficulty: 'elementary',
        },
        {
          id: 'pq_5',
          type: 'multiple-choice',
          promptFa: 'جمله را با حرف اضافه صحیح کامل کنید:',
          promptEn: 'I am interested _______ learning new languages.',
          options: ['on', 'at', 'in', 'with'],
          correctAnswer: 'in',
          explanationFa: 'ترکیب ثابت برای علاقه داشتن interested in است.',
          explanationEn: 'We always say "interested in" something.',
          category: 'grammar',
          difficulty: 'elementary',
        },
        {
          id: 'pq_6',
          type: 'multiple-choice',
          promptFa: 'کدام گزینه ساختار شرطی نوع اول را درست نشان می‌دهد؟',
          promptEn: 'If it _______ tomorrow, we will stay at home.',
          options: ['rains', 'will rain', 'rained', 'is rain'],
          correctAnswer: 'rains',
          explanationFa: 'در بخش شرطی (if clause) در شرطی نوع اول از حال ساده استفاده می‌کنیم نه will.',
          explanationEn: 'In first conditional if-clauses, we use present simple.',
          category: 'grammar',
          difficulty: 'pre-intermediate',
        },
        {
          id: 'pq_7',
          type: 'multiple-choice',
          promptFa: 'معنی عبارت "Look forward to" چیست؟',
          promptEn: 'What does "look forward to" mean?',
          options: ['به پشت سر نگاه کردن', 'مشتاقانه در انتظار چیزی بودن', 'مواظب کسی بودن', 'جستجو کردن'],
          correctAnswer: 'مشتاقانه در انتظار چیزی بودن',
          explanationFa: 'اصطلاح Look forward to یعنی با شوق و اشتیاق منتظر اتفاقی در آینده بودن.',
          explanationEn: 'To anticipate something with pleasure.',
          category: 'vocabulary',
          difficulty: 'pre-intermediate',
        },
        {
          id: 'pq_8',
          type: 'multiple-choice',
          promptFa: 'کدام گزینه پاسخ مناسب برای سوال "How long have you lived here?" است؟',
          promptEn: 'Choose the correct answer for: "How long have you lived here?"',
          options: ['For five years.', 'Since five years ago.', 'In five years.', 'Both A and B are acceptable.'],
          correctAnswer: 'Both A and B are acceptable.',
          explanationFa: 'برای بیان طول مدت زمان از for و برای نقطه آغاز از since استفاده می‌شود.',
          explanationEn: 'For + duration or since + starting point.',
          category: 'grammar',
          difficulty: 'pre-intermediate',
        },
      ],
    };

    const vocabQuiz1: Quiz = {
      id: 'quiz_vocab_1',
      titleFa: 'آزمون لغات: احساسات و ویژگی‌های فردی',
      titleEn: 'Vocabulary Quiz: Feelings & Traits',
      descriptionFa: 'تمرین و تثبیت لغات کلیدی مربوط به شخصیت، احساسات و ارتباطات',
      descriptionEn: 'Solidify essential words describing personality and mindset.',
      type: 'vocabulary',
      level: 'beginner',
      xpReward: 40,
      questions: [
        {
          id: 'vq_1',
          type: 'multiple-choice',
          promptFa: 'معنی کلمه "Resilient" چیست؟',
          promptEn: 'Select the best definition of "Resilient":',
          options: ['سرسخت و تاب‌آور', 'ناامید و خسته', 'ثروتمند', 'فراموش‌کار'],
          correctAnswer: 'سرسخت و تاب‌آور',
          explanationFa: 'Resilient به افرادی گفته می‌شود که در مواجهه با سختی‌ها زود تسلیم نمی‌شوند.',
          explanationEn: 'Resilient means able to withstand or recover quickly from difficult conditions.',
          category: 'vocabulary',
          difficulty: 'elementary',
        },
        {
          id: 'vq_2',
          type: 'multiple-choice',
          promptFa: 'جمله را کامل کنید: "She was _______ to know what was inside the box."',
          promptEn: 'Complete: "She was _______ to know what was inside the box."',
          options: ['curious', 'angry', 'fluent', 'tasty'],
          correctAnswer: 'curious',
          explanationFa: 'کلمه Curious به معنی کنجکاو در این جمله مناسب‌ترین گزینه است.',
          explanationEn: 'Curious fits the context of wanting to discover what is inside.',
          category: 'vocabulary',
          difficulty: 'beginner',
        },
        {
          id: 'vq_3',
          type: 'multiple-choice',
          promptFa: 'کلمه "Opportunity" با کدام یک از کلمات زیر هم‌معنی است؟',
          promptEn: 'Which word is a synonym for "Opportunity"?',
          options: ['Chance', 'Problem', 'Mistake', 'Delay'],
          correctAnswer: 'Chance',
          explanationFa: 'Chance و Opportunity هر دو به معنی شانس و فرصت هستند.',
          explanationEn: 'Opportunity and Chance are direct synonyms.',
          category: 'vocabulary',
          difficulty: 'elementary',
        },
      ],
    };

    const grammarQuiz1: Quiz = {
      id: 'quiz_grammar_1',
      titleFa: 'آزمون گرامر: زمان حال ساده و استمراری',
      titleEn: 'Grammar: Present Simple vs. Continuous',
      descriptionFa: 'تشخیص تفاوت کارهای روتین با فعالیت‌های در حال انجام همین الان',
      descriptionEn: 'Master the distinction between daily routines and actions happening right now.',
      type: 'grammar',
      level: 'beginner',
      xpReward: 50,
      questions: [
        {
          id: 'gq_1',
          type: 'multiple-choice',
          promptFa: 'کدام گزینه با توجه به قید زمان "right now" صحیح است؟',
          promptEn: 'Look! It _______ right now.',
          options: ['is raining', 'rains', 'rained', 'rain'],
          correctAnswer: 'is raining',
          explanationFa: 'برای کاری که همین الان در حال وقوع است از حال استمراری (is + verb-ing) استفاده می‌کنیم.',
          explanationEn: 'Present continuous is used for actions happening at the moment of speech.',
          category: 'grammar',
          difficulty: 'beginner',
        },
        {
          id: 'gq_2',
          type: 'multiple-choice',
          promptFa: 'شکل منفی جمله "He likes coffee" کدام است؟',
          promptEn: 'What is the negative form of "He likes coffee"?',
          options: ['He does not like coffee.', 'He is not like coffee.', 'He not likes coffee.', 'He do not likes coffee.'],
          correctAnswer: 'He does not like coffee.',
          explanationFa: 'برای سوم شخص مفرد از does not استفاده می‌کنیم و فعل اصلی به حالت ساده (like) برمی‌گردد.',
          explanationEn: 'Negative present simple for he/she/it uses does not + base verb.',
          category: 'grammar',
          difficulty: 'beginner',
        },
      ],
    };

    this.quizzes.set(placementQuiz.id, placementQuiz);
    this.quizzes.set(vocabQuiz1.id, vocabQuiz1);
    this.quizzes.set(grammarQuiz1.id, grammarQuiz1);

    // 4. AI Conversation Scenarios
    const initialScenarios: AIConversationScenario[] = [
      {
        id: 'sc_restaurant',
        titleEn: 'Ordering Food in a Restaurant',
        titleFa: 'سفارش غذا و نوشیدنی در رستوران 🍽️',
        descriptionEn: 'Practice ordering your favorite meal, asking about the menu, and requesting the bill.',
        descriptionFa: 'مکالمه با گارسون رستوران: سفارش غذا، پرسیدن درباره مواد تشکیل‌دهنده و درخواست صورتحساب.',
        icon: 'utensils',
        level: 'beginner',
        aiRoleEn: 'Friendly Restaurant Waiter',
        aiRoleFa: 'گارسون مهربان رستوران',
        userRoleEn: 'Hungry Customer',
        userRoleFa: 'مشتری رستوران',
        starterMessageEn: 'Good evening! Welcome to our bistro. Would you like a table for one or two?',
        starterMessageFa: 'عصر بخیر! به رستوران ما خوش آمدید. میز برای یک نفر می‌خواهید یا دو نفر؟',
        suggestedPhrases: [
          { en: 'A table for one, please.', fa: 'یک میز برای یک نفر، لطفاً.' },
          { en: 'Could I see the menu?', fa: 'میشه لطفاً منو رو ببینم؟' },
          { en: 'What do you recommend?', fa: 'شما چه غذایی رو پیشنهاد می‌کنید؟' },
        ],
      },
      {
        id: 'sc_school',
        titleEn: 'Meeting a New Classmate at School',
        titleFa: 'آشنایی با همکلاسی جدید در مدرسه یا دانشگاه 🏫',
        descriptionEn: 'Introduce yourself, talk about your classes, favorite subjects, and make a friend.',
        descriptionFa: 'معرفی خودتان، صحبت درباره کلاس‌ها و درس‌های مورد علاقه و پیدا کردن دوست جدید.',
        icon: 'graduation-cap',
        level: 'beginner',
        aiRoleEn: 'Friendly New Classmate named Alex',
        aiRoleFa: 'همکلاسی پرانرژی به نام الکس',
        userRoleEn: 'Student',
        userRoleFa: 'دانش‌آموز / دانشجو',
        starterMessageEn: "Hi there! I think we share the same English class. My name is Alex. What's your name?",
        starterMessageFa: 'سلام! فکر کنم کلاس انگلیسی‌مون مشترکه. اسم من الکسه. اسم شما چیه؟',
        suggestedPhrases: [
          { en: 'Nice to meet you, Alex. I am...', fa: 'از دیدنت خوشحالم الکس، من...' },
          { en: 'Are you ready for the exam?', fa: 'برای امتحان آماده‌ای؟' },
        ],
      },
      {
        id: 'sc_travel',
        titleEn: 'At the Airport Information Desk',
        titleFa: 'راهنمایی در فرودگاه و پرواز ✈️',
        descriptionEn: 'Ask for gate numbers, luggage retrieval, and flight boarding times.',
        descriptionFa: 'پرسیدن درباره گیت پرواز، تحویل چمدان‌ها و زمان سوار شدن به هواپیما.',
        icon: 'plane',
        level: 'intermediate',
        aiRoleEn: 'Airport Customer Service Officer',
        aiRoleFa: 'متصدی راهنمای فرودگاه',
        userRoleEn: 'Traveler',
        userRoleFa: 'مسافر پرواز',
        starterMessageEn: 'Hello! How can I assist you with your flight today?',
        starterMessageFa: 'سلام! چطور می‌توانم در مورد پروازتان به شما کمک کنم؟',
        suggestedPhrases: [
          { en: 'Excuse me, which gate is flight 402?', fa: 'ببخشید، پرواز ۴۰۲ از کدام گیت است؟' },
          { en: 'Where can I claim my baggage?', fa: 'کجا می‌توانم چمدان‌هایم را تحویل بگیرم؟' },
        ],
      },
      {
        id: 'sc_shopping',
        titleEn: 'Shopping for Clothes',
        titleFa: 'خرید لباس و سایزبندی 🛍️',
        descriptionEn: 'Ask for different sizes, colors, fitting rooms, and prices.',
        descriptionFa: 'پرسیدن درباره رنگ‌های دیگر، اتاق پرو و تخفیف‌ها.',
        icon: 'shopping-bag',
        level: 'beginner',
        aiRoleEn: 'Shop Assistant',
        aiRoleFa: 'فروشنده فروشگاه پوشاک',
        userRoleEn: 'Shopper',
        userRoleFa: 'خریدار',
        starterMessageEn: 'Hi! Let me know if you need help finding the right size or trying something on.',
        starterMessageFa: 'سلام! اگر کمکی برای پیدا کردن سایز مناسب یا پرو لباس خواستید بفرمایید.',
        suggestedPhrases: [
          { en: 'Do you have this in medium size?', fa: 'آیا سایز مدیوم این رو دارید؟' },
          { en: 'Where is the fitting room?', fa: 'اتاق پرو کجاست؟' },
        ],
      },
    ];

    initialScenarios.forEach((s) => this.scenarios.set(s.id, s));

    // 5. Community Rooms & Initial Posts
    const rooms: CommunityRoom[] = [
      {
        id: 'room_lounge',
        slug: 'english-lounge',
        nameEn: 'English Lounge',
        nameFa: 'English Lounge (تالار عمومی)',
        descriptionEn: 'Casual chat, daily thoughts, and general English sharing.',
        descriptionFa: 'گفتگوی آزاد، احوالپرسی، انگیزه‌بخشی و اشتراک مطالب جذاب به زبان انگلیسی و فارسی.',
        icon: 'coffee',
        isPublic: true,
        postCount: 12,
        color: 'sky',
      },
      {
        id: 'room_vocab',
        slug: 'vocabulary-help',
        nameEn: 'Vocabulary Help',
        nameFa: 'تقویت لغات و اصطلاحات 📚',
        descriptionEn: 'Ask for word meanings, idioms, collocations, and memory techniques.',
        descriptionFa: 'پرسش و پاسخ درباره معنی لغات، اصطلاحات روزمره و روش‌های به‌خاطرسپاری.',
        icon: 'book-open',
        isPublic: false,
        postCount: 8,
        color: 'amber',
      },
      {
        id: 'room_grammar',
        slug: 'grammar-help',
        nameEn: 'Grammar Help',
        nameFa: 'رفع اشکال گرامر ✍️',
        descriptionEn: 'Clear your grammar doubts with fellow learners and mentors.',
        descriptionFa: 'اشکالات گرامری، زمان‌ها، حروف اضافه و ساختار جملات را بپرسید.',
        icon: 'pen-tool',
        isPublic: false,
        postCount: 6,
        color: 'emerald',
      },
      {
        id: 'room_speaking',
        slug: 'speaking-practice',
        nameEn: 'Speaking Practice',
        nameFa: 'تمرین مکالمه و تلفظ 🗣️',
        descriptionEn: 'Share speaking tips, topic prompts, and find study buddies.',
        descriptionFa: 'تبادل جملات مکالمه، تمرین تلفظ و یافتن پارتنر برای گفتگو.',
        icon: 'mic',
        isPublic: false,
        postCount: 9,
        color: 'rose',
      },
      {
        id: 'room_homework',
        slug: 'homework-help',
        nameEn: 'Homework & School Help',
        nameFa: 'کمک درسی و تکالیف مدرسه 🎓',
        descriptionEn: 'Friendly help with textbook questions and school English lessons.',
        descriptionFa: 'محیطی امن برای رفع اشکال سوالات کتاب‌های درسی پایه هفتم تا دوازدهم و کنکور.',
        icon: 'help-circle',
        isPublic: false,
        postCount: 5,
        color: 'indigo',
      },
      {
        id: 'room_movies',
        slug: 'movie-english',
        nameEn: 'Movie English',
        nameFa: 'انگلیسی با فیلم و انیمیشن 🎬',
        descriptionEn: 'Discuss quotes, songs, and dialogue from popular movies.',
        descriptionFa: 'تحلیل دیالوگ‌های معروف فیلم‌ها و انیمیشن‌ها و اصطلاحات عامیانه.',
        icon: 'film',
        isPublic: false,
        postCount: 7,
        color: 'purple',
      },
    ];

    rooms.forEach((r) => this.communityRooms.set(r.id, r));

    // Initial Community Posts
    const p1: CommunityPost = {
      id: 'post_1',
      roomId: 'room_lounge',
      authorId: 'usr_demo_1',
      authorName: 'مهنا کریمی',
      authorLevel: 'beginner',
      title: 'سلام به همه بچه‌ها! چطور روزانه لغات انگلیسی رو مرور می‌کنید؟',
      content:
        'سلام دوستان! من تازه یادگیری رو با این اپ شروع کردم. شما چطور برنامه‌ریزی می‌کنید که روزی ۵ تا لغت رو فراموش نکنید؟ من لغات رو با مثال و صدای تلفظ گوش میدم و خیلی کمک کرده.',
      tags: ['StudyTips', 'Vocabulary', 'Routine'],
      likes: 8,
      commentsCount: 2,
      isPinned: true,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      comments: [
        {
          id: 'comm_1',
          postId: 'post_1',
          authorId: 'usr_admin_1',
          authorName: 'مدیر آموزشی مهنا',
          authorLevel: 'pre-intermediate',
          content:
            'سلام مهنا جان! آفرین به پشتکارت. بهترین روش اینه که با هر لغت یک جمله شخصی درباره روزمره‌ات بسازی و با دستیار هوش مصنوعی همون لغت رو تمرین کنی.',
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          likes: 5,
        },
        {
          id: 'comm_2',
          postId: 'post_1',
          authorId: 'usr_sarah',
          authorName: 'سارا رضایی',
          authorLevel: 'elementary',
          content: 'منم هر شب قبل خواب بخش لغات نشان‌شده (Saved Words) رو یک دور مرور می‌کنم، واقعاً نتیجه میده!',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          likes: 3,
        },
      ],
    };

    const p2: CommunityPost = {
      id: 'post_2',
      roomId: 'room_vocab',
      authorId: 'usr_ali',
      authorName: 'علی محمدی',
      authorLevel: 'elementary',
      title: 'فرق بین Remember و Remind چیه دقیقا؟',
      content:
        'سلام! همیشه این دو تا رو قاطی می‌کنم. مثلاً چطور بگیم "به من یادآوری کن"؟ میشه یه توضیح ساده بدید؟ ممنون!',
      tags: ['Grammar', 'CommonMistakes', 'Vocabulary'],
      likes: 6,
      commentsCount: 1,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      comments: [
        {
          id: 'comm_3',
          postId: 'post_2',
          authorId: 'usr_admin_1',
          authorName: 'مدیر آموزشی مهنا',
          authorLevel: 'pre-intermediate',
          content:
            'سلام علی عزیز! خیلی نکته خوبیه:\n- فعل Remember یعنی خودت چیزی رو به یاد بیاری (I remember you).\n- فعل Remind یعنی کسی یا چیزی باعث بشه یادت بیفته: Remind me to call him (به من یادآوری کن بهش زنگ بزنم).',
          createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
          likes: 7,
        },
      ],
    };

    this.communityPosts.set(p1.id, p1);
    this.communityPosts.set(p2.id, p2);

    // 6. Video Lessons (Movies & Animations)
    const v1: VideoContent = {
      id: 'vid_lion_king',
      titleEn: 'The Lion King - Hakuna Matata Philosophy',
      titleFa: 'انیمیشن شیر شاه: اصطلاحات آرامش و رهایی از نگرانی',
      descriptionEn: 'Learn idioms about letting go of worries, simple present expressions, and casual greetings.',
      descriptionFa: 'آموزش لغات و اصطلاحات پرکاربرد درباره غلبه بر استرس و نگرانی با دیالوگ‌های خاطره‌انگیز تیمون و پومبا.',
      thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: '02:15',
      level: 'beginner',
      category: 'animation',
      subtitles: [
        {
          id: 'sub_1',
          startTime: 0,
          endTime: 4,
          textEn: 'Hakuna Matata! What a wonderful phrase.',
          textFa: 'هاکونا ماتاتا! چه عبارت شگفت‌انگیزی.',
          keyWords: [{ word: 'wonderful', meaningFa: 'فوق‌العاده و شگفت‌انگیز' }],
        },
        {
          id: 'sub_2',
          startTime: 4.5,
          endTime: 8,
          textEn: 'It means no worries for the rest of your days.',
          textFa: 'این یعنی بدون نگرانی برای بقیه روزهای عمرت.',
          keyWords: [
            { word: 'worries', meaningFa: 'نگرانی‌ها / دلواپسی‌ها' },
            { word: 'the rest of', meaningFa: 'بقیه / مابقی' },
          ],
        },
        {
          id: 'sub_3',
          startTime: 8.5,
          endTime: 14,
          textEn: "It's our problem-free philosophy!",
          textFa: 'این فلسفه بدون دردسر و بدون مشکل ماست!',
          keyWords: [{ word: 'philosophy', meaningFa: 'فلسفه و نگرش فکری' }],
        },
      ],
      keyPhrases: [
        { en: 'No worries', fa: 'اصلاً نگران نباش / فدای سرت', explanation: 'اصطلاحی عامیانه و بسیار پرکاربرد مشابه You are welcome یا Don\'t worry.' },
        { en: 'Problem-free', fa: 'بدون دردسر و بدون مشکل', explanation: 'ترکیب کلمه با پسوند free به معنی عاری بودن از آن چیز است، مثل sugar-free (بدون شکر).' },
        { en: 'Rest of your days', fa: 'باقی‌مانده عمر و روزها', explanation: 'تعبیری شاعرانه برای اشاره به آینده.' },
      ],
    };

    const v2: VideoContent = {
      id: 'vid_spiderman',
      titleEn: 'Spider-Man - Great Power and Responsibility',
      titleFa: 'مرد عنکبوتی: دیالوگ ماندگار قدرت و مسئولیت',
      descriptionEn: 'Classic dialogue analyzing the famous proverb and modal verbs.',
      descriptionFa: 'بررسی ساختار جملات پندآموز و افعال شرطی در یکی از مشهورترین دیالوگ‌های تاریخ سینما.',
      thumbnail: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: '01:45',
      level: 'elementary',
      category: 'movie',
      subtitles: [
        {
          id: 'sub_s1',
          startTime: 0,
          endTime: 5,
          textEn: 'Whatever life holds in store for me, I will never forget these words.',
          textFa: 'زندگی هر چه در چنته برایم داشته باشد، هرگز این کلمات را فراموش نخواهم کرد.',
          keyWords: [{ word: 'in store for', meaningFa: 'در تقدیر / آماده برای آینده' }],
        },
        {
          id: 'sub_s2',
          startTime: 5.5,
          endTime: 10,
          textEn: 'With great power comes great responsibility.',
          textFa: 'همراه با قدرت بزرگ، مسئولیتی بزرگ پدید می‌آید.',
          keyWords: [
            { word: 'power', meaningFa: 'قدرت و توانایی' },
            { word: 'responsibility', meaningFa: 'مسئولیت و وظیفه‌شناسی' },
          ],
        },
      ],
      keyPhrases: [
        { en: 'In store for me', fa: 'در سرنوشت من رقم خورده', explanation: 'اصطلاحی زیبا برای پیش‌بینی وقایع آینده.' },
        { en: 'Great responsibility', fa: 'مسئولیت خطیر و سنگین', explanation: 'کلمه responsibility از پرکاربردترین واژگان سطح متوسط است.' },
      ],
    };

    this.videoLessons.set(v1.id, v1);
    this.videoLessons.set(v2.id, v2);

    // 7. Achievements
    const defaultAchievements: Achievement[] = [
      {
        id: 'ach_first_quiz',
        code: 'FIRST_QUIZ',
        titleFa: 'قدم اول قهرمان 🏅',
        titleEn: 'First Quiz Completed',
        descriptionFa: 'اولین کوئیز خود را با موفقیت پشت سر گذاشتید.',
        descriptionEn: 'Successfully completed your first English quiz.',
        icon: 'award',
        targetCount: 1,
        currentCount: 1,
        unlocked: true,
        unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        xpReward: 50,
      },
      {
        id: 'ach_7_streak',
        code: '7_DAY_STREAK',
        titleFa: 'استمرار طلایی (۷ روز پیاپی) 🔥',
        titleEn: '7-Day Streak Master',
        descriptionFa: '۷ روز پشت سر هم تمرین روزانه را انجام دادید.',
        descriptionEn: 'Practiced English for 7 consecutive days.',
        icon: 'flame',
        targetCount: 7,
        currentCount: 4,
        unlocked: false,
        xpReward: 100,
      },
      {
        id: 'ach_100_words',
        code: '100_WORDS',
        titleFa: 'گنجینه واژگان (۱۰۰ لغت) 📚',
        titleEn: 'Vocabulary Master',
        descriptionFa: '۱۰۰ کلمه جدید انگلیسی را یاد گرفتید.',
        descriptionEn: 'Learned and practiced 100 new English vocabulary words.',
        icon: 'book-open',
        targetCount: 100,
        currentCount: 14,
        unlocked: false,
        xpReward: 150,
      },
      {
        id: 'ach_first_ai',
        code: 'FIRST_AI_CHAT',
        titleFa: 'دوست هوش مصنوعی 🤖',
        titleEn: 'First AI Conversation',
        descriptionFa: 'اولین گفتگوی تمرینی خود را با مهنا به پایان رساندید.',
        descriptionEn: 'Completed your first conversational practice with Mohanna AI.',
        icon: 'bot',
        targetCount: 1,
        currentCount: 1,
        unlocked: true,
        unlockedAt: new Date(Date.now() - 86400000).toISOString(),
        xpReward: 60,
      },
    ];

    this.achievements.set(demoUser.id, defaultAchievements);

    // 8. Notifications
    const demoNotifications: AppNotification[] = [
      {
        id: 'notif_1',
        userId: demoUser.id,
        type: 'daily_reminder',
        titleFa: 'وقت یادگیری امروزه! 🌟',
        titleEn: "Time for Today's English!",
        messageFa: 'فقط ۵ دقیقه تمرین کافیه تا زنجیره ۴ روزه‌ات حفظ بشه. لغات جدید منتظرتن!',
        messageEn: 'Just 5 minutes of practice keeps your 4-day streak alive!',
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: '/learn',
      },
      {
        id: 'notif_2',
        userId: demoUser.id,
        type: 'achievement',
        titleFa: 'مدال جدید باز شد! 🏆',
        titleEn: 'New Badge Unlocked!',
        messageFa: 'تبریک! دستاورد "دوست هوش مصنوعی" را دریافت کردید (+۶۰ XP).',
        messageEn: 'Congrats! You unlocked the "First AI Conversation" badge (+60 XP).',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        actionUrl: '/profile',
      },
    ];

    this.notifications.set(demoUser.id, demoNotifications);
  }

  // User management
  getUserById(id: string): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  getUserByEmail(email: string): (User & { passwordHash: string }) | undefined {
    return Array.from(this.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData: Omit<User, 'id' | 'xp' | 'streak' | 'lastActiveDate' | 'createdAt'> & { password: string }): User {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();
    const newUser: User & { passwordHash: string } = {
      id,
      fullName: userData.fullName,
      email: userData.email,
      passwordHash: userData.password, // securely handled in server
      ageRange: userData.ageRange || '18-24',
      englishLevel: userData.englishLevel || 'beginner',
      learningGoal: userData.learningGoal || 'general',
      role: userData.role || 'user',
      xp: 50, // Welcome XP bonus
      streak: 1,
      lastActiveDate: now.split('T')[0],
      createdAt: now,
    };

    this.users.set(id, newUser);
    this.savedWords.set(id, []);
    this.learnedWords.set(id, new Set());

    // Initialize achievements for new user
    this.achievements.set(id, [
      {
        id: `ach_1_${id}`,
        code: 'FIRST_QUIZ',
        titleFa: 'قدم اول قهرمان 🏅',
        titleEn: 'First Quiz Completed',
        descriptionFa: 'اولین کوئیز خود را با موفقیت پشت سر بگذارید.',
        descriptionEn: 'Successfully complete your first English quiz.',
        icon: 'award',
        targetCount: 1,
        currentCount: 0,
        unlocked: false,
        xpReward: 50,
      },
      {
        id: `ach_2_${id}`,
        code: '7_DAY_STREAK',
        titleFa: 'استمرار طلایی (۷ روز پیاپی) 🔥',
        titleEn: '7-Day Streak Master',
        descriptionFa: '۷ روز پشت سر هم تمرین روزانه را انجام دهید.',
        descriptionEn: 'Practice English for 7 consecutive days.',
        icon: 'flame',
        targetCount: 7,
        currentCount: 1,
        unlocked: false,
        xpReward: 100,
      },
      {
        id: `ach_3_${id}`,
        code: '100_WORDS',
        titleFa: 'گنجینه واژگان (۱۰۰ لغت) 📚',
        titleEn: 'Vocabulary Master',
        descriptionFa: '۱۰۰ کلمه جدید انگلیسی را یاد بگیرید.',
        descriptionEn: 'Learn and practice 100 new English vocabulary words.',
        icon: 'book-open',
        targetCount: 100,
        currentCount: 0,
        unlocked: false,
        xpReward: 150,
      },
      {
        id: `ach_4_${id}`,
        code: 'FIRST_AI_CHAT',
        titleFa: 'دوست هوش مصنوعی 🤖',
        titleEn: 'First AI Conversation',
        descriptionFa: 'یک گفتگوی تمرینی با مهنا به پایان برسانید.',
        descriptionEn: 'Complete your first conversational practice with Mohanna AI.',
        icon: 'bot',
        targetCount: 1,
        currentCount: 0,
        unlocked: false,
        xpReward: 60,
      },
    ]);

    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    const { passwordHash, ...safeUser } = updated;
    return safeUser;
  }

  addXpAndStreak(userId: string, xpAmount: number): { xp: number; streak: number } {
    const user = this.users.get(userId);
    if (!user) return { xp: 0, streak: 0 };
    const today = new Date().toISOString().split('T')[0];
    let streak = user.streak;

    if (user.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (user.lastActiveDate === yesterday) {
        streak += 1;
      } else if (user.lastActiveDate < yesterday) {
        streak = 1;
      }
    }

    user.xp += xpAmount;
    user.streak = streak;
    user.lastActiveDate = today;
    this.users.set(userId, user);
    return { xp: user.xp, streak: user.streak };
  }

  // Vocabulary & Saved Words
  getAllVocabulary(): VocabularyWord[] {
    return Array.from(this.vocabulary.values());
  }

  getSavedWords(userId: string): (VocabularyWord & { savedAt: string; masteryLevel: number })[] {
    const saved = this.savedWords.get(userId) || [];
    return saved
      .map((s) => {
        const word = this.vocabulary.get(s.wordId);
        if (!word) return null;
        return {
          ...word,
          savedAt: s.savedAt,
          masteryLevel: s.masteryLevel,
        };
      })
      .filter((w): w is VocabularyWord & { savedAt: string; masteryLevel: number } => w !== null);
  }

  saveWord(userId: string, wordId: string): boolean {
    const list = this.savedWords.get(userId) || [];
    if (list.some((item) => item.wordId === wordId)) return false;
    list.push({
      id: `sw_${Date.now()}`,
      userId,
      wordId,
      savedAt: new Date().toISOString(),
      masteryLevel: 1,
    });
    this.savedWords.set(userId, list);
    return true;
  }

  unsaveWord(userId: string, wordId: string): boolean {
    const list = this.savedWords.get(userId) || [];
    const filtered = list.filter((item) => item.wordId !== wordId);
    this.savedWords.set(userId, filtered);
    return true;
  }

  markWordLearned(userId: string, wordId: string): void {
    const learned = this.learnedWords.get(userId) || new Set();
    learned.add(wordId);
    this.learnedWords.set(userId, learned);
    this.addXpAndStreak(userId, 10);
  }

  getLearnedWords(userId: string): VocabularyWord[] {
    const learnedSet = this.learnedWords.get(userId) || new Set();
    return Array.from(learnedSet)
      .map((id) => this.vocabulary.get(id))
      .filter((w): w is VocabularyWord => Boolean(w));
  }

  // Quizzes & Results
  getQuizById(id: string): Quiz | undefined {
    return this.quizzes.get(id);
  }

  getAllQuizzes(): Quiz[] {
    return Array.from(this.quizzes.values());
  }

  saveQuizResult(result: QuizResult): void {
    const results = this.quizResults.get(result.userId) || [];
    results.unshift(result);
    this.quizResults.set(result.userId, results);
    this.addXpAndStreak(result.userId, Math.round(result.score * 10));

    // Unlock First Quiz achievement if not unlocked
    const achs = this.achievements.get(result.userId) || [];
    const firstAch = achs.find((a) => a.code === 'FIRST_QUIZ');
    if (firstAch && !firstAch.unlocked) {
      firstAch.unlocked = true;
      firstAch.unlockedAt = new Date().toISOString();
      firstAch.currentCount = 1;
      this.achievements.set(result.userId, achs);
    }
  }

  getUserQuizHistory(userId: string): QuizResult[] {
    return this.quizResults.get(userId) || [];
  }

  // Community
  getCommunityRooms(): CommunityRoom[] {
    return Array.from(this.communityRooms.values());
  }

  getPosts(roomId?: string): CommunityPost[] {
    let posts = Array.from(this.communityPosts.values());
    if (roomId && roomId !== 'all') {
      posts = posts.filter((p) => p.roomId === roomId);
    }
    return posts.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createPost(postData: Omit<CommunityPost, 'id' | 'likes' | 'commentsCount' | 'createdAt'>): CommunityPost {
    const id = `post_${Date.now()}`;
    const newPost: CommunityPost = {
      ...postData,
      id,
      likes: 0,
      commentsCount: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    this.communityPosts.set(id, newPost);
    this.addXpAndStreak(postData.authorId, 15);
    return newPost;
  }

  addComment(postId: string, commentData: Omit<CommunityComment, 'id' | 'postId' | 'createdAt' | 'likes'>): CommunityComment | undefined {
    const post = this.communityPosts.get(postId);
    if (!post) return undefined;
    const comment: CommunityComment = {
      ...commentData,
      id: `comm_${Date.now()}`,
      postId,
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    post.comments = post.comments || [];
    post.comments.push(comment);
    post.commentsCount = post.comments.length;
    this.communityPosts.set(postId, post);
    this.addXpAndStreak(commentData.authorId, 5);
    return comment;
  }

  reportContent(report: Omit<ModerationReport, 'id' | 'status' | 'createdAt'>): ModerationReport {
    const id = `rep_${Date.now()}`;
    const newReport: ModerationReport = {
      ...report,
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.moderationReports.set(id, newReport);
    return newReport;
  }

  getModerationReports(): ModerationReport[] {
    return Array.from(this.moderationReports.values());
  }

  deletePost(postId: string): boolean {
    return this.communityPosts.delete(postId);
  }

  // Scenarios & Video Lessons
  getScenarios(): AIConversationScenario[] {
    return Array.from(this.scenarios.values());
  }

  getVideoLessons(): VideoContent[] {
    return Array.from(this.videoLessons.values());
  }

  getAchievements(userId: string): Achievement[] {
    return this.achievements.get(userId) || [];
  }

  getNotifications(userId: string): AppNotification[] {
    return this.notifications.get(userId) || [];
  }

  markNotificationRead(userId: string, notifId: string): void {
    const notifs = this.notifications.get(userId) || [];
    const notif = notifs.find((n) => n.id === notifId);
    if (notif) notif.read = true;
  }

  // Admin additions
  addVocabularyBatch(words: Omit<VocabularyWord, 'id'>[]): VocabularyWord[] {
    const added: VocabularyWord[] = [];
    words.forEach((w) => {
      const id = `voc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const word: VocabularyWord = { ...w, id };
      this.vocabulary.set(id, word);
      added.push(word);
    });
    return added;
  }

  addQuiz(quiz: Omit<Quiz, 'id'>): Quiz {
    const id = `quiz_${Date.now()}`;
    const newQuiz: Quiz = { ...quiz, id };
    this.quizzes.set(id, newQuiz);
    return newQuiz;
  }

  addScenario(scenario: Omit<AIConversationScenario, 'id'>): AIConversationScenario {
    const id = `sc_${Date.now()}`;
    const newScenario: AIConversationScenario = { ...scenario, id };
    this.scenarios.set(id, newScenario);
    return newScenario;
  }
}

export const db = new Database();
