import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/interrupt-flow" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The approval lives on the server. A backend tool is wrapped in{" "}
          <code>ApprovalRequiredAIFunction</code>; when the model calls it, the
          AG-UI server does not run it but finishes the run with an{" "}
          <code>interrupt</code> outcome. The browser renders that interrupt
          with <code>useInterrupt</code>, and the answer resumes the run. No
          frontend tool is registered for <code>delete_file</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Delete the file notes.txt"]}
            expect={
              <>
                The run stops and the right-hand panel shows{" "}
                <em>Approval required for tool call: delete_file</em> with
                Approve / Deny buttons (unstyled — the doc&apos;s markup is
                plain <code>&lt;button&gt;</code>s). Approve resumes the run and
                the agent reports <code>Deleted notes.txt.</code>; Deny ends the
                run.
              </>
            }
            fail="The agent replies that it deleted the file without the panel ever appearing (the tool was not gated), or the panel stays empty while the chat stalls (the interrupt reached a different agent instance than the panel subscribes to), or Approve produces a RUN_ERROR (resume rejected — see the callout below)."
          />
        </div>
      </Panel>

      <Panel
        title="Frontend"
        description="ApprovalPanel is the page's code, verbatim. The demo page around it is harness glue."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/human-in-the-loop/interrupt-flow/demo-chat/approval-panel.tsx" },
            { file: "frontend/src/app/human-in-the-loop/interrupt-flow/demo-chat/page.tsx" },
          ]}
        />
      </Panel>

      <Panel
        title="Backend — the page's fragment"
        description="The .NET tab exactly as published. Not compiled: it is a fragment, not a program."
      >
        <SourceCode file="backend/doc-samples/InterruptProgram.cs.txt" />
      </Panel>

      <Panel
        title="Backend — what actually runs"
        description="The doc expression is kept verbatim; DeleteFile and the agent around it are harness-authored and labelled as such."
      >
        <SourceCodeGroup
          files={[
            { file: "backend/InterruptAgent.cs", region: "approval-tool" },
            { file: "backend/InterruptAgent.cs", region: "delete-file" },
            { file: "backend/InterruptAgent.cs", region: "interrupt-agent" },
          ]}
          note="Mapped at /interrupt_agent in backend/Program.cs and registered as interrupt_agent in the runtime route."
        />
      </Panel>

      <Callout tone="warn" title="What the page leaves out">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code>DeleteFile</code> is called and never defined. This repo adds
            a one-line stand-in that returns a string and deletes nothing.
          </li>
          <li>
            <code>AddChatClient(/* ... */)</code> elides the chat client, and
            nothing connects that registration to an <code>AIAgent</code> or
            to <code>MapAGUIServer</code>. This repo attaches the gated tool to
            a Quickstart-shaped agent through <code>tools:</code> instead.
          </li>
          <li>
            The Requirements table lists <code>AGUI.Server (.NET) 0.0.6</code>,
            which is not the package the Quickstart installs
            (<code>Microsoft.Agents.AI.Hosting.AGUI.AspNetCore</code>; its
            current preview pulls in <code>AGUI.Server</code> 1.0.0
            transitively).
          </li>
        </ul>
      </Callout>

      <Callout tone="info" title="What was observed against the AG-UI endpoint directly">
        A raw AG-UI request asking to delete <code>notes.txt</code> came back
        with <code>TOOL_CALL_START/ARGS/END</code> for <code>delete_file</code>{" "}
        and then <code>RUN_FINISHED</code> with{" "}
        <code>outcome.type: &quot;interrupt&quot;</code>, reason{" "}
        <code>tool_call</code>, a <code>responseSchema</code> asking for a
        boolean <code>approved</code>, and the message{" "}
        <em>Approval required for tool call: delete_file</em> (the page&apos;s
        example wording is different). A hand-built resume request answered
        with a <code>RUN_ERROR</code>, which may be the hand-built message
        history rather than the server — the browser round trip has not been
        checked yet.
      </Callout>
    </>
  );
}
