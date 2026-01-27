-- ============================================
-- Codecrafters Platform - COMPLETE SCHEMA
-- Tüm eski SQL'lerin (001-041) birleştirilmiş hali
-- Her şey bu dosyada - eksiksiz çalışır halde
-- ============================================

-- 1. EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. ANA TABLOLAR
-- ============================================

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('developer', 'hr', 'admin', 'company', 'company_admin', 'platform_admin')),
  bio TEXT,
  title TEXT,
  social_links JSONB DEFAULT '{}',
  website TEXT,
  avatar_url TEXT,
  company_id UUID,
  must_change_password BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  website TEXT,
  logo_url TEXT,
  location TEXT,
  employee_count TEXT,
  legal_title TEXT,
  tax_number TEXT,
  tax_office TEXT,
  tax_certificate_url TEXT,
  address TEXT,
  phone TEXT,
  created_by UUID REFERENCES public.profiles(id),
  owner_profile_id UUID REFERENCES public.profiles(id),
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Foreign key for company_id in profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_company_fkey;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_company_fkey 
  FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;

-- Company Members (Şirket çalışanları - ATS için)
CREATE TABLE IF NOT EXISTS public.company_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  department TEXT,
  employee_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Postings
CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  responsibilities TEXT,
  location TEXT,
  department TEXT,
  employment_type TEXT,
  job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship', 'freelance')),
  experience_level TEXT CHECK (experience_level IN ('junior', 'mid', 'senior', 'lead')),
  salary_min INTEGER,
  salary_max INTEGER,
  application_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT CHECK (category IN ('programming', 'framework', 'tool', 'soft-skill', 'language', 'other')) DEFAULT 'other',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Skills
CREATE TABLE IF NOT EXISTS public.job_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT TRUE,
  proficiency_level TEXT CHECK (proficiency_level IN ('basic', 'intermediate', 'advanced', 'expert')),
  UNIQUE(job_id, skill_id)
);

-- Developer Skills
CREATE TABLE IF NOT EXISTS public.developer_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level TEXT CHECK (proficiency_level IN ('basic', 'intermediate', 'advanced', 'expert')),
  years_of_experience DECIMAL(3,1),
  source TEXT DEFAULT 'manual' CHECK (source IN ('cv', 'manual', 'verified')),
  UNIQUE(developer_id, skill_id)
);

-- CVs
CREATE TABLE IF NOT EXISTS public.cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  parsed_data JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cover Letters
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experiences (CV Sections)
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Educations (CV Sections)
CREATE TABLE IF NOT EXISTS public.educations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  school_name TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificates (CV Sections)
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
  developer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  matching_skills JSONB,
  missing_skills JSONB,
  status TEXT DEFAULT 'suggested' CHECK (status IN ('suggested', 'viewed', 'contacted', 'rejected', 'hired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, developer_id)
);

-- Applications
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
  developer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  cv_id UUID REFERENCES public.cvs(id) ON DELETE SET NULL,
  cover_letter TEXT,
  status TEXT DEFAULT 'yeni' CHECK (status IN ('yeni', 'değerlendiriliyor', 'randevu', 'teklif', 'red', 'pending', 'reviewed', 'interview', 'rejected', 'accepted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, developer_id)
);

-- ATS: Application Assignments
CREATE TABLE IF NOT EXISTS public.application_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES public.profiles(id),
  assigned_by UUID NOT NULL REFERENCES public.profiles(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'reassigned', 'completed')),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ATS: Application Status History
CREATE TABLE IF NOT EXISTS public.application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES public.profiles(id),
  changed_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ATS: Application Notes
CREATE TABLE IF NOT EXISTS public.application_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('internal', 'evaluation', 'interview', 'general')),
  title TEXT,
  content TEXT NOT NULL,
  is_visible_to_developer BOOLEAN DEFAULT FALSE,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ATS: Interviews
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  scheduled_by UUID NOT NULL REFERENCES public.profiles(id),
  interview_type TEXT DEFAULT 'phone' CHECK (interview_type IN ('phone', 'video', 'onsite', 'technical', 'hr')),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  interviewers JSONB,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  href TEXT,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  technologies JSONB NOT NULL DEFAULT '[]',
  github_url TEXT,
  demo_url TEXT,
  image_url TEXT,
  stars INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  category TEXT,
  created_by UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Queue (Resend entegrasyonu için)
CREATE TABLE IF NOT EXISTS public.email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  html_content TEXT,
  text_content TEXT,
  email_type TEXT NOT NULL CHECK (email_type IN ('company_created', 'hr_invited', 'password_reset', 'notification', 'custom')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  retry_count INTEGER DEFAULT 0
);

-- Project Likes
CREATE TABLE IF NOT EXISTS public.project_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'responded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Requests
CREATE TABLE IF NOT EXISTS public.training_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  description TEXT NOT NULL,
  preferred_format TEXT CHECK (preferred_format IN ('online', 'offline', 'hybrid')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role Requests
CREATE TABLE IF NOT EXISTS public.role_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  requested_role TEXT NOT NULL CHECK (requested_role IN ('hr', 'admin')),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company Requests
CREATE TABLE IF NOT EXISTS public.company_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_website TEXT,
  company_description TEXT,
  company_size TEXT,
  industry TEXT,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_company_id UUID REFERENCES public.companies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform Stats
CREATE TABLE IF NOT EXISTS public.platform_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date DATE NOT NULL UNIQUE,
  total_users INTEGER DEFAULT 0,
  total_developers INTEGER DEFAULT 0,
  total_hr_users INTEGER DEFAULT 0,
  total_companies INTEGER DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  total_matches INTEGER DEFAULT 0,
  total_applications INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. INDEXES (Performance)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON public.job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_company ON public.job_postings(company_id);
CREATE INDEX IF NOT EXISTS idx_cvs_developer ON public.cvs(developer_id);
CREATE INDEX IF NOT EXISTS idx_developer_skills_developer ON public.developer_skills(developer_id);
CREATE INDEX IF NOT EXISTS idx_matches_job ON public.matches(job_id);
CREATE INDEX IF NOT EXISTS idx_matches_developer ON public.matches(developer_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_developer ON public.applications(developer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON public.notifications(read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_application_assignments_application ON public.application_assignments(application_id);
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON public.email_queue(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_email_queue_created_at ON public.email_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_application_assignments_assigned_to ON public.application_assignments(assigned_to);
CREATE INDEX IF NOT EXISTS idx_interviews_application ON public.interviews(application_id);

-- ============================================
-- 4. FUNCTIONS & TRIGGERS
-- ============================================

-- Otomatik profil oluşturma (KRİTİK!)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Kullanıcı'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'developer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END; $$;

-- Updated_at triggerları
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.companies;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.job_postings;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.job_postings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.cvs;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.cvs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.matches;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.applications;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.cover_letters;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.cover_letters FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.experiences;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.experiences FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.educations;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.educations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.company_members;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.company_members FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.application_assignments;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.application_assignments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.application_notes;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.application_notes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.interviews;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.interviews FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.projects;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.training_requests;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.training_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.role_requests;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.role_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS set_updated_at ON public.company_requests;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.company_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- ADMIN & COMPANY MANAGEMENT FUNCTIONS
-- ============================================

-- Admin şirket oluşturma fonksiyonu
-- NOT: Auth kullanıcı oluşturma işlemi backend'de (Next.js API route) Supabase Admin API ile yapılmalıdır
-- Bu fonksiyon sadece şirket oluşturur ve email_queue'ya ekler
-- Backend'de Admin API ile kullanıcı oluşturulduktan sonra bu fonksiyon çağrılmalıdır
CREATE OR REPLACE FUNCTION public.create_company_with_owner(
  company_name TEXT,
  company_email TEXT,
  owner_full_name TEXT,
  owner_user_id UUID, -- Backend'den gelen auth user ID
  temp_password TEXT, -- Backend'den gelen geçici şifre
  created_by_admin_id UUID DEFAULT NULL,
  company_description TEXT DEFAULT NULL,
  company_industry TEXT DEFAULT NULL,
  company_website TEXT DEFAULT NULL,
  company_location TEXT DEFAULT NULL,
  company_employee_count TEXT DEFAULT NULL,
  company_legal_title TEXT DEFAULT NULL,
  company_tax_number TEXT DEFAULT NULL,
  company_tax_office TEXT DEFAULT NULL,
  company_address TEXT DEFAULT NULL,
  company_phone TEXT DEFAULT NULL,
  company_contact_email TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_company_id UUID;
  result JSONB;
BEGIN
  -- Admin kontrolü
  IF created_by_admin_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = created_by_admin_id AND role IN ('admin', 'platform_admin')) THEN
      RAISE EXCEPTION 'Sadece admin kullanıcılar şirket oluşturabilir';
    END IF;
  END IF;

  -- Profil kontrolü (trigger ile oluşturulmuş olmalı)
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = owner_user_id) THEN
    -- Profil yoksa oluştur (must_change_password = true)
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      role,
      must_change_password,
      company_id
    ) VALUES (
      owner_user_id,
      company_email,
      owner_full_name,
      'company_admin',
      TRUE,
      NULL -- Şirket henüz oluşturulmadı, sonra güncellenecek
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      must_change_password = TRUE;
  ELSE
    -- Profil varsa güncelle
    UPDATE public.profiles
    SET 
      email = company_email,
      full_name = owner_full_name,
      role = 'company_admin',
      must_change_password = TRUE
    WHERE id = owner_user_id;
  END IF;

  -- Şirket oluştur
  INSERT INTO public.companies (
    name,
    description,
    industry,
    website,
    location,
    employee_count,
    legal_title,
    tax_number,
    tax_office,
    address,
    phone,
    contact_email,
    created_by,
    owner_profile_id
  ) VALUES (
    company_name,
    company_description,
    company_industry,
    company_website,
    company_location,
    company_employee_count,
    company_legal_title,
    company_tax_number,
    company_tax_office,
    company_address,
    company_phone,
    company_contact_email,
    created_by_admin_id,
    owner_user_id
  )
  RETURNING id INTO new_company_id;

  -- Profil'e company_id ekle
  UPDATE public.profiles
  SET company_id = new_company_id
  WHERE id = owner_user_id;

  -- Mail kuyruğuna ekle
  INSERT INTO public.email_queue (
    recipient_email,
    recipient_name,
    subject,
    html_content,
    text_content,
    email_type,
    metadata
  ) VALUES (
    company_email,
    owner_full_name,
    'Codecrafters - Şirket Hesabınız Oluşturuldu',
    '<h1>Merhaba ' || owner_full_name || '</h1><p>Şirketiniz Codecrafters platformuna başarıyla kaydedildi.</p><p><strong>Giriş Bilgileriniz:</strong></p><p>E-posta: ' || company_email || '</p><p>Şifre: ' || temp_password || '</p><p><strong>ÖNEMLİ:</strong> İlk girişinizde şifrenizi değiştirmeniz gerekmektedir.</p>',
    'Merhaba ' || owner_full_name || E'\n\nŞirketiniz Codecrafters platformuna başarıyla kaydedildi.\n\nGiriş Bilgileriniz:\nE-posta: ' || company_email || E'\nŞifre: ' || temp_password || E'\n\nÖNEMLİ: İlk girişinizde şifrenizi değiştirmeniz gerekmektedir.',
    'company_created',
    jsonb_build_object(
      'company_id', new_company_id,
      'company_name', company_name,
      'user_id', owner_user_id,
      'temp_password', temp_password
    )
  );

  -- Sonuç döndür
  result := jsonb_build_object(
    'success', TRUE,
    'company_id', new_company_id,
    'owner_user_id', owner_user_id
  );

  RETURN result;
END;
$$;

-- İK kullanıcı oluşturma fonksiyonu
-- NOT: Auth kullanıcı oluşturma işlemi backend'de (Next.js API route) Supabase Admin API ile yapılmalıdır
-- Bu fonksiyon sadece profili günceller ve email_queue'ya ekler
-- Backend'de Admin API ile kullanıcı oluşturulduktan sonra bu fonksiyon çağrılmalıdır
CREATE OR REPLACE FUNCTION public.create_hr_user(
  hr_email TEXT,
  hr_full_name TEXT,
  hr_user_id UUID, -- Backend'den gelen auth user ID
  temp_password TEXT, -- Backend'den gelen geçici şifre
  company_id_param UUID,
  created_by_user_id UUID,
  hr_title TEXT DEFAULT NULL,
  hr_phone TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  company_owner_id UUID;
  result JSONB;
BEGIN
  -- Yetki kontrolü: Şirket sahibi veya admin olmalı
  SELECT owner_profile_id INTO company_owner_id
  FROM public.companies
  WHERE id = company_id_param;

  IF company_owner_id IS NULL THEN
    RAISE EXCEPTION 'Şirket bulunamadı';
  END IF;

  -- Şirket sahibi veya admin kontrolü
  IF created_by_user_id != company_owner_id AND 
     NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = created_by_user_id AND role IN ('admin', 'platform_admin')) THEN
    RAISE EXCEPTION 'Sadece şirket sahibi veya admin İK kullanıcısı ekleyebilir';
  END IF;

  -- Profil kontrolü (trigger ile oluşturulmuş olmalı)
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = hr_user_id) THEN
    -- Profil yoksa oluştur (must_change_password = true)
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      role,
      phone,
      title,
      must_change_password,
      company_id
    ) VALUES (
      hr_user_id,
      hr_email,
      hr_full_name,
      'hr',
      hr_phone,
      hr_title,
      TRUE,
      company_id_param
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      phone = EXCLUDED.phone,
      title = EXCLUDED.title,
      must_change_password = TRUE,
      company_id = EXCLUDED.company_id;
  ELSE
    -- Profil varsa güncelle
    UPDATE public.profiles
    SET 
      email = hr_email,
      full_name = hr_full_name,
      role = 'hr',
      phone = hr_phone,
      title = hr_title,
      must_change_password = TRUE,
      company_id = company_id_param
    WHERE id = hr_user_id;
  END IF;

  -- Mail kuyruğuna ekle
  INSERT INTO public.email_queue (
    recipient_email,
    recipient_name,
    subject,
    html_content,
    text_content,
    email_type,
    metadata
  ) VALUES (
    hr_email,
    hr_full_name,
    'Codecrafters - İK Hesabınız Oluşturuldu',
    '<h1>Merhaba ' || hr_full_name || '</h1><p>Codecrafters platformuna İK kullanıcısı olarak eklendiniz.</p><p><strong>Giriş Bilgileriniz:</strong></p><p>E-posta: ' || hr_email || '</p><p>Şifre: ' || temp_password || '</p><p><strong>ÖNEMLİ:</strong> İlk girişinizde şifrenizi değiştirmeniz gerekmektedir.</p>',
    'Merhaba ' || hr_full_name || E'\n\nCodecrafters platformuna İK kullanıcısı olarak eklendiniz.\n\nGiriş Bilgileriniz:\nE-posta: ' || hr_email || E'\nŞifre: ' || temp_password || E'\n\nÖNEMLİ: İlk girişinizde şifrenizi değiştirmeniz gerekmektedir.',
    'hr_invited',
    jsonb_build_object(
      'company_id', company_id_param,
      'user_id', hr_user_id,
      'temp_password', temp_password
    )
  );

  -- Sonuç döndür
  result := jsonb_build_object(
    'success', TRUE,
    'hr_user_id', hr_user_id
  );

  RETURN result;
END;
$$;

-- ============================================
-- 5. RLS (Row Level Security) POLİTİKALARI
-- ============================================

-- Önce tüm mevcut policy'leri temizle (script tekrar çalıştırılabilir olması için)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Herkes profilleri görebilir" ON public.profiles;
CREATE POLICY "Herkes profilleri görebilir" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini oluşturabilir" ON public.profiles;
CREATE POLICY "Kullanıcılar kendi profillerini oluşturabilir" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Admin profil oluşturabilir" ON public.profiles;
CREATE POLICY "Admin profil oluşturabilir" ON public.profiles FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);
DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini güncelleyebilir" ON public.profiles;
CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admin profilleri güncelleyebilir" ON public.profiles;
CREATE POLICY "Admin profilleri güncelleyebilir" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);

-- Companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Herkes şirketleri görebilir" ON public.companies;
CREATE POLICY "Herkes şirketleri görebilir" ON public.companies FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin ve şirket sahibi şirket oluşturabilir" ON public.companies;
CREATE POLICY "Admin ve şirket sahibi şirket oluşturabilir" ON public.companies FOR INSERT WITH CHECK (
  auth.uid() = created_by OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);
DROP POLICY IF EXISTS "Şirket sahibi ve admin güncelleyebilir" ON public.companies;
CREATE POLICY "Şirket sahibi ve admin güncelleyebilir" ON public.companies FOR UPDATE USING (
  owner_profile_id = auth.uid() OR
  created_by = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);

-- Job Postings
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes aktif ilanları görebilir" ON public.job_postings FOR SELECT USING (true);
CREATE POLICY "Kullanıcılar ilan oluşturabilir" ON public.job_postings FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "İlan sahibi güncelleyebilir" ON public.job_postings FOR UPDATE USING (created_by = auth.uid());

-- Skills
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes yetenekleri görebilir" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Herkes yetenek ekleyebilir" ON public.skills FOR INSERT WITH CHECK (true);

-- Developer Skills
ALTER TABLE public.developer_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes geliştirici yeteneklerini görebilir" ON public.developer_skills FOR SELECT USING (true);
CREATE POLICY "Geliştiriciler kendi yeteneklerini ekleyebilir" ON public.developer_skills FOR INSERT WITH CHECK (developer_id = auth.uid());
CREATE POLICY "Geliştiriciler kendi yeteneklerini güncelleyebilir" ON public.developer_skills FOR UPDATE USING (developer_id = auth.uid());
CREATE POLICY "Geliştiriciler kendi yeteneklerini silebilir" ON public.developer_skills FOR DELETE USING (developer_id = auth.uid());

-- CVs
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kullanıcılar kendi CV'lerini görebilir" ON public.cvs FOR SELECT USING (developer_id = auth.uid());
CREATE POLICY "Geliştiriciler CV yükleyebilir" ON public.cvs FOR INSERT WITH CHECK (developer_id = auth.uid());
CREATE POLICY "Geliştiriciler kendi CV'lerini güncelleyebilir" ON public.cvs FOR UPDATE USING (developer_id = auth.uid());

-- Cover Letters
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kullanıcılar kendi ön yazılarını görebilir" ON public.cover_letters FOR SELECT USING (auth.uid() = developer_id);
CREATE POLICY "Kullanıcılar kendine ön yazı ekleyebilir" ON public.cover_letters FOR INSERT WITH CHECK (auth.uid() = developer_id);
CREATE POLICY "Kullanıcılar kendi ön yazılarını güncelleyebilir" ON public.cover_letters FOR UPDATE USING (auth.uid() = developer_id);
CREATE POLICY "Kullanıcılar kendi ön yazılarını silebilir" ON public.cover_letters FOR DELETE USING (auth.uid() = developer_id);

-- Experiences, Educations, Certificates
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deneyimleri herkes görebilir" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Kullanıcılar deneyim ekleyebilir" ON public.experiences FOR INSERT WITH CHECK (auth.uid() = developer_id);
CREATE POLICY "Kullanıcılar deneyimlerini güncelleyebilir" ON public.experiences FOR UPDATE USING (auth.uid() = developer_id);
CREATE POLICY "Kullanıcılar deneyimlerini silebilir" ON public.experiences FOR DELETE USING (auth.uid() = developer_id);

ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Eğitimleri herkes görebilir" ON public.educations FOR SELECT USING (true);
CREATE POLICY "Kullanıcılar eğitim ekleyebilir" ON public.educations FOR INSERT WITH CHECK (auth.uid() = developer_id);
CREATE POLICY "Kullanıcılar eğitimlerini güncelleyebilir" ON public.educations FOR UPDATE USING (auth.uid() = developer_id);
CREATE POLICY "Kullanıcılar eğitimlerini silebilir" ON public.educations FOR DELETE USING (auth.uid() = developer_id);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sertifikaları herkes görebilir" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Kullanıcılar sertifika ekleyebilir" ON public.certificates FOR INSERT WITH CHECK (auth.uid() = developer_id);
CREATE POLICY "Kullanıcılar sertifikalarını güncelleyebilir" ON public.certificates FOR UPDATE USING (auth.uid() = developer_id);
CREATE POLICY "Kullanıcılar sertifikalarını silebilir" ON public.certificates FOR DELETE USING (auth.uid() = developer_id);

-- Applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes başvuruları görebilir" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Geliştiriciler başvuru yapabilir" ON public.applications FOR INSERT WITH CHECK (developer_id = auth.uid());
CREATE POLICY "İlgili kullanıcılar başvuru güncelleyebilir" ON public.applications FOR UPDATE USING (true);

-- Matches
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kullanıcılar eşleşmeleri görebilir" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Sistem eşleşme oluşturabilir" ON public.matches FOR INSERT WITH CHECK (true);

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kullanıcılar kendi bildirimlerini görebilir" ON public.notifications FOR SELECT USING (auth.uid() = recipient_id);
CREATE POLICY "Sistem bildirim oluşturabilir" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Kullanıcılar bildirimlerini güncelleyebilir" ON public.notifications FOR UPDATE USING (auth.uid() = recipient_id);
CREATE POLICY "Kullanıcılar bildirimlerini silebilir" ON public.notifications FOR DELETE USING (auth.uid() = recipient_id);

-- Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes yayınlanan projeleri görebilir" ON public.projects FOR SELECT USING (status = 'published' OR created_by = auth.uid());
CREATE POLICY "Kullanıcılar proje ekleyebilir" ON public.projects FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Kullanıcılar kendi projelerini güncelleyebilir" ON public.projects FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Kullanıcılar kendi projelerini silebilir" ON public.projects FOR DELETE USING (created_by = auth.uid());

-- Email Queue (Sadece admin ve sistem erişebilir)
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin email kuyruğunu görebilir" ON public.email_queue FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);
CREATE POLICY "Sistem email ekleyebilir" ON public.email_queue FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin email güncelleyebilir" ON public.email_queue FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);

-- Company Members
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Şirket üyelerini ilgili kullanıcılar görebilir" ON public.company_members FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.companies c
    WHERE c.id = company_members.company_id
    AND (c.owner_profile_id = auth.uid() OR c.created_by = auth.uid())
  ) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);
CREATE POLICY "Şirket sahibi ve admin üye ekleyebilir" ON public.company_members FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.companies c
    WHERE c.id = company_members.company_id
    AND (c.owner_profile_id = auth.uid() OR c.created_by = auth.uid())
  ) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);
CREATE POLICY "Şirket sahibi ve admin üye güncelleyebilir" ON public.company_members FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.companies c
    WHERE c.id = company_members.company_id
    AND (c.owner_profile_id = auth.uid() OR c.created_by = auth.uid())
  ) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);

-- Job Skills
ALTER TABLE public.job_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes iş yeteneklerini görebilir" ON public.job_skills FOR SELECT USING (true);
CREATE POLICY "İlan sahibi yetenek ekleyebilir" ON public.job_skills FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.job_postings jp
    WHERE jp.id = job_skills.job_id
    AND jp.created_by = auth.uid()
  ) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);
CREATE POLICY "İlan sahibi yetenek güncelleyebilir" ON public.job_skills FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.job_postings jp
    WHERE jp.id = job_skills.job_id
    AND jp.created_by = auth.uid()
  ) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);
CREATE POLICY "İlan sahibi yetenek silebilir" ON public.job_skills FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.job_postings jp
    WHERE jp.id = job_skills.job_id
    AND jp.created_by = auth.uid()
  ) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);

-- Application Status History
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "İlgili kullanıcılar durum geçmişini görebilir" ON public.application_status_history FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.applications a
    WHERE a.id = application_status_history.application_id
    AND (a.developer_id = auth.uid() OR a.job_id IN (
      SELECT jp.id FROM public.job_postings jp
      WHERE jp.company_id IN (
        SELECT c.id FROM public.companies c
        WHERE c.owner_profile_id = auth.uid() OR c.created_by = auth.uid()
      )
    ))
  ) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin', 'hr'))
);
CREATE POLICY "Sistem ve ilgili kullanıcılar durum geçmişi ekleyebilir" ON public.application_status_history FOR INSERT WITH CHECK (true);

-- Project Likes
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes beğenileri görebilir" ON public.project_likes FOR SELECT USING (true);
CREATE POLICY "Kullanıcılar beğeni ekleyebilir" ON public.project_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Kullanıcılar kendi beğenilerini silebilir" ON public.project_likes FOR DELETE USING (auth.uid() = user_id);

-- Contact Messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin mesajları görebilir" ON public.contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);
CREATE POLICY "Herkes mesaj gönderebilir" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin mesajları güncelleyebilir" ON public.contact_messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);

-- Training Requests
ALTER TABLE public.training_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kullanıcılar kendi taleplerini görebilir" ON public.training_requests FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);
CREATE POLICY "Kullanıcılar talep oluşturabilir" ON public.training_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Kullanıcılar kendi taleplerini güncelleyebilir" ON public.training_requests FOR UPDATE USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);
CREATE POLICY "Admin talepleri güncelleyebilir" ON public.training_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);

-- Role Requests
ALTER TABLE public.role_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kullanıcılar kendi taleplerini görebilir" ON public.role_requests FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);
CREATE POLICY "Kullanıcılar rol talebi oluşturabilir" ON public.role_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin rol taleplerini güncelleyebilir" ON public.role_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);

-- Company Requests
ALTER TABLE public.company_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kullanıcılar kendi taleplerini görebilir" ON public.company_requests FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);
CREATE POLICY "Kullanıcılar şirket talebi oluşturabilir" ON public.company_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin şirket taleplerini güncelleyebilir" ON public.company_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'platform_admin'))
);

-- ATS Tables
ALTER TABLE public.application_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "İlgili kullanıcılar atamaları görebilir" ON public.application_assignments FOR SELECT USING (
  assigned_to = auth.uid() OR assigned_by = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'hr'))
);

ALTER TABLE public.application_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "İlgili kullanıcılar notları görebilir" ON public.application_notes FOR SELECT USING (true);
CREATE POLICY "Kullanıcılar not ekleyebilir" ON public.application_notes FOR INSERT WITH CHECK (auth.uid() = created_by);

ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "İlgili kullanıcılar mülakat görebilir" ON public.interviews FOR SELECT USING (true);

-- Platform Stats
ALTER TABLE public.platform_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes istatistikleri görebilir" ON public.platform_stats FOR SELECT USING (true);

-- ============================================
-- 6. INITIAL SEED DATA (Temel Yetenekler)
-- ============================================

INSERT INTO public.skills (name, category) VALUES
  -- Programming Languages
  ('JavaScript', 'programming'),
  ('TypeScript', 'programming'),
  ('Python', 'programming'),
  ('Java', 'programming'),
  ('C#', 'programming'),
  ('Go', 'programming'),
  ('Rust', 'programming'),
  ('PHP', 'programming'),
  ('Ruby', 'programming'),
  ('Swift', 'programming'),
  ('Kotlin', 'programming'),
  
  -- Frameworks
  ('React', 'framework'),
  ('Next.js', 'framework'),
  ('Vue.js', 'framework'),
  ('Angular', 'framework'),
  ('Node.js', 'framework'),
  ('Express.js', 'framework'),
  ('Django', 'framework'),
  ('Flask', 'framework'),
  ('Spring Boot', 'framework'),
  ('.NET', 'framework'),
  ('Laravel', 'framework'),
  ('Ruby on Rails', 'framework'),
  
  -- Tools & Technologies
  ('Git', 'tool'),
  ('Docker', 'tool'),
  ('Kubernetes', 'tool'),
  ('AWS', 'tool'),
  ('Azure', 'tool'),
  ('Google Cloud', 'tool'),
  ('PostgreSQL', 'tool'),
  ('MongoDB', 'tool'),
  ('Redis', 'tool'),
  ('GraphQL', 'tool'),
  ('REST API', 'tool'),
  ('CI/CD', 'tool'),
  
  -- Soft Skills
  ('Problem Solving', 'soft-skill'),
  ('Team Collaboration', 'soft-skill'),
  ('Communication', 'soft-skill'),
  ('Leadership', 'soft-skill'),
  ('Agile/Scrum', 'soft-skill'),
  
  -- Languages
  ('English', 'language'),
  ('Turkish', 'language'),
  ('German', 'language'),
  ('French', 'language')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- TAMAMLANDI - Her şey hazır!
-- ============================================
