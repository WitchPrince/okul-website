import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");

if (form) {
  const mesaj = document.querySelector("#form-mesaj");
  const mode = form.dataset.mode;
  const id = new URLSearchParams(location.search).get("id");

  const alanlar = {
    ad: form.elements.ad,
    kategori: form.elements.kategori,
    tarih: form.elements.tarih,
    saat: form.elements.saat,
    yer: form.elements.yer,
    kontenjan: form.elements.kontenjan,
    aciklama: form.elements.aciklama,
  };

  function hataTemizle() {
    Object.entries(alanlar).forEach(([key, alan]) => {
      alan.removeAttribute("aria-invalid");
      const hata = document.querySelector(`#${key}-hata`);
      if (hata) hata.textContent = "";
    });

    mesaj.className = "";
    mesaj.innerHTML = "";
  }

  function hataYaz(key, text) {
    const alan = alanlar[key];
    const hata = document.querySelector(`#${key}-hata`);

    if (alan) alan.setAttribute("aria-invalid", "true");
    if (hata) hata.textContent = text;
  }

  function getData() {
    const fd = new FormData(form);

    return {
      title: fd.get("ad").trim(),
      category: fd.get("kategori"),
      date: fd.get("tarih").trim(),
      time: fd.get("saat"),
      location: fd.get("yer").trim(),
      capacity: fd.get("kontenjan").trim(),
      description: fd.get("aciklama").trim(),
    };
  }

  function validate(data) {
    const errors = {};

    if (data.title.length < 3) {
      errors.ad = "En az 3 karakter olmalı.";
    }

    if (!data.category) {
      errors.kategori = "Bir kategori seçin.";
    }

    if (!/^\d{2}-\d{2}-\d{4}$/.test(data.date)) {
      errors.tarih = "GG-AA-YYYY biçiminde girin.";
    }

    if (!data.time) {
      errors.saat = "Saat boş bırakılamaz.";
    }

    if (!data.location) {
      errors.yer = "Yer boş bırakılamaz.";
    }

    if (data.capacity !== "") {
      const capacity = Number(data.capacity);
      if (!Number.isInteger(capacity) || capacity < 1 || capacity > 1000) {
        errors.kontenjan = "Kontenjan 1–1000 arasında olmalı.";
      }
    }

    if (!data.description) {
      errors.aciklama = "Açıklama boş bırakılamaz.";
    }

    return errors;
  }

  function fillForm(event) {
    alanlar.ad.value = event.title;
    alanlar.kategori.value = event.category;
    alanlar.tarih.value = event.date;
    alanlar.saat.value = event.time;
    alanlar.yer.value = event.location;
    alanlar.kontenjan.value = event.capacity;
    alanlar.aciklama.value = event.description;
  }

  if (mode === "guncelle") {
    const event = events.find((item) => item.id === id);

    if (!event) {
      form.outerHTML = `
        <div class="uyari">
          <h2>Etkinlik bulunamadı</h2>
          <p>Güncellemek için geçerli bir etkinlik id'si gerekli.</p>
          <p><a href="etkinlikler.html">Etkinliklere git →</a></p>
        </div>
      `;
    } else {
      fillForm(event);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hataTemizle();

    const data = getData();
    const errors = validate(data);

    Object.entries(errors).forEach(([key, text]) => {
      hataYaz(key, text);
    });

    if (Object.keys(errors).length > 0) {
      mesaj.className = "hata-mesaj";
      mesaj.textContent = "Formda hatalı alanlar var.";
      return;
    }

    mesaj.className = "basari-mesaj";
    mesaj.innerHTML = `
      <strong>${mode === "guncelle" ? "Etkinlik güncellendi." : "Etkinlik başarıyla hazırlandı."}</strong>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;

    console.log(data);
  });
}
