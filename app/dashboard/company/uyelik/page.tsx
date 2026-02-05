import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SubscriptionCard } from "@/components/company/SubscriptionCard"
import { PlanChangeSection } from "@/components/company/PlanChangeSection"
import type { CompanyPlan, SubscriptionStatus, BillingPeriod } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { History, Calendar } from "lucide-react"

const PLAN_LABELS: Record<CompanyPlan, string> = {
  free: "Free",
  orta: "Orta",
  premium: "Premium",
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Beklemede",
  success: "Başarılı",
  failed: "Başarısız",
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "-"
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return "-"
  }
}

function membershipDuration(startedAt: string | null | undefined): string {
  if (!startedAt) return "-"
  try {
    const start = new Date(startedAt)
    const now = new Date()
    const months = Math.max(0, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()))
    if (months < 1) return "1 aydan kısa"
    if (months === 1) return "1 ay"
    if (months < 12) return `${months} ay`
    const years = Math.floor(months / 12)
    const m = months % 12
    if (m === 0) return years === 1 ? "1 yıl" : `${years} yıl`
    return `${years} yıl ${m} ay`
  } catch {
    return "-"
  }
}

export default async function CompanyUyelikPage() {
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

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id, name, plan, subscription_status, billing_period, current_plan_price, last_payment_at, subscription_ends_at, subscription_started_at")
    .eq("id", profile.company_id)
    .single()

  if (companyError || !company) {
    redirect("/dashboard/company")
  }

  const { data: payments } = await supabase
    .from("company_payments")
    .select("id, plan, billing_period, amount, status, paid_at, created_at")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const plan = (company.plan as CompanyPlan) ?? "free"
  const subscriptionStatus = (company.subscription_status as SubscriptionStatus) ?? "pending_payment"
  const billingPeriod = (company.billing_period as BillingPeriod) ?? "monthly"

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Üyelik Merkezi</h1>
        <p className="text-muted-foreground mt-1">
          Aboneliğinizi görüntüleyin, plan değiştirin ve ödeme geçmişinize bakın.
        </p>
      </div>

      <SubscriptionCard
        companyId={company.id}
        plan={plan}
        subscriptionStatus={subscriptionStatus}
        billingPeriod={billingPeriod}
        lastPaymentAt={company.last_payment_at}
        subscriptionEndsAt={company.subscription_ends_at}
        currentPlanPrice={company.current_plan_price}
      />

      <PlanChangeSection
        companyId={company.id}
        currentPlan={plan}
        subscriptionStatus={subscriptionStatus}
      />

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Üyelik özeti</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Üyelik süresi</span>
            <span>{membershipDuration(company.subscription_started_at)}</span>
          </div>
          {company.subscription_started_at && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Üyelik başlangıcı</span>
              <span>{formatDate(company.subscription_started_at)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <History className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Ödeme geçmişi</h2>
          </div>
        </CardHeader>
        <CardContent>
          {payments && payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Tarih</th>
                    <th className="pb-2 pr-4 font-medium">Plan</th>
                    <th className="pb-2 pr-4 font-medium">Dönem</th>
                    <th className="pb-2 pr-4 font-medium">Tutar</th>
                    <th className="pb-2 font-medium">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">
                        {p.paid_at ? formatDate(p.paid_at) : formatDate(p.created_at)}
                      </td>
                      <td className="py-2 pr-4">{PLAN_LABELS[p.plan as CompanyPlan] ?? p.plan}</td>
                      <td className="py-2 pr-4">{p.billing_period === "annually" ? "Yıllık" : "Aylık"}</td>
                      <td className="py-2 pr-4">{p.amount} ₺</td>
                      <td className="py-2">{STATUS_LABELS[p.status] ?? p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Henüz ödeme kaydı bulunmuyor.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
