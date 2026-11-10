// Interrupt-based HITL — docs.copilotkit.ai/ms-agent-dotnet/human-in-the-loop/interrupt-flow
//
// The page's .NET tab is a fragment (kept verbatim, unbuilt, in
// doc-samples/InterruptProgram.cs.txt). It shows the approval wrapper and an
// elided `builder.Services.AddChatClient(/* ... */)` registration, but never
// defines DeleteFile and never connects either to MapAGUIServer.
//
// What is doc code and what is not:
//   - `new ApprovalRequiredAIFunction(AIFunctionFactory.Create(DeleteFile,
//     "delete_file", "Deletes a file"))` is the page's expression, verbatim.
//   - DeleteFile is HARNESS-AUTHORED (one line). The page calls it, never
//     defines it.
//   - The agent is HARNESS-AUTHORED, Quickstart-shaped: the Quickstart's
//     client, model and instructions, with the gated tool attached via
//     `tools:` instead of the page's elided AddChatClient registration.
//
// Mapped at "/interrupt_agent" in Program.cs.

using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using OpenAI;
using OpenAI.Chat;

internal static class InterruptAgent
{
    #region delete-file
    // HARNESS-AUTHORED — the page references DeleteFile but never defines it.
    // It deletes nothing; it only reports.
    static string DeleteFile(string filename) => $"Deleted {filename}.";
    #endregion

    public static AIAgent Create(string openAiApiKey)
    {
        #region approval-tool
        // [1] interrupt flow: approval-gated tool (doc expression, verbatim)
        // [!code highlight]
        // Wrap the function so the framework requests approval before it runs.
        var deleteFileTool = new ApprovalRequiredAIFunction(
            AIFunctionFactory.Create(DeleteFile, "delete_file", "Deletes a file"));
        #endregion

        #region interrupt-agent
        // HARNESS-AUTHORED — Quickstart-shaped agent carrying the gated tool.
        return new OpenAIClient(openAiApiKey)
            .GetChatClient("gpt-5.4-mini")
            .AsAIAgent(
                name: "InterruptAgent",
                instructions: "You are a helpful assistant.",
                tools: [deleteFileTool]);
        #endregion
    }
}
