import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { type AdminBooking, listBlocks, listPending, listUpcoming } from '@/lib/rdv/admin';
import { isAdmin } from '@/lib/rdv/auth';
import {
  DUPLICATE_ALERT_THRESHOLD, LOCATIONS, type Location, SESSION_TYPES, type SessionType, WEEKLY_GRID,
} from '@/lib/rdv/config';
import { getDb } from '@/lib/rdv/db';
import { formatSlotFr } from '@/lib/rdv/time';
import { addBlock, addPhone, cancel, decide, removeBlock, signOut } from './actions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Rendez-vous', robots: { index: false } };

const MESSAGES: Record<string, string> = {
  enregistre: 'C\'est enregistré.',
  deja_traitee: 'Cette demande avait déjà été traitée ou a expiré.',
  mail_echec: 'C\'est enregistré, mais le mail n\'a pas pu partir : prévenez la personne par téléphone.',
  blocage_invalide: 'Les dates du blocage sont invalides.',
  blocage_conflit: 'Ce blocage recouvre une demande ou un rendez-vous : traitez-les d\'abord.',
  saisie_invalide: 'Merci d\'indiquer la date, l\'heure et le nom.',
  creneau_pris: 'Ce créneau est déjà pris ou bloqué.',
  hors_grille: 'Cette heure ne correspond pas à un créneau de ce jour.',
};

const TIMES = [...new Set(Object.values(WEEKLY_GRID).flat())].sort();
const inputClass = 'rounded-xl border border-gray-300 p-2 bg-white';
const sectionClass = 'bg-white rounded-2xl shadow-md p-5 md:p-6';

function details(b: AdminBooking) {
  return [
    SESSION_TYPES[b.session_type as SessionType]?.label,
    b.location ? LOCATIONS[b.location as Location] : null,
    b.party_size > 1 ? `${b.party_size} personnes` : null,
    b.source === 'phone' ? 'Pris par téléphone' : null,
  ].filter(Boolean).join(' · ');
}

function remaining(expiresAt: Date, now: Date) {
  const hours = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 3600_000));
  return `expire dans ${hours} h`;
}

function Person({ b }: { b: AdminBooking }) {
  return (
    <>
      <p className="font-medium">{formatSlotFr(b.slot_start)}</p>
      <p>{[b.first_name, b.last_name].filter(Boolean).join(' ')}{b.phone ? ` · ${b.phone}` : ''}{b.email ? ` · ${b.email}` : ''}</p>
      <p className="text-sm text-[#6B6B6B]">{details(b)}</p>
      {b.duplicates >= DUPLICATE_ALERT_THRESHOLD && (
        <p className="text-sm font-medium text-[#A1474A]">Attention : {b.duplicates} demandes ou RDV cette semaine pour cette personne.</p>
      )}
    </>
  );
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  if (!(await isAdmin())) redirect('/admin/connexion');
  const { message } = await searchParams;
  const db = await getDb();
  const now = new Date();
  const [pending, upcoming, blocks] = await Promise.all([listPending(db, now), listUpcoming(db, now), listBlocks(db, now)]);

  return (
    <main className="min-h-screen bg-[#F6F1EB] p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-serif">Rendez-vous</h1>
          <form action={signOut}><button type="submit" className="text-sm text-[#6B6B6B] underline">Se déconnecter</button></form>
        </header>

        {message && MESSAGES[message] && <p role="status" className="rounded-xl bg-[#BFD8C0]/40 p-3">{MESSAGES[message]}</p>}

        <section className={sectionClass}>
          <h2 className="text-xl font-serif mb-1">Demandes en attente ({pending.length})</h2>
          <p className="text-sm text-[#6B6B6B] mb-4">Le motif de chaque demande se trouve uniquement dans le mail reçu.</p>
          <ul className="space-y-5">
            {pending.map((b) => (
              <li key={b.id} className="border-t border-gray-100 pt-4 space-y-1">
                <Person b={b} />
                <p className="text-sm text-[#6B6B6B]">{remaining(b.expires_at!, now)}</p>
                <form action={decide} className="space-y-2 pt-2">
                  <input type="hidden" name="id" value={b.id} />
                  <button type="submit" name="decision" value="accept" className="btn-primary">Accepter</button>
                  <details>
                    <summary className="cursor-pointer text-sm text-[#6B6B6B]">Refuser…</summary>
                    <textarea name="message" rows={2} maxLength={1000} placeholder="Message pour le client (facultatif)" className={`${inputClass} w-full mt-2`} />
                    <button type="submit" name="decision" value="refuse" className="btn-secondary mt-2">Confirmer le refus</button>
                  </details>
                </form>
              </li>
            ))}
            {pending.length === 0 && <li className="text-[#6B6B6B]">Aucune demande en attente.</li>}
          </ul>
        </section>

        <section className={sectionClass}>
          <h2 className="text-xl font-serif mb-4">Rendez-vous à venir ({upcoming.length})</h2>
          <ul className="space-y-4">
            {upcoming.map((b) => (
              <li key={b.id} className="border-t border-gray-100 pt-3 space-y-1">
                <Person b={b} />
                <details>
                  <summary className="cursor-pointer text-sm text-[#6B6B6B]">Annuler…</summary>
                  <form action={cancel} className="mt-2">
                    <input type="hidden" name="id" value={b.id} />
                    <button type="submit" className="btn-secondary">Confirmer l&apos;annulation</button>
                  </form>
                </details>
              </li>
            ))}
            {upcoming.length === 0 && <li className="text-[#6B6B6B]">Aucun rendez-vous à venir.</li>}
          </ul>
        </section>

        <section className={sectionClass}>
          <h2 className="text-xl font-serif mb-4">Saisir un RDV pris par téléphone</h2>
          <form action={addPhone} className="grid sm:grid-cols-2 gap-3">
            <label className="text-sm">Date<input type="date" name="date" required className={`${inputClass} w-full`} /></label>
            <label className="text-sm">Heure
              <select name="time" required className={`${inputClass} w-full`}>
                {TIMES.map((t) => <option key={t} value={t}>{t.replace(':', 'h')}</option>)}
              </select>
            </label>
            <label className="text-sm">Nom<input name="name" required maxLength={160} className={`${inputClass} w-full`} /></label>
            <label className="text-sm">Téléphone (facultatif)<input name="phone" maxLength={30} className={`${inputClass} w-full`} /></label>
            <button type="submit" className="btn-primary sm:col-span-2">Ajouter</button>
          </form>
        </section>

        <section className={sectionClass}>
          <h2 className="text-xl font-serif mb-1">Bloquer des créneaux</h2>
          <p className="text-sm text-[#6B6B6B] mb-4">Pour un seul créneau, choisissez son heure. Sinon, les journées entières sont bloquées.</p>
          <form action={addBlock} className="grid sm:grid-cols-2 gap-3">
            <label className="text-sm">Du<input type="date" name="from" required className={`${inputClass} w-full`} /></label>
            <label className="text-sm">Au (facultatif)<input type="date" name="to" className={`${inputClass} w-full`} /></label>
            <label className="text-sm">Créneau
              <select name="time" className={`${inputClass} w-full`}>
                <option value="">Journée entière</option>
                {TIMES.map((t) => <option key={t} value={t}>{t.replace(':', 'h')}</option>)}
              </select>
            </label>
            <label className="text-sm">Note (non visible du public)<input name="label" maxLength={120} className={`${inputClass} w-full`} /></label>
            <button type="submit" className="btn-primary sm:col-span-2">Bloquer</button>
          </form>
          {blocks.length > 0 && (
            <ul className="mt-5 space-y-2">
              {blocks.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 border-t border-gray-100 pt-2 text-sm">
                  <span>Du {formatSlotFr(b.start_at)} au {formatSlotFr(b.end_at)}{b.label ? ` · ${b.label}` : ''}</span>
                  <form action={removeBlock}>
                    <input type="hidden" name="id" value={b.id} />
                    <button type="submit" className="text-[#6B6B6B] underline">Retirer</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
