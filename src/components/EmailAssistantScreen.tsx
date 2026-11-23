import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Info,
  Loader2,
  MessageSquare,
  PenLine,
  RefreshCw,
  Send,
  ShieldAlert,
  Sparkles,
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
import { Button } from './ui/Button.tsx';
import { useI18n } from '../i18n/index.tsx';

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
  const { locale } = useI18n();
  const isVi = locale === 'vi';
  const isAr = locale === 'ar';
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
      // Fallback
    }
  };

  const severityBadge = (level: 'low' | 'medium' | 'high') => {
    if (level === 'high') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold bg-destructive/15 text-destructive border border-destructive/30">
          <AlertTriangle className="w-3 h-3" />
          {isVi ? 'Rủi ro cao' : isAr ? 'مخاطرة عالية' : 'High Risk'}
        </span>
      );
    }
    if (level === 'medium') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold bg-accent/15 text-accent border border-accent/30">
          <Info className="w-3 h-3" />
          {isVi ? 'Cần chú ý' : isAr ? 'تنبيه متوسط' : 'Caution'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-medium bg-muted text-muted-foreground border border-border">
        {isVi ? 'Khuyến nghị' : isAr ? 'ملاحظة' : 'Advisory'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            {isVi ? 'Trợ lý ngoại giao thư tín · Việt Nam → Vùng Vịnh' : isAr ? 'مساعد صياغة المراسلات · فيتنام إلى الخليج' : 'Diplomatic Mail Assistant · Vietnam → GCC'}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
            {isVi ? 'Trợ lý Email Thương mại' : isAr ? 'مساعد البريد التجاري' : 'Export Email Assistant'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {isVi
              ? 'Chuyển hóa thư nháp tiếng Việt thô thành email ngoại giao chuẩn mực với đối tác UAE & Qatar.'
              : isAr
              ? 'تحويل المسودات المبدئية إلى مراسلات دبلوماسية رفيعة المستوى لشركاء الخليج.'
              : 'Transform raw drafts into culturally nuanced correspondence for GCC business partners.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onEditContext}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary/60 transition-colors self-start sm:self-center"
        >
          <PenLine className="w-3.5 h-3.5 text-accent" />
          <span>{isVi ? 'Đổi bối cảnh đối tác' : isAr ? 'تعديل سياق العمل' : 'Change Context'}</span>
        </button>
      </div>

      {/* Persistent Context Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-border bg-card/70 text-xs">
        <div className="flex flex-wrap items-center gap-2 font-medium">
          <div className="flex items-center gap-1.5 text-foreground font-semibold">
            <CountryFlag country="Vietnam" className="w-3.5 h-3.5" />
            <span>Việt Nam</span>
            <span className="text-muted-foreground/60">→</span>
            <CountryFlag country={context.targetCountry} className="w-3.5 h-3.5" />
            <span>{context.targetCountry}</span>
          </div>
          <span className="text-border">·</span>
          <span className="text-foreground">{scenarioLabel}</span>
          <span className="text-border">·</span>
          <span className="text-muted-foreground">
            {context.partnerName || `${context.targetCountry} ${context.partnerRole}`}
          </span>
          <span className="text-border">·</span>
          <span className="text-accent font-medium">
            {context.language === 'english_arabic' ? 'English + Arabic Courtesy' : 'Business English'}
          </span>
        </div>
      </div>

      {/* Main Split Layout: Left Draft Panel + Right Polished Result */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] items-start">
        {/* Left Column: Draft Editor (Sticky) */}
        <div className="xl:sticky xl:top-24 rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <label htmlFor="draft-textarea" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isVi ? 'Bản nháp của bạn' : isAr ? 'مسودتك' : 'Your Draft'}
            </label>
            <span className="text-[11px] text-muted-foreground font-mono">
              {draftText.length} {isVi ? 'ký tự' : isAr ? 'حرف' : 'chars'}
            </span>
          </div>

          <textarea
            id="draft-textarea"
            value={draftText}
            onChange={(e) => onChangeDraftText(e.target.value)}
            rows={8}
            placeholder={
              isVi
                ? 'Nhập nội dung thư thô bằng tiếng Việt hoặc tiếng Anh... (Ví dụ: Chào anh, chúng tôi muốn báo giá điều rang muối và hỏi anh có thể đặt cọc 50% trước không...)'
                : isAr
                ? 'اكتب مسودة الرسالة هنا...'
                : 'Enter your draft in Vietnamese or English...'
            }
            className="w-full p-3 rounded-lg border border-border bg-background text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent resize-y"
          />

          {/* Quick Sample Presets */}
          <div className="space-y-1.5">
            <p className="text-[10.5px] font-semibold text-muted-foreground">
              {isVi ? 'Mẫu thư nhanh để thử:' : isAr ? 'مسودات تجريبية سريعة:' : 'Quick Sample Drafts:'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DEMO_SCENARIO_PRESETS.filter(
                (p) => p.targetCountry === context.targetCountry
              ).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onApplyPreset(preset, false);
                    onChangeDraftText(preset.vietnameseDraft);
                  }}
                  className="px-2 py-1 rounded-md text-[11px] border border-border bg-secondary/50 text-foreground hover:border-accent/40 hover:bg-secondary transition-colors"
                >
                  {preset.shortLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/25 text-xs text-destructive flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Analyze / Generate Button */}
          <Button
            type="button"
            variant="accent"
            size="lg"
            onClick={onAnalyze}
            disabled={isLoading || draftText.trim().length < 8}
            className="w-full gap-2 shadow-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isVi ? 'Đang phân tích văn hóa...' : isAr ? 'جاري التحليل والمواءمة...' : 'Polishing Email...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isVi ? 'Tinh chỉnh văn phong ngoại giao' : isAr ? 'صياغة البريد الدبلوماسي' : 'Polish & Align Email'}</span>
              </>
            )}
          </Button>
        </div>

        {/* Right Column: Result & Cultural Audit */}
        <div className="space-y-5">
          {!analysis && !isLoading && (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 sm:p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent grid place-items-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold font-display text-foreground">
                {isVi ? 'Sẵn sàng tinh chỉnh thư tín của bạn' : isAr ? 'جاهز لتحسين مسودتك التجارية' : 'Ready to Polish Your Email'}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                {isVi
                  ? 'Bấm nút "Tinh chỉnh văn phong ngoại giao" bên trái. Bridgely sẽ cấu trúc lại lời chào, làm dịu yêu cầu thương mại và kiểm tra nghi thức giao thương vùng Vịnh.'
                  : isAr
                  ? 'انقر على الزر على اليسار لصياغة رسالة متوافقة مع الأعراف التجارية الخليجية.'
                  : 'Click the button on the left. Bridgely will rewrite greetings, soften commercial demands, and protect face.'}
              </p>
            </div>
          )}

          {isLoading && !analysis && (
            <div className="rounded-xl border border-border bg-card p-12 text-center space-y-4 shadow-xs">
              <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
              <p className="text-sm font-semibold text-foreground">
                {isVi ? 'Đang rà soát quy tắc ngoại giao thương mại GCC...' : isAr ? 'جاري تدقيق بروتوكول الأعمال الخليجي...' : 'Auditing against GCC trade etiquette...'}
              </p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {isVi
                  ? 'Kiểm tra mức độ trang trọng, lời chào hỏi thăm gia quyến, thiện chí hợp tác lâu dài và chuẩn bị bản dịch tiếng Ả Rập chuẩn xác.'
                  : isAr
                  ? 'التحقق من نبرة الاحترام وبناء الثقة...'
                  : 'Checking tone, personal rapport, indirect phrasing, and courteous Arabic touches.'}
              </p>
            </div>
          )}

          {analysis && (
            <>
              {/* Card 1: Polished Email */}
              <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
                {/* Email Header */}
                <div className="px-5 py-4 bg-muted/40 border-b border-border flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                      {isVi ? 'Thư hoàn chỉnh · Sẵn sàng gửi' : isAr ? 'الرسالة المكتملة · جاهزة للإرسال' : 'Polished Draft · Ready to Send'}
                    </span>
                    <h3 className="text-sm font-bold text-foreground mt-0.5">
                      {analysis.improved_email.subject}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyEmail}
                      className="gap-1.5 text-xs"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">{isVi ? 'Đã sao chép' : isAr ? 'تم النسخ' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isVi ? 'Sao chép thư' : isAr ? 'نسخ الرسالة' : 'Copy Email'}</span>
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="accent"
                      size="sm"
                      onClick={onGoToSimulator}
                      className="gap-1.5 text-xs"
                    >
                      <span>{isVi ? 'Luyện tập đàm phán' : isAr ? 'ممارسة التفاوض' : 'Practice in Simulator'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                    </Button>
                  </div>
                </div>

                {/* Email Content */}
                <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm font-sans leading-relaxed text-foreground/90">
                  <div className="font-semibold text-foreground">
                    {analysis.improved_email.greeting}
                  </div>
                  <div className="whitespace-pre-line text-foreground/90">
                    {analysis.improved_email.body}
                  </div>
                  <div className="pt-2 font-medium text-foreground whitespace-pre-line border-t border-border/50">
                    {analysis.improved_email.closing}
                  </div>
                  {analysis.improved_email.arabic_courtesy_note && (
                    <div className="mt-3 p-3 rounded-lg bg-accent/5 border border-accent/20 text-xs text-foreground/80 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span>{analysis.improved_email.arabic_courtesy_note}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Cultural Audit & Transformation */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span>{isVi ? 'Đánh giá Văn hóa & Rủi ro thương mại' : isAr ? 'تدقيق الحساسية الثقافية والمخاطر' : 'Cultural Audit & Nuance'}</span>
                  </h3>
                  <span className="text-[11px] font-semibold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">
                    {analysis.risk_warnings.length} {isVi ? 'điểm lưu ý' : isAr ? 'ملاحظات' : 'alerts'}
                  </span>
                </div>

                {/* Cultural Risks List */}
                {analysis.risk_warnings.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {isVi ? 'Phân tích điểm chạm nhạy cảm:' : isAr ? 'نقاط الحذر الثقافي:' : 'Cultural Risk Warnings:'}
                    </p>
                    <div className="grid gap-2">
                      {analysis.risk_warnings.map((risk, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border border-border/70 bg-card text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-foreground">
                              {risk.title}
                            </span>
                            {severityBadge(risk.severity)}
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {risk.message}
                          </p>
                          <p className="text-accent font-medium pt-0.5">
                            {risk.suggestion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Phrase Transformation (Before vs After) */}
                {analysis.alternative_phrases.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {isVi ? 'Chuyển đổi câu từ ngoại giao:' : isAr ? 'تحويل العبارات إلى نبرة دبلوماسية:' : 'Phrase Transformations:'}
                    </p>
                    <div className="space-y-2">
                      {analysis.alternative_phrases.map((item, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 rounded-lg bg-muted/20 border border-border/60 text-xs"
                        >
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {isVi ? 'Bản gốc (Dễ gây mất thể diện):' : isAr ? 'الأصل:' : 'Original draft:'}
                            </span>
                            <p className="text-muted-foreground line-through decoration-destructive/60">
                              "{item.original}"
                            </p>
                          </div>
                          <div className="space-y-1 md:border-s md:border-border/60 md:ps-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                              {isVi ? 'Đã tinh chỉnh (Chuẩn vị thế):' : isAr ? 'الصياغة الدبلوماسية:' : 'Diplomatic GCC alternative:'}
                            </span>
                            <p className="text-foreground font-medium">
                              "{item.improved}"
                            </p>
                            <p className="text-[10.5px] text-muted-foreground">
                              {item.reason}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cultural Analysis Aspects */}
                {analysis.cultural_analysis.length > 0 && (
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {isVi ? 'Phân tích chiến lược giao thương:' : isAr ? 'تحليل استراتيجية التواصل:' : 'Strategic Insights:'}
                    </p>
                    <div className="grid gap-2 text-xs">
                      {analysis.cultural_analysis.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-muted/20 border border-border/50">
                          <span className="font-semibold text-foreground">{item.aspect}: </span>
                          <span className="text-muted-foreground">{item.summary}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
