import { BrandMark } from "@/components/brand/brand-mark";

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col bg-white">
      <header className="px-8 py-7 sm:px-10 sm:py-8">
        <BrandMark />
      </header>
    </main>
  );
}
