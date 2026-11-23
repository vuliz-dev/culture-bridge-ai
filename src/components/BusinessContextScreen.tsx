import { ArrowRight, Check, ChevronRight, Lock, Sparkles } from 'lucide-react';
import {
  DEMO_SCENARIO_PRESETS,
  SCENARIO_OPTIONS,
} from '../data/culturalKnowledgeBase.ts';
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
import { Button } from './ui/Button.tsx';
import { PartnerBriefCard } from './PartnerBriefCard.tsx';
import { useI18n } from '../i18n/index.tsx';

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
  const { locale } = useI18n();
  const isVi = locale === 'vi';
  const isAr = locale === 'ar';

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
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            {isVi ? 'Thiết lập xuất khẩu · Việt Nam → Vùng Vịnh (GCC)' : isAr ? 'إعداد التصدير · فيتنام إلى الخليج' : 'Export Setup · Vietnam → GCC'}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
            {isVi ? 'Bối cảnh thương mại' : isAr ? 'سياق العمل التجاري' : 'Commercial Context'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {isVi
              ? 'Xác định đối tác, kịch bản và thị trường để đồng bộ hóa văn phong cho Email và Giả lập đàm phán.'
              : isAr
              ? 'حدد السوق والشريك والسيناريو لمواءمة التواصل الدبلوماسي عبر جميع المراحل.'
              : 'Select target market, scenario, and commercial roles to harmonize cultural diplomacy.'}
          </p>
        </div>

        <Button
          type="button"
          variant="accent"
          size="default"
          onClick={onStartCommunication}
          className="shrink-0 self-start sm:self-center shadow-xs"
        >
          <span>{isVi ? 'Vào Trợ lý Email' : isAr ? 'الانتقال إلى المساعد' : 'Open Email Assistant'}</span>
          <ArrowRight className="w-4 h-4 rtl-flip" aria-hidden="true" />
        </Button>
      </div>

      {/* Quick Preset Selector Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground me-1">
          {isVi ? 'Mẫu kịch bản nhanh:' : isAr ? 'سيناريوهات جاهزة:' : 'Quick Presets:'}
        </span>
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
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isSelected
                  ? 'border-accent bg-accent/10 text-accent font-semibold shadow-xs'
                  : 'border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground'
              }`}
            >
              <CountryFlag country={preset.targetCountry} className="w-3.5 h-3.5" />
              <span>{preset.shortLabel}</span>
              {isSelected && <Check className="w-3 h-3 text-accent" />}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left Form (concise) + Right Partner Brief */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.85fr)] items-start">
        {/* Left Column: Form Controls */}
        <div className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-6 shadow-xs">
          {/* Section 1: Market & Scenario */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isVi ? '1. Thị trường & Kịch bản' : isAr ? '١. السوق والسيناريو' : '1. Market & Scenario'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  {isVi ? 'Quốc gia xuất khẩu' : isAr ? 'بلد التصدير' : 'Origin Country'}
                </label>
                <div className="relative">
                  <div className="w-full h-9 px-3 rounded-lg border border-border/70 bg-muted/50 text-xs font-medium text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CountryFlag country="Vietnam" className="w-4 h-4" />
                      <span>{isVi ? 'Việt Nam (Cố định)' : isAr ? 'فيتنام (ثابت)' : 'Vietnam (Fixed)'}</span>
                    </span>
                    <Lock className="w-3.5 h-3.5 text-muted-foreground/60" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="target-country-select" className="block text-xs font-medium text-foreground mb-1.5">
                  {isVi ? 'Thị trường mục tiêu' : isAr ? 'السوق المستهدف' : 'Target Market'}
                </label>
                <select
                  id="target-country-select"
                  value={context.targetCountry}
                  onChange={(e) => updateField('targetCountry', e.target.value as TargetCountry)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="UAE">🇦🇪 UAE (Dubai / Abu Dhabi)</option>
                  <option value="Qatar">🇶🇦 Qatar (Doha)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="scenario-select" className="block text-xs font-medium text-foreground mb-1.5">
                {isVi ? 'Tình huống thương mại' : isAr ? 'سيناريو العمل' : 'Commercial Scenario'}
              </label>
              <select
                id="scenario-select"
                value={context.scenario}
                onChange={(e) => updateField('scenario', e.target.value as BusinessScenario)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {SCENARIO_OPTIONS.map((sc) => (
                  <option key={sc.value} value={sc.value}>
                    {sc.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Roles & Output Language */}
          <div className="space-y-4 pt-4 border-t border-border/70">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isVi ? '2. Vai trò & Ngôn ngữ đầu ra' : isAr ? '٢. الأدوار ولغة التواصل' : '2. Roles & Output Language'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label htmlFor="user-role-select" className="block text-xs font-medium text-foreground mb-1.5">
                  {isVi ? 'Vai trò của bạn' : isAr ? 'دورك' : 'Your Role'}
                </label>
                <select
                  id="user-role-select"
                  value={context.yourRole}
                  onChange={(e) => updateField('yourRole', e.target.value as UserRole)}
                  className="w-full h-9 px-2.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {USER_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="partner-role-select" className="block text-xs font-medium text-foreground mb-1.5">
                  {isVi ? 'Vai trò đối tác' : isAr ? 'دور الشريك' : 'Partner Role'}
                </label>
                <select
                  id="partner-role-select"
                  value={context.partnerRole}
                  onChange={(e) => updateField('partnerRole', e.target.value as PartnerRole)}
                  className="w-full h-9 px-2.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {PARTNER_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="language-select" className="block text-xs font-medium text-foreground mb-1.5">
                  {isVi ? 'Ngôn ngữ xuất ra' : isAr ? 'لغة الإخراج' : 'Output Language'}
                </label>
                <select
                  id="language-select"
                  value={context.language}
                  onChange={(e) => updateField('language', e.target.value as CommunicationLanguage)}
                  className="w-full h-9 px-2.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="english">Business English</option>
                  <option value="english_arabic">English + Arabic Courtesy</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Commercial Parameters */}
          <div className="space-y-4 pt-4 border-t border-border/70">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isVi ? '3. Chi tiết doanh nghiệp' : isAr ? '٣. تفاصيل الشركتين' : '3. Commercial Details'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="company-name-input" className="block text-xs font-medium text-foreground mb-1.5">
                  {isVi ? 'Tên công ty xuất khẩu của bạn' : isAr ? 'اسم شركتك' : 'Your Export Company'}
                </label>
                <input
                  id="company-name-input"
                  type="text"
                  value={context.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  placeholder="e.g. Viet Agrifoods JSC"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label htmlFor="partner-name-input" className="block text-xs font-medium text-foreground mb-1.5">
                  {isVi ? 'Người phụ trách / Công ty đối tác' : isAr ? 'اسم الشريك / الشركة المستوردة' : 'Partner Contact / Company'}
                </label>
                <input
                  id="partner-name-input"
                  type="text"
                  value={context.partnerName || ''}
                  onChange={(e) => updateField('partnerName', e.target.value)}
                  placeholder={context.targetCountry === 'UAE' ? 'Tariq Al-Mansoori (Al-Mansoori Trading)' : 'Khalifa Al-Thani (Al-Thani Foods)'}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="product-focus-input" className="block text-xs font-medium text-foreground mb-1.5">
                {isVi ? 'Mặt hàng & Tiêu chuẩn xuất khẩu' : isAr ? 'المنتجات والمواصفات' : 'Product Focus & Certifications'}
              </label>
              <input
                id="product-focus-input"
                type="text"
                value={context.productFocus}
                onChange={(e) => updateField('productFocus', e.target.value)}
                placeholder="e.g. Premium Roasted Cashews (W240/W320), Halal Certified"
                className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              {isVi ? 'Tự động lưu và đồng bộ' : isAr ? 'حفظ ومزامنة تلقائية' : 'Auto-saved to workspace'}
            </span>
            <Button
              type="button"
              variant="accent"
              size="default"
              onClick={onStartCommunication}
              className="gap-2"
            >
              <span>{isVi ? 'Tiếp tục sang Trợ lý Email' : isAr ? 'متابعة إلى المساعد' : 'Continue to Email Assistant'}</span>
              <ChevronRight className="w-4 h-4 rtl-flip" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Right Column: Sticky Cultural Brief Card */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <PartnerBriefCard
            market={context.targetCountry}
            company={context.partnerName || (context.targetCountry === 'UAE' ? 'Al-Mansoori Trading LLC' : 'Al-Thani Food Group')}
            contact={`${context.targetCountry === 'UAE' ? 'Tariq Al-Mansoori' : 'Khalifa Al-Thani'} · ${context.partnerRole}`}
          />
        </div>
      </div>
    </div>
  );
}
