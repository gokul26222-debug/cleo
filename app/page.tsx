"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { storage } from "@/lib/storage";

const features = [
  { emoji: "🏦", label: "Bank account",     bg: "bg-green-50  border-green-200  text-green-700"  },
  { emoji: "🏠", label: "CAF housing aid",  bg: "bg-orange-50 border-orange-200 text-orange-700" },
  { emoji: "🏥", label: "Health insurance", bg: "bg-blue-50   border-blue-200   text-blue-700"   },
  { emoji: "🚇", label: "Transport pass",   bg: "bg-purple-50 border-purple-200 text-purple-700" },
  { emoji: "📱", label: "Phone plan",       bg: "bg-amber-50  border-amber-200  text-amber-700"  },
  { emoji: "🎓", label: "Uni registration", bg: "bg-rose-50   border-rose-200   text-rose-700"   },
];

const testimonials = [
  { name: "Priya", flag: "🇮🇳", text: "Got my CAF set up in week 1. Saving €180/month!" },
  { name: "Lucas", flag: "🇧🇷", text: "Bank account open in 2 hours. Magnifique!" },
  { name: "Yuna",  flag: "🇰🇷", text: "The French phrases actually worked 😂" },
];

const JOURNEY_NODES = [
  { emoji: "📱", label: "SIM" },
  { emoji: "🏦", label: "Bank" },
  { emoji: "🏥", label: "CPAM" },
  { emoji: "🏠", label: "CAF" },
  { emoji: "🚇", label: "Navigo" },
  { emoji: "🎓", label: "Uni" },
  { emoji: "🏆", label: "Done!" },
];

export default function LandingPage() {
  const router = useRouter();
  const [isReturning, setIsReturning] = useState(false);
  const [tIdx, setTIdx] = useState(0);
  const [mascotTaps, setMascotTaps] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);

  useEffect(() => {
    setIsReturning(storage.isOnboarded());
    const t = setInterval(() => setTIdx(i => (i + 1) % testimonials.length), 3200);
    return () => clearInterval(t);
  }, []);

  const handleMascotTap = () => {
    const next = mascotTaps + 1;
    setMascotTaps(next);
    if (next >= 5) {
      setEasterEgg(true);
      setMascotTaps(0);
      setTimeout(() => setEasterEgg(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Easter egg overlay */}
      <AnimatePresence>
        {easterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setEasterEgg(false)}
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 0], y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: 3 }}
              className="bg-white rounded-3xl p-8 text-center shadow-2xl mx-6"
            >
              <div className="text-6xl mb-3">🥐</div>
              <p className="text-2xl font-black text-slate-900 mb-1">Félicitations!</p>
              <p className="text-slate-500 text-sm">You found the secret! 🥚</p>
              <p className="text-[#58cc02] font-bold text-base mt-2">«Bienvenue à Paris!»</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAV */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 animate-fade-in">
        <span className="text-2xl font-black text-[#58cc02] tracking-tight">Cléo</span>
        {isReturning && (
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm font-bold text-[#58cc02] bg-green-50 border-2 border-green-200 px-4 py-1.5 rounded-full hover:bg-green-100 transition"
          >
            My Dashboard →
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-2 pb-8 max-w-lg mx-auto w-full">

        {/* Mascot — tap 5× for easter egg */}
        <div className="animate-fade-up text-center mb-5">
          <div className="relative inline-block mb-4">
            <motion.button
              onClick={handleMascotTap}
              whileTap={{ scale: 0.9, rotate: -10 }}
              className="animate-float w-28 h-28 bg-[#58cc02] rounded-[2.5rem] flex items-center justify-center shadow-xl mx-auto"
              style={{ boxShadow: "0 8px 0 #46a302" }}
            >
              <span className="text-6xl">🗼</span>
            </motion.button>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              className="absolute -top-3 -right-6 bg-white rounded-2xl rounded-bl-sm px-3 py-1.5 shadow-lg border-2 border-slate-100"
            >
              <span className="text-sm font-black text-slate-700">Bonjour! 👋</span>
            </motion.div>
            {mascotTaps > 0 && mascotTaps < 5 && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#58cc02] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {5 - mascotTaps} more…
              </div>
            )}
          </div>

          <h1 className="text-4xl font-black text-slate-900 leading-tight mb-3 tracking-tight">
            Navigate Paris<br />
            <span className="text-[#58cc02]">like a local.</span>
          </h1>
          <p className="text-slate-500 text-base leading-relaxed max-w-xs mx-auto">
            Your 7-day AI guide to everything international students need — no French required.
          </p>
        </div>

        {/* Journey preview */}
        <div className="animate-fade-up delay-100 w-full bg-slate-50 rounded-2xl border-2 border-slate-100 p-4 mb-5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Your 7-day journey</p>
          <div className="flex items-center justify-between">
            {JOURNEY_NODES.map((node, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 ${
                    i === 0
                      ? "bg-[#58cc02] border-[#46a302] shadow-sm"
                      : i === 6
                      ? "bg-amber-100 border-amber-300"
                      : "bg-white border-slate-200"
                  }`}>
                    {node.emoji}
                  </div>
                  <span className={`text-[9px] font-bold ${i === 0 ? "text-[#58cc02]" : "text-slate-400"}`}>
                    {node.label}
                  </span>
                </div>
                {i < 6 && <div className="w-3 h-0.5 bg-slate-200 mb-3 mx-0.5" />}
              </div>
            ))}
          </div>
        </div>

        {/* Feature chips */}
        <div className="animate-fade-up delay-200 flex flex-wrap justify-center gap-2 mb-5">
          {features.map(f => (
            <span key={f.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${f.bg}`}>
              {f.emoji} {f.label}
            </span>
          ))}
        </div>

        {/* Testimonial rotator */}
        <div className="animate-fade-up delay-300 w-full bg-white rounded-2xl p-4 border-2 border-slate-100 mb-4 min-h-[76px] flex items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={tIdx}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 w-full"
            >
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-2xl flex-shrink-0 border-2 border-green-100">
                {testimonials[tIdx].flag}
              </div>
              <div>
                <p className="text-slate-700 text-sm font-medium leading-snug">
                  &ldquo;{testimonials[tIdx].text}&rdquo;
                </p>
                <p className="text-slate-400 text-xs mt-0.5 font-bold">— {testimonials[tIdx].name}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex gap-1.5 mb-7">
          {testimonials.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === tIdx ? "w-5 bg-[#58cc02]" : "w-1.5 bg-slate-200"}`} />
          ))}
        </div>

        {/* CTA */}
        <div className="animate-fade-up delay-400 w-full space-y-3">
          <motion.button
            whileTap={{ scale: 0.97, y: 3 }}
            onClick={() => router.push("/onboarding")}
            className="w-full bg-[#58cc02] text-white font-black text-lg py-4 rounded-2xl transition-colors btn-3d"
          >
            GET STARTED — FREE ✨
          </motion.button>

          {isReturning && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/dashboard")}
              className="w-full border-2 border-slate-200 text-slate-700 font-bold text-base py-3.5 rounded-2xl hover:bg-slate-50 transition btn-3d-slate"
            >
              Continue where I left off →
            </motion.button>
          )}

          <p className="text-center text-xs text-slate-400 font-medium pt-1">
            No sign-up · No backend · 100% free
          </p>
        </div>
      </div>
    </div>
  );
}
