import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

// Verbatim from the Quickstart (bring-your-own tab), synced 2026-11-05.
const DOC_INSTALL = `npm install @copilotkit/react-ui @copilotkit/react-core @copilotkit/runtime @ag-ui/client@1.0.2`;

const DOC_INTELLIGENCE = `npx copilotkit@latest project select`;

const DOC_ENV = `CPK_INTELLIGENCE_API_KEY=cpk-...`;

const DOC_PROVIDERS = `"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="my_agent" useSingleEndpoint={false}>
      {children}
    </CopilotKit>
  );
}`;

const DOC_LAYOUT = `import { Providers } from "./providers";
import "@copilotkit/react-core/v2/styles.css";
import './globals.css';

export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/quickstart" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The bring-your-own-agent path. Three pieces: an ASP.NET Core server
          that exposes an Agent Framework agent over AG-UI, a runtime route that
          binds it, and a chat component. Everything else in this harness is a
          variation on these.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Worth noting how thin the binding is: <code>AddAGUIServer()</code> and{" "}
          <code>MapAGUIServer(&quot;/&quot;, agent)</code> on the C# side, and a
          plain <code>HttpAgent</code> on the runtime side. Agent Framework
          speaks AG-UI natively, so there is no framework-specific adapter
          package to install — unlike integrations that ship their own.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Can you tell me a joke?",
              "Can you help me understand AI?",
              "What do you think about .NET?",
            ]}
            expect="Tokens stream in a word at a time and the reply renders as markdown."
            fail="Nothing streams, or an error appears — the agent process is probably down. Check the connection panel on the home page."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/quickstart/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The two files that make it work"
        description="Read from this repo, so they can be diffed against the doc's samples directly."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit/[[...slug]]/route.ts" },
            { file: "backend/Program.cs" },
          ]}
          note={
            <>
              The runtime registers three agent ids rather than the doc&apos;s
              one, and the server maps three endpoints rather than one. That is
              the only structural departure: the Components-as-Tools page builds
              its agent with its own system prompt and an empty tool list, and
              the State Rendering page wraps its agent in a{" "}
              <code>DelegatingAIAgent</code>, so neither can share the
              Quickstart&apos;s endpoint.
            </>
          }
        />
      </Panel>

      <Panel
        title="Frontend setup as the doc now publishes it"
        description="The Quickstart moved the provider into its own client file and pins @ag-ui/client. Shown verbatim."
      >
        <div className="space-y-4">
          <CodeBlock filename="Install" language="bash" code={DOC_INSTALL} />
          <CodeBlock filename="Terminal" language="bash" code={DOC_INTELLIGENCE} />
          <CodeBlock filename=".env" language="bash" code={DOC_ENV} />
          <CodeBlock filename="app/providers.tsx" language="tsx" code={DOC_PROVIDERS} />
          <CodeBlock filename="app/layout.tsx" language="tsx" code={DOC_LAYOUT} />
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          This repo follows the same split: a client{" "}
          <code>components/providers.tsx</code> rendered from the server{" "}
          <code>app/layout.tsx</code>, and <code>@ag-ui/client</code> pinned
          to <code>1.0.2</code> (the exact version every{" "}
          <code>@copilotkit/*</code> 1.84.1 package depends on, so only one
          copy is installed). The root provider itself is harness glue: it is{" "}
          <code>CopilotKitProvider</code> with no default <code>agent</code>,
          because every route names its own agent, and it adds the Inspector,
          auth headers, and an error logger. The Intelligence key is only
          needed by the Rich Threads routes; the Quickstart demo here runs
          without it.
        </p>
      </Panel>

      <Callout tone="info" title="Where the API key comes from">
        The Quickstart reads the key with{" "}
        <code>builder.Configuration[&quot;OPENAI_API_KEY&quot;]</code>, which is
        what makes{" "}
        <code>dotnet user-secrets set OPENAI_API_KEY &quot;…&quot;</code> work.
        The same configuration chain also picks up an{" "}
        <code>OPENAI_API_KEY</code> environment variable, so either route
        works — neither puts the key in a committed file.
      </Callout>

      <Callout tone="warn" title="Model id in the docs">
        The Quickstart, Tool Rendering and State Rendering pages call{" "}
        <code>GetChatClient(&quot;gpt-6-luna&quot;)</code> and wrap it with{" "}
        <code>ReasoningEffortLevel = new(&quot;none&quot;)</code>, while the
        Components-as-Tools page uses <code>gpt-6-luna</code> with a bare{" "}
        <code>.AsIChatClient()</code>. That bare client fails every tool run,
        so the chart agent here is patched with the reasoning-effort chain
        (README §9.8).
      </Callout>
    </>
  );
}
