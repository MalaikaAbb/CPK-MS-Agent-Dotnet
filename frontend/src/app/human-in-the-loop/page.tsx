import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { Panel } from "@/components/ui";

// Reference page: docs.copilotkit.ai/ms-agent-dotnet/human-in-the-loop (HITL
// overview). The page publishes no code — it explains when to use each of the
// two HITL patterns and links to them. Summarised in our own words.

const PATTERNS = [
  {
    href: "/human-in-the-loop/interrupt-flow",
    title: "Interrupt-based",
    body: "The backend owns the decision: a backend tool is marked approval-gated, the run pauses before it executes, and useInterrupt renders the approval. The frontend never needs the tool's name.",
  },
  {
    href: "/human-in-the-loop/tool-based",
    title: "Tool-based",
    body: "The frontend owns the work: a browser tool registered with useHumanInTheLoop renders UI and waits for the user's answer, and the agent calls it like any other tool.",
  },
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop" />

      <Panel title="What it covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The landing page for human-in-the-loop on Microsoft Agent Framework:
          an agent stops to ask a person before an expensive, destructive or
          judgement-heavy step. It names two patterns and sends you to their
          pages; there is nothing to run here. Each pattern has its own live
          route below.
        </p>
      </Panel>

      <Panel title="The two patterns">
        <div className="grid gap-3 sm:grid-cols-2">
          {PATTERNS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="rounded-lg border border-slate-200 p-4 hover:border-[var(--accent)] dark:border-slate-700"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{p.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{p.body}</p>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          The page&apos;s cards link to the framework-neutral{" "}
          <code>/human-in-the-loop/interrupt-flow</code> and{" "}
          <code>/human-in-the-loop/tool-based</code> URLs rather than the
          ms-agent-dotnet ones.
        </p>
      </Panel>
    </>
  );
}
