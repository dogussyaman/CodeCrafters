"use client"

import { cn } from "@/lib/utils"
import { FileText, Home, Briefcase, Star, User, Search, PenTool, ArrowLeft, ArrowRight, Bell, Ticket } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const menuItems = [
  {
    title: "Panel",
    href: "/dashboard/gelistirici",
    icon: Home,
  },
  {
    title: "CV'lerim",
    href: "/dashboard/gelistirici/cv",
    icon: FileText,
  },
  {
    title: "Ön Yazılarım",
    href: "/dashboard/gelistirici/on-yazilar",
    icon: PenTool,
  },
  {
    title: "Eşleşmeler",
    href: "/dashboard/gelistirici/eslesmeler",
    icon: Star,
  },
  {
    title: "Başvurularım",
    href: "/dashboard/gelistirici/basvurular",
    icon: Briefcase,
  },
  {
    title: "Bildirimler",
    href: "/dashboard/gelistirici/bildirimler",
    icon: Bell,
  },
  {
    title: "Destek Taleplerim",
    href: "/dashboard/gelistirici/destek",
    icon: Ticket,
  },
  {
    title: "İş İlanları",
    href: "/is-ilanlari",
    icon: Search,
  },
  {
    title: "Profil",
    href: "/dashboard/gelistirici/profil",
    icon: User,
  },
]

export function DeveloperSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <aside className={cn("w-64 border-r border-border bg-card hidden md:block transition-all duration-300", open ? "w-64" : "w-16")}>
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
