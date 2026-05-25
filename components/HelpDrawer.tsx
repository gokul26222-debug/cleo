"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EMERGENCY_RESOURCES } from "@/lib/helpData";

export default function HelpDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"kb" | "emergency" | "tickets">("kb");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      {/* Drawer Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-6 top-20 w-12 h-12 bg-slate-200 hover:bg-slate-300 rounded-full shadow-lg flex items-center justify-center text-xl transition-colors z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Open Help Drawer"
      >
        📚
      </motion.button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 z-40"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 flex items-center justify-between">
                <h2 className="font-bold text-lg">📚 Help Center</h2>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="text-xl hover:scale-125 transition"
                  whileHover={{ rotate: 90 }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 px-3 pt-3 border-b border-slate-200 flex-wrap">
                <motion.button
                  onClick={() => setTab("kb")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    tab === "kb"
                      ? "bg-blue-100 text-blue-700"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📖 KB Search
                </motion.button>
                <motion.button
                  onClick={() => setTab("emergency")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    tab === "emergency"
                      ? "bg-red-100 text-red-700"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🚨 Emergency
                </motion.button>
                <motion.button
                  onClick={() => setTab("tickets")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    tab === "tickets"
                      ? "bg-purple-100 text-purple-700"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎫 Tickets
                </motion.button>
              </div>

              {/* Search Bar (KB only) */}
              {tab === "kb" && (
                <div className="px-3 py-2 border-b border-slate-100">
                  <input
                    type="text"
                    placeholder="Search knowledge base..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              )}

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                {/* KB Tab */}
                {tab === "kb" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                  >
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-xs font-semibold text-blue-900 mb-1">
                        📚 Knowledge Base
                      </p>
                      <p className="text-xs text-blue-700">
                        Search feature coming soon! Browse our FAQ and Quick Fixes in the floating help panel.
                      </p>
                    </div>
                    <div className="space-y-2 text-xs text-slate-600">
                      <p>💡 <strong>Pro tips:</strong></p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Click the floating ❓ button for quick help</li>
                        <li>Use search to find FAQs and solutions</li>
                        <li>Check contextual tips on each page</li>
                        <li>Emergency? See the 🚨 tab</li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                {/* Emergency Tab */}
                {tab === "emergency" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                  >
                    {EMERGENCY_RESOURCES.map((resource, i) => (
                      <div
                        key={i}
                        className="bg-red-50 p-3 rounded-lg border border-red-200"
                      >
                        <p className="text-xs font-semibold text-red-900">
                          {resource.title}
                        </p>
                        <p className="text-xs text-red-700 mt-1">
                          {resource.description}
                        </p>
                        {resource.number && (
                          <p className="text-xs font-bold text-red-600 mt-2">
                            📞 {resource.number}
                          </p>
                        )}
                        {resource.link && (
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 font-semibold hover:underline inline-block mt-2"
                          >
                            Visit Website →
                          </a>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Tickets Tab */}
                {tab === "tickets" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                  >
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <p className="text-xs font-semibold text-purple-900 mb-1">
                        🎫 Support Tickets
                      </p>
                      <p className="text-xs text-purple-700 mb-3">
                        Track your support requests and get updates.
                      </p>
                      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition">
                        ➕ Create New Ticket
                      </button>
                    </div>
                    <div className="text-center py-4">
                      <p className="text-xs text-slate-500">
                        No active tickets yet.
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Need help? Create a ticket above or use the floating help button.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 px-3 py-2 bg-slate-50">
                <a
                  href="/help"
                  className="text-xs text-blue-600 font-semibold hover:underline block text-center"
                >
                  → View Full Help Hub
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
