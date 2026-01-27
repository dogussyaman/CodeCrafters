"use client"
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'


export default function AdminJobsPage() {
 
    return (
        <div className='container mx-auto px-4 py-8 space-y-8 min-h-screen'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold text-foreground mb-2'>İş İlanları</h1>
                    <p className='text-muted-foreground'>İş ilanlarınızı oluşturun ve yönetin</p>
                </div>
                <Button asChild>
                    <Link href='/dashboard/admin/ilanlar/olustur'>
                        <Plus className='mr-2 size-4' />
                        Yeni İlan
                    </Link>
                </Button>
            </div>

        </div>
    )
}