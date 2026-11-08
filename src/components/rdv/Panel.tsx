import Link from 'next/link';

/** Mise en page commune aux pages ouvertes depuis un mail. */
export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F6F1EB] p-4">
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-10 max-w-xl w-full">
        <h1 className="text-2xl font-serif mb-4">{title}</h1>
        <div className="space-y-4 text-[#4A4A4A]">{children}</div>
        <Link href="/" className="block mt-6 text-sm text-[#6B6B6B] underline">Retour au site</Link>
      </div>
    </main>
  );
}
