"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { Page as DocPage } from "./doc-page";

/**
 * HARNESS GLUE — mounts the page's component next to a chat.
 *
 * The page's Program.cs is the Quickstart agent with no tools, so the chat
 * talks to the existing Quickstart agent (`my_agent`, mapped at "/"). The
 * frontend tool is forwarded to it in the AG-UI run input; no backend change.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/human-in-the-loop/tool-based"
      subtitle="humanApprovedCommand · useHumanInTheLoop"
    >
      {/* @ts-expect-error The doc's Page body elides its return with `// ...`, so it returns void, which TS rejects as a JSX component. Kept verbatim. */}
      <DocPage />
      <CopilotChat
        agentId="my_agent"
        labels={{
          welcomeMessageText:
            'Try "Ask me for approval before running the command ls -la".',
        }}
      />
    </DemoFrame>
  );
}
