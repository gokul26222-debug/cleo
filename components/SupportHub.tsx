"use client";

import HelpAssistant from "./HelpAssistant";
import HelpDrawer from "./HelpDrawer";
import ContextualHelp from "./ContextualHelp";

export default function SupportHub() {
  return (
    <>
      {/* Layer 1: Contextual Help Cards (on specific pages) */}
      <div className="pt-4 px-4 max-w-lg mx-auto">
        <ContextualHelp />
      </div>

      {/* Layer 2: Floating Help Button & Mini Panel */}
      <HelpAssistant />

      {/* Layer 3: Help Drawer */}
      <HelpDrawer />

      {/* Layer 4: Full Help Hub (accessed via /help route) */}
      {/* Rendered by app/help/page.tsx */}
    </>
  );
}
