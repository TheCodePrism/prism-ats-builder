'use client'

import { motion } from 'framer-motion'
import { Shield, Star, Zap, Trophy, Crown } from 'lucide-react'

interface LevelSystemProps {
  score: number
}

export default function LevelSystem({ score }: LevelSystemProps) {
  const levels = [
    { name: 'Bronze Hunter', min: 0, icon: <Shield className="w-5 h-5 text-amber-700" /> },
    { name: 'Silver Hunter', min: 30, icon: <Star className="w-5 h-5 text-slate-400" /> },
    { name: 'Gold Hunter', min: 50, icon: <Star className="w-5 h-5 text-yellow-500" /> },
    { name: 'Platinum Hunter', min: 70, icon: <Zap className="w-5 h-5 text-cyan-400" /> },
    { name: 'Diamond Hunter', min: 85, icon: <Trophy className="w-5 h-5 text-blue-500" /> },
    { name: 'S-Rank Hunter', min: 95, icon: <Crown className="w-5 h-5 text-purple-500" /> },
  ]

  const currentLevelIndex = [...levels].reverse().findIndex(l => score >= l.min)
  const currentLevel = levels[levels.length - 1 - currentLevelIndex]
  const nextLevel = levels[levels.length - currentLevelIndex]

  const levelProgress = nextLevel 
    ? ((score - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 
    : 100

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            key={currentLevel.name}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="p-2.5 rounded-xl bg-card shadow-lg border border-border"
          >
            {currentLevel.icon}
          </motion.div>
          <div>
            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">
              Rank
            </h4>
            <p className="text-lg font-black italic text-foreground tracking-tight leading-none uppercase">
              {currentLevel.name}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">
            Total XP
          </p>
          <p className="text-xl font-black italic text-primary leading-none">
            {score * 125} <span className="text-[10px] uppercase not-italic">pts</span>
          </p>
        </div>
      </div>

      <div className="relative pt-2">
        <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-tighter mb-1 px-1">
          <span>Level Progress</span>
          {nextLevel && <span>Next: {nextLevel.name}</span>}
        </div>
        <div className="h-3 bg-secondary rounded-full p-0.5 border border-border/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient shadow-[0_0_10px_rgba(var(--color-primary),0.3)]"
          />
        </div>
      </div>
    </div>
  )
}
