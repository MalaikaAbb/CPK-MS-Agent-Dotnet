import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

import { DotnetContextGap } from "./_shared/notes";

// docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components — the section's
// "Try it" page. Runtime, provider and chat are the page's React code; the
// TanStack BuiltInAgent is swapped for a MAF .NET agent (labelled below).

const BASE = "frontend/src/app/generative-ui/components/demo-chat";

const LAYOUT_SNIPPET = `import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`;

const AGENT_SNIPPET = `const agent = new BuiltInAgent({
  type: "tanstack",
  factory: ({ input, abortController }) => {
    const { messages, systemPrompts, tools } = convertInputToTanStackAI(input);
    return chat({
      adapter: openaiText("gpt-6-luna"),
      messages,
      systemPrompts: [
        "You are a helpful assistant. When a visual answer helps, render it with generative UI.",
        ...systemPrompts,
      ],
      tools,
      abortController,
    });
  },
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The minimal setup for agent-rendered components: the provider gets the
          69-component <code>standardUI</code> catalog, the runtime sees a
          catalog on the run and adds a <code>render_ui</code> tool plus a
          guide, and the agent answers with A2UI 1.0 operations that render as
          real components in the chat. The rest of this nav group (surfaces,
          catalogs, state, theming, transports, markdown) builds on it.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Compare the Starter, Team, and Enterprise plans in a table"]}
            expect="Page's promise: a standard table fills in while the agent writes it, and 'add a column for support' changes it in place. Expected on .NET (not yet browser-checked): render_ui reaches the model, but the guide and catalog travel as AG-UI context, which the .NET server drops — so expect a text or markdown table, or render_ui calls rejected for invalid operations."
            fail="A RUN_ERROR or no reply at all — the components_agent endpoint is not reachable (is the backend on :8000?)."
          />
        </div>
      </Panel>

      <DotnetContextGap />

      <Panel title="Provider and chat, as published">
        <SourceCodeGroup files={[{ file: `${BASE}/providers.tsx` }, { file: `${BASE}/page.tsx` }]} />
        <div className="mt-4">
          <CodeBlock code={LAYOUT_SNIPPET} filename="app/layout.tsx (shown, not mounted)" language="tsx" />
        </div>
      </Panel>

      <Panel
        title="Runtime and agent"
        description="The runtime is the page's; the agent is this framework's own, standing in for the page's TanStack BuiltInAgent."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit-components/[[...slug]]/route.ts" },
            { file: "backend/Program.cs", region: "components-agent" },
          ]}
        />
        <div className="mt-4">
          <CodeBlock code={AGENT_SNIPPET} filename="The page's agent (not built here)" language="ts" />
        </div>
      </Panel>

      <Callout tone="warn" title="Swaps and gaps">
        <ul className="space-y-1.5">
          <li>
            · <strong>Agent swap.</strong> The page prints a TanStack{" "}
            <code>BuiltInAgent</code> factory. This harness runs its own
            framework, so <code>agent</code> is the MAF .NET{" "}
            <code>components_agent</code> (snippet&apos;s model{" "}
            <code>gpt-6-luna</code> and system prompt, no tools), reached by{" "}
            <code>HttpAgent</code>. The page gives no .NET agent for this
            section.
          </li>
          <li>
            · <strong>The guide never reaches the model.</strong> The page says
            to pass on both <code>tools</code> and <code>systemPrompts</code>.
            The .NET AG-UI server forwards client tools (so{" "}
            <code>render_ui</code> arrives) but drops the run&apos;s context,
            which carries the guide and catalog (README §9.11). No workaround
            is written, so the route is <code>broken</code>.
          </li>
          <li>
            · <strong>Mount points.</strong> The runtime is at{" "}
            <code>/api/copilotkit-components</code> (the page&apos;s{" "}
            <code>/api/copilotkit</code> is taken here) and the provider wraps
            the demo chat rather than the root layout.
          </li>
        </ul>
      </Callout>
    </>
  );
}
