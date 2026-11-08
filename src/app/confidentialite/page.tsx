import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT, RETENTION_DAYS } from '@/lib/rdv/config';

export const metadata: Metadata = {
  title: 'Politique de confidentialité | Christine Vallet - Sophrologue',
  description: 'Comment vos données sont utilisées lors d\'une prise de rendez-vous.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F6F1EB] p-4 md:p-10">
      <article className="bg-white rounded-2xl shadow-md p-6 md:p-10 max-w-3xl mx-auto space-y-6 text-[#4A4A4A]">
        <h1 className="text-3xl font-serif">Politique de confidentialité</h1>

        <section className="space-y-2">
          <h2 className="text-xl font-serif">Responsable du traitement</h2>
          <p>{CONTACT.name}, sophrologue, {CONTACT.address}. Contact : <a className="underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-serif">Données collectées et finalité</h2>
          <p>Lorsque vous demandez un rendez-vous, nous recueillons votre nom, votre prénom, votre téléphone, votre adresse mail, le type de séance et le motif de votre demande. Ces données servent uniquement à traiter votre demande et à vous recontacter.</p>
          <p>Si vous vous inscrivez sur une liste d&apos;attente, nous recueillons votre nom et votre adresse mail pour vous prévenir si le créneau se libère.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-serif">Motif de la demande</h2>
          <p>Ce motif peut contenir des informations personnelles sensibles, et il n&apos;est transmis qu&apos;avec votre accord. Il n&apos;est pas conservé sur le site : il est envoyé une seule fois par mail à Christine Vallet, puis effacé de notre service. Il reste ensuite dans sa messagerie. N&apos;y indiquez que ce qui vous semble utile.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-serif">Durée de conservation</h2>
          <p>Vos coordonnées sont effacées du site {RETENTION_DAYS} jours après la date du rendez-vous, ou {RETENTION_DAYS} jours après un refus, une annulation ou une expiration. Une inscription sur liste d&apos;attente est supprimée dès que le créneau est libéré, attribué ou passé.</p>
          <p>Afin de limiter les abus, une empreinte non lisible de votre adresse IP est gardée 24 heures au plus.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-serif">Destinataires et prestataires</h2>
          <p>Vos données ne sont ni vendues ni transmises à des tiers à des fins commerciales. Seule Christine Vallet y a accès. Le site s&apos;appuie sur des prestataires techniques : Render (hébergement), Neon (base de données), Resend (envoi des mails) et Google (messagerie Gmail de Christine Vallet).</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-serif">Vos droits</h2>
          <p>Vous pouvez accéder à vos données, les rectifier, les effacer, vous opposer à leur traitement ou retirer votre accord en écrivant à <a className="underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. Vous pouvez aussi adresser une réclamation à la CNIL (cnil.fr).</p>
        </section>

        <Link href="/" className="inline-block text-[#6B6B6B] underline">Retour au site</Link>
      </article>
    </main>
  );
}
