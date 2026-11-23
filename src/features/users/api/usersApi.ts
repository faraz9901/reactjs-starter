import { api, ENDPOINTS } from "@/lib/api";
import type { UserListItem } from "../types/users.responses";

export const usersApi = {
  getUsers: () => api.get<UserListItem[]>(ENDPOINTS.USERS.LIST()),
  getUserById: (id: string) => api.get<UserListItem>(ENDPOINTS.USERS.GET_BY_ID(id)),
};
