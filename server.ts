import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  COUNTRY_SUMMARIES,
  CULTURAL_KNOWLEDGE_BASE,
  DEMO_SCENARIO_PRESETS,
  SCENARIO_OPTIONS,
} from './src/data/culturalKnowledgeBase.ts';
import {
  detectBusinessIntent,
  normalizeEmailAnalysis,
  normalizeNegotiationTurn,
  retrieveCulturalContext,
  validateEmailInput,
} from './src/utils/culturalEngine.ts';
import type {
  BusinessContext,
  DifficultyLevel,
  NegotiationMessage,
} from './src/types/culturebridge.ts';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = 'gemini-4-hydrogen';

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured in the server environment.'
    );
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

function isTransientError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('503') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('high demand') ||
    msg.includes('429') ||
    msg.includes('ECONNRESET') ||
    msg.includes('ETIMEDOUT')
  );
}

function formatFriendlyGeminiError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes('503') || raw.includes('UNAVAILABLE') || raw.includes('high demand')) {
    return 'The AI model is experiencing temporary high demand. Please try again in a few seconds.';
  }
  if (raw.includes('429') || raw.includes('RESOURCE_EXHAUSTED')) {
    return 'AI rate limit reached temporarily. Please wait a moment and try again.';
  }
  if (raw.includes('API_KEY_INVALID') || raw.includes('403') || raw.includes('PERMISSION_DENIED')) {
    return 'API key configuration issue. Please verify GEMINI_API_KEY in Settings > Secrets.';
  }
  return raw;
}

async function callGeminiWithRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts && isTransientError(err)) {
        const delayMs = attempt * 900;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

const EMAIL_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    improved_email: {
      type: Type.OBJECT,
      properties: {
        subject: {
          type: Type.STRING,
          description: 'Professional English email subject line.',
        },
        greeting: {
          type: Type.STRING,
          description: 'Appropriate respectful salutation.',
        },
        body: {
          type: Type.STRING,
          description:
            'Well-structured professional email body tailored to the Gulf market context.',
        },
        closing: {
          type: Type.STRING,
          description: 'Polite sign-off with sender role and company.',
        },
        full_text: {
          type: Type.STRING,
          description: 'Complete email formatted cleanly from Subject to closing.',
        },
        arabic_courtesy_note: {
          type: Type.STRING,
          description:
            'Optional respectful Arabic greeting/closing suggestion if requested.',
        },
      },
      required: ['subject', 'greeting', 'body', 'closing', 'full_text'],
    },
    cultural_analysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          aspect: {
            type: Type.STRING,
            description:
              'Must be one of: Communication Style, Relationship Building, What to Avoid, Why AI Changed Your Email',
          },
          summary: {
            type: Type.STRING,
            description: 'Concise 4-8 word headline for this cultural dimension.',
          },
          explanation: {
            type: Type.STRING,
            description: 'Clear explanation tailored to the user message.',
          },
          reason: {
            type: Type.STRING,
            description: 'Why this matters in UAE/Qatar business communication.',
          },
        },
        required: ['aspect', 'summary', 'explanation', 'reason'],
      },
    },
    risk_warnings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          severity: {
            type: Type.STRING,
            description: 'low, medium, or high',
          },
          title: {
            type: Type.STRING,
            description: 'Short label for the communication risk.',
          },
          message: {
            type: Type.STRING,
            description: 'Specific cultural or tone risk in the original draft.',
          },
          suggestion: {
            type: Type.STRING,
            description: 'Concrete way to mitigate the risk.',
          },
        },
        required: ['severity', 'title', 'message', 'suggestion'],
      },
    },
    alternative_phrases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: {
            type: Type.STRING,
            description: 'Original phrasing or intent from the Vietnamese draft.',
          },
          improved: {
            type: Type.STRING,
            description: 'Culturally refined English alternative.',
          },
          reason: {
            type: Type.STRING,
            description: 'Nuance explanation comparing original vs improved.',
          },
        },
        required: ['original', 'improved', 'reason'],
      },
    },
    confidence_note: {
      type: Type.STRING,
      description:
        'Brief reminder noting individual company variation and reference basis.',
    },
  },
  required: [
    'improved_email',
    'cultural_analysis',
    'risk_warnings',
    'alternative_phrases',
    'confidence_note',
  ],
};

const NEGOTIATION_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    partner_reply: {
      type: Type.STRING,
      description:
        'Realistic response in character from the UAE or Qatar business partner.',
    },
    partner_tone_note: {
      type: Type.STRING,
      description:
        'Brief 1-sentence note describing the partner attitude/subtext.',
    },
    coaching: {
      type: Type.OBJECT,
      properties: {
        clarity_rating: {
          type: Type.STRING,
          description: 'Needs Clarity, Clear, or Very Clear',
        },
        professionalism_rating: {
          type: Type.STRING,
          description: 'Developing, Professional, or Executive Grade',
        },
        assessment: {
          type: Type.STRING,
          description:
            'Assessment of clarity, commercial framing, and professionalism.',
        },
        better_phrasing: {
          type: Type.STRING,
          description: 'Concrete suggestion on how to phrase the reply better.',
        },
        cultural_insight: {
          type: Type.STRING,
          description:
            'Relevant Gulf/UAE/Qatar cultural or communication principle.',
        },
        alternative_reply: {
          type: Type.STRING,
          description:
            'A complete polished alternative response the user could send.',
        },
      },
      required: [
        'clarity_rating',
        'professionalism_rating',
        'assessment',
        'better_phrasing',
        'cultural_insight',
        'alternative_reply',
      ],
    },
  },
  required: ['partner_reply', 'partner_tone_note', 'coaching'],
};

async function createApp() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'CultureBridge AI',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  app.get('/api/knowledge', (_req, res) => {
    res.json({
      countries: COUNTRY_SUMMARIES,
      scenarios: SCENARIO_OPTIONS,
      knowledgeBase: CULTURAL_KNOWLEDGE_BASE,
      presets: DEMO_SCENARIO_PRESETS,
    });
  });

  app.post('/api/email/analyze', async (req, res) => {
    try {
      const { draftText, context } = req.body as {
        draftText: string;
        context: BusinessContext;
      };

      const validation = validateEmailInput(draftText, context);
      if (!validation.valid) {
        res.status(400).json({ error: validation.error });
        return;
      }

      // Layer 1: Business Intent Understanding
      const intentResult = detectBusinessIntent(
        draftText,
        context.scenario,
        context.targetCountry
      );

      // Layer 2: Cultural Context Engine
      const { countrySummary, knowledgeEntry } = retrieveCulturalContext(
        context.targetCountry,
        context.scenario
      );

      // Layer 3: AI Communication Generator (Gemini)
      const ai = getGenAIClient();
      const systemInstruction = `You are CultureBridge AI, an authoritative cross-cultural business communication copilot helping Vietnamese exporters communicate effectively with business partners in the UAE and Qatar.

You operate inside a 3-layer structured architecture:
- Layer 1 (Business Intent) and Layer 2 (Verified Cultural Knowledge Base) have already run.
- Do NOT behave like a generic translator. Adapt the Vietnamese draft into polished, natural, culturally attuned Business English tailored to the exact target country, scenario, sender role, and partner role.
- Never stereotype every individual in a country; frame cultural insights as prevalent commercial norms and helpful preparation.
- Return ONLY valid JSON matching the requested schema.
- In cultural_analysis, provide exactly 4 items covering these 4 aspects:
  1) "Communication Style"
  2) "Relationship Building"
  3) "What to Avoid"
  4) "Why AI Changed Your Email"
- Provide 2 to 3 concrete risk_warnings and 2 to 4 alternative_phrases comparing original Vietnamese intent/phrases with refined English alternatives.`;

      const prompt = `CONTEXT:
- Sender Country: Vietnam
- Sender Role: ${context.yourRole}
- Sender Company: ${context.companyName || 'Vietnamese Export Enterprise'}
- Product / Focus: ${context.productFocus || 'Export Products'}
- Target Country: ${context.targetCountry} (${countrySummary.officialName})
- Partner Role: ${context.partnerRole}
- Partner Name: ${context.partnerName || '[Partner Name]'}
- Business Scenario: ${knowledgeEntry.scenarioLabel}
- Output Language Setting: ${
        context.language === 'english_arabic'
          ? 'Business English + Optional Respectful Arabic Courtesy Note'
          : 'Business English'
      }

LAYER 1 — DETECTED BUSINESS INTENT:
- Primary Intent: ${intentResult.primaryIntent}
- Signals: ${intentResult.detectedSignals.join('; ')}
- Urgency Risk Detected: ${intentResult.urgencyRiskDetected}
- Directness Risk Detected: ${intentResult.directnessRiskDetected}

LAYER 2 — CURATED CULTURAL KNOWLEDGE BASE (${knowledgeEntry.id}):
- Work Week: ${countrySummary.workWeek}
- Decision Style: ${countrySummary.decisionStyle}
- Communication Style Norms: ${knowledgeEntry.communicationStyle.join('; ')}
- Relationship Building Norms: ${knowledgeEntry.relationshipNorms.join('; ')}
- Verified Recommendations: ${knowledgeEntry.recommendations.join('; ')}
- Things to Avoid: ${knowledgeEntry.thingsToAvoid.join('; ')}
- Verified Sources: ${knowledgeEntry.sources.join(', ')}

ORIGINAL DRAFT (Vietnamese/Input):
"""
${draftText.trim()}
"""

Generate the improved Business English email (plus arabic_courtesy_note if Output Language Setting includes Arabic Courtesy), the 4 cultural_analysis items, risk_warnings, alternative_phrases, and confidence_note.`;

      const response = await callGeminiWithRetry(() =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: EMAIL_RESPONSE_SCHEMA,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        })
      );

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        throw new Error('Empty response received from AI model.');
      }

      const parsed = JSON.parse(rawText) as Record<string, unknown>;
      const normalized = normalizeEmailAnalysis(
        parsed,
        context,
        intentResult,
        knowledgeEntry
      );

      res.json(normalized);
    } catch (err) {
      const friendly = formatFriendlyGeminiError(err);
      console.error('[/api/email/analyze] Error:', friendly);
      res.status(503).json({
        error: friendly,
      });
    }
  });

  app.post('/api/negotiation/turn', async (req, res) => {
    try {
      const { context, difficulty, history, userMessage } = req.body as {
        context: BusinessContext;
        difficulty: DifficultyLevel;
        history: NegotiationMessage[];
        userMessage: string;
      };

      if (!userMessage || userMessage.trim().length < 2) {
        res
          .status(400)
          .json({ error: 'Please enter a response to continue the negotiation.' });
        return;
      }

      const { countrySummary, knowledgeEntry } = retrieveCulturalContext(
        context.targetCountry,
        context.scenario
      );

      const ai = getGenAIClient();

      const difficultyGuide =
        difficulty === 'Beginner'
          ? 'Warm, welcoming, patient, and open to guiding a new Vietnamese exporter through commercial questions.'
          : difficulty === 'Intermediate'
            ? 'Polite and relationship-oriented, yet commercially sharp—asks clear questions on MOQ, certifications, pricing benchmarks, and lead time.'
            : 'Senior decision-maker with firm commercial expectations—tests supplier flexibility on target price, payment terms, and long-term reliability while remaining dignified.';

      const transcript = (history ?? [])
        .slice(-8)
        .map(
          (m) =>
            `${m.sender === 'partner' ? `${context.partnerRole} (${context.targetCountry})` : `Vietnamese ${context.yourRole}`}: ${m.text}`
        )
        .join('\n');

      const systemInstruction = `You play TWO distinct roles in structured JSON:
1. "partner_reply" & "partner_tone_note": You roleplay as a realistic ${context.partnerRole} based in ${context.targetCountry} (${countrySummary.officialName}), named ${context.partnerName || (context.targetCountry === 'UAE' ? 'Tariq Al-Mansoori' : 'Khalifa Al-Thani')}, negotiating with a Vietnamese ${context.yourRole} from ${context.companyName || 'a Vietnamese exporter'} regarding ${context.productFocus || 'export goods'}.
Difficulty level: ${difficulty} — ${difficultyGuide}
Keep your partner reply concise (2-4 sentences), authentic, and never stereotype by nationality—act as a thoughtful individual commercial executive.

2. "coaching": You step out of character as CultureBridge Cultural Coach and evaluate the user's LATEST reply on clarity, professionalism, cultural framing for ${context.targetCountry}, a concrete better phrasing tip, and a ready-to-use alternative_reply.`;

      const prompt = `CONTEXT:
- Market: Vietnam -> ${context.targetCountry}
- Scenario: ${knowledgeEntry.scenarioLabel}
- Work Week & Etiquette: ${countrySummary.workWeek}; ${knowledgeEntry.recommendations.join('; ')}
- Risks to watch: ${knowledgeEntry.thingsToAvoid.join('; ')}

CONVERSATION HISTORY:
${transcript || '(Opening exchange)'}

USER'S LATEST MESSAGE:
"""
${userMessage.trim()}
"""

Respond in valid JSON matching the schema.`;

      const response = await callGeminiWithRetry(() =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: NEGOTIATION_RESPONSE_SCHEMA,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        })
      );

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        throw new Error('Empty response received from AI simulator.');
      }

      const parsed = JSON.parse(rawText) as Record<string, unknown>;
      const normalized = normalizeNegotiationTurn(
        parsed,
        context.targetCountry,
        knowledgeEntry.sources,
        knowledgeEntry.nuanceNote
      );

      res.json(normalized);
    } catch (err) {
      const friendly = formatFriendlyGeminiError(err);
      console.error('[/api/negotiation/turn] Error:', friendly);
      res.status(503).json({
        error: friendly,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CultureBridge AI server listening on http://localhost:${PORT}`);
  });
}

createApp().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
