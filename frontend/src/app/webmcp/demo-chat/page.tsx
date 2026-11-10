"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { ModelContextStatus } from "./model-context-status";
import { OrderSearch } from "./OrderSearch";

/**
 * HARNESS GLUE — mounts the doc's OrderSearch inside the app's existing
 * provider (the page's stated precondition) and adds a chat on the Quickstart
 * agent, so the same handler can be reached from the CopilotKit agent path.
 * The WebMCP path is driven from Chrome's Model Context Tool Inspector, not
 * from this page.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/webmcp" subtitle="searchOrders · useFrontendTool + webmcp">
      <OrderSearch />
      <div className="flex h-full flex-col">
        <ModelContextStatus />
        <div className="min-h-0 flex-1">
          <CopilotChat
            agentId="my_agent"
            labels={{
              welcomeMessageText: 'Try "Which of my orders have shipped?"',
            }}
          />
        </div>
      </div>
    </DemoFrame>
  );
}
