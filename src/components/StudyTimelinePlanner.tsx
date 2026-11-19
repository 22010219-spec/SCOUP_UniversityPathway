import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  Languages,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import {
  PlayerSetup,
  StudyMilestone,
  StudyMilestoneCategory,
} from '../types/game';
import { CREDENTIAL_CONFIGS, formatCredentialValue } from '../utils/credentialConverter';

interface StudyTimelinePlannerProps {
  resultId: string;
  setup: PlayerSetup;
  topMajorName?: string;
  topUniversityName?: string;
  topUniversityIelts?: string;
}

const STORAGE_KEY_PREFIX = 'unicompass_study_timeline_v3_en_';

const CATEGORIES: Array<'All' | StudyMilestoneCategory> = [
  'All',
  'Score & Exam Prep',
  'English Exam',
  'Applications & Scholarships',
];

const CATEGORY_OPTIONS: StudyMilestoneCategory[] = [
  'Score & Exam Prep',
  'English Exam',
  'Applications & Scholarships',
];

function addMonthsIso(monthsFromNow: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsFromNow);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(Math.min(28, d.getDate())).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return 'No date set';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const [y, m, d] = parts;
  return `${y}-${m}-${d}`;
}

function buildStarterMilestones(
  setup: PlayerSetup,
  topMajorName?: string,
  topUniversityName?: string,
  topUniversityIelts?: string
): StudyMilestone[] {
  const ieltsGoal = topUniversityIelts || '6.5 (no band below 6.0)';
  const needsPortfolio = setup.subjectTrack === 'Arts & Portfolio';
  const needsMedicalTest = setup.subjectTrack === 'Biology & Chemistry' && setup.targetAtar >= 90;
  const credShort = CREDENTIAL_CONFIGS[setup.credentialType].shortLabel;
  const scoreDisplay = formatCredentialValue(setup.credentialType, setup.credentialScore);

  const diagnosticTitle =
    setup.credentialType === 'SAT'
      ? `Complete Bluebook Digital SAT Practice Test #1 (${setup.subjectTrack})`
      : setup.credentialType === 'IB'
        ? `Run IB HL/SL Internal Assessment & Mock Check (${setup.subjectTrack})`
        : setup.credentialType === 'A_LEVEL'
          ? `Complete Cambridge / Edexcel A-Level Past Paper Diagnostic`
          : setup.credentialType === 'GPA'
            ? `Audit Term GPA & AP/Honors Course Rigor (${setup.subjectTrack})`
            : `Lock in core subjects (${setup.subjectTrack}) & run ATAR Diagnostic #1`;

  const sprintTitle =
    setup.credentialType === 'SAT'
      ? 'Sit Official Digital SAT & Lock In Target Math / RW Subscores'
      : setup.credentialType === 'IB'
        ? 'Final IB Extended Essay & Predicted Grades Lock-in'
        : setup.credentialType === 'A_LEVEL'
          ? 'Timed A-Level Paper Sprints & Final Predicted Grade Review'
          : setup.credentialType === 'GPA'
            ? 'Semester Finals & Weighted GPA Optimization Sprint'
            : 'Timed ATAR past-paper sprint & full-length trial examinations';

  const list: StudyMilestone[] = [
    {
      id: 'ms_cred_1',
      title: diagnosticTitle,
      category: 'Score & Exam Prep',
      targetDate: addMonthsIso(1),
      targetMetric: `Goal: ${scoreDisplay}`,
      notes: 'Identify weak topics across prerequisite subjects before full-speed past-paper sprints.',
      completed: false,
    },
    {
      id: 'ms_eng_1',
      title: 'Take diagnostic IELTS Academic / PTE Academic mock exam',
      category: 'English Exam',
      targetDate: addMonthsIso(2),
      targetMetric: `Entry Target: IELTS ${ieltsGoal}`,
      notes: 'Focus on academic Writing & Speaking if target universities require 6.0–6.5 sub-score minimums.',
      completed: false,
    },
    {
      id: 'ms_cred_2',
      title: sprintTitle,
      category: 'Score & Exam Prep',
      targetDate: addMonthsIso(4),
      targetMetric:
        setup.credentialType === 'ATAR'
          ? `Target ${scoreDisplay}`
          : `Target ${scoreDisplay} (≈ ${setup.targetAtar.toFixed(1)} ATAR)`,
      notes: topMajorName
        ? `Prioritize ${credShort} subscores and prerequisite units required for ${topMajorName}.`
        : 'Refine exam pacing and double down on high-scaling subject units.',
      completed: false,
    },
    {
      id: 'ms_eng_2',
      title: 'Sit official English proficiency exam for international admission',
      category: 'English Exam',
      targetDate: addMonthsIso(5),
      targetMetric: `Achieve IELTS ${ieltsGoal}`,
      notes: topUniversityName
        ? `Ensure valid test score report is ready ahead of ${topUniversityName} intake deadlines.`
        : 'Book 1–2 months ahead of application closing dates in case a retake is needed.',
      completed: false,
    },
    {
      id: 'ms_app_1',
      title: needsPortfolio
        ? 'Finalize Creative Portfolio, Scholarships & On-Campus Dorm Application'
        : needsMedicalTest
          ? 'Complete UCAT/ISAT prep, Merit Scholarships & Year 1 Dorm Booking'
          : 'Submit Transcripts, Direct Applications & First-Year Dorm Housing Form',
      category: 'Applications & Scholarships',
      targetDate: addMonthsIso(6),
      targetMetric:
        setup.targetAtar >= 85
          ? '20%–50% Merit Aid + Dorm Priority'
          : 'Main Round + Guaranteed Housing',
      notes: `Preferred destination: ${setup.preferredRegion}. Apply early for guaranteed Year 1 university dorms (many close 4–6 months before intake).`,
      completed: false,
    },
  ];

  return list;
}

export const StudyTimelinePlanner: React.FC<StudyTimelinePlannerProps> = ({
  resultId,
  setup,
  topMajorName,
  topUniversityName,
  topUniversityIelts,
}) => {
  const storageKey = `${STORAGE_KEY_PREFIX}${resultId}_${setup.credentialType}`;
  const credShort = CREDENTIAL_CONFIGS[setup.credentialType].shortLabel;
  const scoreDisplay = formatCredentialValue(setup.credentialType, setup.credentialScore);

  const [milestones, setMilestones] = useState<StudyMilestone[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore storage read error
    }
    return buildStarterMilestones(setup, topMajorName, topUniversityName, topUniversityIelts);
  });

  // Reload if user switches between saved result runs or switches credential
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMilestones(parsed);
          return;
        }
      }
    } catch {
      // Ignore
    }
    setMilestones(
      buildStarterMilestones(setup, topMajorName, topUniversityName, topUniversityIelts)
    );
  }, [storageKey, setup, topMajorName, topUniversityName, topUniversityIelts]);

  // Persist changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(milestones));
    } catch {
      // Ignore storage quota errors
    }
  }, [storageKey, milestones]);

  const [filterCategory, setFilterCategory] = useState<'All' | StudyMilestoneCategory>('All');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // Add Milestone Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StudyMilestoneCategory>('Score & Exam Prep');
  const [targetDate, setTargetDate] = useState(() => addMonthsIso(2));
  const [targetMetric, setTargetMetric] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const sortedMilestones = useMemo(() => {
    return [...milestones]
      .filter((m) => filterCategory === 'All' || m.category === filterCategory)
      .sort((a, b) => a.targetDate.localeCompare(b.targetDate));
  }, [milestones, filterCategory]);

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercent =
    milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  const handleToggleComplete = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleDelete = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleResetDefaults = () => {
    setMilestones(
      buildStarterMilestones(setup, topMajorName, topUniversityName, topUniversityIelts)
    );
  };

  const handleQuickPreset = (presetCategory: StudyMilestoneCategory) => {
    setCategory(presetCategory);
    if (presetCategory === 'Score & Exam Prep') {
      setTitle(
        setup.credentialType === 'SAT'
          ? 'Digital SAT Official Test Registration & Mock Sprint'
          : `${credShort} Subject-Specific Mock Exam Sprint`
      );
      setTargetMetric(`Reach ${scoreDisplay}`);
      setNotes('Focus on high-weight exam sections and review common calculation mistakes.');
    } else if (presetCategory === 'English Exam') {
      setTitle('Register & Sit Official IELTS / PTE Academic Exam');
      setTargetMetric(`IELTS ${topUniversityIelts || '6.5+'}`);
      setNotes('Run two timed full practice tests per week leading up to test day.');
    } else {
      setTitle('Submit University Application, Scholarship & Year 1 Dorm Form');
      setTargetMetric(topUniversityName ? `Target: ${topUniversityName}` : 'Submit Dossier + Dorm');
      setNotes('Prepare certified transcripts, personal statement, and housing deposit window.');
    }
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter a milestone or exam title.');
      return;
    }
    const newItem: StudyMilestone = {
      id: `ms_${Date.now()}`,
      title: title.trim(),
      category,
      targetDate: targetDate || addMonthsIso(1),
      targetMetric: targetMetric.trim() || `Target ${scoreDisplay}`,
      notes: notes.trim(),
      completed: false,
    };
    setMilestones((prev) => [...prev, newItem]);
    setTitle('');
    setTargetMetric('');
    setNotes('');
    setFormError(null);
    setIsFormOpen(false);
  };

  return (
    <section className="pt-2">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        {/* Header & Overall Progress */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>
                Personalized Roadmap for {scoreDisplay}
                {setup.credentialType !== 'ATAR' ? ` (≈ ${setup.targetAtar.toFixed(2)} ATAR)` : ''}
              </span>
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
              04. {credShort}, English &amp; Dorm Application Timeline
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
              Track your {credShort} revision sprints, IELTS/PTE exam dates, and university &amp;
              dorm application deadlines. Add custom milestones or tailor dates to your schedule.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Suggestions</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFormError(null);
                setIsFormOpen((prev) => !prev);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>{isFormOpen ? 'Close Form' : 'Add Milestone'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Quick Add Presets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Timeline Completion
              </span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                {completedCount}/{milestones.length} milestones ({progressPercent}%)
              </span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
              Quick add:
            </span>
            <button
              type="button"
              onClick={() => handleQuickPreset('Score & Exam Prep')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>+ {credShort} Prep</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('English Exam')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              <Languages
                className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
              <span>+ IELTS / PTE Exam</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Applications & Scholarships')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <span>+ Applications &amp; Dorm</span>
            </button>
          </div>
        </div>

        {/* Interactive Add Milestone Form */}
        {isFormOpen && (
          <form
            onSubmit={handleAddSubmit}
            className="p-5 sm:p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
                Create New Study Milestone
              </h3>
              <div className="flex flex-wrap items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      category === cat
                        ? 'bg-slate-900 dark:bg-blue-600 text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <label
                  htmlFor="ms-title"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Milestone / Exam Title *
                </label>
                <input
                  id="ms-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`e.g., ${credShort} Mock Paper #2`}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="md:col-span-3">
                <label
                  htmlFor="ms-date"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Target Date
                </label>
                <input
                  id="ms-date"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 dark:[color-scheme:dark] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="md:col-span-4">
                <label
                  htmlFor="ms-metric"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Target Score / Goal
                </label>
                <input
                  id="ms-metric"
                  type="text"
                  value={targetMetric}
                  onChange={(e) => setTargetMetric(e.target.value)}
                  placeholder={`e.g., Reach ${scoreDisplay} / IELTS 7.0`}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="ms-notes"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Actionable Notes
              </label>
              <input
                id="ms-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Complete 3 timed past papers per week and review essay feedback..."
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {formError && (
              <p className="text-xs font-semibold text-red-600 dark:text-red-400">{formError}</p>
            )}

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Save to Timeline
              </button>
            </div>
          </form>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full w-fit">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterCategory === cat
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Chronological Timeline List */}
        {sortedMilestones.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No milestones in this category yet
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Click "Add Milestone" or choose one of the quick-add presets above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            {sortedMilestones.map((item) => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors ${
                  item.completed
                    ? 'bg-slate-50/80 dark:bg-slate-800/40'
                    : 'bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(item.id)}
                    aria-label={
                      item.completed
                        ? `Mark incomplete: ${item.title}`
                        : `Mark complete: ${item.title}`
                    }
                    className="mt-0.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-full"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    {/* Unboxed typographic metadata row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                        {formatDisplayDate(item.targetDate)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-blue-700 dark:text-blue-400">
                        {item.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                        {item.targetMetric}
                      </span>
                      {item.completed && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            Completed
                          </span>
                        </>
                      )}
                    </div>

                    <h3
                      className={`mt-1 text-base font-bold leading-snug ${
                        item.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {item.title}
                    </h3>

                    {item.notes && (
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(item.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      item.completed
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {item.completed ? 'Done' : 'Complete'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    aria-label={`Delete milestone ${item.title}`}
                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
