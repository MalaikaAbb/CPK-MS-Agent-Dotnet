"use client";

import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * One provider for the whole app, so chat state survives navigation between
 * test routes. Pages needing an isolated conversation ask for one with a
 * `threadId` rather than a second provider.
 *
 * Two notes on the props:
 *
 * `showDevConsole="auto"` mounts the Inspector on localhost. It is needed
 * because `CopilotKitProvider` defaults it to false — `<CopilotKit>` is the
 * component that takes `enableInspector` and defaults to on. Never mount
 * `<CopilotKitInspector />` by hand: it forwards `core ?? null`, so a bare
 * instance reports "CopilotKit core not attached".
 *
 * `headers` is how the Authentication page forwards a bearer token to the
 * AG-UI server. It is only sent when a token is configured, so the app runs
 * unauthenticated by default.
 */

const RUNTIME_URL = "/api/copilotkit";

const LICENSE_KEY = process.env.NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY;
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_BEARER_TOKEN;

/**
 * Demo routes that mount their own <CopilotKit> / <CopilotKitProvider>, as
 * their doc pages do. Each provider mounts an Inspector in dev, so the root
 * one is switched off there: one Inspector per page, and it is the nested
 * one, which sees the route's own agents and catalog. (In 1.84.1
 * `CopilotKitProvider` reads `enableInspector`, not `showDevConsole`.)
 */
const NESTED_PROVIDER_PREFIXES = [
  "/generative-ui/components/",
  "/generative-ui/json-render/demo-chat",
  "/generative-ui/hashbrown/demo-chat",
  "/generative-ui/open-generative-ui/demo-chat",
  "/generative-ui/mcp-apps/demo-chat",
  "/multi-agent/subagents/demo-chat",
];

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const nestedProvider = NESTED_PROVIDER_PREFIXES.some(
    (prefix) => pathname.startsWith(prefix) && pathname.includes("/demo-chat"),
  );

  return (
    // [1] quickstart / inspector / authentication: provider
    // [!code highlight]
    <CopilotKitProvider
      runtimeUrl={RUNTIME_URL}
      {...(LICENSE_KEY ? { publicLicenseKey: LICENSE_KEY } : {})}
      {...(AUTH_TOKEN
        ? { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
        : {})}
      showDevConsole="auto"
      {...(nestedProvider ? { enableInspector: false } : {})}
      onError={(event) => {
        console.error(`[CopilotKit ${event.code}]`, event.error);
      }}
    >
      {children}
    </CopilotKitProvider>
  );
}
