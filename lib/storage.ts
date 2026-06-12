export interface UserProfile {
  name: string;
  nationality: string;
  /** Legacy field — journey progress is now task-based, not calendar-based */
  arrivalDate?: string;
  university: string;
}

export interface ChecklistProgress {
  [dayKey: string]: string[]; // dayKey = "day1", value = array of completed step IDs
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface StoredDocument {
  id: string;
  name: string;
  category: "Identity" | "Banking" | "Housing" | "Healthcare" | "Education";
  type: string;
  data: string; // base64
  size: number;
  uploadedAt: number;
}

const KEYS = {
  USER: "cleo_user",
  PROGRESS: "cleo_progress",
  CHAT: "cleo_chat",
  DOCUMENTS: "cleo_documents",
  ONBOARDED: "cleo_onboarded",
  APPOINTMENTS: "cleo_appointments",
};

function safeGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as T;
    } catch (parseError) {
      // Data is corrupted, log error and remove corrupted data
      console.warn(`Storage corruption detected in key "${key}". Clearing corrupted data.`, parseError);
      localStorage.removeItem(key);
      return null;
    }
  } catch (storageError) {
    // Storage access error (could be privacy mode, quota exceeded, etc.)
    console.warn(`Cannot access localStorage key "${key}":`, storageError);
    return null;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
}

export const storage = {
  // User profile
  getUser: () => safeGet<UserProfile>(KEYS.USER),
  setUser: (user: UserProfile) => safeSet(KEYS.USER, user),
  isOnboarded: () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(KEYS.ONBOARDED) === "true";
  },
  setOnboarded: () => {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.ONBOARDED, "true");
  },

  // Checklist progress
  getProgress: (): ChecklistProgress =>
    safeGet<ChecklistProgress>(KEYS.PROGRESS) ?? {},
  setProgress: (progress: ChecklistProgress) =>
    safeSet(KEYS.PROGRESS, progress),
  toggleStep: (day: number, stepId: string) => {
    const progress = storage.getProgress();
    const key = `day${day}`;
    const current = progress[key] ?? [];
    if (current.includes(stepId)) {
      progress[key] = current.filter((id) => id !== stepId);
    } else {
      progress[key] = [...current, stepId];
    }
    storage.setProgress(progress);
    return progress;
  },
  isDayComplete: (day: number, totalSteps: number): boolean => {
    const progress = storage.getProgress();
    const key = `day${day}`;
    return (progress[key]?.length ?? 0) >= totalSteps;
  },
  getCompletedDays: (totalStepsPerDay: number[]): number => {
    return totalStepsPerDay.filter((total, idx) =>
      storage.isDayComplete(idx + 1, total)
    ).length;
  },

  // Chat history
  getChat: (): ChatMessage[] => safeGet<ChatMessage[]>(KEYS.CHAT) ?? [],
  setChat: (messages: ChatMessage[]) => safeSet(KEYS.CHAT, messages),
  addMessage: (message: ChatMessage) => {
    const messages = storage.getChat();
    const updated = [...messages, message];
    storage.setChat(updated);
    return updated;
  },
  clearChat: () => safeSet(KEYS.CHAT, []),

  // Documents
  getDocuments: (): StoredDocument[] =>
    safeGet<StoredDocument[]>(KEYS.DOCUMENTS) ?? [],
  addDocument: (doc: StoredDocument) => {
    const docs = storage.getDocuments();
    const updated = [...docs, doc];
    safeSet(KEYS.DOCUMENTS, updated);
    return updated;
  },
  deleteDocument: (id: string) => {
    const docs = storage.getDocuments();
    const updated = docs.filter((d) => d.id !== id);
    safeSet(KEYS.DOCUMENTS, updated);
    return updated;
  },

  // Appointments
  getAppointments: () => safeGet<import("./appointments").Appointment[]>(KEYS.APPOINTMENTS) ?? [],
  saveAppointments: (appts: import("./appointments").Appointment[]) => safeSet(KEYS.APPOINTMENTS, appts),
  addAppointment: (appt: import("./appointments").Appointment) => {
    const all = storage.getAppointments();
    const updated = [...all, appt];
    safeSet(KEYS.APPOINTMENTS, updated);
    return updated;
  },
  updateAppointment: (id: string, changes: Partial<import("./appointments").Appointment>) => {
    const all = storage.getAppointments();
    const updated = all.map((a) => (a.id === id ? { ...a, ...changes } : a));
    safeSet(KEYS.APPOINTMENTS, updated);
    return updated;
  },
  deleteAppointment: (id: string) => {
    const updated = storage.getAppointments().filter((a) => a.id !== id);
    safeSet(KEYS.APPOINTMENTS, updated);
    return updated;
  },

  clearAll: () => {
    if (typeof window === "undefined") return;
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
