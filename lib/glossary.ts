/**
 * Yazılım terimleri sözlüğü - statik veri.
 * İleride DB veya topluluk katkısı eklenebilir.
 */
export type GlossaryCategory = "frontend" | "backend" | "devops" | "database" | "security" | "genel"

export interface GlossaryTerm {
  term: string
  definition: string
  link?: string
  category?: GlossaryCategory
}

export const GLOSSARY_CATEGORIES: { id: GlossaryCategory; label: string }[] = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "database", label: "Veritabanı" },
  { id: "devops", label: "DevOps" },
  { id: "security", label: "Güvenlik" },
  { id: "genel", label: "Genel" },
]

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // Frontend
  { term: "API", definition: "Application Programming Interface. Uygulamaların birbirleriyle konuşmasını sağlayan arayüz.", link: "https://developer.mozilla.org/en-US/docs/Glossary/API", category: "genel" },
  { term: "REST", definition: "Representational State Transfer. HTTP üzerinde kaynak tabanlı API tasarım yaklaşımı.", link: "https://developer.mozilla.org/en-US/docs/Glossary/REST", category: "backend" },
  { term: "CRUD", definition: "Create, Read, Update, Delete. Veri üzerinde temel işlemler.", link: "https://developer.mozilla.org/en-US/docs/Glossary/CRUD", category: "genel" },
  { term: "OAuth", definition: "Açık yetkilendirme protokolü. Üçüncü taraf uygulamalara sınırlı erişim verir.", link: "https://developer.mozilla.org/en-US/docs/Glossary/OAuth", category: "security" },
  { term: "JWT", definition: "JSON Web Token. Kimlik bilgisini güvenli taşıyan token formatı.", link: "https://developer.mozilla.org/en-US/docs/Glossary/JWT", category: "security" },
  { term: "CI/CD", definition: "Continuous Integration / Continuous Deployment. Kod değişikliklerinin otomatik test ve dağıtım süreci.", category: "devops" },
  { term: "MVC", definition: "Model-View-Controller. Uygulama yapısını model, görünüm ve denetleyiciye ayıran mimari.", category: "frontend" },
  { term: "SSR", definition: "Server-Side Rendering. Sayfanın sunucuda render edilip HTML olarak gönderilmesi.", category: "frontend" },
  { term: "CSR", definition: "Client-Side Rendering. Sayfanın tarayıcıda JavaScript ile render edilmesi.", category: "frontend" },
  { term: "SPA", definition: "Single Page Application. Tek HTML sayfası üzerinde JavaScript ile sayfa değiştiren uygulama.", category: "frontend" },
  { term: "TypeScript", definition: "JavaScript'e statik tip ekleyen dil. Microsoft tarafından geliştirilir.", link: "https://www.typescriptlang.org/", category: "frontend" },
  { term: "GraphQL", definition: "API için sorgu dili. İstemci ihtiyacı olan veriyi tek istekle alabilir.", link: "https://graphql.org/", category: "backend" },
  { term: "Webhook", definition: "Olay gerçekleştiğinde belirli bir URL'e HTTP isteği gönderen mekanizma.", category: "backend" },
  { term: "CORS", definition: "Cross-Origin Resource Sharing. Farklı kaynaklardan gelen isteklere izin verme politikası.", link: "https://developer.mozilla.org/en-US/docs/Glossary/CORS", category: "frontend" },
  { term: "Middleware", definition: "İstek ile yanıt arasında çalışan yazılım katmanı. Kimlik doğrulama, loglama vb.", category: "backend" },
  { term: "Dependency Injection", definition: "Bağımlılıkların dışarıdan verildiği tasarım deseni. Test ve esneklik sağlar.", category: "backend" },
  { term: "Repository", definition: "Veri erişim katmanını soyutlayan desen. Veri kaynağından bağımsız iş mantığı.", category: "backend" },
  { term: "Refactoring", definition: "Kodun davranışını değiştirmeden yapısını iyileştirme.", category: "genel" },
  { term: "Linter", definition: "Kod stilini ve potansiyel hataları kontrol eden araç. ESLint, Pylint vb.", category: "genel" },
  { term: "Semantic Versioning", definition: "Sürüm numarası standardı: MAJOR.MINOR.PATCH. Örn: 2.1.0.", category: "genel" },
  // Frontend ek
  { term: "React", definition: "Facebook tarafından geliştirilen, bileşen tabanlı kullanıcı arayüzü kütüphanesi.", link: "https://react.dev/", category: "frontend" },
  { term: "Vue", definition: "İlerleyici JavaScript framework'ü. Reaktif ve bileşen tabanlı UI oluşturmak için kullanılır.", link: "https://vuejs.org/", category: "frontend" },
  { term: "Next.js", definition: "React tabanlı full-stack framework. SSR, SSG ve API routes sunar.", link: "https://nextjs.org/", category: "frontend" },
  { term: "Tailwind CSS", definition: "Utility-first CSS framework. Sınıflarla hızlı arayüz geliştirmeyi sağlar.", link: "https://tailwindcss.com/", category: "frontend" },
  { term: "Hydration", definition: "Sunucuda render edilmiş HTML'in tarayıcıda React ile etkileşimli hale getirilmesi.", category: "frontend" },
  { term: "Virtual DOM", definition: "DOM'un hafif bir kopyası. Değişiklikler önce sanal DOM'da uygulanır, sonra gerçek DOM güncellenir.", category: "frontend" },
  { term: "State Management", definition: "Uygulama durumunun merkezi veya dağıtık yönetimi. Redux, Zustand vb.", category: "frontend" },
  { term: "Responsive Design", definition: "Farklı ekran boyutlarına uyum sağlayan tasarım yaklaşımı.", category: "frontend" },
  { term: "Accessibility", definition: "Erişilebilirlik. Engelli kullanıcılar dahil herkesin ürünü kullanabilmesi (a11y).", category: "frontend" },
  { term: "SEO", definition: "Search Engine Optimization. Arama motorlarında görünürlüğü artırma.", category: "frontend" },
  // Backend ek
  { term: "Node.js", definition: "JavaScript ile sunucu tarafı uygulama geliştirmek için V8 tabanlı runtime.", link: "https://nodejs.org/", category: "backend" },
  { term: "Express", definition: "Node.js için minimal ve esnek web framework'ü.", category: "backend" },
  { term: "Serverless", definition: "Sunucu yönetmeden fonksiyon bazlı çalışan mimari. AWS Lambda, Vercel Functions vb.", category: "backend" },
  { term: "Microservices", definition: "Uygulamanın bağımsız, küçük servisler halinde yapılandırılması.", category: "backend" },
  { term: "API Gateway", definition: "API isteklerini tek giriş noktasından yöneten ve yönlendiren katman.", category: "backend" },
  { term: "Rate Limiting", definition: "Belirli bir sürede istek sayısını sınırlayarak sunucuyu koruma.", category: "backend" },
  { term: "Caching", definition: "Sık kullanılan veriyi geçici depolayarak yanıt süresini kısaltma.", category: "backend" },
  { term: "Load Balancer", definition: "Trafiği birden fazla sunucuya dağıtan bileşen. Yük dengeleme.", category: "backend" },
  // Veritabanı
  { term: "SQL", definition: "Structured Query Language. İlişkisel veritabanlarında sorgulama ve veri yönetimi dili.", category: "database" },
  { term: "NoSQL", definition: "İlişkisel olmayan veritabanları. Doküman, anahtar-değer, grafik vb.", category: "database" },
  { term: "ORM", definition: "Object-Relational Mapping. Nesneleri veritabanı tablolarıyla eşleştiren katman.", category: "database" },
  { term: "Migration", definition: "Veritabanı şemasındaki değişikliklerin sürümlenmiş script'lerle uygulanması.", category: "database" },
  { term: "Index", definition: "Sorgu hızını artırmak için tablo sütunları üzerinde oluşturulan yapı.", category: "database" },
  { term: "ACID", definition: "Atomicity, Consistency, Isolation, Durability. İşlem güvenilirliği için dört özellik.", category: "database" },
  { term: "Transaction", definition: "Birden fazla işlemin tek bir bütün olarak ya tamamlanması ya da iptal edilmesi.", category: "database" },
  { term: "Replication", definition: "Veritabanı kopyasının birden fazla sunucuda tutulması. Yedeklilik ve ölçeklilik.", category: "database" },
  // DevOps ek
  { term: "Docker", definition: "Uygulamaları konteyner içinde paketleyip her ortamda aynı şekilde çalıştırmayı sağlar.", link: "https://www.docker.com/", category: "devops" },
  { term: "Kubernetes", definition: "Konteyner orkestrasyon platformu. Dağıtım, ölçekleme ve yönetim otomasyonu.", category: "devops" },
  { term: "Git", definition: "Dağıtık sürüm kontrol sistemi. Kod değişikliklerini takip eder.", link: "https://git-scm.com/", category: "devops" },
  { term: "GitHub Actions", definition: "GitHub üzerinde CI/CD iş akışlarını otomatikleştiren özellik.", category: "devops" },
  { term: "Pipeline", definition: "Koddan üretime kadar otomatik adımlar zinciri. Build, test, deploy.", category: "devops" },
  { term: "IaC", definition: "Infrastructure as Code. Altyapının kod ile tanımlanıp yönetilmesi. Terraform, Pulumi.", category: "devops" },
  { term: "Monitoring", definition: "Sistem ve uygulama metriklerinin izlenmesi. Prometheus, Grafana, Datadog vb.", category: "devops" },
  { term: "Logging", definition: "Uygulama ve sistem olaylarının kayıt altına alınması.", category: "devops" },
  // Güvenlik
  { term: "XSS", definition: "Cross-Site Scripting. Saldırganın tarayıcıda script çalıştırması. Girdi sanitizasyonu ile önlenir.", category: "security" },
  { term: "CSRF", definition: "Cross-Site Request Forgery. Kullanıcı adına yetkisiz istek gönderilmesi.", category: "security" },
  { term: "SQL Injection", definition: "Sorgu içine zararlı SQL eklenmesi. Parametreli sorgular ile önlenir.", category: "security" },
  { term: "Hashing", definition: "Veriyi tek yönlü dönüştürme. Şifre saklama için kullanılır (bcrypt, Argon2).", category: "security" },
  { term: "Encryption", definition: "Veriyi yetkisiz erişime karşı şifreleme. Symmetric ve asymmetric şifreleme.", category: "security" },
  { term: "2FA", definition: "Two-Factor Authentication. İki adımlı doğrulama. Şifre + SMS/OTP veya uygulama.", category: "security" },
  { term: "HTTPS", definition: "HTTP üzerinde TLS/SSL ile şifreli iletişim.", category: "security" },
  { term: "Zero Trust", definition: "Hiçbir kaynağa varsayılan güven yok; her erişim doğrulanır.", category: "security" },
]

export function getGlossaryByLetter(): Record<string, GlossaryTerm[]> {
  const byLetter: Record<string, GlossaryTerm[]> = {}
  for (const t of GLOSSARY_TERMS) {
    const letter = t.term[0].toUpperCase()
    if (!byLetter[letter]) byLetter[letter] = []
    byLetter[letter].push(t)
  }
  for (const key of Object.keys(byLetter)) {
    byLetter[key].sort((a, b) => a.term.localeCompare(b.term))
  }
  return byLetter
}

export function getGlossaryByCategory(): Record<GlossaryCategory, GlossaryTerm[]> {
  const byCategory = {} as Record<GlossaryCategory, GlossaryTerm[]>
  for (const cat of GLOSSARY_CATEGORIES) {
    byCategory[cat.id] = GLOSSARY_TERMS.filter((t) => (t.category ?? "genel") === cat.id)
  }
  for (const key of Object.keys(byCategory) as GlossaryCategory[]) {
    byCategory[key].sort((a, b) => a.term.localeCompare(b.term))
  }
  return byCategory
}

export function searchGlossary(q: string): GlossaryTerm[] {
  const lower = q.toLowerCase().trim()
  if (!lower) return GLOSSARY_TERMS
  return GLOSSARY_TERMS.filter(
    (t) => t.term.toLowerCase().includes(lower) || t.definition.toLowerCase().includes(lower)
  )
}
