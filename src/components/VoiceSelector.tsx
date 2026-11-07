import React from 'react';
import { Mic, CheckCircle2, Volume2, Sparkles, UserCheck } from 'lucide-react';
import { VoiceOption } from '../types';

interface VoiceSelectorProps {
  voices: VoiceOption[];
  activeVoiceId: string;
  onSelectVoice: (voice: VoiceOption) => void;
  isLoading: boolean;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  activeVoiceId,
  onSelectVoice,
  isLoading,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Mic className="w-4 h-4 text-emerald-400" />
          <span>Vozes Profissionais (Gemini 3.8 Flash TTS)</span>
        </div>
        <span className="text-[11px] text-slate-500">
          Vozes neurais ultra-realistas
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {voices.map((voice) => {
          const isSelected = activeVoiceId.toLowerCase() === voice.id.toLowerCase();

          return (
            <button
              key={voice.id}
              type="button"
              disabled={isLoading}
              onClick={() => onSelectVoice(voice)}
              className={`relative flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850/80'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
                </div>
              )}

              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-bold text-sm text-white">{voice.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                  {voice.gender === 'male' ? 'Masc' : 'Fem'}
                </span>
              </div>

              <span className="text-xs text-emerald-300/90 font-medium mb-1">
                {voice.tone}
              </span>

              <span className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                {voice.recommendedFor}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
