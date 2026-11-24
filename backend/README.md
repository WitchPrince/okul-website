# Kampüs Etkinlikleri API — Sprint 8

**Öğrenci:** Işıkhan IŞIK  
**Öğrenci numarası:** 2416501044

Node.js + Express API'si, etkinlikleri Mongoose üzerinden MongoDB'de saklar. Frontend ve Vercel ayarları değişmedi; frontend henüz API'ye bağlı değildir. Gerçek kimlik doğrulama yoktur.

## Kurulum

Node.js 22 veya daha yeni bir sürüm ve erişilebilir bir MongoDB veritabanı gerekir. Repo kökünden:

```bash
cd backend
npm install
cp .env.example .env
```

`.env` zaten varsa üzerine kopyalamayın. Dosyadaki `MONGODB_URI` değerini kendi geliştirme veritabanınıza göre ayarlayın, ardından:

```bash
npm run seed
npm run dev
```

**Seed, bağlı veritabanındaki bütün etkinlikleri silip altı örnek kayıt ekler. Yalnızca geliştirme/test veritabanında çalıştırın.** Her çalıştırma yeni `_id` değerleri üretir. Seed sunucu başlangıcında otomatik çalışmaz.

`dev` dosya değişikliklerini izler; izleme olmadan `npm start` kullanılabilir. Komutları `backend/` içinde çalıştırın. Sunucu ancak MongoDB bağlantısı kurulunca portu dinler.

API adresi `http://localhost:3000` olur. `/health` ve `/events` JSON döndürür; `/` tanımlı olmadığından 404 verir. Görsel site için frontend ayrıca başlatılmalıdır.

## Ortam değişkenleri

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/kampus
```

Örnek adres yerel MongoDB içindir; Atlas kullanıyorsanız gerçek bağlantı adresini yalnızca `.env` dosyanıza yazın. `MONGODB_URI` zorunludur; `PORT` verilmezse 3000 kullanılır. Dışarıdan verilen ortam değişkenleri de desteklenir; değerlendirme farklı bir test veritabanı verebilir.

`.env` ve `node_modules/` Git dışında tutulur. Gerçek Atlas adresini veya şifreyi koda, README'ye, `.env.example` dosyasına, Postman koleksiyonuna ya da ekran görüntülerine koymayın. Bağlantı logunda yalnızca host ve veritabanı adı bulunur. Şifre yanlışlıkla commit edildiyse dosyadan silmek yeterli değildir; Atlas'tan şifreyi değiştirin.

## Atlas hazırlığı

1. Atlas'ta ücretsiz bir cluster oluşturun ve hazır olmasını bekleyin.
2. **Database Access** bölümünden yalnızca bu proje için bir veritabanı kullanıcısı oluşturun. Bu kullanıcı Atlas hesabınızdan ayrıdır.
3. **Network Access** bölümünde kendi IP adresinize izin verin. IP değiştiğinde bu kaydı güncelleyin.
4. Cluster altında **Connect → Drivers → Node.js** yolundan bağlantı adresini alın.
5. Şifre yer tutucusunu kendi şifrenizle değiştirin; özel karakterleri URL biçiminde kodlayın. Adreste veritabanı adını `kampus` olarak, varsa `?` ile başlayan seçeneklerden önce belirtin.
6. Adresi `backend/.env` içinde `MONGODB_URI` değeri olarak saklayın. Gerçek adresi paylaşmayın.

Bağlantı kurulamazsa cluster durumunu, kullanıcı bilgilerini ve izin verilen IP adresini kontrol edin. Okul ağı erişimi engelliyorsa farklı bir ağ deneyin. Tüm IP'lere erişim açmak yerine mümkün olduğunda kendi IP'nizi kullanın.

## Dosyalar

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

`app.js` middleware ve route'ları bağlar. `server.js` veritabanı bağlantısını bekleyip sunucuyu başlatır. Controller, `Event` modeliyle sorgu yapar; bellek içi etkinlik dizisi kullanmaz. `seed.js` örnek veriyi yükleyip bağlantıyı kapatır.

## REST sözleşmesi

| Method | Endpoint | Amaç | Başarılı | Hata |
|---|---|---|---|---|
| GET | `/health` | Sunucu durumu | 200 | — |
| GET | `/events` | Tarihe göre artan etkinlik listesi | 200 | 400, 500 |
| GET | `/events/:id` | MongoDB kimliğiyle detay | 200 | 404, 500 |
| POST | `/events` | Etkinlik oluştur | 201 | 400, 500 |

PATCH ve DELETE henüz uygulanmadı.

`GET /health`, `status: "ok"`, ISO biçiminde güncel `time` ve `student: "2416501044"` döndürür.

`GET /events` bir dizi döndürür. `/events?category=At%C3%B6lye` kategoriyi birebir filtreler; eşleşme yoksa 200 ile boş dizi gelir. Detay adresindeki `:id` yerine listeden alınan `_id` yazılır. Eski `event-2` kimliği artık geçerli değildir. Hem biçimi geçersiz kimlikler hem de veritabanında bulunmayan geçerli kimlikler 404 döndürür.

### Model kuralları

| Alan | Kural |
|---|---|
| `title` | Zorunlu; trim; 3–100 karakter |
| `category` | Zorunlu; Seminer, Atölye, Söyleşi veya Yarışma |
| `date` | Zorunlu metin |
| `capacity` | Sayı; en az 0; varsayılan 0 |
| `time` | Metin; varsayılan boş metin |
| `location` | Metin; trim; varsayılan boş metin |
| `description` | Metin; trim; en fazla 500 karakter; varsayılan boş metin |

MongoDB `_id` üretir; Mongoose `createdAt` ve `updatedAt` alanlarını otomatik tutar. Yanıtta sürüm alanı `__v` de bulunabilir. API'de `image` alanı yoktur. Tarih için ek takvim/biçim doğrulaması uygulanmaz.

### Yeni etkinlik

`POST /events` için `Content-Type: application/json` ve örnek gövde:

```json
{
  "title": "Kampüs İçin Mini API Atölyesi",
  "category": "Atölye",
  "date": "2026-12-08",
  "time": "13:00",
  "location": "Yazılım Kulübü Odası",
  "description": "Birlikte küçük bir etkinlik API'si hazırlayacağız.",
  "capacity": 24
}
```

Başarılı istek 201 ile kaydedilen nesneyi döndürür. İstemciden gelen `_id` veya zaman damgaları kullanılmaz. Eksik zorunlu alan, yanlış kategori, kısa başlık ve negatif kapasite gibi schema hataları 400 döndürür.

### Hatalar

Yanıt yapısı `error.message` biçimindedir. `/events/yok` için:

```json
{
  "error": {
    "message": "Event not found"
  }
}
```

Schema doğrulama hataları 400 ve doğrulama mesajıyla; bozuk JSON 400 ile; bilinmeyen adresler 404 ve `Route not found` ile yanıtlanır. Beklenmeyen hatalar 500 ve `Server error` döndürür; bağlantı bilgileri istemciye gönderilmez.

## Postman ile test

1. Ayrı bir geliştirme/test veritabanında `npm run seed` komutunu iki kez çalıştırın.
2. `npm run dev` ile sunucuyu başlatın.
3. Postman'e `requests/kampus-api.json` dosyasını aktarın.
4. Altı isteği sırasıyla çalıştırın:

| # | İstek | Beklenen |
|---|---|---|
| 1 | GET `/health` | 200, durum + zaman + öğrenci numarası |
| 2 | GET `/events` | 200, altı kayıt ve zaman damgaları |
| 3 | GET `/events/{{eventId}}` | 200, listeden alınan `_id` |
| 4 | GET `/events/yok` | 404, error.message |
| 5 | POST `/events` | 201, yeni `_id` ve zaman damgaları |
| 6 | POST `/events` (yalnızca title) | 400, doğrulama mesajı |

Liste isteği `eventId`, oluşturma isteği `createdEventId` koleksiyon değişkenini kaydeder. Beşinci istekten sonra listede yedi kayıt olur. Koleksiyonu tekrar baştan çalıştırmadan önce test verisini seed ile sıfırlayın; yalnızca sunucuyu yeniden başlatmak kayıtları silmez.

Ek olarak yanlış kategori, kısa başlık, negatif kapasite ve biçimi doğru ama mevcut olmayan bir `_id` deneyin. Hatalı istekten sonra `/health` hâlâ 200 dönmelidir.

### Kalıcılık testi

1. Başarılı POST yanıtındaki `_id` değerini not alın.
2. Sunucuyu Ctrl+C ile durdurup yeniden başlatın; bu arada seed çalıştırmayın.
3. `/events` listesinde yedi kayıt olduğunu ve `/events/<kaydedilen_id>` isteğinin 200 döndüğünü doğrulayın.
4. Atlas'ta **Browse Collections → kampus → events** altında kaydı kontrol edin.

## Teslim

Frontend ve Vercel ayarları korunur; backend bu sprintte canlıya alınmaz. Git geçmişinde gerçek Atlas adresi/şifresi, takip edilen `.env` veya `node_modules/` bulunmamalıdır. Değişiklikleri aşamalı commit'lerle GitHub'a gönderin ve repo bağlantısını ders sitesine ekleyin.
