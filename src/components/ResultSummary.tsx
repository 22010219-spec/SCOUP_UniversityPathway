import React, { useMemo, useRef, useState } from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  Compass,
  Home,
  Plus,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { DREAM_GOALS, RIASEC_META } from '../data/quizData';
import {
  AdmissionStatus,
  CredentialType,
  GameResultSnapshot,
  MatchedUniversity,
  Region,
  RiasecKey,
  UniversityType,
} from '../types/game';
import {
  CREDENTIAL_CONFIGS,
  CREDENTIAL_ORDER,
  atarToCredential,
  credentialToAtar,
  formatAtarBandInCredential,
  formatCredentialValue,
} from '../utils/credentialConverter';
import { matchMajors, matchUniversities } from '../utils/matchingEngine';
import { CareerPathVisualization } from './CareerPathVisualization';
import { RiasecRadarChart } from './RiasecRadarChart';
import { StudyTimelinePlanner } from './StudyTimelinePlanner';

interface ResultSummaryProps {
  result: GameResultSnapshot;
  history: GameResultSnapshot[];
  compareIds: string[];
  onPlayAgain: () => void;
  onSelectHistory: (snapshot: GameResultSnapshot) => void;
  onToggleCompare: (uniId: string) => void;
  onInspectUniversity: (match: MatchedUniversity) => void;
}

const REGIONS: Region[] = [
  'All',
  'Australia',
  'UK & Europe',
  'Singapore & Asia',
  'Canada & New Zealand',
];

const TYPES: UniversityType[] = [
  'All',
  'Top Research (Go8 / Russell / G5)',
  'Applied & Innovation',
];

const RIASEC_KEYS: RiasecKey[] = ['R', 'I', 'A', 'S', 'E', 'C'];

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  result,
  history,
  compareIds,
  onPlayAgain,
  onSelectHistory,
  onToggleCompare,
  onInspectUniversity,
}) => {
  const [selectedMajorId, setSelectedMajorId] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState<Region>(result.setup.preferredRegion);
  const [typeFilter, setTypeFilter] = useState<UniversityType>('All');
  const [dormFilter, setDormFilter] = useState<'All' | 'Guaranteed Year 1'>('All');

  const [liveCredentialType, setLiveCredentialType] = useState<CredentialType>(
    result.setup.credentialType
  );
  const [liveCredentialScore, setLiveCredentialScore] = useState<number>(
    result.setup.credentialScore
  );

  const universitiesSectionRef = useRef<HTMLElement | null>(null);

  const liveTargetAtar = useMemo(
    () => credentialToAtar(liveCredentialType, liveCredentialScore),
    [liveCredentialType, liveCredentialScore]
  );

  const liveCredConfig = CREDENTIAL_CONFIGS[liveCredentialType];
  const liveCredDisplay = formatCredentialValue(liveCredentialType, liveCredentialScore);

  const handleSwitchLiveCredential = (nextType: CredentialType) => {
    const converted = atarToCredential(nextType, liveTargetAtar);
    setLiveCredentialType(nextType);
    setLiveCredentialScore(converted);
  };

  const handleLiveScoreChange = (rawVal: number) => {
    const nextScore = liveCredentialType === 'ATAR' && rawVal >= 99.5 ? 99.95 : rawVal;
    setLiveCredentialScore(nextScore);
  };

  // Dynamically recompute both majors & universities when user tunes the live credential simulator
  const dynamicMajors = useMemo(() => {
    const adjustedSetup = {
      ...result.setup,
      credentialType: liveCredentialType,
      credentialScore: liveCredentialScore,
      targetAtar: liveTargetAtar,
      preferredRegion: regionFilter,
    };
    return matchMajors(result.normalizedScores, adjustedSetup, result.selectedDreamIds);
  }, [
    result.normalizedScores,
    result.setup,
    result.selectedDreamIds,
    liveCredentialType,
    liveCredentialScore,
    liveTargetAtar,
    regionFilter,
  ]);

  const topFiveMajors = dynamicMajors.slice(0, 5);

  const dynamicUniversities = useMemo(() => {
    const adjustedSetup = {
      ...result.setup,
      credentialType: liveCredentialType,
      credentialScore: liveCredentialScore,
      targetAtar: liveTargetAtar,
      preferredRegion: regionFilter,
    };
    return matchUniversities(dynamicMajors, adjustedSetup, result.priorities);
  }, [
    dynamicMajors,
    result.priorities,
    result.setup,
    liveCredentialType,
    liveCredentialScore,
    liveTargetAtar,
    regionFilter,
  ]);

  const filteredUniversities = useMemo(() => {
    return dynamicUniversities.filter((item) => {
      if (regionFilter !== 'All' && item.university.region !== regionFilter) return false;
      if (typeFilter !== 'All' && item.university.type !== typeFilter) return false;
      if (dormFilter === 'Guaranteed Year 1' && item.university.dormAvailability !== 'Guaranteed Year 1') {
        return false;
      }
      if (selectedMajorId && !item.university.majorIds.includes(selectedMajorId)) return false;
      return true;
    });
  }, [dynamicUniversities, regionFilter, typeFilter, dormFilter, selectedMajorId]);

  const sortedTraits = useMemo(() => {
    return [...RIASEC_KEYS].sort(
      (a, b) => result.normalizedScores[b] - result.normalizedScores[a]
    );
  }, [result.normalizedScores]);

  const chosenDreams = useMemo(() => {
    return (result.selectedDreamIds || [])
      .map((id) => DREAM_GOALS.find((g) => g.id === id))
      .filter((g): g is NonNullable<typeof g> => Boolean(g));
  }, [result.selectedDreamIds]);

  const renderStatus = (status: AdmissionStatus) => {
    if (status === 'Safe') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Safe</span>
        </span>
      );
    }
    if (status === 'Target') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
          <Target className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Target</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
        <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Reach</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Top Action & Saved Runs Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            International Study Profile
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
            Code {result.topCode}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
            {liveCredDisplay}
            {liveCredentialType !== 'ATAR' ? ` (≈ ${liveTargetAtar.toFixed(2)} ATAR)` : ''}
          </span>
          <span aria-hidden="true">·</span>
          <span>{result.setup.subjectTrack}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">Dorm Priority: {result.priorities.dormPreference}/100</span>
          {history.length > 1 && (
            <>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 dark:text-slate-400">Runs:</span>
                {history.slice(0, 4).map((snap, idx) => (
                  <button
                    key={snap.id}
                    type="button"
                    onClick={() => {
                      onSelectHistory(snap);
                      setLiveCredentialType(snap.setup.credentialType);
                      setLiveCredentialScore(snap.setup.credentialScore);
                      setRegionFilter(snap.setup.preferredRegion);
                    }}
                    className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                      snap.id === result.id
                        ? 'bg-slate-900 dark:bg-blue-600 text-white font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    #{history.length - idx} ({snap.topCode})
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onPlayAgain}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Retake Test</span>
        </button>
      </div>

      {/* Section 1: Personality Archetype & Recharts RIASEC Radar */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Archetype Identity Card */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-900 dark:bg-slate-800 text-white shrink-0 flex flex-col items-center justify-center gap-1 border border-slate-800 dark:border-slate-700">
                <Compass className="w-6 h-6 text-blue-400" aria-hidden="true" />
                <span className="font-mono text-sm font-bold tracking-wider">
                  {result.archetype.code}
                </span>
              </div>
              <div>
                <p className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                  DOMINANT ARCHETYPE · {result.topCode}
                </p>
                <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 [text-wrap:balance]">
                  {result.archetype.title}
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                  {result.archetype.subtitle}
                </p>
              </div>
            </div>

            <p className="mt-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {result.archetype.summary}
            </p>

            {chosenDreams.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Your Ranked Career Dreams
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {chosenDreams.map((g, i) => (
                    <span key={g.id}>
                      #{i + 1} {g.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h2 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Natural Strengths
                </h2>
                <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                  {result.archetype.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                        +
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                    Ideal Study Environment
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {result.archetype.learningStyle}
                  </p>
                </div>
                <div>
                  <h2 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                    Growth Balance
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {result.archetype.watchOut}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recharts RIASEC Radar & Score Breakdown */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
              RIASEC Competency Radar
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Synthesized from your scenario responses and ranked career dreams (hover vertices for
              details).
            </p>
          </div>

          <div className="my-4">
            <RiasecRadarChart scores={result.normalizedScores} />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            {sortedTraits.map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                  {key} · {RIASEC_META[key].english}
                </span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums ml-2">
                  {result.normalizedScores[key]}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Top 5 Recommended Majors (Dream + Credential Fit) */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
              01. Recommended Majors Matched to Your {liveCredConfig.shortLabel} &amp; Dreams
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Select any major card to filter matching international universities below.
            </p>
          </div>
          {selectedMajorId && (
            <button
              type="button"
              onClick={() => setSelectedMajorId(null)}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0"
            >
              Show all recommended majors
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topFiveMajors.map((item, idx) => {
            const isSelected = selectedMajorId === item.major.id;
            return (
              <button
                key={item.major.id}
                type="button"
                onClick={() =>
                  setSelectedMajorId((prev) => (prev === item.major.id ? null : item.major.id))
                }
                className={`text-left rounded-2xl p-6 border transition-all duration-150 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  isSelected
                    ? 'bg-blue-50/60 dark:bg-blue-950/50 border-blue-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      Rank #{idx + 1} · {item.major.fieldGroup}
                    </span>
                    <span className="font-mono font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                      {item.matchPercent}% Fit
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {item.major.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.reason}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-700 dark:text-slate-200 font-mono tabular-nums">
                      {formatAtarBandInCredential(
                        liveCredentialType,
                        item.major.minAtar,
                        item.major.maxAtar
                      )}
                    </span>
                    {renderStatus(item.atarStatus)}
                  </div>
                  {item.dreamMatched && (
                    <p className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
                      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Matches your ranked dream</span>
                    </p>
                  )}
                  <p className="text-slate-600 dark:text-slate-300 line-clamp-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      Prerequisites:
                    </span>{' '}
                    {item.major.prerequisites}
                  </p>
                  <p className="pt-1 font-semibold text-blue-600 dark:text-blue-400">
                    {isSelected
                      ? 'Filtering universities for this major'
                      : 'Filter international universities →'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 2: Data-Driven Career Path Visualization */}
      <CareerPathVisualization
        normalizedScores={result.normalizedScores}
        topCode={result.topCode}
        archetypeTitle={result.archetype.title}
        targetAtar={liveTargetAtar}
        credentialDisplay={liveCredDisplay}
        subjectTrack={result.setup.subjectTrack}
        topMajors={dynamicMajors}
        preferredRegion={regionFilter}
        selectedMajorId={selectedMajorId}
        onSelectMajorForFilter={(majorId) => {
          setSelectedMajorId(majorId);
          universitiesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />

      {/* Section 3: International University Recommendations (Score & Dorm Based) */}
      <section ref={universitiesSectionRef} className="pt-2">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
                03. Recommended International Universities ({liveCredConfig.shortLabel} &amp; Dorm Fit)
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Switch credential (ATAR, SAT, IB, A-Levels, GPA) and adjust the live simulator to
                preview admission tiers and Year 1 on-campus housing options.
              </p>
            </div>

            {/* Live Multi-Credential Simulator */}
            <div className="w-full lg:w-[420px] shrink-0 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
              <div className="flex flex-wrap gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
                {CREDENTIAL_ORDER.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleSwitchLiveCredential(type)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      liveCredentialType === type
                        ? 'bg-slate-900 dark:bg-blue-600 text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {CREDENTIAL_CONFIGS[type].shortLabel}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="result-score-slider"
                  className="font-semibold text-slate-700 dark:text-slate-200"
                >
                  Simulate {liveCredConfig.shortLabel} Score
                </label>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  {liveCredDisplay}
                  {liveCredentialType !== 'ATAR' && (
                    <span className="text-slate-500 dark:text-slate-400 font-medium ml-1">
                      (≈ {liveTargetAtar.toFixed(1)} ATAR)
                    </span>
                  )}
                </span>
              </div>
              <input
                id="result-score-slider"
                type="range"
                min={liveCredConfig.min}
                max={liveCredConfig.max}
                step={liveCredConfig.step}
                value={liveCredentialScore}
                onChange={(e) => handleLiveScoreChange(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setRegionFilter(region)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    regionFilter === region
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
              {TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    typeFilter === type
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
              {(['All', 'Guaranteed Year 1'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDormFilter(option)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    dormFilter === option
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{option === 'All' ? 'All Housing' : 'Guaranteed Year 1 Dorm'}</span>
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto tabular-nums">
              Showing {filteredUniversities.length} matching universities
            </span>
          </div>
        </div>

        {filteredUniversities.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center">
            <p className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              No universities match every active filter simultaneously
            </p>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Try expanding your region or dorm filter, or clearing the single-major selection to view
              more international options.
            </p>
            <button
              type="button"
              onClick={() => {
                setRegionFilter('All');
                setTypeFilter('All');
                setDormFilter('All');
                setSelectedMajorId(null);
              }}
              className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredUniversities.map((match, idx) => {
              const { university: uni } = match;
              const isCompared = compareIds.includes(uni.id);

              return (
                <article
                  key={uni.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="truncate">
                        {uni.city}, {uni.country}
                      </span>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums shrink-0">
                        {match.matchPercent}% Fit
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {idx < 3 && (
                        <Award
                          className="w-4 h-4 text-amber-500 inline-block mr-1.5 -mt-0.5"
                          aria-hidden="true"
                        />
                      )}
                      {uni.shortName}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {match.fitReasons[0]}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block">
                          {liveCredConfig.shortLabel} Entry Band
                        </span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                          {formatAtarBandInCredential(
                            liveCredentialType,
                            uni.minAtar,
                            uni.maxAtar
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block">
                          Admission Tier
                        </span>
                        <div className="mt-0.5">{renderStatus(match.admissionStatus)}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block">
                          Est. Tuition
                        </span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                          ~${uni.tuitionApproxUsdK}k USD/yr
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block">
                          Min IELTS
                        </span>
                        <span className="font-mono font-medium text-slate-700 dark:text-slate-200">
                          {uni.ieltsMin}
                        </span>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <Home className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                            <span>On-Campus Dorm</span>
                          </span>
                          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                            {uni.dormCostNote}
                          </span>
                        </div>
                        <p className="mt-0.5 font-semibold text-slate-900 dark:text-slate-100">
                          {uni.dormAvailability}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {uni.satNote}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleCompare(uni.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        isCompared
                          ? 'bg-slate-900 dark:bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {isCompared ? (
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onInspectUniversity(match)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors whitespace-nowrap shrink-0"
                    >
                      View Details
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Section 4: Personalized Score, English & Dorm Study Timeline Planner */}
      <StudyTimelinePlanner
        resultId={result.id}
        setup={{
          ...result.setup,
          credentialType: liveCredentialType,
          credentialScore: liveCredentialScore,
          targetAtar: liveTargetAtar,
          preferredRegion: regionFilter,
        }}
        topMajorName={topFiveMajors[0]?.major.name}
        topUniversityName={filteredUniversities[0]?.university.shortName}
        topUniversityIelts={filteredUniversities[0]?.university.ieltsMin}
      />
    </div>
  );
};
