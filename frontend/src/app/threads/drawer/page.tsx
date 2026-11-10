import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

// Verbatim from "Which agent's threads the drawer shows". Not mounted: this
// harness registers no `research_agent`, so the list would be empty.
const AGENT_ID_SNIPPET = `<CopilotThreadsDrawer agentId="research_agent" />`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/threads/drawer" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The drop-in conversation sidebar. The claim worth testing is the one
          about wiring: put <code>&lt;CopilotThreadsDrawer&gt;</code> and{" "}
          <code>&lt;CopilotChat&gt;</code> under one{" "}
          <code>&lt;CopilotChatConfigurationProvider&gt;</code> and neither
          selection state nor a thread-select handler is yours to write.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The demo has one tab per published sample. <strong>Zero props</strong>{" "}
          is the doc&apos;s basic integration. <strong>Customized</strong> adds{" "}
          <code>renderRow</code>, <code>limit</code>, and the two label
          overrides. <strong>Sidebar host</strong> puts the drawer beside a{" "}
          <code>CopilotSidebar</code>. <strong>Own New button</strong> calls{" "}
          <code>startNewThread()</code> from a header button.{" "}
          <strong>Controlled threadId</strong> keeps the thread id in React
          state and drives it from <code>onThreadSelect</code> /{" "}
          <code>onNewThread</code>. <strong>Hide built-in New</strong> applies
          the doc&apos;s <code>::part()</code> CSS. The sidebar sample renders{" "}
          <code>&lt;YourMainContent /&gt;</code>, which the page never defines;
          a labelled placeholder stands in for it.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Can you tell me a joke?"]}
            expect="A row appears in the drawer, auto-named after the first exchange. Start a second conversation, then click back to the first — its transcript replays. Own New button: clicking it shows the welcome screen and no row stays selected. Controlled threadId: the drawer row and the separate button both switch the chat. Hide built-in New: the drawer's 'New Conversation' row is gone. On desktop the drawer has no launcher button by design — the launcher is mobile-only."
            fail="The drawer shows a locked panel instead of a list, which means the runtime is not reporting a valid license — see /threads."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/threads/drawer/demo-chat/page.tsx" />
      </Panel>

      <Panel title="What the drawer does not do">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The per-row kebab menu covers archive, unarchive, and delete.{" "}
          <strong>Rename is absent</strong> — the doc says so plainly and points
          at <code>useThreads</code> for it, which is one concrete reason the{" "}
          <a
            href="/threads/headless"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            headless page
          </a>{" "}
          exists rather than being a stylistic alternative.
        </p>
      </Panel>

      <Panel title="Choosing the agent">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The drawer lists one agent&apos;s threads. It resolves the agent from
          its own <code>agentId</code> prop, then the nearest{" "}
          <code>CopilotChatConfigurationProvider</code>, then{" "}
          <code>agentId</code> on <code>CopilotKitProvider</code>, then{" "}
          <code>&quot;default&quot;</code>. The doc&apos;s explicit form is
          below. It is shown rather than mounted, because no{" "}
          <code>research_agent</code> exists in this harness.
        </p>
        <div className="mt-3">
          <CodeBlock filename="Explicit agent" language="tsx" code={AGENT_ID_SNIPPET} />
        </div>
      </Panel>

      <Callout tone="warn" title="The slots escape hatch does not work here">
        The doc&apos;s customization section shows projecting children with a{" "}
        <code>slot</code> attribute (<code>header</code>, <code>empty</code>,{" "}
        <code>footer</code>, <code>memories</code>,{" "}
        <code>launcher-icon</code>). The underlying{" "}
        <code>&lt;copilotkit-threads-drawer&gt;</code> web component does
        declare all five, but the React wrapper in{" "}
        <code>@copilotkit/react-core</code> 1.84.1 declares no{" "}
        <code>children</code> on <code>CopilotThreadsDrawerProps</code> and
        renders the element with only <code>renderRow</code> output as its
        children — so passing them is a type error, and would be silently
        dropped even if it were not. Reported rather than worked around.
      </Callout>

      <Callout tone="warn" title="Two providers deep">
        The drawer needs a chat configuration <em>and</em> the threads runtime,
        so this route nests <code>ThreadsProvider</code> inside the app-wide
        provider and <code>CopilotChatConfigurationProvider</code> inside that.
        The doc&apos;s sample shows a single top-level{" "}
        <code>CopilotKitProvider</code> because it assumes the whole app is the
        threads app; here only this section is.
      </Callout>
    </>
  );
}
