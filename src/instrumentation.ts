export async function register() {
  // Garder cette forme exacte : Next n'écarte l'import du runtime edge que derrière ce test.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startScheduler } = await import('./lib/rdv/scheduler');
    startScheduler();
  }
}
