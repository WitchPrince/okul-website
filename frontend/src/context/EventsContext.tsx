import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { events as initialEvents } from "../data/events";
import type { CampusEvent, EventFormData } from "../types/campus-event";
interface EventsContextValue {
  events: CampusEvent[];
  addEvent: (data: EventFormData) => void;
  updateEvent: (id: string, data: EventFormData) => void;
  deleteEvent: (id: string) => void;
}
const EventsContext = createContext<EventsContextValue | null>(null);
function toCampusEvent(data: EventFormData, id: string): CampusEvent {
  return { ...data, id, capacity: Number(data.capacity) };
}

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CampusEvent[]>(initialEvents);
  const value = useMemo<EventsContextValue>(() => ({
    events,
    addEvent: (data) => setEvents((current) => [...current, toCampusEvent(data, `event-${Date.now()}`)]),
    updateEvent: (id, data) => setEvents((current) => current.map((event) => event.id === id ? toCampusEvent(data, id) : event)),
    deleteEvent: (id) => setEvents((current) => current.filter((event) => event.id !== id)),
  }), [events]);
  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}
export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) throw new Error("useEvents, EventsProvider içinde kullanılmalıdır.");
  return context;
}
