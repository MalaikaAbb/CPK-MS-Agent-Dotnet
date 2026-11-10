"use client";

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";
import { markdownTransport, someAgents, toolTransport } from "./configs";

/** The Transports page's runtime (`generativeUI: true`), not the shared one. */
const RUNTIME_URL = "/api/copilotkit-genui-transports";
const WELCOME = "Try: compare the Starter, Team, and Enterprise plans in a table.";

export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/transports" subtitle="tool · markdown · agentIds">
      <GenUIDemo
        variants={[
          {
            id: "tool",
            label: "Tool transport",
            note: "The agent calls render_ui; the table arrives as a separate tool-call message.",
            runtimeUrl: RUNTIME_URL,
            generativeUI: toolTransport,
            welcome: WELCOME,
          },
          {
            id: "markdown",
            label: "Markdown transport",
            note: "The provider sends the schema and fence guide as context entries; MAF .NET does not pass them to the model.",
            runtimeUrl: RUNTIME_URL,
            generativeUI: markdownTransport,
            welcome: WELCOME,
          },
          {
            id: "default",
            label: "agentIds: [\"shop\"]",
            note: "The page's runtime has only `default`, which is not in agentIds: this chat gets no catalog, no guide, no render_ui.",
            runtimeUrl: RUNTIME_URL,
            generativeUI: someAgents,
            welcome: WELCOME,
          },
        ]}
      />
    </DemoFrame>
  );
}
