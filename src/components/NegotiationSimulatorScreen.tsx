import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  CornerDownLeft,
  Info,
  Loader2,
  RotateCcw,
  Send,
  UserCheck,
} from 'lucide-react';
import { SCENARIO_OPTIONS } from '../data/culturalKnowledgeBase.ts';
import type {
  BusinessContext,
  DifficultyLevel,
  NegotiationCoaching,
  NegotiationMessage,
  PartnerRole,
} from '../types/culturebridge.ts';
import { CountryFlag } from './CountryFlag.tsx';

interface NegotiationSimulatorScreenProps {
  context: BusinessContext;
  difficulty: DifficultyLevel;
  onChangeDifficulty: (level: DifficultyLevel) => void;
  onChangePartnerRole: (role: PartnerRole) => void;
  messages: NegotiationMessage[];
  latestCoaching: NegotiationCoaching | null;
  isLoading: boolean;
  errorMessage: string | null;
  onSendMessage: (text: string) => void;
  onResetSession: () => void;
  onEditContext: () => void;
}

const DIFFICULTIES: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
const SIMULATOR_ROLES: PartnerRole[] = [
  'Import Manager',
  'Distributor',
  'Business Partner',
  'Importer',
];

const QUICK_REPLY_IDEAS = [
  {
    label: 'Diplomatic Trial Offer',
    text: 'Thank you for sharing your perspective. We understand market testing is essential in the Gulf. While our standard container pricing is optimized at 10 tons, we would be delighted to arrange a 1-ton trial shipment with Halal and ISO 22000 documentation so your team can evaluate client feedback first.',
  },
  {
    label: 'Test Blunt Reply (See Coach Alert)',
    text: 'No, we cannot lower the price or reduce the MOQ. Our price is fixed and you must pay 50% deposit upfront before we ship.',
  },
  {
    label: 'Propose Exploratory Call',
    text: 'We truly appreciate your interest in our Vietnamese export line. Would Tuesday or Wednesday morning work for a 20-minute call so we can align on packaging specifications and volume tiers together?',
  },
];

function getPartnerInitials(name: string): string {
  const cleaned = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s+/i, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'GP';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function NegotiationSimulatorScreen({
  context,
  difficulty,
  onChangeDifficulty,
  onChangePartnerRole,
  messages,
  latestCoaching,
  isLoading,
  errorMessage,
  onSendMessage,
  onResetSession,
  onEditContext,
}: NegotiationSimulatorScreenProps) {
  const [inputValue, setInputValue] = useState('');
  const feedEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages.length, isLoading]);

  const scenarioLabel =
    SCENARIO_OPTIONS.find((s) => s.value === context.scenario)?.label ??
    context.scenario;

  const partnerDisplayName =
    context.partnerName ||
    (context.targetCountry === 'UAE'
      ? 'Tariq Al-Mansoori'
      : 'Khalifa Al-Thani');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  return (
    <div className="space-y-6">
      {/* Simulator Controls Bar */}
      <section
        aria-label="Simulation settings"
        className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <CountryFlag country={context.targetCountry} className="w-4 h-4" />
            <span>{context.targetCountry} Partner</span>
          </div>
          <span className="text-slate-300" aria-hidden="true">
            ·
          </span>
          <span className="text-slate-700 font-medium">{scenarioLabel}</span>
          <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
            ·
          </span>
          <button
            type="button"
            onClick={onEditContext}
            className="text-xs font-semibold text-[#4F46E5] hover:text-[#3525cd] underline underline-offset-4"
          >
            Change Market / Scenario
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="sim-partner-role"
              className="text-xs font-semibold text-slate-600 whitespace-nowrap"
            >
              Partner Role
            </label>
            <select
              id="sim-partner-role"
              value={context.partnerRole}
              onChange={(e) => onChangePartnerRole(e.target.value as PartnerRole)}
              className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
            >
              {SIMULATOR_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div
            className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
            role="group"
            aria-label="Negotiation difficulty"
          >
            {DIFFICULTIES.map((level) => {
              const active = difficulty === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => onChangeDifficulty(level)}
                  aria-pressed={active}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onResetSession}
            className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </section>

      {/* Main 12-Column Split: Dialogue Left + Real-Time Coach Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Dialogue Column */}
        <section
          aria-labelledby="dialogue-heading"
          className="xl:col-span-7 bg-white border border-slate-200 rounded-xl flex flex-col min-h-[580px]"
        >
          {/* Partner Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {getPartnerInitials(partnerDisplayName)}
              </div>
              <div className="min-w-0">
                <h2
                  id="dialogue-heading"
                  className="text-sm font-semibold text-slate-900 truncate"
                >
                  {partnerDisplayName}
                </h2>
                <p className="text-xs text-slate-500 truncate">
                  {context.partnerRole} · {context.targetCountry} ·{' '}
                  {difficulty} Mode
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap tabular-nums">
              {messages.length} turns
            </span>
          </div>

          {/* Message Feed */}
          <div
            className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[460px]"
            aria-live="polite"
          >
            {messages.map((msg) => {
              const isPartner = msg.sender === 'partner';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isPartner ? 'items-start' : 'items-end'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-slate-700">
                      {isPartner ? partnerDisplayName : `You (${context.yourRole})`}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[88%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      isPartner
                        ? 'bg-slate-100 text-slate-900 border border-slate-200'
                        : 'bg-[#4F46E5] text-white'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {isPartner && msg.partnerToneNote && (
                    <p className="text-xs text-slate-500 mt-1.5 max-w-[88%]">
                      Subtext: {msg.partnerToneNote}
                    </p>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2.5 text-xs font-medium text-slate-500 pt-2">
                <Loader2
                  className="w-4 h-4 animate-spin text-[#4F46E5]"
                  aria-hidden="true"
                />
                <span>
                  {partnerDisplayName} is responding and Cultural Coach is
                  evaluating your reply...
                </span>
              </div>
            )}
            <div ref={feedEndRef} />
          </div>

          {/* Quick Demo Starters + Composer */}
          <div className="p-5 border-t border-slate-200 space-y-3 bg-slate-50/50 rounded-b-xl">
            {errorMessage && (
              <div
                role="alert"
                className="p-3 rounded-lg border border-red-200 bg-red-50 text-xs text-red-800 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-1">
                Sample Replies:
              </span>
              {QUICK_REPLY_IDEAS.map((idea) => (
                <button
                  key={idea.label}
                  type="button"
                  onClick={() => setInputValue(idea.text)}
                  disabled={isLoading}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-md transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {idea.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <label htmlFor="negotiation-reply-input" className="sr-only">
                Your negotiation reply
              </label>
              <textarea
                id="negotiation-reply-input"
                rows={3}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (inputValue.trim() && !isLoading) {
                      onSendMessage(inputValue.trim());
                      setInputValue('');
                    }
                  }
                }}
                placeholder="Type your negotiation response in English (or Vietnamese to practice adapting)..."
                className="w-full p-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] resize-none"
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <CornerDownLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Press Enter to send</span>
                </span>
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Send Reply</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Real-Time Cultural Coach Column */}
        <aside
          aria-labelledby="coach-heading"
          className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5"
        >
          <div className="pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4F46E5]">
              <UserCheck className="w-4 h-4" aria-hidden="true" />
              <span>Real-Time Cultural Coach</span>
            </div>
            <h2
              id="coach-heading"
              className="text-lg font-semibold text-slate-900 mt-1"
            >
              Turn-by-Turn Feedback
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluates clarity, professionalism, and {context.targetCountry}{' '}
              cultural alignment after every reply.
            </p>
          </div>

          {!latestCoaching ? (
            <div className="py-6 space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-sm font-semibold text-slate-900">
                  Awaiting your first response
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reply to {partnerDisplayName} on the left—or click{' '}
                  <strong>Test Blunt Reply</strong> to see how CultureBridge AI
                  detects communication friction and suggests a stronger
                  alternative.
                </p>
              </div>

              <div className="text-xs text-slate-500 flex items-start gap-2 pt-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Practice environment disclaimer: This simulator helps rehearse
                  common business etiquette; real partners vary across companies,
                  industries, and individual personalities.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Clarity & Professionalism Summary */}
              <div className="grid grid-cols-2 gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="text-xs text-slate-500">Clarity</div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        latestCoaching.clarity_rating === 'Needs Clarity'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                      aria-hidden="true"
                    />
                    <span>{latestCoaching.clarity_rating}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Professionalism</div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        latestCoaching.professionalism_rating === 'Developing'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                      aria-hidden="true"
                    />
                    <span>{latestCoaching.professionalism_rating}</span>
                  </div>
                </div>
              </div>

              {/* Assessment */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-semibold text-slate-900">
                  Clarity & Professionalism Assessment
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {latestCoaching.assessment}
                </p>
              </div>

              {/* Better Phrasing */}
              <div className="pt-4 border-t border-slate-200 space-y-1.5">
                <h3 className="text-xs font-semibold text-slate-900">
                  Better Phrasing Guidance
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {latestCoaching.better_phrasing}
                </p>
              </div>

              {/* Cultural Insight */}
              <div className="pt-4 border-t border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                  <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Relevant Cultural Insight ({context.targetCountry})</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {latestCoaching.cultural_insight}
                </p>
              </div>

              {/* Suggested Alternative Reply */}
              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold text-[#4F46E5]">
                    Recommended Alternative Reply
                  </h3>
                  <button
                    type="button"
                    onClick={() => setInputValue(latestCoaching.alternative_reply)}
                    className="text-xs font-semibold text-[#4F46E5] hover:text-[#3525cd] underline underline-offset-2"
                  >
                    Use in reply box
                  </button>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed">
                  {latestCoaching.alternative_reply}
                </div>
              </div>

              <p className="text-xs text-slate-500 pt-2 border-t border-slate-200 leading-relaxed">
                Practice simulator only: treats cultural patterns as helpful
                reference rather than rigid predictions for every individual.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
