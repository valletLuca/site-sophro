import BookingCalendar from '@/components/rdv/BookingCalendar';

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-[#F6F1EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Contact</h2>
        <p className="text-center text-[#6B6B6B] max-w-2xl mx-auto mb-12">
          Choisissez un créneau et envoyez-moi votre demande. Je vous confirme le rendez-vous par mail.
        </p>

        <div className="mb-12">
          <BookingCalendar />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <div className="card mb-8">
              <h3 className="text-xl font-serif text-[#4A4A4A] mb-6">Coordonnées</h3>
              
              <div className="space-y-4">
                <a href="tel:+33781442733" className="flex items-center gap-4 text-[#6B6B6B] hover:text-[#BFD8C0] transition-colors">
                  <div className="w-12 h-12 bg-[#BFD8C0]/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#BFD8C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <span>07 81 44 27 33</span>
                </a>

                <a href="mailto:christinevallet.sophro@gmail.com" className="flex items-center gap-4 text-[#6B6B6B] hover:text-[#BFD8C0] transition-colors">
                  <div className="w-12 h-12 bg-[#BFD8C0]/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#BFD8C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <span>christinevallet.sophro@gmail.com</span>
                </a>

                <div className="flex items-center gap-4 text-[#6B6B6B]">
                  <div className="w-12 h-12 bg-[#BFD8C0]/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#BFD8C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <span>42 Rue du Général Nassoy, 57590 Delme</span>
                </div>

                <div className="flex items-center gap-4 text-[#6B6B6B]">
                  <div className="w-12 h-12 bg-[#BFD8C0]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#BFD8C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div className="flex flex-col text-sm leading-relaxed">
                    <span>Lun - Jeu : 9h - 20h</span>
                    <span>Vendredi : 9h - 18h</span>
                    <span>Samedi : 10h - 16h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Google Maps */}
            <a 
              href="https://www.google.fr/maps/place/Christine+Vallet+Sophrologue/@48.8843994,6.392343,17z/data=!3m1!4b1!4m6!3m5!1s0x4794f3eb6b4f564d:0xfd6d5e58c07f174c!8m2!3d48.8843959!4d6.3949233!16s%2Fg%2F11y3y8rp3r"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl overflow-hidden h-64 relative group"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2632.1234567890123!2d6.392343!3d48.8843994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4794f3eb6b4f564d%3A0xfd6d5e58c07f174c!2sChristine%20Vallet%20Sophrologue!5e0!3m2!1sfr!2sfr!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none"
              ></iframe>
              <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-4 py-2 rounded-full text-sm font-medium text-[#4A4A4A]">
                  Ouvrir dans Google Maps
                </span>
              </div>
            </a>

            <div className="bg-[#BFD8C0]/10 rounded-2xl p-5 text-center text-[#6B6B6B]">
              <p>
                Vous préférez échanger de vive voix ? Appelez-moi au{' '}
                <a href="tel:+33781442733" className="font-medium text-[#4A4A4A] hover:underline">07 81 44 27 33</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
