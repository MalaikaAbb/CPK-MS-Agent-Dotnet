// docs.copilotkit.ai/ms-agent-dotnet/human-in-the-loop/useInterrupt
// "Approve / Cancel example", verbatim. The page prints no import line; the
// `useInterrupt` import and the `export` keyword are the only additions.
import { useInterrupt } from "@copilotkit/react-core/v2";

export function ApprovalInterrupt() {
  useInterrupt({
    render: ({ interrupt, resolve, cancel }) => (
      <div className="p-3 border rounded">
        <p>{interrupt?.message ?? "Approve this action?"}</p>
        <div className="mt-2 flex gap-2">
          <button onClick={() => resolve({ approved: true })}>Approve</button>
          <button onClick={() => cancel()}>Cancel</button>
        </div>
      </div>
    ),
  });
  return null;
}
