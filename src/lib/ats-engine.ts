import { ResumeData } from '@/store/useResumeStore'

const COMMON_WORDS = new Set([
  'this', 'that', 'with', 'from', 'your', 'have', 'been', 'were', 'also', 'their',
  'which', 'will', 'about', 'would', 'there', 'some', 'could', 'other', 'them',
  'then', 'than', 'into', 'only', 'over', 'also', 'back', 'after', 'work', 'experience',
  'skills', 'ability', 'knowledge', 'preferred', 'required', 'years', 'plus', 'degree'
])

export interface ATSAnalysis {
  score: number
  matches: string[]
  missing: string[]
  aiAnalysis?: {
    successCriteria: string[]
    impactScore: number
    suggestions: string[]
  }
}

export function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !COMMON_WORDS.has(word))
}

export function calculateATSScore(resume: ResumeData, jobDescription: string): ATSAnalysis {
  if (!jobDescription) return { score: 0, matches: [], missing: [] }

  const jdKeywords = Array.from(new Set(extractKeywords(jobDescription)))
  const resumeText = JSON.stringify(resume).toLowerCase()
  
  const matches = jdKeywords.filter((keyword) => resumeText.includes(keyword))
  const missing = jdKeywords.filter((keyword) => !resumeText.includes(keyword))
  
  // Keyword Score: 50%
  const keywordScore = (matches.length / jdKeywords.length) * 50
  
  // Completeness Score: 30%
  let completenessScore = 0
  if (resume.personalInfo.fullName) completenessScore += 5
  if (resume.personalInfo.summary) completenessScore += 5
  if (resume.experience.length > 0) completenessScore += 10
  if (resume.education.length > 0) completenessScore += 5
  if (resume.skills.length > 0) completenessScore += 5
  
  // Format Score: 20% (Assumed based on template choice)
  let formatScore = 20
  if (resume.template === 'modern') formatScore = 15 // Modern is slightly less "standard" than Classic for old ATS

  const totalScore = Math.min(Math.round(keywordScore + completenessScore + formatScore), 100)
  
  return {
    score: totalScore,
    matches,
    missing: missing.slice(0, 10),
    aiAnalysis: {
      successCriteria: [], // Will be populated by AI
      impactScore: Math.round(completenessScore * 3.33), // Local estimate
      suggestions: missing.length > 0 ? [`Add keywords: ${missing.slice(0, 3).join(', ')}`] : []
    }
  }
}
