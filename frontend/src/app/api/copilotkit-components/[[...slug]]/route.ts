// docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components — "Add the
// runtime and an agent", app/api/copilotkit/[[...slug]]/route.ts.
//
// Kept verbatim: CopilotRuntime({ agents: { default: agent }, runner:
// new InMemoryAgentRunner() }) and createCopilotRuntimeHandler with GET/POST.
//
// Harness changes, labelled:
//   - Agent swap (each framework runs its own agent). The page builds a
//     TanStack BuiltInAgent (chat() + openaiText("gpt-6-luna")). Here `agent`
//     is the MAF .NET `components_agent` (backend/Program.cs, region
//     components-agent) with the snippet's model and system prompt, reached
//     over AG-UI like the repo's other runtime routes.
//   - basePath: "/api/copilotkit-components" instead of "/api/copilotkit",
//     which another route of this harness already owns.
import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";

const AGENT_URL = process.env.MS_AGENT_URL ?? "http://localhost:8000";

const agent = new HttpAgent({ url: `${AGENT_URL}/components_agent` });

const runtime = new CopilotRuntime({
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({ runtime, basePath: "/api/copilotkit-components" });

export const GET = handler;
export const POST = handler;
