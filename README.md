Canlı site: https://okul-website.vercel.app/

# Kampüs Etkinlikleri — Sprint 5

**Öğrenci:** Işıkhan IŞIK  
**Öğrenci numarası:** 2416501044

## Proje yapısı

- `sprint1/`, `sprint2/`, `sprint3/`: önceki sprintlerin teslimleri; korunmuştur.
- `frontend/`: Sprint 4 uygulamasının Sprint 5 bileşen mimarisine ayrılmış React + TypeScript sürümü.
- `frontend/src/App.tsx`: sayfa state'ini, seçili etkinliği, arama/kategori state'ini ve bileşenler arası callback'leri yönetir; 86 satırla sayfa akışını üstlenir, kart ve form JSX'ini bileşenlere bırakır.
- `frontend/src/components/layout/Header.tsx`: başlık ve açıklamayı props ile gösterir.
- `frontend/src/components/layout/Navigation.tsx`: menüyü gösterir; tıklamaları `onNavigate` callback'i ile `App` bileşenine bildirir.
- `frontend/src/components/layout/Footer.tsx`: öğrenci bilgisi içeren alt alanı gösterir.
- `frontend/src/components/events/EventCard.tsx`: tek etkinlik kartını gösterir; detay açma isteğini `onShowDetail` ile bildirir.
- `frontend/src/components/events/EventList.tsx`: etkinlik dizisini `EventCard` bileşenlerine dönüştürür ve boş liste mesajını gösterir.
- `frontend/src/components/events/EventFilter.tsx`: arama ve kategori alanlarını controlled input olarak gösterir; değişiklikleri callback'lerle `App`'e iletir.
- `frontend/src/components/events/EventDetail.tsx`: seçili etkinliğin ayrıntılarını gösterir; geri ve güncelle eylemlerini callback'lerle bildirir.
- `frontend/src/components/forms/EventForm.tsx`: ekle/güncelle formunun görünümünü oluşturur; gönderimde sayfa yenilenmesini engeller ve `onSubmit` çağırır. Bu sprintte kayıt/güncelleme mantığı yoktur.
- `frontend/src/types/campus-event.ts`: etkinlik ve kategori tipleri.
- `frontend/src/types/page.ts`: sayfa adlarının `PageName` tipi.
- `frontend/src/data/events.ts`: tipli altı örnek etkinlik.
- `frontend/src/utils/filter-events.ts`: arama, kategori filtresi ve ID ile etkinlik bulma fonksiyonları.
- `frontend/src/utils/format-date.ts`: tarih biçimlendirme ve sıralama için tarih dönüştürme fonksiyonları.
- `frontend/src/App.css`: Sprint 4'teki öğrenciye özel görünüm ve responsive stiller.
- `frontend/src/main.tsx`: React uygulamasını başlatır.
- `frontend/index.html`: React uygulamasının bağlandığı HTML dosyası.
- `frontend/public/afis.svg`: etkinlik detayında kullanılan afiş.

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

## Sprint 5 notları

- `App.tsx` state'in sahibi olarak kalır; bileşenler props ile veri alır ve callback'lerle olay bildirir.
- `EventList` her kartı etkinliğin benzersiz `event.id` değeriyle anahtarlayıp render eder.
- Sayfa geçişleri React state ile yapılır; URL değişmez ve React Router kullanılmaz.
- Form bu sprintte yalnızca görünüm içindir; Kaydet sayfayı yenilemez, ancak veri kaydetmez.

## Vercel

- Root Directory: `frontend`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Kaynakları GitHub'a gönderdikten sonra Vercel yeni commit'i otomatik deploy eder.
