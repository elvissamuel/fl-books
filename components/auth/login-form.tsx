"use client";

import { useActionState, useState } from "react";
import { loginAdmin } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { initialLoginState } from "@/core/auth/types";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAdmin,
    initialLoginState,
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4" noValidate>
      <TextField
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="Enter email address"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={state.fieldErrors.email}
      />
      <TextField
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Enter password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={state.fieldErrors.password}
      />
      {state.message ? (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={pending}
        className="mt-2 h-11 w-full bg-brand text-sm text-white hover:bg-brand-hover"
        aria-busy={pending}
      >
        {pending ? "Continuing…" : "Continue"}
      </Button>
    </form>
  );
}
