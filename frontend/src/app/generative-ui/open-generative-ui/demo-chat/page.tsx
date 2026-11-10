"use client";

import Link from "next/link";

import { DemoFrame } from "@/components/demo-frame";

import OpenGenUiDemo from "../_demo-source/open-gen-ui/page";

/**
 * The page's minimal demo (../_demo-source/open-gen-ui/page.tsx, unedited).
 * Its imports ./chat and ./design-skill are not published; both are
 * labelled harness stand-ins. It brings its own <CopilotKit> against the
 * verbatim /api/copilotkit-ogui route.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/open-generative-ui"
      subtitle="Minimal · agent: open-gen-ui"
    >
      <div className="flex h-full flex-col">
        <p className="shrink-0 border-b border-slate-200 px-4 py-1.5 text-xs text-slate-500 dark:border-slate-800">
          Minimal setup.{" "}
          <Link
            href="/generative-ui/open-generative-ui/demo-chat/advanced"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Switch to the advanced demo (sandbox functions) →
          </Link>
        </p>
        <div className="min-h-0 flex-1 overflow-auto">
          <OpenGenUiDemo />
        </div>
      </div>
    </DemoFrame>
  );
}
