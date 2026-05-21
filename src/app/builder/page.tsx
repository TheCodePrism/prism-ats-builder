'use client'

import ResumeForm from '@/components/builder/ResumeForm'
import ResumePreview from '@/components/builder/ResumePreview'
import ScoreCard from '@/components/builder/ScoreCard'
import { Download, ChevronLeft, Target, Save, Check, Layout, Rocket, Palette, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useResumeStore } from '@/store/useResumeStore'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ResumePDF } from '@/components/builder/ResumePDF'
import { useEffect, useState, useTransition } from 'react'
import { saveResume, getResumeById } from '@/app/actions/resume'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import OnboardingModal from '@/components/builder/OnboardingModal'
import ImportResumeModal from '@/components/builder/ImportResumeModal'
import ThemeCustomizer from '@/components/builder/ThemeCustomizer'
import { toast } from 'sonner'
import AIUsageBadge from '@/components/builder/AIUsageBadge'

export default function BuilderPage() {
  const { data, updateJobDescription, setResumeData, resetResume, setTemplate } = useResumeStore()
  const { data: session } = useSession()
  const [isMounted, setIsMounted] = useState(false)
  const [showJD, setShowJD] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [, startTransition] = useTransition()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('id')

  useEffect(() => {
    if (resumeId) {
      const loadResume = async () => {
        const result = await getResumeById(resumeId)
        if (result && result.data) {
          setResumeData(JSON.parse(result.data))
        }
      }
      loadResume()
    } else {
      resetResume()
      setTimeout(() => setShowOnboarding(true), 0)
    }
  }, [resumeId, setResumeData, resetResume])

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 0)
  }, [])

  const handleSave = () => {
    if (!session || !session.user) {
      toast.error('Please sign in to save your resume.')
      return
    }

    setSaveStatus('saving')
    startTransition(async () => {
      const result = await saveResume(session.user.id, data, resumeId || undefined)
      if (result.success) {
        setSaveStatus('saved')
        toast.success('Resume saved successfully!')
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
        toast.error(result.error || 'Failed to save resume')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} onImport={() => setShowImport(true)} />
      <ImportResumeModal isOpen={showImport} onClose={() => setShowImport(false)} />
      
      {/* Top Header */}
      <header className="sticky top-0 z-50 glass border-b border-border px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-muted rounded-lg transition-all">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Resume Builder
              {!session && <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground uppercase tracking-widest">Guest Mode</span>}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowImport(true)}
              className="p-2 hover:bg-muted rounded-lg text-primary transition-all flex items-center gap-2 text-sm font-bold"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="hidden md:inline">Import Resume</span>
            </button>
            
            <button 
              onClick={() => setShowOnboarding(true)}
              className="p-2 hover:bg-muted rounded-lg text-primary transition-all flex items-center gap-2 text-sm font-bold"
            >
              <Rocket className="w-4 h-4" />
              <span className="hidden md:inline">Guided Start</span>
            </button>
            
            <AIUsageBadge />

            <button 
              onClick={() => { setShowTemplates(!showTemplates); setShowJD(false); }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-all ${showTemplates ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
            >
              <Layout className="w-4 h-4" />
              Templates & Style
            </button>
            <button 
              onClick={() => { setShowJD(!showJD); setShowTemplates(false); }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-all ${showJD ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
            >
              <Target className="w-4 h-4" />
              Target Job
            </button>

            <button 
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-semibold hover:bg-muted text-foreground"
            >
              {saveStatus === 'saving' ? (
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : saveStatus === 'saved' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saveStatus === 'saved' ? 'Saved!' : saveStatus === 'saving' ? 'Saving...' : 'Save Draft'}
            </button>
            
            {isMounted && (
              <PDFDownloadLink
                document={<ResumePDF data={data} />}
                fileName={`${data.personalInfo.fullName || 'resume'}.pdf`}
              >
                {({ loading }: { loading: boolean }) => (
                  <button 
                    disabled={loading}
                    className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    {loading ? 'Preparing...' : 'Download PDF'}
                  </button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Side: Form */}
          <div className="lg:col-span-7 max-h-[calc(100vh-160px)] overflow-y-auto pr-4 scrollbar-hide">
            {showTemplates && (
              <div className="mb-8 glass p-6 rounded-2xl border border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                      <Layout className="w-5 h-5" />
                      Layout
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      <TemplateOption label="Classic ATS" isActive={data.template === 'classic'} onClick={() => setTemplate('classic')} />
                      <TemplateOption label="Modern Sidebar" isActive={data.template === 'modern'} onClick={() => setTemplate('modern')} />
                      <TemplateOption label="Minimalist" isActive={data.template === 'minimal'} onClick={() => setTemplate('minimal')} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                      <Palette className="w-5 h-5" />
                      Visual Identity
                    </h2>
                    <ThemeCustomizer />
                  </div>
                </div>
              </div>
            )}
            
            {showJD && (
              <div className="mb-8 glass p-6 rounded-2xl border border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-4 duration-300">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                  <Target className="w-5 h-5" />
                  Target Job Description
                </h2>
                <textarea
                  className="w-full bg-background border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none min-h-[200px] text-sm"
                  placeholder="Paste the full job description text here..."
                  value={data.jobDescription}
                  onChange={(e) => updateJobDescription(e.target.value)}
                />
              </div>
            )}
            <ResumeForm />
          </div>

          {/* Right Side: Score & Preview */}
          <div className="lg:col-span-5 sticky top-28 hidden lg:flex flex-col gap-8">
            <ScoreCard />
            <ResumePreview />
          </div>
        </div>
      </main>
    </div>
  )
}

function TemplateOption({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all text-sm font-bold ${isActive ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background hover:border-primary/30'}`}
    >
      {label}
    </button>
  )
}
