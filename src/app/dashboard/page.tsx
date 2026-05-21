import { getResumes, Resume } from '@/app/actions/resume'
import { Plus, FileText, Edit3, Trophy, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from 'next/navigation'
import DeleteButton from '@/components/dashboard/DeleteButton'
import AISettings from '@/components/dashboard/AISettings'
import { getUserSettings } from '@/app/actions/user'
import Image from 'next/image'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/login')
  }

  const resumes = await getResumes(session.user.id)
  const userSettings = await getUserSettings()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border px-6 py-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 overflow-hidden rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
              <Image 
                src="/logo.png" 
                alt="Prism Logo" 
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
              PRISM ATS BUILDER
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-bold">{session.user.name}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Active Hunter</span>
            </div>
            {session.user.image ? (
              <Image src={session.user.image} alt={session.user.name || ''} width={32} height={32} className="w-8 h-8 rounded-full border border-primary/20 object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {session.user.name?.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 italic uppercase">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {session.user.name}. Your career quest continues.</p>
          </div>
          <Link
            href="/builder"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all w-fit"
          >
            <Plus className="w-5 h-5" />
            CREATE NEW RESUME
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Total Resumes" value={resumes.length.toString()} icon={<FileText className="w-5 h-5" />} />
            <StatCard title="Highest ATS Score" value={(resumes.length > 0 ? Math.max(...resumes.map(r => r.atsScore)) : 0) + '%'} icon={<Trophy className="w-5 h-5" />} />
            <div className="md:col-span-2">
              <StatCard title="Global Rank" value="Top 15%" icon={<ChevronRight className="w-5 h-5" />} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <AISettings 
              initialKey={userSettings?.openaiKey || null} 
              initialUsage={userSettings?.aiUsage || 0} 
              hasPlatformKey={!!process.env.OPENAI_API_KEY}
            />
          </div>
        </div>

        {/* Resumes List */}
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
            <span className="w-2 h-8 bg-primary rounded-full" />
            Your Saved Drafts
          </h2>
          
          {resumes.length === 0 ? (
            <div className="glass p-20 rounded-3xl border-dashed border-2 border-border flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">No resumes found</h3>
              <p className="text-muted-foreground mb-6">Start by creating your first ATS-optimized resume.</p>
              <Link href="/builder" className="text-primary font-bold hover:underline">
                Create your first resume →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="glass p-6 rounded-2xl border border-border/50">
      <div className="flex items-center gap-3 mb-4 text-muted-foreground">
        {icon}
        <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
      </div>
      <p className="text-3xl font-black italic">{value}</p>
    </div>
  )
}

function ResumeCard({ resume }: { resume: Resume }) {
  return (
    <div className="glass group p-6 rounded-3xl border border-border/50 hover:border-primary/30 transition-all card-hover relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all">
        <DeleteButton id={resume.id} />
      </div>
      
      <div className="mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold mb-1 truncate uppercase">{resume.title}</h3>
        <p className="text-xs text-muted-foreground">Updated {new Date(resume.updatedAt).toLocaleDateString()}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ATS Score</span>
          <span className="text-lg font-black text-primary italic">{resume.atsScore}%</span>
        </div>
        <Link 
          href={`/builder?id=${resume.id}`}
          className="p-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <Edit3 className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}
