import { useEffect, useRef } from "react";

/**
 * Custom hook to subscribe a component to real-time portfolio updates.
 * Whenever an admin adds, edits, or deletes content anywhere (same window or another tab),
 * or when the user focuses back on the portfolio, `onSync` is called to fetch fresh data.
 *
 * @param {Function} onSync - The callback function to re-fetch live data from the API
 * @param {string} [endpointFilter] - Optional endpoint prefix or keyword to filter events
 */
export function usePortfolioSync(onSync, endpointFilter) {
  const syncRef = useRef(onSync);
  syncRef.current = onSync;

  useEffect(() => {
    let debounceTimer = null;

    const triggerSync = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (typeof syncRef.current === "function") {
          syncRef.current();
        }
      }, 50);
    };

    // 1. Same-window CustomEvent listener
    const handlePortfolioUpdated = (e) => {
      if (endpointFilter && e.detail?.endpoint) {
        if (!e.detail.endpoint.includes(endpointFilter)) {
          return;
        }
      }
      triggerSync();
    };
    window.addEventListener("portfolio_updated", handlePortfolioUpdated);

    // 2. Cross-tab storage event listener
    const handleStorage = (e) => {
      if (e.key === "portfolio_sync_timestamp") {
        triggerSync();
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. Tab visibility / focus event listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        triggerSync();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", triggerSync);

    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("portfolio_updated", handlePortfolioUpdated);
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", triggerSync);
    };
  }, [endpointFilter]);
}
