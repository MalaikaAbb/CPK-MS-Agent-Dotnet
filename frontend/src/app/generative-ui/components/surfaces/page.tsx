import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

import { DotnetContextGap, GenUIAgentSource } from "../_shared/notes";

const BASE = "frontend/src/app/generative-ui/components/surfaces/demo-chat";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/surfaces" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Generated UI can land outside the chat. A{" "}
          <code>GenerativeUISurface</code> marks an area of the page as a target
          with an id and a description the agent should read on every run;
          asking in the chat then changes that area. A target can restrict
          which catalog components may go in it, opt out of auto-scroll, or
          exist once per item.
        </p>
        <div className="mt-4 space-y-3">
          <TryIt
            prompts={["(no prompt) open the demo"]}
            expect="The featured target shows the fallback row (Trail Runner, City Sneaker, Track Spike). This part needs no agent."
          />
          <TryIt
            prompts={[
              "Show me cheap running shoes in the featured row",
              "Show the featured products again",
            ]}
            expect="What the page promises: the first prompt replaces the fallback row with an agent-rendered ProductGrid; the second deletes that surface and the fallback returns. Expected on .NET (not yet browser-checked): the agent does not know the featured target's description or the catalog (see the context-entries note), so expect a text answer, a render_ui call whose operations are rejected, or a guess that happens to pass validation."
            fail="A crash, or the fallback row never rendering."
          />
          <TryIt
            prompts={["Recommend two related shoes under the Trail Runner"]}
            expect="Page's promise: a grid fills that product's recommendations target only, and stays when you switch product and back. Same .NET caveat as above."
          />
        </div>
      </Panel>

      <DotnetContextGap />

      <Panel title="The page's code">
        <SourceCodeGroup
          files={[
            { file: `${BASE}/featured-products.tsx` },
            { file: `${BASE}/targets.tsx` },
            { file: `${BASE}/surfaces.css` },
            { file: `${BASE}/catalog.ts` },
          ]}
        />
      </Panel>

      <Panel title="The demo" description="The provider config is the page's 'When a component fails' sample.">
        <SourceCodeGroup files={[{ file: `${BASE}/page.tsx` }]} />
      </Panel>

      <GenUIAgentSource />

      <Callout tone="warn" title="Harness-authored pieces and gaps">
        <ul className="space-y-1.5">
          <li>
            · <code>Product</code>, <code>ProductRow</code> and the products
            list are used by <code>FeaturedProducts</code> but never defined.
            Harness-authored in <code>_shared/scaffolding.tsx</code>.
          </li>
          <li>
            · <code>./catalog</code> is imported but not printed on this page;
            it is taken to be the Catalogs page&apos;s <code>shopUI</code>, the
            only catalog with ProductGrid and ProductCard.
          </li>
          <li>
            · The one-line targets (<code>sidebar-notes</code>, per-product
            recommendations) are shown without a page around them; the layout
            and the product picker are harness-authored.
          </li>
          <li>
            · No page gives the agent products. The harness-authored{" "}
            <code>genui_agent</code> carries a harness-authored{" "}
            <code>search_products</code> tool.
          </li>
          <li>
            · The page&apos;s error-boundary sample is a whole{" "}
            <code>&lt;CopilotKitProvider&gt;</code>; its{" "}
            <code>generativeUI</code> value is verbatim, the provider and its{" "}
            <code>runtimeUrl</code> (<code>/api/copilotkit-genui</code>) are the
            harness&apos;s.
          </li>
        </ul>
      </Callout>
    </>
  );
}
