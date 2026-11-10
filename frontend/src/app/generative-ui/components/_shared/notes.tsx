import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

/**
 * Harness-authored notes shared by the eight Components and surfaces routes.
 * Server components — rendered on the explainer pages only.
 */

/**
 * The finding every route on this page group depends on. The runtime puts the
 * catalog, the render_ui guide, the target descriptions and the surface state
 * into the run's `context`; the markdown provider does the same. MAF .NET
 * never reads `RunAgentInput.Context`, and the pages publish no .NET code to
 * forward it, so nothing in this repo does.
 */
export function DotnetContextGap() {
  return (
    <Callout tone="warn" title="Microsoft Agent Framework (.NET) drops the run's context entries">
      <p>
        Everything these pages rely on reaches the agent as AG-UI{" "}
        <code>context</code> entries: on the tool transport the runtime adds the
        catalog, the <code>render_ui</code> guide, the page targets with their
        descriptions, existing surfaces and rejected operations as one context
        entry (the <code>render_ui</code> tool itself only says &ldquo;follow
        the generative UI guide in context&rdquo; and types{" "}
        <code>operations</code> as untyped objects). On the markdown transport
        the provider sends the schema and the fence guide as two context
        entries.
      </p>
      <p className="mt-2">
        The pages say the agent must put those entries into its prompt, and
        that &ldquo;any other agent&rdquo; has to do it itself; they show no
        .NET code for it. In this repo&apos;s packages
        (<code>Microsoft.Agents.AI.Hosting.AGUI.AspNetCore</code>{" "}
        1.27.0-preview.261030.1 over <code>AGUI.Server</code> 1.0.0), neither
        assembly reads <code>RunAgentInput.Context</code>: client tools are
        merged into <code>ChatOptions.Tools</code>, context is not passed on.
        No workaround is written here, by decision — so the model gets the{" "}
        <code>render_ui</code> tool with no catalog or guide, and the markdown
        transport gets nothing at all. Found by inspecting the assemblies; not
        yet confirmed in a browser.
      </p>
    </Callout>
  );
}

/** The harness-authored backend: one Quickstart-shaped agent with a product tool. */
export function GenUIAgentSource() {
  return (
    <Panel
      title="The agent (harness-authored)"
      description="No .NET page publishes an agent for these routes. This is the Quickstart's shape with one labelled search_products tool, mapped at /genui_agent."
    >
      <SourceCodeGroup
        files={[
          { file: "backend/GenerativeUIProductsAgent.cs", region: "search-products" },
          { file: "backend/GenerativeUIProductsAgent.cs", region: "genui-agent" },
          { file: "frontend/src/app/api/copilotkit-genui/[[...slug]]/route.ts" },
        ]}
      />
    </Panel>
  );
}
