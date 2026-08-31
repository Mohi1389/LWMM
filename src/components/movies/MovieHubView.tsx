import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Play,
  Pause,
  Volume2,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Bot,
  RotateCcw,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { VideoContent, VideoSubtitle } from '../../types/index.js';

interface MovieHubViewProps {
  onNavigateToAI: (prompt?: string) => void;
}

export const MovieHubView: React.FC<MovieHubViewProps> = ({ onNavigateToAI }) => {
  const { addXp } = useAuth();
  const { language } = useLanguage();

  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoContent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSubtitle, setActiveSubtitle] = useState<VideoSubtitle | null>(null);
  const [selectedWord, setSelectedWord] = useState<{ word: string; meaningFa: string } | null>(null);
  const [savedPhrases, setSavedPhrases] = useState<Set<string>>(new Set());

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetch('/api/learning/videos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setVideos(data);
          setActiveVideo(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current || !activeVideo) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Find current subtitle
    const sub = activeVideo.subtitles.find(
      (s) => time >= s.startTime && time <= s.endTime
    );
    setActiveSubtitle(sub || null);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const jumpToSubtitle = (sub: VideoSubtitle) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = sub.startTime;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const playTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSavePhrase = (phraseEn: string) => {
    const newSet = new Set(savedPhrases);
    if (newSet.has(phraseEn)) newSet.delete(phraseEn);
    else {
      newSet.add(phraseEn);
      addXp(5);
    }
    setSavedPhrases(newSet);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in" id="movie-hub-view">
      {/* 1. Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {language === 'fa' ? 'انگلیسی با فیلم و انیمیشن 🎬' : 'Movie & Animation English'}
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
            زیرنویس هوشمند تعاملی
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          {language === 'fa'
            ? 'یادگیری اصطلاحات، دیالوگ‌های پرکاربرد و تلفظ طبیعی با ویدیوهای برگزیده سینما و انیمیشن'
            : 'Learn colloquial English and natural phrasing through movie clips with interactive dual subtitles.'}
        </p>
      </div>

      {activeVideo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Player & Interactive Subtitle Display (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Container */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 aspect-video flex items-center justify-center">
              <video
                ref={videoRef}
                src={activeVideo.videoUrl}
                poster={activeVideo.thumbnail}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-full object-cover"
              />

              {/* Central Play/Pause Overlay */}
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-slate-900/70 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg z-10"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5 rtl:mr-0.5" />}
              </button>

              {/* Active Dual Subtitle Floating Overlay */}
              {activeSubtitle && (
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-center space-y-1 z-20 animate-fade-in">
                  <p className="text-sm sm:text-base font-bold font-en text-white tracking-wide">
                    {activeSubtitle.textEn}
                  </p>
                  <p className="text-xs font-medium font-fa text-sky-300">
                    {activeSubtitle.textFa}
                  </p>
                </div>
              )}
            </div>

            {/* Video Info & Interactive Subtitle Line Selector */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-en">
                    {activeVideo.titleEn}
                  </h3>
                  <p className="text-xs text-slate-500 font-fa mt-0.5">
                    {activeVideo.titleFa}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 capitalize">
                    {activeVideo.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 capitalize font-en">
                    {activeVideo.level}
                  </span>
                </div>
              </div>

              {/* Subtitle Dialogue Lines (Click to jump & practice) */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-sky-500" />
                  <span>خطوط دیالوگ (برای پرش به آن ثانیه کلیک کنید):</span>
                </span>

                <div className="space-y-2">
                  {activeVideo.subtitles.map((sub) => {
                    const isCurrent = activeSubtitle?.id === sub.id;
                    return (
                      <div
                        key={sub.id}
                        onClick={() => jumpToSubtitle(sub)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isCurrent
                            ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 shadow-sm'
                            : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-900 dark:text-white font-en">
                            {sub.textEn}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-fa">
                            {sub.textFa}
                          </p>

                          {/* Key words badges */}
                          {sub.keyWords && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {sub.keyWords.map((kw, idx) => (
                                <button
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedWord(kw);
                                  }}
                                  className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-[10px] font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-200"
                                >
                                  🔍 {kw.word}: {kw.meaningFa}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTTS(sub.textEn);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 flex-shrink-0"
                          title="تلفظ دیالوگ"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Idioms Breakdown & Playlist */}
          <div className="space-y-6">
            {/* Key Phrases Breakdown Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  {language === 'fa' ? 'اصطلاحات کلیدی این کلیپ' : 'Key Phrases & Idioms'}
                </h3>
              </div>

              <div className="space-y-3">
                {activeVideo.keyPhrases.map((phrase, idx) => {
                  const isSaved = savedPhrases.has(phrase.en);
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black font-en text-slate-900 dark:text-white">
                          {phrase.en}
                        </span>
                        <button
                          onClick={() => toggleSavePhrase(phrase.en)}
                          className="text-slate-400 hover:text-amber-500 p-1"
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <p className="text-xs font-bold text-sky-600 dark:text-sky-400 font-fa">
                        {phrase.fa}
                      </p>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-fa leading-relaxed">
                        {phrase.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  onNavigateToAI(
                    `می‌خواهم اصطلاحات فیلم "${activeVideo.titleEn}" مثل "${activeVideo.keyPhrases[0]?.en}" را با من تمرین کنی.`
                  )
                }
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <Bot className="w-4 h-4" />
                <span>تمرین این اصطلاحات با مهنا AI</span>
              </button>
            </div>

            {/* Other Video Lessons in Playlist */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                سایر ویدیوها و انیمیشن‌ها:
              </span>

              <div className="space-y-2">
                {videos.map((vid) => {
                  const isCurrent = vid.id === activeVideo.id;
                  return (
                    <div
                      key={vid.id}
                      onClick={() => {
                        setActiveVideo(vid);
                        setIsPlaying(false);
                      }}
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isCurrent
                          ? 'border-purple-500 bg-purple-50/60 dark:bg-purple-950/40'
                          : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <img
                        src={vid.thumbnail}
                        alt={vid.titleEn}
                        className="w-16 h-12 object-cover rounded-xl flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="overflow-hidden">
                        <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate font-en">
                          {vid.titleEn}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{vid.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
