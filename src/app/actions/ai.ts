'use server'

import { optimizeResumeContent, analyzeResumeAI } from '@/lib/openai'

export async function optimizeContentAction(
  content: string,
  jobDescription: string,
  missingKeywords: string[]
) {
  try {
    const optimized = await optimizeResumeContent(content, jobDescription, missingKeywords)
    return { success: true, optimized }
  } catch (error: any) {
    console.error('AI Optimization Error:', error)
    return { success: false, error: error.message || 'Failed to optimize content' }
  }
}

export async function analyzeResumeAction(resumeData: any, jobDescription: string) {
  try {
    const analysis = await analyzeResumeAI(resumeData, jobDescription)
    return { success: true, analysis }
  } catch (error: any) {
    console.error('AI Analysis Error:', error)
    return { success: false, error: 'Failed to perform AI analysis' }
  }
}
