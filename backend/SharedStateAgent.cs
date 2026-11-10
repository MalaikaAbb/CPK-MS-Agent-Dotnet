// Shared State — docs.copilotkit.ai/ms-agent-dotnet/shared-state/in-app-agent-read
//                and .../in-app-agent-write
//
// The pages' .NET tab publishes only the AgentStateSnapshot class below. It
// shows no tool, state schema, or endpoint wiring for it, so the agent is the
// Quickstart's agent as published (model, name, instructions), mapped at
// /sample_agent, the agent id both pages' frontend code uses.
//
// HARNESS-AUTHORED: the factory and the endpoint. Nothing references
// AgentStateSnapshot; the pages never show where it plugs in.
//
// Namespaced because State Rendering's verbatim code already declares a
// global AgentStateSnapshot (with Searches); two global classes of the same
// name would not compile (CS0101).

#pragma warning disable OPENAI001
using Microsoft.Extensions.AI;
using Microsoft.Agents.AI;
using OpenAI;
using OpenAI.Chat;

namespace SharedState;

#region shared-state-snapshot
public class AgentStateSnapshot
{
    public string Language { get; set; } = "english";
}
#endregion

internal static class SharedStateAgent
{
    #region shared-state-agent
    public static AIAgent Create(OpenAIClient openAI) =>
        openAI.GetChatClient("gpt-6-luna")
    .AsIChatClient().AsBuilder()
    .ConfigureOptions(options => options.RawRepresentationFactory = _ =>
        new OpenAI.Chat.ChatCompletionOptions { ReasoningEffortLevel = new("none") })
    .Build().AsAIAgent(
            name: "MyAgent",
            instructions: "You are a helpful assistant.");
    #endregion
}
