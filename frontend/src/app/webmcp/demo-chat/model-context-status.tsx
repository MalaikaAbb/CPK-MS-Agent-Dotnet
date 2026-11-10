"use client";

import { useSyncExternalStore } from "react";

/**
 * HARNESS GLUE — not from the docs. A read-only check of whether this browser
 * exposes `document.modelContext`. When it does not, CopilotKit skips WebMCP
 * registration without a warning, so this is the only visible signal that
 * the browser-agent path is even possible here.
 */
export function ModelContextStatus() {
  const available = useSyncExternalStore(
    () => () => {},
    () => "modelContext" in document && Boolean((document as { modelContext?: unknown }).modelContext),
    () => null,
  );

  if (available === null) return null;

  return (
    <p
      className={`shrink-0 border-b px-4 py-1.5 text-xs ${
        available
          ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
          : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
      }`}
    >
      Harness check · document.modelContext is{" "}
      <strong>{available ? "available" : "not available"}</strong> in this
      browser.{" "}
      {available
        ? "searchOrders should be listed in Chrome's Model Context Tool Inspector."
        : "The WebMCP path cannot be tested here (needs Chrome 149+ with the WebMCP flag or origin trial). The chat path below still works."}
    </p>
  );
}
