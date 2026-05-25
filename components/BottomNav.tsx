"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard",     label: "Home",         emoji: "🏠" },
  { href: "/chat",          label: "Ask Cleo",     emoji: "💬" },
  { href: "/explore",       label: "Explore",      emoji: "🗺️" },
  { href: "/appointments",  label: "Appointments", emoji: "📅" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/30 z-[60] shadow-[0_-4px_30px_rgba(0,0,0,0.05)]">
      <div className="flex items-stretch max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
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
