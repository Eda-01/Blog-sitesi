# Blog Backend API

TypeScript, Express.js, PostgreSQL ve Knex kullanılarak geliştirilmiş bir blog sitesi backend API'si.

## Teknolojiler

- **TypeScript**: Tip güvenli JavaScript
- **Express.js**: Web framework
- **PostgreSQL**: İlişkisel veritabanı
- **Knex**: SQL query builder

## Proje Yapısı

```
.
├── src/
│   ├── controllers/      # Controller dosyaları
│   ├── database/
│   │   ├── migrations/   # Veritabanı migration dosyaları
│   │   └── connection.ts # Veritabanı bağlantı dosyası
│   ├── routes/           # Route tanımları
│   ├── types/            # TypeScript tip tanımları
│   └── index.ts          # Ana uygulama dosyası
├── knexfile.js           # Knex konfigürasyon dosyası
├── package.json
└── tsconfig.json
```

## Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd blog-backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyası oluşturun ve veritabanı bağlantı bilgilerinizi ekleyin:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=blog_db
PORT=3000
```

4. PostgreSQL veritabanını oluşturun:
```bash
createdb blog_db
```

5. Migration'ları çalıştırın:
```bash
npm run migrate:latest
```

## Çalıştırma

### Development modu:
```bash
npm run dev
```

### Production modu:
```bash
npm run build
npm start
```

## API Endpoints

### Kategoriler

- `POST /categories` - Yeni kategori oluştur
- `GET /categories` - Tüm kategorileri listele
- `GET /categories/:id` - ID'ye göre kategori getir
- `PATCH /categories/:id` - Kategoriyi güncelle
- `DELETE /categories/:id` - Kategoriyi sil (soft delete)

**Query Parametreleri:**
- `showDeleted=true` - Silinmiş kategorileri de göster
- `onlyDeleted=true` - Sadece silinmiş kategorileri göster

### Gönderiler

- `POST /posts` - Yeni gönderi oluştur
- `GET /posts` - Tüm gönderileri listele
- `GET /posts/:id` - ID'ye göre gönderi getir
- `PATCH /posts/:id` - Gönderiyi güncelle
- `DELETE /posts/:id` - Gönderiyi sil (soft delete)

**Query Parametreleri:**
- `category=<id>` - Belirli bir kategoriye ait gönderiler
- `status=published` - Yayımlanmış gönderiler
- `status=draft` - Taslak gönderiler
- `status=all` - Tüm gönderiler (default)
- `showDeleted=true` - Silinmiş gönderileri de göster
- `onlyDeleted=true` - Sadece silinmiş gönderileri göster

### Yorumlar

- `POST /comments` - Yeni yorum oluştur
- `GET /comments` - Tüm yorumları listele
- `GET /comments/:id` - ID'ye göre yorum getir
- `PATCH /comments/:id` - Yorumu güncelle
- `DELETE /comments/:id` - Yorumu sil

**Query Parametreleri:**
- `post=<id>` - Belirli bir gönderiye ait yorumlar
- `commenter=<name>` - Belirli bir yorumcunun yorumları

## Veri Modelleri

### Kategori
- `id` (number)
- `name` (string)
- `created_at` (timestamp)
- `deleted_at` (timestamp, nullable)

### Gönderi
- `id` (number)
- `category_id` (number)
- `title` (string)
- `content` (string)
- `created_at` (timestamp)
- `published_at` (timestamp, nullable)
- `deleted_at` (timestamp, nullable)

### Yorum
- `id` (number)
- `post_id` (number)
- `content` (string)
- `commenter_name` (string)
- `created_at` (timestamp)

## Soft Delete

Kategori ve gönderiler için soft delete özelliği aktif. Silinen kayıtlar veritabanından tamamen silinmez, sadece `deleted_at` alanına zaman damgası eklenir. Soft delete yapılmış kayıtlar varsayılan olarak listeleme sorgularında görünmez.

## Postman Collection

Proje ana dizininde `Blog_Backend_API.postman_collection.json` dosyası bulunmaktadır. Bu dosyayı Postman'e import ederek tüm endpoint'leri test edebilirsiniz.

Collection'da `base_url` değişkeni tanımlıdır ve varsayılan değeri `http://localhost:3000`'dir. Gerekirse değiştirebilirsiniz.

## Örnek Kullanım

### Kategori Oluşturma
```bash
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Teknoloji"}'
```

### Gönderi Oluşturma
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 1,
    "title": "Yapay Zeka ve Gelecek",
    "content": "Yapay zeka teknolojisi hızla gelişiyor...",
    "published_at": "2024-01-01T14:00:00.000Z"
  }'
```

### Yorum Oluşturma
```bash
curl -X POST http://localhost:3000/comments \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": 1,
    "content": "Harika bir yazı olmuş!",
    "commenter_name": "Ahmet Yılmaz"
  }'
```

## Migration Komutları

```bash
# Yeni migration oluştur
npm run migrate:make migration_name

# Migration'ları çalıştır
npm run migrate:latest

# Son migration'ı geri al
npm run migrate:rollback
```

## Lisans

ISC

