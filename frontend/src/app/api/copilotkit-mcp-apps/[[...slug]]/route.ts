// docs.copilotkit.ai/ms-agent-dotnet/generative-ui/mcp-apps
// "Configure your agent" — app/api/copilotkit/[[...slug]]/route.ts, verbatim
// except for ONE relocated literal, marked below.
//
// The page puts this at /api/copilotkit, which in this harness is already the
// runtime for the .NET agents. It is mounted here instead. The handler only
// routes requests whose path starts with `basePath` followed by "/" or the end
// of the path, so the doc's "/api/copilotkit" would 404 every request at this
// mount. The basePath is therefore the one value changed to match the mount.
//
// Not the .NET agent: the page's agent is a BuiltInAgent running in Node,
// which needs OPENAI_API_KEY in the frontend environment (frontend/.env.local).
// MCP server: any MCP Apps server on http://localhost:3108/mcp — see the
// README for the ext-apps examples.
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { BuiltInAgent } from "@copilotkit/runtime/v2";

// [1] mcp apps: BuiltInAgent + runtime mcpApps
// [!code highlight]
// 1. Create your agent
const agent = new BuiltInAgent({
  model: "openai/gpt-5.4",
  prompt: "You are a helpful assistant.",
});

// 2. Create a service adapter, empty if not relevant

// 3. Create the runtime with mcpApps configured
const runtime = new CopilotRuntime({
  agents: {
    default: agent,
  },
  mcpApps: {
    servers: [
      {
        type: "http",
        url: "http://localhost:3108/mcp",
        serverId: "my-server", // Recommended: stable identifier
      },
    ],
  },
  runner: new InMemoryAgentRunner(),
});

// 4. Create the API route
const handler = createCopilotRuntimeHandler({
  runtime,
  // HARNESS-RELOCATED: the doc writes basePath: "/api/copilotkit".
  basePath: "/api/copilotkit-mcp-apps",
});

export const GET = handler;
export const POST = handler;
