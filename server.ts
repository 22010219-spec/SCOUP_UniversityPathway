import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

interface GroundingSource {
  title: string;
  url: string;
}

interface HighDemandCareer {
  roleName: string;
  field: string;
  demandGrowth: string;
  keyInsight: string;
  topSkills: string[];
  matchingMajorIds: string[];
}

interface LaborMarketPayload {
  market: string;
  updatedAt: string;
  summary: string;
  careers: HighDemandCareer[];
  sources: GroundingSource[];
}

const cache = new Map<string, { payload: LaborMarketPayload; expiresAt: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractJsonBlock(rawText: string): Record<string, unknown> | null {
  const trimmed = rawText.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch ? fencedMatch[1].trim() : trimmed;
  try {
    return JSON.parse(candidate) as Record<string, unknown>;
  } catch {
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>;
      } catch {
        return null;
      }
    }
    return null;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.post('/api/labor-market-insights', async (req, res) => {
    const market = typeof req.body?.market === 'string' && req.body.market.trim()
      ? req.body.market.trim()
      : 'Australia & Global';
    const focusMajor = typeof req.body?.focusMajor === 'string' ? req.body.focusMajor.trim() : '';
    const forceRefresh = Boolean(req.body?.refresh);

    const cacheKey = `${market}::${focusMajor}`;
    if (!forceRefresh) {
      const cached = cache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        res.json(cached.payload);
        return;
      }
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'GEMINI_API_KEY is not configured on the server. Please set the key in Settings > Secrets to enable Google Search grounding.',
      });
      return;
    }

    const majorMappingGuide = [
      'cs_ai (Computer Science & AI)',
      'mechatronics (Mechatronics, Robotics & Aerospace)',
      'fintech_ba (Finance, Actuarial & Business Analytics)',
      'marketing_media (Digital Media, Marketing & Communications)',
      'architecture_urban (Architecture & Sustainable Urban Design)',
      'ux_graphic_design (Interaction Design UI/UX & Creative Tech)',
      'medicine_health (Medicine, Biomedicine & Health Sciences)',
      'psychology_social (Psychology & Behavioral Science)',
      'education_edtech (Education, TESOL & Learning Innovation)',
      'law_ir (International Law, Politics & Global Relations)',
      'logistics_scm (Global Supply Chain & Operations Management)',
      'biotech_env (Biotechnology, Environmental & Sustainability Science)',
      'languages_translation (Global Studies, Languages & Cross-Cultural Comm)',
      'hospitality_tourism (International Hospitality, Events & Experience Mgmt)',
    ].join(', ');

    const focusClause = focusMajor
      ? `Prioritize deep insights specifically within "${focusMajor}".`
      : 'Cover a balanced mix of technology, healthcare, finance, green engineering, and creative industries.';

    const prompt = `Use Google Search to retrieve the latest labor market data (2025–2030 outlook) on high-demand future careers in "${market}". ${focusClause}

Based on credible workforce reports (e.g., World Economic Forum Future of Jobs, Jobs and Skills Australia, SkillsFuture Singapore, UK Shortage Occupation List, LinkedIn Jobs on the Rise), return ONLY a single valid JSON object (no markdown commentary outside the JSON) written in concise, natural English suitable for high school students:
{
  "summary": "A concise 2-sentence overview of the strongest talent demand trends in ${market} based on the search results.",
  "careers": [
    {
      "roleName": "High-demand role or career cluster name",
      "field": "Industry sector (e.g., Tech & AI, Healthcare, Clean Energy & Sustainability...)",
      "demandGrowth": "Specific growth rate or shortage indicator found (e.g., +35% by 2030 or High Shortage)",
      "keyInsight": "1–2 practical sentences explaining why demand is growing and opportunities for international graduates.",
      "topSkills": ["Skill 1", "Skill 2", "Skill 3"],
      "matchingMajorIds": ["choose 1-2 best matching IDs from: ${majorMappingGuide}"]
    }
  ]
}
Return exactly 6 items in the "careers" array. Only include facts grounded in the search results.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const rawText = response.text ?? '';
      const parsed = extractJsonBlock(rawText);

      const groundingChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

      const sourcesMap = new Map<string, GroundingSource>();
      for (const chunk of groundingChunks) {
        const uri = chunk.web?.uri;
        const title = chunk.web?.title;
        if (uri && !sourcesMap.has(uri)) {
          sourcesMap.set(uri, {
            url: uri,
            title: title || uri,
          });
        }
      }

      const validMajorIds = new Set([
        'cs_ai',
        'mechatronics',
        'fintech_ba',
        'marketing_media',
        'architecture_urban',
        'ux_graphic_design',
        'medicine_health',
        'psychology_social',
        'education_edtech',
        'law_ir',
        'logistics_scm',
        'biotech_env',
        'languages_translation',
        'hospitality_tourism',
      ]);

      const rawCareers = Array.isArray(parsed?.careers) ? parsed.careers : [];
      const careers: HighDemandCareer[] = rawCareers
        .slice(0, 6)
        .map((item) => {
          const obj = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
          const skills = Array.isArray(obj.topSkills)
            ? obj.topSkills.filter((s): s is string => typeof s === 'string').slice(0, 3)
            : [];
          const majorIds = Array.isArray(obj.matchingMajorIds)
            ? obj.matchingMajorIds.filter(
                (id): id is string => typeof id === 'string' && validMajorIds.has(id)
              )
            : [];
          return {
            roleName: typeof obj.roleName === 'string' ? obj.roleName : 'High-Growth Career',
            field: typeof obj.field === 'string' ? obj.field : 'Cross-Industry',
            demandGrowth:
              typeof obj.demandGrowth === 'string' ? obj.demandGrowth : 'Strong Demand',
            keyInsight: typeof obj.keyInsight === 'string' ? obj.keyInsight : '',
            topSkills: skills,
            matchingMajorIds: majorIds,
          };
        })
        .filter((c) => c.keyInsight.length > 0);

      const payload: LaborMarketPayload = {
        market,
        updatedAt: new Date().toISOString(),
        summary:
          typeof parsed?.summary === 'string' && parsed.summary.trim()
            ? parsed.summary.trim()
            : rawText.slice(0, 420) || 'Workforce trends synthesized via Google Search grounding.',
        careers,
        sources: Array.from(sourcesMap.values()).slice(0, 8),
      };

      cache.set(cacheKey, {
        payload,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });

      res.json(payload);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unable to retrieve Google Search labor insights.';
      console.error('Labor market search error:', err);
      res.status(502).json({
        error: `Google Search Grounding error: ${message}`,
      });
    }
  });

  app.post('/api/career-mentor', async (req, res) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'GEMINI_API_KEY is not configured on the server. Please set the key in Settings > Secrets to use the Career Mentor.',
      });
      return;
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const rawMessages = Array.isArray(body.messages) ? body.messages : [];
    const validMessages = rawMessages
      .filter(
        (m): m is { role: 'user' | 'model'; text: string } =>
          Boolean(m) &&
          typeof m === 'object' &&
          ((m as { role?: unknown }).role === 'user' ||
            (m as { role?: unknown }).role === 'model') &&
          typeof (m as { text?: unknown }).text === 'string' &&
          (m as { text: string }).text.trim().length > 0
      )
      .slice(-12);

    if (validMessages.length === 0) {
      res.status(400).json({ error: 'Message is invalid or empty.' });
      return;
    }

    const riasec = (body.riasecScores ?? {}) as Record<string, number>;
    const topCode = typeof body.topCode === 'string' ? body.topCode : 'I-R-C';
    const archetypeTitle =
      typeof body.archetypeTitle === 'string' ? body.archetypeTitle : 'Explorer';
    const targetAtar =
      typeof body.targetAtar === 'number' ? body.targetAtar.toFixed(2) : '85.00';
    const credentialDisplay =
      typeof body.credentialDisplay === 'string' && body.credentialDisplay.trim()
        ? body.credentialDisplay.trim()
        : `${targetAtar} ATAR`;
    const subjectTrack =
      typeof body.subjectTrack === 'string' ? body.subjectTrack : 'Undecided';
    const preferredRegion =
      typeof body.preferredRegion === 'string' ? body.preferredRegion : 'Australia & Global';
    const selectedMajorName =
      typeof body.selectedMajorName === 'string' ? body.selectedMajorName : 'Target Major';
    const selectedIndustry =
      typeof body.selectedIndustry === 'string' ? body.selectedIndustry : 'Tech & Business';
    const demandGrowthPct =
      typeof body.demandGrowthPct === 'number' ? body.demandGrowthPct : 20;
    const shortageLevel =
      typeof body.shortageLevel === 'string' ? body.shortageLevel : 'High';
    const driverTraitsSummary =
      typeof body.driverTraitsSummary === 'string' ? body.driverTraitsSummary : '';

    const systemInstruction = `You are a friendly, practical International Career Mentor with deep expertise in global university admissions (ATAR, Digital SAT, IB Diploma, A-Levels, 4.0 GPA), campus residential/dorm life, global labor markets (Australia, Singapore, UK, Canada, New Zealand), and the RIASEC career model.

Student's current profile:
- Personality Archetype: ${archetypeTitle} (Top RIASEC Code: ${topCode})
- Detailed RIASEC scores: R=${riasec.R ?? 50}%, I=${riasec.I ?? 50}%, A=${riasec.A ?? 50}%, S=${riasec.S ?? 50}%, E=${riasec.E ?? 50}%, C=${riasec.C ?? 50}%
- Academic Credential Target: ${credentialDisplay} (Equivalent ${targetAtar} ATAR) · Subject Track: ${subjectTrack} · Preferred Region: ${preferredRegion}
- Selected Major & Trend: ${selectedMajorName} — Industry "${selectedIndustry}" (Projected 2025–2030 workforce growth +${demandGrowthPct}%, Shortage level: ${shortageLevel})
- Trait alignment with industry: ${driverTraitsSummary}

Your mission:
1. Give concrete, personalized advice on how to bridge the gap between the student's current RIASEC strengths/growth areas and the real demands of their chosen industry trend.
2. Recommend actionable high-school steps (personal projects, prerequisite subjects, complementary skills, and test prep tailored to their ${credentialDisplay} track + IELTS) in an encouraging, crisp, scannable style (clear bullet points, ~150–250 words per reply unless the student asks for more detail).
3. Never fabricate unrealistic entry scores; always respond in clear, natural English.`;

    try {
      const contents = validMessages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const reply = (response.text ?? '').trim();
      if (!reply) {
        res.status(502).json({
          error: 'The Career Mentor did not return a response. Please try sending your question again.',
        });
        return;
      }

      res.json({ reply });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unable to connect to Career Mentor.';
      console.error('Career mentor error:', err);
      res.status(502).json({
        error: `Career Mentor error: ${message}`,
      });
    }
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
