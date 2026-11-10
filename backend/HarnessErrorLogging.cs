// HARNESS-AUTHORED, not doc code. Makes failed runs visible in the backend
// terminal.
//
// AGUI.Server 1.0 catches any exception thrown while streaming a run, sends the
// client a generic RUN_ERROR ("An error occurred while streaming the agent
// response.", code StreamingError) and logs nothing — the assembly has no
// logger. This wrapper logs the real exception, then rethrows it, so the
// client still gets exactly the same RUN_ERROR.

using System.Runtime.CompilerServices;
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;

internal sealed class HarnessErrorLoggingAgent(AIAgent innerAgent, ILogger logger, string path)
    : DelegatingAIAgent(innerAgent)
{
    protected override async Task<AgentResponse> RunCoreAsync(
        IEnumerable<ChatMessage> messages,
        AgentSession? session = null,
        AgentRunOptions? options = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return await InnerAgent.RunAsync(messages, session, options, cancellationToken).ConfigureAwait(false);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.LogError(ex, "Agent run failed at {Path}", path);
            throw;
        }
    }

    protected override async IAsyncEnumerable<AgentResponseUpdate> RunCoreStreamingAsync(
        IEnumerable<ChatMessage> messages,
        AgentSession? session = null,
        AgentRunOptions? options = null,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        await using var updates = InnerAgent
            .RunStreamingAsync(messages, session, options, cancellationToken)
            .GetAsyncEnumerator(cancellationToken);

        while (true)
        {
            AgentResponseUpdate update;
            try
            {
                if (!await updates.MoveNextAsync().ConfigureAwait(false))
                {
                    yield break;
                }
                update = updates.Current;
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                logger.LogError(ex, "Agent run failed at {Path}", path);
                throw;
            }
            yield return update;
        }
    }
}
