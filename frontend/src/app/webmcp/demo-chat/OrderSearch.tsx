"use client";

import { useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";
import { searchOrders } from "./search-orders"; // HARNESS-ADDED import: the page calls searchOrders but never defines it.

// [1] webmcp: React frontend tool opted into WebMCP (doc's OrderSearch.tsx)
// [!code highlight]
export function OrderSearch() {
  useFrontendTool({
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
  });

  return null;
}
