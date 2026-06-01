import Link from "next/link";
import { Bell, Home } from "lucide-react";
import { DEMO_ACCOUNTS, getCurrentUser } from "@/lib/auth";
import { RoleSwitcher } from "@/components/shell/role-switcher";
import { Button } from "@/components/ui/button";

export async function Topbar({
  title,
  subtitle,
  rightSlot,
}: {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b bg-background/85 pl-16 pr-3 backdrop-blur-lg md:px-5">
      <div>
        <h1 className="font-display text-lg font-bold leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {rightSlot}
        <Button variant="ghost" size="icon" asChild>
          <Link href="/" aria-label="Website home">
            <Home className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <RoleSwitcher
          current={{ name: user.name, role: user.role }}
          accounts={DEMO_ACCOUNTS}
        />
      </div>
    </header>
  );
}
