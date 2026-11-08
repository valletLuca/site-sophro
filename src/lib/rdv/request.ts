/** Adresse du visiteur derrière le proxy de Render. */
export function clientIp(headers: Headers): string {
  return headers.get('true-client-ip')
    ?? headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? 'inconnue';
}
