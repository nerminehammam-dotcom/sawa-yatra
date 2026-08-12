"use client";

import { useRouter } from "next/navigation";

import { TravelSelfQuestionnaire } from "../TravelSelfQuestionnaire";

export function TakeTravelSelfQuestionnaire() {
  const router = useRouter();

  return (
    <TravelSelfQuestionnaire onExit={() => router.replace("/travel-self")} />
  );
}
