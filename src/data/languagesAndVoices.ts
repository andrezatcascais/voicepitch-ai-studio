import { LanguageOption, VoiceOption, InterviewItem, SupportedLanguage } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'pt-BR',
    name: 'Português (Brasil)',
    flag: '🇧🇷',
    accentLabel: 'Sotaque Brasileiro (Neutro / Corporativo)',
    speechCode: 'pt-BR',
  },
  {
    code: 'pt-PT',
    name: 'Português (Portugal)',
    flag: '🇵🇹',
    accentLabel: 'Português Europeu (Lisboa / Corporativo)',
    speechCode: 'pt-PT',
  },
  {
    code: 'en-US',
    name: 'English (US)',
    flag: '🇺🇸',
    accentLabel: 'American English (Neutral Corporate)',
    speechCode: 'en-US',
  },
  {
    code: 'en-GB',
    name: 'English (UK)',
    flag: '🇬🇧',
    accentLabel: 'British English (RP / London Corporate)',
    speechCode: 'en-GB',
  },
  {
    code: 'fr',
    name: 'Français (FR)',
    flag: '🇫🇷',
    accentLabel: 'Français (Standard Européen)',
    speechCode: 'fr-FR',
  },
  {
    code: 'es',
    name: 'Español (ES)',
    flag: '🇪🇸',
    accentLabel: 'Español (Neutro / Corporativo)',
    speechCode: 'es-ES',
  },
  {
    code: 'de',
    name: 'Deutsch (DE)',
    flag: '🇩🇪',
    accentLabel: 'Deutsch (Hochdeutsch / Standard)',
    speechCode: 'de-DE',
  },
  {
    code: 'it',
    name: 'Italiano (IT)',
    flag: '🇮🇹',
    accentLabel: 'Italiano (Standard Professionale)',
    speechCode: 'it-IT',
  },
];

export const AVAILABLE_VOICES: VoiceOption[] = [
  // Português (Brasil) 🇧🇷
  {
    id: 'Thiago-BR',
    name: 'Thiago (BR)',
    gender: 'male',
    language: 'pt-BR',
    accent: 'Português Brasileiro',
    tone: 'Confiante, Seguro & Natural',
    recommendedRole: 'both',
    recommendedFor: 'Ideal para desenvolvedores seniores e liderança técnica no Brasil.',
    description: 'Dicção clara e ritmo corporativo natural para entrevistas em empresas brasileiras.',
  },
  {
    id: 'Camila-BR',
    name: 'Camila (BR)',
    gender: 'female',
    language: 'pt-BR',
    accent: 'Português Brasileiro',
    tone: 'Articulada, Clara & Executiva',
    recommendedRole: 'both',
    recommendedFor: 'Excelente para recrutadoras e candidatas em posições técnicas e de produto.',
    description: 'Tom executivo límpido com entonação profissional para processos seletivos.',
  },
  {
    id: 'Gabriel-BR',
    name: 'Gabriel (BR)',
    gender: 'male',
    language: 'pt-BR',
    accent: 'Português Brasileiro',
    tone: 'Dinâmico, Jovial & Engajado',
    recommendedRole: 'candidate',
    recommendedFor: 'Startups, fintechs e apresentações ágeis de soluções.',
    description: 'Energia positiva e clareza para respostas de alto impacto.',
  },

  // Português (Portugal) 🇵🇹
  {
    id: 'Diogo-PT',
    name: 'Diogo (PT)',
    gender: 'male',
    language: 'pt-PT',
    accent: 'Português Europeu',
    tone: 'Distinto, Preciso & Formal',
    recommendedRole: 'both',
    recommendedFor: 'Entrevistas para empresas em Lisboa, Porto e União Europeia.',
    description: 'Português europeu padrão com ritmo ponderado e rigor vocabular.',
  },
  {
    id: 'Mariana-PT',
    name: 'Mariana (PT)',
    gender: 'female',
    language: 'pt-PT',
    accent: 'Português Europeu',
    tone: 'Refinada, Clara & Profissional',
    recommendedRole: 'both',
    recommendedFor: 'Direção técnica, recursos humanos e cargos sénior.',
    description: 'Entonação límpida de Portugal com excelente inteligibilidade.',
  },

  // US English 🇺🇸
  {
    id: 'Fenrir',
    name: 'Fenrir (US)',
    gender: 'male',
    language: 'en-US',
    accent: 'American English',
    tone: 'Confident, Authoritative & Grounded',
    recommendedRole: 'both',
    recommendedFor: 'Senior Engineers, Tech Leads, and Backend Architects.',
    description: 'Perfect for international technical screening calls in US/Canada.',
    pregeneratedFile: '/public/audio/pitch-java-developer-fenrir.mp3',
    pregeneratedWav: '/public/audio/pitch-java-developer-fenrir.wav',
  },
  {
    id: 'Kore',
    name: 'Kore (US)',
    gender: 'female',
    language: 'en-US',
    accent: 'American English',
    tone: 'Articulate, Clear & Executive',
    recommendedRole: 'both',
    recommendedFor: 'Polished delivery for hiring managers and candidate responses.',
    description: 'Crystal-clear American corporate pronunciation.',
    pregeneratedFile: '/public/audio/pitch-java-developer-kore.mp3',
    pregeneratedWav: '/public/audio/pitch-java-developer-kore.wav',
  },
  {
    id: 'Puck',
    name: 'Puck (US)',
    gender: 'male',
    language: 'en-US',
    accent: 'American English',
    tone: 'Energetic, Dynamic & Passionate',
    recommendedRole: 'candidate',
    recommendedFor: 'Startup pitches and rapid behavioral answers.',
    description: 'Engaging, modern delivery for innovative teams.',
  },
  {
    id: 'Zephyr',
    name: 'Zephyr (US)',
    gender: 'male',
    language: 'en-US',
    accent: 'American English',
    tone: 'Calm, Analytical & Precise',
    recommendedRole: 'interviewer',
    recommendedFor: 'Deep system design questions and technical audits.',
    description: 'Thoughtful pacing for complex algorithmic and architecture discussions.',
  },

  // UK English 🇬🇧
  {
    id: 'Arthur',
    name: 'Arthur (UK)',
    gender: 'male',
    language: 'en-GB',
    accent: 'British English (RP)',
    tone: 'Distinguished, Professional & Polite',
    recommendedRole: 'both',
    recommendedFor: 'UK, London financial district, and European tech hubs.',
    description: 'Natural British received pronunciation with classic corporate cadence.',
  },
  {
    id: 'Charlotte',
    name: 'Charlotte (UK)',
    gender: 'female',
    language: 'en-GB',
    accent: 'British English',
    tone: 'Clear, Refined & Engaging',
    recommendedRole: 'both',
    recommendedFor: 'Engineering managers and candidate fluency training.',
    description: 'Crisp British articulation for high-stakes interviews.',
  },

  // French 🇫🇷
  {
    id: 'Pierre',
    name: 'Pierre (FR)',
    gender: 'male',
    language: 'fr',
    accent: 'Français Métropolitain',
    tone: 'Professionnel, Chaleureux & Naturel',
    recommendedRole: 'both',
    recommendedFor: 'Entretiens pour la France, la Belgique, la Suisse et le Canada francophone.',
    description: 'Français standard européen avec diction nette.',
  },
  {
    id: 'Elodie',
    name: 'Élodie (FR)',
    gender: 'female',
    language: 'fr',
    accent: 'Français Standard',
    tone: 'Fluide, Élégante & Moderne',
    recommendedRole: 'both',
    recommendedFor: 'Postes techniques, gestion de produit et direction.',
    description: 'Parfaite intelligibilité et rythme fluide.',
  },

  // Spanish 🇪🇸
  {
    id: 'Mateo',
    name: 'Mateo (ES)',
    gender: 'male',
    language: 'es',
    accent: 'Español (Castellano / Neutro)',
    tone: 'Firme, Claro & Seguro',
    recommendedRole: 'both',
    recommendedFor: 'Procesos de selección en España e Hispanoamérica.',
    description: 'Español corporativo internacional con gran claridad.',
  },
  {
    id: 'Lucia',
    name: 'Lucía (ES)',
    gender: 'female',
    language: 'es',
    accent: 'Español Neutro',
    tone: 'Amable, Articulada & Dinámica',
    recommendedRole: 'both',
    recommendedFor: 'Entrevistas de desarrollo de software y producto.',
    description: 'Dicción clara y ritmo ágil para respuestas convincentes.',
  },

  // German 🇩🇪
  {
    id: 'Lukas',
    name: 'Lukas (DE)',
    gender: 'male',
    language: 'de',
    accent: 'Deutsch (Hochdeutsch)',
    tone: 'Strukturiert, Präzise & Professionell',
    recommendedRole: 'both',
    recommendedFor: 'Bewerbungsgespräche in Deutschland, Österreich und der Schweiz.',
    description: 'Präzise hochdeutsche Aussprache für das DACH-Technologieumfeld.',
  },
  {
    id: 'Hannah',
    name: 'Hannah (DE)',
    gender: 'female',
    language: 'de',
    accent: 'Deutsch (Standard)',
    tone: 'Klar, Methodisch & Ruhig',
    recommendedRole: 'both',
    recommendedFor: 'Führungspositionen, Senior Engineers und Projektleitung.',
    description: 'Neutrale deutsche Artikulation mit hoher Verständlichkeit.',
  },

  // Italian 🇮🇹
  {
    id: 'Marco',
    name: 'Marco (IT)',
    gender: 'male',
    language: 'it',
    accent: 'Italiano Standard',
    tone: 'Diretto, Espressivo & Sicuro',
    recommendedRole: 'both',
    recommendedFor: 'Aziende tecnologiche italiane e multinazionali.',
    description: 'Italiano standard professionale con eccellente dizione.',
  },
];

// Sample pitch texts per locale for instant testing
export const SAMPLE_PITCH_BY_LOCALE: Record<string, string> = {
  'pt-BR': `Você deve me contratar porque tenho quase 10 anos de experiência em desenvolvimento de software, atuando principalmente com Java, Spring Boot e sistemas backend.

Sou focado em resolver problemas, aprendo rápido e gosto de construir soluções confiáveis e escaláveis. Também me sinto muito à vontade trabalhando com diferentes equipes, compartilhando conhecimento e aprendendo novas tecnologias.

Acredito que posso agregar tanto experiência técnica quanto uma forte disposição para contribuir com o seu time e ajudar na entrega de software de alta qualidade.`,

  'pt-PT': `Devem contratar-me porque conto com cerca de 10 anos de experiência em engenharia de software, desenvolvendo sistemas de backend robustos em Java e Spring Boot.

Tenho facilidade em resolver problemas complexos e gosto de construir arquiteturas fiáveis e escaláveis. Trabalho com muita naturalidade em equipas multidisciplinares e mantenho-me em constante aprendizagem.

Acredito que posso trazer tanto maturidade técnica como uma forte vontade de contribuir para o vosso projeto e elevar a qualidade do software.`,

  'en-US': `You should hire me because I have almost 10 years of experience in software development, mainly working with Java, Spring Boot, and backend systems.

I'm a problem-solver, a quick learner, and someone who enjoys building reliable and scalable solutions. I'm also comfortable working with different teams, sharing knowledge, and learning new technologies.

I believe I can bring both technical experience and a strong willingness to contribute to your team and help deliver high-quality software.`,

  'en-GB': `You should hire me because I have almost 10 years of experience in software engineering, primarily working with Java, Spring Boot, and resilient backend systems.

I am an analytical problem-solver, adapt rapidly, and take genuine pride in engineering robust and scalable architectures. I collaborate seamlessly across multidisciplinary squads, communicate with clarity, and continuously embrace emerging technologies.

I am confident that I can bring profound technical expertise and steadfast dedication to your engineering team to consistently deliver high-calibre software.`,

  fr: `Vous devriez m'embaucher car j'ai près de 10 ans d'expérience en développement logiciel, principalement avec Java, Spring Boot et les systèmes backend.

J'aime résoudre des problèmes complexes, j'apprends rapidement et j'apprécie concevoir des solutions fiables et évolutives. Je suis également très à l'aise pour collaborer avec différentes équipes, partager mes connaissances et explorer de nouvelles technologies.

Je suis convaincu que je peux apporter à la fois mon expertise technique et une forte motivation pour contribuer à votre équipe et livrer des logiciels de haute qualité.`,

  es: `Deberían contratarme porque cuento con casi 10 años de experiencia en desarrollo de software, trabajando principalmente con Java, Spring Boot y sistemas backend.

Me apasiona resolver problemas técnicos, aprendo con rapidez y disfruto creando soluciones fiables y escalables. Además, me integro con facilidad en equipos multidisciplinares, compartiendo conocimientos y aprendiendo nuevas tecnologías.

Estoy convencido de que puedo aportar sólida experiencia técnica y un gran entusiasmo para colaborar con su equipo y entregar software de máxima calidad.`,

  de: `Sie sollten mich einstellen, weil ich über fast 10 Jahre Erfahrung in der Softwareentwicklung verfüge, vor allem mit Java, Spring Boot und skalierbaren Backend-Systemen.

Ich bin lösungsorientiert, lerne schnell und baue mit Leidenschaft verlässliche und zukunftssichere Architekturen. Ich arbeite sehr gerne in agilen Teams, teile mein Wissen aktiv und erweitere kontinuierlich mein technisches Repertoire.

Ich bin überzeugt, dass ich sowohl tiefes technisches Know-how als auch ein hohes Engagement einbringen kann, um Ihr Team voranzubringen und exzellente Software zu liefern.`,
};

// Multilingual interview scripts
export const MULTILINGUAL_INTERVIEW_SCRIPTS: Record<string, { title: string; subtitle: string; language: SupportedLanguage; items: InterviewItem[] }> = {
  'pt-BR': {
    title: 'Senior Java & Spring Boot (Brasil 🇧🇷)',
    subtitle: 'Roteiro de entrevista técnica e comportamental focado em 10 anos de experiência',
    language: 'pt-BR',
    items: [
      {
        id: 'br-q1',
        questionNumber: 1,
        question: 'Por que nós devemos contratar você para esta posição de engenharia de software?',
        answer:
          'Você deve me contratar porque tenho quase 10 anos de experiência em desenvolvimento de software, atuando principalmente com Java, Spring Boot e sistemas backend. Sou focado em resolver problemas, aprendo rápido e gosto de construir soluções confiáveis e escaláveis. Também me sinto muito à vontade trabalhando com diferentes equipes, compartilhando conhecimento e aprendendo novas tecnologias. Acredito que posso agregar tanto experiência técnica quanto uma forte disposição para contribuir com o seu time e ajudar na entrega de software de alta qualidade.',
        category: 'Background',
        pronunciationNotes: 'Ênfase em: "quase 10 anos de experiência", "Java, Spring Boot", "confiáveis e escaláveis".',
        isSelected: true,
      },
      {
        id: 'br-q2',
        questionNumber: 2,
        question: 'Como você garante alta disponibilidade e resiliência nos seus microsserviços em produção?',
        answer:
          'Eu aplico padrões nativos de nuvem como circuit breakers com Resilience4j, escalabilidade horizontal e mensageria assíncrona com Kafka ou RabbitMQ. Projeto serviços Spring Boot sem estado apoiados por réplicas de leitura no banco de dados, cache distribuído com Redis e observabilidade completa com métricas e logs estruturados.',
        category: 'Technical',
        pronunciationNotes: 'Mantenha ritmo natural nas siglas técnicas (Kafka, Redis, Resilience4j, Spring Boot).',
        isSelected: true,
      },
      {
        id: 'br-q3',
        questionNumber: 3,
        question: 'Conte sobre uma ocasião em que você resolveu um incidente crítico de produção sob pressão.',
        answer:
          'Durante um pico de tráfego, nossa API de autorização sofreu esgotamento de threads por bloqueios lentos no banco. Liderei a triagem técnica, identifiquei a consulta não indexada que travava a tabela, implementei um contorno temporário de leitura e apliquei o índice de migração em vinte minutos, restaurando 99,9% de disponibilidade sem perda de dados.',
        category: 'Behavioral',
        pronunciationNotes: 'Estrutura STAR: Situação, Tarefa, Ação e Resultado quantificável.',
        isSelected: true,
      },
    ],
  },

  'pt-PT': {
    title: 'Engenheiro de Software Sénior (Portugal 🇵🇹)',
    subtitle: 'Guião de entrevista para empresas em Lisboa, Porto e mercado da União Europeia',
    language: 'pt-PT',
    items: [
      {
        id: 'pt-q1',
        questionNumber: 1,
        question: 'Porque é que a nossa empresa deve contratá-lo para esta posição de engenharia?',
        answer:
          'Devem contratar-me porque conto com cerca de 10 anos de experiência em engenharia de software, desenvolvendo sistemas de backend robustos em Java e Spring Boot. Tenho facilidade em resolver problemas complexos e gosto de construir arquiteturas fiáveis e escaláveis. Trabalho com muita naturalidade em equipas multidisciplinares e mantenho-me em constante aprendizagem. Acredito que posso trazer maturidade técnica e elevar a qualidade do software.',
        category: 'Background',
        pronunciationNotes: 'Pronúncia europeia: ritmo firme e dicção clara ("arquiteturas fiáveis", "equipas multidisciplinares").',
        isSelected: true,
      },
      {
        id: 'pt-q2',
        questionNumber: 2,
        question: 'Como aborda a resolução de incidentes críticos em ambientes de produção?',
        answer:
          'Priorizo a triagem rápida com base em telemetria e registos estruturados. Isolei o impacto com desvios seguros ou reversão de versão, comunico o estado com transparência aos intervenientes e realizo uma análise pós-incidente rigorosa para evitar recorrências.',
        category: 'Technical',
        pronunciationNotes: 'Destaque termos: "telemetria", "análise pós-incidente rigorosa".',
        isSelected: true,
      },
      {
        id: 'pt-q3',
        questionNumber: 3,
        question: 'Qual é o seu papel no desenvolvimento da liderança técnica dentro da equipa?',
        answer:
          'Acredito na liderança pelo exemplo, conduzindo revisões de código construtivas, estabelecendo boas práticas de integração contínua e apoiando os programadores mais juniores a compreender as decisões arquiteturais.',
        category: 'Leadership',
        pronunciationNotes: 'Tom colaborativo e confiante.',
        isSelected: true,
      },
    ],
  },

  'en-US': {
    title: 'Senior Java & Spring Boot (US English 🇺🇸)',
    subtitle: '10-Year Backend Pitch & Microservice Architecture for US & Global Tech Screening',
    language: 'en-US',
    items: [
      {
        id: 'us-q1',
        questionNumber: 1,
        question: 'Why should we hire you for this software engineering position?',
        answer:
          'You should hire me because I have almost 10 years of experience in software development, mainly working with Java, Spring Boot, and backend systems. I am a problem-solver, a quick learner, and someone who enjoys building reliable and scalable solutions. I am also comfortable working with different teams, sharing knowledge, and learning new technologies. I believe I can bring both technical experience and a strong willingness to contribute to your team and help deliver high-quality software.',
        category: 'Background',
        pronunciationNotes: 'Emphasize: "almost 10 years", "Java, Spring Boot", "reliable and scalable", "high-quality software".',
        questionAudioUrl: '/public/audio/pitch-java-developer-fenrir.mp3',
        isSelected: true,
      },
      {
        id: 'us-q2',
        questionNumber: 2,
        question: 'How do you ensure high availability and scalability in your backend microservices?',
        answer:
          'I follow cloud-native patterns like circuit breakers, horizontal auto-scaling, and asynchronous messaging with Kafka or RabbitMQ. I design stateless Spring Boot services backed by read-replicas, distributed caching with Redis, and implement robust telemetry with OpenTelemetry and Prometheus to catch performance bottlenecks before production outages.',
        category: 'Technical',
        pronunciationNotes: 'Keep steady pacing on acronyms (Kafka, Redis, Prometheus). Pause slightly before "circuit breakers".',
        isSelected: true,
      },
      {
        id: 'us-q3',
        questionNumber: 3,
        question: 'Tell me about a time you resolved a critical production issue under tight pressure.',
        answer:
          'During a high-traffic release, our payment authorization API experienced thread pool exhaustion due to slow downstream database locks. I quickly led incident triage, pinpointed the unindexed query causing table locks, rolled out a temporary bypass, and deployed the migration index within twenty minutes, restoring 99.9% uptime with zero data loss.',
        category: 'Behavioral',
        pronunciationNotes: 'Use STAR structure: Situation, Task, Action, and quantifiable Result (zero data loss).',
        isSelected: true,
      },
      {
        id: 'us-q4',
        questionNumber: 4,
        question: 'Where do you see your technical leadership contributing to our engineering team?',
        answer:
          'I believe I can bring both deep architectural rigor and a supportive mentorship culture. I enjoy conducting constructive code reviews, establishing automated CI/CD guardrails, and helping junior and mid-level engineers elevate their system design and debugging capabilities.',
        category: 'Leadership',
        pronunciationNotes: 'Warm and collaborative cadence; emphasize "mentorship culture" and "architectural rigor".',
        isSelected: true,
      },
    ],
  },

  'en-GB': {
    title: 'British Corporate & Tech Interview (UK 🇬🇧)',
    subtitle: 'Corporate interview questions with distinct British RP pronunciation for UK roles',
    language: 'en-GB',
    items: [
      {
        id: 'uk-q1',
        questionNumber: 1,
        question: 'Could you please walk me through your engineering career to date?',
        answer:
          'Certainly. Over the past decade, I have focused extensively on building resilient distributed systems using Java and Spring Boot. I have led backend squads, refined architectural standards, and delivered high-impact products across international banking and SaaS platforms. I collaborate seamlessly and prioritize clean engineering.',
        category: 'Background',
        pronunciationNotes: 'Adopt British RP intonation: crisp consonants and polite cadence ("Certainly", "extensively").',
        isSelected: true,
      },
      {
        id: 'uk-q2',
        questionNumber: 2,
        question: 'How do you foster effective collaboration within cross-functional squads?',
        answer:
          'I believe in transparent communication, thorough architectural RFCs, and collaborative code reviews. By aligning closely with product managers and QA engineers early in the sprint, we minimize technical debt and maintain sustainable velocity.',
        category: 'Leadership',
        pronunciationNotes: 'Crisp British articulation on "cross-functional squads" and "sustainable velocity".',
        isSelected: true,
      },
    ],
  },

  fr: {
    title: 'Entretien Développeur Senior (Français 🇫🇷)',
    subtitle: 'Entretien technique et comportemental pour la France, Belgique et Suisse',
    language: 'fr',
    items: [
      {
        id: 'fr-q1',
        questionNumber: 1,
        question: 'Pourquoi devrions-nous vous embaucher pour ce poste de développeur senior ?',
        answer:
          'Vous devriez m’embaucher car j’ai près de dix ans d’expérience en développement logiciel, principalement avec Java, Spring Boot et les systèmes backend. J’aime résoudre des problèmes complexes, j’apprends vite et j’apprécie concevoir des architectures fiables et évolutives. Je suis également très à l’aise pour collaborer en équipe et partager mes compétences.',
        category: 'Background',
        pronunciationNotes: 'Articulez clairement : "dix ans d’expérience", "systèmes backend", "fiables et évolutives".',
        isSelected: true,
      },
      {
        id: 'fr-q2',
        questionNumber: 2,
        question: 'Comment garantissez-vous la haute disponibilité de vos microservices en production ?',
        answer:
          'J’applique des patrons de conception cloud-native comme les coupe-circuits, le dimensionnement horizontal et la messagerie asynchrone avec Kafka. Je conçois des services Spring Boot sans état appuyés par des réplicas de lecture et du cache Redis avec une observabilité complète.',
        category: 'Technical',
        pronunciationNotes: 'Rythme fluide et distinction nette des termes d’architecture.',
        isSelected: true,
      },
      {
        id: 'fr-q3',
        questionNumber: 3,
        question: 'Racontez-moi une situation où vous avez résolu un incident critique sous pression.',
        answer:
          'Lors d’un pic de charge imprévu, notre API a souffert d’un épuisement de threads. J’ai immédiatement dirigé le diagnostic, isolé la requête bloquante, appliqué une solution de contournement et indexé la table en vingt minutes, rétablissant la disponibilité sans perte de données.',
        category: 'Behavioral',
        pronunciationNotes: 'Structure STAR avec intonation dynamique et posée.',
        isSelected: true,
      },
    ],
  },

  es: {
    title: 'Entrevista Desarrollador Senior (Español 🇪🇸)',
    subtitle: 'Preguntas y respuestas técnicas para empresas en España y Latinoamérica',
    language: 'es',
    items: [
      {
        id: 'es-q1',
        questionNumber: 1,
        question: '¿Por qué deberíamos contratarte para este puesto de ingeniería de software?',
        answer:
          'Deberían contratarme porque cuento con casi diez años de experiencia en desarrollo de software, trabajando con Java, Spring Boot y arquitecturas backend. Me destaco por resolver problemas técnicos complejos y construir soluciones escalables y seguras. Trabajo con mucha naturalidad en equipos multidisciplinares y disfruto aprendiendo nuevas tecnologías.',
        category: 'Background',
        pronunciationNotes: 'Énfasis en: "diez años de experiencia", "Spring Boot", "soluciones escalables".',
        isSelected: true,
      },
      {
        id: 'es-q2',
        questionNumber: 2,
        question: '¿Cómo garantizas la alta disponibilidad y resiliencia en tus microservicios?',
        answer:
          'Aplico patrones nativos de la nube como disyuntores (circuit breakers), autoescalado horizontal y mensajería asíncrona con Kafka o RabbitMQ. Diseño servicios Spring Boot sin estado con réplicas de lectura en base de datos, caché distribuida con Redis y monitorización continua con Prometheus.',
        category: 'Technical',
        pronunciationNotes: 'Cadencia profesional y articulación precisa en vocabulario técnico.',
        isSelected: true,
      },
      {
        id: 'es-q3',
        questionNumber: 3,
        question: 'Cuéntame sobre alguna ocasión en la que resolviste un incidente crítico bajo presión.',
        answer:
          'Durante un lanzamiento crítico, nuestra pasarela de pagos sufrió saturación de hilos por bloqueos en base de datos. Lideré el triaje técnico, localicé la consulta sin índice, apliqué una mitigación inmediata y desplegué el índice en veinte minutos, recuperando el 99,9% de disponibilidad sin pérdida de datos.',
        category: 'Behavioral',
        pronunciationNotes: 'Método STAR: Situación, Tarea, Acción y Resultado cuantificable.',
        isSelected: true,
      },
    ],
  },

  de: {
    title: 'Senior Software Engineer (Deutsch 🇩🇪)',
    subtitle: 'Technisches und verhaltensorientiertes Interview für Deutschland, Österreich und Schweiz',
    language: 'de',
    items: [
      {
        id: 'de-q1',
        questionNumber: 1,
        question: 'Warum sollten wir Sie für diese Position als Senior Software Engineer einstellen?',
        answer:
          'Sie sollten mich einstellen, weil ich über fast 10 Jahre Erfahrung in der Softwareentwicklung verfüge, vor allem mit Java, Spring Boot und skalierbaren Backend-Systemen. Ich bin lösungsorientiert, lerne schnell und baue mit Leidenschaft verlässliche Architekturen. Zudem arbeite ich sehr gerne in agilen Teams, teile mein Wissen aktiv und trage zur kontinuierlichen Verbesserung bei.',
        category: 'Background',
        pronunciationNotes: 'Hochdeutsche Aussprache: betonen Sie "10 Jahre Erfahrung", "Java, Spring Boot" und "verlässliche Architekturen".',
        isSelected: true,
      },
      {
        id: 'de-q2',
        questionNumber: 2,
        question: 'Wie stellen Sie Hochverfügbarkeit und Resilienz in verteilten Microservices sicher?',
        answer:
          'Ich setze auf Cloud-Native-Muster wie Circuit Breaker mit Resilience4j, horizontale Autoskalierung und asynchrones Messaging mit Apache Kafka. Durch zustandslose Spring Boot Services, verteiltes Caching mit Redis und lückenloses Monitoring mit OpenTelemetry und Prometheus garantieren wir maximale Zuverlässigkeit.',
        category: 'Technical',
        pronunciationNotes: 'Präzise Fachterminologie (Kafka, Resilience4j, Autoskalierung).',
        isSelected: true,
      },
      {
        id: 'de-q3',
        questionNumber: 3,
        question: 'Erzählen Sie von einer Situation, in der Sie einen kritischen Produktionsfehler unter hohem Druck gelöst haben.',
        answer:
          'Während einer Spitzenlast kam es zu einem Thread-Pool-Engpass in unserer Zahlungs-API durch langsame Datenbank-Locks. Ich übernahm die Fehleranalyse, identifizierte die ungeindexte Abfrage, richtete einen temporären Lese-Bypass ein und spielte den Index binnen zwanzig Minuten ein – bei 99,9% Uptime ohne Datenverlust.',
        category: 'Behavioral',
        pronunciationNotes: 'STAR-Methode: Strukturierte, souveräne und ergebnisorientierte Darstellung.',
        isSelected: true,
      },
    ],
  },
};

export const INITIAL_INTERVIEW_ITEMS: InterviewItem[] =
  MULTILINGUAL_INTERVIEW_SCRIPTS['pt-BR'].items;
