export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  typeId: string;
  title: string;
  date: string;       // ISO date "2026-05-20"
  time: string;       // "10:30"
  location: string;
  notes: string;
  status: AppointmentStatus;
  createdAt: number;
  reminderSet: boolean;
}

export interface AppointmentType {
  id: string;
  label: string;
  emoji: string;
  color: string;       // Tailwind bg class
  textColor: string;   // Tailwind text class
  borderColor: string; // Tailwind border class
  description: string;
  bookingUrl: string;
  bookingLabel: string;
  defaultLocation: string;
  tips: string[];
}

export const APPOINTMENT_TYPES: AppointmentType[] = [
  {
    id: "prefecture",
    label: "Prefecture (Visa / Titre de Séjour)",
    emoji: "🏛️",
    color: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    description: "Visa renewal, titre de séjour, residence permit",
    bookingUrl: "https://www.rdv-prefecture.interieur.gouv.fr/",
    bookingLabel: "Book on rdv-prefecture.gouv.fr",
    defaultLocation: "Préfecture de Police, 7-9 Blvd du Palais, Paris",
    tips: [
      "Book 4–6 weeks in advance — slots fill up extremely fast",
      "Bring original documents AND photocopies of everything",
      "Arrive 15 minutes early with all documents in order",
      "Check the exact list of required docs on the prefecture website before going",
    ],
  },
  {
    id: "caf",
    label: "CAF (Housing Aid)",
    emoji: "🏠",
    color: "bg-rose-50",
    textColor: "text-rose-700",
    borderColor: "border-rose-200",
    description: "APL application, document submission, follow-up",
    bookingUrl: "https://www.caf.fr/",
    bookingLabel: "Manage on caf.fr",
    defaultLocation: "CAF Paris, 103 Rue de Tolbiac, Paris 13",
    tips: [
      "Most CAF interactions can be done fully online at caf.fr",
      "Only visit in person if you have a specific urgent issue",
      "Bring RIB, lease, passport, and certificat de scolarité",
      "Apply online first — in-person appointments are rarely needed",
    ],
  },
  {
    id: "cpam",
    label: "CPAM (Health Insurance)",
    emoji: "🏥",
    color: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    description: "Carte Vitale, health registration, reimbursements",
    bookingUrl: "https://www.ameli.fr/",
    bookingLabel: "Manage on ameli.fr",
    defaultLocation: "CPAM Paris, 173-175 Rue de Bercy, Paris 12",
    tips: [
      "Register online at ameli.fr first — no appointment needed",
      "Carte Vitale takes 3–6 weeks to arrive by post",
      "Print your Attestation de droits as a temporary proof",
      "Only visit in person if documents are rejected online",
    ],
  },
  {
    id: "doctor",
    label: "Doctor (Médecin Traitant)",
    emoji: "👨‍⚕️",
    color: "bg-teal-50",
    textColor: "text-teal-700",
    borderColor: "border-teal-200",
    description: "Register a GP, medical consultation",
    bookingUrl: "https://www.doctolib.fr/",
    bookingLabel: "Book on Doctolib",
    defaultLocation: "Varies by doctor",
    tips: [
      "Use Doctolib to find English-speaking doctors in Paris",
      "Ask to be registered as their médecin traitant on first visit",
      "This is required for full CPAM reimbursements (70%)",
      "Search 'médecin généraliste' on Doctolib for GPs",
    ],
  },
  {
    id: "bank",
    label: "Bank Account",
    emoji: "🏦",
    color: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    description: "Open account, RIB, card, issues",
    bookingUrl: "https://mabanque.bnpparibas.fr/",
    bookingLabel: "Book via BNP / SG / Boursorama",
    defaultLocation: "Your chosen branch",
    tips: [
      "Book online via your bank's app or website",
      "Bring passport, visa, proof of address, certificat de scolarité",
      "Ask for a RIB and Livret A at the same appointment",
      "Boursorama is 100% online — no appointment needed",
    ],
  },
  {
    id: "university",
    label: "University Registration",
    emoji: "🎓",
    color: "bg-violet-50",
    textColor: "text-violet-700",
    borderColor: "border-violet-200",
    description: "Inscription, student card, CVEC",
    bookingUrl: "https://cvec.etudiant.gouv.fr/",
    bookingLabel: "Pay CVEC on etudiant.gouv.fr",
    defaultLocation: "Your university registrar office",
    tips: [
      "Pay CVEC (€103) at cvec.etudiant.gouv.fr before registration",
      "Check your university ENT portal for exact dates and requirements",
      "Download certificat de scolarité immediately after registering",
      "Print 5+ copies — you'll need them constantly",
    ],
  },
  {
    id: "ofii",
    label: "OFII (Immigration Office)",
    emoji: "📋",
    color: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    description: "VLS-TS validation, integration appointment",
    bookingUrl: "https://administration-etrangers-en-france.interieur.gouv.fr/",
    bookingLabel: "Validate VLS-TS online",
    defaultLocation: "OFII Paris, 48 Rue de la Roquette, Paris 11",
    tips: [
      "Validate your VLS-TS online within 3 months of arrival — mandatory",
      "Non-EU students must do this before their visa expires",
      "The validation is done at administration-etrangers-en-france.interieur.gouv.fr",
      "You may be invited to a medical appointment at OFII — attend it",
    ],
  },
  // Transportation Services
  {
    id: "navigo",
    label: "Navigo Découverte",
    emoji: "🚌",
    color: "bg-cyan-50",
    textColor: "text-cyan-700",
    borderColor: "border-cyan-200",
    description: "Monthly public transport pass for Metro, bus, and tram",
    bookingUrl: "https://www.navigo.fr/",
    bookingLabel: "Get Navigo pass",
    defaultLocation: "RATP Sales Point, Paris",
    tips: [
      "Discounted Navigo Découverte pass available for students",
      "Valid for 1 month from subscription start date",
      "Save money on daily tickets — unlimited travel",
      "Available at RATP stations and metro ticket windows",
    ],
  },
  {
    id: "velib",
    label: "Vélib' - Bike Sharing",
    emoji: "🚴",
    color: "bg-teal-50",
    textColor: "text-teal-700",
    borderColor: "border-teal-200",
    description: "Bike sharing system for short trips across Paris",
    bookingUrl: "https://www.velib-metropole.com/",
    bookingLabel: "Join Vélib'",
    defaultLocation: "Paris, France",
    tips: [
      "Affordable bike rentals with 1000+ stations across Paris",
      "Great for short trips — first 30 minutes free with subscription",
      "Monthly subscriptions available, competitive with daily tickets",
      "Electric bikes available at premium price",
    ],
  },

  // Housing Services
  {
    id: "hlm",
    label: "HLM / Social Housing",
    emoji: "🏠",
    color: "bg-lime-50",
    textColor: "text-lime-700",
    borderColor: "border-lime-200",
    description: "Government subsidized housing programs",
    bookingUrl: "https://www.logement-social.gouv.fr/",
    bookingLabel: "Apply for HLM",
    defaultLocation: "Regional housing authority, Paris",
    tips: [
      "Apply early — waiting lists can be several years long",
      "Income requirements vary by building and location",
      "Priority given to low-income families and students",
      "Check eligibility based on your salary and family size",
    ],
  },
  {
    id: "apl",
    label: "Housing Allowance (APL)",
    emoji: "💰",
    color: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    description: "Complementary housing aid from the state",
    bookingUrl: "https://www.caf.fr/allocataires/logement",
    bookingLabel: "Manage APL on CAF",
    defaultLocation: "CAF office, Paris",
    tips: [
      "Can stack with CAF housing aid for more support",
      "Recalculated quarterly based on your income",
      "Need proof of residence and current lease agreement",
      "Apply through CAF website for faster processing",
    ],
  },

  // Financial & Insurance Services
  {
    id: "mutuelle",
    label: "Complementary Health Insurance",
    emoji: "🛡️",
    color: "bg-pink-50",
    textColor: "text-pink-700",
    borderColor: "border-pink-200",
    description: "Top-up health coverage for what CPAM doesn't cover",
    bookingUrl: "https://www.securite-sociale.fr/",
    bookingLabel: "Compare health insurance",
    defaultLocation: "Online enrollment",
    tips: [
      "Covers dental, optometry, and other costs CPAM doesn't",
      "Many employers provide free mutuelle plans for employees",
      "Compare plans carefully — prices range €20-100/month",
      "Essential for comprehensive healthcare coverage in France",
    ],
  },
  {
    id: "student_discounts",
    label: "Student Financial Discounts",
    emoji: "💳",
    color: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    description: "Student-specific banking and insurance deals",
    bookingUrl: "https://www.jeunes.gouv.fr/",
    bookingLabel: "Explore student benefits",
    defaultLocation: "Bank of your choice",
    tips: [
      "Banks offer student accounts with special perks and lower fees",
      "Check for free insurance deals bundled with accounts",
      "Annual reviews recommended to maintain student pricing",
      "BNP, SG, and Boursorama all have competitive student offers",
    ],
  },

  // Utilities & Services
  {
    id: "mobile",
    label: "Mobile Phone Plans",
    emoji: "📱",
    color: "bg-fuchsia-50",
    textColor: "text-fuchsia-700",
    borderColor: "border-fuchsia-200",
    description: "SIM cards and mobile plans for students",
    bookingUrl: "https://www.bouyguestelecom.fr/",
    bookingLabel: "Get a mobile plan",
    defaultLocation: "Carrier store, Paris",
    tips: [
      "Student plans available from Bouygues, Orange, and SFR",
      "Bring ID and proof of residence to sign up",
      "Compare speeds and data limits before choosing provider",
      "Expect €10-20/month for student plans with decent data",
    ],
  },
  {
    id: "internet",
    label: "Internet / Broadband",
    emoji: "📡",
    color: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-300",
    description: "Home internet setup and contracts",
    bookingUrl: "https://www.orange.fr/",
    bookingLabel: "Order internet",
    defaultLocation: "Your apartment, Paris",
    tips: [
      "Fiber availability varies by neighborhood — check before committing",
      "Installation typically takes 2–3 weeks after order",
      "Ask your landlord about building infrastructure before applying",
      "Orange and Bouygues are most popular — compare pricing",
    ],
  },
  {
    id: "utilities",
    label: "Electricity & Gas",
    emoji: "⚡",
    color: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200",
    description: "Utility accounts for EDF, Engie, and other providers",
    bookingUrl: "https://particulier.edf.fr/",
    bookingLabel: "Set up utilities",
    defaultLocation: "Your apartment, Paris",
    tips: [
      "Bring ID and proof of residence to set up accounts",
      "You can choose your energy provider — not limited to EDF",
      "Compare fixed vs variable rates before committing",
      "Setup typically takes 2–4 weeks for activation",
    ],
  },
  {
    id: "waste",
    label: "Waste & Recycling Portal",
    emoji: "♻️",
    color: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-300",
    description: "Trash collection and recycling information",
    bookingUrl: "https://www.paris.fr/services",
    bookingLabel: "Learn about Paris recycling",
    defaultLocation: "Your neighborhood, Paris",
    tips: [
      "Separate recyclables from regular trash — Paris has strict rules",
      "Learn your neighborhood's collection schedule on paris.fr",
      "Composting programs available in some arrondissements",
      "Glass and plastics have different collection days",
    ],
  },

  // Education & Support Services
  {
    id: "erasmus",
    label: "Erasmus+ / Student Exchange",
    emoji: "🌍",
    color: "bg-indigo-50",
    textColor: "text-indigo-700",
    borderColor: "border-indigo-200",
    description: "International mobility and exchange programs",
    bookingUrl: "https://erasmusplus.ec.europa.eu/",
    bookingLabel: "Explore Erasmus+",
    defaultLocation: "Your university",
    tips: [
      "Apply through your university's international office",
      "Funding covers tuition, living costs, and travel",
      "Application deadlines typically in January for fall semesters",
      "Excellent opportunity to study abroad and network",
    ],
  },
  {
    id: "campus_france",
    label: "Campus France",
    emoji: "🎓",
    color: "bg-sky-50",
    textColor: "text-sky-700",
    borderColor: "border-sky-200",
    description: "International student services and support",
    bookingUrl: "https://www.campusfrance.org/",
    bookingLabel: "Access Campus France",
    defaultLocation: "Online services",
    tips: [
      "Provides visa assistance for international students",
      "Housing help and accommodation search services",
      "Enrollment verification and academic support",
      "Contact early in your student journey for best support",
    ],
  },
  {
    id: "student_loan",
    label: "Student Loan Applications",
    emoji: "💸",
    color: "bg-orange-100",
    textColor: "text-orange-800",
    borderColor: "border-orange-300",
    description: "Education financing and student loans",
    bookingUrl: "https://www.education.gouv.fr/",
    bookingLabel: "Apply for student loans",
    defaultLocation: "Online or local bank",
    tips: [
      "Government loans available for eligible students",
      "Check your university and nationality for eligibility",
      "Interest-free for 6 months after graduation",
      "Competitive rates for education expenses",
    ],
  },

  // Health & Work Services
  {
    id: "vaccination",
    label: "Vaccination Records Portal",
    emoji: "💉",
    color: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    description: "Digital proof of vaccination access",
    bookingUrl: "https://www.francais-covid.fr/",
    bookingLabel: "Download vaccination proof",
    defaultLocation: "Online services",
    tips: [
      "Download digital vaccination proof from francais-covid.fr",
      "Store proof locally — some venues still require it",
      "Required for certain healthcare and travel purposes",
      "Keep proof valid — expiration dates may apply",
    ],
  },
  {
    id: "student_jobs",
    label: "Student Job Portal",
    emoji: "💼",
    color: "bg-slate-100",
    textColor: "text-slate-800",
    borderColor: "border-slate-300",
    description: "Part-time work and internship opportunities",
    bookingUrl: "https://www.indeed.fr/jobs?q=student",
    bookingLabel: "Find student jobs",
    defaultLocation: "Online job portal",
    tips: [
      "Popular student jobs: tutoring, hospitality, retail",
      "Check working hour limits — max 35 hours/week during school",
      "Get a SIREN number for tax filing if self-employed",
      "Many employers offer student-friendly schedules",
    ],
  },

  {
    id: "other",
    label: "Other Appointment",
    emoji: "📅",
    color: "bg-slate-50",
    textColor: "text-slate-600",
    borderColor: "border-slate-200",
    description: "Any other appointment",
    bookingUrl: "",
    bookingLabel: "",
    defaultLocation: "",
    tips: [],
  },
];

export function getTypeById(id: string): AppointmentType {
  return APPOINTMENT_TYPES.find((t) => t.id === id) ?? APPOINTMENT_TYPES[APPOINTMENT_TYPES.length - 1];
}

export function getDaysUntil(dateStr: string): number {
  // Bug fix #1: "2026-05-20" parsed as UTC midnight, wrong for IST/Asia users.
  // Append T00:00:00 (no Z) so JS treats it as LOCAL midnight, not UTC.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const apptDate = new Date(`${dateStr}T00:00:00`);
  apptDate.setHours(0, 0, 0, 0);
  if (isNaN(apptDate.getTime())) return 0; // Bug fix #6: guard invalid date
  return Math.round((apptDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function safeFormatDate(dateStr: string, timeStr: string): string {
  // Bug fix #6: guard against corrupted localStorage date strings
  const d = new Date(`${dateStr}T${timeStr}`);
  if (isNaN(d.getTime())) return "Invalid date";
  return d.toLocaleDateString("en-GB", {
    day: "numeric", month: "short",
  }) + " at " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function formatAppointmentDate(dateStr: string, timeStr: string): string {
  const date = new Date(`${dateStr}T${timeStr}`);
  return date.toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }) + " at " + date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
