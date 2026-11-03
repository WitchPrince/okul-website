import type { CampusEvent } from "../../types/campus-event";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/format-date";

interface EventCardProps { event: CampusEvent; }

export default function EventCard({ event }: EventCardProps) {
  return (
    <article className="kart">
      <h2>{event.title}</h2>
      <p className="meta">{event.category}</p>
      <p><strong>Tarih:</strong> {formatDate(event.date)} · {event.time}</p>
      <p><strong>Yer:</strong> {event.location}</p>
      <p><strong>Kontenjan:</strong> {event.capacity} kişi</p>
      <p>{event.description}</p>
      <Link className="detay-link" to={`/events/${event.id}`}>Detayları gör →</Link>
    </article>
  );
}
