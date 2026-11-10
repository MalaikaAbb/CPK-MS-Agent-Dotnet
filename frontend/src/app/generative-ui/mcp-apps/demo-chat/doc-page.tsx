// docs.copilotkit.ai/ms-agent-dotnet/generative-ui/mcp-apps
// "Add the chat interface" — app/page.tsx, verbatim. Renamed because the
// route's own page.tsx wraps it in the doc's provider.
"use client";

import { CopilotSidebar } from "@copilotkit/react-core/v2";

// [3] mcp apps: chat interface
// [!code highlight]
export default function Page() {
    return (
        <main>
            <h1>Your App</h1>
            <CopilotSidebar />
        </main>
    );
}
