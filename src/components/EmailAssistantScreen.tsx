import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookCheck,
  Check,
  Copy,
  Layers,
  Loader2,
  MessageSquare,
  RotateCcw,
  Send,
  ShieldAlert,
} from 'lucide-react';
import {
  DEMO_SCENARIO_PRESETS,
  SCENARIO_OPTIONS,
} from '../data/culturalKnowledgeBase.ts';
import type {
  BusinessContext,
  DemoScenarioPreset,
  EmailAnalysisResponse,
} from '../types/culturebridge.ts';
import { CountryFlag } from './CountryFlag.tsx';

interface EmailAssistantScreenProps {
  context: BusinessContext;
  draftText: string;
  onChangeDraftText: (value: string) => void;
  analysis: EmailAnalysisResponse | null;
  isLoading: boolean;
  errorMessage: string | null;
  onAnalyze: () => void;
  onApplyPreset: (preset: DemoScenarioPreset, navigateToEmail?: boolean) => void;
  onEditContext: () => void;
  onGoToSimulator: () => void;
}

export function EmailAssistantScreen({
  context,
  draftText,
  onChangeDraftText,
  analysis,
  isLoading,
  errorMessage,
  onAnalyze,
  onApplyPreset,
  onEditContext,
  onGoToSimulator,
}: EmailAssistantScreenProps) {
  const [copied, setCopied] = useState(false);

  const scenarioLabel =
    SCENARIO_OPTIONS.find((s) => s.value === context.scenario)?.label ??
    context.scenario;

  const handleCopyEmail = async () => {
    if (!analysis) return;
    try {
      await navigator.clipboard.writeText(analysis.improved_email.full_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const severityStyle = (severity: 'low' | 'medium' | 'high') => {
    if (severity === 'high') {
      return {
        label: 'High Risk',
        text: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
      };
    }
    if (severity === 'medium') {
      return {
        label: 'Medium Caution',
        text: 'text-amber-800',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
      };
    }
    return {
      label: 'Advisory Note',
      text: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
    };
  };

  return (
    <div className="space-y-6">
      {/* Persistent Context Strip */}
      <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <CountryFlag country="Vietnam" className="w-4 h-4" />
            <span>Vietnam</span>
            <span className="text-slate-400" aria-hidden="true">
              →
            </span>
            <CountryFlag country={context.targetCountry} className="w-4 h-4" />
            <span>{context.targetCountry}</span>
          </div>
          <span className="text-slate-300" aria-hidden="true">
            ·
          </span>
          <span className="font-medium text-slate-700">{scenarioLabel}</span>
          <span className="text-slate-300" aria-hidden="true">
            ·
          </span>
          <span className="text-slate-600">
            {context.yourRole} to {context.partnerRole}
          </span>
          <span className="text-slate-300" aria-hidden="true">
            ·
          </span>
          <span className="text-slate-600">
            {context.language === 'english_arabic'
              ? 'English + Arabic Courtesy'
              : 'Business English'}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onEditContext}
            className="text-xs font-semibold text-[#4F46E5] hover:text-[#3525cd] underline underline-offset-4 whitespace-nowrap"
          >
            Edit Business Context
          </button>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Column 1: Original Message (Vietnamese Input) */}
        <section
          aria-labelledby="original-draft-heading"
          className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5"
        >
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h2
                id="original-draft-heading"
                className="text-lg font-semibold text-slate-900"
              >
                Original Message
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Write your draft naturally in Vietnamese (or English).
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 tabular-nums whitespace-nowrap">
              {draftText.length} / 4000
            </span>
          </div>

          {/* Quick Sample Loaders */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-600">
              Load Sample Vietnamese Draft
            </span>
            <div className="flex flex-wrap gap-2">
              {DEMO_SCENARIO_PRESETS.slice(0, 4).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onApplyPreset(preset, true)}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-md transition-colors whitespace-nowrap"
                >
                  {preset.shortLabel}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="vietnamese-draft-textarea"
              className="block text-xs font-semibold text-slate-700 mb-2"
            >
              Vietnamese Draft Content
            </label>
            <textarea
              id="vietnamese-draft-textarea"
              rows={9}
              value={draftText}
              onChange={(e) => onChangeDraftText(e.target.value)}
              placeholder="Ví dụ: Xin chào, chúng tôi là công ty ABC tại Việt Nam. Chúng tôi chuyên sản xuất cà phê và muốn hợp tác với công ty của bạn..."
              className="w-full p-3.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] resize-y"
            />
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-lg border border-red-200 bg-red-50 text-xs text-red-800 flex items-start gap-2.5"
            >
              <AlertTriangle
                className="w-4 h-4 text-red-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => onChangeDraftText('')}
              disabled={isLoading || !draftText}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear</span>
            </button>

            <button
              type="button"
              onClick={onAnalyze}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Analyzing Context...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Transform & Analyze Email</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Column 2 & 3: AI Improved Email + Cultural Intelligence */}
        <div className="xl:col-span-7 space-y-6">
          {isLoading ? (
            <div
              aria-busy="true"
              aria-label="Generating culturally adapted email and analysis"
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
            >
              <div className="flex items-center gap-3 text-sm font-semibold text-[#4F46E5]">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>
                  Running 3-Layer Cultural Pipeline (Intent → {context.targetCountry}{' '}
                  Knowledge Base → Email Adaptation)...
                </span>
              </div>
              <div className="space-y-3 animate-pulse">
                <div className="h-5 bg-slate-100 rounded w-2/3" />
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-11/12" />
                <div className="h-4 bg-slate-100 rounded w-4/5" />
                <div className="h-24 bg-slate-100 rounded w-full mt-4" />
              </div>
            </div>
          ) : !analysis ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#4F46E5]">
                  <Layers className="w-4 h-4" aria-hidden="true" />
                  <span>3-Layer Cultural Processing Architecture</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Ready to transform your Vietnamese draft
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                  Click <strong>Transform & Analyze Email</strong> on the left to
                  run your message through our structured cross-cultural pipeline:
                </p>
              </div>

              <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
                <li className="space-y-1">
                  <div className="text-xs font-semibold text-slate-900">
                    1. Business Intent
                  </div>
                  <p className="text-xs text-slate-600">
                    Detects commercial goal, urgency cues, and directness risks.
                  </p>
                </li>
                <li className="space-y-1">
                  <div className="text-xs font-semibold text-slate-900">
                    2. Cultural Context Engine
                  </div>
                  <p className="text-xs text-slate-600">
                    Retrieves verified {context.targetCountry} protocol for{' '}
                    {scenarioLabel}.
                  </p>
                </li>
                <li className="space-y-1">
                  <div className="text-xs font-semibold text-slate-900">
                    3. AI Generator & Coach
                  </div>
                  <p className="text-xs text-slate-600">
                    Crafts adapted English copy plus clear cultural rationale.
                  </p>
                </li>
              </ol>
            </div>
          ) : (
            <>
              {/* 3-Layer Pipeline Trace */}
              <section
                aria-label="3-layer processing trace"
                className="bg-white border border-slate-200 rounded-xl p-5"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 pb-3 border-b border-slate-200">
                  <Layers className="w-4 h-4 text-[#4F46E5]" aria-hidden="true" />
                  <span>3-Layer Cultural Processing Trace</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">
                      1. Intent Detected
                    </div>
                    <div className="text-slate-600 mt-1">
                      {analysis.pipeline.intent.primaryIntent}
                    </div>
                    <div className="text-slate-500 mt-1">
                      {analysis.pipeline.intent.detectedSignals[0]}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      2. Cultural Engine Match
                    </div>
                    <div className="text-slate-600 mt-1">
                      {analysis.pipeline.knowledgeEntry.country} ·{' '}
                      {analysis.pipeline.knowledgeEntry.scenarioLabel}
                    </div>
                    <div className="text-slate-500 mt-1">
                      Ref: {analysis.pipeline.knowledgeEntry.id}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      3. Output Tailored
                    </div>
                    <div className="text-slate-600 mt-1">
                      {context.yourRole} → {context.partnerRole}
                    </div>
                    <div className="text-slate-500 mt-1">
                      {analysis.risk_warnings.length} risks checked ·{' '}
                      {analysis.alternative_phrases.length} phrase upgrades
                    </div>
                  </div>
                </div>
              </section>

              {/* Area 2: AI Improved Message */}
              <section
                aria-labelledby="improved-email-heading"
                className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <h2
                      id="improved-email-heading"
                      className="text-lg font-semibold text-slate-900"
                    >
                      AI Improved Message
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Culturally adapted Business English for {context.targetCountry}{' '}
                      ({context.partnerRole})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={onGoToSimulator}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F172A] hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Practice in Simulator</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Email Structure */}
                <div className="space-y-4">
                  <div className="pb-3 border-b border-slate-200">
                    <span className="text-xs font-semibold text-slate-500">
                      Subject
                    </span>
                    <div className="text-base font-semibold text-slate-900 mt-1">
                      {analysis.improved_email.subject}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                    <p className="font-medium text-slate-900">
                      {analysis.improved_email.greeting}
                    </p>
                    <p>{analysis.improved_email.body}</p>
                    <p className="font-medium text-slate-900 pt-1">
                      {analysis.improved_email.closing}
                    </p>
                  </div>

                  {analysis.improved_email.arabic_courtesy_note && (
                    <div className="pt-4 border-t border-slate-200 bg-slate-50/80 rounded-lg p-4 space-y-1">
                      <div className="text-xs font-semibold text-[#4F46E5]">
                        Optional Arabic Courtesy Touch
                      </div>
                      <p className="text-sm text-slate-800">
                        {analysis.improved_email.arabic_courtesy_note}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Area 3: Cultural Intelligence & Risk Analysis */}
              <section
                aria-labelledby="cultural-intel-heading"
                className="bg-white border border-slate-200 rounded-xl p-6 space-y-6"
              >
                <div className="pb-4 border-b border-slate-200">
                  <h2
                    id="cultural-intel-heading"
                    className="text-lg font-semibold text-slate-900"
                  >
                    Cultural Intelligence & Risk Analysis
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Transparent breakdown of tone, relationship cues, cautions, and
                    phrasing changes.
                  </p>
                </div>

                {/* 4 Core Cultural Analysis Aspects */}
                <div className="divide-y divide-slate-200">
                  {analysis.cultural_analysis.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {item.aspect}
                        </h3>
                        <span className="text-xs font-medium text-[#4F46E5]">
                          {item.summary}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {item.explanation}
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        <strong className="font-semibold text-slate-600">
                          Why it matters:{' '}
                        </strong>
                        {item.reason}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Risk Warnings */}
                {analysis.risk_warnings.length > 0 && (
                  <div className="pt-5 border-t border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <ShieldAlert
                        className="w-4 h-4 text-amber-600"
                        aria-hidden="true"
                      />
                      <span>Communication Risk Warnings</span>
                    </div>
                    <div className="space-y-3">
                      {analysis.risk_warnings.map((risk, idx) => {
                        const style = severityStyle(risk.severity);
                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg border ${style.border} ${style.bg} space-y-1`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-slate-900">
                                {risk.title}
                              </span>
                              <span className={`text-xs font-semibold ${style.text}`}>
                                {style.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {risk.message}
                            </p>
                            <p className="text-xs text-slate-800 pt-0.5">
                              <strong className="font-semibold">Recommendation: </strong>
                              {risk.suggestion}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Alternative Phrases */}
                {analysis.alternative_phrases.length > 0 && (
                  <div className="pt-5 border-t border-slate-200 space-y-3">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Alternative Phrases & Nuance Upgrades
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500">
                            <th className="py-2 pr-4 font-semibold">Original / Intent</th>
                            <th className="py-2 pr-4 font-semibold">Culturally Refined</th>
                            <th className="py-2 font-semibold">Nuance Difference</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {analysis.alternative_phrases.map((phrase, idx) => (
                            <tr key={idx} className="align-top">
                              <td className="py-3 pr-4 text-slate-600">
                                {phrase.original}
                              </td>
                              <td className="py-3 pr-4 font-medium text-slate-900">
                                {phrase.improved}
                              </td>
                              <td className="py-3 text-slate-600">{phrase.reason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Knowledge Base Provenance & Nuance Disclaimer */}
                <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <BookCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                    <span>
                      Grounded in Verified Knowledge Base (
                      {analysis.pipeline.knowledgeEntry.sources.join(' · ')})
                    </span>
                  </div>
                  <p className="leading-relaxed">{analysis.confidence_note}</p>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
