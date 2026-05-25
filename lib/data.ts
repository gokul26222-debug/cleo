export interface ChecklistStep {
  id: string;
  text: string;
  detail?: string;
}

export interface FrenchPhrase {
  french: string;
  pronunciation: string;
  english: string;
}

export interface ChecklistDay {
  day: number;
  title: string;
  emoji: string;
  estimatedTime: string;
  description: string;
  steps: ChecklistStep[];
  frenchPhrases: FrenchPhrase[];
  tips: string[];
}

export const checklistData: ChecklistDay[] = [
  {
    day: 1,
    title: "Open a Bank Account",
    emoji: "🏦",
    estimatedTime: "2–3 hours",
    description:
      "Having a French bank account is essential — you'll need it for CAF, rent, and daily life. Start with one of these three options.",
    steps: [
      {
        id: "d1s1",
        text: "Choose your bank",
        detail:
          "BNP Paribas (in-person, most international-friendly), Société Générale (good student offers), or Boursorama (100% online, no fees).",
      },
      {
        id: "d1s2",
        text: "Gather your documents",
        detail:
          "Passport + valid visa/residence permit, proof of address (attestation de logement from your university or landlord), and your university enrollment certificate (certificat de scolarité).",
      },
      {
        id: "d1s3",
        text: "Book an appointment or apply online",
        detail:
          "BNP and SG require in-person appointments. Boursorama is entirely online — you can open an account in 20 minutes from your phone.",
      },
      {
        id: "d1s4",
        text: "Request a Livret A savings account",
        detail:
          "Ask the banker to also open a Livret A — it's free, tax-exempt, and required for some CAF payments.",
      },
      {
        id: "d1s5",
        text: "Wait for your RIB (bank details slip)",
        detail:
          "You'll receive a RIB (Relevé d'Identité Bancaire) — keep multiple copies. You'll need it for CAF, your landlord, and university.",
      },
      {
        id: "d1s6",
        text: "Set up mobile banking app",
        detail:
          "Download the bank's app and enable notifications. This will help you track CAF deposits and expenses.",
      },
    ],
    frenchPhrases: [
      {
        french: "Je voudrais ouvrir un compte bancaire.",
        pronunciation: "Zhuh voo-DREH ooh-VREER uhn KOHNT bahn-KAIR",
        english: "I would like to open a bank account.",
      },
      {
        french: "Avez-vous un forfait étudiant?",
        pronunciation: "Ah-VEH-voo uhn for-FEH ay-too-DYAHN?",
        english: "Do you have a student package?",
      },
      {
        french: "Pouvez-vous me donner un RIB?",
        pronunciation: "Poo-VEH-voo muh doh-NEH uhn reeb?",
        english: "Can you give me a bank details slip?",
      },
    ],
    tips: [
      "Boursorama has zero monthly fees and is ideal if you're comfortable doing everything online.",
      "Bring physical copies of all documents — banks often don't accept digital-only.",
      "Ask for a debit card (carte bancaire) with contactless payment.",
    ],
  },
  {
    day: 2,
    title: "Get a Phone Plan",
    emoji: "📱",
    estimatedTime: "1–2 hours",
    description:
      "A French SIM card is essential for verification codes, CAF, and staying connected. Great cheap options exist.",
    steps: [
      {
        id: "d2s1",
        text: "Choose a carrier",
        detail:
          "Free Mobile (€2/month basic, €20/month unlimited data — best value), Orange (premium coverage), or SFR (good student plans).",
      },
      {
        id: "d2s2",
        text: "Go to a store or order online",
        detail:
          "Free Mobile can be ordered online and delivered. Orange and SFR have stores throughout Paris. Bring your passport.",
      },
      {
        id: "d2s3",
        text: "Choose SIM-only or a phone plan",
        detail:
          "Most students choose SIM-only (forfait SIM) for a French number. You can keep using your own unlocked phone.",
      },
      {
        id: "d2s4",
        text: "Activate your SIM",
        detail:
          "Follow the SMS instructions. Activation usually takes 2–4 hours. Your number will be French (+33).",
      },
      {
        id: "d2s5",
        text: "Set up data roaming if needed",
        detail:
          "All major carriers include EU roaming at no extra cost under EU regulations.",
      },
    ],
    frenchPhrases: [
      {
        french: "Je voudrais un forfait mensuel.",
        pronunciation: "Zhuh voo-DREH uhn for-FEH mahn-soo-ELL",
        english: "I would like a monthly plan.",
      },
      {
        french: "Est-ce que vous avez un forfait pas cher?",
        pronunciation: "Ess-kuh voo-zah-VEH uhn for-FEH pah SHAIR?",
        english: "Do you have a cheap plan?",
      },
    ],
    tips: [
      "Free Mobile's €20/month plan includes 100GB+ data and is unbeatable value.",
      "Some carriers require a French bank account — open your bank account first.",
      "Keep your SIM packaging — it has your PUK code in case your SIM locks.",
    ],
  },
  {
    day: 3,
    title: "University Registration",
    emoji: "🎓",
    estimatedTime: "3–4 hours",
    description:
      "Official enrollment gives you your student card, library access, email, and is required for CAF and other services.",
    steps: [
      {
        id: "d3s1",
        text: "Log into your university portal",
        detail:
          "Each university has an online portal (ENT). Find your login credentials in your acceptance email.",
      },
      {
        id: "d3s2",
        text: "Complete administrative registration (inscription administrative)",
        detail:
          "Upload your passport, visa, previous degree transcripts, and passport photo. Pay the CVEC fee (€103) on the messervices.etudiant.gouv.fr portal first.",
      },
      {
        id: "d3s3",
        text: "Pay the CVEC (Contribution Vie Étudiante)",
        detail:
          "Visit cvec.etudiant.gouv.fr — pay €103 online. You'll receive a certificate immediately. This is mandatory for registration.",
      },
      {
        id: "d3s4",
        text: "Register for courses (inscription pédagogique)",
        detail:
          "Select your courses/modules for the semester. Deadlines are strict — do this before your academic year begins.",
      },
      {
        id: "d3s5",
        text: "Get your student card and university email",
        detail:
          "Your student card may be posted or picked up from the registrar. Activate your university email address immediately.",
      },
      {
        id: "d3s6",
        text: "Get your certificat de scolarité",
        detail:
          "Download this enrollment certificate from your ENT portal. You'll need multiple copies for banks, CAF, and your landlord.",
      },
    ],
    frenchPhrases: [
      {
        french: "Où est le bureau des inscriptions?",
        pronunciation: "Oo eh luh boo-ROH day zan-SKRIP-syohn?",
        english: "Where is the registrar's office?",
      },
      {
        french: "J'ai besoin d'un certificat de scolarité.",
        pronunciation: "Zheh buh-ZWEHN duhn sair-tee-fee-KAH duh sko-lah-ree-TEH",
        english: "I need an enrollment certificate.",
      },
    ],
    tips: [
      "Print 5+ copies of your certificat de scolarité — you'll use them constantly.",
      "The CVEC must be paid before registration, not after.",
      "Check if your university has a specific office for international students (Bureau des Relations Internationales).",
    ],
  },
  {
    day: 4,
    title: "Apply for CAF Housing Aid",
    emoji: "🏠",
    estimatedTime: "1–2 hours (online)",
    description:
      "CAF (Caisse d'Allocations Familiales) can pay you €100–€250/month in housing aid. Apply as soon as you arrive — payments are retroactive from your application date.",
    steps: [
      {
        id: "d4s1",
        text: "Create your CAF account",
        detail:
          "Go to caf.fr and create an account. You'll need your French address, phone number, and email.",
      },
      {
        id: "d4s2",
        text: "Fill in the APL application (Aide Personnalisée au Logement)",
        detail:
          "Select 'Faire une demande d'aides au logement'. You'll need your landlord's details, your lease/rental agreement, and your RIB.",
      },
      {
        id: "d4s3",
        text: "Upload required documents",
        detail:
          "Passport/residence permit, lease agreement (bail), last 3 months of bank statements or RIB, landlord's tax ID, and your certificat de scolarité.",
      },
      {
        id: "d4s4",
        text: "Submit and wait for a decision",
        detail:
          "Processing takes 4–8 weeks. Payments are retroactive to your application date, so apply immediately even if you don't have all documents yet.",
      },
      {
        id: "d4s5",
        text: "Check your CAF online account regularly",
        detail:
          "CAF will ask for additional documents via your online account. Missing these requests can delay or cancel your application.",
      },
    ],
    frenchPhrases: [
      {
        french: "Je fais une demande d'APL.",
        pronunciation: "Zhuh feh oon duh-MAHND dah-pell-ell",
        english: "I'm applying for housing aid.",
      },
      {
        french: "Quand est-ce que je vais recevoir mon aide?",
        pronunciation: "Kahn-tess-kuh zhuh veh ruh-suh-VWAR mohn ned?",
        english: "When will I receive my aid?",
      },
    ],
    tips: [
      "Apply on Day 1 if possible — you lose money for every day you delay.",
      "If you live in a university residence (CROUS), CAF payments go directly to CROUS and reduce your rent.",
      "Keep your lease and landlord's details handy — CAF will verify your address.",
    ],
  },
  {
    day: 5,
    title: "Get Your Navigo Transport Pass",
    emoji: "🚇",
    estimatedTime: "1 hour",
    description:
      "The Navigo pass gives you unlimited travel on all Paris public transport (metro, RER, bus, tram). Students can get a discounted Imagine R card.",
    steps: [
      {
        id: "d5s1",
        text: "Get a Navigo Easy or Navigo Liberté+ card",
        detail:
          "Pick one up at any major metro station ticket office (e.g., Châtelet, Gare du Nord). Cost is €2 for the card itself.",
      },
      {
        id: "d5s2",
        text: "Apply for Imagine R (student discount card)",
        detail:
          "If you're a student under 26, apply for Imagine R at imaginer.iledefrance-mobilites.fr — costs ~€350/year for unlimited zones 1–5, saving you money vs monthly passes.",
      },
      {
        id: "d5s3",
        text: "Load a monthly pass (forfait mensuel)",
        detail:
          "For a standard Navigo, you can buy a monthly unlimited zones 1–5 pass for ~€86.40/month. Load it at any metro station terminal or the app.",
      },
      {
        id: "d5s4",
        text: "Download the Île-de-France Mobilités app",
        detail:
          "The official app lets you top up your card, check journey times, and manage your subscription.",
      },
      {
        id: "d5s5",
        text: "Set up automatic renewal",
        detail:
          "Link your French bank card for auto-renewal so you're never caught without a valid pass at month end.",
      },
    ],
    frenchPhrases: [
      {
        french: "Je voudrais un passe Navigo, s'il vous plaît.",
        pronunciation: "Zhuh voo-DREH uhn passe nah-VEE-go, seel voo pleh",
        english: "I would like a Navigo pass, please.",
      },
      {
        french: "Quel est le tarif mensuel?",
        pronunciation: "Kel eh luh tah-REEF mahn-soo-ELL?",
        english: "What is the monthly rate?",
      },
    ],
    tips: [
      "Imagine R is the best deal if you're staying for the full academic year.",
      "The Navigo is contactless — tap on all yellow readers when entering and exiting RER trains.",
      "Keep your pass away from credit cards to avoid demagnetization.",
    ],
  },
  {
    day: 6,
    title: "Register for CPAM & Find a Doctor",
    emoji: "🏥",
    estimatedTime: "2–3 hours",
    description:
      "Register with CPAM (French national health insurance) to get reimbursed for medical costs. Then find a médecin traitant (regular doctor) who is mandatory for full reimbursements.",
    steps: [
      {
        id: "d6s1",
        text: "Create your Ameli account",
        detail:
          "Go to ameli.fr and register. As a student, you are automatically covered by Sécurité Sociale Étudiante. You'll need your passport, French address, and RIB.",
      },
      {
        id: "d6s2",
        text: "Upload documents to CPAM",
        detail:
          "Passport, visa/residence permit, certificat de scolarité, RIB, and proof of address. Upload via your Ameli account or bring to your local CPAM office.",
      },
      {
        id: "d6s3",
        text: "Wait for your Carte Vitale",
        detail:
          "Your Carte Vitale (green health card) arrives by post in 3–6 weeks. In the meantime, print your Attestation de droits from Ameli.fr — this is accepted everywhere.",
      },
      {
        id: "d6s4",
        text: "Find and register a médecin traitant",
        detail:
          "Use doctolib.fr or ameli.fr to find a GP accepting new patients near you. During your first appointment, ask them to become your 'médecin traitant' — this is mandatory for full reimbursements.",
      },
      {
        id: "d6s5",
        text: "Consider complementary health insurance (mutuelle)",
        detail:
          "CPAM covers ~70% of costs. A mutuelle covers the rest. Ask your university — many have negotiated group rates for students, or look into la mutuelle des étudiants (LMDE).",
      },
      {
        id: "d6s6",
        text: "Save emergency numbers",
        detail:
          "SAMU (medical emergency): 15. Pompiers: 18. European emergency: 112. SOS Médecins (home visits): 3600.",
      },
    ],
    frenchPhrases: [
      {
        french: "Je voudrais m'affilier à la Sécurité Sociale.",
        pronunciation: "Zhuh voo-DREH mah-fee-lee-EH ah lah say-koo-ree-TEH so-SYAL",
        english: "I would like to register for Social Security.",
      },
      {
        french: "Acceptez-vous de nouveaux patients?",
        pronunciation: "Ahk-sep-TEH-voo duh noo-VOH pah-SYAHN?",
        english: "Do you accept new patients?",
      },
    ],
    tips: [
      "Use Doctolib to find English-speaking doctors in Paris if needed.",
      "Keep your Attestation de droits printed — pharmacies and doctors accept it until your Carte Vitale arrives.",
      "LMDE is the student health insurance union and offers affordable mutuelle plans.",
    ],
  },
  {
    day: 7,
    title: "Review & Setup Ongoing",
    emoji: "✅",
    estimatedTime: "1–2 hours",
    description:
      "Congratulations on completing your first week! Today is about reviewing what's done, handling anything outstanding, and setting up for the weeks ahead.",
    steps: [
      {
        id: "d7s1",
        text: "Review your checklist progress",
        detail:
          "Check which tasks from days 1–6 are complete. Note any pending items like Carte Vitale, CAF decision, or student card delivery.",
      },
      {
        id: "d7s2",
        text: "Set calendar reminders for follow-ups",
        detail:
          "CAF decision: 4–8 weeks. Carte Vitale: 3–6 weeks. First CPAM reimbursement: 2–4 weeks after a doctor visit. Navigo renewal: monthly.",
      },
      {
        id: "d7s3",
        text: "Organize your documents digitally",
        detail:
          "Scan and save your passport, visa, lease, RIB, CVEC certificate, and certificat de scolarité to cloud storage. Use this app's Documents section.",
      },
      {
        id: "d7s4",
        text: "Join your university's international student network",
        detail:
          "Find the WhatsApp or Facebook group for international students at your university — invaluable for tips, events, and making friends.",
      },
      {
        id: "d7s5",
        text: "Explore your neighborhood",
        detail:
          "Find your nearest supermarket (Monoprix, Carrefour, Lidl), pharmacy (pharmacie — green cross), and post office (La Poste).",
      },
      {
        id: "d7s6",
        text: "Set a monthly budget",
        detail:
          "Typical Paris student budget: Rent €600–1200, Food €200–300, Transport €87, Misc €100. With CAF, subtract €100–250 from rent.",
      },
    ],
    frenchPhrases: [
      {
        french: "Où est la pharmacie la plus proche?",
        pronunciation: "Oo eh lah far-mah-SEE lah ploo PROSH?",
        english: "Where is the nearest pharmacy?",
      },
      {
        french: "Je suis étudiant(e) à Paris.",
        pronunciation: "Zhuh swee ay-too-DYAHN(T) ah pah-REE",
        english: "I am a student in Paris.",
      },
    ],
    tips: [
      "Download the app 'Too Good To Go' for cheap end-of-day meals from restaurants.",
      "The Paris Musées app gives free access to city-owned museums — great for weekends.",
      "Your student card often gets you discounts at cinemas, museums, and shops.",
    ],
  },
];

export const universities = [
  "Sorbonne Université",
  "Sciences Po Paris",
  "Université Paris Cité",
  "Université Paris-Saclay",
  "HEC Paris",
  "ESSEC Business School",
  "École Polytechnique",
  "INSEAD",
];

export const countries = [
  "🇺🇸 United States",
  "🇬🇧 United Kingdom",
  "🇩🇪 Germany",
  "🇮🇳 India",
  "🇨🇳 China",
  "🇧🇷 Brazil",
  "🇲🇦 Morocco",
  "🇨🇦 Canada",
  "🇦🇺 Australia",
  "🇯🇵 Japan",
  "🇰🇷 South Korea",
  "🇲🇽 Mexico",
  "🇳🇬 Nigeria",
  "🇸🇦 Saudi Arabia",
  "🇹🇷 Turkey",
];
