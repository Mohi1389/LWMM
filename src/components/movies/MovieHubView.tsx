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
  Clapperboard,
  Tv,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { VideoContent, VideoSubtitle } from '../../types/index.js';
import { initialVideoLessons } from '../../data/seedData.js';
import { MovieCardCover } from './MovieCardCover.js';

interface MovieHubViewProps {
  onNavigateToAI: (prompt?: string) => void;
}

export const MovieHubView: React.FC<MovieHubViewProps> = ({ onNavigateToAI }) => {
  const { addXp } = useAuth();
  const { language } = useLanguage();

  const [videos, setVideos] = useState<VideoContent[]>(initialVideoLessons);
  const [activeVideo, setActiveVideo] = useState<VideoContent | null>(() => {
    try {
      const savedId = localStorage.getItem('lwmm_active_video_id');
      if (savedId) {
        const found = initialVideoLessons.find((v) => v.id === savedId);
        if (found) return found;
      }
    } catch {}
    return initialVideoLessons[0] || null;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSubtitle, setActiveSubtitle] = useState<VideoSubtitle | null>(null);
  const [selectedWord, setSelectedWord] = useState<{ word: string; meaningFa: string } | null>(null);
  const [savedPhrases, setSavedPhrases] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<'all' | 'animation' | 'movie'>('all');

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedId = localStorage.getItem('lwmm_active_video_id');
      if (savedId) {
        const found = initialVideoLessons.find((v) => v.id === savedId);
        if (found) {
          setActiveVideo(found);
        }
        localStorage.removeItem('lwmm_active_video_id');
      }
    } catch {}

    fetch('/api/learning/videos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setVideos(data);
          setActiveVideo((prev) => {
            if (prev) {
              const matched = data.find((d: VideoContent) => d.id === prev.id);
              if (matched) return matched;
            }
            return data[0];
          });
        }
      })
      .catch(() => {
        setVideos(initialVideoLessons);
      });
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
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const jumpToSubtitle = (sub: VideoSubtitle) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = sub.startTime;
    videoRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {});
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

  const handleSelectVideo = (vid: VideoContent) => {
    setActiveVideo(vid);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
    if (playerSectionRef.current) {
      playerSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredVideos = videos.filter(
    (v) => filterCategory === 'all' || v.category === filterCategory
  );

  return (
    <div className="space-y-8 pb-16 animate-fade-in" id="movie-hub-view">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {language === 'fa' ? 'بخش انیمیشن‌ها و فیلم‌ها 🎬' : 'Movie & Animation Cinema'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'fa'
                  ? 'یادگیری لذت‌بخش زبان انگلیسی با سکانس‌های ماندگار و زیرنویس دو زبانه هوشمند'
                  : 'Master real-life English idioms and dialogue with synchronized bilingual clips.'}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterCategory === 'all'
                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {language === 'fa' ? 'همه ویدیوها' : 'All'}
          </button>
          <button
            onClick={() => setFilterCategory('animation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              filterCategory === 'animation'
                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🦁</span>
            <span>{language === 'fa' ? 'انیمیشن‌ها' : 'Animations'}</span>
          </button>
          <button
            onClick={() => setFilterCategory('movie')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              filterCategory === 'movie'
                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🎬</span>
            <span>{language === 'fa' ? 'فیلم‌های سینمایی' : 'Movies'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Selected Video Player Section */}
      {activeVideo && (
        <div ref={playerSectionRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 scroll-mt-20">
          {/* Main Video Player & Interactive Subtitle Display (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Box with 100% Anti-Black Screen Cover */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 aspect-video flex items-center justify-center group">
              <video
                ref={videoRef}
                src={activeVideo.videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />

              {/* Colorful Hero Cover when NOT playing (Prevents Black Screen) */}
              {!isPlaying && (
                <div className="absolute inset-0 z-20">
                  <MovieCardCover
                    video={activeVideo}
                    size="hero"
                    onClick={togglePlay}
                  />
                </div>
              )}

              {/* Playing Pause/Play Overlay Floating Button */}
              {isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-slate-950/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30 shadow-lg"
                >
                  <Pause className="w-6 h-6" />
                </button>
              )}

              {/* Active Dual Subtitle Floating Overlay */}
              {isPlaying && activeSubtitle && (
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-center space-y-1 z-30 animate-fade-in">
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
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-en">
                    {activeVideo.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-fa mt-0.5">
                    {activeVideo.titleFa}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 capitalize">
                    {activeVideo.category === 'animation' ? 'انیمیشن' : 'فیلم سینمایی'}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 capitalize font-en">
                    {activeVideo.level}
                  </span>
                </div>
              </div>

              {/* Subtitle Dialogue Lines (Click to jump & practice) */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-500" />
                  <span>خطوط دیالوگ‌های این کلیپ (کلیک روی هر خط برای پرش به آن):</span>
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
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50 shadow-sm'
                            : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-en">
                            {sub.textEn}
                          </p>
                          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-fa">
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
                          className="p-2 rounded-xl text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                          title="شنیدن تلفظ صوتی"
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

          {/* Right Column: Key Idioms Breakdown */}
          <div className="space-y-6">
            {/* Key Phrases Breakdown Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  {language === 'fa' ? 'اصطلاحات کلیدی این سکانس' : 'Key Phrases & Idioms'}
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

                      <p className="text-xs font-bold text-purple-600 dark:text-purple-400 font-fa">
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
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <Bot className="w-4 h-4" />
                <span>تمرین هوشمند این اصطلاحات با مهنا AI</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Complete Grid of All Animations & Movies with Vivid Covers */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clapperboard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {language === 'fa' ? 'تمام انیمیشن‌ها و فیلم‌های موجود' : 'All Video Lessons'}
            </h2>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full">
              {filteredVideos.length} مورد
            </span>
          </div>
        </div>

        {/* The Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((vid) => {
            const isSelected = activeVideo?.id === vid.id;
            return (
              <div
                key={vid.id}
                onClick={() => handleSelectVideo(vid)}
                className={`group rounded-3xl bg-white dark:bg-slate-900 border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-purple-500 shadow-xl shadow-purple-500/10 ring-2 ring-purple-500/30'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-purple-400 hover:shadow-lg'
                }`}
              >
                {/* Visual Cover (Guaranteed No Black Screen) */}
                <MovieCardCover
                  video={vid}
                  size="md"
                  active={isSelected}
                  showPlayBtn={true}
                />

                {/* Information Box */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-en group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                      {vid.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-fa line-clamp-1 mt-0.5">
                      {vid.titleFa}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-en capitalize">{vid.level}</span>
                    <button
                      className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 group-hover:bg-purple-600 group-hover:text-white'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isSelected ? 'در حال مشاهده' : 'انتخاب و پخش'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
