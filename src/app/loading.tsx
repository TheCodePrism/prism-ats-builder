'use client'

import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-pulse" />
        </div>
      </div>
      
      <h1 className="text-2xl font-black italic mb-2 tracking-tighter text-primary">FORGING...</h1>
      <p className="text-muted-foreground text-sm font-medium animate-pulse">
        Synchronizing your career data with the cloud.
      </p>
      
      <div className="mt-12 w-48 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-loading-bar" />
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 0%; transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}
