// Harness-authored — NOT from the docs.
//
// The Generative UI › Components and surfaces pages (surfaces, catalogs,
// standard catalog, state and actions, theming, transports, markdown mode,
// adopt from A2UI) publish frontend code only. None of them shows a .NET
// agent, and the Catalogs page's ProductCard tells the model to copy every
// value "from a product of a tool result" without any page publishing such a
// tool. So this file supplies the two smallest things those routes need:
//
//   - `search_products`: a fixed list of ten products, filtered by a free-text
//     query and an optional price cap. Fields match the published ProductCard
//     props (name, price, imageUrl) plus the productId the State-and-actions
//     cards take. The first three ids/names match the frontend scaffolding's
//     PRODUCTS (Trail Runner, City Sneaker, Track Spike).
//   - `Create`: a Quickstart-shaped agent (same model, same instructions as the
//     Quickstart's `#region quickstart-agent` in Program.cs) carrying that tool.
//
// Nothing here forwards the run's AG-UI `context` entries to the model. The
// pages say the agent must do that and publish no .NET code for it, so the
// gap is recorded rather than filled (see the routes' notes and README §9).

using System.ComponentModel;
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using OpenAI;
using OpenAI.Chat;

public static class GenerativeUIProductsAgent
{
    #region search-products
    // Harness-authored: a product tool so ProductCard has a tool result to copy.
    private sealed record ProductRecord(string ProductId, string Name, double Price, string ImageUrl, string[] Tags);

    private static readonly ProductRecord[] Products =
    [
        new("p1", "Trail Runner", 120, "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=320&h=200&fit=crop", ["running", "shoes", "trail"]),
        new("p2", "City Sneaker", 85, "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=320&h=200&fit=crop", ["shoes", "casual"]),
        new("p3", "Track Spike", 140, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=320&h=200&fit=crop", ["running", "shoes", "track"]),
        new("p4", "Road Racer Lite", 59, "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=320&h=200&fit=crop", ["running", "shoes", "road", "cheap"]),
        new("p5", "Everyday Jogger", 45, "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=320&h=200&fit=crop", ["running", "shoes", "cheap"]),
        new("p6", "Wool Running Socks", 18, "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=320&h=200&fit=crop", ["running", "socks", "accessories"]),
        new("p7", "Classic White Mug", 40, "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=320&h=200&fit=crop", ["mug", "coffee", "cup", "kitchen"]),
        new("p8", "Camp Enamel Mug", 28, "https://images.unsplash.com/photo-1572119865084-43c285814d63?w=320&h=200&fit=crop", ["mug", "coffee", "cup", "kitchen"]),
        new("p9", "Tall Ceramic Mug", 35, "https://images.unsplash.com/photo-1570784332176-fdd73da66f03?w=320&h=200&fit=crop", ["mug", "coffee", "cup", "kitchen"]),
        new("p10", "Cozy Tea Mug", 22, "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=320&h=200&fit=crop", ["mug", "coffee", "cup", "kitchen"]),
    ];

    [Description("Search the shop's products. Returns productId, name, price (USD) and imageUrl for each match.")]
    private static object SearchProducts(
        [Description("Words to match, e.g. 'running shoes'. Empty returns everything.")] string query,
        [Description("Only return products at or below this price.")] double? maxPrice = null)
    {
        var words = query.ToLowerInvariant().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var matches = Products.Where(p =>
            (maxPrice is null || p.Price <= maxPrice) &&
            words.All(w =>
            {
                var stem = w.EndsWith('s') ? w[..^1] : w;
                return p.Tags.Any(t => t.StartsWith(stem)) || p.Name.Contains(w, StringComparison.OrdinalIgnoreCase);
            }));

        return new
        {
            products = matches
                .Select(p => new { productId = p.ProductId, name = p.Name, price = p.Price, imageUrl = p.ImageUrl })
                .ToArray(),
        };
    }
    #endregion

    #region genui-agent
    // Harness-authored: the Quickstart agent's shape, plus search_products.
    public static AIAgent Create(OpenAIClient openAI) =>
        openAI.GetChatClient("gpt-5.4-mini").AsAIAgent(
            name: "GenUIAgent",
            instructions: "You are a helpful assistant.",
            tools: [AIFunctionFactory.Create(SearchProducts, name: "search_products")]);
    #endregion
}
