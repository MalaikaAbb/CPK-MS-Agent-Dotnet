"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { z } from "zod";

/**
 * The component the agent renders by calling it as a tool.
 *
 * The page names this — "The example above uses Recharts for the bar chart; it
 * doesn't know anything about CopilotKit" — and publishes neither the component
 * nor its `barChartPropsSchema`. Both are inferred from that sentence, from the
 * tool name `render_bar_chart`, and from the agent's own system prompt, which
 * the page *does* publish and which asks for "a concise title, description, and
 * data array of {label, value} items". Kept minimal.
 *
 * The point the page is making holds: nothing below imports CopilotKit. Props
 * are whatever the model sent for the Zod schema's parameter definition.
 *
 * Colours come from CopilotKit's tokens because this renders inside the chat.
 * Tailwind `dark:` variants would key off `prefers-color-scheme` while the chat
 * keys off a `.dark` class, and `var(--accent)` inside `[data-copilotkit]` is
 * CopilotKit's near-white hover surface, not the harness accent — the bars
 * would come out invisible. `--harness-accent` is the brand colour under a name
 * CopilotKit does not shadow. See the note at the bottom of `app/globals.css`.
 */

export const barChartPropsSchema = z.object({
  title: z.string().describe("Heading for the chart."),
  description: z.string().optional().describe("One-line caption under the heading."),
  data: z
    .array(
      z.object({
        label: z.string(),
        value: z.number(),
      }),
    )
    .describe("The bars, in display order."),
});

export type BarChartProps = z.infer<typeof barChartPropsSchema>;

export function BarChart({ title, description, data }: BarChartProps) {
  // The component can mount before the model has finished streaming its
  // arguments, so `data` is briefly undefined. Guarding here keeps the card
  // visible while it fills in rather than throwing mid-stream.
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-[var(--card-foreground)]">
      <p className="text-sm font-semibold">
        {title}
      </p>
      {description && (
        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{description}</p>
      )}
      {safeData.length === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--muted-foreground)]">No data yet…</p>
      ) : (
        <div className="mt-3">
          <ResponsiveContainer width="100%" height={220}>
            <RechartsBarChart data={safeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip cursor={{ opacity: 0.1 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--harness-accent)" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
