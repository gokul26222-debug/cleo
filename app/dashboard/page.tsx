"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import MetroLine from "@/components/MetroLine";
import { storage, UserProfile } from "@/lib/storage";
import { checklistData } from "@/lib/data";
import { Appointment, getTypeById, getDaysUntil } from "@/lib/appointments";

const MOTIVATIONAL = [
  "Every step counts. Tu y es presque! 💪",
  "Paris is becoming home, one task at a time. 🇫🇷",
  "Courage! The bureaucracy won't beat you. 🏆",
  "You're doing amazing — keep going! ⭐",
  "Almost there — Paris is waiting for you! 🗼",
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [completedDays, setCompletedDays] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [nextAppt, setNextAppt] = useState<Appointment | null>(null);

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

    const progress = storage.getProgress();
    let cd = 1;
    for (let i = 0; i < checklistData.length; i++) {
      const key = `day${i + 1}`;
      const completed = progress[key]?.length ?? 0;
      if (completed < checklistData[i].steps.length) {
        cd = i + 1;
        break;
      }
      cd = 7;
    }
    setCurrentDay(cd);
  }, [router]);

  if (!mounted) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }}
        className="text-4xl">🗼</motion.div>
    </div>
  );
  if (!user) return null;

  const firstName = user.name.split(" ")[0];
  const today = checklistData[currentDay - 1];
  const progress = storage.getProgress();
  const metroStops = checklistData.map((d) => ({
    day: d.day,
    emoji: d.emoji,
    label: d.title,
    done: (progress[`day${d.day}`]?.length ?? 0) >= d.steps.length,
  }));
  const dayProgress = progress[`day${currentDay}`]?.length ?? 0;
  const dayTotal = today?.steps.length ?? 0;
  const motivational = MOTIVATIONAL[completedDays % MOTIVATIONAL.length];

  const quickActions = [
    {
      label: "7-Day Checklist",
      emoji: "✅",
      href: "/checklist",
      bg: "bg-sky-500",
      shadow: "shadow-sky-200",
      desc: `Stop ${currentDay} of 7`,
    },
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
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Header with gradient */}
      <div className="bg-gradient-to-b from-metro to-metro-dark px-6 pt-14 pb-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-extrabold text-white/90 tracking-tight">Cléo</span>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium backdrop-blur-sm">
              🇫🇷 Paris Guide
            </span>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-white/70 text-sm font-medium mb-0.5">
              {completedDays === 7
                ? "Terminus reached! 🎉"
                : `🚇 Next stop: ${today?.title ?? ""}`}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Bonjour, {firstName}! 👋
            </h1>
          </motion.div>
        </motion.div>

        {/* Progress bar in header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5"
        >
          <div className="flex items-center justify-between text-xs text-white/70 mb-1">
            <span>Your métro line to Paris life</span>
            <span className="font-bold">{completedDays}/7 stops</span>
          </div>
          <MetroLine stops={metroStops} currentDay={currentDay} onDark />
          <p className="text-white/50 text-[10px] text-center mt-1">
            The train moves when you do — no schedule, no pressure 💛
          </p>
        </motion.div>
      </div>

      <div className="px-5 -mt-4 space-y-4 max-w-lg mx-auto">
        {/* Motivational card */}
        {completedDays < 7 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100 flex items-center gap-3"
          >
            <span className="text-xl">💡</span>
            <p className="text-slate-600 text-sm leading-snug">{motivational}</p>
          </motion.div>
        )}

        {/* Today's task card */}
        {today && completedDays < 7 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5 px-1">
              Your Next Stop
            </p>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
              {/* Decorative circle */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full" />
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full" />

              <div className="flex items-start gap-3 relative">
                <motion.span
                  animate={{ rotate: [0, -8, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="text-4xl flex-shrink-0"
                >
                  {today.emoji}
                </motion.span>
                <div className="flex-1">
                  <div className="text-xs text-slate-400 mb-1">🚇 Stop {currentDay} · {today.estimatedTime}</div>
                  <h3 className="font-extrabold text-lg leading-tight mb-2">{today.title}</h3>
                  <div className="bg-white/10 rounded-full h-1.5 mb-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dayTotal > 0 ? (dayProgress / dayTotal) * 100 : 0}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="h-full bg-sky-400 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-slate-400">{dayProgress}/{dayTotal} steps done</p>
                </div>
              </div>

              <Link href="/checklist">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 w-full bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-100 transition text-sm"
                >
                  Ride to Stop {currentDay} 🚇
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* All done celebration */}
        {completedDays === 7 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white text-center shadow-xl shadow-emerald-100"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-5xl mb-3"
            >
              🏆
            </motion.div>
            <h3 className="font-extrabold text-xl mb-1">Paris Admin: Complete!</h3>
            <p className="text-emerald-100 text-sm">
              You&apos;ve done what most students take months to figure out. Bravo!
            </p>
          </motion.div>
        )}

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5 px-1">
            Quick Actions
          </p>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.07 }}
              >
                <Link href={action.href}>
                  <motion.div
                    whileHover={{ y: -3, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className={`${action.bg} rounded-2xl p-4 text-white text-center shadow-lg ${action.shadow} transition-all`}
                  >
                    <div className="text-2xl mb-1.5">{action.emoji}</div>
                    <p className="text-xs font-bold leading-tight">{action.label}</p>
                    <p className="text-[10px] mt-0.5 opacity-70">{action.desc}</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming appointment widget */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
        >
          <div className="flex items-center justify-between mb-2.5 px-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Next Appointment</p>
            <Link href="/appointments">
              <span className="text-xs font-bold text-sky-500 hover:text-sky-700">View all →</span>
            </Link>
          </div>
          {nextAppt ? (
            <Link href="/appointments">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`${getTypeById(nextAppt.typeId).color} border ${getTypeById(nextAppt.typeId).borderColor} rounded-2xl p-4 flex items-center gap-3 shadow-sm`}
              >
                <span className="text-3xl">{getTypeById(nextAppt.typeId).emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm ${getTypeById(nextAppt.typeId).textColor} truncate`}>
                    {getTypeById(nextAppt.typeId).label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    📅 {new Date(`${nextAppt.date}T${nextAppt.time}`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} at {nextAppt.time}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
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
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-4 flex items-center gap-3 hover:border-sky-300 hover:bg-sky-50 transition">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="font-bold text-sm text-slate-600">No appointments yet</p>
                  <p className="text-xs text-slate-400">Book CAF, CPAM, prefecture & more</p>
                </div>
                <span className="ml-auto text-slate-300 text-lg">›</span>
              </div>
            </Link>
          )}
        </motion.div>

        {/* Day dots overview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            🚇 Line 7 · Your Journey Map
          </p>
          <MetroLine
            stops={metroStops}
            currentDay={currentDay}
            onSelect={(day) => router.push(`/checklist?day=${day}`)}
          />
          <p className="text-[10px] text-slate-400 text-center mt-2">
            Next stop: <span className="font-bold text-metro">{today?.title ?? "Terminus 🏆"}</span>
          </p>
        </motion.div>

        {/* CAF tip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3"
        >
          <span className="text-2xl flex-shrink-0">⚡</span>
          <div>
            <p className="font-bold text-amber-800 text-sm mb-0.5">Don&apos;t lose money!</p>
            <p className="text-amber-700 text-xs leading-relaxed">
              Apply for CAF housing aid immediately — payments are retroactive to your application date. Every day you wait = money lost.
            </p>
            <Link href="/checklist?day=4">
              <span className="text-xs font-bold text-amber-600 hover:text-amber-800 transition">
                Go to Day 4 →
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
