"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, X } from "lucide-react";
import { saveCustomerSession } from "@/app/customer/session/actions";
import type { CustomerOtpType } from "@/core/customers/public-api";
import {
  forgotCustomerPassword,
  loginPublicCustomer,
  registerPublicCustomer,
  resendCustomerOtp,
  resetCustomerPassword,
  verifyCustomerOtp,
} from "@/infrastructure/customers/public-customers-actions";
import { ptSerif } from "@/lib/public-font";

export type AuthView = "sign-in" | "sign-up" | "forgot" | "verify" | "reset";

export function CustomerAuthScreen({
  view,
  nextPath,
  email: initialEmail = "",
  notice,
}: {
  view: AuthView;
  nextPath?: string;
  email?: string;
  notice?: string;
}) {
  const router = useRouter();
  const destination = safeNext(nextPath);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState(noticeMessage(notice));
  const [tone, setTone] = useState<"error" | "success">(notice ? "success" : "error");

  const otpType: CustomerOtpType = view === "reset" ? "PASSWORD_RESET" : "ACCOUNT_ACTIVATION";

  function showNotice(next: string, kind: "error" | "success" = "error") {
    setTone(kind);
    setMessage(next);
  }

  async function onSignIn(event: FormEvent) {
    event.preventDefault();
    const emailAddress = email.trim();
    if (!emailAddress || !password) {
      showNotice("Enter your email and password.");
      return;
    }
    setPending(true);
    showNotice("");
    const result = await loginPublicCustomer({ emailAddress, password });
    if (!result.ok) {
      setPending(false);
      showNotice(result.message);
      if (/verif|otp|activat/i.test(result.message)) {
        router.push(withQuery("/verify-email", { email: emailAddress, next: destination }));
      }
      return;
    }
    const saved = await saveCustomerSession({
      customerId: result.data.customer.customerId,
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
    });
    setPending(false);
    if (!saved.ok) {
      showNotice(saved.message);
      return;
    }
    router.refresh();
    router.push(destination);
  }

  async function onSignUp(event: FormEvent) {
    event.preventDefault();
    const emailAddress = email.trim();
    if (!emailAddress || !password) {
      showNotice("Enter your email and password.");
      return;
    }
    if (password !== confirmPassword) {
      showNotice("Passwords do not match.");
      return;
    }
    setPending(true);
    showNotice("");
    const result = await registerPublicCustomer({ emailAddress, password });
    setPending(false);
    if (!result.ok) {
      showNotice(result.message);
      return;
    }
    router.push(withQuery("/verify-email", { email: emailAddress, next: destination }));
  }

  async function onForgot(event: FormEvent) {
    event.preventDefault();
    const emailAddress = email.trim();
    if (!emailAddress) {
      showNotice("Enter your email.");
      return;
    }
    setPending(true);
    showNotice("");
    const result = await forgotCustomerPassword({ emailAddress });
    setPending(false);
    if (!result.ok) {
      showNotice(result.message);
      return;
    }
    router.push(
      withQuery("/reset-password", {
        email: result.data.emailAddress || emailAddress,
        next: destination,
      }),
    );
  }

  async function onVerify(event: FormEvent) {
    event.preventDefault();
    const emailAddress = email.trim();
    if (!emailAddress || !otp.trim()) {
      showNotice("Enter the code sent to your email.");
      return;
    }
    setPending(true);
    showNotice("");
    const result = await verifyCustomerOtp({ emailAddress, otp: otp.trim() });
    setPending(false);
    if (!result.ok) {
      showNotice(result.message);
      return;
    }
    router.push(withQuery("/login", { next: destination, notice: "verified" }));
  }

  async function onReset(event: FormEvent) {
    event.preventDefault();
    const emailAddress = email.trim();
    if (!emailAddress || !otp.trim() || !password) {
      showNotice("Enter the code and your new password.");
      return;
    }
    if (password !== confirmPassword) {
      showNotice("Passwords do not match.");
      return;
    }
    setPending(true);
    showNotice("");
    const result = await resetCustomerPassword({
      emailAddress,
      otp: otp.trim(),
      newPassword: password,
    });
    setPending(false);
    if (!result.ok) {
      showNotice(result.message);
      return;
    }
    router.push(withQuery("/login", { next: destination, notice: "reset" }));
  }

  async function onResend() {
    const emailAddress = email.trim();
    if (!emailAddress) {
      showNotice("Enter your email.");
      return;
    }
    setPending(true);
    showNotice("");
    const result = await resendCustomerOtp({ emailAddress, userOtpType: otpType });
    setPending(false);
    showNotice(result.ok ? "A new code has been sent." : result.message, result.ok ? "success" : "error");
  }

  const title =
    view === "sign-up"
      ? "Sign Up"
      : view === "forgot"
        ? "Forgot Password"
        : view === "verify"
          ? "Verify Email"
          : view === "reset"
            ? "Reset Password"
            : "Sign In";

  const submitLabel = pending
    ? "Please wait..."
    : view === "sign-up"
      ? "Sign Up"
      : view === "forgot"
        ? "Send Code"
        : view === "verify"
          ? "Verify"
          : view === "reset"
            ? "Reset Password"
            : "Sign In";

  return (
    <main className={`${ptSerif.className} relative flex min-h-dvh items-center justify-center bg-[#0c0e10] p-4`}>
      <Image src="/hero-bg.png" alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative grid w-full max-w-[820px] overflow-hidden rounded-[20px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:grid-cols-2">
        <form
          className="px-7 py-7 sm:px-8 sm:py-8"
          onSubmit={
            view === "sign-up"
              ? onSignUp
              : view === "forgot"
                ? onForgot
                : view === "verify"
                  ? onVerify
                  : view === "reset"
                    ? onReset
                    : onSignIn
          }
        >
          <h1 className="text-[22px] font-semibold text-[#1c1f24]">{title}</h1>

          {view === "forgot" ? (
            <p className="mt-2 text-[13px] leading-5 text-[#667085]">
              Enter the email on your account and we will send a reset code.
            </p>
          ) : null}
          {view === "verify" || view === "reset" ? (
            <p className="mt-2 text-[13px] leading-5 text-[#667085]">
              {email ? `Code sent to ${email}` : "Enter the code from your email."}
            </p>
          ) : null}

          <div className="mt-5 space-y-4">
            {view === "sign-in" || view === "sign-up" || view === "forgot" ? (
              <Field label="Email">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#98a2b3]" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClass}
                />
              </Field>
            ) : null}

            {view === "verify" || view === "reset" ? (
              <Field label="Code">
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter the code"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  className="h-11 w-full rounded-lg border border-[#e4e7ec] px-3 text-[14px] text-[#1c1f24] outline-none placeholder:text-[#98a2b3] focus:border-brand"
                />
              </Field>
            ) : null}

            {view === "sign-in" || view === "sign-up" || view === "reset" ? (
              <Field label={view === "reset" ? "New Password" : "Password"}>
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#98a2b3]" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete={view === "sign-in" ? "current-password" : "new-password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#98a2b3]"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </Field>
            ) : null}

            {view === "sign-in" ? (
              <div className="flex justify-end">
                <Link
                  href={withQuery("/forgot-password", { next: destination })}
                  className="text-[12.5px] text-[#667085] hover:text-brand"
                >
                  Forgot password?
                </Link>
              </div>
            ) : null}

            {view === "sign-up" || view === "reset" ? (
              <Field label="Confirm Password">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#98a2b3]" />
                <input
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirm((current) => !current)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#98a2b3]"
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </Field>
            ) : null}
          </div>

          {message ? (
            <p className={`mt-3 text-[13px] ${tone === "success" ? "text-brand" : "text-danger"}`} role="alert">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand text-[14px] font-medium text-white hover:bg-brand-hover disabled:opacity-70"
          >
            {submitLabel}
          </button>

          {view === "verify" || view === "reset" ? (
            <button
              type="button"
              disabled={pending}
              onClick={onResend}
              className="mt-3 w-full text-center text-[13px] text-brand underline underline-offset-2"
            >
              Resend code
            </button>
          ) : null}

          {view === "sign-in" || view === "sign-up" ? (
            <>
              <p className="my-3 text-center text-[13px] text-[#98a2b3]">Or</p>
              <button
                type="button"
                onClick={() => showNotice("Google sign-in is not available yet.")}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#e4e7ec] bg-white text-[14px] text-[#1c1f24] hover:bg-[#fafafa]"
              >
                <GoogleMark />
                {view === "sign-up" ? "Signup with Google" : "Sign In with Google"}
              </button>
              <p className="mt-4 text-center text-[13px] text-[#667085]">
                {view === "sign-up" ? "Already have an account? " : "Don't have an account? "}
                <Link
                  href={withQuery(view === "sign-up" ? "/login" : "/signup", { next: destination })}
                  className="font-medium text-brand underline underline-offset-2"
                >
                  {view === "sign-up" ? "Sign In" : "Sign Up"}
                </Link>
              </p>
            </>
          ) : (
            <Link
              href={withQuery("/login", { next: destination })}
              className="mt-4 block w-full text-center text-[13px] text-[#667085] hover:text-brand"
            >
              Back to sign in
            </Link>
          )}
        </form>

        <div className="relative hidden min-h-[460px] md:block">
          <Image src="/login-bg.png" alt="" fill sizes="410px" className="object-cover" />
          <Link
            href="/"
            aria-label="Close"
            className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-md bg-white text-[#1c1f24] shadow-sm"
          >
            <X className="size-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}

const inputClass =
  "h-11 w-full rounded-lg border border-[#e4e7ec] pr-10 pl-10 text-[14px] text-[#1c1f24] outline-none placeholder:text-[#98a2b3] focus:border-brand";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[#1c1f24]">{label}</span>
      <span className="relative block">{children}</span>
    </label>
  );
}

function noticeMessage(notice?: string) {
  if (notice === "verified") return "Your account is verified. Sign in to continue.";
  if (notice === "reset") return "Your password has been reset. Sign in to continue.";
  return "";
}

export function safeNext(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/login")) return "/";
  return value;
}

function withQuery(path: string, query: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) search.set(key, value);
  }
  const text = search.toString();
  return text ? `${path}?${text}` : path;
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
