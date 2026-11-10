import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/in-app-agent-write" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The other direction: <code>agent.setState</code> writes into the state
          the agent will see. The doc is careful about <em>when</em> that takes
          effect — the new value is used on the agent&apos;s next run, which may
          be several turns away.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          To make it immediate, the doc&apos;s advanced section appends a hint
          message with <code>agent.addMessage</code> and then calls{" "}
          <code>copilotkit.runAgent()</code>. The demo has both as separate
          buttons so the difference is visible rather than described.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Toggle Language, then ask what language you are using"]}
            expect="The toggle updates agent.state in the panel, because setState mutates the client-side copy. The re-run reaches the Quickstart agent at sample_agent and gets a reply, but the agent does not see the written language. Checked 2026-11-06: a run carrying state {language: 'spanish'} got the reply 'NO STATE'."
            fail="The re-run errors — the backend is an old build without /sample_agent; restart it."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="What is actually missing">
        Identical stub to the read page: the .NET tab is the four-line{" "}
        <code>AgentStateSnapshot</code> class alone. The tool, the state schema
        and the endpoint wiring appear only in the Python tab. This repo backs{" "}
        <code>sample_agent</code> with the Quickstart agent plus that class.
        Writes reach the run input, but nothing on the .NET side reads them,
        so they land nowhere.
      </Callout>

      <Panel
        title="The agent behind sample_agent"
        description="The Quickstart agent as published, plus the page's AgentStateSnapshot class. Only the factory and the endpoint are harness-authored."
      >
        <SourceCodeGroup
          files={[
            { file: "backend/SharedStateAgent.cs" },
            { file: "backend/Program.cs", region: "shared-state-wiring" },
          ]}
        />
      </Panel>

      <Panel
        title="Source"
        description="The doc's TSX, implemented as published, including the re-run path."
      >
        <SourceCode file="frontend/src/app/shared-state/in-app-agent-write/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
