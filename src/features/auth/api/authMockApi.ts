import type { AdminUser, LoginCredentials, AuthResponse, AuthSession } from "@/types/auth";

export const MOCK_USERS: Array<AdminUser & { passwordHash: string }> = [
  {
    id: "usr-super-01",
    name: "سارا محمدی",
    email: "admin@dynova.io",
    role: "super_admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    department: "مدیریت ارشد اجرایی و امنیت سامانه",
    lastLogin: "امروز، ساعت ۰۹:۱۵",
    passwordHash: "AdminPassword123",
  },
  {
    id: "usr-inv-02",
    name: "رضا رضایی",
    email: "inventory@dynova.io",
    role: "inventory_manager",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    department: "لجستیک، انبارداری و زنجیره تأمین",
    lastLogin: "دیروز، ساعت ۱۶:۴۰",
    passwordHash: "InventoryPass123",
  },
  {
    id: "usr-sup-03",
    name: "مریم احمدی",
    email: "support@dynova.io",
    role: "support_agent",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    department: "امور مشتریان و پشتیبانی فنی",
    lastLogin: "۳ روز پیش، ساعت ۱۱:۲۰",
    passwordHash: "SupportPass123",
  },
];

const STORAGE_KEYS = {
  SESSION: "dynova_admin_auth_session",
  TOKEN: "dynova_admin_token",
} as const;

/**
 * Simulates network latency between min and max milliseconds
 */
const simulateLatency = (min = 400, max = 800): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Mock Auth Service
 */
export const authMockApi = {
  /**
   * Performs simulated login with credentials and error cases
   */
  async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    await simulateLatency(450, 750);

    const { email, password, rememberMe = false, simulate500Error = false } = credentials;
    const normalizedEmail = email.trim().toLowerCase();

    // Edge Case: Explicit 500 Server Error Simulation
    if (
      simulate500Error ||
      normalizedEmail === "error500@store.com" ||
      normalizedEmail === "500@error.com" ||
      normalizedEmail === "servererror@dynova.io"
    ) {
      throw new Error("خطای ۵۰۰ سرور: ارتباط با سرور سامانه برقرار نشد. لطفاً وضعیت اینترنت را بررسی کرده یا مجدداً تلاش نمایید.");
    }

    // Find user by email
    const matchedUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (!matchedUser) {
      throw new Error("کاربری با این مشخصات یافت نشد. لطفاً ایمیل را بررسی کنید.");
    }

    if (matchedUser.passwordHash !== password) {
      throw new Error("کلمه عبور وارد شده نامعتبر است. لطفاً دقت فرمایید.");
    }

    // Prepare User object without password hash
    const { passwordHash: _, ...safeUser } = matchedUser;

    // Generate simulated JWT Token
    const token = `mock_jwt_token_dynova_${matchedUser.role}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const sessionData: AuthSession = {
      user: safeUser,
      token,
      rememberMe,
    };

    // Store in localStorage if Remember Me is checked, otherwise sessionStorage
    if (rememberMe) {
      try {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        sessionStorage.removeItem(STORAGE_KEYS.SESSION);
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
      } catch (err) {
        console.warn("Could not save to localStorage", err);
      }
    } else {
      try {
        sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
        sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      } catch (err) {
        console.warn("Could not save to sessionStorage", err);
      }
    }

    return {
      user: safeUser,
      token,
      rememberMe,
    };
  },

  /**
   * Retrieves saved session from localStorage or sessionStorage
   */
  getStoredAuthSession(): AuthSession | null {
    try {
      // 1. Check localStorage first
      const localData = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (localData) {
        const parsed = JSON.parse(localData) as AuthSession;
        if (parsed?.user && parsed?.token) {
          return parsed;
        }
      }

      // 2. Check sessionStorage
      const sessionData = sessionStorage.getItem(STORAGE_KEYS.SESSION);
      if (sessionData) {
        const parsed = JSON.parse(sessionData) as AuthSession;
        if (parsed?.user && parsed?.token) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading stored auth session:", e);
    }
    return null;
  },

  /**
   * Logs out the user and clears all client-side sessions
   */
  async mockLogout(): Promise<void> {
    await simulateLatency(150, 300);
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.SESSION);
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (e) {
      console.error("Error clearing session:", e);
    }
  },
};
