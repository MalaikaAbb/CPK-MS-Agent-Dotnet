import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/state-rendering" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Tool rendering shows you a tool <em>call</em>. State rendering shows
          you the agent&apos;s accumulated <em>state</em> — a list that grows
          across turns rather than a single event. Here that is a set of
          searches, each with a <code>query</code> and a <code>done</code> flag.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The .NET mechanism is different from the Python one, and this is the
          page where that shows. There is no <code>predict_state_config</code>{" "}
          here. Instead the agent is wrapped in a <code>DelegatingAIAgent</code>{" "}
          that re-asks the model for a structured{" "}
          <code>AgentStateSnapshot</code> using{" "}
          <code>ChatResponseFormat.ForJsonSchema</code>, then emits the parsed
          snapshot as a <code>DataContent</code> update. AG-UI forwards that to
          the browser, where it lands in <code>agent.state</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Search for the tallest mountains",
              "Now also search for the deepest oceans",
            ]}
            expect="On the current package pin: the chat replies with a summary and the list stays empty. That is the confirmed broken behaviour, not a test failure. On a package that still maps DataContent to state, the list would fill in once the snapshot arrives."
            fail="An error in the chat, or no reply at all — the search_agent endpoint is down."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Broken on the current package: DataContent no longer becomes state">
        The page&apos;s recipe emits the state snapshot as{" "}
        <code>DataContent(&quot;application/json&quot;)</code>. On this
        repo&apos;s pin (Hosting.AGUI.AspNetCore 1.27.0-preview, which pulls in
        AGUI.Server 1.0.0), the AG-UI server drops it. Checked on 2026-11-05
        with one run against <code>/search_agent</code>: the wrapper yielded{" "}
        <code>{"{\"searches\":[…2 items…]}"}</code>, and the event stream held
        only RUN_STARTED, TEXT_MESSAGE_* and RUN_FINISHED, with no
        STATE_SNAPSHOT. The docs&apos; own Code-tab demo for this page says the
        same thing in a comment: since MAF 1.23, state comes from tool results
        mapped with <code>AGUIStreamOptions.MapResultAsStateSnapshot</code>.
        The page&apos;s prose was not updated to match. Kept as published, not
        fixed.
      </Callout>

      <Callout tone="info" title="Why this route uses a different agent">
        An AG-UI endpoint serves exactly one agent, and this page&apos;s agent
        is the Quickstart&apos;s assistant wrapped in{" "}
        <code>StateStreamingAgent</code>. The doc maps it at <code>/</code>;
        this repo maps it at <code>/search_agent</code> so the plain Quickstart
        agent can keep <code>/</code>. Nothing else about it is changed.
      </Callout>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/generative-ui/state-rendering/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The state-streaming wrapper"
        description="The page's C# verbatim. It compiles on 1.27.0-preview.261030.1, but no state reaches the browser (see the warning above)."
      >
        <SourceCodeGroup
          files={[{ file: "backend/StateStreamingAgent.cs" }]}
          note={
            <>
              Two details worth watching while testing. The wrapper runs the
              model <em>twice</em> — once for the structured snapshot, once for
              the prose summary — so a turn costs two completions. And the{" "}
              <code>catch (JsonException)</code> around the deserialize is
              silent: if the model answers with prose instead of the requested
              schema, no snapshot is emitted and the UI simply does not update.
              That is the doc&apos;s own code, kept as published.
            </>
          }
        />
      </Panel>

      <Panel title="How it is wired">
        <SourceCodeGroup
          files={[{ file: "backend/Program.cs", region: "state-rendering" }]}
        />
      </Panel>
    </>
  );
}
