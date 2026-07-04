export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="text-foreground"
      >
        <rect
          x="1.5"
          y="1.5"
          width="21"
          height="21"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="7" cy="7" r="1.6" fill="currentColor" />
        <circle cx="17" cy="7" r="1.6" fill="var(--teal)" />
        <circle cx="7" cy="17" r="1.6" fill="var(--teal)" />
        <circle cx="17" cy="17" r="1.6" fill="currentColor" />
        <path
          d="M7 7 L17 17 M17 7 L7 17"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.35"
        />
        <path d="M7 7 L17 7" stroke="var(--teal)" strokeWidth="1.4" />
      </svg>
      <span className="font-semibold tracking-tight">Context Synthesizer</span>
    </span>
  );
}
