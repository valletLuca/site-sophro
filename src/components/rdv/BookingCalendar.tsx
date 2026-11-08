'use client';

import { useEffect, useRef, useState } from 'react';
import type { MonthAvailability, PublicSlot, SlotState } from '@/lib/rdv/availability';
import { CONTACT, SESSION_TYPES, type SessionType, isSessionType } from '@/lib/rdv/config';
import { formatDateFr, formatSlotFr, parisToUtc } from '@/lib/rdv/time';
import BookingForm, { type Draft, emptyDraft } from './BookingForm';
import MonthGrid, { STATE_STYLES } from './MonthGrid';
import { PRESELECT_EVENT } from './ReserveLink';
import WaitlistForm from './WaitlistForm';

const LEGEND: SlotState[] = ['free', 'pending', 'reserved', 'unavailable'];

function monthTitle(month: string) {
  const title = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${month}-15T12:00:00Z`));
  return title[0].toUpperCase() + title.slice(1);
}

function presetSessionType(): SessionType | '' {
  if (typeof window === 'undefined') return '';
  const value = new URLSearchParams(window.location.search).get('seance');
  return isSessionType(value) ? value : '';
}

type Finished = 'sent' | 'waitlisted' | null;

export default function BookingCalendar() {
  const [month, setMonth] = useState<string | null>(null);
  const [data, setData] = useState<MonthAvailability | null>(null);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<PublicSlot | null>(null);
  const [notice, setNotice] = useState('');
  const [finished, setFinished] = useState<Finished>(null);
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(presetSessionType()));
  const dayPanel = useRef<HTMLDivElement>(null);
  const formPanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let current = true;
    fetch(`/api/availability${month ? `?month=${month}` : ''}`)
      .then((response) => {
        if (!response.ok) throw new Error('indisponible');
        return response.json();
      })
      .then((next: MonthAvailability) => {
        if (current) {
          setData(next);
          setFailed(false);
        }
      })
      .catch(() => {
        if (current) setFailed(true);
      });
    return () => {
      current = false;
    };
  }, [month, reloadKey]);

  useEffect(() => {
    function preselect(event: Event) {
      const value = (event as CustomEvent<unknown>).detail;
      if (!isSessionType(value)) return;
      setDraft((current) => ({
        ...current,
        sessionType: value,
        location: SESSION_TYPES[value].needsLocation ? current.location : '',
      }));
    }
    window.addEventListener(PRESELECT_EVENT, preselect);
    return () => window.removeEventListener(PRESELECT_EVENT, preselect);
  }, []);

  const reload = () => setReloadKey((key) => key + 1);

  function selectDay(date: string) {
    setSelectedDate(date);
    setSlot(null);
    setNotice('');
    setTimeout(() => dayPanel.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 0);
  }

  function selectSlot(next: PublicSlot) {
    setSlot(next);
    setNotice('');
    setTimeout(() => formPanel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  }

  function changeMonth(next: string) {
    setMonth(next);
    setSelectedDate(null);
    setSlot(null);
    setNotice('');
  }

  function restart() {
    setFinished(null);
    setSlot(null);
    setSelectedDate(null);
    reload();
  }

  function slotGone() {
    setSlot(null);
    setNotice('Ce créneau vient d\'être pris. Vos informations sont conservées : choisissez-en un autre.');
    reload();
  }

  const day = data?.days.find((d) => d.date === selectedDate);
  const open = data?.openMonths ?? [];
  const index = data ? open.indexOf(data.month) : -1;
  const slotLabel = slot ? formatSlotFr(new Date(slot.start)) : '';

  if (failed && !data) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 text-center text-[#6B6B6B]">
        Le calendrier est momentanément indisponible. Pour prendre rendez-vous, appelez le{' '}
        <a href={`tel:${CONTACT.phoneHref}`} className="font-medium text-[#4A4A4A] underline">{CONTACT.phoneDisplay}</a>.
      </div>
    );
  }

  if (finished) {
    return (
      <div role="status" className="bg-white rounded-2xl shadow-md p-6 md:p-10 text-center">
        <h3 className="text-xl font-serif text-[#4A4A4A] mb-3">
          {finished === 'sent' ? 'Votre demande est envoyée' : 'Vous êtes sur la liste d\'attente'}
        </h3>
        <p className="text-[#6B6B6B] max-w-xl mx-auto mb-6">
          {finished === 'sent'
            ? 'Votre rendez-vous n\'est pas encore confirmé. Vous recevrez un mail de réponse sous 72 heures au plus tard.'
            : 'Vous recevrez un mail si ce créneau se libère.'}
        </p>
        <button type="button" onClick={restart} className="btn-primary">Retour au calendrier</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          disabled={index <= 0}
          onClick={() => changeMonth(open[index - 1])}
          aria-label="Mois précédent"
          className="w-11 h-11 rounded-full text-xl text-[#4A4A4A] hover:bg-[#F6F1EB] disabled:opacity-30 disabled:cursor-default"
        >
          ‹
        </button>
        <h3 className="text-xl font-serif text-[#4A4A4A]">{data ? monthTitle(data.month) : 'Chargement…'}</h3>
        <button
          type="button"
          disabled={index < 0 || index >= open.length - 1}
          onClick={() => changeMonth(open[index + 1])}
          aria-label="Mois suivant"
          className="w-11 h-11 rounded-full text-xl text-[#4A4A4A] hover:bg-[#F6F1EB] disabled:opacity-30 disabled:cursor-default"
        >
          ›
        </button>
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-1 mb-4 text-sm text-[#6B6B6B]">
        {LEGEND.map((state) => (
          <li key={state} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${STATE_STYLES[state].dot}`} aria-hidden="true" />
            {STATE_STYLES[state].label}
          </li>
        ))}
      </ul>

      {data ? (
        <MonthGrid days={data.days} selectedDate={selectedDate} onSelect={selectDay} />
      ) : (
        <div className="h-80 rounded-xl bg-gray-50 animate-pulse" />
      )}

      <p className="mt-3 text-sm text-[#6B6B6B]">
        Chaque rendez-vous occupe un créneau d&apos;1h. Réservation au plus tard 24h à l&apos;avance. Le mois suivant s&apos;ouvre le 15.
      </p>

      {notice && <p role="alert" className="mt-4 rounded-xl bg-[#E8C7C8]/40 p-3 text-[#4A4A4A]">{notice}</p>}

      {day && (
        <div ref={dayPanel} className="mt-6 border-t border-gray-200 pt-6">
          <p className="font-serif text-lg text-[#4A4A4A] mb-3">
            {formatDateFr(parisToUtc(day.date, '12:00'))}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {day.slots.map((s) => {
              const clickable = s.state === 'free' || s.state === 'pending';
              return (
                <button
                  key={s.start}
                  type="button"
                  disabled={!clickable}
                  onClick={() => selectSlot(s)}
                  aria-pressed={slot?.start === s.start}
                  className={`rounded-xl px-3 py-2 text-center ${STATE_STYLES[s.state].chip} ${
                    slot?.start === s.start ? 'ring-2 ring-[#4A4A4A]' : ''
                  } ${clickable ? 'cursor-pointer hover:brightness-95' : 'cursor-not-allowed'}`}
                >
                  <span className="block font-medium">{s.label}</span>
                  <span className="block text-xs no-underline">
                    {s.state === 'pending' ? 'En attente : me prévenir' : STATE_STYLES[s.state].label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {slot && (
        <div ref={formPanel} className="relative mt-6 border-t border-gray-200 pt-6 scroll-mt-24">
          {slot.state === 'free' ? (
            <BookingForm
              key={slot.start}
              slotStart={slot.start}
              slotLabel={slotLabel}
              draft={draft}
              onChange={setDraft}
              onSent={() => {
                setDraft(emptyDraft(''));
                setFinished('sent');
              }}
              onTaken={slotGone}
              onCancel={() => setSlot(null)}
            />
          ) : (
            <WaitlistForm
              key={slot.start}
              slotStart={slot.start}
              slotLabel={slotLabel}
              onDone={() => setFinished('waitlisted')}
              onCancel={() => setSlot(null)}
              onUnavailable={() => {
                setSlot(null);
                setNotice('Ce créneau a changé d\'état. Le calendrier est à jour.');
                reload();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
