import { defineStore } from "pinia";

export interface GeneratedImage {
  url: string;
  isRegenerating?: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  uploadedImages?: string[]; // user uploaded image URLs
  generatedImages?: GeneratedImage[];
  params?: { ratio: string; resolution: string };
  timestamp: number;
  isLoading?: boolean;
  isImageGenerating?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "sparkinai-app:chat:sessions";
const ACTIVE_KEY = "sparkinai-app:chat:active";

const load = (): ChatSession[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const save = (sessions: ChatSession[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

export const useChatStore = defineStore("chat", {
  state: () => ({
    sessions: load() as ChatSession[],
    activeSessionId: localStorage.getItem(ACTIVE_KEY) || "",
  }),

  getters: {
    activeSession: (state): ChatSession | undefined =>
      state.sessions.find((s) => s.id === state.activeSessionId),
    sortedSessions: (state): ChatSession[] =>
      [...state.sessions].sort((a, b) => b.updatedAt - a.updatedAt),
  },

  actions: {
    createSession(): ChatSession {
      const session: ChatSession = {
        id: crypto.randomUUID(),
        title: "新对话",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      this.sessions.push(session);
      this.setActiveSession(session.id);
      save(this.sessions);
      return session;
    },

    setActiveSession(id: string) {
      this.activeSessionId = id;
      localStorage.setItem(ACTIVE_KEY, id);
    },

    deleteSession(id: string) {
      this.sessions = this.sessions.filter((s) => s.id !== id);
      if (this.activeSessionId === id) {
        const next = this.sessions[0];
        this.activeSessionId = next ? next.id : "";
        localStorage.setItem(ACTIVE_KEY, this.activeSessionId);
      }
      save(this.sessions);
    },

    addMessage(sessionId: string, message: Message) {
      const session = this.sessions.find((s) => s.id === sessionId);
      if (!session) return;
      session.messages.push(message);
      // update title from first user message
      if (session.messages.filter((m) => m.role === "user").length === 1 && message.role === "user") {
        session.title = message.content.slice(0, 20) || "新对话";
      }
      session.updatedAt = Date.now();
      save(this.sessions);
    },

    updateMessage(sessionId: string, messageId: string, patch: Partial<Message>) {
      const session = this.sessions.find((s) => s.id === sessionId);
      if (!session) return;
      const msg = session.messages.find((m) => m.id === messageId);
      if (!msg) return;
      Object.assign(msg, patch);
      session.updatedAt = Date.now();
      save(this.sessions);
    },

    ensureActiveSession() {
      if (!this.activeSessionId || !this.sessions.find((s) => s.id === this.activeSessionId)) {
        if (this.sessions.length > 0) {
          this.setActiveSession(this.sessions[0].id);
        } else {
          this.createSession();
        }
      }
    },
  },
});
