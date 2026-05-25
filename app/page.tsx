"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { storage } from "@/lib/storage";

const features = [
  { emoji: "🏦", label: "Bank account",     color: "bg-blue-100   text-blue-700"   },
  { emoji: "🏠", label: "CAF housing aid",  color: "bg-rose-100   text-rose-700"   },
  { emoji: "🏥", label: "Health insurance", color: "bg-green-100  text-green-700"  },
  { emoji: "🚇", label: "Transport pass",   color: "bg-violet-100 text-violet-700" },
  { emoji: "📱", label: "Phone plan",       color: "bg-amber-100  text-amber-700"  },
  { emoji: "🎓", label: "Uni registration", color: "bg-sky-100    text-sky-700"    },
];

const testimonials = [
  { name: "Priya", flag: "🇮🇳", text: "Got my CAF set up in week 1. Saving €180/month!" },
  { name: "Lucas", flag: "🇧🇷", text: "Bank account open in 2 hours. Magnifique!" },
  { name: "Yuna",  flag: "🇰🇷", text: "The French phrases actually worked 😂" },
];

export default function LandingPage() {
  const router = useRouter();
  const [isReturning, setIsReturning] = useState(false);
  const [tIdx, setTIdx] = useState(0);

  useEffect(() => {
    setIsReturning(storage.isOnboarded());
    const t = setInterval(() => setTIdx(i => (i + 1) % testimonials.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f9ff]">

      {/* ── NAV ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 animate-fade-in">
        <span className="text-2xl font-black text-sky-600 tracking-tight">Cléo</span>
        {isReturning && (
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm font-bold text-sky-600 bg-sky-100 px-4 py-2 rounded-full hover:bg-sky-200 transition"
          >
            My Dashboard →
          </button>
        )}
      </div>

      {/* ── HERO ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center px-6 pt-2 pb-8 max-w-lg mx-auto w-full">

        {/* Mascot */}
        <div className="animate-fade-up text-center mb-5">
          <div className="relative inline-block mb-4">
            <div className="animate-float w-32 h-32 bg-gradient-to-br from-sky-400 to-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-sky-200 mx-auto animate-tilt-3d">
              <span className="text-6xl">🗼</span>
            </div>
            {/* Speech bubble */}
            <div className="animate-pop delay-300 absolute -top-3 -right-6 bg-white rounded-2xl rounded-bl-sm px-3 py-1.5 shadow-lg border border-slate-100">
              <span className="text-sm font-bold text-slate-700">Bonjour! 👋</span>
            </div>
          </div>

          <h1 className="text-4xl font-black text-slate-900 leading-tight mb-3 tracking-tight">
            Navigate Paris<br />
            <span className="gradient-text">like a local.</span>
          </h1>
          <p className="text-slate-500 text-base leading-relaxed max-w-xs mx-auto">
            Your 7-day AI guide to everything international students need — no French required.
          </p>
        </div>

        {/* Feature chips */}
        <div className="animate-fade-up delay-200 flex flex-wrap justify-center gap-2 mb-6">
          {features.map(f => (
            <span key={f.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${f.color}`}>
              {f.emoji} {f.label}
            </span>
          ))}
        </div>

        {/* Testimonial rotator */}
        <div className="animate-fade-up delay-300 w-full glass rounded-2xl p-4 shadow-sm mb-5 min-h-[76px] flex items-center overflow-hidden card-3d">
          <AnimatePresence mode="wait">
            <motion.div
              key={tIdx}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 w-full"
            >
              <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                {testimonials[tIdx].flag}
              </div>
              <div>
                <p className="text-slate-700 text-sm font-medium leading-snug">
                  &ldquo;{testimonials[tIdx].text}&rdquo;
                </p>
                <p className="text-slate-400 text-xs mt-0.5 font-semibold">
                  — {testimonials[tIdx].name}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex gap-1.5 mb-8">
          {testimonials.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === tIdx ? "w-5 bg-sky-500" : "w-1.5 bg-slate-200"}`} />
          ))}
        </div>

        {/* CTA */}
        <div className="animate-fade-up delay-400 w-full space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97, y: 3 }}
            onClick={() => router.push("/onboarding")}
            className="w-full bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-black text-lg py-4 rounded-2xl transition-colors btn-3d animate-glow"
            style={{ boxShadow: "0 5px 0 #0284c7" }}
          >
            GET STARTED — FREE ✨
          </motion.button>

          {isReturning && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/dashboard")}
              className="w-full border-2 border-sky-200 text-sky-600 font-bold text-base py-3.5 rounded-2xl hover:bg-sky-50 transition"
            >
              Continue where I left off →
            </motion.button>
          )}

          <p className="text-center text-xs text-slate-400 font-medium pt-1 animate-shimmer bg-gradient-to-r from-slate-400 via-sky-400 to-slate-400 bg-clip-text" style={{ WebkitTextFillColor: "transparent", backgroundSize: "200% 100%" }}>
            No sign-up · No backend · 100% free
          </p>
        </div>

      </div>
    </div>
  );
}
