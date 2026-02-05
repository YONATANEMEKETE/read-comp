export default function OfflinePage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-warm-bg dark:bg-background-dark px-6 py-16">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 size-16 rounded-full bg-white/70 dark:bg-stone-900/70 border border-sepia-divider/60 flex items-center justify-center text-2xl font-bold">
          N
        </div>
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-white mb-2">
          You&apos;re offline
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          The app is still available in offline mode, but this page hasn&apos;t
          been cached yet. Reconnect to continue.
        </p>
      </div>
    </main>
  );
}
