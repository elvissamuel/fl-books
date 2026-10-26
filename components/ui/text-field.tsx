"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type TextFieldProps = {
  id: string;
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function TextField({
  id,
  label,
  error,
  required,
  className = "",
  type,
  ...props
}: TextFieldProps) {
  const errorId = `${id}-error`;
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-neutral-900">
        {label}
        {required ? (
          <span className="text-danger" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && visible ? "text" : type}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-foreground outline-none transition-colors placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15 ${isPassword ? "pr-10" : ""} ${error ? "border-danger" : "border-line"} ${className}`}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            onClick={() => setVisible((current) => !current)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
          >
            {visible ? (
              <EyeOff className="size-4" strokeWidth={1.75} />
            ) : (
              <Eye className="size-4" strokeWidth={1.75} />
            )}
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
