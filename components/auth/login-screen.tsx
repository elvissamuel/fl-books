import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { ptSerif } from "@/lib/public-font";

export function LoginScreen() {
  return (
    <main className={`${ptSerif.className} relative flex min-h-dvh items-center justify-center bg-[#0c0e10] p-4`}>
      <Image src="/hero-bg.png" alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative grid w-full max-w-[820px] overflow-hidden rounded-[20px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:grid-cols-2">
        <LoginForm />
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
