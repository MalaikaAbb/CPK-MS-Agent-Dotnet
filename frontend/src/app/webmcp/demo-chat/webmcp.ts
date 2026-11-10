import { CopilotKitCore } from "@copilotkit/core";
import { z } from "zod";
import { searchOrders } from "./search-orders"; // HARNESS-ADDED import: the page calls searchOrders but never defines it.

// [2] webmcp: core-only registration, no runtime or agent (doc's webmcp.ts)
// [!code highlight]
// Compiled but never imported by any route: loading it alongside OrderSearch
// would publish a second "searchOrders" to the same page.
export const copilotkit = new CopilotKitCore({
  tools: [
    {
      name: "searchOrders",
      description: "Search the signed-in user's orders by status",
      parameters: z.object({
        status: z.enum(["open", "shipped", "delivered"]),
      }),
      handler: async ({ status }) => {
        const orders = await searchOrders(status);
        return JSON.stringify(orders);
      },
      webmcp: {
        annotations: {
          readOnlyHint: true,
        },
      },
    },
  ],
});
