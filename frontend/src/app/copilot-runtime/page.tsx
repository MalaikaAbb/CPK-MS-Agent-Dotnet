import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

// Verbatim from the page (synced 2026-11-05).
const DIRECT_SNIPPET = `import { HttpAgent } from "@ag-ui/client";

const myAgent = new HttpAgent({
  url: "https://my-agent.example.com",
});

<CopilotKit agents__unsafe_dev_only={{ "my-agent": myAgent }}>
  <YourApp />
</CopilotKit>;`;

// Verbatim from "Which name identifies an agent".
const KEY_ROUTE_SNIPPET = `const runtime = new CopilotRuntime({
  agents: {
    // \`my_agent\` is the key — the one string the frontend may ask for.
    my_agent: new HttpAgent({ url: "http://localhost:8000/" }),
  },
});`;

const KEY_PROVIDER_SNIPPET = `<CopilotKit runtimeUrl="/api/copilotkit" agent="my_agent" useSingleEndpoint={false}>
  <YourApp />
</CopilotKit>`;

const COMPARISON: [string, string, string][] = [
  ["Authentication", "Safe defaults provided", "You manage it"],
  ["AG-UI middleware", "Runs server-side", "Not available"],
  ["Agent routing", "Automatic", "Manual"],
  ["Ecosystem features", "Full support", "Limited"],
  ["Support", "Supported", "Not supported"],
  ["Setup", "Needs a backend endpoint", "Frontend only"],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/copilot-runtime" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The runtime is the server-side bridge between the app and the agents.
          It resolves agents by id, keeps credentials and middleware on the
          server, and re-encodes agent output as SSE for the browser.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Because Agent Framework speaks AG-UI natively, each binding is a plain{" "}
          <code>HttpAgent</code> pointed at an endpoint — there is no
          framework-specific adapter package involved.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Hello"]}
            expect="All three ids stream a reply. Switching ids starts a separate conversation, because each agent id carries its own message list."
            fail="One id errors with an agent-not-found style message — it is missing from the runtime's agents map, or its endpoint is not mounted."
          />
        </div>
      </Panel>

      <Panel
        title="This repo's runtime"
        description="Read from disk — diff it against the doc's single-agent sample."
      >
        <SourceCode file="frontend/src/app/api/copilotkit/[[...slug]]/route.ts" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          <code>InMemoryAgentRunner</code> is used with{" "}
          <code>createCopilotRuntimeHandler</code> in v2 because the agents call
          the model themselves over AG-UI.
        </p>
      </Panel>

      <Panel
        title="Which name identifies an agent"
        description="The frontend can only ask for a key of the runtime's agents map; the agent's own name (here the C# agent is named MyAgent) is never used for routing."
      >
        <div className="space-y-4">
          <CodeBlock filename="app/api/copilotkit/[[...slug]]/route.ts" language="ts" code={KEY_ROUTE_SNIPPET} />
          <CodeBlock filename="app/providers.tsx" language="tsx" code={KEY_PROVIDER_SNIPPET} />
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          To see the keys this harness registers, open{" "}
          {/* An API endpoint, not a page, so a plain anchor is intended. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/api/copilotkit/info" className="text-[var(--accent)] underline underline-offset-4">
            /api/copilotkit/info
          </a>
          . Asking for any other name raises{" "}
          <code>CopilotKitAgentDiscoveryError</code>, whose message lists the
          real keys.
        </p>
      </Panel>

      <Panel title="Runtime languages">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page now lists runtimes in TypeScript, Python, Go, Ruby and
          C#/.NET (ASP.NET Core, .NET 8). Only the TypeScript runtime works
          without CopilotKit Intelligence, which is why this harness puts a
          TypeScript runtime (the Next.js route above) in front of the .NET
          AG-UI agent. The page says the runtime and agent languages do not
          have to match. The C# runtime is not exercised here; it needs an
          Intelligence project.
        </p>
      </Panel>

      <Panel title="The demo page">
        <SourceCode file="frontend/src/app/copilot-runtime/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="Why not connect the browser straight to the agent?"
        description="AG-UI is an open protocol, so a direct connection is possible — with real losses."
      >
        <CodeBlock filename="Direct connection (dev only)" language="tsx" code={DIRECT_SNIPPET} />

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium" />
                <th className="pb-2 pr-4 font-medium">With runtime</th>
                <th className="pb-2 font-medium">Direct</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {COMPARISON.map(([label, withRt, direct]) => (
                <tr key={label}>
                  <td className="py-2 pr-4 font-medium text-slate-800 dark:text-slate-100">
                    {label}
                  </td>
                  <td className="py-2 pr-4 text-emerald-700 dark:text-emerald-400">
                    {withRt}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {direct}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Callout tone="warn" title="Not implemented here on purpose">
            The prop is literally named <code>agents__unsafe_dev_only</code>. A
            direct connection would expose the agent endpoint to the browser and
            disable the server-side middleware other features depend on — including
            the bearer-token check on the Authentication route.
          </Callout>
        </div>
      </Panel>
    </>
  );
}
