import { ArrowRight, BookOpen, CheckCircle2, Globe2, ShieldAlert } from 'lucide-react';
import {
  DEMO_SCENARIO_PRESETS,
  SCENARIO_OPTIONS,
} from '../data/culturalKnowledgeBase.ts';
import { retrieveCulturalContext } from '../utils/culturalEngine.ts';
import type {
  BusinessContext,
  BusinessScenario,
  CommunicationLanguage,
  DemoScenarioPreset,
  PartnerRole,
  TargetCountry,
  UserRole,
} from '../types/culturebridge.ts';
import { CountryFlag } from './CountryFlag.tsx';

interface BusinessContextScreenProps {
  context: BusinessContext;
  onChangeContext: (updated: BusinessContext) => void;
  onApplyPreset: (preset: DemoScenarioPreset, navigateToEmail?: boolean) => void;
  onStartCommunication: () => void;
}

const USER_ROLES: UserRole[] = ['Exporter', 'Sales Manager', 'Business Owner'];
const PARTNER_ROLES: PartnerRole[] = [
  'Importer',
  'Distributor',
  'Import Manager',
  'Business Partner',
];

export function BusinessContextScreen({
  context,
  onChangeContext,
  onApplyPreset,
  onStartCommunication,
}: BusinessContextScreenProps) {
  const { countrySummary, knowledgeEntry } = retrieveCulturalContext(
    context.targetCountry,
    context.scenario
  );

  const updateField = <K extends keyof BusinessContext>(
    key: K,
    value: BusinessContext[K]
  ) => {
    onChangeContext({
      ...context,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Executive Hero Intro */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold text-[#4F46E5]">
            Cross-Cultural Export Communication Copilot · Vietnam → GCC
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
            Set your commercial context before writing or negotiating
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            CultureBridge AI pairs your business objective with curated UAE and
            Qatar cultural protocol so every email and negotiation response stays
            unified across your entire workflow.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={onStartCommunication}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <span>Start Communication</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Quick Hackathon Demo Presets */}
      <section
        aria-labelledby="presets-heading"
        className="bg-white border border-slate-200 rounded-xl p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-200">
          <div>
            <h3
              id="presets-heading"
              className="text-base font-semibold text-slate-900"
            >
              Tested Export Scenarios
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a curated Vietnam–UAE or Vietnam–Qatar scenario to pre-fill
              context and sample draft.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500 tabular-nums">
            {DEMO_SCENARIO_PRESETS.length} ready scenarios
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pt-4">
          {DEMO_SCENARIO_PRESETS.map((preset) => {
            const isSelected =
              context.targetCountry === preset.targetCountry &&
              context.scenario === preset.scenario &&
              context.companyName === preset.companyName;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset, false)}
                className={`text-left p-4 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isSelected
                    ? 'border-[#4F46E5] bg-indigo-50/50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CountryFlag country={preset.targetCountry} className="w-4 h-4" />
                    <span>{preset.shortLabel}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {preset.yourRole}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-900 mt-2">
                  {preset.title}
                </div>
                <div className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {preset.productFocus}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main 12-Column Split: Form + Cultural Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Context Form */}
        <section
          aria-labelledby="context-form-heading"
          className="xl:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6"
        >
          <div className="pb-4 border-b border-slate-200">
            <h3
              id="context-form-heading"
              className="text-lg font-semibold text-slate-900"
            >
              Communication Parameters
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              These selections persist across the Email Assistant and Negotiation
              Simulator.
            </p>
          </div>

          {/* Country Pair */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                Your Country
              </span>
              <div className="h-[44px] px-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2.5 text-sm font-medium text-slate-800">
                <CountryFlag country="Vietnam" className="w-5 h-5" />
                <span>Vietnam (Exporter Origin)</span>
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                Target Country
              </span>
              <div
                className="grid grid-cols-2 gap-2"
                role="group"
                aria-label="Target country"
              >
                {(['UAE', 'Qatar'] as TargetCountry[]).map((country) => {
                  const active = context.targetCountry === country;
                  return (
                    <button
                      key={country}
                      type="button"
                      onClick={() => updateField('targetCountry', country)}
                      aria-pressed={active}
                      className={`h-[44px] px-3 rounded-lg border flex items-center justify-center gap-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        active
                          ? 'border-[#4F46E5] bg-indigo-50 text-[#3525cd]'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <CountryFlag country={country} className="w-4 h-4" />
                      <span>{country}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Business Scenario */}
          <div>
            <label
              htmlFor="scenario-select"
              className="block text-xs font-semibold text-slate-700 mb-2"
            >
              Business Scenario
            </label>
            <select
              id="scenario-select"
              value={context.scenario}
              onChange={(e) =>
                updateField('scenario', e.target.value as BusinessScenario)
              }
              className="w-full h-[44px] px-3.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
            >
              {SCENARIO_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} — {option.description}
                </option>
              ))}
            </select>
          </div>

          {/* Roles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="your-role-select"
                className="block text-xs font-semibold text-slate-700 mb-2"
              >
                Your Role
              </label>
              <select
                id="your-role-select"
                value={context.yourRole}
                onChange={(e) =>
                  updateField('yourRole', e.target.value as UserRole)
                }
                className="w-full h-[44px] px-3.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              >
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="partner-role-select"
                className="block text-xs font-semibold text-slate-700 mb-2"
              >
                Partner Role
              </label>
              <select
                id="partner-role-select"
                value={context.partnerRole}
                onChange={(e) =>
                  updateField('partnerRole', e.target.value as PartnerRole)
                }
                className="w-full h-[44px] px-3.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              >
                {PARTNER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Communication Language */}
          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-2">
              Communication Output Language
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  {
                    value: 'english',
                    title: 'Business English (Primary)',
                    desc: 'Standard Gulf B2B correspondence language.',
                  },
                  {
                    value: 'english_arabic',
                    title: 'English + Arabic Courtesy',
                    desc: 'Adds verified Arabic greeting & goodwill nuance.',
                  },
                ] as {
                  value: CommunicationLanguage;
                  title: string;
                  desc: string;
                }[]
              ).map((opt) => {
                const active = context.language === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('language', opt.value)}
                    aria-pressed={active}
                    className={`p-3.5 rounded-lg border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      active
                        ? 'border-[#4F46E5] bg-indigo-50/70'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-sm font-semibold text-slate-900">
                      {opt.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Company & Product Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-200">
            <div>
              <label
                htmlFor="company-name-input"
                className="block text-xs font-semibold text-slate-700 mb-2"
              >
                Your Company Name
              </label>
              <input
                id="company-name-input"
                type="text"
                value={context.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                placeholder="e.g., ABC Vietnam Coffee Co."
                className="w-full h-[42px] px-3.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
            <div>
              <label
                htmlFor="partner-name-input"
                className="block text-xs font-semibold text-slate-700 mb-2"
              >
                Partner Name (Optional)
              </label>
              <input
                id="partner-name-input"
                type="text"
                value={context.partnerName}
                onChange={(e) => updateField('partnerName', e.target.value)}
                placeholder="e.g., Mr. Tariq Al-Mansoori"
                className="w-full h-[42px] px-3.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="product-focus-input"
                className="block text-xs font-semibold text-slate-700 mb-2"
              >
                Product / Export Focus
              </label>
              <input
                id="product-focus-input"
                type="text"
                value={context.productFocus}
                onChange={(e) => updateField('productFocus', e.target.value)}
                placeholder="e.g., Specialty Arabica & Robusta Roasted Coffee (Halal certified)"
                className="w-full h-[42px] px-3.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={onStartCommunication}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <span>Start Communication</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </section>

        {/* Right 5 Columns: Live Cultural Knowledge Preview */}
        <aside
          aria-labelledby="cultural-brief-heading"
          className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5"
        >
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#4F46E5]">
                <Globe2 className="w-4 h-4" aria-hidden="true" />
                <span>Cultural Context Engine Preview</span>
              </div>
              <h3
                id="cultural-brief-heading"
                className="text-lg font-semibold text-slate-900 mt-1"
              >
                {countrySummary.officialName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Scenario: {knowledgeEntry.scenarioLabel} · Updated{' '}
                <span className="tabular-nums">{knowledgeEntry.lastUpdated}</span>
              </p>
            </div>
            <CountryFlag country={context.targetCountry} className="w-7 h-7" />
          </div>

          {/* Operational & Decision Context */}
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs font-semibold text-slate-500">
                Business Week & Timing
              </dt>
              <dd className="text-slate-800 mt-0.5">{countrySummary.workWeek}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-slate-500">
                Decision-Making Pattern
              </dt>
              <dd className="text-slate-800 mt-0.5">
                {countrySummary.decisionStyle}
              </dd>
            </div>
          </dl>

          {/* Scenario Recommendations */}
          <div className="pt-4 border-t border-slate-200 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>Recommended for {knowledgeEntry.scenarioLabel}</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              {knowledgeEntry.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-semibold mt-0.5">·</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Things to Avoid */}
          <div className="pt-4 border-t border-slate-200 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
              <ShieldAlert className="w-4 h-4" aria-hidden="true" />
              <span>Common Friction Points to Avoid</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              {knowledgeEntry.thingsToAvoid.map((avoid, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-semibold mt-0.5">·</span>
                  <span>{avoid}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources & Nuance Disclaimer */}
          <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Verified Knowledge Sources</span>
            </div>
            <p>{knowledgeEntry.sources.join(' · ')}</p>
            <p className="text-slate-500 leading-relaxed pt-1">
              {knowledgeEntry.nuanceNote}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
