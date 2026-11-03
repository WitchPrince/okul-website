import { useNavigate } from "react-router-dom";
import EventForm from "../components/forms/EventForm";
import { useEvents } from "../context/EventsContext";
export default function AddEventPage() { const { addEvent } = useEvents(); const navigate = useNavigate(); return <EventForm onSubmit={(data) => { addEvent(data); navigate("/admin"); }} />; }
