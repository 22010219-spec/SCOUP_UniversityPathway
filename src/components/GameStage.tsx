import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { DREAM_GOALS, QUIZ_QUESTIONS, RIASEC_META } from '../data/quizData';
import {
  CredentialType,
  PriorityPreferences,
  QuizChoice,
  RiasecKey,
  RiasecVector,
} from '../types/game';
import {
  CREDENTIAL_CONFIGS,
  CREDENTIAL_ORDER,
  atarToCredential,
  credentialToAtar,
  formatCredentialValue,
} from '../utils/credentialConverter';
import { soundFX } from '../utils/soundEffects';

export type GameStepKind = 'SCENARIO' | 'DREAM_RANKER' | 'CALIBRATION';

interface GameStageProps {
  currentQuestionIndex: number;
  stepKind: GameStepKind;
  selectedAnswers: Record<number, string>;
  selectedDreamIds: string[];
  liveScores: RiasecVector;
  priorities: PriorityPreferences;
  credentialType: CredentialType;
  credentialScore: number;
  targetAtar: number;
  onSelectAnswer: (questionId: number, choice: QuizChoice) => void;
  onToggleDream: (dreamId: string) => void;
  onContinueFromDreams: () => void;
  onBack: () => void;
  onUpdatePriorities: (next: PriorityPreferences) => void;
  onUpdateCredential: (type: CredentialType, score: number, targetAtar: number) => void;
  onCompleteGame: () => void;
}

const TRAIT_ORDER: RiasecKey[] = ['R', 'I', 'A', 'S', 'E', 'C'];

export const GameStage: React.FC<GameStageProps> = ({
  currentQuestionIndex,
  stepKind,
  selectedAnswers,
  selectedDreamIds,
  liveScores,
  priorities,
  credentialType,
  credentialScore,
  targetAtar,
  onSelectAnswer,
  onToggleDream,
  onContinueFromDreams,
  onBack,
  onUpdatePriorities,
  onUpdateCredential,
  onCompleteGame,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(soundFX.isEnabled());
  const [recentGain, setRecentGain] = useState<string | null>(null);
  const [lockedChoiceId, setLockedChoiceId] = useState<string | null>(null);

  const totalSteps = QUIZ_QUESTIONS.length + 2; // 8 scenarios + 1 Dream Ranker + 1 Calibration
  const currentStepNumber =
    stepKind === 'SCENARIO'
      ? currentQuestionIndex + 1
      : stepKind === 'DREAM_RANKER'
        ? QUIZ_QUESTIONS.length + 1
        : totalSteps;
  const progressPercent = Math.round((currentStepNumber / totalSteps) * 100);
  const question = QUIZ_QUESTIONS[currentQuestionIndex];
  const existingChoiceId = question ? selectedAnswers[question.id] : undefined;

  const maxTraitVal = Math.max(...Object.values(liveScores), 6);
  const credConfig = CREDENTIAL_CONFIGS[credentialType];

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.setEnabled(next);
    if (next) soundFX.playSelect();
  };

  const triggerChoice = (choice: QuizChoice) => {
    if (!question || lockedChoiceId) return;
    setLockedChoiceId(choice.id);
    setRecentGain(choice.gainSummary);

    const isEndOfStage = (currentQuestionIndex + 1) % 4 === 0;
    if (isEndOfStage) {
      soundFX.playStageComplete();
    } else {
      soundFX.playSelect();
    }

    window.setTimeout(() => {
      setLockedChoiceId(null);
      setRecentGain(null);
      onSelectAnswer(question.id, choice);
    }, 180);
  };

  useEffect(() => {
    if (stepKind !== 'SCENARIO' || !question) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const idx = ['1', '2', '3', '4'].indexOf(e.key);
      if (idx !== -1 && question.choices[idx]) {
        e.preventDefault();
        triggerChoice(question.choices[idx]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, stepKind, lockedChoiceId, question]);

  const stageLabel =
    stepKind === 'SCENARIO' && question
      ? question.stageTitle
      : stepKind === 'DREAM_RANKER'
        ? 'Stage 3 · Dream Ranker'
        : 'Final Stage · Scores, Dorms & Priorities';

  const handleSelectCredType = (nextType: CredentialType) => {
    const converted = atarToCredential(nextType, targetAtar);
    const syncedAtar = credentialToAtar(nextType, converted);
    onUpdateCredential(nextType, converted, syncedAtar);
  };

  const handleCredScoreChange = (rawVal: number) => {
    const score = credentialType === 'ATAR' && rawVal >= 99.5 ? 99.95 : rawVal;
    const syncedAtar = credentialToAtar(credentialType, score);
    onUpdateCredential(credentialType, score, syncedAtar);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Unobtrusive Top Game HUD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{stageLabel}</span>
            <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">
              ·
            </span>
            <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
              Step {String(currentStepNumber).padStart(2, '0')}/{totalSteps}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {recentGain && (
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {recentGain}
              </span>
            )}
            <button
              type="button"
              onClick={handleToggleSound}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-label={soundEnabled ? 'Mute game sound' : 'Enable game sound'}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              )}
              <span>{soundEnabled ? 'Sound: On' : 'Sound: Off'}</span>
            </button>
          </div>
        </div>

        <div className="mt-3 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-200 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Active Play Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
          {/* STEP TYPE 1: INTERACTIVE SCENARIO CARDS */}
          {stepKind === 'SCENARIO' && question && (
            <>
              <div className="mb-6">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
                  {question.scenario}
                </p>
                <h2 className="font-display text-2xl sm:text-[28px] font-bold text-slate-900 dark:text-slate-50 leading-snug [text-wrap:balance]">
                  {question.prompt}
                </h2>
              </div>

              <div className="space-y-3" role="radiogroup" aria-label={question.prompt}>
                {question.choices.map((choice, idx) => {
                  const isSelected = lockedChoiceId === choice.id || existingChoiceId === choice.id;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => triggerChoice(choice)}
                      className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-150 flex items-start gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        isSelected
                          ? 'bg-blue-50/70 dark:bg-blue-950/50 border-blue-600 shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 active:scale-[0.99]'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg font-mono text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5 transition-colors tabular-nums ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                          {choice.label}
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {choice.subtext}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playBack();
                    onBack();
                  }}
                  disabled={currentQuestionIndex === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Back</span>
                </button>
                <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
                  Tip: Press keys 1–4 to pick a scenario card quickly
                </p>
              </div>
            </>
          )}

          {/* STEP TYPE 2: INTERACTIVE DREAM RANKER */}
          {stepKind === 'DREAM_RANKER' && (
            <>
              <div className="mb-6">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
                  Interactive Check: Long-Term Ambitions &amp; Career Dreams
                </p>
                <h2 className="font-display text-2xl sm:text-[28px] font-bold text-slate-900 dark:text-slate-50 leading-snug [text-wrap:balance]">
                  Pick and rank your top 2 ambitions after university
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Click in order to assign{' '}
                  <strong className="text-slate-900 dark:text-slate-100">Rank 1</strong> (Primary
                  Dream) and <strong className="text-slate-900 dark:text-slate-100">Rank 2</strong>{' '}
                  (Secondary Passion). Click any selected card again to adjust your order.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {DREAM_GOALS.map((goal) => {
                  const rankIndex = selectedDreamIds.indexOf(goal.id);
                  const isPicked = rankIndex !== -1;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => {
                        soundFX.playSelect();
                        onToggleDream(goal.id);
                      }}
                      className={`text-left p-4 sm:p-5 rounded-xl border transition-all duration-150 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        isPicked
                          ? 'bg-blue-50/70 dark:bg-blue-950/50 border-blue-600 shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`font-mono text-xs font-bold tabular-nums ${
                              isPicked
                                ? 'text-blue-700 dark:text-blue-400'
                                : 'text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            {rankIndex === 0
                              ? '★ RANK 1 · PRIMARY DREAM'
                              : rankIndex === 1
                                ? '◆ RANK 2 · PARALLEL PASSION'
                                : 'TAP TO SELECT'}
                          </span>
                          {isPicked && (
                            <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                              {rankIndex + 1}
                            </span>
                          )}
                        </div>
                        <p className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                          {goal.title}
                        </p>
                        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {goal.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playBack();
                    onBack();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Back to Question 8</span>
                </button>

                <button
                  type="button"
                  disabled={selectedDreamIds.length === 0}
                  onClick={() => {
                    soundFX.playStageComplete();
                    onContinueFromDreams();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-45 disabled:pointer-events-none transition-all duration-150 whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Continue ({selectedDreamIds.length}/2 dreams selected)</span>
                </button>
              </div>
            </>
          )}

          {/* STEP TYPE 3: INTERACTIVE CREDENTIAL, DORM & PRIORITY MATRIX */}
          {stepKind === 'CALIBRATION' && (
            <>
              <div className="mb-6">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
                  Interactive Calibration: Academic Credential, Campus Housing &amp; Priorities
                </p>
                <h2 className="font-display text-2xl sm:text-[28px] font-bold text-slate-900 dark:text-slate-50 leading-snug [text-wrap:balance]">
                  Fine-tune your target score, dorm preference, and study style
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Switch between ATAR, SAT, IB, A-Levels, or GPA and adjust the sliders so we rank
                  universities, scholarships, and on-campus housing accurately.
                </p>
              </div>

              <div className="space-y-6 py-2">
                {/* Live Credential & Score confirmation slider */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Your Academic Credential
                    </span>
                    <div className="flex flex-wrap gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
                      {CREDENTIAL_ORDER.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleSelectCredType(type)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                            credentialType === type
                              ? 'bg-slate-900 dark:bg-blue-600 text-white font-semibold'
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {CREDENTIAL_CONFIGS[type].shortLabel}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label
                      htmlFor="calib-score"
                      className="text-xs font-medium text-slate-600 dark:text-slate-300"
                    >
                      {credConfig.subtitle}
                    </label>
                    <div className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                      {formatCredentialValue(credentialType, credentialScore)}
                      {credentialType !== 'ATAR' && (
                        <span className="ml-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                          (≈ {targetAtar.toFixed(2)} ATAR)
                        </span>
                      )}
                    </div>
                  </div>
                  <input
                    id="calib-score"
                    type="range"
                    min={credConfig.min}
                    max={credConfig.max}
                    step={credConfig.step}
                    value={credentialScore}
                    onChange={(e) => handleCredScoreChange(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>{credConfig.ticks[0]}</span>
                    <span>{credConfig.ticks[1]}</span>
                    <span>{credConfig.ticks[2]}</span>
                  </div>
                </div>

                {/* Slider 1 */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <label
                      htmlFor="slider-practice"
                      className="text-sm font-semibold text-slate-900 dark:text-slate-100"
                    >
                      Learning Style: Academic Research vs. Hands-On Co-op
                    </label>
                    <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 tabular-nums shrink-0">
                      {priorities.practiceVsResearch}% Hands-on
                    </span>
                  </div>
                  <input
                    id="slider-practice"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={priorities.practiceVsResearch}
                    onChange={(e) =>
                      onUpdatePriorities({
                        ...priorities,
                        practiceVsResearch: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    <span>Deep Research &amp; Grad School</span>
                    <span>Balanced</span>
                    <span>Industry Co-op &amp; Studio</span>
                  </div>
                </div>

                {/* Slider 2 */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <label
                      htmlFor="slider-budget"
                      className="text-sm font-semibold text-slate-900 dark:text-slate-100"
                    >
                      Financial Strategy: Scholarship Value vs. Top Global Rank
                    </label>
                    <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 tabular-nums shrink-0">
                      Rank Priority: {priorities.budgetSensitivity}/100
                    </span>
                  </div>
                  <input
                    id="slider-budget"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={priorities.budgetSensitivity}
                    onChange={(e) =>
                      onUpdatePriorities({
                        ...priorities,
                        budgetSensitivity: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    <span>Maximize Scholarships &amp; ROI</span>
                    <span>Balanced</span>
                    <span>Global Top 20–50 Prestige</span>
                  </div>
                </div>

                {/* Slider 3 */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <label
                      htmlFor="slider-energy"
                      className="text-sm font-semibold text-slate-900 dark:text-slate-100"
                    >
                      Campus Pace: Quiet Study Focus vs. Bustling Metropolis
                    </label>
                    <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 tabular-nums shrink-0">
                      Energy: {priorities.campusEnergy}/100
                    </span>
                  </div>
                  <input
                    id="slider-energy"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={priorities.campusEnergy}
                    onChange={(e) =>
                      onUpdatePriorities({
                        ...priorities,
                        campusEnergy: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    <span>Focused University Town</span>
                    <span>Balanced</span>
                    <span>Major Hubs (Sydney, London, Melb)</span>
                  </div>
                </div>

                {/* Slider 4: Dorm / Campus Housing Preference */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <label
                      htmlFor="slider-dorm"
                      className="text-sm font-semibold text-slate-900 dark:text-slate-100"
                    >
                      Campus Housing: Off-Campus Independence vs. Guaranteed Year 1 Dorm
                    </label>
                    <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 tabular-nums shrink-0">
                      Dorm Priority: {priorities.dormPreference}/100
                    </span>
                  </div>
                  <input
                    id="slider-dorm"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={priorities.dormPreference}
                    onChange={(e) =>
                      onUpdatePriorities({
                        ...priorities,
                        dormPreference: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    <span>Flexible Off-Campus Studio</span>
                    <span>Balanced</span>
                    <span>Guaranteed On-Campus Dorms</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playBack();
                    onBack();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Review Dream Ranking</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playVictory();
                    onCompleteGame();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <span>Analyze Results &amp; Match Universities</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Side Live Personality & Dream Energy Meter */}
        <aside className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
              Emerging RIASEC Profile
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Updates live as you respond to scenarios and rank your dreams.
            </p>

            <div className="mt-4 space-y-3.5">
              {TRAIT_ORDER.map((key) => {
                const meta = RIASEC_META[key];
                const value = liveScores[key];
                const widthPercent = Math.min(100, Math.round((value / maxTraitVal) * 100));
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {meta.code} · {meta.name}
                      </span>
                      <span className="font-mono font-semibold text-slate-600 dark:text-slate-400 tabular-nums">
                        {Math.round(value)} pts
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{
                          width: `${Math.max(value > 0 ? 8 : 0, widthPercent)}%`,
                          backgroundColor: meta.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Current Score Target
              </p>
              <p className="mt-0.5 font-mono text-lg font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                {formatCredentialValue(credentialType, credentialScore)}
              </p>
              {credentialType !== 'ATAR' && (
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                  ≈ {targetAtar.toFixed(2)} ATAR equivalent
                </p>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
              Dorm priority: <strong className="text-slate-900 dark:text-slate-200">{priorities.dormPreference}/100</strong>
            </p>

            {selectedDreamIds.length > 0 && (
              <div className="pt-2 space-y-1">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Selected Dreams
                </p>
                {selectedDreamIds.map((id, idx) => {
                  const goal = DREAM_GOALS.find((g) => g.id === id);
                  return (
                    goal && (
                      <p key={id} className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {idx + 1}. {goal.title}
                      </p>
                    )
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
