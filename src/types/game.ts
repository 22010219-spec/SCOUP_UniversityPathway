export type RiasecKey = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export type RiasecVector = Record<RiasecKey, number>;

export type AppView = 'GAME' | 'MAJORS' | 'UNIVERSITIES' | 'FACILITIES' | 'FAQ';

export type GameState = 'TITLE_MENU' | 'PLAYING' | 'RESULT_SUMMARY';

export type CredentialType = 'ATAR' | 'SAT' | 'IB' | 'A_LEVEL' | 'GPA';

export type DormAvailability =
  | 'Guaranteed Year 1'
  | 'Priority / College System'
  | 'Limited / Off-Campus Hub';

export type Region =
  | 'All'
  | 'Australia'
  | 'UK & Europe'
  | 'Singapore & Asia'
  | 'Canada & New Zealand';

export type UniversityType =
  | 'All'
  | 'Top Research (Go8 / Russell / G5)'
  | 'Applied & Innovation';

export type SubjectTrack =
  | 'Undecided'
  | 'Advanced Maths & Sciences'
  | 'Economics & Applied Maths'
  | 'Biology & Chemistry'
  | 'Humanities & Languages'
  | 'Arts & Portfolio';

export interface DreamGoal {
  id: string;
  title: string;
  subtitle: string;
  riasecBoost: Partial<RiasecVector>;
}

export interface PlayerSetup {
  subjectTrack: SubjectTrack;
  credentialType: CredentialType;
  credentialScore: number; // Native value for the selected credential
  targetAtar: number; // Canonical ATAR equivalent (55.00 to 99.95)
  preferredRegion: Region;
}

export interface PriorityPreferences {
  practiceVsResearch: number; // 0 (Pure research) -> 100 (Industry practice)
  budgetSensitivity: number; // 0 (Prioritize scholarships & value) -> 100 (Prioritize top global ranking)
  campusEnergy: number; // 0 (Focused academic) -> 100 (Vibrant metropolitan)
  dormPreference: number; // 0 (Off-campus apartment) -> 100 (Guaranteed on-campus dorm)
}

export interface QuizChoice {
  id: string;
  label: string;
  subtext: string;
  weights: Partial<RiasecVector>;
  gainSummary: string;
}

export interface QuizQuestion {
  id: number;
  stage: 1 | 2 | 3;
  stageTitle: string;
  scenario: string;
  prompt: string;
  choices: QuizChoice[];
}

export interface PersonalityArchetype {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  primaryTrait: RiasecKey;
  secondaryTrait: RiasecKey;
  summary: string;
  strengths: string[];
  learningStyle: string;
  watchOut: string;
}

export interface MajorItem {
  id: string;
  name: string;
  fieldGroup: string;
  riasec: RiasecVector;
  subjectTracks: SubjectTrack[];
  prerequisites: string;
  minAtar: number;
  maxAtar: number;
  dreamGoalIds: string[];
  description: string;
  keySkills: string[];
  careerPaths: string[];
  outlook: string;
}

export interface UniversityItem {
  id: string;
  shortName: string;
  name: string;
  city: string;
  country: string;
  region: Exclude<Region, 'All'>;
  type: Exclude<UniversityType, 'All'>;
  minAtar: number;
  maxAtar: number;
  satNote: string;
  ieltsMin: string;
  tuitionNote: string;
  tuitionApproxUsdK: number;
  dormAvailability: DormAvailability;
  dormCostNote: string;
  dormHighlights: string;
  dormScore: number; // 0-100 (higher = guaranteed on-campus halls & strong residential support)
  subjectTracks: SubjectTrack[];
  majorIds: string[];
  practiceScore: number; // 0-100
  affordabilityScore: number; // 0-100 (higher = more scholarships / lower tuition)
  campusEnergyScore: number; // 0-100
  highlights: string[];
  campusVibe: string;
  scholarshipNote: string;
  admissionTip: string;
}

export type AdmissionStatus = 'Safe' | 'Target' | 'Reach';

export interface MatchedMajor {
  major: MajorItem;
  matchPercent: number;
  atarStatus: AdmissionStatus;
  dreamMatched: boolean;
  reason: string;
}

export interface MatchedUniversity {
  university: UniversityItem;
  matchPercent: number;
  matchedMajors: MajorItem[];
  admissionStatus: AdmissionStatus;
  fitReasons: string[];
}

export interface GameResultSnapshot {
  id: string;
  timestamp: number;
  setup: PlayerSetup;
  priorities: PriorityPreferences;
  selectedDreamIds: string[];
  rawScores: RiasecVector;
  normalizedScores: RiasecVector;
  archetype: PersonalityArchetype;
  topCode: string;
  matchedMajors: MatchedMajor[];
  matchedUniversities: MatchedUniversity[];
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface HighDemandCareer {
  roleName: string;
  field: string;
  demandGrowth: string;
  keyInsight: string;
  topSkills: string[];
  matchingMajorIds: string[];
}

export interface LaborMarketPayload {
  market: string;
  updatedAt: string;
  summary: string;
  careers: HighDemandCareer[];
  sources: GroundingSource[];
}

export type StudyMilestoneCategory =
  | 'Score & Exam Prep'
  | 'English Exam'
  | 'Applications & Scholarships';

export interface StudyMilestone {
  id: string;
  title: string;
  category: StudyMilestoneCategory;
  targetDate: string; // YYYY-MM-DD
  targetMetric: string;
  notes: string;
  completed: boolean;
}

export interface ExternalResourceLink {
  label: string;
  url: string;
  category: 'official' | 'dorm' | 'partner' | 'facilities' | 'music';
  note?: string;
}

export type FacilityCategory =
  | 'Music & Performing Arts'
  | 'STEM & Makerspaces'
  | 'Design & Media Studios'
  | 'Libraries & 24/7 Hubs'
  | 'Sports & Wellness';

export interface FacilitySpace {
  category: FacilityCategory;
  name: string;
  details: string;
  accessNote: string;
}

export interface UniversityExtendedProfile {
  universityId: string;
  officialPortalUrl: string;
  majorUrls: Record<string, string>;
  dormSources: ExternalResourceLink[];
  facilitiesSummary: string;
  musicHighlight: string;
  dormMusicAndLounges: string;
  nonMajorMusicAccess: boolean;
  facilitiesUrl: string;
  musicUrl: string;
  spaces: FacilitySpace[];
}

