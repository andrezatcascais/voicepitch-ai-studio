import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  RefreshCw,
  Sliders,
  Check,
  FileCode,
  Flame,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { PitchPreset } from '../types';

interface PitchStudioProps {
  currentText: string;
  onGenerateCustom: (text: string, voice: string, style: string) => Promise<void>;
  isLoading: boolean;
  selectedVoice: string;
}

export const PitchStudio: React.FC<PitchStudioProps> = ({
  currentText,
  onGenerateCustom,
  isLoading,
  selectedVoice,
}) => {
  const [text, setText] = useState(currentText);
  const [style, setStyle] = useState(
    'Confident, articulate, professional software engineer presenting during a job interview'
  );

  const presets: PitchPreset[] = [
    {
      id: 'original',
      title: 'Original (10 Anos Java & Spring)',
      description: 'O texto exato solicitado com foco em Java, Spring Boot e sistemas backend.',
      badge: 'Original',
      text: `You should hire me because I have almost 10 years of experience in software development, mainly working with Java, Spring Boot, and backend systems.

I'm a problem-solver, a quick learner, and someone who enjoys building reliable and scalable solutions. I'm also comfortable working with different teams, sharing knowledge, and learning new technologies.

I believe I can bring both technical experience and a strong willingness to contribute to your team and help deliver high-quality software.`,
      suggestedVoice: 'Fenrir',
    },
    {
      id: 'cloud_kafka',
      title: 'Java + Microsserviços & Cloud',
      description: 'Adiciona mensageria com Apache Kafka, Docker, Kubernetes e AWS.',
      badge: 'Cloud & Distributed',
      text: `You should hire me because I have nearly a decade of experience designing and building mission-critical backend systems with Java and Spring Boot.

I specialize in distributed microservices, event-driven architectures with Kafka, and scalable cloud deployments on AWS. I pride myself on writing clean, thoroughly tested code and mentoring engineers.

I'm eager to bring deep architectural rigor and a collaborative mindset to deliver resilient software for your business.`,
      suggestedVoice: 'Zephyr',
    },
    {
      id: 'quick_30s',
      title: 'Elevator Pitch Rápido (15s)',
      description: 'Versão super concisa para apresentações dinâmicas ou introdução rápida.',
      badge: 'Conciso (15s)',
      text: `Hi! With almost 10 years specializing in Java and Spring Boot backend engineering, I help engineering teams build robust, high-throughput systems. I love solving tough architectural challenges and delivering clean, maintainable software. I would love to bring that impact to your team.`,
      suggestedVoice: 'Puck',
    },
    {
      id: 'portugues',
      title: 'Versão em Português (PT-BR)',
      description: 'Tradução natural adaptada para processos seletivos no Brasil ou América Latina.',
      badge: 'Português',
      text: `Você deve me contratar porque tenho quase 10 anos de experiência em desenvolvimento de software, atuando fortemente com Java, Spring Boot e arquiteturas de backend.

Sou apaixonado por resolver problemas complexos e criar soluções robustas e escaláveis. Trabalho com muita facilidade em equipes multidisciplinares e adoro aprender novas tecnologias.

Estou pronto para somar experiência técnica e dedicação para entregar software de excelência para a sua empresa.`,
      suggestedVoice: 'Fenrir',
    },
  ];

  const styleOptions = [
    {
      id: 'confident',
      label: 'Confiante & Entrevista Senior',
      prompt: 'Confident, articulate, professional software engineer presenting during a job interview',
    },
    {
      id: 'friendly',
      label: 'Amigável & Colaborativo',
      prompt: 'Warm, enthusiastic, highly approachable senior developer sharing technical passion',
    },
    {
      id: 'architect',
      label: 'Arquiteto de Software Calmo',
      prompt: 'Calm, thoughtful, authoritative enterprise software architect speaking with precision',
    },
  ];

  const handleApplyPreset = (preset: PitchPreset) => {
    setText(preset.text);
  };

  const handleGenerate = async () => {
    if (!text.trim() || isLoading) return;
    await onGenerateCustom(text, selectedVoice, style);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estimatedSeconds = Math.round(wordCount / 2.3);

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6 backdrop-blur-md shadow-xl flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Personalizador de Texto & Gerador de Novos .MP3
            </h3>
            <p className="text-xs text-slate-400">
              Edite o texto ou escolha variações para gerar arquivos de áudio adicionais
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>{wordCount} palavras</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">~{estimatedSeconds}s de fala</span>
        </div>
      </div>

      {/* Preset Pills */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Carregar Variações Rápidas:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="p-3 text-left rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-semibold text-teal-300 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-800/40 inline-block mb-1">
                  {preset.badge}
                </span>
                <p className="text-xs font-bold text-slate-200 group-hover:text-white">
                  {preset.title}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {preset.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Texto do Pitch (Inglês ou Português):</span>
          <button
            type="button"
            onClick={() => setText(presets[0].text)}
            className="text-[11px] text-emerald-400 hover:underline font-normal"
          >
            Restaurar Original
          </button>
        </label>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite o texto que deseja transformar em voz .MP3..."
          className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans leading-relaxed resize-y"
        />
      </div>

      {/* Style selector and generate action */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Tom & Estilo de Entrega:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {styleOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setStyle(opt.prompt)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-all ${
                  style === opt.prompt
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          disabled={isLoading || !text.trim()}
          onClick={handleGenerate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Sintetizando Voz Neural com Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Gerar Novo Áudio .MP3 com {selectedVoice}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
