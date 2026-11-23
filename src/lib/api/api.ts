import { isAxiosError, type AxiosRequestConfig } from "axios";
import { axiosAPI } from "./axios";
import { extractErrorMessage } from "@/lib/errors/extract";

interface AppSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface AppErrorBody {
  success: false;
  message: string;
  code?: string;
  details?: unknown;
}

export class ApiError extends Error {
  readonly code?: string;
  readonly statusCode?: number;
  readonly details?: unknown;

  constructor(
    message: string,
    options: { code?: string; statusCode?: number; details?: unknown } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.details = options.details;
  }
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    const body = error.response?.data as AppErrorBody | undefined;
    return new ApiError(extractErrorMessage(error), {
      code: body?.code,
      statusCode: error.response?.status,
      details: body?.details,
    });
  }

  return new ApiError(extractErrorMessage(error));
}

async function request<T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const res = await axiosAPI.request<AppSuccessResponse<T>>({ method, url, ...config });
    if (res.data.success) return res.data.data;
    throw new ApiError(res.data.message, { statusCode: res.status });
  } catch (error) {
    throw toApiError(error);
  }
}

/**
 * Envelope-unwrapping API helpers. Every call resolves with the payload
 * (`res.data.data`) or throws an `ApiError` carrying `code`/`statusCode`/`details`.
 */
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => request<T>("get", url, config),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>("post", url, { ...config, data }),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>("put", url, { ...config, data }),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>("patch", url, { ...config, data }),
  delete: <T>(url: string, config?: AxiosRequestConfig) => request<T>("delete", url, config),
  download: async (url: string, config?: AxiosRequestConfig): Promise<Blob> => {
    const res = await axiosAPI.get<Blob>(url, { ...config, responseType: "blob" });
    return res.data;
  },
} as const;
