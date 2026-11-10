// State Rendering — docs.copilotkit.ai/ms-agent-dotnet/generative-ui/state-rendering
//
// `StateStreamingAgent` and the two state classes below are the page's C#
// verbatim, lifted out of its single Program.cs listing so the wiring can live
// with the rest of the server. Nothing in the class body is edited.
//
// The page maps this agent at "/". Here it is mapped at "/search_agent"
// instead, because "/" is already the Quickstart agent and an endpoint serves
// one agent.

using System.Runtime.CompilerServices;
using System.Text.Json;
using AGUI.Abstractions;
using AGUI.Server;
using Microsoft.Agents.AI;
using Microsoft.Agents.AI.Hosting.AGUI.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using OpenAI;
using OpenAI.Chat;
using AIChatMessage = Microsoft.Extensions.AI.ChatMessage;
using AIChatResponseFormat = Microsoft.Extensions.AI.ChatResponseFormat;
using System.Text.Json.Serialization;

// Agent wrapper that streams state updates
internal sealed class StateStreamingAgent : DelegatingAIAgent
{
    private readonly JsonSerializerOptions _jsonSerializerOptions;

    public StateStreamingAgent(AIAgent innerAgent, JsonSerializerOptions jsonSerializerOptions)
        : base(innerAgent)
    {
        this._jsonSerializerOptions = jsonSerializerOptions;
    }

    protected override Task<AgentResponse> RunCoreAsync(
        IEnumerable<AIChatMessage> messages,
        AgentSession? session = null,
        AgentRunOptions? options = null,
        CancellationToken cancellationToken = default) =>
        RunCoreStreamingAsync(messages, session, options, cancellationToken)
            .ToAgentResponseAsync(cancellationToken);

    protected override async IAsyncEnumerable<AgentResponseUpdate> RunCoreStreamingAsync(
        IEnumerable<AIChatMessage> messages,
        AgentSession? session = null,
        AgentRunOptions? options = null,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        // Recover the state sent in the AG-UI request
        JsonElement? currentState = null;
        if (options is ChatClientAgentRunOptions { ChatOptions: { } chatOptions } &&
            chatOptions.TryGetRunAgentInput(out RunAgentInput? input) &&
            input?.State is { ValueKind: JsonValueKind.Object } state)
        {
            currentState = state;
        }

        // Clone the run options, then request structured state output
        var chatRunOptions = options as ChatClientAgentRunOptions;
        var stateChatOptions = chatRunOptions?.ChatOptions?.Clone() ?? new ChatOptions();
        stateChatOptions.ResponseFormat = AIChatResponseFormat.ForJsonSchema<AgentStateSnapshot>(
            schemaName: "AgentStateSnapshot",
            schemaDescription: "Research progress state");

        ChatClientAgentRunOptions stateOptions = new(stateChatOptions)
        {
            ChatClientFactory = chatRunOptions?.ChatClientFactory,
        };

        // Add system message with current state
        var stateMessage = new AIChatMessage(ChatRole.System,
            $"Current state: {currentState?.GetRawText() ?? "{}"}");
        var messagesWithState = messages.Append(stateMessage);

        // Collect all updates
        var allUpdates = new List<AgentResponseUpdate>();
        await foreach (var update in InnerAgent.RunStreamingAsync(messagesWithState, session, stateOptions, cancellationToken))
        {
            allUpdates.Add(update);
            // Stream non-text updates immediately
            if (update.Contents.Any(c => c is not TextContent))
            {
                yield return update;
            }
        }

        // Deserialize state snapshot from response
        var response = allUpdates.ToAgentResponse();
        JsonElement? stateSnapshot = null;
        try
        {
            stateSnapshot = JsonSerializer.Deserialize<JsonElement>(
                response.Text,
                this._jsonSerializerOptions);
        }
        catch (JsonException)
        {
            // The model did not return the requested state snapshot.
        }

        if (stateSnapshot is { } parsedStateSnapshot)
        {
            byte[] stateBytes = JsonSerializer.SerializeToUtf8Bytes(
                parsedStateSnapshot,
                this._jsonSerializerOptions.GetTypeInfo(typeof(JsonElement)));

            // Emit state snapshot as DataContent
            yield return new AgentResponseUpdate
            {
                Contents = [new DataContent(stateBytes, "application/json")]
            };
        }

        // Stream text summary
        var summaryMessage = new AIChatMessage(ChatRole.System, "Provide a brief summary of your progress.");
        await foreach (var update in InnerAgent.RunStreamingAsync(
            messages.Concat(response.Messages).Append(summaryMessage), session, options, cancellationToken))
        {
            yield return update;
        }
    }
}


public class SearchInfo
{
    [JsonPropertyName("query")]
    public string Query { get; set; } = string.Empty;

    [JsonPropertyName("done")]
    public bool Done { get; set; }
}

public class AgentStateSnapshot
{
    [JsonPropertyName("searches")]
    public List<SearchInfo> Searches { get; set; } = new();
}
