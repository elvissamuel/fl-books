import type { Metadata } from "next";
import { BookDetailScreen } from "@/components/books/book-detail-screen";

export const metadata: Metadata = {
  title: "Book",
};

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  return <BookDetailScreen bookId={bookId} />;
}
