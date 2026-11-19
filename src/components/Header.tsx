import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AppView, GameState } from '../types/game';

interface HeaderProps {
  activeView: AppView;
  gameState: GameState;
  hasSavedResult: boolean;
  compareCount: number;
  onNavigate: (view: AppView) => void;
  onPrimaryAction: () => void;
  onOpenCompare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  gameState,
  hasSavedResult,
  compareCount,
  onNavigate,
  onPrimaryAction,
  onOpenCompare,
}) => {
  const { isDark, toggleTheme } = useTheme();

  const primaryLabel =
    activeView === 'GAME' && gameState === 'PLAYING'
      ? 'Restart Quest'
      : hasSavedResult && activeView !== 'GAME'
        ? 'View Results'
        : gameState === 'RESULT_SUMMARY'
          ? 'Retake Test'
          : 'Start Quiz';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('GAME')}
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
        >
          UniCompass
        </button>

        {/* Zone 2: Clean single-line text nav links */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <button
            type="button"
            onClick={() => onNavigate('GAME')}
            className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              activeView === 'GAME'
                ? 'text-slate-900 dark:text-white border-blue-600 dark:border-blue-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            Career Quest
          </button>
          <button
            type="button"
            onClick={() => onNavigate('MAJORS')}
            className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              activeView === 'MAJORS'
                ? 'text-slate-900 dark:text-white border-blue-600 dark:border-blue-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            Majors Library
          </button>
          <button
            type="button"
            onClick={() => onNavigate('UNIVERSITIES')}
            className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              activeView === 'UNIVERSITIES'
                ? 'text-slate-900 dark:text-white border-blue-600 dark:border-blue-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            Universities
          </button>
          <button
            type="button"
            onClick={() => onNavigate('FACILITIES')}
            className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              activeView === 'FACILITIES'
                ? 'text-slate-900 dark:text-white border-blue-600 dark:border-blue-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            Facilities
          </button>
          <button
            type="button"
            onClick={onOpenCompare}
            className="py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {compareCount > 0 ? `Compare (${compareCount})` : 'Compare'}
          </button>
        </nav>

        {/* Zone 3: Theme Toggle + 1 Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <button
            type="button"
            onClick={onPrimaryAction}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            {primaryLabel}
          </button>
        </div>
      </div>

      {/* Compact single-row mobile navigation strip */}
      <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 px-4 py-1.5 flex items-center justify-between gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => onNavigate('GAME')}
          className={`px-2 py-1 text-xs font-medium whitespace-nowrap shrink-0 ${
            activeView === 'GAME'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Career Quest
        </button>
        <button
          type="button"
          onClick={() => onNavigate('MAJORS')}
          className={`px-2 py-1 text-xs font-medium whitespace-nowrap shrink-0 ${
            activeView === 'MAJORS'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Majors Library
        </button>
        <button
          type="button"
          onClick={() => onNavigate('UNIVERSITIES')}
          className={`px-2 py-1 text-xs font-medium whitespace-nowrap shrink-0 ${
            activeView === 'UNIVERSITIES'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Universities
        </button>
        <button
          type="button"
          onClick={() => onNavigate('FACILITIES')}
          className={`px-2 py-1 text-xs font-medium whitespace-nowrap shrink-0 ${
            activeView === 'FACILITIES'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Facilities
        </button>
        <button
          type="button"
          onClick={onOpenCompare}
          className="px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap shrink-0 tabular-nums"
        >
          {compareCount > 0 ? `Compare (${compareCount})` : 'Compare'}
        </button>
      </div>
    </header>
  );
};
