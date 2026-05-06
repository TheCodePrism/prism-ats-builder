'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Layout, Rocket, ChevronRight, X } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'

export default function OnboardingModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1)
  const { data, updateJobDescription, setTemplate } = useResumeStore()

  const nextStep = () => setStep(s => s + 1)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full glass p-8 rounded-3xl border border-primary/20 shadow-2xl relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-4">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tight">Begin Your Quest</h2>
              <p className="text-muted-foreground">To forge the perfect resume, we first need to know your target. What role are you hunting for?</p>
              <input
                type="text"
                placeholder="e.g. Senior Software Engineer"
                className="w-full bg-background border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none text-lg font-bold"
              />
              <button onClick={nextStep} className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 group">
                CONTINUE <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tight">Target Spotted</h2>
              <p className="text-muted-foreground">Paste the Job Description here. Our engine will analyze it instantly to guide your build.</p>
              <textarea
                value={data.jobDescription}
                onChange={(e) => updateJobDescription(e.target.value)}
                placeholder="Paste the JD here..."
                className="w-full bg-background border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none min-h-[200px] text-sm"
              />
              <button onClick={nextStep} className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 group">
                SCAN JOB DESCRIPTION <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-4">
                <Layout className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tight">Pick Your Armor</h2>
              <p className="text-muted-foreground">Choose a starting template. You can always change this later.</p>
              <div className="grid grid-cols-3 gap-4">
                <TemplateOption label="Classic" isActive={data.template === 'classic'} onClick={() => setTemplate('classic')} />
                <TemplateOption label="Modern" isActive={data.template === 'modern'} onClick={() => setTemplate('modern')} />
                <TemplateOption label="Minimal" isActive={data.template === 'minimal'} onClick={() => setTemplate('minimal')} />
              </div>
              <button onClick={onClose} className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 group">
                ENTER THE FORGE <Rocket className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function TemplateOption({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-2xl border-2 transition-all text-center ${isActive ? 'border-primary bg-primary/10' : 'border-border bg-background hover:border-primary/20'}`}
    >
      <div className={`w-full aspect-[1/1.4] bg-muted rounded-md mb-3 border ${isActive ? 'border-primary/30' : 'border-border'}`} />
      <span className="font-bold text-sm">{label}</span>
    </button>
  )
}
