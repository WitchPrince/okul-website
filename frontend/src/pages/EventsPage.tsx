import { useMemo, useState } from "react";
import { useEvents } from "../context/EventsContext";
import EventFilter from "../components/events/EventFilter";
import EventList from "../components/events/EventList";
import { filterByCategory, searchEvents } from "../utils/filter-events";
import type { Category } from "../types/campus-event";
export default function EventsPage() {
  const { events } = useEvents(); const [searchText,setSearchText] = useState(""); const [category,setCategory] = useState<Category|"">("");
  const categories = [...new Set(events.map(e => e.category))];
  const filtered = useMemo(() => filterByCategory(searchEvents(events,searchText),category),[events,searchText,category]);
  return <section><h2>Tüm Etkinlikler</h2><EventFilter searchText={searchText} category={category} categories={categories} onSearchChange={setSearchText} onCategoryChange={setCategory}/><p aria-live="polite">{filtered.length} etkinlik bulundu.</p><EventList events={filtered} emptyText="Aradığınız etkinlik bulunamadı." /></section>;
}
