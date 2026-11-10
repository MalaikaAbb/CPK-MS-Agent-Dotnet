import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/webmcp/demo-chat";

export default function Page() {
  return (
    <>
      <RouteHeader path="/webmcp" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          One frontend tool, two callers. <code>searchOrders</code> is
          registered with <code>useFrontendTool</code> and opted into WebMCP,
          so CopilotKit mirrors it onto <code>document.modelContext</code>{" "}
          where a WebMCP-aware browser agent can discover and call it. The same
          handler stays available to the CopilotKit agent over AG-UI. A WebMCP
          call never touches the runtime or the .NET server.
        </p>
        <div className="mt-4 space-y-3">
          <TryIt
            prompts={["Which of my orders have shipped?"]}
            expect="CopilotKit agent path: the agent calls searchOrders with status shipped and answers with ORD-2 (USB-C cable) and ORD-4 (Headphones) — the stub's data."
            fail="The agent answers without calling the tool, or invents orders that are not in the stub."
          />
          <TryIt
            prompts={[
              "Chrome 149+, WebMCP flag on → open the demo → Model Context Tool Inspector → call searchOrders { status: \"open\" }",
            ]}
            expect="WebMCP path: the banner on the demo reads 'available', the inspector lists searchOrders with its enum schema and readOnlyHint, and calling it returns ORD-1."
            fail="The banner reads 'not available' — the browser does not expose document.modelContext and this path cannot be tested here. If it reads 'available' but the tool is missing, the registration did not happen."
          />
        </div>
      </Panel>

      <Panel
        title="Source"
        description="OrderSearch.tsx and webmcp.ts are the page's two files, verbatim apart from one labelled import each. The stub, the status banner and the demo page are harness-authored."
      >
        <SourceCodeGroup
          files={[
            { file: `${DIR}/OrderSearch.tsx` },
            { file: `${DIR}/webmcp.ts` },
            { file: `${DIR}/search-orders.ts` },
            { file: `${DIR}/model-context-status.tsx` },
            { file: `${DIR}/page.tsx` },
          ]}
        />
      </Panel>

      <Callout tone="warn" title="What the page leaves out">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code>searchOrders(status)</code> is called in both snippets and
            defined in neither. This repo supplies a stub that filters four
            fixed orders, imported with one added, commented line per file.
          </li>
          <li>
            <code>webmcp.ts</code> imports <code>@copilotkit/core</code>, which
            is not a direct dependency of this frontend. It resolves only
            because <code>@copilotkit/react-core</code> pulls it in.
          </li>
        </ul>
      </Callout>

      <Callout tone="info" title="Why webmcp.ts is compiled but not loaded">
        It is the no-agent path and constructs its own{" "}
        <code>CopilotKitCore</code> at module load. Loading it next to{" "}
        <code>OrderSearch</code> would publish a second{" "}
        <code>searchOrders</code> to the same page, so it is type-checked and
        shown, not mounted.
      </Callout>
    </>
  );
}
