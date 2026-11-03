import { useParams } from "react-router-dom";
import { useEvents } from "../context/EventsContext";
import EventDetail from "../components/events/EventDetail";
import NotFoundPage from "./NotFoundPage";
import { findEventById } from "../utils/filter-events";
export default function EventDetailPage() { const { id } = useParams<{id:string}>(); const { events } = useEvents(); const event = id ? findEventById(events, id) : undefined; return event ? <EventDetail event={event}/> : <NotFoundPage/>; }
