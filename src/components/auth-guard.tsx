import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { ROUTES } from "@/lib/constants/routes";

/**
 * Placeholder guard: unauthenticated users are redirected to the login page
 * with the intended location stored in `location.state.from`.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
