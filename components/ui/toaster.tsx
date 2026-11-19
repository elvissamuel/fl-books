"use client";

import { AlertCircle, Check, Info, X } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

type ToastTone = "success" | "error" | "info";

type ToastRecord = {
  id: number;
  message: string;
  tone: ToastTone;
  leaving: boolean;
};

const listeners = new Set<(toast: ToastRecord) => void>();
const pending: ToastRecord[] = [];
let nextId = 1;

function emit(message: string, tone: ToastTone) {
  const text = message.trim();
  if (!text) return;
  const toast: ToastRecord = { id: nextId++, message: text, tone, leaving: false };
  if (listeners.size === 0) {
    pending.push(toast);
    return;
  }
  listeners.forEach((listener) => listener(toast));
}

export const toast = {
  success(message: string) {
    emit(message, "success");
  },
  error(message: string) {
    emit(message, "error");
  },
  info(message: string) {
    emit(message, "info");
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.map((item) => (item.id === id ? { ...item, leaving: true } : item)));
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 220);
  }, []);

  useEffect(() => {
    const listener = (item: ToastRecord) => {
      setToasts((current) => [...current, item].slice(-4));
    };
    listeners.add(listener);
    pending.splice(0).forEach(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <>
      {children}
      <div
        aria-label="Notifications"
        className="pointer-events-none fixed top-4 left-1/2 z-[120] flex w-[min(100%-2rem,440px)] -translate-x-1/2 flex-col items-center gap-2"
      >
        {toasts.map((item) => (
          <ToastCard key={item.id} toast={item} onDismiss={dismiss} />
        ))}
      </div>
    </>
  );
}

function ToastCard({ toast, onDismiss }: { toast: ToastRecord; onDismiss: (id: number) => void }) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || toast.leaving) return;
    const timer = window.setTimeout(() => onDismiss(toast.id), 5000);
    return () => window.clearTimeout(timer);
  }, [onDismiss, paused, toast.id, toast.leaving]);

  const tone = toastStyles[toast.tone];
  const Icon = tone.icon;

  return (
    <div
      role={toast.tone === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border border-[#e6e8ee] bg-white py-3 pr-3 pl-4 text-left shadow-[0_16px_40px_rgba(17,24,22,0.16)] ${
        toast.leaving
          ? "motion-safe:animate-[toast-slide-out_220ms_ease-in_both]"
          : "motion-safe:animate-[toast-slide-in_360ms_cubic-bezier(0.16,1,0.3,1)_both]"
      }`}
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${tone.bar}`} />
      <Icon className={`mt-0.5 size-4 shrink-0 ${tone.iconClass}`} strokeWidth={2.25} />
      <p className="min-w-0 flex-1 text-[14px] leading-5 text-[#1c1f24]">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-[#8d939c] hover:bg-[#f4f5f9] hover:text-[#1c1f24]"
        aria-label="Dismiss notification"
      >
        <X className="size-3.5" strokeWidth={2.25} />
      </button>
    </div>
  );
}

const toastStyles = {
  success: { icon: Check, iconClass: "text-brand", bar: "bg-brand" },
  error: { icon: AlertCircle, iconClass: "text-danger", bar: "bg-danger" },
  info: { icon: Info, iconClass: "text-[#f47832]", bar: "bg-[#f47832]" },
} as const;
