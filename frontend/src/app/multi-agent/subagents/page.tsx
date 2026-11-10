import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const SIGNATURE_SNIPPET = `public override Task<AgentRunResponse> RunAsync(
    IEnumerable<ChatMessage> messages,
    AgentThread? thread = null,
    AgentRunOptions? options = null,
    CancellationToken cancellationToken = default)

public override async IAsyncEnumerable<AgentRunResponseUpdate> RunStreamingAsync(
    IEnumerable<ChatMessage> messages,
    AgentThread? thread = null,
    AgentRunOptions? options = null,
    [EnumeratorCancellation] CancellationToken cancellationToken = default)`;

const ERRORS_SNIPPET = `error CS0246: The type or namespace name 'AgentRunResponse' could not be found
error CS0246: The type or namespace name 'AgentRunResponseUpdate' could not be found
error CS0246: The type or namespace name 'AgentThread' could not be found`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/multi-agent/subagents" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The canonical multi-agent shape: a supervisor LLM that exposes three
          specialists — research, writing, critique — as tools, delegates to
          them, and folds their results back into its own next step. Each
          delegation is appended to a <code>delegations</code> slot in shared
          agent state, which the frontend renders as a live log.
        </p>
      </Panel>

      <Panel
        title="Demo — chat only, no sub-agents"
        description="Open demo mounts the Code tab's page.tsx and delegation-log.tsx unedited. The four files they import but the tab never ships (subagent-activity-card, demo-layout, active-subagent, suggestions) are harness-authored stand-ins."
      >
        <TryIt
          prompts={[
            "Produce a short blog post about the benefits of cold exposure training. Research first, then write, then critique.",
          ]}
          expect={
            <>
              The layout and suggestion pills render, and the chat streams a
              plain answer. Backend <code>/subagents</code> is a harness
              stand-in (the Quickstart agent), because the page&apos;s C# never
              compiles. It has no research / writing / critique tools, so no
              activity cards appear and the delegation log stays empty. That
              gap is the finding.
            </>
          }
          fail={
            <>
              A 404 or a run error means the backend is an old build without the{" "}
              <code>/subagents</code> stand-in; restart it. Delegation cards
              would mean something other than the stand-in is answering there.
            </>
          }
        />
      </Panel>

      <Callout tone="warn" title="Why the backend cannot be built">
        <p>
          <strong>1. Two helpers are never published.</strong> The page&apos;s
          Code tab now carries the whole <code>SubagentsAgent.cs</code>.{" "}
          <code>DelegateAsync</code>, the full <code>SubagentsStore</code> and a
          complete <code>CreateAgent()</code> are all there. But{" "}
          <code>ApiKeyResolver</code> and <code>AimockHeaderPolicy</code> are
          still called and defined nowhere.
        </p>
        <p className="mt-2">
          <strong>2. It calls <code>AsLunaChatClient()</code>.</strong> Since
          the gpt-6-luna update, both ChatClients end in{" "}
          <code>.AsLunaChatClient()</code>, which no package defines and the
          page never publishes.
        </p>
        <p className="mt-2">
          <strong>3. It targets a superseded API.</strong> The signatures it
          overrides do not exist in the package this repo pins
          (1.27.0-preview.261030.1). On their own, stubs for the two helpers
          would not make it build.
        </p>
        <p className="mt-2">
          The Code tab&apos;s <code>Program.cs</code> also maps the agent with{" "}
          <code>app.MapAGUI(&quot;/subagents&quot;, …)</code>. No Hosting.AGUI
          release has <code>MapAGUI</code>, only <code>MapAGUIServer</code>.
        </p>
      </Callout>

      <Panel
        title="The API mismatch, concretely"
        description="Originally verified by compiling these signatures against 1.19.0-preview.260822.1; re-checked against the 1.27.0 assemblies, which still have none of these types."
      >
        <CodeBlock
          filename="What the page overrides"
          language="csharp"
          code={SIGNATURE_SNIPPET}
        />
        <div className="mt-3">
          <CodeBlock filename="What the compiler says" language="text" code={ERRORS_SNIPPET} />
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          The current names are <code>AgentResponse</code>,{" "}
          <code>AgentResponseUpdate</code> and <code>AgentSession</code>, and
          the methods to override are <code>RunCoreAsync</code> /{" "}
          <code>RunCoreStreamingAsync</code>. That is exactly what the{" "}
          <a
            href="/generative-ui/state-rendering"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            State Rendering
          </a>{" "}
          page&apos;s wrapper uses — and that one builds cleanly against the same
          pin, and runs in this repo. So the two pages disagree with each other,
          and only one of them is current.
        </p>
      </Panel>

      <Panel
        title="The page's C#, kept verbatim"
        description="Stored outside the build under backend/doc-samples/, with the reasons in its header."
      >
        <SourceCodeGroup files={[{ file: "backend/doc-samples/SubagentsAgent.cs.txt" }]} />
      </Panel>

      <Panel
        title="The Code tab's frontend, kept verbatim"
        description="Mounted by the demo from app/multi-agent/subagents/_demo-source/. page.tsx imports four files the tab does not ship: ./subagent-activity-card, ./demo-layout, ./active-subagent and ./suggestions; those are harness-authored there."
      >
        <SourceCodeGroup
          files={[
            { file: "backend/doc-samples/subagents-page.tsx.txt" },
            { file: "backend/doc-samples/subagents-delegation-log.tsx.txt" },
          ]}
          note={
            <>
              The page now advises giving every delegation a stable id and
              merging by id, because the client echoes state back on each run
              and an append-only reducer doubles the log. There is a type
              mismatch too: <code>Delegation.status</code> is typed{" "}
              <code>&quot;completed&quot;</code> only, but the C# also writes{" "}
              <code>&quot;running&quot;</code> and <code>&quot;failed&quot;</code>.
            </>
          }
        />
      </Panel>
    </>
  );
}
