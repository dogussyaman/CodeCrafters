-- ============================================
-- 078: Proje katılma istekleri (project_join_requests)
-- CodeCrafters - Proje sahibi onay/red, bildirim entegrasyonu için.
-- FINAL_COMPLETE_SCHEMA veya mevcut şema sonrası çalıştırın.
-- ============================================

CREATE TABLE IF NOT EXISTS public.project_join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(project_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_project_join_requests_project ON public.project_join_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_project_join_requests_user ON public.project_join_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_project_join_requests_status ON public.project_join_requests(project_id, status);

ALTER TABLE public.project_join_requests ENABLE ROW LEVEL SECURITY;

-- İstek atan kullanıcı kendi isteğini görebilir
CREATE POLICY "User can view own join requests"
  ON public.project_join_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Proje sahibi kendi projelerine gelen istekleri görebilir
CREATE POLICY "Project owner can view join requests"
  ON public.project_join_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_join_requests.project_id AND p.created_by = auth.uid()
    )
  );

-- Giriş yapmış kullanıcı katılma isteği ekleyebilir (kendi user_id ile)
CREATE POLICY "Authenticated user can create join request"
  ON public.project_join_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Proje sahibi isteğin durumunu güncelleyebilir (onay/red)
CREATE POLICY "Project owner can update join request status"
  ON public.project_join_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_join_requests.project_id AND p.created_by = auth.uid()
    )
  );
