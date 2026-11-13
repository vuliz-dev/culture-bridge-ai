import type { TargetCountry } from '../types/culturebridge.ts';

interface CountryFlagProps {
  country: 'Vietnam' | TargetCountry;
  className?: string;
}

export function CountryFlag({ country, className = 'w-5 h-5' }: CountryFlagProps) {
  if (country === 'Vietnam') {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} rounded-full shrink-0 border border-slate-200`}
        aria-hidden="true"
      >
        <rect width="24" height="24" fill="#DA251D" />
        <polygon
          points="12,5.5 13.7,10.6 19.1,10.6 14.7,13.8 16.4,18.9 12,15.7 7.6,18.9 9.3,13.8 4.9,10.6 10.3,10.6"
          fill="#FFCD00"
        />
      </svg>
    );
  }

  if (country === 'UAE') {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${className} rounded-full shrink-0 border border-slate-200`}
        aria-hidden="true"
      >
        <rect x="6" y="0" width="18" height="8" fill="#00732F" />
        <rect x="6" y="8" width="18" height="8" fill="#FFFFFF" />
        <rect x="6" y="16" width="18" height="8" fill="#000000" />
        <rect x="0" y="0" width="7" height="24" fill="#FF0000" />
      </svg>
    );
  }

  // Qatar
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} rounded-full shrink-0 border border-slate-200`}
      aria-hidden="true"
    >
      <rect width="24" height="24" fill="#8D1B3D" />
      <polygon
        points="0,0 8,0 10.5,2.4 8,4.8 10.5,7.2 8,9.6 10.5,12 8,14.4 10.5,16.8 8,19.2 10.5,21.6 8,24 0,24"
        fill="#FFFFFF"
      />
    </svg>
  );
}
