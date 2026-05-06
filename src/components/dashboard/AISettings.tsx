'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Key, Save, Loader2, Info } from 'lucide-react'
import { updateUserApiKey } from '@/app/actions/user'
import { toast } from 'sonner'

export default function AISettings({ initialKey, initialUsage }: { initialKey: string | null, initialUsage: number }) {
  const [apiKey, setApiKey] = useState(initialKey || '')
  const [isSaving, setIsSaving] = useState(false)
  const [useCustom, setUseCustom] = useState(!!initialKey)

  const USER_LIMIT = 20
  const progress = (initialUsage / USER_LIMIT) * 100

  const handleSave = async () => {
    setIsSaving(true)
    const res = await updateUserApiKey(useCustom ? apiKey : null)
    if (res.success) {
      toast.success(useCustom ? 'Personal API Key saved!' : 'Switched to Platform AI')
    } else {
      toast.error('Failed to update settings')
    }
    setIsSaving(false)
  }

  return (
    <div className="glass p-8 rounded-[2.5rem] border border-border/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Sparkles className="w-24 h-24 text-primary" />
      </div>

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tight">AI Settings</h2>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Choose your intelligence engine</p>
          </div>
        </div>

        {/* Usage Progress */}
        {!useCustom && (
          <div className="mb-8 p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Free Tokens</span>
              <span className="text-xs font-black italic">{initialUsage} / {USER_LIMIT}</span>
            </div>
            <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-primary" 
              />
            </div>
            <p className="text-[9px] text-muted-foreground mt-2 font-medium">Using platform credits. Add your own key for unlimited usage.</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-background/50 cursor-pointer hover:border-primary/30 transition-all">
              <input 
                type="radio" 
                checked={!useCustom} 
                onChange={() => setUseCustom(false)}
                className="w-4 h-4 accent-primary"
              />
              <div className="flex-1">
                <p className="text-sm font-bold">Base Model (GPT-4o Mini)</p>
                <p className="text-[10px] text-muted-foreground">Standard optimization using free credits.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-background/50 cursor-pointer hover:border-primary/30 transition-all">
              <input 
                type="radio" 
                checked={useCustom} 
                onChange={() => setUseCustom(true)}
                className="w-4 h-4 accent-primary"
              />
              <div className="flex-1">
                <p className="text-sm font-bold">Personal API Key (GPT-4o)</p>
                <p className="text-[10px] text-muted-foreground">Unlock S-Rank quality and unlimited usage.</p>
              </div>
            </label>
          </div>

          {useCustom && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-background border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
              />
              <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-[10px] text-blue-700 leading-relaxed">
                  Your key is used directly with OpenAI. We recommend a restricted key with 
                  usage limits for maximum security.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 bg-foreground text-background font-black tracking-tighter rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSaving ? 'UPDATING...' : 'SAVE SETTINGS'}
          </button>
        </div>
      </div>
    </div>
  )
}
