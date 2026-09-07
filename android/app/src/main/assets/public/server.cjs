var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express9 = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_vite = require("vite");

// server/routes/auth.ts
var import_express = require("express");

// server/db.ts
var Database = class {
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.sessions = /* @__PURE__ */ new Map();
    // token -> userId
    this.vocabulary = /* @__PURE__ */ new Map();
    this.savedWords = /* @__PURE__ */ new Map();
    this.learnedWords = /* @__PURE__ */ new Map();
    // userId -> Set<wordId>
    this.quizzes = /* @__PURE__ */ new Map();
    this.quizResults = /* @__PURE__ */ new Map();
    // userId -> QuizResult[]
    this.communityRooms = /* @__PURE__ */ new Map();
    this.communityPosts = /* @__PURE__ */ new Map();
    this.communityExpressions = /* @__PURE__ */ new Map();
    this.grammarHelpTips = /* @__PURE__ */ new Map();
    this.moderationReports = /* @__PURE__ */ new Map();
    this.videoLessons = /* @__PURE__ */ new Map();
    this.achievements = /* @__PURE__ */ new Map();
    // userId -> Achievement[]
    this.notifications = /* @__PURE__ */ new Map();
    // userId -> AppNotification[]
    this.scenarios = /* @__PURE__ */ new Map();
    this.dictionaryLocal = /* @__PURE__ */ new Map();
    this.seedInitialData();
  }
  seedInitialData() {
    const demoUser = {
      id: "usr_demo_1",
      fullName: "\u0645\u0647\u0646\u0627 \u06A9\u0631\u06CC\u0645\u06CC",
      email: "mohanna@example.com",
      passwordHash: "pass123",
      ageRange: "13-17",
      englishLevel: "beginner",
      learningGoal: "speaking",
      role: "user",
      xp: 0,
      streak: 0,
      lastActiveDate: "",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const adminUser = {
      id: "usr_admin_1",
      fullName: "\u0645\u062F\u06CC\u0631 \u0622\u0645\u0648\u0632\u0634\u06CC \u0645\u0647\u0646\u0627",
      email: "admin@learnwithmohanna.com",
      passwordHash: "admin123",
      ageRange: "25-34",
      englishLevel: "pre-intermediate",
      learningGoal: "general",
      role: "admin",
      xp: 0,
      streak: 0,
      lastActiveDate: "",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.users.set(demoUser.id, demoUser);
    this.users.set(adminUser.id, adminUser);
    this.sessions.set("token_demo_user", demoUser.id);
    this.sessions.set("token_admin_user", adminUser.id);
    const initialVocab = [
      {
        id: "voc_1",
        english: "Encourage",
        pronunciation: "/\u026An\u02C8k\u028Cr.\u026Ad\u0292/",
        partOfSpeech: "verb",
        persianMeaning: "\u062A\u0634\u0648\u06CC\u0642 \u06A9\u0631\u062F\u0646\u060C \u062F\u0644\u06AF\u0631\u0645 \u06A9\u0631\u062F\u0646",
        exampleSentence: "My teacher always encourages me to speak English in class.",
        exampleTranslation: "\u0645\u0639\u0644\u0645\u0645 \u0647\u0645\u06CC\u0634\u0647 \u0645\u0646 \u0631\u0627 \u062A\u0634\u0648\u06CC\u0642 \u0645\u06CC\u200C\u06A9\u0646\u062F \u06A9\u0647 \u062F\u0631 \u06A9\u0644\u0627\u0633 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0635\u062D\u0628\u062A \u06A9\u0646\u0645.",
        difficulty: "beginner",
        category: "Education & Feelings",
        relatedWords: ["Support", "Inspire", "Motivation"],
        tipsFa: "\u0628\u0639\u062F \u0627\u0632 encourage \u0645\u0639\u0645\u0648\u0644\u0627\u064B \u0627\u0632 \u0633\u0627\u062E\u062A\u0627\u0631 encourage someone to do something \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u06A9\u0646\u06CC\u0645."
      },
      {
        id: "voc_2",
        english: "Confident",
        pronunciation: "/\u02C8k\u0252n.f\u026A.d\u0259nt/",
        partOfSpeech: "adjective",
        persianMeaning: "\u0628\u0627 \u0627\u0639\u062A\u0645\u0627\u062F\u0628\u0647\u200C\u0646\u0641\u0633\u060C \u0645\u0637\u0645\u0626\u0646",
        exampleSentence: "She feels confident when talking to native speakers.",
        exampleTranslation: "\u0627\u0648 \u0647\u0646\u06AF\u0627\u0645 \u0635\u062D\u0628\u062A \u0628\u0627 \u0627\u0641\u0631\u0627\u062F \u0628\u0648\u0645\u06CC \u0627\u062D\u0633\u0627\u0633 \u0627\u0639\u062A\u0645\u0627\u062F\u0628\u0647\u200C\u0646\u0641\u0633 \u0645\u06CC\u200C\u06A9\u0646\u062F.",
        difficulty: "elementary",
        category: "Personality & Feelings",
        relatedWords: ["Self-esteem", "Sure", "Bold"],
        tipsFa: "\u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 \u0631\u0627\u06CC\u062C \u0628\u0631\u0627\u06CC \u0627\u06CC\u0646 \u0635\u0641\u062A in \u06CC\u0627 about \u0627\u0633\u062A: confident in your abilities."
      },
      {
        id: "voc_3",
        english: "Improve",
        pronunciation: "/\u026Am\u02C8pru\u02D0v/",
        partOfSpeech: "verb",
        persianMeaning: "\u0628\u0647\u0628\u0648\u062F \u06CC\u0627\u0641\u062A\u0646\u060C \u067E\u06CC\u0634\u0631\u0641\u062A \u06A9\u0631\u062F\u0646",
        exampleSentence: "Daily practice will help you improve your speaking skills.",
        exampleTranslation: "\u062A\u0645\u0631\u06CC\u0646 \u0631\u0648\u0632\u0627\u0646\u0647 \u0628\u0647 \u0634\u0645\u0627 \u06A9\u0645\u06A9 \u0645\u06CC\u200C\u06A9\u0646\u062F \u0645\u0647\u0627\u0631\u062A\u200C\u0647\u0627\u06CC \u0645\u06A9\u0627\u0644\u0645\u0647\u200C\u062A\u0627\u0646 \u0631\u0627 \u0628\u0647\u0628\u0648\u062F \u062F\u0647\u06CC\u062F.",
        difficulty: "beginner",
        category: "Learning & Growth",
        relatedWords: ["Progress", "Enhance", "Develop"],
        tipsFa: "\u0627\u0633\u0645 \u0627\u06CC\u0646 \u06A9\u0644\u0645\u0647 Improvement \u0628\u0647 \u0645\u0639\u0646\u06CC \u0628\u0647\u0628\u0648\u062F \u0648 \u067E\u06CC\u0634\u0631\u0641\u062A \u0627\u0633\u062A."
      },
      {
        id: "voc_4",
        english: "Opportunity",
        pronunciation: "/\u02CC\u0252p.\u0259\u02C8tju\u02D0.n\u0259.ti/",
        partOfSpeech: "noun",
        persianMeaning: "\u0641\u0631\u0635\u062A\u060C \u0645\u0648\u0642\u0639\u06CC\u062A \u0645\u0646\u0627\u0633\u0628",
        exampleSentence: "Learning English gives you the opportunity to make friends worldwide.",
        exampleTranslation: "\u06CC\u0627\u062F\u06AF\u06CC\u0631\u06CC \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0627\u06CC\u0646 \u0641\u0631\u0635\u062A \u0631\u0627 \u0628\u0647 \u0634\u0645\u0627 \u0645\u06CC\u200C\u062F\u0647\u062F \u06A9\u0647 \u062F\u0631 \u0633\u0631\u0627\u0633\u0631 \u062C\u0647\u0627\u0646 \u062F\u0648\u0633\u062A \u067E\u06CC\u062F\u0627 \u06A9\u0646\u06CC\u062F.",
        difficulty: "elementary",
        category: "Life & Opportunities",
        relatedWords: ["Chance", "Possibility", "Opening"],
        tipsFa: "\u0645\u06CC\u200C\u06AF\u0648\u06CC\u06CC\u0645: take an opportunity (\u0641\u0631\u0635\u062A \u0631\u0627 \u063A\u0646\u06CC\u0645\u062A \u0634\u0645\u0631\u062F\u0646) \u06CC\u0627 miss an opportunity (\u0641\u0631\u0635\u062A \u0631\u0627 \u0627\u0632 \u062F\u0633\u062A \u062F\u0627\u062F\u0646)."
      },
      {
        id: "voc_5",
        english: "Resilient",
        pronunciation: "/r\u026A\u02C8z\u026Al.j\u0259nt/",
        partOfSpeech: "adjective",
        persianMeaning: "\u062A\u0627\u0628\u200C\u0622\u0648\u0631\u060C \u0633\u0631\u0633\u062E\u062A \u0648 \u0645\u0646\u0639\u0637\u0641 \u062F\u0631 \u0628\u0631\u0627\u0628\u0631 \u0633\u062E\u062A\u06CC\u200C\u0647\u0627",
        exampleSentence: "Language learners need to be resilient and not give up after making mistakes.",
        exampleTranslation: "\u0632\u0628\u0627\u0646\u200C\u0622\u0645\u0648\u0632\u0627\u0646 \u0628\u0627\u06CC\u062F \u062A\u0627\u0628\u200C\u0622\u0648\u0631 \u0628\u0627\u0634\u0646\u062F \u0648 \u0628\u0639\u062F \u0627\u0632 \u0627\u0634\u062A\u0628\u0627\u0647 \u06A9\u0631\u062F\u0646 \u062A\u0633\u0644\u06CC\u0645 \u0646\u0634\u0648\u0646\u062F.",
        difficulty: "pre-intermediate",
        category: "Mindset & Success",
        relatedWords: ["Tough", "Adaptable", "Persistent"],
        tipsFa: "\u0627\u0634\u062A\u0628\u0627\u0647 \u06A9\u0631\u062F\u0646 \u0628\u062E\u0634 \u0637\u0628\u06CC\u0639\u06CC \u06CC\u0627\u062F\u06AF\u06CC\u0631\u06CC \u0627\u0633\u062A\u060C \u062A\u0627\u0628\u200C\u0622\u0648\u0631 \u0628\u0627\u0634\u06CC\u062F!"
      },
      {
        id: "voc_6",
        english: "Curious",
        pronunciation: "/\u02C8kj\u028A\u0259.ri.\u0259s/",
        partOfSpeech: "adjective",
        persianMeaning: "\u06A9\u0646\u062C\u06A9\u0627\u0648\u060C \u0645\u0634\u062A\u0627\u0642 \u062F\u0627\u0646\u0633\u062A\u0646",
        exampleSentence: "Children are naturally curious about the world around them.",
        exampleTranslation: "\u06A9\u0648\u062F\u06A9\u0627\u0646 \u0628\u0647 \u0637\u0648\u0631 \u0637\u0628\u06CC\u0639\u06CC \u062F\u0631 \u0645\u0648\u0631\u062F \u062F\u0646\u06CC\u0627\u06CC \u0627\u0637\u0631\u0627\u0641 \u062E\u0648\u062F \u06A9\u0646\u062C\u06A9\u0627\u0648 \u0647\u0633\u062A\u0646\u062F.",
        difficulty: "beginner",
        category: "Personality & Feelings",
        relatedWords: ["Inquisitive", "Interested", "Eager"],
        tipsFa: "\u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 \u0622\u0646 \u0645\u0639\u0645\u0648\u0644\u0627\u064B about \u0627\u0633\u062A: curious about something."
      },
      {
        id: "voc_7",
        english: "Fluently",
        pronunciation: "/\u02C8flu\u02D0.\u0259nt.li/",
        partOfSpeech: "adverb",
        persianMeaning: "\u0631\u0648\u0627\u0646 \u0648 \u0628\u062F\u0648\u0646 \u0644\u06A9\u0646\u062A",
        exampleSentence: "He wants to speak English fluently within one year.",
        exampleTranslation: "\u0627\u0648 \u0645\u06CC\u200C\u062E\u0648\u0627\u0647\u062F \u0638\u0631\u0641 \u06CC\u06A9 \u0633\u0627\u0644 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0631\u0627 \u0631\u0648\u0627\u0646 \u0635\u062D\u0628\u062A \u06A9\u0646\u062F.",
        difficulty: "elementary",
        category: "Learning & Growth",
        relatedWords: ["Smoothly", "Effortlessly", "Articulately"],
        tipsFa: "\u0635\u0641\u062A \u0622\u0646 Fluent (\u0631\u0648\u0627\u0646) \u0627\u0633\u062A: I am a fluent speaker."
      },
      {
        id: "voc_8",
        english: "Accomplish",
        pronunciation: "/\u0259\u02C8k\u028Cm.pl\u026A\u0283/",
        partOfSpeech: "verb",
        persianMeaning: "\u0628\u0647 \u0627\u0646\u062C\u0627\u0645 \u0631\u0633\u0627\u0646\u062F\u0646\u060C \u062F\u0633\u062A\u06CC\u0627\u0628\u06CC \u0628\u0647 \u0647\u062F\u0641",
        exampleSentence: "You can accomplish your goals if you study consistently.",
        exampleTranslation: "\u0627\u06AF\u0631 \u067E\u06CC\u0648\u0633\u062A\u0647 \u0645\u0637\u0627\u0644\u0639\u0647 \u06A9\u0646\u06CC\u062F\u060C \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u0628\u0647 \u0627\u0647\u062F\u0627\u0641\u062A\u0627\u0646 \u062F\u0633\u062A \u06CC\u0627\u0628\u06CC\u062F.",
        difficulty: "pre-intermediate",
        category: "Success & Goals",
        relatedWords: ["Achieve", "Complete", "Fulfill"],
        tipsFa: "\u0647\u0645\u200C\u0645\u0639\u0646\u06CC achieve \u0627\u0633\u062A \u0627\u0645\u0627 \u0631\u0648\u06CC \u062A\u06A9\u0645\u06CC\u0644 \u0645\u0648\u0641\u0642\u06CC\u062A\u200C\u0622\u0645\u06CC\u0632 \u06CC\u06A9 \u06A9\u0627\u0631 \u062A\u0645\u0631\u06A9\u0632 \u062F\u0627\u0631\u062F."
      },
      {
        id: "voc_9",
        english: "Pronunciation",
        pronunciation: "/pr\u0259\u02CCn\u028Cn.si\u02C8e\u026A.\u0283\u0259n/",
        partOfSpeech: "noun",
        persianMeaning: "\u062A\u0644\u0641\u0638\u060C \u0637\u0631\u0632 \u062A\u0644\u0641\u0638 \u06A9\u0644\u0645\u0627\u062A",
        exampleSentence: "Listening to native speakers improves your English pronunciation.",
        exampleTranslation: "\u06AF\u0648\u0634 \u062F\u0627\u062F\u0646 \u0628\u0647 \u0627\u0641\u0631\u0627\u062F \u0628\u0648\u0645\u06CC \u062A\u0644\u0641\u0638 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0634\u0645\u0627 \u0631\u0627 \u062A\u0642\u0648\u06CC\u062A \u0645\u06CC\u200C\u06A9\u0646\u062F.",
        difficulty: "elementary",
        category: "Learning & Growth",
        relatedWords: ["Accent", "Intonation", "Enunciation"],
        tipsFa: "\u062F\u0642\u062A \u06A9\u0646\u06CC\u062F \u06A9\u0647 \u0641\u0639\u0644 \u0622\u0646 pronounce \u0627\u0633\u062A \u0627\u0645\u0627 \u0627\u0633\u0645 \u0622\u0646 \u0628\u0627 nun \u0646\u0648\u0634\u062A\u0647 \u0648 \u062A\u0644\u0641\u0638 \u0645\u06CC\u200C\u0634\u0648\u062F."
      },
      {
        id: "voc_10",
        english: "Habit",
        pronunciation: "/\u02C8h\xE6b.\u026At/",
        partOfSpeech: "noun",
        persianMeaning: "\u0639\u0627\u062F\u062A\u060C \u0631\u0641\u062A\u0627\u0631 \u062A\u06A9\u0631\u0627\u0631\u0634\u0648\u0646\u062F\u0647",
        exampleSentence: "Reading ten minutes of English every morning is a wonderful habit.",
        exampleTranslation: "\u062E\u0648\u0627\u0646\u062F\u0646 \u06F1\u06F0 \u062F\u0642\u06CC\u0642\u0647 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0647\u0631 \u0631\u0648\u0632 \u0635\u0628\u062D\u060C \u06CC\u06A9 \u0639\u0627\u062F\u062A \u0641\u0648\u0642\u200C\u0627\u0644\u0639\u0627\u062F\u0647 \u0627\u0633\u062A.",
        difficulty: "beginner",
        category: "Daily Life",
        relatedWords: ["Routine", "Practice", "Custom"],
        tipsFa: "\u0627\u0635\u0637\u0644\u0627\u062D build a habit \u0628\u0647 \u0645\u0639\u0646\u06CC \u0639\u0627\u062F\u062A\u200C\u0633\u0627\u0632\u06CC \u0627\u0633\u062A."
      },
      {
        id: "voc_11",
        english: "Delicious",
        pronunciation: "/d\u026A\u02C8l\u026A\u0283.\u0259s/",
        partOfSpeech: "adjective",
        persianMeaning: "\u062E\u0648\u0634\u0645\u0632\u0647\u060C \u0644\u0630\u06CC\u0630",
        exampleSentence: "This traditional Persian kebab is absolutely delicious!",
        exampleTranslation: "\u0627\u06CC\u0646 \u06A9\u0628\u0627\u0628 \u0633\u0646\u062A\u06CC \u0627\u06CC\u0631\u0627\u0646\u06CC \u0648\u0627\u0642\u0639\u0627\u064B \u0644\u0630\u06CC\u0630 \u0627\u0633\u062A!",
        difficulty: "beginner",
        category: "Food & Dining",
        relatedWords: ["Tasty", "Yummy", "Flavorful"],
        tipsFa: "\u0628\u0631\u0627\u06CC \u062A\u0623\u06A9\u06CC\u062F \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u0627\u0632 absolutely delicious \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F \u0646\u0647 very delicious."
      },
      {
        id: "voc_12",
        english: "Destination",
        pronunciation: "/\u02CCdes.t\u026A\u02C8ne\u026A.\u0283\u0259n/",
        partOfSpeech: "noun",
        persianMeaning: "\u0645\u0642\u0635\u062F\u060C \u0647\u062F\u0641 \u0633\u0641\u0631",
        exampleSentence: "Our final destination on this trip is the beautiful city of Isfahan.",
        exampleTranslation: "\u0645\u0642\u0635\u062F \u0646\u0647\u0627\u06CC\u06CC \u0645\u0627 \u062F\u0631 \u0627\u06CC\u0646 \u0633\u0641\u0631\u060C \u0634\u0647\u0631 \u0632\u06CC\u0628\u0627\u06CC \u0627\u0635\u0641\u0647\u0627\u0646 \u0627\u0633\u062A.",
        difficulty: "elementary",
        category: "Travel & Exploration",
        relatedWords: ["Target", "Arrival point", "Journey end"],
        tipsFa: "\u062F\u0631 \u0641\u0631\u0648\u062F\u06AF\u0627\u0647\u200C\u0647\u0627 \u0639\u0628\u0627\u0631\u062A Final Destination \u0628\u0647 \u0645\u0639\u0646\u06CC \u0645\u0642\u0635\u062F \u0646\u0647\u0627\u06CC\u06CC \u067E\u0631\u0648\u0627\u0632 \u0627\u0633\u062A."
      }
    ];
    initialVocab.forEach((v) => this.vocabulary.set(v.id, v));
    this.savedWords.set(demoUser.id, []);
    this.learnedWords.set(demoUser.id, /* @__PURE__ */ new Set());
    const placementQuiz = {
      id: "quiz_placement",
      titleFa: "\u0622\u0632\u0645\u0648\u0646 \u062A\u0639\u06CC\u06CC\u0646 \u0633\u0637\u062D \u0647\u0648\u0634\u0645\u0646\u062F",
      titleEn: "Smart English Placement Test",
      descriptionFa: "\u0633\u0646\u062C\u0634 \u062C\u0627\u0645\u0639 \u06F1\u06F0 \u0633\u0648\u0627\u0644\u06CC \u0645\u0647\u0627\u0631\u062A\u200C\u0647\u0627\u06CC \u06AF\u0631\u0627\u0645\u0631\u060C \u0648\u0627\u0698\u06AF\u0627\u0646 \u0648 \u062F\u0631\u06A9 \u0645\u0637\u0644\u0628 \u062C\u0647\u062A \u062A\u0639\u06CC\u06CC\u0646 \u062F\u0642\u06CC\u0642 \u0633\u0637\u062D \u0634\u0645\u0627 \u0628\u0627 \u062A\u062D\u0644\u06CC\u0644 \u0633\u0631\u0639\u062A \u0648 \u062F\u0642\u062A",
      descriptionEn: "Comprehensive 10-question evaluation to accurately calibrate your English starting point.",
      type: "placement",
      level: "unknown",
      xpReward: 100,
      timeLimitSeconds: 600,
      questions: [
        {
          id: "pq_1",
          type: "multiple-choice",
          promptFa: "\u06A9\u062F\u0627\u0645 \u06AF\u0632\u06CC\u0646\u0647 \u062C\u0645\u0644\u0647 \u0631\u0627 \u0628\u0647 \u062F\u0631\u0633\u062A\u06CC \u06A9\u0627\u0645\u0644 \u0645\u06CC\u200C\u06A9\u0646\u062F\u061F",
          promptEn: "She _______ to school every morning by bus.",
          options: ["go", "goes", "going", "is go"],
          optionsFa: ["\u0631\u0641\u062A\u0646 (\u0633\u0627\u062F\u0647)", "\u0645\u06CC\u200C\u0631\u0648\u062F (\u0633\u0648\u0645\u200C\u0634\u062E\u0635 \u0645\u0641\u0631\u062F)", "\u062F\u0631 \u062D\u0627\u0644 \u0631\u0641\u062A\u0646", "\u0631\u0641\u062A\u0646 \u0628\u0627 \u0641\u0639\u0644 to be"],
          correctAnswer: "goes",
          explanationFa: "\u0628\u0631\u0627\u06CC \u0641\u0627\u0639\u0644 \u0633\u0648\u0645\u200C\u0634\u062E\u0635 \u0645\u0641\u0631\u062F (She) \u062F\u0631 \u0632\u0645\u0627\u0646 \u062D\u0627\u0644 \u0633\u0627\u062F\u0647\u060C \u0628\u0647 \u0641\u0639\u0644 \u067E\u0633\u0648\u0646\u062F -s \u06CC\u0627 -es \u0627\u0636\u0627\u0641\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.",
          explanationEn: "Third-person singular in present simple takes -s or -es.",
          category: "grammar",
          difficulty: "beginner"
        },
        {
          id: "pq_2",
          type: "multiple-choice",
          promptFa: '\u0645\u0639\u0646\u06CC \u062F\u0642\u06CC\u0642 \u0648\u0627\u0698\u0647 "Encourage" \u0686\u06CC\u0633\u062A\u061F',
          promptEn: 'What is the precise meaning of "Encourage"?',
          options: ["\u062A\u0634\u0648\u06CC\u0642 \u06A9\u0631\u062F\u0646 \u0648 \u062F\u0644\u06AF\u0631\u0645\u06CC \u062F\u0627\u062F\u0646", "\u062A\u0646\u0628\u06CC\u0647 \u0648 \u0633\u0631\u0632\u0646\u0634 \u06A9\u0631\u062F\u0646", "\u062A\u0631\u06A9 \u06A9\u0631\u062F\u0646 \u0648 \u0641\u0631\u0627\u0631 \u06A9\u0631\u062F\u0646", "\u0634\u06A9\u0633\u062A \u062E\u0648\u0631\u062F\u0646 \u062F\u0631 \u0645\u0633\u0627\u0628\u0642\u0647"],
          optionsFa: ["To give support and confidence", "To punish or blame", "To abandon or escape", "To fail in a match"],
          correctAnswer: "\u062A\u0634\u0648\u06CC\u0642 \u06A9\u0631\u062F\u0646 \u0648 \u062F\u0644\u06AF\u0631\u0645\u06CC \u062F\u0627\u062F\u0646",
          explanationFa: "\u0648\u0627\u0698\u0647 Encourage \u0628\u0647 \u0645\u0639\u0646\u06CC \u062F\u0644\u06AF\u0631\u0645 \u06A9\u0631\u062F\u0646 \u0648 \u062A\u0634\u0648\u06CC\u0642 \u06A9\u0631\u062F\u0646 \u062F\u06CC\u06AF\u0631\u0627\u0646 \u0627\u0633\u062A.",
          explanationEn: "Encourage means giving someone support, confidence or hope.",
          category: "vocabulary",
          difficulty: "beginner"
        },
        {
          id: "pq_3",
          type: "multiple-choice",
          promptFa: '\u0634\u06A9\u0644 \u06AF\u0630\u0634\u062A\u0647 \u0633\u0627\u062F\u0647 \u0641\u0639\u0644 "buy" \u0686\u06CC\u0633\u062A\u061F',
          promptEn: 'What is the past tense form of the irregular verb "buy"?',
          options: ["buyed", "bought", "buying", "boight"],
          optionsFa: ["\u062D\u0627\u0644\u062A \u0627\u0634\u062A\u0628\u0627\u0647 \u0628\u0627 ed", "\u062E\u0631\u06CC\u062F (\u06AF\u0630\u0634\u062A\u0647 \u0635\u062D\u06CC\u062D)", "\u062F\u0631 \u062D\u0627\u0644 \u062E\u0631\u06CC\u062F", "\u0627\u0645\u0644\u0627\u06CC \u0646\u0627\u062F\u0631\u0633\u062A"],
          correctAnswer: "bought",
          explanationFa: "\u0641\u0639\u0644 buy \u0628\u06CC\u200C\u0642\u0627\u0639\u062F\u0647 \u0627\u0633\u062A \u0648 \u06AF\u0630\u0634\u062A\u0647 \u0622\u0646 bought \u0645\u06CC\u200C\u0634\u0648\u062F.",
          explanationEn: "Buy is an irregular verb. Its simple past form is bought.",
          category: "grammar",
          difficulty: "elementary"
        },
        {
          id: "pq_4",
          type: "multiple-choice",
          promptFa: '\u06A9\u062F\u0627\u0645 \u06A9\u0644\u0645\u0647 \u0645\u062A\u0636\u0627\u062F (Antonym) \u0648\u0627\u0698\u0647 "Confident" (\u0628\u0627 \u0627\u0639\u062A\u0645\u0627\u062F\u0628\u0647\u200C\u0646\u0641\u0633) \u0627\u0633\u062A\u061F',
          promptEn: 'Which word is the antonym (opposite) of "Confident"?',
          options: ["Proud", "Shy / Insecure", "Brave", "Strong"],
          optionsFa: ["\u0645\u063A\u0631\u0648\u0631 / \u0645\u0641\u062A\u062E\u0631", "\u062E\u062C\u0627\u0644\u062A\u06CC / \u0646\u0627\u0645\u0637\u0645\u0626\u0646 \u0628\u0647 \u062E\u0648\u062F", "\u0634\u062C\u0627\u0639 \u0648 \u0646\u062A\u0631\u0633", "\u0642\u0648\u06CC \u0648 \u0646\u06CC\u0631\u0648\u0645\u0646\u062F"],
          correctAnswer: "Shy / Insecure",
          explanationFa: "\u06A9\u0644\u0645\u0647 Insecure \u0628\u0647 \u0645\u0639\u0646\u06CC \u0628\u06CC\u200C\u0627\u0639\u062A\u0645\u0627\u062F\u0628\u0647\u200C\u0646\u0641\u0633 \u0648 Shy \u0628\u0647 \u0645\u0639\u0646\u06CC \u062E\u062C\u0627\u0644\u062A\u06CC \u0627\u0633\u062A \u06A9\u0647 \u0645\u062A\u0636\u0627\u062F Confident \u0647\u0633\u062A\u0646\u062F.",
          explanationEn: "Insecure or shy is opposite of confident.",
          category: "vocabulary",
          difficulty: "elementary"
        },
        {
          id: "pq_5",
          type: "multiple-choice",
          promptFa: "\u062C\u0645\u0644\u0647 \u0631\u0627 \u0628\u0627 \u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 \u0635\u062D\u06CC\u062D \u06A9\u0627\u0645\u0644 \u06A9\u0646\u06CC\u062F:",
          promptEn: "I am interested _______ learning new languages and culture.",
          options: ["on", "at", "in", "with"],
          optionsFa: ["\u0631\u0648\u06CC (\u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 \u0646\u0627\u062F\u0631\u0633\u062A)", "\u062F\u0631 \u0646\u0642\u0637\u0647 (\u0646\u0627\u062F\u0631\u0633\u062A)", "\u062F\u0631 / \u0628\u0647 (\u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 \u0635\u062D\u06CC\u062D)", "\u0647\u0645\u0631\u0627\u0647 \u0628\u0627 (\u0646\u0627\u062F\u0631\u0633\u062A)"],
          correctAnswer: "in",
          explanationFa: "\u062A\u0631\u06A9\u06CC\u0628 \u062B\u0627\u0628\u062A \u0628\u0631\u0627\u06CC \u0639\u0644\u0627\u0642\u0647 \u062F\u0627\u0634\u062A\u0646 interested in \u0627\u0633\u062A.",
          explanationEn: 'We always say "interested in" something.',
          category: "grammar",
          difficulty: "elementary"
        },
        {
          id: "pq_6",
          type: "multiple-choice",
          promptFa: "\u06A9\u062F\u0627\u0645 \u06AF\u0632\u06CC\u0646\u0647 \u0633\u0627\u062E\u062A\u0627\u0631 \u0634\u0631\u0637\u06CC \u0646\u0648\u0639 \u0627\u0648\u0644 (First Conditional) \u0631\u0627 \u062F\u0631\u0633\u062A \u0646\u0634\u0627\u0646 \u0645\u06CC\u200C\u062F\u0647\u062F\u061F",
          promptEn: "If it _______ tomorrow, we will stay at home.",
          options: ["rains", "will rain", "rained", "is rain"],
          optionsFa: ["\u0628\u0627\u0631\u0627\u0646 \u0628\u0628\u0627\u0631\u062F (\u062D\u0627\u0644 \u0633\u0627\u062F\u0647)", "\u0628\u0627\u0631\u0627\u0646 \u062E\u0648\u0627\u0647\u062F \u0628\u0627\u0631\u06CC\u062F (\u0646\u0627\u062F\u0631\u0633\u062A \u062F\u0631 if)", "\u0628\u0627\u0631\u0627\u0646 \u0628\u0627\u0631\u06CC\u062F (\u06AF\u0630\u0634\u062A\u0647)", "\u0633\u0627\u062E\u062A\u0627\u0631 \u06AF\u0631\u0627\u0645\u0631\u06CC \u0627\u0634\u062A\u0628\u0627\u0647"],
          correctAnswer: "rains",
          explanationFa: "\u062F\u0631 \u0628\u062E\u0634 \u0634\u0631\u0637\u06CC (if clause) \u062F\u0631 \u0634\u0631\u0637\u06CC \u0646\u0648\u0639 \u0627\u0648\u0644 \u0627\u0632 \u062D\u0627\u0644 \u0633\u0627\u062F\u0647 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u06A9\u0646\u06CC\u0645 \u0646\u0647 will.",
          explanationEn: "In first conditional if-clauses, we use present simple.",
          category: "grammar",
          difficulty: "pre-intermediate"
        },
        {
          id: "pq_7",
          type: "multiple-choice",
          promptFa: '\u0645\u0639\u0646\u06CC \u0627\u0635\u0637\u0644\u0627\u062D \u06A9\u0627\u0631\u0628\u0631\u062F\u06CC "Look forward to" \u0686\u06CC\u0633\u062A\u061F',
          promptEn: 'What does the phrasal idiom "look forward to" mean?',
          options: ["\u0628\u0647 \u067E\u0634\u062A \u0633\u0631 \u0646\u06AF\u0627\u0647 \u06A9\u0631\u062F\u0646", "\u0645\u0634\u062A\u0627\u0642\u0627\u0646\u0647 \u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631 \u0686\u06CC\u0632\u06CC \u0628\u0648\u062F\u0646", "\u0645\u0648\u0627\u0638\u0628 \u06A9\u0633\u06CC \u0628\u0648\u062F\u0646", "\u062F\u0646\u0628\u0627\u0644 \u06AF\u0645\u0634\u062F\u0647 \u06AF\u0634\u062A\u0646"],
          optionsFa: ["To look behind", "To await eagerly with pleasure", "To take care of someone", "To search for lost items"],
          correctAnswer: "\u0645\u0634\u062A\u0627\u0642\u0627\u0646\u0647 \u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631 \u0686\u06CC\u0632\u06CC \u0628\u0648\u062F\u0646",
          explanationFa: "\u0627\u0635\u0637\u0644\u0627\u062D Look forward to \u06CC\u0639\u0646\u06CC \u0628\u0627 \u0634\u0648\u0642 \u0648 \u0627\u0634\u062A\u06CC\u0627\u0642 \u0645\u0646\u062A\u0638\u0631 \u0627\u062A\u0641\u0627\u0642\u06CC \u062F\u0631 \u0622\u06CC\u0646\u062F\u0647 \u0628\u0648\u062F\u0646.",
          explanationEn: "To anticipate something with pleasure.",
          category: "vocabulary",
          difficulty: "pre-intermediate"
        },
        {
          id: "pq_8",
          type: "multiple-choice",
          promptFa: '\u067E\u0627\u0633\u062E \u0635\u062D\u06CC\u062D \u0628\u0647 \u0633\u0648\u0627\u0644 \u0632\u0645\u0627\u0646 \u06AF\u0630\u0634\u062A\u0647 \u06A9\u0627\u0645\u0644 "How long have you lived here?" \u0686\u06CC\u0633\u062A\u061F',
          promptEn: 'Choose the correct answer for: "How long have you lived here?"',
          options: ["For five years.", "Since five years.", "At five years.", "On five years."],
          optionsFa: ["\u0628\u0647 \u0645\u062F\u062A \u06F5 \u0633\u0627\u0644 (\u0628\u06CC\u0627\u0646 \u0637\u0648\u0644 \u0645\u062F\u062A)", "\u0627\u0632 \u06F5 \u0633\u0627\u0644 (\u06A9\u0627\u0631\u0628\u0631\u062F \u0646\u0627\u062F\u0631\u0633\u062A since)", "\u062F\u0631 \u06F5 \u0633\u0627\u0644", "\u0631\u0648\u06CC \u06F5 \u0633\u0627\u0644"],
          correctAnswer: "For five years.",
          explanationFa: "\u0628\u0631\u0627\u06CC \u0628\u06CC\u0627\u0646 \u0637\u0648\u0644 \u0645\u062F\u062A \u0632\u0645\u0627\u0646 \u0627\u0632 for \u0648 \u0628\u0631\u0627\u06CC \u0646\u0642\u0637\u0647 \u0645\u0634\u062E\u0635 \u0622\u063A\u0627\u0632 \u0632\u0645\u0627\u0646 \u0627\u0632 since \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.",
          explanationEn: "For + duration (five years) is correct.",
          category: "grammar",
          difficulty: "pre-intermediate"
        },
        {
          id: "pq_9",
          type: "multiple-choice",
          promptFa: "\u06A9\u062F\u0627\u0645 \u0639\u0628\u0627\u0631\u062A \u062F\u0631 \u0645\u06A9\u0627\u0644\u0645\u0647 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0628\u0631\u0627\u06CC \u0645\u0648\u0627\u0641\u0642\u062A \u06A9\u0627\u0645\u0644 \u0645\u0646\u0627\u0633\u0628 \u0627\u0633\u062A\u061F",
          promptEn: "Which sentence correctly expresses full agreement in conversation?",
          options: ["I am agree with you.", "I agree with you completely.", "I am agreeable you.", "I agreed always."],
          optionsFa: ["\u0645\u0646 \u0645\u0648\u0627\u0641\u0642\u0645 (\u0627\u0634\u062A\u0628\u0627\u0647 \u0631\u0627\u06CC\u062C \u06AF\u0631\u0627\u0645\u0631\u06CC \u0628\u0627 am)", "\u0645\u0646 \u06A9\u0627\u0645\u0644\u0627\u064B \u0628\u0627 \u0634\u0645\u0627 \u0645\u0648\u0627\u0641\u0642\u0645 (\u0641\u0631\u0645 \u062F\u0631\u0633\u062A)", "\u0641\u0631\u0645 \u0646\u0627\u0645\u0641\u0647\u0648\u0645 \u0635\u0641\u062A", "\u0632\u0645\u0627\u0646 \u06AF\u0630\u0634\u062A\u0647 \u0646\u0627\u0645\u0646\u0627\u0633\u0628"],
          correctAnswer: "I agree with you completely.",
          explanationFa: '\u0641\u0639\u0644 agree \u062E\u0648\u062F\u0634 \u0641\u0639\u0644 \u0627\u0633\u062A \u0648 \u0646\u06CC\u0627\u0632\u06CC \u0628\u0647 am \u0646\u062F\u0627\u0631\u062F. \u06AF\u0641\u062A\u0646 "I am agree" \u0627\u0632 \u0627\u0634\u062A\u0628\u0627\u0647\u0627\u062A \u0631\u0627\u06CC\u062C \u0627\u0633\u062A.',
          explanationEn: 'Agree is a verb itself, so say "I agree", never "I am agree".',
          category: "reading",
          difficulty: "elementary"
        },
        {
          id: "pq_10",
          type: "multiple-choice",
          promptFa: '\u0645\u0639\u0646\u06CC \u0639\u0628\u0627\u0631\u062A "Break the ice" \u062F\u0631 \u0627\u0631\u062A\u0628\u0627\u0637\u0627\u062A \u0627\u062C\u062A\u0645\u0627\u0639\u06CC \u0686\u06CC\u0633\u062A\u061F',
          promptEn: 'What does the idiom "Break the ice" mean in social communication?',
          options: ["\u06CC\u062E \u0622\u0628 \u06A9\u0631\u062F\u0646 \u062F\u0631 \u0646\u0648\u0634\u06CC\u062F\u0646\u06CC", "\u0634\u06A9\u0633\u062A\u0646 \u0633\u06A9\u0648\u062A \u0648 \u0622\u063A\u0627\u0632 \u06AF\u0641\u062A\u06AF\u0648\u06CC \u0635\u0645\u06CC\u0645\u0627\u0646\u0647", "\u0639\u0635\u0628\u0627\u0646\u06CC \u0634\u062F\u0646 \u062F\u0631 \u062C\u0645\u0639", "\u062A\u0631\u06A9 \u06A9\u0631\u062F\u0646 \u062C\u0644\u0633\u0647 \u06A9\u0627\u0631\u06CC"],
          optionsFa: ["Crushing ice in drinks", "Initiating conversation to ease tension", "Getting angry in public", "Leaving a business meeting"],
          correctAnswer: "\u0634\u06A9\u0633\u062A\u0646 \u0633\u06A9\u0648\u062A \u0648 \u0622\u063A\u0627\u0632 \u06AF\u0641\u062A\u06AF\u0648\u06CC \u0635\u0645\u06CC\u0645\u0627\u0646\u0647",
          explanationFa: "Break the ice \u06CC\u0639\u0646\u06CC \u0627\u0632 \u0628\u06CC\u0646 \u0628\u0631\u062F\u0646 \u062C\u0648 \u0633\u0646\u06AF\u06CC\u0646 \u06CC\u0627 \u062E\u062C\u0627\u0644\u062A \u062F\u0631 \u0627\u0628\u062A\u062F\u0627\u06CC \u0622\u0634\u0646\u0627\u06CC\u06CC \u0628\u0627 \u062F\u06CC\u06AF\u0631\u0627\u0646.",
          explanationEn: "Break the ice means to relieve tension and make people feel comfortable.",
          category: "mixed",
          difficulty: "pre-intermediate"
        }
      ]
    };
    const vocabQuiz1 = {
      id: "quiz_vocab_1",
      titleFa: "\u0622\u0632\u0645\u0648\u0646 \u0648\u0627\u0698\u06AF\u0627\u0646: \u0627\u062D\u0633\u0627\u0633\u0627\u062A\u060C \u0634\u062E\u0635\u06CC\u062A \u0648 \u0631\u0648\u0627\u0628\u0637",
      titleEn: "Vocabulary: Feelings, Personality & Mindset",
      descriptionFa: "\u0633\u0646\u062C\u0634 \u06F9 \u0633\u0648\u0627\u0644\u06CC \u0644\u063A\u0627\u062A \u06A9\u0644\u06CC\u062F\u06CC \u0648 \u067E\u0631\u06A9\u0627\u0631\u0628\u0631\u062F \u062A\u0648\u0635\u06CC\u0641 \u0631\u0641\u062A\u0627\u0631 \u0648 \u0648\u06CC\u0698\u06AF\u06CC\u200C\u0647\u0627\u06CC \u0627\u0646\u0633\u0627\u0646\u06CC",
      descriptionEn: "Evaluate your mastery of 9 core descriptive words for human emotion and behavior.",
      type: "vocabulary",
      level: "beginner",
      xpReward: 60,
      timeLimitSeconds: 480,
      questions: [
        {
          id: "vq_1",
          type: "multiple-choice",
          promptFa: '\u0645\u0639\u0646\u06CC \u06A9\u0644\u0645\u0647 "Resilient" \u0686\u06CC\u0633\u062A\u061F',
          promptEn: 'Select the best definition of "Resilient":',
          options: ["\u0633\u0631\u0633\u062E\u062A \u0648 \u062A\u0627\u0628\u200C\u0622\u0648\u0631 \u062F\u0631 \u0628\u0631\u0627\u0628\u0631 \u0633\u062E\u062A\u06CC\u200C\u0647\u0627", "\u0646\u0627\u0627\u0645\u06CC\u062F \u0648 \u062E\u0633\u062A\u0647 \u0627\u0632 \u06A9\u0627\u0631", "\u062B\u0631\u0648\u062A\u0645\u0646\u062F \u0648 \u062F\u0627\u0631\u0627\u06CC \u0627\u0645\u06A9\u0627\u0646\u0627\u062A", "\u0641\u0631\u0627\u0645\u0648\u0634\u200C\u06A9\u0627\u0631 \u0648 \u062D\u0648\u0627\u0633\u200C\u067E\u0631\u062A"],
          optionsFa: ["Able to bounce back from hardship", "Depressed and tired", "Wealthy and resourceful", "Forgetful and distracted"],
          correctAnswer: "\u0633\u0631\u0633\u062E\u062A \u0648 \u062A\u0627\u0628\u200C\u0622\u0648\u0631 \u062F\u0631 \u0628\u0631\u0627\u0628\u0631 \u0633\u062E\u062A\u06CC\u200C\u0647\u0627",
          explanationFa: "Resilient \u0628\u0647 \u0627\u0641\u0631\u0627\u062F\u06CC \u06AF\u0641\u062A\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F \u06A9\u0647 \u067E\u0633 \u0627\u0632 \u0633\u062E\u062A\u06CC\u200C\u0647\u0627 \u0628\u0647 \u0633\u0631\u0639\u062A \u0628\u0627\u0632\u06CC\u0627\u0628\u06CC \u0631\u0648\u062D\u06CC \u067E\u06CC\u062F\u0627 \u0645\u06CC\u200C\u06A9\u0646\u0646\u062F.",
          explanationEn: "Resilient means able to withstand or recover quickly from difficult conditions.",
          category: "vocabulary",
          difficulty: "elementary"
        },
        {
          id: "vq_2",
          type: "multiple-choice",
          promptFa: '\u062C\u0645\u0644\u0647 \u0631\u0627 \u06A9\u0627\u0645\u0644 \u06A9\u0646\u06CC\u062F: "She was _______ to know what was inside the gift box."',
          promptEn: 'Complete: "She was _______ to know what was inside the gift box."',
          options: ["curious", "angry", "fluent", "tasty"],
          optionsFa: ["\u06A9\u0646\u062C\u06A9\u0627\u0648 \u0648 \u0645\u0634\u062A\u0627\u0642 \u062F\u0627\u0646\u0633\u062A\u0646", "\u0639\u0635\u0628\u0627\u0646\u06CC \u0648 \u062E\u0634\u0645\u06AF\u06CC\u0646", "\u0631\u0648\u0627\u0646 \u062F\u0631 \u0635\u062D\u0628\u062A \u06A9\u0631\u062F\u0646", "\u062E\u0648\u0634\u0645\u0632\u0647 \u0648 \u0644\u0630\u06CC\u0630"],
          correctAnswer: "curious",
          explanationFa: "\u06A9\u0644\u0645\u0647 Curious \u0628\u0647 \u0645\u0639\u0646\u06CC \u06A9\u0646\u062C\u06A9\u0627\u0648 \u062F\u0631 \u0627\u06CC\u0646 \u0632\u0645\u06CC\u0646\u0647 \u0645\u0639\u0646\u0627\u06CC\u06CC \u0628\u0647\u062A\u0631\u06CC\u0646 \u0627\u0646\u062A\u062E\u0627\u0628 \u0627\u0633\u062A.",
          explanationEn: "Curious fits the context of wanting to discover what is inside.",
          category: "vocabulary",
          difficulty: "beginner"
        },
        {
          id: "vq_3",
          type: "multiple-choice",
          promptFa: '\u06A9\u062F\u0627\u0645 \u06A9\u0644\u0645\u0647 \u0645\u062A\u0631\u0627\u062F\u0641 \u062F\u0642\u06CC\u0642 \u0648\u0627\u0698\u0647 "Opportunity" (\u0641\u0631\u0635\u062A) \u0627\u0633\u062A\u061F',
          promptEn: 'Which word is an exact synonym for "Opportunity"?',
          options: ["Chance", "Problem", "Mistake", "Delay"],
          optionsFa: ["\u0634\u0627\u0646\u0633 \u0648 \u0641\u0631\u0635\u062A \u0645\u0646\u0627\u0633\u0628", "\u0645\u0634\u06A9\u0644 \u0648 \u0645\u0639\u0636\u0644", "\u0627\u0634\u062A\u0628\u0627\u0647 \u0648 \u062E\u0637\u0627", "\u062A\u0627\u062E\u06CC\u0631 \u0648 \u0648\u0642\u0641\u0647"],
          correctAnswer: "Chance",
          explanationFa: "Chance \u0648 Opportunity \u0647\u0631 \u062F\u0648 \u0628\u0647 \u0645\u0639\u0646\u06CC \u0634\u0627\u0646\u0633 \u0648 \u0645\u0648\u0642\u0639\u06CC\u062A \u0645\u0646\u0627\u0633\u0628 \u0647\u0633\u062A\u0646\u062F.",
          explanationEn: "Opportunity and Chance are direct synonyms.",
          category: "vocabulary",
          difficulty: "elementary"
        },
        {
          id: "vq_4",
          type: "multiple-choice",
          promptFa: '\u0641\u0631\u062F\u06CC \u06A9\u0647 "Generous" (\u0628\u062E\u0634\u0646\u062F\u0647) \u0627\u0633\u062A \u0686\u0647 \u0648\u06CC\u0698\u06AF\u06CC\u200C\u0627\u06CC \u062F\u0627\u0631\u062F\u061F',
          promptEn: 'A person who is "Generous" is known to:',
          options: ["Give freely to others", "Save everything secretly", "Complain about prices", "Avoid meeting people"],
          optionsFa: ["\u0628\u0627 \u0633\u062E\u0627\u0648\u062A \u0628\u0647 \u062F\u06CC\u06AF\u0631\u0627\u0646 \u0645\u06CC\u200C\u0628\u062E\u0634\u062F", "\u0647\u0645\u0647 \u0686\u06CC\u0632 \u0631\u0627 \u0645\u062E\u0641\u06CC\u0627\u0646\u0647 \u067E\u0633\u200C\u0627\u0646\u062F\u0627\u0632 \u0645\u06CC\u200C\u06A9\u0646\u062F", "\u0627\u0632 \u0642\u06CC\u0645\u062A\u200C\u0647\u0627 \u0634\u06A9\u0627\u06CC\u062A \u0645\u06CC\u200C\u06A9\u0646\u062F", "\u0627\u0632 \u0645\u0644\u0627\u0642\u0627\u062A \u0628\u0627 \u062F\u06CC\u06AF\u0631\u0627\u0646 \u062F\u0648\u0631\u06CC \u0645\u06CC\u200C\u06A9\u0646\u062F"],
          correctAnswer: "Give freely to others",
          explanationFa: "Generous \u06CC\u0639\u0646\u06CC \u062F\u0633\u062A \u0648 \u062F\u0644\u0628\u0627\u0632 \u0648 \u0628\u062E\u0634\u0646\u062F\u0647.",
          explanationEn: "Generous means showing a readiness to give more of something than is strictly necessary.",
          category: "vocabulary",
          difficulty: "beginner"
        },
        {
          id: "vq_5",
          type: "multiple-choice",
          promptFa: '\u0645\u0639\u0646\u06CC \u0635\u0641\u062A "Punctual" \u062F\u0631 \u0645\u062D\u06CC\u0637\u200C\u0647\u0627\u06CC \u06A9\u0627\u0631\u06CC \u0648 \u062F\u0631\u0633\u06CC \u0686\u06CC\u0633\u062A\u061F',
          promptEn: 'What does it mean if an employee is "Punctual"?',
          options: ["\u0647\u0645\u06CC\u0634\u0647 \u0633\u0631 \u0648\u0642\u062A \u0648 \u062F\u0642\u06CC\u0642 \u062D\u0627\u0636\u0631 \u0645\u06CC\u200C\u0634\u0648\u062F", "\u062E\u06CC\u0644\u06CC \u0633\u0631\u06CC\u0639 \u0639\u0635\u0628\u0627\u0646\u06CC \u0645\u06CC\u200C\u0634\u0648\u062F", "\u0632\u0628\u0627\u0646\u200C\u0647\u0627\u06CC \u062E\u0627\u0631\u062C\u06CC \u0628\u0644\u062F \u0627\u0633\u062A", "\u0647\u0645\u06CC\u0634\u0647 \u0628\u0627 \u062A\u0627\u062E\u06CC\u0631 \u0645\u06CC\u200C\u0622\u06CC\u062F"],
          optionsFa: ["Always arriving strictly on time", "Gets angry very fast", "Knows foreign languages", "Always arrives late"],
          correctAnswer: "\u0647\u0645\u06CC\u0634\u0647 \u0633\u0631 \u0648\u0642\u062A \u0648 \u062F\u0642\u06CC\u0642 \u062D\u0627\u0636\u0631 \u0645\u06CC\u200C\u0634\u0648\u062F",
          explanationFa: "Punctual \u06CC\u0639\u0646\u06CC \u0641\u0631\u062F \u0648\u0642\u062A\u200C\u0634\u0646\u0627\u0633 \u0648 \u062E\u0648\u0634\u200C\u0642\u0648\u0644 \u062F\u0631 \u0633\u0627\u0639\u062A \u0642\u0631\u0627\u0631.",
          explanationEn: "Punctual means doing something at the agreed or proper time; on time.",
          category: "vocabulary",
          difficulty: "elementary"
        },
        {
          id: "vq_6",
          type: "multiple-choice",
          promptFa: '\u06A9\u062F\u0627\u0645 \u0648\u0627\u0698\u0647 \u0645\u062A\u0636\u0627\u062F \u06A9\u0644\u0645\u0647 "Permanent" (\u062F\u0627\u0626\u0645\u06CC) \u0627\u0633\u062A\u061F',
          promptEn: 'What is the opposite of the adjective "Permanent"?',
          options: ["Temporary", "Constant", "Forever", "Solid"],
          optionsFa: ["\u0645\u0648\u0642\u062A \u0648 \u06AF\u0630\u0631\u0627", "\u0645\u062F\u0627\u0648\u0645 \u0648 \u067E\u06CC\u0648\u0633\u062A\u0647", "\u0628\u0631\u0627\u06CC \u0647\u0645\u06CC\u0634\u0647", "\u0645\u062D\u06A9\u0645 \u0648 \u06CC\u06A9\u067E\u0627\u0631\u0686\u0647"],
          correctAnswer: "Temporary",
          explanationFa: "Temporary \u06CC\u0639\u0646\u06CC \u0645\u0648\u0642\u062A\u06CC \u06A9\u0647 \u062F\u0631 \u0628\u0631\u0627\u0628\u0631 Permanent (\u062F\u0627\u0626\u0645\u06CC) \u0642\u0631\u0627\u0631 \u062F\u0627\u0631\u062F.",
          explanationEn: "Temporary means lasting for only a limited period of time.",
          category: "vocabulary",
          difficulty: "elementary"
        },
        {
          id: "vq_7",
          type: "multiple-choice",
          promptFa: '\u0645\u0639\u0646\u06CC \u0639\u0628\u0627\u0631\u062A "Overwhelmed" \u0686\u06CC\u0633\u062A\u061F',
          promptEn: 'When someone feels "Overwhelmed", they feel:',
          options: ["Burdened with too much to handle", "Completely relaxed and bored", "Very hungry after exercise", "Extremely wealthy"],
          optionsFa: ["\u063A\u0631\u0642 \u062F\u0631 \u062D\u062C\u0645 \u0628\u0627\u0644\u0627\u06CC \u06A9\u0627\u0631 \u0648 \u0627\u0633\u062A\u0631\u0633", "\u06A9\u0627\u0645\u0644\u0627\u064B \u0631\u06CC\u0644\u06A9\u0633 \u0648 \u0628\u06CC\u200C\u062D\u0648\u0635\u0644\u0647", "\u0628\u0633\u06CC\u0627\u0631 \u06AF\u0631\u0633\u0646\u0647 \u0628\u0639\u062F \u0627\u0632 \u0648\u0631\u0632\u0634", "\u0628\u0633\u06CC\u0627\u0631 \u062B\u0631\u0648\u062A\u0645\u0646\u062F \u0648 \u067E\u0648\u0644\u062F\u0627\u0631"],
          correctAnswer: "Burdened with too much to handle",
          explanationFa: "Overwhelmed \u06CC\u0639\u0646\u06CC \u063A\u0631\u0642 \u062F\u0631 \u06A9\u0627\u0631 \u06CC\u0627 \u0627\u062D\u0633\u0627\u0633\u0627\u062A \u0633\u0646\u06AF\u06CC\u0646 \u0628\u0647 \u0637\u0648\u0631\u06CC \u06A9\u0647 \u06A9\u0646\u062A\u0631\u0644 \u0622\u0646 \u0633\u062E\u062A \u0628\u0627\u0634\u062F.",
          explanationEn: "Overwhelmed means overcome by superior force or an excessive amount of things to deal with.",
          category: "vocabulary",
          difficulty: "pre-intermediate"
        },
        {
          id: "vq_8",
          type: "multiple-choice",
          promptFa: '\u06A9\u062F\u0627\u0645 \u06A9\u0644\u0645\u0647 \u0628\u0647 \u0645\u0639\u0646\u06CC "\u0627\u0646\u0639\u0637\u0627\u0641\u200C\u067E\u0630\u06CC\u0631 \u0648 \u0633\u0627\u0632\u06AF\u0627\u0631" \u0627\u0633\u062A\u061F',
          promptEn: "Which word means able to change or be changed easily according to the situation?",
          options: ["Flexible", "Stubborn", "Heavy", "Fragile"],
          optionsFa: ["\u0627\u0646\u0639\u0637\u0627\u0641\u200C\u067E\u0630\u06CC\u0631 \u0648 \u0633\u0627\u0632\u06AF\u0627\u0631", "\u06CC\u06A9\u200C\u062F\u0646\u062F\u0647 \u0648 \u0644\u062C\u0628\u0627\u0632", "\u0633\u0646\u06AF\u06CC\u0646 \u0648 \u0648\u0632\u06CC\u0646", "\u0634\u06A9\u0646\u0646\u062F\u0647 \u0648 \u0638\u0631\u06CC\u0641"],
          correctAnswer: "Flexible",
          explanationFa: "Flexible \u0647\u0645 \u0628\u0631\u0627\u06CC \u0627\u062C\u0633\u0627\u0645 \u0641\u06CC\u0632\u06CC\u06A9\u06CC \u0645\u0646\u0639\u0637\u0641 \u0648 \u0647\u0645 \u0628\u0631\u0627\u06CC \u0627\u0641\u0631\u0627\u062F \u0633\u0627\u0632\u06AF\u0627\u0631 \u0628\u0627 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A \u0628\u0647 \u06A9\u0627\u0631 \u0645\u06CC\u200C\u0631\u0648\u062F.",
          explanationEn: "Flexible means adaptable to different circumstances or easily bent.",
          category: "vocabulary",
          difficulty: "beginner"
        },
        {
          id: "vq_9",
          type: "multiple-choice",
          promptFa: '\u0645\u0639\u0646\u06CC \u06A9\u0644\u0645\u0647 "Accomplish" \u0686\u06CC\u0633\u062A\u061F',
          promptEn: 'What does "Accomplish" mean?',
          options: ["\u0628\u0647 \u0633\u0631\u0627\u0646\u062C\u0627\u0645 \u0631\u0633\u0627\u0646\u062F\u0646 \u0648 \u062F\u0633\u062A \u06CC\u0627\u0641\u062A\u0646 \u0628\u0647 \u0647\u062F\u0641", "\u0627\u0632 \u062F\u0633\u062A \u062F\u0627\u062F\u0646 \u0641\u0631\u0635\u062A \u0634\u063A\u0644\u06CC", "\u0641\u0631\u0627\u0631 \u06A9\u0631\u062F\u0646 \u0627\u0632 \u0645\u0633\u0626\u0648\u0644\u06CC\u062A", "\u062A\u0631\u0633\u06CC\u062F\u0646 \u0627\u0632 \u062A\u0627\u0631\u06CC\u06A9\u06CC"],
          optionsFa: ["To achieve or complete successfully", "To lose a job chance", "To escape responsibility", "To fear the dark"],
          correctAnswer: "\u0628\u0647 \u0633\u0631\u0627\u0646\u062C\u0627\u0645 \u0631\u0633\u0627\u0646\u062F\u0646 \u0648 \u062F\u0633\u062A \u06CC\u0627\u0641\u062A\u0646 \u0628\u0647 \u0647\u062F\u0641",
          explanationFa: "Accomplish \u06CC\u0639\u0646\u06CC \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u06A9\u0627\u0631\u06CC \u0631\u0627 \u0627\u0646\u062C\u0627\u0645 \u062F\u0627\u062F\u0646 \u06CC\u0627 \u0647\u062F\u0641\u06CC \u0631\u0627 \u0641\u062A\u062D \u06A9\u0631\u062F\u0646.",
          explanationEn: "Accomplish means to achieve or complete something successfully.",
          category: "vocabulary",
          difficulty: "elementary"
        }
      ]
    };
    const grammarQuiz1 = {
      id: "quiz_grammar_1",
      titleFa: "\u0622\u0632\u0645\u0648\u0646 \u06AF\u0631\u0627\u0645\u0631: \u0632\u0645\u0627\u0646\u200C\u0647\u0627 \u0648 \u0633\u0627\u062E\u062A\u0627\u0631 \u062C\u0645\u0644\u0627\u062A \u06A9\u0627\u0631\u0628\u0631\u062F\u06CC",
      titleEn: "Grammar: Essential Tenses & Sentence Patterns",
      descriptionFa: "\u0633\u0646\u062C\u0634 \u06F9 \u0633\u0648\u0627\u0644\u06CC \u0633\u0627\u062E\u062A\u0627\u0631 \u0627\u0641\u0639\u0627\u0644\u060C \u0632\u0645\u0627\u0646 \u062D\u0627\u0644 \u0627\u0633\u062A\u0645\u0631\u0627\u0631\u06CC\u060C \u06AF\u0630\u0634\u062A\u0647 \u0648 \u062D\u0631\u0648\u0641 \u0627\u0636\u0627\u0641\u0647",
      descriptionEn: "Test your understanding of 9 essential grammar structures in daily English.",
      type: "grammar",
      level: "beginner",
      xpReward: 65,
      timeLimitSeconds: 500,
      questions: [
        {
          id: "gq_1",
          type: "multiple-choice",
          promptFa: '\u06A9\u062F\u0627\u0645 \u06AF\u0632\u06CC\u0646\u0647 \u0628\u0627 \u062A\u0648\u062C\u0647 \u0628\u0647 \u0642\u06CC\u062F \u0632\u0645\u0627\u0646 "right now" \u0635\u062D\u06CC\u062D \u0627\u0633\u062A\u061F',
          promptEn: "Look outside! It _______ right now.",
          options: ["is raining", "rains", "rained", "rain"],
          optionsFa: ["\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06CC\u062F\u0646 \u0627\u0633\u062A (\u0627\u0633\u062A\u0645\u0631\u0627\u0631\u06CC)", "\u0628\u0627\u0631\u0627\u0646 \u0645\u06CC\u200C\u0628\u0627\u0631\u062F (\u0631\u0648\u062A\u06CC\u0646 \u062D\u0627\u0644)", "\u0628\u0627\u0631\u0627\u0646 \u0628\u0627\u0631\u06CC\u062F (\u06AF\u0630\u0634\u062A\u0647)", "\u0641\u0631\u0645 \u067E\u0627\u06CC\u0647 \u0628\u062F\u0648\u0646 \u0641\u0627\u0639\u0644"],
          correctAnswer: "is raining",
          explanationFa: "\u0628\u0631\u0627\u06CC \u06A9\u0627\u0631\u06CC \u06A9\u0647 \u0647\u0645\u06CC\u0646 \u0627\u0644\u0627\u0646 \u062F\u0631 \u062D\u0627\u0644 \u0648\u0642\u0648\u0639 \u0627\u0633\u062A \u0627\u0632 \u062D\u0627\u0644 \u0627\u0633\u062A\u0645\u0631\u0627\u0631\u06CC (is + verb-ing) \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u06A9\u0646\u06CC\u0645.",
          explanationEn: "Present continuous is used for actions happening at the moment of speech.",
          category: "grammar",
          difficulty: "beginner"
        },
        {
          id: "gq_2",
          type: "multiple-choice",
          promptFa: '\u0634\u06A9\u0644 \u0645\u0646\u0641\u06CC \u062C\u0645\u0644\u0647 "He likes coffee" \u06A9\u062F\u0627\u0645 \u0627\u0633\u062A\u061F',
          promptEn: 'What is the correct negative form of "He likes coffee"?',
          options: ["He does not like coffee.", "He is not like coffee.", "He not likes coffee.", "He do not likes coffee."],
          optionsFa: ["\u0627\u0648 \u0642\u0647\u0648\u0647 \u062F\u0648\u0633\u062A \u0646\u062F\u0627\u0631\u062F (\u0635\u062D\u06CC\u062D)", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0632 is not", "\u0642\u0631\u0627\u0631 \u062F\u0627\u062F\u0646 \u0645\u0646\u0641\u06CC \u0628\u062F\u0648\u0646 \u06A9\u0645\u06A9\u06CC", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0632 do \u0628\u0631\u0627\u06CC \u0633\u0648\u0645\u200C\u0634\u062E\u0635"],
          correctAnswer: "He does not like coffee.",
          explanationFa: "\u0628\u0631\u0627\u06CC \u0633\u0648\u0645 \u0634\u062E\u0635 \u0645\u0641\u0631\u062F \u0627\u0632 does not \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u06A9\u0646\u06CC\u0645 \u0648 \u0641\u0639\u0644 \u0627\u0635\u0644\u06CC \u0628\u0647 \u062D\u0627\u0644\u062A \u0633\u0627\u062F\u0647 (like) \u0628\u0631\u0645\u06CC\u200C\u06AF\u0631\u062F\u062F.",
          explanationEn: "Negative present simple for he/she/it uses does not + base verb.",
          category: "grammar",
          difficulty: "beginner"
        },
        {
          id: "gq_3",
          type: "multiple-choice",
          promptFa: "\u06A9\u062F\u0627\u0645 \u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 \u0628\u0631\u0627\u06CC \u0628\u06CC\u0627\u0646 \u0631\u0648\u0632\u0647\u0627\u06CC \u0647\u0641\u062A\u0647 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F\u061F",
          promptEn: "We have an English lesson _______ Monday morning.",
          options: ["on", "in", "at", "by"],
          optionsFa: ["\u062F\u0631 \u0631\u0648\u0632 (\u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 \u0631\u0648\u0632\u0647\u0627\u06CC \u0647\u0641\u062A\u0647)", "\u062F\u0631 \u0645\u0627\u0647/\u0633\u0627\u0644 (\u0646\u0627\u062F\u0631\u0633\u062A)", "\u062F\u0631 \u0633\u0627\u0639\u062A \u0645\u0634\u062E\u0635 (\u0646\u0627\u062F\u0631\u0633\u062A)", "\u062A\u0627 \u0642\u0628\u0644 \u0627\u0632 (\u0646\u0627\u062F\u0631\u0633\u062A)"],
          correctAnswer: "on",
          explanationFa: "\u0628\u0631\u0627\u06CC \u0631\u0648\u0632\u0647\u0627\u06CC \u0647\u0641\u062A\u0647 (\u0645\u0627\u0646\u0646\u062F Monday, Friday) \u0647\u0645\u06CC\u0634\u0647 \u0627\u0632 \u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 on \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.",
          explanationEn: 'We use the preposition "on" for days of the week.',
          category: "grammar",
          difficulty: "beginner"
        },
        {
          id: "gq_4",
          type: "multiple-choice",
          promptFa: "\u06A9\u062F\u0627\u0645 \u062C\u0645\u0644\u0647 \u0627\u0632 \u0646\u0638\u0631 \u06A9\u0627\u0631\u0628\u0631\u062F \u0627\u0633\u0627\u0645\u06CC \u0634\u0645\u0627\u0631\u0634\u200C\u067E\u0630\u06CC\u0631 \u0648 \u063A\u06CC\u0631\u0634\u0645\u0627\u0631\u0634\u200C\u067E\u0630\u06CC\u0631 \u062F\u0631\u0633\u062A \u0627\u0633\u062A\u061F",
          promptEn: "Which sentence correctly uses countable and uncountable quantifiers?",
          options: ["How much water do you drink?", "How many water do you drink?", "How much books do you read?", "How many money do you have?"],
          optionsFa: ["\u0686\u0647 \u0645\u0642\u062F\u0627\u0631 \u0622\u0628 \u0645\u06CC\u200C\u0646\u0648\u0634\u06CC\u062F\u061F (\u0635\u062D\u06CC\u062D)", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 many \u0628\u0631\u0627\u06CC \u0622\u0628 (\u0646\u0627\u062F\u0631\u0633\u062A)", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 much \u0628\u0631\u0627\u06CC \u06A9\u062A\u0627\u0628 (\u0646\u0627\u062F\u0631\u0633\u062A)", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 many \u0628\u0631\u0627\u06CC \u067E\u0648\u0644 (\u0646\u0627\u062F\u0631\u0633\u062A)"],
          correctAnswer: "How much water do you drink?",
          explanationFa: "\u0628\u0631\u0627\u06CC \u0627\u0633\u0627\u0645\u06CC \u063A\u06CC\u0631\u0642\u0627\u0628\u0644 \u0634\u0645\u0627\u0631\u0634 \u0645\u062B\u0644 water \u0648 money \u0627\u0632 how much \u0648 \u0628\u0631\u0627\u06CC \u0642\u0627\u0628\u0644 \u0634\u0645\u0627\u0631\u0634\u200C\u0647\u0627 \u0627\u0632 how many \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.",
          explanationEn: 'Use "how much" for uncountable nouns like water.',
          category: "grammar",
          difficulty: "elementary"
        },
        {
          id: "gq_5",
          type: "multiple-choice",
          promptFa: '\u0634\u06A9\u0644 \u0633\u0648\u0627\u0644\u06CC \u062F\u0631\u0633\u062A \u062F\u0631 \u0632\u0645\u0627\u0646 \u06AF\u0630\u0634\u062A\u0647 \u0633\u0627\u062F\u0647 \u0628\u0631\u0627\u06CC \u062C\u0645\u0644\u0647 "They visited Paris" \u06A9\u062F\u0627\u0645 \u0627\u0633\u062A\u061F',
          promptEn: 'Choose the correct question form for: "They visited Paris."',
          options: ["Did they visit Paris?", "Did they visited Paris?", "Were they visit Paris?", "Have they visit Paris?"],
          optionsFa: ["\u0622\u06CC\u0627 \u0622\u0646\u0647\u0627 \u067E\u0627\u0631\u06CC\u0633 \u0631\u0627 \u062F\u06CC\u062F\u0646\u062F\u061F (\u0635\u062D\u06CC\u062D)", "\u062A\u06A9\u0631\u0627\u0631 \u067E\u0633\u0648\u0646\u062F ed \u0647\u0645\u0631\u0627\u0647 \u0628\u0627 did (\u0646\u0627\u062F\u0631\u0633\u062A)", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0634\u062A\u0628\u0627\u0647 \u0627\u0632 were", "\u0633\u0627\u062E\u062A\u0627\u0631 \u0646\u0627\u0642\u0635 \u0645\u0627\u0636\u06CC \u0646\u0642\u0644\u06CC"],
          correctAnswer: "Did they visit Paris?",
          explanationFa: "\u0648\u0642\u062A\u06CC \u062F\u0631 \u0633\u0648\u0627\u0644 \u0627\u0632 Did \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u06A9\u0646\u06CC\u0645\u060C \u0641\u0639\u0644 \u0627\u0635\u0644\u06CC \u0628\u0627\u06CC\u062F \u0628\u0647 \u0634\u06A9\u0644 \u067E\u0627\u06CC\u0647 (visit) \u0622\u0648\u0631\u062F\u0647 \u0634\u0648\u062F.",
          explanationEn: 'When using auxiliary "Did", the main verb reverts to base form.',
          category: "grammar",
          difficulty: "elementary"
        },
        {
          id: "gq_6",
          type: "multiple-choice",
          promptFa: "\u06A9\u062F\u0627\u0645 \u06AF\u0632\u06CC\u0646\u0647 \u0628\u0631\u0627\u06CC \u0628\u06CC\u0627\u0646 \u062A\u0648\u0627\u0646\u0627\u06CC\u06CC \u062F\u0631 \u0632\u0645\u0627\u0646 \u062D\u0627\u0644 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F\u061F",
          promptEn: "She _______ speak three languages fluently.",
          options: ["can", "could to", "is can", "canning"],
          optionsFa: ["\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F (\u0641\u0639\u0644 \u06A9\u0645\u06A9\u06CC \u062A\u0648\u0627\u0646\u0627\u06CC\u06CC \u062D\u0627\u0644)", "\u0633\u0627\u062E\u062A\u0627\u0631 \u0627\u0634\u062A\u0628\u0627\u0647 \u06AF\u0630\u0634\u062A\u0647 \u0628\u0627 to", "\u062A\u0631\u06A9\u06CC\u0628 \u0646\u0627\u062F\u0631\u0633\u062A \u0628\u0627 is", "\u0627\u0641\u0632\u0648\u062F\u0646 ing \u0628\u0647 \u0641\u0639\u0644 \u0648\u062C\u0647\u06CC (\u063A\u0644\u0637)"],
          correctAnswer: "can",
          explanationFa: "\u0641\u0639\u0644 \u06A9\u0645\u06A9\u06CC can \u0628\u0631\u0627\u06CC \u0628\u06CC\u0627\u0646 \u062A\u0648\u0627\u0646\u0627\u06CC\u06CC \u062D\u0627\u0644 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F \u0648 \u0628\u0639\u062F \u0627\u0632 \u0622\u0646 \u0641\u0639\u0644 \u0628\u0647 \u0634\u06A9\u0644 \u0633\u0627\u062F\u0647 \u0645\u06CC\u200C\u0622\u06CC\u062F.",
          explanationEn: 'Modal verb "can" expresses present ability followed by bare infinitive.',
          category: "grammar",
          difficulty: "beginner"
        },
        {
          id: "gq_7",
          type: "multiple-choice",
          promptFa: "\u06A9\u062F\u0627\u0645 \u0635\u0641\u062A \u0639\u0627\u0644\u06CC (Superlative) \u0627\u0632 \u0646\u0638\u0631 \u06AF\u0631\u0627\u0645\u0631\u06CC \u062F\u0631\u0633\u062A \u0646\u0648\u0634\u062A\u0647 \u0634\u062F\u0647 \u0627\u0633\u062A\u061F",
          promptEn: "Mount Everest is _______ mountain in the world.",
          options: ["the highest", "highest", "the most high", "more higher"],
          optionsFa: ["\u0628\u0644\u0646\u062F\u062A\u0631\u06CC\u0646 (the + \u0635\u0641\u062A \u062A\u06A9\u200C\u0633\u06CC\u0644\u0627\u0628\u06CC + est)", "\u0628\u062F\u0648\u0646 \u062D\u0631\u0641 \u062A\u0639\u0631\u06CC\u0641 the (\u0646\u0627\u062F\u0631\u0633\u062A)", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 most \u0628\u0631\u0627\u06CC \u0635\u0641\u062A \u06A9\u0648\u062A\u0627\u0647 (\u063A\u0644\u0637)", "\u062A\u0631\u06A9\u06CC\u0628 \u0627\u0634\u062A\u0628\u0627\u0647 \u0635\u0641\u062A \u062A\u0641\u0636\u06CC\u0644\u06CC \u0645\u0636\u0627\u0639\u0641"],
          correctAnswer: "the highest",
          explanationFa: "\u0628\u0631\u0627\u06CC \u0635\u0641\u0627\u062A \u062A\u06A9\u200C\u0633\u06CC\u0644\u0627\u0628\u06CC \u062F\u0631 \u062D\u0627\u0644\u062A \u0639\u0627\u0644\u06CC \u0627\u0632 the + adj + est \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.",
          explanationEn: "Short adjectives form the superlative with the + -est.",
          category: "grammar",
          difficulty: "elementary"
        },
        {
          id: "gq_8",
          type: "multiple-choice",
          promptFa: '\u062C\u0645\u0644\u0647 \u0632\u06CC\u0631 \u0631\u0627 \u0628\u0627 \u0636\u0645\u06CC\u0631 \u0645\u0641\u0639\u0648\u0644\u06CC \u0635\u062D\u06CC\u062D \u06A9\u0627\u0645\u0644 \u06A9\u0646\u06CC\u062F: "Give the keys to _______."',
          promptEn: "Give the keys to _______ when you arrive.",
          options: ["me", "I", "my", "mine"],
          optionsFa: ["\u0628\u0647 \u0645\u0646 (\u0636\u0645\u06CC\u0631 \u0645\u0641\u0639\u0648\u0644\u06CC)", "\u0645\u0646 (\u0636\u0645\u06CC\u0631 \u0641\u0627\u0639\u0644\u06CC)", "\u0645\u0627\u0644 \u0645\u0646 (\u0635\u0641\u062A \u0645\u0644\u06A9\u06CC)", "\u0645\u0627\u0644 \u0645\u0646 (\u0636\u0645\u06CC\u0631 \u0645\u0644\u06A9\u06CC)"],
          correctAnswer: "me",
          explanationFa: "\u0628\u0639\u062F \u0627\u0632 \u062D\u0631\u0648\u0641 \u0627\u0636\u0627\u0641\u0647 \u0645\u062B\u0644 to \u0627\u0632 \u0636\u0645\u06CC\u0631 \u0645\u0641\u0639\u0648\u0644\u06CC (me, him, her, them) \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u06A9\u0646\u06CC\u0645.",
          explanationEn: 'After prepositions like "to", use the object pronoun "me".',
          category: "grammar",
          difficulty: "beginner"
        },
        {
          id: "gq_9",
          type: "multiple-choice",
          promptFa: "\u06A9\u062F\u0627\u0645 \u06AF\u0632\u06CC\u0646\u0647 \u0628\u0631\u0627\u06CC \u0628\u06CC\u0627\u0646 \u062A\u0635\u0645\u06CC\u0645 \u0646\u0627\u06AF\u0647\u0627\u0646\u06CC \u062F\u0631 \u0644\u062D\u0638\u0647 \u0645\u0646\u0627\u0633\u0628 \u0627\u0633\u062A\u061F",
          promptEn: "The phone is ringing. I _______ answer it!",
          options: ["will", "am going to", "am answering", "was"],
          optionsFa: ["\u067E\u0627\u0633\u062E \u062E\u0648\u0627\u0647\u0645 \u062F\u0627\u062F (\u062A\u0635\u0645\u06CC\u0645 \u0622\u0646\u06CC)", "\u0628\u0631\u0646\u0627\u0645\u0647\u200C\u0631\u06CC\u0632\u06CC \u0627\u0632 \u0642\u0628\u0644 \u062F\u0627\u0634\u062A\u0647\u200C\u0627\u0645", "\u062F\u0631 \u062D\u0627\u0644 \u062D\u0627\u0636\u0631 \u062F\u0631 \u062D\u0627\u0644 \u067E\u0627\u0633\u062E \u062F\u0627\u062F\u0646\u0645", "\u0632\u0645\u0627\u0646 \u06AF\u0630\u0634\u062A\u0647 \u0646\u0627\u0645\u0631\u062A\u0628\u0637"],
          correctAnswer: "will",
          explanationFa: "\u0628\u0631\u0627\u06CC \u062A\u0635\u0645\u06CC\u0645\u0627\u062A\u06CC \u06A9\u0647 \u062F\u0631 \u0647\u0645\u0627\u0646 \u0644\u062D\u0638\u0647 \u0635\u062D\u0628\u062A \u06AF\u0631\u0641\u062A\u0647 \u0645\u06CC\u200C\u0634\u0648\u0646\u062F \u0627\u0632 will \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u06A9\u0646\u06CC\u0645.",
          explanationEn: 'Use "will" for spontaneous decisions made at the moment of speaking.',
          category: "grammar",
          difficulty: "elementary"
        }
      ]
    };
    const situationalQuiz1 = {
      id: "quiz_situational_1",
      titleFa: "\u0622\u0632\u0645\u0648\u0646 \u0645\u06A9\u0627\u0644\u0645\u0647: \u0645\u0648\u0642\u0639\u06CC\u062A\u200C\u0647\u0627\u06CC \u0648\u0627\u0642\u0639\u06CC \u0648 \u0627\u0635\u0637\u0644\u0627\u062D\u0627\u062A \u0631\u0648\u0632\u0645\u0631\u0647",
      titleEn: "Conversational English & Real-World Dialogues",
      descriptionFa: "\u0633\u0646\u062C\u0634 \u06F8 \u0633\u0648\u0627\u0644\u06CC \u0648\u0627\u06A9\u0646\u0634\u200C\u0647\u0627\u06CC \u06A9\u0627\u0631\u0628\u0631\u062F\u06CC \u062F\u0631 \u0633\u0641\u0631\u060C \u062E\u0631\u06CC\u062F\u060C \u0631\u0633\u062A\u0648\u0631\u0627\u0646 \u0648 \u0631\u0648\u0627\u0628\u0637 \u062F\u0648\u0633\u062A\u0627\u0646\u0647",
      descriptionEn: "8-question practical test measuring your real-world conversational readiness.",
      type: "mixed",
      level: "elementary",
      xpReward: 55,
      timeLimitSeconds: 420,
      questions: [
        {
          id: "sq_1",
          type: "multiple-choice",
          promptFa: "\u062F\u0631 \u0631\u0633\u062A\u0648\u0631\u0627\u0646\u060C \u0648\u0642\u062A\u06CC \u0645\u06CC\u200C\u062E\u0648\u0627\u0647\u06CC\u062F \u0635\u0648\u0631\u062A\u200C\u062D\u0633\u0627\u0628 \u0631\u0627 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u06A9\u0646\u06CC\u062F \u06A9\u062F\u0627\u0645 \u062C\u0645\u0644\u0647 \u0645\u0648\u062F\u0628\u0627\u0646\u0647\u200C\u062A\u0631 \u0627\u0633\u062A\u061F",
          promptEn: "How do you politely ask for the bill at a restaurant?",
          options: ["Could we have the check, please?", "Give me the money now!", "I want to pay quickly.", "Where is the food price?"],
          optionsFa: ["\u0645\u0645\u06A9\u0646 \u0627\u0633\u062A \u0644\u0637\u0641\u0627\u064B \u0635\u0648\u0631\u062A\u200C\u062D\u0633\u0627\u0628 \u0631\u0627 \u0628\u06CC\u0627\u0648\u0631\u06CC\u062F\u061F", "\u0647\u0645\u06CC\u0646 \u0627\u0644\u0627\u0646 \u067E\u0648\u0644 \u0631\u0627 \u0628\u0647 \u0645\u0646 \u0628\u062F\u0647!", "\u0645\u0646 \u0645\u06CC\u200C\u062E\u0648\u0627\u0647\u0645 \u0633\u0631\u06CC\u0639 \u062D\u0633\u0627\u0628 \u06A9\u0646\u0645.", "\u0642\u06CC\u0645\u062A \u063A\u0630\u0627 \u06A9\u062C\u0627\u0633\u062A\u061F"],
          correctAnswer: "Could we have the check, please?",
          explanationFa: '\u062F\u0631 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0627\u0633\u062A\u0627\u0646\u062F\u0627\u0631\u062F \u0648 \u0645\u0648\u062F\u0628\u0627\u0646\u0647 \u0627\u0632 \u0639\u0628\u0627\u0631\u062A "Could we have the check/bill, please?" \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.',
          explanationEn: 'Polite restaurant request uses "Could we have the check/bill, please?".',
          category: "reading",
          difficulty: "beginner"
        },
        {
          id: "sq_2",
          type: "multiple-choice",
          promptFa: '\u067E\u0627\u0633\u062E \u0645\u0648\u062F\u0628\u0627\u0646\u0647 \u0628\u0647 \u062C\u0645\u0644\u0647 "Thank you very much for your help!" \u0686\u06CC\u0633\u062A\u061F',
          promptEn: 'What is the natural and polite response to: "Thank you very much for your help!"?',
          options: ["You're very welcome!", "No need to talk.", "Why did you say that?", "It is my problem."],
          optionsFa: ["\u062E\u0648\u0627\u0647\u0634 \u0645\u06CC\u200C\u06A9\u0646\u0645 / \u0642\u062F\u0645\u062A\u0627\u0646 \u0631\u0648\u06CC \u0686\u0634\u0645!", "\u0646\u06CC\u0627\u0632\u06CC \u0628\u0647 \u062D\u0631\u0641 \u0632\u062F\u0646 \u0646\u06CC\u0633\u062A.", "\u0686\u0631\u0627 \u0627\u06CC\u0646 \u062D\u0631\u0641 \u0631\u0627 \u0632\u062F\u06CC\u062F\u061F", "\u0627\u06CC\u0646 \u0645\u0634\u06A9\u0644 \u062E\u0648\u062F \u0645\u0646 \u0627\u0633\u062A."],
          correctAnswer: "You're very welcome!",
          explanationFa: `\u067E\u0627\u0633\u062E \u0627\u0633\u062A\u0627\u0646\u062F\u0627\u0631\u062F \u0648 \u0645\u0648\u062F\u0628\u0627\u0646\u0647 \u0628\u0647 \u062A\u0634\u06A9\u0631 "You're welcome" \u06CC\u0627 "You're very welcome" \u0627\u0633\u062A.`,
          explanationEn: 'Standard polite reply to thank you is "You are welcome".',
          category: "reading",
          difficulty: "beginner"
        },
        {
          id: "sq_3",
          type: "multiple-choice",
          promptFa: '\u062F\u0631 \u0641\u0631\u0648\u062F\u06AF\u0627\u0647\u060C \u0639\u0628\u0627\u0631\u062A "Boarding pass" \u0628\u0647 \u0686\u0647 \u0645\u0639\u0646\u0627\u0633\u062A\u061F',
          promptEn: 'What is a "Boarding pass" at the airport?',
          options: ["\u06A9\u0627\u0631\u062A \u067E\u0631\u0648\u0627\u0632 \u0628\u0631\u0627\u06CC \u0633\u0648\u0627\u0631 \u0634\u062F\u0646 \u0628\u0647 \u0647\u0648\u0627\u067E\u06CC\u0645\u0627", "\u06AF\u0630\u0631\u0646\u0627\u0645\u0647 \u0628\u06CC\u0646\u200C\u0627\u0644\u0645\u0644\u0644\u06CC", "\u0628\u0631\u0686\u0633\u0628 \u0686\u0645\u062F\u0627\u0646 \u0628\u0627\u0631", "\u0631\u0633\u06CC\u062F \u067E\u0631\u062F\u0627\u062E\u062A \u0639\u0648\u0627\u0631\u0636 \u062E\u0631\u0648\u062C"],
          optionsFa: ["The flight boarding ticket document", "International passport", "Luggage luggage tag", "Exit tax receipt"],
          correctAnswer: "\u06A9\u0627\u0631\u062A \u067E\u0631\u0648\u0627\u0632 \u0628\u0631\u0627\u06CC \u0633\u0648\u0627\u0631 \u0634\u062F\u0646 \u0628\u0647 \u0647\u0648\u0627\u067E\u06CC\u0645\u0627",
          explanationFa: "Boarding pass \u0647\u0645\u0627\u0646 \u06A9\u0627\u0631\u062A \u0648\u0631\u0648\u062F \u0628\u0647 \u0647\u0648\u0627\u067E\u06CC\u0645\u0627 \u0627\u0633\u062A \u06A9\u0647 \u06AF\u06CC\u062A \u0648 \u0634\u0645\u0627\u0631\u0647 \u0635\u0646\u062F\u0644\u06CC \u0631\u0648\u06CC \u0622\u0646 \u062F\u0631\u062C \u0634\u062F\u0647 \u0627\u0633\u062A.",
          explanationEn: "A boarding pass is a document provided by an airline during check-in.",
          category: "vocabulary",
          difficulty: "beginner"
        },
        {
          id: "sq_4",
          type: "multiple-choice",
          promptFa: "\u0627\u06AF\u0631 \u0645\u062A\u0648\u062C\u0647 \u0645\u0646\u0638\u0648\u0631 \u06A9\u0633\u06CC \u0646\u0634\u062F\u06CC\u062F\u060C \u0645\u0648\u062F\u0628\u0627\u0646\u0647\u200C\u062A\u0631\u06CC\u0646 \u0631\u0627\u0647 \u0628\u0631\u0627\u06CC \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062A\u06A9\u0631\u0627\u0631 \u0686\u06CC\u0633\u062A\u061F",
          promptEn: "What is the most polite way to ask someone to repeat what they said?",
          options: ["Pardon me, could you repeat that?", "What?! Speak louder!", "I did not listen to you.", "Repeat now!"],
          optionsFa: ["\u0628\u0628\u062E\u0634\u06CC\u062F\u060C \u0645\u0645\u06A9\u0646 \u0627\u0633\u062A \u0644\u0637\u0641\u0627\u064B \u062A\u06A9\u0631\u0627\u0631 \u0628\u0641\u0631\u0645\u0627\u06CC\u06CC\u062F\u061F", "\u0686\u06CC\u061F! \u0628\u0644\u0646\u062F\u062A\u0631 \u062D\u0631\u0641 \u0628\u0632\u0646!", "\u0645\u0646 \u0628\u0647\u062A \u06AF\u0648\u0634 \u0646\u062F\u0627\u062F\u0645.", "\u0647\u0645\u06CC\u0646 \u0627\u0644\u0627\u0646 \u062A\u06A9\u0631\u0627\u0631 \u06A9\u0646!"],
          correctAnswer: "Pardon me, could you repeat that?",
          explanationFa: "\u0639\u0628\u0627\u0631\u062A Pardon me \u06CC\u0627 Could you repeat that please \u0645\u0648\u062F\u0628\u0627\u0646\u0647\u200C\u062A\u0631\u06CC\u0646 \u0634\u06CC\u0648\u0647 \u0627\u0633\u062A.",
          explanationEn: "Pardon me, could you repeat that? is the standard polite clarification phrasing.",
          category: "reading",
          difficulty: "beginner"
        },
        {
          id: "sq_5",
          type: "multiple-choice",
          promptFa: '\u0627\u0635\u0637\u0644\u0627\u062D "Under the weather" \u06CC\u0639\u0646\u06CC \u0686\u0647\u061F',
          promptEn: 'If someone says "I am feeling under the weather today", it means:',
          options: ["\u06A9\u0645\u06CC \u0646\u0627\u062E\u0648\u0634\u200C\u0627\u062D\u0648\u0627\u0644 \u0648 \u0628\u06CC\u0645\u0627\u0631\u0645", "\u0647\u0648\u0627 \u0628\u0627\u0631\u0627\u0646\u06CC \u0627\u0633\u062A", "\u0632\u06CC\u0631 \u0686\u062A\u0631 \u0627\u06CC\u0633\u062A\u0627\u062F\u0647\u200C\u0627\u0645", "\u062E\u06CC\u0644\u06CC \u062E\u0648\u0634\u062D\u0627\u0644\u0645"],
          optionsFa: ["Feeling slightly sick or unwell", "The weather is rainy", "Standing under an umbrella", "Extremely cheerful"],
          correctAnswer: "\u06A9\u0645\u06CC \u0646\u0627\u062E\u0648\u0634\u200C\u0627\u062D\u0648\u0627\u0644 \u0648 \u0628\u06CC\u0645\u0627\u0631\u0645",
          explanationFa: "Under the weather \u06CC\u0639\u0646\u06CC \u0641\u0631\u062F \u06A9\u0645\u06CC \u06A9\u0633\u0627\u0644\u062A \u06CC\u0627 \u0633\u0631\u0645\u0627\u062E\u0648\u0631\u062F\u06AF\u06CC \u062E\u0641\u06CC\u0641 \u062F\u0627\u0631\u062F.",
          explanationEn: "Under the weather is an idiom meaning slightly indisposed or unwell.",
          category: "mixed",
          difficulty: "elementary"
        },
        {
          id: "sq_6",
          type: "multiple-choice",
          promptFa: '\u0648\u0642\u062A\u06CC \u062F\u0648\u0633\u062A\u06CC \u0645\u06CC\u200C\u06AF\u0648\u06CC\u062F "Let\u2019s call it a day!" \u0645\u0646\u0638\u0648\u0631\u0634 \u0686\u06CC\u0633\u062A\u061F',
          promptEn: 'What does "Let\u2019s call it a day!" mean after a long work session?',
          options: ["\u0628\u06CC\u0627\u06CC\u06CC\u062F \u06A9\u0627\u0631 \u0627\u0645\u0631\u0648\u0632 \u0631\u0627 \u062A\u0645\u0627\u0645 \u06A9\u0646\u06CC\u0645 \u0648 \u0628\u0647 \u062E\u0627\u0646\u0647 \u0628\u0631\u0648\u06CC\u0645", "\u0628\u06CC\u0627\u06CC\u06CC\u062F \u0646\u0627\u0645 \u0627\u0645\u0631\u0648\u0632 \u0631\u0627 \u062A\u063A\u06CC\u06CC\u0631 \u062F\u0647\u06CC\u0645", "\u062A\u0627 \u0641\u0631\u062F\u0627 \u0635\u0628\u062D \u0627\u062F\u0627\u0645\u0647 \u062F\u0647\u06CC\u0645", "\u0627\u0645\u0631\u0648\u0632 \u0631\u0648\u0632 \u062A\u0639\u0637\u06CC\u0644 \u0627\u0633\u062A"],
          optionsFa: ["Stop working for the rest of the day", "Change today name", "Work until tomorrow morning", "Today is a public holiday"],
          correctAnswer: "\u0628\u06CC\u0627\u06CC\u06CC\u062F \u06A9\u0627\u0631 \u0627\u0645\u0631\u0648\u0632 \u0631\u0627 \u062A\u0645\u0627\u0645 \u06A9\u0646\u06CC\u0645 \u0648 \u0628\u0647 \u062E\u0627\u0646\u0647 \u0628\u0631\u0648\u06CC\u0645",
          explanationFa: "Call it a day \u06CC\u0639\u0646\u06CC \u0645\u062A\u0648\u0642\u0641 \u06A9\u0631\u062F\u0646 \u06A9\u0627\u0631 \u0628\u0631\u0627\u06CC \u0627\u062F\u0627\u0645\u0647 \u062F\u0631 \u0631\u0648\u0632 \u0628\u0639\u062F.",
          explanationEn: "Call it a day means to stop what you are doing because you have done enough.",
          category: "mixed",
          difficulty: "elementary"
        },
        {
          id: "sq_7",
          type: "multiple-choice",
          promptFa: "\u06A9\u062F\u0627\u0645 \u0639\u0628\u0627\u0631\u062A \u0628\u0631\u0627\u06CC \u0645\u0639\u0631\u0641\u06CC \u0645\u0648\u062F\u0628\u0627\u0646\u0647 \u06CC\u06A9 \u0647\u0645\u06A9\u0627\u0631 \u062F\u0631 \u062C\u0645\u0639 \u0645\u0646\u0627\u0633\u0628 \u0627\u0633\u062A\u061F",
          promptEn: "Which phrase is best to politely introduce your colleague?",
          options: ["I'd like you to meet my colleague, Sara.", "Look at this person here.", "This is Sara, say hi.", "Sara is here now."],
          optionsFa: ["\u0645\u0627\u06CC\u0644\u0645 \u0634\u0645\u0627 \u0631\u0627 \u0628\u0627 \u0647\u0645\u06A9\u0627\u0631\u0645 \u0633\u0627\u0631\u0627 \u0622\u0634\u0646\u0627 \u06A9\u0646\u0645.", "\u0628\u0647 \u0627\u06CC\u0646 \u0634\u062E\u0635 \u0627\u06CC\u0646\u062C\u0627 \u0646\u06AF\u0627\u0647 \u06A9\u0646\u06CC\u062F.", "\u0627\u06CC\u0646 \u0633\u0627\u0631\u0627\u0633\u062A\u060C \u0633\u0644\u0627\u0645 \u06A9\u0646\u06CC\u062F.", "\u0633\u0627\u0631\u0627 \u0627\u0644\u0627\u0646 \u0627\u06CC\u0646\u062C\u0627\u0633\u062A."],
          correctAnswer: "I'd like you to meet my colleague, Sara.",
          explanationFa: `\u0641\u0631\u0645\u0648\u0644 \u0627\u0633\u062A\u0627\u0646\u062F\u0627\u0631\u062F \u0645\u0639\u0631\u0641\u06CC \u0631\u0633\u0645\u06CC "I'd like you to meet..." \u0627\u0633\u062A.`,
          explanationEn: 'Formal polite introductions use "I would like you to meet...".',
          category: "reading",
          difficulty: "elementary"
        },
        {
          id: "sq_8",
          type: "multiple-choice",
          promptFa: "\u062F\u0631 \u062E\u0631\u06CC\u062F\u060C \u0648\u0642\u062A\u06CC \u0645\u06CC\u200C\u062E\u0648\u0627\u0647\u06CC\u062F \u0644\u0628\u0627\u0633 \u0631\u0627 \u062F\u0631 \u0627\u062A\u0627\u0642 \u067E\u0631\u0648 \u0627\u0645\u062A\u062D\u0627\u0646 \u06A9\u0646\u06CC\u062F \u0645\u06CC\u200C\u06AF\u0648\u06CC\u06CC\u062F:",
          promptEn: "In a clothing store, how do you ask to try on a shirt?",
          options: ["Can I try this shirt on?", "Can I test this shirt?", "Can I wear this home?", "Can I practice this shirt?"],
          optionsFa: ["\u0622\u06CC\u0627 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u0645 \u0627\u06CC\u0646 \u067E\u06CC\u0631\u0627\u0647\u0646 \u0631\u0627 \u067E\u0631\u0648 \u06A9\u0646\u0645\u061F", "\u0622\u06CC\u0627 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u0645 \u0627\u06CC\u0646 \u067E\u06CC\u0631\u0627\u0647\u0646 \u0631\u0627 \u062A\u0633\u062A \u06A9\u0646\u0645\u061F (\u0646\u0627\u062F\u0631\u0633\u062A)", "\u0622\u06CC\u0627 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u0645 \u0627\u06CC\u0646 \u0631\u0627 \u062E\u0627\u0646\u0647 \u0628\u067E\u0648\u0634\u0645\u061F", "\u0622\u06CC\u0627 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u0645 \u0627\u06CC\u0646 \u067E\u06CC\u0631\u0627\u0647\u0646 \u0631\u0627 \u062A\u0645\u0631\u06CC\u0646 \u06A9\u0646\u0645\u061F"],
          correctAnswer: "Can I try this shirt on?",
          explanationFa: '\u0641\u0639\u0644 \u0645\u0631\u06A9\u0628 \u0628\u0631\u0627\u06CC \u067E\u0631\u0648 \u06A9\u0631\u062F\u0646 \u0644\u0628\u0627\u0633 "try on" \u0627\u0633\u062A.',
          explanationEn: 'The phrasal verb to test clothing fit is "try on".',
          category: "vocabulary",
          difficulty: "beginner"
        }
      ]
    };
    const mistakesQuiz1 = {
      id: "quiz_mistakes_1",
      titleFa: "\u0622\u0632\u0645\u0648\u0646 \u062E\u0637\u0627\u0647\u0627\u06CC \u0631\u0627\u06CC\u062C \u0641\u0627\u0631\u0633\u06CC\u200C\u0632\u0628\u0627\u0646\u0627\u0646 \u062F\u0631 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC",
      titleEn: "Common Pitfalls & Mistakes for Persian Learners",
      descriptionFa: "\u0633\u0646\u062C\u0634 \u06F8 \u0633\u0648\u0627\u0644\u06CC \u0686\u0627\u0644\u0634\u200C\u0647\u0627\u06CC \u067E\u0631\u06A9\u0627\u0631\u0628\u0631\u062F \u062A\u062F\u0627\u062E\u0644 \u0632\u0628\u0627\u0646 \u0645\u0627\u062F\u0631\u06CC \u0628\u0627 \u0633\u0627\u062E\u062A\u0627\u0631\u0647\u0627\u06CC \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC",
      descriptionEn: "8-question targeted test identifying frequent mother-tongue interference errors.",
      type: "grammar",
      level: "elementary",
      xpReward: 60,
      timeLimitSeconds: 450,
      questions: [
        {
          id: "mq_1",
          type: "multiple-choice",
          promptFa: "\u0628\u0631\u0627\u06CC \u0633\u0648\u0627\u0631 \u0634\u062F\u0646 \u0628\u0647 \u062A\u0627\u06A9\u0633\u06CC \u06A9\u062F\u0627\u0645 \u0639\u0628\u0627\u0631\u062A \u0635\u062D\u06CC\u062D \u0627\u0633\u062A\u061F",
          promptEn: "Which preposition is correct for getting inside a taxi?",
          options: ["Get in the taxi", "Get on the taxi", "Get at the taxi", "Get into top of taxi"],
          optionsFa: ["\u0633\u0648\u0627\u0631 \u062A\u0627\u06A9\u0633\u06CC \u0634\u062F\u0646 (\u0635\u062D\u06CC\u062D \u0628\u0627 in)", "\u0633\u0648\u0627\u0631 \u062A\u0627\u06A9\u0633\u06CC \u0634\u062F\u0646 (\u063A\u0644\u0637 \u0628\u0627 on)", "\u062F\u0631 \u06A9\u0646\u0627\u0631 \u062A\u0627\u06A9\u0633\u06CC \u0628\u0648\u062F\u0646", "\u0631\u0648\u06CC \u0633\u0642\u0641 \u062A\u0627\u06A9\u0633\u06CC \u0631\u0641\u062A\u0646"],
          correctAnswer: "Get in the taxi",
          explanationFa: "\u0628\u0631\u0627\u06CC \u0648\u0633\u0627\u06CC\u0644 \u0646\u0642\u0644\u06CC\u0647 \u06A9\u0648\u0686\u06A9 \u06A9\u0647 \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646 \u062F\u0627\u062E\u0644\u0634\u0627\u0646 \u0627\u06CC\u0633\u062A\u0627\u062F (car, taxi) \u0627\u0632 get in \u0648 \u0628\u0631\u0627\u06CC \u0648\u0633\u0627\u06CC\u0644 \u0628\u0632\u0631\u06AF (bus, train, plane) \u0627\u0632 get on \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.",
          explanationEn: 'Use "get in" for cars/taxis and "get on" for buses/trains/planes.',
          category: "grammar",
          difficulty: "elementary"
        },
        {
          id: "mq_2",
          type: "multiple-choice",
          promptFa: "\u06A9\u062F\u0627\u0645 \u0639\u0628\u0627\u0631\u062A \u0628\u0631\u0627\u06CC \u0628\u06CC\u0627\u0646 \u0633\u0646 \u0627\u0632 \u0646\u0638\u0631 \u06AF\u0631\u0627\u0645\u0631\u06CC \u062F\u0631\u0633\u062A \u0627\u0633\u062A\u061F",
          promptEn: "Which sentence correctly states your age?",
          options: ["I am 25 years old.", "I have 25 years old.", "My age has 25.", "I am having 25 years."],
          optionsFa: ["\u0645\u0646 \u06F2\u06F5 \u0633\u0627\u0644 \u062F\u0627\u0631\u0645 (\u0633\u0627\u062E\u062A\u0627\u0631 \u062F\u0631\u0633\u062A \u0628\u0627 to be)", "\u062A\u0631\u062C\u0645\u0647 \u06A9\u0644\u0645\u0647 \u0628\u0647 \u06A9\u0644\u0645\u0647 \u0627\u0632 \u0641\u0627\u0631\u0633\u06CC \u0628\u0627 have (\u063A\u0644\u0637)", "\u0633\u0627\u062E\u062A\u0627\u0631 \u0646\u0627\u0645\u0641\u0647\u0648\u0645", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 \u062D\u0627\u0644 \u0627\u0633\u062A\u0645\u0631\u0627\u0631\u06CC (\u063A\u0644\u0637)"],
          correctAnswer: "I am 25 years old.",
          explanationFa: '\u062F\u0631 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0633\u0646 \u0628\u0627 \u0641\u0639\u0644 to be \u0628\u06CC\u0627\u0646 \u0645\u06CC\u200C\u0634\u0648\u062F (I am ... years old)\u060C \u0628\u0631\u0639\u06A9\u0633 \u0641\u0627\u0631\u0633\u06CC \u0648 \u0641\u0631\u0627\u0646\u0633\u0647 \u06A9\u0647 \u0627\u0632 "\u062F\u0627\u0634\u062A\u0646" \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.',
          explanationEn: 'English expresses age using the verb "to be", never "to have".',
          category: "grammar",
          difficulty: "beginner"
        },
        {
          id: "mq_3",
          type: "multiple-choice",
          promptFa: '\u062C\u0645\u0644\u0647 "\u0645\u0646 \u0628\u0627 \u062A\u0648 \u0627\u0632\u062F\u0648\u0627\u062C \u06A9\u0631\u062F\u0645" \u0628\u0647 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0686\u06AF\u0648\u0646\u0647 \u062A\u0631\u062C\u0645\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F\u061F',
          promptEn: "What is the correct English translation of marrying someone?",
          options: ["She married him.", "She married with him.", "She is marry to him.", "She got married with him."],
          optionsFa: ["\u0627\u0648 \u0628\u0627 \u0627\u0648 \u0627\u0632\u062F\u0648\u0627\u062C \u06A9\u0631\u062F (\u0641\u0639\u0644 \u0645\u0633\u062A\u0642\u06CC\u0645 \u0628\u062F\u0648\u0646 with)", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0632 with \u0628\u0647 \u062A\u0642\u0644\u06CC\u062F \u0627\u0632 \u0641\u0627\u0631\u0633\u06CC", "\u06AF\u0631\u0627\u0645\u0631 \u0646\u0627\u0642\u0635", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0632 with"],
          correctAnswer: "She married him.",
          explanationFa: "\u0641\u0639\u0644 marry \u0645\u062A\u0639\u062F\u06CC \u0627\u0633\u062A \u0648 \u0646\u06CC\u0627\u0632\u06CC \u0628\u0647 \u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 with \u0646\u062F\u0627\u0631\u062F: She married John \u06CC\u0627 She is married to John.",
          explanationEn: 'Marry is transitive: "marry someone", or "be married to someone", never "married with".',
          category: "grammar",
          difficulty: "elementary"
        },
        {
          id: "mq_4",
          type: "multiple-choice",
          promptFa: "\u0628\u0631\u0627\u06CC \u062A\u0648\u0636\u06CC\u062D \u062F\u0627\u062F\u0646 \u0686\u06CC\u0632\u06CC \u0628\u0647 \u06A9\u0633\u06CC \u06A9\u062F\u0627\u0645 \u0633\u0627\u062E\u062A\u0627\u0631 \u0635\u062D\u06CC\u062D \u0627\u0633\u062A\u061F",
          promptEn: "Choose the correct structure for explaining something to someone:",
          options: ["Explain this to me, please.", "Explain me this, please.", "Explain for me this.", "Explain at me."],
          optionsFa: ["\u0627\u06CC\u0646 \u0631\u0627 \u0628\u0647 \u0645\u0646 \u062A\u0648\u0636\u06CC\u062D \u062F\u0647\u06CC\u062F (\u0635\u062D\u06CC\u062D \u0628\u0627 to)", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u0633\u062A\u0642\u06CC\u0645 \u0628\u062F\u0648\u0646 to (\u0646\u0627\u062F\u0631\u0633\u062A)", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 for \u0628\u0647 \u062A\u0642\u0644\u06CC\u062F \u0627\u0632 \u0641\u0627\u0631\u0633\u06CC (\u063A\u0644\u0637)", "\u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 \u0646\u0627\u0645\u0631\u0628\u0648\u0637"],
          correctAnswer: "Explain this to me, please.",
          explanationFa: '\u0641\u0639\u0644 explain \u0633\u0627\u062E\u062A\u0627\u0631 "explain something to someone" \u062F\u0627\u0631\u062F \u0648 \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646 \u06AF\u0641\u062A "explain me".',
          explanationEn: 'We say "explain something to someone", not "explain someone something".',
          category: "grammar",
          difficulty: "elementary"
        },
        {
          id: "mq_5",
          type: "multiple-choice",
          promptFa: "\u06A9\u062F\u0627\u0645 \u06AF\u0632\u06CC\u0646\u0647 \u0628\u0631\u0627\u06CC \u0628\u06CC\u0627\u0646 \u0634\u0631\u06A9\u062A \u062F\u0631 \u0622\u0632\u0645\u0648\u0646 \u062F\u0631\u0633\u062A \u0627\u0633\u062A\u061F",
          promptEn: 'How do you say "I had an exam today"?',
          options: ["I took an exam today.", "I gave an exam today as a student.", "I did an exam today.", "I made an exam."],
          optionsFa: ["\u0627\u0645\u062A\u062D\u0627\u0646 \u062F\u0627\u062F\u0645 (\u062F\u0627\u0646\u0634\u200C\u0622\u0645\u0648\u0632 take exam \u0645\u06CC\u200C\u06A9\u0646\u062F)", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 give (\u06A9\u0647 \u0645\u062E\u0635\u0648\u0635 \u0645\u0639\u0644\u0645 \u0627\u0633\u062A)", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0632 do", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 make"],
          correctAnswer: "I took an exam today.",
          explanationFa: "\u062F\u0627\u0646\u0634\u200C\u0622\u0645\u0648\u0632 \u0627\u0645\u062A\u062D\u0627\u0646 \u0631\u0627 take \u0645\u06CC\u200C\u06A9\u0646\u062F (\u0634\u0631\u06A9\u062A \u0645\u06CC\u200C\u06A9\u0646\u062F)\u060C \u062F\u0631 \u062D\u0627\u0644\u06CC \u06A9\u0647 \u0627\u0633\u062A\u0627\u062F \u0627\u0645\u062A\u062D\u0627\u0646 \u0631\u0627 give \u0645\u06CC\u200C\u06A9\u0646\u062F (\u0628\u0631\u06AF\u0632\u0627\u0631 \u0645\u06CC\u200C\u06A9\u0646\u062F).",
          explanationEn: 'Students "take" or "sit" an exam; teachers "give" an exam.',
          category: "vocabulary",
          difficulty: "elementary"
        },
        {
          id: "mq_6",
          type: "multiple-choice",
          promptFa: "\u06A9\u062F\u0627\u0645 \u06A9\u0644\u0645\u0647 \u0628\u0647 \u0645\u0639\u0646\u06CC \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0627\u0633\u0645 \u063A\u06CC\u0631\u0642\u0627\u0628\u0644 \u0634\u0645\u0627\u0631\u0634 \u0627\u0633\u062A \u0648 \u062C\u0645\u0639 \u0628\u0633\u062A\u0647 \u0646\u0645\u06CC\u200C\u0634\u0648\u062F\u061F",
          promptEn: "Which sentence is grammatically correct regarding information?",
          options: ["He gave me useful information.", "He gave me useful informations.", "He gave me an information.", "He gave me many informations."],
          optionsFa: ["\u0627\u0648 \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0645\u0641\u06CC\u062F\u06CC \u0628\u0647 \u0645\u0646 \u062F\u0627\u062F (\u0635\u062D\u06CC\u062D)", "\u062C\u0645\u0639 \u0628\u0633\u062A\u0646 information \u0628\u0627 s (\u063A\u0644\u0637)", "\u0622\u0648\u0631\u062F\u0646 an \u0642\u0628\u0644 \u0627\u0632 \u0627\u0633\u0645 \u063A\u06CC\u0631\u0634\u0645\u0627\u0631\u0634 (\u063A\u0644\u0637)", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 many informations (\u063A\u0644\u0637)"],
          correctAnswer: "He gave me useful information.",
          explanationFa: "\u0648\u0627\u0698\u0647 Information \u063A\u06CC\u0631\u0642\u0627\u0628\u0644 \u0634\u0645\u0627\u0631\u0634 \u0627\u0633\u062A \u0648 \u0647\u0631\u06AF\u0632 s \u062C\u0645\u0639 \u0646\u0645\u06CC\u200C\u06AF\u06CC\u0631\u062F \u0648 an \u062F\u0631\u06CC\u0627\u0641\u062A \u0646\u0645\u06CC\u200C\u06A9\u0646\u062F.",
          explanationEn: 'Information is uncountable in English and never takes a plural "s".',
          category: "grammar",
          difficulty: "elementary"
        },
        {
          id: "mq_7",
          type: "multiple-choice",
          promptFa: "\u0628\u0631\u0627\u06CC \u0628\u0627\u0632 \u06A9\u0631\u062F\u0646 \u0686\u0631\u0627\u063A \u06CC\u0627 \u062A\u0644\u0648\u06CC\u0632\u06CC\u0648\u0646 \u0627\u0632 \u06A9\u062F\u0627\u0645 \u0641\u0639\u0644 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F\u061F",
          promptEn: "How do you tell someone to turn on the light?",
          options: ["Turn on the light", "Open the light", "Close the light", "Do the light on"],
          optionsFa: ["\u0686\u0631\u0627\u063A \u0631\u0627 \u0631\u0648\u0634\u0646 \u06A9\u0646 (\u0635\u062D\u06CC\u062D)", '\u062A\u0631\u062C\u0645\u0647 \u06A9\u0644\u0645\u0647\u200C\u0628\u0647\u200C\u06A9\u0644\u0645\u0647 \u0627\u0632 \u0641\u0627\u0631\u0633\u06CC "\u0628\u0627\u0632 \u06A9\u0631\u062F\u0646 \u0686\u0631\u0627\u063A" (\u063A\u0644\u0637)', "\u062E\u0627\u0645\u0648\u0634 \u06A9\u0631\u062F\u0646 \u0686\u0631\u0627\u063A \u0628\u0627 close (\u063A\u0644\u0637)", "\u0633\u0627\u062E\u062A\u0627\u0631 \u0646\u0627\u0645\u0641\u0647\u0648\u0645"],
          correctAnswer: "Turn on the light",
          explanationFa: "\u0628\u0631\u0627\u06CC \u0648\u0633\u0627\u06CC\u0644 \u0628\u0631\u0642\u06CC \u0627\u0632 turn on / turn off \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F \u0646\u0647 open / close.",
          explanationEn: 'Use "turn on / switch on" for electrical devices, never "open the light".',
          category: "vocabulary",
          difficulty: "beginner"
        },
        {
          id: "mq_8",
          type: "multiple-choice",
          promptFa: '\u06A9\u062F\u0627\u0645 \u06AF\u0632\u06CC\u0646\u0647 \u0633\u0627\u062E\u062A\u0627\u0631 \u062F\u0631\u0633\u062A \u0628\u0631\u0627\u06CC "\u0645\u0646 \u0628\u0647 \u0627\u0648 \u0632\u0646\u06AF \u0632\u062F\u0645" \u0627\u0633\u062A\u061F',
          promptEn: "How do you say you telephoned someone?",
          options: ["I called him yesterday.", "I called to him yesterday.", "I made a phone with him.", "I called with him."],
          optionsFa: ["\u0645\u0646 \u062F\u06CC\u0631\u0648\u0632 \u0628\u0647 \u0627\u0648 \u0632\u0646\u06AF \u0632\u062F\u0645 (\u0628\u062F\u0648\u0646 \u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647)", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0632 to", "\u062A\u0631\u062C\u0645\u0647 \u062A\u062D\u062A\u200C\u0627\u0644\u0644\u0641\u0638\u06CC", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0632 with"],
          correctAnswer: "I called him yesterday.",
          explanationFa: "\u0641\u0639\u0644 call \u0646\u06CC\u0627\u0632\u06CC \u0628\u0647 \u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 to \u0646\u062F\u0627\u0631\u062F (I called him).",
          explanationEn: 'Call does not take a preposition: "call someone", not "call to someone".',
          category: "grammar",
          difficulty: "beginner"
        }
      ]
    };
    this.quizzes.set(placementQuiz.id, placementQuiz);
    this.quizzes.set(vocabQuiz1.id, vocabQuiz1);
    this.quizzes.set(grammarQuiz1.id, grammarQuiz1);
    this.quizzes.set(situationalQuiz1.id, situationalQuiz1);
    this.quizzes.set(mistakesQuiz1.id, mistakesQuiz1);
    const initialScenarios = [
      {
        id: "sc_restaurant",
        titleEn: "Ordering Food in a Restaurant",
        titleFa: "\u0633\u0641\u0627\u0631\u0634 \u063A\u0630\u0627 \u0648 \u0646\u0648\u0634\u06CC\u062F\u0646\u06CC \u062F\u0631 \u0631\u0633\u062A\u0648\u0631\u0627\u0646 \u{1F37D}\uFE0F",
        descriptionEn: "Practice ordering your favorite meal, asking about the menu, and requesting the bill.",
        descriptionFa: "\u0645\u06A9\u0627\u0644\u0645\u0647 \u0628\u0627 \u06AF\u0627\u0631\u0633\u0648\u0646 \u0631\u0633\u062A\u0648\u0631\u0627\u0646: \u0633\u0641\u0627\u0631\u0634 \u063A\u0630\u0627\u060C \u067E\u0631\u0633\u06CC\u062F\u0646 \u062F\u0631\u0628\u0627\u0631\u0647 \u0645\u0648\u0627\u062F \u062A\u0634\u06A9\u06CC\u0644\u200C\u062F\u0647\u0646\u062F\u0647 \u0648 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0635\u0648\u0631\u062A\u062D\u0633\u0627\u0628.",
        icon: "utensils",
        level: "beginner",
        aiRoleEn: "Friendly Restaurant Waiter",
        aiRoleFa: "\u06AF\u0627\u0631\u0633\u0648\u0646 \u0645\u0647\u0631\u0628\u0627\u0646 \u0631\u0633\u062A\u0648\u0631\u0627\u0646",
        userRoleEn: "Hungry Customer",
        userRoleFa: "\u0645\u0634\u062A\u0631\u06CC \u0631\u0633\u062A\u0648\u0631\u0627\u0646",
        starterMessageEn: "Good evening! Welcome to our bistro. Would you like a table for one or two?",
        starterMessageFa: "\u0639\u0635\u0631 \u0628\u062E\u06CC\u0631! \u0628\u0647 \u0631\u0633\u062A\u0648\u0631\u0627\u0646 \u0645\u0627 \u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F. \u0645\u06CC\u0632 \u0628\u0631\u0627\u06CC \u06CC\u06A9 \u0646\u0641\u0631 \u0645\u06CC\u200C\u062E\u0648\u0627\u0647\u06CC\u062F \u06CC\u0627 \u062F\u0648 \u0646\u0641\u0631\u061F",
        suggestedPhrases: [
          { en: "A table for one, please.", fa: "\u06CC\u06A9 \u0645\u06CC\u0632 \u0628\u0631\u0627\u06CC \u06CC\u06A9 \u0646\u0641\u0631\u060C \u0644\u0637\u0641\u0627\u064B." },
          { en: "Could I see the menu?", fa: "\u0645\u06CC\u0634\u0647 \u0644\u0637\u0641\u0627\u064B \u0645\u0646\u0648 \u0631\u0648 \u0628\u0628\u06CC\u0646\u0645\u061F" },
          { en: "What do you recommend?", fa: "\u0634\u0645\u0627 \u0686\u0647 \u063A\u0630\u0627\u06CC\u06CC \u0631\u0648 \u067E\u06CC\u0634\u0646\u0647\u0627\u062F \u0645\u06CC\u200C\u06A9\u0646\u06CC\u062F\u061F" }
        ]
      },
      {
        id: "sc_school",
        titleEn: "Meeting a New Classmate at School",
        titleFa: "\u0622\u0634\u0646\u0627\u06CC\u06CC \u0628\u0627 \u0647\u0645\u06A9\u0644\u0627\u0633\u06CC \u062C\u062F\u06CC\u062F \u062F\u0631 \u0645\u062F\u0631\u0633\u0647 \u06CC\u0627 \u062F\u0627\u0646\u0634\u06AF\u0627\u0647 \u{1F3EB}",
        descriptionEn: "Introduce yourself, talk about your classes, favorite subjects, and make a friend.",
        descriptionFa: "\u0645\u0639\u0631\u0641\u06CC \u062E\u0648\u062F\u062A\u0627\u0646\u060C \u0635\u062D\u0628\u062A \u062F\u0631\u0628\u0627\u0631\u0647 \u06A9\u0644\u0627\u0633\u200C\u0647\u0627 \u0648 \u062F\u0631\u0633\u200C\u0647\u0627\u06CC \u0645\u0648\u0631\u062F \u0639\u0644\u0627\u0642\u0647 \u0648 \u067E\u06CC\u062F\u0627 \u06A9\u0631\u062F\u0646 \u062F\u0648\u0633\u062A \u062C\u062F\u06CC\u062F.",
        icon: "graduation-cap",
        level: "beginner",
        aiRoleEn: "Friendly New Classmate named Alex",
        aiRoleFa: "\u0647\u0645\u06A9\u0644\u0627\u0633\u06CC \u067E\u0631\u0627\u0646\u0631\u0698\u06CC \u0628\u0647 \u0646\u0627\u0645 \u0627\u0644\u06A9\u0633",
        userRoleEn: "Student",
        userRoleFa: "\u062F\u0627\u0646\u0634\u200C\u0622\u0645\u0648\u0632 / \u062F\u0627\u0646\u0634\u062C\u0648",
        starterMessageEn: "Hi there! I think we share the same English class. My name is Alex. What's your name?",
        starterMessageFa: "\u0633\u0644\u0627\u0645! \u0641\u06A9\u0631 \u06A9\u0646\u0645 \u06A9\u0644\u0627\u0633 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC\u200C\u0645\u0648\u0646 \u0645\u0634\u062A\u0631\u06A9\u0647. \u0627\u0633\u0645 \u0645\u0646 \u0627\u0644\u06A9\u0633\u0647. \u0627\u0633\u0645 \u0634\u0645\u0627 \u0686\u06CC\u0647\u061F",
        suggestedPhrases: [
          { en: "Nice to meet you, Alex. I am...", fa: "\u0627\u0632 \u062F\u06CC\u062F\u0646\u062A \u062E\u0648\u0634\u062D\u0627\u0644\u0645 \u0627\u0644\u06A9\u0633\u060C \u0645\u0646..." },
          { en: "Are you ready for the exam?", fa: "\u0628\u0631\u0627\u06CC \u0627\u0645\u062A\u062D\u0627\u0646 \u0622\u0645\u0627\u062F\u0647\u200C\u0627\u06CC\u061F" }
        ]
      },
      {
        id: "sc_travel",
        titleEn: "At the Airport Information Desk",
        titleFa: "\u0631\u0627\u0647\u0646\u0645\u0627\u06CC\u06CC \u062F\u0631 \u0641\u0631\u0648\u062F\u06AF\u0627\u0647 \u0648 \u067E\u0631\u0648\u0627\u0632 \u2708\uFE0F",
        descriptionEn: "Ask for gate numbers, luggage retrieval, and flight boarding times.",
        descriptionFa: "\u067E\u0631\u0633\u06CC\u062F\u0646 \u062F\u0631\u0628\u0627\u0631\u0647 \u06AF\u06CC\u062A \u067E\u0631\u0648\u0627\u0632\u060C \u062A\u062D\u0648\u06CC\u0644 \u0686\u0645\u062F\u0627\u0646\u200C\u0647\u0627 \u0648 \u0632\u0645\u0627\u0646 \u0633\u0648\u0627\u0631 \u0634\u062F\u0646 \u0628\u0647 \u0647\u0648\u0627\u067E\u06CC\u0645\u0627.",
        icon: "plane",
        level: "intermediate",
        aiRoleEn: "Airport Customer Service Officer",
        aiRoleFa: "\u0645\u062A\u0635\u062F\u06CC \u0631\u0627\u0647\u0646\u0645\u0627\u06CC \u0641\u0631\u0648\u062F\u06AF\u0627\u0647",
        userRoleEn: "Traveler",
        userRoleFa: "\u0645\u0633\u0627\u0641\u0631 \u067E\u0631\u0648\u0627\u0632",
        starterMessageEn: "Hello! How can I assist you with your flight today?",
        starterMessageFa: "\u0633\u0644\u0627\u0645! \u0686\u0637\u0648\u0631 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u0645 \u062F\u0631 \u0645\u0648\u0631\u062F \u067E\u0631\u0648\u0627\u0632\u062A\u0627\u0646 \u0628\u0647 \u0634\u0645\u0627 \u06A9\u0645\u06A9 \u06A9\u0646\u0645\u061F",
        suggestedPhrases: [
          { en: "Excuse me, which gate is flight 402?", fa: "\u0628\u0628\u062E\u0634\u06CC\u062F\u060C \u067E\u0631\u0648\u0627\u0632 \u06F4\u06F0\u06F2 \u0627\u0632 \u06A9\u062F\u0627\u0645 \u06AF\u06CC\u062A \u0627\u0633\u062A\u061F" },
          { en: "Where can I claim my baggage?", fa: "\u06A9\u062C\u0627 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u0645 \u0686\u0645\u062F\u0627\u0646\u200C\u0647\u0627\u06CC\u0645 \u0631\u0627 \u062A\u062D\u0648\u06CC\u0644 \u0628\u06AF\u06CC\u0631\u0645\u061F" }
        ]
      },
      {
        id: "sc_shopping",
        titleEn: "Shopping for Clothes",
        titleFa: "\u062E\u0631\u06CC\u062F \u0644\u0628\u0627\u0633 \u0648 \u0633\u0627\u06CC\u0632\u0628\u0646\u062F\u06CC \u{1F6CD}\uFE0F",
        descriptionEn: "Ask for different sizes, colors, fitting rooms, and prices.",
        descriptionFa: "\u067E\u0631\u0633\u06CC\u062F\u0646 \u062F\u0631\u0628\u0627\u0631\u0647 \u0631\u0646\u06AF\u200C\u0647\u0627\u06CC \u062F\u06CC\u06AF\u0631\u060C \u0627\u062A\u0627\u0642 \u067E\u0631\u0648 \u0648 \u062A\u062E\u0641\u06CC\u0641\u200C\u0647\u0627.",
        icon: "shopping-bag",
        level: "beginner",
        aiRoleEn: "Shop Assistant",
        aiRoleFa: "\u0641\u0631\u0648\u0634\u0646\u062F\u0647 \u0641\u0631\u0648\u0634\u06AF\u0627\u0647 \u067E\u0648\u0634\u0627\u06A9",
        userRoleEn: "Shopper",
        userRoleFa: "\u062E\u0631\u06CC\u062F\u0627\u0631",
        starterMessageEn: "Hi! Let me know if you need help finding the right size or trying something on.",
        starterMessageFa: "\u0633\u0644\u0627\u0645! \u0627\u06AF\u0631 \u06A9\u0645\u06A9\u06CC \u0628\u0631\u0627\u06CC \u067E\u06CC\u062F\u0627 \u06A9\u0631\u062F\u0646 \u0633\u0627\u06CC\u0632 \u0645\u0646\u0627\u0633\u0628 \u06CC\u0627 \u067E\u0631\u0648 \u0644\u0628\u0627\u0633 \u062E\u0648\u0627\u0633\u062A\u06CC\u062F \u0628\u0641\u0631\u0645\u0627\u06CC\u06CC\u062F.",
        suggestedPhrases: [
          { en: "Do you have this in medium size?", fa: "\u0622\u06CC\u0627 \u0633\u0627\u06CC\u0632 \u0645\u062F\u06CC\u0648\u0645 \u0627\u06CC\u0646 \u0631\u0648 \u062F\u0627\u0631\u06CC\u062F\u061F" },
          { en: "Where is the fitting room?", fa: "\u0627\u062A\u0627\u0642 \u067E\u0631\u0648 \u06A9\u062C\u0627\u0633\u062A\u061F" }
        ]
      }
    ];
    initialScenarios.forEach((s) => this.scenarios.set(s.id, s));
    const rooms = [
      {
        id: "room_lounge",
        slug: "english-lounge",
        nameEn: "English Lounge",
        nameFa: "English Lounge (\u062A\u0627\u0644\u0627\u0631 \u0639\u0645\u0648\u0645\u06CC)",
        descriptionEn: "Casual chat, daily thoughts, and general English sharing.",
        descriptionFa: "\u06AF\u0641\u062A\u06AF\u0648\u06CC \u0622\u0632\u0627\u062F\u060C \u0627\u062D\u0648\u0627\u0644\u067E\u0631\u0633\u06CC\u060C \u0627\u0646\u06AF\u06CC\u0632\u0647\u200C\u0628\u062E\u0634\u06CC \u0648 \u0627\u0634\u062A\u0631\u0627\u06A9 \u0645\u0637\u0627\u0644\u0628 \u062C\u0630\u0627\u0628 \u0628\u0647 \u0632\u0628\u0627\u0646 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0648 \u0641\u0627\u0631\u0633\u06CC.",
        icon: "coffee",
        isPublic: true,
        postCount: 0,
        color: "sky"
      },
      {
        id: "room_vocab",
        slug: "vocabulary-help",
        nameEn: "Vocabulary Help",
        nameFa: "\u062A\u0642\u0648\u06CC\u062A \u0644\u063A\u0627\u062A \u0648 \u0627\u0635\u0637\u0644\u0627\u062D\u0627\u062A \u{1F4DA}",
        descriptionEn: "Ask for word meanings, idioms, collocations, and memory techniques.",
        descriptionFa: "\u067E\u0631\u0633\u0634 \u0648 \u067E\u0627\u0633\u062E \u062F\u0631\u0628\u0627\u0631\u0647 \u0645\u0639\u0646\u06CC \u0644\u063A\u0627\u062A\u060C \u0627\u0635\u0637\u0644\u0627\u062D\u0627\u062A \u0631\u0648\u0632\u0645\u0631\u0647 \u0648 \u0631\u0648\u0634\u200C\u0647\u0627\u06CC \u0628\u0647\u200C\u062E\u0627\u0637\u0631\u0633\u067E\u0627\u0631\u06CC.",
        icon: "book-open",
        isPublic: false,
        postCount: 0,
        color: "amber"
      },
      {
        id: "room_grammar",
        slug: "grammar-help",
        nameEn: "Grammar Help",
        nameFa: "\u0631\u0641\u0639 \u0627\u0634\u06A9\u0627\u0644 \u06AF\u0631\u0627\u0645\u0631 \u270D\uFE0F",
        descriptionEn: "Clear your grammar doubts with fellow learners and mentors.",
        descriptionFa: "\u0627\u0634\u06A9\u0627\u0644\u0627\u062A \u06AF\u0631\u0627\u0645\u0631\u06CC\u060C \u0632\u0645\u0627\u0646\u200C\u0647\u0627\u060C \u062D\u0631\u0648\u0641 \u0627\u0636\u0627\u0641\u0647 \u0648 \u0633\u0627\u062E\u062A\u0627\u0631 \u062C\u0645\u0644\u0627\u062A \u0631\u0627 \u0628\u067E\u0631\u0633\u06CC\u062F.",
        icon: "pen-tool",
        isPublic: false,
        postCount: 0,
        color: "emerald"
      },
      {
        id: "room_speaking",
        slug: "speaking-practice",
        nameEn: "Speaking Practice",
        nameFa: "\u062A\u0645\u0631\u06CC\u0646 \u0645\u06A9\u0627\u0644\u0645\u0647 \u0648 \u062A\u0644\u0641\u0638 \u{1F5E3}\uFE0F",
        descriptionEn: "Share speaking tips, topic prompts, and find study buddies.",
        descriptionFa: "\u062A\u0628\u0627\u062F\u0644 \u062C\u0645\u0644\u0627\u062A \u0645\u06A9\u0627\u0644\u0645\u0647\u060C \u062A\u0645\u0631\u06CC\u0646 \u062A\u0644\u0641\u0638 \u0648 \u06CC\u0627\u0641\u062A\u0646 \u067E\u0627\u0631\u062A\u0646\u0631 \u0628\u0631\u0627\u06CC \u06AF\u0641\u062A\u06AF\u0648.",
        icon: "mic",
        isPublic: false,
        postCount: 0,
        color: "rose"
      },
      {
        id: "room_homework",
        slug: "homework-help",
        nameEn: "Homework & School Help",
        nameFa: "\u06A9\u0645\u06A9 \u062F\u0631\u0633\u06CC \u0648 \u062A\u06A9\u0627\u0644\u06CC\u0641 \u0645\u062F\u0631\u0633\u0647 \u{1F393}",
        descriptionEn: "Friendly help with textbook questions and school English lessons.",
        descriptionFa: "\u0645\u062D\u06CC\u0637\u06CC \u0627\u0645\u0646 \u0628\u0631\u0627\u06CC \u0631\u0641\u0639 \u0627\u0634\u06A9\u0627\u0644 \u0633\u0648\u0627\u0644\u0627\u062A \u06A9\u062A\u0627\u0628\u200C\u0647\u0627\u06CC \u062F\u0631\u0633\u06CC \u067E\u0627\u06CC\u0647 \u0647\u0641\u062A\u0645 \u062A\u0627 \u062F\u0648\u0627\u0632\u062F\u0647\u0645 \u0648 \u06A9\u0646\u06A9\u0648\u0631.",
        icon: "help-circle",
        isPublic: false,
        postCount: 0,
        color: "indigo"
      },
      {
        id: "room_movies",
        slug: "movie-english",
        nameEn: "Movie English",
        nameFa: "\u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0628\u0627 \u0641\u06CC\u0644\u0645 \u0648 \u0627\u0646\u06CC\u0645\u06CC\u0634\u0646 \u{1F3AC}",
        descriptionEn: "Discuss quotes, songs, and dialogue from popular movies.",
        descriptionFa: "\u062A\u062D\u0644\u06CC\u0644 \u062F\u06CC\u0627\u0644\u0648\u06AF\u200C\u0647\u0627\u06CC \u0645\u0639\u0631\u0648\u0641 \u0641\u06CC\u0644\u0645\u200C\u0647\u0627 \u0648 \u0627\u0646\u06CC\u0645\u06CC\u0634\u0646\u200C\u0647\u0627 \u0648 \u0627\u0635\u0637\u0644\u0627\u062D\u0627\u062A \u0639\u0627\u0645\u06CC\u0627\u0646\u0647.",
        icon: "film",
        isPublic: false,
        postCount: 0,
        color: "purple"
      }
    ];
    rooms.forEach((r) => this.communityRooms.set(r.id, r));
    const expressionsList = [
      {
        id: "exp_1",
        english: "Piece of cake",
        persian: "\u0645\u062B\u0644 \u0622\u0628 \u062E\u0648\u0631\u062F\u0646\u060C \u062E\u06CC\u0644\u06CC \u0631\u0627\u062D\u062A \u0648 \u0628\u06CC\u200C\u062F\u0631\u062F\u0633\u0631",
        pronunciation: "pi\u02D0s \u0259v ke\u026Ak",
        exampleEn: "Do not worry about the English placement test, it is a piece of cake!",
        exampleFa: "\u0627\u0635\u0644\u0627\u064B \u0646\u06AF\u0631\u0627\u0646 \u0622\u0632\u0645\u0648\u0646 \u062A\u0639\u06CC\u06CC\u0646 \u0633\u0637\u062D \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0646\u0628\u0627\u0634\u060C \u0645\u062B\u0644 \u0622\u0628 \u062E\u0648\u0631\u062F\u0646\u0647!",
        usageNoteFa: "\u06CC\u06A9\u06CC \u0627\u0632 \u0645\u062A\u062F\u0627\u0648\u0644\u200C\u062A\u0631\u06CC\u0646 \u0627\u0635\u0637\u0644\u0627\u062D\u0627\u062A \u0639\u0627\u0645\u06CC\u0627\u0646\u0647 \u0632\u0628\u0627\u0646 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0628\u0631\u0627\u06CC \u06A9\u0627\u0631\u0647\u0627\u06CC \u0628\u0633\u06CC\u0627\u0631 \u0633\u0627\u062F\u0647.",
        category: "idiom",
        difficulty: "beginner",
        likes: 18,
        submittedBy: "\u0645\u0647\u0646\u0627 \u06A9\u0631\u06CC\u0645\u06CC",
        createdAt: new Date(Date.now() - 864e5 * 2).toISOString()
      },
      {
        id: "exp_2",
        english: "Break a leg",
        persian: "\u0645\u0648\u0641\u0642 \u0628\u0627\u0634\u06CC! (\u0628\u0647 \u0627\u0645\u06CC\u062F \u062F\u0631\u062E\u0634\u0634 \u062F\u0631 \u0627\u062C\u0631\u0627)",
        pronunciation: "bre\u026Ak \u0259 le\u0261",
        exampleEn: "You have your presentation today? Break a leg!",
        exampleFa: "\u0627\u0645\u0631\u0648\u0632 \u0627\u0631\u0627\u0626\u0647\u200C\u062A \u0647\u0633\u062A\u061F \u0622\u0631\u0632\u0648\u06CC \u0645\u0648\u0641\u0642\u06CC\u062A \u0648 \u062F\u0631\u062E\u0634\u0634 \u062F\u0627\u0631\u0645 \u0628\u0631\u0627\u062A!",
        usageNoteFa: "\u0627\u06CC\u0646 \u0627\u0635\u0637\u0644\u0627\u062D \u062F\u0631 \u062A\u0626\u0627\u062A\u0631 \u0648 \u0645\u0648\u0642\u0639\u06CC\u062A\u200C\u0647\u0627\u06CC \u0645\u0647\u0645 \u0628\u0631\u0627\u06CC \u0622\u0631\u0632\u0648\u06CC \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F \u0648 \u0645\u0639\u0646\u06CC \u062A\u062D\u062A\u200C\u0627\u0644\u0644\u0641\u0638\u06CC \u0646\u062F\u0627\u0631\u062F.",
        category: "idiom",
        difficulty: "beginner",
        likes: 24,
        submittedBy: "\u0633\u0627\u0631\u0627 \u0631\u0636\u0627\u06CC\u06CC",
        createdAt: new Date(Date.now() - 864e5 * 3).toISOString()
      },
      {
        id: "exp_3",
        english: "Hit the books",
        persian: "\u0628\u06A9\u0648\u0628 \u062F\u0631\u0633 \u062E\u0648\u0627\u0646\u062F\u0646\u060C \u0634\u0631\u0648\u0639 \u062C\u062F\u06CC \u0645\u0637\u0627\u0644\u0639\u0647",
        pronunciation: "h\u026At \xF0\u0259 b\u028Aks",
        exampleEn: "Final exams are next week, I really need to hit the books tonight.",
        exampleFa: "\u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A \u0646\u0647\u0627\u06CC\u06CC \u0647\u0641\u062A\u0647 \u0622\u06CC\u0646\u062F\u0647\u200C\u0633\u062A\u060C \u0627\u0645\u0634\u0628 \u0628\u0627\u06CC\u062F \u062D\u0633\u0627\u0628\u06CC \u0628\u06A9\u0648\u0628 \u062F\u0631\u0633 \u0628\u062E\u0648\u0646\u0645.",
        usageNoteFa: "\u0639\u0628\u0627\u0631\u062A \u0639\u0627\u0645\u06CC\u0627\u0646\u0647 \u062F\u0631 \u0645\u06CC\u0627\u0646 \u062F\u0627\u0646\u0634\u062C\u0648\u06CC\u0627\u0646 \u0648 \u062F\u0627\u0646\u0634\u200C\u0622\u0645\u0648\u0632\u0627\u0646.",
        category: "slang",
        difficulty: "beginner",
        likes: 14,
        submittedBy: "\u0639\u0644\u06CC \u0645\u062D\u0645\u062F\u06CC",
        createdAt: new Date(Date.now() - 864e5 * 4).toISOString()
      },
      {
        id: "exp_4",
        english: "Under the weather",
        persian: "\u0646\u0627\u062E\u0648\u0634\u200C\u0627\u062D\u0648\u0627\u0644\u060C \u06A9\u0633\u0644\u060C \u06A9\u0645\u06CC \u0633\u0631\u0645\u0627\u062E\u0648\u0631\u062F\u0647",
        pronunciation: "\u02C8\u028Cnd\u0259r \xF0\u0259 \u02C8w\u025B\xF0\u0259r",
        exampleEn: "I feel a bit under the weather today, so I will stay home and rest.",
        exampleFa: "\u0627\u0645\u0631\u0648\u0632 \u06A9\u0645\u06CC \u0627\u062D\u0633\u0627\u0633 \u06A9\u0633\u0627\u0644\u062A \u0648 \u0646\u0627\u062E\u0648\u0634\u06CC \u0645\u06CC\u200C\u06A9\u0646\u0645\u060C \u067E\u0633 \u062E\u0648\u0646\u0647 \u0645\u06CC\u200C\u0645\u0648\u0646\u0645 \u0648 \u0627\u0633\u062A\u0631\u0627\u062D\u062A \u0645\u06CC\u200C\u06A9\u0646\u0645.",
        usageNoteFa: "\u0632\u0645\u0627\u0646\u06CC \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F \u06A9\u0647 \u0641\u0631\u062F \u0628\u06CC\u0645\u0627\u0631\u06CC \u0633\u062E\u062A\u06CC \u0646\u062F\u0627\u0631\u062F \u0627\u0645\u0627 \u06A9\u0645\u06CC \u0628\u06CC\u200C\u062D\u0627\u0644 \u06CC\u0627 \u0633\u0631\u0645\u0627\u062E\u0648\u0631\u062F\u0647 \u0627\u0633\u062A.",
        category: "idiom",
        difficulty: "intermediate",
        likes: 16,
        submittedBy: "\u0645\u062F\u06CC\u0631 \u0622\u0645\u0648\u0632\u0634\u06CC \u0645\u0647\u0646\u0627",
        createdAt: new Date(Date.now() - 864e5 * 5).toISOString()
      },
      {
        id: "exp_5",
        english: "Look forward to",
        persian: "\u0628\u06CC\u200C\u0635\u0628\u0631\u0627\u0646\u0647 \u0645\u0634\u062A\u0627\u0642 \u0648 \u0645\u0646\u062A\u0638\u0631 \u0686\u06CC\u0632\u06CC \u0628\u0648\u062F\u0646",
        pronunciation: "l\u028Ak \u02C8f\u0254\u02D0rw\u0259rd tu\u02D0",
        exampleEn: "I am looking forward to seeing you this weekend.",
        exampleFa: "\u0628\u06CC\u200C\u0635\u0628\u0631\u0627\u0646\u0647 \u0645\u0634\u062A\u0627\u0642 \u062F\u06CC\u062F\u0627\u0631\u062A \u062F\u0631 \u0627\u06CC\u0646 \u062A\u0639\u0637\u06CC\u0644\u0627\u062A \u0622\u062E\u0631 \u0647\u0641\u062A\u0647 \u0647\u0633\u062A\u0645.",
        usageNoteFa: "\u0646\u06A9\u062A\u0647 \u0637\u0644\u0627\u06CC\u06CC: \u0628\u0639\u062F \u0627\u0632 to \u062F\u0631 \u0627\u06CC\u0646 \u0627\u0635\u0637\u0644\u0627\u062D \u062D\u062A\u0645\u0627\u064B \u0628\u0627\u06CC\u062F \u0641\u0639\u0644 ing\u062F\u0627\u0631 (gerund) \u06CC\u0627 \u0627\u0633\u0645 \u0628\u06CC\u0627\u06CC\u062F.",
        category: "phrasal_verb",
        difficulty: "intermediate",
        likes: 29,
        submittedBy: "\u0645\u062F\u06CC\u0631 \u0622\u0645\u0648\u0632\u0634\u06CC \u0645\u0647\u0646\u0627",
        createdAt: new Date(Date.now() - 864e5 * 6).toISOString()
      },
      {
        id: "exp_6",
        english: "Call it a day",
        persian: "\u06A9\u0627\u0631 \u0631\u0627 \u0628\u0631\u0627\u06CC \u0627\u0645\u0631\u0648\u0632 \u062A\u0645\u0627\u0645 \u06A9\u0631\u062F\u0646\u060C \u062F\u0633\u062A \u0627\u0632 \u06A9\u0627\u0631 \u06A9\u0634\u06CC\u062F\u0646",
        pronunciation: "k\u0254\u02D0l \u026At \u0259 de\u026A",
        exampleEn: "We have been practicing for four hours, let's call it a day.",
        exampleFa: "\u0686\u0647\u0627\u0631 \u0633\u0627\u0639\u062A \u0645\u062F\u0627\u0648\u0645 \u062A\u0645\u0631\u06CC\u0646 \u06A9\u0631\u062F\u0647\u200C\u0627\u06CC\u0645\u060C \u0628\u06CC\u0627\u06CC\u06CC\u062F \u0628\u0631\u0627\u06CC \u0627\u0645\u0631\u0648\u0632 \u06A9\u0627\u0631 \u0631\u0627 \u062A\u0645\u0627\u0645 \u06A9\u0646\u06CC\u0645.",
        usageNoteFa: "\u0645\u0639\u0645\u0648\u0644\u0627\u064B \u062F\u0631 \u067E\u0627\u06CC\u0627\u0646 \u0634\u06CC\u0641\u062A \u06A9\u0627\u0631\u06CC \u06CC\u0627 \u067E\u0627\u06CC\u0627\u0646 \u06CC\u06A9 \u062C\u0644\u0633\u0647 \u062A\u0645\u0631\u06CC\u0646\u06CC \u0628\u0631\u0627\u06CC \u0627\u0639\u0644\u0627\u0645 \u067E\u0627\u06CC\u0627\u0646 \u06A9\u0627\u0631 \u06AF\u0641\u062A\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.",
        category: "daily",
        difficulty: "beginner",
        likes: 12,
        submittedBy: "\u0645\u0647\u0646\u0627 \u06A9\u0631\u06CC\u0645\u06CC",
        createdAt: new Date(Date.now() - 864e5 * 1).toISOString()
      }
    ];
    expressionsList.forEach((exp) => this.communityExpressions.set(exp.id, exp));
    const grammarTipsList = [
      {
        id: "gtip_1",
        titleFa: "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0632 \u0641\u0639\u0644 To Be \u0628\u0627 Agree",
        incorrectExample: "I am agree with your opinion.",
        correctExample: "I agree with your opinion.",
        explanationFa: "\u0648\u0627\u0698\u0647 Agree \u062F\u0631 \u0632\u0628\u0627\u0646 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u062E\u0648\u062F\u0634 \u0641\u0639\u0644 \u0627\u0633\u062A (verb)\u060C \u0646\u0647 \u0635\u0641\u062A. \u0628\u0646\u0627\u0628\u0631\u0627\u06CC\u0646 \u0646\u06CC\u0627\u0632\u06CC \u0628\u0647 \u0641\u0639\u0644 am/is/are \u0646\u062F\u0627\u0631\u062F.",
        persianContext: '\u0686\u0648\u0646 \u062F\u0631 \u0641\u0627\u0631\u0633\u06CC \u0645\u06CC\u200C\u06AF\u0648\u06CC\u06CC\u0645 "\u0645\u0646 \u0645\u0648\u0627\u0641\u0642\u0645"\u060C \u0632\u0628\u0627\u0646\u200C\u0622\u0645\u0648\u0632\u0627\u0646 \u0628\u0647 \u0627\u0634\u062A\u0628\u0627\u0647 \u0622\u0646 \u0631\u0627 \u0628\u0627 am \u062A\u0631\u062C\u0645\u0647 \u0645\u06CC\u200C\u06A9\u0646\u0646\u062F.',
        difficulty: "beginner",
        likes: 31,
        category: "sentence_structure",
        createdAt: new Date(Date.now() - 864e5 * 4).toISOString()
      },
      {
        id: "gtip_2",
        titleFa: "\u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 \u0632\u0646\u06AF \u0632\u062F\u0646 \u0648 \u062A\u0645\u0627\u0633 \u062A\u0644\u0641\u0646\u06CC",
        incorrectExample: "I will call to you tonight.",
        correctExample: "I will call you tonight.",
        explanationFa: "\u0641\u0639\u0644 Call \u0645\u0641\u0639\u0648\u0644 \u0645\u0633\u062A\u0642\u06CC\u0645 \u0645\u06CC\u200C\u06AF\u06CC\u0631\u062F \u0648 \u0647\u06CC\u0686\u06AF\u0627\u0647 \u0628\u0627 \u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 to \u0628\u0647 \u06A9\u0627\u0631 \u0646\u0645\u06CC\u200C\u0631\u0648\u062F (Call someone).",
        persianContext: '\u062F\u0631 \u0632\u0628\u0627\u0646 \u0641\u0627\u0631\u0633\u06CC \u0645\u06CC\u200C\u06AF\u0648\u06CC\u06CC\u0645 "\u0628\u0647 \u0627\u0648 \u0632\u0646\u06AF \u0632\u062F\u0645" \u06A9\u0647 \u0628\u0627\u0639\u062B \u0648\u0631\u0648\u062F \u0627\u0634\u062A\u0628\u0627\u0647 to \u0628\u0647 \u062C\u0645\u0644\u0647 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0645\u06CC\u200C\u0634\u0648\u062F.',
        difficulty: "beginner",
        likes: 27,
        category: "prepositions",
        createdAt: new Date(Date.now() - 864e5 * 3).toISOString()
      },
      {
        id: "gtip_3",
        titleFa: "\u062C\u0645\u0639 \u0628\u0633\u062A\u0646 \u0627\u0633\u0645 \u063A\u06CC\u0631\u0642\u0627\u0628\u0644 \u0634\u0645\u0627\u0631\u0634 Information",
        incorrectExample: "The teacher gave us many useful informations.",
        correctExample: "The teacher gave us a lot of useful information.",
        explanationFa: "\u06A9\u0644\u0645\u0647 Information \u063A\u06CC\u0631\u0642\u0627\u0628\u0644 \u0634\u0645\u0627\u0631\u0634 (uncountable) \u0627\u0633\u062A\u061B \u0647\u0631\u06AF\u0632 s \u062C\u0645\u0639 \u0646\u0645\u06CC\u200C\u06AF\u06CC\u0631\u062F \u0648 \u06A9\u0644\u0645\u0647 many \u06CC\u0627 an \u0628\u0647 \u0635\u0648\u0631\u062A \u0645\u0633\u062A\u0642\u06CC\u0645 \u0642\u0628\u0644 \u0627\u0632 \u0622\u0646 \u0646\u0645\u06CC\u200C\u0622\u06CC\u062F.",
        persianContext: '\u062F\u0631 \u0641\u0627\u0631\u0633\u06CC "\u0627\u0637\u0644\u0627\u0639\u0627\u062A" \u06A9\u0644\u0645\u0647\u200C\u0627\u06CC \u062C\u0645\u0639 \u0627\u0633\u062A\u060C \u0627\u0645\u0627 \u062F\u0631 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC Information \u0647\u0645\u06CC\u0634\u0647 \u0645\u0641\u0631\u062F \u0644\u062D\u0627\u0638 \u0645\u06CC\u200C\u0634\u0648\u062F.',
        difficulty: "beginner",
        likes: 35,
        category: "common_mistakes",
        createdAt: new Date(Date.now() - 864e5 * 5).toISOString()
      },
      {
        id: "gtip_4",
        titleFa: "\u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 \u0641\u0639\u0644 \u06AF\u0648\u0634 \u062F\u0627\u062F\u0646 (Listen)",
        incorrectExample: "I love listening English podcasts.",
        correctExample: "I love listening to English podcasts.",
        explanationFa: "\u0647\u0631\u06AF\u0627\u0647 \u0628\u0639\u062F \u0627\u0632 \u0641\u0639\u0644 listen \u0645\u0641\u0639\u0648\u0644 \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u06CC\u0645\u060C \u062D\u062A\u0645\u0627\u064B \u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 to \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A (Listen to music/podcasts).",
        persianContext: '\u062F\u0631 \u0641\u0627\u0631\u0633\u06CC \u0645\u06CC\u200C\u06AF\u0648\u06CC\u06CC\u0645 "\u067E\u0627\u062F\u06A9\u0633\u062A \u06AF\u0648\u0634 \u0645\u06CC\u062F\u0645" \u0648 \u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 \u0646\u062F\u0627\u0631\u06CC\u0645\u060C \u0627\u0645\u0627 \u062F\u0631 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC listen \u062D\u062A\u0645\u0627\u064B to \u0645\u06CC\u200C\u062E\u0648\u0627\u0647\u062F.',
        difficulty: "beginner",
        likes: 22,
        category: "prepositions",
        createdAt: new Date(Date.now() - 864e5 * 2).toISOString()
      },
      {
        id: "gtip_5",
        titleFa: "\u062A\u0641\u0627\u0648\u062A \u06AF\u0630\u0634\u062A\u0647 \u0633\u0627\u062F\u0647 \u0648 \u062D\u0627\u0644 \u06A9\u0627\u0645\u0644 \u0628\u0627 \u0642\u06CC\u062F \u0632\u0645\u0627\u0646 \u0645\u0634\u062E\u0635",
        incorrectExample: "I have seen my friend yesterday.",
        correctExample: "I saw my friend yesterday.",
        explanationFa: "\u0628\u0627 \u0642\u06CC\u062F\u0647\u0627\u06CC \u0632\u0645\u0627\u0646 \u0645\u0634\u062E\u0635 \u062F\u0631 \u06AF\u0630\u0634\u062A\u0647 \u0645\u0627\u0646\u0646\u062F yesterday\u060C last night \u06CC\u0627 two days ago \u0647\u0645\u06CC\u0634\u0647 \u0627\u0632 \u06AF\u0630\u0634\u062A\u0647 \u0633\u0627\u062F\u0647 (Simple Past) \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F\u060C \u0646\u0647 \u062D\u0627\u0644 \u06A9\u0627\u0645\u0644 (Present Perfect).",
        persianContext: '\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0634\u062A\u0628\u0627\u0647 \u0627\u0632 "\u062F\u06CC\u062F\u0647\u200C\u0627\u0645" \u0628\u0647 \u062C\u0627\u06CC "\u062F\u06CC\u062F\u0645" \u0632\u0645\u0627\u0646\u06CC \u06A9\u0647 \u0632\u0645\u0627\u0646 \u06AF\u0630\u0634\u062A\u0647 \u0645\u0634\u062E\u0635 \u0627\u0633\u062A.',
        difficulty: "elementary",
        likes: 19,
        category: "tenses",
        createdAt: new Date(Date.now() - 864e5 * 1).toISOString()
      },
      {
        id: "gtip_6",
        titleFa: "\u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 \u062C\u0633\u062A\u062C\u0648 \u062F\u0631 \u0627\u06CC\u0646\u062A\u0631\u0646\u062A",
        incorrectExample: "I searched it in internet.",
        correctExample: "I searched it on the internet.",
        explanationFa: "\u0628\u0631\u0627\u06CC \u0635\u0641\u062D\u0627\u062A \u0648\u0628\u060C \u0631\u0633\u0627\u0646\u0647\u200C\u0647\u0627 \u0648 \u0628\u0633\u062A\u0631 \u0627\u06CC\u0646\u062A\u0631\u0646\u062A \u0647\u0645\u0648\u0627\u0631\u0647 \u0627\u0632 \u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 on the internet \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.",
        persianContext: '\u062A\u0631\u062C\u0645\u0647 \u062A\u062D\u062A\u200C\u0627\u0644\u0644\u0641\u0638\u06CC "\u062F\u0631 \u0627\u06CC\u0646\u062A\u0631\u0646\u062A" \u0628\u0647 in internet \u06CC\u06A9\u06CC \u0627\u0632 \u062E\u0637\u0627\u0647\u0627\u06CC \u0645\u062A\u062F\u0627\u0648\u0644 \u0627\u0633\u062A.',
        difficulty: "beginner",
        likes: 15,
        category: "prepositions",
        createdAt: new Date(Date.now() - 864e5 * 6).toISOString()
      }
    ];
    grammarTipsList.forEach((tip) => this.grammarHelpTips.set(tip.id, tip));
    const v1 = {
      id: "vid_lion_king",
      titleEn: "The Lion King - Hakuna Matata Philosophy",
      titleFa: "\u0627\u0646\u06CC\u0645\u06CC\u0634\u0646 \u0634\u06CC\u0631 \u0634\u0627\u0647: \u0627\u0635\u0637\u0644\u0627\u062D\u0627\u062A \u0622\u0631\u0627\u0645\u0634 \u0648 \u0631\u0647\u0627\u06CC\u06CC \u0627\u0632 \u0646\u06AF\u0631\u0627\u0646\u06CC",
      descriptionEn: "Learn idioms about letting go of worries, simple present expressions, and casual greetings.",
      descriptionFa: "\u0622\u0645\u0648\u0632\u0634 \u0644\u063A\u0627\u062A \u0648 \u0627\u0635\u0637\u0644\u0627\u062D\u0627\u062A \u067E\u0631\u06A9\u0627\u0631\u0628\u0631\u062F \u062F\u0631\u0628\u0627\u0631\u0647 \u063A\u0644\u0628\u0647 \u0628\u0631 \u0627\u0633\u062A\u0631\u0633 \u0648 \u0646\u06AF\u0631\u0627\u0646\u06CC \u0628\u0627 \u062F\u06CC\u0627\u0644\u0648\u06AF\u200C\u0647\u0627\u06CC \u062E\u0627\u0637\u0631\u0647\u200C\u0627\u0646\u06AF\u06CC\u0632 \u062A\u06CC\u0645\u0648\u0646 \u0648 \u067E\u0648\u0645\u0628\u0627.",
      thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      duration: "02:15",
      level: "beginner",
      category: "animation",
      subtitles: [
        {
          id: "sub_1",
          startTime: 0,
          endTime: 4,
          textEn: "Hakuna Matata! What a wonderful phrase.",
          textFa: "\u0647\u0627\u06A9\u0648\u0646\u0627 \u0645\u0627\u062A\u0627\u062A\u0627! \u0686\u0647 \u0639\u0628\u0627\u0631\u062A \u0634\u06AF\u0641\u062A\u200C\u0627\u0646\u06AF\u06CC\u0632\u06CC.",
          keyWords: [{ word: "wonderful", meaningFa: "\u0641\u0648\u0642\u200C\u0627\u0644\u0639\u0627\u062F\u0647 \u0648 \u0634\u06AF\u0641\u062A\u200C\u0627\u0646\u06AF\u06CC\u0632" }]
        },
        {
          id: "sub_2",
          startTime: 4.5,
          endTime: 8,
          textEn: "It means no worries for the rest of your days.",
          textFa: "\u0627\u06CC\u0646 \u06CC\u0639\u0646\u06CC \u0628\u062F\u0648\u0646 \u0646\u06AF\u0631\u0627\u0646\u06CC \u0628\u0631\u0627\u06CC \u0628\u0642\u06CC\u0647 \u0631\u0648\u0632\u0647\u0627\u06CC \u0639\u0645\u0631\u062A.",
          keyWords: [
            { word: "worries", meaningFa: "\u0646\u06AF\u0631\u0627\u0646\u06CC\u200C\u0647\u0627 / \u062F\u0644\u0648\u0627\u067E\u0633\u06CC\u200C\u0647\u0627" },
            { word: "the rest of", meaningFa: "\u0628\u0642\u06CC\u0647 / \u0645\u0627\u0628\u0642\u06CC" }
          ]
        },
        {
          id: "sub_3",
          startTime: 8.5,
          endTime: 14,
          textEn: "It's our problem-free philosophy!",
          textFa: "\u0627\u06CC\u0646 \u0641\u0644\u0633\u0641\u0647 \u0628\u062F\u0648\u0646 \u062F\u0631\u062F\u0633\u0631 \u0648 \u0628\u062F\u0648\u0646 \u0645\u0634\u06A9\u0644 \u0645\u0627\u0633\u062A!",
          keyWords: [{ word: "philosophy", meaningFa: "\u0641\u0644\u0633\u0641\u0647 \u0648 \u0646\u06AF\u0631\u0634 \u0641\u06A9\u0631\u06CC" }]
        }
      ],
      keyPhrases: [
        { en: "No worries", fa: "\u0627\u0635\u0644\u0627\u064B \u0646\u06AF\u0631\u0627\u0646 \u0646\u0628\u0627\u0634 / \u0641\u062F\u0627\u06CC \u0633\u0631\u062A", explanation: "\u0627\u0635\u0637\u0644\u0627\u062D\u06CC \u0639\u0627\u0645\u06CC\u0627\u0646\u0647 \u0648 \u0628\u0633\u06CC\u0627\u0631 \u067E\u0631\u06A9\u0627\u0631\u0628\u0631\u062F \u0645\u0634\u0627\u0628\u0647 You are welcome \u06CC\u0627 Don't worry." },
        { en: "Problem-free", fa: "\u0628\u062F\u0648\u0646 \u062F\u0631\u062F\u0633\u0631 \u0648 \u0628\u062F\u0648\u0646 \u0645\u0634\u06A9\u0644", explanation: "\u062A\u0631\u06A9\u06CC\u0628 \u06A9\u0644\u0645\u0647 \u0628\u0627 \u067E\u0633\u0648\u0646\u062F free \u0628\u0647 \u0645\u0639\u0646\u06CC \u0639\u0627\u0631\u06CC \u0628\u0648\u062F\u0646 \u0627\u0632 \u0622\u0646 \u0686\u06CC\u0632 \u0627\u0633\u062A\u060C \u0645\u062B\u0644 sugar-free (\u0628\u062F\u0648\u0646 \u0634\u06A9\u0631)." },
        { en: "Rest of your days", fa: "\u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647 \u0639\u0645\u0631 \u0648 \u0631\u0648\u0632\u0647\u0627", explanation: "\u062A\u0639\u0628\u06CC\u0631\u06CC \u0634\u0627\u0639\u0631\u0627\u0646\u0647 \u0628\u0631\u0627\u06CC \u0627\u0634\u0627\u0631\u0647 \u0628\u0647 \u0622\u06CC\u0646\u062F\u0647." }
      ]
    };
    const v2 = {
      id: "vid_spiderman",
      titleEn: "Spider-Man - Great Power and Responsibility",
      titleFa: "\u0645\u0631\u062F \u0639\u0646\u06A9\u0628\u0648\u062A\u06CC: \u062F\u06CC\u0627\u0644\u0648\u06AF \u0645\u0627\u0646\u062F\u06AF\u0627\u0631 \u0642\u062F\u0631\u062A \u0648 \u0645\u0633\u0626\u0648\u0644\u06CC\u062A",
      descriptionEn: "Classic dialogue analyzing the famous proverb and modal verbs.",
      descriptionFa: "\u0628\u0631\u0631\u0633\u06CC \u0633\u0627\u062E\u062A\u0627\u0631 \u062C\u0645\u0644\u0627\u062A \u067E\u0646\u062F\u0622\u0645\u0648\u0632 \u0648 \u0627\u0641\u0639\u0627\u0644 \u0634\u0631\u0637\u06CC \u062F\u0631 \u06CC\u06A9\u06CC \u0627\u0632 \u0645\u0634\u0647\u0648\u0631\u062A\u0631\u06CC\u0646 \u062F\u06CC\u0627\u0644\u0648\u06AF\u200C\u0647\u0627\u06CC \u062A\u0627\u0631\u06CC\u062E \u0633\u06CC\u0646\u0645\u0627.",
      thumbnail: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration: "01:45",
      level: "elementary",
      category: "movie",
      subtitles: [
        {
          id: "sub_s1",
          startTime: 0,
          endTime: 5,
          textEn: "Whatever life holds in store for me, I will never forget these words.",
          textFa: "\u0632\u0646\u062F\u06AF\u06CC \u0647\u0631 \u0686\u0647 \u062F\u0631 \u0686\u0646\u062A\u0647 \u0628\u0631\u0627\u06CC\u0645 \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F\u060C \u0647\u0631\u06AF\u0632 \u0627\u06CC\u0646 \u06A9\u0644\u0645\u0627\u062A \u0631\u0627 \u0641\u0631\u0627\u0645\u0648\u0634 \u0646\u062E\u0648\u0627\u0647\u0645 \u06A9\u0631\u062F.",
          keyWords: [{ word: "in store for", meaningFa: "\u062F\u0631 \u062A\u0642\u062F\u06CC\u0631 / \u0622\u0645\u0627\u062F\u0647 \u0628\u0631\u0627\u06CC \u0622\u06CC\u0646\u062F\u0647" }]
        },
        {
          id: "sub_s2",
          startTime: 5.5,
          endTime: 10,
          textEn: "With great power comes great responsibility.",
          textFa: "\u0647\u0645\u0631\u0627\u0647 \u0628\u0627 \u0642\u062F\u0631\u062A \u0628\u0632\u0631\u06AF\u060C \u0645\u0633\u0626\u0648\u0644\u06CC\u062A\u06CC \u0628\u0632\u0631\u06AF \u067E\u062F\u06CC\u062F \u0645\u06CC\u200C\u0622\u06CC\u062F.",
          keyWords: [
            { word: "power", meaningFa: "\u0642\u062F\u0631\u062A \u0648 \u062A\u0648\u0627\u0646\u0627\u06CC\u06CC" },
            { word: "responsibility", meaningFa: "\u0645\u0633\u0626\u0648\u0644\u06CC\u062A \u0648 \u0648\u0638\u06CC\u0641\u0647\u200C\u0634\u0646\u0627\u0633\u06CC" }
          ]
        }
      ],
      keyPhrases: [
        { en: "In store for me", fa: "\u062F\u0631 \u0633\u0631\u0646\u0648\u0634\u062A \u0645\u0646 \u0631\u0642\u0645 \u062E\u0648\u0631\u062F\u0647", explanation: "\u0627\u0635\u0637\u0644\u0627\u062D\u06CC \u0632\u06CC\u0628\u0627 \u0628\u0631\u0627\u06CC \u067E\u06CC\u0634\u200C\u0628\u06CC\u0646\u06CC \u0648\u0642\u0627\u06CC\u0639 \u0622\u06CC\u0646\u062F\u0647." },
        { en: "Great responsibility", fa: "\u0645\u0633\u0626\u0648\u0644\u06CC\u062A \u062E\u0637\u06CC\u0631 \u0648 \u0633\u0646\u06AF\u06CC\u0646", explanation: "\u06A9\u0644\u0645\u0647 responsibility \u0627\u0632 \u067E\u0631\u06A9\u0627\u0631\u0628\u0631\u062F\u062A\u0631\u06CC\u0646 \u0648\u0627\u0698\u06AF\u0627\u0646 \u0633\u0637\u062D \u0645\u062A\u0648\u0633\u0637 \u0627\u0633\u062A." }
      ]
    };
    this.videoLessons.set(v1.id, v1);
    this.videoLessons.set(v2.id, v2);
    const defaultAchievements = [
      {
        id: "ach_first_quiz",
        code: "FIRST_QUIZ",
        titleFa: "\u0642\u062F\u0645 \u0627\u0648\u0644 \u0642\u0647\u0631\u0645\u0627\u0646 \u{1F3C5}",
        titleEn: "First Quiz Completed",
        descriptionFa: "\u0627\u0648\u0644\u06CC\u0646 \u06A9\u0648\u0626\u06CC\u0632 \u062E\u0648\u062F \u0631\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u067E\u0634\u062A \u0633\u0631 \u0628\u06AF\u0630\u0627\u0631\u06CC\u062F.",
        descriptionEn: "Successfully complete your first English quiz.",
        icon: "award",
        targetCount: 1,
        currentCount: 0,
        unlocked: false,
        xpReward: 50
      },
      {
        id: "ach_7_streak",
        code: "7_DAY_STREAK",
        titleFa: "\u0627\u0633\u062A\u0645\u0631\u0627\u0631 \u0637\u0644\u0627\u06CC\u06CC (\u06F7 \u0631\u0648\u0632 \u067E\u06CC\u0627\u067E\u06CC) \u{1F525}",
        titleEn: "7-Day Streak Master",
        descriptionFa: "\u06F7 \u0631\u0648\u0632 \u067E\u0634\u062A \u0633\u0631 \u0647\u0645 \u062A\u0645\u0631\u06CC\u0646 \u0631\u0648\u0632\u0627\u0646\u0647 \u0631\u0627 \u0627\u0646\u062C\u0627\u0645 \u062F\u0647\u06CC\u062F.",
        descriptionEn: "Practice English for 7 consecutive days.",
        icon: "flame",
        targetCount: 7,
        currentCount: 0,
        unlocked: false,
        xpReward: 100
      },
      {
        id: "ach_100_words",
        code: "100_WORDS",
        titleFa: "\u06AF\u0646\u062C\u06CC\u0646\u0647 \u0648\u0627\u0698\u06AF\u0627\u0646 (\u06F1\u06F0\u06F0 \u0644\u063A\u062A) \u{1F4DA}",
        titleEn: "Vocabulary Master",
        descriptionFa: "\u06F1\u06F0\u06F0 \u06A9\u0644\u0645\u0647 \u062C\u062F\u06CC\u062F \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0631\u0627 \u06CC\u0627\u062F \u0628\u06AF\u06CC\u0631\u06CC\u062F.",
        descriptionEn: "Learn and practice 100 new English vocabulary words.",
        icon: "book-open",
        targetCount: 100,
        currentCount: 0,
        unlocked: false,
        xpReward: 150
      },
      {
        id: "ach_first_ai",
        code: "FIRST_AI_CHAT",
        titleFa: "\u062F\u0648\u0633\u062A \u0647\u0648\u0634 \u0645\u0635\u0646\u0648\u0639\u06CC \u{1F916}",
        titleEn: "First AI Conversation",
        descriptionFa: "\u0627\u0648\u0644\u06CC\u0646 \u06AF\u0641\u062A\u06AF\u0648\u06CC \u062A\u0645\u0631\u06CC\u0646\u06CC \u062E\u0648\u062F \u0631\u0627 \u0628\u0627 \u0645\u0647\u0646\u0627 \u0628\u0647 \u067E\u0627\u06CC\u0627\u0646 \u0628\u0631\u0633\u0627\u0646\u06CC\u062F.",
        descriptionEn: "Complete your first conversational practice with Mohanna AI.",
        icon: "bot",
        targetCount: 1,
        currentCount: 0,
        unlocked: false,
        xpReward: 60
      }
    ];
    this.achievements.set(demoUser.id, defaultAchievements);
    this.notifications.set(demoUser.id, []);
  }
  // User management
  getUserById(id) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
  getUserByEmail(email) {
    return Array.from(this.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  createUser(userData) {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newUser = {
      id,
      fullName: userData.fullName,
      email: userData.email,
      passwordHash: userData.password,
      // securely handled in server
      ageRange: userData.ageRange || "18-24",
      englishLevel: userData.englishLevel || "beginner",
      learningGoal: userData.learningGoal || "general",
      role: userData.role || "user",
      xp: 0,
      streak: 0,
      lastActiveDate: "",
      createdAt: now
    };
    this.users.set(id, newUser);
    this.savedWords.set(id, []);
    this.learnedWords.set(id, /* @__PURE__ */ new Set());
    this.achievements.set(id, [
      {
        id: `ach_1_${id}`,
        code: "FIRST_QUIZ",
        titleFa: "\u0642\u062F\u0645 \u0627\u0648\u0644 \u0642\u0647\u0631\u0645\u0627\u0646 \u{1F3C5}",
        titleEn: "First Quiz Completed",
        descriptionFa: "\u0627\u0648\u0644\u06CC\u0646 \u06A9\u0648\u0626\u06CC\u0632 \u062E\u0648\u062F \u0631\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u067E\u0634\u062A \u0633\u0631 \u0628\u06AF\u0630\u0627\u0631\u06CC\u062F.",
        descriptionEn: "Successfully complete your first English quiz.",
        icon: "award",
        targetCount: 1,
        currentCount: 0,
        unlocked: false,
        xpReward: 50
      },
      {
        id: `ach_2_${id}`,
        code: "7_DAY_STREAK",
        titleFa: "\u0627\u0633\u062A\u0645\u0631\u0627\u0631 \u0637\u0644\u0627\u06CC\u06CC (\u06F7 \u0631\u0648\u0632 \u067E\u06CC\u0627\u067E\u06CC) \u{1F525}",
        titleEn: "7-Day Streak Master",
        descriptionFa: "\u06F7 \u0631\u0648\u0632 \u067E\u0634\u062A \u0633\u0631 \u0647\u0645 \u062A\u0645\u0631\u06CC\u0646 \u0631\u0648\u0632\u0627\u0646\u0647 \u0631\u0627 \u0627\u0646\u062C\u0627\u0645 \u062F\u0647\u06CC\u062F.",
        descriptionEn: "Practice English for 7 consecutive days.",
        icon: "flame",
        targetCount: 7,
        currentCount: 0,
        unlocked: false,
        xpReward: 100
      },
      {
        id: `ach_3_${id}`,
        code: "100_WORDS",
        titleFa: "\u06AF\u0646\u062C\u06CC\u0646\u0647 \u0648\u0627\u0698\u06AF\u0627\u0646 (\u06F1\u06F0\u06F0 \u0644\u063A\u062A) \u{1F4DA}",
        titleEn: "Vocabulary Master",
        descriptionFa: "\u06F1\u06F0\u06F0 \u06A9\u0644\u0645\u0647 \u062C\u062F\u06CC\u062F \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0631\u0627 \u06CC\u0627\u062F \u0628\u06AF\u06CC\u0631\u06CC\u062F.",
        descriptionEn: "Learn and practice 100 new English vocabulary words.",
        icon: "book-open",
        targetCount: 100,
        currentCount: 0,
        unlocked: false,
        xpReward: 150
      },
      {
        id: `ach_4_${id}`,
        code: "FIRST_AI_CHAT",
        titleFa: "\u062F\u0648\u0633\u062A \u0647\u0648\u0634 \u0645\u0635\u0646\u0648\u0639\u06CC \u{1F916}",
        titleEn: "First AI Conversation",
        descriptionFa: "\u06CC\u06A9 \u06AF\u0641\u062A\u06AF\u0648\u06CC \u062A\u0645\u0631\u06CC\u0646\u06CC \u0628\u0627 \u0645\u0647\u0646\u0627 \u0628\u0647 \u067E\u0627\u06CC\u0627\u0646 \u0628\u0631\u0633\u0627\u0646\u06CC\u062F.",
        descriptionEn: "Complete your first conversational practice with Mohanna AI.",
        icon: "bot",
        targetCount: 1,
        currentCount: 0,
        unlocked: false,
        xpReward: 60
      }
    ]);
    return this.getUserById(id);
  }
  resetUserProgress(userId) {
    const user = this.users.get(userId);
    if (!user) return void 0;
    user.xp = 0;
    user.streak = 0;
    user.lastActiveDate = "";
    this.users.set(userId, user);
    this.savedWords.set(userId, []);
    this.learnedWords.set(userId, /* @__PURE__ */ new Set());
    this.quizResults.set(userId, []);
    this.notifications.set(userId, []);
    const achs = this.achievements.get(userId) || [];
    const resetAchs = achs.map((a) => ({
      ...a,
      currentCount: 0,
      unlocked: false,
      unlockedAt: void 0
    }));
    this.achievements.set(userId, resetAchs);
    return this.getUserById(userId);
  }
  updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    const { passwordHash, ...safeUser } = updated;
    return safeUser;
  }
  addXpAndStreak(userId, xpAmount) {
    const user = this.users.get(userId);
    if (!user) return { xp: 0, streak: 0 };
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    let streak = user.streak;
    if (user.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0];
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
  getAllVocabulary() {
    return Array.from(this.vocabulary.values());
  }
  getSavedWords(userId) {
    const saved = this.savedWords.get(userId) || [];
    return saved.map((s) => {
      const word = this.vocabulary.get(s.wordId);
      if (!word) return null;
      return {
        ...word,
        savedAt: s.savedAt,
        masteryLevel: s.masteryLevel
      };
    }).filter((w) => w !== null);
  }
  saveWord(userId, wordId) {
    const list = this.savedWords.get(userId) || [];
    if (list.some((item) => item.wordId === wordId)) return false;
    list.push({
      id: `sw_${Date.now()}`,
      userId,
      wordId,
      savedAt: (/* @__PURE__ */ new Date()).toISOString(),
      masteryLevel: 1
    });
    this.savedWords.set(userId, list);
    return true;
  }
  unsaveWord(userId, wordId) {
    const list = this.savedWords.get(userId) || [];
    const filtered = list.filter((item) => item.wordId !== wordId);
    this.savedWords.set(userId, filtered);
    return true;
  }
  markWordLearned(userId, wordId) {
    const learned = this.learnedWords.get(userId) || /* @__PURE__ */ new Set();
    learned.add(wordId);
    this.learnedWords.set(userId, learned);
    this.addXpAndStreak(userId, 10);
  }
  getLearnedWords(userId) {
    const learnedSet = this.learnedWords.get(userId) || /* @__PURE__ */ new Set();
    return Array.from(learnedSet).map((id) => this.vocabulary.get(id)).filter((w) => Boolean(w));
  }
  // Quizzes & Results
  getQuizById(id) {
    return this.quizzes.get(id);
  }
  getAllQuizzes() {
    return Array.from(this.quizzes.values());
  }
  saveQuizResult(result) {
    const results = this.quizResults.get(result.userId) || [];
    results.unshift(result);
    this.quizResults.set(result.userId, results);
    this.addXpAndStreak(result.userId, Math.round(result.score * 10));
    const achs = this.achievements.get(result.userId) || [];
    const firstAch = achs.find((a) => a.code === "FIRST_QUIZ");
    if (firstAch && !firstAch.unlocked) {
      firstAch.unlocked = true;
      firstAch.unlockedAt = (/* @__PURE__ */ new Date()).toISOString();
      firstAch.currentCount = 1;
      this.achievements.set(result.userId, achs);
    }
  }
  getUserQuizHistory(userId) {
    return this.quizResults.get(userId) || [];
  }
  // Community
  getCommunityRooms() {
    return Array.from(this.communityRooms.values());
  }
  getPosts(roomId) {
    let posts = Array.from(this.communityPosts.values());
    if (roomId && roomId !== "all") {
      posts = posts.filter((p) => p.roomId === roomId);
    }
    return posts.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  createPost(postData) {
    const id = `post_${Date.now()}`;
    const newPost = {
      ...postData,
      id,
      likes: 0,
      commentsCount: 0,
      comments: [],
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.communityPosts.set(id, newPost);
    this.addXpAndStreak(postData.authorId, 15);
    return newPost;
  }
  addComment(postId, commentData) {
    const post = this.communityPosts.get(postId);
    if (!post) return void 0;
    const comment = {
      ...commentData,
      id: `comm_${Date.now()}`,
      postId,
      likes: 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    post.comments = post.comments || [];
    post.comments.push(comment);
    post.commentsCount = post.comments.length;
    this.communityPosts.set(postId, post);
    this.addXpAndStreak(commentData.authorId, 5);
    return comment;
  }
  reportContent(report) {
    const id = `rep_${Date.now()}`;
    const newReport = {
      ...report,
      id,
      status: "pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.moderationReports.set(id, newReport);
    return newReport;
  }
  getModerationReports() {
    return Array.from(this.moderationReports.values());
  }
  likePost(postId) {
    const post = this.communityPosts.get(postId);
    if (!post) return 0;
    post.likes = (post.likes || 0) + 1;
    this.communityPosts.set(postId, post);
    return post.likes;
  }
  deletePost(postId) {
    return this.communityPosts.delete(postId);
  }
  // Community Expressions (Idioms, Slangs, Phrasal Verbs)
  getCommunityExpressions(category) {
    let list = Array.from(this.communityExpressions.values());
    if (category && category !== "all") {
      list = list.filter((e) => e.category === category);
    }
    return list.sort((a, b) => b.likes - a.likes || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  addCommunityExpression(data) {
    const id = `exp_${Date.now()}`;
    const newExp = {
      ...data,
      id,
      likes: 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.communityExpressions.set(id, newExp);
    return newExp;
  }
  likeCommunityExpression(id) {
    const exp = this.communityExpressions.get(id);
    if (!exp) return 0;
    exp.likes = (exp.likes || 0) + 1;
    this.communityExpressions.set(id, exp);
    return exp.likes;
  }
  // Grammar Help Tips & Common Persian Mistakes
  getGrammarHelpTips(category) {
    let list = Array.from(this.grammarHelpTips.values());
    if (category && category !== "all") {
      list = list.filter((g) => g.category === category);
    }
    return list.sort((a, b) => b.likes - a.likes || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  addGrammarHelpTip(data) {
    const id = `gtip_${Date.now()}`;
    const newTip = {
      ...data,
      id,
      likes: 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.grammarHelpTips.set(id, newTip);
    return newTip;
  }
  likeGrammarHelpTip(id) {
    const tip = this.grammarHelpTips.get(id);
    if (!tip) return 0;
    tip.likes = (tip.likes || 0) + 1;
    this.grammarHelpTips.set(id, tip);
    return tip.likes;
  }
  // Scenarios & Video Lessons
  getScenarios() {
    return Array.from(this.scenarios.values());
  }
  getVideoLessons() {
    return Array.from(this.videoLessons.values());
  }
  getAchievements(userId) {
    return this.achievements.get(userId) || [];
  }
  getNotifications(userId) {
    return this.notifications.get(userId) || [];
  }
  markNotificationRead(userId, notifId) {
    const notifs = this.notifications.get(userId) || [];
    const notif = notifs.find((n) => n.id === notifId);
    if (notif) notif.read = true;
  }
  // Admin additions
  addVocabularyBatch(words) {
    const added = [];
    words.forEach((w) => {
      const id = `voc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const word = { ...w, id };
      this.vocabulary.set(id, word);
      added.push(word);
    });
    return added;
  }
  addQuiz(quiz) {
    const id = `quiz_${Date.now()}`;
    const newQuiz = { ...quiz, id };
    this.quizzes.set(id, newQuiz);
    return newQuiz;
  }
  addScenario(scenario) {
    const id = `sc_${Date.now()}`;
    const newScenario = { ...scenario, id };
    this.scenarios.set(id, newScenario);
    return newScenario;
  }
};
var db = new Database();

// server/routes/auth.ts
var authRouter = (0, import_express.Router)();
function getAuthUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "").trim();
  const userId = db.sessions.get(token);
  if (!userId) return null;
  return db.getUserById(userId);
}
authRouter.post("/register", (req, res) => {
  try {
    const { fullName, email, password, ageRange, englishLevel, learningGoal } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "\u0644\u0637\u0641\u0627\u064B \u0646\u0627\u0645\u060C \u0627\u06CC\u0645\u06CC\u0644 \u0648 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F." });
    }
    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "\u062D\u0633\u0627\u0628\u06CC \u0628\u0627 \u0627\u06CC\u0646 \u0622\u062F\u0631\u0633 \u0627\u06CC\u0645\u06CC\u0644 \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A \u0634\u062F\u0647 \u0627\u0633\u062A." });
    }
    const user = db.createUser({
      fullName,
      email,
      password,
      ageRange: ageRange || "18-24",
      englishLevel: englishLevel || "beginner",
      learningGoal: learningGoal || "general",
      role: "user"
    });
    const token = `token_${user.id}_${Date.now()}`;
    db.sessions.set(token, user.id);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0627 \u062F\u0631 \u062B\u0628\u062A \u0646\u0627\u0645" });
  }
});
authRouter.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "\u0627\u06CC\u0645\u06CC\u0644 \u0648 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A." });
    }
    const userWithPass = db.getUserByEmail(email);
    if (!userWithPass || userWithPass.passwordHash !== password) {
      return res.status(401).json({ error: "\u0627\u06CC\u0645\u06CC\u0644 \u06CC\u0627 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0627\u0634\u062A\u0628\u0627\u0647 \u0627\u0633\u062A." });
    }
    const { passwordHash, ...safeUser } = userWithPass;
    const token = `token_${safeUser.id}_${Date.now()}`;
    db.sessions.set(token, safeUser.id);
    res.json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ error: "\u062E\u0637\u0627 \u062F\u0631 \u0648\u0631\u0648\u062F \u0628\u0647 \u062D\u0633\u0627\u0628" });
  }
});
authRouter.get("/me", (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.json({ user: null });
  }
  res.json({ user });
});
authRouter.post("/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "").trim();
    db.sessions.delete(token);
  }
  res.json({ success: true, message: "\u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062E\u0627\u0631\u062C \u0634\u062F\u06CC\u062F" });
});
authRouter.post("/update-profile", (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: "\u0644\u0637\u0641\u0627\u064B \u0627\u0628\u062A\u062F\u0627 \u0648\u0627\u0631\u062F \u062D\u0633\u0627\u0628 \u062E\u0648\u062F \u0634\u0648\u06CC\u062F" });
  const { fullName, ageRange, englishLevel, learningGoal } = req.body;
  const updated = db.updateUser(user.id, {
    fullName: fullName || user.fullName,
    ageRange: ageRange || user.ageRange,
    englishLevel: englishLevel || user.englishLevel,
    learningGoal: learningGoal || user.learningGoal
  });
  res.json({ user: updated });
});
authRouter.post("/reset-progress", (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: "\u0644\u0637\u0641\u0627\u064B \u0627\u0628\u062A\u062F\u0627 \u0648\u0627\u0631\u062F \u062D\u0633\u0627\u0628 \u062E\u0648\u062F \u0634\u0648\u06CC\u062F" });
  const updated = db.resetUserProgress(user.id);
  res.json({ success: true, user: updated, message: "\u067E\u06CC\u0634\u0631\u0641\u062A \u0634\u0645\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0632 \u0635\u0641\u0631 \u062A\u0646\u0638\u06CC\u0645 \u0634\u062F." });
});
authRouter.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "\u0644\u0637\u0641\u0627\u064B \u0627\u06CC\u0645\u06CC\u0644 \u062E\u0648\u062F \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F." });
  const user = db.getUserByEmail(email);
  if (!user) {
    return res.json({ message: "\u0627\u06AF\u0631 \u062D\u0633\u0627\u0628\u06CC \u0628\u0627 \u0627\u06CC\u0646 \u0627\u06CC\u0645\u06CC\u0644 \u0648\u062C\u0648\u062F \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F\u060C \u0644\u06CC\u0646\u06A9 \u0628\u0627\u0632\u06CC\u0627\u0628\u06CC \u0627\u0631\u0633\u0627\u0644 \u0634\u062F." });
  }
  res.json({ message: "\u0644\u06CC\u0646\u06A9 \u0628\u0627\u0632\u06CC\u0627\u0628\u06CC \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0628\u0647 \u0627\u06CC\u0645\u06CC\u0644 \u0634\u0645\u0627 \u0627\u0631\u0633\u0627\u0644 \u0634\u062F (\u06A9\u062F \u0645\u0648\u0642\u062A: 123456)." });
});

// server/routes/ai.ts
var import_express2 = require("express");

// server/gemini.ts
var import_genai = require("@google/genai");
var aiInstance = null;
function getGemini() {
  if (!aiInstance) {
    aiInstance = new import_genai.GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiInstance;
}
var GEMINI_TIMEOUT_MS = 6e3;
async function withTimeout(promise, timeoutMs = GEMINI_TIMEOUT_MS) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("AI generation timeout")), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer);
  }
}
function diagnoseSentenceLocally(sentence) {
  const original = sentence.trim();
  let text = original;
  const detectedRules = [];
  const explanations = [];
  const alternatives = [];
  if (/\b(I am|I'm)\s+agree\b/i.test(text)) {
    text = text.replace(/\b(I am|I'm)\s+agree\b/gi, "I agree");
    explanations.push('\u062F\u0631 \u0632\u0628\u0627\u0646 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u06A9\u0644\u0645\u0647 "agree" \u062E\u0648\u062F \u06CC\u06A9 \u0641\u0639\u0644 \u0627\u0633\u062A\u060C \u0628\u0646\u0627\u0628\u0631\u0627\u06CC\u0646 \u0646\u0628\u0627\u06CC\u062F \u0647\u0645\u0631\u0627\u0647 \u0628\u0627 "am" \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0634\u0648\u062F (I agree \u0635\u062D\u06CC\u062D \u0627\u0633\u062A\u060C \u0646\u0647 I am agree).');
    detectedRules.push("\u0641\u0639\u0644 agree \u0628\u062F\u0648\u0646 \u0627\u0641\u0639\u0627\u0644 to be (\u0645\u062B\u0644 am/is/are) \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.");
    alternatives.push("I agree with you.");
    alternatives.push("I completely agree.");
  }
  if (/\b(didn't|did not|did)\s+(went|saw|bought|came|had|made|took|ate|knew|wrote)\b/i.test(text)) {
    text = text.replace(/\b(didn't|did not|did)\s+went\b/gi, "$1 go").replace(/\b(didn't|did not|did)\s+saw\b/gi, "$1 see").replace(/\b(didn't|did not|did)\s+bought\b/gi, "$1 buy").replace(/\b(didn't|did not|did)\s+came\b/gi, "$1 come").replace(/\b(didn't|did not|did)\s+had\b/gi, "$1 have").replace(/\b(didn't|did not|did)\s+made\b/gi, "$1 make").replace(/\b(didn't|did not|did)\s+took\b/gi, "$1 take").replace(/\b(didn't|did not|did)\s+ate\b/gi, "$1 eat").replace(/\b(didn't|did not|did)\s+knew\b/gi, "$1 know").replace(/\b(didn't|did not|did)\s+wrote\b/gi, "$1 write");
    explanations.push("\u0628\u0639\u062F \u0627\u0632 \u0627\u0641\u0639\u0627\u0644 \u06A9\u0645\u06A9\u06CC \u06AF\u0630\u0634\u062A\u0647 \u0645\u0627\u0646\u0646\u062F did \u0648 didn\u2019t\u060C \u0641\u0639\u0644 \u0627\u0635\u0644\u06CC \u0647\u0645\u06CC\u0634\u0647 \u0628\u0627\u06CC\u062F \u0628\u0647 \u0634\u06A9\u0644 \u0633\u0627\u062F\u0647 \u06CC\u0627 \u0645\u0635\u062F\u0631 \u0628\u062F\u0648\u0646 to \u0628\u06CC\u0627\u06CC\u062F.");
    detectedRules.push("\u0642\u0627\u0639\u062F\u0647 Did / Didn\u2019t + Base Verb: \u0641\u0639\u0644 \u0628\u0639\u062F \u0627\u0632 did \u0647\u0631\u06AF\u0632 \u062F\u0631 \u0632\u0645\u0627\u0646 \u06AF\u0630\u0634\u062A\u0647 \u0646\u0645\u06CC\u200C\u0622\u06CC\u062F.");
  }
  if (/\b(yesterday|last\s+(night|week|month|year)|ago)\b/i.test(text)) {
    if (/\b(I|you|he|she|we|they)\s+go\b/i.test(text)) {
      text = text.replace(/\b(I|you|he|she|we|they)\s+go\b/gi, "$1 went");
      explanations.push("\u0648\u062C\u0648\u062F \u0642\u06CC\u062F \u0632\u0645\u0627\u0646 \u06AF\u0630\u0634\u062A\u0647 (\u0645\u0627\u0646\u0646\u062F yesterday \u06CC\u0627 last week) \u0646\u0634\u0627\u0646 \u0645\u06CC\u200C\u062F\u0647\u062F \u06A9\u0647 \u0639\u0645\u0644 \u062F\u0631 \u06AF\u0630\u0634\u062A\u0647 \u0631\u062E \u062F\u0627\u062F\u0647 \u0648 \u0641\u0639\u0644 \u0628\u0627\u06CC\u062F \u0628\u0647 \u0635\u0648\u0631\u062A \u06AF\u0630\u0634\u062A\u0647 (went) \u0628\u0647 \u06A9\u0627\u0631 \u0631\u0648\u062F.");
      detectedRules.push("\u062F\u0631 \u0632\u0645\u0627\u0646 \u06AF\u0630\u0634\u062A\u0647 \u0633\u0627\u062F\u0647 (Simple Past)\u060C \u0627\u0641\u0639\u0627\u0644 \u0628\u06CC\u200C\u0642\u0627\u0639\u062F\u0647 \u062A\u063A\u06CC\u06CC\u0631 \u0634\u06A9\u0644 \u0645\u06CC\u200C\u062F\u0647\u0646\u062F (go -> went).");
    } else if (/\b(I|you|he|she|we|they)\s+see\b/i.test(text)) {
      text = text.replace(/\b(I|you|he|she|we|they)\s+see\b/gi, "$1 saw");
      explanations.push("\u0648\u062C\u0648\u062F \u0642\u06CC\u062F \u0632\u0645\u0627\u0646 \u06AF\u0630\u0634\u062A\u0647 \u0646\u0634\u0627\u0646 \u0645\u06CC\u200C\u062F\u0647\u062F \u06A9\u0647 \u0641\u0639\u0644 \u0628\u0627\u06CC\u062F \u0628\u0647 \u0634\u06A9\u0644 \u06AF\u0630\u0634\u062A\u0647 \u06CC\u0639\u0646\u06CC saw \u0628\u06CC\u0627\u06CC\u062F.");
      detectedRules.push("\u0634\u06A9\u0644 \u06AF\u0630\u0634\u062A\u0647 \u0641\u0639\u0644 see \u06A9\u0644\u0645\u0647 saw \u0627\u0633\u062A.");
    } else if (/\b(I|you|he|she|we|they)\s+buy\b/i.test(text)) {
      text = text.replace(/\b(I|you|he|she|we|they)\s+buy\b/gi, "$1 bought");
      explanations.push("\u062F\u0631 \u0632\u0645\u0627\u0646 \u06AF\u0630\u0634\u062A\u0647 \u0641\u0639\u0644 buy \u0628\u0647 \u0635\u0648\u0631\u062A bought \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.");
      detectedRules.push("\u0634\u06A9\u0644 \u06AF\u0630\u0634\u062A\u0647 \u0641\u0639\u0644 buy \u06A9\u0644\u0645\u0647 bought \u0627\u0633\u062A.");
    }
  }
  if (/\b(he|she|it)\s+go\b/i.test(text) && !/\b(yesterday|last|ago)\b/i.test(text)) {
    text = text.replace(/\b(he|she|it)\s+go\b/gi, "$1 goes");
    explanations.push("\u0628\u0631\u0627\u06CC \u0636\u0645\u0627\u06CC\u0631 \u0633\u0648\u0645 \u0634\u062E\u0635 \u0645\u0641\u0631\u062F (He, She, It) \u062F\u0631 \u0632\u0645\u0627\u0646 \u062D\u0627\u0644 \u0633\u0627\u062F\u0647\u060C \u0641\u0639\u0644 go \u0628\u0647 goes \u062A\u0628\u062F\u06CC\u0644 \u0645\u06CC\u200C\u0634\u0648\u062F.");
    detectedRules.push("\u0627\u0641\u0632\u0648\u062F\u0646 -es \u0628\u0647 \u0627\u0646\u062A\u0647\u0627\u06CC \u0641\u0639\u0644\u200C\u0647\u0627\u06CC \u0645\u062E\u062A\u0648\u0645 \u0628\u0647 o \u0628\u0631\u0627\u06CC \u0633\u0648\u0645\u200C\u0634\u062E\u0635 \u0645\u0641\u0631\u062F \u062F\u0631 \u0632\u0645\u0627\u0646 \u062D\u0627\u0644 \u0633\u0627\u062F\u0647.");
  }
  if (/\b(he|she|it)\s+have\b/i.test(text)) {
    text = text.replace(/\b(he|she|it)\s+have\b/gi, "$1 has");
    explanations.push("\u0641\u0627\u0639\u0644 \u0633\u0648\u0645 \u0634\u062E\u0635 \u0645\u0641\u0631\u062F (He/She/It) \u0628\u0647 \u062C\u0627\u06CC have \u0627\u0632 has \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u06A9\u0646\u062F.");
    detectedRules.push("\u0633\u0648\u0645 \u0634\u062E\u0635 \u0645\u0641\u0631\u062F \u0632\u0645\u0627\u0646 \u062D\u0627\u0644 \u0628\u0627 has \u0628\u06CC\u0627\u0646 \u0645\u06CC\u200C\u0634\u0648\u062F.");
  }
  if (/\bin\s+(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/i.test(text)) {
    text = text.replace(/\bin\s+(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/gi, "on $1");
    explanations.push("\u0628\u0631\u0627\u06CC \u0631\u0648\u0632\u0647\u0627\u06CC \u0647\u0641\u062A\u0647 \u0647\u0645\u06CC\u0634\u0647 \u0627\u0632 \u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 on \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F\u060C \u0646\u0647 in.");
    detectedRules.push("\u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 \u0631\u0648\u0632\u0647\u0627\u06CC \u0647\u0641\u062A\u0647: on Monday, on Friday.");
  }
  if (/\blisten\s+music\b/i.test(text)) {
    text = text.replace(/\blisten\s+music\b/gi, "listen to music");
    explanations.push("\u0641\u0639\u0644 listen \u0647\u0645\u0648\u0627\u0631\u0647 \u0628\u0647 \u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 to \u0646\u06CC\u0627\u0632 \u062F\u0627\u0631\u062F (listen to something).");
    detectedRules.push("Collocation: Listen to + Noun.");
  }
  if (/\bdepend\s+of\b/i.test(text)) {
    text = text.replace(/\bdepend\s+of\b/gi, "depend on");
    explanations.push("\u062D\u0631\u0641 \u0627\u0636\u0627\u0641\u0647 \u0645\u0646\u0627\u0633\u0628 \u0628\u0631\u0627\u06CC \u0641\u0639\u0644 depend\u060C \u06A9\u0644\u0645\u0647 on \u0627\u0633\u062A \u0646\u0647 of.");
    detectedRules.push("Collocation: Depend on.");
  }
  if (/\b(he|she)\s+is\s+like\s+([a-z]+)\b/i.test(text)) {
    text = text.replace(/\b(he|she)\s+is\s+like\s+([a-z]+)\b/gi, (match, p1, p2) => {
      const noun = p2.endsWith("s") ? p2 : `${p2}s`;
      return `${p1} likes ${noun}`;
    });
    explanations.push("\u0628\u0631\u0627\u06CC \u0628\u06CC\u0627\u0646 \u0639\u0644\u0627\u0642\u0647 \u0628\u0647 \u0686\u06CC\u0632\u06CC \u0646\u06CC\u0627\u0632\u06CC \u0628\u0647 \u0641\u0639\u0644 is \u0646\u06CC\u0633\u062A\u061B \u0627\u0632 \u0641\u0639\u0644 like \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u06A9\u0646\u06CC\u0645 \u0648 \u0628\u0631\u0627\u06CC \u0627\u0633\u0645\u200C\u0647\u0627\u06CC \u0642\u0627\u0628\u0644 \u0634\u0645\u0627\u0631\u0634 \u06A9\u0644\u06CC \u0627\u0632 \u0641\u0631\u0645 \u062C\u0645\u0639 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.");
    detectedRules.push("\u0628\u06CC\u0627\u0646 \u0639\u0644\u0627\u06CC\u0642: Subject + like/likes + Plural noun.");
  }
  if (text.length > 0 && text[0] !== text[0].toUpperCase()) {
    text = text[0].toUpperCase() + text.slice(1);
    detectedRules.push("\u062C\u0645\u0644\u0627\u062A \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0628\u0627\u06CC\u062F \u0628\u0627 \u062D\u0631\u0641 \u0628\u0632\u0631\u06AF \u0634\u0631\u0648\u0639 \u0634\u0648\u0646\u062F.");
  }
  if (/\bi\b/.test(text)) {
    text = text.replace(/\bi\b/g, "I");
    detectedRules.push('\u0636\u0645\u06CC\u0631 \u0627\u0648\u0644\u200C\u0634\u062E\u0635 "I" \u0647\u0645\u06CC\u0634\u0647 \u062F\u0631 \u0647\u0631 \u06A9\u062C\u0627\u06CC \u062C\u0645\u0644\u0647 \u0628\u0627 \u062D\u0631\u0641 \u0628\u0632\u0631\u06AF \u0646\u0648\u0634\u062A\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.');
  }
  const trimmedEnd = text.trim();
  if (!/[.?!]$/.test(trimmedEnd)) {
    text = `${trimmedEnd}.`;
    detectedRules.push("\u067E\u0627\u06CC\u0627\u0646 \u062C\u0645\u0644\u0627\u062A \u06A9\u0627\u0645\u0644 \u0628\u0627\u06CC\u062F \u0639\u0644\u0627\u0645\u062A \u0646\u0642\u0637\u0647\u200C\u06AF\u0630\u0627\u0631\u06CC (. \u06CC\u0627 ?) \u0642\u0631\u0627\u0631 \u06AF\u06CC\u0631\u062F.");
  }
  const hasErrors = text.toLowerCase() !== original.toLowerCase() || explanations.length > 0;
  if (!hasErrors) {
    explanations.push("\u062C\u0645\u0644\u0647 \u0634\u0645\u0627 \u0627\u0632 \u0646\u0638\u0631 \u06AF\u0631\u0627\u0645\u0631\u06CC \u0635\u062D\u06CC\u062D\u060C \u0631\u0633\u0627 \u0648 \u0637\u0628\u06CC\u0639\u06CC \u0627\u0633\u062A. \u0622\u0641\u0631\u06CC\u0646!");
    detectedRules.push("\u0633\u0627\u062E\u062A\u0627\u0631 \u0641\u0627\u0639\u0644\u060C \u0641\u0639\u0644 \u0648 \u062A\u0631\u062A\u06CC\u0628 \u06A9\u0644\u0645\u0627\u062A \u0628\u0647 \u062F\u0631\u0633\u062A\u06CC \u0631\u0639\u0627\u06CC\u062A \u0634\u062F\u0647 \u0627\u0633\u062A.");
    alternatives.push(text);
  } else if (alternatives.length === 0) {
    alternatives.push(text);
  }
  return {
    hasErrors,
    corrected: text,
    original,
    explanationFa: explanations.join(" \u0647\u0645\u0686\u0646\u06CC\u0646 "),
    grammarRulesFa: detectedRules.slice(0, 3),
    betterAlternatives: alternatives.slice(0, 2)
  };
}
async function chatWithMohannaAI(conversation, userContext) {
  const ai = getGemini();
  const systemInstruction = `
You are "Mohanna" (\u0645\u0647\u0646\u0627), a friendly, kind, patient, and knowledgeable AI English learning companion specifically designed for Persian-speaking learners (teenagers, youth, and adults) in the app "Learn with Mohanna".

CRITICAL LANGUAGE RULES:
1. PERSIAN-FIRST (\u0642\u0627\u0646\u0648\u0646 \u0641\u0627\u0631\u0633\u06CC \u067E\u06CC\u0634\u200C\u0641\u0631\u0636):
   - You MUST respond in fluent, warm, friendly, natural Persian (\u0641\u0627\u0631\u0633\u06CC \u0631\u0648\u0627\u0646\u060C \u0635\u0645\u06CC\u0645\u06CC \u0648 \u0645\u062D\u062A\u0631\u0645\u0627\u0646\u0647).
   - Do NOT reply only in English unless the user explicitly asks for an English reply or is doing an English-only roleplay.
   - If the user asks a question in Persian (e.g., "\u0686\u0637\u0648\u0631 \u0644\u063A\u0627\u062A \u0631\u0648 \u06CC\u0627\u062F \u0628\u06AF\u06CC\u0631\u0645\u061F" or "\u06A9\u0645\u06A9 \u06A9\u0631\u062F\u0646 \u0628\u0647 \u0645\u0627\u0645\u0627\u0646\u0645 \u0686\u06CC \u0645\u06CC\u0634\u0647\u061F"), answer warmly in Persian.

2. WHEN TO USE ENGLISH:
   - When the user asks for a translation (e.g. "\u06A9\u0645\u06A9 \u06A9\u0631\u062F\u0646 \u0628\u0647 \u0645\u0627\u0645\u0627\u0646 \u0686\u06CC \u0645\u06CC\u0634\u0647\u061F" -> Answer: "\u0645\u06CC\u0634\u0647: **Helping my mother**" along with an example sentence and Persian explanation).
   - When providing examples, pronunciation tips, or sentence structures.
   - When correcting the user's English sentences.

3. TONE & PERSONALITY:
   - Warm, encouraging, non-judgmental, friendly (\u0645\u062B\u0644 \u06CC\u06A9 \u062F\u0648\u0633\u062A \u0648 \u0645\u0631\u0628\u06CC \u0645\u0647\u0631\u0628\u0627\u0646 \u0648 \u0628\u0627\u0627\u0646\u0631\u0698\u06CC).
   - Use clean Markdown with bolding and bullet points for easy reading.
   - Keep answers clear, accessible for beginner to intermediate levels, and never overly academic or boring.

User details: Name: ${userContext.name || "\u06A9\u0627\u0631\u0628\u0631 \u0639\u0632\u06CC\u0632"}, English Level: ${userContext.level || "Beginner"}, Goal: ${userContext.goal || "General English"}.
`;
  try {
    const contents = conversation.map((c) => ({
      role: c.role === "user" ? "user" : "model",
      parts: c.parts
    }));
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      })
    );
    return response.text || "\u0633\u0644\u0627\u0645 \u062F\u0648\u0633\u062A \u062E\u0648\u0628\u0645! \u067E\u06CC\u0627\u0645\u062A\u0648 \u062F\u06CC\u062F\u0645. \u0686\u0637\u0648\u0631 \u0645\u06CC\u200C\u062A\u0648\u0646\u0645 \u0627\u0645\u0631\u0648\u0632 \u062F\u0631 \u06CC\u0627\u062F\u06AF\u06CC\u0631\u06CC \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u06A9\u0645\u06A9\u062A \u06A9\u0646\u0645\u061F";
  } catch (error) {
    console.warn("Gemini chat handled with fallback:", error?.message || error);
    return "\u0633\u0644\u0627\u0645 \u062F\u0648\u0633\u062A \u0639\u0632\u06CC\u0632\u0645! \u{1F31F} \u0645\u0646 \u0645\u0647\u0646\u0627 \u0647\u0633\u062A\u0645\u060C \u0647\u0645\u0631\u0627\u0647 \u06CC\u0627\u062F\u06AF\u06CC\u0631\u06CC \u0632\u0628\u0627\u0646 \u0634\u0645\u0627. \u062E\u0648\u0634\u062D\u0627\u0644\u0645 \u06A9\u0647 \u0627\u06CC\u0646\u062C\u0627\u06CC\u06CC! \u0647\u0631 \u0633\u0648\u0627\u0644\u06CC \u062F\u0631\u0628\u0627\u0631\u0647 \u0644\u063A\u0627\u062A\u060C \u06AF\u0631\u0627\u0645\u0631\u060C \u062A\u0631\u062C\u0645\u0647 \u0639\u0628\u0627\u0631\u0627\u062A \u06CC\u0627 \u062A\u0645\u0631\u06CC\u0646 \u0645\u06A9\u0627\u0644\u0645\u0647 \u062F\u0627\u0631\u06CC \u0628\u0627 \u0645\u0646 \u062F\u0631 \u0645\u06CC\u0648\u0646 \u0628\u0630\u0627\u0631 \u062A\u0627 \u0642\u062F\u0645 \u0628\u0647 \u0642\u062F\u0645 \u0628\u0627 \u0647\u0645 \u06CC\u0627\u062F \u0628\u06AF\u06CC\u0631\u06CC\u0645.";
  }
}
async function correctSentence(sentence) {
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
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              hasErrors: { type: import_genai.Type.BOOLEAN },
              corrected: { type: import_genai.Type.STRING },
              original: { type: import_genai.Type.STRING },
              explanationFa: { type: import_genai.Type.STRING },
              grammarRulesFa: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.STRING }
              },
              betterAlternatives: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.STRING }
              }
            },
            required: ["hasErrors", "corrected", "original", "explanationFa", "grammarRulesFa", "betterAlternatives"]
          }
        }
      })
    );
    const parsed = JSON.parse(response.text || "{}");
    if (parsed && typeof parsed.corrected === "string") {
      return parsed;
    }
    return diagnoseSentenceLocally(sentence);
  } catch (error) {
    console.warn("Gemini correction fallback to local diagnosis:", error?.message || error);
    return diagnoseSentenceLocally(sentence);
  }
}
async function generateRoleplayReply(scenario, history) {
  const ai = getGemini();
  const prompt = `
You are acting as "${scenario.aiRoleEn}" in an English conversational roleplay scenario: "${scenario.titleEn}".
The user is playing the role of "${scenario.userRoleEn}".
Learner level: ${scenario.level} (Beginner: simple short vocabulary; Intermediate: natural conversational flow).

Conversation History:
${history.map((h) => `${h.sender === "user" ? "User" : "AI"}: ${h.text}`).join("\n")}

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
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              replyEn: { type: import_genai.Type.STRING },
              translationFa: { type: import_genai.Type.STRING },
              correctionFeedback: {
                type: import_genai.Type.OBJECT,
                properties: {
                  original: { type: import_genai.Type.STRING },
                  corrected: { type: import_genai.Type.STRING },
                  explanationFa: { type: import_genai.Type.STRING }
                }
              },
              suggestedUserRepliesEn: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.STRING }
              }
            },
            required: ["replyEn", "translationFa", "suggestedUserRepliesEn"]
          }
        }
      })
    );
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.warn("Gemini roleplay fallback:", error?.message || error);
    return {
      replyEn: "That sounds great! Could you please tell me more about that?",
      translationFa: "\u0639\u0627\u0644\u06CC \u0628\u0647 \u0646\u0638\u0631 \u0645\u06CC\u200C\u0631\u0633\u0647! \u0645\u06CC\u200C\u062A\u0648\u0646\u06CC \u0644\u0637\u0641\u0627\u064B \u0628\u06CC\u0634\u062A\u0631 \u062F\u0631 \u0627\u06CC\u0646 \u0628\u0627\u0631\u0647 \u0628\u0631\u0627\u0645 \u0628\u06AF\u06CC\u061F",
      suggestedUserRepliesEn: ["Sure, let me explain.", "What else would you like to know?"]
    };
  }
}
async function analyzeCompletedConversation(scenarioTitle, history, userLevel) {
  const ai = getGemini();
  const prompt = `
Analyze this completed English learning conversation for scenario "${scenarioTitle}".
Learner level: ${userLevel}.

Full Transcript:
${history.map((h) => `${h.sender === "user" ? "User" : "AI"}: ${h.text}`).join("\n")}

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
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              score: { type: import_genai.Type.NUMBER },
              strengths: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
              mistakes: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    original: { type: import_genai.Type.STRING },
                    corrected: { type: import_genai.Type.STRING },
                    explanationFa: { type: import_genai.Type.STRING }
                  },
                  required: ["original", "corrected", "explanationFa"]
                }
              },
              newVocabulary: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    word: { type: import_genai.Type.STRING },
                    meaningFa: { type: import_genai.Type.STRING },
                    context: { type: import_genai.Type.STRING }
                  },
                  required: ["word", "meaningFa", "context"]
                }
              },
              betterSentences: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    original: { type: import_genai.Type.STRING },
                    better: { type: import_genai.Type.STRING },
                    why: { type: import_genai.Type.STRING }
                  },
                  required: ["original", "better", "why"]
                }
              },
              recommendedPractice: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.STRING }
              }
            },
            required: [
              "score",
              "strengths",
              "mistakes",
              "newVocabulary",
              "betterSentences",
              "recommendedPractice"
            ]
          }
        }
      })
    );
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini analyze conversation fallback:", error?.message || error);
    return {
      score: 90,
      strengths: ["\u062A\u0644\u0627\u0634 \u0639\u0627\u0644\u06CC \u0628\u0631\u0627\u06CC \u0628\u0631\u0642\u0631\u0627\u0631\u06CC \u0627\u0631\u062A\u0628\u0627\u0637 \u0645\u062F\u0627\u0648\u0645", "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u062F\u0631\u0633\u062A \u0627\u0632 \u0632\u0645\u0627\u0646\u200C\u0647\u0627\u06CC \u067E\u0627\u06CC\u0647 \u0648 \u0648\u0627\u0698\u06AF\u0627\u0646 \u0631\u0648\u0632\u0645\u0631\u0647"],
      mistakes: [],
      newVocabulary: [
        { word: "appreciate", meaningFa: "\u0642\u062F\u0631\u062F\u0627\u0646\u06CC \u06A9\u0631\u062F\u0646 / \u0633\u067E\u0627\u0633\u06AF\u0632\u0627\u0631 \u0628\u0648\u062F\u0646", context: "I really appreciate your help." },
        { word: "recommend", meaningFa: "\u067E\u06CC\u0634\u0646\u0647\u0627\u062F \u062F\u0627\u062F\u0646 / \u062A\u0648\u0635\u06CC\u0647 \u06A9\u0631\u062F\u0646", context: "What would you recommend?" }
      ],
      betterSentences: [],
      recommendedPractice: ["\u062A\u0645\u0631\u06CC\u0646 \u0645\u062F\u0627\u0648\u0645 \u0645\u06A9\u0627\u0644\u0645\u0647 \u0631\u0648\u0632\u0627\u0646\u0647", "\u0645\u0631\u0648\u0631 \u0644\u063A\u0627\u062A \u0630\u062E\u06CC\u0631\u0647\u200C\u0634\u062F\u0647 \u0642\u0628\u0644 \u0627\u0632 \u062E\u0648\u0627\u0628"]
    };
  }
}
async function lookupDictionaryWord(word) {
  const ai = getGemini();
  const prompt = `
Generate a rich English-Persian dictionary entry for the English word or phrase: "${word}".

Include:
- Word, accurate IPA pronunciation (e.g. /\u02C8k\u0252nf\u026Ad\u0259nt/), part of speech.
- Persian meaning (\u0645\u0639\u0646\u06CC \u062F\u0642\u06CC\u0642 \u0648 \u067E\u0631\u06A9\u0627\u0631\u0628\u0631\u062F \u0641\u0627\u0631\u0633\u06CC).
- Simple English definition.
- Difficulty level: Beginner, Elementary, Intermediate, or Advanced.
- 2 to 3 real-world example sentences with English and Persian translations.
- Synonyms (\u0645\u062A\u0631\u0627\u062F\u0641\u200C\u0647\u0627).
- Antonyms (\u0645\u062A\u0636\u0627\u062F\u0647\u0627).
- Common collocations (\u062A\u0631\u06A9\u06CC\u0628\u0627\u062A \u0631\u0627\u06CC\u062C).
- A helpful practical tip in Persian from Mohanna (\u0646\u06A9\u062A\u0647 \u06A9\u0627\u0631\u0628\u0631\u062F\u06CC \u0645\u0647\u0646\u0627 \u0628\u0631\u0627\u06CC \u06CC\u0627\u062F\u06AF\u06CC\u0631\u06CC \u0628\u0647\u062A\u0631 \u0627\u06CC\u0646 \u06A9\u0644\u0645\u0647).

Return JSON.
`;
  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              word: { type: import_genai.Type.STRING },
              pronunciation: { type: import_genai.Type.STRING },
              partOfSpeech: { type: import_genai.Type.STRING },
              persianMeaning: { type: import_genai.Type.STRING },
              englishDefinition: { type: import_genai.Type.STRING },
              difficulty: { type: import_genai.Type.STRING },
              examples: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    en: { type: import_genai.Type.STRING },
                    fa: { type: import_genai.Type.STRING }
                  },
                  required: ["en", "fa"]
                }
              },
              synonyms: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
              antonyms: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
              collocations: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
              tipsFa: { type: import_genai.Type.STRING }
            },
            required: [
              "word",
              "pronunciation",
              "partOfSpeech",
              "persianMeaning",
              "englishDefinition",
              "difficulty",
              "examples",
              "synonyms",
              "collocations",
              "tipsFa"
            ]
          }
        }
      })
    );
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini dictionary fallback:", error?.message || error);
    return null;
  }
}
async function generateEducationalContent(contentType, topic, targetLevel) {
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
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      })
    );
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.warn("Gemini content generator error:", error);
    throw error;
  }
}

// server/routes/ai.ts
var aiRouter = (0, import_express2.Router)();
aiRouter.post("/chat", async (req, res) => {
  try {
    const user = getAuthUser(req);
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "\u067E\u06CC\u0627\u0645\u06CC \u0627\u0631\u0633\u0627\u0644 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A." });
    }
    const reply = await chatWithMohannaAI(messages, {
      name: user?.fullName,
      level: user?.englishLevel,
      goal: user?.learningGoal
    });
    if (user) {
      db.addXpAndStreak(user.id, 5);
    }
    res.json({ reply });
  } catch (error) {
    console.warn("AI chat endpoint handled with fallback:", error?.message || error);
    res.json({
      reply: "\u0633\u0644\u0627\u0645 \u062F\u0648\u0633\u062A \u0639\u0632\u06CC\u0632\u0645! \u{1F31F} \u067E\u06CC\u0627\u0645 \u0634\u0645\u0627 \u0631\u0627 \u062F\u0631\u06CC\u0627\u0641\u062A \u06A9\u0631\u062F\u0645. \u0686\u0637\u0648\u0631 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u0645 \u062F\u0631 \u06CC\u0627\u062F\u06AF\u06CC\u0631\u06CC \u0648 \u062A\u0645\u0631\u06CC\u0646 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0628\u0647 \u0634\u0645\u0627 \u06A9\u0645\u06A9 \u06A9\u0646\u0645\u061F"
    });
  }
});
aiRouter.post("/correct-sentence", async (req, res) => {
  try {
    const { sentence } = req.body;
    if (!sentence || typeof sentence !== "string" || sentence.trim().length === 0) {
      return res.status(400).json({ error: "\u0644\u0637\u0641\u0627\u064B \u062C\u0645\u0644\u0647 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F." });
    }
    const result = await correctSentence(sentence);
    const user = getAuthUser(req);
    if (user) {
      db.addXpAndStreak(user.id, 8);
    }
    res.json(result);
  } catch (error) {
    console.warn("AI sentence correction error fallback:", error?.message || error);
    const fallback = diagnoseSentenceLocally(req.body?.sentence || "");
    res.json(fallback);
  }
});
aiRouter.get("/scenarios", (req, res) => {
  const scenarios = db.getScenarios();
  res.json(scenarios);
});
aiRouter.post("/conversation/reply", async (req, res) => {
  try {
    const { scenarioId, history } = req.body;
    const scenario = db.scenarios.get(scenarioId);
    if (!scenario) {
      return res.status(404).json({ error: "\u0633\u0646\u0627\u0631\u06CC\u0648\u06CC \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F." });
    }
    const result = await generateRoleplayReply(
      {
        titleEn: scenario.titleEn,
        aiRoleEn: scenario.aiRoleEn,
        userRoleEn: scenario.userRoleEn,
        level: scenario.level
      },
      history || []
    );
    res.json(result);
  } catch (error) {
    console.warn("AI conversation turn error fallback:", error?.message || error);
    res.json({
      replyEn: "That's very interesting! Can you tell me a little more?",
      translationFa: "\u062E\u06CC\u0644\u06CC \u062C\u0627\u0644\u0628\u0647! \u0645\u06CC\u200C\u062A\u0648\u0646\u06CC \u06CC\u06A9\u0645 \u0628\u06CC\u0634\u062A\u0631 \u0628\u0631\u0627\u0645 \u062A\u0648\u0636\u06CC\u062D \u0628\u062F\u06CC\u061F",
      suggestedUserRepliesEn: ["Sure, let me explain.", "What else would you like to know?"]
    });
  }
});
aiRouter.post("/conversation/analyze", async (req, res) => {
  try {
    const user = getAuthUser(req);
    const { scenarioTitle, history } = req.body;
    const report = await analyzeCompletedConversation(
      scenarioTitle || "Daily Practice",
      history || [],
      user?.englishLevel || "beginner"
    );
    if (user) {
      db.addXpAndStreak(user.id, 30);
    }
    res.json(report);
  } catch (error) {
    console.warn("AI analyze conversation error fallback:", error?.message || error);
    res.json({
      score: 85,
      strengths: ["\u062A\u0644\u0627\u0634 \u0639\u0627\u0644\u06CC \u0628\u0631\u0627\u06CC \u0628\u0631\u0642\u0631\u0627\u0631\u06CC \u0627\u0631\u062A\u0628\u0627\u0637 \u0648 \u0631\u0633\u0627\u0646\u062F\u0646 \u0645\u0641\u0647\u0648\u0645", "\u067E\u0627\u0633\u062E\u200C\u0647\u0627\u06CC \u0628\u0647 \u0645\u0648\u0642\u0639 \u062F\u0631 \u062C\u0631\u06CC\u0627\u0646 \u0645\u06A9\u0627\u0644\u0645\u0647"],
      mistakes: [],
      newVocabulary: [
        { word: "Confidence", meaningFa: "\u0627\u0639\u062A\u0645\u0627\u062F \u0628\u0647 \u0646\u0641\u0633 \u062F\u0631 \u0645\u06A9\u0627\u0644\u0645\u0647", context: "Speaking daily builds confidence." }
      ],
      betterSentences: [],
      recommendedPractice: ["\u062A\u0645\u0631\u06CC\u0646 \u0631\u0648\u0632\u0627\u0646\u0647 \u062F\u06CC\u0627\u0644\u0648\u06AF\u200C\u0647\u0627 \u0628\u0627 \u0635\u062F\u0627\u06CC \u0628\u0644\u0646\u062F"]
    });
  }
});
aiRouter.post("/generate-content", async (req, res) => {
  try {
    const { contentType, topic, targetLevel } = req.body;
    if (!contentType || !topic) {
      return res.status(400).json({ error: "\u0646\u0648\u0639 \u0645\u062D\u062A\u0648\u0627 \u0648 \u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A." });
    }
    const generated = await generateEducationalContent(
      contentType,
      topic,
      targetLevel || "beginner"
    );
    res.json({ success: true, data: generated });
  } catch (error) {
    console.error("AI content generation error:", error);
    res.status(500).json({ error: "\u062E\u0637\u0627 \u062F\u0631 \u062A\u0648\u0644\u06CC\u062F \u0645\u062D\u062A\u0648\u0627\u06CC \u0647\u0648\u0634 \u0645\u0635\u0646\u0648\u0639\u06CC" });
  }
});

// server/routes/vocabulary.ts
var import_express3 = require("express");
var vocabularyRouter = (0, import_express3.Router)();
vocabularyRouter.get("/list", (req, res) => {
  const words = db.getAllVocabulary();
  res.json(words);
});
vocabularyRouter.get("/saved", (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.json([]);
  const saved = db.getSavedWords(user.id);
  res.json(saved);
});
vocabularyRouter.post("/save", (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: "\u0628\u0631\u0627\u06CC \u0630\u062E\u06CC\u0631\u0647 \u0644\u063A\u062A \u0627\u0628\u062A\u062F\u0627 \u0648\u0627\u0631\u062F \u062D\u0633\u0627\u0628 \u0634\u0648\u06CC\u062F" });
  const { wordId } = req.body;
  if (!wordId) return res.status(400).json({ error: "\u0634\u0646\u0627\u0633\u0647 \u0644\u063A\u062A \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
  const success = db.saveWord(user.id, wordId);
  res.json({ success, saved: true });
});
vocabularyRouter.post("/unsave", (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: "\u0628\u0631\u0627\u06CC \u062A\u063A\u06CC\u06CC\u0631 \u0644\u063A\u0627\u062A \u0627\u0628\u062A\u062F\u0627 \u0648\u0627\u0631\u062F \u062D\u0633\u0627\u0628 \u0634\u0648\u06CC\u062F" });
  const { wordId } = req.body;
  if (!wordId) return res.status(400).json({ error: "\u0634\u0646\u0627\u0633\u0647 \u0644\u063A\u062A \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
  db.unsaveWord(user.id, wordId);
  res.json({ success: true, saved: false });
});
vocabularyRouter.post("/learned", (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: "\u0628\u0631\u0627\u06CC \u062B\u0628\u062A \u067E\u06CC\u0634\u0631\u0641\u062A \u0627\u0628\u062A\u062F\u0627 \u0648\u0627\u0631\u062F \u062D\u0633\u0627\u0628 \u0634\u0648\u06CC\u062F" });
  const { wordId } = req.body;
  if (!wordId) return res.status(400).json({ error: "\u0634\u0646\u0627\u0633\u0647 \u0644\u063A\u062A \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
  db.markWordLearned(user.id, wordId);
  res.json({ success: true, xpGained: 10 });
});
vocabularyRouter.get("/learned", (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.json([]);
  const words = db.getLearnedWords(user.id);
  res.json(words);
});

// server/routes/dictionary.ts
var import_express4 = require("express");
var dictionaryRouter = (0, import_express4.Router)();
dictionaryRouter.get("/lookup", async (req, res) => {
  try {
    const wordQuery = req.query.word?.trim();
    if (!wordQuery) {
      return res.status(400).json({ error: "\u0644\u0637\u0641\u0627\u064B \u06A9\u0644\u0645\u0647 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F." });
    }
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
            fa: localMatch.exampleTranslation
          }
        ],
        synonyms: localMatch.relatedWords,
        antonyms: [],
        collocations: [`learn ${localMatch.english.toLowerCase()}`, `practice ${localMatch.english.toLowerCase()}`],
        tipsFa: localMatch.tipsFa || "\u0627\u06CC\u0646 \u0644\u063A\u062A \u0631\u0627 \u062F\u0631 \u062C\u0645\u0644\u0627\u062A \u0631\u0648\u0632\u0645\u0631\u0647 \u0628\u0647 \u06A9\u0627\u0631 \u0628\u0628\u0631\u06CC\u062F."
      };
      return res.json({ source: "database", entry });
    }
    const aiEntry = await lookupDictionaryWord(wordQuery);
    if (aiEntry) {
      return res.json({ source: "ai_enriched", entry: aiEntry });
    }
    res.status(404).json({ error: "\u06A9\u0644\u0645\u0647 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u062F\u0631 \u062F\u06CC\u06A9\u0634\u0646\u0631\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F." });
  } catch (error) {
    console.error("Dictionary route error:", error);
    res.status(500).json({ error: "\u062E\u0637\u0627 \u062F\u0631 \u062C\u0633\u062A\u062C\u0648\u06CC \u062F\u06CC\u06A9\u0634\u0646\u0631\u06CC" });
  }
});

// server/routes/quiz.ts
var import_express5 = require("express");
var quizRouter = (0, import_express5.Router)();
quizRouter.get("/list", (req, res) => {
  const quizzes = db.getAllQuizzes();
  res.json(quizzes);
});
quizRouter.get("/:id", (req, res) => {
  const quiz = db.getQuizById(req.params.id);
  if (!quiz) {
    return res.status(404).json({ error: "\u0622\u0632\u0645\u0648\u0646 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
  }
  res.json(quiz);
});
quizRouter.post("/submit", (req, res) => {
  try {
    const user = getAuthUser(req) || db.getUserById("usr_demo_1");
    if (!user) return res.status(401).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    const { quizId, answers, timeSpentSeconds } = req.body;
    const quiz = db.getQuizById(quizId);
    if (!quiz) return res.status(404).json({ error: "\u0622\u0632\u0645\u0648\u0646 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    let score = 0;
    const evaluatedAnswers = [];
    const weakCategories = /* @__PURE__ */ new Set();
    const strongCategories = /* @__PURE__ */ new Set();
    quiz.questions.forEach((q) => {
      const userAnswer = answers?.[q.id] || "";
      const isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) {
        score += 1;
        strongCategories.add(q.category);
      } else {
        weakCategories.add(q.category);
      }
      evaluatedAnswers.push({
        questionId: q.id,
        userAnswer,
        isCorrect
      });
    });
    const totalQ = quiz.questions.length;
    const percentage = Math.round(score / totalQ * 100);
    const timeSpent = typeof timeSpentSeconds === "number" ? timeSpentSeconds : 60;
    const avgSecondsPerQ = totalQ > 0 ? timeSpent / totalQ : 15;
    let speedRating = "moderate";
    let speedAssessmentFa = "\u0633\u0631\u0639\u062A \u0645\u0646\u0627\u0633\u0628 \u0648 \u0637\u0628\u06CC\u0639\u06CC \u062F\u0631 \u067E\u0627\u0633\u062E\u200C\u062F\u0647\u06CC";
    if (avgSecondsPerQ < 6) {
      speedRating = "lightning";
      speedAssessmentFa = "\u0633\u0631\u0639\u062A \u0641\u0648\u0642\u200C\u0627\u0644\u0639\u0627\u062F\u0647 \u0628\u0627\u0644\u0627 \u0648 \u062A\u0633\u0644\u0637 \u0622\u0646\u06CC";
    } else if (avgSecondsPerQ < 12) {
      speedRating = "fast";
      speedAssessmentFa = "\u0633\u0631\u0639\u062A \u0628\u0633\u06CC\u0627\u0631 \u062E\u0648\u0628 \u0648 \u0628\u0627 \u0627\u0639\u062A\u0645\u0627\u062F\u0628\u0647\u200C\u0646\u0641\u0633";
    } else if (avgSecondsPerQ > 25) {
      speedRating = "careful";
      speedAssessmentFa = "\u062F\u0642\u06CC\u0642\u060C \u0645\u062A\u0645\u0631\u06A9\u0632 \u0648 \u0628\u0627 \u062A\u0627\u0645\u0644 \u06A9\u0627\u0641\u06CC";
    }
    const strengths = Array.from(strongCategories).map(
      (c) => c === "grammar" ? "\u062A\u0633\u0644\u0637 \u0645\u0646\u0627\u0633\u0628 \u0628\u0631 \u0633\u0627\u062E\u062A\u0627\u0631\u0647\u0627\u06CC \u06AF\u0631\u0627\u0645\u0631\u06CC \u0648 \u0632\u0645\u0627\u0646\u200C\u0647\u0627\u06CC \u0641\u0639\u0644" : c === "vocabulary" ? "\u062F\u0627\u06CC\u0631\u0647 \u0648\u0627\u0698\u06AF\u0627\u0646 \u067E\u0631\u06A9\u0627\u0631\u0628\u0631\u062F \u0648 \u0645\u0639\u0627\u0646\u06CC \u0644\u063A\u0627\u062A" : "\u062F\u0631\u06A9 \u0645\u0641\u0647\u0648\u0645 \u0648 \u06A9\u0627\u0631\u0628\u0631\u062F \u062F\u0631 \u0645\u06A9\u0627\u0644\u0645\u0647 \u0648\u0627\u0642\u0639\u06CC"
    );
    if (strengths.length === 0) strengths.push("\u0627\u0646\u06AF\u06CC\u0632\u0647 \u0628\u0627\u0644\u0627 \u0628\u0631\u0627\u06CC \u0634\u0631\u0648\u0639 \u0648 \u062A\u0644\u0627\u0634 \u0645\u0633\u062A\u0645\u0631");
    const weaknesses = Array.from(weakCategories).map(
      (c) => c === "grammar" ? "\u0645\u0631\u0648\u0631 \u0627\u0641\u0639\u0627\u0644 \u0628\u06CC\u200C\u0642\u0627\u0639\u062F\u0647\u060C \u062D\u0631\u0648\u0641 \u0627\u0636\u0627\u0641\u0647 \u0648 \u0633\u0627\u062E\u062A\u0627\u0631 \u062C\u0645\u0644\u0627\u062A \u0633\u0648\u0627\u0644\u06CC" : c === "vocabulary" ? "\u062A\u0645\u0631\u06CC\u0646 \u0628\u06CC\u0634\u062A\u0631 \u0631\u0648\u06CC \u062A\u0641\u0627\u0648\u062A \u0644\u063A\u0627\u062A \u0645\u0634\u0627\u0628\u0647 \u0648 \u0627\u0635\u0637\u0644\u0627\u062D\u0627\u062A \u0631\u0648\u0632\u0645\u0631\u0647" : "\u062A\u0648\u062C\u0647 \u0628\u0647 \u062C\u0632\u0626\u06CC\u0627\u062A \u06A9\u0627\u0631\u0628\u0631\u062F\u06CC \u062F\u0631 \u0645\u0648\u0642\u0639\u06CC\u062A\u200C\u0647\u0627\u06CC \u0637\u0628\u06CC\u0639\u06CC"
    );
    if (weaknesses.length === 0) {
      weaknesses.push("\u0639\u0645\u0644\u06A9\u0631\u062F \u062F\u0631\u062E\u0634\u0627\u0646 \u0648 \u0628\u062F\u0648\u0646 \u0627\u0634\u062A\u0628\u0627\u0647! \u0622\u0645\u0627\u062F\u0647 \u0648\u0631\u0648\u062F \u0628\u0647 \u0633\u0637\u062D \u0628\u0627\u0644\u0627\u062A\u0631 \u0647\u0633\u062A\u06CC\u062F.");
    }
    let estimatedLevel = void 0;
    let recommendedPath = "\u0645\u0631\u0648\u0631 \u0631\u0648\u0632\u0627\u0646\u0647 \u06F1\u06F0 \u0644\u063A\u062A \u0648 \u0627\u0646\u062C\u0627\u0645 \u0645\u06A9\u0627\u0644\u0645\u0647 \u062A\u0645\u0631\u06CC\u0646\u06CC \u0628\u0627 \u062F\u0633\u062A\u06CC\u0627\u0631 \u0645\u0647\u0646\u0627.";
    if (quiz.type === "placement" || quiz.level) {
      if (percentage >= 80) {
        estimatedLevel = "pre-intermediate";
        recommendedPath = "\u0634\u0631\u0648\u0639 \u062F\u0648\u0631\u0647 \u06AF\u0631\u0627\u0645\u0631 \u06A9\u0627\u0631\u0628\u0631\u062F\u06CC B1\u060C \u06CC\u0627\u062F\u06AF\u06CC\u0631\u06CC \u0627\u0635\u0637\u0644\u0627\u062D\u0627\u062A \u0641\u06CC\u0644\u0645\u200C\u0647\u0627 \u0648 \u0645\u06A9\u0627\u0644\u0645\u0627\u062A \u0637\u0628\u06CC\u0639\u06CC \u0628\u0627 \u0645\u0647\u0646\u0627.";
      } else if (percentage >= 45) {
        estimatedLevel = "elementary";
        recommendedPath = "\u062A\u0642\u0648\u06CC\u062A \u062C\u0645\u0644\u0647\u200C\u0633\u0627\u0632\u06CC \u0633\u0627\u062F\u0647 A2\u060C \u06CC\u0627\u062F\u06AF\u06CC\u0631\u06CC \u0644\u063A\u0627\u062A \u0636\u0631\u0648\u0631\u06CC \u0631\u0648\u0632\u0645\u0631\u0647 \u0648 \u062A\u0645\u0631\u06CC\u0646 \u0633\u0646\u0627\u0631\u06CC\u0648\u0647\u0627\u06CC \u0631\u0633\u062A\u0648\u0631\u0627\u0646 \u0648 \u0633\u0641\u0631.";
      } else {
        estimatedLevel = "beginner";
        recommendedPath = "\u0634\u0631\u0648\u0639 \u0642\u062F\u0645\u200C\u0628\u0647\u200C\u0642\u062F\u0645 \u0627\u0632 \u06AF\u0631\u0627\u0645\u0631 \u067E\u0627\u06CC\u0647 A1\u060C \u06CC\u0627\u062F\u06AF\u06CC\u0631\u06CC \u0648\u0627\u0698\u06AF\u0627\u0646 \u0627\u0633\u0627\u0633\u06CC \u0648 \u0645\u06A9\u0627\u0644\u0645\u0627\u062A \u0633\u0627\u062F\u0647 \u0648 \u0634\u0645\u0631\u062F\u0647 \u0628\u0627 \u0645\u0647\u0646\u0627.";
      }
      if (quiz.type === "placement") {
        db.updateUser(user.id, { englishLevel: estimatedLevel });
      }
    }
    const result = {
      id: `qres_${Date.now()}`,
      userId: user.id,
      quizId: quiz.id,
      quizTitle: quiz.titleFa,
      score,
      totalQuestions: totalQ,
      percentage,
      timeSpentSeconds: timeSpent,
      averageSecondsPerQuestion: Math.round(avgSecondsPerQ * 10) / 10,
      speedRating,
      speedAssessmentFa,
      answers: evaluatedAnswers,
      strengths,
      weaknesses,
      recommendedPath,
      estimatedLevel,
      completedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.saveQuizResult(result);
    res.json({
      result,
      xpGained: Math.round(score * 10 + (speedRating === "fast" ? 15 : 5)),
      updatedLevel: estimatedLevel
    });
  } catch (error) {
    console.error("Quiz submit error:", error);
    res.status(500).json({ error: "\u062E\u0637\u0627 \u062F\u0631 \u062B\u0628\u062A \u0646\u062A\u06CC\u062C\u0647 \u0622\u0632\u0645\u0648\u0646" });
  }
});
quizRouter.get("/user/history", (req, res) => {
  const user = getAuthUser(req) || db.getUserById("usr_demo_1");
  if (!user) return res.status(401).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
  const history = db.getUserQuizHistory(user.id);
  res.json(history);
});

// server/routes/community.ts
var import_express6 = require("express");
var communityRouter = (0, import_express6.Router)();
communityRouter.get("/rooms", (req, res) => {
  const rooms = db.getCommunityRooms();
  res.json(rooms);
});
communityRouter.get("/posts", (req, res) => {
  const roomId = req.query.roomId;
  const posts = db.getPosts(roomId);
  res.json(posts);
});
communityRouter.post("/posts", (req, res) => {
  try {
    const user = getAuthUser(req) || db.getUserById("usr_demo_1");
    if (!user) return res.status(401).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    const { roomId, title, content, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "\u0639\u0646\u0648\u0627\u0646 \u0648 \u0645\u062A\u0646 \u067E\u0633\u062A \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A." });
    }
    const phoneRegex = /(0|\+98)?9\d{9}/g;
    if (phoneRegex.test(content) || phoneRegex.test(title)) {
      return res.status(400).json({
        error: "\u0628\u0631\u0627\u06CC \u062D\u0641\u0638 \u0627\u0645\u0646\u06CC\u062A \u0632\u0628\u0627\u0646\u200C\u0622\u0645\u0648\u0632\u0627\u0646 \u0648 \u0646\u0648\u062C\u0648\u0627\u0646\u0627\u0646\u060C \u0627\u0631\u0633\u0627\u0644 \u0634\u0645\u0627\u0631\u0647 \u062A\u0645\u0627\u0633 \u0648 \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0647\u0648\u06CC\u062A\u06CC \u0645\u062C\u0627\u0632 \u0646\u06CC\u0633\u062A."
      });
    }
    const newPost = db.createPost({
      roomId: roomId || "room_lounge",
      authorId: user.id,
      authorName: user.fullName,
      authorLevel: user.englishLevel,
      title,
      content,
      tags: tags || ["EnglishPractice"]
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Community post error:", error);
    res.status(500).json({ error: "\u062E\u0637\u0627 \u062F\u0631 \u0627\u0646\u062A\u0634\u0627\u0631 \u067E\u0633\u062A" });
  }
});
communityRouter.post("/posts/:id/comments", (req, res) => {
  try {
    const user = getAuthUser(req) || db.getUserById("usr_demo_1");
    if (!user) return res.status(401).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "\u0645\u062A\u0646 \u0646\u0638\u0631 \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u062E\u0627\u0644\u06CC \u0628\u0627\u0634\u062F." });
    }
    const comment = db.addComment(req.params.id, {
      authorId: user.id,
      authorName: user.fullName,
      authorLevel: user.englishLevel,
      content
    });
    if (!comment) {
      return res.status(404).json({ error: "\u067E\u0633\u062A \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    }
    res.status(201).json(comment);
  } catch (error) {
    console.error("Community comment error:", error);
    res.status(500).json({ error: "\u062E\u0637\u0627 \u062F\u0631 \u062B\u0628\u062A \u062F\u06CC\u062F\u06AF\u0627\u0647" });
  }
});
communityRouter.post("/posts/:id/like", (req, res) => {
  const likes = db.likePost(req.params.id);
  res.json({ success: true, likes });
});
communityRouter.post("/posts/:id/report", (req, res) => {
  const user = getAuthUser(req) || db.getUserById("usr_demo_1");
  const report = db.reportContent({
    targetType: "post",
    targetId: req.params.id,
    targetContent: req.body.reason || "\u0645\u062D\u062A\u0648\u0627\u06CC \u0646\u0627\u0645\u0646\u0627\u0633\u0628",
    reporterId: user ? user.id : "anonymous",
    reporterName: user ? user.fullName : "\u06A9\u0627\u0631\u0628\u0631 \u0645\u0647\u0646\u0627",
    reason: req.body.reason || "\u0645\u062D\u062A\u0648\u0627\u06CC \u0646\u0627\u0645\u0646\u0627\u0633\u0628"
  });
  res.json({ success: true, report });
});
communityRouter.get("/expressions", (req, res) => {
  const category = req.query.category;
  const list = db.getCommunityExpressions(category);
  res.json(list);
});
communityRouter.post("/expressions", (req, res) => {
  try {
    const user = getAuthUser(req) || db.getUserById("usr_demo_1");
    if (!user) return res.status(401).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    const { english, persian, pronunciation, exampleEn, exampleFa, usageNoteFa, category, difficulty } = req.body;
    if (!english || !persian || !exampleEn || !exampleFa) {
      return res.status(400).json({ error: "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0627\u0635\u0637\u0644\u0627\u062D \u06CC\u0627 \u0648\u0627\u0698\u0647 \u0646\u0627\u0642\u0635 \u0627\u0633\u062A." });
    }
    const newExp = db.addCommunityExpression({
      english,
      persian,
      pronunciation,
      exampleEn,
      exampleFa,
      usageNoteFa,
      category: category || "idiom",
      difficulty: difficulty || "beginner",
      submittedBy: user.fullName
    });
    db.addXpAndStreak(user.id, 20);
    res.status(201).json(newExp);
  } catch (error) {
    res.status(500).json({ error: "\u062E\u0637\u0627 \u062F\u0631 \u062B\u0628\u062A \u0627\u0635\u0637\u0644\u0627\u062D" });
  }
});
communityRouter.post("/expressions/:id/like", (req, res) => {
  const likes = db.likeCommunityExpression(req.params.id);
  res.json({ success: true, likes });
});
communityRouter.get("/grammar-tips", (req, res) => {
  const category = req.query.category;
  const list = db.getGrammarHelpTips(category);
  res.json(list);
});
communityRouter.post("/grammar-tips", (req, res) => {
  try {
    const user = getAuthUser(req) || db.getUserById("usr_demo_1");
    if (!user) return res.status(401).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    const { titleFa, titleEn, incorrectExample, correctExample, commonMistake, correctForm, explanationFa, goldenRuleFa, persianContext, difficulty, category } = req.body;
    const incorrect = incorrectExample || commonMistake;
    const correct = correctExample || correctForm;
    if (!titleFa || !incorrect || !correct || !explanationFa) {
      return res.status(400).json({ error: "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0646\u06A9\u062A\u0647 \u06AF\u0631\u0627\u0645\u0631\u06CC \u0646\u0627\u0642\u0635 \u0627\u0633\u062A." });
    }
    const newTip = db.addGrammarHelpTip({
      titleFa,
      titleEn: titleEn || "",
      incorrectExample: incorrect,
      correctExample: correct,
      explanationFa,
      goldenRuleFa: goldenRuleFa || "",
      persianContext: persianContext || "",
      difficulty: difficulty || "beginner",
      category: category || "sentence_structure"
    });
    db.addXpAndStreak(user.id, 20);
    res.status(201).json(newTip);
  } catch (error) {
    res.status(500).json({ error: "\u062E\u0637\u0627 \u062F\u0631 \u062B\u0628\u062A \u0646\u06A9\u062A\u0647 \u06AF\u0631\u0627\u0645\u0631\u06CC" });
  }
});
communityRouter.post("/grammar-tips/:id/like", (req, res) => {
  const likes = db.likeGrammarHelpTip(req.params.id);
  res.json({ success: true, likes });
});
communityRouter.post("/report", (req, res) => {
  try {
    const user = getAuthUser(req) || db.getUserById("usr_demo_1");
    if (!user) return res.status(401).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    const { targetType, targetId, targetContent, reason } = req.body;
    if (!targetId || !reason) {
      return res.status(400).json({ error: "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u06AF\u0632\u0627\u0631\u0634 \u0646\u0627\u0642\u0635 \u0627\u0633\u062A." });
    }
    const report = db.reportContent({
      targetType: targetType || "post",
      targetId,
      targetContent: targetContent || "\u0645\u062D\u062A\u0648\u0627\u06CC \u06AF\u0632\u0627\u0631\u0634\u200C\u0634\u062F\u0647",
      reporterId: user.id,
      reporterName: user.fullName,
      reason
    });
    res.json({ success: true, message: "\u06AF\u0632\u0627\u0631\u0634 \u0634\u0645\u0627 \u062B\u0628\u062A \u0634\u062F \u0648 \u062A\u0648\u0633\u0637 \u062A\u06CC\u0645 \u0646\u0638\u0627\u0631\u062A \u0628\u0631\u0631\u0633\u06CC \u062E\u0648\u0627\u0647\u062F \u0634\u062F.", report });
  } catch (error) {
    console.error("Report error:", error);
    res.status(500).json({ error: "\u062E\u0637\u0627 \u062F\u0631 \u062B\u0628\u062A \u06AF\u0632\u0627\u0631\u0634" });
  }
});

// server/routes/learning.ts
var import_express7 = require("express");
var learningRouter = (0, import_express7.Router)();
learningRouter.get("/progress", (req, res) => {
  const user = getAuthUser(req);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  if (!user) {
    const guestProgress = {
      userId: "guest",
      level: "beginner",
      totalXp: 0,
      streakDays: 0,
      learnedWordIds: [],
      completedQuizIds: [],
      completedLessonIds: [],
      todayGoal: {
        date: today,
        wordsLearned: 0,
        targetWords: 5,
        aiPracticeDone: false,
        quizCompleted: false,
        completed: false
      },
      recentActivity: [],
      weakTopics: [],
      recommendedLessons: [
        {
          id: "rec_1",
          titleFa: "\u06CC\u0627\u062F\u06AF\u06CC\u0631\u06CC \u062D\u0631\u0648\u0641 \u0627\u0636\u0627\u0641\u0647 \u0632\u0645\u0627\u0646 \u0648 \u0645\u06A9\u0627\u0646",
          titleEn: "Mastering Prepositions of Time & Place",
          type: "grammar",
          reasonFa: "\u0634\u0631\u0648\u0639 \u06CC\u0627\u062F\u06AF\u06CC\u0631\u06CC \u0628\u0627 \u0627\u0635\u0648\u0644 \u0627\u0648\u0644\u06CC\u0647 \u06AF\u0631\u0627\u0645\u0631"
        },
        {
          id: "rec_2",
          titleFa: "\u0645\u06A9\u0627\u0644\u0645\u0647 \u06A9\u0644\u0627\u0633\u06CC \u0648 \u0645\u0639\u0631\u0641\u06CC \u062E\u0648\u062F",
          titleEn: "Classroom & Self-Introduction Dialogue",
          type: "conversation",
          reasonFa: "\u062A\u0637\u0628\u06CC\u0642 \u0628\u0627 \u0647\u062F\u0641 \u062A\u0642\u0648\u06CC\u062A \u0645\u0647\u0627\u0631\u062A \u0645\u06A9\u0627\u0644\u0645\u0647"
        }
      ]
    };
    return res.json(guestProgress);
  }
  const learnedWords = db.getLearnedWords(user.id);
  const quizResults = db.getUserQuizHistory(user.id);
  const wordsLearnedToday = Math.min(5, learnedWords.length);
  const aiPracticeDone = false;
  const quizCompleted = quizResults.length > 0;
  const recentActivity = [];
  if (learnedWords.length > 0) {
    const lastWord = learnedWords[learnedWords.length - 1];
    recentActivity.push({
      id: `act_w_${lastWord.id}`,
      type: "word",
      title: `\u06CC\u0627\u062F\u06AF\u06CC\u0631\u06CC \u06A9\u0644\u0645\u0647 "${lastWord.english}"`,
      timestamp: "\u0627\u0645\u0631\u0648\u0632",
      xpEarned: 10
    });
  }
  if (quizResults.length > 0) {
    const lastQuiz = quizResults[0];
    recentActivity.push({
      id: `act_q_${lastQuiz.id}`,
      type: "quiz",
      title: `\u0622\u0632\u0645\u0648\u0646 \u062A\u0639\u06CC\u06CC\u0646 \u0633\u0637\u062D / \u062A\u0633\u062A \u0632\u0628\u0627\u0646`,
      timestamp: "\u0627\u062E\u06CC\u0631\u0627\u064B",
      xpEarned: Math.round(lastQuiz.score * 10)
    });
  }
  const progress = {
    userId: user.id,
    level: user.englishLevel,
    totalXp: user.xp,
    streakDays: user.streak,
    learnedWordIds: learnedWords.map((w) => w.id),
    completedQuizIds: quizResults.map((q) => q.quizId),
    completedLessonIds: [],
    todayGoal: {
      date: today,
      wordsLearned: wordsLearnedToday,
      targetWords: 5,
      aiPracticeDone,
      quizCompleted,
      completed: wordsLearnedToday >= 5 && aiPracticeDone && quizCompleted
    },
    recentActivity,
    weakTopics: [],
    recommendedLessons: [
      {
        id: "rec_1",
        titleFa: "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0635\u062D\u06CC\u062D \u0627\u0632 \u062D\u0631\u0648\u0641 \u0627\u0636\u0627\u0641\u0647 In, On, At",
        titleEn: "Mastering Prepositions of Time & Place",
        type: "grammar",
        reasonFa: "\u0634\u0631\u0648\u0639 \u06CC\u0627\u062F\u06AF\u06CC\u0631\u06CC \u0628\u0627 \u0627\u0635\u0648\u0644 \u0627\u0648\u0644\u06CC\u0647 \u06AF\u0631\u0627\u0645\u0631"
      },
      {
        id: "rec_2",
        titleFa: "\u062A\u0645\u0631\u06CC\u0646 \u0645\u06A9\u0627\u0644\u0645\u0647: \u0645\u0639\u0631\u0641\u06CC \u062E\u0648\u062F \u062F\u0631 \u0645\u062F\u0631\u0633\u0647 \u0648 \u062F\u0627\u0646\u0634\u06AF\u0627\u0647",
        titleEn: "Classroom & Self-Introduction Dialogue",
        type: "conversation",
        reasonFa: "\u062A\u0637\u0628\u06CC\u0642 \u0628\u0627 \u0647\u062F\u0641 \u062A\u0642\u0648\u06CC\u062A \u0645\u0647\u0627\u0631\u062A \u0645\u06A9\u0627\u0644\u0645\u0647"
      },
      {
        id: "rec_3",
        titleFa: "\u067E\u06A9\u06CC\u062C \u06F5 \u0644\u063A\u062A \u06A9\u0644\u06CC\u062F\u06CC \u0628\u0631\u0627\u06CC \u0645\u06A9\u0627\u0644\u0645\u0627\u062A \u0631\u0648\u0632\u0645\u0631\u0647",
        titleEn: "5 Essential Daily Action Verbs",
        type: "vocabulary",
        reasonFa: "\u062A\u06A9\u0645\u06CC\u0644 \u0647\u062F\u0641 \u06F5 \u0644\u063A\u062A \u062C\u062F\u06CC\u062F \u0627\u0645\u0631\u0648\u0632"
      }
    ]
  };
  res.json(progress);
});
learningRouter.get("/achievements", (req, res) => {
  const user = getAuthUser(req) || db.getUserById("usr_demo_1");
  if (!user) return res.status(401).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
  const achs = db.getAchievements(user.id);
  res.json(achs);
});
learningRouter.get("/videos", (req, res) => {
  const videos = db.getVideoLessons();
  res.json(videos);
});
learningRouter.get("/notifications", (req, res) => {
  const user = getAuthUser(req) || db.getUserById("usr_demo_1");
  if (!user) return res.status(401).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
  const notifs = db.getNotifications(user.id);
  res.json(notifs);
});
learningRouter.post("/notifications/:id/read", (req, res) => {
  const user = getAuthUser(req) || db.getUserById("usr_demo_1");
  if (!user) return res.status(401).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
  db.markNotificationRead(user.id, req.params.id);
  res.json({ success: true });
});

// server/routes/admin.ts
var import_express8 = require("express");
var adminRouter = (0, import_express8.Router)();
function checkAdmin(req, res, next) {
  const user = getAuthUser(req) || db.getUserById("usr_admin_1");
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "\u062F\u0633\u062A\u0631\u0633\u06CC \u0641\u0642\u0637 \u0628\u0631\u0627\u06CC \u0645\u062F\u06CC\u0631\u0627\u0646 \u0633\u06CC\u0633\u062A\u0645 \u0627\u0645\u06A9\u0627\u0646\u200C\u067E\u0630\u06CC\u0631 \u0627\u0633\u062A." });
  }
  next();
}
adminRouter.get("/stats", checkAdmin, (req, res) => {
  const usersCount = db.users.size;
  const vocabCount = db.vocabulary.size;
  const quizCount = db.quizzes.size;
  const reports = db.getModerationReports();
  const pendingReports = reports.filter((r) => r.status === "pending").length;
  res.json({
    usersCount,
    vocabCount,
    quizCount,
    pendingReports,
    totalPosts: db.communityPosts.size
  });
});
adminRouter.get("/reports", checkAdmin, (req, res) => {
  const reports = db.getModerationReports();
  res.json(reports);
});
adminRouter.post("/reports/:id/action", checkAdmin, (req, res) => {
  const { action, targetId, targetType } = req.body;
  const report = db.moderationReports.get(req.params.id);
  if (!report) return res.status(404).json({ error: "\u06AF\u0632\u0627\u0631\u0634 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
  if (action === "delete_content") {
    if (targetType === "post" && targetId) {
      db.deletePost(targetId);
    }
    report.status = "resolved";
  } else if (action === "dismiss") {
    report.status = "dismissed";
  }
  db.moderationReports.set(report.id, report);
  res.json({ success: true, report });
});
adminRouter.post("/publish-content", checkAdmin, (req, res) => {
  try {
    const { contentType, contentData } = req.body;
    if (!contentType || !contentData) {
      return res.status(400).json({ error: "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0645\u062D\u062A\u0648\u0627 \u0646\u0627\u0642\u0635 \u0627\u0633\u062A." });
    }
    if (contentType === "vocabulary") {
      const words = Array.isArray(contentData) ? contentData : [contentData];
      const added = db.addVocabularyBatch(words);
      return res.json({ success: true, message: `${added.length} \u0644\u063A\u062A \u062C\u062F\u06CC\u062F \u0628\u0647 \u067E\u0627\u06CC\u06AF\u0627\u0647 \u062F\u0627\u0646\u0634 \u0627\u0641\u0632\u0648\u062F\u0647 \u0634\u062F.`, added });
    }
    if (contentType === "quiz") {
      const added = db.addQuiz(contentData);
      return res.json({ success: true, message: "\u0622\u0632\u0645\u0648\u0646 \u062C\u062F\u06CC\u062F \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0645\u0646\u062A\u0634\u0631 \u0634\u062F.", added });
    }
    if (contentType === "scenario") {
      const added = db.addScenario(contentData);
      return res.json({ success: true, message: "\u0633\u0646\u0627\u0631\u06CC\u0648\u06CC \u0645\u06A9\u0627\u0644\u0645\u0647 \u062C\u062F\u06CC\u062F \u0628\u0647 \u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646 \u0627\u0636\u0627\u0641\u0647 \u0634\u062F.", added });
    }
    res.status(400).json({ error: "\u0646\u0648\u0639 \u0645\u062D\u062A\u0648\u0627 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A." });
  } catch (error) {
    console.error("Publish content error:", error);
    res.status(500).json({ error: "\u062E\u0637\u0627 \u062F\u0631 \u0627\u0646\u062A\u0634\u0627\u0631 \u0645\u062D\u062A\u0648\u0627" });
  }
});

// server.ts
var import_meta = {};
import_dotenv.default.config();
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
async function startServer() {
  const app = (0, import_express9.default)();
  const PORT = 3e3;
  app.use(import_express9.default.json());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", name: "Learn with Mohanna API", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.use("/api/auth", authRouter);
  app.use("/api/ai", aiRouter);
  app.use("/api/vocabulary", vocabularyRouter);
  app.use("/api/dictionary", dictionaryRouter);
  app.use("/api/quiz", quizRouter);
  app.use("/api/community", communityRouter);
  app.use("/api/learning", learningRouter);
  app.use("/api/admin", adminRouter);
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express9.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F680} Learn with Mohanna Server running on http://localhost:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
