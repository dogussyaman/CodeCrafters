-- ============================================
-- Destek bileti çözüldü/kapatıldı: bildirim + e-posta
-- MT bilet durumunu resolved/closed yaptığında kullanıcıya notification
-- ve (giriş hatası, teknik vb.) e-posta kuyruğa eklenir.
-- 066_support_tickets_rls.sql'den bağımsız; Supabase SQL Editor'da çalıştırın.
-- ============================================

-- email_queue.email_type CHECK'e ticket_resolved ekle (mevcut CHECK kaldırılıp yenisi eklenir)
DO $$
DECLARE
  conname text;
BEGIN
  SELECT c.conname INTO conname
  FROM pg_constraint c
  WHERE c.conrelid = 'public.email_queue'::regclass
    AND c.contype = 'c'
    AND pg_get_constraintdef(c.oid) LIKE '%company_created%';
  IF conname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.email_queue DROP CONSTRAINT %I', conname);
  END IF;
  ALTER TABLE public.email_queue
    ADD CONSTRAINT email_queue_email_type_check
    CHECK (email_type IN ('company_created', 'hr_invited', 'password_reset', 'notification', 'custom', 'ticket_resolved'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Tetikleyici fonksiyon: bilet resolved/closed olunca notification + (uygunsa) email_queue
CREATE OR REPLACE FUNCTION public.on_support_ticket_resolved()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec_recipient_id uuid;
  rec_email text;
  rec_name text;
  rec_role text;
  mail_subject text;
  mail_body text;
  mail_html text;
  href_val text;
BEGIN
  -- Sadece status resolved veya closed'a geçtiğinde (önceki farklıydı)
  IF NEW.status NOT IN ('resolved', 'closed') OR OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  rec_recipient_id := NEW.user_id;
  rec_email := NULL;
  rec_name := NULL;
  rec_role := NULL;

  IF rec_recipient_id IS NOT NULL THEN
    SELECT p.email, p.full_name, p.role INTO rec_email, rec_name, rec_role
    FROM public.profiles p
    WHERE p.id = rec_recipient_id;
  END IF;
  IF rec_email IS NULL OR rec_email = '' THEN
    rec_email := NULLIF(TRIM(NEW.email), '');
  END IF;

  -- Bildirim: sadece giriş yapmış kullanıcıya (user_id var); href rolüne göre Destek Taleplerim sayfası
  IF rec_recipient_id IS NOT NULL THEN
    href_val := CASE rec_role
      WHEN 'company' THEN '/dashboard/company/destek'
      WHEN 'hr' THEN '/dashboard/ik/destek'
      ELSE '/dashboard/gelistirici/destek'
    END;
    href_val := COALESCE(href_val, '/dashboard/gelistirici/destek');
    INSERT INTO public.notifications (recipient_id, type, title, body, href)
    VALUES (
      rec_recipient_id,
      'support_ticket_resolved',
      'Destek talebiniz çözüldü',
      COALESCE(
        'Konu: ' || LEFT(NEW.subject, 100) || E'\n\n' ||
        CASE WHEN NEW.resolution_no IS NOT NULL AND NEW.resolution_no <> '' THEN 'Çözüm notu: ' || LEFT(NEW.resolution_no, 300) ELSE 'Durum: ' || NEW.status END,
        'Konu: ' || COALESCE(NEW.subject, 'Destek talebi')
      ),
      href_val
    );
  END IF;

  -- E-posta: giriş hatası, teknik, diğer (ve geri bildirim istenirse) için; alıcı varsa
  IF rec_email IS NOT NULL AND NEW.type IN ('login_error', 'technical', 'other', 'feedback') THEN
    mail_subject := 'CodeCrafters – Destek talebiniz çözüldü: ' || COALESCE(LEFT(NEW.subject, 60), 'Destek talebi');
    mail_body := 'Merhaba,' || E'\n\n'
      || 'Destek talebiniz çözüldü veya kapatıldı.' || E'\n\n'
      || 'Konu: ' || COALESCE(NEW.subject, '') || E'\n\n'
      || CASE WHEN NEW.resolution_no IS NOT NULL AND NEW.resolution_no <> '' THEN 'Çözüm notu: ' || NEW.resolution_no || E'\n\n' ELSE '' END
      || 'Detaylar için giriş yapıp Destek Taleplerim sayfasına bakabilirsiniz.';
    mail_html := '<p>Merhaba,</p><p>Destek talebiniz çözüldü veya kapatıldı.</p>'
      || '<p><strong>Konu:</strong> ' || COALESCE(NEW.subject, '') || '</p>'
      || CASE WHEN NEW.resolution_no IS NOT NULL AND NEW.resolution_no <> '' THEN '<p><strong>Çözüm notu:</strong></p><p>' || NEW.resolution_no || '</p>' ELSE '' END
      || '<p>Detaylar için giriş yapıp Destek Taleplerim sayfasına bakabilirsiniz.</p>';

    INSERT INTO public.email_queue (recipient_email, recipient_name, subject, html_content, text_content, email_type, metadata)
    VALUES (
      rec_email,
      rec_name,
      mail_subject,
      mail_html,
      mail_body,
      'ticket_resolved',
      jsonb_build_object('support_ticket_id', NEW.id, 'subject', NEW.subject, 'status', NEW.status)
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS support_ticket_resolution_notify ON public.support_tickets;
CREATE TRIGGER support_ticket_resolution_notify
  AFTER UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.on_support_ticket_resolved();
