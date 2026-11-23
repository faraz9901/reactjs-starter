import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export interface AsyncStateProps {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  /** `false` renders the `idle` node — for regions waiting on user input. */
  enabled?: boolean;
  skeleton?: ReactNode;
  empty?: ReactNode;
  /** Overrides the default failure UI (message + retry). */
  error?: ReactNode;
  onRetry?: () => void;
  idle?: ReactNode;
  children: ReactNode;
}

/**
 * Renders the only safe branch order: idle → loading → error → empty → content.
 * A failed read can never render as an empty one, and the failure branch
 * always offers a retry (never the empty branch).
 */
export function AsyncState({
  isLoading = false,
  isError = false,
  isEmpty = false,
  enabled = true,
  skeleton,
  empty,
  error,
  onRetry,
  idle,
  children,
}: AsyncStateProps) {
  if (!enabled) return <>{idle ?? null}</>;

  if (isLoading) return <>{skeleton ?? null}</>;

  if (isError) {
    if (error) return <>{error}</>;
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">Something went wrong while loading.</p>
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </div>
    );
  }

  if (isEmpty) return <>{empty ?? null}</>;

  return <>{children}</>;
}
