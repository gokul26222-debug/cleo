"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";

const FEEDBACK_TYPES = [
  { id: "bug", emoji: "🐛", label: "Bug Report", desc: "Something isn't working" },
  { id: "feature", emoji: "💡", label: "Feature Request", desc: "Suggest a new feature" },
  { id: "feedback", emoji: "💬", label: "General Feedback", desc: "Share your thoughts" },
  { id: "complaint", emoji: "⚠️", label: "Complaint", desc: "Report an issue" },
];

const RATINGS = [
  { value: 1, emoji: "😞", label: "Poor" },
  { value: 2, emoji: "😐", label: "Fair" },
  { value: 3, emoji: "🙂", label: "Good" },
  { value: 4, emoji: "😊", label: "Great" },
  { value: 5, emoji: "🤩", label: "Amazing" },
];

const FAQ_ITEMS = [
  {
    q: "Is Cleo free to use?",
    a: "Yes! Cleo is 100% free. No sign-up, no hidden fees, no premium plans.",
  },
  {
    q: "Is my data safe?",
    a: "All your data is stored locally on your device. We don't collect or store any personal information on servers.",
  },
  {
    q: "Which services does Cleo cover?",
    a: "Cleo covers 24+ French administrative services including CAF, CPAM, OFII, Prefecture, bank accounts, transport, and more.",
  },
  {
    q: "Can I use Cleo offline?",
    a: "Most features work offline except the AI chat which needs an internet connection. Your checklist, documents, and appointments are stored locally.",
  },
  {
    q: "How do I reset my progress?",
    a: "Go to your browser settings and clear the site data for this page. This will reset all your progress and data.",
  },
];

export default function SupportPage() {
  const [selectedType, setSelectedType] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = () => {
    if (!selectedType || !message.trim()) return;

    const ratingText = rating > 0 ? `Rating: ${rating}/5 (${RATINGS[rating - 1]?.label})` : "No rating";
    const typeLabel = FEEDBACK_TYPES.find((t) => t.id === selectedType)?.label || selectedType;

    const subject = encodeURIComponent(`[Cleo Feedback] ${typeLabel}`);
    const body = encodeURIComponent(
      `Type: ${typeLabel}\n${ratingText}\n\nMessage:\n${message.trim()}\n\nFrom: ${email || "Anonymous"}\n\n---\nSent from Cleo Support Page`
    );

    window.open(`mailto:gokul.krishnan3210@gmail.com?subject=${subject}&body=${body}`, "_blank");
    setSent(true);
  };

  const resetForm = () => {
    setSelectedType("");
    setRating(0);
    setMessage("");
    setEmail("");
    setSent(false);
  };

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Header */}
      <div className="bg-gradient-to-b from-indigo-500 to-indigo-600 px-6 pt-14 pb-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-extrabold text-white/90 tracking-tight">Cleo</span>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium backdrop-blur-sm">
              Support
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Help & Feedback 💬
          </h1>
          <p className="text-indigo-200 text-sm mt-1">
            We&apos;re here to help. Your feedback makes Cleo better!
          </p>
        </motion.div>
      </div>

      <div className="px-5 -mt-4 space-y-4 max-w-lg mx-auto">
        {/* Contact card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-xl">
              📧
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">Direct Contact</p>
              <a
                href="mailto:gokul.krishnan3210@gmail.com"
                className="text-indigo-500 text-xs font-semibold hover:underline"
              >
                gokul.krishnan3210@gmail.com
              </a>
            </div>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">
            Have a question or need help? Email us anytime and we&apos;ll get back to you within 24 hours.
          </p>
        </motion.div>

        {/* Feedback form */}
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white text-center shadow-xl"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-5xl mb-3"
              >
                🎉
              </motion.div>
              <h3 className="font-extrabold text-xl mb-2">Thank You!</h3>
              <p className="text-emerald-100 text-sm mb-4">
                Your feedback has been prepared. Please send the email that opened in your mail app.
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={resetForm}
                className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-xl text-sm transition"
              >
                Send Another Feedback
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <h3 className="font-extrabold text-slate-800 text-base mb-4">
                Send Feedback
              </h3>

              {/* Feedback type selection */}
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                What&apos;s this about?
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {FEEDBACK_TYPES.map((type) => (
                  <motion.button
                    key={type.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-left transition-all ${
                      selectedType === type.id
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-100 text-slate-600 hover:border-indigo-200"
                    }`}
                  >
                    <span className="text-lg">{type.emoji}</span>
                    <div>
                      <p className="font-bold text-xs">{type.label}</p>
                      <p className="text-[10px] opacity-60">{type.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Rating */}
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Rate your experience
              </p>
              <div className="flex justify-between mb-4 bg-slate-50 rounded-xl p-2">
                {RATINGS.map((r) => (
                  <motion.button
                    key={r.value}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(r.value)}
                    className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all ${
                      rating === r.value
                        ? "bg-white shadow-sm scale-110"
                        : "hover:bg-white/50"
                    }`}
                  >
                    <span className={`text-2xl transition-all ${rating === r.value ? "scale-110" : "grayscale opacity-50"}`}>
                      {r.emoji}
                    </span>
                    <span className={`text-[9px] font-bold ${rating === r.value ? "text-indigo-600" : "text-slate-400"}`}>
                      {r.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Message */}
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Your message
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                rows={4}
                className="w-full border-2 border-slate-200 focus:border-indigo-400 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none transition placeholder:text-slate-300 resize-none mb-3"
              />

              {/* Email (optional) */}
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Your email <span className="text-slate-300">(optional)</span>
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border-2 border-slate-200 focus:border-indigo-400 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none transition placeholder:text-slate-300 mb-4"
              />

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={!selectedType || !message.trim()}
                className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-black text-base py-4 rounded-2xl transition-all disabled:opacity-35 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
              >
                Send Feedback 📬
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
        >
          <h3 className="font-extrabold text-slate-800 text-base mb-4 flex items-center gap-2">
            <span>❓</span> Frequently Asked Questions
          </h3>
          <div className="space-y-2">
            {FAQ_ITEMS.map((faq, i) => (
              <motion.div
                key={i}
                className="border border-slate-100 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition"
                >
                  <span className="font-bold text-slate-700 text-sm pr-2">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    className="text-slate-400 text-sm flex-shrink-0"
                  >
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-3 text-slate-500 text-xs leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* App info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-slate-100 rounded-2xl p-5 text-center"
        >
          <p className="text-2xl mb-2">🗼</p>
          <p className="font-extrabold text-slate-700 text-sm">Cleo v1.0</p>
          <p className="text-slate-500 text-xs mt-1">
            AI-Powered Paris Student Assistant
          </p>
          <p className="text-slate-400 text-[10px] mt-2">
            Built with ❤️ by Gokul Krishnan
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <a
              href="mailto:gokul.krishnan3210@gmail.com"
              className="text-xs font-bold text-indigo-500 hover:text-indigo-700 transition"
            >
              Email Us
            </a>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
