import type { CampusEvent } from "../../types/campus-event";
import { formatDate } from "../../utils/format-date";

interface EventDetailProps {
  event: CampusEvent;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export default function EventDetail({ event, onBack, onEdit }: EventDetailProps) {
  return (
    <article className="detay">
      <h2>{event.title}</h2>
      {event.image && (
        <figure className="afis">
          <img src={event.image} alt={`${event.title} afişi`} />
        </figure>
      )}
      <section className="kunye" aria-labelledby="kunye-baslik">
        <h3 id="kunye-baslik">Etkinlik Künyesi</h3>
        <p><strong>Tarih:</strong> {formatDate(event.date)}</p>
        <p><strong>Saat:</strong> {event.time}</p>
        <p><strong>Yer:</strong> {event.location}</p>
        <p><strong>Kategori:</strong> {event.category}</p>
        <p><strong>Kontenjan:</strong> {event.capacity} kişi</p>
      </section>
      <section className="aciklama">
        <h3>Açıklama</h3>
        <p>{event.description}</p>
      </section>
      <div className="detay-eylemler">
        <button type="button" onClick={onBack}>← Listeye dön</button>
        <button type="button" onClick={() => onEdit(event.id)}>Bu etkinliği güncelle</button>
      </div>
    </article>
  );
}
