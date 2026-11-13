import { useState } from 'react';
import { BusinessContextScreen } from './components/BusinessContextScreen.tsx';
import { EmailAssistantScreen } from './components/EmailAssistantScreen.tsx';
import { NegotiationSimulatorScreen } from './components/NegotiationSimulatorScreen.tsx';
import { SidebarNav } from './components/SidebarNav.tsx';
import { TopBar } from './components/TopBar.tsx';
import { DEMO_SCENARIO_PRESETS } from './data/culturalKnowledgeBase.ts';
import type {
  ActiveScreen,
  BusinessContext,
  DemoScenarioPreset,
  DifficultyLevel,
  EmailAnalysisResponse,
  NegotiationCoaching,
  NegotiationMessage,
  NegotiationTurnResponse,
  PartnerRole,
} from './types/culturebridge.ts';

function formatTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildOpeningPartnerMessage(
  context: BusinessContext,
  presetHint?: string
): NegotiationMessage {
  const defaultHint =
    DEMO_SCENARIO_PRESETS.find(
      (p) =>
        p.targetCountry === context.targetCountry &&
        p.scenario === context.scenario
    )?.simulatorOpeningHint ??
    `Thank you for reaching out from Vietnam. As ${context.partnerRole} in ${context.targetCountry}, we value dependable long-term suppliers. Could you share how ${context.companyName || 'your company'} ensures consistent quality and flexible initial order quantities for ${context.productFocus || 'your products'}?`;

  return {
    id: `partner-open-${Date.now()}`,
    sender: 'partner',
    text: presetHint || defaultHint,
    timestamp: formatTime(),
    partnerToneNote: `Courteous yet commercially discerning opening from ${context.targetCountry} ${context.partnerRole}.`,
  };
}

function getInitialScreen(): ActiveScreen {
  if (typeof window === 'undefined') return 'context';
  const params = new URLSearchParams(window.location.search);
  const screenParam = params.get('screen');
  if (screenParam === 'email' || screenParam === 'simulator') {
    return screenParam;
  }
  if (params.get('autostart') === '1') {
    return 'email';
  }
  return 'context';
}

const DEFAULT_PRESET = DEMO_SCENARIO_PRESETS[0];

const INITIAL_CONTEXT: BusinessContext = {
  yourCountry: 'Vietnam',
  targetCountry: DEFAULT_PRESET.targetCountry,
  scenario: DEFAULT_PRESET.scenario,
  language: 'english',
  yourRole: DEFAULT_PRESET.yourRole,
  partnerRole: DEFAULT_PRESET.partnerRole,
  companyName: DEFAULT_PRESET.companyName,
  productFocus: DEFAULT_PRESET.productFocus,
  partnerName: DEFAULT_PRESET.partnerName,
};

export default function App() {
  const [activeScreen, setActiveScreen] =
    useState<ActiveScreen>(getInitialScreen);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Unified shared Business Context
  const [context, setContext] = useState<BusinessContext>(INITIAL_CONTEXT);

  // Screen 2: Email Assistant state
  const [draftText, setDraftText] = useState<string>(
    DEFAULT_PRESET.vietnameseDraft
  );
  const [emailAnalysis, setEmailAnalysis] =
    useState<EmailAnalysisResponse | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Screen 3: Negotiation Simulator state
  const [difficulty, setDifficulty] =
    useState<DifficultyLevel>('Intermediate');
  const [simMessages, setSimMessages] = useState<NegotiationMessage[]>(() => [
    buildOpeningPartnerMessage(
      INITIAL_CONTEXT,
      DEFAULT_PRESET.simulatorOpeningHint
    ),
  ]);
  const [latestCoaching, setLatestCoaching] =
    useState<NegotiationCoaching | null>(null);
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState<string | null>(null);

  const handleContextChange = (updated: BusinessContext) => {
    const marketOrScenarioChanged =
      updated.targetCountry !== context.targetCountry ||
      updated.scenario !== context.scenario;
    setContext(updated);
    if (marketOrScenarioChanged) {
      setEmailAnalysis(null);
      setEmailError(null);
      setSimMessages([buildOpeningPartnerMessage(updated)]);
      setLatestCoaching(null);
      setSimError(null);
    }
  };

  const handleApplyPreset = (
    preset: DemoScenarioPreset,
    navigateToEmail = false
  ) => {
    const nextContext: BusinessContext = {
      yourCountry: 'Vietnam',
      targetCountry: preset.targetCountry,
      scenario: preset.scenario,
      language: context.language,
      yourRole: preset.yourRole,
      partnerRole: preset.partnerRole,
      companyName: preset.companyName,
      productFocus: preset.productFocus,
      partnerName: preset.partnerName,
    };
    setContext(nextContext);
    setDraftText(preset.vietnameseDraft);
    setEmailAnalysis(null);
    setEmailError(null);
    setSimMessages([
      buildOpeningPartnerMessage(nextContext, preset.simulatorOpeningHint),
    ]);
    setLatestCoaching(null);
    setSimError(null);
    if (navigateToEmail) {
      setActiveScreen('email');
    }
  };

  const handleAnalyzeEmail = async () => {
    if (!draftText || draftText.trim().length < 12) {
      setEmailError(
        'Please enter at least 12 characters in Vietnamese or English before analyzing.'
      );
      return;
    }

    setEmailLoading(true);
    setEmailError(null);

    try {
      const response = await fetch('/api/email/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftText, context }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze email.');
      }

      setEmailAnalysis(data as EmailAnalysisResponse);
    } catch (err) {
      setEmailError(
        err instanceof Error
          ? err.message
          : 'Unable to reach AI Email Assistant right now.'
      );
    } finally {
      setEmailLoading(false);
    }
  };

  const handleSendNegotiationTurn = async (text: string) => {
    const userMsg: NegotiationMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: formatTime(),
    };

    const nextHistory = [...simMessages, userMsg];
    setSimMessages(nextHistory);
    setSimLoading(true);
    setSimError(null);

    try {
      const response = await fetch('/api/negotiation/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          difficulty,
          history: nextHistory,
          userMessage: text,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to simulate partner response.');
      }

      const turn = data as NegotiationTurnResponse;
      const partnerMsg: NegotiationMessage = {
        id: `partner-${Date.now()}`,
        sender: 'partner',
        text: turn.partner_reply,
        timestamp: formatTime(),
        partnerToneNote: turn.partner_tone_note,
      };

      setSimMessages((prev) => [...prev, partnerMsg]);
      setLatestCoaching(turn.coaching);
    } catch (err) {
      setSimError(
        err instanceof Error
          ? err.message
          : 'Unable to complete negotiation turn.'
      );
    } finally {
      setSimLoading(false);
    }
  };

  const handleResetSimulation = () => {
    setSimMessages([buildOpeningPartnerMessage(context)]);
    setLatestCoaching(null);
    setSimError(null);
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-900">
      <SidebarNav
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        context={context}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          activeScreen={activeScreen}
          context={context}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onLoadHeroDemo={() => handleApplyPreset(DEFAULT_PRESET, true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {activeScreen === 'context' && (
            <BusinessContextScreen
              context={context}
              onChangeContext={handleContextChange}
              onApplyPreset={handleApplyPreset}
              onStartCommunication={() => setActiveScreen('email')}
            />
          )}

          {activeScreen === 'email' && (
            <EmailAssistantScreen
              context={context}
              draftText={draftText}
              onChangeDraftText={(val) => {
                setDraftText(val);
                if (emailError) setEmailError(null);
              }}
              analysis={emailAnalysis}
              isLoading={emailLoading}
              errorMessage={emailError}
              onAnalyze={handleAnalyzeEmail}
              onApplyPreset={handleApplyPreset}
              onEditContext={() => setActiveScreen('context')}
              onGoToSimulator={() => setActiveScreen('simulator')}
            />
          )}

          {activeScreen === 'simulator' && (
            <NegotiationSimulatorScreen
              context={context}
              difficulty={difficulty}
              onChangeDifficulty={setDifficulty}
              onChangePartnerRole={(role) =>
                setContext((prev) => ({ ...prev, partnerRole: role }))
              }
              messages={simMessages}
              latestCoaching={latestCoaching}
              isLoading={simLoading}
              errorMessage={simError}
              onSendMessage={handleSendNegotiationTurn}
              onResetSession={handleResetSimulation}
              onEditContext={() => setActiveScreen('context')}
            />
          )}
        </main>
      </div>
    </div>
  );
}
