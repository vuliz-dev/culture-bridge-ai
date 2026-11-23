import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ar } from './ar.ts';
import { en } from './en.ts';
import { vi } from './vi.ts';
import { LOCALE_STORAGE_KEY, interpolate, isLocale } from './constants.ts';
import type { Dict, Locale } from './types.ts';

const DICTS: Record<Locale, Dict> = { vi, en, ar };

function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'vi';
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (isLocale(stored)) return stored;
  const browser = window.navigator.language.slice(0, 2);
  if (isLocale(browser)) return browser;
  return 'vi';
}

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dict;
  dir: 'rtl' | 'ltr';
  format: (
    template: string,
    vars?: Record<string, string | number>,
  ) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(readStoredLocale);

  useEffect(() => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.title = DICTS[locale].meta.title;
  }, [locale]);

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      t: DICTS[locale],
      dir: locale === 'ar' ? 'rtl' : 'ltr',
      format: interpolate,
    }),
    [locale],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
}
