import React, { useMemo } from 'react';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  progress: number; // 0 to 1
  onSeek: (progress: number) => void;
  barCount?: number;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isPlaying,
  progress,
  onSeek,
  barCount = 48,
}) => {
  // Deterministic heights representing a speech waveform with natural speech cadence
  const bars = useMemo(() => {
    const speechPattern = [
      0.15, 0.25, 0.5, 0.7, 0.85, 0.65, 0.45, 0.8, 0.95, 0.6, 0.3, 0.2, // "You should hire me..."
      0.4, 0.75, 0.9, 0.85, 0.7, 0.55, 0.85, 0.92, 0.65, 0.35, 0.15, // "...10 years experience"
      0.2, 0.5, 0.8, 0.85, 0.9, 0.65, 0.45, 0.7, 0.85, 0.6, 0.3, 0.2, // "Java, Spring Boot..."
      0.35, 0.65, 0.95, 0.7, 0.5, 0.8, 0.9, 0.75, 0.55, 0.35, 0.2, 0.1, // "...reliable and scalable"
    ];

    const result = [];
    for (let i = 0; i < barCount; i++) {
      const baseIdx = Math.floor((i / barCount) * speechPattern.length);
      const val = speechPattern[baseIdx] || 0.4;
      // subtle sine modulation for organic aesthetic
      const variation = Math.sin(i * 0.4) * 0.12;
      result.push(Math.max(0.12, Math.min(1, val + variation)));
    }
    return result;
  }, [barCount]);

  const handleBarClick = (index: number) => {
    const newProgress = (index + 0.5) / barCount;
    onSeek(newProgress);
  };

  return (
    <div className="relative w-full py-4 px-2 select-none group">
      {/* Background track line */}
      <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 pointer-events-none rounded-full" />

      {/* Bars container */}
      <div className="relative flex items-center justify-between gap-0.5 sm:gap-0.75 h-16 w-full cursor-pointer">
        {bars.map((height, i) => {
          const barProgress = i / barCount;
          const isPlayed = barProgress <= progress;

          // Subtle dynamic bounce for active playback
          const activeScale = isPlaying && isPlayed ? 'animate-pulse' : '';

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleBarClick(i)}
              className="flex-1 flex items-center justify-center h-full group/bar focus:outline-none"
              title={`Ir para ${Math.round(barProgress * 100)}%`}
            >
              <div
                style={{
                  height: `${Math.round(height * 100)}%`,
                  minHeight: '4px',
                }}
                className={`w-full rounded-full transition-all duration-150 ${
                  isPlayed
                    ? 'bg-linear-to-t from-emerald-500 to-teal-400 group-hover/bar:brightness-125 shadow-sm shadow-emerald-500/30'
                    : 'bg-slate-700/80 group-hover/bar:bg-slate-500'
                } ${activeScale}`}
              />
            </button>
          );
        })}
      </div>

      {/* Progress handle point */}
      <div
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75"
        style={{ left: `calc(${progress * 100}% - 6px)` }}
      >
        <div className="w-3 h-3 bg-white rounded-full shadow-lg shadow-emerald-500/50 ring-2 ring-emerald-400" />
      </div>
    </div>
  );
};
