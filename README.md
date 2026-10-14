Canlı site: https://okul-website.vercel.app/

# Kampüs Etkinlikleri — Sprint 4

**Öğrenci:** Işıkhan IŞIK  
**Öğrenci numarası:** 2416501044

## Proje yapısı

- `sprint1/`, `sprint2/`, `sprint3/`: önceki sprintler; Sprint 4 için değiştirilmedi.
- `frontend/package.json`: Vite, React ve TypeScript bağımlılıkları ile komutlar.
- `frontend/index.html`: React uygulamasının bağlandığı tek HTML dosyası (`#root`).
- `frontend/src/main.tsx`: React uygulamasını başlatır.
- `frontend/src/App.tsx`: Ana sayfa, etkinlik listesi, detay, ekle ve güncelle görünümlerini tek bileşende yönetir.
- `frontend/src/App.css`: Sprint 3'teki öğrenciye özel stiller.
- `frontend/src/index.css`: Genel stil dosyası; bilerek boş tutuldu.
- `frontend/src/types/campus-event.ts`: Etkinlik ve kategori TypeScript tipleri.
- `frontend/src/data/events.ts`: Tipli altı örnek etkinlik.
- `frontend/src/utils/filter-events.ts`: Arama, kategori filtresi ve ID ile etkinlik bulma saf fonksiyonları.
- `frontend/public/afis.svg`: Etkinlik detayında kullanılan afiş.
- `frontend/vite.config.ts`: Vite için React eklentisi.

## Yerelde çalıştırma

```bash
cd frontend
npm install
npm run dev
```

Build ve önizleme:

```bash
npm run build
npm run preview
```

Sprint 4 gereği form yalnızca görünüm içindir; kaydetme/güncelleme mantığı uygulanmaz. Sayfa geçişleri React state ile yapılır, adres çubuğu değişmez. React Router bu sprintte kullanılmaz.

## Vercel

- Root Directory: `frontend`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
