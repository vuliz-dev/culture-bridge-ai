import { useI18n } from '../i18n/index.tsx';
import { LOCALE_LABELS, LOCALES } from '../i18n/constants.ts';
import type { Locale } from '../i18n/types.ts';
import { cn } from '../lib/utils.ts';

interface LanguageSwitcherProps {
  compact?: boolean;
  className?: string;
}

export function LanguageSwitcher({
  compact = false,
  className,
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      aria-label="Language"
      className={cn(
        'h-9 rounded-lg border border-border bg-card px-2.5 text-[12px] font-medium text-foreground transition-colors',
        'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring',
        'cursor-pointer appearance-none',
        compact ? 'w-auto pe-7' : 'w-full',
        className,
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.5rem center',
      }}
    >
      {LOCALES.map((loc) => (
        <option key={loc} value={loc}>
          {compact ? loc.toUpperCase() : LOCALE_LABELS[loc]}
        </option>
      ))}
    </select>
  );
}
