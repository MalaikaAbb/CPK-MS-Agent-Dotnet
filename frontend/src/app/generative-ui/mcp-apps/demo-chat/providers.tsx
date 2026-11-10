// docs.copilotkit.ai/ms-agent-dotnet/generative-ui/mcp-apps
// "Configure CopilotKit Provider" — app/providers.tsx, verbatim except for ONE
// relocated literal, marked below. Nested inside the app's root provider on
// this route only.
"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";

// [2] mcp apps: provider
// [!code highlight]
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // HARNESS-RELOCATED: the doc writes runtimeUrl="/api/copilotkit". That is
    // this harness's .NET runtime, which has no "default" agent and no
    // mcpApps; the doc's MCP Apps runtime is mounted at /api/copilotkit-mcp-apps.
    <CopilotKit runtimeUrl="/api/copilotkit-mcp-apps" useSingleEndpoint={false}>
      {children}
    </CopilotKit>
  );
}
