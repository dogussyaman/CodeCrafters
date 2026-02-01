-- ============================================
-- 082: Yorumlar / Referanslar (testimonials)
-- CodeCrafters - Giriş yapan kullanıcılar yorum bırakabilir; yayınlananlar herkese açık.
-- ============================================

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('pending', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_user ON public.testimonials(user_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON public.testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_created ON public.testimonials(created_at DESC);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Herkes yayınlanan yorumları okuyabilir; kullanıcı kendi yorumunu da görebilir
CREATE POLICY "Anyone can read published or own testimonials"
  ON public.testimonials FOR SELECT
  USING (status = 'published' OR user_id = auth.uid());

-- Giriş yapan kullanıcı kendi yorumunu ekleyebilir
CREATE POLICY "Authenticated can insert own testimonial"
  ON public.testimonials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Kullanıcı kendi yorumunu güncelleyebilir/silebilir; admin tümünü yönetebilir
CREATE POLICY "User can update own testimonial"
  ON public.testimonials FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "User or admin can delete testimonial"
  ON public.testimonials FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'mt'))
  );
