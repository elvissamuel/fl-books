"use client";

import { useState, type FormEvent } from "react";
import { subscribeNewsletter } from "@/infrastructure/newsletter/newsletter-actions";

export function NewsletterSubscribeForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      setError("Enter an email address.");
      setMessage("");
      return;
    }

    setPending(true);
    setError("");
    setMessage("");
    const result = await subscribeNewsletter({ email: value });
    setPending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setEmail("");
    setMessage("You're subscribed.");
  }

  return (
    <form
      id="contact"
      onSubmit={submit}
      className="w-full max-w-[440px] rounded-[22px] bg-[#ffe5da] p-6 text-[#1c1f24] sm:p-7"
    >
      <h3 className="text-[18px] font-semibold">Subscribe to Our Newsletter</h3>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email address"
          autoComplete="email"
          required
          className="h-11 min-w-0 flex-1 rounded-full bg-white px-4 text-[13.5px] text-[#1c1f24] outline-none placeholder:text-[#b0b6bf]"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-11 shrink-0 rounded-full bg-[#f47832] px-5 text-[13.5px] font-medium text-white transition-colors duration-300 ease-out hover:bg-[#e56d28] disabled:opacity-70"
        >
          {pending ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {message ? <p className="mt-3 text-[13px] text-[#31564e]">{message}</p> : null}
      {error ? <p className="mt-3 text-[13px] text-[#c44747]">{error}</p> : null}
    </form>
  );
}
