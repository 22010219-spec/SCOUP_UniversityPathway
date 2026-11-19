import React, { useState } from 'react';
import { ArrowRight, Compass, RotateCcw } from 'lucide-react';
import { CredentialType, PlayerSetup, Region, SubjectTrack } from '../types/game';
import {
  CREDENTIAL_CONFIGS,
  CREDENTIAL_ORDER,
  atarToCredential,
  credentialToAtar,
  formatAtarBandInCredential,
  formatCredentialValue,
} from '../utils/credentialConverter';

interface TitleMenuProps {
  initialSetup: PlayerSetup;
  hasSavedResult: boolean;
  onStartGame: (setup: PlayerSetup) => void;
  onViewLastResult: () => void;
}

const SUBJECT_TRACKS: SubjectTrack[] = [
  'Undecided',
  'Advanced Maths & Sciences',
  'Economics & Applied Maths',
  'Biology & Chemistry',
  'Humanities & Languages',
  'Arts & Portfolio',
];

const REGIONS: Region[] = [
  'All',
  'Australia',
  'UK & Europe',
  'Singapore & Asia',
  'Canada & New Zealand',
];

export const TitleMenu: React.FC<TitleMenuProps> = ({
  initialSetup,
  hasSavedResult,
  onStartGame,
  onViewLastResult,
}) => {
  const [setup, setSetup] = useState<PlayerSetup>(initialSetup);

  const credConfig = CREDENTIAL_CONFIGS[setup.credentialType];

  const handleSelectCredential = (nextType: CredentialType) => {
    const convertedScore = atarToCredential(nextType, setup.targetAtar);
    const syncedAtar = credentialToAtar(nextType, convertedScore);
    setSetup((prev) => ({
      ...prev,
      credentialType: nextType,
      credentialScore: convertedScore,
      targetAtar: syncedAtar,
    }));
  };

  const handleScoreChange = (rawVal: number) => {
    const adjustedScore =
      setup.credentialType === 'ATAR' && rawVal >= 99.5 ? 99.95 : rawVal;
    const syncedAtar = credentialToAtar(setup.credentialType, adjustedScore);
    setSetup((prev) => ({
      ...prev,
      credentialScore: adjustedScore,
      targetAtar: syncedAtar,
    }));
  };

  const atarTierLabel =
    setup.targetAtar >= 90
      ? 'Top Tier (Go8 / G5 / NUS-NTU)'
      : setup.targetAtar >= 78
        ? 'Leading Research & Practice Universities'
        : 'Strong Direct Entry & Pathway Programs';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Main 2-column Hero Split with items-stretch */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Column: Mission Brief & Multi-Credential Setup */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 lg:p-10 transition-colors">
          <div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
              International Admissions &amp; Dorm Quest · RIASEC Personality Assessment
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.15] [text-wrap:balance]">
              Match your dream major with international universities &amp; dorms that fit your
              scores
            </h1>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Complete a 3-stage interactive quest featuring scenario cards, dream ranking, and
              priority sliders. Select your credential (ATAR, Digital SAT, IB, A-Levels, or 4.0
              GPA) and campus dorm preference to match universities worldwide.
            </p>

            {/* Interactive Pre-Game Setup */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  1. Strength Track / Expected Prerequisites
                </label>
                <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit max-w-full">
                  {SUBJECT_TRACKS.map((track) => (
                    <button
                      key={track}
                      type="button"
                      onClick={() => setSetup((prev) => ({ ...prev, subjectTrack: track }))}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        setup.subjectTrack === track
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {track}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    2. Academic Qualification &amp; Target Score
                  </label>
                  <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit max-w-full mb-3">
                    {CREDENTIAL_ORDER.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleSelectCredential(type)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                          setup.credentialType === type
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {CREDENTIAL_CONFIGS[type].shortLabel}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <label
                        htmlFor="setup-target-score"
                        className="text-xs font-medium text-slate-600 dark:text-slate-300"
                      >
                        {credConfig.subtitle}
                      </label>
                      <div className="flex items-center gap-2 font-mono text-sm font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                        <span>{formatCredentialValue(setup.credentialType, setup.credentialScore)}</span>
                        {setup.credentialType !== 'ATAR' && (
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            (≈ {setup.targetAtar.toFixed(2)} ATAR)
                          </span>
                        )}
                      </div>
                    </div>
                    <input
                      id="setup-target-score"
                      type="range"
                      min={credConfig.min}
                      max={credConfig.max}
                      step={credConfig.step}
                      value={setup.credentialScore}
                      onChange={(e) => handleScoreChange(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1 tabular-nums">
                      <span>{credConfig.ticks[0]}</span>
                      <span>{credConfig.ticks[1]}</span>
                      <span>{credConfig.ticks[2]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    3. Preferred Study Destination
                  </label>
                  <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit max-w-full">
                    {REGIONS.map((region) => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => setSetup((prev) => ({ ...prev, preferredRegion: region }))}
                        className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                          setup.preferredRegion === region
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Row */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onStartGame(setup)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            {hasSavedResult && (
              <button
                type="button"
                onClick={onViewLastResult}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>View Latest Result</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Live Credential Scale & 3-Stage Quest Preview */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 transition-colors">
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Current Target ({credConfig.shortLabel})
                </p>
                <p className="mt-1 font-display text-3xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                  {formatCredentialValue(setup.credentialType, setup.credentialScore)}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                  {setup.credentialType !== 'ATAR'
                    ? `≈ ${setup.targetAtar.toFixed(2)} ATAR · ${atarTierLabel}`
                    : atarTierLabel}
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>

            {/* Live Credential Admission Bands */}
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                International Admission Tiers ({credConfig.shortLabel} Equivalent)
              </p>
              <div className="space-y-2.5">
                {[
                  {
                    minA: 90,
                    maxA: 99.95,
                    label: 'Medicine, Law, AI & Go8 / G5 / NUS',
                    active: setup.targetAtar >= 90,
                  },
                  {
                    minA: 78,
                    maxA: 89.5,
                    label: 'Finance, Data Science & Engineering',
                    active: setup.targetAtar >= 78 && setup.targetAtar < 90,
                  },
                  {
                    minA: 55,
                    maxA: 77.5,
                    label: 'Media, Design, Foundation & Pathways',
                    active: setup.targetAtar < 78,
                  },
                ].map((tier) => (
                  <div
                    key={tier.label}
                    className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border transition-colors ${
                      tier.active
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-slate-900 dark:text-slate-100'
                        : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-medium">{tier.label}</span>
                    <span
                      className={`font-mono text-xs font-semibold tabular-nums shrink-0 ${
                        tier.active
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {formatAtarBandInCredential(setup.credentialType, tier.minA, tier.maxA)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3-Stage Quest Outline */}
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                3-Stage Interactive Quest
              </p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 pt-0.5 tabular-nums">
                    01
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      8 Scenario Cards
                    </span>{' '}
                    naturally measuring your RIASEC profile.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 pt-0.5 tabular-nums">
                    02
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      Rank Your Top Dreams
                    </span>{' '}
                    to anchor long-term career motivation.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 pt-0.5 tabular-nums">
                    03
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      Calibrate Priorities &amp; Dorms
                    </span>{' '}
                    across campus housing, scholarships, and study style.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <h2 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
              Unified Equivalency &amp; Campus Housing
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Switch between ATAR, SAT, IB, A-Levels, and 4.0 GPA anytime—and compare Year 1
              guaranteed dorms, college halls, and living costs side by side.
            </p>
          </div>
        </div>
      </section>

      {/* Full-width 4-Column Summary Strip Below Hero Split */}
      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <p className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
            01 · INTERACTIVE
          </p>
          <h3 className="mt-1.5 font-display text-base font-bold text-slate-900 dark:text-slate-100">
            3 Engaging Quest Stages
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Combines scenario choices, personal dream ranking, and priority calibration sliders.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <p className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
            02 · 5 CREDENTIALS
          </p>
          <h3 className="mt-1.5 font-display text-base font-bold text-slate-900 dark:text-slate-100">
            ATAR, SAT, IB, A-Levels &amp; GPA
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Live bidirectional score equivalency calibrated across 18 international admissions teams.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <p className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
            03 · 14 MAJORS
          </p>
          <h3 className="mt-1.5 font-display text-base font-bold text-slate-900 dark:text-slate-100">
            Traits &amp; Dream Alignment
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Recharts RIASEC radar and workforce growth insights reveal your strongest career fit.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <p className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
            04 · DORMS &amp; CAMPUSES
          </p>
          <h3 className="mt-1.5 font-display text-base font-bold text-slate-900 dark:text-slate-100">
            18 Universities &amp; Housing Data
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Covers guaranteed freshman dorms, residential colleges, tuition, and SAT policies.
          </p>
        </div>
      </section>
    </div>
  );
};
