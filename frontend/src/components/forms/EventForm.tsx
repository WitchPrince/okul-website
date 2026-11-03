import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Category, CampusEvent, EventFormData, EventFormErrors } from "../../types/campus-event";
import { validateEvent } from "../../utils/validate-event";
const categories: Category[] = ["Seminer", "Atölye", "Söyleşi", "Yarışma"];
const empty: EventFormData = { title: "", category: "Seminer", date: "", time: "", location: "", capacity: "1", description: "" };
interface Props { initialData?: CampusEvent; submitLabel?: string; onSubmit: (data: EventFormData) => void; }
export default function EventForm({ initialData, submitLabel = "Kaydet", onSubmit }: Props) {
  const [data, setData] = useState<EventFormData>(initialData ? { title: initialData.title, category: initialData.category, date: initialData.date, time: initialData.time, location: initialData.location, capacity: String(initialData.capacity), description: initialData.description } : empty);
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [message, setMessage] = useState("");
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setData((current) => ({ ...current, [name]: value }));
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateEvent(data); setErrors(found);
    if (Object.keys(found).length) { setMessage("Lütfen hatalı alanları düzeltin."); return; }
    onSubmit(data); setMessage("İşlem başarıyla tamamlandı.");
  }
  const field = (name: keyof EventFormData) => ({ "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${name}-error` : undefined });
  return <section className="form-sayfasi"><h2>{initialData ? "Etkinliği Güncelle" : "Etkinlik Ekle"}</h2><form className="form" onSubmit={handleSubmit} noValidate>
    <div className="form-alani"><label htmlFor="title">Etkinlik Adı</label><input id="title" name="title" value={data.title} onChange={handleChange} {...field("title")} />{errors.title && <span id="title-error" className="hata">{errors.title}</span>}</div>
    <div className="form-alani"><label htmlFor="category">Kategori</label><select id="category" name="category" value={data.category} onChange={handleChange} {...field("category")}>{categories.map((c) => <option key={c}>{c}</option>)}</select>{errors.category && <span id="category-error" className="hata">{errors.category}</span>}</div>
    <div className="form-alani"><label htmlFor="date">Tarih</label><input id="date" name="date" type="date" value={data.date} onChange={handleChange} {...field("date")} />{errors.date && <span id="date-error" className="hata">{errors.date}</span>}</div>
    <div className="form-alani"><label htmlFor="time">Saat</label><input id="time" name="time" type="time" value={data.time} onChange={handleChange} {...field("time")} />{errors.time && <span id="time-error" className="hata">{errors.time}</span>}</div>
    <div className="form-alani"><label htmlFor="location">Yer</label><input id="location" name="location" value={data.location} onChange={handleChange} {...field("location")} />{errors.location && <span id="location-error" className="hata">{errors.location}</span>}</div>
    <div className="form-alani"><label htmlFor="capacity">Kontenjan</label><input id="capacity" name="capacity" type="number" min="1" max="1000" value={data.capacity} onChange={handleChange} {...field("capacity")} />{errors.capacity && <span id="capacity-error" className="hata">{errors.capacity}</span>}</div>
    <div className="form-alani"><label htmlFor="description">Açıklama</label><textarea id="description" name="description" rows={5} value={data.description} onChange={handleChange} {...field("description")} />{errors.description && <span id="description-error" className="hata">{errors.description}</span>}</div>
    <button type="submit">{submitLabel}</button>{message && <p className={Object.keys(errors).length ? "hata" : "basari-mesaj"} role="status">{message}</p>}
  </form></section>;
}
