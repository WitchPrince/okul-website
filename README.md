# Kampüs Etkinlikleri — Sprint 8

**Öğrenci:** Işıkhan IŞIK  
**Öğrenci numarası:** 2416501044  
**Canlı adres:** https://isikhanisik-frontend.vercel.app/

## Proje

Kampüs etkinliklerini listeleyen, arayan, detaylarını gösteren ve yönetim panelinden ekleme/güncelleme/silme işlemlerini yapan React + TypeScript tek sayfalı uygulaması.

Sprint 7'de mevcut frontend korunarak yanına Node.js + Express ile ayrı bir `backend/` uygulaması eklendi. Sprint 8'de backend verileri MongoDB ve Mongoose ile kalıcı hale getirildi. Backend, etkinlik listeleme, detay ve oluşturma işlemlerini JSON olarak sunar. Frontend henüz API'ye bağlı değildir; kendi Context verisini kullanmaya devam eder.

## Kurulum ve çalıştırma

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Terminalde gösterilen adresi açın; varsayılan adres `http://localhost:5173` olur.

Üretim derlemesi ve yerel önizleme:

```bash
npm run build
npm run preview
```

### Backend

Repo kökünden ayrı bir terminalde:

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

Node.js 22 veya üstü kullanılmalıdır. Komutlardan önce MongoDB hazır olmalı ve `backend/.env` içindeki `MONGODB_URI` ayarlanmalıdır. `.env` zaten varsa üzerine kopyalamayın; mevcut dosyaya değişkeni ekleyin. `npm run seed` bağlı veritabanındaki tüm etkinlikleri silip altı örnek kayıt ekler; yalnızca geliştirme/test veritabanında kullanın. API `http://localhost:3000` adresinde çalışır. `/health` sunucu durumunu, zamanı ve öğrenci numarasını döndürür. Frontend ve Vercel ayarları değişmedi; backend bu sprintte yalnızca yerelde çalıştırılır.

Tarayıcıda `http://localhost:3000/health` ve `http://localhost:3000/events` adresleri kontrol edilebilir. Backend'de ana sayfa tanımlı değildir; `http://localhost:3000/` adresinin JSON 404 yanıtı vermesi normaldir.

API sözleşmesi, ortam ayarları ve test adımları: [backend/README.md](backend/README.md). Altı isteklik Postman koleksiyonu: [backend/requests/kampus-api.json](backend/requests/kampus-api.json).

## Frontend route listesi (10 adres)

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

Backend dosyaları:

```text
backend/
  src/
    app.js
    server.js
    seed.js
    config/database.js
    models/event-model.js
    routes/event-routes.js
    controllers/event-controller.js
    data/seed-events.js
  requests/kampus-api.json
  .env.example
  .gitignore
  package.json
  package-lock.json
  README.md
```

## State ve Context

`EventsProvider` tüm route'ları sarar. `useEvents()` hook'u üzerinden `events`, `addEvent`, `updateEvent` ve `deleteEvent` fonksiyonları kullanılır. Ekleme yeni dizi oluşturur, güncelleme `map()` ile yalnızca eşleşen kaydı değiştirir, silme `filter()` ile eşleşen kaydı çıkarır. React state değişikliği ekranı yeniden render eder; `push()`/`splice()` ile mevcut diziyi doğrudan değiştirme yapılmaz.

Frontend verisi kalıcı bir sunucuya veya veritabanına yazılmaz; sayfa yenilendiğinde başlangıçtaki örnek veriler yüklenir. Context, uygulama açıkken route'lar arasında ortak veriyi taşır. Backend ayrı MongoDB veritabanını kullanır; POST ile eklenen kayıtlar sunucu yeniden başlatıldığında korunur.

## Formlar ve doğrulama

- Etkinlik formu controlled formdur: her alan `value` ve `onChange` ile tek `EventFormData` state nesnesine bağlıdır. `handleChange`, alanın `name` değerini kullanarak ilgili özelliği günceller.
- `validateEvent()` alan kurallarını kontrol eder: etkinlik adı en az 3 karakter, kategori seçilmiş, tarih/saat/yer boş değil, kontenjan 1–1000 arasında tam sayı, açıklama en az 10 karakter olmalıdır.
- Gönderimde `preventDefault()` çağrılır, doğrulama hataları state'e yazılır ve alanların altında gösterilir. Hata yoksa `onSubmit(data)` çalışır.
- Ekleme ve güncelleme aynı `EventForm` bileşenini kullanır; başlangıç verisi farklıdır. Güncelleme route'u URL'deki etkinlik kimliğini bulur.
- Giriş, kayıt ve şifremi unuttum sayfaları controlled input ve hata/başarı mesajları içerir. Bunlar eğitim amaçlı ön yüz demolarıdır; gerçek kimlik doğrulama veya e-posta gönderimi yoktur ve bu formlar backend'e bağlı değildir.

## Yönetim ve mobil görünüm

`/admin` sayfasında etkinlikler tablo olarak listelenir. Her satırda düzenleme ve silme eylemi vardır; silme öncesinde `window.confirm()` ile onay alınır. Dar ekranlarda tablo satırları CSS ile kart görünümüne dönüşür.

## Vercel ayarları

- Root Directory: `frontend`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- `frontend/vercel.json`, `/events/...` ve diğer alt adreslerin doğrudan açılabilmesi için `/index.html` rewrite kuralını içerir.

## Frontend kontrol listesi (Sprint 6)

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

## Sprint 8 teslim kontrolü

- Backend ayrı `backend/` klasöründe; route, controller ve veri dosyaları ayrıldı.
- PORT ve MONGODB_URI ortam değişkenlerinden okunuyor ve `.env.example` mevcut.
- `.env` ve `node_modules/` Git dışında tutulmalı.
- `/health` yanıtında öğrenci numarası `2416501044`.
- Seed verisinde özgün başlık, yer ve açıklamaları olan altı etkinlik var; MongoDB `_id` kimliklerini üretir.
- GET liste ve detay istekleri 200, bulunamayan etkinlik 404 döndürüyor.
- POST başarılıysa 201, zorunlu alan eksikse 400 döndürüyor.
- REST sözleşmesi backend README'sinde, altı istek Postman koleksiyonunda bulunuyor.
- Seed iki kez çalıştırıldığında da altı kayıt kalmalı; POST kaydı sunucu yeniden başlatıldığında korunmalı.
- Git geçmişinde gerçek Atlas bağlantı adresi veya şifre bulunmamalı.
- Teslimden önce değişiklikler aşamalı commit'lerle GitHub'a gönderilmeli; repo bağlantısı ders sitesine eklenmeli.

> Not: Frontend React state, backend ise MongoDB kullanır. Henüz frontend–API bağlantısı yoktur; kimlik doğrulama ve e-posta işlemleri demo olarak kalır.
