'use client'

import ResumePreview from '@/components/builder/ResumePreview'
import { ResumeData } from '@/store/useResumeStore'

export default function ResumePreviewWrapper({ data }: { data: ResumeData }) {
  return <ResumePreview data={data} />
}
