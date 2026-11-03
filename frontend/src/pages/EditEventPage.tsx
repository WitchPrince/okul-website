import { useNavigate, useParams } from "react-router-dom";
import EventForm from "../components/forms/EventForm";
import { useEvents } from "../context/EventsContext";
import NotFoundPage from "./NotFoundPage";
export default function EditEventPage() { const { id } = useParams<{id:string}>(); const { events, updateEvent } = useEvents(); const navigate = useNavigate(); const event = events.find(e => e.id === id); if (!event) return <NotFoundPage/>; return <EventForm key={event.id} initialData={event} submitLabel="Güncelle" onSubmit={(data) => { updateEvent(event.id,data); navigate("/admin"); }} />; }
