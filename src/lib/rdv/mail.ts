import { CANCEL_NOTICE_HOURS, CONTACT, LOCATIONS, type Location, SESSION_TYPES, type SessionType } from './config';
import { formatSlotFr } from './time';
import { signToken } from './tokens';

export interface Mail {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export type MailTransport = (mail: Mail) => Promise<void>;

/** Champs d'une demande utiles aux mails. Le motif n'en fait jamais partie. */
export interface MailBooking {
  id: string;
  slot_start: Date;
  session_type: string;
  location: string | null;
  party_size: number;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
}

type Line = string | { href: string; label: string };

const siteUrl = () => (process.env.SITE_URL ?? 'https://vallet-christine-sophrologue.fr').replace(/\/$/, '');
const calendarUrl = () => `${siteUrl()}/#booking`;
const cancelUrl = (id: string) => `${siteUrl()}/rdv/annuler/${signToken('cancel', id)}`;
const decideUrl = (id: string) => `${siteUrl()}/rdv/decision/${signToken('decide', id)}`;
const notifyAddress = () => process.env.NOTIFY_EMAIL ?? CONTACT.email;

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function build(to: string, subject: string, lines: Line[]): Mail {
  const text = lines.map((l) => (typeof l === 'string' ? l : `${l.label} : ${l.href}`)).join('\n\n');
  const body = lines.map((l) => (typeof l === 'string'
    ? `<p style="margin:0 0 16px;white-space:pre-line">${escapeHtml(l)}</p>`
    : `<p style="margin:24px 0"><a href="${escapeHtml(l.href)}" style="background:#BFD8C0;color:#4A4A4A;padding:12px 24px;border-radius:30px;text-decoration:none">${escapeHtml(l.label)}</a></p>`)).join('');
  const html = `<div style="font-family:'Segoe UI',Arial,sans-serif;color:#4A4A4A;font-size:16px;line-height:1.6;max-width:560px">${body}</div>`;
  return { to, subject, text, html };
}

const sessionLabel = (b: MailBooking) => SESSION_TYPES[b.session_type as SessionType]?.label ?? b.session_type;
const signature = `${CONTACT.name}, sophrologue\n${CONTACT.phoneDisplay}\n${CONTACT.address}`;

function summary(b: MailBooking): string {
  const lines = [`Date : ${formatSlotFr(b.slot_start)}`, `Séance : ${sessionLabel(b)}`];
  if (b.location) lines.push(`Lieu : ${LOCATIONS[b.location as Location]}`);
  if (b.party_size > 1) lines.push(`Nombre de personnes : ${b.party_size}`);
  return lines.join('\n');
}

export const mails = {
  requestToClient: (b: MailBooking) => build(b.email!, 'Votre demande de rendez-vous est bien reçue', [
    `Bonjour ${b.first_name},`,
    `Votre demande est bien enregistrée et reste en attente de validation. Vous recevrez un mail dès que j'y aurai répondu, sous 72 heures au plus tard.`,
    summary(b),
    `Ce rendez-vous n'est pas encore confirmé.`,
    { href: cancelUrl(b.id), label: 'Annuler ma demande' },
    signature,
  ]),

  requestToSophro: (b: MailBooking, reason: string, duplicates: number) => build(
    notifyAddress(),
    `Nouvelle demande : ${b.first_name} ${b.last_name}, ${formatSlotFr(b.slot_start)}`,
    [
      ...(duplicates >= 2 ? [`Attention : cette personne a ${duplicates} demandes ou rendez-vous dans cette même semaine.`] : []),
      summary(b),
      `Nom : ${b.first_name} ${b.last_name}\nTéléphone : ${b.phone}\nMail : ${b.email}`,
      `Motif :\n${reason}`,
      `Ce motif n'est conservé nulle part ailleurs que dans ce mail.`,
      { href: decideUrl(b.id), label: 'Accepter ou refuser' },
      `Sans réponse sous 72 heures, ou avant le début du créneau, la demande expirera et le créneau sera libéré.`,
    ],
  ),

  accepted: (b: MailBooking) => build(b.email!, `Rendez-vous confirmé : ${formatSlotFr(b.slot_start)}`, [
    `Bonjour ${b.first_name},`,
    `Votre rendez-vous est confirmé.`,
    summary(b),
    b.location === 'visio'
      ? 'Je vous enverrai le lien de la séance en visio avant le rendez-vous.'
      : b.session_type === 'groupe_structure'
        ? 'Je vous recontacte pour préciser le lieu et les modalités.'
        : `Adresse : ${CONTACT.address}`,
    `Vous pouvez annuler sans frais jusqu'à ${CANCEL_NOTICE_HOURS}h avant la séance. Au-delà, la séance sera due.`,
    { href: cancelUrl(b.id), label: 'Annuler mon rendez-vous' },
    signature,
  ]),

  refused: (b: MailBooking, message?: string) => build(b.email!, 'Votre demande de rendez-vous', [
    `Bonjour ${b.first_name},`,
    `Je ne peux malheureusement pas vous recevoir le ${formatSlotFr(b.slot_start)}.`,
    ...(message ? [message] : []),
    `Vous pouvez choisir un autre créneau, ou m'appeler au ${CONTACT.phoneDisplay}.`,
    { href: calendarUrl(), label: 'Voir les disponibilités' },
    signature,
  ]),

  expired: (b: MailBooking) => build(b.email!, 'Votre demande de rendez-vous a expiré', [
    `Bonjour ${b.first_name},`,
    `Je n'ai pas pu répondre à temps à votre demande du ${formatSlotFr(b.slot_start)}, et je vous prie de m'en excuser.`,
    `N'hésitez pas à m'appeler au ${CONTACT.phoneDisplay} ou à refaire une demande.`,
    { href: calendarUrl(), label: 'Voir les disponibilités' },
    signature,
  ]),

  reminderToSophro: (b: MailBooking) => build(
    notifyAddress(),
    `À traiter : demande de ${b.first_name} ${b.last_name}`,
    [
      `Cette demande expire dans moins de 24 heures.`,
      summary(b),
      { href: decideUrl(b.id), label: 'Accepter ou refuser' },
    ],
  ),

  cancelledByClient: (b: MailBooking) => build(
    notifyAddress(),
    `Annulation : ${b.first_name} ${b.last_name}, ${formatSlotFr(b.slot_start)}`,
    [`${b.first_name} ${b.last_name} a annulé. Le créneau est de nouveau libre.`, summary(b)],
  ),

  cancelledByAdmin: (b: MailBooking) => build(b.email!, 'Votre rendez-vous est annulé', [
    `Bonjour ${b.first_name},`,
    `Je dois malheureusement annuler notre rendez-vous du ${formatSlotFr(b.slot_start)}, et je vous prie de m'en excuser.`,
    { href: calendarUrl(), label: 'Choisir un autre créneau' },
    signature,
  ]),

  waitlistFreed: (entry: { name: string; email: string }, slot: Date) => build(entry.email, 'Un créneau vient de se libérer', [
    `Bonjour ${entry.name},`,
    `Le créneau du ${formatSlotFr(slot)} est de nouveau disponible. Il sera attribué à la première demande reçue.`,
    { href: calendarUrl(), label: 'Faire une demande' },
    signature,
  ]),

  waitlistTaken: (entry: { name: string; email: string }, slot: Date) => build(entry.email, 'Créneau indisponible', [
    `Bonjour ${entry.name},`,
    `Le créneau du ${formatSlotFr(slot)} n'est plus disponible.`,
    { href: calendarUrl(), label: 'Voir les autres créneaux' },
    signature,
  ]),
};

const resendTransport: MailTransport = async (mail) => {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === 'production') throw new Error('RESEND_API_KEY manquante');
    console.info(`[mail non envoyé en local] ${mail.to} : ${mail.subject}`);
    return;
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM ?? 'Christine Vallet - Sophrologue <rendez-vous@vallet-christine-sophrologue.fr>',
      to: [mail.to],
      reply_to: CONTACT.email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  // Le corps de la réponse n'est pas journalisé : il pourrait reprendre le contenu du mail.
  if (!response.ok) throw new Error(`Resend a répondu ${response.status}`);
};

let transport: MailTransport = resendTransport;

export function setMailTransport(next: MailTransport): void {
  transport = next;
}

export const sendMail = (mail: Mail): Promise<void> => transport(mail);

/** Envoi dont l'échec ne doit pas interrompre l'opération. */
export async function trySendMail(mail: Mail): Promise<boolean> {
  try {
    await sendMail(mail);
    return true;
  } catch (error) {
    console.error('Envoi de mail échoué :', error instanceof Error ? error.message : 'erreur inconnue');
    return false;
  }
}
