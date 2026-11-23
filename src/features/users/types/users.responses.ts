export type UserStatus = "active" | "invited" | "suspended";

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
}
