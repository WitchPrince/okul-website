import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import EventList from "./components/events/EventList";
import EventFilter from "./components/events/EventFilter";
import EventDetail from "./components/events/EventDetail";
import EventForm from "./components/forms/EventForm";
import { events } from "./data/events";
import type { CampusEvent, Category } from "./types/campus-event";
import type { PageName } from "./types/page";
import { filterByCategory, findEventById, searchEvents } from "./utils/filter-events";
import { parseDate } from "./utils/format-date";

function App() {
  const [page, setPage] = useState<PageName>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<Category | "">("");

  const selected = selectedId ? findEventById(events, selectedId) : undefined;
  const title = page === "detail" && selected ? selected.title
    : page === "events" ? "Tüm Etkinlikler"
    : page === "add" ? "Etkinlik Ekle"
    : page === "update" ? "Etkinlik Güncelle" : "Kampüs Etkinlikleri";

  useEffect(() => { document.title = `Kampüs Etkinlikleri — ${title}`; }, [title]);

  function go(nextPage: PageName, id: string | null = null) {
    setPage(nextPage);
    setSelectedId(id);
    if (nextPage !== "events") { setSearchText(""); setCategory(""); }
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  const upcoming: CampusEvent[] = [...events]
    .sort((a, b) => parseDate(a.date).localeCompare(parseDate(b.date))).slice(0, 2);
  const filtered = filterByCategory(searchEvents(events, searchText), category);
  const categories: Category[] = [...new Set(events.map((event) => event.category))];

  return (
    <>
      <header className="site-baslik">
        <Header title={title} text="Fakültedeki etkinlikleri tek yerden takip edin." />
        <Navigation current={page} onNavigate={(nextPage) => go(nextPage)} />
      </header>
      <main>
        {page === "home" && <>
          <section className="intro">
            <h2>Etkinlikleri keşfet, kampüste yerini al.</h2>
            <p>Yaklaşan etkinlikleri inceleyin ve ayrıntıları görüntüleyin.</p>
          </section>
          <section aria-labelledby="yaklasan-baslik">
            <h2 id="yaklasan-baslik">Yaklaşan 2 etkinlik</h2>
            <EventList events={upcoming} onShowDetail={(id) => go("detail", id)} />
            <p><button type="button" onClick={() => go("events")}>Tüm etkinlikleri gör →</button></p>
          </section>
        </>}

        {page === "events" && <section>
          <h2>Tüm Etkinlikler</h2>
          <EventFilter searchText={searchText} category={category} categories={categories}
            onSearchChange={setSearchText} onCategoryChange={setCategory} />
          {filtered.length > 0 && <p aria-live="polite">{filtered.length} etkinlik bulundu.</p>}
          <EventList events={filtered} onShowDetail={(id) => go("detail", id)}
            emptyText="Aradığınız etkinlik bulunamadı." />
        </section>}

        {page === "detail" && (selected
          ? <EventDetail event={selected} onBack={() => go("events")} onEdit={(id) => go("update", id)} />
          : <section className="hata-kutusu">
              <h2>Etkinlik bulunamadı</h2>
              <p>Görüntülenecek bir etkinlik seçilmedi veya etkinlik mevcut değil.</p>
              <button type="button" onClick={() => go("events")}>← Listeye dön</button>
            </section>)}

        {(page === "add" || page === "update") && <EventForm mode={page}
          onSubmit={() => window.scrollTo({ top: 0, behavior: "auto" })} />}
      </main>
      <Footer />
    </>
  );
}

export default App;
