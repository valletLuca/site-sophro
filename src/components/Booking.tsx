import BookingCalendar from '@/components/rdv/BookingCalendar';

export default function Booking() {
  return (
    <section id="booking" className="py-20 bg-[#BFD8C0]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Prendre rendez-vous</h2>
        <p className="text-center text-[#6B6B6B] max-w-2xl mx-auto mb-12">
          Choisissez un créneau et envoyez-moi votre demande. Je vous confirme le rendez-vous par mail.
        </p>
        <BookingCalendar />
      </div>
    </section>
  );
}
