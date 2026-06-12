/**
 * Essential apps every international student in Paris needs.
 * Curated, categorized, with insider student tips and store links.
 */

export type AppCategory =
  | "transport"
  | "health"
  | "money"
  | "housing"
  | "student"
  | "daily";

export interface EssentialApp {
  id: string;
  name: string;
  category: AppCategory;
  emoji: string;
  tagline: string;
  description: string;
  whyNeeded: string;
  price: "Free" | "Freemium";
  studentTip: string;
  iosUrl: string;
  androidUrl: string;
  webUrl?: string;
  gradient: string;
  lightBg: string;
}

export const APP_CATEGORIES: { id: AppCategory | "all"; label: string; emoji: string }[] = [
  { id: "all",       label: "All",       emoji: "✨" },
  { id: "transport", label: "Transport", emoji: "🚇" },
  { id: "health",    label: "Health",    emoji: "🏥" },
  { id: "money",     label: "Money",     emoji: "💰" },
  { id: "housing",   label: "Housing",   emoji: "🏠" },
  { id: "student",   label: "Student",   emoji: "🎓" },
  { id: "daily",     label: "Daily",     emoji: "📱" },
];

export const ESSENTIAL_APPS: EssentialApp[] = [
  // ── Transport ──────────────────────────────────────────────
  {
    id: "citymapper",
    name: "Citymapper",
    category: "transport",
    emoji: "🧭",
    tagline: "The best way to navigate Paris",
    description:
      "Real-time metro, bus, RER, bike and walking routes — smarter than Google Maps for Paris public transport. Shows exactly which exit to take and which carriage to board.",
    whyNeeded:
      "Paris has 16 metro lines, 5 RER lines and 350+ bus routes. Citymapper combines them all and reroutes you instantly during strikes or closures.",
    price: "Free",
    studentTip:
      "Set Home and Uni as favorites — it warns you about metro strikes and line closures before you even leave.",
    iosUrl: "https://apps.apple.com/app/citymapper/id469463298",
    androidUrl: "https://play.google.com/store/apps/details?id=com.citymapper.app.release",
    webUrl: "https://citymapper.com/paris",
    gradient: "from-green-400 to-emerald-600",
    lightBg: "bg-green-50",
  },
  {
    id: "bonjour-ratp",
    name: "Bonjour RATP",
    category: "transport",
    emoji: "🚇",
    tagline: "Official metro app + Navigo reload",
    description:
      "The official Paris transport app. Buy and reload your Navigo pass directly from your phone (NFC), check live traffic, and see station maps.",
    whyNeeded:
      "It's the only app that lets you top up your Navigo pass with your phone — no more queuing at station machines.",
    price: "Free",
    studentTip:
      "With the Imagine R student pass (~€392/year) you get unlimited travel in all 5 zones — reload it here every month in 10 seconds.",
    iosUrl: "https://apps.apple.com/app/bonjour-ratp/id507107090",
    androidUrl: "https://play.google.com/store/apps/details?id=com.fabernovel.ratp",
    webUrl: "https://www.ratp.fr",
    gradient: "from-teal-400 to-cyan-600",
    lightBg: "bg-teal-50",
  },
  {
    id: "sncf-connect",
    name: "SNCF Connect",
    category: "transport",
    emoji: "🚄",
    tagline: "Trains across France",
    description:
      "Book TGV, Intercités and regional TER trains all over France. Digital tickets, live platform info, and delay alerts.",
    whyNeeded:
      "Weekend trips to Lyon, Bordeaux or the coast are a huge part of student life — this is the official way to book.",
    price: "Free",
    studentTip:
      "Buy the Carte Avantage Jeune (€49/year, ages 12-27) — it cuts up to 50% off train tickets. Pays for itself in one trip.",
    iosUrl: "https://apps.apple.com/app/sncf-connect-trains-trajets/id343889987",
    androidUrl: "https://play.google.com/store/apps/details?id=com.vsct.vsc.mobile.horaireetresa.android",
    webUrl: "https://www.sncf-connect.com",
    gradient: "from-purple-400 to-indigo-600",
    lightBg: "bg-purple-50",
  },
  {
    id: "velib",
    name: "Vélib'",
    category: "transport",
    emoji: "🚲",
    tagline: "Paris public bikes",
    description:
      "20,000 shared bikes (mechanical + electric) at 1,400 stations across Paris. Find, unlock and return bikes from the app.",
    whyNeeded:
      "Often faster than the metro for short trips, and the V-Plus student plan is one of the cheapest ways to move around Paris.",
    price: "Freemium",
    studentTip:
      "The student offer is around €2.65/month for unlimited 30-min mechanical rides — cheaper than a single metro ticket.",
    iosUrl: "https://apps.apple.com/app/v%C3%A9lib-official-app/id1372487348",
    androidUrl: "https://play.google.com/store/apps/details?id=com.paris.velib",
    webUrl: "https://www.velib-metropole.fr",
    gradient: "from-lime-400 to-green-600",
    lightBg: "bg-lime-50",
  },

  // ── Health ─────────────────────────────────────────────────
  {
    id: "doctolib",
    name: "Doctolib",
    category: "health",
    emoji: "🩺",
    tagline: "Book any doctor in 2 minutes",
    description:
      "France's #1 medical booking platform. Find GPs, dentists, specialists and book appointments instantly — no phone calls in French needed.",
    whyNeeded:
      "Booking a doctor by phone in French is stressful. Doctolib shows availability, lets you filter by spoken language, and sends reminders.",
    price: "Free",
    studentTip:
      "Filter by 'English' under spoken languages, and look for 'Conventionné secteur 1' doctors — they charge the standard rate CPAM reimburses at 70%.",
    iosUrl: "https://apps.apple.com/app/doctolib/id925339063",
    androidUrl: "https://play.google.com/store/apps/details?id=fr.doctolib.www",
    webUrl: "https://www.doctolib.fr",
    gradient: "from-sky-400 to-blue-600",
    lightBg: "bg-sky-50",
  },
  {
    id: "ameli",
    name: "ameli",
    category: "health",
    emoji: "💳",
    tagline: "Your French health insurance account",
    description:
      "Official CPAM app. Track your Carte Vitale application, download your attestation de droits, see reimbursements, and update your details.",
    whyNeeded:
      "Until your Carte Vitale arrives (3-6 weeks), the attestation in this app is your proof of health coverage — pharmacies and doctors accept it.",
    price: "Free",
    studentTip:
      "Download your 'Attestation de droits' PDF as soon as your account is active and save it in Cleo's Document Vault.",
    iosUrl: "https://apps.apple.com/app/compte-ameli/id871510249",
    androidUrl: "https://play.google.com/store/apps/details?id=fr.cnamts.it.activity",
    webUrl: "https://www.ameli.fr",
    gradient: "from-emerald-400 to-teal-600",
    lightBg: "bg-emerald-50",
  },

  // ── Money & deals ──────────────────────────────────────────
  {
    id: "tgtg",
    name: "Too Good To Go",
    category: "money",
    emoji: "🥐",
    tagline: "Restaurant meals for €3-4",
    description:
      "Buy surprise bags of unsold food from bakeries, restaurants and supermarkets at 1/3 of the price. Huge in Paris — thousands of shops participate.",
    whyNeeded:
      "Eating out in Paris is expensive. A €4 bag from a boulangerie often contains €12+ of pastries, sandwiches and bread.",
    price: "Free",
    studentTip:
      "Bakery bags near closing time (19h-20h) are the best value. Set favorites and enable alerts — good bags sell out in minutes.",
    iosUrl: "https://apps.apple.com/app/too-good-to-go/id1060683933",
    androidUrl: "https://play.google.com/store/apps/details?id=com.app.tgtg",
    webUrl: "https://www.toogoodtogo.com/fr",
    gradient: "from-amber-400 to-orange-600",
    lightBg: "bg-amber-50",
  },
  {
    id: "lydia",
    name: "Lydia",
    category: "money",
    emoji: "💸",
    tagline: "France's Venmo — split bills instantly",
    description:
      "Send and receive money instantly with just a phone number. The default way French students split restaurant bills, rent and group expenses.",
    whyNeeded:
      "When friends say 'fais-moi un Lydia' after dinner, you'll want to have it. Works with any French bank card.",
    price: "Freemium",
    studentTip:
      "Link it to your French account (not your home-country card) to avoid foreign transaction fees on every transfer.",
    iosUrl: "https://apps.apple.com/app/lydia-paiements-et-cagnottes/id575913704",
    androidUrl: "https://play.google.com/store/apps/details?id=com.lydia",
    webUrl: "https://lydia-app.com",
    gradient: "from-blue-400 to-indigo-600",
    lightBg: "bg-blue-50",
  },
  {
    id: "unidays",
    name: "UNiDAYS",
    category: "money",
    emoji: "🏷️",
    tagline: "Student discounts everywhere",
    description:
      "Verified student discounts on tech, fashion, food and software — Apple, Nike, Adobe, Spotify and hundreds of French brands.",
    whyNeeded:
      "Your student status is worth real money in France. UNiDAYS verifies you once and unlocks discounts everywhere.",
    price: "Free",
    studentTip:
      "Verify with your French university email after registration — some discounts (like Apple education pricing) stack with French back-to-school offers.",
    iosUrl: "https://apps.apple.com/app/unidays-student-discounts/id599066376",
    androidUrl: "https://play.google.com/store/apps/details?id=com.myunidays.uk",
    webUrl: "https://www.myunidays.com",
    gradient: "from-pink-400 to-rose-600",
    lightBg: "bg-pink-50",
  },

  // ── Housing ────────────────────────────────────────────────
  {
    id: "leboncoin",
    name: "LeBonCoin",
    category: "housing",
    emoji: "📦",
    tagline: "France's Craigslist — flats & furniture",
    description:
      "France's biggest classifieds site: apartments, furniture, bikes, electronics, textbooks. Where the French buy and sell everything secondhand.",
    whyNeeded:
      "Furnishing a student room from LeBonCoin costs a fraction of buying new — and apartment listings often appear here before agency sites.",
    price: "Free",
    studentTip:
      "For apartments, message within the first hour of a listing going live. For furniture, search 'donne' (give away) — Parisians give away good furniture for free when moving.",
    iosUrl: "https://apps.apple.com/app/leboncoin/id404972976",
    androidUrl: "https://play.google.com/store/apps/details?id=fr.leboncoin",
    webUrl: "https://www.leboncoin.fr",
    gradient: "from-orange-400 to-amber-600",
    lightBg: "bg-orange-50",
  },
  {
    id: "seloger",
    name: "SeLoger",
    category: "housing",
    emoji: "🔑",
    tagline: "Apartment hunting, agency listings",
    description:
      "France's main real-estate portal with agency and private listings. Detailed filters for furnished student studios, alerts for new listings.",
    whyNeeded:
      "If you're still looking for permanent housing, SeLoger has the widest verified inventory and instant alerts.",
    price: "Free",
    studentTip:
      "Search 'studio meublé' (furnished studio) and set instant alerts — good Paris studios under €900 are gone within 24 hours.",
    iosUrl: "https://apps.apple.com/app/seloger-annonces-immobilières/id309582303",
    androidUrl: "https://play.google.com/store/apps/details?id=com.seloger.android",
    webUrl: "https://www.seloger.com",
    gradient: "from-red-400 to-rose-600",
    lightBg: "bg-red-50",
  },
  {
    id: "cartedescolocs",
    name: "La Carte des Colocs",
    category: "housing",
    emoji: "🧑‍🤝‍🧑",
    tagline: "Find flatshares (colocation)",
    description:
      "Map-based flatshare platform made for students and young professionals. Browse rooms in shared apartments by neighborhood, free to contact.",
    whyNeeded:
      "Colocation is the most affordable way to live in Paris (€500-700/room vs €900+ for a studio) and the fastest way to make friends.",
    price: "Free",
    studentTip:
      "Write a short bio in basic French even if imperfect — flatmates pick people, not profiles, and effort counts.",
    iosUrl: "https://apps.apple.com/app/la-carte-des-colocs/id1133653766",
    androidUrl: "https://play.google.com/store/apps/details?id=fr.lacartedescolocs.app",
    webUrl: "https://www.lacartedescolocs.fr",
    gradient: "from-fuchsia-400 to-purple-600",
    lightBg: "bg-fuchsia-50",
  },

  // ── Student life ───────────────────────────────────────────
  {
    id: "crous-mobile",
    name: "Crous Mobile",
    category: "student",
    emoji: "🍽️",
    tagline: "€3.30 student meals near you",
    description:
      "Find the nearest CROUS university restaurant (RU), see today's menu, and check opening hours. Full meals for €3.30 with your student status.",
    whyNeeded:
      "A 3-course meal for €3.30 is the single best deal in Paris. There are dozens of RUs — this app finds the closest one.",
    price: "Free",
    studentTip:
      "Scholarship students (boursiers) pay just €1 per meal. Check if your CVEC/scholarship status qualifies you.",
    iosUrl: "https://apps.apple.com/app/crous-mobile/id1448756991",
    androidUrl: "https://play.google.com/store/apps/details?id=com.cnous.crousmobile",
    webUrl: "https://www.crous-paris.fr",
    gradient: "from-cyan-400 to-blue-600",
    lightBg: "bg-cyan-50",
  },
  {
    id: "izly",
    name: "Izly",
    category: "student",
    emoji: "📲",
    tagline: "Pay at university cafeterias",
    description:
      "The official payment app for CROUS restaurants and campus services. Top up your account and pay by QR code at the till.",
    whyNeeded:
      "Most CROUS restaurants are cashless — Izly is how you actually pay for those €3.30 meals.",
    price: "Free",
    studentTip:
      "Activate your account via the email CROUS sends after university registration — top up €20 at a time to skip queue-side fumbling.",
    iosUrl: "https://apps.apple.com/app/izly/id916316945",
    androidUrl: "https://play.google.com/store/apps/details?id=com.smoney.izly",
    webUrl: "https://www.izly.fr",
    gradient: "from-violet-400 to-purple-600",
    lightBg: "bg-violet-50",
  },
  {
    id: "duolingo",
    name: "Duolingo",
    category: "student",
    emoji: "🦉",
    tagline: "Daily French in 10 minutes",
    description:
      "Gamified daily French lessons. Won't make you fluent alone, but builds the survival vocabulary that makes Paris admin and daily life dramatically easier.",
    whyNeeded:
      "Even basic French transforms how people treat you at the préfecture, bank and bakery. Ten minutes a day compounds fast.",
    price: "Freemium",
    studentTip:
      "Focus on numbers, dates and politeness phrases first — that's 90% of what you need at appointments and counters.",
    iosUrl: "https://apps.apple.com/app/duolingo-language-lessons/id570060128",
    androidUrl: "https://play.google.com/store/apps/details?id=com.duolingo",
    webUrl: "https://www.duolingo.com",
    gradient: "from-green-400 to-lime-600",
    lightBg: "bg-green-50",
  },

  // ── Daily essentials ───────────────────────────────────────
  {
    id: "google-translate",
    name: "Google Translate",
    category: "daily",
    emoji: "🔤",
    tagline: "Camera mode = read any French letter",
    description:
      "Instant translation with camera mode — point your phone at any French document, menu or sign and read it in your language. Works offline with downloaded packs.",
    whyNeeded:
      "CAF letters, bank contracts, préfecture forms — official French mail is dense. Camera mode decodes it in seconds.",
    price: "Free",
    studentTip:
      "Download the French offline pack on day one — it works in the metro and at counters with no signal.",
    iosUrl: "https://apps.apple.com/app/google-translate/id414706506",
    androidUrl: "https://play.google.com/store/apps/details?id=com.google.android.apps.translate",
    webUrl: "https://translate.google.com",
    gradient: "from-blue-400 to-sky-600",
    lightBg: "bg-blue-50",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "daily",
    emoji: "💬",
    tagline: "How everyone communicates here",
    description:
      "The default messaging app in France for friends, flatmates, class groups and even some landlords and businesses.",
    whyNeeded:
      "Class group chats, flatshare coordination, international calls home — it all happens on WhatsApp in France.",
    price: "Free",
    studentTip:
      "Join your university program's WhatsApp group in week one — it's where notes, tips and apartment leads circulate.",
    iosUrl: "https://apps.apple.com/app/whatsapp-messenger/id310633997",
    androidUrl: "https://play.google.com/store/apps/details?id=com.whatsapp",
    webUrl: "https://www.whatsapp.com",
    gradient: "from-emerald-400 to-green-600",
    lightBg: "bg-emerald-50",
  },
  {
    id: "flush",
    name: "Flush",
    category: "daily",
    emoji: "🚻",
    tagline: "Find public toilets — trust us",
    description:
      "Map of public toilets across Paris, including the free self-cleaning sanisettes on the streets. Works offline.",
    whyNeeded:
      "Paris cafés charge or refuse non-customers. Knowing where the 400+ free public sanisettes are is genuinely life-saving.",
    price: "Free",
    studentTip:
      "All Paris sanisettes (grey street cabins) are free. Parks and department stores like BHV also have free facilities.",
    iosUrl: "https://apps.apple.com/app/flush-toilet-finder-map/id955254528",
    androidUrl: "https://play.google.com/store/apps/details?id=toilet.samruston.com.toilet",
    gradient: "from-slate-400 to-slate-600",
    lightBg: "bg-slate-50",
  },
];
