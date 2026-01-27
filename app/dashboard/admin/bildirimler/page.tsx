"use client"

import { AdminNotificationsHeader } from "./_components/AdminNotificationsHeader"
import { AdminNotificationsForm } from "./_components/AdminNotificationsForm"
import { AdminNotificationsExamples } from "./_components/AdminNotificationsExamples"

export default function AdminNotificationsPage() {
    return (
        <div className="container mx-auto p-6 max-w-4xl min-h-screen space-y-6">
            <AdminNotificationsHeader />
            <AdminNotificationsForm />
            <AdminNotificationsExamples />
        </div>
    )
}
