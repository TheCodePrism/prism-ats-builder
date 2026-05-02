# ⚒️ ResumeForge AI

![ResumeForge AI Logo](public/logo.png)

**ResumeForge AI** is a production-grade SaaS platform designed to help job hunters "level up" their career search by creating ATS-optimized resumes. Using advanced AI-driven analysis, it quantifies impact and ensures your resume passes through automated filters and reaches human recruiters.

---

## ✨ Key Features

- **🎯 ATS Scoring Engine**: Real-time feedback on how recruiter systems perceive your resume. Aim for a 90+ score to maximize your chances.
- **⚡ AI Content Optimizer**: Intelligent refinement of your professional achievements. We help you quantify your impact with precision.
- **🛡️ Solo Leveling System**: Gamify your job search. Earn XP as you improve your resume and reach higher "Hunter Levels".
- **🎨 Premium Templates**: Modern, sleek designs that stand out while remaining highly readable by machines.
- **🔒 Secure Authentication**: Robust security powered by NextAuth.js.
- **📊 Semantic Analysis**: AI-powered parsing to ensure your keywords match the industry standards.

---

## 🚀 Tech Stack

- **Frontend**: [Next.js 14+](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers), [Prisma ORM](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Environment variables configured

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/resumeforge-ai.git
   cd resumeforge-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/resumeforge"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📖 Usage

1. **Sign Up**: Create your Hunter account.
2. **Forge**: Start building your resume in the interactive builder.
3. **Analyze**: Use the AI engine to get an ATS score and optimization tips.
4. **Export**: Download your high-impact, machine-readable resume.
5. **Level Up**: Watch your score improve as you refine your content.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for Hunters by **ResumeForge AI Team**.
