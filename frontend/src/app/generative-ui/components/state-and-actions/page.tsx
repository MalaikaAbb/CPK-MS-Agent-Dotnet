import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

import { DotnetContextGap, GenUIAgentSource } from "../_shared/notes";

const BASE = "frontend/src/app/generative-ui/components/state-and-actions/demo-chat";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/state-and-actions" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Generated components can be wired back into the app. A catalog can
          declare <strong>state</strong> that your code fills and the agent
          never sets; <strong>functions</strong> that a component&apos;s event
          calls in the browser; <strong>events</strong> that, when no function
          matches, turn a click into a message to the agent; and{" "}
          <strong>writable</strong> props whose user edits stick.
        </p>
        <div className="mt-4 space-y-3">
          <TryIt
            prompts={["(Who may call a function tab — no prompt)"]}
            expect="The exported functions show addToCart as rendererOrAgent/object, track as void, reload as agentOnly. Runs in the browser, no agent."
          />
          <TryIt
            prompts={["(App state) press + p1 twice, then: show a product card for p1 Trail Runner"]}
            expect="Page's promise: the card reads 'In cart: 2', and pressing + p1 again updates it with no new run. Expected on .NET (not yet browser-checked): the model gets render_ui without the catalog or guide, so the card is unlikely to render; if it does, the bind behaviour is pure frontend and should hold."
            fail="'In cart' wrong on a card that did render — the bind selector did not run, or the agent set inCart itself."
          />
          <TryIt
            prompts={["(Run code on click) show a product card for p3 Track Spike"]}
            expect="Page's promise: Add to cart puts p3 in the Cart panel with no chat message. Same .NET caveat."
          />
          <TryIt
            prompts={["(Send a click) show a plan card for the Team plan"]}
            expect="Page's promise: choosing the plan posts a visible user message and the agent answers. Same .NET caveat."
          />
          <TryIt
            prompts={["(Writable) show a checkout form with the email set to me@example.com"]}
            expect="Page's promise: the input keeps what you type even if the agent later changes the email. Same .NET caveat."
          />
        </div>
      </Panel>

      <DotnetContextGap />

      <Panel title="The page's code">
        <SourceCodeGroup
          files={[
            { file: `${BASE}/state-catalog.tsx` },
            { file: `${BASE}/functions-catalog.tsx` },
            { file: `${BASE}/declarations.ts` },
            { file: `${BASE}/events-catalog.tsx` },
            { file: `${BASE}/writable-catalog.tsx` },
          ]}
        />
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup files={[{ file: `${BASE}/page.tsx` }, { file: `${BASE}/sections.tsx` }]} />
      </Panel>

      <GenUIAgentSource />

      <Callout tone="warn" title="Harness-authored pieces and gaps">
        <ul className="space-y-1.5">
          <li>
            · Every snippet omits some imports (<code>z</code>,{" "}
            <code>createGenerativeUI</code>, <code>Cart</code>); added and
            marked in each file.
          </li>
          <li>
            · The state catalog uses a <code>ProductCard</code> the page never
            prints; a harness-authored card renders <code>inCart</code>.
          </li>
          <li>
            · <code>Cart</code> and <code>cart.addItem</code> are undefined; a
            harness-authored React-state cart stands in.
          </li>
          <li>
            · &ldquo;Who may call&rdquo;, &ldquo;Send a click&rdquo; and
            &ldquo;Keep what the user types&rdquo; are fragments; the catalogs
            around them (and <code>PlanCard</code>) are harness-authored.
          </li>
          <li>
            · The state and functions catalogs declare only{" "}
            <code>ProductCard</code>, and a surface has one root, so a request
            for two cards has nothing to hold them. The catalogs are used as
            published (no layout components added); the prompts ask for one
            card.
          </li>
          <li>
            · The page says the agent cannot call renderer functions in this
            version whatever <code>allowedCallers</code> says, so the
            declarations are shown as exported rather than exercised.
          </li>
        </ul>
      </Callout>
    </>
  );
}
