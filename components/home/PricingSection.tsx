"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Info } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type BillingPeriod = "monthly" | "annually"

interface PlanFeature {
    text: string
    tooltip?: string
}

interface PricingPlan {
    name: string
    description: string
    monthlyPrice: number
    yearlyPrice: number
    features: PlanFeature[]
    popular?: boolean
    cta: string
    ctaLink: string
}

const plans: PricingPlan[] = [
    {
        name: "Başlangıç",
        description: "Bireyler ve küçük projeler için ideal",
        monthlyPrice: 290,
        yearlyPrice: 232,
        features: [
            { text: "5 takım üyesine kadar", tooltip: "Projenize 5 kişiye kadar üye ekleyebilirsiniz" },
            { text: "10GB depolama alanı", tooltip: "CV, belge ve dosyalar için güvenli alan" },
            { text: "Temel analitik", tooltip: "Başvuru ve eşleşme istatistikleri" },
        ],
        cta: "Planı Satın Al",
        ctaLink: "/auth/kayit?plan=baslangic",
    },
    {
        name: "Standart",
        description: "Büyüyen takımlar ve işletmeler için ideal",
        monthlyPrice: 490,
        yearlyPrice: 392,
        popular: true,
        features: [
            { text: "20 takım üyesine kadar", tooltip: "Ekibinizi genişletin" },
            { text: "50GB depolama alanı", tooltip: "Daha fazla dosya ve belge saklayın" },
            { text: "Gelişmiş analitik", tooltip: "Detaylı raporlar ve grafikler" },
            { text: "Öncelikli destek", tooltip: "7/24 öncelikli teknik destek" },
        ],
        cta: "Planı Satın Al",
        ctaLink: "/auth/kayit?plan=standart",
    },
    {
        name: "Premium",
        description: "Büyük kurumlar ve ileri düzey ihtiyaçlar için",
        monthlyPrice: 990,
        yearlyPrice: 792,
        features: [
            { text: "Sınırsız takım üyesi", tooltip: "Tüm ekibinizi dahil edin" },
            { text: "250GB depolama alanı", tooltip: "Kurumsal düzeyde depolama" },
            { text: "Özel analitik", tooltip: "Kişiselleştirilmiş raporlama paneli" },
            { text: "7/24 premium destek", tooltip: "Özel hesap yöneticisi ile iletişim" },
            { text: "White-label", tooltip: "Kendi markanızla kullanın" },
        ],
        cta: "Planı Satın Al",
        ctaLink: "/auth/kayit?plan=premium",
    },
]

function PricingCard({
    plan,
    billingPeriod,
    delay,
}: {
    plan: PricingPlan
    billingPeriod: BillingPeriod
    delay: number
}) {
    const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="h-full"
        >
            <Card
                className={cn(
                    "relative h-full flex flex-col transition-all duration-300",
                    "bg-card border-border hover:shadow-lg",
                    plan.popular && "border-2 border-primary shadow-lg shadow-primary/10"
                )}
            >
                {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-foreground text-background hover:bg-foreground px-3 py-1 text-xs font-medium rounded-full">
                            En Popüler
                        </Badge>
                    </div>
                )}

                <CardContent className="p-8 flex-grow flex flex-col">
                    {/* Header */}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-bold text-foreground">₺{price}</span>
                            <span className="text-muted-foreground">/ay</span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                        asChild
                        className={cn(
                            "w-full mb-8",
                            plan.popular
                                ? "bg-foreground text-background hover:bg-foreground/90"
                                : "bg-muted text-foreground hover:bg-muted/80"
                        )}
                    >
                        <Link href={plan.ctaLink}>{plan.cta}</Link>
                    </Button>

                    {/* Features */}
                    <div className="flex-grow">
                        <p className="text-sm font-medium text-foreground mb-4">
                            {plan.name === "Başlangıç" ? "Neler dahil:" : plan.name === "Standart" ? "Başlangıç'taki her şey, artı:" : "Standart'taki her şey, artı:"}
                        </p>
                        <TooltipProvider>
                            <ul className="space-y-3">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <Check className="size-4 text-muted-foreground shrink-0" />
                                            <span className="text-sm text-foreground">{feature.text}</span>
                                        </div>
                                        {feature.tooltip && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="size-4 text-muted-foreground/50 hover:text-muted-foreground cursor-help shrink-0" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-sm max-w-[200px]">{feature.tooltip}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </TooltipProvider>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export function PricingSection() {
    const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("annually")

    return (
        <section id="ucretlendirme" className="container mx-auto px-4 py-20 md:py-32">
            <div className="text-center mb-12">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold mb-6"
                >
                    Size Uygun <span className="gradient-text">Planı Seçin</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
                >
                    İhtiyaçlarınıza göre en uygun planı seçin ve hemen başlayın
                </motion.p>

                {/* Billing Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-1 p-1 rounded-full border border-border bg-muted/50"
                >
                    <button
                        onClick={() => setBillingPeriod("monthly")}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-transparent",
                            billingPeriod === "monthly"
                                ? "bg-background text-foreground shadow-sm dark:bg-white/15 dark:text-white dark:border-white/20"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Aylık
                    </button>
                    <button
                        onClick={() => setBillingPeriod("annually")}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 border border-transparent",
                            billingPeriod === "annually"
                                ? "bg-background text-foreground shadow-sm dark:bg-white/15 dark:text-white dark:border-white/20"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Yıllık
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs px-2 py-0.5">
                            %20 Tasarruf
                        </Badge>
                    </button>
                </motion.div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {plans.map((plan, idx) => (
                    <PricingCard
                        key={plan.name}
                        plan={plan}
                        billingPeriod={billingPeriod}
                        delay={idx * 0.1}
                    />
                ))}
            </div>
        </section>
    )
}
