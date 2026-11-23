import { isAxiosError } from "axios";
import { ERROR_CODE_MESSAGES } from "./error-codes";

interface ErrorBody {
  code?: unknown;
  message?: unknown;
  error?: unknown;
  details?: unknown;
}

function getBody(error: unknown): ErrorBody | null {
  if (isAxiosError(error) && error.response?.data && typeof error.response.data === "object") {
    return error.response.data as ErrorBody;
  }
  if (error && typeof error === "object" && "code" in error && "message" in error) {
    return error as ErrorBody;
  }
  return null;
}

function messageFromBody(body: ErrorBody | null): string | null {
  if (!body) return null;

  // 1. Error code → mapped message
  if (typeof body.code === "string" && ERROR_CODE_MESSAGES[body.code]) {
    return ERROR_CODE_MESSAGES[body.code];
  }
  // 2. Named refusal (error.message)
  if (typeof body.error === "string" && body.error.trim()) {
    return body.error;
  }
  if (body.error && typeof body.error === "object" && "message" in body.error) {
    const nested = (body.error as { message?: unknown }).message;
    if (typeof nested === "string" && nested.trim()) return nested;
  }
  // 3. Standard message (string | string[])
  if (typeof body.message === "string" && body.message.trim()) return body.message;
  if (Array.isArray(body.message)) {
    const joined = body.message.filter((m): m is string => typeof m === "string").join(", ");
    if (joined.trim()) return joined;
  }
  return null;
}

/** Extracts a human-readable message from any thrown error. Order: code → error → message → transport. */
export function extractErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  const fromBody = messageFromBody(getBody(error));
  if (fromBody) return fromBody;

  // 4. Transport / plain errors
  if (typeof error === "string" && error.trim()) return error;
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

/**
 * Extracts per-field messages (e.g. Zod issues in `details`) as
 * `field → messages[]` so forms can mark inputs inline.
 */
export function extractFieldErrors(error: unknown): Record<string, string[]> {
  const details = getBody(error)?.details;
  if (!Array.isArray(details)) return {};

  const fieldErrors: Record<string, string[]> = {};
  for (const issue of details) {
    if (!issue || typeof issue !== "object") continue;
    const { path, message } = issue as { path?: unknown; message?: unknown };
    if (typeof message !== "string") continue;
    const key = Array.isArray(path) ? path.join(".") : typeof path === "string" ? path : "_";
    (fieldErrors[key] ??= []).push(message);
  }
  return fieldErrors;
}
