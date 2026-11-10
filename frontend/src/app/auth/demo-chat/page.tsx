import { DemoFrame } from "@/components/demo-frame";

import { AuthDemoChat } from "./auth-demo-chat";

/**
 * Server component: whether the provider forwards a token is a build-time
 * environment question, and the chat itself lives in a client child.
 */
export default function Page() {
  const tokenConfigured = Boolean(process.env.NEXT_PUBLIC_AUTH_BEARER_TOKEN);

  return (
    <DemoFrame
      parentPath="/auth"
      subtitle={
        tokenConfigured
          ? "bearer token forwarded — not validated"
          : "no token forwarded"
      }
    >
      <AuthDemoChat tokenConfigured={tokenConfigured} />
    </DemoFrame>
  );
}
