import React, { useState } from 'react';
import {
  Copy,
  Check,
  Languages,
  CheckCircle2,
  Code2,
  Terminal,
  Sparkles,
} from 'lucide-react';

interface ScriptCardProps {
  currentTime: number;
  duration: number;
  onJumpTo: (seconds: number) => void;
  customText?: string;
}

export const ScriptCard: React.FC<ScriptCardProps> = ({
  currentTime,
  duration,
  onJumpTo,
}) => {
  const [copiedEn, setCopiedEn] = useState(false);
  const [copiedPt, setCopiedPt] = useState(false);
  const [showPortuguese, setShowPortuguese] = useState(false);

  // Time milestones for 3 paragraphs in typical 28s delivery:
  // Par 1: 0 - 9.5s
  // Par 2: 9.5s - 19.5s
  // Par 3: 19.5s - end
  const total = duration > 0 ? duration : 28;
  const p1End = total * 0.34;
  const p2End = total * 0.70;

  const currentParagraph =
    currentTime < p1End ? 0 : currentTime < p2End ? 1 : 2;

  const paragraphs = [
    {
      id: 0,
      badge: '01 • Experiência & Stack Técnica',
      tag: 'Java & Spring Boot',
      timeStart: 0,
      english:
        'You should hire me because I have almost 10 years of experience in software development, mainly working with Java, Spring Boot, and backend systems.',
      portuguese:
        'Você deve me contratar porque tenho quase 10 anos de experiência em desenvolvimento de software, trabalhando principalmente com Java, Spring Boot e sistemas backend.',
      techBadges: ['Java', 'Spring Boot', 'Backend Architecture', '10 Years Exp'],
    },
    {
      id: 1,
      badge: '02 • Resolução de Problemas & Colaboração',
      tag: 'Soft Skills & Escalabilidade',
      timeStart: p1End,
      english:
        "I'm a problem-solver, a quick learner, and someone who enjoys building reliable and scalable solutions. I'm also comfortable working with different teams, sharing knowledge, and learning new technologies.",
      portuguese:
        'Sou alguém focado em resolver problemas, com aprendizado rápido e que gosta de criar soluções confiáveis e escaláveis. Também me sinto confortável trabalhando com times multidisciplinares, compartilhando conhecimento e aprendendo novas tecnologias.',
      techBadges: ['Problem Solving', 'Scalability', 'Team Collaboration', 'Continuous Learning'],
    },
    {
      id: 2,
      badge: '03 • Impacto & Valor Agregado',
      tag: 'Compromisso com Qualidade',
      timeStart: p2End,
      english:
        'I believe I can bring both technical experience and a strong willingness to contribute to your team and help deliver high-quality software.',
      portuguese:
        'Acredito que posso agregar tanto experiência técnica quanto uma forte disposição para contribuir com seu time e ajudar na entrega de software de alta qualidade.',
      techBadges: ['High-Quality Delivery', 'Engineering Leadership', 'Value Addition'],
    },
  ];

  const fullEnglishText = paragraphs.map((p) => p.english).join('\n\n');
  const fullPortugueseText = paragraphs.map((p) => p.portuguese).join('\n\n');

  const copyToClipboard = (text: string, isPt: boolean) => {
    navigator.clipboard.writeText(text);
    if (isPt) {
      setCopiedPt(true);
      setTimeout(() => setCopiedPt(false), 2000);
    } else {
      setCopiedEn(true);
      setTimeout(() => setCopiedEn(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6 backdrop-blur-md shadow-xl flex flex-col gap-6">
      {/* Header and language switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Roteiro de Apresentação (Pitch de Entrevista)
            </h3>
            <p className="text-xs text-slate-400">
              Clique em qualquer parágrafo para saltar a reprodução do áudio para o trecho
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Portuguese translation */}
          <button
            type="button"
            onClick={() => setShowPortuguese(!showPortuguese)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showPortuguese
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{showPortuguese ? 'Ocultar Tradução (PT)' : 'Ver Tradução (PT)'}</span>
          </button>

          {/* Copy button */}
          <button
            type="button"
            onClick={() => copyToClipboard(showPortuguese ? fullPortugueseText : fullEnglishText, showPortuguese)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all active:scale-95"
            title="Copiar texto completo"
          >
            {(showPortuguese ? copiedPt : copiedEn) ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Paragraphs with Teleprompter Highlight */}
      <div className="flex flex-col gap-4">
        {paragraphs.map((p, idx) => {
          const isActive = currentParagraph === idx;

          return (
            <div
              key={p.id}
              onClick={() => onJumpTo(p.timeStart)}
              className={`group relative p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-850/90 border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                  : 'bg-slate-950/40 border-slate-800/70 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              {/* Active Indicator Pillar */}
              <div
                className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-all ${
                  isActive ? 'bg-emerald-400 opacity-100' : 'bg-transparent opacity-0 group-hover:bg-slate-700 group-hover:opacity-100'
                }`}
              />

              {/* Tag and badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800/80 text-slate-400 border border-slate-700/40'
                  }`}
                >
                  {p.badge}
                </span>

                <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 group-hover:text-emerald-400 transition-colors">
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1" />}
                  Ouvir trecho →
                </span>
              </div>

              {/* English original */}
              <p
                className={`text-sm sm:text-base leading-relaxed font-sans transition-colors ${
                  isActive
                    ? 'text-white font-medium drop-shadow-sm'
                    : 'text-slate-300 group-hover:text-slate-100'
                }`}
              >
                "{p.english}"
              </p>

              {/* Portuguese translation if toggled */}
              {showPortuguese && (
                <div className="mt-3 pt-3 border-t border-slate-800/70 text-xs sm:text-sm text-indigo-200/90 leading-relaxed italic bg-indigo-950/20 p-2.5 rounded-lg border">
                  <span className="text-[10px] font-semibold text-indigo-400 not-italic uppercase tracking-wide mr-1.5 block mb-0.5">
                    Tradução em Português:
                  </span>
                  "{p.portuguese}"
                </div>
              )}

              {/* Microchips for technical skills */}
              <div className="mt-3 flex flex-wrap gap-1.5 pt-2">
                {p.techBadges.map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/70 text-slate-300 border border-slate-700/50 font-mono"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful Interview Delivery Tip */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200/90">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-emerald-300 font-semibold block mb-0.5">Dica de Ouro para Entrevistas Internacionais:</strong>
          Este roteiro foi estruturado na fórmula clássica de 30 segundos (Problema, Competência e Valor Agregado). Ele demonstra senioridade em Java/Spring sem parecer prolixo.
        </div>
      </div>
    </div>
  );
};
