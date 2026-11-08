import { getDb } from './db';
import { runSweep } from './sweep';

const EVERY_MS = 15 * 60_000;

async function tick() {
  try {
    await runSweep(await getDb(), new Date());
  } catch (error) {
    console.error('Tâche périodique échouée :', error instanceof Error ? error.name : 'erreur inconnue');
  }
}

/** Render Starter ne met pas le serveur en veille : une minuterie interne suffit. */
export function startScheduler(): void {
  setTimeout(tick, 10_000);
  setInterval(tick, EVERY_MS);
}
