-- ============================================
-- 081: Test blog yazısı (seed)
-- CodeCrafters - En az bir profil varsa tek yayınlanmış blog yazısı ekler.
-- 079_blog_tables.sql sonrası çalıştırın.
-- ============================================

INSERT INTO public.blog_posts (
  title,
  slug,
  body,
  author_id,
  status,
  published_at
)
SELECT
  'CodeCrafters ile Yazılım Kariyerinize Yön Verin',
  'codecrafters-ile-yazilim-kariyerinize-yon-verin',
  'CodeCrafters, yazılım geliştiricileri ve işverenleri bir araya getiren modern bir kariyer platformudur. Bu platformda CV''nizi oluşturabilir, projelerinizi paylaşabilir, iş ilanlarına başvurabilir ve toplulukla etkileşim kurabilirsiniz.

Yapay zeka destekli eşleştirme sayesinde yeteneklerinize uygun fırsatları keşfedin. Blog yazıları, terimler sözlüğü ve haberler bölümüyle kendinizi geliştirin.

Başlamak için hemen kayıt olun ve profilinizi tamamlayın.',
  p.id,
  'published',
  NOW()
FROM public.profiles p
LIMIT 1
ON CONFLICT (slug) DO NOTHING;
