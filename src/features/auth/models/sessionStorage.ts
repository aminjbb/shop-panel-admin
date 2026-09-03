import type { AdminUser, AuthSession } from "@/entities/auth";

const SESSION_KEY = "dynova_admin_auth_session_v1";
const LEGACY_SESSION_KEYS = [
  "dynova_admin_auth_session",
  "dynova_admin_token",
  "dynova_admin_user",
];
const AUTH_CHANNEL = "dynova_admin_auth_sync";

export interface StoredAuthSession {
  version: 1;
  rememberMe: boolean;
  session: AuthSession;
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isAdminUser(value: unknown): value is AdminUser {
  if (!value || typeof value !== "object") return false;
  const user = value as Record<string, unknown>;
  return (
    isString(user.id) &&
    isString(user.email) &&
    isString(user.fullName) &&
    ["super_admin", "inventory_manager", "support_agent"].includes(
      String(user.role),
    ) &&
    typeof user.isActive === "boolean" &&
    isString(user.createdAt) &&
    (user.lastLoginAt === null || isString(user.lastLoginAt)) &&
    (user.avatarUrl === undefined ||
      user.avatarUrl === null ||
      typeof user.avatarUrl === "string")
  );
}

function normalizeSession(session: AuthSession): AuthSession {
  return {
    ...session,
    user: {
      ...session.user,
      avatarUrl: session.user.avatarUrl ?? null,
    },
  };
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== "object") return false;
  const session = value as Record<string, unknown>;
  return (
    isAdminUser(session.user) &&
    isString(session.accessToken) &&
    isString(session.refreshToken) &&
    isString(session.accessTokenExpiresAt) &&
    isString(session.refreshTokenExpiresAt)
  );
}

function parseStoredSession(raw: string | null): StoredAuthSession | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredAuthSession>;
    if (
      parsed.version !== 1 ||
      typeof parsed.rememberMe !== "boolean" ||
      !isAuthSession(parsed.session)
    ) {
      return null;
    }

    return {
      version: 1,
      rememberMe: parsed.rememberMe,
      session: normalizeSession(parsed.session),
    };
  } catch {
    return null;
  }
}

function safeRead(storage: Storage): StoredAuthSession | null {
  try {
    const value = parseStoredSession(storage.getItem(SESSION_KEY));
    if (!value) storage.removeItem(SESSION_KEY);
    return value;
  } catch {
    return null;
  }
}

export function loadStoredAuthSession(): StoredAuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    return safeRead(window.sessionStorage) ?? safeRead(window.localStorage);
  } catch {
    return null;
  }
}

export function persistAuthSession(
  session: AuthSession,
  rememberMe: boolean,
): StoredAuthSession {
  const record: StoredAuthSession = {
    version: 1,
    rememberMe,
    session: normalizeSession(session),
  };

  if (typeof window === "undefined") return record;

  try {
    const target = rememberMe ? window.localStorage : window.sessionStorage;
    const other = rememberMe ? window.sessionStorage : window.localStorage;
    other.removeItem(SESSION_KEY);
    target.setItem(SESSION_KEY, JSON.stringify(record));
    for (const key of LEGACY_SESSION_KEYS) {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    }
  } catch {
    // The authenticated session remains available in memory when storage is blocked.
  }

  return record;
}

export function clearStoredAuthSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
    for (const key of LEGACY_SESSION_KEYS) {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    }
  } catch {
    // In-memory state is still cleared by the auth provider.
  }
}

export function isRefreshExpired(record: StoredAuthSession): boolean {
  const expiry = Date.parse(record.session.refreshTokenExpiresAt);
  return !Number.isFinite(expiry) || expiry <= Date.now();
}

export function publishAuthChange(type: "changed" | "logout"): void {
  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(AUTH_CHANNEL);
  channel.postMessage({ type });
  channel.close();
}

export function subscribeToAuthChanges(
  listener: (type: "changed" | "logout") => void,
): () => void {
  if (typeof BroadcastChannel === "undefined") return () => undefined;
  const channel = new BroadcastChannel(AUTH_CHANNEL);
  channel.onmessage = (event: MessageEvent<{ type?: string }>) => {
    if (event.data.type === "changed" || event.data.type === "logout") {
      listener(event.data.type);
    }
  };
  return () => channel.close();
}

export { SESSION_KEY };
