import { MAJORS_DATA, UNIVERSITIES_DATA } from '../data/majorsAndUniversities';
import { DREAM_GOALS, PERSONALITY_ARCHETYPES, RIASEC_META } from '../data/quizData';
import {
  AdmissionStatus,
  GameResultSnapshot,
  MajorItem,
  MatchedMajor,
  MatchedUniversity,
  PersonalityArchetype,
  PlayerSetup,
  PriorityPreferences,
  RiasecKey,
  RiasecVector,
  UniversityItem,
} from '../types/game';
import { formatAtarBandInCredential, formatCredentialValue } from './credentialConverter';

const RIASEC_KEYS: RiasecKey[] = ['R', 'I', 'A', 'S', 'E', 'C'];

export function createEmptyRiasec(): RiasecVector {
  return { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
}

export function applyDreamBoost(
  baseRaw: RiasecVector,
  selectedDreamIds: string[]
): RiasecVector {
  const combined = { ...baseRaw };
  selectedDreamIds.forEach((dreamId, idx) => {
    const goal = DREAM_GOALS.find((g) => g.id === dreamId);
    if (!goal) return;
    const multiplier = idx === 0 ? 1.0 : 0.65; // Rank 1 dream counts stronger than Rank 2
    (Object.keys(goal.riasecBoost) as RiasecKey[]).forEach((trait) => {
      combined[trait] += (goal.riasecBoost[trait] ?? 0) * multiplier;
    });
  });
  return combined;
}

export function normalizeRiasecScores(raw: RiasecVector): RiasecVector {
  const maxPossible = Math.max(...Object.values(raw), 1);
  const result = createEmptyRiasec();
  RIASEC_KEYS.forEach((key) => {
    const ratio = raw[key] / maxPossible;
    result[key] = Math.round(22 + ratio * 76);
  });
  return result;
}

export function getTopRiasecKeys(scores: RiasecVector): RiasecKey[] {
  return [...RIASEC_KEYS].sort((a, b) => scores[b] - scores[a]);
}

export function pickArchetype(scores: RiasecVector): PersonalityArchetype {
  const sorted = getTopRiasecKeys(scores);
  const first = sorted[0];
  const second = sorted[1];

  const exactMatch = PERSONALITY_ARCHETYPES.find(
    (arch) =>
      (arch.primaryTrait === first && arch.secondaryTrait === second) ||
      (arch.primaryTrait === second && arch.secondaryTrait === first)
  );
  if (exactMatch) return exactMatch;

  const primaryMatch = PERSONALITY_ARCHETYPES.find(
    (arch) => arch.primaryTrait === first || arch.secondaryTrait === first
  );
  return primaryMatch || PERSONALITY_ARCHETYPES[0];
}

function cosineSimilarity(a: RiasecVector, b: RiasecVector): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const k of RIASEC_KEYS) {
    dot += a[k] * b[k];
    magA += a[k] * a[k];
    magB += b[k] * b[k];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export function evaluateAtarStatus(
  targetAtar: number,
  minAtar: number,
  maxAtar: number
): AdmissionStatus {
  if (targetAtar >= maxAtar - 2.0 || targetAtar >= minAtar + 6.0) return 'Safe';
  if (targetAtar >= minAtar - 0.5) return 'Target';
  return 'Reach';
}

export function matchMajors(
  normalizedScores: RiasecVector,
  setup: PlayerSetup,
  selectedDreamIds: string[]
): MatchedMajor[] {
  const sortedTraits = getTopRiasecKeys(normalizedScores);
  const top1 = sortedTraits[0];
  const top2 = sortedTraits[1];
  const credType = setup.credentialType || 'ATAR';
  const credLabel = formatCredentialValue(
    credType,
    setup.credentialScore ?? setup.targetAtar
  );

  const scored = MAJORS_DATA.map((major) => {
    const sim = cosineSimilarity(normalizedScores, major.riasec);
    let score = sim * 80;

    if (major.riasec[top1] >= 75) score += 6;
    if (major.riasec[top2] >= 70) score += 4;

    // Dream Alignment Bonus
    const dreamMatched = major.dreamGoalIds.some((id) => selectedDreamIds.includes(id));
    if (selectedDreamIds[0] && major.dreamGoalIds.includes(selectedDreamIds[0])) {
      score += 8;
    } else if (dreamMatched) {
      score += 5;
    }

    // Subject Prerequisite Track alignment
    const trackMatch =
      setup.subjectTrack === 'Undecided' ||
      major.subjectTracks.includes(setup.subjectTrack);
    if (trackMatch && setup.subjectTrack !== 'Undecided') {
      score += 4;
    } else if (!trackMatch) {
      score -= 5;
    }

    // Credential / ATAR feasibility adjustment
    const atarStatus = evaluateAtarStatus(setup.targetAtar, major.minAtar, major.maxAtar);
    if (atarStatus === 'Target' || atarStatus === 'Safe') {
      score += 4;
    } else {
      const gap = major.minAtar - setup.targetAtar;
      score -= Math.min(10, gap * 0.7);
    }

    const matchPercent = Math.min(98, Math.max(54, Math.round(score)));

    const majorTopTraits = getTopRiasecKeys(major.riasec).slice(0, 2);
    const sharedTraits = majorTopTraits.filter((t) => sortedTraits.slice(0, 3).includes(t));
    const traitNames = (sharedTraits.length > 0 ? sharedTraits : [majorTopTraits[0]])
      .map((t) => RIASEC_META[t].name)
      .join(' & ');

    const dreamNote = dreamMatched ? ' · Aligned with your ranked dreams' : '';
    const bandText = formatAtarBandInCredential(credType, major.minAtar, major.maxAtar);
    const atarNote =
      atarStatus === 'Reach'
        ? ` (Typical entry ${bandText}; consider Foundation/Diploma pathways)`
        : ` (Fits your ${credLabel} target)`;

    const reason = `Matches your ${traitNames} strengths${dreamNote}${atarNote}.`;

    return {
      major,
      matchPercent,
      atarStatus,
      dreamMatched,
      reason,
    };
  });

  return scored.sort((a, b) => b.matchPercent - a.matchPercent);
}

export function matchUniversities(
  matchedMajors: MatchedMajor[],
  setup: PlayerSetup,
  priorities: PriorityPreferences
): MatchedUniversity[] {
  const topMajors = matchedMajors.slice(0, 5);
  const topMajorIds = new Set(topMajors.map((m) => m.major.id));
  const majorScoreMap = new Map<string, number>();
  matchedMajors.forEach((m) => majorScoreMap.set(m.major.id, m.matchPercent));

  const credType = setup.credentialType || 'ATAR';
  const credLabel = formatCredentialValue(
    credType,
    setup.credentialScore ?? setup.targetAtar
  );
  const dormPref = priorities.dormPreference ?? 60;

  const results: MatchedUniversity[] = UNIVERSITIES_DATA.map((uni) => {
    const offeredTopMajors: MajorItem[] = uni.majorIds
      .filter((id) => topMajorIds.has(id))
      .map((id) => MAJORS_DATA.find((m) => m.id === id)!)
      .filter(Boolean);

    const bestOfferedMajorScore = uni.majorIds.reduce((best, id) => {
      return Math.max(best, majorScoreMap.get(id) ?? 55);
    }, 55);

    // 1. Major & Dream alignment (45%)
    let totalScore = bestOfferedMajorScore * 0.45;
    if (offeredTopMajors.length >= 2) totalScore += 6;
    else if (offeredTopMajors.length === 1) totalScore += 3;
    else totalScore -= 9;

    // 2. Priority sliders alignment including Dorm preference (28%)
    const practiceDiff = Math.abs(uni.practiceScore - priorities.practiceVsResearch);
    const budgetTarget = 100 - priorities.budgetSensitivity;
    const affordabilityDiff = Math.abs(uni.affordabilityScore - budgetTarget);
    const energyDiff = Math.abs(uni.campusEnergyScore - priorities.campusEnergy);
    const dormDiff = Math.abs(uni.dormScore - dormPref);

    const priorityFit =
      (100 - practiceDiff) * 0.08 +
      (100 - affordabilityDiff) * 0.08 +
      (100 - energyDiff) * 0.06 +
      (100 - dormDiff) * 0.07;
    totalScore += priorityFit;

    // 3. Credential / ATAR realism (20%)
    const status = evaluateAtarStatus(setup.targetAtar, uni.minAtar, uni.maxAtar);
    if (status === 'Target') totalScore += 15;
    else if (status === 'Safe') totalScore += 12;
    else {
      const gap = uni.minAtar - setup.targetAtar;
      totalScore += Math.max(0, 7 - gap * 0.85);
    }

    if (
      setup.subjectTrack !== 'Undecided' &&
      uni.subjectTracks.includes(setup.subjectTrack)
    ) {
      totalScore += 4;
    }

    // 4. Region preference boost
    if (setup.preferredRegion !== 'All') {
      if (uni.region === setup.preferredRegion) totalScore += 5;
      else totalScore -= 5;
    }

    const matchPercent = Math.min(98, Math.max(50, Math.round(totalScore)));

    const fitReasons: string[] = [];
    if (offeredTopMajors.length > 0) {
      fitReasons.push(
        `Strong programs in ${offeredTopMajors
          .slice(0, 2)
          .map((m) => m.name)
          .join(' and ')} matching your top career profile.`
      );
    } else {
      const fallbackMajor = MAJORS_DATA.find((m) => m.id === uni.majorIds[0]);
      if (fallbackMajor) {
        fitReasons.push(`Renowned for ${fallbackMajor.name}.`);
      }
    }

    const entryBand = formatAtarBandInCredential(credType, uni.minAtar, uni.maxAtar);
    if (status === 'Safe') {
      fitReasons.push(
        `Your ${credLabel} comfortably clears the ${entryBand} entry range, giving you strong scholarship leverage.`
      );
    } else if (status === 'Target') {
      fitReasons.push(
        `Your ${credLabel} sits right in the standard admission band (${entryBand}).`
      );
    } else {
      fitReasons.push(
        `Standard entry band is ${entryBand} (an aspirational reach or accessible via Foundation/Diploma pathways).`
      );
    }

    if (dormPref >= 65 && uni.dormScore >= 85) {
      fitReasons.push(`Matches your dorm priority: ${uni.dormAvailability} (${uni.dormCostNote}).`);
    } else if (priorities.budgetSensitivity <= 40 && uni.affordabilityScore >= 60) {
      fitReasons.push('Accessible international tuition or generous automatic merit scholarships.');
    } else if (priorities.campusEnergy >= 65 && uni.campusEnergyScore >= 84) {
      fitReasons.push('Vibrant multicultural campus with active clubs and global student networks.');
    } else if (priorities.practiceVsResearch >= 65 && uni.practiceScore >= 80) {
      fitReasons.push('Hands-on curriculum featuring industry studios, Co-op, or paid internships.');
    }

    const displayMajors =
      offeredTopMajors.length > 0
        ? offeredTopMajors
        : uni.majorIds
            .map((id) => MAJORS_DATA.find((m) => m.id === id)!)
            .filter(Boolean)
            .slice(0, 2);

    return {
      university: uni,
      matchPercent,
      matchedMajors: displayMajors,
      admissionStatus: status,
      fitReasons,
    };
  });

  return results.sort((a, b) => b.matchPercent - a.matchPercent);
}

export function buildGameResult(
  rawQuizScores: RiasecVector,
  setup: PlayerSetup,
  priorities: PriorityPreferences,
  selectedDreamIds: string[]
): GameResultSnapshot {
  const combinedRaw = applyDreamBoost(rawQuizScores, selectedDreamIds);
  const normalizedScores = normalizeRiasecScores(combinedRaw);
  const topKeys = getTopRiasecKeys(normalizedScores);
  const topCode = `${topKeys[0]}-${topKeys[1]}-${topKeys[2]}`;
  const archetype = pickArchetype(normalizedScores);
  const matchedMajors = matchMajors(normalizedScores, setup, selectedDreamIds);
  const matchedUniversities = matchUniversities(matchedMajors, setup, priorities);

  return {
    id: `run_${Date.now()}`,
    timestamp: Date.now(),
    setup,
    priorities,
    selectedDreamIds,
    rawScores: combinedRaw,
    normalizedScores,
    archetype,
    topCode,
    matchedMajors,
    matchedUniversities,
  };
}
