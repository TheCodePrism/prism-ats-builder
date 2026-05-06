'use server'

import { optimizeResumeContent, analyzeResumeAI } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { headers } from 'next/headers'

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

    // If using platform AI: Check limit
    if (user.aiUsage >= USER_LIMIT) {
      return { allowed: false, error: `Limit reached (${USER_LIMIT} free uses). Please add your own API key in settings.` }
    }

    return { allowed: true, userId: user.id, currentUsage: user.aiUsage }
  }

  // 2. If Guest
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

async function incrementUsage(config: any) {
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
  } catch (error: any) {
    console.error('AI Optimization Error:', error)
    return { success: false, error: error.message || 'Failed to optimize content' }
  }
}

export async function analyzeResumeAction(resumeData: any, jobDescription: string) {
  try {
    const config = await getAIConfig()
    if (!config.allowed) return { success: false, error: config.error }

    const analysis = await analyzeResumeAI(resumeData, jobDescription, config.apiKey || undefined)
    
    await incrementUsage(config)
    return { success: true, analysis }
  } catch (error: any) {
    console.error('AI Analysis Error:', error)
    return { success: false, error: error.message || 'Failed to perform AI analysis' }
  }
}
