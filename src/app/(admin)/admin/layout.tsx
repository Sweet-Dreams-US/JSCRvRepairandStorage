import { Suspense } from "react";
import { redirect } from "next/navigation";
import { accessStore } from "@/lib/access-store";
import { getCurrentUser } from "@/lib/auth";
import { leadsStore } from "@/lib/leads-store";
import { AdminLogin } from "@/components/shell/admin-login";
import { Sidebar, type SidebarItem } from "@/components/shell/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  // Not signed in → show the admin sign-in in place (only reachable by typing
  // /admin; not linked publicly). `children` isn't rendered, so gated pages
  // never run.
  if (!user) {
    return (
      <Suspense>
        <AdminLogin />
      </Suspense>
    );
  }
  if (user.role === "customer") redirect("/portal");

  // Live badges — fail-soft so a hiccup never breaks the admin shell.
  const [newLeads, openRequests, unreadMessages, upcoming] = await Promise.all([
    leadsStore.countNew().catch(() => 0),
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
    { href: "/admin/pickups", label: "Pickups", icon: "sparkles" },
    { href: "/admin/quotes", label: "Quotes", icon: "file-text" },
    { href: "/admin/invoices", label: "Invoices", icon: "credit-card" },
    { href: "/admin/accounting", label: "Accounting", icon: "wallet" },
    { href: "/admin/rentals", label: "Rentals", icon: "key-round" },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar items={items} brand="admin" />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
