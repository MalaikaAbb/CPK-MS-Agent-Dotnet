// docs.copilotkit.ai/ms-agent-dotnet/human-in-the-loop/interrupt-flow
// "Render the approval with useInterrupt" — the page's page.tsx, verbatim.
// The file is renamed (the page calls it page.tsx) because it exports a
// component, not a route. Nothing below is edited.

// [1] interrupt flow: approval panel
// [!code highlight]
import { useInterrupt } from "@copilotkit/react-core/v2";

export function ApprovalPanel() {
  // renderInChat: false makes useInterrupt return the element, so render it yourself.
  const approval = useInterrupt({
    renderInChat: false,
    render: ({ interrupt, resolve, cancel }) => {
      if (!interrupt) return <></>;
      return (
        <div>
          <p>{interrupt.message}</p>
          <button onClick={() => resolve({ approved: true })}>Approve</button>
          <button onClick={() => cancel()}>Deny</button>
        </div>
      );
    },
  });

  return <div>{approval}</div>;
}
