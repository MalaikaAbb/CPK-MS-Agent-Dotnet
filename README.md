# CopilotKit + Microsoft Agent Framework (.NET) Test Suite

A navigable, working test harness covering every documentation page under
[`docs.copilotkit.ai/ms-agent-dotnet`](https://docs.copilotkit.ai/ms-agent-dotnet) — one app route per doc page,
each implementing what that page publishes and reporting loudly where it publishes nothing usable.

| | |
| --- | --- |
| **Docs synced** | 2026-11-05: 35 pages checked against the rendered live pages and their Code tabs. `doc-snapshot/` still holds the 2026-09-14 markdown export. |
| **Backend** | .NET 10 / ASP.NET Core · `Microsoft.Agents.AI.Hosting.AGUI.AspNetCore` `1.27.0-preview.261030.1` (pulls in `AGUI.Server` `1.0.0`) · `Microsoft.Agents.AI.OpenAI` `1.27.0` |
| **Frontend** | Next.js `16.3.2` · React `19.2.8` · `@copilotkit/react-core` / `runtime` / `core` `1.84.1` · `@ag-ui/client` `1.0.2` · `@json-render/*` `0.18.0` · `@hashbrownai/*` `0.5.0-beta.4` · `recharts` `3.10.1` |
| **Verified 2026-11-05** | `dotnet build` ✅ · `tsc --noEmit` ✅ · every nav route has its page ✅ · `next build` and browser checks not re-run for the new routes |
| **Status** | 9 working · 15 partial · 12 broken · 1 reference (37 doc pages in §8) |

---

## 2. Overview

Microsoft Agent Framework speaks the AG-UI protocol natively, so connecting it to CopilotKit needs no
framework-specific adapter: an ASP.NET Core app calls `AddAGUIServer()` and `MapAGUIServer("/", agent)`, and the
CopilotKit runtime binds it with a plain `HttpAgent`. That thinness is the whole integration, and everything in
this repo is a variation on it.

This repo exists to test that integration page by page. Every route mirrors one doc URL, implements the code that
page publishes, and shows the exact source from this repo so it can be diffed against the doc directly. It is a QA
instrument, not a starter template — pass/fail state is visible at a glance on every page and collected in the
[status table](#8-testing-checklist--current-status).

**The rule that shapes this repo:** it implements only what the docs publish. Where a page's `.NET` tab is a stub,
a truncation, or Python, the route is still built, still shows the fragments that *do* exist, and then stops —
with a red banner naming exactly what is missing. Nothing here invents an agent, a tool or a state mechanism the
docs do not publish. Five routes are in that state, and section 9 explains each one.

The one deliberate exception is a *component*: where a page names a React component of yours, describes it, and
does not print it, writing a minimal one is implementing the page rather than inventing it. That applies to exactly
one route — Components as Tools — and §9.7 spells out what was inferred and from what.

Doc root this repo tracks: <https://docs.copilotkit.ai/ms-agent-dotnet>

---

## 3. Architecture

```
Browser
  │  CopilotKitProvider (runtimeUrl="/api/copilotkit")
  ▼
Next.js app  ── /api/copilotkit           → CopilotRuntime, in-memory runner
  (port 3000)   /api/copilotkit-threads   → CopilotRuntime + CopilotKitIntelligence
  │
  │  HttpAgent, AG-UI over SSE
  ▼
ASP.NET Core AG-UI server (port 8000)
  │   /             → MyAgent          (Quickstart assistant + get_weather)
  │   /chart_agent  → ChartAgent       (Components as Tools: own prompt, no server tools)
  │   /search_agent → StateStreamingAgent wrapping ResearchAssistant (State Rendering)
  ▼
OpenAI (gpt-6-luna, with the chat-client chain each doc page specifies)
```

**Backend language for this framework is C# / .NET.** That is the single biggest difference from the sibling
Python harness, and it is where most of the documentation gaps in section 9 live.

**Why two runtime endpoints.** `/api/copilotkit` is the plain Quickstart runtime. `/api/copilotkit-threads` adds
the `intelligence` option, and all three Rich Threads routes run on it. The Quickstart page itself documents the
fallback: drop `intelligence` and `identifyUser` and the runtime reverts to SSE with an in-memory runner — chat
still works, Threads stay locked.

**Why three agents.** An AG-UI endpoint serves exactly one agent, and the docs build three different ones. The
Components-as-Tools page gives its agent a distinct system prompt and an empty tool list; the State Rendering page
wraps its agent in a `DelegatingAIAgent`. Neither can share the Quickstart's endpoint.

---

## 4. Prerequisites

| Requirement | Version | Notes |
| --- | --- | --- |
| .NET SDK | 9.0 or later | Docs specify 9.0+. Verified here on 10.0.111. |
| Node.js | 20+ | Verified here on v24.16.0. |
| npm | bundled with Node | `pnpm`/`yarn`/`bun` work too; the lockfile here is npm's. |
| OpenAI API key | — | Required. The agents call OpenAI directly. |
| CopilotKit Intelligence key | — | **Optional.** Only the three Rich Threads routes need it. |

No framework-specific CLI is required. `npx copilotkit@latest create` scaffolds a fresh project, but this repo is
already scaffolded — you do not need to run it.

---

## 5. Setup

```bash
# 1. Clone
git clone <this-repo> ms-agent-dot-net
cd ms-agent-dot-net

# 2. Frontend dependencies
npm --prefix frontend ci

# 3. Backend dependencies
dotnet restore backend

# 4. Model provider key — preferred form, keeps it out of the repo entirely
cd backend
dotnet user-secrets init
dotnet user-secrets set OPENAI_API_KEY "sk-...your-key..."
cd ..
```

`dotnet user-secrets` is what the Quickstart uses. The server reads the key with
`builder.Configuration["OPENAI_API_KEY"]`, so a plain `OPENAI_API_KEY` environment variable works identically if
you prefer that.

### Environment variables

Copy from `.env.example`. Everything below marked *frontend* belongs in **`frontend/.env.local`** — Next.js does
not read the repo-root file.

| Variable | Where | Required | What it does |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | backend | **yes** | Model provider key. Prefer `dotnet user-secrets`. |
| `AGENT_PORT` | backend | no | Port the AG-UI server binds. Defaults to `8000`. Change this and `MS_AGENT_URL` together. |
| `MS_AGENT_URL` | frontend | no | Where the runtime reaches the agent. Defaults to `http://localhost:8000`. Use `127.0.0.1` if `localhost` resolves to IPv6 while the agent binds IPv4. |
| `CPK_INTELLIGENCE_API_KEY` | frontend | no | Unlocks the three Rich Threads routes. Server-side only. The Quickstart now has you get it with `npx copilotkit@latest project select` and put it in `.env`. This repo reads it from `frontend/.env.local`. |
| `OPENAI_API_KEY` | frontend | for `/generative-ui/mcp-apps` only | The MCP Apps page runs a Node `BuiltInAgent` (`openai/gpt-5.4`) in the Next.js runtime, not the .NET agent, so the key must also be in `frontend/.env.local`. |
| `AGENT_URL` | frontend | no | Read by the three Code-tab runtime routes copied verbatim (json-render, hashbrown, Open Generative UI). Defaults to `http://localhost:8000`. If you move the backend port, set it alongside `MS_AGENT_URL`. |
| `INTELLIGENCE_API_URL` | frontend | no | Managed REST endpoint. Override with `INTELLIGENCE_GATEWAY_WS_URL` or neither. |
| `INTELLIGENCE_GATEWAY_WS_URL` | frontend | no | Managed realtime endpoint (different host from REST). |
| `NEXT_PUBLIC_AUTH_BEARER_TOKEN` | frontend | no | Token the provider forwards. Nothing on the server validates it — see `/auth`. |
| `NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY` | frontend | no | Public license key. Not needed by any route here. |

**Default ports: frontend `3000`, backend `8000`.**

### Upgrading backend packages

`dotnet restore` never upgrades anything. `backend/AGUIServer.csproj` pins both NuGet packages to exact versions,
so restore only re-downloads what is already pinned. To move to newer releases, change the pins. Run these from the
repo root (`ms-agent-dot-net/`); inside `backend/`, drop the `backend` argument from each command.

```bash
# 1. See what's newer. The AGUI hosting package only ships previews, so include prereleases.
dotnet list backend package --outdated --include-prerelease

# 2. Bump both pins to the SAME release line (versions here are examples — use what step 1 reports)
dotnet add backend package Microsoft.Agents.AI.Hosting.AGUI.AspNetCore --version 1.27.0-preview.261030.1
dotnet add backend package Microsoft.Agents.AI.OpenAI --version 1.27.0

# 3. Clean, restore and build
dotnet clean backend
dotnet restore backend --force
dotnet build backend
```

- **Keep both packages on one release line** (both 1.27.x, for example). The hosting package depends on
  `Microsoft.Agents.AI`, and mixing release lines causes version conflicts at restore time or failures at run time.
- **Prefer exact `--version` values.** Without `--version`, `dotnet add` picks the newest stable release only, and
  the hosting package has none. `--prerelease` without a version works for the hosting package but can leave the two
  packages on different release lines.
- **Newly published version not showing up?** NuGet is serving a cached package list. Run
  `dotnet nuget locals http-cache --clear`, then repeat step 1.
- **Step 1's "Latest" column is blank for a package?** The terminal may have cut the table off. Check
  `https://www.nuget.org/packages/<package-id>` for the newest version.
- **After upgrading,** start the agent (§6) and run `curl http://localhost:8000/health`. Preview releases often
  rename APIs, so if the build breaks, check `MapAGUI` and `AsAIAgent` in `backend/Program.cs` and the `AIAgent`
  subclass in `backend/StateStreamingAgent.cs` first. Record any change from the documented code in §9, and update
  the package versions in this README's header.

---

## 6. Running the project

Two processes, two terminals. There is no single command that starts both.

```bash
# Terminal 1 — the agent
dotnet run --project backend

# Terminal 2 — the app
npm --prefix frontend run dev
```

Successful startup looks like:

```
# Terminal 1
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:8000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.

# Terminal 2
▲ Next.js 16.3.2 (Turbopack)
- Local:  http://localhost:3000
✓ Ready in 1.2s
```

Open **<http://localhost:3000>**. The landing page runs a live connection check against the agent; if that panel
is red, nothing else on the site will respond.

Quick sanity check without a browser:

```bash
curl http://localhost:8000/health
# {"status":"ok","agents":["/","/chart_agent","/search_agent","/interrupt_agent","/genui_agent","/open-gen-ui","/open-gen-ui-advanced"]}
```

### Running the MCP Apps route

`/generative-ui/mcp-apps` is the one route that does not use the .NET agent. Following the doc, its runtime
(`frontend/src/app/api/copilotkit-mcp-apps/`) runs a Node `BuiltInAgent` (`openai/gpt-5.4`) and connects to an
**MCP Apps server at `http://localhost:3108/mcp`**. It needs two extra things, plus a third terminal.

**1. Give the frontend a model key.** Add it to `frontend/.env.local`, then restart `npm --prefix frontend run dev`
(Next.js reads env files only at startup):

```bash
OPENAI_API_KEY=sk-...
```

**2. Start an MCP Apps server on port 3108.** The doc points at the example servers in
[modelcontextprotocol/ext-apps](https://github.com/modelcontextprotocol/ext-apps) but never says which one, or how
to get it onto `:3108/mcp`. Each example is published to npm as `@modelcontextprotocol/server-<name>`. Run without
`--stdio`, it serves Streamable HTTP at `/mcp` on the port in `PORT`. The simplest option needs only Node 20+:

```bash
# Terminal 3: the budget-allocator example, which exposes one UI tool: get-budget-data
PORT=3108 npx -y @modelcontextprotocol/server-budget-allocator
```

You should see `MCP server listening on http://localhost:3108/mcp`. Any other example works the same way; swap the
package name (for example `server-cohort-heatmap`, `server-map`, `server-system-monitor`). Leave the URL alone: the
route's `url` and `serverId: "my-server"` are copied verbatim from the doc.

Alternative, from source (needs [Bun](https://bun.sh), because the examples build with it):

```bash
git clone https://github.com/modelcontextprotocol/ext-apps.git && cd ext-apps
npm install
PORT=3108 npm run --workspace examples/budget-allocator-server start
```

Don't use the repo's `npm start` for this. It starts every example plus its own host, numbering ports from 3101 in
alphabetical order, so whatever lands on 3108 (currently `cohort-heatmap-server`) changes whenever an example is
added.

**3. Check the server answers** (optional):

```bash
curl -s -X POST http://localhost:3108/mcp \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
# the response lists "get-budget-data" for the budget-allocator example
```

**4. Try it.** Open `http://localhost:3000/generative-ui/mcp-apps/demo-chat`, open the sidebar, and ask
`Show me the budget allocator` (or name the tool: `Call get-budget-data`). An interactive budget chart should render
in an iframe inside the chat.

These commands come from the ext-apps source (`examples/*/main.ts`, `examples/run-all.ts`, each package's `bin`) as
of commit `19256f5` (2026-11-04). They have not been run in this repo, because running downloaded packages was not
permitted in the session that wrote them. If one fails, check the example's own README.

### If port 8000 is taken

```bash
AGENT_PORT=8010 dotnet run --project backend
# and in frontend/.env.local:
MS_AGENT_URL=http://localhost:8010
```

The Quickstart hardcodes `app.Run("http://localhost:8000")`. This repo reads the port from configuration instead —
that is harness infrastructure, marked as such in `backend/Program.cs`, not a change to the documented code.

---

## 7. What to expect — walkthrough per section

Every route has a header showing its status badge, a link to the live doc page it tests, and — where relevant — a
red **Documentation gap** banner. Routes with an interactive surface put it on a separate chrome-free
`…/demo-chat` sub-route, so a demo can be watched or recorded without the harness around it.

### Getting Started

**`/` — Introduction.** Orientation plus the live connection check and a doc-drift readout. Not a feature test.

**`/quickstart` — Quickstart.** The bring-your-own-agent path end to end.
*Try:* open the demo and ask `Can you tell me a joke?`
*Success:* tokens stream in a word at a time and render as markdown.
*Failure:* nothing streams, or an error banner appears — the agent process is down, or `MS_AGENT_URL` points
somewhere wrong.
*Doc changes since September:* the provider now lives in its own client `app/providers.tsx`
(`<CopilotKit agent="my_agent" useSingleEndpoint={false}>`), `@ag-ui/client` is pinned to `1.0.2`, and the
Intelligence key comes from `npx copilotkit@latest project select`. The route page shows them verbatim. This repo
already used the providers/layout split; its root provider stays harness glue (no default agent, plus Inspector,
auth headers and an error logger).

### Basics

**`/prebuilt-components` — Prebuilt Components.** The page now publishes code. It has one tab per sample:
`CopilotChat`, `CopilotSidebar` (`defaultOpen={true}`), `CopilotPopup`, and a **Customization** tab with the
page's slot classes on `input` and `messageView`.
*Try:* send a message in each tab.
*Success:* all stream. On Customization, the input text is blue, the send button is blue-600, and the
assistant/user bubbles are tinted blue.
*Failure:* one renders unstyled or not at all, which usually means `@copilotkit/react-core/v2/styles.css` did not load.

### Custom Look and Feel

**`/custom-look-and-feel/slots` — Slots.** One tab per published sample: class strings, prop overrides, a custom
component, **reshaping** the list (`transformMessages`), **grouping** rows (`groupMessages` + `messageGroup`), and
labels. Levels 1–2 were brought back in line with the page's current values.
*Try:* `Hello there` on tabs 1–3; `What's the weather in Paris?` on tabs 4–5.
*Success:* level 1 gives a grey message area and a blue-bordered input; level 2 focuses the input on mount; level 3
replaces the list. On tab 4, no tool-result message gets its own row. On tab 5, the tool steps fold into one
`N tool steps ▸` row that expands on click.
*Failure:* tabs look identical, or tab 5 shows each tool step on its own row.
*Caveat:* the level-2 and level-3 samples do not type-check (§9.5). The nested-slot and children-render samples use
nine components the page never defines, so they have no tab.

**`/custom-look-and-feel/headless-ui` — Headless UI.** A chat built entirely from the headless hooks, with zero
CopilotKit chrome.
*Try:* send a message and watch the send button while it runs.
*Success:* messages render in your own markup and the button disables mid-run.
*Failure:* the input clears but nothing appears — the message list is not subscribed.

**`/programmatic-control` — Programmatic Control.** Driving the agent with no chat UI at all: read state and
messages, run it, stop it mid-run.
*Try:* press Run, then press Stop while it is still streaming.
*Success:* output appears in the transcript panel, and Stop truncates it immediately.
*Failure:* Stop does nothing and the run completes anyway.

### Generative UI

**`/generative-ui/tool-based` — Components as Tools.** A React component registered with `useComponent` becomes a
tool the agent can call. No handler, no server-side execution — the agent decides when to show it and fills in the
data.
*Try:* `Chart quarterly revenue for last year: Q1 120, Q2 145, Q3 138, Q4 190.`
*Success:* a bar chart renders inline in the chat with four bars plotted, followed by a short sentence.
*Failure:* a markdown table or a prose description of a chart — the model answered instead of calling the tool.
*Doc change:* the page now says the Zod schema *is* the tool's parameter definition (not that it validates
arguments), and adds a "Rendering in a headless chat" fragment (`CopilotChatToolCallsView`), which the route shows
as reference.
*Note:* this demo drives `chart_agent`, not the Quickstart agent. The page is explicit that a tool arrives on every
run but a model with no instruction about it never calls one, and the prompt naming `render_bar_chart` lives on
that agent. The `BarChart` component itself is not published by the docs — see §9.7.

**`/generative-ui/tool-rendering` — Tool Rendering.** The agent's `get_weather` call rendered as a custom
component, plus a catch-all renderer for everything else.
*Try:* ask `What's the weather in Tokyo?`
*Success:* `Calling weather API...` appears, then becomes `Called the weather API for Tokyo.` once the call
completes.
*Failure:* the call renders as raw JSON or not at all — the renderer name and the C# tool name disagree.

**`/generative-ui/state-rendering` — State Rendering.** ❌ Broken on the current package pin and left as
published. The page's `DelegatingAIAgent` re-asks the model for a structured `AgentStateSnapshot` and emits it as
`DataContent`. The 1.27 AG-UI server no longer turns `DataContent` into state events (§9.9).
*Try:* `Search for the tallest mountains`.
*What happens today:* the chat replies with a summary and the list stays empty. On 2026-11-05 the wrapper was
confirmed to yield `{"searches":[…]}`, and the event stream carried no `STATE_SNAPSHOT`.
*Would succeed as (on an older pin):* the list fills in when the snapshot arrives.
*Cost note:* this wrapper runs the model twice per turn — once for the snapshot, once for the prose summary.

**`/generative-ui/a2ui/dynamic-schema` — A2UI Dynamic Schema.** ❌ Backend published in Python only. See section 9.

**`/generative-ui/a2ui/fixed-schema` — A2UI Fixed Schema.** ❌ Backend published in Python only, and the schema
file it loads is never published. See section 9.

**`/generative-ui/json-render` — JSON Render.** ⚠️ The page's Code tab is mounted verbatim: a `{ root, elements }`
spec drawn by `@json-render/react` in the assistant-message slot, on its own runtime at
`/api/copilotkit-declarative-json-render`.
*Try:* `Show me the sales dashboard with metrics and a revenue chart`.
*Success:* a metric card and a bar chart replace the raw JSON.
*Failure:* raw JSON stays in a normal bubble, or a 404 because the backend was not restarted after the change.
*Note:* the page's C# agent does not compile on 1.27 (`CS0117: ChatClientAgentOptions.Instructions`). The published
file stays in `backend/doc-samples/`. The endpoint runs `backend/DocAgents/ByocJsonRenderAgent.Remedy.cs`, a
labelled copy that only moves the system prompt to `ChatOptions.Instructions` (§9.10).

**`/generative-ui/hashbrown` — Hashbrown.** ⚠️ Same shape as JSON Render: a Hashbrown UI kit parsing a streaming
`{ ui: [...] }` envelope. The C# agent has the same CS0117 and runs as `DocAgents/ByocHashbrownAgent.Remedy.cs`
(§9.10).
*Success:* metric cards and charts appear progressively while the JSON streams.

**`/generative-ui/mcp-apps` — MCP Apps.** ⚠️ The page publishes only a TypeScript `BuiltInAgent` runtime with
`mcpApps`, no .NET. It runs on `/api/copilotkit-mcp-apps`; the doc's `basePath`/`runtimeUrl` were relocated, because
the handler 404s at any other mount.
*Setup:* see [Running the MCP Apps route](#running-the-mcp-apps-route) in §6. In short: `OPENAI_API_KEY` in
`frontend/.env.local`, and `PORT=3108 npx -y @modelcontextprotocol/server-budget-allocator` in a third terminal.
*Try:* `Show me the budget allocator`.
*Success:* the agent calls `get-budget-data` and an interactive budget chart renders in an iframe in the sidebar.
*Failure:* an error about the MCP server (nothing on :3108), a model-auth error (no frontend key, or the dev server
not restarted after adding it), or a plain-text reply with no iframe (the tool's UI resource did not load).

**`/generative-ui/open-generative-ui` — Open Generative UI.** ⚠️ Two demos from the Code tab, verbatim: minimal
(`/demo-chat`) and advanced with sandbox functions (`/demo-chat/advanced`). Both C# agents compile and are mapped at
`/open-gen-ui` and `/open-gen-ui-advanced`. Unpublished helpers are labelled stand-ins.
*Try:* minimal — `build me a simple greeting card`; advanced — the **Calculator** suggestion.
*Success:* placeholder lines, then the UI building live in an iframe. In advanced, `=` shows a result and the
console logs `[open-gen-ui/advanced] evaluateExpression`.
*Caveat:* the design skill and the sandbox-function descriptions reach the agent as AG-UI context, which the .NET
server drops (§9.11). The tool still arrives, so expect a generic UI and possibly no host calls.

### Generative UI · Components and surfaces

All nine routes are ❌. Their doc code is verbatim, and the pieces the pages never define are harness-authored
and labelled on each route: product data, `ProductRow`, `Cart`, `Hero`, `cartUI`, `Panel`, `Airport`, `Arrow`,
`productSchema`, the `search_products` tool and `genui_agent`. Agent-rendered UI cannot work because the .NET AG-UI
server drops the run's context entries, which carry the catalog and the render guide (§9.11, confirmed live). The
demos use `/api/copilotkit-genui` (and `/api/copilotkit-genui-transports` for `generativeUI: true`).

- **`/generative-ui/components`.** The section's Try-it setup: the page's runtime
  (`/api/copilotkit-components`), `Providers` with `standardUI`, and a bare `CopilotChat`. The page's TanStack
  `BuiltInAgent` is swapped for the MAF .NET `components_agent` (same model and system prompt, no tools). Prompt:
  `Compare the Starter, Team, and Enterprise plans in a table`. The page promises a live table; expect text today,
  because the guide and catalog never reach the model. A `RUN_ERROR` means `/components_agent` is unreachable.
- **`/generative-ui/components/surfaces`.** Offline check: the fallback product row (Trail Runner, City Sneaker,
  Track Spike) renders. Prompt: `Show me cheap running shoes in the featured row`. The page says the row is
  swapped; today, expect text or rejected operations.
- **`/generative-ui/components/catalogs`.** Offline check: the export tab lists Panel's properties in the order
  component, title, children, color. The Valibot sample is shown, not run.
- **`/generative-ui/components/standard-catalog`.** `standardUI` as is, plus extends, omit and overrides.
  Prompt: `Put a short summary of our three plans in a card`. Expect text today.
- **`/generative-ui/components/state-and-actions`.** Offline check: the declarations tab shows `addToCart`
  rendererOrAgent/object, `track` void, `reload` agentOnly.
- **`/generative-ui/components/theming`.** Theme tokens, dark overrides and CSS variables. There is nothing to
  theme until a surface renders.
- **`/generative-ui/components/transports`.** Tool vs markdown transport and `agentIds`. Expect text on every
  tab. A rendered component on the agentIds tab would be a failure.
- **`/generative-ui/components/markdown-mode`.** `a2ui` fenced blocks in the reply. Expect plain markdown today;
  a block arriving as raw JSON would be a renderer failure.
- **`/generative-ui/components/from-a2ui`.** The A2UI 1.0 "After" catalog (Airport and Arrow). Expect text
  today. A crash on load would be a failure.

### App Control

**`/frontend-tools` — Frontend Tools.** A tool the agent calls that executes in the browser.
*Try:* `Say hello to Damien`
*Success:* a browser alert reads `Hello, Damien!`, and after you dismiss it the agent confirms in chat.
*Failure:* the agent replies in text with no alert — the tool was not forwarded, so check you are on the demo route
where it is registered.
*Note:* the server declares nothing. Tools registered with `useFrontendTool` are forwarded automatically in the
AG-UI run input, which is why no backend change was needed.

### Shared State

**`/shared-state/in-app-agent-read` — Reading agent state.** ⚠️ The page's TSX verbatim, on `sample_agent`: the
Quickstart agent plus the page's `AgentStateSnapshot` class (`backend/SharedStateAgent.cs`, wiring labelled).
*Try:* send `Switch to Spanish`.
*Success (as far as it goes):* the chat replies, and the panel shows the `language` the page's `useEffect` seeded on
the client.
*Known limit:* the agent never sees or changes state. A run carrying `state: {"language":"spanish"}` got the reply
`NO STATE` and emitted no state events. The class is referenced by nothing, because the page never shows where it
plugs in (§9.2).

**`/shared-state/in-app-agent-write` — Writing agent state.** ⚠️ Same agent. `setState` visibly mutates the client
copy and the re-run reaches the agent and gets a reply, but the written language is not read on the .NET side.

### Human in the Loop

**`/human-in-the-loop/interrupt-flow` — Interrupt-based.** ⚠️ A backend `delete_file` wrapped in the page's
`ApprovalRequiredAIFunction`, on a labelled Quickstart-shaped agent at `/interrupt_agent`, rendered by the page's
`ApprovalPanel` (`useInterrupt`, `renderInChat: false`).
*Try:* `Delete the file notes.txt`.
*Success:* the panel shows `Approval required for tool call: delete_file` with Approve/Deny. Approve gives
`Deleted notes.txt.`; Deny ends the run.
*Failure:* the agent claims it deleted the file with no panel, or Approve gives a `RUN_ERROR`.
*Known:* a raw AG-UI run does return the interrupt. A hand-built resume request returned `RUN_ERROR`, so the
browser resume path is unverified.

**`/human-in-the-loop/tool-based` — Tool-based.** ⚠️ The page's `humanApprovedCommand` (`useHumanInTheLoop`) on
the Quickstart agent; no backend change.
*Try:* `Ask me for approval before running the command ls -la`.
*Success:* a `<pre>ls -la</pre>` block with Approve/Deny appears; clicking sends `Command is APPROVED/DENIED` and
the agent replies.
*Failure:* a prose answer with no block.

**`/human-in-the-loop/governed-actions` — Governed Actions.** An approval gate in front of side-effecting actions.
This works, via `useHumanInTheLoop` — frontend tools are auto-forwarded, so the Quickstart agent can call
`approve_governed_action` with no server change.
*Try:* `Call approve_governed_action to send a refund email to alex@example.com for $40, reference POLICY-114,
verdict require_approval`
*Success:* an approval card renders in the chat showing the arguments, and the run waits. Approving resumes it;
rejecting tells the agent it may not proceed. Ask for `allow` and `deny` verdicts to see the two auto-resolving
paths.
*Failure:* the agent answers in prose without a card. Name the tool explicitly — nothing instructs it to reach for
one, because the page publishes no agent.
*Caveat:* the `useInterrupt` path on the same page is not exercised; it needs a backend that pauses a run mid-flight
and no such agent is shown.

### Interactivity

**`/webmcp` — WebMCP.** ⚠️ The page's `OrderSearch` (`useFrontendTool` with `webmcp` annotations) plus a labelled
`searchOrders` stub. A banner reports whether `document.modelContext` exists in your browser.
*Try (chat):* `Which of my orders have shipped?`. The stub returns ORD-2 and ORD-4.
*Try (WebMCP):* Chrome 149+ with `chrome://flags/#enable-webmcp-testing`; the Model Context Tool Inspector should
list `searchOrders` (readOnlyHint).
*Failure:* the banner reads "not available". That means this browser cannot test the WebMCP path; it is not a
harness bug.

### Multi-Agent

**`/multi-agent/subagents` — Sub-Agents.** ❌ The Code tab now publishes the full `SubagentsAgent.cs` and a complete
`delegation-log.tsx`. The C# still calls two unpublished helpers, a non-existent `AsLunaChatClient()` and a
superseded API, so it cannot be built. Backend `/subagents` is a labelled harness stand-in (the Quickstart agent) so
the endpoint answers. **Open demo** mounts the Code tab's
`page.tsx` and `delegation-log.tsx` unedited; the four files they import but the tab never ships
(`subagent-activity-card`, `demo-layout`, `active-subagent`, `suggestions`) are harness-authored stand-ins in
`_demo-source/`. The runtime registers `subagents` → `${AGENT_URL}/subagents`, as the Code tab's `route.ts` does.
*Try:* "Produce a short blog post about cold exposure training. Research first, then write, then critique."
*Expected:* layout and suggestion pills render and the chat streams a plain answer, but no sub-agent activity cards
appear and the delegation log stays empty (the stand-in has no sub-agent tools). *Failure:* a 404 or run error means
the backend predates the stand-in; restart it. See section 9.1.

### Microsoft Agent Framework

**`/auth` — Authentication.** ⚠️ Half testable. The frontend header forwarding is implemented and works; the
documented .NET validation needs a real identity provider.
*Try:* set `NEXT_PUBLIC_AUTH_BEARER_TOKEN` in `frontend/.env.local`, restart, and send a message.
*Success:* the request carries an `Authorization` header — confirm it on `/ag-ui` or in the agent's console.
*Failure vs. success is not the chat:* the chat replies either way, because nothing on the server validates the
token. See section 9.
*Note:* the page's CORS block **is** published in C# and **is** implemented — `AddCors`/`UseCors` scoped to
`http://localhost:3000` in `backend/Program.cs`.

### Rich Threads

All three run on `/api/copilotkit-threads`, the Intelligence-enabled runtime. Without `CPK_INTELLIGENCE_API_KEY`
the read-only routes still answer off the in-memory fallback, mutations return 422, and the prebuilt drawer stays
locked. Confirm which mode you are in:

```bash
curl -s http://localhost:3000/api/copilotkit-threads/info | grep -o '"mutations":[a-z]*'
# "mutations":false  → no key; "mutations":true → key active
```

**`/threads/drawer` — Threads Drawer.** One tab per published sample: zero props, customized, hosted by a
`CopilotSidebar`, your own New-conversation button (`startNewThread()`), a controlled `threadId`, and the drawer's
New controls hidden with `::part()` CSS.
*Success:* past conversations list, and clicking one restores its messages. On the Own New button tab, clicking it
shows the welcome screen with no row selected. On desktop the drawer has no launcher button; it is mobile-only by
design.
*Failure (expected without a key):* the drawer renders locked.

**`/threads/headless` — Headless Threads.** A thread sidebar built from scratch on `useThreads` — rename, archive,
delete, switch, paginate.
*Success:* all five operations work and survive a page reload.
*Failure (expected without a key):* the list renders but every mutation 422s.

**`/threads/lifecycle` — Thread & History Lifecycle.** How a `threadId` comes to exist and what makes history
hydrate back into the view.
*Success:* reloading mid-conversation restores the transcript from the server.
*Failure (expected without a key):* reload starts blank — there is no server-side store to replay from.

### Backend

**`/copilot-runtime` — Copilot Runtime.** This repo's live runtime config and agent routing. The route now exports
`PATCH` and `DELETE` as the page does, and shows the new "Which name identifies an agent" and "Runtime languages"
sections. Open `/api/copilotkit/info` to see the registered keys.
*Try:* switch agent id in the demo and send a message to each.
*Success:* each id reaches its own endpoint; `chart_agent` and `search_agent` behave differently from `my_agent`.

**`/ag-ui` — AG-UI.** A live capture of the raw protocol events flowing between runtime and browser.
*Try:* send a message and watch the event list.
*Success:* `RUN_STARTED`, text-delta events, any tool-call events, then `RUN_FINISHED`.
*Failure:* the capture stays empty while the chat works — the tap is not attached.

### Doc Sync

**`/doc-sync` — Doc drift.** Re-fetches the markdown behind all 22 tracked pages and diffs it against
`doc-snapshot/`, flagging changes inside code blocks specifically. This is how you find out the docs moved under
this repo. Run it before trusting any status below.

---

## 8. Testing checklist / current status

✅ Working · ⚠️ Partial · ❌ Blocked by a documentation gap · 📄 Reference

| Doc page | Route | Status | Notes |
| --- | --- | --- | --- |
| [Introduction](https://docs.copilotkit.ai/ms-agent-dotnet) | `/` | 📄 | Landing page and connection check. |
| [Quickstart](https://docs.copilotkit.ai/ms-agent-dotnet/quickstart?agent=bring-your-own) | `/quickstart` | ✅ | Full C# published and implemented. |
| [Prebuilt Components](https://docs.copilotkit.ai/ms-agent-dotnet/prebuilt-components) | `/prebuilt-components` | ✅ | Page now publishes code; all four samples implemented. Customization tab not yet browser-checked. |
| [Slots](https://docs.copilotkit.ai/ms-agent-dotnet/custom-look-and-feel/slots) | `/custom-look-and-feel/slots` | ⚠️ | Levels 1–3 work at runtime. New reshaping/grouping/labels tabs not yet browser-checked; level-2 and level-3 samples do not type-check (§9.5). |
| [Headless UI](https://docs.copilotkit.ai/ms-agent-dotnet/custom-look-and-feel/headless-ui) | `/custom-look-and-feel/headless-ui` | ✅ | |
| [Programmatic Control](https://docs.copilotkit.ai/ms-agent-dotnet/programmatic-control) | `/programmatic-control` | ✅ | |
| [Components as Tools](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/tool-based) | `/generative-ui/tool-based` | ✅ | C# agent published and live; `BarChart` / `barChartPropsSchema` written here from the page's description (§9.7). Chat client patched with the reasoning-effort chain; the page's bare `.AsIChatClient()` fails every tool run (§9.8). |
| [Tool Rendering](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/tool-rendering) | `/generative-ui/tool-rendering` | ✅ | |
| [State Rendering](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/state-rendering) | `/generative-ui/state-rendering` | ❌ | Compiles, but the 1.27 AG-UI server drops `DataContent` state (§9.9, confirmed live). |
| [A2UI Dynamic Schema](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/a2ui/dynamic-schema) | `/generative-ui/a2ui/dynamic-schema` | ❌ | Backend is Python only; catalog undefined. |
| [A2UI Fixed Schema](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/a2ui/fixed-schema) | `/generative-ui/a2ui/fixed-schema` | ❌ | Backend is Python only; `flight_schema.json` never published. |
| [JSON Render](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/json-render) | `/generative-ui/json-render` | ⚠️ | Frontend verbatim; doc C# fails CS0117, so a labelled one-line remedy runs. Raw AG-UI run OK; not browser-checked (§9.10). |
| [Hashbrown](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/hashbrown) | `/generative-ui/hashbrown` | ⚠️ | Same CS0117 and the same one-line remedy. Raw AG-UI run OK; not browser-checked (§9.10). |
| [MCP Apps](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/mcp-apps) | `/generative-ui/mcp-apps` | ⚠️ | No .NET code on the page; Node BuiltInAgent runtime; needs an MCP server on :3108 and a frontend key. Not browser-checked. |
| [Open Generative UI](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/open-generative-ui) | `/generative-ui/open-generative-ui` | ⚠️ | Both agents compile and are mapped; helpers stubbed (labelled); design skill and sandbox-function context dropped (§9.11). Not browser-checked. |
| [Components and surfaces](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components) | `/generative-ui/components` | ❌ | TanStack BuiltInAgent swapped for MAF `components_agent`; context (guide, catalog) dropped (§9.11). |
| [Surfaces](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components/surfaces) | `/generative-ui/components/surfaces` | ❌ | Context dropped (§9.11); fallback row works offline. |
| [Catalogs](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components/catalogs) | `/generative-ui/components/catalogs` | ❌ | Context dropped; export tab works offline. |
| [Standard catalog](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components/standard-catalog) | `/generative-ui/components/standard-catalog` | ❌ | Context dropped. |
| [State and actions](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components/state-and-actions) | `/generative-ui/components/state-and-actions` | ❌ | Context dropped; declarations tab works offline. |
| [Theming](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components/theming) | `/generative-ui/components/theming` | ❌ | Context dropped; nothing renders to theme. |
| [Transports](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components/transports) | `/generative-ui/components/transports` | ❌ | Context dropped. |
| [Markdown mode](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components/markdown-mode) | `/generative-ui/components/markdown-mode` | ❌ | Context dropped; `sendContext: false` path shown in Python only. |
| [Adopt from A2UI](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components/from-a2ui) | `/generative-ui/components/from-a2ui` | ❌ | Context dropped. |
| [Frontend Tools](https://docs.copilotkit.ai/ms-agent-dotnet/frontend-tools) | `/frontend-tools` | ✅ | |
| [Reading agent state](https://docs.copilotkit.ai/ms-agent-dotnet/shared-state/in-app-agent-read) | `/shared-state/in-app-agent-read` | ⚠️ | .NET tab is a 4-line class; backed by the Quickstart agent + that class. Agent never sees state (`NO STATE`). Not browser-checked. |
| [Writing agent state](https://docs.copilotkit.ai/ms-agent-dotnet/shared-state/in-app-agent-write) | `/shared-state/in-app-agent-write` | ⚠️ | Same agent; `setState` works client-side, writes are not read by the agent. Not browser-checked. |
| [Governed Actions](https://docs.copilotkit.ai/ms-agent-dotnet/human-in-the-loop/governed-actions) | `/human-in-the-loop/governed-actions` | ⚠️ | Approval UI works; page publishes no agent and no `executeSideEffect`. |
| [Interrupt-based](https://docs.copilotkit.ai/ms-agent-dotnet/human-in-the-loop/interrupt-flow) | `/human-in-the-loop/interrupt-flow` | ⚠️ | Interrupt confirmed with a raw AG-UI run; resume and browser render unverified. Labelled `DeleteFile` and agent. |
| [Tool-based](https://docs.copilotkit.ai/ms-agent-dotnet/human-in-the-loop/tool-based) | `/human-in-the-loop/tool-based` | ⚠️ | Complete on the page; not yet browser-checked. Code tab (dojo planner) shown as reference. |
| [WebMCP](https://docs.copilotkit.ai/ms-agent-dotnet/webmcp) | `/webmcp` | ⚠️ | `searchOrders` is a labelled stub; WebMCP path needs Chrome 149+ with a flag. Not browser-checked. |
| [Sub-Agents](https://docs.copilotkit.ai/ms-agent-dotnet/multi-agent/subagents) | `/multi-agent/subagents` | ❌ | Full C# now published, but two helpers are unpublished, `AsLunaChatClient()` doesn't exist, and it is on a superseded API. Demo mounts the Code-tab frontend against a Quickstart stand-in at `/subagents`: chat works, no delegations. |
| [Authentication](https://docs.copilotkit.ai/ms-agent-dotnet/auth) | `/auth` | ⚠️ | Forwarding + CORS implemented; JWT validation needs an IdP. |
| [Threads Drawer](https://docs.copilotkit.ai/ms-agent-dotnet/prebuilt-components/copilot-threads-drawer) | `/threads/drawer` | ⚠️ | Needs `CPK_INTELLIGENCE_API_KEY`. Four new sample tabs not yet browser-checked; `YourMainContent` is a labelled placeholder. |
| [Headless Threads](https://docs.copilotkit.ai/ms-agent-dotnet/headless-threads) | `/threads/headless` | ⚠️ | Needs the key for mutations. |
| [Thread & History Lifecycle](https://docs.copilotkit.ai/ms-agent-dotnet/threads-lifecycle) | `/threads/lifecycle` | ⚠️ | Needs the key for server-side replay. |
| [Copilot Runtime](https://docs.copilotkit.ai/ms-agent-dotnet/copilot-runtime) | `/copilot-runtime` | ✅ | |
| [AG-UI](https://docs.copilotkit.ai/ms-agent-dotnet/ag-ui) | `/ag-ui` | ✅ | |
| — (harness tooling) | `/doc-sync` | 📄 | Live drift detector against all 22 pages. |

No tracked doc page 404s. All 22 fetched cleanly on 2026-09-14.

---

## 9. Known issues / doc-vs-implementation discrepancies

These are findings about the documentation, not bugs in this repo. Each one was verified against the live pages and
the pinned packages.

### 9.1 Sub-agents publishes C# for a superseded API, with two helpers missing

[Page](https://docs.copilotkit.ai/ms-agent-dotnet/multi-agent/subagents) · Route `/multi-agent/subagents` ·
Artifacts `backend/doc-samples/SubagentsAgent.cs.txt`, `subagents-page.tsx.txt`, `subagents-delegation-log.tsx.txt`

**See the errors yourself:** `dotnet build doc-checks/subagents` (from the repo root). That standalone project
compiles the published file unedited against this repo's package pins. It is expected to fail with 8 × CS0246
(`AgentRunResponse`, `AgentRunResponseUpdate`, `AgentThread`). The `AsLunaChatClient()` and missing-helper errors
below do not print yet, because the compiler stops at these signature errors first. The real backend is unaffected.

The page has changed since September. The old "setup skipped" marker is gone, and the Code tab now ships the whole
`SubagentsAgent.cs`: `DelegateAsync`, the full `SubagentsStore`, and a complete `CreateAgent()`, now on `gpt-6-luna`
(2026-11-09 update). It still cannot be built:

**Non-existent `AsLunaChatClient()`.** Since the gpt-6-luna update, both `CreateAgent()` and `DelegateAsync` call
`_openAiClient.GetChatClient(...).AsLunaChatClient()`. No such extension exists in `Microsoft.Agents.AI` or
`Microsoft.Extensions.AI`, and the page defines none (CS1061). The other gpt-6-luna pages use
`.AsIChatClient().AsBuilder()…Build()` instead. Kept verbatim.

**Unpublished helpers.** `ApiKeyResolver` and `AimockHeaderPolicy` are called and defined nowhere (§9.10).

**Superseded API.** It overrides `RunAsync` / `RunStreamingAsync` over `AgentRunResponse`,
`AgentRunResponseUpdate` and `AgentThread`, and calls `ToAgentRunResponseAsync`. None of these exist in
`Microsoft.Agents.AI` 1.27.0 / `Hosting.AGUI.AspNetCore` 1.27.0-preview.261030.1, this repo's pin. Against the
earlier 1.19 pin, compiling the signatures gave:

```
error CS0246: The type or namespace name 'AgentRunResponse' could not be found
error CS0246: The type or namespace name 'AgentRunResponseUpdate' could not be found
error CS0246: The type or namespace name 'AgentThread' could not be found
```

The current names are `AgentResponse`, `AgentResponseUpdate` and `AgentSession`, overriding `RunCoreAsync` /
`RunCoreStreamingAsync`, which is what State Rendering uses. Even if it compiled, it emits the delegation log as
`DataContent`, which 1.27 no longer turns into state (§9.9). Its Code-tab `Program.cs` maps it with `MapAGUI`, which
does not exist. On the frontend, `delegation-log.tsx` is now complete. `page.tsx` still imports four unshipped files,
and `Delegation.status` is typed `"completed"` while the C# also writes `"running"` and `"failed"`.

### 9.2 Shared State's .NET tab is a stub

[Read](https://docs.copilotkit.ai/ms-agent-dotnet/shared-state/in-app-agent-read) ·
[Write](https://docs.copilotkit.ai/ms-agent-dotnet/shared-state/in-app-agent-write)

Both pages' `.NET` tab contains this, and nothing else:

```csharp
public class AgentStateSnapshot
{
    public string Language { get; set; } = "english";
}
```

The Python tab beside it carries roughly sixty lines: the `update_language` tool, `STATE_SCHEMA`,
`PREDICT_STATE_CONFIG`, the `AgentFrameworkAgent` construction and the endpoint registration. None of that has a
published .NET equivalent, so there is no documented way to build the `sample_agent` both pages' frontend code
reads from and writes to.

The frontend halves *are* published in full and are implemented here verbatim — including the `useEffect` that
seeds `language` once `isReady` flips. Since 2026-11-06, `sample_agent` is mapped to the Quickstart agent as
published, with the class added in `backend/SharedStateAgent.cs`. The class is namespaced (`SharedState`) because
State Rendering's verbatim code already declares a global `AgentStateSnapshot`. Nothing references it, so the agent
neither receives nor emits state. A raw run carrying `state: {"language":"spanish"}` got the reply `NO STATE` and no
`STATE_*` events. The finding stands: the page gives no .NET way to connect the class to the agent.

### 9.3 Both A2UI pages publish Python under the .NET slug

[Dynamic](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/a2ui/dynamic-schema) ·
[Fixed](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/a2ui/fixed-schema)

Neither page has a `.NET` / `Python` tab pair — unlike Quickstart, Tool Rendering, Shared State, State Rendering
and Authentication, which all do. The backend code is Python throughout: `agent_framework`,
`agent_framework_ag_ui`, the `@tool` decorator, `add_agent_framework_fastapi_endpoint`, and an `a2ui_config` dict
on the endpoint. There is no C# anywhere on either page.

Additional omissions:
- **Dynamic:** `myCatalog` is passed as `a2ui={{ catalog: myCatalog }}` but never defined; the page defers the
  `definitions` / `renderers` / `createCatalog` split to a framework-agnostic page outside this doc tree.
- **Fixed:** `flight_schema.json` is loaded at import time and passed straight into `updateComponents`, but only a
  single button object from it is ever shown. Without that file there is nothing to render.

The TypeScript runtime configuration on both pages is language-agnostic and would carry over unchanged.

### 9.4 Authentication's .NET path is not locally testable

[Page](https://docs.copilotkit.ai/ms-agent-dotnet/auth) · Artifact `backend/doc-samples/AuthProgram.cs.txt`

The `.NET` tab documents only `AddJwtBearer` with `ValidateIssuer`, `ValidateAudience`, `ValidateLifetime` and
`ValidateIssuerSigningKey` all enabled, pointed at a live `JwtAuthority` and `JwtAudience` (the example is Entra
ID). Exercising it requires a real identity provider.

The page's own Python tab carries a shared-secret middleware that *is* localhost-testable, and the sibling Python
harness uses exactly that. There is no published .NET equivalent, so this repo implements the forwarding half only
and keeps the JWT sample as an unbuilt artifact.

The page's CORS section **is** published in C# and **is** implemented.

### 9.5 The Slots sample does not type-check

[Page](https://docs.copilotkit.ai/ms-agent-dotnet/custom-look-and-feel/slots) ·
`frontend/src/app/custom-look-and-feel/slots/demo-chat/page.tsx`

The page's level-3 component is published as `const CustomMessageView = ({ messages, isRunning }) => (…)` with no
type annotations. Under the `strict` mode `create-next-app` enables by default, that is three implicit-`any`
errors. Separately, a bare function is not assignable to `SlotValue<typeof CopilotChatMessageView>`, which requires
a static `Cursor` property — so `<CopilotChat messageView={CustomMessageView} />` cannot satisfy the prop as
written.

**It works at runtime; only the compiler objects.** This repo keeps the sample byte-for-byte and adds three
`@ts-expect-error` suppressions with comments naming the reason, rather than annotating the parameters and
silently diverging from the page.

Worth noting this is invisible if you only ever run `next dev`, which does not block on type errors — which is
presumably why it has survived.

### 9.6 Governed Actions' Zod schema is invalid under Zod 4

[Page](https://docs.copilotkit.ai/ms-agent-dotnet/human-in-the-loop/governed-actions)

The page writes `arguments: z.record(z.unknown())`. Zod 4 requires an explicit key schema, so the single-argument
form is a *type* error — it fails the build rather than failing at runtime, leaving no way to keep it verbatim and
still ship a compiling app. This repo writes `z.record(z.string(), z.unknown())`, the same type with the key spelled
out. **This is the only place in the repo where published code was altered rather than annotated.**

The page also publishes no agent in any language, and its resume-path `executeSideEffect` is called but never
defined.

### 9.7 Components as Tools never publishes its component — implemented anyway

[Page](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/tool-based) ·
`frontend/src/app/generative-ui/tool-based/bar-chart.tsx`

The `useComponent` call names `BarChart` and `barChartPropsSchema`; neither is printed. The page says the component
uses [Recharts](https://recharts.org) and cites a source path, `src/app/demos/gen-ui-tool-based/page.tsx`, that is
not part of the docs.

**This one is by design, and the route is fully working.** The page's framing — "the component itself is ordinary
React… it doesn't know anything about CopilotKit" — means the component is meant to be *yours*. Withholding it is
not an omission, so unlike §9.1–§9.4 this is not a gap to report and stop at.

Both identifiers are therefore written here, minimally, from three things the page *does* publish: the sentence
naming Recharts, the tool name `render_bar_chart`, and the agent's system prompt, which asks the model for "a
concise title, description, and data array of `{label, value}` items" — that prompt is what fixes the schema's
shape. The component imports nothing from CopilotKit, which is the page's own point about the pattern.

This matches how the sibling `claude-sdk-python` harness handles the same page.

### 9.8 Chat-client setup differs across pages

Since the 2026-11-09 update every page uses `gpt-6-luna`, but not the same chat-client chain. Quickstart, Tool
Rendering, State Rendering, Frontend Tools, Tool-based HITL and Authentication wrap it as
`.AsIChatClient().AsBuilder().ConfigureOptions(… ReasoningEffortLevel = new("none") …).Build()` under
`#pragma warning disable OPENAI001`. Sub-agents calls a non-existent `.AsLunaChatClient()` (§9.1) and is kept
verbatim.

**Components as Tools is patched.** Its page uses a bare `.AsIChatClient()`. With that setup, every run that carries
a frontend tool (here `render_bar_chart`, i.e. every run on the page) ends in `RUN_ERROR` / `StreamingError`, while
plain chat works. Sending the same tool request to `/`, which uses the reasoning-effort chain, produces the tool
call. `/chart_agent` in `backend/Program.cs` therefore uses the reasoning-effort chain, marked `HARNESS FIX`.
Restore the bare `.AsIChatClient()` to reproduce the doc as published.

---

### 9.9 DataContent no longer becomes AG-UI state (State Rendering, Sub-Agents)

[State Rendering](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/state-rendering) emits its snapshot as
`DataContent("application/json")`. On `Hosting.AGUI.AspNetCore` 1.27.0-preview (over `AGUI.Server` 1.0.0) the
server drops it. Checked 2026-11-05: the wrapper yielded `{"searches":[…]}`, and the stream held only
`RUN_STARTED`, `TEXT_MESSAGE_*` and `RUN_FINISHED`. The docs' own Code-tab demos say so in a comment (since MAF
1.23) and use `AGUIStreamOptions.MapResultAsStateSnapshot` / `MapResultAsStateDelta` instead, but the page prose
still teaches `DataContent`. The Sub-Agents agent relies on the same mechanism.

### 9.10 Code-tab C# that does not compile, or that calls helpers no page publishes

- **json-render and hashbrown:** `ByocJsonRenderAgent.cs` and `ByocHashbrownAgent.cs` set
  `ChatClientAgentOptions.Instructions`, which does not exist in `Microsoft.Agents.AI` 1.27.0 (`CS0117`). The 1.27
  home for a system prompt is `ChatOptions.Instructions`. The published files stay verbatim in
  `backend/doc-samples/`. `backend/DocAgents/*.Remedy.cs` are labelled copies with only that line moved, mapped at
  `/byoc-json-render` and `/byoc-hashbrown`. Both were confirmed with a raw AG-UI run to return the page's JSON
  shape.
- **Unpublished helpers (every Code-tab agent):** `ApiKeyResolver.ResolveApiKey/ResolveEndpoint` and
  `AimockHeaderPolicy.CreateOpenAIClientOptions` are defined nowhere. `backend/DocGapStubs.cs` holds labelled
  stand-ins that read `OPENAI_API_KEY` the Quickstart way.
- **`MapAGUI`/`AddAGUI`:** the Code-tab `Program.cs` files use them, but no Hosting.AGUI release (1.16–1.27) has
  them, only `MapAGUIServer`/`AddAGUIServer`. Prose pages use the right names, so a page and its own Code tab
  disagree.
- **Comments pointing at Python:** the json-render and hashbrown routes and agents cite `byoc_*_agent.py` and
  `agent_server.py`.
- **Unpublished frontend files:** the Open Generative UI minimal demo imports `./chat` and `./design-skill`
  (labelled stand-ins written). The Sub-Agents demo imports four files the tab does not ship.

### 9.11 The .NET AG-UI server ignores the run's context entries

The Components and surfaces pages, Markdown mode and Open Generative UI all depend on the agent reading AG-UI
`context`: the catalog, the render guide, the design skill and the sandbox-function descriptions. The pages give
no .NET code for it ("put the run's context entries into its system prompt"). `AGUI.Server` 1.0.0 and
`Hosting.AGUI.AspNetCore` 1.27.0-preview never read `RunAgentInput.Context`. Confirmed live on 2026-11-05: a context
entry carrying a secret word was sent to `/genui_agent`, and the model answered that it had none. Client tools
(`render_ui`, `generateSandboxedUi`) do arrive. No workaround is written.

### 9.12 Smaller discrepancies found in this sync

- **Interrupt-based:** the .NET fragment never defines `DeleteFile`, elides `AddChatClient(/* ... */)` and never
  reaches `MapAGUIServer`. The Requirements table names `AGUI.Server (.NET) 0.0.6`, not the package the Quickstart
  installs. The page's example message is "Approve running delete_file?", but the server sends "Approval required
  for tool call: delete_file".
- **HITL Tool-based:** the Demo/Code tab is the AG-UI dojo task planner, a different app from the page's code. The
  page's `Page` returns void, which TypeScript rejects as a JSX component (`@ts-expect-error` at the mount).
- **WebMCP:** `searchOrders` is never defined, and `webmcp.ts` imports `@copilotkit/core`, which no install step
  adds. This repo now lists it explicitly.
- **MCP Apps:** the doc's `basePath: "/api/copilotkit"` makes the handler 404 at any other mount. The `.use()`
  snippet does not import `BuiltInAgent`. The prose says GPT-4o, but the code uses `openai/gpt-5.4`.
- **Threads Drawer:** the sidebar sample renders an undefined `<YourMainContent />`, and the controlled sample has no
  imports. In 1.84.1 `CopilotThreadsDrawerProps` still has no `children`, so the `slot="header"` sample cannot work.
- **Slots:** the Props Override sample's `"data-testid"` is not a known `messageView` prop in 1.84.1 (TS2353;
  `@ts-expect-error` above it).
- **Tool Rendering / Frontend Tools Code tabs:** they import v1 `CopilotKit` from `@copilotkit/react-core` next to
  v2 hooks, and the bundled README still names `useCopilotAction`.
- **Lint:** the verbatim Code-tab routes use `@ts-ignore`, and two verbatim chart components reassign a variable
  during render. Both are flagged by `eslint` and kept as published.

## 10. Troubleshooting

Symptoms as they actually appear in this repo. The framework's own Quickstart troubleshooting section is the
upstream source for the first three.

**`Set OPENAI_API_KEY` on startup, and the agent exits immediately.**
The key is not reaching `builder.Configuration`. From `backend/`:
```bash
dotnet user-secrets set OPENAI_API_KEY "<your-openai-api-key>"
```
Note that user secrets are scoped to the project's `UserSecretsId`, so run this from `backend/`, not the repo root.

**`Failed to bind to address http://localhost:8000` — address already in use.**
Something else owns the port. Find it and either stop it or move the agent:
```bash
ss -ltnp | grep :8000
AGENT_PORT=8010 dotnet run --project backend   # then set MS_AGENT_URL to match
```
This bites more often than it should, and the failure downstream is confusing: the frontend's health check will
report a `200` from whatever *other* service owns 8000, so the agent looks up when it is not running at all.

**Every chat route fails, but the app renders fine.**
The agent is unreachable. Check the connection panel on `/`, then `curl http://localhost:8000/health`. If
`localhost` resolves to IPv6 on your machine while Kestrel bound IPv4, set `MS_AGENT_URL=http://127.0.0.1:8000` in
`frontend/.env.local`.

**A tool runs but its UI never appears.**
The `useRenderTool` name and the C# tool name disagree. They must match exactly — `get_weather`, not `GetWeather`.
The C# side sets it explicitly: `AIFunctionFactory.Create(GetWeather, name: "get_weather")`.

**The agent replies in prose instead of calling a tool it clearly has.**
Expected, and the Components-as-Tools page is explicit about it: a tool arrives on every run, but a model with no
instruction about it will never call it. Name the tool in `instructions`, or name it in your prompt.

**State Rendering's list stays empty while the chat works.**
The model answered in prose instead of the requested JSON schema. The doc's own `catch (JsonException)` swallows
that silently, so no snapshot is emitted and nothing updates. Retry, or make the prompt more explicit.

**Threads mutations return 422, or the drawer is locked.**
No `CPK_INTELLIGENCE_API_KEY`. Confirm with:
```bash
curl -s http://localhost:3000/api/copilotkit-threads/info | grep -o '"mutations":[a-z]*'
```
This is the documented fallback, not a failure.

**`next build` fails on the slots page.**
See §9.5. If you removed the `@ts-expect-error` comments, that is why.

**`npm run dev` gets killed after a while.**
Turbopack's cache under `frontend/.next` grows unboundedly. Delete `frontend/.next` and restart.

---

## 11. Project structure

```
.
├── README.md                    ← this file
├── CLAUDE.md                    ← build instructions this repo was produced from
├── project-context.md           ← the doc-fidelity rules governing the code
├── .env.example                 ← every variable, with what each one does
├── package.json                 ← workspace convenience scripts
│
├── backend/                     ← ASP.NET Core AG-UI server (C#)
│   ├── AGUIServer.csproj        ← the two pinned Agent Framework packages
│   ├── Program.cs               ← agents, tools, CORS, health, endpoint mapping
│   ├── StateStreamingAgent.cs   ← State Rendering's DelegatingAIAgent, verbatim
│   ├── DocAgents/               ← Open Generative UI agent factories, verbatim from the Code tab
│   ├── DocGapStubs.cs           ← labelled stand-ins: ApiKeyResolver, AimockHeaderPolicy
│   ├── InterruptAgent.cs        ← Interrupt-based HITL: doc's ApprovalRequiredAIFunction + labelled agent
│   ├── GenerativeUIProductsAgent.cs ← harness-authored genui_agent + search_products
│   └── doc-samples/             ← published code that cannot be built, kept as artifacts
│       ├── AuthProgram.cs.txt   ← the JWT bearer Program.cs (needs a real IdP)
│       ├── SubagentsAgent.cs.txt← superseded API + missing helpers (§9.1)
│       ├── ByocJsonRenderAgent.cs.txt / ByocHashbrownAgent.cs.txt ← CS0117 on 1.27; DocAgents/*.Remedy.cs run instead (§9.10)
│       ├── InterruptProgram.cs.txt / HitlToolBasedProgram.cs.txt ← page fragments, verbatim
│       └── code-tab/            ← Code-tab bundles shown for reference only
│
├── doc-checks/
│   └── subagents/               ← standalone build of SubagentsAgent.cs.txt; fails on purpose (§9.1)
│
├── frontend/                    ← Next.js App Router
│   └── src/
│       ├── app/
│       │   ├── api/copilotkit/[[...slug]]/          ← the plain runtime
│       │   ├── api/copilotkit-threads/[[...slug]]/  ← the Intelligence runtime
│       │   ├── api/copilotkit-genui*/, copilotkit-components/ ← Components and surfaces runtimes
│       │   ├── api/copilotkit-mcp-apps/             ← MCP Apps runtime (Node BuiltInAgent)
│       │   ├── api/copilotkit-declarative-*/, copilotkit-ogui/ ← Code-tab runtimes, verbatim
│       │   ├── generative-ui/*/_demo-source/        ← Code-tab frontends, verbatim
│       │   ├── layout.tsx                            ← shared provider + chrome
│       │   ├── generative-ui/tool-based/bar-chart.tsx ← the one component the docs describe but never print
│       │   └── <one directory per doc page>/         ← page.tsx + demo-chat/
│       ├── components/
│       │   ├── providers.tsx        ← root CopilotKitProvider (+ auth headers)
│       │   ├── threads-provider.tsx ← nested provider for the Rich Threads routes
│       │   ├── route-header.tsx     ← status badge, doc link, documentation-gap banner
│       │   └── source-code.tsx      ← renders this repo's own source, region-sliced
│       └── lib/
│           ├── nav-config.ts        ← single source of truth: routes, status, doc gaps
│           ├── health.ts            ← agent reachability probe
│           └── doc-sync/            ← fetch + diff the live docs against the snapshot
│
└── doc-snapshot/                ← all 22 doc pages as markdown, plus manifest + changelog
    ├── manifest.json            ← sha256, byte count and sync date per page
    └── pages/
```

`frontend/src/lib/nav-config.ts` is the file to edit when a status changes. The nav, every route header, and the
status table above all read from it, so a route's state is described exactly once.

---

## 12. References

Grouped as the doc sidebar groups them. The original 22 pages were snapshotted on 2026-09-14. All 35 below were
re-checked against the rendered pages and Code tabs on 2026-11-05.

**Getting Started**
- [Introduction](https://docs.copilotkit.ai/ms-agent-dotnet)
- [Quickstart (bring your own agent)](https://docs.copilotkit.ai/ms-agent-dotnet/quickstart?agent=bring-your-own)

**Basics**
- [Prebuilt Components](https://docs.copilotkit.ai/ms-agent-dotnet/prebuilt-components)

**Custom Look and Feel**
- [Slots](https://docs.copilotkit.ai/ms-agent-dotnet/custom-look-and-feel/slots)
- [Headless UI](https://docs.copilotkit.ai/ms-agent-dotnet/custom-look-and-feel/headless-ui)
- [Programmatic Control](https://docs.copilotkit.ai/ms-agent-dotnet/programmatic-control)

**Generative UI**
- [Components as Tools](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/tool-based)
- [Tool Rendering](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/tool-rendering)
- [State Rendering](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/state-rendering)
- [A2UI · Dynamic Schema](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/a2ui/dynamic-schema)
- [A2UI · Fixed Schema](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/a2ui/fixed-schema)
- [JSON Render](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/json-render)
- [Hashbrown](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/hashbrown)
- [MCP Apps](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/mcp-apps)
- [Open Generative UI](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/open-generative-ui)

**Generative UI · Components and surfaces**
- [Components and surfaces](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components)
- [Surfaces](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components/surfaces)
- [Catalogs](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components/catalogs)
- [Standard catalog](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components/standard-catalog)
- [State and actions](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components/state-and-actions)
- [Theming](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components/theming)
- [Transports](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components/transports)
- [Markdown mode](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components/markdown-mode)
- [Adopt from A2UI](https://docs.copilotkit.ai/ms-agent-dotnet/generative-ui/components/from-a2ui)

**App Control**
- [Frontend Tools](https://docs.copilotkit.ai/ms-agent-dotnet/frontend-tools)

**Shared State**
- [Reading agent state](https://docs.copilotkit.ai/ms-agent-dotnet/shared-state/in-app-agent-read)
- [Writing agent state](https://docs.copilotkit.ai/ms-agent-dotnet/shared-state/in-app-agent-write)

**Human in the Loop**
- [Governed Action Approval UI](https://docs.copilotkit.ai/ms-agent-dotnet/human-in-the-loop/governed-actions)
- [Interrupt-based](https://docs.copilotkit.ai/ms-agent-dotnet/human-in-the-loop/interrupt-flow)
- [Tool-based](https://docs.copilotkit.ai/ms-agent-dotnet/human-in-the-loop/tool-based)

**Interactivity**
- [WebMCP](https://docs.copilotkit.ai/ms-agent-dotnet/webmcp)

**Multi-Agent**
- [Sub-Agents](https://docs.copilotkit.ai/ms-agent-dotnet/multi-agent/subagents)

**Microsoft Agent Framework**
- [Authentication](https://docs.copilotkit.ai/ms-agent-dotnet/auth)

**Rich Threads**
- [Threads Drawer](https://docs.copilotkit.ai/ms-agent-dotnet/prebuilt-components/copilot-threads-drawer)
- [Headless Threads](https://docs.copilotkit.ai/ms-agent-dotnet/headless-threads)
- [Thread & History Lifecycle](https://docs.copilotkit.ai/ms-agent-dotnet/threads-lifecycle)

**Backend**
- [Copilot Runtime](https://docs.copilotkit.ai/ms-agent-dotnet/copilot-runtime)
- [AG-UI](https://docs.copilotkit.ai/ms-agent-dotnet/ag-ui)
