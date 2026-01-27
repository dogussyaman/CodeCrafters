"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AnimatedCard } from "@/components/animated-card"
import { motion } from "motion/react"

const steps = [
    {
        step: "01",
        title: "Hesap Oluşturun",
        description: "Geliştirici veya İK olarak ücretsiz kaydolun, profilinizi tamamlayın",
    },
    {
        step: "02",
        title: "CV veya İlan Ekleyin",
        description: "Geliştiriciler CV yükler, İK uzmanları iş ilanı oluşturur",
    },
    {
        step: "03",
        title: "Eşleşmeleri Keşfedin",
        description: "Yapay zeka en uygun eşleşmeleri bulur, siz de iletişime geçin",
    },
]

export function HowItWorksSection() {
    return (
        <section id="nasil-calisir" className="relative py-20 md:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
            <div className="container mx-auto px-4 relative">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6 text-balance"
                    >
                        <span className="gradient-text">Nasıl Çalışır?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty"
                    >
                        Üç basit adımda başlayın ve fırsatları keşfedin
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {steps.map((item, idx) => (
                        <AnimatedCard key={idx} delay={idx * 0.15} className="text-center">
                            <div className="relative">
                                <div className="text-7xl font-bold gradient-text opacity-20 mb-4">{item.step}</div>
                                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all">
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </AnimatedCard>
                    ))}
                </div>
            </div>
        </section>
    )
}
