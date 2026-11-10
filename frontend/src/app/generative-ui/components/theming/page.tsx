import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

import { DotnetContextGap, GenUIAgentSource } from "../_shared/notes";

const BASE = "frontend/src/app/generative-ui/components/theming/demo-chat";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/theming" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Standard components read their colors, radii, shadows and fonts from{" "}
          <code>--a2ui-*</code> CSS variables. The provider&apos;s{" "}
          <code>theme</code> sets them (typed, so a misspelt name fails{" "}
          <code>tsc</code>), a nested <code>dark</code> block overrides values in
          dark mode, and the same variables can be set in plain CSS on{" "}
          <code>.a2ui-surface</code>.
        </p>
        <div className="mt-4 space-y-3">
          <TryIt
            prompts={["Show a card with a primary button, a slider, and a bar chart of three months"]}
            expect="Page's promise: the button and slider use the amber #d97706 accent (Provider theme also Inter and 10px radii); on Colors per mode the panel turns #1f2937 in dark mode. Expected on .NET (not yet browser-checked): theming only shows once a surface renders, and the model gets render_ui without the catalog or guide, so a surface is unlikely to appear at all."
            fail="A surface that does render with the default accent on Provider theme — the theme never reached it."
          />
          <TryIt
            prompts={["(Map style) show the Eiffel Tower on a map"]}
            expect="The page's mapStyle URLs are placeholders on tiles.example.com, and maplibre-gl is not installed here, so at best a list of places. Same .NET caveat."
          />
        </div>
      </Panel>

      <DotnetContextGap />

      <Panel title="The page's code">
        <SourceCodeGroup
          files={[
            { file: `${BASE}/themes.tsx` },
            { file: `${BASE}/theme.ts` },
            { file: `${BASE}/dark-mode.tsx` },
            { file: `${BASE}/theming.css` },
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
            · Only the first sample is a whole <code>generativeUI</code> value;
            the rest are bare <code>theme:</code> fragments. Each is wrapped
            with <code>ui: standardUI</code> (harness-authored glue).
          </li>
          <li>
            · The <code>colorSchemeScript</code> belongs in{" "}
            <code>&lt;head&gt;</code>. The shared layout is not edited, so it
            renders in the demo body and only runs on a full page load. The dark
            toggle button is harness-authored.
          </li>
          <li>
            · <code>theming.css</code> is global once loaded, so its accent can
            leak to other routes until a reload.
          </li>
          <li>
            · The map style URLs (<code>tiles.example.com</code>) are
            placeholders and do not resolve.
          </li>
        </ul>
      </Callout>
    </>
  );
}
