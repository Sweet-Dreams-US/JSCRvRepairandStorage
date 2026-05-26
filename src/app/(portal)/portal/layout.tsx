import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { store } from "@/lib/store";
import { Sidebar, type SidebarItem } from "@/components/shell/sidebar";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "customer") redirect("/admin");

  const quotes = store.quotesByCustomer(user.id).filter((q) => q.status === "sent");
  const invoices = store.invoicesByCustomer(user.id).filter((i) =>
    ["sent", "partial", "overdue"].includes(i.status),
  );
  const threads = store.threadsForUser(user.id);
  const unread = threads.reduce((sum, t) => sum + (t.unreadFor[user.id] ?? 0), 0);

  const items: SidebarItem[] = [
    { href: "/portal", label: "Dashboard", icon: "home" },
    { href: "/portal/rvs", label: "My RVs", icon: "truck" },
    { href: "/portal/pickup", label: "Schedule Pickup", icon: "calendar-check" },
    { href: "/portal/quotes", label: "Quotes", icon: "file-text", badge: quotes.length },
    { href: "/portal/messages", label: "Messages", icon: "message-square", badge: unread },
    { href: "/portal/billing", label: "Billing", icon: "credit-card", badge: invoices.length },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar items={items} brand="portal" />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
