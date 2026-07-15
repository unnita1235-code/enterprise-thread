export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-9 w-9 place-items-center rounded-sm bg-teal">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-teal-foreground" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M4 6h6M4 12h6M4 18h6" />
          <path d="M14 6l6 6-6 6" />
        </svg>
        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-teal ring-2 ring-background signal-pulse" />
      </div>
      <div className="min-w-0 leading-tight">
        <p className="font-display text-sm font-bold uppercase tracking-tight text-foreground">Context</p>
        <p className="font-display text-sm font-bold uppercase tracking-tight text-teal">Synthesizer</p>
      </div>
    </div>
  );
}
