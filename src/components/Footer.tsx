export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#4A4A4A] text-white py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-[#BFD8C0] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-xl font-serif font-semibold">Christine Vallet</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Sophrologue certifiée, je vous accompagne vers un mieux-être durable grâce à des techniques de relaxation, de respiration et de visualisation positive.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.facebook.com/share/1E7gfrxNy7/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#BFD8C0] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/christine.vallet.104?igsh=aHIzZzNhbXpyem1m" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#BFD8C0] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/christine-vallet-935284288?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#BFD8C0] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://www.google.fr/maps/place/Christine+Vallet+Sophrologue/@48.8843994,6.392343,17z/data=!3m1!4b1!4m6!3m5!1s0x4794f3eb6b4f564d:0xfd6d5e58c07f174c!8m2!3d48.8843959!4d6.3949233!16s%2Fg%2F11y3y8rp3r" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#BFD8C0] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C7.802 0 4 3.403 4 7.602 4 11.8 7.469 16.812 12 24c4.531-7.188 8-12.2 8-16.398C20 3.403 16.199 0 12 0zm0 11a3 3 0 110-6 3 3 0 010 6z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#accueil" className="text-gray-300 hover:text-[#BFD8C0] transition-colors text-sm">Accueil</a></li>
              <li><a href="#sophrologie" className="text-gray-300 hover:text-[#BFD8C0] transition-colors text-sm">La sophrologie</a></li>
              <li><a href="#seances" className="text-gray-300 hover:text-[#BFD8C0] transition-colors text-sm">Accompagnements</a></li>
              <li><a href="#tarifs" className="text-gray-300 hover:text-[#BFD8C0] transition-colors text-sm">Tarifs</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-[#BFD8C0] transition-colors text-sm">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>07 81 44 27 33</li>
              <li>christinevallet.sophro@gmail.com</li>
              <li>42 rue du Général Nassoy</li>
              <li>57590 Delme</li>
              <li className="pt-2">Lun - Jeu : 9h - 20h</li>
              <li>Vendredi : 9h - 18h</li>
              <li>Samedi : 10h - 16h</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} Christine Vallet - Sophrologue. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Mentions légales</a>
            <a href="/confidentialite" className="text-gray-400 hover:text-white transition-colors">Politique de confidentialité</a>
            <a
              href="/admin"
              rel="nofollow"
              className="rounded-full border border-white/20 px-4 py-1.5 text-gray-400 hover:border-white/40 hover:text-white transition-colors"
            >
              Accès professionnel
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
