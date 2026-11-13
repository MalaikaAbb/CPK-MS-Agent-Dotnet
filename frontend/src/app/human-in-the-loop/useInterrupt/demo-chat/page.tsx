"use client";

import {
  CopilotChat,
  CopilotChatConfigurationProvider,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { ApprovalInterrupt } from "./approval-interrupt";

/**
 * HARNESS MOUNT — not from the page.
 *
 * The rendered .NET page replaces its own frontend and backend samples with
 * "Not supported on MS Agent Framework (.NET)" and publishes no agent. Its
 * Approve/Cancel component is pure frontend, so it is mounted, unchanged, on
 * an agent this repo already has: `interrupt_agent` (backend/InterruptAgent.cs,
 * built for /human-in-the-loop/interrupt-flow), whose ApprovalRequiredAIFunction
 * ends the run with a standard AG-UI interrupt outcome.
 *
 * The configuration provider points the component's useInterrupt (which names
 * no agentId) at that same agent. One useInterrupt per page.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/human-in-the-loop/useInterrupt"
      subtitle="useInterrupt · Approve / Cancel · on interrupt_agent"
    >
      <CopilotChatConfigurationProvider agentId="interrupt_agent">
        <ApprovalInterrupt />
        <CopilotChat
          agentId="interrupt_agent"
          labels={{
            welcomeMessageText:
              'Try "Delete the file notes.txt" — the Approve / Cancel card should appear in the chat.',
          }}
        />
      </CopilotChatConfigurationProvider>
    </DemoFrame>
  );
}
