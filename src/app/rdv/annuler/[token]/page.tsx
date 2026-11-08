import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Panel } from '@/components/rdv/Panel';
import { type BookingRow, cancelBooking, getBooking } from '@/lib/rdv/bookings';
import { CANCEL_NOTICE_HOURS, CONTACT, SESSION_TYPES, type SessionType } from '@/lib/rdv/config';
import { getDb } from '@/lib/rdv/db';
import { formatSlotFr } from '@/lib/rdv/time';
import { verifyToken } from '@/lib/rdv/tokens';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Annuler un rendez-vous', robots: { index: false } };

type Params = Promise<{ token: string }>;

async function load(token: string): Promise<BookingRow | null> {
  const id = verifyToken('cancel', token);
  return id ? getBooking(await getDb(), id) : null;
}

export default async function CancelPage({ params }: { params: Params }) {
  const { token } = await params;
  const booking = await load(token);
  const now = new Date();

  if (!booking) return <Panel title="Lien invalide"><p>Ce lien d&apos;annulation n&apos;est pas valide.</p></Panel>;

  const active = booking.status === 'accepted' || (booking.status === 'pending' && booking.expires_at! > now);
  if (!active) {
    return (
      <Panel title="Rendez-vous non actif">
        <p>{booking.status === 'cancelled' ? 'Ce rendez-vous est annulé.' : 'Cette demande n\'est plus active.'}</p>
      </Panel>
    );
  }

  const when = formatSlotFr(booking.slot_start);
  const latest = booking.slot_start.getTime() - CANCEL_NOTICE_HOURS * 3600_000;
  if (now.getTime() > latest) {
    return (
      <Panel title="Annulation en ligne impossible">
        <p>Votre rendez-vous du {when} a lieu dans moins de {CANCEL_NOTICE_HOURS} heures, et la séance est due.</p>
        <p>Pour en parler, appelez le <a className="underline" href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phoneDisplay}</a>.</p>
      </Panel>
    );
  }

  async function confirm() {
    'use server';
    const id = verifyToken('cancel', token);
    if (id) await cancelBooking(await getDb(), id, 'client', new Date());
    redirect(`/rdv/annuler/${token}`);
  }

  return (
    <Panel title="Annuler ce rendez-vous ?">
      <p>{SESSION_TYPES[booking.session_type as SessionType]?.label}, le {when}.</p>
      <form action={confirm}>
        <button type="submit" className="btn-secondary">Confirmer l&apos;annulation</button>
      </form>
    </Panel>
  );
}
