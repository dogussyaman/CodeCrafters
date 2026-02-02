"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import { useAuth } from "@/hooks/use-auth";

/** Ana navigasyon linkleri. Projeler, Terimler vb. footer'da. */
const navItems = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/is-ilanlari", label: "İş İlanları" },
  { href: "/isveren", label: "İşveren" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
];

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  const [hover, setHover] = useState(false);
  const showUnderline = active || hover;

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={href}
        className={`relative z-10 block px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
          active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {label}
      </Link>
      <motion.span
        className="absolute left-0 -bottom-px h-0.5 bg-primary rounded-full origin-left"
        initial={false}
        animate={{ width: showUnderline ? "100%" : "0%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        style={{
          boxShadow: showUnderline ? "0 2px 10px rgba(168,85,247,0.35)" : "none",
        }}
      />
    </motion.div>
  );
}

export function ModernNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, loading, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const getDashboardLink = () => {
    // Rol bilgisi henüz yüklenmemişse default olarak geliştirici paneline yönlendir
    // Dashboard sayfası kendi içinde doğru yönlendirmeyi yapacaktır
    if (role === "admin") return "/dashboard/admin";
    if (role === "hr") return "/dashboard/ik";
    return "/dashboard/gelistirici";
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 24, stiffness: 200 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 min-w-0">
          <div className="shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation - ortada, sadece md+ */}
          <nav
            className="hidden md:flex items-center justify-center flex-1 gap-1 min-w-0"
            aria-label="Ana menü"
          >
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={active}
                />
              );
            })}
          </nav>

          {/* Desktop Actions - sadece md+ */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <div className="h-5 w-px bg-border/50" />
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-9 w-24 rounded-md bg-muted/60 animate-pulse" />
                <div className="h-9 w-20 rounded-md bg-muted/60 animate-pulse" />
              </div>
            ) : (
              <>
                {user ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="rounded-lg border-border hover:bg-muted/50 hover:text-foreground gap-2 transition-colors"
                    >
                      <Link href={getDashboardLink()}>
                        <LayoutDashboard className="size-4" />
                        Panelim
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="rounded-lg border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 gap-2 transition-colors"
                    >
                      <LogOut className="size-4" />
                      Çıkış
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-border/60 hover:text-foreground hover:border-border hover:bg-muted/50 text-foreground transition-colors"
                    >
                      <Link href="/auth/giris">Giriş Yap</Link>
                    </Button>
                    <Button
                      size="sm"
                      asChild
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow transition-all duration-200"
                    >
                      <Link href="/auth/kayit">Başlayın</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button - sadece mobil */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground p-2.5 -mr-2 hover:bg-muted/50 rounded-lg transition-colors active:bg-muted touch-manipulation"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <X className="size-6" />
                ) : (
                  <Menu className="size-6" />
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - tam genişlik, animasyonlu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <nav
              className="container mx-auto px-4 py-4 space-y-1"
              aria-label="Mobil menü"
            >
              {navItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "text-foreground bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="pt-4 mt-4 space-y-2 border-t border-border/50">
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-11 w-full rounded-lg bg-muted/60 animate-pulse" />
                    <div className="h-11 w-full rounded-lg bg-muted/60 animate-pulse" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {user ? (
                      <>
                        <Button
                          variant="outline"
                          asChild
                          className="w-full justify-center gap-2 h-11 rounded-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link href={getDashboardLink()}>
                            <LayoutDashboard className="size-4" />
                            Panelim
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleLogout}
                          className="w-full justify-center gap-2 h-11 rounded-lg text-destructive hover:bg-destructive/10 hover:border-destructive/50"
                        >
                          <LogOut className="size-4" />
                          Çıkış Yap
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          asChild
                          className="w-full h-11 rounded-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link href="/auth/giris">Giriş Yap</Link>
                        </Button>
                        <Button
                          asChild
                          className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link href="/auth/kayit">Başlayın</Link>
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
