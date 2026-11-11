const steps = [
  {
    number: '01',
    title: 'Première séance importante',
    description: 'Un temps d\'échange approfondi pour comprendre votre situation, vos besoins et définir ensemble vos objectifs.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
    )
  },
  {
    number: '02',
    title: 'Échange et écoute',
    description: 'Discussion sur votre état du moment, vos ressentis et adaptation de la séance à vos besoins.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
      </svg>
    )
  },
  {
    number: '03',
    title: 'Exercices respiratoires',
    description: 'Pratique d\'exercices de respiration pour apaiser le mental et relâcher les tensions corporelles.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
      </svg>
    )
  },
  {
    number: '04',
    title: 'Relaxation guidée',
    description: 'Visualisation positive et relaxation profonde pour ancrer les bienfaits de la séance.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
      </svg>
    )
  },
  {
    number: '05',
    title: 'Retour sur l\'expérience',
    description: 'Partage de vos ressentis afin d\'intégrer les bénéfices et ajuster les prochaines étapes de votre accompagnement.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
      </svg>
    )
  }
];

export default function SessionSteps() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Déroulement d&apos;une séance</h2>
        <p className="text-center text-[#6B6B6B] max-w-2xl mx-auto mb-8 md:mb-12 text-sm sm:text-base">
          Chaque séance dure environ 1 heure et se déroule dans un cadre bienveillant et confidentiel.
        </p>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#BFD8C0]/30 rounded-full"></div>
          
          <div className="md:hidden absolute left-6 top-0 w-0.5 h-full bg-[#BFD8C0]/30 rounded-full"></div>

          <div className="space-y-6 md:space-y-12">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-row md:flex-col items-start md:items-center gap-4 md:gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 bg-[#BFD8C0] rounded-full flex items-center justify-center shadow-lg flex-shrink-0 md:order-none order-first">
                  <div className="text-white scale-75 md:scale-100">
                    {step.icon}
                  </div>
                </div>

                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} md:order-first`}>
                  <div className={`card ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'} max-w-md`}>
                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                      <span className="text-2xl md:text-3xl font-serif text-[#BFD8C0]">{step.number}</span>
                      <h3 className="text-lg md:text-xl font-serif text-[#4A4A4A]">{step.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-[#6B6B6B] leading-relaxed">{step.description}</p>
                  </div>
                </div>

                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
