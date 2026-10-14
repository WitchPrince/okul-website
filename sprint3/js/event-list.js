import { events } from "./data.js";

const list = document.querySelector("#etkinlik-listesi");
const sonucSatiri = document.querySelector("#sonuc");
const arama = document.querySelector("#arama");
const kategoriFiltre = document.querySelector("#kategori-filtre");
const filtreFormu = document.querySelector("#filtre-formu");

function parseDate(date) {
  const [day, month, year] = date.split("-");
  return new Date(`${year}-${month}-${day}T00:00:00`);
}

function formatDate(date) {
  return parseDate(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function createCard(event) {
  return `
    <article class="kart">
      <h2>${event.title}</h2>
      <p class="meta">${event.category} · ${formatDate(event.date)}</p>
      <p>${event.location}</p>
      <a class="detay-link" href="etkinlik-detay.html?id=${encodeURIComponent(event.id)}">
        Detayları gör →
      </a>
    </article>
  `;
}

function render(dizi) {
  list.innerHTML = dizi.map(createCard).join("");

  if (sonucSatiri) {
    sonucSatiri.textContent =
      dizi.length === 0
        ? "Aradığınız etkinlik bulunamadı."
        : `${dizi.length} etkinlik listeleniyor.`;
  }
}

function populateCategories() {
  if (!kategoriFiltre) return;

  const categories = [...new Set(events.map((event) => event.category))];

  kategoriFiltre.innerHTML =
    `<option value="">Tümü</option>` +
    categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("");
}

function filtrele() {
  const aranan = arama.value.toLocaleLowerCase("tr-TR").trim();
  const kategori = kategoriFiltre.value;

  const sonuc = events.filter((event) => {
    const metin = [
      event.title,
      event.category,
      event.location,
      event.description,
    ]
      .join(" ")
      .toLocaleLowerCase("tr-TR");

    const metinUyuyor = metin.includes(aranan);
    const kategoriUyuyor = !kategori || event.category === kategori;

    return metinUyuyor && kategoriUyuyor;
  });

  render(sonuc);
}

if (filtreFormu) {
  populateCategories();

  filtreFormu.addEventListener("submit", (event) => {
    event.preventDefault();
    filtrele();
  });

  arama.addEventListener("input", filtrele);
  kategoriFiltre.addEventListener("change", filtrele);

  render(events);
} else if (list.dataset.limit) {
  const yaklasan = [...events]
    .sort((a, b) => parseDate(a.date) - parseDate(b.date))
    .slice(0, Number(list.dataset.limit));

  render(yaklasan);
} else {
  render(events);
}
