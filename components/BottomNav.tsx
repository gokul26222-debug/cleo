"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Home",      emoji: "🏠" },
  { href: "/checklist", label: "Checklist", emoji: "✅" },
  { href: "/chat",      label: "Ask Cleo",  emoji: "✨", isAI: true },
  { href: "/explore",   label: "Explore",   emoji: "🗺️" },
  { href: "/support",   label: "Support",   emoji: "🛟" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 z-[60]">
      <div className="flex items-stretch max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;

          if (item.isAI) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center relative -mt-4"
              >
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  animate={{ scale: active ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-0.5 ${
                    active
                      ? "bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-300"
                      : "bg-gradient-to-br from-violet-400 to-purple-500 shadow-purple-200"
                  }`}
                >
                  <span className="text-2xl">💬</span>
                </motion.div>
                <span className={`text-[10px] font-bold transition-colors ${active ? "text-violet-600" : "text-violet-400"}`}>
                  Ask Cleo
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative transition-colors"
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-sky-500 rounded-b-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.span
                animate={{ scale: active ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="text-lg"
              >
                {item.emoji}
              </motion.span>
              <span className={`text-[10px] font-semibold transition-colors ${active ? "text-sky-500" : "text-slate-400"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
