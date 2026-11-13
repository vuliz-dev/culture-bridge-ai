import {
  Compass,
  Mail,
  MessageSquare,
  X,
} from 'lucide-react';
import { SCENARIO_OPTIONS } from '../data/culturalKnowledgeBase.ts';
import type { ActiveScreen, BusinessContext } from '../types/culturebridge.ts';
import { CountryFlag } from './CountryFlag.tsx';

interface SidebarNavProps {
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  context: BusinessContext;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: {
  id: ActiveScreen;
  step: string;
  label: string;
  subtitle: string;
  icon: typeof Compass;
}[] = [
  {
    id: 'context',
    step: '01',
    label: 'Business Context',
    subtitle: 'Market, scenario & roles',
    icon: Compass,
  },
  {
    id: 'email',
    step: '02',
    label: 'AI Email Assistant',
    subtitle: 'Transform & cultural check',
    icon: Mail,
  },
  {
    id: 'simulator',
    step: '03',
    label: 'Negotiation Simulator',
    subtitle: 'Multi-turn partner practice',
    icon: MessageSquare,
  },
];

export function SidebarNav({
  activeScreen,
  onSelectScreen,
  context,
  mobileOpen,
  onCloseMobile,
}: SidebarNavProps) {
  const scenarioLabel =
    SCENARIO_OPTIONS.find((s) => s.value === context.scenario)?.label ??
    context.scenario;

  const navContent = (
    <div className="flex flex-col h-full bg-[#0F172A] text-slate-100 w-[260px] shrink-0">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <a
          href="#context"
          onClick={(e) => {
            e.preventDefault();
            onSelectScreen('context');
            onCloseMobile();
          }}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          CultureBridge AI
        </a>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav aria-label="Primary workflow" className="px-3 py-5 space-y-1.5 flex-1">
        <p className="px-3 pb-2 text-xs font-semibold text-slate-400">
          Copilot Workflow
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectScreen(item.id);
                onCloseMobile();
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                isActive
                  ? 'bg-[#4F46E5] text-white'
                  : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <Icon
                className={`w-4 h-4 mt-0.5 shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <div className="text-sm font-semibold whitespace-nowrap truncate">
                  {item.step}. {item.label}
                </div>
                <div
                  className={`text-xs mt-0.5 truncate ${
                    isActive ? 'text-indigo-100' : 'text-slate-400'
                  }`}
                >
                  {item.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-5 border-t border-white/10 space-y-3">
        <div className="text-xs font-semibold text-slate-400">
          Active Context
        </div>
        <div className="flex items-center gap-2.5 text-sm font-medium text-white">
          <CountryFlag country="Vietnam" className="w-4 h-4" />
          <span>VN</span>
          <span className="text-slate-400" aria-hidden="true">
            →
          </span>
          <CountryFlag country={context.targetCountry} className="w-4 h-4" />
          <span>{context.targetCountry}</span>
        </div>
        <dl className="space-y-1.5 text-xs text-slate-300">
          <div className="flex justify-between gap-2">
            <dt className="text-slate-400">Scenario</dt>
            <dd className="font-medium text-right truncate">{scenarioLabel}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-400">Your role</dt>
            <dd className="font-medium text-right truncate">{context.yourRole}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-400">Partner</dt>
            <dd className="font-medium text-right truncate">{context.partnerRole}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-400">Output</dt>
            <dd className="font-medium text-right truncate">
              {context.language === 'english_arabic'
                ? 'English + Arabic'
                : 'English'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:shrink-0 border-r border-slate-800">
        {navContent}
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="fixed inset-0 bg-slate-950/60"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 flex h-full">{navContent}</div>
        </div>
      )}
    </>
  );
}
