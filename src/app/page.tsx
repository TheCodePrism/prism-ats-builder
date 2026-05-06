'use client'

import { motion } from 'framer-motion'
import { FileText, Zap, Target, Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-grid">
      {/* Navigation */}
      <nav className="glass border-b border-border px-6 py-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
              <img 
                src="/logo.png" 
                alt="ResumeForge AI Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-black italic text-primary tracking-tighter">
              RESUMEFORGE AI
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              DASHBOARD
            </Link>
            <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              SIGN IN
            </Link>
            <Link 
              href="/register" 
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-40 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3] 
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full" 
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2] 
              }}
              transition={{ duration: 12, repeat: Infinity }}
              className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[120px] rounded-full" 
            />
          </div>

          <div className="container px-4 mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-black tracking-[0.2em] text-primary uppercase bg-primary/5 rounded-full border border-primary/20 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                The AI Resume Finisher is Here
              </span>
              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9] uppercase italic">
                Forge Your <br />
                <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient">Future</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg lg:text-2xl text-muted-foreground mb-12 font-medium">
                Build <span className="text-foreground font-bold">ATS-Optimized</span> resumes that recruiters actually want to read. Level up your career quest with our deep AI engine.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  href="/builder"
                  className="w-full sm:w-auto px-12 py-6 bg-primary text-primary-foreground font-black tracking-tighter rounded-2xl shadow-2xl shadow-primary/40 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 group text-xl italic"
                >
                  START YOUR QUEST
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link 
                  href="/dashboard"
                  className="w-full sm:w-auto px-12 py-6 bg-background/50 backdrop-blur-md text-foreground font-black tracking-tighter rounded-2xl hover:bg-secondary/50 transition-all border border-border/50 text-xl italic"
                >
                  DASHBOARD
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-32 relative">
          <div className="container px-4 mx-auto">
            <div className="grid md:grid-cols-3 gap-10">
              <FeatureCard
                index={0}
                icon={<Target className="w-10 h-10 text-primary" />}
                title="ATS Scoring"
                description="Real-time feedback on how recruiter systems see your resume. Hit the S-Rank score to win the shortlist."
              />
              <FeatureCard
                index={1}
                icon={<Zap className="w-10 h-10 text-accent" />}
                title="AI Optimizer"
                description="Our engine rewrites your bullets to quantify impact and inject missing keywords naturally."
              />
              <FeatureCard
                index={2}
                icon={<Star className="w-10 h-10 text-yellow-500" />}
                title="Solo Leveling"
                description="Gamify your career hunt. Gain XP, level up your profile, and reach the top 1% of candidates."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 ResumeForge AI. All rights reserved. Built for Hunters.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, index }: { icon: React.ReactNode, title: string, description: string, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="p-10 glass rounded-[3rem] border border-border/50 hover:border-primary/40 transition-all card-hover relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
      <div className="mb-6 relative">
        <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center shadow-inner border border-border group-hover:border-primary/30 transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter italic group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-lg">{description}</p>
    </motion.div>
  )
}
