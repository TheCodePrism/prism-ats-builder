'use client'

import { motion } from 'framer-motion'
import { Check, Zap, Trophy, Rocket, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const plans = [
    {
      name: "Free Hunter",
      price: "$0",
      description: "Perfect for testing your gear.",
      features: [
        "1 Active Resume",
        "Classic ATS Template",
        "Basic Keyword Scoring",
        "Standard PDF Export",
      ],
      cta: "START FOR FREE",
      href: "/register",
      highlight: false,
    },
    {
      name: "S-Rank Member",
      price: "$12",
      description: "The ultimate arsenal for serious hunters.",
      features: [
        "Unlimited Resumes",
        "All Premium Templates",
        "Advanced AI Audit",
        "Unlimited AI Content Optimization",
        "Priority PDF Forging",
        "No Watermarks",
      ],
      cta: "GO PRO NOW",
      href: "/register?plan=pro",
      highlight: true,
    }
  ]

  return (
    <div className="min-h-screen bg-background py-20 px-6 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter mb-6 uppercase">Choose Your Tier</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic">
              Level up your career hunt with professional tools designed to bypass the gatekeepers.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass p-10 rounded-[32px] border relative flex flex-col h-full transition-all hover:scale-[1.02] ${plan.highlight ? 'border-primary/50 shadow-2xl shadow-primary/10 bg-primary/5' : 'border-border/50'}`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest italic">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-black italic uppercase tracking-tight mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-6xl font-black italic">{plan.price}</span>
                <span className="text-muted-foreground font-bold uppercase tracking-widest text-xs ml-2">/ month</span>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex gap-3 items-center">
                    <div className={`p-1 rounded-full ${plan.highlight ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={plan.href}
                className={`w-full py-5 rounded-2xl font-black italic tracking-tighter text-center flex items-center justify-center gap-2 group transition-all ${plan.highlight ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/30 hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-muted border border-border'}`}
              >
                {plan.cta}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-4 uppercase tracking-widest">
            <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-primary" /> Instant Delivery</span>
            <span className="flex items-center gap-1"><Trophy className="w-4 h-4 text-accent" /> Recruiter Approved</span>
            <span className="flex items-center gap-1"><Rocket className="w-4 h-4 text-primary" /> Start Today</span>
          </p>
        </div>
      </div>
    </div>
  )
}
