import { cn } from '../lib/utils.ts';

interface BridgeMarkProps {
  className?: string;
}

export function BridgeMark({ className }: BridgeMarkProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M5 31V20a15 15 0 0 1 30 0v11"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M4 24.5h32"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M13.5 31v-6.2M26.5 31v-6.2M20 31v-6.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

interface WordmarkProps {
  showTagline?: boolean;
  className?: string;
}

export function Wordmark({ showTagline = false, className }: WordmarkProps) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
        <BridgeMark className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[19px] tracking-[-0.01em]">
          Bridgely
        </span>
        {showTagline && (
          <span className="mt-0.5 text-[10px] tracking-[0.08em] uppercase text-muted-foreground">
            Cultural Bridge
          </span>
        )}
      </span>
    </span>
  );
}

interface KickerProps {
  children: React.ReactNode;
  className?: string;
}

export function Kicker({ children, className }: KickerProps) {
  return (
    <span
      className={cn(
        'inline-block text-[11px] font-semibold uppercase tracking-[0.18em] text-accent',
        className,
      )}
    >
      {children}
    </span>
  );
}
