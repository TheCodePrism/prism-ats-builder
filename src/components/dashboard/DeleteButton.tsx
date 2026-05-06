'use client'

import { Trash2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { deleteResume } from '@/app/actions/resume'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this resume? This cannot be undone.')) return

    setIsDeleting(true)
    const res = await deleteResume(id)
    if (res.success) {
      toast.success('Resume deleted successfully')
      router.refresh()
    } else {
      toast.error('Failed to delete resume')
      setIsDeleting(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 hover:bg-red-50 text-muted-foreground hover:text-red-500 rounded-lg transition-all disabled:opacity-50"
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  )
}
