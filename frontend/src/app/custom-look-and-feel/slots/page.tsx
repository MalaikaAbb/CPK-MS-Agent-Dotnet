import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Panel, TryIt } from "@/components/ui";

const ROOT_SLOTS: [string, string][] = [
  ["messageView", "The message list container."],
  ["scrollView", "The scroll container with auto-scroll behaviour."],
  ["input", "The text input area with send/transcribe controls."],
  ["suggestionView", "The suggestion pills shown below messages."],
  ["welcomeScreen", "The empty-state screen. Pass false to disable."],
  ["header / toggleButton", "Sidebar and Popup only."],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/slots" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Every chat component is assembled from named sub-components — slots —
          each overridable at one of three levels: a Tailwind class string merged
          into the default, an object of props set on the default, or your own
          component replacing it. Slots nest, so{" "}
          <code>messageView.assistantMessage.copyButton</code> is a valid path.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Root slot</th>
                <th className="pb-2 font-medium">What it is</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ROOT_SLOTS.map(([slot, desc]) => (
                <tr key={slot}>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-800 dark:text-slate-100">
                    {slot}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <TryIt
            prompts={["Hello there", "What's the weather in Paris?"]}
            expect="Level 1 gives the message area a grey background and the input a blue border. Level 2 focuses the input on mount and puts data-testid='message-view' on the list. Level 3 shows a custom layout. On tab 4, ask about the weather: no tool-result message appears as its own row. On tab 5, the same prompt folds the tool steps into one 'N tool steps ▸' row that expands on click. The Labels tab shows the custom placeholder and disclaimer."
            fail="The chat looks identical across tabs — the slot props are not reaching the component. On tab 5, tool steps render as separate rows."
          />
        </div>
      </Panel>

      <Panel title="What is not implemented, and why">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page&apos;s nested-slot samples (two and three levels deep, and
          the input, scrollView and suggestionView sub-slots) and its children
          render function pass components the page never defines:{" "}
          <code>CustomToolbar</code>, <code>CustomCopyButton</code>,{" "}
          <code>CustomUserMessage</code>, <code>CustomTextArea</code>,{" "}
          <code>CustomSendButton</code>, <code>CustomFeather</code>,{" "}
          <code>CustomScrollButton</code>, <code>CustomSuggestionPill</code>{" "}
          and <code>CustomSuggestionContainer</code>. They are not written
          here, so those samples have no tab.
        </p>
      </Panel>


      <Panel title="Source">
        <SourceCode file="frontend/src/app/custom-look-and-feel/slots/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
