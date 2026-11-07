/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TtsGeneratorView } from './components/TtsGeneratorView';
import { InterviewPracticeView } from './components/InterviewPracticeView';
import { AudioLibraryView } from './components/AudioLibraryView';
import { SettingsView } from './components/SettingsView';
import {
  SavedProject,
  InterviewItem,
  SupportedLanguage,
} from './types';
import { INITIAL_INTERVIEW_ITEMS } from './data/languagesAndVoices';

const STORAGE_KEY_PROJECTS = 'voicepitch_saved_projects_v2';
const STORAGE_KEY_SETTINGS = 'voicepitch_settings_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [defaultLanguage, setDefaultLanguage] = useState<SupportedLanguage>('en-US');
  const [defaultPause, setDefaultPause] = useState<number>(10);

  // Saved projects
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading stored projects:', e);
    }
    // Seed with pre-generated project
    return [
      {
        id: 'seed-pitch-1',
        title: 'Senior Java & Spring Boot Interview Pitch (10 Anos)',
        type: 'tts',
        originalText:
          'You should hire me because I have almost 10 years of experience in software development, mainly working with Java, Spring Boot, and backend systems...',
        language: 'en-US',
        voice: 'Fenrir',
        audioUrl: '/public/audio/pitch-java-developer-fenrir.mp3',
        duration: 28,
        createdAt: 'Hoje',
        fileSize: '438 KB',
      },
    ];
  });

  // Practice state transferred from Dashboard or TTS
  const [practiceItems, setPracticeItems] = useState<InterviewItem[]>(INITIAL_INTERVIEW_ITEMS);
  const [practiceTitle, setPracticeTitle] = useState<string>('Senior Java & Spring Boot Engineer');

  // Text-to-speech current text
  const [ttsText, setTtsText] = useState<string>(
    `You should hire me because I have almost 10 years of experience in software development, mainly working with Java, Spring Boot, and backend systems.

I'm a problem-solver, a quick learner, and someone who enjoys building reliable and scalable solutions. I'm also comfortable working with different teams, sharing knowledge, and learning new technologies.

I believe I can bring both technical experience and a strong willingness to contribute to your team and help deliver high-quality software.`
  );

  // Global Audio Player
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>(
    '/public/audio/pitch-java-developer-fenrir.mp3'
  );
  const [currentWavUrl, setCurrentWavUrl] = useState<string>(
    '/public/audio/pitch-java-developer-fenrir.wav'
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(28);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Persist projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(savedProjects));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }, [savedProjects]);

  // Sync audio controls
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [playbackRate, volume, isMuted]);

  // Keyboard shortcut: Spacebar to toggle playback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'INPUT'
      ) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Play error:', err);
          setIsPlaying(false);
        });
    }
  };

  const restartAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
  };

  const handleSeek = (seconds: number) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0, Math.min(duration, seconds));
    audioRef.current.currentTime = clamped;
    setCurrentTime(clamped);
  };

  // Called when TTS generates new audio
  const handleAudioGenerated = (
    mp3Url: string,
    wavUrl: string,
    durationSec: number,
    textSource: string
  ) => {
    setCurrentAudioUrl(mp3Url);
    if (wavUrl) setCurrentWavUrl(wavUrl);
    setDuration(durationSec);
    setCurrentTime(0);
    setIsPlaying(false);
    setTtsText(textSource);
  };

  // Add project to library
  const handleSaveToLibrary = (proj: Omit<SavedProject, 'id' | 'createdAt'>) => {
    const newProject: SavedProject = {
      ...proj,
      id: `proj-${Date.now()}`,
      createdAt: 'Agora mesmo',
    };
    setSavedProjects([newProject, ...savedProjects]);
  };

  // Delete project from library
  const handleDeleteProject = (id: string) => {
    setSavedProjects(savedProjects.filter((p) => p.id !== id));
  };

  // Play saved project
  const handlePlaySavedProject = (proj: SavedProject) => {
    if (!proj.audioUrl) return;
    setCurrentAudioUrl(proj.audioUrl);
    setDuration(proj.duration || 28);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.src = proj.audioUrl;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  // Load template from Dashboard
  const handleLoadTemplate = (
    items: InterviewItem[],
    title: string,
    lang: SupportedLanguage
  ) => {
    setPracticeItems(items);
    setPracticeTitle(title);
    setDefaultLanguage(lang);
    setActiveTab('practice');
  };

  // Transfer text from TTS editor to Interview Practice
  const handleTransferToPractice = async (text: string) => {
    try {
      const res = await fetch('/api/parse-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setPracticeItems(data.items);
          setPracticeTitle(data.title || 'Simulação Personalizada');
          setActiveTab('practice');
          return;
        }
      }
    } catch (e) {
      console.warn('Parser error:', e);
    }
    // Fallback single item
    setPracticeItems([
      {
        id: `item-${Date.now()}`,
        questionNumber: 1,
        question: 'Why should we hire you?',
        answer: text,
        category: 'Background',
        isSelected: true,
      },
    ]);
    setActiveTab('practice');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Hidden Global Audio Element */}
      <audio
        ref={audioRef}
        src={currentAudioUrl}
        preload="auto"
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current && audioRef.current.duration) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedProjects.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={setActiveTab}
            onLoadTemplate={handleLoadTemplate}
            savedProjects={savedProjects}
            onPlaySaved={handlePlaySavedProject}
          />
        )}

        {activeTab === 'tts' && (
          <TtsGeneratorView
            initialText={ttsText}
            onNavigateToPracticeWithText={handleTransferToPractice}
            onSaveToLibrary={handleSaveToLibrary}
            audioRef={audioRef}
            currentAudioUrl={currentAudioUrl}
            currentWavUrl={currentWavUrl}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            playbackRate={playbackRate}
            volume={volume}
            isMuted={isMuted}
            onTogglePlay={togglePlay}
            onRestart={restartAudio}
            onSeek={handleSeek}
            onChangeRate={setPlaybackRate}
            onVolumeChange={setVolume}
            onToggleMute={() => setIsMuted(!isMuted)}
            onAudioGenerated={handleAudioGenerated}
          />
        )}

        {activeTab === 'practice' && (
          <InterviewPracticeView
            initialItems={practiceItems}
            initialLanguage={defaultLanguage}
            onSaveToLibrary={handleSaveToLibrary}
          />
        )}

        {activeTab === 'library' && (
          <AudioLibraryView
            projects={savedProjects}
            onPlayProject={handlePlaySavedProject}
            onDeleteProject={handleDeleteProject}
            onNavigateToTts={() => setActiveTab('tts')}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            defaultLanguage={defaultLanguage}
            onChangeLanguage={setDefaultLanguage}
            defaultPause={defaultPause}
            onChangeDefaultPause={setDefaultPause}
            onClearStorage={() => {
              localStorage.removeItem(STORAGE_KEY_PROJECTS);
              setSavedProjects([]);
            }}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            VoicePitch Studio • AI Voice Generator & Interview Practice (MP3 Edition)
          </span>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => setActiveTab('tts')}
              className="hover:text-emerald-400 transition-colors"
            >
              Text-to-Speech
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveTab('practice')}
              className="hover:text-teal-400 transition-colors"
            >
              Interview Practice (7 Modos)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className="hover:text-amber-400 transition-colors"
            >
              Minha Biblioteca
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
