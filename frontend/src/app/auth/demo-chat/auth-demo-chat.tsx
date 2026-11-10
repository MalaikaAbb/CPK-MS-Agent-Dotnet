"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

/**
 * The client half of the Authentication demo.
 *
 * What is testable on this stack is the *forwarding*, not the validation. The
 * provider attaches an `Authorization` header when a token is configured, and
 * that header travels runtime → AG-UI server on every request. The server does
 * not check it, because the .NET tab's only published validation is JWT bearer
 * against a live authority.
 *
 * So the chat below always replies. That is the honest result, not a pass:
 * read the panel for what is actually being proven.
 *
 * `tokenConfigured` comes from a NEXT_PUBLIC_ variable, which Next inlines at
 * build time, so it reflects what the provider really forwards.
 */
export function AuthDemoChat({ tokenConfigured }: { tokenConfigured: boolean }) {
  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-2">
      <div className="min-h-0 space-y-4 overflow-y-auto border-b border-slate-200 p-4 lg:border-b-0 lg:border-r dark:border-slate-800">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Current configuration
          </h2>
          <dl className="mt-2 grid grid-cols-[minmax(0,14rem)_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-slate-500">Provider sends a token</dt>
            <dd className="font-medium text-slate-800 dark:text-slate-100">
              {tokenConfigured ? "Yes" : "No"}
              <span className="ml-2 text-xs font-normal text-slate-500">
                NEXT_PUBLIC_AUTH_BEARER_TOKEN
              </span>
            </dd>
            <dt className="text-slate-500">Agent validates it</dt>
            <dd className="font-medium text-slate-800 dark:text-slate-100">
              No
              <span className="ml-2 text-xs font-normal text-slate-500">
                no published .NET validation runs locally
              </span>
            </dd>
          </dl>
        </div>

        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-semibold">Half of this page is testable</p>
          <p className="mt-1">
            {tokenConfigured
              ? "A token is configured, so every AG-UI request carries an Authorization header. Confirm it on the AG-UI route's event capture, or in the agent process's request log."
              : "No token is configured, so no Authorization header is sent. Set NEXT_PUBLIC_AUTH_BEARER_TOKEN in frontend/.env.local and restart to watch one appear."}
          </p>
          <p className="mt-2">
            Either way the chat replies, because the server has no validation
            wired. The .NET tab publishes only <code>AddJwtBearer</code> against
            a live authority, and nothing here invents a substitute.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            What you can prove here
          </p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
            <li>Send a message with no token set. It streams.</li>
            <li>
              Set <code>NEXT_PUBLIC_AUTH_BEARER_TOKEN</code> in{" "}
              <code>frontend/.env.local</code> and restart the app.
            </li>
            <li>
              Send again. It still streams — but the request now carries the
              header, which is the forwarding half working.
            </li>
            <li>
              To see the header, open the AG-UI route and watch the request, or
              read the agent&apos;s console.
            </li>
          </ol>
        </div>
      </div>

      <div className="min-h-0">
        <CopilotChat
          agentId="my_agent"
          labels={{
            welcomeMessageText:
              "This replies either way. The token is forwarded; nothing on the server checks it.",
          }}
        />
      </div>
    </div>
  );
}
