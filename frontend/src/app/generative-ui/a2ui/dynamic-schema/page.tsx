import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const RUNTIME_SNIPPET = `const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  a2ui: {
    injectA2UITool: true,
  },
});`;

const PROVIDER_SNIPPET = `<CopilotKit a2ui={{ catalog: myCatalog }}>
  {/* ... */}
</CopilotKit>`;

const BACKEND_SNIPPET = `from agent_framework import Agent
from agent_framework_ag_ui import AgentFrameworkAgent

base_agent = Agent(
    client=chat_client,
    name="declarative_gen_ui_agent",
    instructions=(
        "Whenever a response would benefit from a rich visual — a dashboard, "
        "KPI summary, card layout, or chart — call \`generate_a2ui\` to draw it. "
        "Keep chat replies to one short sentence and let the UI do the talking."
    ),
)

# No A2UI tool here — the adapter auto-injects \`generate_a2ui\` when
# \`injectA2UITool\` is on. Binding one yourself would suppress auto-injection.
agent = AgentFrameworkAgent(agent=base_agent)`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/dynamic-schema" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The most flexible A2UI flavour. A secondary LLM generates the entire
          surface — schema, data and layout — from conversation context, so the
          agent can render any UI for any request without pre-defined schemas.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The primary model calls <code>generate_a2ui</code>; inside that tool a
          secondary model emits a <code>render_a2ui</code> call whose arguments
          stream as <code>TOOL_CALL_ARGS</code> events, and the A2UI middleware
          paints cards progressively as they arrive.
        </p>
      </Panel>

      <Panel title="Runtime — the one switch">
        <CodeBlock
          filename="The page's TypeScript, verbatim"
          language="typescript"
          code={RUNTIME_SNIPPET}
        />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Followed by the catalog registration on the provider:
        </p>
        <div className="mt-3">
          <CodeBlock filename="The page's TSX, verbatim" language="tsx" code={PROVIDER_SNIPPET} />
        </div>
      </Panel>

      <Panel title="Backend — what the page actually publishes">
        <CodeBlock
          filename="Published on the .NET doc page, in Python"
          language="python"
          code={BACKEND_SNIPPET}
        />
      </Panel>

      <Callout tone="warn" title="Why this route is not implemented">
        This page sits under <code>/ms-agent-dotnet/</code> and its backend is
        Python from top to bottom: <code>agent_framework</code>,{" "}
        <code>agent_framework_ag_ui</code>,{" "}
        <code>add_agent_framework_fastapi_endpoint</code>, and an{" "}
        <code>a2ui_config</code> dict on the endpoint. There is no{" "}
        <code>.NET</code> / <code>Python</code> tab pair as on the Quickstart,
        Tool Rendering, Shared State, State Rendering and Authentication pages —
        there is simply no C#.
        <p className="mt-2">
          The frontend side is incomplete too: <code>myCatalog</code> is passed
          to the provider but never defined, and the page defers the{" "}
          <code>definitions</code> / <code>renderers</code> /{" "}
          <code>createCatalog</code> split to a framework-agnostic page outside
          this doc tree.
        </p>
      </Callout>

      <Callout tone="info" title="What would need to change">
        A .NET equivalent of the adapter&apos;s auto-injection — whatever the
        C# hosting layer calls <code>a2ui_config</code> and{" "}
        <code>injectA2UITool</code> — plus a published catalog. The runtime
        half above is language-agnostic and would carry over unchanged.
      </Callout>
    </>
  );
}
