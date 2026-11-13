import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectBusinessIntent,
  normalizeEmailAnalysis,
  normalizeNegotiationTurn,
  retrieveCulturalContext,
  validateEmailInput,
} from './culturalEngine.ts';
import type { BusinessContext } from '../types/culturebridge.ts';

const sampleContext: BusinessContext = {
  yourCountry: 'Vietnam',
  targetCountry: 'UAE',
  scenario: 'first_contact',
  language: 'english',
  yourRole: 'Sales Manager',
  partnerRole: 'Importer',
  companyName: 'ABC Vietnam Coffee Co.',
  productFocus: 'Specialty Coffee',
  partnerName: 'Mr. Tariq Al-Mansoori',
};

test('detectBusinessIntent flags urgency and pricing cues in Vietnamese draft', () => {
  const result = detectBusinessIntent(
    'Xin chào, chúng tôi là công ty ABC. Mong nhận được phản hồi sớm về giá cả và số lượng nhập hàng.',
    'first_contact',
    'UAE'
  );
  assert.equal(result.primaryIntent, 'First-Contact Email');
  assert.equal(result.urgencyRiskDetected, true);
  assert.ok(
    result.detectedSignals.some((s) => s.includes('Commercial pricing'))
  );
});

test('detectBusinessIntent flags Qatar Friday/Saturday schedule conflict', () => {
  const result = detectBusinessIntent(
    'Chào anh, thứ Sáu tuần này bên em rảnh lúc 2h chiều để họp online.',
    'meeting_request',
    'Qatar'
  );
  assert.ok(
    result.detectedSignals.some((s) => s.includes('Qatar Fri–Sat weekend'))
  );
});

test('retrieveCulturalContext returns matching verified UAE & Qatar entries', () => {
  const uae = retrieveCulturalContext('UAE', 'quotation');
  assert.equal(uae.knowledgeEntry.id, 'uae-quotation');
  assert.ok(uae.knowledgeEntry.sources.length >= 1);

  const qatar = retrieveCulturalContext('Qatar', 'follow_up');
  assert.equal(qatar.knowledgeEntry.id, 'qatar-follow-up');
  assert.ok(qatar.countrySummary.workWeek.includes('Sunday'));
});

test('validateEmailInput enforces minimum length and context completeness', () => {
  const shortRes = validateEmailInput('Hi', sampleContext);
  assert.equal(shortRes.valid, false);
  assert.ok(shortRes.error);

  const okRes = validateEmailInput(
    'Xin chào, chúng tôi muốn hợp tác xuất khẩu cà phê sang Dubai.',
    sampleContext
  );
  assert.equal(okRes.valid, true);
});

test('normalizeEmailAnalysis safely fills missing fields and attaches Arabic courtesy when enabled', () => {
  const intent = detectBusinessIntent(
    'Xin chào, chúng tôi muốn giới thiệu sản phẩm.',
    'first_contact',
    'UAE'
  );
  const { knowledgeEntry } = retrieveCulturalContext('UAE', 'first_contact');
  const normalized = normalizeEmailAnalysis(
    {
      improved_email: {
        subject: 'Partnership Inquiry',
        body: 'We are pleased to introduce ABC Coffee.',
      },
      cultural_analysis: [
        {
          aspect: 'Communication Style',
          summary: 'Warm & Formal',
          explanation: 'Uses respectful opening.',
          reason: 'Builds initial rapport.',
        },
      ],
    },
    { ...sampleContext, language: 'english_arabic' },
    intent,
    knowledgeEntry
  );

  assert.equal(normalized.improved_email.subject, 'Partnership Inquiry');
  assert.ok(normalized.improved_email.arabic_courtesy_note);
  assert.equal(normalized.cultural_analysis.length, 1);
  assert.equal(normalized.pipeline.knowledgeEntry.country, 'UAE');
});

test('normalizeNegotiationTurn validates coaching ratings safely', () => {
  const turn = normalizeNegotiationTurn(
    {
      partner_reply: 'Can you do a smaller trial order?',
      coaching: {
        clarity_rating: 'Very Clear',
        professionalism_rating: 'Executive Grade',
        assessment: 'Strong collaborative tone.',
      },
    },
    'Qatar',
    ['Qatar Chamber'],
    'Context only'
  );

  assert.equal(turn.coaching.clarity_rating, 'Very Clear');
  assert.equal(turn.coaching.professionalism_rating, 'Executive Grade');
  assert.equal(turn.knowledge_reference.country, 'Qatar');
});
