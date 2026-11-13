export type TargetCountry = 'UAE' | 'Qatar';

export type BusinessScenario =
  | 'first_contact'
  | 'product_intro'
  | 'quotation'
  | 'follow_up'
  | 'meeting_request'
  | 'negotiation'
  | 'decline_offer';

export type CommunicationLanguage = 'english' | 'english_arabic';

export type UserRole = 'Exporter' | 'Sales Manager' | 'Business Owner';

export type PartnerRole =
  | 'Importer'
  | 'Distributor'
  | 'Import Manager'
  | 'Business Partner';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type ActiveScreen = 'context' | 'email' | 'simulator';

export interface BusinessContext {
  yourCountry: 'Vietnam';
  targetCountry: TargetCountry;
  scenario: BusinessScenario;
  language: CommunicationLanguage;
  yourRole: UserRole;
  partnerRole: PartnerRole;
  companyName: string;
  productFocus: string;
  partnerName: string;
}

export interface ArabicCourtesyPhrase {
  arabic: string;
  transliteration: string;
  englishMeaning: string;
  whenToUse: string;
}

export interface CulturalKnowledgeEntry {
  id: string;
  country: TargetCountry;
  scenario: BusinessScenario;
  scenarioLabel: string;
  communicationStyle: string[];
  relationshipNorms: string[];
  recommendations: string[];
  thingsToAvoid: string[];
  arabicCourtesyPhrases: ArabicCourtesyPhrase[];
  sources: string[];
  lastUpdated: string;
  verifiedBy: string;
  nuanceNote: string;
}

export interface CountryProfileSummary {
  country: TargetCountry;
  officialName: string;
  commercialHubs: string[];
  workWeek: string;
  decisionStyle: string;
  relationshipPriority: string;
  keyEtiquettePoints: string[];
  sources: string[];
  lastUpdated: string;
}

export interface DemoScenarioPreset {
  id: string;
  title: string;
  shortLabel: string;
  targetCountry: TargetCountry;
  scenario: BusinessScenario;
  yourRole: UserRole;
  partnerRole: PartnerRole;
  companyName: string;
  productFocus: string;
  partnerName: string;
  vietnameseDraft: string;
  simulatorOpeningHint: string;
}

export interface BusinessIntentResult {
  primaryIntent: string;
  scenarioMatch: BusinessScenario;
  detectedSignals: string[];
  urgencyRiskDetected: boolean;
  directnessRiskDetected: boolean;
}

export interface CulturalAnalysisItem {
  aspect:
    | 'Communication Style'
    | 'Relationship Building'
    | 'What to Avoid'
    | 'Why AI Changed Your Email';
  summary: string;
  explanation: string;
  reason: string;
}

export interface RiskWarning {
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  suggestion: string;
}

export interface AlternativePhrase {
  original: string;
  improved: string;
  reason: string;
}

export interface EmailAnalysisResponse {
  pipeline: {
    intent: BusinessIntentResult;
    knowledgeEntry: CulturalKnowledgeEntry;
  };
  improved_email: {
    subject: string;
    greeting: string;
    body: string;
    closing: string;
    full_text: string;
    arabic_courtesy_note?: string;
  };
  cultural_analysis: CulturalAnalysisItem[];
  risk_warnings: RiskWarning[];
  alternative_phrases: AlternativePhrase[];
  confidence_note: string;
}

export interface NegotiationCoaching {
  clarity_rating: 'Needs Clarity' | 'Clear' | 'Very Clear';
  professionalism_rating: 'Developing' | 'Professional' | 'Executive Grade';
  assessment: string;
  better_phrasing: string;
  cultural_insight: string;
  alternative_reply: string;
}

export interface NegotiationMessage {
  id: string;
  sender: 'partner' | 'user';
  text: string;
  timestamp: string;
  partnerToneNote?: string;
  coaching?: NegotiationCoaching;
}

export interface NegotiationTurnResponse {
  partner_reply: string;
  partner_tone_note: string;
  coaching: NegotiationCoaching;
  knowledge_reference: {
    country: TargetCountry;
    sources: string[];
    nuance_reminder: string;
  };
}
