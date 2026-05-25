"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { countries, universities } from "@/lib/data";
import { storage } from "@/lib/storage";

type Step = 0 | 1 | 2 | 3 | 4;
const TOTAL = 5;

/* ── per-step visual config ─────────────────────────── */
const STEPS = [
  {
    bg: "from-sky-400 to-blue-600",
    cardBg: "bg-sky-50",
    accent: "text-sky-600",
    ring: "ring-sky-400",
    btn: "bg-sky-500 hover:bg-sky-400",
    btnShadow: "#0284c7",
    illustration: "🗼",
    illuBg: "bg-gradient-to-br from-sky-400 to-blue-600",
    title: "Welcome to Cléo!",
    subtitle: "Your personal guide to surviving Paris admin.",
    praise: "",
  },
  {
    bg: "from-violet-400 to-purple-600",
    cardBg: "bg-violet-50",
    accent: "text-violet-600",
    ring: "ring-violet-400",
    btn: "bg-violet-500 hover:bg-violet-400",
    btnShadow: "#7c3aed",
    illustration: "🌍",
    illuBg: "bg-gradient-to-br from-violet-400 to-purple-600",
    title: "Where are you from?",
    subtitle: "Cléo tailors visa advice just for you.",
    praise: "Magnifique! 🌍",
  },
  {
    bg: "from-rose-400 to-pink-600",
    cardBg: "bg-rose-50",
    accent: "text-rose-600",
    ring: "ring-rose-400",
    btn: "bg-rose-500 hover:bg-rose-400",
    btnShadow: "#be185d",
    illustration: "📅",
    illuBg: "bg-gradient-to-br from-rose-400 to-pink-600",
    title: "When did you arrive?",
    subtitle: "We'll track your 7-day progress from this date.",
    praise: "Parfait! 📅",
  },
  {
    bg: "from-amber-400 to-orange-500",
    cardBg: "bg-amber-50",
    accent: "text-amber-600",
    ring: "ring-amber-400",
    btn: "bg-amber-500 hover:bg-amber-400",
    btnShadow: "#b45309",
    illustration: "🎓",
    illuBg: "bg-gradient-to-br from-amber-400 to-orange-500",
    title: "Your university?",
    subtitle: "Type any school in Paris — listed or not.",
    praise: "Super! 🎓",
  },
  {
    bg: "from-emerald-400 to-teal-600",
    cardBg: "bg-emerald-50",
    accent: "text-emerald-600",
    ring: "ring-emerald-400",
    btn: "bg-emerald-500 hover:bg-emerald-400",
    btnShadow: "#065f46",
    illustration: "✨",
    illuBg: "bg-gradient-to-br from-emerald-400 to-teal-600",
    title: "Last step!",
    subtitle: "What should Cléo call you?",
    praise: "Incroyable! ✨",
  },
];

/* ── Praise overlay shown briefly after each step ────── */
function PraiseOverlay({ text, onDone }: { text: string; onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onAnimationComplete={() => setTimeout(onDone, 700)}
        className="bg-white rounded-3xl px-10 py-8 shadow-2xl text-center"
      >
        <p className="text-3xl font-black text-slate-900">{text}</p>
      </motion.div>
    </motion.div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [direction, setDirection] = useState(1);
  const [showPraise, setShowPraise] = useState(false);
  const [finishing, setFinishing] = useState(false);

  /* field values */
  const [nationality, setNationality] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [universityInput, setUniversityInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [typingOther, setTypingOther] = useState(false);
  const [name, setName] = useState("");

  // Bug fix #8: toISOString() returns UTC date, wrong for users ahead of UTC (e.g. IST).
  // Use local date parts instead to get the correct "today" in the user's timezone.
  const localToday = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  // Always have a valid step config, fallback to step 0
  const s = STEPS[step] ?? STEPS[0];

  const canProceed = () => {
    if (step === 1) return nationality !== "";
    if (step === 2) return arrivalDate !== "";
    if (step === 3) return universityInput.trim() !== "";
    if (step === 4) return name.trim() !== "";
    return true;
  };

  const advance = () => {
    if (step < TOTAL - 1) {
      if (step > 0) {
        setShowPraise(true);
      } else {
        setDirection(1);
        setStep((s) => (s + 1) as Step);
      }
    } else {
      handleFinish();
    }
  };

  const handlePraiseDone = () => {
    setShowPraise(false);
    setDirection(1);
    setStep((s) => (s + 1) as Step);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0) as Step);
  };

  const handleFinish = async () => {
    setFinishing(true);
    try {
      storage.setUser({
        name: name.trim(),
        nationality,
        arrivalDate,
        university: universityInput.trim() || "My University",
      });
      storage.setOnboarded();
    } catch { /* ignore */ }
    await new Promise((r) => setTimeout(r, 1200));
    router.push("/dashboard");
  };

  const filteredUnis = universities.filter((u) =>
    u.toLowerCase().includes(universityInput.toLowerCase())
  );

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  /* ── FINISH SCREEN ─────────────────────────────────── */
  if (finishing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-400 to-teal-600 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-black text-white mb-3"
          >
            Bienvenue, {name.trim()}!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-emerald-100 text-base"
          >
            Your Paris journey starts now 🗼
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 flex items-center justify-center gap-2 text-emerald-200 text-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-4 h-4 border-2 border-emerald-200 border-t-transparent rounded-full"
            />
            Setting up your dashboard…
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-white">
      {/* Praise overlay */}
      <AnimatePresence>
        {showPraise && (
          <PraiseOverlay text={s.praise} onDone={handlePraiseDone} />
        )}
      </AnimatePresence>

      {/* Top gradient strip with progress */}
      <motion.div
        transition={{ duration: 0.5 }}
        className={`bg-gradient-to-br ${s.bg} px-6 pt-12 pb-8 transition-colors duration-500`}
      >
        {/* Back + progress dots */}
        <div className="flex items-center gap-4 mb-6">
          {step > 0 && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={goBack}
              className="w-9 h-9 bg-white/25 rounded-full flex items-center justify-center text-white font-bold text-lg"
            >
              ‹
            </motion.button>
          )}
          <div className="flex gap-2 flex-1">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  flex: i === step ? 3 : 1,
                  backgroundColor: i < step ? "rgba(255,255,255,0.9)" : i === step ? "#ffffff" : "rgba(255,255,255,0.3)",
                }}
                transition={{ duration: 0.35 }}
                className="h-2 rounded-full"
              />
            ))}
          </div>
          <span className="text-white/70 text-xs font-bold">{step + 1}/{TOTAL}</span>
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-5">
          <motion.div
            key={step}
            initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className={`w-24 h-24 ${s.illuBg} rounded-3xl shadow-2xl shadow-black/20 flex items-center justify-center`}
            style={{ filter: "brightness(1.15)" }}
          >
            <span className="text-5xl">{s.illustration}</span>
          </motion.div>
        </div>

        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-center"
          >
            <h1 className="text-2xl font-black text-white mb-1 leading-tight">{s.title}</h1>
            <p className="text-white/75 text-sm">{s.subtitle}</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* White card — content area */}
      <div className="flex-1 flex flex-col -mt-4 rounded-t-3xl bg-white overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
            >
              {/* ── STEP 0: Welcome ────────────────────────── */}
              {step === 0 && (
                <div className="space-y-3">
                  {[
                    { emoji: "🗓️", title: "7-Day Action Plan", desc: "Bank, SIM, CAF, CPAM, Navigo — step by step." },
                    { emoji: "💬", title: "AI Assistant", desc: "Ask anything in English. Cléo answers instantly." },
                    { emoji: "📂", title: "Document Vault", desc: "All your paperwork in one safe place." },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.12 }}
                      className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
                        {item.emoji}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                  <div className="flex items-center justify-center gap-6 pt-2">
                    {["🇫🇷", "🇮🇳", "🇧🇷", "🇨🇳", "🇺🇸", "🇲🇦"].map((flag, i) => (
                      <motion.span
                        key={flag}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.07 }}
                        className="text-2xl"
                      >
                        {flag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 1: Nationality ────────────────────── */}
              {step === 1 && (
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1 scrollbar-hide">
                  {countries.map((c) => (
                    <motion.button
                      key={c}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setNationality(c)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all font-semibold text-sm ${
                        nationality === c
                          ? `border-violet-500 bg-violet-50 text-violet-700 shadow-sm`
                          : "border-slate-100 text-slate-700 hover:border-violet-200 bg-white"
                      }`}
                    >
                      <span className="text-xl">{c.split(" ")[0]}</span>
                      <span>{c.split(" ").slice(1).join(" ")}</span>
                      {nationality === c && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto text-violet-500 font-black"
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* ── STEP 2: Arrival date ───────────────────── */}
              {step === 2 && (
                <div>
                  <div className="bg-slate-50 rounded-2xl border-2 border-slate-100 p-2 mb-4">
                    <input
                      type="date"
                      value={arrivalDate}
                      onChange={(e) => setArrivalDate(e.target.value)}
                      max={localToday}
                      className="w-full bg-transparent text-slate-800 text-lg font-bold outline-none px-3 py-3 text-center"
                    />
                  </div>
                  <AnimatePresence>
                    {arrivalDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-center"
                      >
                        <p className="text-rose-600 font-bold text-sm">
                          📅 Tracking from{" "}
                          {/* Bug fix: T00:00:00 parses as local time, not UTC midnight */}
                          {new Date(`${arrivalDate}T00:00:00`).toLocaleDateString("en-GB", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </p>
                        <p className="text-rose-400 text-xs mt-1">
                          Cléo will show you exactly what to do each day.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!arrivalDate && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {[
                        { label: "Today", value: localToday },
                        {
                          label: "Yesterday",
                          // Bug fix: use local date parts, not toISOString() (UTC)
                          value: (() => {
                            const d = new Date(Date.now() - 86400000);
                            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
                          })(),
                        },
                        {
                          label: "Last week",
                          value: (() => {
                            const d = new Date(Date.now() - 7 * 86400000);
                            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
                          })(),
                        },
                      ].map((q) => (
                        <motion.button
                          key={q.label}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => setArrivalDate(q.value)}
                          className="py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition"
                        >
                          {q.label}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 3: University ─────────────────────── */}
              {step === 3 && (
                <div>
                  {/* Main search input — hidden when "Other" mode is active */}
                  <div className={`relative mb-3 ${typingOther ? "hidden" : ""}`}>
                    <input
                      id="uni-input"
                      type="text"
                      value={universityInput}
                      onChange={(e) => { setUniversityInput(e.target.value); setShowSuggestions(true); setTypingOther(false); }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      placeholder="Type your university name…"
                      autoComplete="off"
                      className="w-full border-2 border-slate-200 focus:border-amber-400 rounded-2xl px-4 py-4 text-slate-800 font-semibold text-base outline-none transition placeholder:text-slate-300 placeholder:font-normal"
                    />
                    {universityInput && (
                      <button
                        onClick={() => { setUniversityInput(""); setShowSuggestions(false); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 text-lg"
                      >
                        ×
                      </button>
                    )}
                    <AnimatePresence>
                      {showSuggestions && universityInput.length > 0 && filteredUnis.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-10 overflow-hidden"
                        >
                          {filteredUnis.slice(0, 5).map((u) => (
                            <button
                              key={u}
                              onMouseDown={() => { setUniversityInput(u); setShowSuggestions(false); }}
                              className="w-full text-left px-4 py-3.5 text-sm font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition border-b border-slate-50 last:border-0 flex items-center gap-2"
                            >
                              <span>🎓</span> {u}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Popular picks + Other */}
                  {/* Bug fix: was !universityInput — hid the Other input as soon as user typed anything */}
                  {(!universityInput || typingOther) && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5">
                        Popular choices
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {universities.slice(0, 6).map((u) => (
                          <motion.button
                            key={u}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => {
                              setUniversityInput(u);
                              setTypingOther(false);
                            }}
                            className="text-xs bg-amber-50 border border-amber-100 text-amber-700 font-semibold px-3 py-2 rounded-xl hover:bg-amber-100 transition"
                          >
                            {u.split(" ").slice(0, 2).join(" ")}
                          </motion.button>
                        ))}

                        {/* Other chip */}
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          onClick={() => {
                            setTypingOther(true);
                            setUniversityInput("");
                            // Bug fix: was targeting "uni-input" which is the hidden main input
                            setTimeout(() => {
                              document.getElementById("uni-other-input")?.focus();
                            }, 100);
                          }}
                          className={`text-xs border font-semibold px-3 py-2 rounded-xl transition ${
                            typingOther
                              ? "bg-slate-800 border-slate-800 text-white"
                              : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          ✏️ Other / Not listed
                        </motion.button>
                      </div>

                      {/* Other — type-your-own prompt */}
                      <AnimatePresence>
                        {typingOther && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 overflow-hidden"
                          >
                            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
                              <p className="text-xs font-bold text-slate-500 mb-2">
                                🎓 Type your school name below — any university in Paris works
                              </p>
                              <input
                                id="uni-other-input"
                                type="text"
                                value={universityInput}
                                onChange={(e) => setUniversityInput(e.target.value)}
                                placeholder="e.g. Paris School of Business, IESEG, EDHEC…"
                                autoComplete="off"
                                className="w-full bg-white border-2 border-slate-200 focus:border-amber-400 rounded-xl px-4 py-3 text-slate-800 font-semibold text-sm outline-none transition placeholder:text-slate-300 placeholder:font-normal"
                              />
                              {universityInput.trim() && (
                                <p className="text-xs text-amber-600 font-semibold mt-2">
                                  ✓ &ldquo;{universityInput.trim()}&rdquo; will be saved
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <AnimatePresence>
                    {universityInput.trim() && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-center gap-2"
                      >
                        <span className="text-xl">🎓</span>
                        <p className="text-amber-700 font-bold text-sm">{universityInput.trim()}</p>
                        <span className="ml-auto text-amber-500 font-black text-lg">✓</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ── STEP 4: Name ───────────────────────────── */}
              {step === 4 && (
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your first name"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && canProceed() && advance()}
                    className="w-full border-2 border-slate-200 focus:border-emerald-400 rounded-2xl px-4 py-4 text-slate-800 font-bold text-xl outline-none transition placeholder:text-slate-300 placeholder:font-normal text-center mb-4"
                  />
                  <AnimatePresence>
                    {name.trim() && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-5 text-center"
                      >
                        <motion.div
                          animate={{ rotate: [0, -10, 10, 0] }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="text-4xl mb-2"
                        >
                          👋
                        </motion.div>
                        <p className="text-2xl font-black text-emerald-700 mb-1">
                          Bonjour, {name.trim()}!
                        </p>
                        <p className="text-emerald-500 text-sm">
                          Cléo is ready to be your Paris guide 🗼
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom CTA — Duolingo style with 3D shadow */}
        <div className="px-6 pb-10 pt-3 bg-white">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97, y: 3, boxShadow: `0 2px 0 ${s.btnShadow}` }}
            onClick={advance}
            disabled={!canProceed()}
            style={{ boxShadow: canProceed() ? `0 5px 0 ${s.btnShadow}` : "none" }}
            className={`w-full ${s.btn} text-white font-black text-lg py-4 rounded-2xl transition-all disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none`}
          >
            {step === 0
              ? "LET'S GO! 🚀"
              : step === TOTAL - 1
              ? "START MY JOURNEY ✨"
              : "CONTINUE →"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
