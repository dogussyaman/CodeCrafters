<div align="center">
  <img src="public/logo.svg" alt="CodeCrafters Logo" width="120" height="120" />
  <h1>CodeCrafters</h1>
  <p><strong>Next.js ve Supabase ile Güçlendirilmiş Modern Web Deneyimi</strong></p>

  <p>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    </a>
    <a href="https://supabase.com">
      <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/Tailwind_CSS-Styling-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    </a>
    <a href="https://www.typescriptlang.org">
      <img src="https://img.shields.io/badge/TypeScript-Strongly_Typed-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
    </a>
  </p>
</div>

<br />

# 🚀 Proje Hakkında

**CodeCrafters**, geliştiriciler ve kullanıcılar için sorunsuz ve sağlam bir deneyim sunmak üzere tasarlanmış modern bir web uygulamasıdır. En son web teknolojilerini kullanarak performans, güvenlik ve kullanıcı deneyimini ön planda tutar.

## ✨ Özellikler

- **🔐 Güçlü Kimlik Doğrulama**: Supabase Auth ile güvenli kayıt, giriş ve OAuth entegrasyonları.
- **🎨 Modern Arayüz**: Tailwind CSS ve Radix UI bileşenleri ile şık, erişilebilir ve duyarlı tasarım.
- **📝 Form Yönetimi**: Zod ve React Hook Form ile tip güvenli ve kullanıcı dostu form doğrulama.
- **🌓 Karanlık Mod**: Göz yormayan, sistem tercihlerine duyarlı tema desteği.
- **📱 Mobil Öncelikli**: Her cihazda mükemmel görünen responsive yapı.

## 🛠️ Teknoloji Yığını

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Server Actions)
- **Dil**: [TypeScript](https://www.typescriptlang.org/)
- **Stil**: [Tailwind CSS](https://tailwindcss.com/)
- **İkonlar**: [Lucide React](https://lucide.dev/)
- **Backend**: [Supabase](https://supabase.com/)
- **Bileşen Kütüphanesi**: [shadcn/ui](https://ui.shadcn.com/) tabanlı

---

## 🏁 Başlangıç

Projenin yerel kopyasını çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler

Bilgisayarınızda **Node.js** yüklü olduğundan emin olun.

### Kurulum

1. **Repoyu klonlayın:**
   ```bash
   git clone <repo-url>
   cd codecrafters
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   # veya
   pnpm install
   ```

3. **Çevre Değişkenlerini Ayarlayın:**
   Örnek dosyadan kendi `.env.local` dosyanızı oluşturun.
   ```bash
   cp .env.example .env.local
   ```
   `.env.local` dosyasını açın ve Supabase bilgilerinizi girin:
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase proje URL'iniz.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon API anahtarınız.
   - `SUPABASE_SERVICE_ROLE_KEY`: (Opsiyonel) Şirket/HR oluşturma ve cron API'leri için; sadece sunucu tarafında kullanılır, client'a gönderilmez.

4. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```
   Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

## 📜 Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusunu başlatır. |
| `npm run build` | Prodüksiyon için uygulamayı derler. |
| `npm run start` | Prodüksiyon sunucusunu başlatır. |
| `npm run lint` | Kod standartlarını kontrol eder (ESLint). |

## 📂 Proje Yapısı

```
codecrafters/
├── app/            # Next.js App Router sayfaları ve layoutları
├── components/     # Yeniden kullanılabilir React bileşenleri
├── lib/            # Yardımcı fonksiyonlar ve Supabase istemcisi
├── public/         # Statik dosyalar (görseller, fontlar)
└── styles/         # Global stil dosyaları
```

## 📄 Lisans

Bu proje [MIT](LICENSE) lisansı ile lisanslanmıştır.
