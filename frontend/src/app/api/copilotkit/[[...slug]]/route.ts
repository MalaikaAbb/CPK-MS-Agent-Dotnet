import {
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { LoggedHttpAgent as HttpAgent } from "@/lib/logged-http-agent";

// The AG-UI server from `backend/Program.cs`. Microsoft Agent Framework speaks
// AG-UI directly, so the runtime binds a plain `HttpAgent` — there is no
// framework-specific adapter package to install.
const AGENT_URL = process.env.MS_AGENT_URL ?? "http://localhost:8000";

// Harness: `HttpAgent` here is LoggedHttpAgent (lib/logged-http-agent.ts), a
// plain HttpAgent that also prints failed runs to the `next dev` terminal.

// Three agents, one per AG-UI endpoint mapped by `MapAGUIServer`. `my_agent` is
// the Quickstart agent; `chart_agent` is the Components-as-Tools agent, which
// the doc builds with its own system prompt and an empty tool list;
// `search_agent` is the State Rendering agent, wrapped in that page's
// `StateStreamingAgent`.
// [1] quickstart: runtime config
// [!code highlight]
const runtime = new CopilotRuntime({
  agents: {
    my_agent: new HttpAgent({ url: `${AGENT_URL}/` }),
    chart_agent: new HttpAgent({ url: `${AGENT_URL}/chart_agent` }),
    search_agent: new HttpAgent({ url: `${AGENT_URL}/search_agent` }),
    // Interrupt-based HITL (harness-authored agent, see backend/InterruptAgent.cs).
    interrupt_agent: new HttpAgent({ url: `${AGENT_URL}/interrupt_agent` }),
    // Shared State read/write: Quickstart agent + AgentStateSnapshot (backend/SharedStateAgent.cs).
    sample_agent: new HttpAgent({ url: `${AGENT_URL}/sample_agent` }),
    // Sub-Agents: as the page's Code-tab route.ts registers it. Backend
    // /subagents is a Quickstart-shaped stand-in (SubagentsAgent.cs does not compile).
    subagents: new HttpAgent({ url: `${AGENT_URL}/subagents` }),
  },
  // The Quickstart's own note on running without the Intelligence Platform:
  // drop `intelligence` and `identifyUser` and the runtime falls back to SSE
  // with an in-memory runner. Chat works; Threads stay locked. The Rich Threads
  // routes use `/api/copilotkit-threads` instead, which is the wired-up one.
  runner: new InMemoryAgentRunner(),
});

// A Next.js catch-all route handler for the CopilotKit runtime requests.
// [2] copilot-runtime: request handler
// [!code highlight]
const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
