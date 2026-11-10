"use client";

import { DemoFrame } from "@/components/demo-frame";

import ByocHashbrownDemoPage from "../_demo-source/page";

/**
 * Mounts the page's demo Code tab (../_demo-source, unedited). It brings its
 * own <CopilotKit> against the verbatim /api/copilotkit-declarative-hashbrown
 * route, so this conversation is separate from the app-wide one.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/hashbrown"
      subtitle="agent: declarative-hashbrown-demo → backend /byoc-hashbrown"
    >
      {/* The demo's own layout is h-screen; let it scroll under the bar
          instead of clipping the chat input. */}
      <div className="h-full overflow-auto">
        <ByocHashbrownDemoPage />
      </div>
    </DemoFrame>
  );
}
