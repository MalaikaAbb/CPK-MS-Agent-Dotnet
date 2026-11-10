"use client";

import {
  CopilotChat,
  messageGroup,
  messageRow,
  type Message,
  type MessageGroupWrapperProps,
  type MessageRow,
} from "@copilotkit/react-core/v2";
import { useCallback, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

type Level =
  | "classes"
  | "props"
  | "component"
  | "reshaping"
  | "grouping"
  | "labels";

const LEVELS: { id: Level; label: string; blurb: string }[] = [
  {
    id: "classes",
    label: "1 · Tailwind classes",
    blurb: "A class string merges with the slot's own classes. Nothing is replaced.",
  },
  {
    id: "props",
    label: "2 · Props override",
    blurb: "An object sets props on the default component — className, autoFocus.",
  },
  {
    id: "component",
    label: "3 · Custom component",
    blurb: "Your own component replaces a slot, plus a custom layout.",
  },
  {
    id: "reshaping",
    label: "4 · Reshaping the message list",
    blurb: "transformMessages hides tool-result messages before they render.",
  },
  {
    id: "grouping",
    label: "5 · Grouping into one row",
    blurb: "groupMessages folds consecutive tool steps into one collapsible row.",
  },
  {
    id: "labels",
    label: "Labels",
    blurb: "The labels prop changes UI strings without touching any slot.",
  },
];

// [4] slots: grouping wrapper (verbatim from the doc)
// Define wrappers at module level. One created inside groupMessages is a new
// component on every call, so React would remount it each time.
function ToolActivity({
  messages,
  children,
  state,
  setState,
}: MessageGroupWrapperProps<boolean>) {
  const open = state ?? false;
  return (
    <div className="rounded-lg border">
      <button onClick={() => setState(!open)}>
        {messages.length} tool steps {open ? "▾" : "▸"}
      </button>
      {open && children}
    </div>
  );
}

// An assistant message that also carries text stays on its own row, so the
// text (or a card waiting on the user) is never folded into a closed group.
const isToolStep = (m: Message) =>
  m.role === "tool" ||
  (m.role === "assistant" && !!m.toolCalls?.length && !m.content);

/**
 * The doc's custom slot component, byte-for-byte as published — untyped
 * destructuring and all. It does not type-check, and the two suppressions
 * below are the only thing keeping `next build` green; the code itself is
 * untouched.
 *
 * Two separate complaints from `tsc`:
 *
 *   1. `messages`, `isRunning` and `msg` are implicit `any`. The doc writes
 *      `({ messages, isRunning })` with no annotation, which is an error under
 *      the `strict` that `create-next-app` turns on by default.
 *
 *   2. A plain function is not assignable to
 *      `SlotValue<typeof CopilotChatMessageView>`, which requires a static
 *      `Cursor` property. The doc's `<CopilotChat messageView={CustomMessageView} />`
 *      cannot satisfy that as written.
 *
 * Both are reported in the README's discrepancy table. Neither was "fixed"
 * here: annotating the parameters would change the sample, and the whole point
 * of this route is to run what the page publishes.
 *
 * It works at runtime — only the compiler objects.
 */
// @ts-expect-error -- doc sample: implicit any on the destructured props.
const CustomMessageView = ({ messages, isRunning}) => (
  <div className="space-y-4 p-6">
    {/* @ts-expect-error -- doc sample: implicit any on the map parameter. */}
    {messages?.map((msg) => (
      <div
        key={msg.id}
        className={msg.role === "user" ? "text-right" : "text-left"}
      >
        {msg.content}
      </div>
    ))}
    {isRunning && <div className="animate-pulse">Thinking...</div>}
  </div>
);

export default function Page() {
  const [level, setLevel] = useState<Level>("classes");
  const active = LEVELS.find((l) => l.id === level)!;

  // [5] slots: transformMessages (verbatim from the doc's Chat())
  const transformMessages = useCallback(
    (messages: Message[]) => messages.filter((m) => m.role !== "tool"),
    [],
  );

  // [6] slots: groupMessages (verbatim from the doc's Chat())
  const groupMessages = useCallback((messages: Message[]): MessageRow[] => {
    const rows: MessageRow[] = [];
    let run: Message[] = [];
    const flush = () => {
      if (run.length > 0) {
        rows.push(
          messageGroup({ key: run[0].id, messages: run, wrapper: ToolActivity }),
        );
      }
      run = [];
    };
    for (const message of messages) {
      if (isToolStep(message)) run.push(message);
      else {
        flush();
        rows.push(messageRow(message));
      }
    }
    flush();
    return rows;
  }, []);

  return (
    <DemoFrame parentPath="/custom-look-and-feel/slots" subtitle={active.blurb}>
       <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLevel(l.id)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                level === l.id
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1">
          {/* [1] slots: class overrides */}
          {/* [!code highlight] */}
          {level === "classes" && (
            <CopilotChat
              agentId="my_agent"
              key="classes"
              messageView="bg-gray-50 dark:bg-gray-900 p-4"
              input="border-2 border-blue-400 rounded-xl"
              labels={{
                welcomeMessageText:
                  "Slot level 1 — classes merged into messageView and input.",
              }}
            />
          )}

          {/* [2] slots: prop overrides */}
          {/* [!code highlight] */}
          {level === "props" && (
            <CopilotChat
              agentId="my_agent"
              key="props"
              messageView={{
                className: "my-custom-messages",
                // @ts-expect-error -- doc sample: "data-testid" is not a known
                // prop of the messageView slot type in 1.84.1 (TS2353).
                "data-testid": "message-view",
              }}
              input={{ autoFocus: true }}
              labels={{
                welcomeMessageText:
                  "Slot level 2 — the input is focused automatically via a prop override.",
              }}
            />
          )}

          {/* [3] slots: custom component */}
          {/* [!code highlight] */}
          {level === "component" && (
            <CopilotChat
              agentId="my_agent"
              key="component"
              // @ts-expect-error -- doc sample: a bare function has no static
              // `Cursor`, which `SlotValue<typeof CopilotChatMessageView>` requires.
              messageView={CustomMessageView}
              labels={{
                welcomeMessageText:
                  "Slot level 3 — the streaming cursor and the whole layout are ours.",
              }}
            >
              
            </CopilotChat>
          )}

          {/* [7] slots: reshaping the message list */}
          {/* [!code highlight] */}
          {level === "reshaping" && (
            <CopilotChat
              agentId="my_agent"
              key="reshaping"
              messageView={{ transformMessages }}
            />
          )}

          {/* [8] slots: grouping messages into one row */}
          {/* [!code highlight] */}
          {level === "grouping" && (
            <CopilotChat
              agentId="my_agent"
              key="grouping"
              messageView={{ groupMessages }}
            />
          )}

          {/* [9] slots: labels */}
          {/* [!code highlight] */}
          {level === "labels" && (
            <CopilotChat
              agentId="my_agent"
              key="labels"
              labels={{
                chatInputPlaceholder: "Ask your agent anything...",
                welcomeMessageText: "How can I help you today?",
                chatDisclaimerText: "AI responses may be inaccurate.",
              }}
            />
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
