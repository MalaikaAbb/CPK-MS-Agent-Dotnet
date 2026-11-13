/**
 * The nav, the route headers, and the README status table all read from here,
 * so a doc page and its implementation status are described exactly once.
 *
 * Route paths mirror the doc URLs under docs.copilotkit.ai/ms-agent-dotnet.
 * `offNav: true` marks pages that resolve fine but are absent from that
 * sidebar as of the last sync.
 */

/**
 * There is exactly one doc-sync date in this repo, and it is not here: it is
 * `syncedAt` in `doc-snapshot/manifest.json`, written every time the sync
 * button runs. `/doc-sync` is the single place that answers "how current are
 * these docs".
 */
export const DOCS_ROOT = "https://docs.copilotkit.ai/ms-agent-dotnet";

/**
 * Shared gap text for the eight Components and surfaces routes. Confirmed on
 * 2026-11-05 with one live run: a context entry holding a secret word was sent
 * to /genui_agent and the model replied that it had no context.
 */
const COMPONENTS_CONTEXT_GAP =
  "These pages need the agent to put the run's AG-UI context entries into its prompt: the catalog, the render_ui guide, target descriptions and surface state (on the markdown transport, the schema and fence guide). The pages give no .NET code for this. The .NET AG-UI server (Hosting.AGUI.AspNetCore 1.27.0-preview over AGUI.Server 1.0.0) never reads RunAgentInput.Context. Client tools reach the model, but context does not, so the model gets render_ui with no catalog or guide. Confirmed with a live run. No workaround is written. The pages' undefined pieces (Product, ProductRow, Cart, Hero, cartUI, Panel, Airport, Arrow, productSchema) and the search_products tool and genui_agent are harness-authored and labelled.";

const COMPONENTS_NOTE =
  "Doc code is verbatim. Not yet checked in a browser. Agent-rendered UI cannot work because context is dropped (see the gap below). The browser-only parts named here can still be checked.";

/**
 * Working  — implemented and exercisable against the local stack.
 * Partial  — implemented, but something outside this repo limits it.
 * Reference — intentionally not a live feature; doc/notes surface.
 * Broken   — implemented but currently failing.
 */
export type RouteStatus = "working" | "partial" | "reference" | "broken" | "not-started";

export interface RouteMeta {
  /** App route path. */
  path: string;
  /** Nav label. */
  title: string;
  /** Doc page this route tests, relative to docs.copilotkit.ai. */
  docPath: string;
  /** One-line description in our own words. */
  summary: string;
  status: RouteStatus;
  /** Shown in the route header when status is not plain "working". */
  statusNote?: string;
  /** Page exists in the docs but is absent from the current sidebar. */
  offNav?: boolean;
  /**
   * This route owns a live interactive surface, which lives at
   * `<path>/demo-chat` rather than on the page itself.
   */
  hasDemo?: boolean;
  /**
   * What this doc page fails to publish for the .NET backend.
   *
   * Set only where the page's `.NET` tab is stubbed, truncated, or replaced by
   * Python. The route is still scaffolded and still renders whatever code the
   * page *does* publish; this string is the reason it cannot be driven
   * end to end, surfaced in the route header and in the README table.
   * Nothing in this repo fills these gaps in with invented C#.
   */
  docGap?: string;
}

/** Where a route's interactive demo lives, if it has one. */
export function demoPath(route: RouteMeta): string | undefined {
  if (!route.hasDemo) return undefined;
  return route.path === "/" ? "/demo-chat" : `${route.path}/demo-chat`;
}

export interface NavGroup {
  title: string;
  routes: RouteMeta[];
}

export const NAV: NavGroup[] = [
  {
    title: "Getting Started",
    routes: [
      {
        path: "/",
        title: "Introduction",
        docPath: "/ms-agent-dotnet",
        summary:
          "What this harness covers and how the three processes fit together.",
        status: "reference",
        statusNote: "Landing page — orientation and live connection check.",
      },
      {
        path: "/quickstart",
        hasDemo: true,
        title: "Quickstart",
        docPath: "/ms-agent-dotnet/quickstart?agent=bring-your-own",
        summary:
          "The bring-your-own-agent path: an ASP.NET Core AG-UI server, a runtime route, and a chat.",
        status: "working",
      },
    ],
  },
  {
    title: "Basics",
    routes: [
      {
        path: "/prebuilt-components",
        hasDemo: true,
        title: "Prebuilt Components",
        docPath: "/ms-agent-dotnet/prebuilt-components",
        summary:
          "CopilotChat, CopilotPopup, and CopilotSidebar side by side, each driving the same agent.",
        status: "working",
        statusNote:
          "All four published samples are implemented: CopilotChat, CopilotSidebar, CopilotPopup and the slot-class customization. The customization tab has not yet been checked in a browser.",
      },
    ],
  },
  {
    title: "Custom Look and Feel",
    routes: [
      {
        path: "/custom-look-and-feel/slots",
        hasDemo: true,
        title: "Slots",
        docPath: "/ms-agent-dotnet/custom-look-and-feel/slots",
        summary:
          "Replacing chat sub-components at three levels: class strings, prop overrides, and whole components.",
        status: "working",
      },
      {
        path: "/custom-look-and-feel/headless-ui",
        hasDemo: true,
        title: "Headless UI",
        docPath: "/ms-agent-dotnet/custom-look-and-feel/headless-ui",
        summary:
          "A chat interface built from scratch on the headless hooks, with no CopilotKit chrome.",
        status: "working",
      },
      {
        path: "/programmatic-control",
        hasDemo: true,
        title: "Programmatic Control",
        docPath: "/ms-agent-dotnet/programmatic-control",
        summary:
          "Driving the agent with no chat UI: read state and messages, run it, and stop it mid-run.",
        status: "working",
      },
    ],
  },
  {
    title: "Generative UI",
    routes: [
      {
        path: "/generative-ui/tool-based",
        hasDemo: true,
        title: "Components as Tools",
        docPath: "/ms-agent-dotnet/generative-ui/tool-based",
        summary:
          "Registering a React component with useComponent so the agent can call it as a tool.",
        status: "working",
        statusNote:
          "The component the page names but never publishes is written here, minimally, from its description — the same approach the claude-sdk-python harness takes.",
        docGap:
          "The page's chart agent uses a bare .AsIChatClient() on gpt-6-luna, and every run with a frontend tool fails (RUN_ERROR / StreamingError). The backend is patched with the reasoning-effort \"none\" chain from the other gpt-6-luna pages (marked HARNESS FIX in Program.cs).",
      },
      {
        path: "/generative-ui/tool-rendering",
        hasDemo: true,
        title: "Tool Rendering",
        docPath: "/ms-agent-dotnet/generative-ui/tool-rendering",
        summary:
          "The agent's get_weather tool call rendered as a custom component, plus a catch-all renderer.",
        status: "working",
      },
      {
        path: "/generative-ui/state-rendering",
        hasDemo: true,
        title: "State Rendering",
        docPath: "/ms-agent-dotnet/generative-ui/state-rendering",
        summary:
          "Streaming agent state to the UI: a searches list emitted as DataContent by a DelegatingAIAgent.",
        status: "broken",
        statusNote:
          "Broken on the current package pin and left as published. Checked on 2026-11-05 with one live run: the wrapper yields the snapshot as DataContent, and the 1.27 AG-UI server emits no STATE_SNAPSHOT for it.",
        docGap:
          "The page's recipe emits state as DataContent. Hosting.AGUI.AspNetCore 1.27.0-preview (AGUI.Server 1.0.0) no longer turns DataContent into state events. The docs' own Code-tab demo for this page says so (since MAF 1.23) and uses AGUIStreamOptions.MapResultAsStateSnapshot instead, but the page's prose was not updated.",
      },
      {
        path: "/generative-ui/json-render",
        hasDemo: true,
        title: "JSON Render",
        docPath: "/ms-agent-dotnet/generative-ui/json-render",
        summary:
          "The agent replies with a { root, elements } JSON spec that @json-render/react draws through a Zod-cataloged component registry in the assistant-message slot.",
        status: "partial",
        statusNote:
          "The Code tab's frontend is mounted verbatim. The C# agent runs as a labelled remedy (DocAgents/ByocJsonRenderAgent.Remedy.cs, system prompt moved to ChatOptions.Instructions). A raw AG-UI run returned a valid { root, elements } spec; not yet checked in a browser.",
        docGap:
          "ByocJsonRenderAgent.cs sets ChatClientAgentOptions.Instructions, which does not exist in Microsoft.Agents.AI 1.27.0 (CS0117). The published file is kept unbuilt in backend/doc-samples. It also calls ApiKeyResolver and AimockHeaderPolicy, which no page publishes. The route and agent comments point to Python files (byoc_json_render_agent.py, agent_server.py).",
      },
      {
        path: "/generative-ui/hashbrown",
        hasDemo: true,
        title: "Hashbrown",
        docPath: "/ms-agent-dotnet/generative-ui/hashbrown",
        summary:
          "A Hashbrown UI kit renders the agent's streaming { ui: [...] } JSON progressively as metric cards, charts and deal cards.",
        status: "partial",
        statusNote:
          "The Code tab's frontend is mounted verbatim. The C# agent runs as a labelled remedy (DocAgents/ByocHashbrownAgent.Remedy.cs, system prompt moved to ChatOptions.Instructions). A raw AG-UI run returned a valid { ui: [...] } envelope; not yet checked in a browser.",
        docGap:
          "ByocHashbrownAgent.cs sets ChatClientAgentOptions.Instructions, which does not exist in Microsoft.Agents.AI 1.27.0 (CS0117). The published file is kept unbuilt in backend/doc-samples. It also calls the unpublished ApiKeyResolver and AimockHeaderPolicy. Its comments reference Python files.",
      },
      {
        path: "/generative-ui/mcp-apps",
        hasDemo: true,
        title: "MCP Apps",
        docPath: "/ms-agent-dotnet/generative-ui/mcp-apps",
        summary:
          "The runtime's mcpApps option fetches an MCP server's UI resource and renders it in the chat. The agent is a Node BuiltInAgent, not the .NET server.",
        status: "partial",
        statusNote:
          "Not yet checked in a browser. Needs an MCP Apps server on http://localhost:3108/mcp and OPENAI_API_KEY in frontend/.env.local. Runs on its own runtime at /api/copilotkit-mcp-apps; the doc's basePath and runtimeUrl were relocated to match.",
        docGap:
          "The page publishes no .NET code, only a TypeScript BuiltInAgent runtime. It never says how to serve an ext-apps example on :3108/mcp, and the ext-apps README does not document that port or path. The .use() variant calls BuiltInAgent without importing it. The prose says GPT-4o, but the code uses openai/gpt-5.4.",
      },
      {
        path: "/generative-ui/open-generative-ui",
        hasDemo: true,
        title: "Open Generative UI",
        docPath: "/ms-agent-dotnet/generative-ui/open-generative-ui",
        summary:
          "The runtime's openGenerativeUI flag lets the agent stream HTML/CSS/JS into a sandboxed iframe; the advanced demo adds host-side sandbox functions.",
        status: "partial",
        statusNote:
          "Both demos are mounted verbatim: minimal at /demo-chat, advanced at /demo-chat/advanced. Their agents compile. Not yet checked in a browser. The generateSandboxedUi tool reaches the model, but the design skill and the sandbox-function descriptions travel as AG-UI context, which the .NET server drops.",
        docGap:
          "Unpublished: the minimal demo's ./chat and ./design-skill, and the C# helpers ApiKeyResolver and AimockHeaderPolicy. Labelled stand-ins are written for all four (backend/DocGapStubs.cs). The Code tab maps the agents with MapAGUI, which no Hosting.AGUI release has; this repo uses MapAGUIServer.",
      },
      {
        path: "/generative-ui/a2ui/dynamic-schema",
        title: "A2UI · Dynamic Schema",
        docPath: "/ms-agent-dotnet/generative-ui/a2ui/dynamic-schema",
        summary:
          "A secondary LLM generates schema, data and layout; the runtime injects generate_a2ui.",
        status: "broken",
        docGap:
          "Published under the .NET slug with a Python-only backend: the sample imports agent_framework / agent_framework_ag_ui and configures the endpoint through add_agent_framework_fastapi_endpoint. No C# is shown anywhere on the page. The frontend catalog it passes as a2ui={{ catalog: myCatalog }} is also never defined.",
      },
      {
        path: "/generative-ui/a2ui/fixed-schema",
        title: "A2UI · Fixed Schema",
        docPath: "/ms-agent-dotnet/generative-ui/a2ui/fixed-schema",
        summary:
          "A schema authored once as JSON; the agent tool supplies only the data.",
        status: "broken",
        docGap:
          "Published under the .NET slug with a Python-only backend: the display_flight tool is written with agent_framework's @tool decorator and AgentFrameworkAgent. No C# is shown. The flight_schema.json the tool loads is never published either, so the schema half of the example is absent as well.",
      },
    ],
  },
  {
    title: "Components and surfaces",
    routes: [
      {
        path: "/generative-ui/components",
        hasDemo: true,
        title: "Components and surfaces",
        docPath: "/ms-agent-dotnet/generative-ui/components",
        summary:
          "The Try-it setup: standardUI on the provider, the runtime adds render_ui and its guide, and the agent answers with A2UI 1.0 components.",
        status: "broken",
        statusNote:
          "Runtime, provider and chat are the page's, mounted at /api/copilotkit-components. The page's TanStack BuiltInAgent is swapped for the MAF .NET components_agent (snippet's model and system prompt, no tools). render_ui reaches the model, but the guide and catalog travel as context, which the .NET server drops. Not yet checked in a browser.",
        docGap:
          "The page prints only a TanStack BuiltInAgent; no .NET agent is published, so a MAF agent with the snippet's prompt stands in (labelled). The page requires forwarding the run's systemPrompts (the render_ui guide); the .NET AG-UI server drops RunAgentInput.Context and the page gives no .NET code for it.",
      },
      {
        path: "/generative-ui/components/surfaces",
        hasDemo: true,
        title: "Surfaces",
        docPath: "/ms-agent-dotnet/generative-ui/components/surfaces",
        summary:
          "Generated UI in named page targets (GenerativeUISurface) as well as the chat, with fallbacks, component limits and per-item targets.",
        status: "broken",
        statusNote: COMPONENTS_NOTE + " Browser-only: the fallback product row.",
        docGap: COMPONENTS_CONTEXT_GAP,
      },
      {
        path: "/generative-ui/components/catalogs",
        hasDemo: true,
        title: "Catalogs",
        docPath: "/ms-agent-dotnet/generative-ui/components/catalogs",
        summary:
          "A typed catalog (createGenerativeUI) of the components the agent may render, combined with extends and exported as A2UI 1.0 JSON.",
        status: "broken",
        statusNote:
          COMPONENTS_NOTE +
          " Browser-only: the exportA2UICatalog tab. The Valibot sample is shown, not run, because valibot is not installed.",
        docGap: COMPONENTS_CONTEXT_GAP,
      },
      {
        path: "/generative-ui/components/standard-catalog",
        hasDemo: true,
        title: "Standard catalog",
        docPath: "/generative-ui/components/standard-catalog",
        summary:
          "The 69-component standardUI, as is and with extends, omit and overrides.",
        status: "broken",
        statusNote:
          COMPONENTS_NOTE +
          " This page lives outside the ms-agent-dotnet tree. maplibre-gl is not installed, so Map would fall back to a list.",
        docGap: COMPONENTS_CONTEXT_GAP,
      },
      {
        path: "/generative-ui/components/state-and-actions",
        hasDemo: true,
        title: "State and actions",
        docPath: "/ms-agent-dotnet/generative-ui/components/state-and-actions",
        summary:
          "App state bound into props, functions run on clicks, writable inputs, and clicks sent to the agent.",
        status: "broken",
        statusNote: COMPONENTS_NOTE + " Browser-only: the 'Who may call a function' declarations tab.",
        docGap: COMPONENTS_CONTEXT_GAP,
      },
      {
        path: "/generative-ui/components/theming",
        hasDemo: true,
        title: "Theming",
        docPath: "/ms-agent-dotnet/generative-ui/components/theming",
        summary:
          "CSS-variable themes for the standard components, per-mode dark values, and the dark class.",
        status: "broken",
        statusNote: COMPONENTS_NOTE + " A theme only shows once a surface renders.",
        docGap: COMPONENTS_CONTEXT_GAP,
      },
      {
        path: "/generative-ui/components/transports",
        hasDemo: true,
        title: "Transports",
        docPath: "/ms-agent-dotnet/generative-ui/components/transports",
        summary:
          "The render_ui tool transport, the markdown transport, the runtime's generativeUI flag, and agentIds scoping.",
        status: "broken",
        statusNote:
          COMPONENTS_NOTE +
          " The page's runtime registers only `default`, so only the excluded side of agentIds ['shop'] can be exercised.",
        docGap: COMPONENTS_CONTEXT_GAP,
      },
      {
        path: "/generative-ui/components/markdown-mode",
        hasDemo: true,
        title: "Markdown mode",
        docPath: "/ms-agent-dotnet/generative-ui/components/markdown-mode",
        summary:
          "a2ui code blocks inside the agent's reply, rendered as live surfaces while it streams.",
        status: "broken",
        statusNote:
          COMPONENTS_NOTE +
          " sendContext: false needs a backend that reads forwardedProps.copilotkit.ui; the page shows that in Python only.",
        docGap: COMPONENTS_CONTEXT_GAP,
      },
      {
        path: "/generative-ui/components/from-a2ui",
        hasDemo: true,
        title: "Adopt from A2UI",
        docPath: "/ms-agent-dotnet/generative-ui/components/from-a2ui",
        summary:
          "Migrating an A2UI v0.9 createCatalog app to an A2UI 1.0 createGenerativeUI catalog.",
        status: "broken",
        statusNote: COMPONENTS_NOTE,
        docGap: COMPONENTS_CONTEXT_GAP,
      },
    ],
  },
  {
    title: "App Control",
    routes: [
      {
        path: "/frontend-tools",
        hasDemo: true,
        title: "Frontend Tools",
        docPath: "/ms-agent-dotnet/frontend-tools",
        summary:
          "A tool the agent calls that executes in the browser, forwarded automatically over AG-UI.",
        status: "working",
      },
    ],
  },
  {
    title: "Shared State",
    routes: [
      {
        path: "/shared-state/in-app-agent-read",
        hasDemo: true,
        title: "Reading agent state",
        docPath: "/ms-agent-dotnet/shared-state/in-app-agent-read",
        summary:
          "Reading the agent's live state in your own UI through agent.state.",
        status: "partial",
        statusNote:
          "Backed by the Quickstart agent plus the page's AgentStateSnapshot class at /sample_agent (harness-authored wiring). Chat works and the frontend state code runs on the client, but the agent never sees or updates state: a run with state {language: 'spanish'} got the reply NO STATE and emitted no state events (2026-11-06). Not yet checked in a browser.",
        docGap:
          "The .NET tab publishes one four-line class — AgentStateSnapshot with a Language property — and nothing else. The update_language tool, the state schema, the predict-state configuration and the endpoint wiring all appear only in the Python tab, so there is no documented way to stand up the agent this page reads from. This repo maps the Quickstart agent with the class added (it is referenced by nothing).",
      },
      {
        path: "/shared-state/in-app-agent-write",
        hasDemo: true,
        title: "Writing agent state",
        docPath: "/ms-agent-dotnet/shared-state/in-app-agent-write",
        summary:
          "Writing back into agent state with agent.setState, and re-running with a hint message.",
        status: "partial",
        statusNote:
          "Backed by the same Quickstart agent plus AgentStateSnapshot at /sample_agent. setState mutates the client copy and the re-run reaches the agent, but nothing on the .NET side reads the written language. Not yet checked in a browser.",
        docGap:
          "Same stub as the read page: the .NET tab is the AgentStateSnapshot class alone, with the tool, state schema and endpoint wiring left in the Python tab only.",
      },
    ],
  },
  {
    title: "Human in the Loop",
    routes: [
      {
        path: "/human-in-the-loop/governed-actions",
        hasDemo: true,
        title: "Governed Actions",
        docPath: "/ms-agent-dotnet/human-in-the-loop/governed-actions",
        summary:
          "An approval gate in front of side-effecting agent actions, via useHumanInTheLoop.",
        status: "partial",
        statusNote:
          "The approval UI is published in full and implemented. Nothing drives it from the agent side.",
        docGap:
          "The page is frontend-only. It never shows an agent — in C# or any language — that proposes approve_governed_action, and the executeSideEffect the resume path calls is referenced but never defined.",
      },
      {
        path: "/human-in-the-loop/interrupt-flow",
        hasDemo: true,
        title: "Interrupt-based",
        docPath: "/ms-agent-dotnet/human-in-the-loop/interrupt-flow",
        summary:
          "A backend tool wrapped in ApprovalRequiredAIFunction ends the run with an AG-UI interrupt, which useInterrupt renders outside the chat.",
        status: "partial",
        statusNote:
          "A raw AG-UI request to /interrupt_agent returns RUN_FINISHED with an interrupt outcome (reason tool_call). Not yet checked in a browser. A hand-built resume request returned RUN_ERROR, so approve/resume is unverified.",
        docGap:
          "The .NET tab is a fragment. DeleteFile is never defined, AddChatClient(/* ... */) elides the chat client, and nothing connects the gated tool to an AIAgent or MapAGUIServer. This repo adds a one-line DeleteFile and a Quickstart-shaped agent (backend/InterruptAgent.cs), both labelled. The Requirements table names AGUI.Server (.NET) 0.0.6, not the Microsoft.Agents.AI.Hosting.AGUI.AspNetCore package the Quickstart installs.",
      },
      {
        path: "/human-in-the-loop/tool-based",
        hasDemo: true,
        title: "Tool-based",
        docPath: "/ms-agent-dotnet/human-in-the-loop/tool-based",
        summary:
          "useHumanInTheLoop registers humanApprovedCommand; the Quickstart agent calls it and the run waits for Approve or Deny.",
        status: "partial",
        statusNote:
          "Not yet checked in a browser. The page's Demo/Code tabs show the AG-UI dojo task planner, a different app; it is displayed for reference only.",
      },
    ],
  },
  {
    title: "Interactivity",
    routes: [
      {
        path: "/webmcp",
        hasDemo: true,
        title: "WebMCP",
        docPath: "/ms-agent-dotnet/webmcp",
        summary:
          "One frontend tool, searchOrders, published to document.modelContext for browser agents and also offered to the CopilotKit agent.",
        status: "partial",
        statusNote:
          "Not yet checked in a browser. The WebMCP path needs Chrome 149+ with the WebMCP flag or origin trial; the demo shows whether document.modelContext exists.",
        docGap:
          "searchOrders(status) is called in both snippets and defined in neither; this repo supplies a labelled stub returning four fixed orders. webmcp.ts imports @copilotkit/core, which the install step never adds.",
      },
    ],
  },
  {
    title: "Multi-Agent",
    routes: [
      {
        path: "/multi-agent/subagents",
        hasDemo: true,
        title: "Sub-Agents",
        docPath: "/ms-agent-dotnet/multi-agent/subagents",
        summary:
          "A supervisor that exposes three specialist sub-agents as tools, with a live delegation log.",
        status: "broken",
        statusNote:
          "The page's SubagentsAgent.cs cannot be built (two unpublished helpers, a superseded API, a non-existent AsLunaChatClient()). The demo mounts the Code tab's frontend against a harness stand-in at /subagents (the Quickstart agent): chat answers, but no sub-agents run and the delegation log stays empty.",
        docGap:
          "Two independent problems. First, ApiKeyResolver and AimockHeaderPolicy are called but defined nowhere on the page or in its Code tab. It also calls .AsLunaChatClient() on both ChatClients; no such extension exists or is defined on the page. Second, the class overrides RunAsync/RunStreamingAsync over AgentRunResponse, AgentRunResponseUpdate and AgentThread, none of which exist in Microsoft.Agents.AI 1.27.0 / Hosting.AGUI.AspNetCore 1.27.0-preview.261030.1 (this repo's pin). It also emits the log as DataContent, which that package no longer turns into state. The Code tab's Program.cs maps it with MapAGUI, which does not exist. On the frontend, delegation-log.tsx is now complete, but the demo page.tsx imports four files the tab does not ship.",
      },
    ],
  },
  {
    title: "Microsoft Agent Framework",
    routes: [
      {
        path: "/auth",
        hasDemo: true,
        title: "Authentication",
        docPath: "/ms-agent-dotnet/auth",
        summary:
          "Forwarding a bearer token from the provider to the AG-UI server, and validating it there.",
        status: "partial",
        statusNote:
          "The frontend header forwarding is implemented. The documented .NET validation needs an identity provider this harness does not have.",
        docGap:
          "The .NET tab documents only AddJwtBearer against a live authority and audience, so exercising it needs a real IdP such as Entra ID. The shared-secret middleware that makes this testable on localhost is published only in the page's Python tab.",
      },
    ],
  },
  {
    title: "Rich Threads",
    routes: [
      {
        path: "/threads/drawer",
        hasDemo: true,
        title: "Threads Drawer",
        docPath: "/ms-agent-dotnet/prebuilt-components/copilot-threads-drawer",
        summary:
          "The drop-in conversation sidebar: zero props, customized, hosted by a sidebar, with your own New button, controlled, and with its New controls hidden by CSS.",
        status: "partial",
        statusNote:
          "Runs on the Intelligence-backed runtime at /api/copilotkit-threads. Locked until CPK_INTELLIGENCE_API_KEY is set.",
      },
      {
        path: "/threads/headless",
        hasDemo: true,
        title: "Headless Threads",
        docPath: "/ms-agent-dotnet/headless-threads",
        summary:
          "A thread sidebar built from scratch on useThreads: rename, archive, delete, switching, and pagination.",
        status: "partial",
        statusNote:
          "Same Intelligence-backed runtime. Mutations need CPK_INTELLIGENCE_API_KEY.",
      },
      {
        path: "/threads/lifecycle",
        hasDemo: true,
        title: "Thread & History Lifecycle",
        docPath: "/ms-agent-dotnet/threads-lifecycle",
        summary:
          "Mint, replay, switch: how a threadId comes to exist and what makes history hydrate into the view.",
        status: "partial",
        statusNote:
          "Same Intelligence-backed runtime. Server-side replay needs CPK_INTELLIGENCE_API_KEY.",
      },
    ],
  },
  {
    title: "Backend",
    routes: [
      {
        path: "/copilot-runtime",
        hasDemo: true,
        title: "Copilot Runtime",
        docPath: "/ms-agent-dotnet/copilot-runtime",
        summary:
          "This repo's live runtime config, agent routing, and the direct-connection tradeoff.",
        status: "working",
      },
      {
        path: "/ag-ui",
        hasDemo: true,
        title: "AG-UI",
        docPath: "/ms-agent-dotnet/ag-ui",
        summary:
          "A live capture of the raw AG-UI event stream flowing between the runtime and this page.",
        status: "working",
      },
    ],
  },
  {
    title: "Doc Sync",
    routes: [
      {
        path: "/doc-sync",
        title: "Doc drift",
        docPath: "/ms-agent-dotnet",
        summary:
          "Re-fetches the markdown behind every tracked doc page and diffs it against the stored snapshot, flagging changes inside code blocks.",
        status: "reference",
      },
    ],
  },
];

export const ALL_ROUTES: RouteMeta[] = NAV.flatMap((g) => g.routes);

export function findRoute(path: string): RouteMeta | undefined {
  return ALL_ROUTES.find((r) => r.path === path);
}

export function docUrl(route: RouteMeta): string {
  return `https://docs.copilotkit.ai${route.docPath}`;
}

export const STATUS_LABEL: Record<RouteStatus, string> = {
  working: "Working",
  partial: "Partial",
  reference: "Reference",
  broken: "Broken",
  "not-started": "Not started",
};
