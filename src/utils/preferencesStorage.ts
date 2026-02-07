export type StorageScope = "local" | "session";
export type ThemePreference = "light" | "dark" | "system";

/**
 * 应用名称
 */
export const APP_NAME = "sparkinai-app";

/**
 * 存储键名常量
 */
export const STORAGE_KEYS = {
  UID: `${APP_NAME}:auth:uid`,
  ACCESS_TOKEN: `${APP_NAME}:auth:access_token`,
  REFRESH_TOKEN: `${APP_NAME}:auth:refresh_token`,
  TERMINAL_ID: `${APP_NAME}:auth:terminal_id`,
  REMEMBER_ME: `${APP_NAME}:auth:remember_me`,
} as const;

const STORAGE_KEYS_UI = {
  theme: "theme",
  user: "user",
} as const;

const getStorage = (scope: StorageScope): Storage => {
  return scope === "local" ? localStorage : sessionStorage;
};

const getItem = (key: string, scope: StorageScope = "local"): string | null => {
  return getStorage(scope).getItem(key);
};

const setItem = (key: string, value: string, scope: StorageScope = "local"): void => {
  getStorage(scope).setItem(key, value);
};

const removeItem = (key: string, scope: StorageScope = "local"): void => {
  getStorage(scope).removeItem(key);
};

const getJson = <T>(key: string, scope: StorageScope = "local"): T | null => {
  const raw = getStorage(scope).getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const setJson = <T>(key: string, value: T, scope: StorageScope = "local"): void => {
  getStorage(scope).setItem(key, JSON.stringify(value));
};

const getAuthScope = (): StorageScope => {
  return getItem(STORAGE_KEYS.REMEMBER_ME, "local") === "true" ? "local" : "session";
};

export const authStorage = {
  getUid(): string | null {
    return getItem(STORAGE_KEYS.UID, getAuthScope());
  },
  getAccessToken(): string | null {
    return getItem(STORAGE_KEYS.ACCESS_TOKEN, getAuthScope());
  },
  getRefreshToken(): string | null {
    return getItem(STORAGE_KEYS.REFRESH_TOKEN, getAuthScope());
  },
  setTokens(uid: string, accessToken: string, refreshToken: string): void {
    const scope = getAuthScope();
    setItem(STORAGE_KEYS.UID, uid, scope);
    setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken, scope);
    setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken, scope);
  },
  getTerminalId(): string | null {
    return getItem(STORAGE_KEYS.TERMINAL_ID, getAuthScope());
  },
  setTerminalId(tid: string): void {
    setItem(STORAGE_KEYS.TERMINAL_ID, tid, getAuthScope());
  },
  getRememberMe(): boolean {
    return getItem(STORAGE_KEYS.REMEMBER_ME, "local") === "true";
  },
  setRememberMe(rememberMe: boolean): void {
    if (rememberMe) {
      setItem(STORAGE_KEYS.REMEMBER_ME, "true", "local");
    } else {
      removeItem(STORAGE_KEYS.REMEMBER_ME, "local");
    }
  },
  clearAuth(): void {
    removeItem(STORAGE_KEYS.ACCESS_TOKEN, "local");
    removeItem(STORAGE_KEYS.REFRESH_TOKEN, "local");
    removeItem(STORAGE_KEYS.ACCESS_TOKEN, "session");
    removeItem(STORAGE_KEYS.REFRESH_TOKEN, "session");
  },
};

/**
 * 本地凭证与偏好的读写
 */
export const AuthStorage = authStorage;

export const userStorage = {
  getUser<T>(): T | null {
    return getJson<T>(STORAGE_KEYS_UI.user, "local");
  },
  setUser<T>(user: T): void {
    setJson(STORAGE_KEYS_UI.user, user, "local");
  },
  clearUser(): void {
    removeItem(STORAGE_KEYS_UI.user, "local");
  },
};

export const preferencesStorage = {
  getTheme(): ThemePreference {
    return (getItem(STORAGE_KEYS_UI.theme, "local") as ThemePreference) || "system";
  },
  setTheme(theme: ThemePreference): void {
    setItem(STORAGE_KEYS_UI.theme, theme, "local");
  },
};

export const sessionStorageRepository = {
  clearSession(): void {
    getStorage("session").clear();
  },
};
