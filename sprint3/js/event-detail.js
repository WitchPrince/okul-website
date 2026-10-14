import { events } from "./data.js";

const container = document.querySelector("#detay");
const id = new URLSearchParams(location.search).get("id");
const event = events.find((item) => item.id === id);

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

if (!event) {
  document.title = "Etkinlik bulunamadı";

  container.innerHTML = `
    <div class="uyari">
      <h2>Etkinlik bulunamadı</h2>
      <p>Geçersiz veya eksik bir etkinlik id'si verdiniz.</p>
      <p><a href="etkinlikler.html">← Listeye dön</a></p>
    </div>
  `;
} else {
  document.title = event.title;

  container.innerHTML = `
    <article class="detay">
      <div class="detay-grid">
        <figure class="afis">
          <img src="afis.jpg" alt="${event.title} etkinlik afişi">
          <figcaption>Şekil 1: etkinlik afişi</figcaption>
        </figure>

        <div>
          <h2>Etkinlik Künyesi</h2>
          <dl class="kunye">
            <dt>Tarih</dt>
            <dd>${formatDate(event.date)}, ${event.time}</dd>

            <dt>Yer</dt>
            <dd>${event.location}</dd>

            <dt>Kategori</dt>
            <dd>${event.category}</dd>

            <dt>Kontenjan</dt>
            <dd>${event.capacity}</dd>
          </dl>
        </div>
      </div>

      <section class="aciklama">
        <h2>Açıklama</h2>
        <p>${event.description}</p>
      </section>

      <div class="detay-eylem">
        <a href="etkinlikler.html">← Listeye dön</a>
        <a href="etkinlik-guncelle.html?id=${encodeURIComponent(event.id)}">
          Bu etkinliği güncelle
        </a>
      </div>
    </article>
  `;
}
