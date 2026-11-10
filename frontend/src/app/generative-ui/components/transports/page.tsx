import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

import { DotnetContextGap, GenUIAgentSource } from "../_shared/notes";

const BASE = "frontend/src/app/generative-ui/components/transports/demo-chat";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/transports" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The same catalog can reach the browser two ways: the agent calls a{" "}
          <code>render_ui</code> tool the runtime adds (checked server-side as
          it streams), or it writes <code>a2ui</code> code blocks inside its
          reply (checked in the browser). <code>agentIds</code> limits which
          agents get any of it, and the runtime&apos;s{" "}
          <code>generativeUI</code> option controls when the tool is added.
        </p>
        <div className="mt-4 space-y-3">
          <TryIt
            prompts={["Compare the Starter, Team, and Enterprise plans in a table"]}
            expect="Page's promise — Tool: a Table component in its own message; Markdown: prose with the table embedded in the reply; agentIds [&quot;shop&quot;]: a plain answer, because this chat's agent is default. Expected on .NET (not yet browser-checked): Tool — the model sees render_ui (it is a client tool, and MAF merges client tools) but not the guide or catalog, so a text answer or rejected operations; Markdown — a plain markdown answer, since the schema and guide never reach the model; agentIds — a plain answer, as the page says."
            fail="The agentIds variant rendering a component — agentIds was ignored."
          />
        </div>
      </Panel>

      <DotnetContextGap />

      <Panel title="The runtime" description="The page's CopilotRuntime sample, verbatim; the agent and handler around it are harness-authored.">
        <SourceCode file="frontend/src/app/api/copilotkit-genui-transports/[[...slug]]/route.ts" />
      </Panel>

      <Panel title="The provider configs and demo">
        <SourceCodeGroup files={[{ file: `${BASE}/configs.ts` }, { file: `${BASE}/page.tsx` }]} />
      </Panel>

      <GenUIAgentSource />

      <Callout tone="warn" title="Harness-authored pieces and gaps">
        <ul className="space-y-1.5">
          <li>
            · The runtime sample references an <code>agent</code> it never
            builds; the harness-authored <code>genui_agent</code> .NET endpoint
            stands in, over <code>HttpAgent</code>.
          </li>
          <li>
            · The runtime sample registers only <code>default</code>, while
            &ldquo;Only some agents&rdquo; lists <code>shop</code>. No{" "}
            <code>shop</code> agent is added, so only the excluded side of{" "}
            <code>agentIds</code> can be exercised.
          </li>
          <li>
            · The page says the agent &ldquo;must use the tools and the context
            entries of the run&rdquo; and names how for the built-in agent and
            LangGraph Python only. MAF .NET uses the tools but not the context;
            see the note above.
          </li>
          <li>
            · The runtime sample sets no <code>runner</code>; it gets the
            runtime&apos;s default in-memory runner.
          </li>
        </ul>
      </Callout>
    </>
  );
}
