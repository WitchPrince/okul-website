import type { Category } from "../../types/campus-event";

interface EventFilterProps {
  searchText: string;
  category: Category | "";
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: Category | "") => void;
}

export default function EventFilter({
  searchText,
  category,
  categories,
  onSearchChange,
  onCategoryChange,
}: EventFilterProps) {
  return (
    <div className="filtre">
      <div>
        <label htmlFor="event-search">Etkinlik ara</label>
        <input
          id="event-search"
          type="search"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Etkinlik adı veya açıklama"
        />
      </div>
      <div>
        <label htmlFor="event-category">Kategori</label>
        <select
          id="event-category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value as Category | "")}
        >
          <option value="">Tüm kategoriler</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
    </div>
  );
}
