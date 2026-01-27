"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedCard } from "@/components/animated-card"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { motion } from "motion/react"

export function CTASection() {
    return (
        <section className="container mx-auto px-4 py-20 md:py-32">
            <AnimatedCard>
                <Card className="relative overflow-hidden border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/5">
                    <CardContent className="p-12 md:p-16 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <CheckCircle2 className="size-16 mx-auto mb-6 text-primary" />
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance text-zinc-900 dark:text-zinc-50">
                                Hemen Başlayın
                            </h2>
                            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-pretty text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Ücretsiz hesap oluşturun, yetenekli geliştiricilerle tanışın
                            </p>
                            <Button
                                size="lg"
                                variant="default"
                                asChild
                                className="text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                            >
                                <Link href="/auth/kayit">
                                    Ücretsiz Kayıt Ol
                                    <ArrowRight className="ml-2 size-5" />
                                </Link>
                            </Button>
                        </motion.div>
                    </CardContent>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
                </Card>
            </AnimatedCard>
        </section>
    )
}
