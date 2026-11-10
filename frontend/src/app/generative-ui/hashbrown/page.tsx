import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/hashbrown/_demo-source";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/hashbrown" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A <code>HashBrownDashboard</code> provider builds a Hashbrown UI kit
          once (metric, pieChart, barChart, dealCard, Markdown) and the
          chat&apos;s <code>assistantMessage</code> slot feeds the streaming
          reply through <code>useJsonParser(content, kit.schema)</code>, so
          finished parts of the <code>{"{ ui: [...] }"}</code> envelope render
          before the rest arrives. Everything here is the demo&apos;s Code tab,
          copied unedited into <code>_demo-source/</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show me a Q4 sales dashboard. Include a total-revenue metric card, a pie chart of revenue by segment, and a bar chart of monthly revenue.",
            ]}
            expect="The agent answers with the JSON envelope (checked with a raw AG-UI run on 2026-11-05) and the page renders it: metric cards and charts appearing progressively while the JSON streams. This runs on the harness remedy of the agent; see the note below."
            fail="Raw JSON stays in a normal chat bubble (the renderer could not parse it), or a 404 / network error — the backend is an old build without /byoc-hashbrown; restart it."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Backend agent does not compile as published — running a one-line remedy">
        <p>
          <code>ByocHashbrownAgent.cs</code> sets{" "}
          <code>Instructions = SystemPrompt</code> on{" "}
          <code>ChatClientAgentOptions</code>, which has no such property in
          Microsoft.Agents.AI 1.27.0 (CS0117). The file is stored unbuilt under{" "}
          <code>backend/doc-samples/</code>. It also depends on the unpublished{" "}
          <code>ApiKeyResolver</code> / <code>AimockHeaderPolicy</code>, and its
          comments (and the route&apos;s and renderer&apos;s) reference Python
          files and a <code>byoc-hashbrown</code> demo folder that are not part
          of a .NET project.
          {" "}The endpoint <code>/byoc-hashbrown</code> runs 
          <code>backend/DocAgents/ByocHashbrownAgent.Remedy.cs</code>, a labelled copy whose
          only change moves the system prompt to 
          <code>ChatOptions.Instructions</code>, where 1.27.0 expects it.
        </p>
      </Callout>

      <Panel title="Demo source (verbatim Code tab)">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/page.tsx` },
            { file: `${DIR}/chat.tsx` },
            { file: `${DIR}/hashbrown-renderer.tsx` },
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
        description="Its own single-route runtime, proxying agent declarative-hashbrown-demo to ${AGENT_URL}/byoc-hashbrown (AGENT_URL defaults to http://localhost:8000; the rest of this app uses MS_AGENT_URL)."
      >
        <SourceCodeGroup
          files={[{ file: "frontend/src/app/api/copilotkit-declarative-hashbrown/route.ts" }]}
        />
      </Panel>

      <Panel title="Agent (verbatim Code tab, not built)">
        <SourceCodeGroup
          files={[
            { file: "backend/doc-samples/ByocHashbrownAgent.cs.txt" },
            { file: "backend/DocAgents/ByocHashbrownAgent.Remedy.cs" },
          ]}
        />
      </Panel>
    </>
  );
}
