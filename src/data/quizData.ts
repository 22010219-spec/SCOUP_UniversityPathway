import { DreamGoal, PersonalityArchetype, QuizQuestion, RiasecKey } from '../types/game';

export const RIASEC_META: Record<
  RiasecKey,
  {
    code: RiasecKey;
    name: string;
    english: string;
    shortDesc: string;
    color: string;
  }
> = {
  R: {
    code: 'R',
    name: 'Realistic & Technical',
    english: 'Realistic',
    shortDesc: 'Prefers hands-on building, hardware, engineering labs, and practical solutions.',
    color: '#0284C7',
  },
  I: {
    code: 'I',
    name: 'Investigative & Analytical',
    english: 'Investigative',
    shortDesc: 'Curious about underlying principles; enjoys logic, data, experiments, and deep analysis.',
    color: '#2563EB',
  },
  A: {
    code: 'A',
    name: 'Artistic & Creative',
    english: 'Artistic',
    shortDesc: 'Imaginative and aesthetically driven; thrives on open-ended expression and portfolios.',
    color: '#D97706',
  },
  S: {
    code: 'S',
    name: 'Social & Empathetic',
    english: 'Social',
    shortDesc: 'Empathetic communicator; enjoys mentoring, healthcare, teaching, and community impact.',
    color: '#059669',
  },
  E: {
    code: 'E',
    name: 'Enterprising & Leadership',
    english: 'Enterprising',
    shortDesc: 'Decisive and persuasive; enjoys leading teams, pitching ideas, and global business.',
    color: '#DC2626',
  },
  C: {
    code: 'C',
    name: 'Conventional & Systems',
    english: 'Conventional',
    shortDesc: 'Detail-oriented and structured; excels with clear processes, numbers, and operations.',
    color: '#4F46E5',
  },
};

export const DREAM_GOALS: DreamGoal[] = [
  {
    id: 'dream_tech',
    title: 'Build Future Tech & AI Systems',
    subtitle: 'Create software, robotics, or artificial intelligence platforms with global reach.',
    riasecBoost: { I: 4, R: 3 },
  },
  {
    id: 'dream_heal',
    title: 'Heal & Improve Human Wellbeing',
    subtitle: 'Become a clinician, biomedical researcher, or psychologist supporting communities.',
    riasecBoost: { S: 4, I: 3 },
  },
  {
    id: 'dream_wealth',
    title: 'Lead Global Business & Venture Strategy',
    subtitle: 'Run international enterprises, quantitative investments, or global supply chains.',
    riasecBoost: { E: 4, C: 3 },
  },
  {
    id: 'dream_create',
    title: 'Shape Aesthetics, Architecture & Media',
    subtitle: 'Design spaces, digital products, or compelling stories that resonate worldwide.',
    riasecBoost: { A: 5, E: 2 },
  },
  {
    id: 'dream_discover',
    title: 'Advance Scientific Discovery & Sustainability',
    subtitle: 'Research biotechnology, clean energy, and solutions for ecological resilience.',
    riasecBoost: { I: 4, R: 2, C: 1 },
  },
  {
    id: 'dream_impact',
    title: 'Transform Education, Law & Global Diplomacy',
    subtitle: 'Champion justice, bridge cultures, or innovate next-generation learning.',
    riasecBoost: { S: 3, E: 3, A: 1 },
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // STAGE 1: CAMPUS REFLEXES
  {
    id: 1,
    stage: 1,
    stageTitle: 'Stage 1 · Academic Reflexes',
    scenario: 'Your school is hosting an Interdisciplinary Global Capstone Week.',
    prompt: 'When forming a project team, which role do you naturally step into first?',
    choices: [
      {
        id: 'q1_a',
        label: 'Build the physical prototype, hardware rig, or working software demo',
        subtext: 'You enjoy turning concepts into tangible systems you can test right away.',
        weights: { R: 3, I: 1 },
        gainSummary: '+3 Realistic · +1 Investigative',
      },
      {
        id: 'q1_b',
        label: 'Craft the visual concept, design portfolio assets, and direct the story video',
        subtext: 'You want the project to carry a distinctive aesthetic and inspire audiences.',
        weights: { A: 3, E: 1 },
        gainSummary: '+3 Artistic · +1 Enterprising',
      },
      {
        id: 'q1_c',
        label: 'Coordinate the team, pitch in front of judges, and rally sponsors',
        subtext: 'You get energized by uniting people and driving a shared ambition.',
        weights: { E: 3, S: 1 },
        gainSummary: '+3 Enterprising · +1 Social',
      },
      {
        id: 'q1_d',
        label: 'Structure the budget, weekly milestones, and risk checklist',
        subtext: 'You keep every deliverable accurate, organized, and right on schedule.',
        weights: { C: 3, I: 1 },
        gainSummary: '+3 Conventional · +1 Investigative',
      },
    ],
  },
  {
    id: 2,
    stage: 1,
    stageTitle: 'Stage 1 · Academic Reflexes',
    scenario: 'You are attending Open Day at a leading university in Australia or Singapore.',
    prompt: 'Which showcase zone keeps you exploring the longest?',
    choices: [
      {
        id: 'q2_a',
        label: 'AI, Robotics & High-Performance Computing Lab',
        subtext: 'Seeing how algorithms and sensors solve complex real-world problems.',
        weights: { I: 3, R: 1 },
        gainSummary: '+3 Investigative · +1 Realistic',
      },
      {
        id: 'q2_b',
        label: 'Architecture, Interaction Design & Digital Media Studios',
        subtext: 'Watching students transform sketches into spatial models and interactive products.',
        weights: { A: 3, S: 1 },
        gainSummary: '+3 Artistic · +1 Social',
      },
      {
        id: 'q2_c',
        label: 'Clinical Simulation Ward & Behavioral Psychology Center',
        subtext: 'Exploring how science and empathy come together to support human health.',
        weights: { S: 3, I: 1 },
        gainSummary: '+3 Social · +1 Investigative',
      },
      {
        id: 'q2_d',
        label: 'Simulated Trading Floor (Bloomberg Lab) & Startup Incubator',
        subtext: 'Testing live market analytics and pitching venture ideas to mentors.',
        weights: { E: 2, C: 2 },
        gainSummary: '+2 Enterprising · +2 Conventional',
      },
    ],
  },
  {
    id: 3,
    stage: 1,
    stageTitle: 'Stage 1 · Academic Reflexes',
    scenario: 'While preparing for your final ATAR exams in an unfamiliar subject.',
    prompt: 'Which study approach helps you master new material fastest?',
    choices: [
      {
        id: 'q3_a',
        label: 'Ask "Why?" and trace first principles from primary research before practicing',
        subtext: 'You feel uneasy memorizing shortcuts without understanding the underlying logic.',
        weights: { I: 3, C: 1 },
        gainSummary: '+3 Investigative · +1 Conventional',
      },
      {
        id: 'q3_b',
        label: 'Build visual mind maps and link ideas through original metaphors',
        subtext: 'Rigid note templates bore you; creative synthesis makes concepts stick.',
        weights: { A: 3, I: 1 },
        gainSummary: '+3 Artistic · +1 Investigative',
      },
      {
        id: 'q3_c',
        label: 'Study in small groups and teach concepts aloud to classmates',
        subtext: 'Dialogue and shared perspective unlock your sharpest insights.',
        weights: { S: 3, E: 1 },
        gainSummary: '+3 Social · +1 Enterprising',
      },
      {
        id: 'q3_d',
        label: 'Follow a structured weekly study plan with timed past-paper drills',
        subtext: 'Consistency and clear checklists keep you confident under exam pressure.',
        weights: { R: 2, C: 2 },
        gainSummary: '+2 Realistic · +2 Conventional',
      },
    ],
  },
  {
    id: 4,
    stage: 1,
    stageTitle: 'Stage 1 · Academic Reflexes',
    scenario: 'A close friend is overwhelmed by competing international university offers.',
    prompt: 'How do you usually help them make a decision?',
    choices: [
      {
        id: 'q4_a',
        label: 'Listen first to what excites or worries them so they feel truly understood',
        subtext: 'You prioritize their emotional clarity and personal wellbeing.',
        weights: { S: 3, A: 1 },
        gainSummary: '+3 Social · +1 Artistic',
      },
      {
        id: 'q4_b',
        label: 'Create a comparison matrix of ATAR cutoffs, tuition, scholarships, and outcomes',
        subtext: 'You use objective data to reveal the strongest strategic option.',
        weights: { I: 2, C: 2 },
        gainSummary: '+2 Investigative · +2 Conventional',
      },
      {
        id: 'q4_c',
        label: 'Encourage them to aim boldly and practice scholarship interviews together',
        subtext: 'You spark confidence and help them think bigger.',
        weights: { E: 3, A: 1 },
        gainSummary: '+3 Enterprising · +1 Artistic',
      },
      {
        id: 'q4_d',
        label: 'Walk through the document checklist and submission deadlines step by step',
        subtext: 'You turn overwhelm into an actionable, stress-free plan.',
        weights: { R: 2, C: 2 },
        gainSummary: '+2 Realistic · +2 Conventional',
      },
    ],
  },

  // STAGE 2: GLOBAL CAMPUS RHYTHM
  {
    id: 5,
    stage: 2,
    stageTitle: 'Stage 2 · Global Campus Rhythm',
    scenario: 'Picture yourself in your second year at an international university.',
    prompt: 'Which elective module makes you excited to enroll right away?',
    choices: [
      {
        id: 'q5_a',
        label: 'Embedded Systems Engineering, Automation, or Applied Software Lab',
        subtext: 'You love courses where you ship a working technical product by semester’s end.',
        weights: { R: 3, I: 1 },
        gainSummary: '+3 Realistic · +1 Investigative',
      },
      {
        id: 'q5_b',
        label: 'Global Business Strategy & Cross-Border Deal Negotiation',
        subtext: 'You thrive on competitive case studies and executive decision-making.',
        weights: { E: 3, C: 1 },
        gainSummary: '+3 Enterprising · +1 Conventional',
      },
      {
        id: 'q5_c',
        label: 'Digital Experience Studio (UI/UX), Sustainable Architecture, or Media Production',
        subtext: 'You enjoy expressive design critiques and crafting an original portfolio.',
        weights: { A: 3, E: 1 },
        gainSummary: '+3 Artistic · +1 Enterprising',
      },
      {
        id: 'q5_d',
        label: 'Community Health Practicum, Applied Psychology, or Learning Design',
        subtext: 'You want your coursework to directly improve people’s everyday lives.',
        weights: { S: 3, R: 1 },
        gainSummary: '+3 Social · +1 Realistic',
      },
    ],
  },
  {
    id: 6,
    stage: 2,
    stageTitle: 'Stage 2 · Global Campus Rhythm',
    scenario: 'Right before a final capstone presentation, a technical glitch hits your demo.',
    prompt: 'What is your natural instinct to steady the team?',
    choices: [
      {
        id: 'q6_a',
        label: 'Calmly inspect the code, hardware, or data logs to patch the root issue',
        subtext: 'Focused troubleshooting under pressure is your strong suit.',
        weights: { C: 2, R: 2 },
        gainSummary: '+2 Conventional · +2 Realistic',
      },
      {
        id: 'q6_b',
        label: 'Reassure everyone and reassign support roles so no teammate feels stranded',
        subtext: 'Keeping team morale intact keeps performance high.',
        weights: { S: 3, E: 1 },
        gainSummary: '+3 Social · +1 Enterprising',
      },
      {
        id: 'q6_c',
        label: 'Improvise a creative storytelling pivot that turns the hiccup into a highlight',
        subtext: 'Quick adaptability and fresh framing save the moment.',
        weights: { A: 2, E: 2 },
        gainSummary: '+2 Artistic · +2 Enterprising',
      },
      {
        id: 'q6_d',
        label: 'Isolate the core analytical thesis and deliver the strongest evidence cleanly',
        subtext: 'Clear logic preserves academic credibility.',
        weights: { I: 3, C: 1 },
        gainSummary: '+3 Investigative · +1 Conventional',
      },
    ],
  },
  {
    id: 7,
    stage: 2,
    stageTitle: 'Stage 2 · Global Campus Rhythm',
    scenario: 'Every university campus has a distinct culture and learning model.',
    prompt: 'Which environment brings out your best energy over 3–4 years of study?',
    choices: [
      {
        id: 'q7_a',
        label: 'Elite research university with deep libraries and world-leading faculty mentors',
        subtext: 'You value academic depth and postgraduate or R&D pathways.',
        weights: { I: 3, C: 1 },
        gainSummary: '+3 Investigative · +1 Conventional',
      },
      {
        id: 'q7_b',
        label: 'Work-Integrated Learning campus with paid industry Co-op placements',
        subtext: 'You prioritize practical experience and global career readiness.',
        weights: { R: 3, E: 1 },
        gainSummary: '+3 Realistic · +1 Enterprising',
      },
      {
        id: 'q7_c',
        label: 'Studio-based campus assessed on projects and portfolios instead of rote exams',
        subtext: 'You grow fastest when experimenting freely with original ideas.',
        weights: { A: 3, S: 1 },
        gainSummary: '+3 Artistic · +1 Social',
      },
      {
        id: 'q7_d',
        label: 'Bustling multicultural hub packed with leadership summits and student clubs',
        subtext: 'Global friendships and networks are your most valuable asset.',
        weights: { S: 2, E: 2 },
        gainSummary: '+2 Social · +2 Enterprising',
      },
    ],
  },
  {
    id: 8,
    stage: 2,
    stageTitle: 'Stage 2 · Global Campus Rhythm',
    scenario: 'In a career-readiness assessment, you pick the type of challenge you handle best.',
    prompt: 'Which kind of pressure makes you feel most in your element?',
    choices: [
      {
        id: 'q8_a',
        label: 'Verifying precision across complex codebases, financial models, or engineering specs',
        subtext: 'Patient, methodical, and disciplined with details.',
        weights: { R: 2, C: 2 },
        gainSummary: '+2 Realistic · +2 Conventional',
      },
      {
        id: 'q8_b',
        label: 'Inventing fresh, non-repetitive concepts on tight creative deadlines',
        subtext: 'You thrive on daily visual and conceptual reinvention.',
        weights: { A: 3, I: 1 },
        gainSummary: '+3 Artistic · +1 Investigative',
      },
      {
        id: 'q8_c',
        label: 'Making high-stakes strategic calls and rallying a team toward growth targets',
        subtext: 'Decisive under ambiguity and energized by negotiation.',
        weights: { E: 3, R: 1 },
        gainSummary: '+3 Enterprising · +1 Realistic',
      },
      {
        id: 'q8_d',
        label: 'Supporting people through complex health, learning, or behavioral journeys',
        subtext: 'Patient, steady, and deeply motivated by human impact.',
        weights: { S: 3, I: 1 },
        gainSummary: '+3 Social · +1 Investigative',
      },
    ],
  },
];

export const PERSONALITY_ARCHETYPES: PersonalityArchetype[] = [
  {
    id: 'arch_ir',
    code: 'I-R',
    title: 'Systems Architect',
    subtitle: 'Sharp analytical logic paired with hands-on technical execution',
    primaryTrait: 'I',
    secondaryTrait: 'R',
    summary:
      'You pair deep analytical curiosity with practical engineering drive. You want to understand how technology, data, or physical systems work at root level—and then build reliable tools that run smoothly in the real world.',
    strengths: [
      'Breaks down complex problems with systems thinking and empirical testing',
      'Picks up new programming languages, lab instruments, and frameworks quickly',
      'Stays calm and objective when debugging or optimizing performance',
    ],
    learningStyle: 'Thrives in lab-intensive universities with strong Co-op placements and active research mentors.',
    watchOut: 'Practice pitching technical ideas clearly to non-technical teammates across cultures.',
  },
  {
    id: 'arch_ia',
    code: 'I-A',
    title: 'Knowledge Designer',
    subtitle: 'Bridging deep research rigor with independent creative vision',
    primaryTrait: 'I',
    secondaryTrait: 'A',
    summary:
      'You combine scientific curiosity with aesthetic intuition and original thinking. You shine at the intersection of technology, data visualization, architecture, or human behavioral research.',
    strengths: [
      'Spots hidden patterns and communicates them through compelling forms',
      'Independent critical thinker who avoids cookie-cutter solutions',
      'Grounds creative concepts in solid evidence and logical structure',
    ],
    learningStyle: 'Well-suited to double degrees, interdisciplinary studios, and open-ended research briefs.',
    watchOut: 'Set clear production milestones so deep exploration does not delay shipping final work.',
  },
  {
    id: 'arch_ae',
    code: 'A-E',
    title: 'Creative Trailblazer',
    subtitle: 'Turning bold ideas into stories and products with global market reach',
    primaryTrait: 'A',
    secondaryTrait: 'E',
    summary:
      'You bring inventive energy and sharp cultural awareness. Rather than creating only for yourself, you want your concepts to persuade audiences, shape brands, and spark real market momentum.',
    strengths: [
      'Compelling storytelling across visuals, language, and digital experiences',
      'Willing to prototype bold directions and energize international teams',
      'Attuned to audience psychology and fast-moving media trends',
    ],
    learningStyle: 'Excels in studio-driven universities using portfolio and industry-brief assessments.',
    watchOut: 'Build habits around budgeting, timelines, and operational details to scale big ideas.',
  },
  {
    id: 'arch_as',
    code: 'A-S',
    title: 'Humanitarian Storyteller',
    subtitle: 'Using empathy and creativity to uplift and connect communities',
    primaryTrait: 'A',
    secondaryTrait: 'S',
    summary:
      'You are finely tuned to human emotion and skilled at translating lived experiences into education, design, cross-cultural communication, or community-centered media.',
    strengths: [
      'Nuanced, authentic communication that builds genuine trust',
      'Creative thinking anchored in cultural context and real human needs',
      'Natural talent for bringing diverse personalities together',
    ],
    learningStyle: 'Fits collaborative seminars, discussion-led classrooms, and early community placements.',
    watchOut: 'Set healthy personal boundaries and practice anchoring decisions with quantitative metrics.',
  },
  {
    id: 'arch_ec',
    code: 'E-C',
    title: 'Operations Strategist',
    subtitle: 'Ambitious commercial vision backed by numbers and disciplined execution',
    primaryTrait: 'E',
    secondaryTrait: 'C',
    summary:
      'You combine leadership drive with financial precision and structured risk control. This pairing is a powerhouse for international finance, business analytics, and global supply chains.',
    strengths: [
      'Fast, confident decision-making grounded in data and ROI',
      'Strong planning, negotiation, and resource-allocation instincts',
      'Dependable team lead who keeps ambitious projects on track',
    ],
    learningStyle: 'Shines in universities featuring corporate case competitions, Bloomberg labs, and Co-op.',
    watchOut: 'Leave room for unconventional creative perspectives so you never miss disruptive shifts.',
  },
  {
    id: 'arch_se',
    code: 'S-E',
    title: 'Community Leader',
    subtitle: 'People-first leadership that rallies teams around meaningful change',
    primaryTrait: 'S',
    secondaryTrait: 'E',
    summary:
      'You bring natural warmth and persuasive presence. You listen closely to what motivates others and step forward to organize, advocate, and lead communities toward purposeful goals.',
    strengths: [
      'Persuasive public speaking, coaching, and stakeholder alignment',
      'Attentive to education, law, policy, and human-service dynamics',
      'Handles cross-cultural communication with poise and adaptability',
    ],
    learningStyle: 'Thrives on vibrant campuses with exchange programs, societies, and strong alumni networks.',
    watchOut: 'Protect time for your own deep specialization alongside helping teammates succeed.',
  },
  {
    id: 'arch_rc',
    code: 'R-C',
    title: 'Precision Engineer',
    subtitle: 'Steady, practical, and skilled at mastering modern technical systems',
    primaryTrait: 'R',
    secondaryTrait: 'C',
    summary:
      'You value reliability, measurable outcomes, and craftsmanship. You enjoy seeing tangible performance from engineering systems, supply networks, or software infrastructure under your stewardship.',
    strengths: [
      'High discipline and accuracy across complex technical workflows',
      'Skilled at operating labs, digital infrastructure, and quality standards',
      'Pragmatic and dependable when delivering against tight milestones',
    ],
    learningStyle: 'Best matched with structured, hands-on degree programs tied to major industry partners.',
    watchOut: 'Keep flexing cross-functional communication and adaptability as tools evolve.',
  },
  {
    id: 'arch_is',
    code: 'I-S',
    title: 'Humanitarian Scientist',
    subtitle: 'Channeling rigorous scientific inquiry into health and human potential',
    primaryTrait: 'I',
    secondaryTrait: 'S',
    summary:
      'You unite a compassionate heart with an investigative mind. You pursue science not merely out of curiosity, but to apply research directly toward healing, education, and human flourishing.',
    strengths: [
      'Sustained focus for demanding scientific and clinical study',
      'High ethical standards paired with genuine patient or student empathy',
      'Able to translate complex scientific concepts into clear guidance',
    ],
    learningStyle: 'Ideal for research-intensive biomedical, psychology, and clinical health faculties.',
    watchOut: 'Guard against burnout by scheduling recovery alongside high personal standards.',
  },
];
