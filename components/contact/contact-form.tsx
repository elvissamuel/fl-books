"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { createPublicGetInTouch } from "@/infrastructure/get-in-touch/get-in-touch-actions";

const messageLimit = 200;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setNotice("");
    setError("");
    const result = await createPublicGetInTouch({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
    setPending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setNotice("Your message has been sent.");
  }

  return (
    <form
      onSubmit={submit}
      className="w-full rounded-[18px] bg-white px-6 py-6 shadow-[0_10px_30px_rgba(20,24,40,0.06)] sm:px-7 sm:py-7"
    >
      <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#1c1f24]">Get In Touch With Us</h2>
      <div className="mt-5 flex flex-col gap-4">
        <Field label="Name" id="contact-name">
          <input
            id="contact-name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            autoComplete="name"
            required
            className={inputClass}
          />
        </Field>
        <Field label="Email" id="contact-email">
          <input
            id="contact-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            required
            className={inputClass}
          />
        </Field>
        <Field label="Subject" id="contact-subject">
          <input
            id="contact-subject"
            name="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Enter your email"
            required
            className={inputClass}
          />
        </Field>
        <Field label="Message" id="contact-message">
          <div className="relative">
            <textarea
              id="contact-message"
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value.slice(0, messageLimit))}
              placeholder="Text here"
              maxLength={messageLimit}
              required
              rows={5}
              className="min-h-[132px] w-full resize-none rounded-xl border border-[#e6e8ee] bg-white px-4 pt-3 pr-16 pb-8 text-[13.5px] text-[#1c1f24] outline-none placeholder:text-[#b0b6bf] focus:border-brand"
            />
            <span className="pointer-events-none absolute right-4 bottom-3 text-[12px] text-[#b0b6bf]">
              {message.length}/{messageLimit}
            </span>
          </div>
        </Field>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-5 h-12 w-full rounded-lg bg-brand text-[14px] font-medium text-white hover:bg-brand-hover disabled:opacity-70"
      >
        {pending ? "Sending…" : "Lets Talk"}
      </button>
      {notice ? <p className="mt-3 text-center text-[13px] text-brand">{notice}</p> : null}
      {error ? <p className="mt-3 text-center text-[13px] text-danger">{error}</p> : null}
    </form>
  );
}

const inputClass =
  "h-11 w-full rounded-full border border-[#e6e8ee] bg-white px-4 text-[13.5px] text-[#1c1f24] outline-none placeholder:text-[#b0b6bf] focus:border-brand";

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] text-[#8d939c]">
        {label}
      </label>
      {children}
    </div>
  );
}
