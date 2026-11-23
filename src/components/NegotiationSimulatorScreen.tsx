import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  CornerDownLeft,
  Info,
  Loader2,
  RotateCcw,
  Send,
  Sparkles,
  User,
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
import { Button } from './ui/Button.tsx';
import { useI18n } from '../i18n/index.tsx';

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

const QUICK_STRATEGIES = [
  {
    labelVi: 'Đề xuất lô hàng mẫu thử',
    labelAr: 'عرض شحنة تجريبية',
    labelEn: 'Propose Trial Batch',
    text: 'Cảm ơn phản hồi của anh. Chúng tôi hiểu thị trường GCC cần kiểm nghiệm chất lượng thực tế. Dù đơn hàng chuẩn là 10 tấn, chúng tôi rất sẵn lòng xuất lô thử nghiệm 1 tấn kèm đầy đủ chứng nhận Halal và ISO 22000 để anh đánh giá phản hồi từ khách hàng.',
  },
  {
    labelVi: 'Đề xuất cuộc gọi chi tiết',
    labelAr: 'اقتراح مكالمة مباشرة',
    labelEn: 'Propose Exploratory Call',
    text: 'Chúng tôi rất trân trọng sự quan tâm của anh tới sản phẩm Việt Nam. Liệu sáng Thứ Ba hoặc Thứ Tư tuần này anh có tiện dành 20 phút để chúng ta trao đổi trực tiếp qua video call về tiêu chuẩn đóng gói và các mức chiết khấu theo sản lượng không?',
  },
  {
    labelVi: 'Thử phản hồi cứng nhắc (Xem cảnh báo)',
    labelAr: 'رد متصلب (اختبر تنبيه المدرب)',
    labelEn: 'Test Blunt Reply',
    text: 'Không được, giá đó chúng tôi không thể giảm và MOQ cũng không hạ được. Anh cần đặt cọc trước 50% thì chúng tôi mới cho đóng hàng xuất đi.',
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
  const { locale } = useI18n();
  const isVi = locale === 'vi';
  const isAr = locale === 'ar';

  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isLoading]);

  const partnerDisplayName =
    context.partnerName ||
    (context.targetCountry === 'UAE'
      ? 'Tariq Al-Mansoori'
      : 'Khalifa Al-Thani');

  const partnerInitials = getPartnerInitials(partnerDisplayName);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleApplySuggestion = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            {isVi ? 'Mô phỏng nhập vai trực tiếp · Việt Nam → Vùng Vịnh' : isAr ? 'محاكاة التفاوض الحي · فيتنام إلى الخليج' : 'Live Negotiation Simulator · Vietnam → GCC'}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
            {isVi ? 'Bộ Mô phỏng Đàm phán' : isAr ? 'محاكي التفاوض التجاري' : 'Negotiation Simulator'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {isVi
              ? 'Luyện tập thương lượng điều khoản, giá cả và bảo vệ vị thế thương hiệu với đối tác Vùng Vịnh.'
              : isAr
              ? 'تدرب على معالجة الأسعار والكميات وتأكيد الثقة مع شريك خليجي افتراضي.'
              : 'Practice handling price objections, MOQ constraints, and cultural nuances in real-time.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetSession}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 rtl-flip" />
            <span>{isVi ? 'Làm mới phiên' : isAr ? 'إعادة ضبط الجلسة' : 'Reset Session'}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onEditContext}
            className="text-xs"
          >
            <span>{isVi ? 'Đổi đối tác' : isAr ? 'تعديل الشريك' : 'Change Partner'}</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Chat Container + Right AI Coach Panel */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] items-start">
        {/* Left Column: Roleplay Chat */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs flex flex-col min-h-[34rem]">
          {/* Partner & Difficulty Header */}
          <div className="p-4 bg-muted/30 border-b border-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-display font-bold text-xs grid place-items-center shrink-0">
                {partnerInitials}
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <span>{partnerDisplayName}</span>
                  <CountryFlag country={context.targetCountry} className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {context.partnerRole} · {context.targetCountry}
                </p>
              </div>
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5 text-xs">
              {DIFFICULTIES.map((lvl) => {
                const isActive = difficulty === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => onChangeDifficulty(lvl)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isVi
                      ? lvl === 'Beginner' ? 'Cơ bản' : lvl === 'Intermediate' ? 'Trung bình' : 'Nâng cao'
                      : isAr
                      ? lvl === 'Beginner' ? 'مبتدئ' : lvl === 'Intermediate' ? 'متوسط' : 'متقدم'
                      : lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 max-h-[26rem] bg-background/50">
            {messages.map((msg) => {
              const isPartner = msg.sender === 'partner';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${
                    isPartner ? 'self-start' : 'self-end ms-auto flex-row-reverse'
                  }`}
                >
                  {isPartner ? (
                    <div className="w-7 h-7 rounded-full bg-secondary text-foreground text-[10px] font-bold grid place-items-center shrink-0 mt-0.5">
                      {partnerInitials}
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-accent text-accent-foreground text-[10px] font-bold grid place-items-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                        isPartner
                          ? 'bg-card border border-border text-foreground rounded-tl-xs shadow-2xs'
                          : 'bg-primary text-primary-foreground rounded-tr-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>

                    <div
                      className={`flex items-center gap-2 text-[10px] text-muted-foreground px-1 ${
                        isPartner ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.partnerToneNote && (
                        <>
                          <span>·</span>
                          <span className="italic text-muted-foreground/80">{msg.partnerToneNote}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2.5 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-secondary text-foreground text-[10px] font-bold grid place-items-center shrink-0">
                  {partnerInitials}
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-card border border-border rounded-tl-xs text-xs text-muted-foreground flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                  <span>{isVi ? 'Đối tác đang cân nhắc phản hồi...' : isAr ? 'الشريك يدرس الرد...' : 'Partner is evaluating...'}</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Strategy Suggestion Chips */}
          <div className="px-4 py-2.5 bg-muted/20 border-t border-border/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase me-1">
                {isVi ? 'Gợi ý nhanh:' : isAr ? 'استجابة سريعة:' : 'Quick ideas:'}
              </span>
              {QUICK_STRATEGIES.map((st, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplySuggestion(st.text)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-border bg-card hover:border-accent/50 hover:bg-secondary transition-colors text-foreground"
                >
                  {isVi ? st.labelVi : isAr ? st.labelAr : st.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-card border-t border-border flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isVi
                  ? 'Nhập phản hồi thương mại của bạn (Enter để gửi)...'
                  : isAr
                  ? 'اكتب ردك التجاري هنا...'
                  : 'Type your negotiation reply (Press Enter to send)...'
              }
              className="flex-1 h-10 px-3.5 rounded-lg border border-border bg-background text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button
              type="submit"
              variant="accent"
              size="default"
              disabled={isLoading || !inputText.trim()}
              className="shrink-0 gap-1.5"
            >
              <span>{isVi ? 'Gửi' : isAr ? 'إرسال' : 'Send'}</span>
              <Send className="w-3.5 h-3.5 rtl-flip" />
            </Button>
          </form>
        </div>

        {/* Right Column: AI Cultural Coach Panel (Sticky) */}
        <div className="xl:sticky xl:top-24 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-accent" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {isVi ? 'Huấn luyện viên Văn hóa' : isAr ? 'المدرب الثقافي الذكي' : 'AI Cultural Coach'}
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                {isVi ? 'Trực tiếp' : isAr ? 'مباشر' : 'Live'}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {isVi ? 'Độ rõ ràng' : isAr ? 'الوضوح' : 'Clarity'}
                </p>
                <p className="text-xs sm:text-sm font-bold font-display text-foreground mt-0.5">
                  {latestCoaching ? latestCoaching.clarity_rating : (isVi ? 'Rõ ràng' : isAr ? 'واضح' : 'Clear')}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {isVi ? 'Nghi thức' : isAr ? 'البروتوكول' : 'Protocol'}
                </p>
                <p className="text-xs sm:text-sm font-bold font-display text-foreground mt-0.5">
                  {latestCoaching ? latestCoaching.professionalism_rating : (isVi ? 'Chuẩn mực' : isAr ? 'احترافي' : 'Professional')}
                </p>
              </div>
            </div>

            {/* Latest Coaching Content */}
            {latestCoaching ? (
              <div className="space-y-3 pt-1 text-xs">
                {/* Tone tag */}
                <div className="space-y-1">
                  <span className="text-[10.5px] font-semibold uppercase text-muted-foreground">
                    {isVi ? 'Đánh giá tông giọng:' : isAr ? 'تقييم النبرة:' : 'Assessment:'}
                  </span>
                  <p className="p-2.5 rounded-lg bg-muted/30 border border-border/60 text-muted-foreground leading-relaxed">
                    {latestCoaching.assessment}
                  </p>
                </div>

                {/* Cultural Insight */}
                {latestCoaching.cultural_insight && (
                  <div className="p-3 rounded-lg bg-background border border-border/70 space-y-1">
                    <p className="text-[10.5px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>{isVi ? 'Nhận xét văn hóa' : isAr ? 'التوجيه الدبلوماسي' : 'Cultural Insight'}</span>
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {latestCoaching.cultural_insight}
                    </p>
                  </div>
                )}

                {/* Better Phrasing */}
                {latestCoaching.better_phrasing && (
                  <div className="p-3 rounded-lg bg-accent/5 border border-accent/25 space-y-1">
                    <p className="text-[10.5px] font-bold uppercase tracking-wider text-accent">
                      {isVi ? 'Cách làm mềm ý tứ:' : isAr ? 'تحسين العبارة:' : 'Better Phrasing:'}
                    </p>
                    <p className="text-foreground leading-relaxed">
                      {latestCoaching.better_phrasing}
                    </p>
                  </div>
                )}

                {/* Recommended Response */}
                {(latestCoaching.alternative_reply || latestCoaching.better_phrasing) && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10.5px] font-bold uppercase tracking-wider text-foreground">
                      {isVi ? 'Câu trả lời khuyên dùng:' : isAr ? 'الرد البديل الموصى به:' : 'Recommended diplomatic reply:'}
                    </p>
                    <div className="p-3 rounded-lg bg-card border border-border text-foreground leading-relaxed">
                      "{latestCoaching.alternative_reply || latestCoaching.better_phrasing}"
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleApplySuggestion(latestCoaching.alternative_reply || latestCoaching.better_phrasing)}
                      className="w-full text-xs gap-1.5 mt-1 border-accent/40 text-accent hover:bg-accent/10"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isVi ? 'Sử dụng câu trả lời này' : isAr ? 'استخدام هذا الرد' : 'Apply this suggestion'}</span>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center space-y-2 text-xs text-muted-foreground">
                <Info className="w-5 h-5 mx-auto text-muted-foreground/60" />
                <p>
                  {isVi
                    ? 'Gửi một tin nhắn đàm phán để nhận phản hồi phân tích thời gian thực từ Huấn luyện viên AI.'
                    : isAr
                    ? 'أرسل رداً للبدء في تلقي التقييم والتوجيه الدبلوماسي الحي.'
                    : 'Send a reply to receive real-time diplomatic evaluation and phrasing suggestions.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
