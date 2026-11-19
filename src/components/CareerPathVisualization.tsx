import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Briefcase,
  ExternalLink,
  Globe,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { CAREER_TRENDS_BY_MAJOR } from '../data/careerTrendsData';
import { RIASEC_META } from '../data/quizData';
import {
  LaborMarketPayload,
  MatchedMajor,
  Region,
  RiasecKey,
  RiasecVector,
  SubjectTrack,
} from '../types/game';
import { getTopRiasecKeys } from '../utils/matchingEngine';
import { CareerMentorChat } from './CareerMentorChat';

interface CareerPathVisualizationProps {
  normalizedScores: RiasecVector;
  topCode: string;
  archetypeTitle: string;
  targetAtar: number;
  credentialDisplay: string;
  subjectTrack: SubjectTrack;
  topMajors: MatchedMajor[];
  preferredRegion: Region;
  selectedMajorId: string | null;
  onSelectMajorForFilter: (majorId: string) => void;
}

interface ChartRow {
  majorId: string;
  shortName: string;
  fullName: string;
  industryName: string;
  riasecFit: number;
  growthPct: number;
  shortageLevel: string;
  topHubs: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartRow }>;
}

const CareerChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0].payload;

  return (
    <div className="max-w-[260px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 shadow-md text-left">
      <p className="font-display text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
        {row.fullName}
      </p>
      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{row.industryName}</p>
      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs tabular-nums">
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-600 dark:text-slate-300">RIASEC Fit:</span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
            {row.riasecFit}%
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-600 dark:text-slate-300">2025–2030 Growth:</span>
          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
            +{row.growthPct}%
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-600 dark:text-slate-300">Talent Shortage:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {row.shortageLevel}
          </span>
        </div>
      </div>
    </div>
  );
};

export const CareerPathVisualization: React.FC<CareerPathVisualizationProps> = ({
  normalizedScores,
  topCode,
  archetypeTitle,
  targetAtar,
  credentialDisplay,
  subjectTrack,
  topMajors,
  preferredRegion,
  selectedMajorId,
  onSelectMajorForFilter,
}) => {
  const { isDark } = useTheme();
  const topFive = useMemo(() => topMajors.slice(0, 5), [topMajors]);

  const [focusedMajorId, setFocusedMajorId] = useState<string>(
    () => selectedMajorId || topFive[0]?.major.id || 'cs_ai'
  );

  // Sync if user clicks a major card in Section 01
  const activeMajorId = useMemo(() => {
    if (selectedMajorId && topFive.some((m) => m.major.id === selectedMajorId)) {
      return selectedMajorId;
    }
    if (topFive.some((m) => m.major.id === focusedMajorId)) {
      return focusedMajorId;
    }
    return topFive[0]?.major.id ?? 'cs_ai';
  }, [selectedMajorId, focusedMajorId, topFive]);

  const activeMatch = topFive.find((m) => m.major.id === activeMajorId) ?? topFive[0];
  const activeTrend = CAREER_TRENDS_BY_MAJOR[activeMajorId];

  // Live Google Search verification state per industry
  const [liveTrendsCache, setLiveTrendsCache] = useState<Record<string, LaborMarketPayload>>({});
  const [loadingLiveKey, setLoadingLiveKey] = useState<string | null>(null);
  const [liveError, setLiveError] = useState<string | null>(null);

  const chartData: ChartRow[] = useMemo(() => {
    return topFive.map((item) => {
      const trend = CAREER_TRENDS_BY_MAJOR[item.major.id];
      const shortLabel =
        item.major.name.length > 22
          ? `${item.major.name.slice(0, 20).trim()}…`
          : item.major.name;
      return {
        majorId: item.major.id,
        shortName: shortLabel,
        fullName: item.major.name,
        industryName: trend?.industryName ?? item.major.fieldGroup,
        riasecFit: item.matchPercent,
        growthPct: trend?.demandGrowthPct ?? 18,
        shortageLevel: trend?.shortageLevel ?? 'High',
        topHubs: trend?.topHiringHubs ?? 'Global Hubs',
      };
    });
  }, [topFive]);

  // Top 2 RIASEC drivers for this specific major vs user's own RIASEC scores
  const driverTraits = useMemo(() => {
    if (!activeMatch) return [];
    const majorTop2: RiasecKey[] = getTopRiasecKeys(activeMatch.major.riasec).slice(0, 2);
    return majorTop2.map((key) => ({
      key,
      name: RIASEC_META[key].name,
      userScore: normalizedScores[key],
      majorDemand: activeMatch.major.riasec[key],
      color: RIASEC_META[key].color,
    }));
  }, [activeMatch, normalizedScores]);

  const marketRegionName =
    preferredRegion === 'All' ? 'Australia & Global' : preferredRegion;
  const cacheKey = `${activeMajorId}::${marketRegionName}`;
  const livePayload = liveTrendsCache[cacheKey];

  const handleFetchLiveIndustryData = async () => {
    if (!activeTrend) return;
    setLoadingLiveKey(cacheKey);
    setLiveError(null);
    try {
      const res = await fetch('/api/labor-market-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          market: marketRegionName,
          focusMajor: activeTrend.industryName,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Unable to load Google Search insights.');
      }
      setLiveTrendsCache((prev) => ({
        ...prev,
        [cacheKey]: data as LaborMarketPayload,
      }));
    } catch (err: unknown) {
      setLiveError(
        err instanceof Error ? err.message : 'Connection error while querying industry trends.'
      );
    } finally {
      setLoadingLiveKey(null);
    }
  };

  if (!activeMatch || !activeTrend) return null;

  return (
    <section className="pt-2">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
              <BarChart3 className="w-4 h-4" aria-hidden="true" />
              <span>Data-Driven Career Path Analysis</span>
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
              02. Connecting Your RIASEC Profile to 2025–2030 Industry Growth
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
              Compare your personality fit against projected global workforce demand, and explore a
              3-stage progression roadmap for each target major.
            </p>
          </div>
        </div>

        {/* Layer 1: Comparative Recharts BarChart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
                Fit vs. Growth: RIASEC Match &amp; 2025–2030 Demand (%)
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Click a bar or track on the right to inspect
              </span>
            </div>

            <div
              className="w-full h-[290px] bg-slate-50/50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 sm:p-4"
              role="img"
              aria-label="Bar chart comparing RIASEC match percentage and 2025-2030 workforce growth"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 12, left: -12, bottom: 8 }}
                  barGap={6}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? '#334155' : '#E2E8F0'}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="shortName"
                    tick={{
                      fill: isDark ? '#94A3B8' : '#475569',
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                    axisLine={{ stroke: isDark ? '#334155' : '#CBD5E1' }}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip
                    content={<CareerChartTooltip />}
                    cursor={{
                      fill: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: '12px',
                      paddingTop: '8px',
                      color: isDark ? '#CBD5E1' : '#334155',
                    }}
                    iconType="square"
                  />
                  <Bar
                    name="RIASEC Fit (%)"
                    dataKey="riasecFit"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                    onClick={(_barData, index) => {
                      const target = chartData[index];
                      if (target?.majorId) setFocusedMajorId(target.majorId);
                    }}
                    className="cursor-pointer"
                  >
                    {chartData.map((row) => (
                      <Cell
                        key={`fit-${row.majorId}`}
                        fill={
                          row.majorId === activeMajorId
                            ? isDark
                              ? '#3B82F6'
                              : '#1D4ED8'
                            : isDark
                              ? '#1E40AF'
                              : '#60A5FA'
                        }
                      />
                    ))}
                  </Bar>
                  <Bar
                    name="2025–2030 Job Growth (%)"
                    dataKey="growthPct"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                    onClick={(_barData, index) => {
                      const target = chartData[index];
                      if (target?.majorId) setFocusedMajorId(target.majorId);
                    }}
                    className="cursor-pointer"
                  >
                    {chartData.map((row) => (
                      <Cell
                        key={`growth-${row.majorId}`}
                        fill={
                          row.majorId === activeMajorId
                            ? isDark
                              ? '#10B981'
                              : '#047857'
                            : isDark
                              ? '#065F46'
                              : '#34D399'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column: Interactive Path Selector + RIASEC-to-Industry Bridge */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Select a Career Track to Inspect
              </p>
              <div className="space-y-1.5">
                {topFive.map((item, idx) => {
                  const trend = CAREER_TRENDS_BY_MAJOR[item.major.id];
                  const isActive = item.major.id === activeMajorId;
                  return (
                    <button
                      key={item.major.id}
                      type="button"
                      onClick={() => setFocusedMajorId(item.major.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-blue-50/70 dark:bg-blue-950/50 border-blue-600 text-slate-900 dark:text-white'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 mr-2">
                          0{idx + 1}.
                        </span>
                        <span className="text-sm font-semibold truncate">{item.major.name}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums shrink-0">
                        +{trend?.demandGrowthPct ?? 18}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIASEC Driver Connection Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400">
                  Trait → Industry Bridge
                </span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  Shortage: {activeTrend.shortageLevel}
                </span>
              </div>

              <div className="space-y-2.5">
                {driverTraits.map((trait) => (
                  <div key={trait.key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {trait.key} · {trait.name}
                      </span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                        You: <strong>{trait.userScore}%</strong> · Demand: {trait.majorDemand}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${trait.userScore}%`,
                          backgroundColor: trait.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                {activeTrend.riasecConnectionNote}
              </p>
            </div>
          </div>
        </div>

        {/* Layer 2: 3-Stage Career Progression Roadmap */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                Career Progression Roadmap: {activeTrend.industryName}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Top Hiring Hubs: {activeTrend.topHiringHubs} · Sources: {activeTrend.dataSourceNote}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectMajorForFilter(activeMajorId)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Filter Universities for This Major</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeTrend.milestones.map((step, idx) => (
              <div
                key={step.phase}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {step.phase}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                      {step.timeframe}
                    </span>
                  </div>
                  <h4 className="mt-2 font-display text-base font-bold text-slate-900 dark:text-slate-100 flex items-start gap-2">
                    <Briefcase
                      className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <span>{step.roleTitle}</span>
                  </h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.focus}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Indicative Salary</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {step.compensationRange}
                  </span>
                </div>
                {idx < 2 && <span className="sr-only">Next stage {idx + 2}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Layer 3: On-Demand Live Google Search Verification */}
        <div className="pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
              <span>
                Want live labor-market evidence for{' '}
                <strong className="text-slate-900 dark:text-slate-100">
                  {activeTrend.industryName}
                </strong>{' '}
                in <strong className="text-slate-900 dark:text-slate-100">{marketRegionName}</strong>?
              </span>
            </div>

            <button
              type="button"
              disabled={loadingLiveKey === cacheKey}
              onClick={handleFetchLiveIndustryData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loadingLiveKey === cacheKey ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>
                {loadingLiveKey === cacheKey
                  ? 'Searching Google...'
                  : livePayload
                    ? 'Refresh Google Search Data'
                    : 'Verify via Google Search'}
              </span>
            </button>
          </div>

          {liveError && (
            <div className="mt-4 p-4 rounded-xl bg-red-50/70 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center gap-2.5 text-xs text-red-800 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{liveError}</span>
            </div>
          )}

          {livePayload && (
            <div className="mt-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {livePayload.summary}
              </p>
              {livePayload.careers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {livePayload.careers.slice(0, 3).map((c, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400 truncate">
                          {c.field}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                          <TrendingUp className="w-3 h-3" aria-hidden="true" />
                          {c.demandGrowth}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                        {c.roleName}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {c.keyInsight}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {livePayload.sources.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-700 text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    Google Search Sources:
                  </span>
                  {livePayload.sources.slice(0, 5).map((src) => (
                    <a
                      key={src.url}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-blue-700 dark:text-blue-400 hover:underline max-w-[220px] truncate"
                    >
                      <span className="truncate">{src.title}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Layer 4: Gemini Career Mentor Chat */}
        <CareerMentorChat
          riasecScores={normalizedScores}
          topCode={topCode}
          archetypeTitle={archetypeTitle}
          targetAtar={targetAtar}
          credentialDisplay={credentialDisplay}
          subjectTrack={subjectTrack}
          preferredRegion={preferredRegion}
          selectedMajorId={activeMajorId}
          selectedMajorName={activeMatch.major.name}
          selectedIndustry={activeTrend.industryName}
          demandGrowthPct={activeTrend.demandGrowthPct}
          shortageLevel={activeTrend.shortageLevel}
          driverTraitsSummary={driverTraits
            .map(
              (t) => `${t.key} (${t.name}): You ${t.userScore}% vs Industry Demand ${t.majorDemand}%`
            )
            .join('; ')}
        />
      </div>
    </section>
  );
};
