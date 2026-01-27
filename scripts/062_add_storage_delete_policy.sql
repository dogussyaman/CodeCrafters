-- ============================================
-- Storage DELETE Policy Ekleme
-- ============================================
-- CV silme işlemi için Storage DELETE policy'si ekler

-- Mevcut DELETE policy'sini sil (varsa)
DROP POLICY IF EXISTS "Users can delete their own CVs" ON storage.objects;

-- DELETE Policy: Kullanıcılar kendi CV'lerini silebilir
CREATE POLICY "Users can delete their own CVs"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'cvs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- TAMAMLANDI
-- ============================================
