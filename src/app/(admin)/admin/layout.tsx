import { Suspense } from "react";
import { redirect } from "next/navigation";
import { accessStore } from "@/lib/access-store";
import { getCurrentUser } from "@/lib/auth";
import { store } from "@/lib/store";
import { AdminLogin } from "@/components/shell/admin-login";
import { Sidebar, type SidebarItem } from "@/components/shell/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  // Not signed in → show the admin sign-in in place (this is the only way to
  // reach it; it isn't linked from the public site). `children` isn't rendered,
  // so the gated pages never run.
  if (!user) {
    return (
      <Suspense>
        <AdminLogin />
      </Suspense>
    );
  }
  if (user.role === "customer") redirect("/portal");

  const stats = store.computeStats();
  const newLeads = store.newLeads().length;
  const unreadThreads = store
    .listThreads()
    .reduce((sum, t) => sum + (t.unreadFor[user.id] ?? 0), 0);

  // Live CRM badges from Supabase — never let a hiccup break the admin shell.
  const [openRequests, unreadMessages, upcoming] = await Promise.all([
    accessStore.countOpenRequests().catch(() => 0),
    accessStore.countUnreadForOwner().catch(() => 0),
    accessStore.upcomingAppointments(500).then((a) => a.length).catch(() => 0),
  ]);

  const items: SidebarItem[] = [
    { href: "/admin", label: "Dashboard", icon: "home" },
    { href: "/admin/leads", label: "Inquiries", icon: "inbox", badge: newLeads },
    { href: "/admin/access", label: "Customers", icon: "users", badge: unreadMessages },
    { href: "/admin/requests", label: "Requests", icon: "list-todo", badge: openRequests },
    { href: "/admin/appointments", label: "Appointments", icon: "calendar-clock", badge: upcoming },
    { href: "/admin/jobs", label: "Jobs", icon: "clipboard-list", badge: stats.activeJobs },
    { href: "/admin/schedule", label: "Schedule", icon: "calendar-days" },
    { href: "/admin/pickups", label: "Pickups", icon: "sparkles", badge: stats.upcomingPickups },
    { href: "/admin/lot", label: "Storage Lot", icon: "map-pinned" },
    { href: "/admin/customers", label: "Contacts", icon: "user-cog" },
    { href: "/admin/rvs", label: "RVs", icon: "truck" },
    { href: "/admin/rentals", label: "Rentals", icon: "key-round" },
    { href: "/admin/quotes", label: "Quotes", icon: "file-text" },
    { href: "/admin/invoices", label: "Invoices", icon: "credit-card" },
    { href: "/admin/messages", label: "Team Inbox", icon: "message-square", badge: unreadThreads },
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
