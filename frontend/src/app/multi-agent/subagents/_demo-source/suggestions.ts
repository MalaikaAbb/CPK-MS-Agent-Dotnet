"use client";

// HARNESS-AUTHORED: the Sub-Agents Code tab imports this file but does not ship it.
// Minimal stand-in so the published page.tsx compiles; not doc code.

import { useConfigureSuggestions } from "@copilotkit/react-core/v2";

export function useSubagentsSuggestions() {
  useConfigureSuggestions({
    suggestions: [
      {
        title: "Write a blog post",
        message:
          "Produce a short blog post about the benefits of cold exposure training. Research first, then write, then critique.",
      },
      {
        title: "Explain a topic",
        message:
          "Explain how large language models handle tool calling. Research, write a paragraph, then critique.",
      },
      {
        title: "Summarize a topic",
        message:
          "Summarize the current state of reusable rockets in 1 polished paragraph, with research and critique.",
      },
    ],
    available: "always",
  });
}
