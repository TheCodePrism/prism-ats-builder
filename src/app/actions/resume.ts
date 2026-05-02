'use server'

import { prisma } from '@/lib/prisma'
import { ResumeData } from '@/store/useResumeStore'
import { revalidatePath } from 'next/cache'

export interface Resume {
  id: string
  title: string
  data: string
  atsScore: number
  userId: string
  createdAt: Date
  updatedAt: Date
}
import { resumeDataSchema } from '@/lib/validations'

export async function saveResume(userId: string, data: ResumeData, resumeId?: string) {
  try {
    // Validate data with Zod
    const validatedData = resumeDataSchema.parse(data)

    const isExisting = resumeId && resumeId !== 'new'

    const resume = await prisma.resume.upsert({
      where: {
        id: isExisting ? resumeId : 'placeholder-id',
      },
      update: {
        data: JSON.stringify(validatedData),
        atsScore: validatedData.atsScore || 0,
      },
      create: {
        userId,
        data: JSON.stringify(validatedData),
        atsScore: validatedData.atsScore || 0,
        title: validatedData.personalInfo.fullName 
          ? `${validatedData.personalInfo.fullName}'s Resume` 
          : `Resume ${new Date().toLocaleDateString()}`,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/builder')
    return { success: true, resume }
  } catch (error: any) {
    console.error('Error saving resume:', error)
    if (error.name === 'ZodError') {
      return { success: false, error: 'Invalid data: ' + error.errors[0].message }
    }
    return { success: false, error: 'Failed to save resume' }
  }
}

export async function getResumes(userId: string): Promise<Resume[]> {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    })
    return resumes
  } catch (error) {
    console.error('Error fetching resumes:', error)
    return []
  }
}

export async function getResumeById(id: string): Promise<Resume | null> {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id },
    })
    return resume
  } catch (error) {
    console.error('Error fetching resume by id:', error)
    return null
  }
}

export async function deleteResume(id: string) {
  try {
    await prisma.resume.delete({
      where: { id },
    })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
