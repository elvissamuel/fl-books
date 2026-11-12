import {
  Book,
  Boxes,
  LayoutGrid,
  MapPin,
  MessagesSquare,
  Settings,
  ShoppingBag,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

export const adminNavigation: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid, exact: true },
  { href: "/admin/books", label: "Books", icon: Book },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customer", icon: User },
  { href: "/admin/pickup-stations", label: "Pickup Stations", icon: MapPin },
  { href: "/admin/audience", label: "Audience", icon: MessagesSquare },
  { href: "/admin/administration", label: "Administration", icon: Users },
  { href: "/admin/stock-count", label: "Stock Count", icon: Boxes },
  { href: "/admin/settings", label: "Platform Settings", icon: Settings },
];
