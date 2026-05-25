<div align="center">

# Cleo - Your Paris Student Assistant

### AI-powered onboarding assistant for international students in Paris

[![Live Demo](https://img.shields.io/badge/Live_Demo-cleo--app--theta.vercel.app-blue?style=for-the-badge&logo=vercel)](https://cleo-app-theta.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

*Every year, 400,000+ international students arrive in France. They spend their first month fighting bureaucracy instead of studying. Cleo turns 30 days of chaos into 7 days of clarity.*

[Live Demo](https://cleo-app-theta.vercel.app) | [Features](#features) | [Tech Stack](#tech-stack) | [Getting Started](#getting-started)

</div>

---

## The Problem

International students arriving in Paris face an overwhelming maze of bureaucracy:
- Opening a bank account without a French address
- Applying for housing aid (CAF) in a language they don't speak
- Navigating health insurance (CPAM), immigration (OFII), transport passes, and more
- All while adjusting to a new country, culture, and university

**There's no single guide that walks them through everything, step by step, in real time.**

## The Solution

**Cleo** is an AI-powered assistant that guides international students through every step of settling in Paris. From visa validation to finding affordable housing, Cleo provides personalized, real-time guidance in plain English.

---

## Features

### AI Chat Assistant
- Dual-AI architecture using **Google Gemini** and **Groq** with automatic failover
- Context-aware responses tailored to international student needs in Paris
- Understands French bureaucracy, student services, and local knowledge
- Document analysis - upload French letters and get instant English explanations

### Appointment Portal (24 Services)
- **Prefecture** - Visa & Titre de Sejour
- **CAF** - Housing aid application
- **CPAM** - Health insurance registration
- **OFII** - Immigration office validation
- **Bank Account** - French bank setup
- **Navigo** - Transport pass
- **Campus France**, **Erasmus+**, **CROUS**, and 15+ more services
- Direct booking links, tips, and location info for each service

### Smart Dashboard
- Personalized progress tracking
- Upcoming appointment reminders
- Quick-access to all services
- Visual completion status

### Document Scanner
- Upload French documents (CAF letters, bank statements, lease contracts)
- AI-powered translation and explanation
- Action items extracted automatically

### Interactive Onboarding
- 5-step personalized setup (nationality, university, visa type, budget, housing)
- Generates a customized settlement plan
- Adapts recommendations based on student profile

### 7-Day Checklist
- Day-by-day actionable tasks
- Priority-ordered based on deadlines
- Progress tracking with completion status

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **AI (Primary)** | Google Gemini API |
| **AI (Fallback)** | Groq API (Llama) |
| **Deployment** | Vercel |
| **Storage** | localStorage (privacy-first, no backend needed) |

### Architecture Decisions
- **Dual AI Provider**: Gemini as primary, Groq as fallback ensures 99.9% availability
- **No Backend Required**: All user data stored locally for maximum privacy
- **Static Generation**: Pages pre-rendered for fast load times
- **Responsive Design**: Works on mobile, tablet, and desktop

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/gokul26222-debug/cleo.git
cd cleo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Add your API keys to `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
cleo-app/
├── app/
│   ├── page.tsx              # Landing page
│   ├── onboarding/           # Onboarding flow
│   ├── dashboard/            # User dashboard
│   ├── chat/                 # AI chat interface
│   ├── appointments/         # Service portal (24 services)
│   ├── documents/            # Document scanner
│   ├── checklist/            # 7-day checklist
│   └── api/chat/             # AI chat API route
├── components/               # Reusable UI components
├── lib/
│   ├── appointments.ts       # Service definitions & data
│   └── storage.ts            # localStorage utilities
└── public/                   # Static assets
```

---

## Roadmap

- [ ] Multi-language support (Hindi, Chinese, Spanish, Arabic)
- [ ] WhatsApp/Telegram bot integration
- [ ] Emergency SOS mode with nearby services
- [ ] Housing scam detector
- [ ] Personalized 7-day AI-generated plan
- [ ] City expansion (Lyon, Marseille, Bordeaux)
- [ ] Community Q&A with verified senior students
- [ ] CAF/APL aid calculator

---

## Impact

| Metric | Value |
|--------|-------|
| Services Covered | 24 French bureaucratic services |
| Target Users | 400,000+ international students/year in France |
| Time Saved | ~23 days of bureaucratic navigation |
| Languages | English (more coming soon) |
| Cost | Free |

---

## Author

**Gokul Krishnan**
- GitHub: [@gokul26222-debug](https://github.com/gokul26222-debug)

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with purpose for international students worldwide**

*Navigate Paris like a local.*

</div>
