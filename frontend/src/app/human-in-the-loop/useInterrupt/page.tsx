import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

// docs.copilotkit.ai/ms-agent-dotnet/human-in-the-loop/useInterrupt

const BASE = "frontend/src/app/human-in-the-loop/useInterrupt/demo-chat";

// "Multi-interrupt behavior" — a bare hook call with no component around it,
// so it is shown as text, not mounted.
const MULTI_SNIPPET = `useInterrupt({
  render: ({ interrupts, resolve, cancel }) => (
    <ul>
      {interrupts.map((i) => (
        <li key={i.id}>
          {i.message}
          <button onClick={() => resolve({ ok: true }, i.id)}>Approve</button>
          <button onClick={() => cancel(i.id)}>Cancel</button>
        </li>
      ))}
    </ul>
  ),
});`;

const OUTCOME_SNIPPET = `outcome.type === "interrupt"
outcome.interrupts  // Interrupt[]`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/useInterrupt" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>useInterrupt</code> renders UI for a run that stopped and is
          waiting for a person. In the standard AG-UI flow the run ends with{" "}
          <code>RUN_FINISHED</code> carrying an <code>interrupt</code> outcome;
          the hook hands your <code>render</code> the primary interrupt, the
          full open set, and <code>resolve</code> / <code>cancel</code>, and
          resumes the run once every open interrupt has an answer. The older{" "}
          <code>on_interrupt</code> custom event is still understood.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Delete the file notes.txt"]}
            expect="An Approve / Cancel card in the chat showing the interrupt message (from interrupt_agent: 'Approval required for tool call: delete_file'). Approve should resume the run and the agent reports the file deleted; Cancel ends it."
            fail="The agent says it deleted the file with no card (no interrupt emitted), or Approve produces a RUN_ERROR — a hand-built resume to this agent already returned RUN_ERROR, so resume is the unverified half."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="The page marks this feature unsupported on .NET">
        <ul className="space-y-1.5">
          <li>
            · On the rendered ms-agent-dotnet page, both the frontend sample
            (&ldquo;useFrontendTool with a Promise-resolving handler&rdquo;)
            and the backend sample are replaced by &ldquo;Not supported on MS
            Agent Framework (.NET)&rdquo;. No agent is published. (The page&apos;s
            markdown export still carries a C# <code>InterruptAgent</code> for a
            <code>schedule_meeting</code> frontend tool, calling a non-existent{" "}
            <code>AsLunaChatClient()</code>; the rendered page hides it, so it is
            not built.)
          </li>
          <li>
            · The generic Approve / Cancel component is pure frontend, so it is
            mounted unchanged on this repo&apos;s existing{" "}
            <code>interrupt_agent</code> (from the Interrupt-based route). That
            agent is not from this page.
          </li>
          <li>
            · The multi-interrupt sample is a bare hook call and is shown as
            text only; <code>interrupt_agent</code> raises one interrupt per run.
          </li>
        </ul>
      </Callout>

      <Panel title="Approve / Cancel, as published (mounted)">
        <SourceCodeGroup files={[{ file: `${BASE}/approval-interrupt.tsx` }, { file: `${BASE}/page.tsx` }]} />
      </Panel>

      <Panel title="Published but not run">
        <div className="space-y-4">
          <CodeBlock code={OUTCOME_SNIPPET} filename="Standard flow signal" language="ts" />
          <CodeBlock code={MULTI_SNIPPET} filename="Multi-interrupt behavior" language="tsx" />
        </div>
      </Panel>

      <Panel title="The agent it runs on (not from this page)">
        <SourceCodeGroup files={[{ file: "backend/InterruptAgent.cs" }]} />
      </Panel>
    </>
  );
}
