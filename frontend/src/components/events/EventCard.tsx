import type { CampusEvent } from "../../types/campus-event";
import { formatDate } from "../../utils/format-date";

interface EventCardProps {
  event: CampusEvent;
  onShowDetail: (id: string) => void;
}

export default function EventCard({ event, onShowDetail }: EventCardProps) {
  return (
    <article className="kart">
      <h2>{event.title}</h2>
      <p className="meta">{event.category}</p>
      <p><strong>Tarih:</strong> {formatDate(event.date)} · {event.time}</p>
      <p><strong>Yer:</strong> {event.location}</p>
      <p><strong>Kontenjan:</strong> {event.capacity} kişi</p>
      <p>{event.description}</p>
      <button type="button" className="detay-link" onClick={() => onShowDetail(event.id)}>
        Detayları gör →
      </button>
    </article>
  );
}
