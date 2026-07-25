"use client";

import { Button } from "@/components/ui/Button";

export function FindGateButton() {
  function focusSelector() {
    const selector = document.getElementById("find-my-gate");
    selector?.scrollIntoView({ behavior: "smooth", block: "start" });
    selector?.focus({ preventScroll: true });
  }

  return <Button onClick={focusSelector}>Find my gate</Button>;
}

export function JourneyDrawerButton({ children }: { children: string }) {
  return (
    <Button
      onClick={(event) => window.dispatchEvent(new CustomEvent("sawayatra:open-journey", {
        detail: { trigger: event.currentTarget },
      }))}
    >
      {children}
    </Button>
  );
}
