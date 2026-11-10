"use client";

import { DemoFrame } from "@/components/demo-frame";

import SubagentsDemo from "../_demo-source/page";

/**
 * Mounts the page's demo Code tab (../_demo-source). page.tsx and
 * delegation-log.tsx are verbatim; the other four files are harness-authored
 * stand-ins for imports the tab does not ship.
 *
 * Backend /subagents is a harness stand-in (the Quickstart agent): the
 * page's SubagentsAgent.cs does not compile, so chat answers but no
 * sub-agents run and the delegation log stays empty.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/multi-agent/subagents"
      subtitle="agent: subagents → backend /subagents (stand-in, no sub-agents)"
    >
      <SubagentsDemo />
    </DemoFrame>
  );
}
