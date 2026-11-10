"use client";

import { DemoFrame } from "@/components/demo-frame";

import ByocJsonRenderDemo from "../_demo-source/page";

/**
 * Mounts the page's demo Code tab (../_demo-source, unedited). It brings its
 * own <CopilotKit> against the verbatim /api/copilotkit-declarative-json-render
 * route, so this conversation is separate from the app-wide one.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/json-render"
      subtitle="agent: byoc_json_render → backend /byoc-json-render"
    >
      {/* The demo's own layout is h-screen; let it scroll under the bar
          instead of clipping the chat input. */}
      <div className="h-full overflow-auto">
        <ByocJsonRenderDemo />
      </div>
    </DemoFrame>
  );
}
