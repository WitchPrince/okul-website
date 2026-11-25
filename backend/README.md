# Kampüs Etkinlikleri API — Sprint 9

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

Sprint 8 kayıtlarının tarihleri metin olarak saklanıyordu; model değişikliği mevcut verileri kendiliğinden dönüştürmez. Bu kayıtları korumanız gerekiyorsa seed çalıştırmadan önce yedekleyip ayrıca dönüştürün. Yeni seed verisinde iki geçmiş tarih ve Aralık 2026 tarihli dört etkinlik bulunur.

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
    utils/date.js
  requests/kampus-api.json
  requests/run-results.json
  test/date.test.js
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
| GET | `/events?search=...&category=...` | Başlık araması ve kategori filtresi | 200 | 400, 500 |
| GET | `/events/upcoming` | Bugün ve sonrası; tarih ve saat sıralı | 200 | 500 |
| GET | `/events/:id` | MongoDB kimliğiyle detay | 200 | 404, 500 |
| POST | `/events` | Etkinlik oluştur | 201 | 400, 500 |
| PATCH | `/events/:id` | Çalışıyor; kısmi güncelleme | 200 | 400, 404, 500 |
| DELETE | `/events/:id` | Çalışıyor; silme | 204, boş gövde | 404, 500 |

`GET /health`, `status: "ok"`, ISO biçiminde güncel `time` ve `student: "2416501044"` döndürür.

`GET /events` bir dizi döndürür. `/events?category=At%C3%B6lye` kategoriyi birebir filtreler; eşleşme yoksa 200 ile boş dizi gelir. Detay adresindeki `:id` yerine listeden alınan `_id` yazılır. Eski `event-2` kimliği artık geçerli değildir. Hem biçimi geçersiz kimlikler hem de veritabanında bulunmayan geçerli kimlikler 404 döndürür.

`/events?search=at%C3%B6lye` yalnızca başlıkta, büyük/küçük harf duyarsız arar. Regex özel karakterleri normal metin olarak değerlendirilir. `search` ve `category` birlikte verilirse her iki koşul uygulanır. Tekrarlanan/dizi biçimindeki sorgu değerleri 400 döndürür.

`/events/upcoming`, bugünün UTC başlangıcından itibaren etkinlikleri getirir. Aynı gün içindeki sonuçlar `time` alanına göre artan sıralanır; saatleri `HH:mm` biçiminde gönderin. Route, `/:id` adresinden önce tanımlıdır.

### Model kuralları

| Alan | Kural |
|---|---|
| `title` | Zorunlu; trim; 3–100 karakter |
| `category` | Zorunlu; Seminer, Atölye, Söyleşi veya Yarışma |
| `date` | Zorunlu; API'de GG-AA-YYYY, MongoDB'de Date |
| `capacity` | Sayı; en az 0; varsayılan 0 |
| `time` | Metin; varsayılan boş metin |
| `location` | Metin; trim; varsayılan boş metin |
| `description` | Metin; trim; en fazla 500 karakter; varsayılan boş metin |

MongoDB `_id` üretir; Mongoose `createdAt` ve `updatedAt` alanlarını otomatik tutar. Yanıtta sürüm alanı `__v` de bulunabilir. API'de `image` alanı yoktur. Tarihler UTC gece yarısı olarak saklanır; JSON yanıtında `20-12-2026` gibi görünür. `2026-12-20` veya `31-02-2026` gibi biçimi/takvim değeri yanlış tarihler 400 döndürür. Zaman damgaları ISO biçiminde kalır.

### Yeni etkinlik

`POST /events` için `Content-Type: application/json` ve örnek gövde:

```json
{
  "title": "Kampüs İçin Mini API Atölyesi",
  "category": "Atölye",
  "date": "08-12-2026",
  "time": "13:00",
  "location": "Yazılım Kulübü Odası",
  "description": "Birlikte küçük bir etkinlik API'si hazırlayacağız.",
  "capacity": 24
}
```

Başarılı istek 201 ile kaydedilen nesneyi döndürür. İstemciden gelen `_id` veya zaman damgaları kullanılmaz. Eksik zorunlu alan, yanlış kategori, kısa başlık ve negatif kapasite gibi schema hataları 400 döndürür.

### Güncelleme ve silme

`PATCH /events/<_id>` için örnek gövde:

```json
{
  "capacity": 55,
  "date": "25-12-2026"
}
```

Yanıt 200 ile güncel kayıttır. Gönderilmeyen alanlar korunur; schema doğrulaması ve trim güncellemelerde de çalışır. Boş gövde `Body is empty` ile 400 döndürür. `_id`, `createdAt`, `updatedAt`, `__v` alanları değiştirilemez; bu alanları göndermek 400 döndürür. Bilinmeyen alanlar ve `$set`, `$unset` gibi istemci operatörleri de 400 ile reddedilir.

`DELETE /events/<_id>` başarılıysa 204 döndürür; yanıt JSON değildir ve gövdesi boştur. Aynı kimliği tekrar silmek veya silinen kaydı GET/PATCH ile istemek 404 döndürür.

### Hatalar

Yanıt yapısı `error.message` biçimindedir. `/events/yok` için:

```json
{
  "error": {
    "message": "Event not found"
  }
}
```

Schema doğrulama ve tarih dönüştürme hataları 400 ve hata mesajıyla; bozuk JSON 400 ile; bilinmeyen adresler 404 ve `Route not found` ile yanıtlanır. Beklenmeyen hatalar 500 ve `Server error` döndürür; bağlantı bilgileri istemciye gönderilmez.

## Postman ile test

1. Ayrı bir geliştirme/test veritabanında `npm run seed` komutunu iki kez çalıştırın.
2. `npm run dev` ile sunucuyu başlatın.
3. Postman'e `requests/kampus-api.json` dosyasını aktarın.
4. Collection Runner ile 18 isteği sırasıyla çalıştırın. Hedef: 45 test, 0 hata.

| # | İstek | Beklenen |
|---|---|---|
| 1 | GET `/health` | 200, durum + zaman + öğrenci numarası |
| 2 | GET `/events` | 200, altı kayıt ve zaman damgaları |
| 3 | GET `/events/{{eventId}}` | 200, listeden alınan `_id` |
| 4 | GET `/events/yok` | 404, error.message |
| 5 | POST `/events` | 201, yeni `_id` ve zaman damgaları |
| 6 | POST `/events` (yalnızca title) | 400, doğrulama mesajı |
| 7 | POST yanlış tarih biçimi | 400 |
| 8 | PATCH kapasite | 200, diğer alanlar korunur |
| 9 | PATCH tarih | 200, GG-AA-YYYY |
| 10 | PATCH boş gövde | 400 |
| 11 | PATCH yanlış kategori | 400 |
| 12 | PATCH `_id` | 400 |
| 13 | PATCH olmayan kimlik | 404 |
| 14 | GET başlık araması | 200, eşleşen başlıklar |
| 15 | GET arama + kategori | 200, iki koşul birlikte |
| 16 | GET `/events/upcoming` | 200, geçmiş tarihler hariç |
| 17 | DELETE yeni kayıt | 204, boş gövde |
| 18 | DELETE aynı kayıt | 404 |

Liste isteği `eventId`, oluşturma isteği `newId` koleksiyon değişkenini kaydeder. PATCH ve DELETE yeni test kaydıyla çalışır; seed kayıtları değişmez. Başarılı tam çalıştırma sonunda yine altı kayıt kalır; koleksiyon seed'i tekrar çalıştırmadan yeniden denenebilir. Yarım kalan bir çalıştırma test kaydı bırakabilir.

## Newman

Newman'i bir kez kurun:

```bash
npm install -g newman
```

Backend açıkken resmî koleksiyonu çalıştırın:

```bash
newman run https://webdersi.vercel.app/test.json
```

Yerel koleksiyonu çalıştırıp gerçek sonucu kaydetmek için:

```bash
newman run requests/kampus-api.json -r cli,json --reporter-json-export requests/run-results.json
```

Postman Runner'ın Export Results seçeneği de kullanılabilir. Repodaki `requests/run-results.json`, ayrı geçici MongoDB üzerinde resmî koleksiyondan alınmış Newman sonucudur; Atlas verilerine karşı çalıştırılmamıştır. Kontrol sırasında hocanın güncel koleksiyonu esas alınır.

Veritabanı gerektirmeyen tarih/model testleri:

```bash
npm test
```

Ek olarak yanlış kategori, kısa başlık, negatif kapasite ve biçimi doğru ama mevcut olmayan bir `_id` deneyin. Hatalı istekten sonra `/health` hâlâ 200 dönmelidir.

### Kalıcılık testi

1. Başarılı POST yanıtındaki `_id` değerini not alın.
2. Sunucuyu Ctrl+C ile durdurup yeniden başlatın; bu arada seed çalıştırmayın.
3. `/events` listesinde yedi kayıt olduğunu ve `/events/<kaydedilen_id>` isteğinin 200 döndüğünü doğrulayın.
4. Atlas'ta **Browse Collections → kampus → events** altında kaydı kontrol edin.

## Teslim

Frontend ve Vercel ayarları korunur; backend bu sprintte canlıya alınmaz. Git geçmişinde gerçek Atlas adresi/şifresi, takip edilen `.env` veya `node_modules/` bulunmamalıdır. Değişiklikleri aşamalı commit'lerle GitHub'a gönderin. Sprint 9'da ders sitesine ayrıca teslim yoktur; bilgisayarınızı getirin ve derste backend açıkken resmî Newman koleksiyonunu çalıştırın. GitHub'a gönderilen kod ile çalışan kod aynı olmalıdır.
