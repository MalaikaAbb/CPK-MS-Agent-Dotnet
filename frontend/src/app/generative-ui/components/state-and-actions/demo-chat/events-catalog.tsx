"use client";

// "Send a click to the agent": the page prints an `events:` fragment only.
// The PlanCard component and the catalog around it are harness-authored
// scaffolding; the `onChoose` declaration is verbatim. No function named
// `choose` exists, so a click becomes a user message to the agent.
//
// The catalog holds only PlanCard (no layout components), so one surface
// holds one PlanCard as its root: ask for a single plan card.
import { z } from "zod";
import {
  createGenerativeUI,
  type GenerativeUIComponentProps,
} from "@copilotkit/react-core/v2/generative-ui";

/** Harness-authored scaffolding: a component that fires the page's `onChoose` event. */
function PlanCard({ plan, onChoose }: GenerativeUIComponentProps<typeof plansUI, "PlanCard">) {
  return (
    <article className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700">
      <h4 className="font-medium">{plan}</h4>
      <button
        type="button"
        className="mt-2 rounded border px-2 py-1 text-xs"
        onClick={() => onChoose?.({ plan })}
      >
        Choose {plan}
      </button>
    </article>
  );
}

export const plansUI = createGenerativeUI({
  id: "harness/plans@1",
  components: {
    PlanCard: {
      component: PlanCard,
      description: "One pricing plan the user can choose.",
      props: z.object({ plan: z.string() }),
      events: {
        onChoose: {
          description: "The user picked a plan",
          parameters: z.object({ plan: z.string() }),
        },
      },
    },
  },
});
