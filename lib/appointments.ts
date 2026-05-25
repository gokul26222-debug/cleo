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
  timeline?: "before_arrival" | "week_1" | "month_1" | "ongoing"; // Timeline phase for onboarding
  status?: "not_started" | "in_progress" | "completed"; // Status tracking
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
    timeline: "before_arrival",
    status: "not_started",
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
    timeline: "week_1",
    status: "not_started",
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
    timeline: "month_1",
    status: "not_started",
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
    timeline: "month_1",
    status: "not_started",
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
    timeline: "week_1",
    status: "not_started",
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
    timeline: "before_arrival",
    status: "not_started",
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
    timeline: "month_1",
    status: "not_started",
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
    timeline: "week_1",
    status: "not_started",
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
    timeline: "month_1",
    status: "not_started",
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
    timeline: "week_1",
    status: "not_started",
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
    timeline: "month_1",
    status: "not_started",
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
    timeline: "month_1",
    status: "not_started",
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
    timeline: "month_1",
    status: "not_started",
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
    timeline: "week_1",
    status: "not_started",
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
    timeline: "month_1",
    status: "not_started",
    tips: [
      "Fiber availability varies by neighborhood — check before committing",
      "Installation typically takes 2–3 weeks after order",
      "Ask your landlord about building infrastructure before applying",
      "Orange and Bouygues are most popular — compare pricing",
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
    timeline: "month_1",
    status: "not_started",
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
    timeline: "before_arrival",
    status: "not_started",
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
    timeline: "before_arrival",
    status: "not_started",
    tips: [
      "Provides visa assistance for international students",
      "Housing help and accommodation search services",
      "Enrollment verification and academic support",
      "Contact early in your student journey for best support",
    ],
  },

  // Health & Work Services
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
    timeline: "month_1",
    status: "not_started",
    tips: [
      "Popular student jobs: tutoring, hospitality, retail",
      "Check working hour limits — max 35 hours/week during school",
      "Get a SIREN number for tax filing if self-employed",
      "Many employers offer student-friendly schedules",
    ],
  },

  // Community & Food Support
  {
    id: "free_food",
    label: "Free Food Programs for Students",
    emoji: "🍲",
    color: "bg-red-100",
    textColor: "text-red-800",
    borderColor: "border-red-300",
    description: "Food assistance and free meal programs",
    bookingUrl: "https://www.paris.fr/pages/l-aide-alimentaire-5436",
    bookingLabel: "Access food assistance",
    defaultLocation: "Various locations in Paris",
    timeline: "ongoing",
    status: "not_started",
    tips: [
      "Paris offers free meal programs and food banks for students in need",
      "Universities often provide discounted meal plans — check your campus",
      "Food donations and community kitchens available in many neighborhoods",
      "Social services can help qualify for additional food assistance",
    ],
  },

  // Student Housing
  {
    id: "student_apartments",
    label: "Student-Friendly Apartment Finder",
    emoji: "🏘️",
    color: "bg-amber-100",
    textColor: "text-amber-800",
    borderColor: "border-amber-300",
    description: "Student housing platforms and apartment search",
    bookingUrl: "https://www.seloger.com/",
    bookingLabel: "Search student apartments",
    defaultLocation: "Paris and surrounding areas",
    timeline: "week_1",
    status: "not_started",
    tips: [
      "Popular platforms: SeLoger, LeBonCoin, PAD — compare listings",
      "Look for furnished apartments ('meublé') — often cheaper for students",
      "Check if APL (housing aid) applies to your rental — reduces costs",
      "Ask landlord about utilities included — water, internet, heating costs matter",
    ],
  },

  // Linkee Paris - Free Food assistance
  {
    id: "linkee_paris",
    label: "Linkee Paris",
    emoji: "🍲",
    color: "bg-orange-100",
    textColor: "text-orange-800",
    borderColor: "border-orange-300",
    description: "Free meal distribution for students in need",
    bookingUrl: "https://www.linkee.org/",
    bookingLabel: "Join Linkee Paris",
    defaultLocation: "Paris",
    timeline: "ongoing",
    status: "not_started",
    tips: [
      "Free meal distribution for students in need",
      "Download the Linkee mobile app to find nearby meal distribution points",
      "Community-based support run by volunteers",
      "No eligibility requirements — open to all students",
    ],
  },

  // Ameli Social Security
  {
    id: "ameli",
    label: "Social Security / Ameli",
    emoji: "🏥",
    color: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    description: "Register for French health insurance coverage",
    bookingUrl: "https://www.ameli.fr/",
    bookingLabel: "Register on Ameli",
    defaultLocation: "Online services",
    timeline: "ongoing",
    status: "not_started",
    tips: [
      "Register for French health insurance (Sécurité Sociale)",
      "Create your Ameli account early after arrival",
      "Download your digital health insurance card",
      "Needed for any doctor visits or prescriptions in France",
    ],
  },

  // CROUS - Student Centre
  {
    id: "crous",
    label: "CROUS",
    emoji: "🎓",
    color: "bg-violet-50",
    textColor: "text-violet-700",
    borderColor: "border-violet-200",
    description: "Student Centre for housing, meals, and financial assistance",
    bookingUrl: "https://www.crous.org/",
    bookingLabel: "Visit CROUS",
    defaultLocation: "Your university",
    timeline: "ongoing",
    status: "not_started",
    tips: [
      "Apply for student housing in cités U (university dormitories)",
      "Check meal plan options in university cafeterias",
      "Financial assistance programs available for students",
      "Services vary by university — check your local CROUS site",
    ],
  },

  // CRUZW - Health & Wellness
  {
    id: "cruzw",
    label: "CRUZW (Health Services)",
    emoji: "💊",
    color: "bg-pink-50",
    textColor: "text-pink-700",
    borderColor: "border-pink-200",
    description: "Health services coordination, medical consultations",
    bookingUrl: "https://www.cruzw.fr/",
    bookingLabel: "Book on CRUZW",
    defaultLocation: "CRUZW Paris",
    timeline: "month_1",
    status: "not_started",
    tips: [
      "Access health services and medical consultations",
      "Register for health programs and wellness resources",
      "Book medical appointments through the platform",
      "Connect with healthcare providers and specialists",
    ],
  },

  // Vital Card - French Health ID
  {
    id: "vital_card",
    label: "Vital Card (Carte Vitale)",
    emoji: "🆔",
    color: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    description: "French health insurance card, medical reimbursements",
    bookingUrl: "https://www.ameli.fr/assure/mes-documents/",
    bookingLabel: "Manage on Ameli",
    defaultLocation: "Online or at CPAM office",
    timeline: "month_1",
    status: "not_started",
    tips: [
      "Request your Carte Vitale through Ameli.fr",
      "Takes 3-6 weeks to arrive by post",
      "Needed for all doctor visits and prescriptions",
      "Print your Attestation de droits as temporary proof while waiting",
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
    timeline: "ongoing",
    status: "not_started",
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
