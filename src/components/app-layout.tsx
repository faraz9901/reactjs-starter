import { LogOut, LayoutDashboard } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth, useSignOut } from "@/features/auth";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
  }`;

export function AppLayout() {
  const { user, isAuthenticated } = useAuth();
  const signOut = useSignOut();

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-6">
            <Link to={ROUTES.HOME} className="font-semibold tracking-tight">
              React Starter
            </Link>
            <nav className="flex items-center gap-1">
              <NavLink to={ROUTES.HOME} className={navLinkClass} end>
                Home
              </NavLink>
              <NavLink to={ROUTES.ABOUT} className={navLinkClass}>
                About
              </NavLink>
              <NavLink to={ROUTES.DASHBOARD.ROOT} className={navLinkClass}>
                Dashboard
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {user?.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut.mutate()}
                  disabled={signOut.isPending}
                >
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <Link to={ROUTES.AUTH.LOGIN}>
                  <LayoutDashboard className="size-4" />
                  Sign in
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t py-4">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground">
          React starter kit — Vite · React Router · TanStack Query · shadcn/ui
        </div>
      </footer>
    </div>
  );
}
