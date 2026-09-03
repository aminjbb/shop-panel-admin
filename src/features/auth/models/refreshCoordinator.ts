import { authApi, type AuthSession } from "@/entities/auth";
import {
  isRefreshExpired,
  loadStoredAuthSession,
  persistAuthSession,
  type StoredAuthSession,
} from "./sessionStorage";

const REFRESH_LOCK = "dynova_admin_refresh_lock";
let refreshInFlight: Promise<StoredAuthSession> | null = null;

async function performRefresh(
  current: StoredAuthSession,
): Promise<StoredAuthSession> {
  const latest = loadStoredAuthSession();

  if (
    current.rememberMe &&
    latest?.rememberMe &&
    latest.session.refreshToken !== current.session.refreshToken
  ) {
    return latest;
  }

  if (isRefreshExpired(current)) {
    throw new Error("refresh_session_expired");
  }

  const session: AuthSession = await authApi.refresh({
    refreshToken: current.session.refreshToken,
  });

  return persistAuthSession(session, current.rememberMe);
}

async function withCrossTabLock(
  current: StoredAuthSession,
): Promise<StoredAuthSession> {
  if (
    current.rememberMe &&
    typeof navigator !== "undefined" &&
    navigator.locks
  ) {
    return navigator.locks.request(REFRESH_LOCK, () => performRefresh(current));
  }

  return performRefresh(current);
}

export function refreshSessionSingleFlight(
  current: StoredAuthSession,
): Promise<StoredAuthSession> {
  if (!refreshInFlight) {
    refreshInFlight = withCrossTabLock(current).finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}
