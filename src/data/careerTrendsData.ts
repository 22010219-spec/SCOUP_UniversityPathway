export interface CareerStageMilestone {
  phase: string;
  timeframe: string;
  roleTitle: string;
  focus: string;
  compensationRange: string;
}

export interface IndustryCareerTrend {
  majorId: string;
  industryName: string;
  demandGrowthPct: number; // Projected 5-year job growth % (2025-2030)
  shortageLevel: 'Critical' | 'High' | 'Steady';
  dataSourceNote: string;
  topHiringHubs: string;
  riasecConnectionNote: string;
  milestones: [CareerStageMilestone, CareerStageMilestone, CareerStageMilestone];
}

export const CAREER_TRENDS_BY_MAJOR: Record<string, IndustryCareerTrend> = {
  cs_ai: {
    majorId: 'cs_ai',
    industryName: 'Artificial Intelligence, Data & Software',
    demandGrowthPct: 36,
    shortageLevel: 'Critical',
    dataSourceNote: 'WEF Future of Jobs & Jobs and Skills Australia',
    topHiringHubs: 'Sydney · Melbourne · Singapore · London · Toronto',
    riasecConnectionNote:
      'Investigative (I) drives core algorithm design, while Conventional (C) and Realistic (R) ensure production software scales reliably.',
    milestones: [
      {
        phase: 'Stage 1 · Launch',
        timeframe: '0–1 yr post-grad',
        roleTitle: 'Junior Software / ML Engineer',
        focus: 'Build production APIs, data pipelines, and ship core product features.',
        compensationRange: 'AUD 75k – 95k/yr',
      },
      {
        phase: 'Stage 2 · Accelerate',
        timeframe: '2–4 yrs experience',
        roleTitle: 'AI Engineer / Senior Data Scientist',
        focus: 'Fine-tune domain AI models, optimize cloud inference, and lead feature squads.',
        compensationRange: 'AUD 115k – 145k/yr',
      },
      {
        phase: 'Stage 3 · Lead',
        timeframe: '5+ yrs experience',
        roleTitle: 'Principal Architect / Head of AI',
        focus: 'Set enterprise AI architecture and mentor multi-disciplinary engineering teams.',
        compensationRange: 'AUD 165k – 220k+/yr',
      },
    ],
  },
  mechatronics: {
    majorId: 'mechatronics',
    industryName: 'Automation, Robotics & Semiconductors',
    demandGrowthPct: 24,
    shortageLevel: 'Critical',
    dataSourceNote: 'Engineers Australia & OECD Skills Outlook',
    topHiringHubs: 'Melbourne · Singapore · Munich · Tokyo',
    riasecConnectionNote:
      'Realistic (R) gives you a strong edge with hardware and sensors, while Investigative (I) powers precision robotics control logic.',
    milestones: [
      {
        phase: 'Stage 1 · Launch',
        timeframe: '0–1 yr post-grad',
        roleTitle: 'Graduate Mechatronics / Controls Engineer',
        focus: 'CAD modeling, PLC/embedded firmware, and hardware lab prototyping.',
        compensationRange: 'AUD 72k – 88k/yr',
      },
      {
        phase: 'Stage 2 · Accelerate',
        timeframe: '2–4 yrs experience',
        roleTitle: 'Robotics & Automation Specialist',
        focus: 'Integrate smart manufacturing lines, autonomous systems, and clean-energy rigs.',
        compensationRange: 'AUD 105k – 135k/yr',
      },
      {
        phase: 'Stage 3 · Lead',
        timeframe: '5+ yrs experience',
        roleTitle: 'Lead Systems Engineer / R&D Director',
        focus: 'Direct cross-border engineering programs and commercialize next-gen hardware.',
        compensationRange: 'AUD 150k – 195k/yr',
      },
    ],
  },
  fintech_ba: {
    majorId: 'fintech_ba',
    industryName: 'Quantitative Finance, FinTech & Analytics',
    demandGrowthPct: 22,
    shortageLevel: 'High',
    dataSourceNote: 'WEF Future of Jobs & UK Financial Services Outlook',
    topHiringHubs: 'Sydney · Singapore · London · Toronto',
    riasecConnectionNote:
      'Conventional (C) and Enterprising (E) turn complex financial data into decisive investment strategies and stakeholder conviction.',
    milestones: [
      {
        phase: 'Stage 1 · Launch',
        timeframe: '0–1 yr post-grad',
        roleTitle: 'Financial / Business Data Analyst',
        focus: 'Quantitative reporting, risk modeling, and executive business dashboards.',
        compensationRange: 'AUD 72k – 92k/yr',
      },
      {
        phase: 'Stage 2 · Accelerate',
        timeframe: '2–4 yrs experience',
        roleTitle: 'Actuarial Associate / Investment Analyst',
        focus: 'Asset valuation, M&A advisory, or scaling digital FinTech products.',
        compensationRange: 'AUD 110k – 150k/yr',
      },
      {
        phase: 'Stage 3 · Lead',
        timeframe: '5+ yrs experience',
        roleTitle: 'Portfolio Manager / Director of Strategy',
        focus: 'Oversee institutional capital allocation and enterprise growth strategy.',
        compensationRange: 'AUD 170k – 240k+/yr',
      },
    ],
  },
  marketing_media: {
    majorId: 'marketing_media',
    industryName: 'Digital Media & Global Brand Strategy',
    demandGrowthPct: 18,
    shortageLevel: 'High',
    dataSourceNote: 'LinkedIn Jobs on the Rise & Australian Digital Economy',
    topHiringHubs: 'Sydney · Melbourne · Singapore · London',
    riasecConnectionNote:
      'Artistic (A) shapes distinctive brand storytelling, while Enterprising (E) drives audience reach and measurable commercial growth.',
    milestones: [
      {
        phase: 'Stage 1 · Launch',
        timeframe: '0–1 yr post-grad',
        roleTitle: 'Digital Marketing / Content Coordinator',
        focus: 'Run omnichannel campaigns, analyze audience metrics, and optimize creative assets.',
        compensationRange: 'AUD 62k – 78k/yr',
      },
      {
        phase: 'Stage 2 · Accelerate',
        timeframe: '2–4 yrs experience',
        roleTitle: 'Brand Strategist / Growth Lead',
        focus: 'Manage regional brand budgets and launch campaigns across international markets.',
        compensationRange: 'AUD 92k – 125k/yr',
      },
      {
        phase: 'Stage 3 · Lead',
        timeframe: '5+ yrs experience',
        roleTitle: 'Head of Brand / Creative Director',
        focus: 'Define global brand positioning and lead cross-functional creative teams.',
        compensationRange: 'AUD 140k – 185k/yr',
      },
    ],
  },
  architecture_urban: {
    majorId: 'architecture_urban',
    industryName: 'Sustainable Architecture & Green Urbanism',
    demandGrowthPct: 17,
    shortageLevel: 'High',
    dataSourceNote: 'Australian Infrastructure Outlook & RIBA Global Report',
    topHiringHubs: 'Melbourne · London · Singapore · Auckland',
    riasecConnectionNote:
      'Artistic (A) imagines inspiring spaces, while Realistic (R) and Investigative (I) ensure Net-Zero structural and environmental rigor.',
    milestones: [
      {
        phase: 'Stage 1 · Launch',
        timeframe: '0–1 yr post-grad',
        roleTitle: 'Architectural Graduate / BIM Modeler',
        focus: 'Develop 3D architectural models, BIM documentation, and sustainable material specs.',
        compensationRange: 'AUD 64k – 78k/yr',
      },
      {
        phase: 'Stage 2 · Accelerate',
        timeframe: '2–4 yrs experience',
        roleTitle: 'Project Architect / Urban Designer',
        focus: 'Lead commercial and green residential designs while coordinating clients and engineers.',
        compensationRange: 'AUD 90k – 120k/yr',
      },
      {
        phase: 'Stage 3 · Lead',
        timeframe: '5+ yrs experience',
        roleTitle: 'Design Principal / Sustainability Director',
        focus: 'Run an architectural practice and advise on climate-resilient urban masterplans.',
        compensationRange: 'AUD 135k – 180k/yr',
      },
    ],
  },
  ux_graphic_design: {
    majorId: 'ux_graphic_design',
    industryName: 'Digital Product Design (UI/UX) & Creative Tech',
    demandGrowthPct: 26,
    shortageLevel: 'Critical',
    dataSourceNote: 'WEF Future of Jobs & Tech Council of Australia',
    topHiringHubs: 'Melbourne · Sydney · London · Singapore',
    riasecConnectionNote:
      'Artistic (A) paired with Social (S) and Investigative (I) helps decode user behavior into intuitive, human-centered interfaces.',
    milestones: [
      {
        phase: 'Stage 1 · Launch',
        timeframe: '0–1 yr post-grad',
        roleTitle: 'Junior UI/UX / Product Designer',
        focus: 'Wireframe user flows, build interactive prototypes, and run usability tests.',
        compensationRange: 'AUD 68k – 85k/yr',
      },
      {
        phase: 'Stage 2 · Accelerate',
        timeframe: '2–4 yrs experience',
        roleTitle: 'Senior Product Designer / UX Researcher',
        focus: 'Architect scalable design systems for global AI and SaaS platforms.',
        compensationRange: 'AUD 105k – 135k/yr',
      },
      {
        phase: 'Stage 3 · Lead',
        timeframe: '5+ yrs experience',
        roleTitle: 'Head of Product Design / Design Director',
        focus: 'Shape product experience strategy at executive leadership level.',
        compensationRange: 'AUD 150k – 195k/yr',
      },
    ],
  },
  medicine_health: {
    majorId: 'medicine_health',
    industryName: 'Medicine, Biomedicine & Healthcare',
    demandGrowthPct: 31,
    shortageLevel: 'Critical',
    dataSourceNote: 'Jobs and Skills Australia & WHO Health Workforce Forecast',
    topHiringHubs: 'Melbourne · Sydney · Brisbane · London · Singapore',
    riasecConnectionNote:
      'Investigative (I) and Social (S) form the gold standard for accurate clinical diagnosis alongside compassionate patient care.',
    milestones: [
      {
        phase: 'Stage 1 · Launch',
        timeframe: '0–2 yrs clinical training',
        roleTitle: 'Medical Intern / Biomedical Associate',
        focus: 'Complete hospital rotations or support translational clinical trials.',
        compensationRange: 'AUD 78k – 98k/yr',
      },
      {
        phase: 'Stage 2 · Accelerate',
        timeframe: '3–5 yrs specialty training',
        roleTitle: 'Resident Doctor / Clinical Specialist',
        focus: 'Advance into specialty residency, direct care, or biopharma R&D.',
        compensationRange: 'AUD 120k – 175k/yr',
      },
      {
        phase: 'Stage 3 · Lead',
        timeframe: '6+ yrs experience',
        roleTitle: 'Consultant Physician / Medical Director',
        focus: 'Lead specialist clinical practice, medical teaching, or health-system leadership.',
        compensationRange: 'AUD 220k – 350k+/yr',
      },
    ],
  },
  psychology_social: {
    majorId: 'psychology_social',
    industryName: 'Clinical & Organizational Psychology',
    demandGrowthPct: 25,
    shortageLevel: 'Critical',
    dataSourceNote: 'Australian Psychological Society & OECD Wellbeing Data',
    topHiringHubs: 'Sydney · Melbourne · Toronto · London',
    riasecConnectionNote:
      'Social (S) fuels deep empathy and active listening, while Investigative (I) underpins evidence-based psychological assessment.',
    milestones: [
      {
        phase: 'Stage 1 · Launch',
        timeframe: '0–2 yrs post-grad',
        roleTitle: 'Provisional Psychologist / Behavioral Analyst',
        focus: 'Support school wellbeing, behavioral research, or people-analytics teams.',
        compensationRange: 'AUD 68k – 84k/yr',
      },
      {
        phase: 'Stage 2 · Accelerate',
        timeframe: '3–5 yrs experience',
        roleTitle: 'Registered / Organizational Psychologist',
        focus: 'Deliver clinical therapy or advise enterprises on culture and mental health.',
        compensationRange: 'AUD 98k – 130k/yr',
      },
      {
        phase: 'Stage 3 · Lead',
        timeframe: '6+ yrs experience',
        roleTitle: 'Clinical Director / Principal Behavioral Advisor',
        focus: 'Direct specialist clinics or enterprise human-behavior strategy.',
        compensationRange: 'AUD 140k – 185k/yr',
      },
    ],
  },
  education_edtech: {
    majorId: 'education_edtech',
    industryName: 'International Education, TESOL & EdTech',
    demandGrowthPct: 19,
    shortageLevel: 'High',
    dataSourceNote: 'Australian Teacher Workforce & Global EdTech Market Report',
    topHiringHubs: 'Melbourne · Auckland · Singapore · London',
    riasecConnectionNote:
      'Social (S) inspires and mentors learners, while Artistic (A) helps craft engaging curricula and interactive digital learning tools.',
    milestones: [
      {
        phase: 'Stage 1 · Launch',
        timeframe: '0–1 yr post-grad',
        roleTitle: 'Graduate Teacher / Learning Designer',
        focus: 'Teach in international schools or design interactive EdTech modules.',
        compensationRange: 'AUD 72k – 85k/yr',
      },
      {
        phase: 'Stage 2 · Accelerate',
        timeframe: '2–4 yrs experience',
        roleTitle: 'Lead Educator / EdTech Product Specialist',
        focus: 'Build AI-assisted curriculum frameworks and mentor teaching departments.',
        compensationRange: 'AUD 95k – 118k/yr',
      },
      {
        phase: 'Stage 3 · Lead',
        timeframe: '5+ yrs experience',
        roleTitle: 'Academic Director / Head of Curriculum',
        focus: 'Lead academic strategy across international school networks or EdTech platforms.',
        compensationRange: 'AUD 130k – 165k/yr',
      },
    ],
  },
  law_ir: {
    majorId: 'law_ir',
    industryName: 'International Trade Law, ESG & Public Policy',
    demandGrowthPct: 16,
    shortageLevel: 'High',
    dataSourceNote: 'Law Council Global Outlook & WEF Governance Trends',
    topHiringHubs: 'London · Sydney · Singapore · Canberra',
    riasecConnectionNote:
      'Enterprising (E) brings persuasive advocacy and negotiation, paired with Conventional (C) and Investigative (I) legal precision.',
    milestones: [
      {
        phase: 'Stage 1 · Launch',
        timeframe: '0–1 yr post-grad',
        roleTitle: 'Graduate Lawyer / Policy Research Officer',
        focus: 'Case-law research, commercial contract drafting, and international compliance.',
        compensationRange: 'AUD 74k – 95k/yr',
      },
      {
        phase: 'Stage 2 · Accelerate',
        timeframe: '2–4 yrs experience',
        roleTitle: 'Corporate / Tech & IP Associate',
        focus: 'Advise on cross-border deals, AI intellectual property, and ESG regulation.',
        compensationRange: 'AUD 115k – 160k/yr',
      },
      {
        phase: 'Stage 3 · Lead',
        timeframe: '5+ yrs experience',
        roleTitle: 'Senior Legal Counsel / Partner',
        focus: 'Lead high-stakes international negotiations or global policy advisory.',
        compensationRange: 'AUD 180k – 280k+/yr',
      },
    ],
  },
  logistics_scm: {
    majorId: 'logistics_scm',
    industryName: 'Global Supply Chain & Smart Operations',
    demandGrowthPct: 21,
    shortageLevel: 'High',
    dataSourceNote: 'WEF Global Supply Chain Outlook & Singapore Maritime Report',
    topHiringHubs: 'Singapore · Melbourne · Sydney · Toronto',
    riasecConnectionNote:
      'Conventional (C) tracks thousands of logistics nodes cleanly, while Enterprising (E) drives global supplier negotiations.',
    milestones: [
      {
        phase: 'Stage 1 · Launch',
        timeframe: '0–1 yr post-grad',
        roleTitle: 'Supply Chain / Procurement Analyst',
        focus: 'Demand forecasting, international freight coordination, and logistics cost modeling.',
        compensationRange: 'AUD 68k – 84k/yr',
      },
      {
        phase: 'Stage 2 · Accelerate',
        timeframe: '2–4 yrs experience',
        roleTitle: 'Operations / Global Sourcing Manager',
        focus: 'Design resilient green supply networks, warehouse automation, and vendor strategy.',
        compensationRange: 'AUD 105k – 135k/yr',
      },
      {
        phase: 'Stage 3 · Lead',
        timeframe: '5+ yrs experience',
        roleTitle: 'Director of Global Supply Chain',
        focus: 'Architect APAC or worldwide distribution and procurement strategy.',
        compensationRange: 'AUD 155k – 210k/yr',
      },
    ],
  },
  biotech_env: {
    majorId: 'biotech_env',
    industryName: 'Biotechnology, Clean Energy & ESG Science',
    demandGrowthPct: 29,
    shortageLevel: 'Critical',
    dataSourceNote: 'WEF Green Transition Report & CSIRO Future Industries',
    topHiringHubs: 'Brisbane · Melbourne · Singapore · London',
    riasecConnectionNote:
      'Investigative (I) drives molecular and climate research, while Realistic (R) translates breakthroughs into field-ready solutions.',
    milestones: [
      {
        phase: 'Stage 1 · Launch',
        timeframe: '0–1 yr post-grad',
        roleTitle: 'Biotech Research / ESG Junior Analyst',
        focus: 'Run molecular biology assays or audit enterprise carbon footprints.',
        compensationRange: 'AUD 68k – 84k/yr',
      },
      {
        phase: 'Stage 2 · Accelerate',
        timeframe: '2–4 yrs experience',
        roleTitle: 'Bioinformatics / Sustainability Consultant',
        focus: 'Apply genomics data, agri-tech innovation, or Net-Zero transition roadmaps.',
        compensationRange: 'AUD 98k – 128k/yr',
      },
      {
        phase: 'Stage 3 · Lead',
        timeframe: '5+ yrs experience',
        roleTitle: 'Principal Scientist / Chief Sustainability Lead',
        focus: 'Lead biomedical R&D programs or corporate green-transition strategy.',
        compensationRange: 'AUD 145k – 195k/yr',
      },
    ],
  },
  languages_translation: {
    majorId: 'languages_translation',
    industryName: 'Cross-Cultural Comms & Global Localization',
    demandGrowthPct: 14,
    shortageLevel: 'Steady',
    dataSourceNote: 'Global Localization & Cross-Border Digital Economy Report',
    topHiringHubs: 'Singapore · London · Melbourne · Toronto',
    riasecConnectionNote:
      'Artistic (A) and Social (S) cultivate linguistic nuance, connecting international brands and multicultural communities.',
    milestones: [
      {
        phase: 'Stage 1 · Launch',
        timeframe: '0–1 yr post-grad',
        roleTitle: 'Localization / Global Comms Coordinator',
        focus: 'Adapt digital products, external communications, and multilingual communities.',
        compensationRange: 'AUD 62k – 76k/yr',
      },
      {
        phase: 'Stage 2 · Accelerate',
        timeframe: '2–4 yrs experience',
        roleTitle: 'Cross-Cultural Program / PR Manager',
        focus: 'Coordinate international partnerships or serve as an AI Language Specialist.',
        compensationRange: 'AUD 88k – 115k/yr',
      },
      {
        phase: 'Stage 3 · Lead',
        timeframe: '5+ yrs experience',
        roleTitle: 'Director of International Relations / Comms',
        focus: 'Represent global outreach and lead market-expansion communications.',
        compensationRange: 'AUD 130k – 170k/yr',
      },
    ],
  },
  hospitality_tourism: {
    majorId: 'hospitality_tourism',
    industryName: 'Luxury Hospitality & Global Experience Mgmt',
    demandGrowthPct: 20,
    shortageLevel: 'High',
    dataSourceNote: 'World Travel & Tourism Council (WTTC) Workforce Outlook',
    topHiringHubs: 'Singapore · Sydney · Brisbane · Auckland',
    riasecConnectionNote:
      'Social (S) fosters refined hospitality and guest care, while Enterprising (E) leads large-scale service operations and events.',
    milestones: [
      {
        phase: 'Stage 1 · Launch',
        timeframe: '0–1 yr post-grad',
        roleTitle: 'Management Trainee / Event Coordinator',
        focus: 'Rotate across five-star hotel operations or global event production.',
        compensationRange: 'AUD 60k – 74k/yr',
      },
      {
        phase: 'Stage 2 · Accelerate',
        timeframe: '2–4 yrs experience',
        roleTitle: 'Guest Experience / Operations Manager',
        focus: 'Manage revenue, luxury service standards, and international hospitality teams.',
        compensationRange: 'AUD 85k – 112k/yr',
      },
      {
        phase: 'Stage 3 · Lead',
        timeframe: '5+ yrs experience',
        roleTitle: 'Hotel General Manager / Hospitality Director',
        focus: 'Direct flagship resorts or scale sustainable global tourism brands.',
        compensationRange: 'AUD 130k – 185k/yr',
      },
    ],
  },
};
