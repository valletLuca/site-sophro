'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'Qu\'est-ce que la sophrologie ?',
    answer: 'Des outils concrets — respiration, relaxation, visualisation — pour mieux vivre au quotidien. Accessible à tous, sans prérequis.'
  },
  {
    question: 'Comment se déroule une première séance ?',
    answer: 'La première séance dure environ 1h15. Elle commence par un entretien pour comprendre vos besoins et définir vos objectifs. Ensuite, je vous propose une première pratique adaptée, suivie d\'un temps d\'échange sur vos ressentis.'
  },
  {
    question: 'Combien de séances sont nécessaires ?',
    answer: 'Le nombre de séances varie selon vos objectifs et votre situation. En général, un accompagnement complet comprend 4 à 8 séances, mais les premiers bénéfices se font ressentir dès le début.'
  },
  {
    question: 'La sophrologie est-elle remboursée ?',
    answer: 'La sophrologie n\'est pas remboursée par la Sécurité sociale, mais de nombreuses mutuelles proposent une prise en charge partielle. Je vous invite à vous renseigner auprès de votre mutuelle.'
  },
  {
    question: 'Puis-je annuler ou reporter un rendez-vous ?',
    answer: 'Oui, vous pouvez annuler ou reporter votre rendez-vous sans frais jusqu\'à 24h avant la séance. Au-delà, la séance sera due.'
  },
  {
    question: 'Les séances se font-elles uniquement en cabinet ?',
    answer: 'Je propose des séances en cabinet et en visioconférence. Le présentiel reste préférable pour un meilleur accompagnement, mais la visio peut être une bonne alternative si besoin.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Questions fréquentes</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-[#BDA89A]/20 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[#F6F1EB]/50 transition-colors"
              >
                <span className="font-medium text-[#4A4A4A]">{faq.question}</span>
                <svg 
                  className={`w-5 h-5 text-[#BFD8C0] transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-[#6B6B6B] leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
