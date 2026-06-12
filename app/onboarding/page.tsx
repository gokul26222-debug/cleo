"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { storage } from "@/lib/storage";

type Step = 0 | 1;
const TOTAL = 2;

/* ── per-step visual config ─────────────────────────── */
const STEPS = [
  {
    bg: "from-metro to-metro-dark",
    btn: "bg-metro hover:bg-metro-light",
    btnShadow: "#002B77",
    illustration: "🚇",
    illuBg: "bg-gradient-to-br from-metro-light to-metro",
    title: "Welcome aboard!",
    subtitle: "Your métro line through Paris admin — 7 stops, your pace.",
    praise: "",
  },
  {
    bg: "from-metro to-metro-dark",
    btn: "bg-ticket hover:bg-ticket-dark text-metro-dark",
    btnShadow: "#E0B400",
    illustration: "🎫",
    illuBg: "bg-gradient-to-br from-ticket to-ticket-dark",
    title: "Get your ticket!",
    subtitle: "What name should we print on it?",
    praise: "Parfait! 🎫",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [direction, setDirection] = useState(1);
  const [finishing, setFinishing] = useState(false);
  const [name, setName] = useState("");

  const s = STEPS[step] ?? STEPS[0];

  const canProceed = () => {
    if (step === 1) return name.trim() !== "";
    return true;
  };

  const advance = () => {
    if (step < TOTAL - 1) {
      setDirection(1);
      setStep((s) => (s + 1) as Step);
    } else {
      handleFinish();
    }
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
        nationality: "International Student",
        university: "Paris University",
      });
      storage.setOnboarded();
    } catch { /* ignore */ }
    await new Promise((r) => setTimeout(r, 1600));
    router.push("/dashboard");
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  /* ── FINISH SCREEN: ticket stamped, train departs ──── */
  if (finishing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-metro to-metro-dark flex flex-col items-center justify-center px-6 overflow-hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="text-center"
        >
          {/* Stamped ticket */}
          <motion.div
            initial={{ rotate: -6 }}
            animate={{ rotate: [-6, 3, -2, 0] }}
            transition={{ duration: 0.7 }}
            className="bg-ticket rounded-2xl px-8 py-5 shadow-2xl mb-8 relative mx-auto w-fit"
          >
            <p className="text-metro-dark font-black text-lg tracking-widest uppercase">Cléo Pass</p>
            <p className="text-metro font-bold text-sm mt-0.5">{name.trim()} · 7 stops</p>
            <motion.div
              initial={{ scale: 2.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 12 }}
              className="absolute -right-3 -top-3 bg-white rounded-full w-12 h-12 flex items-center justify-center border-4 border-metro rotate-12 text-xl"
            >
              ✅
            </motion.div>
          </motion.div>

          {/* Train departs across the screen */}
          <motion.div
            initial={{ x: "-60vw" }}
            animate={{ x: "60vw" }}
            transition={{ delay: 0.8, duration: 1.2, ease: "easeIn" }}
            className="text-6xl mb-6"
          >
            🚇
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
            className="text-white/70 text-base"
          >
            Next stop: settled in Paris 🗼
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-white">
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
                  backgroundColor: i < step ? "rgba(255,205,0,0.9)" : i === step ? "#FFCD00" : "rgba(255,255,255,0.3)",
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
            style={{ filter: "brightness(1.1)" }}
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
                    { emoji: "🚇", title: "7-Stop Journey", desc: "Bank, SIM, CAF, CPAM, Navigo — one stop at a time, at YOUR pace." },
                    { emoji: "💬", title: "AI Assistant", desc: "Ask anything in English. Cleo answers instantly." },
                    { emoji: "📂", title: "Document Vault", desc: "All your paperwork in one safe place." },
                    { emoji: "📅", title: "Appointment Tracker", desc: "Book & manage all your service appointments." },
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
                  <div className="bg-metro-tint border border-metro/10 rounded-2xl p-3 text-center">
                    <p className="text-metro text-xs font-semibold">
                      Arrived last week? Last month? No stress — your journey starts when YOU do. 🚉
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-6 pt-1">
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

              {/* ── STEP 1: Name ───────────────────────────── */}
              {step === 1 && (
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your first name"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && canProceed() && advance()}
                    className="w-full border-2 border-slate-200 focus:border-metro rounded-2xl px-4 py-4 text-slate-800 font-bold text-xl outline-none transition placeholder:text-slate-300 placeholder:font-normal text-center mb-4"
                  />
                  <AnimatePresence>
                    {name.trim() && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 12, rotate: -3 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotate: -1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="bg-ticket border-2 border-ticket-dark rounded-2xl p-5 text-center shadow-lg mx-4"
                      >
                        <p className="text-metro-dark/60 text-[10px] font-black tracking-[0.3em] uppercase mb-1">
                          ─ Cléo Pass ─
                        </p>
                        <p className="text-2xl font-black text-metro-dark mb-1">
                          {name.trim()}
                        </p>
                        <p className="text-metro text-xs font-bold">
                          Valid for 7 stops · Paris 🗼
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
            disabled={!canProceed()}
            style={{ boxShadow: canProceed() ? `0 5px 0 ${s.btnShadow}` : "none" }}
            className={`w-full ${s.btn} ${step === 1 ? "" : "text-white"} font-black text-lg py-4 rounded-2xl transition-all disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none`}
          >
            {step === 0 ? "HOP ON! 🚇" : "STAMP MY TICKET ✨"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
