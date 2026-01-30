"use client"

import { cn } from "@/lib/utils"
import { Building2, Briefcase, Users, Star, Home, ArrowLeft, ArrowRight, Bell, Ticket, MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const menuItems = [
  {
    title: "Panel",
    href: "/dashboard/ik",
    icon: Home,
  },
  {
    title: "Şirket Bilgileri",
    href: "/dashboard/ik/sirket",
    icon: Building2,
  },
  {
    title: "İş İlanları",
    href: "/dashboard/ik/ilanlar",
    icon: Briefcase,
  },
  {
    title: "Eşleşmeler",
    href: "/dashboard/ik/eslesmeler",
    icon: Star,
  },
  {
    title: "Başvurular",
    href: "/dashboard/ik/basvurular",
    icon: Users,
  },
  {
    title: "Bildirimler",
    href: "/dashboard/ik/bildirimler",
    icon: Bell,
  },
  {
    title: "Destek Taleplerim",
    href: "/dashboard/ik/destek",
    icon: Ticket,
  },
  {
    title: "Canlı Sohbet",
    href: "/dashboard/ik/destek-sohbet",
    icon: MessageCircle,
  },
]

export function HRSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <aside
      className={cn(
        "w-64 border-r border-border bg-card hidden md:block transition-all duration-300",
        open ? "w-64" : "w-16",
      )}
    >
      <nav className="p-4 space-y-1">
        <div className="relative pb-4">
          <button
            onClick={() => setOpen(!open)}
            className="absolute -top-2 -right-6 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors active:scale-95"
          >
            {open ? <ArrowLeft className="size-3" /> : <ArrowRight className="size-3" />}
          </button>
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg py-3 text-sm font-medium transition-all duration-300",
                open ? "px-4" : "justify-center px-2",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-300",
                  open ? "w-auto opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-4 absolute",
                )}
              >
                {item.title}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
