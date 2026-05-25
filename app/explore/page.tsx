"use client";

import { useState } from "react";
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
  color: string;
  textColor: string;
  borderColor: string;
}

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "museums", label: "Museums", emoji: "🏛️" },
  { id: "coworking", label: "Co-working", emoji: "💻" },
  { id: "views", label: "Views", emoji: "🌇" },
  { id: "parks", label: "Parks", emoji: "🌳" },
  { id: "food", label: "Cheap Eats", emoji: "🍽️" },
  { id: "culture", label: "Culture", emoji: "🎭" },
  { id: "deals", label: "Deals", emoji: "💰" },
];

const PLACES: Place[] = [
  // === MUSEUMS (Free for under 26 EU residents / VLS-TS visa holders) ===
  {
    id: "louvre",
    name: "Louvre Museum",
    category: "museums",
    emoji: "🖼️",
    address: "Rue de Rivoli, 75001 Paris",
    arrondissement: "1st",
    freeCondition: "FREE for under 26 (EU residents & VLS-TS visa holders)",
    description: "World's largest art museum. Home to the Mona Lisa, Venus de Milo, and 380,000+ works of art.",
    tip: "Go on Wednesday or Friday evenings (open until 9:45 PM) to avoid crowds. Enter through Porte des Lions for shorter queues.",
    mapUrl: "https://maps.google.com/?q=Louvre+Museum+Paris",
    color: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
  {
    id: "orsay",
    name: "Musee d'Orsay",
    category: "museums",
    emoji: "🎨",
    address: "1 Rue de la Legion d'Honneur, 75007 Paris",
    arrondissement: "7th",
    freeCondition: "FREE for under 26 (EU residents & VLS-TS visa holders)",
    description: "Impressionist masterpieces by Monet, Renoir, Van Gogh, and Degas in a stunning converted train station.",
    tip: "Visit Thursday evenings (open until 9:45 PM). The top floor has the best Impressionist collection and a clock window with a view of Montmartre.",
    mapUrl: "https://maps.google.com/?q=Musee+d'Orsay+Paris",
    color: "bg-violet-50",
    textColor: "text-violet-700",
    borderColor: "border-violet-200",
  },
  {
    id: "pompidou",
    name: "Centre Pompidou",
    category: "museums",
    emoji: "🏗️",
    address: "Place Georges-Pompidou, 75004 Paris",
    arrondissement: "4th",
    freeCondition: "FREE for under 26 (EU residents & VLS-TS visa holders)",
    description: "Europe's largest modern art museum. Works by Picasso, Kandinsky, Dali, and contemporary artists.",
    tip: "The rooftop terrace is FREE for everyone and offers one of the best views of Paris. The public library (BPI) inside is free with wifi.",
    mapUrl: "https://maps.google.com/?q=Centre+Pompidou+Paris",
    color: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
  },
  {
    id: "versailles",
    name: "Chateau de Versailles",
    category: "museums",
    emoji: "👑",
    address: "Place d'Armes, 78000 Versailles",
    arrondissement: "Versailles",
    freeCondition: "FREE for under 26 (EU residents & VLS-TS visa holders)",
    description: "The legendary palace of Louis XIV. Hall of Mirrors, royal apartments, and 800 hectares of gardens.",
    tip: "Take RER C to Versailles Rive Gauche (covered by Navigo pass Zone 1-5). The gardens are FREE except on Musical Fountain days. Go on a weekday to avoid crowds.",
    mapUrl: "https://maps.google.com/?q=Chateau+de+Versailles",
    color: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200",
  },
  {
    id: "orangerie",
    name: "Musee de l'Orangerie",
    category: "museums",
    emoji: "🌸",
    address: "Jardin des Tuileries, 75001 Paris",
    arrondissement: "1st",
    freeCondition: "FREE for under 26 (EU residents & VLS-TS visa holders)",
    description: "Monet's giant Water Lilies murals displayed in two oval rooms designed specifically for them. Intimate and breathtaking.",
    tip: "Small museum — perfect for a 1-hour visit. Combine with a walk through the Tuileries Garden right outside.",
    mapUrl: "https://maps.google.com/?q=Musee+de+l'Orangerie+Paris",
    color: "bg-pink-50",
    textColor: "text-pink-700",
    borderColor: "border-pink-200",
  },

  // === CO-WORKING & FREE SPACES ===
  {
    id: "qj",
    name: "QJ — Quartier Jeunes",
    category: "coworking",
    emoji: "💻",
    address: "4-6 Place du Louvre, 75001 Paris",
    arrondissement: "1st",
    freeCondition: "FREE for all youth aged 15-30",
    description: "A massive free co-working space for young people. Work, print documents, attend workshops, and meet other students — all for free.",
    tip: "Open Tuesday-Saturday. They have free printers, workspaces, meeting rooms, and even host free career coaching sessions. Bring your student ID.",
    mapUrl: "https://maps.google.com/?q=QJ+Quartier+Jeunes+Paris",
    color: "bg-cyan-50",
    textColor: "text-cyan-700",
    borderColor: "border-cyan-200",
  },
  {
    id: "bpi",
    name: "BPI — Public Library (Pompidou)",
    category: "coworking",
    emoji: "📚",
    address: "Centre Pompidou, 75004 Paris",
    arrondissement: "4th",
    freeCondition: "FREE for everyone — no card needed",
    description: "The best free library in Paris. Free wifi, power outlets, quiet study areas, and open until 10 PM most days.",
    tip: "Arrive before 2 PM on weekdays to get a seat. Weekends are packed. No registration needed — just walk in.",
    mapUrl: "https://maps.google.com/?q=BPI+Bibliotheque+Centre+Pompidou+Paris",
    color: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
  },
  {
    id: "bnf",
    name: "BnF — National Library of France",
    category: "coworking",
    emoji: "🏛️",
    address: "Quai Francois Mauriac, 75013 Paris",
    arrondissement: "13th",
    freeCondition: "FREE reading rooms (Haut-de-jardin level)",
    description: "France's national library with stunning architecture. The upper garden level reading rooms are free with hundreds of seats.",
    tip: "The free level has wifi, power outlets, and beautiful wooden desks. The garden between the towers is a hidden peaceful spot.",
    mapUrl: "https://maps.google.com/?q=BnF+Francois+Mitterrand+Paris",
    color: "bg-stone-50",
    textColor: "text-stone-700",
    borderColor: "border-stone-200",
  },

  // === PANORAMIC VIEWS ===
  {
    id: "galeries-lafayette",
    name: "Galeries Lafayette Rooftop",
    category: "views",
    emoji: "🌇",
    address: "40 Boulevard Haussmann, 75009 Paris",
    arrondissement: "9th",
    freeCondition: "FREE — open access rooftop terrace",
    description: "Stunning 360-degree rooftop view of Paris. See the Eiffel Tower, Opera Garnier, Sacre-Coeur, and all of Haussmann's Paris.",
    tip: "Take the escalators all the way to the top floor. Best at sunset. The glass dome inside the store is also worth seeing.",
    mapUrl: "https://maps.google.com/?q=Galeries+Lafayette+Haussmann+Paris",
    color: "bg-rose-50",
    textColor: "text-rose-700",
    borderColor: "border-rose-200",
  },
  {
    id: "belleville",
    name: "Parc de Belleville",
    category: "views",
    emoji: "🏙️",
    address: "47 Rue des Couronnes, 75020 Paris",
    arrondissement: "20th",
    freeCondition: "FREE — public park, open 24/7",
    description: "The highest park in Paris with a panoramic terrace overlooking the entire city. Less touristy than Montmartre.",
    tip: "Come at sunset for the best view. There's a waterfall cascading down the hill and grapevines growing on the terraces. Locals love this spot.",
    mapUrl: "https://maps.google.com/?q=Parc+de+Belleville+Paris",
    color: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
  },
  {
    id: "sacre-coeur",
    name: "Sacre-Coeur Steps",
    category: "views",
    emoji: "⛪",
    address: "35 Rue du Chevalier de la Barre, 75018 Paris",
    arrondissement: "18th",
    freeCondition: "FREE — the basilica and steps are free (skip the dome)",
    description: "Iconic white basilica at the top of Montmartre. The steps offer one of the most famous views of Paris.",
    tip: "Take the funicular (covered by Navigo pass) to avoid climbing the stairs. Come early morning to beat crowds. The artists' square Place du Tertre is nearby.",
    mapUrl: "https://maps.google.com/?q=Sacre+Coeur+Paris",
    color: "bg-slate-50",
    textColor: "text-slate-700",
    borderColor: "border-slate-200",
  },

  // === PARKS & GREEN SPACES ===
  {
    id: "luxembourg",
    name: "Jardin du Luxembourg",
    category: "parks",
    emoji: "🌳",
    address: "75006 Paris",
    arrondissement: "6th",
    freeCondition: "FREE — open daily",
    description: "Paris's most beloved garden. Green chairs by the fountain, joggers, chess players, and the most Parisian vibes you'll find.",
    tip: "Grab the iconic green metal chairs and sit by the Grand Bassin (fountain). Free tennis courts available to book. Perfect study spot on warm days.",
    mapUrl: "https://maps.google.com/?q=Jardin+du+Luxembourg+Paris",
    color: "bg-lime-50",
    textColor: "text-lime-700",
    borderColor: "border-lime-200",
  },
  {
    id: "buttes-chaumont",
    name: "Parc des Buttes-Chaumont",
    category: "parks",
    emoji: "🏔️",
    address: "1 Rue Botzaris, 75019 Paris",
    arrondissement: "19th",
    freeCondition: "FREE — open daily",
    description: "A dramatic park with cliffs, a lake, waterfalls, a suspension bridge, and a temple on top of a rocky island.",
    tip: "Climb to the Temple de la Sibylle for an amazing view. Rosa Bonheur bar inside the park is great for sunset drinks. Popular with local students.",
    mapUrl: "https://maps.google.com/?q=Buttes+Chaumont+Paris",
    color: "bg-teal-50",
    textColor: "text-teal-700",
    borderColor: "border-teal-200",
  },

  // === CHEAP EATS ===
  {
    id: "crous-resto",
    name: "CROUS University Restaurants",
    category: "food",
    emoji: "🍽️",
    address: "Multiple locations near every university",
    arrondissement: "All Paris",
    freeCondition: "Student meal for just 3.30 EUR with student card",
    description: "Full 3-course meal (starter, main, dessert) for only 3.30 EUR. Available to all students with a valid IZLY account.",
    tip: "Download the IZLY app and load money onto it. Go between 11:30-13:30 for the best selection. Some locations have evening service too.",
    mapUrl: "https://maps.google.com/?q=CROUS+restaurant+universitaire+Paris",
    color: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
  },
  {
    id: "linkee",
    name: "Linkee Paris — Free Meals",
    category: "food",
    emoji: "🍲",
    address: "Multiple distribution points across Paris",
    arrondissement: "All Paris",
    freeCondition: "FREE — no eligibility check needed",
    description: "Free meal distributions for students. Volunteers hand out quality food packages multiple times per week across Paris.",
    tip: "Download the Linkee app to find the nearest distribution point and schedule. No questions asked — just show up with a bag.",
    mapUrl: "https://maps.google.com/?q=Linkee+Paris",
    color: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
  },
  {
    id: "toogoodtogo",
    name: "Too Good To Go",
    category: "food",
    emoji: "🥖",
    address: "App-based — bakeries & restaurants across Paris",
    arrondissement: "All Paris",
    freeCondition: "Surprise bags from 2-5 EUR (worth 10-15 EUR)",
    description: "Buy leftover food from bakeries, restaurants, and supermarkets at 70% off. Perfect way to eat well on a budget.",
    tip: "Set alerts for bakeries near your home. Best picks at 7-8 PM when shops close. Paul, Carrefour, and Monoprix regularly have great bags.",
    mapUrl: "https://toogoodtogo.com",
    color: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
  },

  // === CULTURE & EVENTS ===
  {
    id: "fete-musique",
    name: "Fete de la Musique (June 21)",
    category: "culture",
    emoji: "🎵",
    address: "Everywhere in Paris",
    arrondissement: "All Paris",
    freeCondition: "FREE — the entire city becomes a concert",
    description: "Every June 21st, musicians take over every street corner, park, and square in Paris. Every genre, all free, all night long.",
    tip: "Head to Le Marais, Bastille, or Canal Saint-Martin for the best atmosphere. Runs until late at night. An unforgettable Paris experience.",
    mapUrl: "https://maps.google.com/?q=Paris+France",
    color: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
  },
  {
    id: "nuit-blanche",
    name: "Nuit Blanche (October)",
    category: "culture",
    emoji: "🌙",
    address: "Across Paris — different locations each year",
    arrondissement: "All Paris",
    freeCondition: "FREE — all-night contemporary art festival",
    description: "One night a year, Paris stays up all night for art. Museums, monuments, and public spaces host free installations and performances.",
    tip: "Plan your route in advance using the official Nuit Blanche map. Wear comfortable shoes — you'll walk a lot. Metro runs all night during Nuit Blanche.",
    mapUrl: "https://maps.google.com/?q=Paris+France",
    color: "bg-indigo-50",
    textColor: "text-indigo-700",
    borderColor: "border-indigo-200",
  },
  {
    id: "cinema",
    name: "Student Cinema (UGC / MK2)",
    category: "culture",
    emoji: "🎬",
    address: "UGC & MK2 cinemas across Paris",
    arrondissement: "All Paris",
    freeCondition: "Student price: 5-7 EUR instead of 14 EUR",
    description: "Watch the latest movies at student prices. UGC Illimite card gives unlimited films for 21.90 EUR/month (under 26).",
    tip: "UGC Illimite is the best deal if you watch 3+ films per month. Tuesday is discount day at most cinemas. Many films are shown in VO (original version with French subtitles).",
    mapUrl: "https://maps.google.com/?q=UGC+cinema+Paris",
    color: "bg-sky-50",
    textColor: "text-sky-700",
    borderColor: "border-sky-200",
  },

  // === STUDENT DEALS ===
  {
    id: "navigo-imagine-r",
    name: "Navigo Imagine R (Transport)",
    category: "deals",
    emoji: "🚇",
    address: "Any metro station or imagine-r.com",
    arrondissement: "All Paris",
    freeCondition: "50% off yearly transport — 39.10 EUR/month instead of 86.40 EUR",
    description: "The student transport pass covers ALL Paris zones (metro, bus, RER, tram). Half price for students under 26.",
    tip: "Apply at imagine-r.com with your student certificate. Takes 2-3 weeks to arrive. Use a regular Navigo Decouverte (86.40 EUR/month) while you wait.",
    mapUrl: "https://www.imagine-r.com/",
    color: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
  },
  {
    id: "velib-student",
    name: "Velib Student (Bike Sharing)",
    category: "deals",
    emoji: "🚴",
    address: "Velib stations across Paris",
    arrondissement: "All Paris",
    freeCondition: "Student plan: 37.20 EUR/year (first 30 min free every ride)",
    description: "Paris bike-sharing system with 20,000+ bikes. Student plan gives you first 30 minutes free on every single ride.",
    tip: "Download the Velib app. Always dock your bike properly (wait for the green light). The V-Box plan is cheapest for students.",
    mapUrl: "https://www.velib-metropole.fr/",
    color: "bg-lime-50",
    textColor: "text-lime-700",
    borderColor: "border-lime-200",
  },
  {
    id: "spotify-student",
    name: "Spotify / Apple Music Student",
    category: "deals",
    emoji: "🎧",
    address: "Online — verify with student email",
    arrondissement: "Online",
    freeCondition: "50% off — 5.99 EUR/month instead of 10.99 EUR",
    description: "Spotify Premium and Apple Music both offer 50% student discounts. Verify with your university email to get the deal.",
    tip: "Use your university email (.edu or .fr) to verify. Spotify Student also includes Hulu and Showtime in some countries.",
    mapUrl: "https://www.spotify.com/student/",
    color: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
  },
];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [expandedPlace, setExpandedPlace] = useState<string | null>(null);

  const filteredPlaces = activeCategory === "all"
    ? PLACES
    : PLACES.filter((p) => p.category === activeCategory);

  const categoryCount = (cat: Category) =>
    cat === "all" ? PLACES.length : PLACES.filter((p) => p.category === cat).length;

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-b from-orange-400 to-rose-500 px-6 pt-14 pb-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-extrabold text-white/90 tracking-tight">Cleo</span>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium backdrop-blur-sm">
              {PLACES.length} free spots
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Explore Paris 🗺️
          </h1>
          <p className="text-orange-100 text-sm mt-1">
            Free places, cheap eats, and student deals. Paris on a budget!
          </p>
        </motion.div>

        {/* Important note */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3"
        >
          <p className="text-white/90 text-xs leading-relaxed">
            <span className="font-bold">Did you know?</span> With a student ID or European long-stay visa (VLS-TS), most Paris museums are <span className="font-bold">completely FREE</span> for anyone under 26!
          </p>
        </motion.div>
      </div>

      <div className="px-5 -mt-4 max-w-lg mx-auto">
        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 mb-4"
        >
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
                <span className={`text-[10px] ${activeCategory === cat.id ? "text-orange-200" : "text-slate-400"}`}>
                  {categoryCount(cat.id)}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Places list */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredPlaces.map((place, i) => (
              <motion.div
                key={place.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <motion.div
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setExpandedPlace(expandedPlace === place.id ? null : place.id)}
                  className={`${place.color} border ${place.borderColor} rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all hover:shadow-md`}
                >
                  {/* Card header */}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl flex-shrink-0">{place.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className={`font-extrabold text-sm ${place.textColor} truncate`}>
                            {place.name}
                          </h3>
                          <motion.span
                            animate={{ rotate: expandedPlace === place.id ? 180 : 0 }}
                            className="text-slate-400 text-xs flex-shrink-0"
                          >
                            ▼
                          </motion.span>
                        </div>
                        <p className="text-slate-500 text-xs mt-0.5">{place.arrondissement} arr.</p>
                        <div className="mt-2 inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg">
                          <span className="text-xs">✅</span>
                          <span className="text-[10px] font-bold">{place.freeCondition}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {expandedPlace === place.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3">
                          <div className="h-px bg-slate-200/50" />

                          {/* Description */}
                          <p className="text-slate-600 text-xs leading-relaxed">
                            {place.description}
                          </p>

                          {/* Pro tip */}
                          <div className="bg-white/70 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Pro Tip
                            </p>
                            <p className="text-slate-600 text-xs leading-relaxed">
                              💡 {place.tip}
                            </p>
                          </div>

                          {/* Address */}
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>📍</span>
                            <span>{place.address}</span>
                          </div>

                          {/* Map button */}
                          <a
                            href={place.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`block w-full text-center ${place.textColor} bg-white font-bold text-xs py-3 rounded-xl border ${place.borderColor} hover:opacity-80 transition`}
                          >
                            Open in Google Maps 📍
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-orange-50 border border-orange-100 rounded-2xl p-4"
        >
          <p className="font-extrabold text-orange-700 text-sm mb-1">
            🎓 Student ID = Free Paris
          </p>
          <p className="text-orange-600 text-xs leading-relaxed">
            Always carry your student ID and a valid VLS-TS visa or titre de sejour. Most museums, cultural sites, and transport discounts require proof of age (under 26) and EU residency or valid French visa.
          </p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
