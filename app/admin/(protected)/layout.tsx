import { AdminShell } from "@/components/admin/admin-shell";
import { QueryProvider } from "@/components/providers/query-provider";
import { requireAdminSession } from "@/infrastructure/auth/require-admin-session";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return (
    <QueryProvider>
      <AdminShell>{children}</AdminShell>
    </QueryProvider>
  );
}
