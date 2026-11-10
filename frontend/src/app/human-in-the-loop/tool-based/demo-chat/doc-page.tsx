// docs.copilotkit.ai/ms-agent-dotnet/human-in-the-loop/tool-based
// "Create a frontend human-in-the-loop tool" — the page's page.tsx, verbatim,
// including its `// ...` elisions. Renamed from page.tsx because it exports a
// named component, not a route; demo-chat/page.tsx mounts it.

// [1] tool-based HITL: humanApprovedCommand
// [!code highlight]
import { useHumanInTheLoop } from "@copilotkit/react-core/v2"
import { z } from "zod"

export function Page() {
  // ...

  useHumanInTheLoop({
    name: "humanApprovedCommand",
    description: "Ask human for approval to run a command.",
    parameters: z.object({
      command: z.string().describe("The command to run"),
    }),
    render: ({ args, respond }) => {
      if (!respond) return <></>;
      return (
        <div>
          <pre>{args.command}</pre>
          <button onClick={() => respond(`Command is APPROVED`)}>Approve</button>
          <button onClick={() => respond(`Command is DENIED`)}>Deny</button>
        </div>
      );
    },
  });

  // ...
}
