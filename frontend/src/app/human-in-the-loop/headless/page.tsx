import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

// Reference-only: docs.copilotkit.ai/ms-agent-dotnet/human-in-the-loop/headless.
// On the rendered ms-agent-dotnet page, the only code sample ("The
// primitives") is replaced by "Not supported on MS Agent Framework (.NET)".
// Nothing is published to build, so nothing is mounted.

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/headless" />

      <Panel title="What it covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A render-less way to answer an agent&apos;s interrupt from anywhere
          in the app — a button grid, a form, a test fixture — without a chat
          transcript and without <code>useInterrupt</code>&apos;s render slot.
          For runtimes with no native interrupt, the page describes a{" "}
          <code>useFrontendTool</code> whose async handler publishes its
          pending request as React state (so another surface can show the
          picker) and resolves a held Promise once the user answers, with{" "}
          <code>render: () =&gt; null</code> keeping the chat clean.
        </p>
      </Panel>

      <Callout tone="warn" title="Reference only — the page publishes no .NET code">
        <ul className="space-y-1.5">
          <li>
            · On the rendered ms-agent-dotnet page the &ldquo;primitives&rdquo;
            sample is replaced by &ldquo;Not supported on MS Agent Framework
            (.NET)&rdquo;. There is no frontend code, no agent and no backend
            to build, so no demo is mounted.
          </li>
          <li>
            · The page&apos;s markdown export still carries a{" "}
            <code>schedule_meeting</code> <code>useFrontendTool</code> excerpt
            (from a demo&apos;s <code>page.tsx</code>, with{" "}
            <code>setPending</code>, <code>resolverRef</code> and{" "}
            <code>PickerResult</code> undefined) and points at an agent
            instructed to call it. The rendered page hides it, so it is not
            used here.
          </li>
          <li>
            · For a working interrupt UI on this repo, see{" "}
            <Link className="underline" href="/human-in-the-loop/useInterrupt">
              Pausing the Agent for Input
            </Link>{" "}
            and{" "}
            <Link className="underline" href="/human-in-the-loop/interrupt-flow">
              Interrupt-based
            </Link>
            .
          </li>
        </ul>
      </Callout>
    </>
  );
}
