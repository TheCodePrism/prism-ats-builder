import { getPublicResume } from '@/app/actions/share'
import ResumePreviewWrapper from '@/components/share/ResumePreviewWrapper'
import { notFound } from 'next/navigation'

export default async function PublicResumePage({ params }: { params: { id: string } }) {
  const resume = await getPublicResume(params.id)

  if (!resume) {
    notFound()
  }

  const resumeData = JSON.parse(resume.data)

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex justify-center items-start">
      <div className="max-w-[900px] w-full">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-black italic text-xs">PR</div>
            <h1 className="text-sm font-bold uppercase tracking-widest text-slate-500">Shared via Prism ATS Builder</h1>
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">
            DOWNLOAD PDF
          </button>
        </div>
        
        <ResumePreviewWrapper data={resumeData} />
      </div>
    </div>
  )
}
