import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Gauge,
  Sparkles,
  FileAudio,
} from 'lucide-react';

interface AudioPlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  onSeek: (seconds: number) => void;
  onChangeRate: (rate: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onDownloadMp3: () => void;
  onDownloadWav: () => void;
  mp3FileSize?: string;
  wavFileSize?: string;
}

export const AudioPlayerControls: React.FC<AudioPlayerControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  volume,
  isMuted,
  onTogglePlay,
  onRestart,
  onSeek,
  onChangeRate,
  onVolumeChange,
  onToggleMute,
  onDownloadMp3,
  onDownloadWav,
  mp3FileSize = '438 KB',
  wavFileSize = '1.3 MB',
}) => {
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const speedOptions = [0.8, 1.0, 1.2, 1.5];

  return (
    <div className="flex flex-col gap-4">
      {/* Time & Quick Stats Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-semibold">{formatTime(currentTime)}</span>
          <span className="text-slate-600">/</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            MP3 128 kbps • 24 kHz
          </span>
        </div>
      </div>

      {/* Main Transport Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-md">
        {/* Play / Restart / Skip */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRestart}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all focus:outline-none"
            title="Reiniciar áudio (0:00)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25 transition-all focus:outline-none"
            title={isPlaying ? 'Pausar (Espaço)' : 'Tocar (Espaço)'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-slate-950" />
            ) : (
              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
            )}
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80">
          <Gauge className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1 hidden sm:block" />
          {speedOptions.map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => onChangeRate(rate)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                playbackRate === rate
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMute}
            className="p-2 rounded-lg text-slate-400 hover:text-white transition-all focus:outline-none"
            title={isMuted ? 'Desmutar' : 'Mutar'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-16 sm:w-20 accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Big Action Download Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          <button
            type="button"
            onClick={onDownloadMp3}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all active:scale-98"
            title="Baixar arquivo MP3 de alta compatibilidade"
          >
            <Download className="w-4 h-4" />
            <span>Baixar .MP3</span>
            <span className="text-[11px] opacity-80 font-mono font-normal">({mp3FileSize})</span>
          </button>

          <button
            type="button"
            onClick={onDownloadWav}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-all hover:border-slate-600 active:scale-98"
            title="Baixar master WAV sem compressão"
          >
            <FileAudio className="w-3.5 h-3.5 text-teal-400" />
            <span>WAV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
