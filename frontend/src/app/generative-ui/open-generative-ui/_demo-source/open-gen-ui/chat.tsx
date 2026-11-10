"use client";

/**
 * HARNESS-AUTHORED STAND-IN — not from the docs.
 *
 * The minimal demo's page.tsx imports `Chat` from "./chat", but the .NET Open
 * Generative UI page does not publish that file. This is the smallest thing
 * that satisfies the import: a plain <CopilotChat> on the page's agent id
 * ("open-gen-ui"), which is what the page says the minimal setup needs.
 * No suggestions, no slots, no extra props.
 */
import { CopilotChat } from "@copilotkit/react-core/v2";

export function Chat() {
  return <CopilotChat agentId="open-gen-ui" className="flex-1 rounded-2xl" />;
}
