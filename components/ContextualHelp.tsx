"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { CONTEXTUAL_HELP } from "@/lib/helpData";

export default function ContextualHelp() {
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  const contextHelp = CONTEXTUAL_HELP[pathname as keyof typeof CONTEXTUAL_HELP];

  // Don't show on help/support pages or if no contextual help exists
  if (!contextHelp || pathname?.includes("/support") || pathname?.includes("/help") || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 mb-6 relative"
      >
        {/* Content */}
        <div className="pr-6">
          <h3 className="font-bold text-sm text-slate-800 mb-2">
            💡 {contextHelp.title}
          </h3>
          <div className="space-y-1.5">
            {contextHelp.tips.map((tip, i) => (
              <p key={i} className="text-xs text-slate-600 leading-snug">
                ✨ {tip}
              </p>
            ))}
          </div>
          {contextHelp.video && (
            <a
              href={contextHelp.video}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 font-semibold hover:underline inline-block mt-2"
            >
              📺 Watch Tutorial →
            </a>
          )}
        </div>

        {/* Close Button */}
        <motion.button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition text-lg"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
