"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginWithPasswordAction } from "@/app/actions/auth";

/**
 * Admin sign-in, shown in-place when an unauthenticated visitor lands on any
 * /admin route. It is deliberately not linked anywhere on the public site —
 * you reach it by typing /admin.
 */
export function AdminLogin() {
  const error = useSearchParams().get("error");
  return (
    <div className="grid min-h-screen place-items-center bg-secondary/30 p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo />
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Lock className="h-3.5 w-3.5" /> Staff / owner sign-in
          </div>
        </div>
        <form
          action={loginWithPasswordAction}
          className="grid gap-3 rounded-lg border bg-background p-6 shadow-sm"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              placeholder="••••••••"
            />
          </div>
          {error === "invalid" && (
            <p className="text-xs text-destructive">Incorrect password. Try again.</p>
          )}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
