"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { CONTEXTUAL_HELP, FAQ_ITEMS, QUICK_FIXES } from "@/lib/helpData";

export default function HelpAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"quick" | "faq" | "context">("quick");
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();

  const currentContextHelp = CONTEXTUAL_HELP[pathname as keyof typeof CONTEXTUAL_HELP];

  const filteredFaq = FAQ_ITEMS.filter((item) =>
    item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQuickFixes = QUICK_FIXES.filter((item) =>
    item.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.solution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Don't show on support/help pages
  if (pathname?.includes("/support") || pathname?.includes("/help")) {
    return null;
  }

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-lg flex items-center justify-center text-2xl hover:shadow-xl transition-shadow z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: isOpen ? 0 : [0, -8, 0] }}
        transition={{ repeat: isOpen ? 0 : Infinity, duration: 2 }}
      >
        ❓
      </motion.button>

      {/* Help Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-40 right-6 w-80 bg-white rounded-2xl shadow-2xl z-50 flex flex-col max-h-96"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Quick Help 💬</h3>
                <p className="text-xs text-blue-100">Get answers instantly</p>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="text-xl hover:scale-125 transition"
                whileHover={{ rotate: 90 }}
              >
                ✕
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-3 pt-3 border-b border-slate-200">
              {currentContextHelp && (
                <motion.button
                  onClick={() => setTab("context")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    tab === "context"
                      ? "bg-blue-100 text-blue-700"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📍 Context
                </motion.button>
              )}
              <motion.button
                onClick={() => setTab("quick")}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  tab === "quick"
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔧 Fixes
              </motion.button>
              <motion.button
                onClick={() => setTab("faq")}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  tab === "faq"
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ❓ FAQ
              </motion.button>
            </div>

            {/* Search Bar */}
            <div className="px-3 py-2">
              <input
                type="text"
                placeholder="Search help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
              {/* Context Tab */}
              {tab === "context" && currentContextHelp && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <p className="text-sm font-bold text-slate-800">
                    {currentContextHelp.title}
                  </p>
                  {currentContextHelp.tips.map((tip, i) => (
                    <div
                      key={i}
                      className="bg-blue-50 p-2 rounded-lg border-l-2 border-blue-400"
                    >
                      <p className="text-xs text-slate-700 leading-snug">
                        💡 {tip}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Quick Fixes Tab */}
              {tab === "quick" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  {filteredQuickFixes.length > 0 ? (
                    filteredQuickFixes.map((fix, i) => (
                      <div
                        key={i}
                        className="bg-amber-50 p-2 rounded-lg border-l-2 border-amber-400"
                      >
                        <p className="text-xs font-semibold text-slate-800">
                          {fix.issue}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          ✅ {fix.solution}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-4">
                      No quick fixes found
                    </p>
                  )}
                </motion.div>
              )}

              {/* FAQ Tab */}
              {tab === "faq" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  {filteredFaq.length > 0 ? (
                    filteredFaq.slice(0, 3).map((item, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 p-2 rounded-lg border border-slate-200"
                      >
                        <p className="text-xs font-semibold text-slate-800">
                          {item.q}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {item.a.substring(0, 80)}...
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-4">
                      No FAQs found
                    </p>
                  )}
                  {filteredFaq.length > 3 && (
                    <p className="text-xs text-blue-500 text-center py-2">
                      +{filteredFaq.length - 3} more • View full FAQ
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 px-3 py-2 bg-slate-50 rounded-b-2xl">
              <a
                href="/help"
                className="text-xs text-blue-600 font-semibold hover:underline block text-center"
              >
                📖 View Full Help Center →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
          />
        )}
      </AnimatePresence>
    </>
  );
}
