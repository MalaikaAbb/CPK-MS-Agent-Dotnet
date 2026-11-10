"use client";

import { useEffect } from "react";

/**
 * The approval card, exactly as the Governed Actions page publishes it.
 *
 * Both of the page's entry points — the `useInterrupt` version and the
 * `useHumanInTheLoop` version — render this same component, so it lives in its
 * own file rather than being duplicated.
 *
 * The `useEffect` is the page's policy shortcut: an `allow` verdict
 * auto-approves and a `deny` verdict auto-blocks, so only
 * `require_approval` ever waits for a human.
 *
 * Colours come from CopilotKit's own tokens rather than from Tailwind palette
 * classes, because this card renders *inside* the chat. Two things go wrong
 * otherwise, and both did:
 *
 *   - `var(--accent)` is not the harness accent here. CopilotKit's token set,
 *     scoped to `[data-copilotkit]`, defines `--accent` as a near-white hover
 *     surface, so `bg-[var(--accent)] text-white` rendered an invisible button.
 *     `--primary` / `--primary-foreground` is the pair that actually means
 *     "filled button".
 *
 *   - `dark:` variants key off `prefers-color-scheme`, while CopilotKit keys
 *     off a `.dark` class nothing sets. On an OS-dark machine `dark:bg-slate-800`
 *     painted this card's `<pre>` near-black while the chat stayed light, and
 *     the inherited text stayed dark — dark on dark.
 *
 * The tokens below track the chat's theme in both directions with no variant.
 * See the note at the bottom of `app/globals.css`.
 */

export type GovernedAction = {
  id: string;
  summary: string;
  tool: string;
  reference: string;
  verdict: "allow" | "deny" | "require_approval";
  arguments: Record<string, unknown>;
};

export function GovernedActionCard({
  action,
  onApprove,
  onReject,
  onBlock,
}: {
  action: GovernedAction;
  onApprove: () => void;
  onReject: () => void;
  onBlock: () => void;
}) {
  useEffect(() => {
    if (action.verdict === "allow") onApprove();
    if (action.verdict === "deny") onBlock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action.id, action.verdict]);

  const status =
    action.verdict === "allow"
      ? "Allowed by policy"
      : action.verdict === "deny"
        ? "Blocked by policy"
        : "User approval required";

  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-[var(--card-foreground)] shadow-sm">
      <div className="space-y-1">
        <p className="text-sm font-medium">{status}</p>
        <h3 className="text-base font-semibold">{action.summary}</h3>
        <p className="text-sm text-[var(--muted-foreground)]">Tool: {action.tool}</p>
        <p className="text-sm text-[var(--muted-foreground)]">Reference: {action.reference}</p>
      </div>

      <pre className="mt-3 overflow-auto rounded bg-[var(--muted)] p-3 text-xs text-[var(--foreground)]">
        {JSON.stringify(action.arguments, null, 2)}
      </pre>

      {action.verdict === "require_approval" && (
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onApprove}
            className="rounded-md bg-[var(--primary)] px-3 py-1.5 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90"
          >
            Approve and run
          </button>
          <button
            type="button"
            onClick={onReject}
            className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)]"
          >
            Reject
          </button>
        </div>
      )}
    </section>
  );
}
