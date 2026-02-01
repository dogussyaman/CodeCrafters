-- ============================================
-- 079: Blog (blog_posts, blog_comments)
-- CodeCrafters - Platform blogu, yorumlar thread (parent_id).
-- ============================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  body TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON public.blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent ON public.blog_comments(parent_id);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- blog_posts: herkes yayınlananları okuyabilir
CREATE POLICY "Anyone can read published blog posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published' OR author_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'mt')
  ));

-- blog_posts: admin/mt/author ekleyebilir (author_id = auth.uid() veya admin)
CREATE POLICY "Author and admin can insert blog posts"
  ON public.blog_posts FOR INSERT
  WITH CHECK (
    author_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'mt'))
  );

-- blog_posts: yazar ve admin güncelleyebilir
CREATE POLICY "Author and admin can update blog posts"
  ON public.blog_posts FOR UPDATE
  USING (author_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'mt')));

-- blog_posts: yazar ve admin silebilir
CREATE POLICY "Author and admin can delete blog posts"
  ON public.blog_posts FOR DELETE
  USING (author_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'mt')));

-- blog_comments: herkes okuyabilir
CREATE POLICY "Anyone can read blog comments"
  ON public.blog_comments FOR SELECT USING (true);

-- blog_comments: giriş yapmış kullanıcı yorum ekleyebilir
CREATE POLICY "Authenticated can insert blog comment"
  ON public.blog_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- blog_comments: kullanıcı kendi yorumunu silebilir; admin de silebilir
CREATE POLICY "User can delete own comment or admin"
  ON public.blog_comments FOR DELETE
  USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'mt'))
  );

-- updated_at trigger for blog_posts
CREATE OR REPLACE FUNCTION public.set_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_blog_posts_updated_at();
