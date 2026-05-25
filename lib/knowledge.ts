/**
 * Cléo RAG Knowledge Base
 * Curated, accurate Paris student admin information.
 * Each chunk has: topic tags, content, source.
 * The RAG system searches this before calling any LLM.
 */

export interface KnowledgeChunk {
  id: string;
  tags: string[];
  title: string;
  content: string;
  source: string;
}

export const knowledgeBase: KnowledgeChunk[] = [
  // ── CAF ────────────────────────────────────────────────────────
  {
    id: "caf-001",
    tags: ["caf", "housing", "aid", "apl", "allocation"],
    title: "What is CAF and APL?",
    content: `CAF (Caisse d'Allocations Familiales) is the French family benefits agency. It provides APL (Aide Personnalisée au Logement) — housing aid for students renting in France. Students can receive between €80 and €350/month depending on rent, location, and income. Apply at caf.fr. Payments are retroactive to your application date so apply immediately on arrival.`,
    source: "caf.fr",
  },
  {
    id: "caf-002",
    tags: ["caf", "documents", "required", "application"],
    title: "Documents needed for CAF application",
    content: `To apply for CAF APL you need: 1) Passport or residence permit (titre de séjour), 2) Rental lease agreement (bail de location), 3) RIB — your French bank account details (Relevé d'Identité Bancaire), 4) Landlord's tax number (numéro fiscal), 5) Certificat de scolarité (university enrollment certificate), 6) Proof of arrival date in France. All documents must be uploaded to your CAF online account at caf.fr.`,
    source: "caf.fr",
  },
  {
    id: "caf-003",
    tags: ["caf", "timeline", "waiting", "delay", "payment"],
    title: "CAF processing time and payment timeline",
    content: `CAF applications typically take 4 to 8 weeks to process. Payments are retroactive to your application date — every day you delay costs you money. Your first payment covers multiple months. Payments arrive on the 5th of each month. Monitor your CAF online account for document requests — missing these delays your application significantly.`,
    source: "caf.fr",
  },
  {
    id: "caf-004",
    tags: ["caf", "crous", "university", "residence", "student housing"],
    title: "CAF for CROUS university residences",
    content: `If you live in a CROUS university residence, CAF payments go directly to CROUS and are deducted from your monthly rent automatically. You do not receive the money directly. Your rent receipt will show the reduced amount after CAF. You still need to apply on caf.fr yourself.`,
    source: "caf.fr",
  },

  // ── CPAM / Health ───────────────────────────────────────────────
  {
    id: "cpam-001",
    tags: ["cpam", "health", "insurance", "securite sociale", "ameli"],
    title: "How to register for French health insurance (CPAM)",
    content: `Students in France must register with CPAM (Caisse Primaire d'Assurance Maladie) for health insurance. Go to ameli.fr and create an account. Upload your passport, visa/residence permit, proof of address, RIB, and certificat de scolarité. Processing takes 3 to 6 weeks. You will receive a Carte Vitale (green health card) by post. Until then, download your Attestation de droits from ameli.fr — it is accepted everywhere.`,
    source: "ameli.fr",
  },
  {
    id: "cpam-002",
    tags: ["cpam", "carte vitale", "doctor", "medecin traitant", "reimbursement"],
    title: "Médecin traitant — why you need one",
    content: `A médecin traitant is your registered family doctor in France. You must declare one with CPAM to get full reimbursements (70%). Without one, reimbursements drop to 30%. Use doctolib.fr to find a GP accepting new patients near you. During your first visit say 'Je voudrais vous déclarer comme mon médecin traitant'. The doctor registers this with CPAM online.`,
    source: "ameli.fr",
  },
  {
    id: "cpam-003",
    tags: ["cpam", "mutuelle", "complementary", "lmde", "insurance"],
    title: "Complementary health insurance (mutuelle)",
    content: `CPAM covers approximately 70% of medical costs. A mutuelle (complementary insurance) covers the remaining 30%. For students, LMDE (La Mutuelle des Étudiants) offers affordable plans from €10/month. Many universities have negotiated group rates — check with your student union (BDE). Some students qualify for CSS (Complémentaire Santé Solidaire) which is free.`,
    source: "ameli.fr / lmde.fr",
  },

  // ── Banking ─────────────────────────────────────────────────────
  {
    id: "bank-001",
    tags: ["bank", "account", "bnp", "societe generale", "boursorama", "rib"],
    title: "Best banks for international students in Paris",
    content: `Three recommended options: 1) BNP Paribas — most international-friendly, in-person appointment required, good English support. 2) Société Générale — good student offers, in-person required. 3) Boursorama — 100% online, no monthly fees, open in 20 minutes from your phone, best value. All provide a RIB (Relevé d'Identité Bancaire) which you need for CAF, CPAM, and your landlord. Bring passport, visa, proof of address, and certificat de scolarité.`,
    source: "banque advice",
  },
  {
    id: "bank-002",
    tags: ["bank", "rib", "livret a", "savings"],
    title: "What is a RIB and Livret A?",
    content: `A RIB (Relevé d'Identité Bancaire) is your French bank account details slip — IBAN, BIC, account number. You need it for CAF payments, rent, CPAM, and any French direct debit. Print multiple copies. A Livret A is a free, tax-exempt savings account. Ask your bank to open one — some CAF payments require it. Interest rate is currently 3%.`,
    source: "banque-france.fr",
  },

  // ── Transport ───────────────────────────────────────────────────
  {
    id: "transport-001",
    tags: ["navigo", "transport", "metro", "rer", "bus", "imagine r"],
    title: "Navigo pass and Imagine R for students",
    content: `The Navigo pass gives unlimited travel on all Paris public transport (metro, RER, bus, tram). Monthly unlimited zones 1–5 costs €86.40/month. For students under 26, Imagine R costs approximately €350/year for unlimited zones 1–5 — much cheaper than monthly passes. Apply at imaginer.iledefrance-mobilites.fr with your student card and photo. The physical card costs €2 at any metro station ticket office.`,
    source: "iledefrance-mobilites.fr",
  },

  // ── University ──────────────────────────────────────────────────
  {
    id: "uni-001",
    tags: ["university", "cvec", "registration", "inscription", "certificat scolarite"],
    title: "University registration and CVEC",
    content: `Before registering at any French university you must pay the CVEC (Contribution Vie Étudiante et de Campus) — €103 at cvec.etudiant.gouv.fr. You receive an attestation immediately. Use this to complete your inscription administrative (administrative registration) on your university ENT portal. Then complete inscription pédagogique (course registration). Download multiple copies of your certificat de scolarité — you need it for banks, CAF, CPAM, and housing.`,
    source: "etudiant.gouv.fr",
  },

  // ── Phone ───────────────────────────────────────────────────────
  {
    id: "phone-001",
    tags: ["phone", "sim", "plan", "free mobile", "orange", "sfr", "forfait"],
    title: "Best phone plans for students in Paris",
    content: `Three options: 1) Free Mobile — best value. €2/month basic or €20/month for 100GB+ data with EU roaming. Order online, SIM delivered in 2 days. 2) Orange — premium coverage, student plans from €15/month, in-store. 3) SFR — good student plans, in-store or online. All major carriers include EU roaming at no extra cost. Bring your passport to any store. Some carriers require a French bank account — open your bank first.`,
    source: "free.fr / orange.fr / sfr.fr",
  },

  // ── Visa / Prefecture ───────────────────────────────────────────
  {
    id: "visa-001",
    tags: ["visa", "prefecture", "titre sejour", "residence permit", "renewal"],
    title: "Residence permit (titre de séjour) for students",
    content: `EU students do not need a residence permit. Non-EU students with a long-stay visa (VLS-TS) must validate it within 3 months of arrival at administration-etrangers-en-france.interieur.gouv.fr. After one year, renew your titre de séjour at your local prefecture. Book appointments online — they fill up fast. Documents needed: passport, current visa, proof of enrollment, proof of address, proof of resources (scholarship letter or bank statements showing €615+/month).`,
    source: "interieur.gouv.fr",
  },

  // ── Housing ─────────────────────────────────────────────────────
  {
    id: "housing-001",
    tags: ["housing", "apartment", "rent", "lease", "bail", "landlord"],
    title: "Finding housing in Paris as an international student",
    content: `Options: 1) CROUS university residences — cheapest (€200–400/month), apply via trouvermonlogement.etudiant.gouv.fr before arrival. 2) Private rentals — €700–1,200/month for a studio. Use SeLoger, PAP, or Le Bon Coin. 3) Student residences (Studélites, Nexity) — furnished, €600–900/month, easier for foreigners. You will need a French guarantor or use Visale (free guarantee service from Action Logement) at visale.fr. Always get a signed bail (lease) — you need it for CAF and bank accounts.`,
    source: "etudiant.gouv.fr",
  },

  // ── Emergency ───────────────────────────────────────────────────
  {
    id: "emergency-001",
    tags: ["emergency", "numbers", "samu", "police", "pharmacy", "urgent"],
    title: "Emergency numbers and urgent services in Paris",
    content: `Key numbers: SAMU (medical emergency) 15, Pompiers (fire/medical) 18, Police 17, European emergency 112, SOS Médecins (home visits) 3600. Pharmacies (green cross sign) are open late and can advise on minor illness without appointment. For urgent care without emergency, visit a CMP (Centre Médico-Psychologique) or urgences médicales. Most central Paris hospitals have English-speaking staff. Hôpital Américain de Paris has full English service.`,
    source: "service-public.fr",
  },

  // ── Carte Vitale ───────────────────────────────────────────────
  {
    id: "health-carte-vitale",
    tags: ["carte vitale", "health card", "cpam", "insurance", "reimbursement"],
    title: "Carte Vitale — Your French health insurance card",
    content: `The Carte Vitale is a small green plastic card that proves you are registered with French health insurance (CPAM). It contains your social security number and rights information. Doctors and pharmacies scan it for instant reimbursement — without it, you pay out-of-pocket and claim reimbursement later. Until your physical card arrives (3-6 weeks after CPAM registration), download your Attestation de droits from ameli.fr and print it — pharmacies and doctors accept it.`,
    source: "ameli.fr",
  },

  // ── Prefecture ───────────────────────────────────────────────────
  {
    id: "prefecture-001",
    tags: ["prefecture", "administration", "documents", "visa", "titre sejour", "foreigner"],
    title: "What is a Prefecture and what do international students need there?",
    content: `A Prefecture (Préfecture) is a local government office handling foreigner administrative matters. Non-EU students with a long-stay visa must validate it at a Prefecture within 3 months of arrival. EU students do not need to visit unless staying longer than 3 months. Book appointments online at your local prefecture's website — they fill up fast, sometimes months in advance. Required documents: long-stay visa in passport, proof of address (bail, utility bill), proof of enrollment (certificat de scolarité), proof of resources (€615+/month bank statements or scholarship letter).`,
    source: "interieur.gouv.fr",
  },

  {
    id: "prefecture-renewal",
    tags: ["prefecture", "renewal", "titre sejour", "year", "immigration", "resident"],
    title: "Renewing your residence permit (titre de séjour) at the Prefecture",
    content: `After your first year in France, non-EU students must renew their titre de séjour (residence permit) at the local Prefecture 2-3 months before expiration. Book an appointment online immediately — waits are often 3-4 months. Documents needed: current passport and visa, previous titre de séjour card, certificat de scolarité (if still a student), proof of address, proof of resources (bank statements showing €615+/month), 4 passport photos, and the prefecture's specific form (Cerfa). Processing takes 3-4 weeks after appointment.`,
    source: "interieur.gouv.fr",
  },

  // ── University Registration (Expanded) ──────────────────────────
  {
    id: "uni-002",
    tags: ["university", "inscription", "administrative", "pedagogique", "ent", "enrollment"],
    title: "Understanding French university registration process",
    content: `French universities require two registrations: 1) Inscription administrative — register with the university as a student (done on ENT portal after paying CVEC), 2) Inscription pédagogique — enroll in your specific courses (also on ENT portal). Both must be completed before classes start. You cannot get a student card or access university facilities without administrative registration. Your ENT (Espace Numérique de Travail) is your online portal for grades, documents, and enrollment — bookmark it. Each university has different deadlines, usually in August/September.`,
    source: "etudiant.gouv.fr",
  },

  {
    id: "uni-003",
    tags: ["university", "student card", "carte etudiant", "sasu", "facilities"],
    title: "Student card (carte étudiante) benefits and how to get one",
    content: `After administrative registration, visit your university's student services office (Scolarité or Bureau de la Vie Étudiante) with your registration proof (quittance) to collect your student card (carte étudiante). This card gives access to: university libraries and study spaces, discounts at restaurants/cafés (usually 20-30% off), free or reduced entry to Paris museums (Louvre, Musée d'Orsay), reduced transport passes (Imagine R for students under 26), and student discounts at stores. Your card is valid for the academic year.`,
    source: "etudiant.gouv.fr",
  },
];

/**
 * Simple keyword-based RAG search.
 * Scores each chunk by how many query words match its tags + content.
 * Returns top N most relevant chunks.
 */
export function searchKnowledge(query: string, topN = 3): KnowledgeChunk[] {
  const words = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const scored = knowledgeBase.map((chunk) => {
    const searchText = [
      chunk.title,
      chunk.content,
      chunk.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    let score = 0;
    for (const word of words) {
      // Tag match = higher weight
      if (chunk.tags.some((t) => t.includes(word) || word.includes(t))) {
        score += 3;
      }
      // Title match
      if (chunk.title.toLowerCase().includes(word)) score += 2;
      // Content match
      if (searchText.includes(word)) score += 1;
    }
    return { chunk, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map((s) => s.chunk);
}
