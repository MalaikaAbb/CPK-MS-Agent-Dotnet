// "Positional parameter order", as published. The snippet uses
// `createGenerativeUI`, `z` and `Panel` without importing or defining them.
import { createGenerativeUI } from "@copilotkit/react-core/v2/generative-ui"; // Harness-authored import.
import { z } from "zod"; // Harness-authored import.
import { Panel } from "../../_shared/scaffolding"; // Harness-authored scaffolding.

const ui = createGenerativeUI({
  id: "acme/panel@1",
  components: {
    Panel: {
      component: Panel,
      props: z.object({ title: z.string(), color: z.string().optional() }),
      slots: { children: "multiple" },
      parameterOrder: ["title", "children"],
    },
  },
});

export { ui as panelUI }; // Harness-authored: the snippet's `ui` is module-local.
