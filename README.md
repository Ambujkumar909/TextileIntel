🧵 TextileIntel — AI-Powered Textile Market Intelligence Platform

TextileIntel is a modern, AI-driven web application that generates daily executive briefings for the global textile and fabric industry.
It aggregates recent market intelligence, financial movements, sustainability updates, and corporate developments using Google Gemini, and delivers insights via a premium web UI and automated email reports.

🚀 Key Features

🧠 AI-Generated Daily Briefings
Uses Google Gemini to analyze the latest textile & apparel news (last 24–48 hours).

📊 Executive-Ready Insights
Structured, concise bullet-point summaries grouped by:

Financials

Market Trends

Corporate Updates

Sustainability & Innovation

📧 Automated Email Delivery
Seamless report delivery using EmailJS (cloud-based, no backend required).

🖥️ Premium UI/UX
Clean, editorial-style interface built with Tailwind CSS and modern animations.

☁️ Firebase Hosting
Deployed as a high-performance Single Page Application (SPA).

🔐 Environment-Safe Configuration
API keys managed securely via Vite environment variables.

🛠️ Tech Stack
Layer	Technology
Frontend	React 19 + TypeScript
Build Tool	Vite
Styling	Tailwind CSS
AI Engine	Google Gemini (genai SDK)
Email	EmailJS
Hosting	Firebase Hosting (SPA mode)
📁 Project Structure
textile-intel/
├── src/
│   ├── components/        # UI components
│   ├── services/          # Gemini & EmailJS services
│   ├── types.ts           # Shared types & constants
│   ├── App.tsx
│   └── main.tsx
├── dist/                  # Production build output
├── index.html
├── firebase.json
├── vite.config.ts
├── tsconfig.app.json
├── tsconfig.node.json
└── README.md

⚙️ Environment Variables

Create a .env file in the project root:

VITE_API_KEY=YOUR_GEMINI_API_KEY
VITE_EMAILJS_SERVICE_ID=YOUR_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID=YOUR_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY


⚠️ All environment variables must start with VITE_ to be exposed in Vite.

🧪 Local Development
# Install dependencies
npm install

# Start development server
npm run dev


The app will be available at:
👉 http://localhost:5173

📦 Production Build
npm run build


Output will be generated in the dist/ directory.

☁️ Firebase Hosting Deployment
1️⃣ Initialize Firebase Hosting
firebase init hosting


Choose:

Public directory: dist

Configure as SPA: ✅ Yes

2️⃣ Deploy
firebase deploy --only hosting


Your app will be live at:

https://<project-id>.web.app

🖼️ Favicon & Branding

The application supports SVG favicon branding.

Add this to index.html:

<link rel="icon" type="image/svg+xml" href="/logo.svg" />


Ensure logo.svg exists in the dist/ directory before deployment.

🔒 Security Notes

API keys are exposed only as required for frontend usage.

For enterprise or high-security deployments, it is recommended to:

Move AI & email logic to a backend (Cloud Functions / Node.js)

Add rate-limiting and authentication

🧠 AI Prompt Strategy

TextileIntel uses a domain-specific prompt optimized for:

Financial relevance

Actionable intelligence

Executive readability

Source grounding & credibility

The model prioritizes:

Fibre2Fashion

Just Style

Textile Exchange

The Textile Magazine

Bloomberg / FT (textile sector)

📌 Roadmap

⏱️ Scheduled daily auto-emails

📄 PDF briefing exports

🔐 Auth-based user dashboards

🌍 SEO & social preview optimization

📊 Historical trend tracking

👤 Author

Ambuj Kumar
B.Tech | Full-Stack & AI Enthusiast
Focused on building production-grade AI applications 🚀
