"use client";

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";
import { shopUI } from "./catalog";
import { appUI } from "./combine";
import { ExportView } from "./export-view";

/**
 * Catalogs: one variant per catalog the page builds. Each mounts the
 * provider with `generativeUI={{ ui }}` exactly as the page's provider line
 * does, pointed at /api/copilotkit-genui (harness-authored runtime
 * route around the doc's "Runtime, after" line).
 */
export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/catalogs" subtitle="createGenerativeUI">
      <GenUIDemo
        variants={[
          {
            id: "shop",
            label: "shopUI (Create a catalog)",
            note: "Only ProductGrid and ProductCard exist in this catalog — no standard components.",
            generativeUI: { ui: shopUI },
            welcome: "Try: show me three running shoes as product cards.",
          },
          {
            id: "combined",
            label: "appUI (Combine catalogs)",
            note: "standardUI + cartUI (harness-authored) + Hero, merged with extends.",
            generativeUI: { ui: appUI },
            welcome: "Try: show a hero titled 'Spring sale' and a cart badge with 3 items.",
          },
          {
            id: "export",
            label: "exportA2UICatalog",
            noChat: true,
            page: <ExportView />,
          },
        ]}
      />
    </DemoFrame>
  );
}
