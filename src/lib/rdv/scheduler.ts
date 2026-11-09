import { getDb } from './db';
import { runSweep } from './sweep';

const EVERY_MS = 60 * 60_000; // Une fois par heure, pour laisser la base Neon se mettre en veille entre deux passages.

async function tick() {
  try {
    await runSweep(await getDb(), new Date());
  } catch (error) {
    console.error('Tâche périodique échouée :', error instanceof Error ? error.name : 'erreur inconnue');
  }
}

/** Suppose un serveur toujours éveillé (Render Starter, ou Free avec un ping externe). */
export function startScheduler(): void {
  setTimeout(tick, 10_000);
  setInterval(tick, EVERY_MS);
}
