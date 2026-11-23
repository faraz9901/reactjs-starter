import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";

export const USERS_KEYS = {
  all: ["users"] as const,
  list: () => ["users", "list"] as const,
  detail: (id: string) => ["users", "detail", id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: USERS_KEYS.list(),
    queryFn: () => usersApi.getUsers(),
  });
}
