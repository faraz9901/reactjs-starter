import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Placeholder auth store.
 *
 * Replace `signIn` with a real call to your auth provider and `signOut`
 * with a real session teardown — the rest of the app only talks to this
 * store through `useAuth` / `AuthGuard`.
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: AuthUser | null;
  signIn: (email: string) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      // Placeholder: any credentials sign in locally.
      signIn: (email) =>
        set({
          user: {
            id: "local-user",
            email,
            name: email.split("@")[0] ?? email,
          },
        }),
      signOut: () => set({ user: null }),
    }),
    { name: "starter-auth" },
  ),
);
