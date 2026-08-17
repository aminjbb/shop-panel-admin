export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  message: string;
  title?: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastStore {
  private toasts: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();

  getState() {
    return this;
  }

  getToasts(): ToastItem[] {
    return [...this.toasts];
  }

  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener(this.getToasts());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const current = this.getToasts();
    this.listeners.forEach((listener) => listener(current));
  }

  show(message: string, type: ToastType = "info", options?: { title?: string; duration?: number }) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const duration = options?.duration ?? 4000;
    const newToast: ToastItem = {
      id,
      message,
      title: options?.title,
      type,
      duration,
    };

    this.toasts = [...this.toasts, newToast];
    this.notify();

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  success(message: string, options?: { title?: string; duration?: number }) {
    return this.show(message, "success", options);
  }

  error(message: string, options?: { title?: string; duration?: number }) {
    return this.show(message, "error", options);
  }

  info(message: string, options?: { title?: string; duration?: number }) {
    return this.show(message, "info", options);
  }

  warning(message: string, options?: { title?: string; duration?: number }) {
    return this.show(message, "warning", options);
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }
}

export const useToastStore = new ToastStore();
export default useToastStore;
