'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { calculateATSScore } from '@/lib/ats-engine'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, AlertCircle, CheckCircle2, Sparkles, Loader2, ListChecks, Lightbulb } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { analyzeResumeAction } from '@/app/actions/ai'

export default function ScoreCard() {
  const { data, setAtsScore } = useResumeStore()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState<any>(null)
  
  const results = useMemo(() => {
    return calculateATSScore(data, data.jobDescription)
  }, [data])

  useEffect(() => {
    setAtsScore(results.score)
  }, [results.score, setAtsScore])

  const handleAIAnalysis = async () => {
    if (!data.jobDescription) {
      alert('Provide a Job Description for deep AI analysis.')
      return
    }
    setIsAnalyzing(true)
    const res = await analyzeResumeAction(data, data.jobDescription)
    if (res.success) {
      setAiResult(res.analysis)
    }
    setIsAnalyzing(false)
  }

  const getLevel = (score: number) => {
    if (score < 30) return 1
    if (score < 50) return 2
    if (score < 70) return 3
    if (score < 85) return 4
    return 5
  }

  const level = getLevel(results.score)

  return (
    <div className="flex flex-col gap-6">
      <div className="glass p-6 rounded-3xl border border-primary/20 bg-primary/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Current Level</h3>
            <p className="text-3xl font-black italic">LEVEL {level}</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span>ATS SCORE</span>
            <span className="text-primary italic">{results.score}%</span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden border border-border/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${results.score}%` }}
              className="h-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
        </div>

        {/* AI Audit Button */}
        <button
          onClick={handleAIAnalysis}
          disabled={isAnalyzing}
          className="w-full py-3 mb-6 bg-background border border-primary/20 hover:border-primary/50 text-primary text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {isAnalyzing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 group-hover:scale-125 transition-transform" />
          )}
          {isAnalyzing ? 'Analyzing Strategy...' : 'Deep AI Audit'}
        </button>

        {/* Suggestions */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <AlertCircle className="w-3 h-3" />
            Missing Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {results.missing.length > 0 ? (
              results.missing.map((word) => (
                <span key={word} className="px-2 py-1 bg-background border border-border rounded-md text-[10px] font-medium text-muted-foreground">
                  {word}
                </span>
              ))
            ) : (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                All keywords matched!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* AI Analysis Result */}
      <AnimatePresence>
        {aiResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-3xl border border-accent/20 bg-accent/5 space-y-6"
          >
            <div>
              <h4 className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-2 mb-3">
                <ListChecks className="w-4 h-4" />
                Success Criteria
              </h4>
              <ul className="space-y-2">
                {aiResult.successCriteria.map((item: string, i: number) => (
                  <li key={i} className="text-[11px] text-muted-foreground flex gap-2">
                    <span className="text-accent font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4" />
                Strategic Suggestions
              </h4>
              <ul className="space-y-2">
                {aiResult.suggestions.map((item: string, i: number) => (
                  <li key={i} className="text-[11px] text-muted-foreground flex gap-2 p-2 bg-background/50 rounded-lg border border-accent/10">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-accent/10 flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Impact Score</span>
              <span className="text-lg font-black text-accent italic">{aiResult.impactScore}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
