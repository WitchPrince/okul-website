import type { CampusEvent } from "../../types/campus-event";
import { formatDate } from "../../utils/format-date";
import { Link } from "react-router-dom";
export default function EventDetail({ event }: { event: CampusEvent }) {
  return <article className="detay"><h2>{event.title}</h2>{event.image && <figure className="afis"><img src={event.image} alt={`${event.title} afişi`} /></figure>}<section className="kunye"><h3>Etkinlik Künyesi</h3><p><strong>Tarih:</strong> {formatDate(event.date)}</p><p><strong>Saat:</strong> {event.time}</p><p><strong>Yer:</strong> {event.location}</p><p><strong>Kategori:</strong> {event.category}</p><p><strong>Kontenjan:</strong> {event.capacity} kişi</p></section><section><h3>Açıklama</h3><p>{event.description}</p></section><div className="detay-eylemler"><Link className="button-link" to="/events">← Listeye dön</Link><Link className="button-link" to={`/admin/${event.id}/edit`}>Bu etkinliği güncelle</Link></div></article>;
}
