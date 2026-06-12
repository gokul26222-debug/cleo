"use client";

import { motion } from "framer-motion";

export interface MetroStop {
  day: number;
  emoji: string;
  label: string;
  done: boolean;
}

interface MetroLineProps {
  stops: MetroStop[];
  currentDay: number;
  onSelect?: (day: number) => void;
  /** Light variant for dark/colored headers */
  onDark?: boolean;
}

/**
 * Paris métro-style progress line: 7 stops, an animated train at the
 * current stop, completed stops filled like a real métro map.
 */
export default function MetroLine({ stops, currentDay, onSelect, onDark = false }: MetroLineProps) {
  const lastDoneIdx = stops.reduce((acc, s, i) => (s.done ? i : acc), -1);
  const fillPct = stops.length > 1 ? (Math.max(lastDoneIdx, 0) / (stops.length - 1)) * 100 : 0;

  const railBg = onDark ? "bg-white/25" : "bg-slate-200";
  const railFill = onDark ? "bg-ticket" : "bg-metro";

  return (
    <div className="relative px-1 pt-7 pb-1">
      {/* Rail */}
      <div className={`absolute left-3 right-3 top-[38px] h-1.5 rounded-full ${railBg}`} />
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `calc(${fillPct}% - ${fillPct > 0 ? 6 : 0}px)` }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute left-3 top-[38px] h-1.5 rounded-full ${railFill}`}
      />

      {/* Stops */}
      <div className="relative flex items-start justify-between">
        {stops.map((stop) => {
          const isCurrent = stop.day === currentDay;
          const Wrapper = onSelect ? motion.button : motion.div;
          return (
            <Wrapper
              key={stop.day}
              {...(onSelect ? { onClick: () => onSelect(stop.day), whileTap: { scale: 0.9 } } : {})}
              className="flex flex-col items-center gap-1 relative"
            >
              {/* Train hovers above the current stop */}
              {isCurrent && (
                <motion.span
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  className="absolute -top-7 text-lg drop-shadow"
                >
                  🚇
                </motion.span>
              )}
              <motion.span
                animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-5 h-5 rounded-full border-[3px] flex items-center justify-center text-[9px] z-10 ${
                  stop.done
                    ? onDark
                      ? "bg-ticket border-ticket"
                      : "bg-metro border-metro"
                    : isCurrent
                    ? onDark
                      ? "bg-white border-ticket ring-4 ring-ticket/30"
                      : "bg-white border-metro ring-4 ring-metro/20"
                    : onDark
                    ? "bg-white/30 border-white/40"
                    : "bg-white border-slate-300"
                }`}
              >
                {stop.done && <span className={onDark ? "text-metro" : "text-white"}>✓</span>}
              </motion.span>
              <span
                className={`text-[10px] font-bold leading-none ${
                  stop.done
                    ? onDark
                      ? "text-ticket"
                      : "text-metro"
                    : isCurrent
                    ? onDark
                      ? "text-white"
                      : "text-metro"
                    : onDark
                    ? "text-white/50"
                    : "text-slate-400"
                }`}
              >
                {stop.emoji}
              </span>
              <span
                className={`text-[9px] font-semibold leading-none ${
                  isCurrent ? (onDark ? "text-white" : "text-metro") : onDark ? "text-white/50" : "text-slate-400"
                }`}
              >
                {stop.day}
              </span>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
