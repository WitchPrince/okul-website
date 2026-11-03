# Kampüs Etkinlikleri — Sprint 6 + Vize Teslimi

**Öğrenci:** Işıkhan IŞIK  
**Öğrenci numarası:** 2416501044  
**Canlı adres:** https://isikhanisik-frontend.vercel.app/

## Proje

Kampüs etkinliklerini listeleyen, arayan, detaylarını gösteren ve yönetim panelinden ekleme/güncelleme/silme işlemlerini yapan React + TypeScript tek sayfalı uygulaması.

## Kurulum ve çalıştırma

```bash
cd frontend
npm install
npm run dev
```

Üretim derlemesi ve yerel önizleme:

```bash
npm run build
npm run preview
```

## Route listesi (10 adres)

| Adres | Sayfa |
|---|---|
| `/` | HomePage |
| `/events` | EventsPage |
| `/events/:id` | EventDetailPage |
| `/login` | LoginPage |
| `/register` | RegisterPage |
| `/forgot-password` | ForgotPasswordPage |
| `/admin` | AdminPage |
| `/admin/new` | AddEventPage |
| `/admin/:id/edit` | EditEventPage |
| `*` | NotFoundPage |

Detay sayfasında `useParams()` ile URL'deki `id` okunur; etkinlik bulunamazsa `NotFoundPage` gösterilir. Menü bağlantılarında `NavLink`, sayfa içi bağlantılarda `Link` kullanılır. Vercel'in doğrudan alt route isteklerini React uygulamasına yönlendirmesi için `vercel.json` rewrite kuralı eklenmiştir.

## Klasör yapısı

```text
frontend/src/
  components/
    layout/       Header, Navigation, Footer, SiteLayout
    events/       EventCard, EventList, EventFilter, EventDetail
    forms/        EventForm
  context/        EventsContext
  pages/          HomePage, EventsPage, EventDetailPage, AddEventPage,
                  EditEventPage, AdminPage, LoginPage, RegisterPage,
                  ForgotPasswordPage, NotFoundPage
  data/           events.ts
  types/          campus-event.ts
  utils/          filter-events.ts, format-date.ts, validate-event.ts
  App.tsx
  App.css
  main.tsx
```

## State ve Context

`EventsProvider` tüm route'ları sarar. `useEvents()` hook'u üzerinden `events`, `addEvent`, `updateEvent` ve `deleteEvent` fonksiyonları kullanılır. Ekleme yeni dizi oluşturur, güncelleme `map()` ile yalnızca eşleşen kaydı değiştirir, silme `filter()` ile eşleşen kaydı çıkarır. React state değişikliği ekranı yeniden render eder; `push()`/`splice()` ile mevcut diziyi doğrudan değiştirme yapılmaz.

Bu teslimde veri kalıcı bir sunucuya veya veritabanına yazılmaz; sayfa yenilendiğinde başlangıçtaki örnek veriler yüklenir. Context, uygulama açıkken route'lar arasında ortak veriyi taşır.

## Formlar ve doğrulama

- Etkinlik formu controlled formdur: her alan `value` ve `onChange` ile tek `EventFormData` state nesnesine bağlıdır. `handleChange`, alanın `name` değerini kullanarak ilgili özelliği günceller.
- `validateEvent()` alan kurallarını kontrol eder: etkinlik adı en az 3 karakter, kategori seçilmiş, tarih/saat/yer boş değil, kontenjan 1–1000 arasında tam sayı, açıklama en az 10 karakter olmalıdır.
- Gönderimde `preventDefault()` çağrılır, doğrulama hataları state'e yazılır ve alanların altında gösterilir. Hata yoksa `onSubmit(data)` çalışır.
- Ekleme ve güncelleme aynı `EventForm` bileşenini kullanır; başlangıç verisi farklıdır. Güncelleme route'u URL'deki etkinlik kimliğini bulur.
- Giriş, kayıt ve şifremi unuttum sayfaları controlled input ve hata/başarı mesajları içerir. Bunlar eğitim amaçlı ön yüz demolarıdır; gerçek kimlik doğrulama, e-posta gönderimi veya backend bulunmaz.

## Yönetim ve mobil görünüm

`/admin` sayfasında etkinlikler tablo olarak listelenir. Her satırda düzenleme ve silme eylemi vardır; silme öncesinde `window.confirm()` ile onay alınır. Dar ekranlarda tablo satırları CSS ile kart görünümüne dönüşür.

## Vercel ayarları

- Root Directory: `frontend`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- `frontend/vercel.json`, `/events/...` ve diğer alt adreslerin doğrudan açılabilmesi için `/index.html` rewrite kuralını içerir.

## Teslim öncesi kontrol listesi

1. Tüm linkler çalışıyor.
2. 10 route tanımlı.
3. Klasör ve dosya yapısı yönergeye uygun.
4. Context kullanılıyor ve gerekli tüm sayfalara bağlandı.
5. Ekleme, güncelleme ve silme öncesi/sonrası ekran davranışı doğru.
6. Arama ve kategori filtreleme çalışıyor.
7. Form doğrulaması ve alan altı hata mesajları çalışıyor.
8. Vercel'de `isimsoyisim-frontend.vercel.app` biçiminde canlı adres ayarlanmalı (mevcut canlı URL proje ayarlarında ayrıca kontrol edilmeli).
9. Son çalışma GitHub'a gönderilmeli.
10. README, canlı URL ve route listesini içeriyor.
11. Mobil görünüm kontrol edilmeli.
12. CSS bozulması olmamalı.
13. Etkinlik ekleme, giriş, kayıt ve şifremi unuttum formları doğrulanmalı.

> Not: Bu çalışma istemci tarafı bir ders projesidir. Veriler backend/veritabanı olmadan React state içinde tutulur; kimlik doğrulama ve e-posta işlemleri demo olarak gösterilir.
