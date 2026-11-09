'use client';

import type { MouseEvent, ReactNode } from 'react';

export const PRESELECT_EVENT = 'rdv:preselect';

interface Props {
  sessionType: string;
  className?: string;
  children: ReactNode;
}

/** Descend jusqu'au calendrier et présélectionne la séance, sans recharger la page. */
export default function ReserveLink({ sessionType, className, children }: Props) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById('booking');
    if (!target || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent(PRESELECT_EVENT, { detail: sessionType }));
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#booking');
  }

  // Sans JavaScript (ou en nouvel onglet), le lien garde la présélection par l'adresse.
  return (
    <a href={`/?seance=${sessionType}#booking`} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
