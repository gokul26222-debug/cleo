"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Home",      emoji: "🏠" },
  { href: "/checklist", label: "Checklist", emoji: "✅" },
  { href: "/chat",      label: "Ask Cleo",  emoji: "💬", isAI: true },
  { href: "/explore",   label: "Explore",   emoji: "🗺️" },
  { href: "/support",   label: "Support",   emoji: "🛟" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-100 z-[60]">
      <div className="flex items-stretch max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;

          if (item.isAI) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center relative -mt-5"
              >
                <motion.div
                  whileTap={{ scale: 0.9, y: 3 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-0.5 ${
                    active ? "bg-[#58cc02]" : "bg-[#58cc02]"
                  }`}
                  style={{ boxShadow: active ? "0 4px 0 #46a302" : "0 5px 0 #46a302" }}
                >
                  <span className="text-2xl">💬</span>
                </motion.div>
                <span className="text-[9px] font-black text-[#58cc02]">Ask Cleo</span>
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
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#58cc02] rounded-b-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.span
                animate={{ scale: active ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="text-xl"
              >
                {item.emoji}
              </motion.span>
              <span className={`text-[9px] font-black transition-colors ${active ? "text-[#58cc02]" : "text-slate-400"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
