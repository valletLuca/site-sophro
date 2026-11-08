import Image from 'next/image';
import sophrologuePhoto from '../img/IMG_20250509_124945.jpg';

export default function About() {
  return (
    <section id="sophrologie" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">La Sophrologie</h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-serif mb-4 text-[#4A4A4A]">Qu&apos;est-ce que la sophrologie ?</h3>
            <p className="text-[#6B6B6B] mb-4 leading-relaxed">
              La sophrologie est une méthode psychocorporelle qui combine des techniques de relaxation, de respiration et de visualisation positive. Elle permet de développer la conscience de soi et d&apos;harmoniser le corps et l&apos;esprit.
            </p>
            <p className="text-[#6B6B6B] mb-6 leading-relaxed">
              Créée dans les années 1960 par le neuropsychiatre Alfonso Caycedo, cette discipline s&apos;appuie sur des bases scientifiques solides et s&apos;adapte à tous, quel que soit l&apos;âge ou la condition physique.
            </p>
            <a href="#seances" className="btn-primary">
              Découvrir les séances
            </a>
          </div>
          
          <div className="bg-[#F6F1EB] rounded-2xl p-8">
            <h4 className="text-xl font-serif mb-4 text-[#4A4A4A]">Les bienfaits</h4>
            <ul className="space-y-3">
              {[
                'Réduction du stress, de l\'anxiété et des tensions',
                'Amélioration de la qualité du sommeil',
                'Renforcement de la confiance en soi',
                'Meilleure gestion des émotions',
                'Préparation aux événements importants',
                'Soulagement des douleurs chroniques'
              ].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-[#BFD8C0] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-[#6B6B6B]">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Présentation sophrologue */}
        <div className="bg-gradient-to-r from-[#BFD8C0]/20 to-[#E8C7C8]/20 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg relative">
                <Image
                  src={sophrologuePhoto}
                  alt="Christine Vallet, Sophrologue"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-2xl font-serif mb-4 text-[#4A4A4A]">Christine Vallet, Sophrologue certifiée</h3>
              <p className="text-[#6B6B6B] mb-4 leading-relaxed">
                Infirmière de formation, j&apos;ai exercé pendant plusieurs années auprès de patients avant de me tourner vers la sophrologie. Ce parcours dans le soin m&apos;a appris l&apos;importance d&apos;écouter l&apos;autre et de prendre en compte la personne dans sa globalité.
              </p>
              <p className="text-[#6B6B6B] mb-4 leading-relaxed">
                Aujourd&apos;hui sophrologue certifiée, je vous propose un accompagnement simple et adapté à vos besoins, avec des outils concrets à utiliser au quotidien pour vous sentir mieux, à votre rythme.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-white rounded-full text-sm text-[#4A4A4A]">Diplômée RNCP</span>
                <span className="px-4 py-2 bg-white rounded-full text-sm text-[#4A4A4A]">Membre SFS</span>
                <span className="px-4 py-2 bg-white rounded-full text-sm text-[#4A4A4A]">+150 accompagnements</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
