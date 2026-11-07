import React, { useState, useEffect } from 'react';
import {
  Mic,
  Sparkles,
  Download,
  Languages,
  Sliders,
  RefreshCw,
  FolderPlus,
  FileAudio,
  Check,
  Clock,
  AudioLines,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { SupportedLanguage, VoiceOption, AudioSettings, SavedProject } from '../types';
import { SUPPORTED_LANGUAGES, AVAILABLE_VOICES, SAMPLE_PITCH_BY_LOCALE } from '../data/languagesAndVoices';
import { WaveformVisualizer } from './WaveformVisualizer';
import { AudioPlayerControls } from './AudioPlayerControls';
import { useLanguage } from '../i18n/LanguageContext';

interface TtsGeneratorViewProps {
  initialText?: string;
  onNavigateToPracticeWithText?: (text: string) => void;
  onSaveToLibrary: (project: Omit<SavedProject, 'id' | 'createdAt'>) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  currentAudioUrl: string;
  currentWavUrl: string;
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
  onAudioGenerated: (mp3Url: string, wavUrl: string, durationSec: number, text: string) => void;
}

export const TtsGeneratorView: React.FC<TtsGeneratorViewProps> = ({
  initialText = '',
  onNavigateToPracticeWithText,
  onSaveToLibrary,
  audioRef,
  currentAudioUrl,
  currentWavUrl,
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
  onAudioGenerated,
}) => {
  const { t, locale } = useLanguage();

  // Map app locale to default speech language
  const defaultSpeechLang: SupportedLanguage =
    locale === 'pt-BR'
      ? 'pt-BR'
      : locale === 'pt-PT'
      ? 'pt-PT'
      : locale === 'fr'
      ? 'fr'
      : locale === 'es'
      ? 'es'
      : locale === 'de'
      ? 'de'
      : 'en-US';

  const [text, setText] = useState(
    initialText ||
      (locale === 'pt-BR'
        ? `Você deve me contratar porque tenho quase 10 anos de experiência em desenvolvimento de software, atuando principalmente com Java, Spring Boot e sistemas backend.

Sou focado em resolver problemas, aprendo rápido e gosto de construir soluções confiáveis e escaláveis. Também me sinto muito à vontade trabalhando com diferentes equipes, compartilhando conhecimento e aprendendo novas tecnologias.

Acredito que posso agregar tanto experiência técnica quanto uma forte disposição para contribuir com o seu time e ajudar na entrega de software de alta qualidade.`
        : locale === 'pt-PT'
        ? `Devem contratar-me porque conto com cerca de 10 anos de experiência em engenharia de software, desenvolvendo sistemas de backend robustos em Java e Spring Boot.

Tenho facilidade em resolver problemas complexos e gosto de construir arquiteturas fiáveis e escaláveis. Trabalho com muita naturalidade em equipas multidisciplinares e mantenho-me em constante aprendizagem.

Acredito que posso trazer tanto maturidade técnica como uma forte vontade de contribuir para o vosso projeto e elevar a qualidade do software.`
        : `You should hire me because I have almost 10 years of experience in software development, mainly working with Java, Spring Boot, and backend systems.

I'm a problem-solver, a quick learner, and someone who enjoys building reliable and scalable solutions. I'm also comfortable working with different teams, sharing knowledge, and learning new technologies.

I believe I can bring both technical experience and a strong willingness to contribute to your team and help deliver high-quality software.`)
  );

  const [language, setLanguage] = useState<SupportedLanguage>(defaultSpeechLang);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('Fenrir');
  const [style, setStyle] = useState<string>(
    'Confident, articulate, professional software engineer presenting during a job interview'
  );
  const [bitrate, setBitrate] = useState<number>(128);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync default speech language when interface locale changes
  useEffect(() => {
    setLanguage(defaultSpeechLang);
  }, [locale]);

  // Filter available voices for selected language
  const availableVoicesForLang = AVAILABLE_VOICES.filter((v) => v.language === language);
  const activeVoice =
    AVAILABLE_VOICES.find((v) => v.id === selectedVoiceId) || availableVoicesForLang[0] || AVAILABLE_VOICES[0];

  // Auto-switch voice when speech language changes
  useEffect(() => {
    const defaultForLang = AVAILABLE_VOICES.find((v) => v.language === language);
    if (defaultForLang) {
      setSelectedVoiceId(defaultForLang.id);
    }
  }, [language]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Word & time estimates
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const estimatedSeconds = Math.max(1, Math.round(wordCount / 2.3));

  // Detect if text contains interview questions/answers
  const isDetectedInterview =
    text.includes('?') ||
    /\b(question|answer|interviewer|candidate|hire|job interview|por que|porque|deve me contratar|contratar-me)\b/i.test(text);

  const handleGenerateAudio = async () => {
    if (!text.trim() || isLoading) return;
    try {
      setIsLoading(true);

      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voice: activeVoice.id,
          style,
          language,
          bitrate,
          filename: `voicepitch_${language.toLowerCase()}_${activeVoice.name.toLowerCase()}.mp3`,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.mp3Base64) throw new Error('Nenhum dado de áudio retornado.');

      // MP3 blob
      const mp3Bytes = Uint8Array.from(atob(data.mp3Base64), (c) => c.charCodeAt(0));
      const mp3Blob = new Blob([mp3Bytes], { type: 'audio/mpeg' });
      const mp3Url = URL.createObjectURL(mp3Blob);

      // WAV blob (if present)
      let wavUrl = '';
      if (data.wavBase64) {
        const wavBytes = Uint8Array.from(atob(data.wavBase64), (c) => c.charCodeAt(0));
        const wavBlob = new Blob([wavBytes], { type: 'audio/wav' });
        wavUrl = URL.createObjectURL(wavBlob);
      }

      onAudioGenerated(mp3Url, wavUrl, data.durationSec || estimatedSeconds, text);
      showToast(data.message || t.tts.toastSuccess);
    } catch (error: any) {
      console.error('Error generating audio:', error);
      showToast(`Erro: ${error?.message || 'Tente novamente'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`📥 Download de ${filename} iniciado!`);
  };

  const handleDownloadMp3 = () => {
    if (!currentAudioUrl) return;
    downloadFile(currentAudioUrl, `voicepitch_${activeVoice.name.toLowerCase()}.mp3`);
  };

  const handleDownloadWav = () => {
    if (!currentWavUrl && !currentAudioUrl) return;
    downloadFile(currentWavUrl || currentAudioUrl, `voicepitch_${activeVoice.name.toLowerCase()}.wav`);
  };

  const handleSaveProject = () => {
    if (!currentAudioUrl) {
      showToast('Gere o áudio primeiro antes de salvar na biblioteca.');
      return;
    }
    onSaveToLibrary({
      title: text.slice(0, 42).trim() + '...',
      type: 'tts',
      originalText: text,
      language,
      voice: activeVoice.id,
      audioUrl: currentAudioUrl,
      duration: duration || estimatedSeconds,
      fileSize: `${Math.round((duration || 28) * 16)} KB`,
    });
    showToast(t.tts.toastSaveSuccess);
  };

  const handleLoadSamplePitch = (langCode: SupportedLanguage) => {
    const sample = SAMPLE_PITCH_BY_LOCALE[langCode] || SAMPLE_PITCH_BY_LOCALE['en-US'];
    setText(sample);
    setLanguage(langCode);
    const matchingVoices = AVAILABLE_VOICES.filter((v) => v.language === langCode);
    if (matchingVoices.length > 0) {
      setSelectedVoiceId(matchingVoices[0].id);
    }
    showToast(`Texto modelo carregado para ${langCode}`);
  };

  const progressFraction = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-500">
          <div className="px-4 py-3 rounded-xl bg-emerald-900/90 text-emerald-100 border border-emerald-500/50 shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Mic className="w-6 h-6 text-emerald-400" />
            <span>{t.tts.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.tts.subtitle}
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2 text-xs font-mono bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400">
          <span>{wordCount} {t.tts.words}</span>
          <span>•</span>
          <span>{charCount} {t.tts.characters}</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            ~{estimatedSeconds}s {t.tts.speechEstimate}
          </span>
        </div>
      </div>

      {/* Interview Detection Alert Banner */}
      {isDetectedInterview && onNavigateToPracticeWithText && (
        <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0" />
            <div className="text-xs leading-relaxed">
              <strong className="text-indigo-300 font-semibold block">{t.tts.detectAlertTitle}</strong>
              {t.tts.detectAlertBody}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToPracticeWithText(text)}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 whitespace-nowrap"
          >
            {t.tts.detectAlertBtn}
          </button>
        </div>
      )}

      {/* Text Area Card */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 backdrop-blur-md shadow-xl flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {t.tts.inputLabel}
          </label>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Exemplo Pitch:</span>
            <button
              type="button"
              onClick={() => handleLoadSamplePitch('pt-BR')}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 transition-colors"
            >
              🇧🇷 PT-BR
            </button>
            <button
              type="button"
              onClick={() => handleLoadSamplePitch('pt-PT')}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 transition-colors"
            >
              🇵🇹 PT-PT
            </button>
            <button
              type="button"
              onClick={() => handleLoadSamplePitch('en-US')}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 transition-colors"
            >
              🇺🇸 EN-US
            </button>
            <button
              type="button"
              onClick={() => handleLoadSamplePitch('en-GB')}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 transition-colors"
            >
              🇬🇧 EN-UK
            </button>
            <button
              type="button"
              onClick={() => handleLoadSamplePitch('fr')}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 transition-colors"
            >
              🇫🇷 FR
            </button>
            <button
              type="button"
              onClick={() => handleLoadSamplePitch('es')}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 transition-colors"
            >
              🇪🇸 ES
            </button>
            <button
              type="button"
              onClick={() => handleLoadSamplePitch('de')}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 transition-colors"
            >
              🇩🇪 DE
            </button>
            <button
              type="button"
              onClick={() => setText('')}
              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors ml-2"
            >
              {t.tts.clearBtn}
            </button>
          </div>
        </div>

        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.tts.placeholder}
          className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans leading-relaxed resize-y"
        />

        {/* Language & Voice Selectors Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Language / Accent */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.tts.langLabel}</span>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} — {lang.accentLabel}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Persona */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-teal-400" />
              <span>{t.tts.voiceLabel} ({availableVoicesForLang.length} {t.tts.voicesAvailable}):</span>
            </label>
            <select
              value={selectedVoiceId}
              onChange={(e) => setSelectedVoiceId(e.target.value)}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {availableVoicesForLang.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name} ({voice.gender === 'male' ? 'Masc' : 'Fem'}) — {voice.tone}
                </option>
              ))}
            </select>
          </div>

          {/* Style / Tone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.tts.toneLabel}</span>
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="Confident, articulate, professional software engineer presenting during a job interview">
                {t.tts.toneInterview}
              </option>
              <option value="Conversational, friendly, natural and highly engaging delivery">
                {t.tts.toneConversational}
              </option>
              <option value="Calm, clear, deliberate and perfectly paced for language learning">
                {t.tts.toneCalm}
              </option>
              <option value="Enthusiastic, energetic and highly motivational presentation">
                {t.tts.toneEnthusiastic}
              </option>
            </select>
          </div>
        </div>

        {/* Generate Button Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>{t.tts.mp3Quality} <strong>{bitrate} kbps</strong></span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">{activeVoice.accent}</span>
          </div>

          <button
            type="button"
            disabled={isLoading || !text.trim()}
            onClick={handleGenerateAudio}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t.tts.generatingBtn}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.tts.generateBtn} {activeVoice.name}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audio Player Card (Waveform + Scrubber + Downloads) */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6 backdrop-blur-md shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <AudioLines className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.tts.playerTitle}</h3>
              <p className="text-xs text-slate-400">
                {t.tts.playerSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveProject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
            title={t.tts.saveLibraryBtn}
          >
            <FolderPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.tts.saveLibraryBtn}</span>
          </button>
        </div>

        {/* Waveform Visualizer */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <WaveformVisualizer
            isPlaying={isPlaying}
            progress={progressFraction}
            onSeek={(fraction) => onSeek(fraction * duration)}
            barCount={52}
          />
        </div>

        {/* Controls Bar */}
        <AudioPlayerControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          playbackRate={playbackRate}
          volume={volume}
          isMuted={isMuted}
          onTogglePlay={onTogglePlay}
          onRestart={onRestart}
          onSeek={onSeek}
          onChangeRate={onChangeRate}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
          onDownloadMp3={handleDownloadMp3}
          onDownloadWav={handleDownloadWav}
          mp3FileSize={`${Math.round(Math.max(20, duration * 16))} KB`}
          wavFileSize={`${Math.round(Math.max(60, duration * 48))} KB`}
        />
      </div>
    </div>
  );
};
