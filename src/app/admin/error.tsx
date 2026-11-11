'use client';

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-[#F6F1EB] p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-5 md:p-6 space-y-4">
        <h1 className="text-2xl font-serif">Une erreur est survenue</h1>
        <p>L&apos;action n&apos;a peut-être pas été enregistrée. Rechargez la page pour vérifier avant de recommencer.</p>
        <div className="flex gap-3 flex-wrap">
          <button type="button" onClick={() => window.location.assign('/admin')} className="btn-primary">Recharger</button>
          <button type="button" onClick={reset} className="btn-secondary">Réessayer</button>
        </div>
      </div>
    </main>
  );
}
