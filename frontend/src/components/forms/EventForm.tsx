import type { FormEvent } from "react";
import type { Category } from "../../types/campus-event";

interface EventFormProps {
  mode: "add" | "update";
  onSubmit: () => void;
}

const categories: Category[] = ["Seminer", "Atölye", "Söyleşi", "Yarışma"];

export default function EventForm({ mode, onSubmit }: EventFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <section className="form-sayfasi">
      <h2>{mode === "add" ? "Etkinlik Ekle" : "Etkinlik Güncelle"}</h2>
      <p>Bu form bu sprintte yalnızca görünüm içindir.</p>
      <form className="form" onSubmit={handleSubmit}>
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
