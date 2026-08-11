import { createPageMetadata } from "@/app/_metadata";
import { ComingSoonPage } from "@/components/ui/ComingSoonPage";
import {
  getCanonicalCaravanOverview,
  getCanonicalStoneRoadPageData,
} from "@/content/caravan/page-data";

export const metadata = createPageMetadata("/register-interest");

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

interface PageProps {
  searchParams: SearchParams;
}

interface SelectedRun {
  join: string;
  leave: string;
  days: number;
  sections: string;
  label: string;
  includedExitFlight?: boolean;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function availableRuns(): readonly SelectedRun[] {
  const overview = getCanonicalCaravanOverview();
  const runs = overview.sections.flatMap((firstSection, startIndex) =>
    overview.sections.slice(startIndex).map((lastSection, offset) => {
      const selectedSections = overview.sections.slice(
        startIndex,
        startIndex + offset + 1,
      );
      return {
        join: firstSection.gateFrom.name,
        leave: lastSection.gateTo.name,
        days: selectedSections.reduce(
          (total, item) =>
            total + item.section.day_end - item.section.day_start + 1,
          0,
        ),
        sections: selectedSections
          .map((item) => item.section.section_id)
          .join("-"),
        label: selectedSections.map((item) => item.section.name).join(" + "),
        includedExitFlight: lastSection.section.section_id === "04",
      };
    }),
  );
  const stoneRoad = getCanonicalStoneRoadPageData();

  return [
    ...runs,
    {
      join: stoneRoad.gateFrom.name,
      leave: stoneRoad.gateTo.name,
      days: stoneRoad.product.day_end - stoneRoad.product.day_start + 1,
      sections: "stone-road",
      label: stoneRoad.product.name,
    },
  ];
}

function selectedRun(
  params: Record<string, string | string[] | undefined>,
): SelectedRun | undefined {
  const join = firstValue(params.join);
  const leave = firstValue(params.leave);
  const days = Number(firstValue(params.days));
  const sections = firstValue(params.sections);

  return availableRuns().find(
    (run) =>
      run.join === join &&
      run.leave === leave &&
      run.days === days &&
      run.sections === sections,
  );
}

// The announcement banner says the Andean Caravan is "open for interest," so
// registering interest is an available action, not a future one. This page used
// to say "Registration is coming soon," which flatly contradicted the banner
// that led the visitor here. It now presents the email capture as the open
// action. Delivery is still a mailto until the Resend adapter is switched on;
// that is honest — it opens the visitor's own email and stores nothing.
export default async function RegisterInterestPage({ searchParams }: PageProps) {
  const run = selectedRun(await searchParams);
  const runSummary = run
    ? `${run.join} → ${run.leave} · ${run.days} Caravan days · ${run.label}${
        run.includedExitFlight
          ? " · included exit flight from Balmaceda to Santiago"
          : ""
      }`
    : null;

  return (
    <ComingSoonPage
      label="Open for interest"
      title="Register your interest"
      lede={runSummary
        ? `Your selected run is ${runSummary}. Leave your email and we will reply when dates, joining points and membership open. No account, no payment, nothing to commit.`
        : "The Andean Caravan is open for interest. Leave your email and we will write to you first — when dates, joining points and membership open. No account, no payment, nothing to commit."}
      notifyIntro={runSummary
        ? "Your route choice will be included in the email. Add your address and send it from your email app."
        : "Leave your email and we will write to you first."}
      submitLabel="Register your interest"
      mailSubject={run
        ? `Register my interest: ${run.join} to ${run.leave}`
        : "Register my interest in the Andean Caravan"}
      mailBody={runSummary
        ? `Selected Andean Caravan run:\n${runSummary}\n\nPlease add any questions here.`
        : undefined}
    />
  );
}
