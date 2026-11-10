import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const RUNTIME_SNIPPET = `const runtime = new CopilotRuntime({
  agents: { "a2ui-fixed-schema": fixedSchemaAgent },
  a2ui: {
    injectA2UITool: false,
  },
});`;

const TOOL_SNIPPET = `CATALOG_ID = "copilotkit://flight-fixed-catalog"
SURFACE_ID = "flight-fixed-schema"

FLIGHT_SCHEMA = json.load(
    open(Path(__file__).parent / "a2ui_schemas" / "flight_schema.json")
)


@tool(name="display_flight", description="Show a flight card for the given trip.")
def display_flight(
    origin: Annotated[str, Field(description="3-letter origin code, e.g. 'SFO'.")],
    destination: Annotated[str, Field(description="3-letter destination code.")],
    airline: Annotated[str, Field(description="Airline name.")],
    price: Annotated[str, Field(description="Price string, e.g. '$289'.")],
) -> str:
    """Show a flight card for the given trip."""
    ops = [
        {"version": "v0.9", "createSurface": {"surfaceId": SURFACE_ID, "catalogId": CATALOG_ID}},
        {"version": "v0.9", "updateComponents": {"surfaceId": SURFACE_ID, "components": FLIGHT_SCHEMA}},
        {"version": "v0.9", "updateDataModel": {"surfaceId": SURFACE_ID, "path": "/", "value": {"origin": origin, "destination": destination, "airline": airline, "price": price}}},
    ]
    return json.dumps({"a2ui_operations": ops})`;

const BUTTON_SNIPPET = `{
  "id": "book-button",
  "component": "Button",
  "child": "book-label",
  "variant": "primary",
  "action": {
    "event": {
      "name": "book_flight",
      "context": {
        "flightNumber": { "path": "flightNumber" },
        "price": { "path": "price" }
      }
    }
  }
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/fixed-schema" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The fastest A2UI flavour, and the opposite trade from dynamic schema.
          You design the surface once as JSON, and the agent tool supplies only
          the data — so there is no schema generation step and the surface
          appears the moment the tool returns.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The tool hand-builds an <code>a2ui_operations</code> container —{" "}
          <code>createSurface</code>, then <code>updateComponents</code> with
          the schema, then <code>updateDataModel</code> with the values — and
          the A2UI middleware intercepts it in the tool result.
        </p>
      </Panel>

      <Panel title="Runtime — no injection needed here">
        <CodeBlock
          filename="The page's TypeScript, verbatim"
          language="typescript"
          code={RUNTIME_SNIPPET}
        />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          <code>injectA2UITool: false</code>, because the middleware auto-detects
          A2UI operations in any tool result and the agent&apos;s own{" "}
          <code>display_flight</code> returns them directly.
        </p>
      </Panel>

      <Panel title="The tool — what the page actually publishes">
        <CodeBlock
          filename="Published on the .NET doc page, in Python"
          language="python"
          code={TOOL_SNIPPET}
        />
      </Panel>

      <Panel title="The button's action context">
        <CodeBlock
          filename="From flight_schema.json, as quoted on the page"
          language="json"
          code={BUTTON_SNIPPET}
        />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          This fragment is the only part of <code>flight_schema.json</code> the
          page shows. The rest of the file — every component the surface
          actually renders — is referenced but never published.
        </p>
      </Panel>

      <Callout tone="warn" title="Why this route is not implemented">
        Two things are missing, and both are load-bearing.
        <p className="mt-2">
          <strong>No C#.</strong> Like the dynamic-schema page, this one lives
          under <code>/ms-agent-dotnet/</code> but publishes its tool with{" "}
          <code>agent_framework</code>&apos;s <code>@tool</code> decorator and
          registers it through <code>AgentFrameworkAgent</code>. There is no
          .NET tab.
        </p>
        <p className="mt-2">
          <strong>No schema.</strong> The tool loads{" "}
          <code>flight_schema.json</code> at import time and passes it straight
          into <code>updateComponents</code>. Without that file there is nothing
          to render, and only the single button object above is published.
        </p>
      </Callout>

      <Callout tone="info" title="One thing the page is candid about">
        Its own note: the current Python SDK does not support the{" "}
        <code>action_handlers=</code> option, so the button&apos;s{" "}
        <code>book_flight</code> event has no server-side handler in the
        example. That limitation is documented rather than hidden, and is worth
        carrying forward to whatever the .NET version becomes.
      </Callout>
    </>
  );
}
