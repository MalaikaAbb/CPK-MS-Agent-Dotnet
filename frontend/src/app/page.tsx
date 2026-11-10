import Link from "next/link";

import { BackendHealth } from "@/components/backend-health";
import { RouteHeader } from "@/components/route-header";
import { Callout, KeyValue, Panel, TryIt } from "@/components/ui";
import { DOCS_ROOT, NAV } from "@/lib/nav-config";
import { DocSyncedAt } from "@/components/doc-synced-at";
import { DocDriftPanel } from "@/components/doc-drift-panel";

/** Dynamic: the doc-sync readouts below read the snapshot off disk. */
export const dynamic = "force-dynamic";

export default function Page() {
  const counts = NAV.flatMap((g) => g.routes).reduce<Record<string, number>>(
    (acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }),
    {},
  );

  return (
    <>
      <RouteHeader path="/" />


      <DocDriftPanel />

      <Panel title="What this is">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A working test harness for the CopilotKit + Microsoft Agent Framework
          (.NET) integration. Each route implements one doc page against a real
          agent, and shows the exact source that makes it work.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Everything here comes from the documentation. No tool, instruction, or
          state class was invented for this repo. Where a page&apos;s .NET tab
          publishes nothing usable, that route says so in a red banner and stops
          rather than filling the gap in with C# the docs never show — the{" "}
          <Link href="/status" className="underline">
            status overview
          </Link>{" "}
          lists every one of them.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              [
                "Docs tracked",
                <a
                  key="d"
                  href={DOCS_ROOT}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent)] underline underline-offset-4"
                >
                  {DOCS_ROOT}
                </a>,
              ],
              ["Docs synced", <DocSyncedAt key="docs-synced" withPages />],
              [
                "Routes",
                `${counts.working ?? 0} working · ${counts.partial ?? 0} partial · ${
                  counts.reference ?? 0
                } reference · ${counts.broken ?? 0} blocked by doc gaps`,
              ],
            ]}
          />
        </div>
      </Panel>

      <Panel
        title="Connection check"
        description="Both processes must be up before any chat route will respond."
      >
        <BackendHealth />
      </Panel>

      <Panel title="The three agents">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The backend maps three AG-UI endpoints rather than one. An endpoint
          serves exactly one agent, and the docs build three different ones: the
          Quickstart&apos;s plain assistant, the Components-as-Tools agent with
          its own system prompt and an empty tool list, and the State Rendering
          agent wrapped in a <code>DelegatingAIAgent</code>.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Runtime id</th>
                <th className="pb-2 pr-4 font-medium">Endpoint</th>
                <th className="pb-2 font-medium">Tool · used by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">my_agent</td>
                <td className="py-2 pr-4 font-mono text-xs">:8000/</td>
                <td className="py-2 text-slate-600 dark:text-slate-400">
                  <code>get_weather</code> · Quickstart, Tool Rendering, and
                  every route that needs a plain assistant
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">chart_agent</td>
                <td className="py-2 pr-4 font-mono text-xs">:8000/chart_agent</td>
                <td className="py-2 text-slate-600 dark:text-slate-400">
                  no server tools · Components as Tools
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">search_agent</td>
                <td className="py-2 pr-4 font-mono text-xs">:8000/search_agent</td>
                <td className="py-2 text-slate-600 dark:text-slate-400">
                  <code>StateStreamingAgent</code> · State Rendering
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="How a message travels">
        <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>1.</strong> A chat component posts to{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
              /api/copilotkit
            </code>{" "}
            in this Next app.
          </li>
          <li>
            <strong>2.</strong> The Copilot Runtime resolves the agent id and
            forwards the run to the matching AG-UI endpoint via an{" "}
            <code>HttpAgent</code>.
          </li>
          <li>
            <strong>3.</strong> The ASP.NET Core AG-UI server executes the
            agent, calling the model and any server-side tools.
          </li>
          <li>
            <strong>4.</strong> AG-UI events stream back as SSE. Browser-executed
            tools run here, and their results go back so the run can continue.
          </li>
        </ol>
        <div className="mt-4">
          <Callout tone="info">
            The model provider key lives only in the agent process. The browser
            never holds it, because it never talks to the agent directly.
          </Callout>
        </div>
      </Panel>

      <Panel title="Start here">
        <TryIt
          prompts={["Can you tell me a joke?"]}
          expect={
            <>
              On{" "}
              <Link href="/quickstart" className="underline">
                /quickstart
              </Link>
              , a streamed reply.
            </>
          }
          fail="An error banner, or no reply at all — check the connection panel above."
        />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Sidebar dot colours mirror status. The{" "}
          <Link
            href="/status"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            status overview
          </Link>{" "}
          lists every route in one table.
        </p>
      </Panel>
    </>
  );
}
