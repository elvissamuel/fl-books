import {
  Book,
  LayoutGrid,
  Mail,
  MapPin,
  MessageSquare,
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
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/administration", label: "Administration", icon: Users },
  { href: "/admin/settings", label: "Platform Settings", icon: Settings },
];
