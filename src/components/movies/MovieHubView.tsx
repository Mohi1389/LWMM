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
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
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
    if (videoRef.current.duration) {
      setDuration(videoRef.current.duration);
    }

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
      }).catch((e) => {
        console.warn('Playback error:', e);
        setIsPlaying(false);
      });
    }
  };

  const setSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
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
    setCurrentTime(0);
    if (playerSectionRef.current) {
      playerSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Give browser a moment to update the src and then start playback
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.playbackRate = playbackSpeed;
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.log('Autoplay handled:', err);
          setIsPlaying(false);
        });
      }
    }, 150);
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
            {/* Video Box with Real HTML5 Controls & Interactive Overlay */}
            <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800 aspect-video flex items-center justify-center group">
              <video
                ref={videoRef}
                key={activeVideo.videoUrl}
                src={activeVideo.videoUrl}
                controls
                playsInline
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-contain bg-black"
              />

              {/* Colorful Start Overlay when video hasn't started playing yet */}
              {!isPlaying && currentTime === 0 && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-black/30 flex flex-col items-center justify-center gap-3 cursor-pointer group/btn hover:bg-black/50 transition-all p-4 text-center"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-2xl shadow-purple-600/50 transform group-hover/btn:scale-110 active:scale-95 transition-all">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white text-base sm:text-lg font-black drop-shadow">
                      {language === 'fa' ? 'برای تماشا و پخش آنلاین فیلم کلیک کنید' : 'Click to Play Movie'}
                    </p>
                    <p className="text-purple-200 text-xs sm:text-sm drop-shadow">
                      {language === 'fa' ? 'سکانس واقعی با صدای اصلی و زیرنویس هماهنگ انگلیسی و فارسی' : 'Real movie scene with original audio & bilingual subtitles'}
                    </p>
                  </div>
                </div>
              )}

              {/* Active Dual Subtitle Floating Overlay (positioned safely above native controls) */}
              {isPlaying && activeSubtitle && (
                <div className="absolute bottom-16 sm:bottom-14 left-4 right-4 pointer-events-none p-2 sm:p-2.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/15 text-center space-y-0.5 z-10 animate-fade-in shadow-2xl">
                  <p className="text-xs sm:text-sm md:text-base font-bold font-en text-white tracking-wide drop-shadow">
                    {activeSubtitle.textEn}
                  </p>
                  <p className="text-[11px] sm:text-xs font-medium font-fa text-sky-300 drop-shadow">
                    {activeSubtitle.textFa}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Playback Bar (Play/Pause, Rewind 10s, Speeds) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? (language === 'fa' ? 'توقف' : 'Pause') : (language === 'fa' ? 'پخش فیلم' : 'Play')}</span>
                </button>

                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 border border-slate-200/80 dark:border-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
                  title="۱۰ ثانیه به عقب برگرد"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[11px]">۱۰- ثانیه</span>
                </button>
              </div>

              {/* Playback Speed Switcher */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-bold hidden sm:inline">
                  {language === 'fa' ? 'سرعت پخش:' : 'Speed:'}
                </span>
                {[0.75, 1, 1.25].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSpeed(speed)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                      playbackSpeed === speed
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200/80 dark:border-slate-600'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
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
