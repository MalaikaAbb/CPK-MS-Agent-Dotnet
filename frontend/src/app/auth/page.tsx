import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const FRONTEND_SNIPPET = `<CopilotKit
  runtimeUrl="/api/copilotkit"
  headers={{
    Authorization: \`Bearer \${userToken}\`,
  }}
>
  <YourApp />
</CopilotKit>`;

const APPSETTINGS_SNIPPET = `{
  "JwtAuthority": "https://login.microsoftonline.com/{your-tenant-id}/v2.0",
  "JwtAudience": "api://{your-client-id}"
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/auth" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Forwarding a user&apos;s identity from the browser to the agent. The
          provider attaches an <code>Authorization</code> header, the runtime
          passes it through, and the AG-UI server validates it before the agent
          runs.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The two halves land very differently here. The frontend half is a
          three-line prop and is implemented. The backend half, as the .NET tab
          publishes it, is ASP.NET Core JWT bearer validation pointed at a live
          authority — so it cannot be exercised without an identity provider.
        </p>
      </Panel>

      <Panel title="Frontend — forwarding the token">
        <CodeBlock filename="The doc's sample" language="tsx" code={FRONTEND_SNIPPET} />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          This repo does the same thing on <code>CopilotKitProvider</code>, and
          only when a token is configured, so the app still runs
          unauthenticated out of the box:
        </p>
        <div className="mt-3">
          <SourceCode file="frontend/src/components/providers.tsx" />
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Set <code>NEXT_PUBLIC_AUTH_BEARER_TOKEN</code> in{" "}
          <code>frontend/.env.local</code> and the header goes out on every
          AG-UI request. The demo route reports whether it is set and what the
          server does with it.
        </p>
      </Panel>

      <Panel
        title="Backend — what the .NET tab publishes"
        description="Kept as a doc artifact under backend/doc-samples/, deliberately outside the build."
      >
        <SourceCodeGroup files={[{ file: "backend/doc-samples/AuthProgram.cs.txt" }]} />
        <div className="mt-4">
          <CodeBlock
            filename="appsettings.json — the values it needs"
            language="json"
            code={APPSETTINGS_SNIPPET}
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Why this route cannot pass locally">
        <code>AddJwtBearer</code> with <code>ValidateIssuer</code>,{" "}
        <code>ValidateAudience</code> and <code>ValidateIssuerSigningKey</code>{" "}
        all on needs a real issuer to validate against. The page&apos;s own
        Python tab carries a shared-secret middleware that <em>is</em>{" "}
        localhost-testable, and the Python harness in the sibling repo uses
        exactly that. There is no published .NET equivalent, and this repo does
        not write one.
      </Callout>

      <Panel title="The demo page">
        <SourceCode file="frontend/src/app/auth/demo-chat/auth-demo-chat.tsx" />
      </Panel>

      <Callout tone="info" title="CORS, which the page does cover in C#">
        The page&apos;s CORS block is published in C# and is implemented — it is
        the <code>AddCors</code> / <code>UseCors</code> pair in{" "}
        <code>backend/Program.cs</code>, scoped to{" "}
        <code>http://localhost:3000</code>. That part of this page works.
      </Callout>
    </>
  );
}
