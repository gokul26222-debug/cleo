"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { storage, UserProfile } from "@/lib/storage";
import { checklistData } from "@/lib/data";
import { Appointment, getTypeById, getDaysUntil } from "@/lib/appointments";

function getXP(progress: ReturnType<typeof storage.getProgress>): number {
  return Object.values(progress).reduce((sum, steps) => sum + (steps?.length ?? 0), 0) * 10;
}

function getStreak(progress: ReturnType<typeof storage.getProgress>): number {
  let streak = 0;
  for (let i = 0; i < checklistData.length; i++) {
    const key = `day${i + 1}`;
    if ((progress[key]?.length ?? 0) >= checklistData[i].steps.length) streak++;
    else break;
  }
  return streak;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [completedDays, setCompletedDays] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [nextAppt, setNextAppt] = useState<Appointment | null>(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [progress, setProgress] = useState<ReturnType<typeof storage.getProgress>>({});
  const [easterEgg, setEasterEgg] = useState(false);
  const [mascotTaps, setMascotTaps] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (!storage.isOnboarded()) { router.replace("/"); return; }
    const u = storage.getUser();
    if (!u) { router.replace("/"); return; }
    setUser(u);

    const prog = storage.getProgress();
    setProgress(prog);

    const stepsPerDay = checklistData.map((d) => d.steps.length);
    setCompletedDays(storage.getCompletedDays(stepsPerDay));
    setXp(getXP(prog));
    setStreak(getStreak(prog));

    const appts = storage.getAppointments()
      .filter((a) => a.status === "upcoming")
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    setNextAppt(appts[0] ?? null);

    let cd = 1;
    for (let i = 0; i < checklistData.length; i++) {
      const key = `day${i + 1}`;
      const done = prog[key]?.length ?? 0;
      if (done < checklistData[i].steps.length) { cd = i + 1; break; }
      cd = 7;
    }
    setCurrentDay(cd);
  }, [router]);

  const handleMascotTap = () => {
    const next = mascotTaps + 1;
    setMascotTaps(next);
    if (next >= 5) {
      setEasterEgg(true);
      setMascotTaps(0);
      setTimeout(() => setEasterEgg(false), 3000);
    }
  };

  if (!mounted) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1 }}
        className="text-5xl">🗼</motion.div>
    </div>
  );
  if (!user) return null;

  const firstName = user.name.split(" ")[0];
  const today = checklistData[currentDay - 1];
  const dayProgress = progress[`day${currentDay}`]?.length ?? 0;
  const dayTotal = today?.steps.length ?? 0;
  const progressPct = Math.round((completedDays / 7) * 100);

  const quickActions = [
    { label: "7-Day Checklist", emoji: "✅", href: "/checklist", bg: "bg-[#58cc02]", shadow: "#46a302", desc: `Day ${currentDay} of 7` },
    { label: "Ask Cleo AI",     emoji: "💬", href: "/chat",      bg: "bg-violet-500", shadow: "#5b21b6", desc: "AI assistant" },
    { label: "Explore Paris",   emoji: "🗺️", href: "/explore",   bg: "bg-orange-500", shadow: "#c2410c", desc: "22 free spots" },
    { label: "Must-have Apps",  emoji: "📲", href: "/apps",      bg: "bg-indigo-500", shadow: "#3730a3", desc: "Paris app kit" },
  ];

  return (
    <div className="min-h-screen bg-white pb-28">

      {/* Easter egg */}
      <AnimatePresence>
        {easterEgg && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setEasterEgg(false)}
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, 0], y: [0, -12, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="bg-white rounded-3xl p-8 text-center shadow-2xl mx-6"
            >
              <div className="text-5xl mb-3">🥐</div>
              <p className="text-2xl font-black text-slate-900">Easter egg!</p>
              <p className="text-[#58cc02] font-bold text-lg mt-1">«Tu es incroyable!»</p>
              <p className="text-slate-400 text-sm mt-1">You found the secret 🥚</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <div className="bg-white px-5 pt-12 pb-3 border-b-2 border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BONJOUR 👋</p>
            <h1 className="text-2xl font-black text-slate-900">{firstName}&apos;s Journey</h1>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-orange-50 border-2 border-orange-200 rounded-2xl px-3 py-1.5 animate-streak">
              <span className="text-base">🔥</span>
              <span className="text-sm font-black text-orange-600">{streak}</span>
              <span className="text-[10px] text-orange-400 font-bold">streak</span>
            </div>
            <div className="flex items-center gap-1.5 bg-purple-50 border-2 border-purple-200 rounded-2xl px-3 py-1.5">
              <span className="text-base">✨</span>
              <span className="text-sm font-black text-purple-600">{xp}</span>
              <span className="text-[10px] text-purple-400 font-bold">XP</span>
            </div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5">
            <span>Paris Admin Journey</span>
            <span>{completedDays}/7 days</span>
          </div>
          <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-[#58cc02] rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-4 max-w-lg mx-auto">

        {/* Hero today card */}
        {today && completedDays < 7 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Today&apos;s Mission</p>
            <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden"
              style={{ boxShadow: "0 6px 0 #1e293b" }}>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full" />
              <div className="flex items-start gap-3 relative z-10">
                <motion.button
                  onClick={handleMascotTap}
                  whileTap={{ rotate: -15, scale: 0.85 }}
                  className="text-4xl flex-shrink-0 cursor-pointer"
                  title="Tap me 5 times…"
                >
                  {today.emoji}
                </motion.button>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 mb-0.5">Day {currentDay} · {today.estimatedTime}</p>
                  <h3 className="font-black text-lg leading-tight mb-2">{today.title}</h3>
                  <div className="bg-white/10 rounded-full h-2 mb-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dayTotal > 0 ? (dayProgress / dayTotal) * 100 : 0}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="h-2 bg-[#58cc02] rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">{dayProgress}/{dayTotal} steps · +{dayTotal * 10} XP on completion</p>
                </div>
              </div>
              <Link href="/checklist">
                <motion.button
                  whileTap={{ scale: 0.97, y: 3 }}
                  className="mt-4 w-full bg-[#58cc02] text-white font-black py-3 rounded-xl text-sm btn-3d"
                >
                  Start Day {currentDay} →
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* All done */}
        {completedDays === 7 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#58cc02] rounded-2xl p-6 text-white text-center"
            style={{ boxShadow: "0 6px 0 #46a302" }}
          >
            <motion.div animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3 }} className="text-5xl mb-3">🏆</motion.div>
            <h3 className="font-black text-xl mb-1">Paris Admin: Complete!</h3>
            <p className="text-green-100 text-sm">You&apos;ve mastered French bureaucracy. Bravo!</p>
            <p className="font-black text-lg mt-2">✨ {xp} XP earned</p>
          </motion.div>
        )}

        {/* Journey path */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Your Paris Journey</p>
          <div className="bg-white border-2 border-slate-100 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              {checklistData.map((d, i) => {
                const key = `day${d.day}`;
                const done = (progress[key]?.length ?? 0) >= d.steps.length;
                const isNow = d.day === currentDay;
                return (
                  <div key={d.day} className="flex items-center">
                    <Link href={`/checklist?day=${d.day}`}>
                      <motion.div
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg border-3 transition-all ${
                          done
                            ? "bg-[#58cc02] border-[#46a302] shadow-sm"
                            : isNow
                            ? "bg-white border-[#58cc02] border-2 shadow-md"
                            : "bg-slate-50 border-2 border-slate-200"
                        }`}
                          style={isNow ? { boxShadow: "0 3px 0 #46a302" } : {}}>
                          {done ? "✅" : isNow ? d.emoji : "🔒"}
                        </div>
                        <span className={`text-[9px] font-black ${done ? "text-[#58cc02]" : isNow ? "text-[#58cc02]" : "text-slate-300"}`}>
                          D{d.day}
                        </span>
                      </motion.div>
                    </Link>
                    {i < checklistData.length - 1 && (
                      <div className={`w-3 h-1 rounded-full mx-0.5 mb-3 ${done ? "bg-[#58cc02]" : "bg-slate-200"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
              >
                <Link href={action.href}>
                  <motion.div
                    whileTap={{ scale: 0.96, y: 4 }}
                    className={`${action.bg} rounded-2xl p-4 text-white text-center transition-all`}
                    style={{ boxShadow: `0 5px 0 ${action.shadow}` }}
                  >
                    <div className="text-2xl mb-1.5">{action.emoji}</div>
                    <p className="text-xs font-black leading-tight">{action.label}</p>
                    <p className="text-[10px] mt-0.5 opacity-75">{action.desc}</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Next appointment */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Appointment</p>
            <Link href="/appointments"><span className="text-xs font-bold text-[#58cc02]">View all →</span></Link>
          </div>
          {nextAppt ? (
            <Link href="/appointments">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`${getTypeById(nextAppt.typeId).color} border-2 ${getTypeById(nextAppt.typeId).borderColor} rounded-2xl p-4 flex items-center gap-3`}
              >
                <span className="text-3xl">{getTypeById(nextAppt.typeId).emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-black text-sm ${getTypeById(nextAppt.typeId).textColor} truncate`}>
                    {getTypeById(nextAppt.typeId).label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    📅 {new Date(`${nextAppt.date}T${nextAppt.time}`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} at {nextAppt.time}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {(() => {
                    const days = getDaysUntil(nextAppt.date);
                    if (days === 0) return <span className="text-xs font-black text-red-500 animate-pulse">TODAY!</span>;
                    if (days === 1) return <span className="text-xs font-black text-orange-500">Tomorrow</span>;
                    return <span className="text-xs font-bold text-slate-500">In {days}d</span>;
                  })()}
                </div>
              </motion.div>
            </Link>
          ) : (
            <Link href="/appointments">
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-4 flex items-center gap-3 hover:border-[#58cc02] hover:bg-green-50 transition">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="font-black text-sm text-slate-600">No appointments yet</p>
                  <p className="text-xs text-slate-400">Book CAF, CPAM, prefecture & more</p>
                </div>
                <span className="ml-auto text-slate-300 text-lg">›</span>
              </div>
            </Link>
          )}
        </motion.div>

        {/* CAF tip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex gap-3"
        >
          <span className="text-2xl flex-shrink-0">⚡</span>
          <div>
            <p className="font-black text-amber-800 text-sm mb-0.5">Don&apos;t lose money!</p>
            <p className="text-amber-700 text-xs leading-relaxed">
              Apply for CAF immediately — payments are retroactive. Every day you wait = money lost.
            </p>
            <Link href="/checklist?day=4">
              <span className="text-xs font-black text-amber-600">Go to Day 4 →</span>
            </Link>
          </div>
        </motion.div>

      </div>
      <BottomNav />
    </div>
  );
}
