'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiPlay, FiPause, FiMic, FiVolume2, FiTrash2 } from 'react-icons/fi';

/**
 * AudioMemoBlock — Embedded Voice Memo Player
 * Allows users to record, replay, and transcribe audio notes attached to whiteboard math notes.
 */
export default function AudioMemoBlock({ block, onUpdateContent, onDeleteBlock }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(block.content?.durationSec || 0);
  const audioRef = useRef(null);

  const audioSrc = block.content?.audioUrl || '';
  const title = block.content?.title || 'Voice Memo Note';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioSrc]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-zinc-900/90 dark:to-purple-950/30 border border-blue-200/60 dark:border-purple-800/40 shadow-sm space-y-2.5 select-none">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500 text-white shadow-sm">
            <FiMic className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-500">
          <FiVolume2 className="w-3.5 h-3.5" />
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>
      </div>

      {/* Progress Bar & Playback Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="p-2 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-95 text-white shadow-md transition-all flex-shrink-0"
        >
          {isPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4 ml-0.5" />}
        </button>

        {/* Audio scrubber */}
        <div className="flex-1 relative flex items-center">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => {
              const newTime = parseFloat(e.target.value);
              setCurrentTime(newTime);
              if (audioRef.current) audioRef.current.currentTime = newTime;
            }}
            className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
