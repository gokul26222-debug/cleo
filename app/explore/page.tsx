"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";

type Category = "all" | "museums" | "coworking" | "views" | "parks" | "food" | "culture" | "deals";

interface Place {
  id: string;
  name: string;
  category: Category;
  emoji: string;
  address: string;
  arrondissement: string;
  freeCondition: string;
  description: string;
  tip: string;
  mapUrl: string;
  gradient: string;
  lightBg: string;
}

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "museums", label: "Museums", emoji: "🏛️" },
  { id: "coworking", label: "Study", emoji: "💻" },
  { id: "views", label: "Views", emoji: "🌇" },
  { id: "parks", label: "Parks", emoji: "🌳" },
  { id: "food", label: "Eats", emoji: "🍽️" },
  { id: "culture", label: "Culture", emoji: "🎭" },
  { id: "deals", label: "Deals", emoji: "💰" },
];

const PLACES: Place[] = [
  {
    id: "louvre", name: "Louvre Museum", category: "museums", emoji: "🖼️",
    address: "Rue de Rivoli, 75001 Paris", arrondissement: "1st",
    freeCondition: "FREE under 26 (EU / VLS-TS visa)",
    description: "World's largest art museum. Home to the Mona Lisa, Venus de Milo, and 380,000+ works of art spanning 9,000 years.",
    tip: "Go Wednesday or Friday evenings (open until 9:45 PM). Enter through Porte des Lions for shorter queues.",
    mapUrl: "https://maps.google.com/?q=Louvre+Museum+Paris",
    gradient: "from-amber-400 to-orange-500", lightBg: "bg-amber-50",
  },
  {
    id: "orsay", name: "Musee d'Orsay", category: "museums", emoji: "🎨",
    address: "1 Rue de la Legion d'Honneur, 75007", arrondissement: "7th",
    freeCondition: "FREE under 26 (EU / VLS-TS visa)",
    description: "Impressionist masterpieces by Monet, Renoir, Van Gogh, and Degas in a stunning converted train station.",
    tip: "Thursday evenings open until 9:45 PM. Top floor has the best Impressionist collection and a clock window with Montmartre views.",
    mapUrl: "https://maps.google.com/?q=Musee+d'Orsay+Paris",
    gradient: "from-violet-400 to-purple-500", lightBg: "bg-violet-50",
  },
  {
    id: "pompidou", name: "Centre Pompidou", category: "museums", emoji: "🏗️",
    address: "Place Georges-Pompidou, 75004", arrondissement: "4th",
    freeCondition: "FREE under 26 (EU / VLS-TS visa)",
    description: "Europe's largest modern art museum. Picasso, Kandinsky, Dali. The rooftop terrace is FREE for everyone with the best city views.",
    tip: "The public library (BPI) inside is free with wifi. Rooftop cafe has incredible panoramic views.",
    mapUrl: "https://maps.google.com/?q=Centre+Pompidou+Paris",
    gradient: "from-blue-400 to-cyan-500", lightBg: "bg-blue-50",
  },
  {
    id: "versailles", name: "Chateau de Versailles", category: "museums", emoji: "👑",
    address: "Place d'Armes, 78000 Versailles", arrondissement: "Versailles",
    freeCondition: "FREE under 26 (EU / VLS-TS visa)",
    description: "The legendary palace of Louis XIV. Hall of Mirrors, royal apartments, and 800 hectares of gardens.",
    tip: "Take RER C (covered by Navigo Zone 1-5). Gardens are FREE except Musical Fountain days. Go on weekdays.",
    mapUrl: "https://maps.google.com/?q=Chateau+de+Versailles",
    gradient: "from-yellow-400 to-amber-500", lightBg: "bg-yellow-50",
  },
  {
    id: "orangerie", name: "Musee de l'Orangerie", category: "museums", emoji: "🌸",
    address: "Jardin des Tuileries, 75001", arrondissement: "1st",
    freeCondition: "FREE under 26 (EU / VLS-TS visa)",
    description: "Monet's giant Water Lilies murals in two oval rooms designed specifically for them. Intimate and breathtaking.",
    tip: "Small museum — perfect 1-hour visit. Combine with a walk through the Tuileries Garden right outside.",
    mapUrl: "https://maps.google.com/?q=Musee+de+l'Orangerie+Paris",
    gradient: "from-pink-400 to-rose-500", lightBg: "bg-pink-50",
  },
  {
    id: "qj", name: "QJ — Quartier Jeunes", category: "coworking", emoji: "💻",
    address: "4-6 Place du Louvre, 75001", arrondissement: "1st",
    freeCondition: "FREE for ages 15-30",
    description: "Massive free co-working space. Work, print documents, attend workshops, and meet other students — all free.",
    tip: "Open Tue-Sat. Free printers, workspaces, meeting rooms, and career coaching. Bring student ID.",
    mapUrl: "https://maps.google.com/?q=QJ+Quartier+Jeunes+Paris",
    gradient: "from-cyan-400 to-teal-500", lightBg: "bg-cyan-50",
  },
  {
    id: "bpi", name: "BPI Library (Pompidou)", category: "coworking", emoji: "📚",
    address: "Centre Pompidou, 75004", arrondissement: "4th",
    freeCondition: "FREE — no card needed",
    description: "Best free library in Paris. Free wifi, power outlets, quiet study areas, open until 10 PM most days.",
    tip: "Arrive before 2 PM on weekdays to get a seat. No registration needed — just walk in.",
    mapUrl: "https://maps.google.com/?q=BPI+Centre+Pompidou+Paris",
    gradient: "from-emerald-400 to-green-500", lightBg: "bg-emerald-50",
  },
  {
    id: "bnf", name: "BnF National Library", category: "coworking", emoji: "🏛️",
    address: "Quai Francois Mauriac, 75013", arrondissement: "13th",
    freeCondition: "FREE reading rooms",
    description: "France's national library. Stunning architecture. Upper garden level has free reading rooms with hundreds of seats.",
    tip: "Free level has wifi, power outlets, and wooden desks. The garden between towers is a hidden peaceful spot.",
    mapUrl: "https://maps.google.com/?q=BnF+Francois+Mitterrand+Paris",
    gradient: "from-stone-400 to-stone-500", lightBg: "bg-stone-50",
  },
  {
    id: "galeries-lafayette", name: "Galeries Lafayette Rooftop", category: "views", emoji: "🌇",
    address: "40 Boulevard Haussmann, 75009", arrondissement: "9th",
    freeCondition: "FREE — open access rooftop",
    description: "Stunning 360-degree rooftop view. See the Eiffel Tower, Opera Garnier, Sacre-Coeur, and all of Haussmann's Paris.",
    tip: "Take escalators to the top floor. Best at sunset. The glass dome inside is also worth seeing.",
    mapUrl: "https://maps.google.com/?q=Galeries+Lafayette+Haussmann+Paris",
    gradient: "from-rose-400 to-red-500", lightBg: "bg-rose-50",
  },
  {
    id: "belleville", name: "Parc de Belleville", category: "views", emoji: "🏙️",
    address: "47 Rue des Couronnes, 75020", arrondissement: "20th",
    freeCondition: "FREE — public park 24/7",
    description: "Highest park in Paris with a panoramic terrace overlooking the entire city. Less touristy than Montmartre.",
    tip: "Come at sunset. There's a waterfall cascading down the hill and grapevines on the terraces.",
    mapUrl: "https://maps.google.com/?q=Parc+de+Belleville+Paris",
    gradient: "from-green-400 to-emerald-500", lightBg: "bg-green-50",
  },
  {
    id: "sacre-coeur", name: "Sacre-Coeur Steps", category: "views", emoji: "⛪",
    address: "35 Rue du Chevalier de la Barre, 75018", arrondissement: "18th",
    freeCondition: "FREE — basilica and steps free",
    description: "Iconic white basilica at the top of Montmartre. The steps offer one of the most famous views of Paris.",
    tip: "Take the funicular (Navigo pass works). Come early morning. Artists' square Place du Tertre is nearby.",
    mapUrl: "https://maps.google.com/?q=Sacre+Coeur+Paris",
    gradient: "from-slate-400 to-slate-600", lightBg: "bg-slate-50",
  },
  {
    id: "luxembourg", name: "Jardin du Luxembourg", category: "parks", emoji: "🌳",
    address: "75006 Paris", arrondissement: "6th",
    freeCondition: "FREE — open daily",
    description: "Paris's most beloved garden. Green chairs by the fountain, joggers, chess players, and the most Parisian vibes.",
    tip: "Grab iconic green metal chairs by the Grand Bassin. Free tennis courts available. Perfect study spot.",
    mapUrl: "https://maps.google.com/?q=Jardin+du+Luxembourg+Paris",
    gradient: "from-lime-400 to-green-500", lightBg: "bg-lime-50",
  },
  {
    id: "buttes-chaumont", name: "Buttes-Chaumont", category: "parks", emoji: "🏔️",
    address: "1 Rue Botzaris, 75019", arrondissement: "19th",
    freeCondition: "FREE — open daily",
    description: "A dramatic park with cliffs, a lake, waterfalls, a suspension bridge, and a temple on top of a rocky island.",
    tip: "Climb to Temple de la Sibylle for amazing views. Rosa Bonheur bar is great for sunset drinks.",
    mapUrl: "https://maps.google.com/?q=Buttes+Chaumont+Paris",
    gradient: "from-teal-400 to-cyan-500", lightBg: "bg-teal-50",
  },
  {
    id: "crous-resto", name: "CROUS Restaurants", category: "food", emoji: "🍽️",
    address: "Near every university", arrondissement: "All Paris",
    freeCondition: "Full meal for just 3.30 EUR",
    description: "3-course meal (starter, main, dessert) for 3.30 EUR with IZLY account. Available to all students.",
    tip: "Download IZLY app. Go 11:30-13:30 for best selection. Some locations have evening service too.",
    mapUrl: "https://maps.google.com/?q=CROUS+restaurant+universitaire+Paris",
    gradient: "from-orange-400 to-red-500", lightBg: "bg-orange-50",
  },
  {
    id: "linkee", name: "Linkee Paris — Free Meals", category: "food", emoji: "🍲",
    address: "Multiple points across Paris", arrondissement: "All Paris",
    freeCondition: "100% FREE — no check needed",
    description: "Free meal distributions for students. Volunteers hand out quality food packages multiple times per week.",
    tip: "Download Linkee app for nearest distribution point. No questions asked — just show up with a bag.",
    mapUrl: "https://maps.google.com/?q=Linkee+Paris",
    gradient: "from-red-400 to-rose-500", lightBg: "bg-red-50",
  },
  {
    id: "toogoodtogo", name: "Too Good To Go", category: "food", emoji: "🥖",
    address: "App-based — across Paris", arrondissement: "All Paris",
    freeCondition: "Surprise bags 2-5 EUR (worth 10-15 EUR)",
    description: "Buy leftover food from bakeries and restaurants at 70% off. Perfect way to eat well on a budget.",
    tip: "Set alerts for bakeries near home. Best picks at 7-8 PM when shops close. Paul and Monoprix have great bags.",
    mapUrl: "https://toogoodtogo.com",
    gradient: "from-emerald-400 to-teal-500", lightBg: "bg-emerald-50",
  },
  {
    id: "fete-musique", name: "Fete de la Musique", category: "culture", emoji: "🎵",
    address: "Everywhere in Paris", arrondissement: "June 21st",
    freeCondition: "FREE — the city becomes a concert",
    description: "Every June 21st, musicians take over every street, park, and square. Every genre, all free, all night.",
    tip: "Head to Le Marais, Bastille, or Canal Saint-Martin for the best vibes. Runs until late at night.",
    mapUrl: "https://maps.google.com/?q=Paris+France",
    gradient: "from-purple-400 to-violet-500", lightBg: "bg-purple-50",
  },
  {
    id: "nuit-blanche", name: "Nuit Blanche", category: "culture", emoji: "🌙",
    address: "Across Paris", arrondissement: "October",
    freeCondition: "FREE — all-night art festival",
    description: "One night a year, Paris stays up for art. Museums and public spaces host free installations and performances.",
    tip: "Plan your route with the official map. Wear comfortable shoes. Metro runs all night during Nuit Blanche.",
    mapUrl: "https://maps.google.com/?q=Paris+France",
    gradient: "from-indigo-400 to-blue-500", lightBg: "bg-indigo-50",
  },
  {
    id: "cinema", name: "Student Cinema", category: "culture", emoji: "🎬",
    address: "UGC & MK2 cinemas", arrondissement: "All Paris",
    freeCondition: "Student price: 5-7 EUR (normally 14 EUR)",
    description: "UGC Illimite card: unlimited films for 21.90 EUR/month under 26. Tuesday is discount day everywhere.",
    tip: "UGC Illimite pays off at 3+ films/month. Many films shown in VO (original language with French subs).",
    mapUrl: "https://maps.google.com/?q=UGC+cinema+Paris",
    gradient: "from-sky-400 to-blue-500", lightBg: "bg-sky-50",
  },
  {
    id: "navigo", name: "Navigo Imagine R", category: "deals", emoji: "🚇",
    address: "imagine-r.com", arrondissement: "All Zones",
    freeCondition: "50% off transport — 39.10 EUR/month",
    description: "Student transport pass covers ALL Paris zones. Half price for students under 26.",
    tip: "Apply at imagine-r.com with student certificate. Takes 2-3 weeks. Use regular Navigo while waiting.",
    mapUrl: "https://www.imagine-r.com/",
    gradient: "from-blue-500 to-indigo-600", lightBg: "bg-blue-50",
  },
  {
    id: "velib", name: "Velib Student", category: "deals", emoji: "🚴",
    address: "Stations everywhere", arrondissement: "All Paris",
    freeCondition: "37.20 EUR/year — first 30 min free",
    description: "20,000+ bikes across Paris. Student plan gives first 30 minutes free on every ride.",
    tip: "Download Velib app. Always dock properly (wait for green light). V-Box plan is cheapest.",
    mapUrl: "https://www.velib-metropole.fr/",
    gradient: "from-lime-400 to-green-500", lightBg: "bg-lime-50",
  },
  {
    id: "spotify", name: "Spotify / Apple Music", category: "deals", emoji: "🎧",
    address: "Online", arrondissement: "Online",
    freeCondition: "50% off — 5.99 EUR/month",
    description: "Both Spotify Premium and Apple Music offer 50% student discounts. Verify with university email.",
    tip: "Use your .edu or .fr email to verify. Re-verify annually to keep the discount.",
    mapUrl: "https://www.spotify.com/student/",
    gradient: "from-green-400 to-emerald-500", lightBg: "bg-green-50",
  },
];

/* ── Floating emojis for hero ── */
const FLOATING_EMOJIS = ["🗼", "🥐", "🎨", "🚴", "🍷", "🌹", "📸", "🎵", "☕", "🥖"];

function FloatingEmoji({ emoji, delay, x, duration }: { emoji: string; delay: number; x: number; duration: number }) {
  return (
    <motion.span
      initial={{ y: 120, opacity: 0, x }}
      animate={{ y: -40, opacity: [0, 1, 1, 0], x: x + (Math.random() > 0.5 ? 20 : -20) }}
      transition={{ delay, duration, repeat: Infinity, repeatDelay: duration + delay, ease: "easeOut" }}
      className="absolute text-2xl pointer-events-none select-none"
      style={{ left: `${(x / 400) * 100}%` }}
    >
      {emoji}
    </motion.span>
  );
}

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [expandedPlace, setExpandedPlace] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Load saved from localStorage
  useEffect(() => {
    try {
      const s = localStorage.getItem("cleo_saved_places");
      if (s) setSaved(new Set(JSON.parse(s)));
    } catch { /* ignore */ }
  }, []);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem("cleo_saved_places", JSON.stringify(Array.from(next))); } catch { /* ignore */ }
      return next;
    });
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 1500);
  };

  const filteredPlaces = PLACES
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.freeCondition.toLowerCase().includes(search.toLowerCase()));

  const totalSavings = "500+";

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* ── HERO HEADER ── */}
      <div className="relative bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 px-6 pt-14 pb-10 text-white overflow-hidden">
        {/* Floating emojis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {FLOATING_EMOJIS.map((emoji, i) => (
            <FloatingEmoji
              key={i}
              emoji={emoji}
              delay={i * 0.8}
              x={30 + (i * 37) % 340}
              duration={4 + (i % 3)}
            />
          ))}
        </div>

        {/* Decorative circles */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute -left-8 bottom-4 w-32 h-32 bg-white/5 rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-extrabold tracking-tight">Cleo</span>
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-xs bg-white/20 px-3 py-1.5 rounded-full font-bold backdrop-blur-sm"
            >
              {PLACES.length} free spots
            </motion.span>
          </div>

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black tracking-tight leading-tight"
          >
            Paris on a
            <br />
            <span className="relative">
              Budget
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-1 left-0 h-1.5 bg-yellow-300 rounded-full"
              />
            </span>
            {" "}🗺️
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-rose-100 text-sm mt-3 max-w-xs"
          >
            Free museums, cheap eats, and student deals. Everything you need to enjoy Paris without breaking the bank.
          </motion.p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 flex gap-3 mt-5"
        >
          {[
            { value: "22", label: "Free Spots", emoji: "📍" },
            { value: totalSavings, label: "EUR Saved/yr", emoji: "💰" },
            { value: "8", label: "Categories", emoji: "🏷️" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex-1 bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center"
            >
              <span className="text-lg">{stat.emoji}</span>
              <p className="text-xl font-black">{stat.value}</p>
              <p className="text-[9px] text-rose-200 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* VLS-TS tip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 mt-4 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3"
        >
          <motion.span
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-2xl"
          >
            🎓
          </motion.span>
          <p className="text-white/90 text-xs leading-relaxed">
            <span className="font-bold">Student ID + VLS-TS visa</span> = Most Paris museums are completely <span className="font-bold underline decoration-yellow-300">FREE for under 26!</span>
          </p>
        </motion.div>
      </div>

      <div className="px-5 -mt-5 max-w-lg mx-auto relative z-10">
        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <div className="glass rounded-2xl shadow-lg shadow-rose-100/50 overflow-hidden">
            <div className="flex items-center px-4 py-3 gap-3">
              <span className="text-slate-400">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search free places, deals..."
                className="flex-1 text-sm text-slate-800 font-medium outline-none placeholder:text-slate-300"
              />
              {search && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearch("")}
                  className="text-slate-400 hover:text-slate-600 text-sm"
                >
                  ✕
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-4 -mx-1"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
            {CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.04 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-200/50 scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-50 shadow-sm border border-slate-100"
                }`}
              >
                <motion.span
                  animate={activeCategory === cat.id ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {cat.emoji}
                </motion.span>
                {cat.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <p className="text-xs font-bold text-slate-400 mb-3 px-1">
          {filteredPlaces.length} {filteredPlaces.length === 1 ? "place" : "places"} found
          {saved.size > 0 && <span className="text-rose-400 ml-2">({saved.size} saved)</span>}
        </p>

        {/* Places grid */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredPlaces.map((place, i) => (
              <motion.div
                key={place.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 25 }}
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setExpandedPlace(expandedPlace === place.id ? null : place.id)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer transition-shadow hover:shadow-lg card-3d"
                >
                  {/* Gradient top stripe */}
                  <div className={`h-1.5 bg-gradient-to-r ${place.gradient}`} />

                  {/* Card content */}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Emoji with gradient bg */}
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        className={`w-12 h-12 ${place.lightBg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm`}
                      >
                        {place.emoji}
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-extrabold text-sm text-slate-800 truncate">
                            {place.name}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Save button */}
                            <motion.button
                              whileTap={{ scale: 0.7 }}
                              onClick={(e) => toggleSave(place.id, e)}
                              className="text-lg"
                            >
                              <motion.span
                                animate={saved.has(place.id) ? { scale: [1, 1.4, 1] } : {}}
                                transition={{ duration: 0.3 }}
                              >
                                {saved.has(place.id) ? "❤️" : "🤍"}
                              </motion.span>
                            </motion.button>
                            {/* Expand arrow */}
                            <motion.span
                              animate={{ rotate: expandedPlace === place.id ? 180 : 0 }}
                              className="text-slate-300 text-xs"
                            >
                              ▼
                            </motion.span>
                          </div>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">{place.arrondissement}</p>

                        {/* Free badge */}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.04 }}
                          className="mt-2 inline-flex items-center gap-1.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-2.5 py-1 rounded-lg border border-green-100"
                        >
                          <span className="text-[10px]">✅</span>
                          <span className="text-[10px] font-bold">{place.freeCondition}</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded section */}
                  <AnimatePresence>
                    {expandedPlace === place.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3">
                          <div className={`h-px bg-gradient-to-r ${place.gradient} opacity-20`} />

                          <p className="text-slate-600 text-xs leading-relaxed">
                            {place.description}
                          </p>

                          {/* Pro tip card */}
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`${place.lightBg} rounded-xl p-3 border border-slate-100/50`}
                          >
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                              💡 Pro Tip
                            </p>
                            <p className="text-slate-700 text-xs leading-relaxed font-medium">
                              {place.tip}
                            </p>
                          </motion.div>

                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>📍</span>
                            <span className="font-medium">{place.address}</span>
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2">
                            <a
                              href={place.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`flex-1 text-center bg-gradient-to-r ${place.gradient} text-white font-bold text-xs py-3 rounded-xl shadow-lg hover:opacity-90 transition`}
                            >
                              Open in Maps 📍
                            </a>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => toggleSave(place.id, e)}
                              className={`px-4 py-3 rounded-xl border-2 font-bold text-xs transition ${
                                saved.has(place.id)
                                  ? "border-rose-300 bg-rose-50 text-rose-600"
                                  : "border-slate-200 text-slate-500 hover:border-rose-200"
                              }`}
                            >
                              {saved.has(place.id) ? "Saved ❤️" : "Save 🤍"}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredPlaces.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <span className="text-5xl">🔍</span>
            <p className="text-slate-500 font-bold mt-3">No places found</p>
            <p className="text-slate-400 text-xs mt-1">Try a different search or category</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSearch(""); setActiveCategory("all"); }}
              className="mt-3 text-xs font-bold text-orange-500 hover:text-orange-700"
            >
              Clear filters
            </motion.button>
          </motion.div>
        )}

        {/* Bottom card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl p-5 text-white shadow-xl shadow-rose-200/50 relative overflow-hidden"
        >
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full" />
          <div className="relative z-10">
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-3xl"
            >
              🎓
            </motion.span>
            <h3 className="font-black text-base mt-2">Student ID = Free Paris</h3>
            <p className="text-rose-100 text-xs leading-relaxed mt-1">
              Always carry your student ID and VLS-TS visa. Most museums, cultural sites, and transport discounts require proof of age (under 26) and a valid French visa.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Save toast */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-5 py-3 rounded-full shadow-2xl z-[80]"
          >
            ❤️ Saved to your favorites!
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
