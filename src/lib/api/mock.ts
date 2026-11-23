import { AxiosHeaders, type AxiosAdapter, type AxiosResponse } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { ApiErrorBody, ApiSuccess } from "@/types";

/**
 * Placeholder adapter used when `VITE_API_URL` is empty.
 * Lets the starter demo loading/success/error states without a backend.
 * Remove together with the switch in `axios.ts` once a real API is wired.
 */

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "suspended";
}

const MOCK_USERS: MockUser[] = [
  { id: "1", name: "Ada Lovelace", email: "ada@example.com", role: "Admin", status: "active" },
  { id: "2", name: "Alan Turing", email: "alan@example.com", role: "Editor", status: "active" },
  { id: "3", name: "Grace Hopper", email: "grace@example.com", role: "Editor", status: "invited" },
  {
    id: "4",
    name: "Katherine Johnson",
    email: "katherine@example.com",
    role: "Viewer",
    status: "active",
  },
  {
    id: "5",
    name: "Barbara Liskov",
    email: "barbara@example.com",
    role: "Viewer",
    status: "suspended",
  },
];

const DELAY_MS = 400;

function ok<T>(config: InternalAxiosRequestConfig, data: T): AxiosResponse<ApiSuccess<T>> {
  return {
    data: { success: true, message: "OK", data },
    status: 200,
    statusText: "OK",
    headers: new AxiosHeaders(),
    config,
  };
}

function fail(
  config: InternalAxiosRequestConfig,
  status: number,
  code: string,
  message: string,
): AxiosResponse<ApiErrorBody> {
  return {
    data: { success: false, message, code },
    status,
    statusText: "Error",
    headers: new AxiosHeaders(),
    config,
  };
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

  const method = (config.method ?? "get").toLowerCase();
  const path = (config.url ?? "").split("?")[0];

  if (method === "get" && path === "/users") {
    return ok(config, MOCK_USERS);
  }

  return fail(config, 404, "RESOURCE_NOT_FOUND", `No mock for ${method.toUpperCase()} ${path}`);
};
