import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/in-app-agent-read" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>agent.state</code> from <code>useAgent</code> is reactive: read
          it anywhere under the provider and the component re-renders when the
          agent&apos;s state changes. No message parsing, no subscription to
          wire up.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The frontend half of this page is published in full, and the demo
          implements it exactly as written — including the{" "}
          <code>useEffect</code> that seeds <code>language</code> once{" "}
          <code>isReady</code> flips.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Switch to Spanish"]}
            expect="The chat replies (the Quickstart agent answers at sample_agent), and the panel shows the language the page's useEffect seeded on the client. Asking the agent to switch language changes nothing: the agent never sees or updates state. Checked 2026-11-06: a run carrying state {language: 'spanish'} got the reply 'NO STATE' and emitted no state events."
            fail="An error in the chat — the backend is an old build without /sample_agent; restart it."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="What is actually missing">
        The page&apos;s .NET tab contains exactly this, and nothing else:
        <pre className="mt-2 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">{`public class AgentStateSnapshot
{
    public string Language { get; set; } = "english";
}`}</pre>
        <p className="mt-2">
          The Python tab beside it carries the <code>update_language</code>{" "}
          tool, the state schema, the predict-state mapping and the endpoint
          registration — around sixty lines. None of that has a published .NET
          equivalent. This repo therefore backs <code>sample_agent</code> with
          the Quickstart agent and adds the class as published. The class is
          not referenced by anything, because the page never shows where it
          plugs in, so the agent never reads or writes <code>language</code>.
        </p>
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
        description="The doc's TSX, implemented as published."
      >
        <SourceCode file="frontend/src/app/shared-state/in-app-agent-read/demo-chat/page.tsx" />
      </Panel>

      <Callout tone="info" title="State from the agent on this stack">
        State Rendering publishes the only complete .NET state mechanism, a{" "}
        <code>DelegatingAIAgent</code> that emits state as{" "}
        <code>DataContent</code>. On this repo&apos;s 1.27 packages that no
        longer reaches the browser either (see that route). The docs&apos;
        Code-tab demos use <code>AGUIStreamOptions.MapResultAsStateSnapshot</code>{" "}
        instead, which no prose page teaches.
      </Callout>
    </>
  );
}
