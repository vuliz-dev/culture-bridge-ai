import { Link } from 'react-router-dom';
import {
  Compass,
  Home,
  Mail,
  MessageSquare,
  X,
} from 'lucide-react';
import { SCENARIO_OPTIONS } from '../data/culturalKnowledgeBase.ts';
import type { ActiveScreen, BusinessContext } from '../types/culturebridge.ts';
import { CountryFlag } from './CountryFlag.tsx';
import { Wordmark } from './Brand.tsx';
import { useI18n } from '../i18n/index.tsx';

interface SidebarNavProps {
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  context: BusinessContext;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function SidebarNav({
  activeScreen,
  onSelectScreen,
  context,
  mobileOpen,
  onCloseMobile,
}: SidebarNavProps) {
  const { t } = useI18n();

  const scenarioLabel =
    SCENARIO_OPTIONS.find((s) => s.value === context.scenario)?.label ??
    context.scenario;

  const navItems = [
    {
      id: 'context' as ActiveScreen,
      step: '01',
      label: t.workspace.steps.context,
      subtitle: 'Market, scenario & roles',
      icon: Compass,
    },
    {
      id: 'email' as ActiveScreen,
      step: '02',
      label: t.workspace.steps.email,
      subtitle: 'Transform & cultural check',
      icon: Mail,
    },
    {
      id: 'simulator' as ActiveScreen,
      step: '03',
      label: t.workspace.steps.negotiation,
      subtitle: 'Multi-turn partner practice',
      icon: MessageSquare,
    },
  ];

  const navContent = (
    <div className="relative flex flex-col h-full bg-primary text-primary-foreground w-[265px] shrink-0 overflow-hidden shadow-xl">
      {/* Background motif overlay */}
      <div
        aria-hidden="true"
        className="motif-teal pointer-events-none absolute inset-0 opacity-15"
      />

      {/* Brand Header */}
      <div className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-primary-foreground/15">
        <Link to="/" className="text-white hover:opacity-90 transition-opacity">
          <Wordmark className="text-white [&>span:first-child]:bg-primary-foreground [&>span:first-child]:text-primary" />
        </Link>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="lg:hidden p-1.5 rounded-lg text-primary-foreground/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Workflow Navigation */}
      <nav aria-label="Primary workflow" className="relative z-10 px-3 py-5 space-y-1.5 flex-1">
        <div className="flex items-center justify-between px-3 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
            Copilot Workflow
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-[11px] text-primary-foreground/70 hover:text-white transition-colors"
          >
            <Home className="size-3" />
            <span>Home</span>
          </Link>
        </div>

        {navItems.map((item) => {
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
              className={`w-full flex items-start gap-3 px-3.5 py-3 rounded-lg text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isActive
                  ? 'bg-accent text-accent-foreground shadow-md font-semibold'
                  : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white'
              }`}
            >
              <Icon
                className={`w-4 h-4 mt-0.5 shrink-0 ${
                  isActive ? 'text-accent-foreground' : 'text-primary-foreground/60'
                }`}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <div className="text-[13.5px] whitespace-nowrap truncate font-semibold">
                  {item.step}. {item.label}
                </div>
                <div
                  className={`text-[11px] mt-0.5 truncate ${
                    isActive ? 'text-accent-foreground/80' : 'text-primary-foreground/60'
                  }`}
                >
                  {item.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Active Context Panel */}
      <div className="relative z-10 px-5 py-5 border-t border-primary-foreground/15 bg-primary-foreground/[0.04] space-y-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
          {t.workspace.activeContext}
        </div>
        <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
          <CountryFlag country="Vietnam" className="w-4 h-4" />
          <span>VN</span>
          <span className="text-primary-foreground/50" aria-hidden="true">
            →
          </span>
          <CountryFlag country={context.targetCountry} className="w-4 h-4" />
          <span>{context.targetCountry}</span>
        </div>
        <dl className="space-y-1.5 text-xs text-primary-foreground/80">
          <div className="flex justify-between gap-2">
            <dt className="text-primary-foreground/60">{t.common.scenario}</dt>
            <dd className="font-medium text-right truncate text-white">{scenarioLabel}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-primary-foreground/60">{t.common.yourRole}</dt>
            <dd className="font-medium text-right truncate text-white">{context.yourRole}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-primary-foreground/60">{t.common.partner}</dt>
            <dd className="font-medium text-right truncate text-white">{context.partnerRole}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-primary-foreground/60">{t.common.output}</dt>
            <dd className="font-medium text-right truncate text-white">
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
      <aside className="hidden lg:flex lg:flex-col lg:shrink-0 border-r border-border">
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
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 flex h-full">{navContent}</div>
        </div>
      )}
    </>
  );
}
