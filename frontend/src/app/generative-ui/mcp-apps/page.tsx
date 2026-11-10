import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/mcp-apps/demo-chat";

// The page's alternative: scope MCP Apps to one agent with .use(). Shown as
// text only — the snippet uses BuiltInAgent without importing it, and is an
// alternative to (not part of) the route that runs.
const USE_VARIANT = `import { MCPAppsMiddleware } from "@ag-ui/mcp-apps-middleware";

const agent = new BuiltInAgent({
  model: "openai/gpt-5.4",
  prompt: "You are a helpful assistant.",
}).use(
  new MCPAppsMiddleware({
    mcpServers: [
      {
        type: "http",
        url: "http://localhost:3108/mcp",
        serverId: "my-server",
      },
    ],
  }),
);`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/mcp-apps" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A tool on an MCP server can carry its own UI. When the agent calls
          it, the runtime&apos;s <code>mcpApps</code> option fetches that UI
          resource and the chat renders it in a sandboxed iframe, with no
          component written on the frontend. The page&apos;s example is
          framework-neutral: its agent is a Node <code>BuiltInAgent</code>, not
          the .NET server, so this route runs on its own runtime at{" "}
          <code>/api/copilotkit-mcp-apps</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "With an MCP Apps server on :3108 — ask the sidebar for whatever that server's tool does (e.g. \"Show me a budget allocator\" for the budget-allocator example)",
            ]}
            expect="The agent calls the MCP tool and an interactive iframe renders inside the sidebar's message list, served by the MCP server."
            fail="Nothing on :3108 → expect the run to fail or the tool to be missing (not yet observed which). No OPENAI_API_KEY in frontend/.env.local → the BuiltInAgent cannot call the model. Plain text with no iframe → the tool called has no UI resource, or the agent did not call it."
          />
        </div>
      </Panel>

      <Panel
        title="Source"
        description="Runtime route, provider and page are the doc's files. Two literals are relocated (basePath and runtimeUrl), each marked in the file; nothing else is changed."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit-mcp-apps/[[...slug]]/route.ts" },
            { file: `${DIR}/providers.tsx` },
            { file: `${DIR}/doc-page.tsx` },
            { file: `${DIR}/page.tsx` },
          ]}
        />
      </Panel>

      <Panel
        title="Alternative: MCPAppsMiddleware on one agent — reference only"
        description="Scopes MCP Apps to a single agent instead of the whole runtime. Not wired up here."
      >
        <CodeBlock
          filename="app/api/copilotkit/route.ts (the page's .use() variant, verbatim)"
          language="typescript"
          code={USE_VARIANT}
        />
      </Panel>

      <Callout tone="warn" title="Why two literals moved">
        The page mounts its runtime at <code>/api/copilotkit</code> and points
        the provider there. In this harness that path is the .NET agents&apos;
        runtime, which has no <code>default</code> agent and no{" "}
        <code>mcpApps</code>. The runtime handler only matches requests under
        its <code>basePath</code> followed by <code>/</code>, so the doc&apos;s
        basePath at any other mount answers 404. The route was moved to{" "}
        <code>/api/copilotkit-mcp-apps</code> and both literals changed to
        match it.
      </Callout>

      <Callout tone="warn" title="What the page leaves out">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Port <code>3108</code> and the <code>/mcp</code> path are not
            documented by the ext-apps repo the page points to. Its README
            starts all examples with <code>npm start</code> behind a host on{" "}
            <code>:8080</code>; how to expose one example as HTTP on{" "}
            <code>:3108/mcp</code> is not stated there.
          </li>
          <li>
            The prose says the example uses GPT-4o by default; the code uses{" "}
            <code>openai/gpt-5.4</code>.
          </li>
          <li>
            The page&apos;s <code>.use()</code> snippet calls{" "}
            <code>BuiltInAgent</code> without importing it.
          </li>
        </ul>
      </Callout>
    </>
  );
}
