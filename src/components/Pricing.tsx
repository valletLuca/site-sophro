import ReserveLink from './rdv/ReserveLink';

const pricingPlans = [
  {
    title: 'Séance individuelle',
    sessionType: 'individuelle',
    price: '60',
    duration: '1h',
    description: 'Accompagnement personnalisé adapté à vos besoins.',
    features: [
      'Entretien personnalisé',
      'Exercices de relaxation',
      'Visualisation guidée',
      'Exercices à pratiquer chez soi'
    ],
    highlighted: false
  },
  {
    title: 'Séance enfant/ado',
    sessionType: 'enfant_ado',
    price: '50',
    duration: '45mn',
    description: 'Séance adaptée pour les plus jeunes. Pour les enfants de 10 à 17 ans.',
    features: [
      'Approche ludique',
      'Exercices adaptés à l\'âge',
      'Gestion des émotions',
      'Confiance en soi'
    ],
    highlighted: false
  },
  {
    title: 'Séance en groupe en structure',
    sessionType: 'groupe_structure',
    price: '',
    information: 'Prix et durée à définir ensemble',
    description: 'Interventions en collectif adaptées à votre structure.',
    features: [
      'Hôpitaux et établissements de santé',
      'EHPAD',
      'Aidants et plateformes de répit',
      'Centres de ressources territoriaux',
      'Entreprises et associations'
    ],
    highlighted: true
  }
  ,
  {
    title: 'Séance en groupe au cabinet',
    sessionType: 'groupe_cabinet',
    price: '20',
    duration: 'pers pour 1h30',
    information: 'Entre 3 et 6 personnes',
    description: 'Interventions au cabinet pour votre groupe',
    features: [
      'Avec des amis',
      'Avec de la famille',
      'Avec des proches',
    ],
    highlighted: false 
  }
];

const packs = [
  { sessions: 5, price: '270', discount: '-10%', bonus: 'Soit ½ séance offerte', pricePerSession: '54' },
  { sessions: 10, price: '510', discount: '-15%', bonus: 'Soit 1,5 séance offerte', pricePerSession: '51' }
];

export default function Pricing() {
  return (
    <section id="tarifs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Tarifs</h2>
        <p className="text-center text-[#6B6B6B] max-w-2xl mx-auto mb-12">
          Des formules adaptées à vos besoins et à votre budget.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`card relative flex flex-col ${plan.highlighted ? 'border-2 border-[#BFD8C0]' : ''}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#BFD8C0] text-white px-4 py-1 rounded-full text-sm font-medium">
                  Populaire
                </div>
              )}
              
              <h3 className="text-xl font-serif text-[#4A4A4A] mb-2">{plan.title}</h3>
              <p className="text-sm text-[#6B6B6B] mb-4">{plan.description}</p>
              
              <div className="flex items-baseline gap-1 mb-6">
                {plan.price && <span className="text-4xl font-serif text-[#4A4A4A]">{plan.price}{!isNaN(Number(plan.price)) && '€'}</span>}
                {plan.price && plan.duration && <span className="text-[#6B6B6B]">/ {plan.duration}</span>}
                {'information' in plan && plan.information && <span className="text-xl font-serif text-[#4A4A4A]">{plan.information}</span>}
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#BFD8C0] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[#6B6B6B] text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <ReserveLink
                sessionType={plan.sessionType}
                className={`block text-center mt-auto ${plan.highlighted ? 'btn-primary' : 'btn-secondary'}`}
              >
                Réserver
              </ReserveLink>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#BFD8C0]/30 to-[#E8C7C8]/30 rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl font-serif text-center text-[#4A4A4A] mb-2">Packs avantageux</h3>
          <p className="text-center text-[#6B6B6B] mb-8">Engagez-vous sur plusieurs séances et profitez de tarifs préférentiels</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {packs.map((pack, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-md relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#E8C7C8] text-white px-6 py-2 rounded-full text-lg font-bold">
                  {pack.discount}
                </div>
                <h4 className="text-xl font-serif text-[#4A4A4A] mb-4 mt-2">Pack {pack.sessions} séances</h4>
                <p className="text-4xl font-serif text-[#4A4A4A] mb-1">{pack.price}€</p>
                <p className="text-sm text-[#6B6B6B] mb-4">soit {pack.pricePerSession}€ / séance</p>
                <span className="inline-block bg-[#BFD8C0]/30 text-[#4A4A4A] px-4 py-2 rounded-full text-sm font-medium">
                  {pack.bonus}
                </span>
                <a href="#booking" className="block mt-6 btn-primary">
                  Choisir ce pack
                </a>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-[#6B6B6B] mt-8">
          * Règlement par chèque, espèces ou virement.
        </p>
      </div>
    </section>
  );
}
