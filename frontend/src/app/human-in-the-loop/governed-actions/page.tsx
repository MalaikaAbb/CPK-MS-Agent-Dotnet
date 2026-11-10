import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const ENVELOPE_SNIPPET = `type GovernedAction = {
  id: string;
  summary: string;
  tool: string;
  reference: string;
  verdict: "allow" | "deny" | "require_approval";
  arguments: Record<string, unknown>;
};`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/governed-actions" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A checkpoint in front of side-effecting actions — sending an email,
          updating a record, calling any write API. The user sees what the agent
          wants to do, why, which policy decision produced the verdict, and what
          happens next.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page gives two entry points. This route implements the
          tool-call one, <code>useHumanInTheLoop</code>, because it runs on this
          stack without a server-side change: frontend tools are forwarded to
          the agent automatically over AG-UI, so the Quickstart agent can call{" "}
          <code>approve_governed_action</code> as-is.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Call approve_governed_action to send a refund email to alex@example.com for $40, reference POLICY-114, verdict require_approval",
            ]}
            expect="An approval card renders in the chat with the arguments shown, and the run waits. Approving resumes it; rejecting tells the agent it may not proceed."
            fail="The agent answers in prose without a card — it did not call the tool. Name the tool explicitly; nothing instructs it to reach for one."
          />
        </div>
      </Panel>

      <Panel title="The action envelope">
        <CodeBlock
          filename="The page's type, verbatim"
          language="typescript"
          code={ENVELOPE_SNIPPET}
        />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Small, serializable and vendor-neutral, so any policy engine&apos;s
          result can be attached to the action as long as the UI receives this
          shape. The three verdicts are handled deterministically:{" "}
          <code>allow</code> runs without asking again, <code>deny</code> is
          terminal, and <code>require_approval</code> renders the card.
        </p>
      </Panel>

      <Panel title="Source">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/human-in-the-loop/governed-actions/demo-chat/page.tsx" },
            { file: "frontend/src/app/human-in-the-loop/governed-actions/demo-chat/governed-action-card.tsx" },
          ]}
        />
      </Panel>

      <Callout tone="warn" title="One deviation, and why it was unavoidable">
        The page&apos;s schema ends with{" "}
        <code>arguments: z.record(z.unknown())</code>. Zod 4 requires an
        explicit key schema, so the single-argument form is a{" "}
        <em>type</em> error — it fails the build rather than failing at runtime,
        which means there is no way to keep it verbatim and still have an app
        that compiles. This repo writes{" "}
        <code>z.record(z.string(), z.unknown())</code>, the same type with the
        key spelled out, and records it here rather than fixing it quietly.
      </Callout>

      <Callout tone="warn" title="What the page does not publish">
        No agent. Not in C#, not in any language. The page never shows a
        Microsoft Agent Framework agent that proposes{" "}
        <code>approve_governed_action</code>, so nothing instructs the model
        when to reach for it — which is why the prompt above has to name the
        tool. The resume path&apos;s <code>executeSideEffect</code> is called
        and never defined either.
        <p className="mt-2">
          The <code>useInterrupt</code> entry point is in the same position: it
          needs a backend that pauses a run mid-flight, and no such agent is
          shown. Only the tool-call path is exercised here.
        </p>
      </Callout>

      <Callout tone="info" title="The guardrails are worth reading">
        The page closes with a list this harness cannot demonstrate but should
        not bury: check policy on the server before presenting the approval,
        keep a stable <code>id</code> and <code>reference</code> so an approval
        cannot be replayed against a different action, treat <code>deny</code>{" "}
        as terminal, and log proposal, verdict, decision and result so the
        action is auditable.
      </Callout>
    </>
  );
}
