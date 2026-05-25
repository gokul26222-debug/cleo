"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import { storage, ChatMessage } from "@/lib/storage";

const SUGGESTED_QUESTIONS = [
  "How do I apply for CAF? 🏠",
  "What documents do I need for CPAM? 🏥",
  "How do I open a bank account? 🏦",
  "What's the cheapest phone plan? 📱",
  "How do I get a Navigo pass? 🚇",
  "What is a médecin traitant? 👨‍⚕️",
];

const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp",
  "application/pdf",
];
// Bug fix #5: base64 inflates file by ~33%. 4MB file = ~5.3MB base64.
// Keep under Next.js default body limit of ~4MB to avoid 413 errors.
const MAX_FILE_MB = 4;

interface Attachment {
  name: string;
  mimeType: string;
  data: string;       // base64 WITHOUT the data:...;base64, prefix
  preview?: string;   // full data URL for image preview
  isImage: boolean;
}

const CLEO_INTRO: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Bonjour! 👋 Je suis Cléo — your Paris admin guide.\n\nAsk me anything, or 📎 attach a document (CAF letter, lease, bank statement, visa) and I'll read it and tell you exactly what to do next! 🇫🇷",
  timestamp: Date.now(),
};

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!storage.isOnboarded()) { router.replace("/"); return; }
    if (initialized.current) return;
    initialized.current = true;

    const saved = storage.getChat();
    if (saved.length === 0) {
      setMessages([CLEO_INTRO]);
      storage.setChat([CLEO_INTRO]);
    } else {
      setMessages(saved);
    }

    // Bug fix #10: handle q param separately from initialization
    // so re-navigating with a new ?q= always applies it
    const q = searchParams.get("q");
    if (q) setInput(decodeURIComponent(q));
  }, [router, searchParams]); // searchParams in dep array ensures q is re-applied

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── File handling ──────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError("Only JPG, PNG, WEBP, or PDF files are supported.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`File too large. Max ${MAX_FILE_MB}MB.`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    try {
      const fullDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Strip the data URL prefix to get raw base64
      const base64 = fullDataUrl.split(",")[1];
      const isImage = file.type.startsWith("image/");

      setAttachment({
        name: file.name,
        mimeType: file.type,
        data: base64,
        preview: isImage ? fullDataUrl : undefined,
        isImage,
      });
    } catch {
      setFileError("Could not read file. Please try again.");
    }

    if (fileRef.current) fileRef.current.value = "";
  };

  const removeAttachment = () => setAttachment(null);

  // ── Send message ───────────────────────────────────────────────
  const sendMessage = async (text?: string) => {
    const msgText = (text ?? input).trim();
    if ((!msgText && !attachment) || loading) return;

    const displayText = msgText || `📎 ${attachment!.name}`;
    setInput("");
    setError(null);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: attachment
        ? `${msgText ? msgText + "\n" : ""}📎 *${attachment.name}*`
        : msgText,
      timestamp: Date.now(),
    };

    const currentAttachment = attachment;
    setAttachment(null);

    const updated = storage.addMessage(userMsg);
    setMessages([...updated]);
    setLoading(true);

    try {
      const body: Record<string, unknown> = {
        message: msgText || `Please read this document and tell me what it means and what I need to do next.`,
        history: updated.slice(-10).filter((m) => m.id !== "welcome"),
      };

      if (currentAttachment) {
        body.attachment = {
          data: currentAttachment.data,
          mimeType: currentAttachment.mimeType,
          name: currentAttachment.name,
        };
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: Date.now(),
      };

      const final = storage.addMessage(assistantMsg);
      setMessages([...final]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
      setInput(displayText);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    storage.clearChat();
    setMessages([CLEO_INTRO]);
    storage.setChat([CLEO_INTRO]);
    setError(null);
    setAttachment(null);
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Header */}
      <div className="glass px-6 pt-12 pb-4 border-b border-white/30 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md shadow-sky-200"
          >
            C
          </motion.div>
          <div>
            <h1 className="font-extrabold text-slate-900 leading-none">Cléo</h1>
            <p className="text-xs text-emerald-500 font-semibold">● Online · Paris AI Guide</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="text-xs text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1.5 transition"
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1 shadow-sm">
                  C
                </div>
              )}
              <div className="max-w-[82%]">
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-br-sm shadow-md shadow-sky-100"
                    : "bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
                <p className={`text-xs text-slate-400 mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
              C
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 bg-sky-400 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center">
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-2xl px-4 py-3 text-center max-w-xs">
                <p className="font-semibold mb-1.5">⚠️ Couldn&apos;t send</p>
                <p className="text-red-400 mb-2 leading-relaxed">{error.split("[")[0]}</p>
                <button
                  onClick={() => { setError(null); sendMessage(); }}
                  className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-100 px-3 py-1 rounded-full"
                >
                  Try again →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {messages.length <= 1 && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 pb-2 flex-shrink-0">
            <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wide">Quick questions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <motion.button
                  key={q}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-white border border-slate-200 text-slate-600 rounded-full px-3 py-1.5 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition shadow-sm card-3d"
                >
                  {q}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="bg-white border-t border-slate-100 px-4 pt-3 pb-3 flex-shrink-0 mb-[64px]">

        {/* File error */}
        <AnimatePresence>
          {fileError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-600 font-medium flex items-center justify-between"
            >
              <span>⚠️ {fileError}</span>
              <button onClick={() => setFileError(null)} className="ml-2 text-red-400 hover:text-red-600 font-bold">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachment preview */}
        <AnimatePresence>
          {attachment && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mb-2 flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-2xl p-2.5"
            >
              {/* Thumbnail or icon */}
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-sky-100 flex items-center justify-center">
                {attachment.isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={attachment.preview} alt={attachment.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">📄</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-sky-800 truncate">{attachment.name}</p>
                <p className="text-[10px] text-sky-500 mt-0.5">
                  {attachment.isImage ? "Image" : "PDF"} · Ready to send
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={removeAttachment}
                className="w-6 h-6 rounded-full bg-sky-200 text-sky-700 flex items-center justify-center text-xs font-bold hover:bg-sky-300 transition flex-shrink-0"
              >
                ✕
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input row */}
        <div className="flex items-center gap-2 max-w-lg mx-auto">

          {/* Attach button */}
          <input
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => fileRef.current?.click()}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
              attachment
                ? "bg-sky-500 text-white shadow-md shadow-sky-200"
                : "bg-slate-100 text-slate-500 hover:bg-sky-100 hover:text-sky-600"
            }`}
            title="Attach image or PDF"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </motion.button>

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={attachment ? "Ask about this document…" : "Ask Cléo anything…"}
            className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-400 transition"
          />

          {/* Send button */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => sendMessage()}
            disabled={(!input.trim() && !attachment) || loading}
            className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md hover:shadow-sky-200 transition-all flex-shrink-0 btn-3d animate-glow"
          >
            <svg className="w-4 h-4 text-white -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </motion.button>
        </div>

        {/* Attach hint */}
        {!attachment && (
          <p className="text-center text-[10px] text-slate-400 mt-2">
            📎 Attach CAF letters, leases, bank statements, visa — Cléo reads them
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading…</div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
