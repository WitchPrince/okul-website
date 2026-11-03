import { Link } from "react-router-dom";
import { useEvents } from "../context/EventsContext";
import EventList from "../components/events/EventList";
import { parseDate } from "../utils/format-date";
export default function HomePage() {
  const { events } = useEvents();
  const upcoming = [...events].sort((a,b) => parseDate(a.date).localeCompare(parseDate(b.date))).slice(0,2);
  return <><section className="intro"><h2>Etkinlikleri keşfet, kampüste yerini al.</h2><p>Yaklaşan etkinlikleri inceleyin ve ayrıntıları görüntüleyin.</p><Link className="button-link" to="/events">Tüm etkinlikler</Link></section><section><h2>Yaklaşan 2 Etkinlik</h2><EventList events={upcoming} /><Link to="/events">Tüm etkinlikleri gör →</Link></section></>;
}
