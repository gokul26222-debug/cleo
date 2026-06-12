"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import {
  ESSENTIAL_APPS,
  APP_CATEGORIES,
  type AppCategory,
} from "@/lib/apps";

export default function AppsPage() {
  const [activeCategory, setActiveCategory] = useState<AppCategory | "all">("all");
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredApps = ESSENTIAL_APPS
    .filter((a) => activeCategory === "all" || a.category === activeCategory)
    .filter(
      (a) =>
        !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.tagline.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* ── HERO HEADER ── */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 px-6 pt-14 pb-10 text-white overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute -left-8 bottom-4 w-32 h-32 bg-white/5 rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-extrabold tracking-tight">Cleo</span>
            <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full font-bold backdrop-blur-sm">
              {ESSENTIAL_APPS.length} must-have apps
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black tracking-tight leading-tight"
          >
            Your Paris
            <br />
            <span className="relative">
              App Kit
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-1 left-0 h-1.5 bg-yellow-300 rounded-full"
              />
            </span>
            {" "}📲
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-indigo-100 text-sm mt-3 max-w-xs"
          >
            The apps every international student in Paris actually uses — transport, doctors, deals, and daily survival.
          </motion.p>
        </motion.div>
      </div>

      <div className="px-5 -mt-5 max-w-lg mx-auto relative z-10">
        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-100/50 border border-slate-100 overflow-hidden">
            <div className="flex items-center px-4 py-3 gap-3">
              <span className="text-slate-400">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search apps..."
                className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-300"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-slate-300 hover:text-slate-500 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-5 px-5 scrollbar-hide">
          {APP_CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? "bg-[#58cc02] text-white shadow-md shadow-green-200"
                  : "bg-white text-slate-500 border border-slate-100"
              }`}
            >
              {cat.emoji} {cat.label}
            </motion.button>
          ))}
        </div>

        {/* App cards */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app, i) => {
              const expanded = expandedApp === app.id;
              return (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setExpandedApp(expanded ? null : app.id)}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer"
                >
                  {/* Card header */}
                  <div className="flex items-center gap-3.5 p-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-2xl flex-shrink-0 shadow-sm`}
                    >
                      {app.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800 text-sm">{app.name}</p>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            app.price === "Free"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {app.price}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5 truncate">{app.tagline}</p>
                    </div>
                    <motion.span
                      animate={{ rotate: expanded ? 180 : 0 }}
                      className="text-slate-300 text-xs flex-shrink-0"
                    >
                      ▼
                    </motion.span>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3">
                          <p className="text-slate-600 text-xs leading-relaxed">
                            {app.description}
                          </p>

                          <div className={`${app.lightBg} rounded-xl p-3`}>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                              Why you need it
                            </p>
                            <p className="text-slate-600 text-xs leading-relaxed">
                              {app.whyNeeded}
                            </p>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 flex gap-2">
                            <span className="text-base flex-shrink-0">💡</span>
                            <p className="text-yellow-800 text-xs leading-relaxed">
                              {app.studentTip}
                            </p>
                          </div>

                          {/* Store links */}
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={app.iosUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl text-center hover:bg-slate-700 transition"
                            >
                               App Store
                            </a>
                            <a
                              href={app.androidUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl text-center hover:bg-emerald-500 transition"
                            >
                              ▶ Play Store
                            </a>
                            {app.webUrl && (
                              <a
                                href={app.webUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-indigo-50 text-indigo-600 text-xs font-bold py-2.5 rounded-xl text-center hover:bg-indigo-100 transition"
                              >
                                🌐 Web
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredApps.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">
              No apps match your search 🤷
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
