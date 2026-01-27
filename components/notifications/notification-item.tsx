"use client"

import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { Bell, Briefcase, FileText, Mail, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import type { Notification } from "@/lib/types"
import { cn } from "@/lib/utils"

interface NotificationItemProps {
    notification: Notification
    onMarkAsRead: (id: string) => void
}

const getNotificationIcon = (type: string) => {
    switch (type) {
        case "new_application":
            return <Briefcase className="size-5 text-blue-500" />
        case "application_status_changed":
            return <FileText className="size-5 text-orange-500" />
        case "new_match":
            return <CheckCircle2 className="size-5 text-green-500" />
        case "cv_processed":
            return <CheckCircle2 className="size-5 text-green-500" />
        case "cv_failed":
            return <XCircle className="size-5 text-red-500" />
        case "new_contact_message":
            return <Mail className="size-5 text-purple-500" />
        case "system":
            return <AlertCircle className="size-5 text-amber-500" />
        default:
            return <Bell className="size-5 text-muted-foreground" />
    }
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
    const isUnread = !notification.read_at

    const handleClick = () => {
        if (isUnread) {
            onMarkAsRead(notification.id)
        }
    }

    const content = (
        <div
            className={cn(
                "flex gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                isUnread
                    ? "bg-primary/5 hover:bg-primary/10 border-l-2 border-primary"
                    : "hover:bg-muted/50"
            )}
            onClick={handleClick}
        >
            <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>

            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm font-medium", isUnread && "text-foreground")}>
                        {notification.title}
                    </p>
                    {isUnread && (
                        <div className="flex-shrink-0 size-2 bg-primary rounded-full mt-1.5" />
                    )}
                </div>

                {notification.body && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.body}
                    </p>
                )}

                <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: tr,
                    })}
                </p>
            </div>
        </div>
    )

    if (notification.href) {
        return (
            <Link href={notification.href} className="block">
                {content}
            </Link>
        )
    }

    return content
}
