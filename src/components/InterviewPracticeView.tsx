import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Play,
  Pause,
  RotateCcw,
  Download,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  Mic,
  Volume2,
  Eye,
  EyeOff,
  Repeat,
  CheckCircle2,
  ListFilter,
  Check,
  FileAudio,
  Languages,
  Sliders,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  FolderPlus,
  ArrowRight,
  Shuffle,
  RefreshCw,
} from 'lucide-react';
import {
  InterviewItem,
  PracticeMode,
  SupportedLanguage,
  VoiceOption,
  SavedProject,
} from '../types';
import {
  AVAILABLE_VOICES,
  SUPPORTED_LANGUAGES,
  INITIAL_INTERVIEW_ITEMS,
  MULTILINGUAL_INTERVIEW_SCRIPTS,
} from '../data/languagesAndVoices';
import { useLanguage } from '../i18n/LanguageContext';

interface InterviewPracticeViewProps {
  initialItems?: InterviewItem[];
  initialLanguage?: SupportedLanguage;
  onSaveToLibrary: (project: Omit<SavedProject, 'id' | 'createdAt'>) => void;
}

export const InterviewPracticeView: React.FC<InterviewPracticeViewProps> = ({
  initialItems,
  initialLanguage = 'en-US',
  onSaveToLibrary,
}) => {
  const { t, locale } = useLanguage();
  const [items, setItems] = useState<InterviewItem[]>(
    initialItems && initialItems.length > 0 ? initialItems : INITIAL_INTERVIEW_ITEMS
  );

  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('full');
  const [interviewerVoice, setInterviewerVoice] = useState<string>('Kore');
  const [candidateVoice, setCandidateVoice] = useState<string>('Fenrir');
  const [pauseSeconds, setPauseSeconds] = useState<number>(10);
  const [repeatCount, setRepeatCount] = useState<number>(1);

  // Playback & simulation state
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [activePart, setActivePart] = useState<'question' | 'pause' | 'answer' | 'idle'>('idle');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [countdownRemaining, setCountdownRemaining] = useState<number>(0);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  // Loading & Generation state
  const [isGeneratingAll, setIsGeneratingAll] = useState<boolean>(false);
  const [generatingItemId, setGeneratingItemId] = useState<string | null>(null);
  const [combinedAudioUrl, setCombinedAudioUrl] = useState<string | null>(null);
  const [totalCombinedDuration, setTotalCombinedDuration] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Internal audio player ref for simulator
  const playerRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<any>(null);

  const availableVoices = AVAILABLE_VOICES.filter((v) => v.language === language);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Update voices when language changes
  useEffect(() => {
    const voices = AVAILABLE_VOICES.filter((v) => v.language === language);
    if (voices.length > 0) {
      setInterviewerVoice(voices[0].id);
      setCandidateVoice(voices[1]?.id || voices[0].id);
    }
  }, [language]);

  // Mode descriptors
  const modeOptions = [
    {
      id: 'full' as PracticeMode,
      name: `1. ${t.practice.modes.full.title}`,
      desc: t.practice.modes.full.desc,
      badge: t.practice.modes.full.badge,
    },
    {
      id: 'question_only' as PracticeMode,
      name: `2. ${t.practice.modes.question_only.title}`,
      desc: t.practice.modes.question_only.desc,
      badge: t.practice.modes.question_only.badge,
    },
    {
      id: 'answer_only' as PracticeMode,
      name: `3. ${t.practice.modes.answer_only.title}`,
      desc: t.practice.modes.answer_only.desc,
      badge: t.practice.modes.answer_only.badge,
    },
    {
      id: 'qa' as PracticeMode,
      name: `4. ${t.practice.modes.qa.title}`,
      desc: t.practice.modes.qa.desc,
      badge: t.practice.modes.qa.badge,
    },
    {
      id: 'listening' as PracticeMode,
      name: `5. ${t.practice.modes.listening.title}`,
      desc: t.practice.modes.listening.desc,
      badge: t.practice.modes.listening.badge,
    },
    {
      id: 'repeat' as PracticeMode,
      name: `6. ${t.practice.modes.repeat.title}`,
      desc: t.practice.modes.repeat.desc,
      badge: t.practice.modes.repeat.badge,
    },
    {
      id: 'custom' as PracticeMode,
      name: `7. ${t.practice.modes.custom.title}`,
      desc: t.practice.modes.custom.desc,
      badge: t.practice.modes.custom.badge,
    },
  ];

  // Helper to play an MP3 base64 or URL
  const playAudioSource = (sourceUrl: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!playerRef.current) {
        resolve();
        return;
      }
      playerRef.current.src = sourceUrl;
      playerRef.current.onended = () => resolve();
      playerRef.current.onerror = () => resolve();
      playerRef.current.play().catch(() => resolve());
    });
  };

  // Generate single audio snippet for question or answer
  const generateSnippetAudio = async (text: string, voice: string, isQuestion: boolean) => {
    const res = await fetch('/api/tts/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voice,
        language,
        style: isQuestion
          ? 'Clear, professional interviewer asking an interview question'
          : 'Confident, articulate job candidate answering during an interview',
      }),
    });
    if (!res.ok) throw new Error('Falha ao gerar trecho');
    const data = await res.json();
    const bytes = Uint8Array.from(atob(data.mp3Base64), (c) => c.charCodeAt(0));
    return URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' }));
  };

  // Play specific question
  const handlePlayQuestion = async (item: InterviewItem, idx: number) => {
    try {
      setActiveItemIndex(idx);
      setActivePart('question');
      let url = item.questionAudioUrl;
      if (!url) {
        setGeneratingItemId(item.id);
        url = await generateSnippetAudio(item.question, interviewerVoice, true);
        const updated = [...items];
        updated[idx].questionAudioUrl = url;
        setItems(updated);
        setGeneratingItemId(null);
      }
      await playAudioSource(url);
      setActivePart('idle');
    } catch (e: any) {
      showToast('Erro ao tocar pergunta');
      setActivePart('idle');
      setGeneratingItemId(null);
    }
  };

  // Play specific answer
  const handlePlayAnswer = async (item: InterviewItem, idx: number) => {
    try {
      setActiveItemIndex(idx);
      setActivePart('answer');
      let url = item.answerAudioUrl;
      if (!url) {
        setGeneratingItemId(item.id);
        url = await generateSnippetAudio(item.answer, candidateVoice, false);
        const updated = [...items];
        updated[idx].answerAudioUrl = url;
        setItems(updated);
        setGeneratingItemId(null);
      }
      await playAudioSource(url);
      setActivePart('idle');
    } catch (e: any) {
      showToast('Erro ao tocar resposta');
      setActivePart('idle');
      setGeneratingItemId(null);
    }
  };

  // Start active simulation runner across items
  const startSimulation = async () => {
    setIsSimulating(true);
    const activeItems = practiceMode === 'custom' ? items.filter((it) => it.isSelected) : items;

    if (activeItems.length === 0) {
      showToast('Selecione pelo menos uma pergunta para praticar.');
      setIsSimulating(false);
      return;
    }

    for (let i = 0; i < activeItems.length; i++) {
      const item = activeItems[i];
      const realIdx = items.findIndex((it) => it.id === item.id);
      setActiveItemIndex(realIdx >= 0 ? realIdx : i);

      // Part 1: Question
      if (practiceMode !== 'answer_only') {
        setActivePart('question');
        let qUrl = item.questionAudioUrl;
        if (!qUrl) {
          qUrl = await generateSnippetAudio(item.question, interviewerVoice, true);
          item.questionAudioUrl = qUrl;
        }
        await playAudioSource(qUrl);
      }

      // Part 2: Speaking Countdown Pause
      if (practiceMode === 'question_only' || practiceMode === 'full') {
        const pauseTime = practiceMode === 'question_only' ? pauseSeconds : 3;
        setActivePart('pause');
        setCountdownRemaining(pauseTime);

        await new Promise<void>((resolve) => {
          let count = pauseTime;
          timerIntervalRef.current = setInterval(() => {
            count -= 1;
            setCountdownRemaining(count);
            if (count <= 0) {
              clearInterval(timerIntervalRef.current);
              resolve();
            }
          }, 1000);
        });
      }

      // Part 3: Answer
      if (practiceMode !== 'question_only') {
        setActivePart('answer');
        let aUrl = item.answerAudioUrl;
        if (!aUrl) {
          aUrl = await generateSnippetAudio(item.answer, candidateVoice, false);
          item.answerAudioUrl = aUrl;
        }

        // Handle repeat mode
        const loops = practiceMode === 'repeat' ? repeatCount : 1;
        for (let r = 0; r < loops; r++) {
          await playAudioSource(aUrl);
          if (r < loops - 1) {
            await new Promise((res) => setTimeout(res, 1200));
          }
        }
      }

      // Inter-item pause
      await new Promise((res) => setTimeout(res, 1500));
    }

    setIsSimulating(false);
    setActivePart('idle');
    showToast(t.practice.toastFinished);
  };

  const stopSimulation = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.currentTime = 0;
    }
    setIsSimulating(false);
    setActivePart('idle');
    setCountdownRemaining(0);
  };

  // Generate complete combined interview MP3 file for download
  const handleGenerateFullInterview = async () => {
    try {
      setIsGeneratingAll(true);
      const activeItems = practiceMode === 'custom' ? items.filter((it) => it.isSelected) : items;

      const res = await fetch('/api/tts/generate-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: activeItems,
          interviewerVoice,
          candidateVoice,
          language,
          pauseSeconds: practiceMode === 'question_only' ? pauseSeconds : 4,
          mode: practiceMode === 'question_only' ? 'question_only' : practiceMode === 'answer_only' ? 'answer_only' : 'full',
          bitrate: 128,
        }),
      });

      if (!res.ok) throw new Error('Falha ao compilar entrevista');
      const data = await res.json();

      const bytes = Uint8Array.from(atob(data.combinedMp3Base64), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      setCombinedAudioUrl(url);
      setTotalCombinedDuration(data.totalDurationSec || 0);

      // Trigger instant download
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename || 'full_interview.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast(`📥 Arquivo completo ${data.filename} gerado e baixado!`);
    } catch (e: any) {
      console.error(e);
      showToast('Erro ao gerar entrevista completa');
    } finally {
      setIsGeneratingAll(false);
    }
  };

  // Download individual snippet
  const downloadSnippet = async (text: string, voice: string, isQuestion: boolean, qNum: number) => {
    const safeText = text.trim();
    const url = await generateSnippetAudio(safeText, voice, isQuestion);
    const filename = isQuestion
      ? `interview_question_${String(qNum).padStart(2, '0')}.mp3`
      : `interview_answer_${String(qNum).padStart(2, '0')}.mp3`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`📥 Baixado: ${filename}`);
  };

  // Add / Remove / Edit Script Cards
  const handleAddItem = () => {
    const nextNum = items.length + 1;
    setItems([
      ...items,
      {
        id: `item-${Date.now()}-${nextNum}`,
        questionNumber: nextNum,
        question: 'Pergunta do entrevistador aqui...',
        answer: 'Sua resposta estruturada aqui...',
        category: 'Technical',
        isSelected: true,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      showToast('Mantenha pelo menos uma pergunta.');
      return;
    }
    setItems(items.filter((it) => it.id !== id).map((it, idx) => ({ ...it, questionNumber: idx + 1 })));
  };

  const handleUpdateItem = (id: string, field: 'question' | 'answer' | 'pronunciationNotes', value: string) => {
    setItems(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const handleToggleSelect = (id: string) => {
    setItems(items.map((it) => (it.id === id ? { ...it, isSelected: !it.isSelected } : it)));
  };

  const toggleRevealAnswer = (id: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLoadMultilingualPreset = (presetKey: string) => {
    const preset = MULTILINGUAL_INTERVIEW_SCRIPTS[presetKey];
    if (!preset) return;
    setItems(preset.items);
    setLanguage(preset.language);
    const matchingVoices = AVAILABLE_VOICES.filter((v) => v.language === preset.language);
    if (matchingVoices.length > 0) {
      setInterviewerVoice(matchingVoices[0].id);
      setCandidateVoice(matchingVoices[1]?.id || matchingVoices[0].id);
    }
    showToast(`Carregado: ${preset.title}`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-16">
      {/* Hidden audio player for simulation runner */}
      <audio ref={playerRef} preload="auto" />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-500">
          <div className="px-4 py-3 rounded-xl bg-emerald-900/90 text-emerald-100 border border-emerald-500/50 shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-teal-400" />
            <span>{t.practice.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.practice.subtitle}
          </p>
        </div>

        {/* Global Action: Download Full Interview */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isGeneratingAll || isSimulating}
            onClick={handleGenerateFullInterview}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-50"
          >
            {isGeneratingAll ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t.practice.compilingBtn}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t.practice.downloadFullBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 7 Practice Modes Selector Bar */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-3 backdrop-blur-md shadow-xl flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
          {t.practice.selectModeLabel}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-1.5">
          {modeOptions.map((m) => {
            const isSelected = practiceMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setPracticeMode(m.id)}
                className={`p-2.5 rounded-xl text-left border flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div>
                  <span
                    className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded inline-block mb-1 ${
                      isSelected
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {m.badge}
                  </span>
                  <p className="text-xs font-bold leading-tight line-clamp-1">{m.name.split('. ')[1]}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected mode description */}
        <div className="text-xs text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <span>{modeOptions.find((m) => m.id === practiceMode)?.desc}</span>
          <span className="text-emerald-400 font-mono text-[11px] font-semibold">
            {practiceMode === 'question_only' && `Pausa: ${pauseSeconds}s`}
            {practiceMode === 'repeat' && `Repetições: ${repeatCount}x`}
          </span>
        </div>
      </div>

      {/* Simulator Control Console & Live Status */}
      <div className="bg-linear-to-r from-slate-900 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={isSimulating ? stopSimulation : startSimulation}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 ${
                isSimulating
                  ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/25'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>{t.practice.pauseSimBtn}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{t.practice.startSimBtn} ({practiceMode})</span>
                </>
              )}
            </button>

            {isSimulating && (
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {t.practice.questionBadge} {activeItemIndex + 1} de {items.length} {t.practice.simRunningText}
              </span>
            )}
          </div>

          {/* Configuration Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Language */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-950">
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Recruiter Voice */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span className="text-[10px] uppercase font-bold text-teal-400">{t.practice.recruiterLabel}</span>
              <select
                value={interviewerVoice}
                onChange={(e) => setInterviewerVoice(e.target.value)}
                className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
              >
                {availableVoices.map((v) => (
                  <option key={v.id} value={v.id} className="bg-slate-950">
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Candidate Voice */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span className="text-[10px] uppercase font-bold text-emerald-400">{t.practice.candidateLabel}</span>
              <select
                value={candidateVoice}
                onChange={(e) => setCandidateVoice(e.target.value)}
                className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
              >
                {availableVoices.map((v) => (
                  <option key={v.id} value={v.id} className="bg-slate-950">
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Speaking Pause Selector */}
            {practiceMode === 'question_only' && (
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.practice.pauseLabel}</span>
                <select
                  value={pauseSeconds}
                  onChange={(e) => setPauseSeconds(Number(e.target.value))}
                  className="bg-transparent text-amber-300 font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option value={5} className="bg-slate-950">5s</option>
                  <option value={10} className="bg-slate-950">10s</option>
                  <option value={15} className="bg-slate-950">15s</option>
                  <option value={20} className="bg-slate-950">20s</option>
                  <option value={30} className="bg-slate-950">30s</option>
                </select>
              </div>
            )}

            {/* Repeat count */}
            {practiceMode === 'repeat' && (
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                <Repeat className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t.practice.repeatLabel}</span>
                <select
                  value={repeatCount}
                  onChange={(e) => setRepeatCount(Number(e.target.value))}
                  className="bg-transparent text-indigo-300 font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option value={1} className="bg-slate-950">1x</option>
                  <option value={2} className="bg-slate-950">2x</option>
                  <option value={3} className="bg-slate-950">3x</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Live Speaking Countdown Bar (When in Question Only mode or active pause) */}
        {activePart === 'pause' && countdownRemaining > 0 && (
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex flex-col gap-2 animate-pulse">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-amber-400" />
                {t.practice.speakNowAlert}
              </span>
              <span className="text-base font-mono font-extrabold text-amber-400">
                {countdownRemaining}s
              </span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-amber-500/20">
              <div
                style={{
                  width: `${(countdownRemaining / pauseSeconds) * 100}%`,
                }}
                className="bg-linear-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-1000"
              />
            </div>
          </div>
        )}
      </div>

      {/* Script Editor Cards (Interactive Questions & Answers) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">
              {t.practice.scriptTitle} ({items.length})
            </h3>
            <span className="text-xs text-slate-400">
              {t.practice.scriptSubtitle}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.practice.addQuestionBtn}</span>
          </button>
        </div>

        {/* Multilingual Template Quick Load Bar */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
          <span className="font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
            <Languages className="w-3.5 h-3.5 text-emerald-400" />
            <span>Roteiro por Idioma:</span>
          </span>
          <button
            type="button"
            onClick={() => handleLoadMultilingualPreset('pt-BR')}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              language === 'pt-BR'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            🇧🇷 Brasil
          </button>
          <button
            type="button"
            onClick={() => handleLoadMultilingualPreset('pt-PT')}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              language === 'pt-PT'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            🇵🇹 Portugal
          </button>
          <button
            type="button"
            onClick={() => handleLoadMultilingualPreset('en-US')}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              language === 'en-US'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            🇺🇸 US English
          </button>
          <button
            type="button"
            onClick={() => handleLoadMultilingualPreset('en-GB')}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              language === 'en-GB'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            🇬🇧 UK English
          </button>
          <button
            type="button"
            onClick={() => handleLoadMultilingualPreset('fr')}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              language === 'fr'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            🇫🇷 Français
          </button>
          <button
            type="button"
            onClick={() => handleLoadMultilingualPreset('es')}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              language === 'es'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            🇪🇸 Español
          </button>
          <button
            type="button"
            onClick={() => handleLoadMultilingualPreset('de')}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              language === 'de'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            🇩🇪 Deutsch
          </button>
        </div>

        {/* List of cards */}
        <div className="flex flex-col gap-4">
          {items.map((item, idx) => {
            const isActiveInSimulation = isSimulating && activeItemIndex === idx;
            const isAnswerHidden = practiceMode === 'listening' && !revealedAnswers[item.id];

            return (
              <div
                key={item.id}
                className={`relative p-5 sm:p-6 rounded-2xl border transition-all ${
                  isActiveInSimulation
                    ? 'bg-slate-850 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    {practiceMode === 'custom' && (
                      <input
                        type="checkbox"
                        checked={item.isSelected ?? true}
                        onChange={() => handleToggleSelect(item.id)}
                        className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                        title="Incluir no simulador customizado"
                      />
                    )}

                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                      {t.practice.questionBadge} {String(item.questionNumber).padStart(2, '0')}
                    </span>

                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 font-medium border border-slate-700/50">
                      {item.category || 'Geral'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Delete Question */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all"
                      title="Excluir pergunta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question Section */}
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5" />
                      <span>{t.practice.interviewerQuestionLabel} ({interviewerVoice}):</span>
                    </label>

                    {/* Question audio triggers */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handlePlayQuestion(item, idx)}
                        disabled={generatingItemId === item.id}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500 text-teal-300 hover:text-slate-950 text-xs font-semibold transition-all"
                        title="Ouvir"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{t.practice.listenBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadSnippet(item.question, interviewerVoice, true, item.questionNumber)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                        title="Baixar MP3 da pergunta"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={item.question}
                    onChange={(e) => handleUpdateItem(item.id, 'question', e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-teal-500 font-sans leading-relaxed"
                  />
                </div>

                {/* Answer Section */}
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>{t.practice.candidateAnswerLabel} ({candidateVoice}):</span>
                    </label>

                    {/* Answer audio triggers */}
                    <div className="flex items-center gap-1.5">
                      {practiceMode === 'listening' && (
                        <button
                          type="button"
                          onClick={() => toggleRevealAnswer(item.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                        >
                          {isAnswerHidden ? (
                            <>
                              <Eye className="w-3 h-3 text-indigo-400" />
                              <span>{t.practice.revealBtn}</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-slate-400" />
                              <span>{t.practice.hideBtn}</span>
                            </>
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handlePlayAnswer(item, idx)}
                        disabled={generatingItemId === item.id}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-semibold transition-all"
                        title="Ouvir resposta modelo"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{t.practice.listenBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadSnippet(item.answer, candidateVoice, false, item.questionNumber)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                        title="Baixar MP3 da resposta"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isAnswerHidden ? (
                    <div
                      onClick={() => toggleRevealAnswer(item.id)}
                      className="p-6 rounded-xl bg-slate-950/60 border border-dashed border-slate-800 text-slate-500 text-center cursor-pointer hover:border-slate-700 hover:text-slate-400 transition-all flex flex-col items-center justify-center gap-1"
                    >
                      <Eye className="w-5 h-5 text-indigo-400" />
                      <span className="text-xs font-semibold">{t.practice.listeningHiddenTitle}</span>
                      <span className="text-[11px]">{t.practice.listeningHiddenSub}</span>
                    </div>
                  ) : (
                    <textarea
                      rows={3}
                      value={item.answer}
                      onChange={(e) => handleUpdateItem(item.id, 'answer', e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
                    />
                  )}
                </div>

                {/* Pronunciation & Strategy Notes */}
                {item.pronunciationNotes && !isAnswerHidden && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-400 leading-relaxed flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300 font-semibold mr-1">{t.practice.pronunciationTipLabel}</strong>
                      {item.pronunciationNotes}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
