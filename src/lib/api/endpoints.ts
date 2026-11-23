const url = (...paths: string[]): string => paths.join("/");

export const ENDPOINTS = {
  USERS: {
    LIST: () => url("/users"),
    GET_BY_ID: (id: string) => url("/users", id),
  },
  HEALTH: {
    CHECK: () => url("/"),
  },
} as const;
