import Image from 'next/image';
import sophrologuePhoto from '../img/IMG_20250509_124945.jpg';

export default function Hero() {
  return (
    <section id="accueil" className="min-h-screen flex items-center pt-20 bg-gradient-to-b from-[#F6F1EB] to-[#E8C7C8]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left order-2 md:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-tight mb-6">
              Retrouvez <span className="text-[#BFD8C0]">équilibre</span> et <span className="text-[#E8C7C8]">sérénité</span> grâce à la sophrologie
            </h1>
            <p className="text-base sm:text-lg text-[#6B6B6B] mb-8 leading-relaxed">
              Accompagnement personnalisé pour vous aider à gérer le stress, améliorer votre sommeil et développer votre confiance en vous. Ensemble, cultivons votre bien-être au quotidien.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="#contact" className="btn-primary text-base sm:text-lg">
                Prendre rendez-vous
              </a>
              <a href="#sophrologie" className="btn-secondary text-base sm:text-lg">
                Découvrir la sophrologie
              </a>
            </div>
          </div>

          {/* Photo */}
          <div className="relative order-1 md:order-2 max-w-[280px] md:max-w-xs mx-auto w-full">
            <div className="relative aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={sophrologuePhoto}
                alt="Christine Vallet, Sophrologue"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#BFD8C0]/30 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#E8C7C8]/30 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
