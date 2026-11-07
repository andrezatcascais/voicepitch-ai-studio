import React, { useState, useRef, useEffect } from 'react';
import {
  AudioLines,
  LayoutDashboard,
  Mic,
  GraduationCap,
  Library,
  Settings,
  Sparkles,
  Globe,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { SupportedAppLocale } from '../types';

export type NavTab = 'dashboard' | 'tts' | 'practice' | 'library' | 'settings';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
}) => {
  const { locale, setLocale, t, availableLocales } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLocaleInfo = availableLocales.find((l) => l.code === locale) || availableLocales[0];

  const tabs = [
    {
      id: 'dashboard' as NavTab,
      label: t.nav.dashboard,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'tts' as NavTab,
      label: t.nav.tts,
      icon: Mic,
      badge: 'MP3',
    },
    {
      id: 'practice' as NavTab,
      label: t.nav.practice,
      icon: GraduationCap,
      badge: '7 Modos',
    },
    {
      id: 'library' as NavTab,
      label: t.nav.library,
      icon: Library,
      badge: savedCount > 0 ? String(savedCount) : null,
    },
    {
      id: 'settings' as NavTab,
      label: t.nav.settings,
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-emerald-400">
                <AudioLines className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  VoicePitch
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase font-semibold">
                  Multilingual
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden xl:block">
                AI Voice Generator & Interview Simulator
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop & Tablet) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-slate-950/20 text-slate-950 font-bold'
                          : 'bg-slate-800 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Area: Language Switcher + Quick Practice Button */}
          <div className="flex items-center gap-2">
            {/* Language Selector Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-slate-700 text-xs font-semibold transition-all shadow-sm"
                title="Alterar idioma da interface"
              >
                <span className="text-base leading-none">{currentLocaleInfo.flag}</span>
                <span className="font-mono text-white text-[11px]">{currentLocaleInfo.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1">
                    Idioma da Interface:
                  </div>
                  {availableLocales.map((loc) => {
                    const isSelected = locale === loc.code;
                    return (
                      <button
                        key={loc.code}
                        type="button"
                        onClick={() => {
                          setLocale(loc.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base leading-none">{loc.flag}</span>
                          <span>{loc.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Action Button */}
            <button
              type="button"
              onClick={() => onSelectTab('practice')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.nav.quickPractice}</span>
              <span className="sm:hidden">{t.nav.quickPracticeShort}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-850 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-900/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
