'use client';

import { type FormEvent, useState } from 'react';
import {
  CONTACT, LOCATIONS, type Location, REASON_MAX_LENGTH, SESSION_TYPES, SESSION_TYPE_KEYS,
  type SessionType,
} from '@/lib/rdv/config';

export interface Draft {
  sessionType: SessionType | '';
  location: Location | '';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  reason: string;
  consent: boolean;
  website: string;
}

export const emptyDraft = (sessionType: SessionType | ''): Draft => ({
  sessionType,
  location: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  reason: '',
  consent: false,
  website: '',
});

const inputClass = 'w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#BFD8C0] disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed';

function Field({ label, error, htmlFor, children }: { label: string; error?: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-[#4A4A4A] mb-1">{label}</label>
      {children}
      {error && <p role="alert" className="mt-1 text-sm text-[#A1474A]">{error}</p>}
    </div>
  );
}

interface Props {
  slotStart: string;
  slotLabel: string;
  draft: Draft;
  onChange: (draft: Draft) => void;
  onSent: () => void;
  onTaken: () => void;
  onCancel: () => void;
}

export default function BookingForm({ slotStart, slotLabel, draft, onChange, onSent, onTaken, onCancel }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState('');
  const [sending, setSending] = useState(false);

  const type = draft.sessionType ? SESSION_TYPES[draft.sessionType] : null;
  const needsLocation = type?.needsLocation ?? false;
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => onChange({ ...draft, [key]: value });

  function changeType(value: string) {
    const sessionType = value as SessionType | '';
    onChange({
      ...draft,
      sessionType,
      location: sessionType && SESSION_TYPES[sessionType].needsLocation ? draft.location : '',
    });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setFailure('');
    setErrors({});
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...draft, slotStart }),
      });
      if (response.status === 201) return onSent();
      const { error, fields } = await response.json().catch(() => ({ error: 'unknown' }));
      if (response.status === 409) return onTaken();
      if (response.status === 422) return setErrors(fields ?? {});
      setFailure(error === 'rate_limited'
        ? `Trop de demandes depuis cette connexion. Merci de réessayer plus tard ou d'appeler le ${CONTACT.phoneDisplay}.`
        : `Votre demande n'a pas pu être envoyée. Merci d'appeler le ${CONTACT.phoneDisplay}.`);
    } catch {
      setFailure(`Votre demande n'a pas pu être envoyée. Merci d'appeler le ${CONTACT.phoneDisplay}.`);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <p className="font-serif text-lg text-[#4A4A4A]">Votre demande pour le {slotLabel}</p>

      {/* Champ piège : invisible pour une personne, rempli par les robots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="rdv-website">Site web</label>
        <input id="rdv-website" tabIndex={-1} autoComplete="off" value={draft.website} onChange={(e) => set('website', e.target.value)} />
      </div>

      <div className="sm:max-w-sm">
        <Field label="Type de séance *" htmlFor="rdv-type" error={errors.sessionType}>
          <select id="rdv-type" required className={inputClass} value={draft.sessionType} onChange={(e) => changeType(e.target.value)}>
            <option value="">Choisissez une séance</option>
            {SESSION_TYPE_KEYS.map((key) => <option key={key} value={key}>{SESSION_TYPES[key].label}</option>)}
          </select>
        </Field>
      </div>

      {type && !type.online && (
        <div role="status" className="rounded-xl bg-[#BFD8C0]/30 p-4 text-[#4A4A4A]">
          <p>Veuillez privilégier la prise de rendez-vous par téléphone pour les groupes.</p>
          <a href={`tel:${CONTACT.phoneHref}`} className="mt-2 inline-block font-medium underline">
            Appeler le {CONTACT.phoneDisplay}
          </a>
        </div>
      )}

      {type?.online && (
        <>
        {needsLocation && (
          <fieldset>
            <legend className="block text-sm font-medium text-[#4A4A4A] mb-1">Lieu de la séance *</legend>
            <div className="flex gap-6">
              {(Object.keys(LOCATIONS) as Location[]).map((key) => (
                <label key={key} className="flex items-center gap-2 text-[#4A4A4A]">
                  <input type="radio" name="rdv-location" checked={draft.location === key} onChange={() => set('location', key)} />
                  {LOCATIONS[key]}
                </label>
              ))}
            </div>
            {errors.location && <p role="alert" className="mt-1 text-sm text-[#A1474A]">{errors.location}</p>}
          </fieldset>
        )}

        {draft.sessionType === 'enfant_ado' && (
          <p className="text-sm text-[#6B6B6B]">Merci d&apos;indiquer les coordonnées du parent ou du responsable légal.</p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Prénom *" htmlFor="rdv-first" error={errors.firstName}>
            <input id="rdv-first" autoComplete="given-name" className={inputClass} value={draft.firstName} onChange={(e) => set('firstName', e.target.value)} />
          </Field>
          <Field label="Nom *" htmlFor="rdv-last" error={errors.lastName}>
            <input id="rdv-last" autoComplete="family-name" className={inputClass} value={draft.lastName} onChange={(e) => set('lastName', e.target.value)} />
          </Field>
          <Field label="Téléphone *" htmlFor="rdv-phone" error={errors.phone}>
            <input id="rdv-phone" type="tel" autoComplete="tel" className={inputClass} value={draft.phone} onChange={(e) => set('phone', e.target.value)} />
          </Field>
          <Field label="Adresse mail *" htmlFor="rdv-email" error={errors.email}>
            <input id="rdv-email" type="email" autoComplete="email" className={inputClass} value={draft.email} onChange={(e) => set('email', e.target.value)} />
          </Field>
        </div>

        <Field label="Ce qui vous amène *" htmlFor="rdv-reason" error={errors.reason}>
          <textarea id="rdv-reason" rows={4} maxLength={REASON_MAX_LENGTH} className={inputClass} value={draft.reason} onChange={(e) => set('reason', e.target.value)} />
        </Field>

        <div>
          <label className="flex items-start gap-3 text-sm text-[#6B6B6B]">
            <input type="checkbox" className="mt-1" checked={draft.consent} onChange={(e) => set('consent', e.target.checked)} />
            <span>
              J&apos;accepte que ces informations soient transmises à Christine Vallet pour traiter ma demande.
              Le motif n&apos;est pas conservé sur le site : il lui est uniquement envoyé par mail.{' '}
              <a href="/confidentialite" target="_blank" className="underline">En savoir plus</a>
            </span>
          </label>
          {errors.consent && <p role="alert" className="mt-1 text-sm text-[#A1474A]">{errors.consent}</p>}
        </div>

        {failure && <p role="alert" className="rounded-xl bg-[#E8C7C8]/40 p-3 text-[#4A4A4A]">{failure}</p>}

        </>
      )}

      <div className="flex flex-wrap gap-3">
        {type?.online && (
          <button type="submit" disabled={sending} className="btn-primary disabled:opacity-60">
            {sending ? 'Envoi…' : 'Envoyer ma demande'}
          </button>
        )}
        <button type="button" onClick={onCancel} className="px-4 text-[#6B6B6B] hover:underline">Choisir un autre créneau</button>
      </div>
    </form>
  );
}
