import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
    className?: string
    showText?: boolean
    href?: string
}

export function Logo({ className, showText = true, href = "/" }: LogoProps) {
    return (
        <Link
            href={href}
            className={cn("flex items-center gap-2 select-none", className)}
        >
            {/* Icon */}
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="block text-indigo-600 dark:text-indigo-400 shrink-0"
            >
                <path
                    d="M6 28L14 6"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                />
                <path
                    d="M13 28L19 12"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                />
                <circle cx="22" cy="27" r="3" className="fill-current" />
            </svg>

            {/* Text */}
            {showText && (
                <div className="relative">
                    <span className="absolute -mt-1 text-xl font-semibold tracking-tight text-foreground leading-none flex items-center">
                        Code<span className="font-bold">Crafters</span>
                    </span>
                </div>
            )}
        </Link>
    )
}
