"use client"

import type React from "react"

import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Send, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "./logo"
import { useState } from "react"

export function ModernFooter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-background border-t border-border transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Bağlantıda Kalın - Newsletter */}
          <div className="space-y-4">
            <Logo className="mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              En son güncellemeler, özel teklifler ve topluluk haberleri için bültenimize katılın.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <Input
                type="email"
                placeholder="E-posta adresinizi girin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-12 bg-muted/50 border-border focus:border-primary"
                required
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 bg-foreground hover:bg-foreground/90"
              >
                <Send className="h-4 w-4 text-background" />
              </Button>
            </form>
            {subscribed && <p className="text-sm text-green-500 animate-in fade-in">Başarıyla kaydoldunuz!</p>}
          </div>

          {/* Hızlı Bağlantılar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Hızlı Bağlantılar</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Ana Sayfa", href: "/" },
                { label: "Hakkımızda", href: "/hakkimizda" },
                { label: "Projeler", href: "/projeler" },
                { label: "Topluluk", href: "/topluluk" },
                { label: "Etkinlikler", href: "/etkinlikler" },
                { label: "İş İlanları", href: "/is-ilanlari" },
                { label: "Destek", href: "/destek" },
                { label: "İletişim", href: "/iletisim" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Adres</p>
                  <p className="text-muted-foreground">123 İnovasyon Caddesi</p>
                  <p className="text-muted-foreground">Teknoloji Şehri, TC 12345</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Telefon</p>
                  <p className="text-muted-foreground">(123) 456-7890</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium text-foreground">E-posta</p>
                  <p className="text-muted-foreground">hello@codecrafters.com</p>
                  <p className="text-muted-foreground">team@notificationscodecrafters.xyz</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Bizi Takip Edin */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Bizi Takip Edin</h3>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: "https://facebook.com/codecrafters", label: "Facebook" },
                { icon: Twitter, href: "https://twitter.com/codecrafters", label: "Twitter" },
                { icon: Instagram, href: "https://instagram.com/codecrafters", label: "Instagram" },
                { icon: Linkedin, href: "https://linkedin.com/company/codecrafters", label: "LinkedIn" },
              ].map((social, index) => (
                <a
                  key={`${social.label}-${index}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-muted/50 hover:bg-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <div className="pt-4">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © 2026 CodeCrafters. Tüm hakları saklıdır.
            <Heart className="h-4 w-4 text-red-500 inline fill-red-500" />
            ile Türkiye'de geliştirildi
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/gizlilik-politikasi" className="text-muted-foreground hover:text-foreground transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/kullanim-sartlari" className="text-muted-foreground hover:text-foreground transition-colors">
              Kullanım Şartları
            </Link>
            <Link href="/cerez-ayarlari" className="text-muted-foreground hover:text-foreground transition-colors">
              Çerez Ayarları
            </Link>
            <Link href="/kvkk" className="text-muted-foreground hover:text-foreground transition-colors">
              KVKK
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
