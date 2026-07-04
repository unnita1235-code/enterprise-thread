import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-10 md:grid-cols-[minmax(0,1fr)_auto] md:px-8">
        <div className="min-w-0">
          <Logo />
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            A portfolio demo of an enterprise context pipeline for LLM question answering. All
            metrics on this page are illustrative demo data.
          </p>
        </div>
        <div className="flex flex-wrap items-start gap-x-8 gap-y-2 font-mono text-[11px] text-muted-foreground md:justify-end">
          <span>build 0.4.2</span>
          <span>region us-east-1</span>
          <span>© Context Synthesizer</span>
        </div>
      </div>
    </footer>
  );
}
