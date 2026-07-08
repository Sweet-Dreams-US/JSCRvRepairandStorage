"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, RefreshCcw } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { loginAsDemoUser, logoutAction } from "@/app/actions/auth";
import { initials } from "@/lib/utils";

type DemoAccount = { id: string; label: string; subtitle: string; role: string };

export function RoleSwitcher({
  current,
  accounts,
}: {
  current: { name: string; role: string };
  accounts: DemoAccount[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const switchTo = (userId: string) => {
    const fd = new FormData();
    fd.set("userId", userId);
    startTransition(async () => {
      await loginAsDemoUser(fd);
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border bg-background px-2 py-1 transition-colors hover:bg-accent">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
              {initials(current.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left md:block">
            <div className="text-xs font-semibold leading-tight">{current.name}</div>
            <div className="text-[10px] text-muted-foreground capitalize">{current.role}</div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        {accounts.length > 0 && (
          <>
            <DropdownMenuLabel>Switch demo account</DropdownMenuLabel>
            {accounts.map((a) => (
              <DropdownMenuItem
                key={a.id}
                onClick={() => switchTo(a.id)}
                disabled={pending}
                className="flex flex-col items-start gap-0"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-semibold">{a.label}</span>
                  <span className="text-[10px] uppercase text-muted-foreground">{a.role}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{a.subtitle}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => router.refresh()}>
          <RefreshCcw className="mr-2 h-3.5 w-3.5" /> Refresh
        </DropdownMenuItem>
        <form action={logoutAction}>
          <DropdownMenuItem asChild>
            <button className="w-full" type="submit">
              <LogOut className="mr-2 h-3.5 w-3.5" /> Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
