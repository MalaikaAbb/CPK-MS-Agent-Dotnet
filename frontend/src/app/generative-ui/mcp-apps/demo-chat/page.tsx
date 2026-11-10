"use client";

import { DemoFrame } from "@/components/demo-frame";

import DocPage from "./doc-page";
import { Providers } from "./providers";

/**
 * HARNESS GLUE — the doc's layout.tsx renders its Providers around the page;
 * here the same pair is rendered inside the demo frame. The root provider's
 * Inspector should be disabled on this path so only one Inspector mounts.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/mcp-apps"
      subtitle="BuiltInAgent · runtime mcpApps · http://localhost:3108/mcp"
    >
      <Providers>
        <DocPage />
      </Providers>
    </DemoFrame>
  );
}
