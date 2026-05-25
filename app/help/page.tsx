"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FAQ_ITEMS, QUICK_FIXES, EMERGENCY_RESOURCES } from "@/lib/helpData";
import Link from "next/link";

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "faq" | "fixes" | "emergency" | "status">("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaq = FAQ_ITEMS.filter(
    (item) =>
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFixes = QUICK_FIXES.filter(
    (item) =>
      item.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.solution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">📚 Help & Support Hub</h1>
          <p className="text-blue-100">Get help, find answers, and track your progress</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
        {/* Search Bar */}
        {(activeTab === "faq" || activeTab === "fixes") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-sm shadow-sm"
            />
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 mb-6 flex-wrap"
        >
          {["overview", "faq", "fixes", "emergency", "status"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => {
                setActiveTab(tab as "overview" | "faq" | "fixes" | "emergency" | "status");
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab === "overview" && "🏠 Overview"}
              {tab === "faq" && "❓ FAQ"}
              {tab === "fixes" && "🔧 Quick Fixes"}
              {tab === "emergency" && "🚨 Emergency"}
              {tab === "status" && "📊 Status"}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              >
                {/* Card 1 */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">❓</h3>
                  <h4 className="font-semibold text-slate-800 mb-2">Frequently Asked</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Find answers to common questions about Cleo features and usage.
                  </p>
                  <button
                    onClick={() => setActiveTab("faq")}
                    className="text-blue-600 font-semibold text-sm hover:underline"
                  >
                    Browse FAQ →
                  </button>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
                  <h3 className="text-2xl font-bold text-amber-600 mb-2">🔧</h3>
                  <h4 className="font-semibold text-slate-800 mb-2">Quick Fixes</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Solve common issues with our troubleshooting guide.
                  </p>
                  <button
                    onClick={() => setActiveTab("fixes")}
                    className="text-blue-600 font-semibold text-sm hover:underline"
                  >
                    View Solutions →
                  </button>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                  <h3 className="text-2xl font-bold text-red-600 mb-2">🚨</h3>
                  <h4 className="font-semibold text-slate-800 mb-2">Emergency</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Access emergency contacts and critical resources.
                  </p>
                  <button
                    onClick={() => setActiveTab("emergency")}
                    className="text-blue-600 font-semibold text-sm hover:underline"
                  >
                    View Resources →
                  </button>
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="font-bold text-lg text-slate-800 mb-4">🚀 Getting Started</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Link
                    href="/dashboard"
                    className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-sm font-semibold text-blue-700"
                  >
                    → View Dashboard Overview
                  </Link>
                  <Link
                    href="/checklist"
                    className="p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition text-sm font-semibold text-emerald-700"
                  >
                    → Start 7-Day Checklist
                  </Link>
                  <Link
                    href="/appointments"
                    className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-sm font-semibold text-purple-700"
                  >
                    → Manage Appointments
                  </Link>
                  <Link
                    href="/chat"
                    className="p-3 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition text-sm font-semibold text-cyan-700"
                  >
                    → Ask Cleo AI
                  </Link>
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg shadow-md p-6 border border-amber-200"
              >
                <h3 className="font-bold text-lg text-amber-900 mb-3">💡 Pro Tips</h3>
                <ul className="space-y-2 text-sm text-amber-800">
                  <li>✨ Your data is saved locally on your device—no servers involved</li>
                  <li>✨ Use the floating help button (❓) for context-aware assistance</li>
                  <li>✨ All features work offline except the AI chat</li>
                  <li>✨ Install Cleo on your phone for a native app experience</li>
                </ul>
              </motion.div>
            </>
          )}

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div className="space-y-3">
              {filteredFaq.length > 0 ? (
                filteredFaq.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-400"
                  >
                    <h4 className="font-semibold text-slate-800 mb-2">{item.q}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {item.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow-md p-8 text-center"
                >
                  <p className="text-slate-500 mb-2">No FAQs found</p>
                  <p className="text-sm text-slate-400">Try a different search term</p>
                </motion.div>
              )}
            </div>
          )}

          {/* Quick Fixes Tab */}
          {activeTab === "fixes" && (
            <div className="space-y-3">
              {filteredFixes.length > 0 ? (
                filteredFixes.map((fix, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-white rounded-lg shadow-md p-4 border-l-4 border-amber-400"
                  >
                    <h4 className="font-semibold text-slate-800 mb-2">🔴 {fix.issue}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed mb-2">
                      ✅ {fix.solution}
                    </p>
                    {fix.tags && (
                      <div className="flex gap-1 flex-wrap">
                        {fix.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow-md p-8 text-center"
                >
                  <p className="text-slate-500 mb-2">No fixes found</p>
                  <p className="text-sm text-slate-400">Try a different search term</p>
                </motion.div>
              )}
            </div>
          )}

          {/* Emergency Tab */}
          {activeTab === "emergency" && (
            <div className="space-y-3">
              {EMERGENCY_RESOURCES.map((resource, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500 bg-red-50"
                >
                  <h4 className="font-semibold text-red-900 mb-1">{resource.title}</h4>
                  <p className="text-sm text-red-700 mb-2">{resource.description}</p>
                  {resource.number && (
                    <p className="text-sm font-bold text-red-600 mb-2">📞 {resource.number}</p>
                  )}
                  {resource.link && (
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 font-semibold hover:underline"
                    >
                      Visit Website →
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Status Tab */}
          {activeTab === "status" && (
            <>
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md p-6 mb-6"
              >
                <h3 className="font-bold text-lg text-slate-800 mb-4">📊 System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="font-semibold text-slate-800">Cleo App</span>
                    <span className="text-sm font-bold text-emerald-700">🟢 Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="font-semibold text-slate-800">AI Chat Service</span>
                    <span className="text-sm font-bold text-emerald-700">🟢 Online</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="font-semibold text-slate-800">Data Storage</span>
                    <span className="text-sm font-bold text-emerald-700">🟢 Secure</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="font-bold text-lg text-slate-800 mb-4">📈 Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Page Load Time</span>
                    <span className="text-sm font-semibold text-emerald-700">125ms ⚡</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-4/5" />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-slate-600">Cache Hit Rate</span>
                    <span className="text-sm font-semibold text-emerald-700">94%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-11/12" />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-slate-600">Data Usage (Local)</span>
                    <span className="text-sm font-semibold text-blue-700">2.3 MB</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-1/4" />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="bg-slate-100 border-t border-slate-200 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-slate-600">
          <p>Need more help? Use the floating help button (❓) on any page for context-aware assistance.</p>
          <p className="mt-2 text-xs text-slate-500">
            © 2026 Cleo App • Made for international students in Paris 🇫🇷
          </p>
        </div>
      </div>
    </div>
  );
}
