export type EnglishLevel = 'beginner' | 'elementary' | 'pre-intermediate' | 'unknown';

export type LearningGoal =
  | 'speaking'
  | 'vocabulary'
  | 'grammar'
  | 'school'
  | 'travel'
  | 'general';

export type AgeRange = '13-17' | '18-24' | '25-34' | '35+';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  ageRange: AgeRange;
  englishLevel: EnglishLevel;
  learningGoal: LearningGoal;
  role: UserRole;
  avatar?: string;
  xp: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  createdAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'fa' | 'en';
  dailyWordTarget: number;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

export interface VocabularyWord {
  id: string;
  english: string;
  pronunciation: string; // IPA e.g. /ˈkɒnfɪdənt/
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' | 'idiom';
  persianMeaning: string;
  exampleSentence: string;
  exampleTranslation: string;
  difficulty: 'beginner' | 'elementary' | 'pre-intermediate';
  category: string;
  relatedWords: string[];
  tipsFa?: string;
}

export interface SavedWord {
  id: string;
  userId: string;
  wordId: string;
  word?: VocabularyWord;
  savedAt: string;
  masteryLevel: number; // 1 to 5
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-in-blank' | 'translation' | 'sentence-order';
  promptFa: string;
  promptEn: string;
  options: string[];
  correctAnswer: string;
  explanationFa: string;
  explanationEn: string;
  category: 'vocabulary' | 'grammar' | 'reading' | 'mixed';
  difficulty: 'beginner' | 'elementary' | 'pre-intermediate';
}

export interface Quiz {
  id: string;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  descriptionEn: string;
  type: 'vocabulary' | 'grammar' | 'mixed' | 'placement';
  level: EnglishLevel;
  questions: QuizQuestion[];
  xpReward: number;
  timeLimitSeconds?: number;
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
  strengths: string[];
  weaknesses: string[];
  recommendedPath: string;
  estimatedLevel?: EnglishLevel;
  completedAt: string;
}

export interface DailyGoal {
  date: string;
  wordsLearned: number;
  targetWords: number;
  aiPracticeDone: boolean;
  quizCompleted: boolean;
  completed: boolean;
}

export interface LearningProgress {
  userId: string;
  level: EnglishLevel;
  totalXp: number;
  streakDays: number;
  learnedWordIds: string[];
  completedQuizIds: string[];
  completedLessonIds: string[];
  todayGoal: DailyGoal;
  recentActivity: {
    id: string;
    type: 'word' | 'quiz' | 'ai_chat' | 'placement' | 'video';
    title: string;
    timestamp: string;
    xpEarned: number;
  }[];
  weakTopics: string[];
  recommendedLessons: {
    id: string;
    titleFa: string;
    titleEn: string;
    type: 'vocabulary' | 'grammar' | 'conversation' | 'quiz';
    reasonFa: string;
  }[];
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  translation?: string;
  correction?: {
    original: string;
    corrected: string;
    explanationFa: string;
  };
  audioUrl?: string;
  timestamp: string;
}

export interface AIConversationScenario {
  id: string;
  titleEn: string;
  titleFa: string;
  descriptionEn: string;
  descriptionFa: string;
  icon: string;
  level: 'beginner' | 'intermediate';
  aiRoleEn: string;
  aiRoleFa: string;
  userRoleEn: string;
  userRoleFa: string;
  starterMessageEn: string;
  starterMessageFa: string;
  suggestedPhrases: { en: string; fa: string }[];
}

export interface AIConversationReport {
  id: string;
  scenarioTitle: string;
  userLevel: EnglishLevel;
  totalMessages: number;
  strengths: string[];
  mistakes: { original: string; corrected: string; explanationFa: string }[];
  newVocabulary: { word: string; meaningFa: string; context: string }[];
  betterSentences: { original: string; better: string; why: string }[];
  recommendedPractice: string[];
  score: number; // 1-100
}

export interface CommunityRoom {
  id: string;
  slug: string;
  nameEn: string;
  nameFa: string;
  descriptionEn: string;
  descriptionFa: string;
  icon: string;
  isPublic: boolean;
  postCount: number;
  color: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorLevel: EnglishLevel;
  content: string;
  createdAt: string;
  likes: number;
}

export interface CommunityPost {
  id: string;
  roomId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorLevel: EnglishLevel;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  comments?: CommunityComment[];
  isPinned?: boolean;
  isModerated?: boolean;
  createdAt: string;
}

export interface ModerationReport {
  id: string;
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  targetContent: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface SubtitleItem {
  id: string;
  startTime: number; // in seconds
  endTime: number;
  textEn: string;
  textFa: string;
  keyWords?: { word: string; meaningFa: string }[];
}

export type VideoSubtitle = SubtitleItem;

export interface VideoContent {
  id: string;
  titleEn: string;
  titleFa: string;
  descriptionEn: string;
  descriptionFa: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  level: EnglishLevel;
  category: 'movie' | 'animation' | 'interview' | 'daily';
  subtitles: SubtitleItem[];
  keyPhrases: {
    en: string;
    fa: string;
    explanation: string;
  }[];
}

export interface Achievement {
  id: string;
  code: string;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  descriptionEn: string;
  icon: string;
  targetCount: number;
  currentCount: number;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'daily_reminder' | 'quiz_result' | 'achievement' | 'streak' | 'community';
  titleFa: string;
  titleEn: string;
  messageFa: string;
  messageEn: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface DictionaryEntry {
  word: string;
  pronunciation: string;
  audioUrl?: string;
  partOfSpeech: string;
  persianMeaning: string;
  englishDefinition: string;
  difficulty: 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced';
  examples: { en: string; fa: string }[];
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  tipsFa: string;
}
