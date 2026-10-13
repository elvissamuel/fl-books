import { BrandMark } from "@/components/brand/brand-mark";
import { LoginForm } from "@/components/auth/login-form";

export function LoginScreen() {
  return (
    <div className="relative min-h-dvh bg-background">
      <div className="absolute top-7 left-8 sm:top-8 sm:left-10">
        <BrandMark />
      </div>
      <main className="flex min-h-dvh items-center justify-center px-4 py-24">
        <section className="w-full max-w-[28rem] rounded-[1.35rem] bg-surface px-8 py-10 shadow-[0_10px_40px_rgba(17,17,17,0.04)] sm:px-10 sm:py-12">
          <h1 className="text-center text-[1.35rem] font-bold tracking-tight text-neutral-950">
            let&apos;s get you started.
          </h1>
          <LoginForm />
        </section>
      </main>
    </div>
  );
}
