import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const CODE_TAB = "backend/doc-samples/code-tab/human_in_the_loop";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/tool-based" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The approval lives in the browser. <code>useHumanInTheLoop</code>{" "}
          registers <code>humanApprovedCommand</code> as a frontend tool whose
          result is whatever the user clicks. AG-UI forwards it to the agent in
          the run input, so the Quickstart agent can call it with no server
          change; the run waits until <code>respond</code> is called.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Ask me for approval before running the command ls -la",
            ]}
            expect={
              <>
                A block appears in the chat showing <code>ls -la</code> with
                Approve / Deny buttons (unstyled — the doc&apos;s markup is
                plain). Clicking one sends <code>Command is APPROVED</code> or{" "}
                <code>Command is DENIED</code> back, and the agent replies
                accordingly.
              </>
            }
            fail="The agent answers in prose with no buttons (it did not call the tool — nothing in its instructions mentions it, so name approval explicitly), or the buttons render but the run never continues after a click."
          />
        </div>
      </Panel>

      <Panel
        title="Frontend"
        description="doc-page.tsx is the page's code, verbatim, `// ...` elisions included. page.tsx is the harness glue that mounts it."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/human-in-the-loop/tool-based/demo-chat/doc-page.tsx" },
            { file: "frontend/src/app/human-in-the-loop/tool-based/demo-chat/page.tsx" },
          ]}
        />
      </Panel>

      <Panel
        title="Backend"
        description="The page's Program.cs is the Quickstart agent under another name. The route uses the Quickstart agent already running at /."
      >
        <SourceCodeGroup
          files={[
            { file: "backend/doc-samples/HitlToolBasedProgram.cs.txt" },
            { file: "backend/Program.cs", region: "quickstart-agent" },
          ]}
        />
      </Panel>

      <Callout tone="warn" title="One type-level wrinkle, kept as published">
        The doc&apos;s <code>Page</code> elides its return with{" "}
        <code>{"// ..."}</code>, so it returns nothing. TypeScript rejects that as
        a JSX component; the mount point carries a{" "}
        <code>@ts-expect-error</code> rather than editing the doc file. At
        runtime React accepts an <code>undefined</code> return, so the hook
        still registers.
      </Callout>

      <Panel
        title="The page's Code tab — reference only, not run"
        description="The Demo/Code tabs on this page show a different app: the AG-UI dojo's Human-in-the-Loop task planner. It is shown here byte-exact for comparison."
      >
        <Callout tone="info">
          It differs from the page&apos;s own prose in every layer: it serves
          eight agents from a <code>ChatClientAgentFactory</code> configured
          elsewhere, the HITL agent has a description but no instructions, and
          the frontend wraps itself in the v1 <code>CopilotKit</code> provider
          with <code>useLangGraphInterrupt</code> and <code>next-themes</code>{" "}
          imports. None of it is compiled here.
        </Callout>
        <div className="mt-4">
          <SourceCodeGroup
            files={[
              { file: `${CODE_TAB}/README.mdx` },
              { file: `${CODE_TAB}/Program.cs.txt` },
              { file: `${CODE_TAB}/ChatClientAgentFactory.cs.txt` },
              { file: `${CODE_TAB}/page.tsx` },
            ]}
          />
        </div>
      </Panel>
    </>
  );
}
