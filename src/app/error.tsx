'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full glass p-10 rounded-3xl border border-red-500/20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/10 blur-[60px] rounded-full -z-10" />
        
        <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-black italic mb-4 uppercase tracking-tight">System Glitch</h1>
        <p className="text-muted-foreground mb-8">
          The forge has encountered an unexpected error. Don&apos;t worry, your progress is likely safe.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-5 h-5" />
            RETRY ACTION
          </button>
          
          <Link
            href="/"
            className="w-full py-4 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-muted transition-all flex items-center justify-center gap-2 border border-border/50"
          >
            <Home className="w-5 h-5" />
            RETURN TO BASE
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Error ID: {error.digest || 'UNKNOWN_ANOMALY'}
          </p>
        </div>
      </div>
    </div>
  )
}
