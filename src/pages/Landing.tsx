import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Handshake,
  MapPinned,
  PenLine,
  Rocket,
  Ship,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../components/ui/Button.tsx';
import { Kicker, Wordmark } from '../components/Brand.tsx';
import { LanguageSwitcher } from '../components/LanguageSwitcher.tsx';
import { PartnerBriefCard } from '../components/PartnerBriefCard.tsx';
import { useI18n } from '../i18n/index.tsx';

const STEP_ICONS = [MapPinned, PenLine, Handshake];
const AUDIENCE_ICONS = [Ship, Rocket, Briefcase, GraduationCap];

export function Landing() {
  const { t, locale } = useI18n();

  const isVi = locale === 'vi';
  const isAr = locale === 'ar';

  const stats = [
    { label: isVi ? 'Thị trường' : isAr ? 'الأسواق' : 'Markets', value: 'UAE & Qatar' },
    { label: isVi ? 'Kịch bản chuẩn' : isAr ? 'سيناريوهات' : 'Scenarios', value: '7 B2B' },
    { label: isVi ? 'Tri thức' : isAr ? 'المعرفة' : 'Knowledge', value: '100% Verified' },
  ];

  const sourcesList = [
    isVi
      ? 'Bộ Kinh tế UAE & Quy định Thương mại Quốc tế'
      : isAr
      ? 'وزارة الاقتصاد الإماراتية واللوائح التجارية'
      : 'UAE Ministry of Economy & International Trade Guidelines',
    isVi
      ? 'Phòng Thương mại & Công nghiệp Qatar (Qatar Chamber)'
      : isAr
      ? 'غرفة قطر للتجارة والصناعة'
      : 'Qatar Chamber of Commerce & Industry Protocol',
    isVi
      ? 'Quy chuẩn Halal & Chứng nhận Tiêu chuẩn Vùng Vịnh (GSO)'
      : isAr
      ? 'معايير الحلال وهيئة التقييس لدول الخليج'
      : 'GSO & Halal Certification Standards for Gulf Import',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="bridgely-container flex h-16 items-center gap-4">
          <Link to="/" aria-label="Bridgely">
            <Wordmark />
          </Link>

          <nav className="ms-6 hidden items-center gap-6 md:flex">
            <a
              href="#how"
              className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.nav.how}
            </a>
            <a
              href="#audience"
              className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.nav.audience}
            </a>
          </nav>

          <div className="ms-auto flex items-center gap-2">
            <LanguageSwitcher compact />
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/workspace">
                {t.nav.workspace}
                <ArrowRight className="rtl-flip" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="paper-glow relative overflow-hidden border-b border-border/70">
        <div
          aria-hidden="true"
          className="motif-teal pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(80%_70%_at_65%_0%,black,transparent)]"
        />
        <div className="bridgely-container relative grid gap-14 py-12 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:py-20">
          <div className="animate-rise">
            <Kicker>{t.home.heroKicker}</Kicker>
            <h1 className="mt-5 font-display text-[clamp(2.35rem,5.2vw,4rem)] leading-[1.08] tracking-[-0.02em] whitespace-pre-line text-foreground">
              {t.home.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              {t.home.heroDesc}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/workspace">
                  {t.home.heroCta}
                  <ArrowRight className="rtl-flip" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#how">{t.nav.how}</a>
              </Button>
            </div>

            <dl className="mt-11 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[10px] font-semibold uppercase leading-tight tracking-[0.14em] text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd className="mt-1.5 font-display text-[22px] leading-none text-foreground font-semibold">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right Hero Card Visual */}
          <div className="animate-fade relative mx-auto w-full max-w-[26rem]">
            <div
              aria-hidden="true"
              className="arch-top absolute inset-x-2 -top-7 bottom-20 bg-primary shadow-xl opacity-90"
            />
            <div
              aria-hidden="true"
              className="motif-teal arch-top pointer-events-none absolute inset-x-2 -top-7 bottom-20 opacity-40"
            />
            <div className="relative pt-6">
              <PartnerBriefCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section id="how" className="border-b border-border/70 bg-card/40">
        <div className="bridgely-container py-14 lg:py-20">
          <div className="max-w-2xl">
            <Kicker>{t.home.howKicker}</Kicker>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,3.4vw,2.6rem)] leading-tight text-foreground">
              {t.home.howTitle}
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {t.home.steps.map((step, index) => {
              const Icon = STEP_ICONS[index];
              return (
                <article
                  key={step.title}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div
                    aria-hidden="true"
                    className="motif-teal pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-25 [mask-image:linear-gradient(to_top,black,transparent)]"
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="font-mono text-[12px] font-bold tracking-[0.12em] text-accent">
                      0{index + 1}
                    </span>
                    <span className="grid size-9 place-items-center rounded-full bg-secondary text-primary">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="relative mt-5 font-display text-xl text-foreground font-semibold">
                    {step.title}
                  </h3>
                  <p className="relative mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Audience Section ── */}
      <section id="audience" className="border-b border-border/70 bg-secondary/30">
        <div className="bridgely-container py-14 lg:py-20">
          <div className="max-w-2xl">
            <Kicker>{t.home.audienceKicker}</Kicker>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,3.4vw,2.6rem)] leading-tight text-foreground">
              {t.home.audienceTitle}
            </h2>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {t.home.audiences.map((item, index) => {
              const Icon = AUDIENCE_ICONS[index];
              return (
                <article
                  key={item.title}
                  className="flex gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent/40 shadow-xs"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-copper-soft text-accent">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-[19px] leading-snug font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="border-b border-border/70">
        <div className="bridgely-container py-14">
          <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-copper-soft/70 px-6 py-10 lg:px-12 lg:py-12">
            <div
              aria-hidden="true"
              className="motif-teal pointer-events-none absolute inset-0 opacity-40"
            />
            <div className="relative grid gap-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
              <div>
                <h2 className="font-display text-[clamp(1.8rem,3.2vw,2.5rem)] leading-tight text-foreground font-semibold">
                  {t.home.ctaTitle}
                </h2>
                <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-foreground/80">
                  {t.home.ctaDesc}
                </p>
              </div>
              <div className="flex flex-col gap-2 lg:items-end">
                <Button asChild size="lg" variant="accent">
                  <Link to="/workspace">
                    {t.home.ctaButton}
                    <ArrowRight className="rtl-flip" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sources / Grounded Knowledge Section ── */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div
          aria-hidden="true"
          className="motif-teal pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_right,black,transparent_85%)]"
        />
        <div className="bridgely-container relative grid gap-10 py-14 lg:grid-cols-2 lg:items-start lg:py-20">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gold">
              {isVi ? 'Nguồn gốc chuẩn xác' : isAr ? 'المصادر المعتمدة' : 'Verified Knowledge'}
            </span>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,3.4vw,2.5rem)] leading-tight text-white font-semibold">
              {isVi
                ? 'Được cố vấn bởi chuyên gia văn hóa vùng Vịnh'
                : isAr
                ? 'مبني على بروتوكولات تجارية خليجية موثقة'
                : 'Grounded in verified GCC commercial protocols'}
            </h2>
            <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-primary-foreground/80">
              {isVi
                ? 'Không chỉ là dịch thuật máy móc, Bridgely tích hợp quy tắc ngoại giao thương mại, tập quán xưng hô và phong cách ra quyết định đặc thù của đối tác UAE và Qatar.'
                : isAr
                ? 'لا نكتفي بالترجمة، بل ندمج أعراف الدبلوماسية التجارية وأساليب اتخاذ القرار الخليجية.'
                : 'Beyond raw translation, Bridgely models commercial diplomatic nuances, hierarchical communication styles, and negotiation timing.'}
            </p>
          </div>

          <ul className="space-y-3">
            {sourcesList.map((source, index) => (
              <li
                key={source}
                className="flex items-start gap-3 rounded-lg border border-primary-foreground/15 bg-primary-foreground/[0.06] px-4 py-3 backdrop-blur-[2px]"
              >
                <span className="font-mono text-[11px] font-bold text-gold">
                  0{index + 1}
                </span>
                <span className="text-[12.5px] leading-relaxed text-primary-foreground/90 font-medium">
                  {source}
                </span>
              </li>
            ))}
          </ul>

          <div className="lg:col-span-2">
            <div className="flex flex-col gap-3 border-t border-primary-foreground/15 pt-6 sm:flex-row sm:items-start sm:gap-4">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gold">
                <ShieldCheck className="size-4" aria-hidden="true" />
                {isVi ? 'Thực hành an toàn' : isAr ? 'ممارسة آمنة' : 'Safe Practice'}
              </span>
              <p className="max-w-2xl text-[12px] leading-relaxed text-primary-foreground/75">
                {isVi
                  ? 'Môi trường mô phỏng giúp doanh nghiệp diễn tập đối thoại, nhận diện điểm nhạy cảm về giá và điều khoản trước khi gửi email thực tế.'
                  : isAr
                  ? 'بيئة تدريبية تساعدك على التمرن واكتشاف النقاط الحساسة قبل التواصل الفعلي.'
                  : 'A sandbox for trial and error. Test alternative phrasings, uncover cultural friction, and refine emails before real negotiation turns.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/70 bg-card/60">
        <div className="bridgely-container flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark showTagline />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {t.home.footer}
          </p>
        </div>
      </footer>
    </div>
  );
}
