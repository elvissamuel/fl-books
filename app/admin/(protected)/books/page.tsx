import type { Metadata } from "next";
import { BooksScreen } from "@/components/books/books-screen";

export const metadata: Metadata = {
  title: "Books",
};

export default function BooksPage() {
  return <BooksScreen />;
}
