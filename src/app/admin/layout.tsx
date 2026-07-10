import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-7xl">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
