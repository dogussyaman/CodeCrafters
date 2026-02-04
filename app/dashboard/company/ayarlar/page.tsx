import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CompanySettingsForm } from "@/components/company/CompanySettingsForm"

export default async function CompanyAyarlarPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/giris")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id, role")
    .eq("id", user.id)
    .single()

  if (!profile?.company_id) {
    redirect("/dashboard/company")
  }

  const allowedRoles = ["company_admin", "hr"]
  if (!profile.role || !allowedRoles.includes(profile.role)) {
    redirect("/dashboard/company")
  }

  const { data: company, error } = await supabase
    .from("companies")
    .select("id, name, description, industry, website, location, employee_count, logo_url, plan, subscription_status, billing_period, current_plan_price, last_payment_at, subscription_ends_at, created_by, created_at, updated_at, contact_email, phone, address, legal_title, tax_number, tax_office")
    .eq("id", profile.company_id)
    .single()

  if (error || !company) {
    redirect("/dashboard/company")
  }

  return <CompanySettingsForm company={company} />
}
