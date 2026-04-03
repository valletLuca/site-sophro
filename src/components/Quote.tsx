export default function Quote() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#BFD8C0]/30 to-[#E8C7C8]/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <svg className="w-12 h-12 mx-auto mb-6 text-[#BFD8C0]/50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
        
        <blockquote className="text-2xl md:text-3xl font-serif text-[#4A4A4A] leading-relaxed mb-6">
          &quot;Vous ne pouvez pas arrêter les vagues mais vous pouvez apprendre à surfer.&quot;
        </blockquote>
        
        <p className="text-[#6B6B6B] font-medium">— Joseph Goldstein - Premier enseignant de méditation et auteur</p>
      </div>
    </section>
  );
}
