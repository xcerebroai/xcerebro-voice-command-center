export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl rounded-2xl border border-line bg-panel p-8 sm:p-12">
        <div className="grid h-12 w-12 place-items-center rounded-xl border border-accent/30 bg-accent/10">
          <span className="font-mono text-xl font-bold text-accent">X</span>
        </div>
        <p className="mt-8 font-mono text-xs tracking-[0.3em] text-accent">XCEREBRO</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Your business, connected.</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted">
          Explore Xcerebro and access your client experience in one place.
        </p>
        <a href="https://www.xcerebro.ai" className="mt-8 inline-flex items-center gap-3 rounded-lg border border-accent/40 bg-accent/10 px-5 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent/20">
          Open Xcerebro <span aria-hidden="true">↗</span>
        </a>
      </div>
    </main>
  );
}
