'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from 'next/cache'

export async function updateUserApiKey(apiKey: string | null) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { openaiKey: apiKey }
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error updating API key:', error)
    return { success: false, error: 'Failed to update API key' }
  }
}

export async function getUserSettings() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return null

    return await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        openaiKey: true,
        aiUsage: true,
      }
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}
