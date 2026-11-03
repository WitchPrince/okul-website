import type { CampusEvent } from "../../types/campus-event";
import EventCard from "./EventCard";

interface EventListProps {
  events: CampusEvent[];
  emptyText?: string;
}

export default function EventList({ events, emptyText = "Etkinlik bulunamadı." }: EventListProps) {
  if (events.length === 0) return <p className="sonuc-mesaji">{emptyText}</p>;

  return (
    <div className="etkinlik-listesi">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
