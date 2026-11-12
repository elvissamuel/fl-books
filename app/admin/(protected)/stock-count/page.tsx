import type { Metadata } from "next";
import { StockCountScreen } from "@/components/book-stock/stock-count-screen";

export const metadata: Metadata = {
  title: "Stock Count",
};

export default function StockCountPage() {
  return <StockCountScreen />;
}
