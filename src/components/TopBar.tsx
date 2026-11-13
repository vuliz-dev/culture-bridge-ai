import { Menu, Play } from 'lucide-react';
import { SCENARIO_OPTIONS } from '../data/culturalKnowledgeBase.ts';
import type { ActiveScreen, BusinessContext } from '../types/culturebridge.ts';

interface TopBarProps {
  activeScreen: ActiveScreen;
  context: BusinessContext;
  onOpenMobileNav: () => void;
  onLoadHeroDemo: () => void;
}

const SCREEN_TITLES: Record<ActiveScreen, string> = {
  context: '01. Business Context',
  email: '02. AI Business Email Assistant',
  simulator: '03. International Negotiation Simulator',
};

export function TopBar({
  activeScreen,
  context,
  onOpenMobileNav,
  onLoadHeroDemo,
}: TopBarProps) {
  const scenarioLabel =
    SCENARIO_OPTIONS.find((s) => s.value === context.scenario)?.label ??
    context.scenario;

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 h-16 flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="font-semibold text-slate-500 hidden sm:inline whitespace-nowrap">
            Workspace
          </span>
          <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
            /
          </span>
          <h1 className="font-semibold text-slate-900 truncate">
            {SCREEN_TITLES[activeScreen]}
          </h1>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-600 whitespace-nowrap">
        <span>Vietnam → {context.targetCountry}</span>
        <span className="text-slate-300" aria-hidden="true">
          ·
        </span>
        <span>{scenarioLabel}</span>
        <span className="text-slate-300" aria-hidden="true">
          ·
        </span>
        <span>{context.yourRole}</span>
      </div>

      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onLoadHeroDemo}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <Play className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Load Coffee Demo</span>
        </button>
      </div>
    </header>
  );
}
