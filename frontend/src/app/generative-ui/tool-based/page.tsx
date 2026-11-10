import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { CodeBlock, Panel, TryIt } from "@/components/ui";

// Verbatim from "Rendering in a headless chat". A fragment: `assistantMessage`
// and `allMessages` are never defined on the page, so it is shown, not run.
const HEADLESS_SNIPPET = `import { CopilotChatToolCallsView } from "@copilotkit/react-core/v2";

<CopilotChatToolCallsView message={assistantMessage} messages={allMessages} />;`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/tool-based" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The simplest generative UI: register a component with{" "}
          <code>useComponent</code> and it becomes a tool. No handler, no
          server-side execution, no user interaction — the agent decides when to
          show it, fills in the data, and CopilotKit paints it. The Zod schema
          becomes the tool&apos;s parameter definition, which is what tells the
          model which arguments to send. It is optional, but without it the
          tool is advertised with an empty schema and the component renders
          with no props.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Contrast with{" "}
          <Link
            href="/generative-ui/tool-rendering"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Tool Rendering
          </Link>
          , which wraps a real backend tool in custom UI. Here the component{" "}
          <em>is</em> the tool.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Chart quarterly revenue for last year: Q1 120, Q2 145, Q3 138, Q4 190.",
              "Make up monthly signups for a startup's first six months and chart them.",
            ]}
            expect="A bar chart renders inline in the chat with the four quarters plotted, followed by a short sentence from the agent."
            fail="A markdown table or a description of a chart instead of the chart — the model answered in prose rather than calling the tool."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/generative-ui/tool-based/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The component"
        description="Ordinary React. It reads its props and imports nothing from CopilotKit — which is the page's point about this pattern."
      >
        <SourceCode file="frontend/src/app/generative-ui/tool-based/bar-chart.tsx" />
      </Panel>

      <Panel
        title="The agent"
        description="Both C# blocks on the page are published in full, and both are live here."
      >
        <SourceCodeGroup
          files={[{ file: "backend/Program.cs", region: "chart-agent" }]}
          note={
            <>
              Note the empty <code>tools: []</code>. That is the page&apos;s
              actual point: the AG-UI hosting layer merges the request&apos;s
              tool definitions into the list the model sees, so a component
              registered with <code>useComponent</code> reaches the model by
              name without the agent declaring anything.
            </>
          }
        />
      </Panel>

      <Panel title="Notes">
        <ul className="space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            The page publishes the four-line <code>useComponent</code> call and
            nothing else on the frontend. <code>BarChart</code> and{" "}
            <code>barChartPropsSchema</code> are named by that call and never
            defined; both are written here, minimally, from the page&apos;s
            description of them and from the <code>{"{label, value}"}</code>{" "}
            shape its published system prompt asks the model for.
          </li>
          <li>
            The system prompt is load-bearing, and the page says so directly: a
            tool arrives on every run, but a model with no instruction about it
            will answer in prose and never call it. That is why this demo drives{" "}
            <code>chart_agent</code> rather than the Quickstart agent — the
            prompt naming <code>render_bar_chart</code> lives on it.
          </li>
          <li>
            The page&apos;s advice on naming holds and is worth repeating:{" "}
            <code>name</code> is what the model sees, so a verb like{" "}
            <code>render_bar_chart</code> gets picked far more reliably than a
            noun.
          </li>
        </ul>
      </Panel>
      <Panel title="Rendering in a headless chat (reference)">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The built-in chat paints registered components itself. A custom chat
          has to render tool calls on each assistant message, which the page
          does with <code>CopilotChatToolCallsView</code>. The snippet is a
          fragment, so it is shown here. The{" "}
          <a href="/custom-look-and-feel/headless-ui" className="text-[var(--accent)] underline underline-offset-4">
            Headless UI
          </a>{" "}
          route covers the finer-grained <code>useRenderToolCall()</code> path.
        </p>
        <div className="mt-3">
          <CodeBlock filename="Headless chat" language="tsx" code={HEADLESS_SNIPPET} />
        </div>
      </Panel>
    </>
  );
}
