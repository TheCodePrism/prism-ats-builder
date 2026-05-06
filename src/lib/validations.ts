import { z } from 'zod'

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").or(z.literal('')),
  phone: z.string().max(20).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url("Invalid URL").or(z.literal('')).optional(),
  summary: z.string().max(1000, "Summary is too long").optional(),
})

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().max(2000).optional(),
})

export const educationSchema = z.object({
  id: z.string(),
  school: z.string().min(1, "School name is required"),
  degree: z.string().min(1, "Degree is required"),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const resumeDataSchema = z.object({
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string()),
  jobDescription: z.string().optional(),
  atsScore: z.number().min(0).max(100).optional(),
  template: z.enum(['classic', 'modern', 'minimal']).default('classic'),
  settings: z.object({
    primaryColor: z.string().default('#0A84FF'),
    fontFamily: z.string().default('Outfit'),
    fontSize: z.number().min(8).max(20).default(12),
  }).optional(),
})

export type ValidatedResumeData = z.infer<typeof resumeDataSchema>
