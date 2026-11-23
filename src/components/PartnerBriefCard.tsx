import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  Fingerprint,
  GitFork,
  MessagesSquare,
  ShieldCheck,
} from 'lucide-react';
import { useI18n } from '../i18n/index.tsx';
import { cn } from '../lib/utils.ts';
import type { TargetCountry } from '../types/culturebridge.ts';

interface MetaRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function MetaRow({ icon, label, value }: MetaRowProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-accent">{icon}</span>
      <div className="min-w-0 flex-1">
        <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-0.5 text-[12.5px] font-medium leading-snug text-foreground">
          {value}
        </dd>
      </div>
    </div>
  );
}

interface PartnerBriefCardProps {
  market?: TargetCountry;
  company?: string;
  contact?: string;
  kicker?: string;
  className?: string;
}

export function PartnerBriefCard({
  market = 'UAE',
  company,
  contact,
  kicker,
  className,
}: PartnerBriefCardProps) {
  const { locale } = useI18n();

  const isAr = locale === 'ar';
  const isVi = locale === 'vi';

  const isQatar = market === 'Qatar';

  const defaultCompany = isQatar
    ? (company || 'Al-Thani Food Distribution')
    : (company || 'Al-Mansoori Trading LLC');

  const defaultContact = isQatar
    ? (contact || 'Khalifa Al-Thani · Procurement Director')
    : (contact || 'Tariq Al-Mansoori · Import Director');

  const defaultKicker = kicker || (isVi ? 'Hồ sơ văn hóa đối tác' : isAr ? 'ملف ثقافة الشريك' : 'Partner Cultural Brief');

  const countryData = isQatar
    ? {
        name: 'Qatar',
        workweek: isVi ? 'Chủ Nhật – Thứ Năm (Nghỉ Thứ Sáu & Thứ Bảy)' : isAr ? 'الأحد – الخميس (عطلة الجمعة والسبت)' : 'Sunday – Thursday (Friday/Saturday weekend)',
        decision: isVi ? 'Cực kỳ thận trọng, qua nhiều cấp gia tộc & pháp lý' : isAr ? 'دقيق وحذر جداً، متصل بالعائلة والمستشارين' : 'Deliberate, high-touch, consultative & family-aligned',
        tone: isVi ? 'Trang trọng, tôn ti trật tự cao, kiên nhẫn' : isAr ? 'رسمي، رفيع المستوى، يفضل التواصل الشخصي' : 'Formal, highly respectful, patient & relational',
        greeting: isVi ? 'Chào hỏi chuẩn mực, gửi lời chúc sức khỏe gia quyến' : isAr ? 'تحيات رسمية رفيعة وتمنيات بالخير للشريك وعائلته' : 'Formal greetings with warm personal and business goodwill',
        avoid: isVi
          ? ['Hối thúc chốt hợp đồng trước khi xác nhận thẩm quyền', 'Giao dịch qua loa không có chứng nhận Halal/ISO']
          : isAr
          ? ['الاستعجال في إبرام العقود قبل التوافق', 'إغفال شهادات الحلال والجودة الصارمة']
          : ['Rushing agreement before establishing trust', 'Neglecting strict Halal and quality certifications'],
        sources: isVi
          ? 'Phòng Thương mại & Công nghiệp Qatar (QCCI)'
          : isAr
          ? 'غرفة تجارة وصناعة قطر ودليل بروتوكول الأعمال'
          : 'Qatar Chamber of Commerce & Industry (QCCI)',
      }
    : {
        name: 'UAE',
        workweek: isVi ? 'Thứ Hai – Thứ Sáu (Sáng Thứ Sáu)' : isAr ? 'الإثنين – الجمعة (نصف يوم الجمعة)' : 'Monday – Friday (Half-day Friday)',
        decision: isVi ? 'Tập trung vào mối quan hệ, phân cấp' : isAr ? 'هرمي ومبني على التوافق' : 'Hierarchical, consensus-oriented',
        tone: isVi ? 'Lịch thiệp, tôn trọng, không ép giá gấp' : isAr ? 'محترم، دافئ ومهني' : 'Courteous, relational & diplomatic',
        greeting: isVi ? 'Lời chào đối tác & hỏi thăm thiện chí' : isAr ? 'تحية تقدير وبناء علاقة' : 'Polite personal goodwill & formal greeting',
        avoid: isVi
          ? ['Vào thẳng giá cả khi chưa tạo dựng thiện chí', 'Thúc ép thời hạn phản hồi quá gấp']
          : isAr
          ? ['الدخول في الأسعار مباشرة دون بناء علاقة', 'الاستعجال في المواعيد النهائية']
          : ['Rushing directly to pricing without rapport', 'Imposing rigid deadlines or aggressive ultimatums'],
        sources: isVi
          ? 'Bộ Kinh tế UAE & Quy tắc giao thương vùng Vịnh GCC'
          : isAr
          ? 'وزارة الاقتصاد الإماراتية ودليل آداب الأعمال trong الخليج'
          : 'UAE Ministry of Economy & GCC Trade Protocol Guide',
      };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all',
        className,
      )}
    >
      {/* Header bar */}
      <div className="relative overflow-hidden bg-primary px-5 py-4 text-primary-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-8 -top-10 size-32 rounded-full bg-accent/25 blur-2xl"
        />
        <div className="relative flex items-center justify-between gap-2">
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/75">
            {defaultKicker}
          </p>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary-foreground/20 px-2 py-0.5 text-[10px] font-medium text-primary-foreground/90">
            <ShieldCheck className="size-3" aria-hidden="true" />
            {countryData.name}
          </span>
        </div>
        <p className="relative mt-2 font-display text-[18px] font-bold leading-tight text-white">
          {defaultCompany}
        </p>
        <p className="relative mt-1 text-[11.5px] leading-snug text-primary-foreground/80">
          {defaultContact}
        </p>
      </div>

      {/* Rows */}
      <div className="space-y-3.5 p-5">
        <MetaRow
          icon={<CalendarDays className="size-3.5" aria-hidden="true" />}
          label={isVi ? 'Tuần làm việc' : isAr ? 'أسبوع العمل' : 'Work Week'}
          value={countryData.workweek}
        />
        <MetaRow
          icon={<GitFork className="size-3.5" aria-hidden="true" />}
          label={isVi ? 'Quyết định' : isAr ? 'صنع القرار' : 'Decision Style'}
          value={countryData.decision}
        />
        <MetaRow
          icon={<Fingerprint className="size-3.5" aria-hidden="true" />}
          label={isVi ? 'Tông giọng' : isAr ? 'النبرة' : 'Tone & Style'}
          value={countryData.tone}
        />
        <MetaRow
          icon={<MessagesSquare className="size-3.5" aria-hidden="true" />}
          label={isVi ? 'Chào mở đầu' : isAr ? 'التحية' : 'Opening Etiquette'}
          value={countryData.greeting}
        />

        {/* Avoid section */}
        <div className="space-y-2 border-t border-border/80 pt-3">
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {isVi ? 'Cần tránh' : isAr ? 'تجنب' : 'Things to Avoid'}
          </p>
          <ul className="space-y-1.5">
            {countryData.avoid.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-[12px] leading-snug text-foreground"
              >
                <AlertTriangle
                  className="mt-0.5 size-3.5 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sources footer */}
        <p className="flex items-start gap-1.5 border-t border-border/80 pt-3 text-[10px] leading-relaxed text-muted-foreground">
          <BookOpen className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
          <span>{countryData.sources}</span>
        </p>
      </div>
    </div>
  );
}
