import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";
import { events } from "./data/events";
import type { CampusEvent, Category } from "./types/campus-event";
import { filterByCategory, findEventById, searchEvents } from "./utils/filter-events";

type PageName = "home" | "events" | "detail" | "add" | "update";

const menuItems: { label: string; page: PageName }[] = [
  { label: "Ana Sayfa", page: "home" },
  { label: "Etkinlikler", page: "events" },
  { label: "Ekle", page: "add" },
];

const categories: Category[] = ["Seminer", "Atölye", "Söyleşi", "Yarışma"];

function parseDate(date: string): string {
  const [day, month, year] = date.split("-");
  return `${year}-${month}-${day}`;
}

function formatDate(date: string): string {
  const [day, month, year] = date.split("-");
  return `${day}.${month}.${year}`;
}

function App() {
  const [page, setPage] = useState<PageName>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<Category | "">("");

  const selected = selectedId ? findEventById(events, selectedId) : undefined;
  const title =
    page === "detail" && selected
      ? selected.title
      : page === "events"
        ? "Tüm Etkinlikler"
        : page === "add"
          ? "Etkinlik Ekle"
          : page === "update"
            ? "Etkinlik Güncelle"
            : "Kampüs Etkinlikleri";

  useEffect(() => {
    document.title = `Kampüs Etkinlikleri — ${title}`;
  }, [title]);

  function go(nextPage: PageName, id: string | null = null) {
    setPage(nextPage);
    setSelectedId(id);
    if (nextPage !== "events") {
      setSearchText("");
      setCategory("");
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  const upcoming = [...events]
    .sort((a, b) => parseDate(a.date).localeCompare(parseDate(b.date)))
    .slice(0, 2);

  const filtered = filterByCategory(searchEvents(events, searchText), category);
  const uniqueCategories = [...new Set(events.map((event) => event.category))];

  function renderCard(event: CampusEvent) {
    return (
      <article className="kart" key={event.id}>
        <h2>{event.title}</h2>
        <p className="meta">{event.category}</p>
        <p><strong>Tarih:</strong> {formatDate(event.date)} · {event.time}</p>
        <p><strong>Yer:</strong> {event.location}</p>
        <p><strong>Kontenjan:</strong> {event.capacity} kişi</p>
        <p>{event.description}</p>
        <button type="button" className="detay-link" onClick={() => go("detail", event.id)}>
          Detayları gör →
        </button>
      </article>
    );
  }

  function renderForm() {
    return (
      <section className="form-sayfasi">
        <h2>{page === "add" ? "Etkinlik Ekle" : "Etkinlik Güncelle"}</h2>
        <p>Bu form bu sprintte yalnızca görünüm içindir.</p>
        <form className="form" onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}>
          <div className="form-alani">
            <label htmlFor="title">Etkinlik Adı</label>
            <input id="title" name="title" maxLength={80} placeholder="Örn. Yapay Zeka Semineri" />
          </div>
          <div className="form-alani">
            <label htmlFor="category">Kategori</label>
            <select id="category" name="category" defaultValue="">
              <option value="" disabled>Seçiniz</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="form-alani">
            <label htmlFor="date">Tarih</label>
            <input id="date" name="date" type="date" />
          </div>
          <div className="form-alani">
            <label htmlFor="time">Saat</label>
            <input id="time" name="time" type="time" />
          </div>
          <div className="form-alani">
            <label htmlFor="location">Yer</label>
            <input id="location" name="location" placeholder="Örn. A Blok Konferans Salonu" />
          </div>
          <div className="form-alani">
            <label htmlFor="capacity">Kontenjan</label>
            <input id="capacity" name="capacity" type="number" min={1} />
          </div>
          <div className="form-alani">
            <label htmlFor="description">Açıklama</label>
            <textarea id="description" name="description" rows={5} />
          </div>
          <button type="submit">Kaydet</button>
        </form>
      </section>
    );
  }

  return (
    <>
      <header className="site-baslik">
        <h1>Kampüs Etkinlikleri</h1>
        <p>Fakültedeki etkinlikleri tek yerden takip edin.</p>
        <nav className="menu" aria-label="Ana menü">
          {menuItems.map((item) => (
            <a
              key={item.page}
              href={`#${item.page}`}
              aria-current={page === item.page ? "page" : undefined}
              onClick={(event) => {
                event.preventDefault();
                go(item.page);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        {page === "home" && (
          <>
            <section className="intro">
              <h2>Etkinlikleri keşfet, kampüste yerini al.</h2>
              <p>Yaklaşan etkinlikleri inceleyin ve ayrıntıları görüntüleyin.</p>
            </section>
            <section aria-labelledby="yaklasan-baslik">
              <h2 id="yaklasan-baslik">Yaklaşan 2 etkinlik</h2>
              <div className="etkinlik-listesi">{upcoming.map(renderCard)}</div>
              <p><button type="button" onClick={() => go("events")}>Tüm etkinlikleri gör →</button></p>
            </section>
          </>
        )}

        {page === "events" && (
          <section>
            <h2>Tüm Etkinlikler</h2>
            <div className="filtre">
              <div>
                <label htmlFor="event-search">Etkinlik ara</label>
                <input
                  id="event-search"
                  type="search"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Etkinlik adı veya açıklama"
                />
              </div>
              <div>
                <label htmlFor="event-category">Kategori</label>
                <select
                  id="event-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value as Category | "")}
                >
                  <option value="">Tüm kategoriler</option>
                  {uniqueCategories.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
            <p aria-live="polite">
              {filtered.length === 0 ? "Aradığınız etkinlik bulunamadı." : `${filtered.length} etkinlik bulundu.`}
            </p>
            {filtered.length > 0 && <div className="etkinlik-listesi">{filtered.map(renderCard)}</div>}
          </section>
        )}

        {page === "detail" && (
          selected ? (
            <article className="detay">
              <h2>{selected.title}</h2>
              {selected.image && (
                <figure className="afis">
                  <img src={selected.image} alt={`${selected.title} afişi`} />
                </figure>
              )}
              <section className="kunye" aria-labelledby="kunye-baslik">
                <h3 id="kunye-baslik">Etkinlik Künyesi</h3>
                <p><strong>Tarih:</strong> {formatDate(selected.date)}</p>
                <p><strong>Saat:</strong> {selected.time}</p>
                <p><strong>Yer:</strong> {selected.location}</p>
                <p><strong>Kategori:</strong> {selected.category}</p>
                <p><strong>Kontenjan:</strong> {selected.capacity} kişi</p>
              </section>
              <section>
                <h3>Açıklama</h3>
                <p>{selected.description}</p>
              </section>
              <div className="detay-eylemler">
                <button type="button" onClick={() => go("events")}>← Listeye dön</button>
                <button type="button" onClick={() => go("update", selected.id)}>Bu etkinliği güncelle</button>
              </div>
            </article>
          ) : (
            <section className="hata-kutusu">
              <h2>Etkinlik bulunamadı</h2>
              <p>Görüntülenecek bir etkinlik seçilmedi veya etkinlik mevcut değil.</p>
              <button type="button" onClick={() => go("events")}>← Listeye dön</button>
            </section>
          )
        )}

        {(page === "add" || page === "update") && renderForm()}
      </main>

      <footer>
        <p>Işıkhan IŞIK · 2416501044</p>
      </footer>
    </>
  );
}

export default App;
