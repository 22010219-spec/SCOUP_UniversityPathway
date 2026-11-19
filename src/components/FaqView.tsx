import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Calculator,
  ChevronDown,
  Compass,
  GraduationCap,
  HelpCircle,
  Home,
  Search,
} from 'lucide-react';
import { RIASEC_META } from '../data/quizData';
import { CredentialType, RiasecKey } from '../types/game';
import {
  CREDENTIAL_CONFIGS,
  CREDENTIAL_ORDER,
  atarToCredential,
  credentialToAtar,
  formatCredentialShort,
  formatCredentialValue,
} from '../utils/credentialConverter';

export type FaqCategory =
  | 'University Admissions'
  | 'ATAR & Score Conversion'
  | 'RIASEC Methodology'
  | 'Dorms & Campus Facilities';

interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  highlights?: string[];
}

interface FaqViewProps {
  initialCategory?: 'All' | FaqCategory;
  onStartQuiz: () => void;
  onExploreUniversities: () => void;
  onExploreFacilities: () => void;
}

const FAQ_CATEGORIES: FaqCategory[] = [
  'University Admissions',
  'ATAR & Score Conversion',
  'RIASEC Methodology',
  'Dorms & Campus Facilities',
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'adm-tiers',
    category: 'University Admissions',
    question: 'How does UniCompass classify universities into Safe, Target, and Reach tiers?',
    answer:
      'Your selected credential (ATAR, Digital SAT, IB, A-Levels, or 4.0 GPA) is converted to a canonical ATAR rank and compared against each university’s typical admission band. Safe means your score sits comfortably above the minimum cutoff with strong margin; Target means your score falls inside the competitive intake band; Reach means you are within striking distance (typically within 5 ATAR points) and should also review prerequisite subjects or early-offer pathways.',
    highlights: [
      'Always verify subject prerequisites (such as Calculus, Chemistry, or a Design Portfolio) on the official university major page inside the detail modal.',
      'Competitive programs such as direct Medicine, Law, and Computing often require higher cutoffs than a university’s general minimum.',
    ],
  },
  {
    id: 'adm-english',
    category: 'University Admissions',
    question: 'Do international universities accept alternatives to IELTS Academic?',
    answer:
      'Yes. While UniCompass lists the standard IELTS minimum (usually 6.5 overall with 6.0 per band, or 7.0+ for Law and Medicine), almost all partner institutions accept equivalent scores on TOEFL iBT, PTE Academic, or Cambridge C1/C2 English—and may waive the test if you completed an eligible English-medium IB Diploma or A-Level curriculum.',
  },
  {
    id: 'adm-timeline',
    category: 'University Admissions',
    question: 'When should I apply for scholarships and Year 1 admission?',
    answer:
      'Deadlines depend on the destination intake. UK UCAS equal consideration closes in late January (mid-October for Medicine). US/Canada/Singapore applications (NUS, NTU, U of T) primarily run from October through March. Australian Group of Eight and New Zealand universities offer rolling conditional offers and major February/July intakes, though merit scholarships and residential colleges often close 3–5 months ahead of orientation.',
  },
  {
    id: 'conv-what-is-atar',
    category: 'ATAR & Score Conversion',
    question: 'What is ATAR, and why is it used as the common benchmark here?',
    answer:
      'ATAR stands for the Australian Tertiary Admission Rank—a percentile rank from 0.00 to 99.95 showing a student’s academic standing relative to their entire graduating cohort. Because Australian, New Zealand, UK, Singaporean, and Canadian admissions offices publish transparent ATAR equivalency tables, UniCompass uses ATAR (55.00–99.95) internally as a unified mathematical anchor so you can switch smoothly between SAT, IB, A-Levels, and 4.0 GPA.',
  },
  {
    id: 'conv-sat-ap',
    category: 'ATAR & Score Conversion',
    question: 'Can I apply to Australia, the UK, or Singapore with only a Digital SAT score?',
    answer:
      'Policies vary by country. Leading Australian universities (UniMelb, USYD, UNSW, ANU, Monash, UQ, UWA) and Auckland frequently accept Digital SAT alongside a high school graduation diploma directly for undergraduate entry. By contrast, UK G5/Russell Group universities (Imperial, UCL, KCL) and Singapore’s NUS/NTU normally require 3–5 AP exams (scores 4–5) or strong subject-level qualifications in addition to your SAT.',
    highlights: [
      'Check the SAT & International Credentials note inside any university’s detail modal for exact AP or GPA pairings.',
      'Equivalency bands in UniCompass are indicative guidance; universities publish final intake tables each admissions cycle.',
    ],
  },
  {
    id: 'conv-ib-alevel',
    category: 'ATAR & Score Conversion',
    question: 'How are IB Diploma points and 3-subject A-Levels mapped to ATAR?',
    answer:
      'UniCompass uses piecewise interpolation aligned with UAC/VTAC international conversion schedules: for example, an IB score of 32 maps near 86.0 ATAR, 36 near 93.0 ATAR, and 40 near 97.5 ATAR. For Cambridge/Edexcel A-Levels, 3-subject aggregates follow published grade points from CCC (~72.0 ATAR) and ABB (~88.0 ATAR) up to A*AA (~97.5 ATAR) and A*A*A* (99.95 ATAR).',
  },
  {
    id: 'riasec-what-is',
    category: 'RIASEC Methodology',
    question: 'What is Holland’s RIASEC framework, and why use scenario choices?',
    answer:
      'Developed by psychologist John Holland, RIASEC classifies vocational and academic interests across six dimensions: Realistic (hands-on building), Investigative (analytical discovery), Artistic (creative expression), Social (helping and mentoring), Enterprising (leadership and strategy), and Conventional (systems and precision). Rather than asking abstract yes/no checkboxes, UniCompass presents 12 realistic campus and project scenarios so your choices reflect how you naturally solve problems.',
  },
  {
    id: 'riasec-scoring',
    category: 'RIASEC Methodology',
    question: 'How are my RIASEC scores combined with Dream Goals and Priority Sliders?',
    answer:
      'Your 12 scenario answers generate a 6-dimensional RIASEC vector normalized from 0 to 100, producing your top 2-letter Holland code and personality archetype. Choosing up to two Dream Goals adds a targeted boost (+18 to +25 points) to aligned traits before cosine-similarity matching ranks all 14 majors. University recommendations then blend your academic score fit, subject track, major availability, and your 4 Priority Sliders (Practice vs Research, Scholarships vs Ranking, Campus Energy, and Dorm Priority).',
  },
  {
    id: 'riasec-retake',
    category: 'RIASEC Methodology',
    question: 'Can I adjust my score or preferences after finishing the quiz?',
    answer:
      'Yes. On your Results Summary page, the Live Score & Priority Simulator lets you switch credentials (ATAR, SAT, IB, A-Levels, GPA), adjust your score, toggle region/dorm filters, and re-run matches in real time without retaking all 12 questions. Previous snapshots are also saved locally so you can compare runs.',
  },
  {
    id: 'dorm-guarantee',
    category: 'Dorms & Campus Facilities',
    question: 'What does "Guaranteed Year 1 Dorm" mean compared to Residential Colleges?',
    answer:
      'Universities marked Guaranteed Year 1 commit to offering every incoming first-year international student an on-campus room if housing forms are submitted before the intake cutoff. Historic Collegiate universities (like UniMelb, USYD, UQ, and U of T) also operate Residential Colleges—self-contained communities offering daily meal plans, faculty-in-residence tutoring, formal dinners, and higher residential fees.',
  },
  {
    id: 'fac-music-rooms',
    category: 'Dorms & Campus Facilities',
    question: 'Can non-music students book pianos and music practice rooms on campus?',
    answer:
      'At most campuses, yes! Institutions such as Imperial College London (Blyth Centre), University of Toronto (Hart House), NUS (Centre For the Arts & Halls), NTU, ANU, and UniMelb maintain dedicated acoustic piano rooms, band rehearsal pods, or residential college music rooms accessible to Engineering, Science, Business, and Arts students alike. Use the "Practice Rooms Open to All Majors" toggle on the Facilities page to filter them.',
  },
];

const CONVERSION_BENCHMARKS = [70, 75, 80, 85, 90, 95, 98, 99.5];

const RIASEC_ORDER: RiasecKey[] = ['R', 'I', 'A', 'S', 'E', 'C'];

export const FaqView: React.FC<FaqViewProps> = ({
  initialCategory = 'All',
  onStartQuiz,
  onExploreUniversities,
  onExploreFacilities,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | FaqCategory>(initialCategory);
  const [search, setSearch] = useState('');
  const [openIds, setOpenIds] = useState<string[]>([
    'adm-tiers',
    'conv-what-is-atar',
    'riasec-what-is',
    'dorm-guarantee',
  ]);

  // Interactive mini score converter inside the ATAR Conversion guide
  const [simType, setSimType] = useState<CredentialType>('SAT');
  const [simScore, setSimScore] = useState<number>(CREDENTIAL_CONFIGS.SAT.defaultScore);

  const simConfig = CREDENTIAL_CONFIGS[simType];
  const simAtar = useMemo(() => credentialToAtar(simType, simScore), [simType, simScore]);

  const handleSelectSimType = (nextType: CredentialType) => {
    const converted = atarToCredential(nextType, simAtar);
    setSimType(nextType);
    setSimScore(converted);
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const text = `${item.question} ${item.answer} ${(item.highlights ?? []).join(' ')} ${item.category}`;
        if (!text.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [selectedCategory, search]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const expandAllVisible = () => {
    setOpenIds(Array.from(new Set([...openIds, ...filteredFaqs.map((f) => f.id)])));
  };

  const collapseAllVisible = () => {
    const visibleSet = new Set(filteredFaqs.map((f) => f.id));
    setOpenIds((prev) => prev.filter((id) => !visibleSet.has(id)));
  };

  const getCategoryIcon = (category: FaqCategory) => {
    switch (category) {
      case 'University Admissions':
        return GraduationCap;
      case 'ATAR & Score Conversion':
        return Calculator;
      case 'RIASEC Methodology':
        return Compass;
      case 'Dorms & Campus Facilities':
        return Home;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <HelpCircle className="w-4 h-4" aria-hidden="true" />
            <span>Admissions &amp; Methodology Guide</span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold text-slate-900 dark:text-slate-50">
            Frequently Asked Questions
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
            Everything you need to know about international university admissions, ATAR / SAT / IB /
            A-Level / GPA score conversions, Holland’s RIASEC model, and campus housing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onExploreUniversities}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            Browse Universities
          </button>
          <button
            type="button"
            onClick={onExploreFacilities}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            Campus Facilities
          </button>
          <button
            type="button"
            onClick={onStartQuiz}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
          >
            Start Career Quest
          </button>
        </div>
      </div>

      {/* Category Filter Tabs + Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full w-fit">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>All Topics ({FAQ_ITEMS.length})</span>
          </button>
          {FAQ_CATEGORIES.map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === category
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{category}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search
              className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ATAR, SAT, IB, RIASEC, dorms..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={expandAllVisible}
              className="px-2.5 py-2 font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
            >
              Expand All
            </button>
            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
              /
            </span>
            <button
              type="button"
              onClick={collapseAllVisible}
              className="px-2.5 py-2 font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Grid: FAQ Accordion + Interactive Reference Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: FAQ Accordion List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
              <p className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                No questions match "{search}"
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Clear the search bar or switch to All Topics to browse the full guide.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Show All Questions
              </button>
            </div>
          ) : (
            filteredFaqs.map((item) => {
              const isOpen = openIds.includes(item.id);
              const Icon = getCategoryIcon(item.category);
              const panelId = `faq-panel-${item.id}`;
              const headingId = `faq-btn-${item.id}`;

              return (
                <article
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    id={headingId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-5 sm:px-6 py-4 text-left flex items-start justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
                  >
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Icon
                          className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
                          aria-hidden="true"
                        />
                        <span>{item.category}</span>
                      </span>
                      <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {item.question}
                      </h2>
                    </div>

                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0 mt-1 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headingId}
                      className="px-5 sm:px-6 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-3"
                    >
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {item.answer}
                      </p>
                      {item.highlights && item.highlights.length > 0 && (
                        <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside pt-1">
                          {item.highlights.map((note, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {note}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>

        {/* Right: Interactive Score Converter + RIASEC Primer */}
        <aside className="lg:col-span-5 space-y-6">
          {/* Interactive Score Equivalency Calculator */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
                Interactive ATAR &amp; Credential Converter
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Test how Digital SAT, IB, 3-Subject A-Levels, and 4.0 GPA translate into UniCompass’s
                canonical ATAR scale.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
              {CREDENTIAL_ORDER.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelectSimType(type)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    simType === type
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {CREDENTIAL_CONFIGS[type].shortLabel}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="faq-score-slider"
                  className="font-semibold text-slate-700 dark:text-slate-200"
                >
                  {simConfig.label}
                </label>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  {formatCredentialValue(simType, simScore)}
                </span>
              </div>
              <input
                id="faq-score-slider"
                type="range"
                min={simConfig.min}
                max={simConfig.max}
                step={simConfig.step}
                value={simScore}
                onChange={(e) => setSimScore(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500 tabular-nums">
                <span>{simConfig.ticks[0]}</span>
                <span>{simConfig.ticks[1]}</span>
                <span>{simConfig.ticks[2]}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              {CREDENTIAL_ORDER.map((type) => {
                const equiv = atarToCredential(type, simAtar);
                const isSelected = type === simType;
                return (
                  <div
                    key={type}
                    className={`p-2.5 rounded-xl border text-xs ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/80'
                    }`}
                  >
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      {CREDENTIAL_CONFIGS[type].shortLabel}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatCredentialShort(type, equiv)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Compact Conversion Benchmark Table */}
            <div className="pt-2 overflow-x-auto">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Quick Equivalency Reference
              </p>
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <th className="py-2 pr-2 font-semibold">ATAR</th>
                    <th className="py-2 px-2 font-semibold">SAT</th>
                    <th className="py-2 px-2 font-semibold">IB</th>
                    <th className="py-2 px-2 font-semibold">A-Level</th>
                    <th className="py-2 pl-2 font-semibold">GPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-slate-800 dark:text-slate-200">
                  {CONVERSION_BENCHMARKS.map((atar) => (
                    <tr key={atar}>
                      <td className="py-1.5 pr-2 font-semibold text-blue-600 dark:text-blue-400">
                        {atar.toFixed(1)}
                      </td>
                      <td className="py-1.5 px-2">{atarToCredential('SAT', atar)}</td>
                      <td className="py-1.5 px-2">{atarToCredential('IB', atar)}</td>
                      <td className="py-1.5 px-2">
                        {formatCredentialShort('A_LEVEL', atarToCredential('A_LEVEL', atar))}
                      </td>
                      <td className="py-1.5 pl-2">{atarToCredential('GPA', atar).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 6 RIASEC Dimensions Quick Guide */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
                The 6 RIASEC Dimensions
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your 2-letter Holland Code blends your two highest scoring traits below.
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {RIASEC_ORDER.map((key) => {
                const meta = RIASEC_META[key];
                return (
                  <div key={key} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                    <span className="font-mono text-xs font-bold w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      {key}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {meta.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {meta.shortDesc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
