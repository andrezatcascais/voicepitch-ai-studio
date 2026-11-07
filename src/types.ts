export type SupportedLanguage = 'pt-BR' | 'pt-PT' | 'en-US' | 'en-GB' | 'fr' | 'it' | 'es' | 'de';

export type SupportedAppLocale = 'pt-BR' | 'pt-PT' | 'en' | 'fr' | 'es' | 'de';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  flag: string;
  accentLabel: string;
  speechCode: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female';
  language: SupportedLanguage;
  accent: string;
  tone: string;
  recommendedRole: 'interviewer' | 'candidate' | 'both';
  recommendedFor?: string;
  description: string;
  pregeneratedFile?: string;
  pregeneratedWav?: string;
}

export interface PitchPreset {
  id: string;
  title: string;
  description: string;
  badge: string;
  text: string;
  suggestedVoice: string;
}

export interface InterviewItem {
  id: string;
  questionNumber: number;
  question: string;
  answer: string;
  category?: 'Technical' | 'Behavioral' | 'Leadership' | 'Background';
  pronunciationNotes?: string;
  questionAudioUrl?: string;
  answerAudioUrl?: string;
  combinedAudioUrl?: string;
  isSelected?: boolean;
}

export type PracticeMode =
  | 'full'            // 1. Full Interview (Q + A in sequence)
  | 'qa'              // 2. Question and Answer pairs
  | 'question_only'   // 3. Question Only (with configurable speaking pause)
  | 'answer_only'     // 4. Answer Only (pronunciation & fluency)
  | 'listening'       // 5. Listening Practice (test comprehension before revealing)
  | 'repeat'          // 6. Repeat Practice (loop configurable times)
  | 'custom';         // 7. Custom Practice (select specific Q&As)

export interface AudioSettings {
  language: SupportedLanguage;
  voice: string;
  interviewerVoice: string;
  candidateVoice: string;
  speed: number;
  pitch: number;
  toneStyle: 'interview' | 'conversational' | 'calm' | 'enthusiastic';
  pauseBetweenQA: number; // in seconds (e.g., 3, 5, 8, 10, 15)
  repeatCount: number;    // 1, 2, 3
  bitrate: number;        // 128 or 192
}

export interface SavedProject {
  id: string;
  title: string;
  type: 'tts' | 'interview';
  originalText?: string;
  interviewItems?: InterviewItem[];
  language: SupportedLanguage;
  voice: string;
  interviewerVoice?: string;
  candidateVoice?: string;
  audioUrl?: string;
  duration?: number;
  createdAt: string;
  fileSize?: string;
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  audioUrl: string | null;
  audioFormat: 'mp3' | 'wav';
  activeVoice: string;
  fileSizeText?: string;
}
