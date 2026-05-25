"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { storage } from "@/lib/storage";
import {
  Appointment, AppointmentType, APPOINTMENT_TYPES,
  getTypeById, getDaysUntil, formatAppointmentDate, safeFormatDate,
} from "@/lib/appointments";

type Tab = "upcoming" | "past";

/* ── Countdown badge ────────────────────────────────────────── */
function CountdownBadge({ dateStr }: { dateStr: string }) {
  const days = getDaysUntil(dateStr);
  if (days < 0) return <span className="text-xs font-bold text-slate-400">Past</span>;
  if (days === 0) return <span className="text-xs font-bold text-red-500 animate-pulse">TODAY!</span>;
  if (days === 1) return <span className="text-xs font-bold text-orange-500">Tomorrow</span>;
  if (days <= 7)  return <span className="text-xs font-bold text-amber-600">In {days} days</span>;
  return <span className="text-xs font-bold text-slate-500">In {days} days</span>;
}

/* ── Book modal ─────────────────────────────────────────────── */
function BookModal({
  onClose, onSave, editAppt,
}: {
  onClose: () => void;
  onSave: (a: Appointment) => void;
  editAppt?: Appointment | null;
}) {
  const [typeId, setTypeId] = useState(editAppt?.typeId ?? "prefecture");
  const [date, setDate]     = useState(editAppt?.date ?? "");
  const [time, setTime]     = useState(editAppt?.time ?? "09:00");
  const [location, setLoc]  = useState(editAppt?.location ?? "");
  const [notes, setNotes]   = useState(editAppt?.notes ?? "");
  // Bug fix #2: skip "type" step when editing — go straight to "details"
  const [step, setStep]     = useState<"type" | "details">(editAppt ? "details" : "type");

  const type: AppointmentType = getTypeById(typeId);

  // Auto-fill location when type changes
  useEffect(() => {
    if (!editAppt) setLoc(type.defaultLocation);
  }, [typeId, type.defaultLocation, editAppt]);

  const canSave = date && time;

  const handleSave = () => {
    const appt: Appointment = {
      id: editAppt?.id ?? Date.now().toString(),
      typeId,
      title: type.label,
      date,
      time,
      location,
      notes,
      // Bug fix #3: preserve existing status when editing — don't reset to "upcoming"
      status: editAppt?.status ?? "upcoming",
      createdAt: editAppt?.createdAt ?? Date.now(),
      reminderSet: editAppt?.reminderSet ?? false,
    };
    onSave(appt);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-[70] flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
      >
        {/* Modal header */}
        <div className={`px-6 pt-6 pb-4 ${type.color}`}>
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-black text-slate-900 text-lg">
              {editAppt ? "Edit Appointment" : "Book Appointment"}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
          </div>
          <p className="text-slate-500 text-xs">
            {step === "type" ? "Choose appointment type" : `${type.emoji} ${type.label}`}
          </p>
        </div>

        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {/* Step 1 — Type picker */}
          {step === "type" && (
            <div className="space-y-2">
              {APPOINTMENT_TYPES.map((t) => (
                <motion.button
                  key={t.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setTypeId(t.id); setStep("details"); }}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${
                    typeId === t.id
                      ? `${t.color} ${t.borderColor} ${t.textColor} font-semibold`
                      : "border-slate-100 hover:border-slate-200 bg-slate-50"
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">{t.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate">{t.label}</p>
                    <p className="text-xs text-slate-400 truncate">{t.description}</p>
                  </div>
                  <span className="text-slate-300 text-lg">›</span>
                </motion.button>
              ))}
            </div>
          )}

          {/* Step 2 — Details */}
          {step === "details" && (
            <div className="space-y-4">
              <button
                onClick={() => setStep("type")}
                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 transition"
              >
                ← Change type
              </button>

              {/* Booking link */}
              {type.bookingUrl && (
                <a
                  href={type.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 ${type.color} ${type.borderColor} border rounded-2xl px-4 py-3 text-sm font-bold ${type.textColor} hover:opacity-80 transition`}
                >
                  <span className="text-lg">{type.emoji}</span>
                  <div>
                    <p className="text-xs opacity-70 font-normal">Book your slot at:</p>
                    <p className="font-bold">{type.bookingLabel} ↗</p>
                  </div>
                </a>
              )}

              {/* Date */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Date *
                </label>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border-2 border-slate-200 focus:border-sky-400 rounded-xl px-4 py-3 text-slate-800 font-semibold outline-none transition"
                />
              </div>

              {/* Time */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Time *
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border-2 border-slate-200 focus:border-sky-400 rounded-xl px-4 py-3 text-slate-800 font-semibold outline-none transition"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLoc(e.target.value)}
                  placeholder="Address or office name"
                  className="w-full border-2 border-slate-200 focus:border-sky-400 rounded-xl px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-300"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Notes / Documents to bring
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Bring passport, RIB, lease..."
                  rows={3}
                  className="w-full border-2 border-slate-200 focus:border-sky-400 rounded-xl px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-300 resize-none text-sm"
                />
              </div>

              {/* Tips */}
              {type.tips.length > 0 && (
                <div className={`${type.color} border ${type.borderColor} rounded-2xl p-4`}>
                  <p className={`font-bold text-xs mb-2 ${type.textColor}`}>💡 Tips for this appointment</p>
                  <ul className="space-y-1">
                    {type.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-slate-600 flex gap-2">
                        <span className="flex-shrink-0 text-slate-400">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save button */}
        {step === "details" && (
          <div className="px-6 pb-6 pt-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={!canSave}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black py-4 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-sky-100 transition"
              style={{ boxShadow: canSave ? "0 4px 0 #0284c7" : "none" }}
            >
              {editAppt ? "Save Changes ✓" : "Add to My Calendar 📅"}
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Main page ──────────────────────────────────────────────── */
export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tab, setTab] = useState<Tab>("upcoming");
  const [showModal, setShowModal] = useState(false);
  const [editAppt, setEditAppt]   = useState<Appointment | null>(null);
  const [toast, setToast]         = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // Bug fix #4: track toast timer to clear it before showing next toast
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!storage.isOnboarded()) { router.replace("/"); return; }
    setAppointments(storage.getAppointments());
  }, [router]);

  // Bug fix #4: clear previous timer before setting new one
  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (appt: Appointment) => {
    let updated: Appointment[];
    if (editAppt) {
      updated = storage.updateAppointment(appt.id, appt);
      showToast("✅ Appointment updated");
    } else {
      updated = storage.addAppointment(appt);
      showToast("📅 Appointment added!");
    }
    setAppointments(updated);
    setShowModal(false);
    setEditAppt(null);
  };

  const markDone = (id: string) => {
    const updated = storage.updateAppointment(id, { status: "completed" });
    setAppointments(updated);
    showToast("✅ Marked as completed!");
  };

  const cancelAppt = (id: string) => {
    const updated = storage.updateAppointment(id, { status: "cancelled" });
    setAppointments(updated);
    showToast("Appointment cancelled");
  };

  // Bug fix #12: allow un-cancelling
  const restoreAppt = (id: string) => {
    const updated = storage.updateAppointment(id, { status: "upcoming" });
    setAppointments(updated);
    setTab("upcoming");
    showToast("📅 Appointment restored!");
  };

  const deleteAppt = (id: string) => {
    const updated = storage.deleteAppointment(id);
    setAppointments(updated);
    showToast("🗑 Deleted");
  };

  const openEdit = (appt: Appointment) => {
    setEditAppt(appt);
    setShowModal(true);
  };

  // Sort and filter
  const upcoming = appointments
    .filter((a) => a.status === "upcoming")
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const past = appointments
    .filter((a) => a.status !== "upcoming")
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

  const displayed = tab === "upcoming" ? upcoming : past;

  const nextAppt = upcoming[0];

  return (
    <div className="min-h-screen bg-slate-50 pb-28">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl z-[80] whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Appointments</h1>
            <p className="text-slate-400 text-xs mt-0.5">
              {upcoming.length} upcoming · {past.length} past
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => { setEditAppt(null); setShowModal(true); }}
            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-sky-100 flex items-center gap-1.5"
          >
            <span className="text-base">+</span> Book
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {(["upcoming", "past"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {t} {t === "upcoming" ? `(${upcoming.length})` : `(${past.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-5 max-w-lg mx-auto space-y-4">

        {/* Next appointment hero card */}
        {tab === "upcoming" && nextAppt && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden card-3d"
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full" />
            <div className="absolute -right-2 -bottom-4 w-16 h-16 bg-white/5 rounded-full" />

            <div className="relative">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-2">Next appointment</p>
              <div className="flex items-start gap-3">
                <span className="text-3xl">{getTypeById(nextAppt.typeId).emoji}</span>
                <div className="flex-1">
                  <h3 className="font-black text-lg leading-tight">{getTypeById(nextAppt.typeId).label}</h3>
                  <p className="text-slate-300 text-sm mt-1">
                    📅 {formatAppointmentDate(nextAppt.date, nextAppt.time)}
                  </p>
                  {nextAppt.location && (
                    <p className="text-slate-400 text-xs mt-1 truncate">📍 {nextAppt.location}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <CountdownBadge dateStr={nextAppt.date} />
                </div>
              </div>

              {nextAppt.notes && (
                <div className="mt-3 bg-white/10 rounded-xl px-3 py-2">
                  <p className="text-xs text-slate-300 leading-relaxed">📝 {nextAppt.notes}</p>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => markDone(nextAppt.id)}
                  className="flex-1 bg-white text-slate-900 font-bold text-xs py-2.5 rounded-xl hover:bg-slate-100 transition"
                >
                  ✓ Mark Done
                </button>
                <button
                  onClick={() => openEdit(nextAppt)}
                  className="flex-1 bg-white/15 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-white/25 transition"
                >
                  ✏️ Edit
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Govt portal quick links — organized by timeline */}
        {tab === "upcoming" && upcoming.length === 0 && (
          <div className="space-y-5">
            {([
              { phase: "before_arrival", label: "Before Arrival", emoji: "📋", desc: "Critical visa & enrollment prep" },
              { phase: "week_1", label: "Week 1", emoji: "🏠", desc: "First arrival essentials" },
              { phase: "month_1", label: "Month 1", emoji: "📅", desc: "Establish stability" },
              { phase: "ongoing", label: "Ongoing Support", emoji: "🍽️", desc: "Essential throughout studies" },
            ] as const).map(({ phase, label, emoji, desc }) => {
              const services = APPOINTMENT_TYPES.filter((t) => t.timeline === phase && t.bookingUrl && t.id !== "other");
              if (services.length === 0) return null;
              return (
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="text-base">{emoji}</span>
                    <div>
                      <p className="text-xs font-black text-slate-700 uppercase tracking-widest">{label}</p>
                      <p className="text-[10px] text-slate-400">{desc}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {services.map((t) => (
                      <a
                        key={t.id}
                        href={t.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${t.color} border ${t.borderColor} rounded-2xl p-3 flex items-center gap-2 hover:opacity-80 transition card-3d relative`}
                      >
                        {/* Status badge */}
                        <span className="absolute top-1.5 right-1.5 text-[8px] font-bold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full leading-none">
                          {t.status === "completed" ? "✅ Done" : t.status === "in_progress" ? "🔄 Active" : "○ Todo"}
                        </span>
                        <span className="text-xl">{t.emoji}</span>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold ${t.textColor} leading-tight truncate`}>{t.label.split("(")[0].trim()}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Book online ↗</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bug fix #7: single upcoming appointment — list below hero is empty, explain it */}
        {tab === "upcoming" && upcoming.length === 1 && (
          <p className="text-xs text-center text-slate-400 font-medium -mt-1">
            That&apos;s your only upcoming appointment. <button onClick={() => { setEditAppt(null); setShowModal(true); }} className="text-sky-500 font-bold hover:text-sky-700">+ Add another</button>
          </p>
        )}

        {/* Appointment list */}
        {displayed.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-slate-100 p-10 text-center shadow-sm"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="text-5xl mb-3"
            >
              {tab === "upcoming" ? "📅" : "✅"}
            </motion.div>
            <p className="text-slate-600 font-bold mb-1">
              {tab === "upcoming" ? "No upcoming appointments" : "No past appointments"}
            </p>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              {tab === "upcoming"
                ? "Add your prefecture, CAF, CPAM appointments to track them all in one place."
                : "Completed appointments will appear here."}
            </p>
            {tab === "upcoming" && (
              <button
                onClick={() => setShowModal(true)}
                className="text-sm text-sky-500 font-bold hover:text-sky-700 transition"
              >
                + Add your first appointment
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            {/* Skip the first upcoming (shown in hero) */}
            {displayed.slice(tab === "upcoming" ? 1 : 0).map((appt, idx) => {
              const type = getTypeById(appt.typeId);
              const expanded = expandedId === appt.id;
              return (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-white rounded-2xl border-2 overflow-hidden shadow-sm transition-all card-3d ${
                    appt.status === "cancelled" ? "opacity-50 border-slate-100" : type.borderColor
                  }`}
                >
                  <button
                    onClick={() => setExpandedId(expanded ? null : appt.id)}
                    className="w-full flex items-center gap-3 p-4 text-left"
                  >
                    <div className={`w-11 h-11 ${type.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <span className="text-xl">{type.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-800 truncate">{type.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {/* Bug fix #6: use safeFormatDate to guard invalid date strings */}
                        {safeFormatDate(appt.date, appt.time)}
                        {appt.status === "completed" && <span className="ml-2 text-green-600 font-semibold">✓ Done</span>}
                        {appt.status === "cancelled" && <span className="ml-2 text-slate-400 font-semibold">Cancelled</span>}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                      {appt.status === "upcoming" && <CountdownBadge dateStr={appt.date} />}
                      <motion.span
                        animate={{ rotate: expanded ? 180 : 0 }}
                        className="text-slate-300 text-sm"
                      >
                        ▼
                      </motion.span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3 border-t border-slate-50 pt-3">
                          {appt.location && (
                            <p className="text-xs text-slate-600 flex items-start gap-2">
                              <span>📍</span> {appt.location}
                            </p>
                          )}
                          {appt.notes && (
                            <p className="text-xs text-slate-600 flex items-start gap-2">
                              <span>📝</span> {appt.notes}
                            </p>
                          )}
                          {type.bookingUrl && (
                            <a
                              href={type.bookingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 text-xs font-bold ${type.textColor} hover:opacity-70 transition`}
                            >
                              <span>{type.emoji}</span> {type.bookingLabel} ↗
                            </a>
                          )}

                          {/* Action buttons */}
                          {appt.status === "upcoming" && (
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => markDone(appt.id)}
                                className="flex-1 bg-green-500 text-white text-xs font-bold py-2 rounded-xl hover:bg-green-600 transition"
                              >
                                ✓ Done
                              </button>
                              <button
                                onClick={() => openEdit(appt)}
                                className="flex-1 bg-slate-100 text-slate-700 text-xs font-bold py-2 rounded-xl hover:bg-slate-200 transition"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => cancelAppt(appt.id)}
                                className="flex-1 bg-red-50 text-red-500 text-xs font-bold py-2 rounded-xl hover:bg-red-100 transition"
                              >
                                ✕ Cancel
                              </button>
                            </div>
                          )}
                          {/* Bug fix #12: allow restoring cancelled appointments */}
                          {appt.status === "cancelled" && (
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => restoreAppt(appt.id)}
                                className="flex-1 bg-sky-50 text-sky-600 text-xs font-bold py-2 rounded-xl hover:bg-sky-100 transition"
                              >
                                ↩ Restore
                              </button>
                              <button
                                onClick={() => deleteAppt(appt.id)}
                                className="flex-1 bg-slate-100 text-slate-500 text-xs font-bold py-2 rounded-xl hover:bg-slate-200 transition"
                              >
                                🗑 Delete
                              </button>
                            </div>
                          )}
                          {appt.status === "completed" && (
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => restoreAppt(appt.id)}
                                className="flex-1 bg-amber-50 text-amber-600 text-xs font-bold py-2 rounded-xl hover:bg-amber-100 transition"
                              >
                                ↩ Mark Upcoming
                              </button>
                              <button
                                onClick={() => deleteAppt(appt.id)}
                                className="flex-1 bg-slate-100 text-slate-500 text-xs font-bold py-2 rounded-xl hover:bg-slate-200 transition"
                              >
                                🗑 Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Ask AI about appointments */}
        <Link href="/chat?q=What+documents+do+I+need+for+my+appointment%3F">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-violet-100 cursor-pointer"
          >
            <span className="text-2xl">💬</span>
            <div>
              <p className="text-white font-bold text-sm">Not sure what to bring?</p>
              <p className="text-violet-200 text-xs">Ask Cléo — she knows every document list</p>
            </div>
            <span className="text-white/60 ml-auto text-lg">›</span>
          </motion.div>
        </Link>
      </div>

      {/* Book modal */}
      <AnimatePresence>
        {showModal && (
          <BookModal
            onClose={() => { setShowModal(false); setEditAppt(null); }}
            onSave={handleSave}
            editAppt={editAppt}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
