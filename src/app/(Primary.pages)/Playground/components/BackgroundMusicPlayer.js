'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  FiMusic,
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiRepeat,
  FiUploadCloud,
  FiChevronDown,
  FiChevronUp,
  FiDisc,
} from 'react-icons/fi';

const BUILTIN_AMBIENT_PRESETS = [
  {
    id: 'lofi_rain',
    name: 'Lo-Fi Rain & Chill',
    icon: '🌧️',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-rain-ambient-111154.mp3',
  },
  {
    id: 'forest_breeze',
    name: 'Forest Birds & Breeze',
    icon: '🌲',
    url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_8457007e03.mp3?filename=forest-nature-ambient-110241.mp3',
  },
  {
    id: 'cafe_study',
    name: 'Cafe Study Ambience',
    icon: '☕',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a8c9b3.mp3?filename=cozy-cafe-10492.mp3',
  },
  {
    id: 'ocean_waves',
    name: 'Deep Focus Ocean Waves',
    icon: '🌊',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ocean-waves-ambient-10651.mp3',
  },
];

export default function BackgroundMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); // Default 30% soft background volume
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [activePreset, setActivePreset] = useState(BUILTIN_AMBIENT_PRESETS[0]);
  const [customAudioUrl, setCustomAudioUrl] = useState(null);
  const [customAudioName, setCustomAudioName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentAudioSrc = customAudioUrl || activePreset.url;
  const currentTitle = customAudioName || activePreset.name;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
    audio.loop = isLooping;
  }, [volume, isMuted, isLooping, currentAudioSrc]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn('Background audio playback blocked:', err);
        setIsPlaying(false);
      });
    }
  };

  const handlePresetSelect = (preset) => {
    setActivePreset(preset);
    setCustomAudioUrl(null);
    setCustomAudioName('');
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }, 100);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setCustomAudioUrl(fileUrl);
    setCustomAudioName(file.name.replace(/\.[^/.]+$/, ''));
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }, 100);
  };

  return (
    <div className="fixed bottom-20 right-6 z-50 select-none">
      <audio ref={audioRef} src={currentAudioSrc} loop={isLooping} />

      {/* Main Compact Player Pill */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-zinc-900/90 text-white backdrop-blur-xl border border-zinc-700/80 shadow-2xl transition-all">
        {/* Vinyl Disc Spin Animation when playing */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className={`p-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
            <FiDisc className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col text-left max-w-[130px]">
            <span className="text-[11px] font-semibold truncate leading-tight text-zinc-200">
              {currentTitle}
            </span>
            <span className="text-[9px] text-zinc-400 font-mono">
              {isPlaying ? 'Playing Ambient BG' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          title={isPlaying ? 'Pause Background Music' : 'Play Background Music'}
          className="p-2 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-95 text-white shadow-md transition-all cursor-pointer"
        >
          {isPlaying ? <FiPause className="w-3.5 h-3.5" /> : <FiPlay className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        {/* Expand Options Arrow */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          {isExpanded ? <FiChevronDown className="w-4 h-4" /> : <FiChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Controls Popover */}
      {isExpanded && (
        <div className="absolute bottom-14 right-0 w-72 p-3.5 rounded-2xl bg-zinc-900/95 text-white backdrop-blur-2xl border border-zinc-700/80 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
              <FiMusic className="w-4 h-4 text-blue-400" />
              <span>Background Ambient Music</span>
            </div>
            <button
              onClick={() => setIsLooping(!isLooping)}
              title={isLooping ? 'Loop Enabled' : 'Loop Disabled'}
              className={`p-1 rounded-md transition-colors ${
                isLooping ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <FiRepeat className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Volume Control Slider */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-zinc-400 hover:text-zinc-200"
            >
              {isMuted || volume === 0 ? (
                <FiVolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <FiVolume2 className="w-4 h-4 text-blue-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-[10px] font-mono text-zinc-400 w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Preset Options Grid */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              Study Ambience Presets
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {BUILTIN_AMBIENT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all text-left truncate cursor-pointer ${
                    !customAudioUrl && activePreset.id === preset.id
                      ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                      : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 border border-transparent'
                  }`}
                >
                  <span>{preset.icon}</span>
                  <span className="truncate text-[11px]">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom MP3 Upload */}
          <div className="pt-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/mp3,audio/wav,audio/m4a,audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-all cursor-pointer"
            >
              <FiUploadCloud className="w-4 h-4 text-blue-400" />
              <span>Upload Custom MP3 Note Music</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
