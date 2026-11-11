const testimonials = [
  {
    name: 'Caroline T.',
    text: 'Merci des super séances dans l\'écoute, merci de savoir adapter les outils selon mes besoins du moment. Merci de m\'accompagner à cheminer dans la gestion de la douleur, et de pouvoir en baisser le curseur d\'intensité, de d\'avancer sur le chemin de la guérison... Gratitude. Merci de votre accompagnement bienveillant.',
    rating: 5
  },
  {
    name: 'Catia E.',
    text: 'Très bonne expérience. Ma fille a consulté Mme Vallet pour apprendre à mieux respirer afin d’améliorer son chant. Elle a été très bien accompagnée, avec beaucoup de bienveillance et de professionnalisme. Les exercices lui ont vraiment été utiles. Je recommande',
    rating: 5
  },
  {
    name: 'Frederic F.',
    text: 'Ecoute, patience et professionnalisme,  une belle personne qui nous fait que du bien.',
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-[#E8C7C8]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Témoignages</h2>
        <p className="text-center text-[#6B6B6B] max-w-2xl mx-auto mb-12">
          Découvrez les retours de personnes que j&apos;ai eu le plaisir d&apos;accompagner.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#BFD8C0]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              
              <blockquote className="text-[#6B6B6B] italic mb-4 leading-relaxed">
                &quot;{testimonial.text}&quot;
              </blockquote>
              
              <p className="font-medium text-[#4A4A4A]">{testimonial.name}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a 
            href="https://www.google.fr/maps/place/Christine+Vallet+Sophrologue/@48.8843959,6.3949233,17z/data=!4m8!3m7!1s0x4794f3eb6b4f564d:0xfd6d5e58c07f174c!8m2!3d48.8843959!4d6.3949233!9m1!1b1!16s%2Fg%2F11y3y8rp3r!5m1!1e2?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#4A4A4A] hover:text-[#BFD8C0] transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span className="font-medium">Voir tous les avis sur Google Maps</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
