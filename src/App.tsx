import { useEffect, useMemo, useState } from 'react';
import { CampusFacilitiesView } from './components/CampusFacilitiesView';
import { ComparisonDrawer } from './components/ComparisonDrawer';
import { MajorsLibrary, UniversitiesDirectory } from './components/ExplorerViews';
import { FaqCategory, FaqView } from './components/FaqView';
import { GameStage, GameStepKind } from './components/GameStage';
import { Header } from './components/Header';
import { ResultSummary } from './components/ResultSummary';
import { TitleMenu } from './components/TitleMenu';
import { UniversityDetailModal } from './components/UniversityDetailModal';
import { QUIZ_QUESTIONS } from './data/quizData';
import {
  AppView,
  GameResultSnapshot,
  GameState,
  MatchedUniversity,
  PlayerSetup,
  PriorityPreferences,
  QuizChoice,
  RiasecKey,
  RiasecVector,
  UniversityItem,
} from './types/game';
import { applyDreamBoost, buildGameResult, createEmptyRiasec } from './utils/matchingEngine';

const STORAGE_KEY_HISTORY = 'unicompass_v4_en';

const DEFAULT_SETUP: PlayerSetup = {
  subjectTrack: 'Undecided',
  credentialType: 'ATAR',
  credentialScore: 85.0,
  targetAtar: 85.0,
  preferredRegion: 'All',
};

const DEFAULT_PRIORITIES: PriorityPreferences = {
  practiceVsResearch: 60,
  budgetSensitivity: 45,
  campusEnergy: 65,
  dormPreference: 70,
};

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('GAME');
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');

  const [setup, setSetup] = useState<PlayerSetup>(DEFAULT_SETUP);
  const [priorities, setPriorities] = useState<PriorityPreferences>(DEFAULT_PRIORITIES);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [stepKind, setStepKind] = useState<GameStepKind>('SCENARIO');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [selectedDreamIds, setSelectedDreamIds] = useState<string[]>([]);

  const [history, setHistory] = useState<GameResultSnapshot[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  });

  const [activeResult, setActiveResult] = useState<GameResultSnapshot | null>(() => {
    return history.length > 0 ? history[0] : null;
  });

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [facilitiesUniversityId, setFacilitiesUniversityId] = useState<string>('All');
  const [faqCategory, setFaqCategory] = useState<'All' | FaqCategory>('All');

  const [inspectedUniversity, setInspectedUniversity] = useState<{
    university: UniversityItem;
    match?: MatchedUniversity;
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 6)));
    } catch {
      // Ignore storage quota errors
    }
  }, [history]);

  // Compute raw quiz RIASEC vector + live dream boost
  const rawQuizScores = useMemo<RiasecVector>(() => {
    const scores = createEmptyRiasec();
    for (const q of QUIZ_QUESTIONS) {
      const choiceId = selectedAnswers[q.id];
      if (!choiceId) continue;
      const choice = q.choices.find((c) => c.id === choiceId);
      if (!choice) continue;
      (Object.keys(choice.weights) as RiasecKey[]).forEach((trait) => {
        scores[trait] += choice.weights[trait] ?? 0;
      });
    }
    return scores;
  }, [selectedAnswers]);

  const liveScores = useMemo<RiasecVector>(() => {
    return applyDreamBoost(rawQuizScores, selectedDreamIds);
  }, [rawQuizScores, selectedDreamIds]);

  const handleStartGame = (nextSetup: PlayerSetup) => {
    setSetup(nextSetup);
    setSelectedAnswers({});
    setSelectedDreamIds([]);
    setCurrentQuestionIndex(0);
    setStepKind('SCENARIO');
    setPriorities(DEFAULT_PRIORITIES);
    setActiveView('GAME');
    setGameState('PLAYING');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAnswer = (questionId: number, choice: QuizChoice) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: choice.id }));
    if (currentQuestionIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setStepKind('DREAM_RANKER');
    }
  };

  const handleToggleDream = (dreamId: string) => {
    setSelectedDreamIds((prev) => {
      if (prev.includes(dreamId)) {
        return prev.filter((id) => id !== dreamId);
      }
      if (prev.length >= 2) {
        return [prev[0], dreamId];
      }
      return [...prev, dreamId];
    });
  };

  const handleContinueFromDreams = () => {
    setStepKind('CALIBRATION');
  };

  const handleBackInQuiz = () => {
    if (stepKind === 'CALIBRATION') {
      setStepKind('DREAM_RANKER');
      return;
    }
    if (stepKind === 'DREAM_RANKER') {
      setStepKind('SCENARIO');
      setCurrentQuestionIndex(QUIZ_QUESTIONS.length - 1);
      return;
    }
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleCompleteGame = () => {
    const snapshot = buildGameResult(rawQuizScores, setup, priorities, selectedDreamIds);
    setActiveResult(snapshot);
    setHistory((prev) => [snapshot, ...prev].slice(0, 6));
    setGameState('RESULT_SUMMARY');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayAgain = () => {
    setActiveView('GAME');
    setGameState('TITLE_MENU');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewLastResult = () => {
    if (history.length > 0) {
      setActiveResult(history[0]);
      setActiveView('GAME');
      setGameState('RESULT_SUMMARY');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHeaderPrimaryAction = () => {
    if (activeView !== 'GAME' && activeResult) {
      setActiveView('GAME');
      setGameState('RESULT_SUMMARY');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (gameState === 'TITLE_MENU') {
      handleStartGame(setup);
      return;
    }
    handlePlayAgain();
  };

  const handleToggleCompare = (uniId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(uniId)) {
        return prev.filter((id) => id !== uniId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), uniId];
      }
      return [...prev, uniId];
    });
  };

  const handleExploreFacilities = (universityId = 'All') => {
    setFacilitiesUniversityId(universityId);
    setInspectedUniversity(null);
    setIsCompareOpen(false);
    setActiveView('FACILITIES');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFaq = (category: 'All' | FaqCategory = 'All') => {
    setFaqCategory(category);
    setInspectedUniversity(null);
    setIsCompareOpen(false);
    setActiveView('FAQ');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeCredentialType = activeResult?.setup.credentialType ?? setup.credentialType;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Header
        activeView={activeView}
        gameState={gameState}
        hasSavedResult={Boolean(activeResult)}
        compareCount={compareIds.length}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onPrimaryAction={handleHeaderPrimaryAction}
        onOpenCompare={() => setIsCompareOpen(true)}
      />

      <main className="flex-1">
        {activeView === 'GAME' && gameState === 'TITLE_MENU' && (
          <TitleMenu
            initialSetup={setup}
            hasSavedResult={Boolean(activeResult)}
            onStartGame={handleStartGame}
            onViewLastResult={handleViewLastResult}
          />
        )}

        {activeView === 'GAME' && gameState === 'PLAYING' && (
          <GameStage
            currentQuestionIndex={currentQuestionIndex}
            stepKind={stepKind}
            selectedAnswers={selectedAnswers}
            selectedDreamIds={selectedDreamIds}
            liveScores={liveScores}
            priorities={priorities}
            credentialType={setup.credentialType}
            credentialScore={setup.credentialScore}
            targetAtar={setup.targetAtar}
            onSelectAnswer={handleSelectAnswer}
            onToggleDream={handleToggleDream}
            onContinueFromDreams={handleContinueFromDreams}
            onBack={handleBackInQuiz}
            onUpdatePriorities={setPriorities}
            onUpdateCredential={(nextType, nextScore, nextAtar) =>
              setSetup((prev) => ({
                ...prev,
                credentialType: nextType,
                credentialScore: nextScore,
                targetAtar: nextAtar,
              }))
            }
            onCompleteGame={handleCompleteGame}
          />
        )}

        {activeView === 'GAME' && gameState === 'RESULT_SUMMARY' && activeResult && (
          <ResultSummary
            result={activeResult}
            history={history}
            compareIds={compareIds}
            onPlayAgain={handlePlayAgain}
            onSelectHistory={(snap) => setActiveResult(snap)}
            onToggleCompare={handleToggleCompare}
            onInspectUniversity={(match) =>
              setInspectedUniversity({ university: match.university, match })
            }
          />
        )}

        {activeView === 'MAJORS' && (
          <MajorsLibrary
            onStartQuiz={() => {
              setActiveView('GAME');
              setGameState('TITLE_MENU');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'UNIVERSITIES' && (
          <UniversitiesDirectory
            compareIds={compareIds}
            onToggleCompare={handleToggleCompare}
            onInspectUniversity={(uni) => setInspectedUniversity({ university: uni })}
          />
        )}

        {activeView === 'FACILITIES' && (
          <CampusFacilitiesView
            selectedUniversityId={facilitiesUniversityId}
            onSelectUniversityId={setFacilitiesUniversityId}
            compareIds={compareIds}
            onToggleCompare={handleToggleCompare}
            onInspectUniversity={(uni) => setInspectedUniversity({ university: uni })}
          />
        )}

        {activeView === 'FAQ' && (
          <FaqView
            key={faqCategory}
            initialCategory={faqCategory}
            onStartQuiz={() => {
              setActiveView('GAME');
              setGameState('TITLE_MENU');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreUniversities={() => {
              setActiveView('UNIVERSITIES');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreFacilities={() => handleExploreFacilities('All')}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 mt-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              UniCompass · Interactive RIASEC personality quest, international credentials (ATAR, SAT,
              IB, A-Levels, GPA), campus facilities &amp; dorm matcher.
            </p>
            <p className="tabular-nums">
              Entry equivalencies, IELTS requirements, tuition &amp; dorm rates are indicative for
              recent intakes.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Help &amp; Methodology:
              </span>
              <button
                type="button"
                onClick={() => handleOpenFaq('University Admissions')}
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
              >
                University Admissions FAQ
              </button>
              <button
                type="button"
                onClick={() => handleOpenFaq('ATAR & Score Conversion')}
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
              >
                ATAR &amp; SAT Conversion Guide
              </button>
              <button
                type="button"
                onClick={() => handleOpenFaq('RIASEC Methodology')}
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
              >
                RIASEC Methodology
              </button>
              <button
                type="button"
                onClick={() => handleOpenFaq('Dorms & Campus Facilities')}
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
              >
                Dorms &amp; Music Rooms FAQ
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleOpenFaq('All')}
              className="font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline whitespace-nowrap"
            >
              Open Full FAQ &amp; Score Converter →
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2 text-center md:text-left">
            <p>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Credits:</span>{' '}
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                Trần Hải Yến · Võ Phan Khang · Trần Nguyễn Anh Thư · Trần Ngọc Gia Hân
              </span>
            </p>
            <p>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Supervisors:
              </span>{' '}
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                Hồ Quang Tùng &amp; Nguyễn Trung Tín
              </span>
            </p>
          </div>
        </div>
      </footer>

      <UniversityDetailModal
        university={inspectedUniversity?.university ?? null}
        credentialType={activeCredentialType}
        matchPercent={inspectedUniversity?.match?.matchPercent}
        admissionStatus={inspectedUniversity?.match?.admissionStatus}
        fitReasons={inspectedUniversity?.match?.fitReasons}
        isCompared={
          inspectedUniversity ? compareIds.includes(inspectedUniversity.university.id) : false
        }
        onToggleCompare={handleToggleCompare}
        onExploreFacilities={handleExploreFacilities}
        onClose={() => setInspectedUniversity(null)}
      />

      <ComparisonDrawer
        isOpen={isCompareOpen}
        compareIds={compareIds}
        targetAtar={activeResult?.setup.targetAtar ?? setup.targetAtar}
        credentialType={activeCredentialType}
        onRemoveId={(id) => setCompareIds((prev) => prev.filter((item) => item !== id))}
        onClearAll={() => setCompareIds([])}
        onExploreFacilities={handleExploreFacilities}
        onClose={() => setIsCompareOpen(false)}
      />
    </div>
  );
}
