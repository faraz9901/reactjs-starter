import { toast } from "sonner";
import { extractErrorMessage } from "./extract";

/** Shows a toast with the extracted message — use as `onError` in React Query mutations. */
export function onError(error: unknown): void {
  toast.error(extractErrorMessage(error));
}
