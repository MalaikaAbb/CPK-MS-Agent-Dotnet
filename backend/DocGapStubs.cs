// HARNESS-AUTHORED STAND-INS — not from the docs.
//
// The Code-tab agents in DocAgents/ (ByocJsonRenderAgent.cs,
// ByocHashbrownAgent.cs, OpenGenUiAgent.cs, OpenGenUiAdvancedAgent.cs) call
// two helpers that no ms-agent-dotnet doc page publishes: `ApiKeyResolver`
// and `AimockHeaderPolicy`. These are the minimum needed for those verbatim
// files to compile. They add no behaviour of their own:
//
// - ResolveApiKey reads OPENAI_API_KEY from configuration, the same way the
//   Quickstart does, and throws if it is missing.
// - ResolveEndpoint returns null, so the OpenAI SDK's default endpoint is used.
// - CreateOpenAIClientOptions returns plain OpenAIClientOptions, setting
//   Endpoint only when one is given. (The upstream name suggests it injects
//   aimock test headers; nothing of that is reproduced here.)

using OpenAI;

public static class ApiKeyResolver
{
    public static string ResolveApiKey(IConfiguration configuration)
        => configuration["OPENAI_API_KEY"]
            ?? throw new InvalidOperationException(
                "Set OPENAI_API_KEY. From backend/: dotnet user-secrets set OPENAI_API_KEY \"<your-openai-api-key>\"");

    public static string? ResolveEndpoint(IConfiguration configuration) => null;
}

public static class AimockHeaderPolicy
{
    public static OpenAIClientOptions CreateOpenAIClientOptions(string? endpoint)
    {
        var options = new OpenAIClientOptions();
        if (endpoint is not null)
        {
            options.Endpoint = new Uri(endpoint);
        }
        return options;
    }
}
