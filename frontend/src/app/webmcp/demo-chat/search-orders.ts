/**
 * HARNESS-AUTHORED STUB — not from the docs.
 *
 * Both WebMCP snippets call `searchOrders(status)` and the page never defines
 * it. This returns a small fixed list so the tool has something to hand back,
 * whether the caller is the CopilotKit agent or a WebMCP browser agent.
 */
const ORDERS = [
  { id: "ORD-1", item: "Desk lamp", status: "open" },
  { id: "ORD-2", item: "USB-C cable", status: "shipped" },
  { id: "ORD-3", item: "Notebook", status: "delivered" },
  { id: "ORD-4", item: "Headphones", status: "shipped" },
] as const;

export async function searchOrders(status: "open" | "shipped" | "delivered") {
  return ORDERS.filter((order) => order.status === status);
}
