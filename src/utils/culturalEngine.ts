import {
  COUNTRY_SUMMARIES,
  CULTURAL_KNOWLEDGE_BASE,
  SCENARIO_OPTIONS,
} from '../data/culturalKnowledgeBase.ts';
import type {
  AlternativePhrase,
  BusinessContext,
  BusinessIntentResult,
  BusinessScenario,
  CountryProfileSummary,
  CulturalAnalysisItem,
  CulturalKnowledgeEntry,
  EmailAnalysisResponse,
  NegotiationCoaching,
  NegotiationTurnResponse,
  RiskWarning,
  TargetCountry,
} from '../types/culturebridge.ts';

const URGENCY_PATTERNS = [
  /phản hồi sớm/i,
  /trả lời gấp/i,
  /xác nhận gấp/i,
  /ngay lập tức/i,
  /chỉ có hiệu lực/i,
  /urgent/i,
  /asap/i,
  /immediately/i,
  /hôm nay/i,
  /giữ hàng/i,
];

const DIRECTNESS_PATTERNS = [
  /không thể/i,
  /lỗ vốn/i,
  /bắt buộc/i,
  /tối thiểu/i,
  /chưa thấy.*trả lời/i,
  /cho em biết quyết định/i,
  /impossible/i,
  /must pay/i,
  /final price/i,
];

const WEEKEND_OR_FRIDAY_PATTERNS = [
  /thứ sáu/i,
  /thứ 6/i,
  /thứ bảy/i,
  /thứ 7/i,
  /friday/i,
  /saturday/i,
];

export function detectBusinessIntent(
  draftText: string,
  selectedScenario: BusinessScenario,
  targetCountry: TargetCountry = 'UAE'
): BusinessIntentResult {
  const normalized = draftText.trim();
  const detectedSignals: string[] = [];

  const urgencyRiskDetected = URGENCY_PATTERNS.some((pattern) =>
    pattern.test(normalized)
  );
  if (urgencyRiskDetected) {
    detectedSignals.push('Time pressure or urgency phrasing detected');
  }

  const directnessRiskDetected = DIRECTNESS_PATTERNS.some((pattern) =>
    pattern.test(normalized)
  );
  if (directnessRiskDetected) {
    detectedSignals.push('Blunt constraint or rigid commercial framing detected');
  }

  if (/giá|báo giá|usd|fob|cif|price|quote/i.test(normalized)) {
    detectedSignals.push('Commercial pricing or quotation reference');
  }

  if (/mẫu|sample|catalog|hồ sơ/i.test(normalized)) {
    detectedSignals.push('Product sample or specification exchange');
  }

  if (/họp|meeting|call|zoom|trao đổi trực tiếp/i.test(normalized)) {
    detectedSignals.push('Meeting scheduling intent');
  }

  if (
    targetCountry === 'Qatar' &&
    WEEKEND_OR_FRIDAY_PATTERNS.some((pattern) => pattern.test(normalized))
  ) {
    detectedSignals.push('Schedule conflict risk with Qatar Fri–Sat weekend');
  } else if (
    targetCountry === 'UAE' &&
    /thứ sáu|friday/i.test(normalized)
  ) {
    detectedSignals.push('Check Friday midday prayer window in UAE');
  }

  if (detectedSignals.length === 0) {
    detectedSignals.push('Standard B2B export correspondence');
  }

  const scenarioObj = SCENARIO_OPTIONS.find((s) => s.value === selectedScenario);
  const primaryIntent = scenarioObj
    ? scenarioObj.label
    : 'Cross-Border Business Communication';

  return {
    primaryIntent,
    scenarioMatch: selectedScenario,
    detectedSignals,
    urgencyRiskDetected,
    directnessRiskDetected,
  };
}

export function retrieveCulturalContext(
  country: TargetCountry,
  scenario: BusinessScenario
): {
  countrySummary: CountryProfileSummary;
  knowledgeEntry: CulturalKnowledgeEntry;
} {
  const countrySummary = COUNTRY_SUMMARIES[country] ?? COUNTRY_SUMMARIES.UAE;
  const matched =
    CULTURAL_KNOWLEDGE_BASE.find(
      (entry) => entry.country === country && entry.scenario === scenario
    ) ??
    CULTURAL_KNOWLEDGE_BASE.find((entry) => entry.country === country) ??
    CULTURAL_KNOWLEDGE_BASE[0];

  return {
    countrySummary,
    knowledgeEntry: matched,
  };
}

export function validateEmailInput(
  draftText: string,
  context: BusinessContext
): { valid: boolean; error?: string } {
  if (!draftText || draftText.trim().length < 12) {
    return {
      valid: false,
      error:
        'Please enter a message of at least 12 characters in Vietnamese or English so the Cultural Context Engine can analyze intent and tone.',
    };
  }
  if (draftText.trim().length > 4000) {
    return {
      valid: false,
      error: 'Message exceeds the 4,000-character limit for single-email analysis.',
    };
  }
  if (!context.targetCountry || !context.scenario) {
    return {
      valid: false,
      error: 'Please select a target country and business scenario first.',
    };
  }
  return { valid: true };
}

export function normalizeEmailAnalysis(
  raw: Partial<EmailAnalysisResponse> | Record<string, unknown>,
  context: BusinessContext,
  intent: BusinessIntentResult,
  knowledgeEntry: CulturalKnowledgeEntry
): EmailAnalysisResponse {
  const rawObj = (raw ?? {}) as Record<string, unknown>;
  const rawEmail = (rawObj.improved_email ?? {}) as Record<string, unknown>;

  const subject =
    typeof rawEmail.subject === 'string' && rawEmail.subject.trim()
      ? rawEmail.subject.trim()
      : `Exploring a Potential Business Partnership — ${context.companyName || 'Vietnam Export Partner'}`;

  const greeting =
    typeof rawEmail.greeting === 'string' && rawEmail.greeting.trim()
      ? rawEmail.greeting.trim()
      : `Dear ${context.partnerName || context.partnerRole},`;

  const body =
    typeof rawEmail.body === 'string' && rawEmail.body.trim()
      ? rawEmail.body.trim()
      : 'I hope this message finds you well. We would welcome the opportunity to introduce our products and explore a mutually beneficial partnership.';

  const closing =
    typeof rawEmail.closing === 'string' && rawEmail.closing.trim()
      ? rawEmail.closing.trim()
      : `Best regards,\n${context.yourRole}\n${context.companyName || 'Vietnam Export Partner'}`;

  const fullText =
    typeof rawEmail.full_text === 'string' && rawEmail.full_text.trim()
      ? rawEmail.full_text.trim()
      : `Subject: ${subject}\n\n${greeting}\n\n${body}\n\n${closing}`;

  const arabicNote =
    context.language === 'english_arabic' &&
    typeof rawEmail.arabic_courtesy_note === 'string' &&
    rawEmail.arabic_courtesy_note.trim()
      ? rawEmail.arabic_courtesy_note.trim()
      : context.language === 'english_arabic'
        ? `${knowledgeEntry.arabicCourtesyPhrases[0]?.arabic ?? ''} (${knowledgeEntry.arabicCourtesyPhrases[0]?.transliteration ?? ''}) — ${knowledgeEntry.arabicCourtesyPhrases[0]?.englishMeaning ?? ''}`
        : undefined;

  const rawAnalysis = Array.isArray(rawObj.cultural_analysis)
    ? rawObj.cultural_analysis
    : [];
  const cultural_analysis: CulturalAnalysisItem[] = rawAnalysis
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item) => ({
      aspect: normalizeAspect(item.aspect),
      summary: String(item.summary ?? 'Contextual cultural guidance'),
      explanation: String(item.explanation ?? ''),
      reason: String(item.reason ?? ''),
    }))
    .filter((item) => item.explanation.length > 0);

  const rawWarnings = Array.isArray(rawObj.risk_warnings)
    ? rawObj.risk_warnings
    : [];
  const risk_warnings: RiskWarning[] = rawWarnings
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item) => ({
      severity: normalizeSeverity(item.severity),
      title: String(item.title ?? 'Communication Caution'),
      message: String(item.message ?? ''),
      suggestion: String(item.suggestion ?? ''),
    }))
    .filter((item) => item.message.length > 0);

  const rawPhrases = Array.isArray(rawObj.alternative_phrases)
    ? rawObj.alternative_phrases
    : [];
  const alternative_phrases: AlternativePhrase[] = rawPhrases
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item) => ({
      original: String(item.original ?? ''),
      improved: String(item.improved ?? ''),
      reason: String(item.reason ?? ''),
    }))
    .filter((item) => item.improved.length > 0);

  const confidence_note =
    typeof rawObj.confidence_note === 'string' && rawObj.confidence_note.trim()
      ? rawObj.confidence_note.trim()
      : knowledgeEntry.nuanceNote;

  return {
    pipeline: {
      intent,
      knowledgeEntry,
    },
    improved_email: {
      subject,
      greeting,
      body,
      closing,
      full_text: fullText,
      ...(arabicNote ? { arabic_courtesy_note: arabicNote } : {}),
    },
    cultural_analysis,
    risk_warnings,
    alternative_phrases,
    confidence_note,
  };
}

function normalizeAspect(
  value: unknown
): CulturalAnalysisItem['aspect'] {
  if (
    value === 'Communication Style' ||
    value === 'Relationship Building' ||
    value === 'What to Avoid' ||
    value === 'Why AI Changed Your Email'
  ) {
    return value;
  }
  return 'Communication Style';
}

function normalizeSeverity(value: unknown): RiskWarning['severity'] {
  if (value === 'high' || value === 'medium' || value === 'low') {
    return value;
  }
  return 'medium';
}

export function normalizeNegotiationTurn(
  raw: Record<string, unknown>,
  country: TargetCountry,
  sources: string[],
  nuanceReminder: string
): NegotiationTurnResponse {
  const rawCoaching = (raw.coaching ?? {}) as Record<string, unknown>;

  const clarity: NegotiationCoaching['clarity_rating'] =
    rawCoaching.clarity_rating === 'Needs Clarity' ||
    rawCoaching.clarity_rating === 'Clear' ||
    rawCoaching.clarity_rating === 'Very Clear'
      ? rawCoaching.clarity_rating
      : 'Clear';

  const professionalism: NegotiationCoaching['professionalism_rating'] =
    rawCoaching.professionalism_rating === 'Developing' ||
    rawCoaching.professionalism_rating === 'Professional' ||
    rawCoaching.professionalism_rating === 'Executive Grade'
      ? rawCoaching.professionalism_rating
      : 'Professional';

  return {
    partner_reply:
      typeof raw.partner_reply === 'string' && raw.partner_reply.trim()
        ? raw.partner_reply.trim()
        : 'Thank you for your perspective. Could you share more details on how we might structure an initial trial order?',
    partner_tone_note:
      typeof raw.partner_tone_note === 'string' && raw.partner_tone_note.trim()
        ? raw.partner_tone_note.trim()
        : 'Measured and relationship-oriented commercial stance',
    coaching: {
      clarity_rating: clarity,
      professionalism_rating: professionalism,
      assessment:
        typeof rawCoaching.assessment === 'string' && rawCoaching.assessment.trim()
          ? rawCoaching.assessment.trim()
          : 'Your message communicates the core commercial point clearly.',
      better_phrasing:
        typeof rawCoaching.better_phrasing === 'string' &&
        rawCoaching.better_phrasing.trim()
          ? rawCoaching.better_phrasing.trim()
          : 'Consider opening with brief appreciation for the partner’s inquiry before stating conditions.',
      cultural_insight:
        typeof rawCoaching.cultural_insight === 'string' &&
        rawCoaching.cultural_insight.trim()
          ? rawCoaching.cultural_insight.trim()
          : `In ${country} B2B exchanges, framing constraints as collaborative options preserves long-term goodwill.`,
      alternative_reply:
        typeof rawCoaching.alternative_reply === 'string' &&
        rawCoaching.alternative_reply.trim()
          ? rawCoaching.alternative_reply.trim()
          : 'We truly appreciate your interest. While a full container helps optimize freight costs, we would be glad to explore a tailored trial pallet so your team can evaluate market response first.',
    },
    knowledge_reference: {
      country,
      sources,
      nuance_reminder: nuanceReminder,
    },
  };
}
