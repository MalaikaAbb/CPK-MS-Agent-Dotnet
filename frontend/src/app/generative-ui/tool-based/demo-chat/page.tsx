"use client";

import {
  CopilotChat,
  useComponent,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { BarChart, barChartPropsSchema } from "../bar-chart";

const AGENT_ID = "chart_agent";

/**
 * `useComponent` registers a React component as a tool.
 *
 * There is no handler and no backend definition — that is the whole point of
 * this variant, and the page is explicit about it: the agent is built with
 * `tools: []`. The AG-UI hosting layer merges the request's tool definitions
 * into the list the model sees, so `render_bar_chart` reaches the model by
 * name without the C# declaring anything, and when the model calls it
 * CopilotKit paints the component with the arguments as props.
 *
 * `chart_agent` rather than `my_agent` because the system prompt is what makes
 * the model actually reach for the tool — the page's own warning. That prompt
 * lives on this agent in `backend/Program.cs`.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/tool-based"
      subtitle={`render_bar_chart · ${AGENT_ID}`}
    >
      <Chat />
    </DemoFrame>
  );
}

function Chat() {
  useConfigureSuggestions({
    suggestions: [
      {
        title: "Chart some revenue",
        message:
          "Chart quarterly revenue for last year: Q1 120, Q2 145, Q3 138, Q4 190.",
      },
      {
        title: "Invent a dataset",
        message:
          "Make up monthly signups for a startup's first six months and chart them.",
      },
    ],
    available: "always",
  });

  // [1] tool-based: register the component as a tool
  // [!code highlight]
  useComponent({
    name: "render_bar_chart",
    description: "Display a bar chart with labeled numeric values.",
    parameters: barChartPropsSchema,
    render: BarChart,
  });

  return <CopilotChat agentId={AGENT_ID} className="h-full" />;
}
