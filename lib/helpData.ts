// Help & FAQ Data Structure
export const FAQ_ITEMS = [
  {
    q: "Is Cleo free to use?",
    a: "Yes! Cleo is 100% free. No sign-up, no hidden fees, no premium plans.",
    tags: ["pricing", "general"],
  },
  {
    q: "Is my data safe?",
    a: "All your data is stored locally on your device. We don't collect or store any personal information on servers. Your privacy is our priority.",
    tags: ["privacy", "security", "data"],
  },
  {
    q: "Which services does Cleo cover?",
    a: "Cleo covers 24+ French administrative services including CAF, CPAM, OFII, Prefecture, bank accounts, transport, housing, and more.",
    tags: ["services", "features"],
  },
  {
    q: "Can I use Cleo offline?",
    a: "Most features work offline except the AI chat which needs an internet connection. Your checklist, documents, and appointments are stored locally.",
    tags: ["offline", "features"],
  },
  {
    q: "How do I reset my progress?",
    a: "Go to your browser settings and clear the site data for this page. This will reset all your progress and data.",
    tags: ["troubleshooting", "reset"],
  },
  {
    q: "How does the 7-day checklist work?",
    a: "The checklist guides you through essential Paris setup tasks across 7 days. Each day covers specific services like housing, health, transport. Mark items complete as you go.",
    tags: ["checklist", "features", "onboarding"],
  },
  {
    q: "What is CAF and why is it urgent?",
    a: "CAF (Caisse d'Allocations Familiales) provides housing aid. It's urgent because payments are retroactive to your application date—every day you wait costs money!",
    tags: ["caf", "housing", "urgent"],
  },
  {
    q: "How do I schedule appointments?",
    a: "Go to the Appointments section, select a service, and fill in your details. You can track 24+ services from health insurance to housing.",
    tags: ["appointments", "services"],
  },
  {
    q: "Can I ask Cleo questions in French?",
    a: "Yes! The AI assistant understands both English and French. Ask anything about Paris bureaucracy, student life, or administrative processes.",
    tags: ["ai", "languages"],
  },
  {
    q: "How do I install Cleo on my phone?",
    a: "Tap the banner at the bottom or look for 'Add to Home Screen' in your phone's menu. It works like a native app on both iOS and Android.",
    tags: ["pwa", "installation", "mobile"],
  },
];

export const QUICK_FIXES = [
  {
    issue: "App not saving my progress",
    solution: "Clear browser cache (Settings → Site data). Try a different browser. Restart your device.",
    tags: ["troubleshooting", "data"],
  },
  {
    issue: "AI chat not responding",
    solution: "Check internet connection. Refresh the page. Try again in 30 seconds. Clear cache if persists.",
    tags: ["ai", "troubleshooting"],
  },
  {
    issue: "Appointment details missing",
    solution: "Make sure all required fields are filled. Try adding the appointment again. Check date format (YYYY-MM-DD).",
    tags: ["appointments", "troubleshooting"],
  },
  {
    issue: "Can't complete checklist steps",
    solution: "Some steps depend on external links. Open the booking links in new tabs. Mark complete when done.",
    tags: ["checklist", "troubleshooting"],
  },
];

export const CONTEXTUAL_HELP = {
  "/dashboard": {
    title: "Welcome to Your Dashboard",
    tips: [
      "Use the Overview tab to see your progress at a glance",
      "Switch to Checklist tab to work on daily tasks",
      "Days turn ✅ green when completed",
      "Each day takes ~1-2 hours on average",
    ],
    video: "https://example.com/dashboard-tutorial",
  },
  "/checklist": {
    title: "7-Day Checklist Guide",
    tips: [
      "Click steps to expand details and tips",
      "Checkmark tasks as you complete them",
      "Days are sequential—complete Day 1 before starting Day 4",
      "Pro tips and French phrases included for each day",
    ],
    video: "https://example.com/checklist-tutorial",
  },
  "/appointments": {
    title: "Managing Your Appointments",
    tips: [
      "Add appointments for any of 24+ services",
      "Set reminders for important dates",
      "Track CAF, health, housing, transport & more",
      "Sort by timeline: Before Arrival, Week 1, Month 1, Ongoing",
    ],
    video: "https://example.com/appointments-tutorial",
  },
  "/chat": {
    title: "Chatting with Cleo AI",
    tips: [
      "Ask anything about Paris, administration, or student life",
      "Mention your specific situation for better answers",
      "Cleo understands both English and French",
      "Use for quick questions, documentation help, or moral support",
    ],
    video: "https://example.com/chat-tutorial",
  },
  "/explore": {
    title: "Exploring Paris",
    tips: [
      "Discover free and student-friendly attractions",
      "Find food, culture, and entertainment spots",
      "Save favorite locations for later",
      "Filter by neighborhood and category",
    ],
    video: "https://example.com/explore-tutorial",
  },
};

export const EMERGENCY_RESOURCES = [
  {
    title: "🚨 SOS Paris",
    description: "Emergency services hotline",
    number: "15 (Medical) / 17 (Police) / 18 (Fire)",
  },
  {
    title: "🏥 24/7 Medical Help",
    description: "Pharmacie de Garde or Hospital ER",
    number: "3114 (Medical emergencies)",
  },
  {
    title: "📞 International Student Help",
    description: "Campus France emergency support",
    link: "https://www.campusfrance.org/",
  },
  {
    title: "🏠 Housing Crisis",
    description: "Emergency accommodation hotline",
    number: "0800 014 092 (CROUS)",
  },
  {
    title: "💰 Financial Hardship",
    description: "Student financial assistance",
    number: "+33 1 55 86 86 86 (CROUS)",
  },
];
