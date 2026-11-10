# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-11-09

### 07:56 UTC — 19 pages, highest severity high

**High — Standard catalog**

`/generative-ui/components/standard-catalog` · route `/generative-ui/components/standard-catalog` · under “What is this?” · in a `tsx` block

93 code lines, 24 prose lines changed. The number of fenced code blocks changed.

````diff
- ```tsx
- import { standardUI } from "@copilotkit/react-core/v2/generative-ui";
+ <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tab value="React">
+ ```tsx
+ import { standardUI } from "@copilotkit/react-core/v2/generative-ui";
- <CopilotKitProvider runtimeUrl="/api/copilotkit" generativeUI={{ ui: standardUI }}>
- ```
````

**High — Authentication**

`/ms-agent-dotnet/auth` · route `/auth` · under “Backend Setup” · in a `csharp` block

12 code lines changed.

````diff
+ #pragma warning disable OPENAI001
+ using Microsoft.Extensions.AI;
- var agent = openAI.GetChatClient("gpt-5.4-mini")
+ var agent = openAI.GetChatClient("gpt-6-luna")
+ .AsIChatClient().AsBuilder()
+ .ConfigureOptions(options => options.RawRepresentationFactory = _ =>
+ new OpenAI.Chat.ChatCompletionOptions { ReasoningEffortLevel = new("none") })
+ .Build()
````

**High — Frontend Tools**

`/ms-agent-dotnet/frontend-tools` · route `/frontend-tools` · under “Create your AG-UI server” · in a `csharp` block

12 code lines changed.

````diff
+ #pragma warning disable OPENAI001
+ using Microsoft.Extensions.AI;
- .GetChatClient("gpt-5.4-mini")
+ .GetChatClient("gpt-6-luna")
+ .AsIChatClient().AsBuilder()
+ .ConfigureOptions(options => options.RawRepresentationFactory = _ =>
+ new OpenAI.Chat.ChatCompletionOptions { ReasoningEffortLevel = new("none") })
+ .Build()
````

**High — Catalogs**

`/ms-agent-dotnet/generative-ui/components/catalogs` · route `/generative-ui/components/catalogs` · under “What is this?”

85 code lines, 20 prose lines changed. The number of fenced code blocks changed.

````diff
- A **catalog** lists the components that the agent can use. For each component it holds the React component, a description, and a schema of its props. The agent gets the descriptions and the schemas. Your app gets typed props.
+ A **catalog** lists the components that the agent can use. For each component it holds the component, a description, and a schema of its props. The agent gets the descriptions and the schemas. Your app gets typed props.
- ```tsx title="app/catalog.tsx"
- import { z } from "zod";
- import {
- createGenerativeUI,
- type GenerativeUIComponentProps,
- } from "@copilotkit/react-core/v2/generative-ui";
````

**High — Adopt from A2UI**

`/ms-agent-dotnet/generative-ui/components/from-a2ui` · route `/generative-ui/components/from-a2ui` · under “What is this?”

61 code lines, 21 prose lines changed. The number of fenced code blocks changed.

````diff
- The `a2ui` provider option and `@copilotkit/a2ui-renderer` render A2UI v0.9: you build a catalog with `createCatalog`, and the agent streams a fixed or a generated schema into it. Components and surfaces is the A2UI 1.0 engine. The idea is the same: the agent writes operations, and the browser renders your React components. The engine adds typed catalogs, the [standard catalog](/generative-ui/components/standard-catalog), areas of the page as targets, two transports, dynamic values that compute in the browser, and functions the agent can call. This page maps one to the other.
+ The `a2ui` provider option and `@copilotkit/a2ui-renderer` render A2UI v0.9: you build a catalog with `createCatalog`, and the agent streams a fixed or a generated schema into it. Components and surfaces is the A2UI 1.0 engine. The idea is the same: the agent writes operations, and the browser renders your components. The engine adds typed catalogs, the [standard catalog](/generative-ui/components/standard-catalog), areas of the page as targets, two transports, dynamic values that compute in the browser, and functions the agent can call. This page maps one to the other.
- ```tsx title="Before"
- <CopilotKit runtimeUrl="/api/copilotkit" a2ui={{ catalog: myCatalog }}>
- ```
+ <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tab value="React">
+ ```tsx title="Before"
````

**High — Markdown mode**

`/ms-agent-dotnet/generative-ui/components/markdown-mode` · route `/generative-ui/components/markdown-mode` · under “What is this?” · in a `markdown` block

45 code lines, 17 prose lines changed. The number of fenced code blocks changed.

````diff
- {"version":"v1.0","createSurface":{"surfaceId":"plan-estimator","dataModel":{"seats":10,"price":"$290 / month"},"components":[{"id":"root","component":"Card","children":["seats","price"]}]}}
- {"version":"v1.0","updateComponents":{"surfaceId":"plan-estimator","components":[{"id":"seats","component":"Slider","label":"Seats","min":1,"max":50,"value":{"@path":"/seats"}},{"id":"price","component":"Text","text":{"@path":"/price"}}]}}
+ {"version":"1.0","createSurface":{"surfaceId":"plan-estimator","dataModel":{"seats":10,"price":"$290 / month"},"components":[{"id":"root","component":"Card","children":["seats","price"]}]}}
+ {"version":"1.0","updateComponents":{"surfaceId":"plan-estimator","components":[{"id":"seats","component":"Slider","label":"Seats","min":1,"max":50,"value":{"@path":"/seats"}},{"id":"price","component":"Text","text":{"@path":"/price"}}]}}
- ```tsx title="app/providers.tsx"
- import { CopilotKitProvider } from "@copilotkit/react-core/v2";
- import { standardUI } from "@copilotkit/react-core/v2/generative-ui";
+ <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
````

**High — State and actions**

`/ms-agent-dotnet/generative-ui/components/state-and-actions` · route `/generative-ui/components/state-and-actions` · under “Show live app state” · in a `tsx` block

117 code lines, 18 prose lines changed. The number of fenced code blocks changed.

````diff
- ```tsx title="app/catalog.tsx"
- const cartSchema = z.object({
- items: z.array(z.object({ productId: z.string(), quantity: z.number() })),
- });
+ <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tab value="React">
+ ```tsx title="app/catalog.tsx"
+ const cartSchema = z.object({
````

**High — Surfaces**

`/ms-agent-dotnet/generative-ui/components/surfaces` · route `/generative-ui/components/surfaces` · under “What is this?”

102 code lines, 31 prose lines changed. The number of fenced code blocks changed.

````diff
- - **A page target.** An area of your page that you mark with `GenerativeUISurface`. The agent sees it only while it is on screen.
+ - **A page target.** An area of your page that you mark with `GenerativeUISurface`, or `<copilot-generative-ui-surface>` in Angular. The agent sees it only while it is on screen.
- Wrap an area of your page in `GenerativeUISurface`. Give it an id, and tell the agent what the area is for:
+ Wrap an area of your page in a target. Give it an id, and tell the agent what the area is for:
- ```tsx title="app/page.tsx"
- import { GenerativeUISurface } from "@copilotkit/react-core/v2/generative-ui";
- import { shopUI } from "./catalog";
+ <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
````

**High — Theming**

`/ms-agent-dotnet/generative-ui/components/theming` · route `/generative-ui/components/theming` · under “What is this?” · in a `tsx` block

82 code lines, 21 prose lines changed. The number of fenced code blocks changed.

````diff
- ```tsx
- <CopilotKitProvider
- runtimeUrl="/api/copilotkit"
- generativeUI={{
- ui: standardUI,
- theme: {
- "--a2ui-color-accent": "#d97706",
- "--a2ui-font-family": "Inter, sans-serif",
````

**High — Transports**

`/ms-agent-dotnet/generative-ui/components/transports` · route `/generative-ui/components/transports` · under “Tool transport” · in a `tsx` block

33 code lines, 18 prose lines changed. The number of fenced code blocks changed.

````diff
- ```tsx
- <CopilotKitProvider runtimeUrl="/api/copilotkit" generativeUI={{ ui: standardUI }}>
- ```
+ <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tab value="React">
+ ```tsx
+ <CopilotKitProvider runtimeUrl="/api/copilotkit" generativeUI={{ ui: standardUI }}>
+ ```
````

**High — MCP Apps**

`/ms-agent-dotnet/generative-ui/mcp-apps` · route `/generative-ui/mcp-apps` · under “Configure your agent” · in a `typescript` block

4 code lines, 2 prose lines changed.

````diff
- model: "openai/gpt-5.4",
+ model: "openai/gpt-6-luna",
- model: "openai/gpt-5.4",
+ model: "openai/gpt-6-luna",
- The example is configured to use OpenAI's GPT-4o by default, but you can modify the BuiltInAgent to use any language model supported by CopilotKit.
+ The example is configured to use OpenAI's GPT-6 Luna by default, but you can modify the BuiltInAgent to use any language model supported by CopilotKit.
````

**High — State Rendering**

`/ms-agent-dotnet/generative-ui/state-rendering` · route `/generative-ui/state-rendering` · under “Stream state from your agent” · in a `csharp` block

11 code lines changed.

````diff
+ #pragma warning disable OPENAI001
- .GetChatClient("gpt-5.4-mini")
+ .GetChatClient("gpt-6-luna")
+ .AsIChatClient().AsBuilder()
+ .ConfigureOptions(options => options.RawRepresentationFactory = _ =>
+ new OpenAI.Chat.ChatCompletionOptions { ReasoningEffortLevel = new("none") })
+ .Build()
- model=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME", "gpt-4o-mini"),
````

**High — Components as Tools**

`/ms-agent-dotnet/generative-ui/tool-based` · route `/generative-ui/tool-based` · under “Nothing to wire on the agent” · in a `csharp` block

2 code lines changed.

````diff
- _openAiClient.GetChatClient("gpt-4o-mini").AsIChatClient(),
+ _openAiClient.GetChatClient("gpt-6-luna").AsIChatClient(),
````

**High — Tool Rendering**

`/ms-agent-dotnet/generative-ui/tool-rendering` · route `/generative-ui/tool-rendering` · under “Give your agent a tool to call” · in a `csharp` block

11 code lines changed.

````diff
+ #pragma warning disable OPENAI001
- .GetChatClient("gpt-5.4-mini")
+ .GetChatClient("gpt-6-luna")
+ .AsIChatClient().AsBuilder()
+ .ConfigureOptions(options => options.RawRepresentationFactory = _ =>
+ new OpenAI.Chat.ChatCompletionOptions { ReasoningEffortLevel = new("none") })
+ .Build()
- model=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME", "gpt-4o-mini"),
````

**High — Tool-based**

`/ms-agent-dotnet/human-in-the-loop/tool-based` · route `/human-in-the-loop/tool-based` · under “Receiving frontend tools in your AG-UI server” · in a `csharp` block

12 code lines changed.

````diff
+ #pragma warning disable OPENAI001
+ using Microsoft.Extensions.AI;
- .GetChatClient("gpt-5.4-mini")
+ .GetChatClient("gpt-6-luna")
+ .AsIChatClient().AsBuilder()
+ .ConfigureOptions(options => options.RawRepresentationFactory = _ =>
+ new OpenAI.Chat.ChatCompletionOptions { ReasoningEffortLevel = new("none") })
+ .Build()
````

**High — Sub-Agents**

`/ms-agent-dotnet/multi-agent/subagents` · route `/multi-agent/subagents` · under “Setting up sub-agents” · in a `csharp` block

6 code lines changed.

````diff
- private const string SubAgentModel = "gpt-5-mini";
+ private const string SubAgentModel = "gpt-6-luna";
- private const string SubAgentModel = "gpt-5-mini";
+ private const string SubAgentModel = "gpt-6-luna";
- var chatClient = _openAiClient.GetChatClient("gpt-5-mini").AsIChatClient();
+ var chatClient = _openAiClient.GetChatClient("gpt-6-luna").AsLunaChatClient();
````

**High — Quickstart**

`/ms-agent-dotnet/quickstart` · route `/quickstart` · under “Configure your environment” · in a `bash` block

20 code lines changed.

````diff
- OPENAI_CHAT_MODEL_ID=gpt-5.4-mini
+ OPENAI_CHAT_MODEL_ID=gpt-6-luna
- AZURE_OPENAI_CHAT_DEPLOYMENT_NAME=gpt-5.4-mini
+ AZURE_OPENAI_CHAT_DEPLOYMENT_NAME=gpt-6-luna
+ #pragma warning disable OPENAI001
+ using Microsoft.Extensions.AI;
- var agent = openAI.GetChatClient("gpt-5.4-mini").AsAIAgent(
+ var agent = openAI.GetChatClient("gpt-6-luna")
````

**High — Reading agent state**

`/ms-agent-dotnet/shared-state/in-app-agent-read` · route `/shared-state/in-app-agent-read` · under “Define the Agent State” · in a `python` block

4 code lines changed.

````diff
- model=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME", "gpt-4o-mini"),
+ model=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME", "gpt-6-luna"),
- model=os.getenv("OPENAI_CHAT_MODEL_ID", "gpt-4o-mini"),
+ model=os.getenv("OPENAI_CHAT_MODEL_ID", "gpt-6-luna"),
````

**High — Writing agent state**

`/ms-agent-dotnet/shared-state/in-app-agent-write` · route `/shared-state/in-app-agent-write` · under “Define the Agent State” · in a `python` block

4 code lines changed.

````diff
- model=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME", "gpt-4o-mini"),
+ model=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME", "gpt-6-luna"),
- model=os.getenv("OPENAI_CHAT_MODEL_ID", "gpt-4o-mini"),
+ model=os.getenv("OPENAI_CHAT_MODEL_ID", "gpt-6-luna"),
````

---

## 2026-11-05

### 09:50 UTC — 27 pages, highest severity high

**High — Introduction**

`/ms-agent-dotnet` · routes `/`, `/doc-sync` · under “Introduction”

45 prose lines changed. The number of fenced code blocks changed.

````diff
- frameworkIcon={<MicrosoftIcon className="h-10 w-10 text-primary" width={40} height={40} />}
+ frameworkIcon={<MicrosoftIcon className="h-12 w-12" />}
- subheader="Give your Microsoft Agent Framework agents real user-interactivity using CopilotKit and AG-UI. Build rich, interactive, agent-powered applications."
- bannerVideo="https://cdn.copilotkit.ai/docs/copilotkit/videos/coagents/overview.mp4"
+ subheader="The Microsoft Agent Framework runs your agents. CopilotKit gives them a surface your users can see, interrupt and steer."
- featuresLink="https://feature-viewer.copilotkit.ai/microsoft-agent-framework-dotnet/feature/agentic_chat"
+ lede="The Microsoft Agent Framework gives you the agent: tools, threads and the host that runs them, in Python or .NET. What it does not give you is the surface. Somewhere for the conversation to happen, a way to show the run while it is running, and a moment for a person to step in. Each capability below builds on something your agent already does."
- description: "Render your agent's state, progress, outputs, and tool calls with custom UI components in real-time. Bridges the gap between AI agents and user interfaces.",
````

**High — Copilot Runtime**

`/ms-agent-dotnet/copilot-runtime` · route `/copilot-runtime` · under “Copilot Runtime”

15 code lines, 2 headings, 66 prose lines changed. The number of fenced code blocks changed.

````diff
+ 
+ ## Runtime languages
+ 
+ **TypeScript is the default and most fully featured runtime. It is the only runtime that can run without CopilotKit Intelligence.** Use it for an open-source setup, or connect it to Intelligence when you need its services.
+ 
+ Python, Go, Ruby, and C#/.NET runtimes require an Intelligence project and server-side API key. They work with both [cloud-hosted](/ms-agent-dotnet/intelligence/managed-intelligence-platform) and [self-hosted](/ms-agent-dotnet/intelligence/self-hosting) Intelligence; they do not provide an in-memory or SQLite runner.
+ 
+ | Language | Host | Without Intelligence |
````

**High — Slots**

`/ms-agent-dotnet/custom-look-and-feel/slots` · route `/custom-look-and-feel/slots` · under “Reshaping the Message List”

41 code lines, 3 headings, 26 prose lines changed. The number of fenced code blocks changed.

````diff
+ ## Reshaping the Message List
+ 
+ Slots change how each message renders. To change _which_ messages render — hide some, replace them, reorder them — pass `transformMessages` to the message view. It receives the whole list and returns the list to render.
+ 
+ ```tsx title="page.tsx"
+ import { useCallback } from "react";
+ import { CopilotChat, type Message } from "@copilotkit/react-core/v2";
+ 
````

**High — Components as Tools**

`/ms-agent-dotnet/generative-ui/tool-based` · route `/generative-ui/tool-based` · under “Tell the model when to call it”

5 code lines, 1 heading, 27 prose lines changed. The number of fenced code blocks changed.

````diff
- discover it, and Zod validates the LLM's arguments before they reach your
- component.
+ discover it, and the schema becomes that tool's parameter definition — it is
+ what tells the model which arguments to send.
+ <Callout type="warn">
+ `parameters` is optional, but leaving it out advertises the tool with an
+ empty parameter schema (`{ "type": "object", "properties": {} }`). The model
+ then has nothing to fill in, so it calls the tool with no arguments and your
````

**High — Sub-Agents**

`/ms-agent-dotnet/multi-agent/subagents` · route `/multi-agent/subagents` · under “Setting up sub-agents” · in a `csharp` block

6 code lines, 9 prose lines changed.

````diff
- private const string SubAgentModel = "gpt-4o-mini";
+ private const string SubAgentModel = "gpt-5-mini";
- private const string SubAgentModel = "gpt-4o-mini";
+ private const string SubAgentModel = "gpt-5-mini";
- var chatClient = _openAiClient.GetChatClient("gpt-4o-mini").AsIChatClient();
+ var chatClient = _openAiClient.GetChatClient("gpt-5-mini").AsIChatClient();
+ 
+ <Callout type="warn">
````

**High — Threads Drawer**

`/ms-agent-dotnet/prebuilt-components/copilot-threads-drawer` · route `/threads/drawer` · under “When should I use this?”

34 code lines, 4 headings, 63 prose lines changed. The number of fenced code blocks changed.

````diff
- server-side). <SignupLink surface="docs_drawer">Get a free developer account</SignupLink> to set that up.
+ server-side). <SignupLink surface="docs_drawer">Start cloud-hosted setup</SignupLink> to create or select a project.
- [scope Rich Threads to the signed-in user](/ms-agent-dotnet/threads-lifecycle#scope-rich-threads-to-the-signed-in-user).
+ [scope AG-UI Streams to the signed-in user](/ms-agent-dotnet/threads-lifecycle#scope-rich-threads-to-the-signed-in-user).
- body="Get persistent threads and realtime sync on the free Developer tier."
+ body="Connect a cloud-hosted project to get persistent threads and realtime sync."
+ <Callout type="warn">
+ **The Drawer ships only in `@copilotkit/react-core/v2`.** There is no v1
````

**High — Quickstart**

`/ms-agent-dotnet/quickstart` · route `/quickstart` · under “Quickstart”

26 code lines, 3 headings, 24 prose lines changed. The number of fenced code blocks changed.

````diff
- <IntelligenceOnboardingPrompt
- feature="learning"
- surface="docs_microsoft_agent_framework_quickstart"
- />
+ ## Start with your coding agent
+ Use this prompt to connect your Microsoft Agent Framework agent to CopilotKit and verify a working conversation. Your coding agent will follow this guide in your project, or you can work through the manual steps below.
+ 
+ Ask your coding agent to follow the setup steps on this page for your selected framework and frontend.
````

**Medium — Headless UI**

`/ms-agent-dotnet/custom-look-and-feel/headless-ui` · route `/custom-look-and-feel/headless-ui` · under “Fully Headless UI”

2 headings changed.

````diff
- # Fully Headless UI
+ # Headless UI
````

**Medium — Thread & History Lifecycle**

`/ms-agent-dotnet/threads-lifecycle` · route `/threads/lifecycle` · under “The lifecycle at a glance”

3 headings, 17 prose lines changed.

````diff
- 2. **Run.** Messages and tool calls stream under that `threadId`. If a server-side store is configured (CopilotKit Intelligence, or a persisting `AgentRunner`), they are persisted as they happen so the thread can be replayed later. A runtime with no persistence layer keeps nothing server-side. See [Threads & Persistence Architecture](/ms-agent-dotnet/intelligence/threads-explained) for the full server-side model.
+ 2. **Run.** Messages and tool calls stream under that `threadId`. If a server-side store is configured (CopilotKit Intelligence, or a persisting `AgentRunner`), they are persisted as they happen so the thread can be replayed later. A runtime with no persistence layer keeps nothing server-side. See [AG-UI Streams & Framework Threads](/ms-agent-dotnet/intelligence/threads-explained) for the full server-side model.
- ## Scope Rich Threads to the signed-in user
+ <span id="scope-rich-threads-to-the-signed-in-user" />
+ ## Scope AG-UI Streams to the signed-in user
+ 
- [Connect your runtime to Intelligence](/ms-agent-dotnet/intelligence/connect-your-runtime) covers the
+ [Connect your runtime to Intelligence](/ms-agent-dotnet/intelligence/quickstart) covers the
````

**Low — AG-UI**

`/ms-agent-dotnet/ag-ui` · route `/ag-ui` · under “How agents slot into the runtime”

3 prose lines changed.

````diff
+ To write the custom implementation yourself, and keep its own fields through
+ the clone in step 2, see [Write your own AG-UI agent](/ms-agent-dotnet/backend/custom-ag-ui-agent).
+ 
````

**Low — Headless Threads**

`/ms-agent-dotnet/headless-threads` · route `/threads/headless` · under “Headless Threads”

28 prose lines changed.

````diff
+ Intelligence’s AG-UI streams power the history and delivery behind this custom UI. Use `useThreads` to list and manage conversations, and pass their `threadId` to your chat.
+ 
- CopilotKit Rich Threads enable persistent, resumable multi-turn conversations. The `useThreads` hook lists, creates, renames, archives, and deletes CopilotKit Intelligence threads with realtime synchronization via WebSocket. Threads work with any agent framework — CopilotKit Intelligence stores conversation history server-side, so users can close their browser and pick up where they left off. It does not list or mutate native LangGraph, ADK, or other framework stores unless your backend explicitly bridges those systems. Thread metadata updates (renames, archives, new threads) appear on connected clients without polling.
+ The `useThreads` hook lists, creates, renames, archives, and deletes CopilotKit Intelligence threads with realtime synchronization via WebSocket. Threads work with any agent framework — CopilotKit Intelligence stores conversation history server-side, so users can close their browser and pick up where they left off. It does not list or mutate native LangGraph, ADK, or other framework stores unless your backend explicitly bridges those systems. Thread metadata updates (renames, archives, new threads) appear on connected clients without polling.
- [scope Rich Threads to the signed-in user](/ms-agent-dotnet/threads-lifecycle#scope-rich-threads-to-the-signed-in-user)
+ [scope AG-UI Streams to the signed-in user](/ms-agent-dotnet/threads-lifecycle#scope-rich-threads-to-the-signed-in-user)
- <Callout type="info" title="Migrating existing history?">
- Threads capture new CopilotKit conversations once your app is connected to
````

**Low — Programmatic Control**

`/ms-agent-dotnet/programmatic-control` · route `/programmatic-control` · under “Overview”

4 prose lines changed.

````diff
- title="Fully Headless UI"
+ title="Headless UI"
- - **`agent.runAgent()`** — Low-level method on the agent instance. Sends the request to the runtime but does **not** execute frontend tools or handle follow-ups. Use this only when you need direct control over the agent execution (e.g., resuming from an interrupt with `forwardedProps`).
+ - **`agent.runAgent()`** — Low-level method on the agent instance. Sends the request to the runtime but does **not** execute frontend tools or handle follow-ups. Use this only when you need direct control over the agent execution. To resume from an interrupt, use `copilotkit.runAgent({ agent, resume })` for standard AG-UI interrupts, or `copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })` for legacy `on_interrupt` custom events, so that the subscriber lifecycle still wraps the resumed run.
````

**Info — Standard catalog**

`/generative-ui/components/standard-catalog` · route `/generative-ui/components/standard-catalog`

Now tracked for the first time.

**Info — Catalogs**

`/ms-agent-dotnet/generative-ui/components/catalogs` · route `/generative-ui/components/catalogs`

Now tracked for the first time.

**Info — Adopt from A2UI**

`/ms-agent-dotnet/generative-ui/components/from-a2ui` · route `/generative-ui/components/from-a2ui`

Now tracked for the first time.

**Info — Markdown mode**

`/ms-agent-dotnet/generative-ui/components/markdown-mode` · route `/generative-ui/components/markdown-mode`

Now tracked for the first time.

**Info — State and actions**

`/ms-agent-dotnet/generative-ui/components/state-and-actions` · route `/generative-ui/components/state-and-actions`

Now tracked for the first time.

**Info — Surfaces**

`/ms-agent-dotnet/generative-ui/components/surfaces` · route `/generative-ui/components/surfaces`

Now tracked for the first time.

**Info — Theming**

`/ms-agent-dotnet/generative-ui/components/theming` · route `/generative-ui/components/theming`

Now tracked for the first time.

**Info — Transports**

`/ms-agent-dotnet/generative-ui/components/transports` · route `/generative-ui/components/transports`

Now tracked for the first time.

**Info — Hashbrown**

`/ms-agent-dotnet/generative-ui/hashbrown` · route `/generative-ui/hashbrown`

Now tracked for the first time.

**Info — JSON Render**

`/ms-agent-dotnet/generative-ui/json-render` · route `/generative-ui/json-render`

Now tracked for the first time.

**Info — MCP Apps**

`/ms-agent-dotnet/generative-ui/mcp-apps` · route `/generative-ui/mcp-apps`

Now tracked for the first time.

**Info — Open Generative UI**

`/ms-agent-dotnet/generative-ui/open-generative-ui` · route `/generative-ui/open-generative-ui`

Now tracked for the first time.

**Info — Interrupt-based**

`/ms-agent-dotnet/human-in-the-loop/interrupt-flow` · route `/human-in-the-loop/interrupt-flow`

Now tracked for the first time.

**Info — Tool-based**

`/ms-agent-dotnet/human-in-the-loop/tool-based` · route `/human-in-the-loop/tool-based`

Now tracked for the first time.

**Info — WebMCP**

`/ms-agent-dotnet/webmcp` · route `/webmcp`

Now tracked for the first time.

---

---

## 2026-09-14

All 22 tracked pages under `https://docs.copilotkit.ai/ms-agent-dotnet` fetched
and stored. No page 404'd; every response was `200 text/markdown`.

Notable against the sibling `ms-agent-framework-py` snapshot taken 2026-08-26 —
these pages are byte-identical apart from the framework slug, so their
implementations transfer directly:

- `custom-look-and-feel/slots`
- `custom-look-and-feel/headless-ui`
- `programmatic-control`
- `copilot-runtime`
- `ag-ui`
- `prebuilt-components/copilot-threads-drawer`

And these differ only in detail:

- `headless-threads` — renames the project key to `CPK_INTELLIGENCE_API_KEY`
  (Python pages call it `INTELLIGENCE_API_KEY`), moves the Intelligence doc
  links from `/premium/` to `/intelligence/`, and adds a new section on driving
  one agent per thread with `useAgent({ agentId, runtimeAgentId, threadId })`.
- `threads-lifecycle` — the same key rename and link move, nothing else.
- `custom-look-and-feel/headless-ui` — one extra sentence pointing
  approval-gated backend tools at `useInterrupt`.

The .NET-specific pages and their gaps are catalogued in README section 9.
