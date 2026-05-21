'use server'

import { optimizeResumeContent, analyzeResumeAI, parseResumeWithAI } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { headers } from 'next/headers'
import { ResumeData } from '@/store/useResumeStore'

const GUEST_LIMIT = 5
const USER_LIMIT = 20

async function getAIConfig() {
  const session = await getServerSession(authOptions)
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for') || '127.0.0.1'

  // 1. If Logged In
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, openaiKey: true, aiUsage: true }
    })

    if (!user) return { allowed: false, error: 'User not found' }

    // If using personal key: Unlimited
    if (user.openaiKey) {
      return { allowed: true, apiKey: user.openaiKey, userId: user.id }
    }

    // Check if platform has an API key configured
    if (!process.env.OPENAI_API_KEY) {
      return { allowed: false, error: 'Platform AI features are upcoming! To access them now, please add your personal OpenAI API Key in your Dashboard Settings.' }
    }

    // If using platform AI: Check limit
    if (user.aiUsage >= USER_LIMIT) {
      return { allowed: false, error: `Limit reached (${USER_LIMIT} free uses). Please add your own API key in settings.` }
    }

    return { allowed: true, userId: user.id, currentUsage: user.aiUsage }
  }

  // 2. If Guest
  // Check if platform has an API key configured
  if (!process.env.OPENAI_API_KEY) {
    return { allowed: false, error: 'Platform AI features are upcoming! Sign in and add your own OpenAI API key to access them early.' }
  }

  const guestUsage = await prisma.guestUsage.upsert({
    where: { ip },
    update: {},
    create: { ip }
  })

  if (guestUsage.count >= GUEST_LIMIT) {
    return { allowed: false, error: `Guest limit reached (${GUEST_LIMIT} uses). Please sign in for more free credits.` }
  }

  return { allowed: true, guestIp: ip, currentUsage: guestUsage.count }
}

async function incrementUsage(config: { apiKey?: string; userId?: string; guestIp?: string }) {
  if (config.apiKey) return // Don't increment if using personal key

  if (config.userId) {
    await prisma.user.update({
      where: { id: config.userId },
      data: { aiUsage: { increment: 1 } }
    })
  } else if (config.guestIp) {
    await prisma.guestUsage.update({
      where: { ip: config.guestIp },
      data: { count: { increment: 1 } }
    })
  }
}

export async function optimizeContentAction(
  content: string,
  jobDescription: string,
  missingKeywords: string[]
) {
  try {
    const config = await getAIConfig()
    if (!config.allowed) return { success: false, error: config.error }

    const optimized = await optimizeResumeContent(
      content, 
      jobDescription, 
      missingKeywords.join(', '), 
      config.apiKey || undefined
    )

    await incrementUsage(config)
    return { success: true, optimized }
  } catch (error) {
    console.error('AI Optimization Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to optimize content'
    return { success: false, error: errorMessage }
  }
}

export async function analyzeResumeAction(resumeData: ResumeData, jobDescription: string) {
  try {
    const config = await getAIConfig()
    if (!config.allowed) return { success: false, error: config.error }

    const analysis = await analyzeResumeAI(resumeData, jobDescription, config.apiKey || undefined)
    
    await incrementUsage(config)
    return { success: true, analysis }
  } catch (error) {
    console.error('AI Analysis Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to perform AI analysis'
    return { success: false, error: errorMessage }
  }
}

function parseResumeWithRegex(text: string) {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i;
  const phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/i;
  const linkRegex = /(https?:\/\/[^\s]+)/i;

  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(phoneRegex);
  const linkMatch = text.match(linkRegex);

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let name = '';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line.split(' ').length <= 4 && !line.match(emailRegex) && !line.match(phoneRegex) && !line.toLowerCase().includes('resume')) {
      name = line;
      break;
    }
  }

  return {
    personalInfo: {
      fullName: name || '',
      email: emailMatch ? emailMatch[1] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      location: '',
      website: linkMatch ? linkMatch[1] : '',
      summary: 'Basic text extraction used because AI is currently unavailable. Review and move details manually.\n\n---\nFull Text Extracted:\n' + text.substring(0, 1000)
    },
    experience: [],
    education: [],
    skills: []
  };
}

export async function parseResumeTextAction(text: string) {
  try {
    const config = await getAIConfig()
    
    if (!config.allowed) {
      console.log('AI not allowed, falling back to basic regex parser')
      const basicData = parseResumeWithRegex(text)
      return { 
        success: true, 
        data: basicData,
        warning: config.error // Pass the AI unavailable message as a warning
      }
    }

    const parsedData = await parseResumeWithAI(text, config.apiKey || undefined)

    // Map random UUIDs for experiences and educations
    if (parsedData.experience && Array.isArray(parsedData.experience)) {
      parsedData.experience = parsedData.experience.map((exp: Record<string, string | undefined>) => ({
        id: crypto.randomUUID(),
        company: exp.company || '',
        role: exp.role || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: exp.description || '',
      }))
    }
    if (parsedData.education && Array.isArray(parsedData.education)) {
      parsedData.education = parsedData.education.map((edu: Record<string, string | undefined>) => ({
        id: crypto.randomUUID(),
        school: edu.school || '',
        degree: edu.degree || '',
        location: edu.location || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
      }))
    }

    await incrementUsage(config)
    return { success: true, data: parsedData }
  } catch (error) {
    console.error('AI Resume Parse Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to parse resume with AI'
    return { success: false, error: errorMessage }
  }
}

export async function parseResumeFileAction(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) {
      return { success: false, error: 'No file uploaded' }
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse')
    const parsedPdf = await pdfParse(buffer)
    const extractedText = parsedPdf.text

    if (!extractedText || !extractedText.trim()) {
      return { success: false, error: 'Failed to extract text from PDF' }
    }

    return await parseResumeTextAction(extractedText)
  } catch (error) {
    console.error('PDF Parse Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to extract text and parse with AI'
    return { success: false, error: errorMessage }
  }
}
