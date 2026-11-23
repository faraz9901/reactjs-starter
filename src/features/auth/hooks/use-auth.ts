import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore, type AuthUser } from "../auth-store";

export function useAuth(): { user: AuthUser | null; isAuthenticated: boolean } {
  const user = useAuthStore((state) => state.user);
  return { user, isAuthenticated: user !== null };
}

/** Placeholder sign-in mutation — swap `mutateAsync` for a real API call. */
export function useSignIn() {
  const signIn = useAuthStore((state) => state.signIn);

  return useMutation({
    mutationFn: async (email: string) => {
      signIn(email);
      return email;
    },
    onSuccess: () => toast.success("Signed in"),
  });
}

export function useSignOut() {
  const signOut = useAuthStore((state) => state.signOut);

  return useMutation({
    mutationFn: async () => {
      signOut();
    },
    onSuccess: () => toast.success("Signed out"),
  });
}
