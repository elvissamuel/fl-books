"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { loginAdmin } from "@/app/admin/login/actions";
import { initialLoginState } from "@/core/auth/types";

const inputClass =
  "h-11 w-full rounded-lg border border-[#e4e7ec] pr-10 pl-10 text-[14px] text-[#1c1f24] outline-none placeholder:text-[#98a2b3] focus:border-brand";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialLoginState);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  return (
    <form action={formAction} className="px-7 py-7 sm:px-8 sm:py-8" noValidate>
      <h1 className="text-[22px] font-semibold text-[#1c1f24]">Sign In</h1>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-[#1c1f24]">Email</span>
          <span className="relative block">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#98a2b3]" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              className={inputClass}
              aria-invalid={state.fieldErrors.email ? true : undefined}
            />
          </span>
          {state.fieldErrors.email ? (
            <span className="mt-1 block text-[13px] text-danger">{state.fieldErrors.email}</span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-[#1c1f24]">Password</span>
          <span className="relative block">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#98a2b3]" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              className={inputClass}
              aria-invalid={state.fieldErrors.password ? true : undefined}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((current) => !current)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[#98a2b3]"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </span>
          {state.fieldErrors.password ? (
            <span className="mt-1 block text-[13px] text-danger">{state.fieldErrors.password}</span>
          ) : null}
        </label>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setNotice("Password reset is not available on this page.")}
            className="text-[12.5px] text-[#667085] hover:text-brand"
          >
            Forgot password?
          </button>
        </div>
      </div>

      {state.message || notice ? (
        <p className="mt-3 text-[13px] text-danger" role="alert">
          {state.message || notice}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand text-[14px] font-medium text-white hover:bg-brand-hover disabled:opacity-70"
      >
        {pending ? "Please wait..." : "Sign In"}
      </button>

      <p className="my-3 text-center text-[13px] text-[#98a2b3]">Or</p>
      <button
        type="button"
        onClick={() => setNotice("Google sign-in is not available yet.")}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#e4e7ec] bg-white text-[14px] text-[#1c1f24] hover:bg-[#fafafa]"
      >
        <GoogleMark />
        Sign In with Google
      </button>
      <p className="mt-4 text-center text-[13px] text-[#667085]">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => setNotice("Admin accounts are issued separately.")}
          className="font-medium text-brand underline underline-offset-2"
        >
          Sign Up
        </button>
      </p>
    </form>
  );
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
