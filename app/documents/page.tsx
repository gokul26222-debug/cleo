"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import { storage, StoredDocument } from "@/lib/storage";

type Category = StoredDocument["category"];

const CATEGORIES: Category[] = ["Identity", "Banking", "Housing", "Healthcare", "Education"];

const CATEGORY_META: Record<Category, { emoji: string; color: string; bg: string }> = {
  Identity:   { emoji: "🪪", color: "text-blue-700 border-blue-200",   bg: "bg-blue-50"   },
  Banking:    { emoji: "🏦", color: "text-green-700 border-green-200", bg: "bg-green-50"  },
  Housing:    { emoji: "🏠", color: "text-amber-700 border-amber-200", bg: "bg-amber-50"  },
  Healthcare: { emoji: "🏥", color: "text-red-700 border-red-200",     bg: "bg-red-50"    },
  Education:  { emoji: "🎓", color: "text-purple-700 border-purple-200", bg: "bg-purple-50" },
};

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_SIZE = 5 * 1024 * 1024;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [uploadCategory, setUploadCategory] = useState<Category>("Identity");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [preview, setPreview] = useState<StoredDocument | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!storage.isOnboarded()) { router.replace("/"); return; }
    setDocuments(storage.getDocuments());
  }, [router]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // JS-level validation (browser accept can be bypassed)
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Only PDF, JPG, PNG, or WEBP files are accepted.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (file.size > MAX_SIZE) {
      setUploadError(`File too large. Maximum size is 5 MB (this file is ${formatSize(file.size)}).`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    // Bug fix #11: localStorage has a ~5MB total limit. base64 inflates by ~33%.
    // Warn user if adding this file would push total stored data over ~3.5MB.
    const currentTotal = storage.getDocuments().reduce((s, d) => s + d.size, 0);
    if (currentTotal + file.size > 3.5 * 1024 * 1024) {
      setUploadError(`Storage nearly full (${formatSize(currentTotal)} used). Delete some documents first.`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      const doc: StoredDocument = {
        id: Date.now().toString(),
        name: file.name,
        category: uploadCategory,
        type: file.type,
        data: base64,
        size: file.size,
        uploadedAt: Date.now(),
      };

      const updated = storage.addDocument(doc);
      setDocuments(updated);
      setShowUpload(false);
      showToast(`✅ "${file.name}" uploaded to ${uploadCategory}`);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const deleteDocument = (id: string, name: string) => {
    const updated = storage.deleteDocument(id);
    setDocuments(updated);
    if (preview?.id === id) setPreview(null);
    showToast(`🗑 "${name}" deleted`);
  };

  const filteredDocs =
    selectedCategory === "All"
      ? documents
      : documents.filter((d) => d.category === selectedCategory);

  const countByCategory = (cat: Category) => documents.filter((d) => d.category === cat).length;
  const totalSize = documents.reduce((s, d) => s + d.size, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl z-[70] whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-extrabold text-slate-900">Documents</h1>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => { setUploadError(null); setShowUpload(true); }}
            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-md shadow-sky-100 flex items-center gap-1.5"
          >
            <span className="text-base">+</span> Upload
          </motion.button>
        </div>
        <p className="text-slate-400 text-xs">
          {documents.length} document{documents.length !== 1 ? "s" : ""} · {formatSize(totalSize)} · Stored on device
        </p>
      </div>

      <div className="px-5 py-5 max-w-lg mx-auto space-y-5">
        {/* Category grid */}
        <div className="grid grid-cols-5 gap-2">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const active = selectedCategory === cat;
            return (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.93 }}
                onClick={() => setSelectedCategory(active ? "All" : cat)}
                className={`rounded-2xl border p-2.5 text-center transition-all ${
                  active ? `${meta.bg} ${meta.color} border-current shadow-sm` : "bg-white border-slate-100 text-slate-500"
                }`}
              >
                <div className="text-xl mb-0.5">{meta.emoji}</div>
                <div className="text-[10px] font-bold leading-tight">{cat}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{countByCategory(cat)}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Docs list */}
        {filteredDocs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-slate-100 p-10 text-center shadow-sm"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="text-5xl mb-3"
            >
              📂
            </motion.div>
            <p className="text-slate-600 font-bold mb-1">No documents yet</p>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Store your passport, RIB, lease, and certificates — always at hand when you need them.
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="text-sm text-sky-500 font-bold hover:text-sky-700 transition"
            >
              Upload your first document →
            </button>
          </motion.div>
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence>
              {filteredDocs.map((doc) => {
                const meta = CATEGORY_META[doc.category];
                return (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
                    className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm"
                  >
                    {/* Thumbnail */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPreview(doc)}
                      className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden"
                    >
                      {doc.type.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={doc.data} alt={doc.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">📄</span>
                      )}
                    </motion.button>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <button onClick={() => setPreview(doc)} className="text-left w-full">
                        <p className="font-semibold text-sm text-slate-800 truncate">{doc.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${meta.bg} ${meta.color}`}>
                            {meta.emoji} {doc.category}
                          </span>
                          <span className="text-[10px] text-slate-400">{formatSize(doc.size)}</span>
                        </div>
                      </button>
                    </div>

                    {/* Delete */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteDocument(doc.id, doc.name)}
                      className="flex-shrink-0 text-slate-300 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Tip */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex gap-3">
          <span className="text-xl flex-shrink-0">💡</span>
          <p className="text-sky-700 text-xs leading-relaxed">
            <span className="font-bold">Store these first:</span> Passport, visa, RIB (bank slip), certificat de scolarité, and your lease — you&apos;ll need them for CAF, CPAM, and your bank.
          </p>
        </div>
      </div>

      {/* Upload modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowUpload(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h2 className="font-extrabold text-slate-900 text-xl mb-1">Upload Document</h2>
              <p className="text-slate-400 text-xs mb-5">PDF, JPG, or PNG · Max 5 MB</p>

              {/* Category picker */}
              <div className="grid grid-cols-5 gap-2 mb-5">
                {CATEGORIES.map((cat) => {
                  const meta = CATEGORY_META[cat];
                  return (
                    <motion.button
                      key={cat}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setUploadCategory(cat)}
                      className={`rounded-2xl border py-2.5 px-1 text-center text-[10px] font-bold transition-all ${
                        uploadCategory === cat
                          ? `${meta.bg} ${meta.color} border-current shadow-sm`
                          : "border-slate-100 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <div className="text-xl mb-0.5">{meta.emoji}</div>
                      {cat}
                    </motion.button>
                  );
                })}
              </div>

              {/* Error */}
              <AnimatePresence>
                {uploadError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-xs text-red-600 font-medium"
                  >
                    ⚠️ {uploadError}
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-slate-200 rounded-2xl py-8 text-center hover:border-sky-400 hover:bg-sky-50 transition-all disabled:opacity-60 group"
              >
                <motion.div
                  animate={{ y: uploading ? [0, -4, 0] : 0 }}
                  transition={{ repeat: uploading ? Infinity : 0, duration: 0.8 }}
                  className="text-4xl mb-2"
                >
                  {uploading ? "⏳" : "📎"}
                </motion.div>
                <p className="text-sm font-bold text-slate-600 group-hover:text-sky-600 transition">
                  {uploading ? "Uploading…" : "Choose file"}
                </p>
                <p className="text-xs text-slate-400 mt-1">or drag and drop</p>
              </motion.button>

              <button
                onClick={() => setShowUpload(false)}
                className="mt-3 w-full py-2.5 text-slate-400 font-semibold text-sm hover:text-slate-600 transition"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <p className="font-bold text-slate-800 text-sm truncate flex-1 mr-2">{preview.name}</p>
                <button onClick={() => setPreview(null)} className="text-slate-400 hover:text-slate-700 text-lg leading-none">✕</button>
              </div>
              <div className="p-5">
                {preview.type.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview.data} alt={preview.name} className="w-full rounded-2xl object-contain max-h-72" />
                ) : (
                  <div className="text-center py-10">
                    <div className="text-6xl mb-3">📄</div>
                    <p className="text-slate-500 text-sm mb-3">PDF — {formatSize(preview.size)}</p>
                    <a
                      href={preview.data}
                      download={preview.name}
                      className="inline-block bg-sky-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-sky-600 transition"
                    >
                      Download →
                    </a>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_META[preview.category].bg} ${CATEGORY_META[preview.category].color}`}>
                    {CATEGORY_META[preview.category].emoji} {preview.category}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { deleteDocument(preview.id, preview.name); setPreview(null); }}
                    className="text-xs text-red-400 hover:text-red-600 font-bold transition"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
