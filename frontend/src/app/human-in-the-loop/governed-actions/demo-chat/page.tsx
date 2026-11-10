"use client";

import {
  CopilotChat,
  ToolCallStatus,
  useHumanInTheLoop,
} from "@copilotkit/react-core/v2";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";

import { GovernedActionCard } from "./governed-action-card";

/**
 * The page's tool-call approval path, implemented as published.
 *
 * Of the two entry points the doc gives, this is the one that runs on this
 * stack. `useHumanInTheLoop` registers `approve_governed_action` as a frontend
 * tool, and the AG-UI protocol forwards frontend tools to the agent
 * automatically — the same mechanism the Frontend Tools page relies on. So the
 * Quickstart agent can call it with no server-side change, which is why this
 * route works while the rest of the page's backend story is unwritten.
 *
 * The other entry point, `useInterrupt`, needs a runtime that can pause a run
 * mid-flight. The page does not show a Microsoft Agent Framework agent that
 * raises one, so it is not exercised here.
 */

// [1] governed actions: the action envelope
// [!code highlight]
//
// One deviation from the page, and the only one on this route. The page writes
// the last field as `z.record(z.unknown())`. Zod 4 requires an explicit key
// schema, so that single-argument form is a type error and would fail the
// build rather than fail at runtime -- there is no way to ship it and still
// have a compiling app. `z.record(z.string(), z.unknown())` is the same type
// with the key spelled out. Recorded in the README's discrepancy table.
const governedActionSchema = z.object({
  id: z.string(),
  summary: z.string(),
  tool: z.string(),
  reference: z.string(),
  verdict: z.enum(["allow", "deny", "require_approval"]),
  arguments: z.record(z.string(), z.unknown()),
});

export default function Page() {
  // [2] governed actions: register the approval checkpoint
  // [!code highlight]
  useHumanInTheLoop(
    {
      name: "approve_governed_action",
      description:
        "Ask the user to approve a governed side-effect action before it runs.",
      parameters: governedActionSchema,
      render: ({ args, status, respond }) => {
        if (status !== ToolCallStatus.Executing || !respond) {
          return null;
        }

        return (
          <GovernedActionCard
            action={args}
            onApprove={() =>
              respond({
                approved: true,
                actionId: args.id,
                reference: args.reference,
              })
            }
            onReject={() =>
              respond({
                approved: false,
                actionId: args.id,
                reference: args.reference,
              })
            }
            onBlock={() =>
              respond({
                approved: false,
                actionId: args.id,
                reference: args.reference,
              })
            }
          />
        );
      },
    },
    [],
  );

  return (
    <DemoFrame
      parentPath="/human-in-the-loop/governed-actions"
      subtitle="approve_governed_action · useHumanInTheLoop"
    >
      <div className="grid h-full grid-cols-1">

        <div className="">
          <CopilotChat
            agentId="my_agent"
            labels={{
              welcomeMessageText:
                "Ask me to call approve_governed_action and the card appears here.",
            }}
          />
        </div>
      </div>
    </DemoFrame>
  );
}
