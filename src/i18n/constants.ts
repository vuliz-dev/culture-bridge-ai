import type { Locale } from './types.ts';

export const LOCALE_STORAGE_KEY = 'bridgely.locale';

export const LOCALES: Locale[] = ['vi', 'en', 'ar'];

export const LOCALE_LABELS: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  ar: 'العربية',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && LOCALES.includes(value as Locale);
}

export function interpolate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{{${key}}}`,
  );
}
