import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { store } from "@/lib/store";
import { Sidebar, type SidebarItem } from "@/components/shell/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "customer") redirect("/portal");

  const stats = store.computeStats();
  const newLeads = store.newLeads().length;
  const unreadThreads = store
    .listThreads()
    .reduce((sum, t) => sum + (t.unreadFor[user.id] ?? 0), 0);

  const items: SidebarItem[] = [
    { href: "/admin", label: "Dashboard", icon: "home" },
    { href: "/admin/jobs", label: "Jobs", icon: "clipboard-list", badge: stats.activeJobs },
    { href: "/admin/schedule", label: "Schedule", icon: "calendar-days" },
    { href: "/admin/pickups", label: "Pickups", icon: "sparkles", badge: stats.upcomingPickups },
    { href: "/admin/lot", label: "Storage Lot", icon: "map-pinned" },
    { href: "/admin/customers", label: "Customers", icon: "users" },
    { href: "/admin/rvs", label: "RVs", icon: "truck" },
    { href: "/admin/rentals", label: "Rentals", icon: "key-round" },
    { href: "/admin/quotes", label: "Quotes", icon: "file-text" },
    { href: "/admin/invoices", label: "Invoices", icon: "credit-card" },
    { href: "/admin/messages", label: "Messages", icon: "message-square", badge: unreadThreads },
    { href: "/admin/leads", label: "Leads", icon: "user-cog", badge: newLeads },
    { href: "/admin/analytics", label: "Analytics", icon: "line-chart" },
    { href: "/admin/accounting", label: "Accounting", icon: "wallet" },
    { href: "/admin/staff", label: "Staff", icon: "users" },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar items={items} brand="admin" />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
