"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import { storage, UserProfile, ChecklistProgress } from "@/lib/storage";
import { checklistData } from "@/lib/data";
import { Appointment, getTypeById, getDaysUntil } from "@/lib/appointments";

const MOTIVATIONAL = [
  "Every step counts. You're doing great! 💪",
  "Paris is becoming home, one task at a time. 🇫🇷",
  "Courage! You can do this. 🏆",
  "You're doing amazing — keep going! ⭐",
  "Almost there — keep pushing forward! 🗼",
];

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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [completedDays, setCompletedDays] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [nextAppt, setNextAppt] = useState<Appointment | null>(null);
  const [view, setView] = useState<"overview" | "checklist">("overview");
  const [selectedDay, setSelectedDay] = useState(1);
  const [progress, setProgress] = useState<ChecklistProgress>({});
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [justCompleted, setJustCompleted] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const prevDone = useRef(false);
  const confettiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (confettiTimer.current) clearTimeout(confettiTimer.current);
      if (checkedTimer.current) clearTimeout(checkedTimer.current);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    if (!storage.isOnboarded()) {
      router.replace("/");
      return;
    }
    const u = storage.getUser();
    if (!u) {
      router.replace("/");
      return;
    }
    setUser(u);

    const stepsPerDay = checklistData.map((d) => d.steps.length);
    const done = storage.getCompletedDays(stepsPerDay);
    setCompletedDays(done);

    // Next appointment
    const appts = storage.getAppointments()
      .filter((a) => a.status === "upcoming")
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    setNextAppt(appts[0] ?? null);

    const p = storage.getProgress();
    setProgress(p);
    let cd = 1;
    for (let i = 0; i < checklistData.length; i++) {
      const key = `day${i + 1}`;
      const completed = p[key]?.length ?? 0;
      if (completed < checklistData[i].steps.length) {
        cd = i + 1;
        break;
      }
      cd = 7;
    }
    setCurrentDay(cd);
  }, [router]);

  // Checklist helpers
  const isDayComplete = (dayNum: number) => {
    const d = checklistData[dayNum - 1];
    if (!d) return false;
    const key = `day${dayNum}`;
    return (progress[key]?.length ?? 0) >= d.steps.length;
  };

  const toggleStep = (stepId: string) => {
    const updated = storage.toggleStep(selectedDay, stepId);
    setProgress({ ...updated });
    setLastChecked(stepId);
    checkedTimer.current = setTimeout(() => setLastChecked(null), 600);
  };

  // Trigger confetti
  const dayData = checklistData[selectedDay - 1];
  const dayKey = `day${selectedDay}`;
  const completedSteps = progress[dayKey] ?? [];
  const allDone = dayData ? completedSteps.length >= dayData.steps.length : false;

  useEffect(() => {
    if (allDone && !prevDone.current) {
      setJustCompleted(true);
      confettiTimer.current = setTimeout(() => setJustCompleted(false), 3500);
    }
    prevDone.current = allDone;
  }, [allDone]);

  if (!mounted) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-4xl">🗼</div>
    </div>
  );
  if (!user) return null;

  const firstName = user.name.split(" ")[0];
  const progressPct = Math.round((completedDays / 7) * 100);
  const today = checklistData[currentDay - 1];
  const dayProgress = progress[`day${currentDay}`]?.length ?? 0;
  const dayTotal = today?.steps.length ?? 0;

  const quickActions = [
    {
      label: "Ask Cleo AI",
      emoji: "💬",
      href: "/chat",
      bg: "bg-violet-500",
      shadow: "shadow-violet-200",
      desc: "AI assistant",
    },
    {
      label: "Explore Paris",
      emoji: "🗺️",
      href: "/explore",
      bg: "bg-orange-500",
      shadow: "shadow-orange-200",
      desc: "Free spots",
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-28">
      <Confetti active={justCompleted} />

      {/* Header with View Toggle */}
      <div className="bg-white border-b border-gray-200 px-6 pt-8 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl font-bold text-slate-900">✨ Cléo</div>
          <div className="text-sm font-semibold text-slate-600">Paris Onboarding</div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex gap-2 mb-4">
          <motion.button
            onClick={() => setView("overview")}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              view === "overview"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-slate-600 hover:bg-gray-200"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🏠 Overview
          </motion.button>
          <motion.button
            onClick={() => setView("checklist")}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              view === "checklist"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-slate-600 hover:bg-gray-200"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ✅ Checklist
          </motion.button>
        </div>

        {/* Overview Header Content */}
        {view === "overview" && (
          <>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-700">
                  {completedDays === 7 ? (
                    <span>🎉 All Done!</span>
                  ) : (
                    <span>Day {currentDay} of 7</span>
                  )}
                </p>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Hello, {firstName}! 👋
              </h1>
              <p className="text-slate-600 text-sm">
                {MOTIVATIONAL[completedDays % MOTIVATIONAL.length]}
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold">Your Progress</span>
                <span className="font-semibold">{completedDays}/7 days</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </>
        )}

        {/* Checklist Header */}
        {view === "checklist" && (
          <>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-3">7-Day Checklist</h1>
            <div className="flex gap-2 overflow-x-auto pb-2">
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
                        ? "border-sky-500 bg-sky-50 shadow-sm"
                        : done
                        ? "border-green-200 bg-green-50"
                        : "border-slate-100 bg-white"
                    }`}
                  >
                    <span className="text-lg">{done ? "✅" : d.emoji}</span>
                    <span
                      className={`text-[11px] font-bold mt-0.5 ${
                        active ? "text-sky-600" : done ? "text-green-600" : "text-slate-400"
                      }`}
                    >
                      Day {d.day}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="px-5 space-y-4 max-w-lg mx-auto">
        {/* OVERVIEW VIEW */}
        {view === "overview" && (
          <>
            {/* EU Expansion Marketing Banner */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">🇪🇺</span>
                <div>
                  <p className="text-sm font-semibold text-purple-900 leading-relaxed">
                    🚀 <strong>Cléo is expanding!</strong> Coming soon to Berlin, Barcelona, Amsterdam, and more EU cities!
                  </p>
                  <p className="text-xs text-purple-700 mt-1">
                    Your trusted student assistant will help international students settle into their new European home.
                  </p>
                </div>
              </div>
            </div>

            {/* Today's task card */}
            {today && completedDays < 7 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-3">
                  📅 Today&apos;s Task - Day {currentDay}
                </p>

                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{today.emoji}</div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-slate-600">
                        {today.estimatedTime}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-slate-900">
                      {today.title}
                    </h3>

                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-semibold">Progress</span>
                        <span className="font-semibold text-slate-700">
                          {dayProgress}/{dayTotal} completed
                        </span>
                      </div>
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{ width: `${dayTotal > 0 ? (dayProgress / dayTotal) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={() => setView("checklist")}
                  className="mt-4 w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Day {currentDay} →
                </motion.button>
              </div>
            )}

            {/* All done celebration */}
            {completedDays === 7 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-5xl mb-3">🏆</div>
                <h3 className="font-bold text-xl mb-2 text-green-900">Setup Complete!</h3>
                <p className="text-green-700 text-sm">
                  You&apos;ve completed all your essential Paris onboarding tasks. Great work!
                </p>
              </div>
            )}

            {/* Quick actions */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-3">
                ⚡ Quick Access
              </p>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.href} href={action.href}>
                    <div
                      className={`${action.bg} rounded-lg p-4 text-white text-center hover:shadow-lg transition cursor-pointer h-full flex flex-col items-center justify-center`}
                    >
                      <div className="text-2xl mb-2">{action.emoji}</div>
                      <p className="text-xs font-semibold leading-tight">{action.label}</p>
                      <p className="text-[10px] mt-1 opacity-90 font-medium">{action.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming appointment widget */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase">📅 Next Appointment</p>
                <Link href="/appointments">
                  <span className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition">
                    View All →
                  </span>
                </Link>
              </div>
              {nextAppt ? (
                <Link href="/appointments">
                  <div
                    className={`${getTypeById(nextAppt.typeId).color} border ${getTypeById(nextAppt.typeId).borderColor} rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition`}
                  >
                    <span className="text-2xl">
                      {getTypeById(nextAppt.typeId).emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${getTypeById(nextAppt.typeId).textColor} truncate`}>
                        {getTypeById(nextAppt.typeId).label}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        📅 {new Date(`${nextAppt.date}T${nextAppt.time}`).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })} at {nextAppt.time}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      {(() => {
                        const days = getDaysUntil(nextAppt.date);
                        if (days === 0) return <span className="text-xs font-bold text-red-600">TODAY!</span>;
                        if (days === 1) return <span className="text-xs font-bold text-orange-600">Tomorrow</span>;
                        return <span className="text-xs font-bold text-slate-600">{days}d away</span>;
                      })()}
                    </div>
                  </div>
                </Link>
              ) : (
                <Link href="/appointments">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:shadow-md transition">
                    <span className="text-2xl">📅</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-slate-700">No appointments</p>
                      <p className="text-xs text-slate-500">Schedule CAF, health, visa & more</p>
                    </div>
                    <span className="text-slate-400">›</span>
                  </div>
                </Link>
              )}
            </div>

            {/* Day progress overview */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-4">
                🗺️ Your 7-Day Journey
              </p>
              <div className="flex items-center justify-between gap-2">
                {checklistData.map((d) => {
                  const done = isDayComplete(d.day);
                  const isCurrent = d.day === currentDay;
                  return (
                    <motion.button
                      key={d.day}
                      onClick={() => {
                        setSelectedDay(d.day);
                        setView("checklist");
                      }}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition cursor-pointer flex-1 ${
                        isCurrent
                          ? "bg-blue-100 ring-2 ring-blue-400"
                          : done
                          ? "bg-green-100"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-lg">
                        {done ? "✅" : isCurrent ? d.emoji : "⬜"}
                      </span>
                      <span
                        className={`text-[10px] font-bold tracking-wider ${
                          done
                            ? "text-green-700"
                            : isCurrent
                            ? "text-blue-700"
                            : "text-slate-600"
                        }`}
                      >
                        D{d.day}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* CAF Important Reminder */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-4">
              <span className="text-2xl flex-shrink-0">⚡</span>
              <div className="flex-1">
                <p className="font-bold text-red-700 text-sm mb-1">
                  Don&apos;t Miss Out on CAF Housing Aid!
                </p>
                <p className="text-red-800 text-xs leading-relaxed font-medium mb-2">
                  Apply for CAF housing assistance on Day 4 — payments are retroactive to your application date. Every day you wait is money you lose!
                </p>
                <motion.button
                  onClick={() => {
                    setSelectedDay(4);
                    setView("checklist");
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-800 transition flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Go to Day 4 →
                </motion.button>
              </div>
            </div>
          </>
        )}

        {/* CHECKLIST VIEW */}
        {view === "checklist" && dayData && (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Day info card */}
              <div
                className={`rounded-2xl p-5 border shadow-sm mb-4 ${
                  allDone ? "bg-green-50 border-green-200" : "bg-white border-slate-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <motion.span
                    animate={{ rotate: [0, -6, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="text-4xl flex-shrink-0"
                  >
                    {allDone ? "🎉" : dayData.emoji}
                  </motion.span>
                  <div className="flex-1">
                    <div className="text-xs text-slate-400 font-medium mb-0.5">
                      Day {dayData.day} · ⏱ {dayData.estimatedTime}
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 mb-1">{dayData.title}</h2>
                    <p className="text-slate-500 text-sm leading-relaxed">{dayData.description}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span>{allDone ? "✅ All done!" : "Progress"}</span>
                    <span className="font-bold">{completedSteps.length}/{dayData.steps.length}</span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${allDone ? "bg-green-500" : "bg-sky-500"}`}
                      animate={{ width: `${(completedSteps.length / dayData.steps.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {dayData.steps.map((step, idx) => {
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
                          <button
                            onClick={() => setExpandedStep(expanded ? null : step.id)}
                            className="text-left w-full"
                          >
                            <p
                              className={`font-semibold text-sm leading-snug transition-all ${
                                done ? "line-through text-slate-400" : "text-slate-800"
                              }`}
                            >
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

              {/* Tips */}
              {dayData.tips.length > 0 && (
                <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                  <h3 className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-1.5">
                    💡 Pro Tips
                  </h3>
                  <ul className="space-y-1.5">
                    {dayData.tips.map((tip, i) => (
                      <li key={i} className="flex gap-2 text-xs text-amber-700 leading-relaxed">
                        <span className="flex-shrink-0 text-amber-400">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ask AI button */}
              <Link href={`/chat?q=${encodeURIComponent(`Help me with Day ${selectedDay}: ${dayData.title}`)}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center gap-2 transition"
                >
                  <span>💬</span> Ask Cléo about {dayData.title}
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
                    className="mt-4 bg-gradient-to-br from-sky-500 to-violet-600 rounded-2xl p-6 text-white text-center shadow-xl"
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
        )}
      </div>

      <BottomNav />
    </div>
  );
}
