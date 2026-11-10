"use client";

import { useEffect } from "react";
import { CopilotChat, useAgent } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * Reading the agent's live state in your own UI.
 *
 * This file is the doc page's published TSX, kept as-is — including
 * `agentId: "sample_agent"` and the `useEffect` that seeds `language` once the
 * agent reports ready.
 *
 * `sample_agent` is the Quickstart agent plus the page's four-line
 * `AgentStateSnapshot` class (backend/SharedStateAgent.cs). The page shows no
 * way to connect the class to the agent, so the agent never reads or updates
 * `language`; the value shown is what the useEffect seeds on the client.
 */

type AgentState = {
  language: "english" | "spanish";
};

export default function Page() {
  // [1] shared state: read agent state
  // [!code highlight]
  const { agent, isReady } = useAgent({
    agentId: "sample_agent",
  });
  const state = (agent.state ?? {}) as Partial<AgentState>;

  // [2] shared state: seed UI-owned state once the agent is ready
  // [!code highlight]
  useEffect(() => {
    if (!isReady || state.language !== undefined) return;
    agent.setState({ ...(agent.state ?? {}), language: "english" });
  }, [agent, isReady, state.language]);

  return (
    <DemoFrame
      parentPath="/shared-state/in-app-agent-read"
      subtitle="agent.state read from sample_agent (Quickstart agent + AgentStateSnapshot)"
    >
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <div className="min-h-0 overflow-y-auto border-b border-slate-200 p-4 lg:border-b-0 lg:border-r dark:border-slate-800">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Your main content
          </h1>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
            Language:{" "}
            <strong className="text-[var(--accent)]">
              {agent.state?.language ?? "—"}
            </strong>
          </p>

          <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Raw agent.state
          </h2>
          {/* [3] shared state: display state */}
          {/* [!code highlight] */}
          <pre className="mt-2 max-h-56 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">
            {JSON.stringify(agent.state ?? {}, null, 2)}
          </pre>
        </div>

        <div className="min-h-0">
          <CopilotChat
            agentId="sample_agent"
            labels={{
              welcomeMessageText:
                'The doc\'s prompt is "Switch to Spanish". The agent replies, but it does not change state.',
            }}
          />
        </div>
      </div>
    </DemoFrame>
  );
}
