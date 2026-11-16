"use client";
import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { standardUI } from "@copilotkit/react-core/v2/generative-ui";
import "@copilotkit/react-core/v2/styles.css";

// docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components — "Turn on
// generative UI", app/providers.tsx, verbatim except runtimeUrl (the page's is
// "/api/copilotkit"; this harness mounts the page's runtime at
// /api/copilotkit-components).

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit-components" generativeUI={{ ui: standardUI }}>
      {children}
    </CopilotKitProvider>
  );
}
