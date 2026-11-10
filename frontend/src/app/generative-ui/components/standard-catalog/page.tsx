import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

import { DotnetContextGap, GenUIAgentSource } from "../_shared/notes";

const BASE = "frontend/src/app/generative-ui/components/standard-catalog/demo-chat";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/standard-catalog" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>standardUI</code> is a ready-made catalog of 69 components —
          layout, text, inputs, tables, charts, maps, media. You can use it as
          is, put your own components on top with <code>extends</code>, trim it
          with <code>omit</code> so the prompt is shorter, or swap the React
          component behind a standard name with <code>overrides</code>.
        </p>
        <div className="mt-4 space-y-3">
          <TryIt
            prompts={["Put a short summary of our three plans in a card"]}
            expect="Page's promise: a standard Card (MyCard's large rounded corners and padding on the override variant). Expected on .NET (not yet browser-checked): the model gets render_ui but not the catalog or guide, so expect a text answer or rejected operations; a valid surface would only come from the model guessing A2UI 1.0 correctly."
          />
          <TryIt
            prompts={["Show the Eiffel Tower and the Louvre on a map"]}
            expect="Page's promise on standardUI: a Map. maplibre-gl is not installed here, so per the page the Map would show a list of the places. On the omit variant Map is not in the catalog at all. Same .NET caveat."
          />
        </div>
      </Panel>

      <DotnetContextGap />

      <Panel title="The page's catalogs">
        <SourceCodeGroup
          files={[
            { file: `${BASE}/extend.ts` },
            { file: `${BASE}/omit.ts` },
            { file: `${BASE}/override.tsx` },
          ]}
        />
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup files={[{ file: `${BASE}/page.tsx` }]} />
      </Panel>

      <GenUIAgentSource />

      <Callout tone="warn" title="Harness-authored pieces and gaps">
        <ul className="space-y-1.5">
          <li>
            · This page has no ms-agent-dotnet URL; it lives at the
            framework-neutral <code>/generative-ui/components/standard-catalog</code>.
          </li>
          <li>
            · &ldquo;Add your own components&rdquo; uses <code>ProductCard</code>{" "}
            and <code>productSchema</code> without defining them — both are
            harness-authored in <code>_shared/scaffolding.tsx</code>.
          </li>
          <li>
            · &ldquo;Drop components&rdquo; omits its imports; added, marked in
            the file.
          </li>
          <li>
            · The same id <code>acme/app@1</code> is used by all three samples;
            each lives in its own file and only one is mounted at a time.
          </li>
          <li>
            · <code>maplibre-gl</code> (which the page says to install for{" "}
            <code>Map</code>) is not in <code>frontend/package.json</code>.
          </li>
        </ul>
      </Callout>
    </>
  );
}
