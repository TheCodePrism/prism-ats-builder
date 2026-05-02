'use client'

import { useResumeStore, ResumeData } from '@/store/useResumeStore'

export default function ResumePreview({ data: propsData }: { data?: ResumeData }) {
  const storeData = useResumeStore((state) => state.data)
  const data = propsData || storeData
  
  const style = {
    '--primary-color': data.settings.primaryColor,
    '--font-family': data.settings.fontFamily,
    '--font-size': `${data.settings.fontSize}px`,
  } as React.CSSProperties

  return (
    <div style={style} className="resume-preview-container">
      {data.template === 'modern' ? (
        <ModernTemplate data={data} />
      ) : data.template === 'minimal' ? (
        <MinimalTemplate data={data} />
      ) : (
        <ClassicTemplate data={data} />
      )}
    </div>
  )
}

function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills } = data
  return (
    <div className="bg-white text-slate-900 shadow-2xl rounded-sm aspect-[1/1.41] p-[5%] overflow-y-auto font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--font-size)' }}>
      <header className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-2" style={{ color: 'var(--primary-color)' }}>{personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-[0.8em] font-medium text-slate-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-[0.9em] font-bold uppercase border-b border-slate-300 mb-2">Professional Summary</h2>
          <p className="text-[0.85em] leading-relaxed text-slate-700">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[0.9em] font-bold uppercase border-b border-slate-300 mb-4">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-slate-900 text-[0.9em]">{exp.role || 'Role'}</h3>
                    <p className="text-slate-700 font-medium text-[0.8em]">{exp.company || 'Company'}</p>
                  </div>
                  <div className="text-right text-[0.7em] text-slate-600 uppercase">
                    <p>{exp.startDate} — {exp.endDate || 'Present'}</p>
                  </div>
                </div>
                <p className="text-[0.8em] text-slate-700 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[0.9em] font-bold uppercase border-b border-slate-300 mb-4">Education</h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 text-[0.8em]">{edu.school || 'School'}</h3>
                  <p className="text-slate-700 text-[0.8em]">{edu.degree || 'Degree'}</p>
                </div>
                <div className="text-right text-[0.7em] text-slate-600">
                  <p>{edu.startDate}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="text-[0.9em] font-bold uppercase border-b border-slate-300 mb-2">Skills</h2>
          <p className="text-[0.8em] text-slate-700">
            {skills.join(' • ')}
          </p>
        </section>
      )}
    </div>
  )
}

function ModernTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills } = data
  return (
    <div className="bg-white text-slate-900 shadow-2xl rounded-sm aspect-[1/1.41] flex overflow-hidden font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--font-size)' }}>
      {/* Sidebar */}
      <div className="w-[32%] text-white p-6 flex flex-col" style={{ backgroundColor: 'var(--primary-color)' }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold leading-tight mb-4">{personalInfo.fullName || 'Name'}</h1>
          <div className="space-y-3 text-[0.75em] opacity-90">
            {personalInfo.email && <p className="truncate">{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[0.75em] font-bold uppercase tracking-widest opacity-60 mb-4 border-b border-white/20 pb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="px-2 py-1 bg-white/10 rounded text-[0.7em]">{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {personalInfo.summary && (
          <section className="mb-8">
            <h2 className="text-[0.8em] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--primary-color)' }}>About Me</h2>
            <p className="text-[0.85em] leading-relaxed text-slate-600 italic">"{personalInfo.summary}"</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-[0.8em] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--primary-color)' }}>Professional Path</h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-slate-100">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }} />
                  <div className="mb-1">
                    <h3 className="font-bold text-slate-900 text-[0.85em]">{exp.role}</h3>
                    <p className="text-slate-500 text-[0.75em] font-medium">{exp.company} | {exp.startDate}</p>
                  </div>
                  <p className="text-[0.8em] text-slate-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function MinimalTemplate({ data }: { data: ResumeData }) {
  return <ClassicTemplate data={data} />
}
