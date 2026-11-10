import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { HttpAgent } from "@ag-ui/client";

// The runtime every Components and surfaces demo points at (except
// Transports, which has its own).
//
// The `CopilotRuntime` line is the Adopt-from-A2UI page's "Runtime, after"
// sample, verbatim: no A2UI option, no `generativeUI` option. Left out, the
// runtime adds `render_ui` and its guide to every run whose provider carries a
// tool-transport catalog.
//
// Harness-authored: `agents` (the page leaves it undefined) — one `default`
// agent, the harness-authored Quickstart-shaped `genui_agent` .NET endpoint
// from `backend/GenerativeUIProductsAgent.cs` — and the handler, the same
// shape as `/api/copilotkit`. Kept apart from that runtime so a catalog never
// reaches the other routes' agents.
const AGENT_URL = process.env.MS_AGENT_URL ?? "http://localhost:8000";

const agents = {
  default: new HttpAgent({ url: `${AGENT_URL}/genui_agent` }),
};

//#region runtime-after
const runtime = new CopilotRuntime({ agents });
//#endregion

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-genui",
});

export const GET = handler;
export const POST = handler;
