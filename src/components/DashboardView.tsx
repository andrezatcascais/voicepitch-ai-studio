import React from 'react';
import {
  Mic,
  GraduationCap,
  Sparkles,
  Download,
  Play,
  Clock,
  Globe2,
  FileAudio,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  ChevronRight,
  Library,
} from 'lucide-react';
import { NavTab } from './Navbar';
import { InterviewItem, SavedProject, SupportedLanguage } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onLoadTemplate: (items: InterviewItem[], title: string, lang: SupportedLanguage) => void;
  savedProjects: SavedProject[];
  onPlaySaved: (project: SavedProject) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onLoadTemplate,
  savedProjects,
  onPlaySaved,
}) => {
  const { t, locale } = useLanguage();

  const templates = [
    {
      id: 'template-java-pt-br',
      title: 'Senior Java & Spring Boot (Brasil 🇧🇷)',
      subtitle: 'Pitch de 10 anos + Microsserviços e Resolução de Incidentes em Português do Brasil',
      category: 'Backend / Tech Lead',
      badge: 'Português (BR)',
      language: 'pt-BR' as SupportedLanguage,
      questionCount: 3,
      items: [
        {
          id: 'java-br-1',
          questionNumber: 1,
          question: 'Por que nós devemos contratar você para esta posição de engenharia de software?',
          answer:
            'Você deve me contratar porque tenho quase 10 anos de experiência em desenvolvimento de software, atuando principalmente com Java, Spring Boot e sistemas backend. Sou focado em resolver problemas, aprendo rápido e gosto de construir soluções confiáveis e escaláveis. Também me sinto muito à vontade trabalhando com diferentes equipes, compartilhando conhecimento e aprendendo novas tecnologias.',
          category: 'Background' as const,
          pronunciationNotes: 'Destaque: "quase 10 anos de experiência", "Java, Spring Boot", "confiáveis e escaláveis".',
          isSelected: true,
        },
        {
          id: 'java-br-2',
          questionNumber: 2,
          question: 'Como você garante alta disponibilidade e resiliência nos microsserviços em produção?',
          answer:
            'Eu aplico padrões nativos de nuvem como circuit breakers, escalabilidade horizontal e mensageria assíncrona com Kafka ou RabbitMQ. Projeto serviços Spring Boot sem estado apoiados por réplicas de leitura no banco de dados, cache distribuído com Redis e observabilidade completa com métricas e logs estruturados.',
          category: 'Technical' as const,
          pronunciationNotes: 'Mantenha ritmo natural nas siglas técnicas (Kafka, Redis, Spring Boot).',
          isSelected: true,
        },
        {
          id: 'java-br-3',
          questionNumber: 3,
          question: 'Conte sobre uma ocasião em que você resolveu um incidente crítico de produção sob pressão.',
          answer:
            'Durante um pico de tráfego, nossa API de autorização sofreu esgotamento de threads por bloqueios lentos no banco. Liderei a triagem técnica, identifiquei a consulta não indexada que travava a tabela, implementei um contorno temporário de leitura e apliquei o índice de migração em vinte minutos, restaurando 99,9% de disponibilidade sem perda de dados.',
          category: 'Behavioral' as const,
          pronunciationNotes: 'Estrutura STAR: Situação, Tarefa, Ação e Resultado mensurável.',
          isSelected: true,
        },
      ],
    },
    {
      id: 'template-pt-pt',
      title: 'Engenheiro de Software Sénior (Portugal 🇵🇹)',
      subtitle: 'Entrevista de emprego corporativa para empresas em Lisboa, Porto e União Europeia',
      category: 'Português Europeu',
      badge: 'Português (PT)',
      language: 'pt-PT' as SupportedLanguage,
      questionCount: 3,
      items: [
        {
          id: 'pt-1',
          questionNumber: 1,
          question: 'Porque é que a nossa empresa deve contratá-lo para esta posição de engenharia?',
          answer:
            'Devem contratar-me porque conto com cerca de 10 anos de experiência em engenharia de software, desenvolvendo sistemas de backend robustos em Java e Spring Boot. Tenho facilidade em resolver problemas complexos e gosto de construir arquiteturas fiáveis e escaláveis. Trabalho com muita naturalidade em equipas multidisciplinares e mantenho-me em constante aprendizagem.',
          category: 'Background' as const,
          pronunciationNotes: 'Pronúncia europeia: ritmo firme e vogais reduzidas ("arquiteturas fiáveis", "equipas multidisciplinares").',
          isSelected: true,
        },
        {
          id: 'pt-2',
          questionNumber: 2,
          question: 'Como aborda a resolução de incidentes críticos em ambientes de produção?',
          answer:
            'Priorizo a triagem rápida com base em telemetria e registos estruturados. Isolei o impacto com desvios seguros ou reversão de versão, comunico o estado aos intervenientes e realizo uma análise pós-incidente rigorosa para evitar recorrências.',
          category: 'Technical' as const,
          pronunciationNotes: 'Destaque termos: "telemetria", "análise pós-incidente rigorosa".',
          isSelected: true,
        },
      ],
    },
    {
      id: 'template-java-en-us',
      title: 'Senior Java & Spring Boot (US English 🇺🇸)',
      subtitle: '10-Year Backend Pitch & Microservice Architecture for US & Global Hiring',
      category: 'American English (US)',
      badge: 'English (US)',
      language: 'en-US' as SupportedLanguage,
      questionCount: 3,
      items: [
        {
          id: 'java-us-1',
          questionNumber: 1,
          question: 'Why should we hire you for this software engineering position?',
          answer:
            'You should hire me because I have almost 10 years of experience in software development, mainly working with Java, Spring Boot, and backend systems. I am a problem-solver, a quick learner, and someone who enjoys building reliable and scalable solutions. I am also comfortable working with different teams, sharing knowledge, and learning new technologies.',
          category: 'Background' as const,
          pronunciationNotes: 'Emphasize: "almost 10 years", "Java, Spring Boot", "reliable and scalable".',
          isSelected: true,
        },
        {
          id: 'java-us-2',
          questionNumber: 2,
          question: 'How do you design high-throughput backend services?',
          answer:
            'I design stateless REST and gRPC microservices using Spring Boot, deploy them on Kubernetes, and decouple heavy operations via Apache Kafka. I implement database read-replicas, distributed caching with Redis, and enforce zero-downtime blue/green deployments.',
          category: 'Technical' as const,
          pronunciationNotes: 'Clear cadence on tools (Kubernetes, Kafka, Redis).',
          isSelected: true,
        },
      ],
    },
    {
      id: 'template-uk',
      title: 'British Corporate & Tech Interview (UK 🇬🇧)',
      subtitle: 'Corporate interview questions with distinct British RP pronunciation for UK roles',
      category: 'British English (UK)',
      badge: 'English (UK)',
      language: 'en-GB' as SupportedLanguage,
      questionCount: 2,
      items: [
        {
          id: 'uk-1',
          questionNumber: 1,
          question: 'Could you please walk me through your engineering career to date?',
          answer:
            'Certainly. Over the past decade, I have focused extensively on building resilient distributed systems. I have led backend squads, refined architectural standards, and delivered high-impact products across international banking and SaaS platforms.',
          category: 'Background' as const,
          pronunciationNotes: 'Adopt British RP intonation: crisp consonants and polite cadence ("Certainly", "extensively").',
          isSelected: true,
        },
        {
          id: 'uk-2',
          questionNumber: 2,
          question: 'How do you foster effective collaboration within cross-functional squads?',
          answer:
            'I believe in transparent communication, thorough architectural RFCs, and collaborative code reviews. By aligning closely with product managers and QA engineers early in the sprint, we minimize technical debt.',
          category: 'Leadership' as const,
          pronunciationNotes: 'Crisp British articulation on "cross-functional squads".',
          isSelected: true,
        },
      ],
    },
    {
      id: 'template-fr',
      title: 'Entretien Développeur Senior (Français 🇫🇷)',
      subtitle: 'Entretien technique et comportemental pour la France, Belgique et Suisse',
      category: 'Français (FR)',
      badge: 'Français',
      language: 'fr' as SupportedLanguage,
      questionCount: 2,
      items: [
        {
          id: 'fr-1',
          questionNumber: 1,
          question: 'Pourquoi devrions-nous vous embaucher pour ce poste de développeur senior ?',
          answer:
            'Vous devriez m’embaucher car j’ai près de dix ans d’expérience en développement logiciel, principalement avec Java, Spring Boot et les systèmes backend. J’aime résoudre des problèmes complexes et concevoir des architectures fiables et évolutives.',
          category: 'Background' as const,
          pronunciationNotes: 'Articulez clairement : "dix ans d’expérience", "systèmes backend", "fiables et évolutives".',
          isSelected: true,
        },
      ],
    },
    {
      id: 'template-es',
      title: 'Entrevista Desarrollador Senior (Español 🇪🇸)',
      subtitle: 'Preguntas y respuestas técnicas para empresas en España y Latinoamérica',
      category: 'Español (ES)',
      badge: 'Español',
      language: 'es' as SupportedLanguage,
      questionCount: 3,
      items: [
        {
          id: 'es-1',
          questionNumber: 1,
          question: '¿Por qué deberíamos contratarte para este puesto de ingeniería de software?',
          answer:
            'Deberían contratarme porque cuento con casi diez años de experiencia en desarrollo de software, trabajando con Java, Spring Boot y arquitecturas backend. Me destaco por resolver problemas técnicos complejos y construir soluciones escalables y seguras. Trabajo con mucha naturalidad en equipos multidisciplinares y disfruto aprendiendo nuevas tecnologías.',
          category: 'Background' as const,
          pronunciationNotes: 'Énfasis en: "diez años de experiencia", "Spring Boot", "soluciones escalables".',
          isSelected: true,
        },
        {
          id: 'es-2',
          questionNumber: 2,
          question: '¿Cómo garantizas la alta disponibilidad y resiliencia en tus microservicios?',
          answer:
            'Aplico patrones nativos de la nube como disyuntores (circuit breakers), autoescalado horizontal y mensajería asíncrona con Kafka o RabbitMQ. Diseño servicios Spring Boot sin estado con réplicas de lectura en base de datos, caché distribuida con Redis y monitorización continua con Prometheus.',
          category: 'Technical' as const,
          pronunciationNotes: 'Cadencia profesional y articulación precisa en vocabulario técnico.',
          isSelected: true,
        },
      ],
    },
    {
      id: 'template-de',
      title: 'Senior Software Engineer (Deutsch 🇩🇪)',
      subtitle: 'Technisches und verhaltensorientiertes Interview für Deutschland, Österreich und Schweiz',
      category: 'Deutsch (DE)',
      badge: 'Deutsch',
      language: 'de' as SupportedLanguage,
      questionCount: 3,
      items: [
        {
          id: 'de-1',
          questionNumber: 1,
          question: 'Warum sollten wir Sie für diese Position als Senior Software Engineer einstellen?',
          answer:
            'Sie sollten mich einstellen, weil ich über fast 10 Jahre Erfahrung in der Softwareentwicklung verfüge, vor allem mit Java, Spring Boot und skalierbaren Backend-Systemen. Ich bin lösungsorientiert, lerne schnell und baue mit Leidenschaft verlässliche Architekturen. Zudem arbeite ich sehr gerne in agilen Teams, teile mein Wissen aktiv und trage zur kontinuierlichen Verbesserung bei.',
          category: 'Background' as const,
          pronunciationNotes: 'Hochdeutsche Aussprache: betonen Sie "10 Jahre Erfahrung", "Java, Spring Boot" und "verlässliche Architekturen".',
          isSelected: true,
        },
        {
          id: 'de-2',
          questionNumber: 2,
          question: 'Wie stellen Sie Hochverfügbarkeit und Resilienz in verteilten Microservices sicher?',
          answer:
            'Ich setze auf Cloud-Native-Muster wie Circuit Breaker mit Resilience4j, horizontale Autoskalierung und asynchrones Messaging mit Apache Kafka. Durch zustandslose Spring Boot Services, verteiltes Caching mit Redis und lückenloses Monitoring mit OpenTelemetry und Prometheus garantieren wir maximale Zuverlässigkeit.',
          category: 'Technical' as const,
          pronunciationNotes: 'Präzise Fachterminologie (Kafka, Resilience4j, Autoskalierung).',
          isSelected: true,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col gap-6 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {t.dashboard.badge}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/60">
              {t.dashboard.langSupport}
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t.dashboard.heroTitlePrefix}{' '}
              <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {t.dashboard.heroTitleHighlight}
              </span>{' '}
              {t.dashboard.heroTitleSuffix}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
              {t.dashboard.heroSubtitle}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('practice')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{t.dashboard.ctaSimulate}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('tts')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all active:scale-95"
            >
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>{t.dashboard.ctaTts}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Highlights Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
          <span className="text-xs text-slate-400 font-medium">{t.dashboard.statExportFormat}</span>
          <span className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-1.5">
            <FileAudio className="w-5 h-5 text-emerald-400" />
            MP3 & WAV
          </span>
          <span className="text-[11px] text-emerald-400">{t.dashboard.statExportSub}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
          <span className="text-xs text-slate-400 font-medium">{t.dashboard.statPracticeModes}</span>
          <span className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-1.5">
            <GraduationCap className="w-5 h-5 text-teal-400" />
            7 Modos
          </span>
          <span className="text-[11px] text-teal-400">{t.dashboard.statPracticeSub}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
          <span className="text-xs text-slate-400 font-medium">{t.dashboard.statAccents}</span>
          <span className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-1.5">
            <Globe2 className="w-5 h-5 text-indigo-400" />
            6 Idiomas
          </span>
          <span className="text-[11px] text-indigo-400">{t.dashboard.statAccentsSub}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
          <span className="text-xs text-slate-400 font-medium">{t.dashboard.statLibrary}</span>
          <span className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-1.5">
            <Library className="w-5 h-5 text-amber-400" />
            {savedProjects.length} Salvos
          </span>
          <span className="text-[11px] text-amber-400">{t.dashboard.statLibrarySub}</span>
        </div>
      </div>

      {/* Featured Ready-to-Practice Templates */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {t.dashboard.templatesTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {t.dashboard.templatesSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('practice')}
            className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>{t.dashboard.viewAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/90 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {tpl.badge}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {tpl.questionCount} Perguntas
                  </span>
                </div>

                <h4 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                  {tpl.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {tpl.subtitle}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {tpl.category}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    onLoadTemplate(tpl.items, tpl.title, tpl.language);
                    onNavigate('practice');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold text-xs border border-emerald-500/30 transition-all"
                >
                  <span>{t.dashboard.startTraining}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Informative Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex flex-col gap-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">{t.dashboard.value1Title}</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.dashboard.value1Desc}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex flex-col gap-2">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">{t.dashboard.value2Title}</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.dashboard.value2Desc}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex flex-col gap-2">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">{t.dashboard.value3Title}</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.dashboard.value3Desc}
          </p>
        </div>
      </div>
    </div>
  );
};
