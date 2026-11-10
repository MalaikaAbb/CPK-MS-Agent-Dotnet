import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

import { DotnetContextGap, GenUIAgentSource } from "../_shared/notes";

const TYPE_CHECK = `function ProductCard(props: GenerativeUIComponentProps<typeof shopUI, "ProductCard">) {
  props.price; // number
  props.color; // type error: not a prop of ProductCard
}`;

const EXPORT = `import { exportA2UICatalog } from "@copilotkit/react-core/v2/generative-ui";

const catalog = exportA2UICatalog(appUI, { title: "Acme app" });
fs.writeFileSync("acme-catalog.json", JSON.stringify(catalog, null, 2));`;

const SCHEMA_ZOD = `import { z } from "zod";

props: z.object({ name: z.string(), price: z.number() }),`;

const SCHEMA_VALIBOT = `import * as v from "valibot";
import { toStandardJsonSchema } from "@valibot/to-json-schema";

props: toStandardJsonSchema(v.object({ name: v.string(), price: v.number() })),`;

const BASE = "frontend/src/app/generative-ui/components/catalogs/demo-chat";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/catalogs" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A catalog is the list the agent may render from: a React component, a
          description, and a props schema per entry. The schema types your
          component and is what the model is meant to be shown, so the two
          cannot drift. The demo has one variant per catalog the page builds,
          plus the export to an A2UI 1.0 catalog definition, which runs
          entirely in the browser.
        </p>
        <div className="mt-4 space-y-3">
          <TryIt
            prompts={["(Export tab — no prompt)"]}
            expect="The Panel order line reads component, title, children, color, and the JSON lists every standard component plus CartBadge and Hero. No agent involved."
            fail="A different order means parameterOrder is not applied to the export."
          />
          <TryIt
            prompts={["Show me three running shoes as product cards"]}
            expect="Page's promise on shopUI: search_products, then a ProductGrid of three ProductCards copied from the tool result. Expected on .NET (not yet browser-checked): search_products runs (it is a server tool), but the model never sees the catalog, so expect a text answer or rejected render_ui operations."
            fail="Standard components such as Table rendering on shopUI — they are not in this catalog."
          />
          <TryIt
            prompts={["Show a hero titled 'Spring sale' and a cart badge with 3 items"]}
            expect="Page's promise on appUI: the Hero heading and the CartBadge. Same .NET caveat."
          />
        </div>
      </Panel>

      <DotnetContextGap />

      <Panel title="The catalogs, as published">
        <SourceCodeGroup
          files={[
            { file: `${BASE}/catalog.tsx` },
            { file: `${BASE}/combine.tsx` },
            { file: `${BASE}/panel-order.tsx` },
          ]}
        />
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup
          files={[{ file: `${BASE}/page.tsx` }, { file: `${BASE}/export-view.tsx` }]}
        />
      </Panel>

      <Panel
        title="Published but not run"
        description="A compile-time illustration, a Node-only write, and the two schema-library tabs."
      >
        <div className="space-y-4">
          <CodeBlock code={TYPE_CHECK} filename="Type your components — as published" language="tsx" />
          <CodeBlock code={EXPORT} filename="Export the catalog — as published" language="ts" />
          <CodeBlock code={SCHEMA_ZOD} filename="Pick a schema library · zod — as published" language="ts" />
          <CodeBlock code={SCHEMA_VALIBOT} filename="Pick a schema library · Valibot — as published" language="ts" />
        </div>
      </Panel>

      <GenUIAgentSource />

      <Panel title="Harness-authored scaffolding the page does not define">
        <SourceCode file="frontend/src/app/generative-ui/components/_shared/scaffolding.tsx" />
      </Panel>

      <Callout tone="warn" title="Harness-authored pieces and gaps">
        <ul className="space-y-1.5">
          <li>
            · <strong>Combine catalogs</strong> uses <code>cartUI</code>,{" "}
            <code>Hero</code> and <code>z</code> with no import or definition.
            Harness-authored: a one-component <code>cartUI</code> and a heading{" "}
            <code>Hero</code>; the <code>z</code> import is added and marked.
          </li>
          <li>
            · <strong>Positional parameter order</strong> uses{" "}
            <code>createGenerativeUI</code>, <code>z</code> and{" "}
            <code>Panel</code> unimported; its <code>ui</code> is not exported.
            Imports, a harness-authored <code>Panel</code> and an export line
            are added, each marked.
          </li>
          <li>
            · <strong>Pick a schema library</strong> prints two{" "}
            <code>props:</code> lines, not a catalog, and the Valibot tab needs{" "}
            <code>valibot</code> and <code>@valibot/to-json-schema</code>, which
            this repo does not install. Both are shown as published, not run.
          </li>
          <li>
            · <strong>Export</strong> ends in <code>fs.writeFileSync</code>,
            which needs Node; the demo makes the same call and prints the object
            in the browser.
          </li>
          <li>
            · <strong>ProductCard&apos;s description</strong> says to copy
            values &ldquo;from a product of a tool result&rdquo;, but no page
            publishes such a tool. The harness-authored{" "}
            <code>search_products</code> fills that in.
          </li>
        </ul>
      </Callout>
    </>
  );
}
