'use client';

import { type FormEvent, useState } from 'react';

const inputClass = 'w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#BFD8C0]';

interface Props {
  slotStart: string;
  slotLabel: string;
  onDone: () => void;
  onCancel: () => void;
  onUnavailable: () => void;
}

export default function WaitlistForm({ slotStart, slotLabel, onDone, onCancel, onUnavailable }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setError('');
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotStart, name, email, website }),
      });
      if (response.status === 201) return onDone();
      if (response.status === 409) return onUnavailable();
      setError(response.status === 422 ? 'Merci de vérifier votre nom et votre adresse mail.' : 'Inscription impossible pour le moment.');
    } catch {
      setError('Inscription impossible pour le moment.');
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <p className="font-serif text-lg text-[#4A4A4A]">Liste d&apos;attente du {slotLabel}</p>
      <p className="text-sm text-[#6B6B6B]">
        Une demande est en cours sur ce créneau. S&apos;il se libère, vous serez prévenu(e) par mail.
        Il reviendra à la première personne qui en fera la demande.
      </p>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="wl-website">Site web</label>
        <input id="wl-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="wl-name" className="block text-sm font-medium text-[#4A4A4A] mb-1">Nom et prénom *</label>
          <input id="wl-name" autoComplete="name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="wl-email" className="block text-sm font-medium text-[#4A4A4A] mb-1">Adresse mail *</label>
          <input id="wl-email" type="email" autoComplete="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
      {error && <p role="alert" className="text-sm text-[#A1474A]">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={sending} className="btn-secondary disabled:opacity-60">
          {sending ? 'Envoi…' : 'Me prévenir'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 text-[#6B6B6B] hover:underline">Retour</button>
      </div>
    </form>
  );
}
