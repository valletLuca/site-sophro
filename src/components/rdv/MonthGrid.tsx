import type { MonthAvailability, SlotState } from '@/lib/rdv/availability';
import { isoDayOf } from '@/lib/rdv/time';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const STATE_STYLES: Record<SlotState, { label: string; chip: string; dot: string }> = {
  free: { label: 'Libre', chip: 'bg-[#BFD8C0] text-[#3A4A3B]', dot: 'bg-[#8FBB91]' },
  pending: { label: 'En attente', chip: 'bg-[#E8C7C8] text-[#5A3F40] border border-dashed border-[#B98A8C]', dot: 'bg-[#DDA9AB]' },
  reserved: { label: 'Réservé', chip: 'bg-gray-300 text-gray-600 line-through', dot: 'bg-gray-400' },
  unavailable: { label: 'Indisponible', chip: 'bg-gray-100 text-gray-500', dot: 'bg-gray-200' },
};

function dayDescription(day: MonthAvailability['days'][number]) {
  const free = day.slots.filter((s) => s.state === 'free').length;
  const pending = day.slots.filter((s) => s.state === 'pending').length;
  return `${Number(day.date.slice(8))} : ${free} libre${free > 1 ? 's' : ''}, ${pending} en attente`;
}

interface Props {
  days: MonthAvailability['days'];
  selectedDate: string | null;
  onSelect: (date: string) => void;
}

export default function MonthGrid({ days, selectedDate, onSelect }: Props) {
  const leadingBlanks = isoDayOf(days[0].date) - 1;

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2" aria-hidden="true">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs sm:text-sm font-medium text-[#6B6B6B]">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {Array.from({ length: leadingBlanks }, (_, i) => <div key={i} />)}
        {days.map((day) => {
          const selectable = day.slots.some((s) => s.state !== 'unavailable');
          const selected = day.date === selectedDate;
          return (
            <button
              key={day.date}
              type="button"
              disabled={!selectable}
              onClick={() => onSelect(day.date)}
              aria-label={dayDescription(day)}
              aria-pressed={selected}
              className={`rounded-lg sm:rounded-xl border p-1 sm:p-2 min-h-14 sm:min-h-40 flex flex-col items-center sm:items-stretch text-left transition-colors ${
                selected ? 'border-[#4A4A4A] border-2 bg-[#F6F1EB]' : 'border-gray-200 bg-white'
              } ${selectable ? 'hover:border-[#8FBB91] cursor-pointer' : 'cursor-default opacity-70'}`}
            >
              <span className="text-sm font-medium text-[#4A4A4A] mb-1">{Number(day.date.slice(8))}</span>
              {/* Mobile : pastilles */}
              <span className="flex sm:hidden flex-wrap justify-center gap-0.5">
                {day.slots.map((slot) => (
                  <span key={slot.start} className={`w-1.5 h-1.5 rounded-full ${STATE_STYLES[slot.state].dot}`} />
                ))}
              </span>
              {/* Écran large : heures */}
              <span className="hidden sm:flex flex-col gap-0.5">
                {day.slots.map((slot) => (
                  <span key={slot.start} className={`rounded px-1 text-[11px] leading-[15px] text-center ${STATE_STYLES[slot.state].chip}`}>
                    {slot.label}
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
