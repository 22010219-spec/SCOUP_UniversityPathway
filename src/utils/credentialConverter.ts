import { CredentialType } from '../types/game';

export interface CredentialConfig {
  type: CredentialType;
  label: string;
  shortLabel: string;
  subtitle: string;
  min: number;
  max: number;
  step: number;
  defaultScore: number;
  ticks: [string, string, string];
}

const A_LEVEL_GRADES = [
  'CCC',
  'BCC',
  'BBC',
  'BBB',
  'ABB',
  'AAB',
  'AAA',
  'A*AA',
  'A*A*A',
  'A*A*A*',
] as const;

const A_LEVEL_TO_ATAR = [72.0, 76.0, 80.0, 84.0, 88.0, 92.0, 95.5, 97.5, 99.0, 99.95];

export const CREDENTIAL_CONFIGS: Record<CredentialType, CredentialConfig> = {
  ATAR: {
    type: 'ATAR',
    label: 'ATAR (Australia / NZ)',
    shortLabel: 'ATAR',
    subtitle: 'Australian Tertiary Admission Rank (55.00 – 99.95)',
    min: 55,
    max: 99.95,
    step: 0.5,
    defaultScore: 85,
    ticks: ['55.0', '80.0', '99.95'],
  },
  SAT: {
    type: 'SAT',
    label: 'Digital SAT',
    shortLabel: 'SAT',
    subtitle: 'College Board SAT Total Score (900 – 1600)',
    min: 900,
    max: 1600,
    step: 10,
    defaultScore: 1320,
    ticks: ['900', '1250', '1600'],
  },
  IB: {
    type: 'IB',
    label: 'IB Diploma',
    shortLabel: 'IB',
    subtitle: 'International Baccalaureate Total Points (24 – 45)',
    min: 24,
    max: 45,
    step: 1,
    defaultScore: 34,
    ticks: ['24 pts', '34 pts', '45 pts'],
  },
  A_LEVEL: {
    type: 'A_LEVEL',
    label: 'A-Levels (3 Subjects)',
    shortLabel: 'A-Levels',
    subtitle: 'Cambridge / Edexcel 3-Subject Predicted Grades',
    min: 0,
    max: 9,
    step: 1,
    defaultScore: 4, // ABB (~88 ATAR)
    ticks: ['CCC', 'ABB', 'A*A*A*'],
  },
  GPA: {
    type: 'GPA',
    label: 'High School GPA (4.0)',
    shortLabel: 'GPA 4.0',
    subtitle: 'Unweighted US / International 4.0 Scale',
    min: 2.2,
    max: 4.0,
    step: 0.05,
    defaultScore: 3.4,
    ticks: ['2.20', '3.10', '4.00'],
  },
};

export const CREDENTIAL_ORDER: CredentialType[] = ['ATAR', 'SAT', 'IB', 'A_LEVEL', 'GPA'];

function interpolatePiecewise(x: number, points: Array<[number, number]>): number {
  if (x <= points[0][0]) return points[0][1];
  if (x >= points[points.length - 1][0]) return points[points.length - 1][1];
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    if (x >= x0 && x <= x1) {
      const t = (x - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return points[points.length - 1][1];
}

const SAT_POINTS: Array<[number, number]> = [
  [900, 60.0],
  [1050, 70.0],
  [1150, 76.0],
  [1250, 83.0],
  [1350, 90.0],
  [1450, 95.5],
  [1550, 99.0],
  [1600, 99.95],
];

const IB_POINTS: Array<[number, number]> = [
  [24, 68.0],
  [28, 78.0],
  [32, 86.0],
  [36, 93.0],
  [40, 97.5],
  [43, 99.3],
  [45, 99.95],
];

const GPA_POINTS: Array<[number, number]> = [
  [2.2, 58.0],
  [2.6, 66.0],
  [3.0, 75.0],
  [3.3, 83.0],
  [3.6, 91.0],
  [3.85, 96.5],
  [4.0, 99.5],
];

export function credentialToAtar(type: CredentialType, score: number): number {
  if (type === 'ATAR') {
    return Math.min(99.95, Math.max(55, score >= 99.5 ? 99.95 : Number(score.toFixed(2))));
  }
  if (type === 'SAT') {
    return Number(interpolatePiecewise(score, SAT_POINTS).toFixed(2));
  }
  if (type === 'IB') {
    return Number(interpolatePiecewise(score, IB_POINTS).toFixed(2));
  }
  if (type === 'A_LEVEL') {
    const idx = Math.min(A_LEVEL_TO_ATAR.length - 1, Math.max(0, Math.round(score)));
    return A_LEVEL_TO_ATAR[idx];
  }
  return Number(interpolatePiecewise(score, GPA_POINTS).toFixed(2));
}

export function atarToCredential(type: CredentialType, atar: number): number {
  if (type === 'ATAR') {
    return Math.min(99.95, Math.max(55, atar >= 99.5 ? 99.95 : Math.round(atar * 2) / 2));
  }
  if (type === 'SAT') {
    const reversed: Array<[number, number]> = SAT_POINTS.map(([s, a]) => [a, s]);
    const raw = interpolatePiecewise(atar, reversed);
    return Math.min(1600, Math.max(900, Math.round(raw / 10) * 10));
  }
  if (type === 'IB') {
    const reversed: Array<[number, number]> = IB_POINTS.map(([ib, a]) => [a, ib]);
    const raw = interpolatePiecewise(atar, reversed);
    return Math.min(45, Math.max(24, Math.round(raw)));
  }
  if (type === 'A_LEVEL') {
    let bestIdx = 0;
    let bestDiff = Infinity;
    A_LEVEL_TO_ATAR.forEach((a, idx) => {
      const diff = Math.abs(a - atar);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIdx = idx;
      }
    });
    return bestIdx;
  }
  const reversed: Array<[number, number]> = GPA_POINTS.map(([g, a]) => [a, g]);
  const raw = interpolatePiecewise(atar, reversed);
  return Math.min(4.0, Math.max(2.2, Math.round(raw * 20) / 20));
}

export function formatCredentialValue(type: CredentialType, score: number): string {
  if (type === 'ATAR') return `${score.toFixed(2)} ATAR`;
  if (type === 'SAT') return `${Math.round(score)} SAT`;
  if (type === 'IB') return `${Math.round(score)} IB`;
  if (type === 'A_LEVEL') {
    const idx = Math.min(A_LEVEL_GRADES.length - 1, Math.max(0, Math.round(score)));
    return `${A_LEVEL_GRADES[idx]} (A-Level)`;
  }
  return `${score.toFixed(2)} GPA`;
}

export function formatCredentialShort(type: CredentialType, score: number): string {
  if (type === 'ATAR') return score.toFixed(1);
  if (type === 'SAT') return `${Math.round(score)}`;
  if (type === 'IB') return `${Math.round(score)}`;
  if (type === 'A_LEVEL') {
    const idx = Math.min(A_LEVEL_GRADES.length - 1, Math.max(0, Math.round(score)));
    return A_LEVEL_GRADES[idx];
  }
  return score.toFixed(2);
}

export function formatAtarBandInCredential(
  type: CredentialType,
  minAtar: number,
  maxAtar: number
): string {
  if (type === 'ATAR') {
    return `${minAtar.toFixed(1)} – ${maxAtar.toFixed(1)} ATAR`;
  }
  const low = atarToCredential(type, minAtar);
  const high = atarToCredential(type, maxAtar);
  if (type === 'SAT') return `${low} – ${high} SAT`;
  if (type === 'IB') return `${low} – ${high} IB`;
  if (type === 'A_LEVEL') {
    return `${formatCredentialShort('A_LEVEL', low)} – ${formatCredentialShort('A_LEVEL', high)}`;
  }
  return `${low.toFixed(2)} – ${high.toFixed(2)} GPA`;
}
