'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { Plus, Trash2, Tag, X, Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { optimizeContentAction } from '@/app/actions/ai'
import { calculateATSScore } from '@/lib/ats-engine'
import { toast } from 'sonner'

export default function ResumeForm() {
  const { 
    data, 
    updatePersonalInfo, 
    addExperience, 
    updateExperience, 
    removeExperience, 
    addEducation, 
    updateEducation, 
    removeEducation,
    updateSkills 
  } = useResumeStore()

  const [skillInput, setSkillInput] = useState('')
  const [optimizingId, setOptimizingId] = useState<string | null>(null)

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault()
      if (!data.skills.includes(skillInput.trim())) {
        updateSkills([...data.skills, skillInput.trim()])
      }
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    updateSkills(data.skills.filter(s => s !== skill))
  }

  const handleOptimize = async (id: string, currentContent: string) => {
    if (!data.jobDescription) {
      toast.error('Please provide a Job Description first to optimize content.')
      return
    }

    setOptimizingId(id)
    const { missing } = calculateATSScore(data, data.jobDescription)
    
    const result = await optimizeContentAction(currentContent, data.jobDescription, missing)
    
    if (result.success && result.optimized) {
      updateExperience(id, { description: result.optimized })
      toast.success('Content optimized successfully!')
    } else {
      toast.error(result.error || 'Failed to optimize content')
    }
    setOptimizingId(null)
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Personal Info */}
      <section className="glass p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">01</span>
          Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <InputGroup label="Full Name" value={data.personalInfo.fullName} onChange={(v) => updatePersonalInfo({ fullName: v })} placeholder="John Doe" />
          <InputGroup label="Email" value={data.personalInfo.email} onChange={(v) => updatePersonalInfo({ email: v })} placeholder="john@example.com" />
          <InputGroup label="Phone" value={data.personalInfo.phone} onChange={(v) => updatePersonalInfo({ phone: v })} placeholder="+1 234 567 890" />
          <InputGroup label="Location" value={data.personalInfo.location} onChange={(v) => updatePersonalInfo({ location: v })} placeholder="New York, NY" />
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Professional Summary</label>
            <textarea
              className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary/20 outline-none min-h-[120px] transition-all"
              value={data.personalInfo.summary}
              onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
              placeholder="Tell your professional story..."
            />
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="glass p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">02</span>
            Experience
          </h2>
          <button onClick={addExperience} className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <AnimatePresence>
            {data.experience.map((exp) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 border border-border rounded-xl bg-background/50 relative group overflow-hidden"
              >
                <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Company" value={exp.company} onChange={(v) => updateExperience(exp.id, { company: v })} />
                  <InputGroup label="Role" value={exp.role} onChange={(v) => updateExperience(exp.id, { role: v })} />
                  <InputGroup label="Start Date" value={exp.startDate} onChange={(v) => updateExperience(exp.id, { startDate: v })} />
                  <InputGroup label="End Date" value={exp.endDate} onChange={(v) => updateExperience(exp.id, { endDate: v })} />
                  <div className="col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-muted-foreground">Description</label>
                      <button
                        onClick={() => handleOptimize(exp.id, exp.description)}
                        disabled={optimizingId === exp.id}
                        className="text-xs font-bold text-primary flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-md hover:bg-primary/20 transition-all disabled:opacity-50"
                      >
                        {optimizingId === exp.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        {optimizingId === exp.id ? 'Optimizing...' : 'Optimize with AI'}
                      </button>
                    </div>
                    <textarea
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Education */}
      <section className="glass p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">03</span>
            Education
          </h2>
          <button onClick={addEducation} className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <AnimatePresence>
            {data.education.map((edu) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 border border-border rounded-xl bg-background/50 relative group overflow-hidden"
              >
                <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="School" value={edu.school} onChange={(v) => updateEducation(edu.id, { school: v })} />
                  <InputGroup label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, { degree: v })} />
                  <InputGroup label="Start Date" value={edu.startDate} onChange={(v) => updateEducation(edu.id, { startDate: v })} />
                  <InputGroup label="End Date" value={edu.endDate} onChange={(v) => updateEducation(edu.id, { endDate: v })} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Skills */}
      <section className="glass p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">04</span>
          Skills
        </h2>
        <div className="space-y-4">
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Type a skill and press Enter (e.g. React, Python)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {data.skills.map((skill) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium flex items-center gap-1.5 group"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  )
}

function InputGroup({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-muted-foreground">{label}</label>
      <input
        type="text"
        className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
