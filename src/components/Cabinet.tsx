import Image from 'next/image';
import cabinet1 from '../img/cabinet1.jpg';
import cabinet2 from '../img/cabinet2.jpg';
import cabinet3 from '../img/cabinet3.jpg';

const photos = [
  { src: cabinet3, alt: 'Espace de consultation' },
  { src: cabinet1, alt: 'Bureau du cabinet' },
  { src: cabinet2, alt: 'Extérieur du cabinet' },
];

export default function Cabinet() {
  return (
    <section id="cabinet" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Le Cabinet</h2>
        <p className="text-center text-[#6B6B6B] max-w-2xl mx-auto mb-12 leading-relaxed">
          Un espace chaleureux et apaisant, pensé pour vous accueillir dans les meilleures conditions de détente et de bien-être.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
