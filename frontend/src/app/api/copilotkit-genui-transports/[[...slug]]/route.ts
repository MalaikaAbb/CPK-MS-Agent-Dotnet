import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { HttpAgent } from "@ag-ui/client";

// The Transports page's `app/api/copilotkit/route.ts`. The page prints only
// the `CopilotRuntime` call; the region below is that call, verbatim.
//
// Harness-authored: `agent` (the page never defines it — here, the
// harness-authored Quickstart-shaped `genui_agent` .NET endpoint over AG-UI)
// and the handler, the same shape as `/api/copilotkit`. Mounted at its own
// path because `generativeUI: true` is specific to this page.
const AGENT_URL = process.env.MS_AGENT_URL ?? "http://localhost:8000";

const agent = new HttpAgent({ url: `${AGENT_URL}/genui_agent` });

//#region transports-runtime
const runtime = new CopilotRuntime({
  agents: { default: agent },
  generativeUI: true,
});
//#endregion

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-genui-transports",
});

export const GET = handler;
export const POST = handler;
