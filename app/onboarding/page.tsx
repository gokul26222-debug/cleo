"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { storage } from "@/lib/storage";

type Step = 0 | 1 | 2;
const TOTAL = 3;

/* ── per-step visual config ─────────────────────────── */
const STEPS = [
  {
    bg: "from-sky-400 to-blue-600",
    btn: "bg-sky-500 hover:bg-sky-400",
    btnShadow: "#0284c7",
    illustration: "🗼",
    illuBg: "bg-gradient-to-br from-sky-400 to-blue-600",
    title: "Welcome to Cleo!",
    subtitle: "Your personal guide to surviving Paris admin.",
    praise: "",
  },
  {
    bg: "from-rose-400 to-pink-600",
    btn: "bg-rose-500 hover:bg-rose-400",
    btnShadow: "#be185d",
    illustration: "📅",
    illuBg: "bg-gradient-to-br from-rose-400 to-pink-600",
    title: "When did you arrive?",
    subtitle: "We'll track your 7-day progress from this date.",
    praise: "Parfait! 📅",
  },
  {
    bg: "from-emerald-400 to-teal-600",
    btn: "bg-emerald-500 hover:bg-emerald-400",
    btnShadow: "#065f46",
    illustration: "✨",
    illuBg: "bg-gradient-to-br from-emerald-400 to-teal-600",
    title: "Last step!",
    subtitle: "What should Cleo call you?",
    praise: "Incroyable! ✨",
  },
];

/* ── Praise overlay ─────────────────────────────────────
   Driven by a plain timer — fires exactly once, cancels on
   unmount. No animation callbacks, no ref guards needed.    */
const PRAISE_MS = 800;

function PraiseOverlay({ text, onDone }: { text: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, PRAISE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        className="bg-white rounded-3xl px-10 py-8 shadow-2xl text-center"
      >
        <p className="text-3xl font-black text-slate-900">{text}</p>
      </motion.div>
    </motion.div>
  );
}

/* ── date helpers ────────────────────────────────────── */
function toDateString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>(0);
  const [direction, setDirection] = useState(1);
  const [showPraise, setShowPraise] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [arrivalDate, setArrivalDate] = useState("");
  const [name, setName] = useState("");

  /* Prevent flash: render nothing until we know if user is new or returning */
  useEffect(() => {
    if (storage.isOnboarded()) {
      router.replace("/dashboard");
    } else {
      setMounted(true);
    }
  }, [router]);

  const today = useMemo(() => toDateString(new Date()), []);

  const s = STEPS[step] ?? STEPS[0];

  /* Derived — not a function, so it's evaluated once per render */
  const canProceed =
    step === 1 ? arrivalDate !== "" :
    step === 2 ? name.trim() !== "" :
    true;

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
    setShowPraise(false); // safety: clear any stuck overlay
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0) as Step);
  };

  const handleFinish = async () => {
    setFinishing(true);

    /* Both writes must succeed — if either fails (storage full / blocked)
       we surface the error instead of silently redirecting to a broken dashboard. */
    const saved =
      storage.setUser({
        name: name.trim(),
        nationality: "International Student",
        arrivalDate,
        university: "Paris University",
      }) && storage.setOnboarded();

    if (!saved) {
      setFinishing(false);
      alert(
        "Couldn't save your profile — please check that your browser allows site data, then try again."
      );
      return;
    }

    await new Promise((r) => setTimeout(r, 1200));
    router.push("/dashboard");
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
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
            Setting up your dashboard...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  /* Render nothing while we check localStorage — prevents flash for returning users */
  if (!mounted) return null;

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
        {/* Back + progress bar */}
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
                  backgroundColor:
                    i < step  ? "rgba(255,255,255,0.9)" :
                    i === step ? "#ffffff" :
                                 "rgba(255,255,255,0.3)",
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
                    { emoji: "🗓️", title: "7-Day Action Plan",    desc: "Bank, SIM, CAF, CPAM, Navigo — step by step." },
                    { emoji: "💬", title: "AI Assistant",          desc: "Ask anything in English. Cleo answers instantly." },
                    { emoji: "📂", title: "Document Vault",        desc: "All your paperwork in one safe place." },
                    { emoji: "📅", title: "Appointment Tracker",   desc: "Book & manage all your service appointments." },
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

              {/* ── STEP 1: Arrival date ───────────────────── */}
              {step === 1 && (
                <div>
                  <div className="bg-slate-50 rounded-2xl border-2 border-slate-100 p-2 mb-4">
                    <input
                      type="date"
                      value={arrivalDate}
                      onChange={(e) => setArrivalDate(e.target.value)}
                      max={today}
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
                          {new Date(`${arrivalDate}T00:00:00`).toLocaleDateString("en-GB", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </p>
                        <p className="text-rose-400 text-xs mt-1">
                          Cleo will show you exactly what to do each day.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ── STEP 2: Name ───────────────────────────── */}
              {step === 2 && (
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your first name"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && canProceed && advance()}
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
                          Cleo is ready to be your Paris guide 🗼
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <div className="px-6 pb-10 pt-3 bg-white">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97, y: 3, boxShadow: `0 2px 0 ${s.btnShadow}` }}
            onClick={advance}
            disabled={!canProceed}
            style={{ boxShadow: canProceed ? `0 5px 0 ${s.btnShadow}` : "none" }}
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
