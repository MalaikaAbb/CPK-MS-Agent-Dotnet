import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/json-render/_demo-source";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/json-render" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The chat&apos;s <code>assistantMessage</code> slot is replaced by a
          renderer that reads the agent&apos;s reply as a{" "}
          <code>{"{ root, elements }"}</code> spec and draws it with{" "}
          <code>@json-render/react</code> through a registry bound to a Zod
          catalog (MetricCard, BarChart, PieChart). Until the reply parses as
          a spec, the normal bubble is shown. The page&apos;s prose only
          repeats <code>page.tsx</code>; everything here is the demo&apos;s
          Code tab, copied unedited into <code>_demo-source/</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show me the sales dashboard with metrics and a revenue chart",
              "Break down revenue by category as a pie chart",
            ]}
            expect="The agent answers with the JSON envelope (checked with a raw AG-UI run on 2026-11-05) and the page renders it: three suggestion pills, then a metric card with a bar and/or pie chart in place of the raw JSON. This runs on the harness remedy of the agent; see the note below."
            fail="Raw JSON stays in a normal chat bubble (the renderer could not parse it), or a 404 / network error — the backend is an old build without /byoc-json-render; restart it."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Backend agent does not compile as published — running a one-line remedy">
        <p>
          <code>ByocJsonRenderAgent.cs</code> sets{" "}
          <code>Instructions = SystemPrompt</code> on{" "}
          <code>ChatClientAgentOptions</code>; in Microsoft.Agents.AI 1.27.0
          that type has no <code>Instructions</code> property (CS0117). The file
          is stored unbuilt under <code>backend/doc-samples/</code> instead of
          being edited. It also calls <code>ApiKeyResolver</code> and{" "}
          <code>AimockHeaderPolicy</code>, which no page publishes, and its
          header comment points at Python files (
          <code>byoc_json_render_agent.py</code>, <code>agent_server.py</code>)
          that do not exist in a .NET project.
          {" "}The endpoint <code>/byoc-json-render</code> runs 
          <code>backend/DocAgents/ByocJsonRenderAgent.Remedy.cs</code>, a labelled copy whose
          only change moves the system prompt to 
          <code>ChatOptions.Instructions</code>, where 1.27.0 expects it.
        </p>
      </Callout>

      <Panel title="Demo source (verbatim Code tab)">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/page.tsx` },
            { file: `${DIR}/chat.tsx` },
            { file: `${DIR}/json-render-renderer.tsx` },
            { file: `${DIR}/catalog.ts` },
            { file: `${DIR}/registry.tsx` },
            { file: `${DIR}/types.ts` },
            { file: `${DIR}/suggestions.ts` },
            { file: `${DIR}/metric-card.tsx` },
            { file: `${DIR}/charts/bar-chart.tsx` },
            { file: `${DIR}/charts/pie-chart.tsx` },
            { file: `${DIR}/charts/chart-config.ts` },
          ]}
        />
      </Panel>

      <Panel
        title="Runtime route (verbatim Code tab)"
        description="Its own single-route runtime, proxying agent byoc_json_render to ${AGENT_URL}/byoc-json-render (AGENT_URL defaults to http://localhost:8000; the rest of this app uses MS_AGENT_URL)."
      >
        <SourceCodeGroup
          files={[{ file: "frontend/src/app/api/copilotkit-declarative-json-render/route.ts" }]}
        />
      </Panel>

      <Panel title="Agent (verbatim Code tab, not built)">
        <SourceCodeGroup
          files={[
            { file: "backend/doc-samples/ByocJsonRenderAgent.cs.txt" },
            { file: "backend/DocAgents/ByocJsonRenderAgent.Remedy.cs" },
          ]}
        />
      </Panel>
    </>
  );
}
