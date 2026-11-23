/**
 * API error code → human-readable message.
 *
 * Keep in sync with the NestJS starter's `src/common/errors.ts` (ErrorCode enum)
 * on every run — when the API adds a code, add it here and update both sides.
 */
export const ERROR_CODE_MESSAGES: Record<string, string> = {
  // Generic
  UNKNOWN_ERROR: "Something went wrong. Please try again.",
  INTERNAL_ERROR: "Something went wrong on our side. Please try again.",
  SERVICE_UNAVAILABLE: "The service is temporarily unavailable. Please try again shortly.",
  TIMEOUT: "The request took too long. Please try again.",
  // Validation
  BAD_REQUEST: "The request was invalid. Check your input and try again.",
  TOO_MANY_REQUESTS: "Too many requests. Please slow down and try again shortly.",
  VALIDATION_ERROR: "Some of the details you entered are invalid.",
  INVALID_PAYLOAD: "The request payload was invalid.",
  INVALID_QUERY_PARAMS: "Some query parameters were invalid.",
  MISSING_REQUIRED_FIELD: "A required field is missing.",
  INVALID_FORMAT: "One of the fields has an invalid format.",
  PAYLOAD_TOO_LARGE: "The payload is too large.",
  // Auth
  UNAUTHORIZED: "You need to sign in to continue.",
  INVALID_CREDENTIALS: "Those credentials don't match our records.",
  TOKEN_EXPIRED: "Your session expired. Please sign in again.",
  TOKEN_INVALID: "Your session is invalid. Please sign in again.",
  TOKEN_MISSING: "You need to sign in to continue.",
  SESSION_EXPIRED: "Your session expired. Please sign in again.",
  // Authorization
  FORBIDDEN: "You don't have permission to do that.",
  INSUFFICIENT_PERMISSIONS: "You don't have permission to do that.",
  ACCESS_DENIED: "You don't have access to this resource.",
  // Resources
  NOT_FOUND: "We couldn't find what you're looking for.",
  RESOURCE_NOT_FOUND: "We couldn't find what you're looking for.",
  RESOURCE_ALREADY_EXISTS: "That already exists.",
  RESOURCE_CONFLICT: "This conflicts with existing data.",
  RESOURCE_LOCKED: "This resource is currently locked.",
  // Business
  BUSINESS_RULE_VIOLATION: "That action isn't allowed right now.",
  OPERATION_NOT_ALLOWED: "That operation isn't allowed.",
  INVALID_STATE: "This item is in a state where that action isn't possible.",
  LIMIT_EXCEEDED: "You've reached a limit. Please try again later.",
  // External
  EXTERNAL_SERVICE_ERROR: "An external service failed. Please try again.",
  EXTERNAL_SERVICE_UNAVAILABLE: "An external service is unavailable. Please try again later.",
  EXTERNAL_TIMEOUT: "An external service took too long. Please try again.",
  THIRD_PARTY_FAILURE: "A third-party service failed. Please try again.",
};
