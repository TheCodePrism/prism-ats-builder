'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function toggleResumePublic(id: string, isPublic: boolean) {
  try {
    await prisma.resume.update({
      where: { id },
      data: { isPublic },
    })
    revalidatePath('/dashboard')
    revalidatePath(`/share/${id}`)
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function getPublicResume(id: string) {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id, isPublic: true },
    })
    return resume
  } catch (error) {
    return null
  }
}
