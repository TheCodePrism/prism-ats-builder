import OpenAI from 'openai'

// Helper to get OpenAI instance
const getOpenAI = (userApiKey?: string) => {
  const key = userApiKey || process.env.OPENAI_API_KEY
  if (!key) {
    throw new Error('No OpenAI API key found. Please add one in settings or contact support.')
  }
  return new OpenAI({ apiKey: key })
}

export async function optimizeResumeContent(
  currentContent: string,
  targetJobDescription: string,
  missingKeywords: string,
  userApiKey?: string
) {
  const openai = getOpenAI(userApiKey)

  const prompt = `
    You are an expert resume optimizer and recruiter.
    
    Target Job Description:
    ${targetJobDescription}
    
    Missing Critical Keywords:
    ${missingKeywords}
    
    Current Content to Optimize:
    ${currentContent}
    
    Your Task:
    Rewrite the experience bullets above to:
    1. Naturally integrate as many missing keywords as possible.
    2. Quantify achievements using metrics (e.g., %, $, numbers).
    3. Use strong action verbs (e.g., Orchestrated, Spearheaded, Optimized).
    4. Maintain a professional, ATS-friendly tone.
    5. Return ONLY the optimized bullet points. No conversational filler.
  `

  const response = await openai.chat.completions.create({
    // Use gpt-4o for better results if user provides key, otherwise gpt-4o-mini
    model: userApiKey ? 'gpt-4o' : 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a professional resume writer specializing in ATS optimization.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
  })

  return response.choices[0].message.content
}

export async function analyzeResumeAI(resumeData: any, jobDescription: string, userApiKey?: string) {
  const openai = getOpenAI(userApiKey)

  const prompt = `
    Analyze this resume against the job description.
    
    Job Description:
    ${jobDescription}
    
    Resume Data:
    ${JSON.stringify(resumeData)}
    
    Return a JSON object with:
    1. "successCriteria": Top 5 things the recruiter is looking for based on context.
    2. "impactScore": A score from 0-100 on how well achievements are quantified.
    3. "suggestions": 3 actionable tips to improve the resume impact.
  `

  const response = await openai.chat.completions.create({
    model: userApiKey ? 'gpt-4o' : 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'You are an elite recruiter specializing in semantic resume analysis. Return JSON only.' },
      { role: 'user', content: prompt }
    ],
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}
