import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getPaymentProvider, PaymentService } from "@/lib/payments"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id, role, must_change_password")
      .eq("id", user.id)
      .single()

    const companyId =
      (await request.json().then((b) => b?.companyId).catch(() => null)) ??
      profile?.company_id

    if (!companyId) {
      return NextResponse.json(
        { error: "Şirket bilgisi bulunamadı veya yetkiniz yok" },
        { status: 403 }
      )
    }

    const allowedRoles = ["company_admin", "hr"]
    if (!profile?.role || !allowedRoles.includes(profile.role)) {
      return NextResponse.json(
        { error: "Sadece şirket yöneticisi veya İK bu işlemi yapabilir" },
        { status: 403 }
      )
    }

    if (profile.role === "hr" && profile.company_id !== companyId) {
      return NextResponse.json(
        { error: "Sadece kendi şirketiniz için ödeme başlatabilirsiniz" },
        { status: 403 }
      )
    }

    const provider = getPaymentProvider()
    const service = new PaymentService(provider)
    const result = await service.startPayment({
      companyId,
      plan: "free",
      billingPeriod: "monthly",
    })

    if (result.status === "failed") {
      return NextResponse.json(
        { error: "Ödeme işlemi başarısız" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      subscriptionStatus: result.subscriptionStatus ?? "active",
      lastPaymentAt: result.lastPaymentAt ?? null,
      subscriptionEndsAt: result.subscriptionEndsAt ?? null,
      mustChangePassword: profile?.must_change_password ?? false,
    })
  } catch (error: unknown) {
    console.error("start-mock-payment error:", error)
    const message =
      error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
