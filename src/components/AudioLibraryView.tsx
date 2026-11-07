import React, { useState } from 'react';
import {
  Library,
  Play,
  Pause,
  Download,
  Trash2,
  Clock,
  Mic,
  GraduationCap,
  Sparkles,
  FileAudio,
  Languages,
  Plus,
} from 'lucide-react';
import { SavedProject } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface AudioLibraryViewProps {
  projects: SavedProject[];
  onPlayProject: (project: SavedProject) => void;
  onDeleteProject: (id: string) => void;
  onNavigateToTts: () => void;
}

export const AudioLibraryView: React.FC<AudioLibraryViewProps> = ({
  projects,
  onPlayProject,
  onDeleteProject,
  onNavigateToTts,
}) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'tts' | 'interview'>('all');

  const filtered = projects.filter((p) => {
    if (filter === 'tts') return p.type === 'tts';
    if (filter === 'interview') return p.type === 'interview';
    return true;
  });

  const downloadProject = (project: SavedProject) => {
    if (!project.audioUrl) return;
    const a = document.createElement('a');
    a.href = project.audioUrl;
    a.download = `${project.title.replace(/[^a-zA-Z0-9_\-]/g, '_')}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatDuration = (secs?: number) => {
    if (!secs) return '0:28';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Library className="w-6 h-6 text-amber-400" />
            <span>{t.library.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.library.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.library.all} ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('tts')}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${
              filter === 'tts'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.library.tts}
          </button>
          <button
            type="button"
            onClick={() => setFilter('interview')}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${
              filter === 'interview'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.library.interview}
          </button>
        </div>
      </div>

      {/* Projects List */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center flex flex-col items-center justify-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-800/60 text-slate-400">
            <Library className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">{t.library.emptyTitle}</h3>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            {t.library.emptyDesc}
          </p>
          <button
            type="button"
            onClick={onNavigateToTts}
            className="mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all active:scale-95 shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{t.library.createFirstBtn}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4 group shadow-lg"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center gap-1">
                    {proj.type === 'interview' ? (
                      <GraduationCap className="w-3 h-3 text-teal-400" />
                    ) : (
                      <Mic className="w-3 h-3 text-emerald-400" />
                    )}
                    {proj.type === 'interview' ? t.library.interview : t.library.tts}
                  </span>

                  <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(proj.duration)}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
                  {proj.title}
                </h4>

                <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                  <span>Voz: <strong>{proj.voice}</strong></span>
                  <span>•</span>
                  <span>{proj.language}</span>
                  <span>•</span>
                  <span className="text-slate-500 text-[11px]">{proj.createdAt}</span>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => onPlayProject(proj)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-bold transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{t.library.listen}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => downloadProject(proj)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                    title={t.library.downloadMp3}
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.library.downloadMp3}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteProject(proj.id)}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all"
                    title={t.library.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
