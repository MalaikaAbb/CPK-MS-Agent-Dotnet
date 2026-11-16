// Serves the Microsoft Agent Framework agents over AG-UI.
//
// `AddAGUIServer()` + `MapAGUIServer(path, agent)` is the whole integration:
// the Quickstart maps one agent at "/". This harness maps two, because the
// Components-as-Tools page builds its agent differently (a ChatClientAgent
// with an empty tool list and its own system prompt) from the Quickstart one.
//
// Every agent, tool and instruction string below is lifted from a doc page.
// Where a page's .NET tab publishes no usable code, nothing is invented here —
// the gap is recorded in `frontend/src/lib/nav-config.ts` and in the README,
// and the fragments the page does publish sit unbuilt under `doc-samples/`.

#pragma warning disable OPENAI001
using System.ComponentModel;
using Microsoft.Agents.AI;
using Microsoft.Agents.AI.Hosting.AGUI.AspNetCore;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Options;
using OpenAI;
using OpenAI.Chat;

var builder = WebApplication.CreateBuilder(args);

// [1] quickstart: AG-UI server
// [!code highlight]
builder.Services.AddAGUIServer();

// Harness infrastructure, not from the docs: the frontend's health badge and
// the AG-UI debug page both reach this server from http://localhost:3000.
// The Authentication page's CORS block is the same shape.
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors();

// Harness infrastructure: logs every 4xx/5xx response to the terminal. The
// default config hides ASP.NET request logs below Warning, so a POST to an
// unmapped agent path (e.g. /subagents → 404) otherwise leaves no trace.
var requestLogger = app.Services.GetRequiredService<ILoggerFactory>().CreateLogger("Harness.Requests");
app.Use(async (context, next) =>
{
    await next();
    if (context.Response.StatusCode >= 400)
    {
        requestLogger.LogWarning(
            "{Method} {Path} → {StatusCode}{Hint}",
            context.Request.Method,
            context.Request.Path,
            context.Response.StatusCode,
            context.Response.StatusCode == 404 ? " (no endpoint mapped at this path)" : "");
    }
});

// The Quickstart reads the key from configuration, which is how
// `dotnet user-secrets set OPENAI_API_KEY ...` reaches the app. The
// environment variable is picked up by the same provider chain.
string openAiApiKey = builder.Configuration["OPENAI_API_KEY"]
    ?? throw new InvalidOperationException(
        "Set OPENAI_API_KEY. From backend/: dotnet user-secrets set OPENAI_API_KEY \"<your-openai-api-key>\"");

var openAI = new OpenAIClient(openAiApiKey);

// --------------------------------------------------------------------------
// Tool Rendering — docs.copilotkit.ai/ms-agent-dotnet/generative-ui/tool-rendering
// --------------------------------------------------------------------------

// [2] tool rendering: get_weather
// [!code highlight]
#region get-weather
// Define the weather tool function
[Description("Get the weather for a given location.")]
static string GetWeather([Description("The location to get weather for")] string location)
    => $"The weather for {location} is 70 degrees.";

AITool getWeather = AIFunctionFactory.Create(GetWeather, name: "get_weather");
#endregion

// --------------------------------------------------------------------------
// Quickstart agent — .../quickstart?agent=bring-your-own
//
// The Quickstart maps a bare "You are a helpful assistant."; the Tool
// Rendering page maps the same endpoint with `tools: [getWeather]`. This is
// the union of the two, so one endpoint serves Quickstart, Prebuilt
// Components, Slots, Headless UI, Programmatic Control, Frontend Tools, Tool
// Rendering, Governed Actions, Copilot Runtime and AG-UI.
// --------------------------------------------------------------------------

// [3] quickstart: agent
// [!code highlight]
#region quickstart-agent
var agent = openAI.GetChatClient("gpt-6-luna")
    .AsIChatClient().AsBuilder()
    .ConfigureOptions(options => options.RawRepresentationFactory = _ =>
        new OpenAI.Chat.ChatCompletionOptions { ReasoningEffortLevel = new("none") })
    .Build().AsAIAgent(
    name: "MyAgent",
    instructions: "You are a helpful assistant.",
    tools: [getWeather]);
#endregion

// --------------------------------------------------------------------------
// Components as Tools — .../generative-ui/tool-based
//
// The page's own note: leave `tools` empty, because the only tools in play are
// the frontend ones the AG-UI hosting layer merges in from the request.
// --------------------------------------------------------------------------

#region chart-agent
// [4] tool-based: system prompt
// [!code highlight]
const string ChartSystemPrompt = """
    You are a data visualization assistant.
    When the user asks for a chart, call render_bar_chart with a concise
    title, description, and data array of {label, value} items.
    Keep final chat responses brief.
    """;

// [5] tool-based: chart agent
// [!code highlight]
// HARNESS FIX (not in the doc): the page uses a bare .AsIChatClient(), which
// makes every run with a frontend tool fail with RUN_ERROR/StreamingError on
// gpt-6-luna. The reasoning-effort "none" chain is copied from the other
// gpt-6-luna pages (Quickstart, Tool Rendering, State Rendering).
var chartAgent = new ChatClientAgent(
    openAI.GetChatClient("gpt-6-luna")
    .AsIChatClient().AsBuilder()
    .ConfigureOptions(options => options.RawRepresentationFactory = _ =>
        new OpenAI.Chat.ChatCompletionOptions { ReasoningEffortLevel = new("none") })
    .Build(),
    name: "ChartAgent",
    instructions: ChartSystemPrompt,
    tools: []);
#endregion

// --------------------------------------------------------------------------
// State Rendering — .../generative-ui/state-rendering
//
// The page's own recipe: build the base agent, then wrap it in the
// `StateStreamingAgent` DelegatingAIAgent (see StateStreamingAgent.cs), which
// asks the model for a structured AgentStateSnapshot and emits it as
// `DataContent` for AG-UI to forward to the UI.
// --------------------------------------------------------------------------

#region state-rendering
// [6] state rendering: serializer options
// [!code highlight]
// Get JSON serializer options
var jsonOptions = app.Services.GetRequiredService<IOptions<JsonOptions>>();

// [7] state rendering: base agent
// [!code highlight]
// Create the base agent
AIAgent baseAgent = openAI
    .GetChatClient("gpt-6-luna")
    .AsIChatClient().AsBuilder()
    .ConfigureOptions(options => options.RawRepresentationFactory = _ =>
        new OpenAI.Chat.ChatCompletionOptions { ReasoningEffortLevel = new("none") })
    .Build()
    .AsAIAgent(
        name: "ResearchAssistant",
        instructions: "You are a research assistant that tracks your progress.");

// [8] state rendering: wrap with the state-streaming agent
// [!code highlight]
// Wrap with state-streaming agent
AIAgent searchAgent = new StateStreamingAgent(baseAgent, jsonOptions.Value.SerializerOptions);
#endregion

#region open-generative-ui
// Open Generative UI: .../generative-ui/open-generative-ui. The factories are
// the page's Code-tab files (DocAgents/), verbatim. The ApiKeyResolver and
// AimockHeaderPolicy they call are harness stand-ins (DocGapStubs.cs). The
// Code tab maps them with `MapAGUI`, which no Hosting.AGUI release has, so
// they are mapped with MapAGUIServer below.
var openGenUiAgent = new OpenGenUiAgentFactory(builder.Configuration).CreateAgent();
var openGenUiAdvancedAgent = new OpenGenUiAdvancedAgentFactory(builder.Configuration).CreateAgent();
#endregion

#region interrupt-agent-wiring
// Interrupt-based HITL: .../human-in-the-loop/interrupt-flow. The page's .NET
// fragment never connects its approval-gated tool to an agent or endpoint.
// InterruptAgent.cs is the harness-authored, Quickstart-shaped agent that
// carries it.
AIAgent interruptAgent = InterruptAgent.Create(openAiApiKey);
#endregion

#region genui-agent-wiring
// Components and surfaces routes: harness-authored agent with a
// search_products tool (GenerativeUIProductsAgent.cs). No page publishes one.
AIAgent genuiAgent = GenerativeUIProductsAgent.Create(openAI);
#endregion

#region components-agent
// Generative UI › Components and surfaces (.../generative-ui/components),
// "Add the runtime and an agent". The page prints a TanStack BuiltInAgent
// (gpt-6-luna, one system prompt, the run's own tools and systemPrompts).
// Harness swap (each framework runs its own agent): this MAF .NET agent with
// the snippet's model and system prompt and no tools of its own. The chat
// client chain is the Quickstart agent's (reasoning effort "none", §9.8).
// The page's `...systemPrompts` (the render_ui guide) is NOT forwarded: the
// .NET AG-UI server drops RunAgentInput.Context (README §9.11).
var componentsAgent = openAI.GetChatClient("gpt-6-luna")
    .AsIChatClient().AsBuilder()
    .ConfigureOptions(options => options.RawRepresentationFactory = _ =>
        new OpenAI.Chat.ChatCompletionOptions { ReasoningEffortLevel = new("none") })
    .Build().AsAIAgent(
    name: "ComponentsAgent",
    instructions: "You are a helpful assistant. When a visual answer helps, render it with generative UI.");
#endregion

#region byoc-agents-remedy
// JSON Render and Hashbrown: .../generative-ui/json-render and .../hashbrown.
// The Code-tab agents fail to compile on Microsoft.Agents.AI 1.27.0 (CS0117,
// ChatClientAgentOptions.Instructions). They are kept verbatim in doc-samples/.
// DocAgents/*.Remedy.cs are labelled copies with only the system prompt moved
// to ChatOptions.Instructions.
var byocLoggerFactory = app.Services.GetRequiredService<ILoggerFactory>();
var byocJsonRenderAgent = new ByocJsonRenderAgentFactory(builder.Configuration, byocLoggerFactory).CreateAgent();
var byocHashbrownAgent = new ByocHashbrownAgentFactory(builder.Configuration, byocLoggerFactory).CreateAgent();
#endregion

#region shared-state-wiring
// Shared State read/write: the Quickstart agent plus the pages' AgentStateSnapshot
// class (SharedStateAgent.cs). Mapped at /sample_agent, the pages' agent id.
AIAgent sharedStateAgent = SharedState.SharedStateAgent.Create(openAI);
#endregion

#region subagents-stand-in
// HARNESS STAND-IN for Sub-Agents (.../multi-agent/subagents). Not the doc's
// agent: the page's SubagentsAgent.cs does not compile (see
// doc-samples/SubagentsAgent.cs.txt), so nothing was mapped at /subagents and
// the demo's runs 404'd. This is the Quickstart agent as published, mapped at
// the path the Code tab's Program.cs uses, so the endpoint answers. It has no
// sub-agent tools, so no delegations appear.
AIAgent subagentsAgent = openAI.GetChatClient("gpt-6-luna")
    .AsIChatClient().AsBuilder()
    .ConfigureOptions(options => options.RawRepresentationFactory = _ =>
        new OpenAI.Chat.ChatCompletionOptions { ReasoningEffortLevel = new("none") })
    .Build().AsAIAgent(
    name: "MyAgent",
    instructions: "You are a helpful assistant.");
#endregion

// Harness infrastructure: lets the app's landing page report reachability.
app.MapGet("/health", () => Results.Ok(new
{
    status = "ok",
    agents = new[]
    {
        "/", "/chart_agent", "/search_agent", "/interrupt_agent", "/genui_agent", "/components_agent",
        "/open-gen-ui", "/open-gen-ui-advanced", "/byoc-json-render", "/byoc-hashbrown", "/sample_agent", "/subagents",
    },
}));

// Harness: each agent is wrapped in HarnessErrorLoggingAgent (see
// HarnessErrorLogging.cs) so a failed run prints its real exception here;
// AGUI.Server only sends the client a generic StreamingError.
var runLogger = app.Services.GetRequiredService<ILoggerFactory>().CreateLogger("Harness.AgentRuns");
AIAgent Logged(string path, AIAgent a) => new HarnessErrorLoggingAgent(a, runLogger, path);

// [6] quickstart: map the AG-UI endpoint
// [!code highlight]
app.MapAGUIServer("/", Logged("/", agent));
app.MapAGUIServer("/chart_agent", Logged("/chart_agent", chartAgent));
app.MapAGUIServer("/search_agent", Logged("/search_agent", searchAgent));
app.MapAGUIServer("/interrupt_agent", Logged("/interrupt_agent", interruptAgent));
app.MapAGUIServer("/genui_agent", Logged("/genui_agent", genuiAgent));
app.MapAGUIServer("/components_agent", Logged("/components_agent", componentsAgent));
app.MapAGUIServer("/sample_agent", Logged("/sample_agent", sharedStateAgent));
app.MapAGUIServer("/byoc-json-render", Logged("/byoc-json-render", byocJsonRenderAgent));
app.MapAGUIServer("/byoc-hashbrown", Logged("/byoc-hashbrown", byocHashbrownAgent));
app.MapAGUIServer("/open-gen-ui", Logged("/open-gen-ui", openGenUiAgent));
app.MapAGUIServer("/open-gen-ui-advanced", Logged("/open-gen-ui-advanced", openGenUiAdvancedAgent));
app.MapAGUIServer("/subagents", Logged("/subagents", subagentsAgent));

// The Quickstart hardcodes `app.Run("http://localhost:8000")`. The port is read
// from configuration here instead — harness infrastructure, not doc code — so
// the server can move when something else already owns 8000. Change this and
// the frontend's MS_AGENT_URL together.
string agentPort = builder.Configuration["AGENT_PORT"] ?? "8000";
app.Run($"http://localhost:{agentPort}");
