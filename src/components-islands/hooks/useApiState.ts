/**
 * useApiState — React hook for managing async API fetch lifecycle in client islands.
 *
 * Provides a unified state shape (idle → loading → success | error) for any
 * async operation, consistent with the FrontendError type from the error layer.
 *
 * Why this hook exists:
 *   SSR pages (cv.astro) fetch data server-side — there is no client-side loading
 *   state to manage there. However, future React island components that fetch data
 *   after mount (contact form submission, lazy-loaded sections, etc.) need a
 *   consistent pattern to avoid ad-hoc useState/useEffect boilerplate per component.
 *
 * State machine:
 *   idle    → initial state, no fetch triggered yet
 *   loading → fetch in progress
 *   success → fetch resolved, `data` is populated
 *   error   → fetch rejected, `error` is populated as FrontendError
 *
 * Usage:
 *   const { state, data, error, execute } = useApiState(() => getCVComplete());
 *
 *   // Trigger on mount:
 *   useEffect(() => { execute(); }, [execute]);
 *
 *   // Render branches:
 *   if (state === "loading") return <Spinner />;
 *   if (state === "error")   return <ErrorBanner message={error!.userMessage} />;
 *   if (state === "success") return <MyComponent data={data!} />;
 */

import { useState, useCallback } from "react";
import { normalizeError } from "@/utils/error-handler";
import type { FrontendError } from "@/types/error.types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ApiStateStatus = "idle" | "loading" | "success" | "error";

export interface ApiState<T> {
  status: ApiStateStatus;
  data: T | null;
  error: FrontendError | null;
  /**
   * Trigger the async fetcher. Safe to call multiple times — concurrent
   * calls are ignored while a fetch is already in progress.
   */
  execute: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * @param fetcher - Async function that performs the API call and returns T.
 *                  Must be stable across renders (wrap in useCallback or define
 *                  outside the component) to avoid unnecessary re-subscriptions.
 */
export function useApiState<T>(fetcher: () => Promise<T>): ApiState<T> {
  const [status, setStatus] = useState<ApiStateStatus>("idle");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<FrontendError | null>(null);

  const execute = useCallback(async () => {
    if (status === "loading") return;

    setStatus("loading");
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      setStatus("success");
    } catch (err) {
      setError(normalizeError(err));
      setStatus("error");
    }
  }, [fetcher, status]);

  return { status, data, error, execute };
}
