"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { checklistData, ChecklistDay } from "@/lib/data";
import { storage, ChecklistProgress } from "@/lib/storage";

function Confetti({ active }: { active: boolean }) {
  const colors = ["#0ea5e9", "#22c55e", "#f59e0b", "#a855f7", "#ef4444", "#06b6d4"];
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2.5 h-2.5 rounded-sm"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: "-10px",
            backgroundColor: colors[i % colors.length],
            rotate: Math.random() * 360,
          }}
          animate={{
            y: ["0vh", "105vh"],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2.5 + Math.random() * 1.5,
            delay: Math.random() * 0.8,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

function ChecklistContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDay = parseInt(searchParams.get("day") ?? "1", 10);
  const [selectedDay, setSelectedDay] = useState(
    Math.min(Math.max(isNaN(initialDay) ? 1 : initialDay, 1), 7)
  );
  const [progress, setProgress] = useState<ChecklistProgress>({});
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [justCompleted, setJustCompleted] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const prevDone = useRef(false);
  // Bug fix #9: store timer refs to clear on unmount, preventing setState on unmounted component
  const confettiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkedTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (confettiTimer.current) clearTimeout(confettiTimer.current);
    if (checkedTimer.current)  clearTimeout(checkedTimer.current);
  }, []);

  useEffect(() => {
    if (!storage.isOnboarded()) {
      router.replace("/");
      return;
    }
    setProgress(storage.getProgress());
  }, [router]);

  const day: ChecklistDay | undefined = checklistData[selectedDay - 1];

  const dayKey = `day${selectedDay}`;
  const completedSteps = progress[dayKey] ?? [];
  const allDone = day ? completedSteps.length >= day.steps.length : false;

  // Trigger confetti when day flips to complete — must be before any early return
  useEffect(() => {
    if (allDone && !prevDone.current) {
      setJustCompleted(true);
      confettiTimer.current = setTimeout(() => setJustCompleted(false), 3500);
    }
    prevDone.current = allDone;
  }, [allDone]);

  if (!day) return null;

  const toggleStep = (stepId: string) => {
    const updated = storage.toggleStep(selectedDay, stepId);
    setProgress({ ...updated });
    setLastChecked(stepId);
    checkedTimer.current = setTimeout(() => setLastChecked(null), 600);
  };

  const isDayComplete = (dayNum: number) => {
    const d = checklistData[dayNum - 1];
    if (!d) return false;
    const key = `day${dayNum}`;
    return (progress[key]?.length ?? 0) >= d.steps.length;
  };

  return (
    <div className="min-h-screen bg-white pb-28">
      <Confetti active={justCompleted} />

      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 border-b border-slate-100 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-4">7-Day Checklist</h1>

        {/* Day selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {checklistData.map((d) => {
            const done = isDayComplete(d.day);
            const active = selectedDay === d.day;
            return (
              <motion.button
                key={d.day}
                whileTap={{ scale: 0.94 }}
                onClick={() => setSelectedDay(d.day)}
                className={`flex-shrink-0 flex flex-col items-center px-3.5 py-2.5 rounded-2xl border-2 transition-all ${
                  active
                    ? "border-[#58cc02] bg-green-50 shadow-sm"
                    : done
                    ? "border-green-200 bg-green-50"
                    : "border-slate-100 bg-white"
                }`}
              >
                <span className="text-lg">{done ? "✅" : d.emoji}</span>
                <span className={`text-[11px] font-bold mt-0.5 ${
                  active ? "text-[#58cc02]" : done ? "text-green-600" : "text-slate-400"
                }`}>
                  Day {d.day}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-5 max-w-lg mx-auto space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {/* Day info card */}
            <div className={`rounded-2xl p-5 border shadow-sm mb-4 ${
              allDone ? "bg-green-50 border-green-200" : "bg-white border-slate-100"
            }`}>
              <div className="flex items-start gap-3">
                <motion.span
                  animate={{ rotate: [0, -6, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="text-4xl flex-shrink-0"
                >
                  {allDone ? "🎉" : day.emoji}
                </motion.span>
                <div className="flex-1">
                  <div className="text-xs text-slate-400 font-medium mb-0.5">
                    Day {day.day} · ⏱ {day.estimatedTime}
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mb-1">{day.title}</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">{day.description}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>{allDone ? "✅ All done!" : "Progress"}</span>
                  <span className="font-bold">{completedSteps.length}/{day.steps.length}</span>
                </div>
                <div className="bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${allDone ? "bg-green-500" : "bg-[#58cc02]"}`}
                    animate={{ width: `${(completedSteps.length / day.steps.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              {day.steps.map((step, idx) => {
                const done = completedSteps.includes(step.id);
                const expanded = expandedStep === step.id;
                const justDone = lastChecked === step.id && done;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`bg-white rounded-2xl border-2 overflow-hidden transition-all shadow-sm ${
                      done ? "border-green-200" : "border-slate-100"
                    }`}
                  >
                    <div className="flex items-start gap-3 p-4">
                      {/* Checkbox */}
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => toggleStep(step.id)}
                        className="mt-0.5 flex-shrink-0"
                      >
                        <motion.div
                          animate={{
                            backgroundColor: done ? "#22c55e" : "#ffffff",
                            borderColor: done ? "#22c55e" : "#cbd5e1",
                            scale: justDone ? [1, 1.4, 0.9, 1.1, 1] : 1,
                          }}
                          transition={{ duration: justDone ? 0.5 : 0.2 }}
                          className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                        >
                          <AnimatePresence>
                            {done && (
                              <motion.svg
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="w-3.5 h-3.5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </motion.svg>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </motion.button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <button onClick={() => setExpandedStep(expanded ? null : step.id)} className="text-left w-full">
                          <p className={`font-semibold text-sm leading-snug transition-all ${
                            done ? "line-through text-slate-400" : "text-slate-800"
                          }`}>
                            {step.text}
                          </p>
                        </button>
                        <AnimatePresence>
                          {expanded && step.detail && (
                            <motion.p
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="text-xs text-slate-500 leading-relaxed mt-2 overflow-hidden"
                            >
                              {step.detail}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Expand toggle */}
                      {step.detail && (
                        <button
                          onClick={() => setExpandedStep(expanded ? null : step.id)}
                          className="text-slate-300 hover:text-sky-400 transition flex-shrink-0 p-0.5"
                        >
                          <motion.svg
                            animate={{ rotate: expanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </motion.svg>
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* French phrases */}
            {day.frenchPhrases.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4"
              >
                <h3 className="font-bold text-blue-800 text-sm mb-3 flex items-center gap-2">
                  🇫🇷 Useful French Phrases
                </h3>
                <div className="space-y-2.5">
                  {day.frenchPhrases.map((phrase, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-blue-50">
                      <p className="font-bold text-slate-800 text-sm">&ldquo;{phrase.french}&rdquo;</p>
                      <p className="text-xs text-slate-400 italic mt-0.5">{phrase.pronunciation}</p>
                      <p className="text-xs text-blue-600 font-medium mt-0.5">{phrase.english}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tips */}
            {day.tips.length > 0 && (
              <div className="mt-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <h3 className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-1.5">
                  💡 Pro Tips
                </h3>
                <ul className="space-y-1.5">
                  {day.tips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-xs text-amber-700 leading-relaxed">
                      <span className="flex-shrink-0 text-amber-400">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ask AI button */}
            <Link href={`/chat?q=${encodeURIComponent(`Help me with Day ${selectedDay}: ${day.title}`)}`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="mt-4 w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-green-100 flex items-center justify-center gap-2 transition"
              >
                <span>💬</span> Ask Cléo about {day.title}
              </motion.button>
            </Link>

            {/* Day complete CTA */}
            <AnimatePresence>
              {allDone && selectedDay < 7 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white text-center shadow-xl shadow-green-100"
                >
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="font-extrabold text-lg mb-1">Day {selectedDay} complete!</p>
                  <p className="text-green-100 text-sm mb-3">Amazing work. Ready for day {selectedDay + 1}?</p>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedDay((d) => Math.min(d + 1, 7))}
                    className="bg-white text-green-700 font-bold px-6 py-2.5 rounded-xl hover:bg-green-50 transition text-sm shadow-sm"
                  >
                    Start Day {selectedDay + 1} →
                  </motion.button>
                </motion.div>
              )}
              {allDone && selectedDay === 7 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 bg-gradient-to-br from-[#58cc02] to-emerald-500 rounded-2xl p-6 text-white text-center shadow-xl"
                >
                  <div className="text-4xl mb-2">🏆</div>
                  <p className="font-extrabold text-xl mb-1">Setup Complete!</p>
                  <p className="text-sky-100 text-sm">
                    You&apos;ve navigated the famous French bureaucracy like a pro. Paris is yours!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}

export default function ChecklistPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-slate-400 text-sm"
          >
            Loading checklist…
          </motion.div>
        </div>
      }
    >
      <ChecklistContent />
    </Suspense>
  );
}
