import { Link } from 'react-router-dom';
import { Home, Menu, Play } from 'lucide-react';
import { SCENARIO_OPTIONS } from '../data/culturalKnowledgeBase.ts';
import type { ActiveScreen, BusinessContext } from '../types/culturebridge.ts';
import { LanguageSwitcher } from './LanguageSwitcher.tsx';
import { Button } from './ui/Button.tsx';
import { useI18n } from '../i18n/index.tsx';

interface TopBarProps {
  activeScreen: ActiveScreen;
  context: BusinessContext;
  onOpenMobileNav: () => void;
  onLoadHeroDemo: () => void;
}

export function TopBar({
  activeScreen,
  context,
  onOpenMobileNav,
  onLoadHeroDemo,
}: TopBarProps) {
  const { t } = useI18n();

  const screenTitles: Record<ActiveScreen, string> = {
    context: `01. ${t.workspace.steps.context}`,
    email: `02. ${t.workspace.steps.email}`,
    simulator: `03. ${t.workspace.steps.negotiation}`,
  };

  const scenarioLabel =
    SCENARIO_OPTIONS.find((s) => s.value === context.scenario)?.label ??
    context.scenario;

  return (
    <header className="bg-card/90 backdrop-blur-md border-b border-border px-4 sm:px-8 h-16 flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 -ml-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-sm min-w-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-flex whitespace-nowrap"
          >
            <Home className="size-3.5" />
            <span>Bridgely</span>
          </Link>
          <span className="text-border hidden sm:inline" aria-hidden="true">
            /
          </span>
          <h1 className="font-semibold text-foreground truncate">
            {screenTitles[activeScreen]}
          </h1>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 text-xs font-medium text-muted-foreground whitespace-nowrap">
        <span>Vietnam → {context.targetCountry}</span>
        <span className="text-border" aria-hidden="true">
          ·
        </span>
        <span className="text-foreground">{scenarioLabel}</span>
        <span className="text-border" aria-hidden="true">
          ·
        </span>
        <span>{context.yourRole}</span>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <LanguageSwitcher compact />
        <Button
          type="button"
          size="sm"
          variant="accent"
          onClick={onLoadHeroDemo}
          className="whitespace-nowrap"
        >
          <Play className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.workspace.loadDemo}</span>
        </Button>
      </div>
    </header>
  );
}
