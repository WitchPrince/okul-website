# Kampüs Etkinlikleri API — Sprint 7

**Öğrenci:** Işıkhan IŞIK  
**Öğrenci numarası:** 2416501044

Etkinlikleri JSON olarak döndüren Node.js + Express uygulaması. Frontend bu sprintte değişmedi ve henüz bu API'ye bağlı değil. Veritabanı ve gerçek kimlik doğrulama sonraki sprintlerde eklenecek.

## Kurulum

Node.js 22 veya daha yeni bir sürüm kullanın. Repo kökünden:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

`dev` komutu dosyalar değişince sunucuyu yeniden başlatır. İzleme olmadan çalıştırmak için `npm start` kullanılabilir. Komutları `backend/` içinde çalıştırın.

## Ortam değişkeni

`.env.example` dosyasında gerekli ayarın örneği bulunur:

```env
PORT=3000
```

`server.js`, dotenv ile `.env` dosyasını yükler ve `process.env.PORT` değerini okur. Değer verilmezse 3000 portu kullanılır. Teslim testleri `http://localhost:3000` adresine istek gönderdiği için test sırasında bu portu kullanın.

`.env` ve `node_modules/`, `.gitignore` ile dışlanmıştır. Repoya `.env.example` ve `package-lock.json` eklenmelidir; `.env` ve `node_modules/` eklenmemelidir.

## Dosyalar

```text
backend/
  src/
    app.js
    server.js
    routes/event-routes.js
    controllers/event-controller.js
    data/events.js
  requests/kampus-api.json
  .env.example
  .gitignore
  package.json
  package-lock.json
  README.md
```

`app.js` middleware ve route'ları bağlar, `server.js` portu dinler. Route dosyası istekleri controller fonksiyonlarına yönlendirir. Etkinlik dizisi `data/events.js` içinde tutulur.

## REST sözleşmesi

| Method | Endpoint | Amaç | Başarılı | Hata | Durum |
|---|---|---|---|---|---|
| GET | `/health` | Sunucu durumunu getir | 200 | — | Sprint 7 |
| GET | `/events` | Etkinlikleri listele | 200 | — | Sprint 7 |
| GET | `/events/:id` | Tek etkinliği getir | 200 | 404 | Sprint 7 |
| POST | `/events` | Etkinlik oluştur | 201 | 400 | Sprint 7 |
| PATCH | `/events/:id` | Etkinliği güncelle | 200 | 400, 404 | Sprint 9, henüz yok |
| DELETE | `/events/:id` | Etkinliği sil | 204 | 404 | Sprint 9, henüz yok |

200 başarılı yanıt, 201 yeni kayıt, 204 içeriksiz yanıt, 400 eksik/yanlış veri, 404 bulunamayan kayıt veya adres anlamına gelir. PATCH ve DELETE bu sprintte uygulanmadı.

`GET /health`, `status: "ok"`, ISO biçiminde güncel `time` ve `student: "2416501044"` alanlarını döndürür.

`GET /events` bir dizi, `GET /events/event-2` tek bir etkinlik nesnesi döndürür. Kategori filtresi isteğe bağlıdır: `/events?category=At%C3%B6lye`. Kategori birebir eşleştirilir; eşleşme yoksa 200 ile boş dizi gelir.

Etkinlik alanları: `id`, `title`, `category`, `date`, `time`, `location`, `description`, `capacity`. Afişler frontend'de kaldığı için API'de `image` alanı yoktur.

### Yeni etkinlik

`POST /events` isteğinde `Content-Type: application/json` başlığı ve örneğin şu gövde gönderilir:

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

`title`, `category` ve `date` boş olmayan metinler olmalıdır. Sunucu `event-` önekli yeni bir kimlik üretir ve oluşturulan nesneyi 201 ile döndürür. `capacity` sayıya çevrilir; verilmezse veya sayıya çevrilemezse 0 olur. `time`, `location` ve `description` verilmezse boş metin olur. Ayrıntılı tarih, kategori ve kontenjan doğrulaması bu sprintin kapsamında değildir.

### Hata yanıtı

Hatalar `error.message` biçimindedir. Örneğin `/events/yok` için 404 yanıtı:

```json
{
  "error": {
    "message": "Event not found"
  }
}
```

Zorunlu alan eksikse 400 ve `title, category and date are required` mesajı, bilinmeyen bir adreste 404 ve `Route not found` mesajı döner. Bozuk JSON istekleri de 400 ve aynı hata yapısıyla yanıtlanır.

## Verilerin ömrü

Başlangıçta `event-1`–`event-6` kimlikli altı etkinlik vardır. Başlık, yer ve açıklamalar bu proje için yazılmıştır. POST kayıtları yalnızca bellekteki diziye eklenir; dosyaya kaydedilmez. Başarılı bir POST sonrasında liste yedi kayıt olur. Sunucu yeniden başlatıldığında eklenenler kaybolur ve başlangıçtaki altı kayıt geri gelir.

## Postman ile test

1. Sunucuyu 3000 portunda başlatın.
2. Postman'de **Import** ile `requests/kampus-api.json` dosyasını açın. Koleksiyon v2.1 biçimindedir.
3. Sunucuyu yeni başlatmışken altı isteği aşağıdaki sırayla çalıştırın. Her istekte durum kodunu ve yanıtı kontrol eden testler bulunur.

| # | İstek | Beklenen |
|---|---|---|
| 1 | GET `/health` | 200, ok + zaman + öğrenci numarası |
| 2 | GET `/events` | 200, altı kayıt |
| 3 | GET `/events/event-2` | 200, event-2 |
| 4 | GET `/events/yok` | 404, error.message |
| 5 | POST `/events` (tam gövde) | 201, yeni kimlik |
| 6 | POST `/events` (yalnızca title) | 400, error.message |

Beşinci istek bellekteki listeyi değiştirdiğinden koleksiyonu tekrar çalıştırmadan önce sunucuyu yeniden başlatın. POST sonrasında ayrıca GET `/events` ile yedi kayıt olduğunu kontrol edebilirsiniz.

## Teslim notu

Frontend ve Vercel ayarları değişmedi; backend bu sprintte canlıya alınmıyor. Teslimde aşama aşama atılmış en az beş commit ve `sprint-07` etiketi bulunmalı. Commit, etiket ve GitHub'a gönderme işlemleri bu test klasöründe yapılmadı; ana depoda ayrıca tamamlanmalıdır.
