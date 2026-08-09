import {
  CONTENT_STATUSES,
  CONTENT_VISIBILITIES,
  PUBLIC_CONTENT_VISIBILITIES,
  type CaravanRouteModel,
  type ContentRecord,
} from "./types";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function collectContentRecords(
  value: unknown,
  path = "model",
  found: Array<{ path: string; record: ContentRecord }> = [],
) {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectContentRecords(item, `${path}[${index}]`, found),
    );
    return found;
  }

  if (!isObject(value)) return found;

  if ("content_visibility" in value) {
    found.push({ path, record: value as unknown as ContentRecord });
  }

  for (const [key, child] of Object.entries(value)) {
    collectContentRecords(child, `${path}.${key}`, found);
  }
  return found;
}

export function validateCaravanModel(
  model: CaravanRouteModel,
  today = new Date(),
): readonly string[] {
  const errors: string[] = [];
  const fail = (message: string) => errors.push(message);

  if (model.days.length !== 71) {
    fail(`T07: expected 71 atomic day records; found ${model.days.length}`);
  }

  model.days.forEach((day, index) => {
    const expected = index + 1;
    if (day.day !== expected) {
      fail(`T07: expected day ${expected} at index ${index}; found ${day.day}`);
    }
  });

  const sectionLengths = model.sections.map(
    (section) => section.day_end - section.day_start + 1,
  );
  if (sectionLengths.join(",") !== "23,16,18,14") {
    fail(`T08: section lengths must be 23,16,18,14; found ${sectionLengths}`);
  }
  if (sectionLengths.reduce((sum, length) => sum + length, 0) !== 71) {
    fail("T08: section ranges do not tile the 71-day route");
  }

  const stageDays = model.stages.flatMap((stage) =>
    Array.from(
      { length: stage.day_end - stage.day_start + 1 },
      (_, index) => stage.day_start + index,
    ),
  );
  if (
    stageDays.length !== 71 ||
    stageDays.some((day, index) => day !== index + 1)
  ) {
    fail("T07/T13: stage ranges must tile Days 1–71 in order without overlap");
  }

  const productStages = model.stages.filter((stage) => stage.product_behaviour);
  if (
    productStages.length !== 1 ||
    productStages[0]?.id !== "01-c" ||
    productStages[0]?.name !== "The Stone Road"
  ) {
    fail("T13: Section 01 Stage C must be the only stage with product behaviour");
  }

  const sectionNames = new Set(model.sections.map((section) => section.name));
  for (const stage of model.stages) {
    if (sectionNames.has(stage.name) && stage.id !== "01-c") {
      fail(`T12: ${stage.name} appears as both a section and stage name`);
    }
  }

  const sectionOne = model.sections.find((section) => section.section_id === "01");
  const shortForm = sectionOne?.short_form_exception;
  if (
    shortForm?.canonical_for !== "/caravans/andean/sea-to-stone" ||
    shortForm.canonical_document_has_fragment
  ) {
    fail("T10/T11: Section 01 must own Days 16–23 with a fragment-free canonical document URL");
  }

  const caravanGates = model.gates.filter(
    (gate) => gate.gate_class === "caravan_gate",
  );
  if (caravanGates.length !== 5) {
    fail(`T14: expected five Caravan gates; found ${caravanGates.length}`);
  }
  const cusco = model.gates.find((gate) => gate.id === "cusco");
  if (cusco?.gate_class !== "short_form_joining_gate") {
    fail("T15: Cusco must be the short-form joining gate");
  }
  if (model.sections.some((section) => section.gate_to === "cusco")) {
    fail("T16: Cusco may never be a leaving gate");
  }

  if (model.group_max !== 12 || model.sections.some((section) => section.group_max !== 12)) {
    fail("T19: every group maximum must be 12");
  }
  if (
    model.scheduled_flight_movements_total !== 5 ||
    model.scheduled_flight_movements_in_route !== 4
  ) {
    fail("T20/T21: flight totals must be five included, four in route geometry");
  }
  if (!model.included_exit_movement.outside_route_geometry) {
    fail("T22: Balmaceda → Santiago must remain outside route geometry");
  }

  const s02 = model.sections.find((section) => section.section_id === "02");
  if (s02?.subline !== "Titicaca, La Paz and the cloud forest") {
    fail("T38: Section 02 subline does not match the approved fixed phrase");
  }
  if (s02?.pre_section_progression?.nights !== 3) {
    fail("T28: Section 02 must carry the required three-night Cusco progression");
  }

  const s03 = model.sections.find((section) => section.section_id === "03");
  if (s03?.acclimatisation_ladder.length !== 11) {
    fail("T33: Section 03 acclimatisation ladder must contain eleven nights");
  }
  if (
    s03?.declared_load_exception?.day_start !== 49 ||
    s03.declared_load_exception.day_end !== 53 ||
    s03.declared_load_exception.consecutive_demanding_days !== 5 ||
    s03.declared_load_exception.refuge_nights !== 3
  ) {
    fail("T24/T33: Section 03 Declared Load Exception is incomplete");
  }

  for (const stage of model.stages) {
    if (!stage.makers_encounter.strategy) {
      fail(`T30: ${stage.id} has no makers_encounter strategy`);
    }
    if (
      stage.makers_encounter.status === "secured" &&
      (stage.makers_encounter.strategy !== "contracted_encounter" ||
        !stage.makers_encounter.permission_recorded ||
        !stage.makers_encounter.payment_recorded ||
        !stage.makers_encounter.credit_recorded)
    ) {
      fail(`T30/T31: ${stage.id} is secured without complete maker evidence`);
    }
    if (!stage.laundry_availability.availability) {
      fail(`T32: ${stage.id} has no laundry_availability`);
    }
  }
  for (const section of model.sections) {
    if (!section.makers_encounter.strategy) {
      fail(`T31: Section ${section.section_id} has no makers strategy`);
    }
  }

  const contentRecords = collectContentRecords(model);
  const datedEvidence = new Set(
    model.evidence
      .filter((record) => record.date_accessed !== null)
      .map((record) => record.source_id),
  );
  for (const { path, record } of contentRecords) {
    if (!CONTENT_VISIBILITIES.includes(record.content_visibility)) {
      fail(`T01: ${path} has an invalid or null content_visibility`);
    }
    if (!CONTENT_STATUSES.includes(record.status)) {
      fail(`${path} has an invalid status`);
    }
    if (!record.source_ids?.length) {
      fail(`${path} has no source_ids`);
    }
    if (
      record.status === "secured" &&
      !record.source_ids.some((sourceId) =>
        datedEvidence.has(sourceId.split(":")[0] ?? sourceId),
      )
    ) {
      fail(`${path} is secured without dated evidence`);
    }
    if (
      record.status === "secured" &&
      record.recheck_date !== null &&
      new Date(`${record.recheck_date}T23:59:59Z`).getTime() < today.getTime()
    ) {
      fail(`T29: ${path} is secured beyond recheck_date ${record.recheck_date}`);
    }
  }

  for (const { path, record } of contentRecords) {
    if (
      "text" in (record as unknown as Record<string, unknown>) &&
      !(record as unknown as Record<string, unknown>).copy_class
    ) {
      fail(`${path} is a text slot without copy_class`);
    }
  }

  for (const section of model.sections) {
    for (const item of section.conditional_items) {
      if (!item.controller || !item.fallback || !item.notice_point || !item.remedy) {
        fail(`Section ${section.section_id} conditional item ${item.id} is incomplete`);
      }
    }
  }

  if (PUBLIC_CONTENT_VISIBILITIES.join("|") !== "public|pre_sale_disclosure") {
    fail("T02: public projection allowlist has changed");
  }

  return errors;
}

export function assertValidCaravanModel(
  model: CaravanRouteModel,
  today = new Date(),
): void {
  const errors = validateCaravanModel(model, today);
  if (errors.length > 0) {
    throw new Error(`Invalid Caravan model:\n${errors.join("\n")}`);
  }
}
