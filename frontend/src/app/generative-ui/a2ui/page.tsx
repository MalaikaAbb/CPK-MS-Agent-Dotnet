import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// Reference-only: docs.copilotkit.ai/ms-agent-dotnet/generative-ui/a2ui
// (the A2UI overview). Both snippets are shown as text, verbatim. The runtime
// one is a fragment (myAgent is never defined, and `const runtime` is declared
// twice), and the operations container is Python. The page publishes no agent.

const RUNTIME_SNIPPET = `import { CopilotRuntime } from "@copilotkit/runtime";

// Simple — enable with defaults
const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  a2ui: true,
});

// Or customise — e.g. inject a render tool into the agent
const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  a2ui: {
    injectA2UITool: true,
  },
});`;

const OPERATIONS_SNIPPET = `{
    "a2ui_operations": [
        {"version": "v0.9", "createSurface": {"surfaceId": ..., "catalogId": ...}},
        {"version": "v0.9", "updateComponents": {"surfaceId": ..., "components": [...]}},
        {"version": "v0.9", "updateDataModel": {"surfaceId": ..., "path": "/", "value": {...}}},
    ]
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The entry page for A2UI: switching the runtime&apos;s A2UI middleware
          on (<code>a2ui: true</code>, or an options object such as{" "}
          <code>injectA2UITool</code>), the choice between the fixed-schema and
          dynamic-schema approaches, and the three v0.9 operations
          (<code>createSurface</code>, <code>updateComponents</code>,{" "}
          <code>updateDataModel</code>) every surface is built from. The working
          parts live on the two approach routes:{" "}
          <Link className="underline" href="/generative-ui/a2ui/fixed-schema">Fixed Schema</Link>{" "}
          and{" "}
          <Link className="underline" href="/generative-ui/a2ui/dynamic-schema">Dynamic Schema</Link>.
        </p>
      </Panel>

      <Panel title="Runtime setup, as published">
        <CodeBlock filename="app/api/copilotkit/route.ts" language="typescript" code={RUNTIME_SNIPPET} />
      </Panel>

      <Panel title="The operations container, as published">
        <CodeBlock filename="Published on the .NET page, in Python" language="python" code={OPERATIONS_SNIPPET} />
      </Panel>

      <Callout tone="warn" title="Reference only — why nothing runs here">
        <ul className="space-y-1.5">
          <li>
            · <strong>No agent.</strong> The page publishes no .NET (or any)
            agent; <code>myAgent</code> is never defined. Following the
            harness rule, no agent, runtime route or demo chat was added.
          </li>
          <li>
            · <strong>Fragment, not a file.</strong> The runtime snippet declares{" "}
            <code>const runtime</code> twice (the two variants side by side), so
            it cannot compile as one module; it is shown as text.
          </li>
          <li>
            · <strong>Python under the .NET slug.</strong> The operations example
            is a Python dict and says the <code>agent-framework-ag-ui</code>{" "}
            adapter builds the container for dynamic schema — that is the
            Python package; no C# equivalent is shown (same gap as README §9.3).
          </li>
        </ul>
      </Callout>
    </>
  );
}
