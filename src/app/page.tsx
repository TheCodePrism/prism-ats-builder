'use client'

import { motion } from 'framer-motion'
import { FileText, Zap, Target, Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
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
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent blur-[120px] rounded-full" />
          </div>

          <div className="container px-4 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                The AI Finisher is Here
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-[1.1]">
                Forge Your Future with <br />
                <span className="text-primary italic">ResumeForge AI</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg lg:text-xl text-muted-foreground mb-10">
                Build ATS-optimized resumes that actually get read. Use our AI engine to level up your content and score like a top recruiter.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/builder"
                  className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground font-black tracking-tighter rounded-xl shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group text-lg"
                >
                  START BUILDING
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/login"
                  className="w-full sm:w-auto px-10 py-5 bg-secondary text-secondary-foreground font-black tracking-tighter rounded-xl hover:bg-secondary/80 transition-all border border-border/50 text-lg"
                >
                  VIEW DASHBOARD
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-muted/30 relative">
          <div className="container px-4 mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Target className="w-8 h-8 text-primary" />}
                title="ATS Scoring Engine"
                description="Real-time feedback on how recruiter systems see your resume. Score 90+ to win."
              />
              <FeatureCard
                icon={<Zap className="w-8 h-8 text-accent" />}
                title="AI Content Optimizer"
                description="Not just generation. We refine your achievements to quantify your impact perfectly."
              />
              <FeatureCard
                icon={<Star className="w-8 h-8 text-yellow-500" />}
                title="Solo Leveling System"
                description="Gamify your career hunt. Earn XP as you improve your resume and reach Level 10."
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 glass rounded-3xl border border-border/50 hover:border-primary/30 transition-all"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 uppercase tracking-tight italic">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  )
}
