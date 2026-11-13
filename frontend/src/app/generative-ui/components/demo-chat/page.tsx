"use client";
import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { Providers } from "./providers";

// The page's app/page.tsx is `return <CopilotChat />`. Its app/layout.tsx wraps
// the whole app in <Providers>; this harness has its own root layout, so the
// Providers wrap the chat here instead (layout shown as text on the route).
export default function Page() {
  return (
    <DemoFrame parentPath="/generative-ui/components" subtitle="standardUI · Try it">
      <Providers>
        <CopilotChat />
      </Providers>
    </DemoFrame>
  );
}
