# Prism ATS Builder

> **ATS-Optimized Resumes. Where your career spectrum shines.**

Prism ATS Builder is an open-source, AI-powered resume builder designed to help job seekers crack the Applicant Tracking System (ATS). With real-time scoring, "Solo Leveling" gamification, and deep AI bullet optimization, Prism ensures your resume lands on the recruiter's desk.

![Prism Banner](./public/logo.png)

## ✨ Core Features
- **ATS Scoring Engine**: Get real-time feedback on how recruiter algorithms read your resume. 
- **AI Bullet Optimization**: Rewrite your impact statements using the "Platform AI" (GPT-4o Mini) or your own API key (GPT-4o).
- **AI Resume Importer**: Upload your existing PDF or paste raw text. The AI will instantly parse and extract your work history, education, and skills. (Includes a robust heuristic Regex fallback when AI is unavailable).
- **Gamified Leveling**: Gain XP and level up your profile from Bronze to S-Rank.
- **Dynamic PDF Export**: Export pixel-perfect resumes instantly using `@react-pdf/renderer`.
- **Bring Your Own AI (BYOAI)**: Free users get quota-limited access to the platform AI, but you can unlock unlimited S-Rank optimizations by bringing your own OpenAI API key.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL Database (e.g., Railway or Supabase)
- OpenAI API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YourUsername/prism-resume-builder.git
   cd prism-resume-builder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy the example environment file and fill in your details:
   ```bash
   cp .env.example .env
   ```
   *Note: You must provide a valid `DATABASE_URL`, `NEXTAUTH_SECRET`, and `OPENAI_API_KEY` for the application to run.*

4. **Initialize Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev --turbo
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js
- **AI**: OpenAI API
- **Export**: React-PDF

## 📝 License
MIT License
