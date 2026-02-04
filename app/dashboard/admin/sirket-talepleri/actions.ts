"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type CompanyRequestStatus = "approved" | "rejected"

export async function updateCompanyRequestStatus(
  requestId: string,
  status: CompanyRequestStatus
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Oturum gerekli" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const role = profile?.role
  if (role !== "admin" && role !== "platform_admin" && role !== "mt") {
    return { ok: false, error: "Yetkiniz yok" }
  }

  const { data: existing, error: fetchErr } = await supabase
    .from("company_requests")
    .select("id, status")
    .eq("id", requestId)
    .single()

  if (fetchErr || !existing) {
    return { ok: false, error: "Talep bulunamadı" }
  }
  if (existing.status !== "pending") {
    return { ok: false, error: "Talep zaten değerlendirilmiş" }
  }

  const { error: updateErr } = await supabase
    .from("company_requests")
    .update({
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", requestId)

  if (updateErr) {
    return { ok: false, error: updateErr.message }
  }

  revalidatePath("/dashboard/admin/sirket-talepleri")
  return { ok: true }
}
