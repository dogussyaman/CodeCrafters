# Supabase Bağlantı Bilgilerini Bulma Rehberi

Bu rehber, yeni Supabase hesabınızdan `.env.local` dosyası için gereken tüm bağlantı bilgilerini nasıl bulacağınızı açıklar.

## Adım 1: Supabase Dashboard'a Giriş

1. [Supabase Dashboard](https://app.supabase.com) adresine gidin
2. Yeni projenizi seçin veya yeni bir proje oluşturun

## Adım 2: API Ayarlarına Erişim

1. Sol menüden **Settings** (⚙️) ikonuna tıklayın
2. **API** sekmesine gidin

## Adım 3: Gerekli Değerleri Bulma

### 3.1. Project URL/ tamamlandı
- **Konum:** Settings > API > **Project URL**
- **Değer:** `https://[proje-id].supabase.co` formatında
- **Kullanım:** 
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_URL`

### 3.2. Anon/Public Key / tamamlandı 
- **Konum:** Settings > API > **Project API keys** > **anon** `public`
- **Değer:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` formatında JWT token
- **Kullanım:** 
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Not:** Bu anahtar istemci tarafında güvenle kullanılabilir

### 3.3. Service Role Key/ tamamlandı
- **Konum:** Settings > API > **Project API keys** > **service_role** `secret`
- **Değer:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` formatında JWT token
- **Kullanım:** 
  - `SUPABASE_SERVICE_ROLE_KEY`
- **⚠️ ÖNEMLİ:** Bu anahtar çok hassas! Asla istemci tarafında kullanmayın, sadece sunucu tarafında kullanın.

### 3.4. JWT Secret
- **Konum:** Settings > API > **JWT Secret**
- **Değer:** Base64 encoded string
- **Kullanım:** 
  - `SUPABASE_JWT_SECRET`

### 3.5. Publishable Key ve Secret Key (Eski Format)
- **Not:** Yeni Supabase projelerinde bu formatlar kullanılmıyor olabilir
- Eğer görünmüyorsa, sadece `NEXT_PUBLIC_SUPABASE_ANON_KEY` ve `SUPABASE_SERVICE_ROLE_KEY` yeterli olacaktır
- Eski projelerde varsa:
  - `SUPABASE_PUBLISHABLE_KEY` → `NEXT_PUBLIC_SUPABASE_ANON_KEY` ile aynı olabilir
  - `SUPABASE_SECRET_KEY` → `SUPABASE_SERVICE_ROLE_KEY` ile aynı olabilir

## Adım 4: Database Bağlantı Bilgileri

1. Sol menüden **Settings** (⚙️) ikonuna tıklayın
2. **Database** sekmesine gidin

### 4.1. Connection String (Pooled)
- **Konum:** Settings > Database > **Connection string** > **URI** (Pooled mode)
- **Format:** `postgres://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true`
- **Kullanım:** 
  - `POSTGRES_PRISMA_URL` (pgbouncer=true ile)
  - `POSTGRES_URL` (supa=base-pooler.x ile)

### 4.2. Connection String (Non-Pooled)
- **Konum:** Settings > Database > **Connection string** > **URI** (Transaction mode)
- **Format:** `postgres://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require`
- **Kullanım:** 
  - `POSTGRES_URL_NON_POOLING`

### 4.3. Database Bilgileri
- **Database Name:** Genellikle `postgres` (değişmez)
- **User:** Genellikle `postgres` (değişmez)
- **Host:** Connection string'den çıkarılabilir veya `db.[PROJECT_REF].supabase.co` formatında
- **Password:** Connection string'de görünür veya ayrı bir yerde gösterilir
- **Kullanım:**
  - `POSTGRES_DATABASE="postgres"`
  - `POSTGRES_USER="postgres"`
  - `POSTGRES_HOST="db.[PROJECT_REF].supabase.co"`
  - `POSTGRES_PASSWORD="[PASSWORD]"`

## Adım 5: Connection String'i Parçalama

Connection string şu formattadır:
```
postgres://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?[PARAMS]
```

Örnek:
```
postgres://postgres.abc123:MyPassword123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

Buradan:
- **USER:** `postgres.abc123` (noktadan sonrası PROJECT_REF)
- **PASSWORD:** `MyPassword123`
- **HOST:** `aws-0-eu-central-1.pooler.supabase.com` (pooled için)
- **PORT:** `6543` (pooled) veya `5432` (non-pooled)
- **DATABASE:** `postgres`

## Hızlı Kontrol Listesi

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Settings > API > Project URL
- [ ] `SUPABASE_URL` - Settings > API > Project URL (aynı)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Settings > API > anon public key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Settings > API > service_role secret key
- [ ] `SUPABASE_JWT_SECRET` - Settings > API > JWT Secret
- [ ] `POSTGRES_PRISMA_URL` - Settings > Database > Connection string (Pooled)
- [ ] `POSTGRES_URL` - Settings > Database > Connection string (Pooled, supa=base-pooler.x ile)
- [ ] `POSTGRES_URL_NON_POOLING` - Settings > Database > Connection string (Transaction)
- [ ] `POSTGRES_DATABASE` - Genellikle "postgres"
- [ ] `POSTGRES_USER` - Genellikle "postgres"
- [ ] `POSTGRES_HOST` - Connection string'den veya `db.[PROJECT_REF].supabase.co`
- [ ] `POSTGRES_PASSWORD` - Connection string'den veya Database ayarlarından

## Notlar

- Tüm değerleri kopyalarken tırnak işaretlerini (`"`) dahil etmeyin
- `.env.local` dosyasında her değer tırnak içinde olmalı
- `SUPABASE_SERVICE_ROLE_KEY` ve `POSTGRES_PASSWORD` gibi hassas bilgileri asla public repository'lere commit etmeyin
- Yeni Supabase projelerinde bazı eski format anahtarlar olmayabilir, bu normaldir
