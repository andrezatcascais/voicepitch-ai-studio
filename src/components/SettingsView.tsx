import React, { useState } from 'react';
import {
  Settings,
  Languages,
  Mic,
  Clock,
  Gauge,
  Sliders,
  ShieldCheck,
  Sparkles,
  Check,
  RotateCcw,
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, AVAILABLE_VOICES } from '../data/languagesAndVoices';
import { useLanguage } from '../i18n/LanguageContext';

interface SettingsViewProps {
  defaultLanguage: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  defaultPause: number;
  onChangeDefaultPause: (pause: number) => void;
  onClearStorage: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  defaultLanguage,
  onChangeLanguage,
  defaultPause,
  onChangeDefaultPause,
  onClearStorage,
}) => {
  const { t } = useLanguage();
  const [speed, setSpeed] = useState<number>(1.0);
  const [bitrate, setBitrate] = useState<number>(128);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-16">
      {/* Toast */}
      {savedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="px-4 py-3 rounded-xl bg-emerald-900/90 text-emerald-100 border border-emerald-500/50 shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.settings.saveSuccessToast}</span>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-400" />
          <span>{t.settings.title}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          {t.settings.subtitle}
        </p>
      </div>

      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 flex flex-col gap-6 backdrop-blur-md shadow-xl">
        {/* Section 1: Language & Accent */}
        <div className="flex flex-col gap-3 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">{t.settings.defaultLangTitle}</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.settings.defaultLangDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = defaultLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => onChangeLanguage(lang.code)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {lang.accentLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Interview Practice Pauses */}
        <div className="flex flex-col gap-3 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm">{t.settings.pauseTitle}</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.settings.pauseDesc}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {[5, 10, 15, 20, 30].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => onChangeDefaultPause(sec)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  defaultPause === sec
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Audio Bitrate & Quality */}
        <div className="flex flex-col gap-3 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">{t.settings.bitrateTitle}</h3>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setBitrate(128)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                bitrate === 128
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {t.settings.bitrate128}
            </button>
            <button
              type="button"
              onClick={() => setBitrate(192)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                bitrate === 192
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {t.settings.bitrate192}
            </button>
          </div>
        </div>

        {/* Section 4: Engine Info */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-white block font-semibold mb-0.5">{t.settings.engineInfoTitle}</strong>
            {t.settings.engineInfoDesc}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClearStorage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30 transition-all font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.settings.clearHistoryBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            {t.settings.savePrefsBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
