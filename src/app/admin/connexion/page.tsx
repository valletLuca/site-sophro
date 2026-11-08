import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Panel } from '@/components/rdv/Panel';
import { login } from '@/lib/rdv/auth';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Connexion', robots: { index: false } };

const ERRORS: Record<string, string> = {
  wrong: 'Mot de passe incorrect.',
  limited: 'Trop de tentatives. Réessayez dans 15 minutes.',
};

async function submit(formData: FormData) {
  'use server';
  const result = await login(String(formData.get('password') ?? ''));
  redirect(result === 'ok' ? '/admin' : `/admin/connexion?erreur=${result}`);
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const { erreur } = await searchParams;
  return (
    <Panel title="Espace rendez-vous">
      <form action={submit} className="space-y-3">
        <label className="block text-sm">
          Mot de passe
          <input name="password" type="password" required autoComplete="current-password" className="mt-1 w-full rounded-xl border border-gray-300 p-3" />
        </label>
        {erreur && ERRORS[erreur] && <p role="alert" className="text-sm text-[#A1474A]">{ERRORS[erreur]}</p>}
        <button type="submit" className="btn-primary">Se connecter</button>
      </form>
    </Panel>
  );
}
