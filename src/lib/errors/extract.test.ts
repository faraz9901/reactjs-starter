import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { describe, expect, it } from "vitest";
import { extractErrorMessage, extractFieldErrors } from "./extract";

function axiosErrorWith(status: number, data: unknown): AxiosError {
  const config: InternalAxiosRequestConfig = { headers: new AxiosHeaders() };
  return new AxiosError(
    "Request failed",
    AxiosError.ERR_BAD_REQUEST,
    config,
    {},
    {
      data,
      status,
      statusText: "Error",
      headers: new AxiosHeaders(),
      config,
    },
  );
}

describe("extractErrorMessage", () => {
  it("prefers the mapped message for a known error code", () => {
    const error = axiosErrorWith(404, {
      success: false,
      code: "RESOURCE_NOT_FOUND",
      message: "raw api message",
    });
    expect(extractErrorMessage(error)).toBe("We couldn't find what you're looking for.");
  });

  it("falls back to the raw message for unknown codes", () => {
    const error = axiosErrorWith(400, {
      success: false,
      code: "SOME_NEW_CODE",
      message: "raw api message",
    });
    expect(extractErrorMessage(error)).toBe("raw api message");
  });

  it("joins array messages", () => {
    const error = axiosErrorWith(400, {
      success: false,
      code: "VALIDATION_ERROR",
      message: ["name is required", "email is invalid"],
    });
    expect(extractErrorMessage(error)).toBe("Some of the details you entered are invalid.");
  });

  it("uses Error.message when there is no body", () => {
    expect(extractErrorMessage(new Error("network down"))).toBe("network down");
  });

  it("returns the fallback for unknown throwables", () => {
    expect(extractErrorMessage(42, "custom fallback")).toBe("custom fallback");
  });
});

describe("extractFieldErrors", () => {
  it("maps zod-style issues from details to fields", () => {
    const error = axiosErrorWith(400, {
      success: false,
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      details: [
        { path: ["email"], message: "Invalid email" },
        { path: ["profile", "age"], message: "Too small" },
      ],
    });

    expect(extractFieldErrors(error)).toEqual({
      email: ["Invalid email"],
      "profile.age": ["Too small"],
    });
  });

  it("returns an empty object when there are no details", () => {
    expect(extractFieldErrors(new Error("boom"))).toEqual({});
  });
});
