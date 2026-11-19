import React from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { RIASEC_META } from '../data/quizData';
import { RiasecKey, RiasecVector } from '../types/game';

interface RiasecRadarChartProps {
  scores: RiasecVector;
}

interface RadarDatum {
  key: RiasecKey;
  shortTitle: string;
  fullName: string;
  description: string;
  score: number;
}

const ORDERED_KEYS: RiasecKey[] = ['I', 'A', 'S', 'E', 'C', 'R'];

interface CustomTickProps {
  x?: number | string;
  y?: number | string;
  textAnchor?: 'start' | 'middle' | 'end' | 'inherit';
  payload?: { value: string };
  dataMap: Map<string, RadarDatum>;
}

const CustomAngleTick: React.FC<CustomTickProps> = ({
  x = 0,
  y = 0,
  textAnchor = 'middle',
  payload,
  dataMap,
}) => {
  const datum = payload ? dataMap.get(payload.value) : undefined;
  if (!datum) return null;

  const numX = Number(x);
  const numY = Number(y);

  return (
    <g transform={`translate(${numX}, ${numY})`}>
      <text
        x={0}
        y={-3}
        textAnchor={textAnchor}
        className="fill-slate-900 dark:fill-slate-100 text-[12px] font-semibold"
      >
        {datum.key} · {datum.score}%
      </text>
      <text
        x={0}
        y={12}
        textAnchor={textAnchor}
        className="fill-slate-500 dark:fill-slate-400 text-[10.5px] font-medium"
      >
        {datum.shortTitle}
      </text>
    </g>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: RadarDatum }>;
}

const CustomRadarTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;

  return (
    <div className="max-w-[230px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-md text-left">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-xs font-bold text-slate-900 dark:text-slate-100">
          {item.key} · {item.fullName}
        </span>
        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums">
          {item.score}%
        </span>
      </div>
      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
        {item.description}
      </p>
    </div>
  );
};

export const RiasecRadarChart: React.FC<RiasecRadarChartProps> = ({ scores }) => {
  const { isDark } = useTheme();

  const data: RadarDatum[] = ORDERED_KEYS.map((key) => {
    const meta = RIASEC_META[key];
    return {
      key,
      shortTitle: meta.english,
      fullName: meta.name,
      description: meta.shortDesc,
      score: scores[key],
    };
  });

  const dataMap = new Map<string, RadarDatum>(data.map((d) => [d.key, d]));

  return (
    <div
      className="w-full h-[300px]"
      role="img"
      aria-label="Radar chart of 6 RIASEC personality dimensions"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="68%" data={data}>
          <PolarGrid stroke={isDark ? '#334155' : '#E2E8F0'} />
          <PolarAngleAxis
            dataKey="key"
            tick={(props) => (
              <CustomAngleTick
                x={props.x}
                y={props.y}
                textAnchor={props.textAnchor}
                payload={props.payload}
                dataMap={dataMap}
              />
            )}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tickCount={5}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="RIASEC Score"
            dataKey="score"
            stroke={isDark ? '#60A5FA' : '#2563EB'}
            strokeWidth={2.25}
            fill={isDark ? '#3B82F6' : '#2563EB'}
            fillOpacity={isDark ? 0.25 : 0.18}
            dot={{
              r: 4,
              fill: isDark ? '#0F172A' : '#FFFFFF',
              stroke: isDark ? '#60A5FA' : '#2563EB',
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: isDark ? '#60A5FA' : '#2563EB',
              stroke: isDark ? '#0F172A' : '#FFFFFF',
              strokeWidth: 2,
            }}
          />
          <Tooltip content={<CustomRadarTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
