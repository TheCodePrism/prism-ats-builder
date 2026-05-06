'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Infinity } from 'lucide-react'
import { getAIUsageStatus } from '@/app/actions/usage'
import Link from 'next/link'

type UsageStatus = Awaited<ReturnType<typeof getAIUsageStatus>>

export default function AIUsageBadge() {
  const [status, setStatus] = useState<UsageStatus>(null)

  useEffect(() => {
    getAIUsageStatus().then(setStatus)
  }, [])

  if (!status) return null

  // Personal key: show unlimited badge
  if (status.unlimited) {
    return (
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-bold">
        <Infinity className="w-3.5 h-3.5" />
        <span>Unlimited AI</span>
      </div>
    )
  }

  const { current, limit } = status as { current: number, limit: number, mode: string, unlimited: false }
  const remaining = limit - current
  const isLow = remaining <= 2
  const isDepleted = remaining <= 0
  const progress = Math.min((current / limit) * 100, 100)

  if (isDepleted) {
    return (
      <Link
        href="/dashboard"
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-all"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>AI Limit Reached · Add Key</span>
      </Link>
    )
  }

  return (
    <div className={`hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${isLow ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-primary/5 text-primary border-primary/10'}`}>
      <Sparkles className="w-3.5 h-3.5" />
      <div className="flex flex-col gap-0.5">
        <span className="leading-none">{remaining} AI uses left</span>
        <div className="w-16 h-1 bg-primary/10 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${isLow ? 'bg-amber-500' : 'bg-primary'}`}
            style={{ width: `${100 - progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
