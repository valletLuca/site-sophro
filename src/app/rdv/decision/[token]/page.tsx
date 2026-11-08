import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Panel } from '@/components/rdv/Panel';
import { decideBooking, getBooking } from '@/lib/rdv/bookings';
import { LOCATIONS, type Location, SESSION_TYPES, type SessionType } from '@/lib/rdv/config';
import { getDb } from '@/lib/rdv/db';
import { formatSlotFr } from '@/lib/rdv/time';
import { verifyToken } from '@/lib/rdv/tokens';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Répondre à une demande', robots: { index: false } };

const STATUS_TEXT: Record<string, string> = {
  accepted: 'Cette demande a été acceptée.',
  refused: 'Cette demande a été refusée.',
  expired: 'Cette demande a expiré et le créneau a été libéré.',
  cancelled: 'Cette demande a été annulée.',
};

interface Props {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ mail?: string }>;
}

export default async function DecisionPage({ params, searchParams }: Props) {
  const { token } = await params;
  const { mail } = await searchParams;
  const id = verifyToken('decide', token);
  const booking = id ? await getBooking(await getDb(), id) : null;
  if (!booking) return <Panel title="Lien invalide"><p>Ce lien n&apos;est pas valide.</p></Panel>;

  const isPending = booking.status === 'pending' && booking.expires_at! > new Date();

  if (!isPending) {
    return (
      <Panel title="Demande déjà traitée">
        <p>{STATUS_TEXT[booking.status] ?? STATUS_TEXT.expired}</p>
        {mail === 'echec' && (
          <p className="font-medium">Le mail au client n&apos;a pas pu partir : pensez à le prévenir par téléphone ({booking.phone}).</p>
        )}
      </Panel>
    );
  }

  async function decide(formData: FormData) {
    'use server';
    const bookingId = verifyToken('decide', token);
    if (!bookingId) return;
    const decision = formData.get('decision') === 'accept' ? 'accept' : 'refuse';
    const message = String(formData.get('message') ?? '').slice(0, 1000);
    const result = await decideBooking(await getDb(), bookingId, decision, { message }, new Date());
    redirect(`/rdv/decision/${token}${result.ok && !result.mailed ? '?mail=echec' : ''}`);
  }

  return (
    <Panel title="Répondre à cette demande">
      <dl className="space-y-1">
        <div><dt className="inline font-medium">Date : </dt><dd className="inline">{formatSlotFr(booking.slot_start)}</dd></div>
        <div><dt className="inline font-medium">Séance : </dt><dd className="inline">{SESSION_TYPES[booking.session_type as SessionType]?.label}</dd></div>
        {booking.location && <div><dt className="inline font-medium">Lieu : </dt><dd className="inline">{LOCATIONS[booking.location as Location]}</dd></div>}
        <div><dt className="inline font-medium">Personnes : </dt><dd className="inline">{booking.party_size}</dd></div>
        <div><dt className="inline font-medium">Nom : </dt><dd className="inline">{booking.first_name} {booking.last_name}</dd></div>
        <div><dt className="inline font-medium">Téléphone : </dt><dd className="inline">{booking.phone}</dd></div>
        <div><dt className="inline font-medium">Mail : </dt><dd className="inline">{booking.email}</dd></div>
      </dl>
      <form action={decide} className="space-y-3">
        <button type="submit" name="decision" value="accept" className="btn-primary">Accepter</button>
        <label className="block text-sm">
          Message pour le client, en cas de refus (facultatif)
          <textarea name="message" rows={3} maxLength={1000} className="mt-1 w-full rounded-xl border border-gray-300 p-3" />
        </label>
        <button type="submit" name="decision" value="refuse" className="btn-secondary">Refuser</button>
      </form>
    </Panel>
  );
}
