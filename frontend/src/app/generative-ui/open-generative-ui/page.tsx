import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/open-generative-ui/_demo-source";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/open-generative-ui" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The runtime&apos;s <code>openGenerativeUI</code> flag injects a{" "}
          <code>generateSandboxedUi</code> frontend tool; when the agent calls
          it, the streamed HTML/CSS/JS is mounted live in a sandboxed iframe by
          the built-in activity renderer. The page has two demos, each with its
          own C# agent and its own demo route; both share the verbatim{" "}
          <code>/api/copilotkit-ogui</code> runtime.
        </p>
      </Panel>

      <Panel title="Minimal demo">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <Link
            href="/generative-ui/open-generative-ui/demo-chat"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Open the minimal demo →
          </Link>
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["build me a simple greeting card"]}
            expect="Placeholder lines appear, then a styled card builds up inside an iframe in the chat as CSS and HTML stream in, with a one-sentence reply from the agent. (Not yet observed in a browser.)"
            fail="Only a text reply and no iframe — the agent never called generateSandboxedUi, e.g. the frontend tool was not forwarded. A 404/connection error means /open-gen-ui is not mapped on the backend."
          />
        </div>
        <div className="mt-4">
          <Callout tone="warn" title="Two imports the page never publishes">
            <code>page.tsx</code> imports <code>./chat</code> and{" "}
            <code>./design-skill</code>; neither is a Code tab. Both are
            minimal, labelled harness stand-ins: a plain{" "}
            <code>&lt;CopilotChat agentId=&quot;open-gen-ui&quot;&gt;</code>{" "}
            and a one-sentence <code>VISUALIZATION_DESIGN_SKILL</code>, not the
            upstream skill.
          </Callout>
        </div>
        <div className="mt-4">
          <SourceCodeGroup
            files={[
              { file: `${DIR}/open-gen-ui/page.tsx` },
              { file: `${DIR}/open-gen-ui/chat.tsx` },
              { file: `${DIR}/open-gen-ui/design-skill.ts` },
              { file: "backend/DocAgents/OpenGenUiAgent.cs" },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Advanced demo — sandbox functions">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <Link
            href="/generative-ui/open-generative-ui/demo-chat/advanced"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Open the advanced demo →
          </Link>
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Calculator (calls evaluateExpression)", "Ping the host (calls notifyHost)"]}
            expect="A clickable keypad calculator in the iframe; pressing = shows the result, and the browser console logs '[open-gen-ui/advanced] evaluateExpression …'. The ping UI shows a receivedAt timestamp and logs 'notifyHost:'. (Not yet observed in a browser.)"
            fail="The UI renders but clicking does nothing and nothing is logged — the iframe is not reaching the host functions."
          />
        </div>
        <div className="mt-4">
          <SourceCodeGroup
            files={[
              { file: `${DIR}/open-gen-ui-advanced/page.tsx` },
              { file: `${DIR}/open-gen-ui-advanced/sandbox-functions.ts` },
              { file: `${DIR}/open-gen-ui-advanced/suggestions.ts` },
              { file: "backend/DocAgents/OpenGenUiAdvancedAgent.cs" },
            ]}
          />
        </div>
      </Panel>

      <Panel
        title="Shared runtime route (verbatim Code tab)"
        description="Proxies open-gen-ui and open-gen-ui-advanced to ${AGENT_URL}/open-gen-ui and /open-gen-ui-advanced (AGENT_URL defaults to http://localhost:8000)."
      >
        <SourceCodeGroup files={[{ file: "frontend/src/app/api/copilotkit-ogui/route.ts" }]} />
      </Panel>

      <Panel
        title="Unpublished C# helpers (harness stand-ins)"
        description="Both agents call ApiKeyResolver and AimockHeaderPolicy, which no page publishes. These minimal stand-ins read OPENAI_API_KEY like the Quickstart and use the default OpenAI endpoint."
      >
        <SourceCodeGroup files={[{ file: "backend/DocGapStubs.cs" }]} />
      </Panel>
    </>
  );
}
