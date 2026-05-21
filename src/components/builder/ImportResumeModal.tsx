'use client'

import { useState, useRef, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'
import { parseResumeFileAction, parseResumeTextAction } from '@/app/actions/ai'
import { toast } from 'sonner'

export default function ImportResumeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [rawText, setRawText] = useState('')
  const [showTextPaste, setShowTextPaste] = useState(false)
  const [parseStep, setParseStep] = useState<'idle' | 'extracting' | 'parsing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isPending, startTransition] = useTransition()
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: storeData, setResumeData } = useResumeStore()

  if (!isOpen) return null

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      const fileType = droppedFile.name.split('.').pop()?.toLowerCase()
      if (fileType === 'pdf' || fileType === 'txt') {
        setFile(droppedFile)
        setErrorMessage('')
      } else {
        toast.error('Only PDF or TXT files are supported.')
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const fileType = selectedFile.name.split('.').pop()?.toLowerCase()
      if (fileType === 'pdf' || fileType === 'txt') {
        setFile(selectedFile)
        setErrorMessage('')
      } else {
        toast.error('Only PDF or TXT files are supported.')
      }
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleParse = () => {
    if (!file && (!rawText || !rawText.trim())) {
      toast.error('Please upload a file or paste your resume text.')
      return
    }

    setParseStep('extracting')
    setErrorMessage('')

    startTransition(async () => {
      try {
        let result

        if (file) {
          // If it's a PDF, upload and parse
          if (file.name.endsWith('.pdf')) {
            const formData = new FormData()
            formData.append('file', file)
            setParseStep('parsing')
            result = await parseResumeFileAction(formData)
          } else {
            // It's a text file, read on client and parse
            const text = await file.text()
            setParseStep('parsing')
            result = await parseResumeTextAction(text)
          }
        } else {
          // Raw text copy paste
          setParseStep('parsing')
          result = await parseResumeTextAction(rawText)
        }

        if (result.success && result.data) {
          const parsed = result.data
          
          // Merge parsed fields into local store data structures safely
          const updatedResume = {
            ...storeData,
            personalInfo: {
              fullName: parsed.personalInfo?.fullName || storeData.personalInfo.fullName || '',
              email: parsed.personalInfo?.email || storeData.personalInfo.email || '',
              phone: parsed.personalInfo?.phone || storeData.personalInfo.phone || '',
              location: parsed.personalInfo?.location || storeData.personalInfo.location || '',
              website: parsed.personalInfo?.website || storeData.personalInfo.website || '',
              summary: parsed.personalInfo?.summary || storeData.personalInfo.summary || '',
            },
            experience: parsed.experience || [],
            education: parsed.education || [],
            skills: parsed.skills || [],
          }

          setResumeData(updatedResume)
          setParseStep('success')
          
          if (result.warning) {
            toast.warning(result.warning, { duration: 8000 })
          } else {
            toast.success('Resume parsed successfully! Auto-filled all details.')
          }
          
          setTimeout(() => {
            onClose()
            // Reset modal states
            setFile(null)
            setRawText('')
            setParseStep('idle')
          }, 1500)
        } else {
          setParseStep('error')
          setErrorMessage(result.error || 'Failed to parse your resume details.')
        }
      } catch (err) {
        console.error(err)
        setParseStep('error')
        setErrorMessage('An unexpected error occurred during processing.')
      }
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="max-w-xl w-full glass p-8 rounded-3xl border border-primary/20 shadow-2xl relative overflow-hidden"
      >
        <button 
          onClick={onClose} 
          disabled={isPending}
          className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">AI Resume Importer</h2>
            <p className="text-xs text-muted-foreground">Upload your current resume to instantly autofill the builder fields</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {parseStep === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Drag and Drop Zone */}
              {!showTextPaste ? (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`w-full py-12 px-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                    dragActive
                      ? 'border-primary bg-primary/5 scale-[0.99]'
                      : 'border-border bg-background/50 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    {file ? (
                      <p className="font-bold text-sm text-primary flex items-center gap-1.5 justify-center">
                        <FileText className="w-4 h-4" /> {file.name}
                      </p>
                    ) : (
                      <>
                        <p className="font-bold text-sm">Drag and drop your resume file</p>
                        <p className="text-xs text-muted-foreground mt-1">Supports PDF or TXT formats</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Raw Resume Text</label>
                  <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Paste the full plain text of your resume here..."
                    className="w-full h-48 bg-background border border-border rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none text-sm leading-relaxed"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setShowTextPaste(!showTextPaste)
                    setFile(null)
                    setRawText('')
                  }}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {showTextPaste ? '← Upload PDF instead' : 'Or paste raw text directly'}
                </button>
              </div>

              <button
                onClick={handleParse}
                disabled={!file && (!rawText || !rawText.trim())}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:bg-primary/95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                AUTOFILL WITH AI <Sparkles className="w-4 h-4 animate-pulse" />
              </button>
            </motion.div>
          )}

          {(parseStep === 'extracting' || parseStep === 'parsing') && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center gap-4 text-center"
            >
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <div className="space-y-1">
                <h3 className="font-bold text-lg">
                  {parseStep === 'extracting' ? 'Extracting Resume Text...' : 'AI Analyzing & Parsing...'}
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  {parseStep === 'extracting' 
                    ? 'Loading document structures and converting layout text.' 
                    : 'Applying OpenAI LLM parser to extract work history, skills, and details.'}
                </p>
              </div>
            </motion.div>
          )}

          {parseStep === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center gap-4 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 text-green-500">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-green-500">Forge Successful!</h3>
                <p className="text-xs text-muted-foreground">All details have been compiled and loaded into your layout template.</p>
              </div>
            </motion.div>
          )}

          {parseStep === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-6 flex flex-col items-center justify-center gap-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-red-500">Parsing Failed</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">{errorMessage}</p>
              </div>
              <button
                onClick={() => setParseStep('idle')}
                className="mt-4 px-6 py-2 border border-border hover:bg-muted text-xs font-bold rounded-xl transition-all"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
