import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  ExternalLink,
  Globe,
  Home,
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
} from 'lucide-react';
import { MAJORS_DATA, UNIVERSITIES_DATA } from '../data/majorsAndUniversities';
import { RIASEC_META } from '../data/quizData';
import {
  CredentialType,
  LaborMarketPayload,
  Region,
  RiasecKey,
  UniversityItem,
  UniversityType,
} from '../types/game';
import {
  CREDENTIAL_CONFIGS,
  CREDENTIAL_ORDER,
  formatAtarBandInCredential,
} from '../utils/credentialConverter';
import { getTopRiasecKeys } from '../utils/matchingEngine';

interface MajorsLibraryProps {
  onStartQuiz: () => void;
}

const RIASEC_FILTERS: Array<'All' | RiasecKey> = ['All', 'R', 'I', 'A', 'S', 'E', 'C'];

const LABOR_MARKETS = [
  'Australia & Global',
  'Singapore & Asia',
  'UK & Europe',
  'Canada & New Zealand',
  'Global Tech & Remote',
];

export const MajorsLibrary: React.FC<MajorsLibraryProps> = ({ onStartQuiz }) => {
  const [search, setSearch] = useState('');
  const [traitFilter, setTraitFilter] = useState<'All' | RiasecKey>('All');
  const [credentialView, setCredentialView] = useState<CredentialType>('ATAR');
  const [highlightedMajorIds, setHighlightedMajorIds] = useState<string[] | null>(null);

  const [selectedMarket, setSelectedMarket] = useState<string>(LABOR_MARKETS[0]);
  const [marketData, setMarketData] = useState<LaborMarketPayload | null>(null);
  const [isLoadingMarket, setIsLoadingMarket] = useState<boolean>(false);
  const [marketError, setMarketError] = useState<string | null>(null);

  const majorsGridRef = useRef<HTMLDivElement | null>(null);

  const fetchMarketInsights = useCallback(
    async (market: string, forceRefresh = false) => {
      setIsLoadingMarket(true);
      setMarketError(null);
      try {
        const res = await fetch('/api/labor-market-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ market, refresh: forceRefresh }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || 'Unable to load labor market data.');
        }
        setMarketData(data as LaborMarketPayload);
      } catch (err: unknown) {
        setMarketError(
          err instanceof Error
            ? err.message
            : 'An error occurred while querying Google Search.'
        );
      } finally {
        setIsLoadingMarket(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchMarketInsights(selectedMarket, false);
  }, [selectedMarket, fetchMarketInsights]);

  const filteredMajors = useMemo(() => {
    return MAJORS_DATA.filter((major) => {
      if (highlightedMajorIds && highlightedMajorIds.length > 0) {
        if (!highlightedMajorIds.includes(major.id)) return false;
      }
      if (traitFilter !== 'All') {
        const top2 = getTopRiasecKeys(major.riasec).slice(0, 2);
        if (!top2.includes(traitFilter)) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          major.name.toLowerCase().includes(q) ||
          major.fieldGroup.toLowerCase().includes(q) ||
          major.careerPaths.some((c) => c.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [search, traitFilter, highlightedMajorIds]);

  const handleFilterByCareerMajors = (majorIds: string[]) => {
    setTraitFilter('All');
    setSearch('');
    setHighlightedMajorIds(majorIds);
    majorsGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-50">
            14 International Majors &amp; Future Workforce Trends
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
            Live labor-market insights powered by Google Search on high-demand future careers,
            paired with ATAR, SAT, IB, A-Level, and GPA thresholds.
          </p>
        </div>
        <button
          type="button"
          onClick={onStartQuiz}
          className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 w-fit"
        >
          Take Career &amp; Score Quiz
        </button>
      </div>

      {/* Live Google Search Labor Market Insights Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
              <Globe className="w-4 h-4" aria-hidden="true" />
              <span>Real-time Workforce Intelligence via Google Search</span>
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
              High-Demand Future Careers (2025–2030 Outlook)
            </h2>
          </div>

          <button
            type="button"
            disabled={isLoadingMarket}
            onClick={() => fetchMarketInsights(selectedMarket, true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 w-fit"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoadingMarket ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>{isLoadingMarket ? 'Searching...' : 'Refresh Insights'}</span>
          </button>
        </div>

        {/* Market Region Tabs */}
        <div className="mt-5 flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full w-fit">
          {LABOR_MARKETS.map((market) => (
            <button
              key={market}
              type="button"
              onClick={() => setSelectedMarket(market)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedMarket === market
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {market}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoadingMarket && (
          <div className="mt-6 space-y-4" aria-busy="true" aria-label="Loading workforce insights">
            <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-44 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-5 space-y-3 animate-pulse"
                >
                  <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-5 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoadingMarket && marketError && (
          <div className="mt-6 p-5 rounded-xl bg-red-50/70 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle
                className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Unable to load Google Search insights right now
                </p>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {marketError}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fetchMarketInsights(selectedMarket, true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-blue-600 rounded-lg hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 w-fit"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loaded Grounded Insights */}
        {!isLoadingMarket && !marketError && marketData && (
          <div className="mt-6 space-y-6">
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
              {marketData.summary}
            </p>

            {marketData.careers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketData.careers.map((career, idx) => {
                  const linkedMajors = career.matchingMajorIds
                    .map((id) => MAJORS_DATA.find((m) => m.id === id))
                    .filter((m): m is NonNullable<typeof m> => Boolean(m));

                  return (
                    <article
                      key={`${career.roleName}-${idx}`}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/50 p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-medium text-slate-500 dark:text-slate-400 truncate">
                            {career.field}
                          </span>
                          <span className="inline-flex items-center gap-1 font-mono font-semibold text-emerald-700 dark:text-emerald-400 shrink-0 tabular-nums">
                            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                            {career.demandGrowth}
                          </span>
                        </div>
                        <h3 className="mt-2 font-display text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                          {career.roleName}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {career.keyInsight}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800 space-y-2 text-xs">
                        {career.topSkills.length > 0 && (
                          <p className="text-slate-600 dark:text-slate-300">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              In-Demand Skills:
                            </span>{' '}
                            {career.topSkills.join(' · ')}
                          </p>
                        )}
                        {linkedMajors.length > 0 && (
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <span className="text-slate-500 dark:text-slate-400 truncate">
                              Majors: {linkedMajors.map((m) => m.name.split(' & ')[0]).join(', ')}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleFilterByCareerMajors(career.matchingMajorIds)}
                              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0"
                            >
                              Filter Majors →
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Could not parse structured roles for this query. Click "Refresh Insights" to try
                again.
              </p>
            )}

            {/* Grounded Google Search Sources */}
            {marketData.sources.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Grounded Google Search Sources ({marketData.market})
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {marketData.sources.map((src) => (
                    <a
                      key={src.url}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 hover:underline max-w-xs truncate"
                    >
                      <span className="truncate">{src.title}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Existing 14 Majors Directory & Filter */}
      <section ref={majorsGridRef}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
              International Degree Catalog (14 Majors)
            </h2>
            {highlightedMajorIds && (
              <button
                type="button"
                onClick={() => setHighlightedMajorIds(null)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0"
              >
                Filtered by career trend · Show all 14 majors
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
            {CREDENTIAL_ORDER.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setCredentialView(type)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  credentialView === type
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {CREDENTIAL_CONFIGS[type].shortLabel}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
            {RIASEC_FILTERS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTraitFilter(key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  traitFilter === key
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {key === 'All' ? 'All Traits' : `${key} · ${RIASEC_META[key].english}`}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search
              className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search majors or careers..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMajors.map((major) => {
            const topTraits = getTopRiasecKeys(major.riasec).slice(0, 2);
            return (
              <article
                key={major.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{major.fieldGroup}</span>
                    <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                      Code {topTraits.join('-')}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {major.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {major.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <p className="text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      Typical {CREDENTIAL_CONFIGS[credentialView].shortLabel} Range:
                    </span>{' '}
                    <span className="font-mono font-semibold tabular-nums">
                      {formatAtarBandInCredential(credentialView, major.minAtar, major.maxAtar)}
                    </span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      Prerequisites:
                    </span>{' '}
                    {major.prerequisites}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      Career Paths:
                    </span>{' '}
                    {major.careerPaths.join(', ')}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

interface UniversitiesDirectoryProps {
  compareIds: string[];
  onToggleCompare: (uniId: string) => void;
  onInspectUniversity: (uni: UniversityItem) => void;
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

export const UniversitiesDirectory: React.FC<UniversitiesDirectoryProps> = ({
  compareIds,
  onToggleCompare,
  onInspectUniversity,
}) => {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<Region>('All');
  const [typeFilter, setTypeFilter] = useState<UniversityType>('All');
  const [dormFilter, setDormFilter] = useState<'All' | 'Guaranteed Year 1'>('All');
  const [credentialView, setCredentialView] = useState<CredentialType>('ATAR');

  const filteredUniversities = useMemo(() => {
    return UNIVERSITIES_DATA.filter((uni) => {
      if (regionFilter !== 'All' && uni.region !== regionFilter) return false;
      if (typeFilter !== 'All' && uni.type !== typeFilter) return false;
      if (dormFilter === 'Guaranteed Year 1' && uni.dormAvailability !== 'Guaranteed Year 1') {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          uni.name.toLowerCase().includes(q) ||
          uni.shortName.toLowerCase().includes(q) ||
          uni.city.toLowerCase().includes(q) ||
          uni.country.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, regionFilter, typeFilter, dormFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-50">
            18 International Universities · Credentials &amp; Dorms
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
            Browse ATAR, Digital SAT, IB, A-Level, and GPA entry bands alongside IELTS minimums,
            on-campus dorm availability, and tuition estimates.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full w-fit shrink-0">
          {CREDENTIAL_ORDER.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setCredentialView(type)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                credentialView === type
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {CREDENTIAL_CONFIGS[type].shortLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
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
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search university, city, or country..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUniversities.map((uni) => {
          const isCompared = compareIds.includes(uni.id);
          return (
            <article
              key={uni.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {uni.city}, {uni.country} · {uni.region}
                </p>
                <h2 className="mt-1.5 font-display text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {uni.name}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {uni.campusVibe}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">
                      {CREDENTIAL_CONFIGS[credentialView].shortLabel} Entry Band
                    </span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatAtarBandInCredential(credentialView, uni.minAtar, uni.maxAtar)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Est. Tuition</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                      ~${uni.tuitionApproxUsdK}k USD/yr
                    </span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Home
                          className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
                          aria-hidden="true"
                        />
                        <span>Dormitory</span>
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
                  onClick={() => onInspectUniversity(uni)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors whitespace-nowrap shrink-0"
                >
                  View Details
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
