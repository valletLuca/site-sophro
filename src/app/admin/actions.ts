'use server';

import { redirect } from 'next/navigation';
import { addPhoneBooking, blockRanges, createBlocks, deleteBlock } from '@/lib/rdv/admin';
import { isAdmin, logout } from '@/lib/rdv/auth';
import { cancelBooking, decideBooking } from '@/lib/rdv/bookings';
import { getDb } from '@/lib/rdv/db';
import { parisToUtc } from '@/lib/rdv/time';

async function guard() {
  if (!(await isAdmin())) redirect('/admin/connexion');
  return getDb();
}

const done = (message: string) => redirect(`/admin?message=${message}`);
const text = (data: FormData, key: string) => String(data.get(key) ?? '').trim();
const isDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const isTime = (value: string) => /^\d{2}:\d{2}$/.test(value);

export async function decide(data: FormData) {
  const db = await guard();
  const decision = text(data, 'decision') === 'accept' ? 'accept' : 'refuse';
  const result = await decideBooking(db, text(data, 'id'), decision, { message: text(data, 'message').slice(0, 1000) }, new Date());
  if (!result.ok) done('deja_traitee');
  else done(result.mailed ? 'enregistre' : 'mail_echec');
}

export async function cancel(data: FormData) {
  const db = await guard();
  const result = await cancelBooking(db, text(data, 'id'), 'admin', new Date());
  if (!result.ok) done('deja_traitee');
  else done(result.mailed ? 'enregistre' : 'mail_echec');
}

export async function addBlock(data: FormData) {
  const db = await guard();
  const ranges = blockRanges({
    from: text(data, 'from'), to: text(data, 'to'), startTime: text(data, 'startTime'), endTime: text(data, 'endTime'),
  });
  if (!ranges) done('blocage_invalide');
  const result = await createBlocks(db, ranges!, text(data, 'label').slice(0, 120), new Date());
  done(result.ok ? 'enregistre' : 'blocage_conflit');
}

export async function removeBlock(data: FormData) {
  const db = await guard();
  await deleteBlock(db, text(data, 'id'));
  done('enregistre');
}

export async function addPhone(data: FormData) {
  const db = await guard();
  const date = text(data, 'date');
  const time = text(data, 'time');
  const name = text(data, 'name').slice(0, 160);
  if (!isDate(date) || !isTime(time) || !name) done('saisie_invalide');
  const result = await addPhoneBooking(
    db, { slotStart: parisToUtc(date, time), name, phone: text(data, 'phone').slice(0, 30) }, new Date(),
  );
  if (result.ok) done('enregistre');
  else done(result.reason === 'taken' ? 'creneau_pris' : 'hors_grille');
}

export async function signOut() {
  await logout();
  redirect('/admin/connexion');
}
