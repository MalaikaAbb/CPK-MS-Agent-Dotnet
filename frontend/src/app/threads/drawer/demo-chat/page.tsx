"use client";

import {
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotSidebar,
  CopilotThreadsDrawer,
  useCopilotChatConfiguration,
  type Thread,
} from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";
import { ThreadsProvider } from "@/components/threads-provider";

/**
 * `<CopilotThreadsDrawer>` beside `<CopilotChat>`, in the two shapes the doc
 * page covers: the zero-prop integration, and the same drawer with its
 * documented customization props applied.
 *
 * Both mount the drawer and the chat under one
 * `CopilotChatConfigurationProvider` — that shared configuration is what makes
 * selecting a row drive the chat with no active-thread state of our own.
 */

const AGENT_ID = "default";

type Variant =
  | "default"
  | "customized"
  | "sidebar"
  | "own-button"
  | "controlled"
  | "hide-parts";

const TABS: { id: Variant; label: string; blurb: string }[] = [
  {
    id: "default",
    label: "Zero props",
    blurb: "The doc's integration verbatim — no props, no wiring.",
  },
  {
    id: "customized",
    label: "Customized",
    blurb: "renderRow + limit + label overrides.",
  },
  {
    id: "sidebar",
    label: "Sidebar host",
    blurb: "The drawer beside a CopilotSidebar instead of an inline chat.",
  },
  {
    id: "own-button",
    label: "Own New button",
    blurb: "Your header button calls startNewThread() from the shared configuration.",
  },
  {
    id: "controlled",
    label: "Controlled threadId",
    blurb: "Thread id in your state; the drawer reports selection via callbacks.",
  },
  {
    id: "hide-parts",
    label: "Hide built-in New",
    blurb: "CSS ::part() rules hide the drawer's own new-conversation controls.",
  },
];

/**
 * HARNESS-AUTHORED placeholder. The doc's sidebar sample renders
 * `<YourMainContent />` without defining or importing it.
 */
function YourMainContent() {
  return (
    <div className="p-6 text-sm text-slate-500">
      YourMainContent — placeholder for the component the doc never defines.
      The sidebar is docked at the right edge.
    </div>
  );
}

// [5] threads-drawer: your own "New conversation" button (verbatim)
function NewConversationButton() {
  const configuration = useCopilotChatConfiguration();
  return (
    <button
      type="button"
      onClick={() => configuration?.startNewThread()}
    >
      New conversation
    </button>
  );
}

// [6] threads-drawer: controlled thread id (verbatim; the doc's fragment has
// no imports — useState and the components are imported at the top of this file)
function ControlledChat() {
  const [threadId, setThreadId] = useState(() => crypto.randomUUID());
  const startNew = () => setThreadId(crypto.randomUUID());
  return (
    <CopilotChatConfigurationProvider threadId={threadId}>
      <CopilotThreadsDrawer
        onThreadSelect={(id) => setThreadId(id)}
        onNewThread={startNew}
      />
      <button type="button" onClick={startNew}>
        New conversation
      </button>
      <CopilotChat />
    </CopilotChatConfigurationProvider>
  );
}

// [7] threads-drawer: hide the drawer's own new-conversation controls (verbatim CSS)
const HIDE_NEW_THREAD_CSS = `copilotkit-threads-drawer::part(new-thread-button),
copilotkit-threads-drawer::part(launcher-new-thread) {
  display: none;
}`;

/** `renderRow` content — the element keeps selection, archived styling, and the kebab menu. */
function renderRow(thread: Thread) {
  const when = thread.lastRunAt ?? thread.updatedAt;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="truncate text-sm">{thread.name ?? "New conversation"}</span>
      <span className="text-[11px] opacity-60">
        {new Date(when).toLocaleString()}
      </span>
    </div>
  );
}

export default function Page() {
  const [variant, setVariant] = useState<Variant>("default");
  const active = TABS.find((t) => t.id === variant)!;

  return (
    <DemoFrame parentPath="/threads/drawer" subtitle={active.blurb}>
      <ThreadsProvider>
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setVariant(tab.id)}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                  variant === tab.id
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Remounted per variant so the drawer re-registers with a fresh
              configuration instead of inheriting the previous one's state. */}
          <div className="min-h-0 flex-1" key={variant}>
            {variant === "sidebar" ? (
              /* [8] threads-drawer: sidebar host (verbatim body; the doc's
                 outer CopilotKitProvider is this route's ThreadsProvider) */
              /* [!code highlight] */
              <CopilotChatConfigurationProvider>
                <div style={{ display: "flex", height: "100dvh" }}>
                  <CopilotThreadsDrawer />
                  <main style={{ flex: 1 }}>
                    <YourMainContent />
                    <CopilotSidebar defaultOpen={true} />
                  </main>
                </div>
              </CopilotChatConfigurationProvider>
            ) : variant === "own-button" ? (
              /* [9] threads-drawer: own New-conversation button (verbatim body) */
              /* [!code highlight] */
              <CopilotChatConfigurationProvider>
                <div style={{ display: "flex", height: "100dvh" }}>
                  <CopilotThreadsDrawer />
                  <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <header>
                      <NewConversationButton />
                    </header>
                    <CopilotChat />
                  </main>
                </div>
              </CopilotChatConfigurationProvider>
            ) : variant === "controlled" ? (
              <ControlledChat />
            ) : (
              /* [1] threads-drawer: shared chat configuration */
              /* [!code highlight] */
              <CopilotChatConfigurationProvider agentId={AGENT_ID}>
                {variant === "hide-parts" && <style>{HIDE_NEW_THREAD_CSS}</style>}
                <div className="flex h-full">
                  {variant === "customized" ? (
                    /*
                      [3] threads-drawer: renderRow, pagination, and labels

                      The doc's slot="header" escape hatch is omitted: in
                      1.84.1 `CopilotThreadsDrawerProps` still declares no
                      `children`. See the note on this route's page.
                    */
                    /* [!code highlight] */
                    <CopilotThreadsDrawer
                      label="Test conversations"
                      recentLabel="Recent"
                      renderRow={renderRow}
                      limit={5}
                    />
                  ) : (
                    /* [2] threads-drawer: drop-in drawer, zero props */
                    /* [!code highlight] */
                    <CopilotThreadsDrawer />
                  )}

                  <div className="min-w-0 flex-1">
                    {/* [4] threads-drawer: the chat the drawer drives */}
                    {/* [!code highlight] */}
                    <CopilotChat />
                  </div>
                </div>
              </CopilotChatConfigurationProvider>
            )}
          </div>
        </div>
      </ThreadsProvider>
    </DemoFrame>
  );
}
