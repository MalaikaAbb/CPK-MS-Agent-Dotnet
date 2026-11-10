"use client";

import Link from "next/link";

import { DemoFrame } from "@/components/demo-frame";

import OpenGenUiAdvancedDemo from "../../_demo-source/open-gen-ui-advanced/page";

/**
 * The page's advanced demo (../../_demo-source/open-gen-ui-advanced, all
 * three files unedited). Sandbox functions go on the provider's
 * `openGenerativeUI` prop; same /api/copilotkit-ogui runtime as the minimal one.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/open-generative-ui"
      subtitle="Advanced · agent: open-gen-ui-advanced"
    >
      <div className="flex h-full flex-col">
        <p className="shrink-0 border-b border-slate-200 px-4 py-1.5 text-xs text-slate-500 dark:border-slate-800">
          Sandbox functions: evaluateExpression, notifyHost.{" "}
          <Link
            href="/generative-ui/open-generative-ui/demo-chat"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            ← Back to the minimal demo
          </Link>
        </p>
        <div className="min-h-0 flex-1 overflow-auto">
          <OpenGenUiAdvancedDemo />
        </div>
      </div>
    </DemoFrame>
  );
}
