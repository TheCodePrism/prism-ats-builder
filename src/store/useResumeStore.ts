import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Experience {
  id: string
  company: string
  role: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export interface Education {
  id: string
  school: string
  degree: string
  location: string
  startDate: string
  endDate: string
}

export interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    website: string
    summary: string
  }
  experience: Experience[]
  education: Education[]
  skills: string[]
  jobDescription: string
  atsScore: number
  template: 'classic' | 'modern' | 'minimal'
  settings: {
    primaryColor: string
    fontFamily: string
    fontSize: number
  }
}

interface ResumeState {
  data: ResumeData
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void
  addExperience: () => void
  updateExperience: (id: string, exp: Partial<Experience>) => void
  removeExperience: (id: string) => void
  addEducation: () => void
  updateEducation: (id: string, edu: Partial<Education>) => void
  removeEducation: (id: string) => void
  updateSkills: (skills: string[]) => void
  updateJobDescription: (jd: string) => void
  setAtsScore: (score: number) => void
  setResumeData: (data: ResumeData) => void
  resetResume: () => void
  setTemplate: (template: 'classic' | 'modern' | 'minimal') => void
  updateSettings: (settings: Partial<ResumeData['settings']>) => void
}

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  jobDescription: '',
  atsScore: 0,
  template: 'classic',
  settings: {
    primaryColor: '#0A84FF',
    fontFamily: 'Outfit',
    fontSize: 12,
  }
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      data: initialData,
      updatePersonalInfo: (info) =>
        set((state) => ({
          data: {
            ...state.data,
            personalInfo: { ...state.data.personalInfo, ...info },
          },
        })),
      addExperience: () =>
        set((state) => ({
          data: {
            ...state.data,
            experience: [
              ...state.data.experience,
              {
                id: crypto.randomUUID(),
                company: '',
                role: '',
                location: '',
                startDate: '',
                endDate: '',
                description: '',
              },
            ],
          },
        })),
      updateExperience: (id, exp) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.map((e) =>
              e.id === id ? { ...e, ...exp } : e
            ),
          },
        })),
      removeExperience: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.filter((e) => e.id !== id),
          },
        })),
      addEducation: () =>
        set((state) => ({
          data: {
            ...state.data,
            education: [
              ...state.data.education,
              {
                id: crypto.randomUUID(),
                school: '',
                degree: '',
                location: '',
                startDate: '',
                endDate: '',
              },
            ],
          },
        })),
      updateEducation: (id, edu) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.map((e) =>
              e.id === id ? { ...e, ...edu } : e
            ),
          },
        })),
      removeEducation: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.filter((e) => e.id !== id),
          },
        })),
      updateSkills: (skills) =>
        set((state) => ({
          data: { ...state.data, skills },
        })),
      updateJobDescription: (jd) =>
        set((state) => ({
          data: { ...state.data, jobDescription: jd },
        })),
      setAtsScore: (score) =>
        set((state) => ({
          data: { ...state.data, atsScore: score },
        })),
      setResumeData: (data) =>
        set(() => ({ data })),
      resetResume: () =>
        set(() => ({ data: initialData })),
      setTemplate: (template) =>
        set((state) => ({
          data: { ...state.data, template },
        })),
      updateSettings: (settings) =>
        set((state) => ({
          data: { ...state.data, settings: { ...state.data.settings, ...settings } },
        })),
    }),
    {
      name: 'resume-storage',
    }
  )
)
