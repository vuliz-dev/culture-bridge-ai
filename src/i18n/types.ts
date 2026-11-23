export type Locale = 'vi' | 'en' | 'ar';

export interface StepInfo {
  title: string;
  desc: string;
}

export interface AudienceInfo {
  title: string;
  desc: string;
}

export interface Dict {
  meta: { title: string; description: string };
  nav: { how: string; audience: string; workspace: string; home: string };
  home: {
    heroKicker: string;
    heroTitle: string;
    heroDesc: string;
    heroCta: string;
    howKicker: string;
    howTitle: string;
    steps: [StepInfo, StepInfo, StepInfo];
    audienceKicker: string;
    audienceTitle: string;
    audiences: [AudienceInfo, AudienceInfo, AudienceInfo, AudienceInfo];
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
    footer: string;
  };
  workspace: {
    steps: { context: string; email: string; negotiation: string };
    activeContext: string;
    editContext: string;
    startCommunication: string;
    loadDemo: string;
  };
  email: {
    originalTitle: string;
    originalDesc: string;
    analyzeBtn: string;
    analyzingBtn: string;
    clearBtn: string;
    copyBtn: string;
    copiedBtn: string;
    readyTitle: string;
    readyDesc: string;
    improvedTitle: string;
    culturalTitle: string;
    practiceBtn: string;
    emptyDesc: string;
  };
  negotiation: {
    coachTitle: string;
    coachDesc: string;
    awaitingTitle: string;
    awaitingDesc: string;
    sendBtn: string;
    resetBtn: string;
    enterHint: string;
    sampleReplies: string;
    turns: string;
  };
  common: {
    vietnam: string;
    scenario: string;
    yourRole: string;
    partner: string;
    output: string;
  };
}
