"use client";

import {
  CopilotChat,
  CopilotChatConfigurationProvider,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { ApprovalPanel } from "./approval-panel";

/**
 * HARNESS GLUE — not from the page.
 *
 * The page publishes only ApprovalPanel; it does not show where it is mounted.
 * Two pieces are added here so it can be driven:
 *
 *  - A CopilotChat bound to `interrupt_agent` (the backend/InterruptAgent.cs
 *    endpoint) to ask the agent to delete a file.
 *  - A CopilotChatConfigurationProvider around ApprovalPanel. The doc's
 *    useInterrupt call names no agentId, so outside a chat it resolves the
 *    agent from chat configuration and then falls back to "default", which
 *    this runtime does not register. The provider points it at the same agent
 *    the chat uses without editing the doc component.
 *
 * One useInterrupt per page: the hook publishes into a single global slot.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/human-in-the-loop/interrupt-flow"
      subtitle="delete_file · ApprovalRequiredAIFunction · useInterrupt (renderInChat: false)"
    >
      <div className="grid h-full grid-cols-1 md:grid-cols-[1fr_20rem]">
        <div className="min-h-0">
          <CopilotChat
            agentId="interrupt_agent"
            labels={{
              welcomeMessageText:
                'Try "Delete the file notes.txt" — the approval appears in the panel on the right.',
            }}
          />
        </div>

        <aside className="border-t border-slate-200 p-4 text-sm md:border-l md:border-t-0 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            ApprovalPanel (doc component, rendered outside the chat)
          </p>
          <div className="mt-3">
            <CopilotChatConfigurationProvider agentId="interrupt_agent">
              <ApprovalPanel />
            </CopilotChatConfigurationProvider>
          </div>
        </aside>
      </div>
    </DemoFrame>
  );
}
